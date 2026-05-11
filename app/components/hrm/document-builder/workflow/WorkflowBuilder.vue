<template>
  <div class="h-full overflow-y-auto px-4 sm:px-6 py-6">
    <div class="max-w-3xl mx-auto space-y-6">

      <!-- Title -->
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-base font-black text-gray-900">Bước 3 — Quy trình phê duyệt</h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Tối đa 7 bước. Kéo thả để sắp xếp. Chỉ admin có thể cấu hình.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="px-2.5 py-1 text-xs font-bold rounded-full"
            :class="store.template.workflowSteps.length >= 7 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'"
          >
            {{ store.template.workflowSteps.length }}/7 bước
          </span>
        </div>
      </div>

      <!-- Role notice for members -->
      <div v-if="auth.isMember" class="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3">
        <i class="bi bi-shield-lock text-amber-500 text-base mt-0.5"></i>
        <div>
          <p class="text-xs font-bold text-amber-800">Chỉ xem quy trình</p>
          <p class="text-xs text-amber-600 mt-0.5">Bạn có thể xem quy trình phê duyệt. Chỉ Admin mới có thể chỉnh sửa.</p>
        </div>
      </div>

      <!-- Steps timeline -->
      <div class="space-y-0">
        <div
          v-for="(step, idx) in store.template.workflowSteps"
          :key="step.id"
          class="relative"
          :draggable="auth.isAdmin"
          @dragstart="onDragStart(step.id)"
          @dragover.prevent="onDragOver(step.id)"
          @drop.prevent="onDrop(step.id)"
        >
          <!-- Connector line -->
          <div
            v-if="idx > 0"
            class="absolute -top-3 left-[18px] w-0.5 h-3 bg-gray-300"
          ></div>

          <div
            class="flex gap-3 p-4 bg-white rounded-2xl border-2 transition-all mb-3"
            :class="{
              'border-blue-400 shadow-md': expandedStep === step.id,
              'border-gray-200 hover:border-gray-300': expandedStep !== step.id,
              'border-dashed border-blue-300 opacity-60': dragOverId === step.id && dragId !== step.id,
            }"
          >
            <!-- Step number + drag handle -->
            <div class="flex flex-col items-center gap-1 shrink-0">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                :class="stepColorClass(step.actionType)"
              >{{ step.stepNumber }}</div>
              <i v-if="auth.isAdmin" class="bi bi-grip-vertical text-gray-300 text-sm cursor-grab"></i>
            </div>

            <!-- Step content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <!-- Step name (editable for admin) -->
                  <input
                    v-if="auth.isAdmin"
                    :value="step.name"
                    @input="store.updateWorkflowStep(step.id, { name: $event.target.value })"
                    class="text-sm font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                    placeholder="Tên bước phê duyệt..."
                  />
                  <p v-else class="text-sm font-bold text-gray-900">{{ step.name }}</p>

                  <!-- Meta -->
                  <div class="flex flex-wrap gap-2 mt-1.5">
                    <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      :class="actionBadgeClass(step.actionType)">
                      <i :class="actionIcon(step.actionType)" class="text-[10px]"></i>
                      {{ actionLabel(step.actionType) }}
                    </span>
                    <span class="text-[10px] text-gray-500 flex items-center gap-1">
                      <i class="bi bi-people text-[10px]"></i>
                      {{ deptLabel(step.deptCode) }}
                    </span>
                    <span v-if="step.deadlineDays" class="text-[10px] text-gray-500 flex items-center gap-1">
                      <i class="bi bi-clock text-[10px]"></i>
                      {{ step.deadlineDays }} ngày
                    </span>
                    <span v-if="step.signatureRequired" class="text-[10px] text-blue-600 flex items-center gap-1">
                      <i class="bi bi-pen text-[10px]"></i>
                      Cần ký
                    </span>
                    <span v-if="step.canReject" class="text-[10px] text-red-500 flex items-center gap-1">
                      <i class="bi bi-x-circle text-[10px]"></i>
                      Có thể từ chối
                    </span>
                  </div>
                </div>

                <!-- Actions (admin only) -->
                <div v-if="auth.isAdmin" class="flex items-center gap-1 shrink-0">
                  <button
                    @click="store.moveStepUp(step.id)"
                    class="step-btn"
                    :disabled="idx === 0"
                    title="Lên"
                  ><i class="bi bi-arrow-up text-[10px]"></i></button>
                  <button
                    @click="store.moveStepDown(step.id)"
                    class="step-btn"
                    :disabled="idx === store.template.workflowSteps.length - 1"
                    title="Xuống"
                  ><i class="bi bi-arrow-down text-[10px]"></i></button>
                  <button
                    @click="toggleExpand(step.id)"
                    class="step-btn"
                    :class="{ 'bg-blue-100 text-blue-600': expandedStep === step.id }"
                    title="Chỉnh sửa"
                  ><i class="bi bi-pencil text-[10px]"></i></button>
                  <button
                    v-if="store.canRemoveStep"
                    @click="store.removeWorkflowStep(step.id)"
                    class="step-btn hover:bg-red-100 hover:text-red-600"
                    title="Xóa bước"
                  ><i class="bi bi-trash3 text-[10px]"></i></button>
                </div>
              </div>

              <!-- Expanded editor (admin only) -->
              <div v-if="expandedStep === step.id && auth.isAdmin" class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                <!-- Dept code -->
                <div>
                  <label class="text-xs text-gray-500 font-medium">Người thực hiện</label>
                  <select
                    :value="step.deptCode"
                    @change="store.updateWorkflowStep(step.id, { deptCode: $event.target.value })"
                    class="w-full mt-0.5 px-2 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white"
                  >
                    <option value="EMPLOYEE">Nhân viên (tạo đơn)</option>
                    <option value="MANAGER">Trưởng phòng</option>
                    <option value="DIRECTOR">Giám đốc bộ phận</option>
                    <option value="HR_STAFF">Nhân sự xử lý</option>
                    <option value="HR_MANAGER">Nhân sự phê duyệt</option>
                    <option value="HR_DIRECTOR">Giám đốc NS</option>
                    <option value="GM">Ban Giám đốc</option>
                    <option value="GM_DIRECTOR">Tổng Giám đốc</option>
                  </select>
                </div>

                <!-- Action type -->
                <div>
                  <label class="text-xs text-gray-500 font-medium">Hành động</label>
                  <select
                    :value="step.actionType"
                    @change="store.updateWorkflowStep(step.id, { actionType: $event.target.value })"
                    class="w-full mt-0.5 px-2 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white"
                  >
                    <option value="submit">Nộp (Submit)</option>
                    <option value="approve">Phê duyệt (Approve)</option>
                    <option value="process">Xử lý (Process)</option>
                    <option value="authorize">Ủy quyền duyệt (Authorize)</option>
                    <option value="review">Xem xét (Review)</option>
                    <option value="sign">Ký duyệt (Sign)</option>
                  </select>
                </div>

                <!-- Deadline -->
                <div>
                  <label class="text-xs text-gray-500 font-medium">Thời hạn (ngày làm việc)</label>
                  <input
                    type="number"
                    :value="step.deadlineDays"
                    @input="store.updateWorkflowStep(step.id, { deadlineDays: Number($event.target.value) || null })"
                    min="0"
                    max="30"
                    class="w-full mt-0.5 px-2 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                    placeholder="Không giới hạn"
                  />
                </div>

                <!-- Status pending label -->
                <div>
                  <label class="text-xs text-gray-500 font-medium">Trạng thái chờ duyệt</label>
                  <input
                    :value="step.statusPending"
                    @input="store.updateWorkflowStep(step.id, { statusPending: $event.target.value })"
                    class="w-full mt-0.5 px-2 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 font-mono"
                    placeholder="PENDING_STEP_X"
                  />
                </div>

                <!-- Checkboxes -->
                <div class="col-span-2 flex flex-wrap gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="step.signatureRequired"
                      @change="store.updateWorkflowStep(step.id, { signatureRequired: $event.target.checked })"
                      class="w-4 h-4 accent-blue-600"
                    />
                    <span class="text-xs text-gray-700">Bắt buộc ký tên</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="step.canReject"
                      @change="store.updateWorkflowStep(step.id, { canReject: $event.target.checked })"
                      class="w-4 h-4 accent-blue-600"
                    />
                    <span class="text-xs text-gray-700">Có thể từ chối</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="step.notifyEmail"
                      @change="store.updateWorkflowStep(step.id, { notifyEmail: $event.target.checked })"
                      class="w-4 h-4 accent-blue-600"
                    />
                    <span class="text-xs text-gray-700">Thông báo Email</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="step.notifyInapp"
                      @change="store.updateWorkflowStep(step.id, { notifyInapp: $event.target.checked })"
                      class="w-4 h-4 accent-blue-600"
                    />
                    <span class="text-xs text-gray-700">Thông báo In-app</span>
                  </label>
                </div>

                <!-- Role-based visibility note -->
                <div class="col-span-2 bg-blue-50 rounded-xl px-3 py-2">
                  <p class="text-[10px] text-blue-600 font-medium">
                    <i class="bi bi-shield-check mr-1"></i>
                    Nút hành động ở bước này chỉ hiển thị với người có
                    <strong>dept_code</strong> thuộc nhóm <strong>{{ deptLabel(step.deptCode) }}</strong>.
                    <template v-if="step.actionType === 'submit'"> Admin và nhân viên tạo đơn đều thấy.</template>
                    <template v-else-if="step.signatureRequired"> Người duyệt phải có chữ ký hợp lệ trước khi thực hiện.</template>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add step -->
        <button
          v-if="auth.isAdmin && store.canAddStep"
          @click="store.addWorkflowStep()"
          class="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
        >
          <i class="bi bi-plus-circle"></i>
          Thêm bước (còn {{ 7 - store.template.workflowSteps.length }} bước)
        </button>
      </div>

      <!-- Workflow summary -->
      <div class="bg-white rounded-2xl border border-gray-200 p-4">
        <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Tóm tắt quy trình</p>
        <div class="flex items-center gap-1 flex-wrap">
          <div
            v-for="(step, idx) in store.template.workflowSteps"
            :key="step.id"
            class="flex items-center gap-1"
          >
            <div
              class="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              :class="stepColorClass(step.actionType)"
            >{{ step.stepNumber }}. {{ step.name }}</div>
            <i v-if="idx < store.template.workflowSteps.length - 1" class="bi bi-arrow-right text-gray-300 text-xs"></i>
          </div>
        </div>

        <!-- Role-based action visibility info -->
        <div class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-1.5">Phân quyền hiển thị nút hành động</p>
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
              <strong>Admin (isAdmin):</strong> Thấy tất cả các bước, có thể thực hiện bất kỳ bước nào
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <span class="w-2 h-2 rounded-full bg-gray-400 shrink-0"></span>
              <strong>Member (isMember):</strong> Chỉ thấy nút ở bước thuộc dept_code của họ
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'
import * as HrmConst from '~/utils/hrmConstants'

const store = useDocumentBuilderStore()
const auth = useAuthStore()

const deptLabel = HrmConst.deptLabel
const actionLabel = HrmConst.actionLabel
const actionIcon = HrmConst.actionIcon
const actionBadgeClass = HrmConst.actionBadgeClass
const stepColorClass = HrmConst.stepColorClass

const expandedStep = ref(null)
const dragId = ref(null)
const dragOverId = ref(null)

const toggleExpand = (id) => {
  expandedStep.value = expandedStep.value === id ? null : id
}

const onDragStart = (id) => { dragId.value = id }
const onDragOver = (id) => { dragOverId.value = id }
const onDrop = (toId) => {
  if (dragId.value && dragId.value !== toId) {
    const arr = store.template.workflowSteps
    const fromIdx = arr.findIndex(s => s.id === dragId.value)
    const toIdx = arr.findIndex(s => s.id === toId)
    if (fromIdx !== -1 && toIdx !== -1) {
      const [moved] = arr.splice(fromIdx, 1)
      const adjustedTo = fromIdx < toIdx ? toIdx - 1 : toIdx
      arr.splice(adjustedTo, 0, moved)
      store.renumberSteps()
    }
  }
  dragId.value = null
  dragOverId.value = null
}
</script>

<style scoped>
.step-btn {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: background-color 0.15s;
}
.step-btn:hover { background-color: #f3f4f6; }
.step-btn:disabled { opacity: 0.3; cursor: not-allowed; }
</style>
