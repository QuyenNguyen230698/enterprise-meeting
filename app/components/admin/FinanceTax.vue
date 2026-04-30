<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <div
      class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden"
    >
      <div
        class="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center"
      >
        <div>
          <h3 class="font-bold text-gray-900">Nghĩa Vụ & Kê Khai Thuế</h3>
          <p class="text-sm text-gray-500 mt-0.5">
            Theo dõi hồ sơ và thời hạn kê khai thuế
          </p>
        </div>
        <button
          @click="showAddModal = true"
          class="text-xs bg-gray-900 text-white hover:bg-gray-800 px-3 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
        >
          <i class="bi bi-plus-lg"></i> Thêm Nghĩa Vụ
        </button>
      </div>

      <div class="divide-y divide-gray-100">
        <div
          v-if="!complianceTasks || complianceTasks.length === 0"
          class="p-12 text-center text-gray-400"
        >
          <i class="bi bi-inbox text-4xl mb-3 block"></i>
          <p>Chưa có dữ liệu nghĩa vụ thuế</p>
        </div>

        <div
          v-for="(task, idx) in complianceTasks"
          :key="task._id || idx"
          class="group transition-all hover:bg-gray-50/50"
        >
          <div
            class="p-6 md:p-8 flex items-start gap-6 cursor-pointer"
            @click="toggleExpand(task._id || idx)"
          >
            <!-- Checkbox -->
            <div
              class="flex-shrink-0 text-2xl transition-all duration-300"
              @click.stop="$emit('toggle-task', idx)"
              :class="
                task.done
                  ? 'text-green-500 scale-110'
                  : 'text-gray-200 hover:text-gray-400'
              "
            >
              <i
                :class="task.done ? 'bi bi-check-circle-fill' : 'bi bi-circle'"
              ></i>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1"
              >
                <h4
                  class="text-lg font-bold text-gray-900 truncate"
                  :class="{
                    'line-through text-gray-400 font-medium': task.done,
                  }"
                >
                  {{ task.title }}
                </h4>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    v-if="task.attachments?.length > 0"
                    class="text-xs font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100"
                  >
                    <i class="bi bi-paperclip"></i>
                    {{ task.attachments.length }}
                  </span>
                  <span
                    class="text-xs font-bold px-2 py-1 rounded border uppercase tracking-wide"
                    :class="
                      task.done
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-orange-50 text-orange-700 border-orange-100'
                    "
                  >
                    {{
                      task.done
                        ? "Đã hoàn thành"
                        : "Hạn: " + (task.deadline || "Chưa đặt")
                    }}
                  </span>
                </div>
              </div>
              <p
                class="text-sm text-gray-500 line-clamp-1 group-hover:line-clamp-none transition-all"
              >
                {{ task.description || task.desc }}
              </p>
            </div>

            <!-- Action Arrow -->
            <div
              class="shrink-0 text-gray-300 transition-transform duration-300"
              :class="{ 'rotate-180': expandedId === (task._id || idx) }"
            >
              <i class="bi bi-chevron-down"></i>
            </div>
          </div>

          <!-- Expanded Content -->
          <div
            v-if="expandedId === (task._id || idx)"
            class="px-8 pb-8 pt-0 animate-fade-in border-t border-gray-50 bg-gray-50/30"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <!-- Attachments Section -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h5
                    class="text-xs font-bold text-gray-500 uppercase tracking-widest"
                  >
                    Tài Liệu Đính Kèm
                  </h5>
                  <label
                    class="text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 transition-colors"
                  >
                    <i class="bi bi-upload"></i> Tải Lên
                    <input
                      type="file"
                      class="hidden"
                      @change="(e) => handleFileUpload(e, task._id)"
                    />
                  </label>
                </div>

                <div class="space-y-2">
                  <div
                    v-if="!task.attachments || task.attachments.length === 0"
                    class="text-xs text-gray-400 italic py-2"
                  >
                    Chưa có tài liệu đính kèm
                  </div>
                  <div
                    v-for="file in task.attachments"
                    :key="file._id"
                    class="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 shadow-xs group/file"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div
                        class="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 shrink-0"
                      >
                        <i :class="getFileIcon(file.type)"></i>
                      </div>
                      <div class="min-w-0">
                        <div
                          class="text-xs font-bold text-gray-700 truncate max-w-[180px]"
                        >
                          {{ file.name }}
                        </div>
                        <div class="text-xs text-gray-400">
                          {{ formatSize(file.size) }}
                        </div>
                      </div>
                    </div>
                    <div
                      class="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-opacity"
                    >
                      <a
                        :href="file.url"
                        target="_blank"
                        class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500"
                        title="Xem/Tải xuống"
                        ><i class="bi bi-download"></i
                      ></a>
                      <button
                        @click="
                          $emit('remove-doc', {
                            taskId: task._id,
                            attachmentId: file._id,
                          })
                        "
                        class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500"
                        title="Xóa"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notes & Meta -->
              <div class="space-y-4">
                <div>
                  <h5
                    class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2"
                  >
                    Ghi Chú Chi Tiết
                  </h5>
                  <div
                    class="text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-200 min-h-[100px] leading-relaxed"
                  >
                    {{
                      task.notes || "Không có ghi chú thêm cho nhiệm vụ này."
                    }}
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button
                    v-if="!task.isSystem"
                    @click="$emit('remove-task', task._id)"
                    class="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Xóa Nhiệm Vụ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-4 bg-gray-50/50 border-t border-gray-100 text-xs text-center text-gray-400"
      >
        * Các đầu việc được đánh dấu
        <span class="bg-gray-100 px-1 rounded mx-0.5">Mặc định</span> là theo
        quy định hiện hành của Tổng Cục Thuế
      </div>
    </div>

    <!-- Add Task Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-999999 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm"
        @click="showAddModal = false"
      ></div>
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up border border-gray-200 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center"
        >
          <h3 class="font-bold text-gray-900">Thêm Nghĩa Vụ Thuế</h3>
          <button
            @click="showAddModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label
              class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
              >Tiêu Đề <span class="text-red-500">*</span></label
            >
            <input
              v-model="newTask.title"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-gray-900 outline-none transition-all placeholder:text-gray-300 font-bold"
              placeholder="VD: Nộp thuế môn bài 2024"
            />
          </div>
          <div>
            <label
              class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
              >Mô Tả</label
            >
            <textarea
              v-model="newTask.description"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-gray-900 outline-none transition-all resize-none"
              rows="2"
              placeholder="Chi tiết về nghĩa vụ này..."
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                >Hạn Nộp</label
              >
              <input
                v-model="newTask.deadline"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-gray-900 outline-none transition-all"
                placeholder="VD: 31/01/2024"
              />
            </div>
            <div>
              <label
                class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
                >Trạng Thái</label
              >
              <select
                v-model="newTask.done"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-gray-900 outline-none bg-white"
              >
                <option :value="false">Chưa hoàn thành</option>
                <option :value="true">Đã xong</option>
              </select>
            </div>
          </div>
          <div>
            <label
              class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5"
              >Ghi Chú Thêm</label
            >
            <textarea
              v-model="newTask.notes"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-gray-900 outline-none transition-all resize-none font-sans"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div
          class="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50"
        >
          <button
            @click="showAddModal = false"
            class="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-lg"
          >
            Hủy
          </button>
          <button
            @click="submitAdd"
            class="px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-gray-800 transition-all"
          >
            Lưu Nghĩa Vụ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  complianceTasks: Array,
});

const emit = defineEmits([
  "toggle-task",
  "add-task",
  "remove-task",
  "upload-doc",
  "remove-doc",
]);

const expandedId = ref(null);
const showAddModal = ref(false);
const newTask = ref({
  title: "",
  description: "",
  deadline: "",
  done: false,
  notes: "",
});

const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const submitAdd = () => {
  if (!newTask.value.title) return alert("Vui lòng nhập tiêu đề");
  emit("add-task", { ...newTask.value });
  showAddModal.value = false;
  newTask.value = {
    title: "",
    description: "",
    deadline: "",
    done: false,
    notes: "",
  };
};

const handleFileUpload = (event, taskId) => {
  const file = event.target.files[0];
  if (!file) return;
  emit("upload-doc", { taskId, file });
  event.target.value = ""; // Reset
};

// Helpers
const getFileIcon = (type) => {
  if (type?.includes("pdf")) return "bi bi-file-earmark-pdf-fill text-red-500";
  if (type?.includes("word"))
    return "bi bi-file-earmark-word-fill text-blue-500";
  if (type?.includes("image"))
    return "bi bi-file-earmark-image-fill text-green-500";
  return "bi bi-file-earmark-fill text-gray-400";
};

const formatSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};
</script>
