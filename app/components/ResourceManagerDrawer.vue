<template>
  <div>
    <!-- Trigger Button -->
    <button
      @click="openDrawer"
      class="px-4 py-1.5 text-xss font-black uppercase tracking-widest rounded-md transition-all duration-300 flex items-center gap-2 bg-zinc-100/80 hover:bg-zinc-100"
      :class="
        isOpen
          ? 'bg-white text-emerald-600 shadow-lg ring-1 ring-zinc-100'
          : 'text-zinc-600 hover:text-emerald-600'
      "
    >
      <i class="bi bi-door-open-fill"></i>
      Rooms / Areas
    </button>

    <!-- Backdrop Overlay & Drawer Teleported to Body -->
    <Teleport to="body">
      <!-- Backdrop Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          @click="closeDrawer"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
        ></div>
      </Transition>

      <!-- Resources Drawer -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="isOpen"
          class="fixed right-0 top-0 h-full w-full sm:w-95 lg:w-120 bg-white shadow-2xl z-9999 flex flex-col border-l border-zinc-200 overflow-hidden"
        >
          <!-- Header -->
          <div
            class="px-6 py-4 border-b border-zinc-200 bg-linear-to-r from-emerald-50 to-teal-50 flex items-center justify-between shrink-0"
          >
            <div>
              <h3
                class="text-xl font-black text-zinc-900 tracking-tighter uppercase italic"
              >
                <span class="text-emerald-500">Resource</span> Management
              </h3>
              <p
                class="text-xss  text-zinc-400 uppercase tracking-widest mt-1"
              >
                Cơ sở hạ tầng & Hệ thống phòng họp
              </p>
            </div>
            <button
              @click="closeDrawer"
              class="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-all hover:rotate-90 group"
            >
              <i
                class="bi bi-x-lg text-zinc-400 text-lg group-hover:text-zinc-600"
              ></i>
            </button>
          </div>

          <!-- Tabs -->
          <div class="px-6 py-3 bg-white border-b border-zinc-100 shrink-0">
            <div
              class="flex p-1 bg-zinc-100 rounded-xl border border-zinc-200 shadow-inner"
            >
              <button
                @click="subTab = 'areas'"
                :class="
                  subTab === 'areas'
                    ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-100 '
                    : 'text-zinc-500 hover:text-zinc-700'
                "
                class="flex-1 py-1.5 text-xss uppercase tracking-widest rounded-lg transition-all duration-300"
              >
                Cơ sở hạ tầng
              </button>
              <button
                @click="subTab = 'rooms'"
                :class="
                  subTab === 'rooms'
                    ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-100 '
                    : 'text-zinc-500 hover:text-zinc-700'
                "
                class="flex-1 py-1.5 text-xss uppercase tracking-widest rounded-lg transition-all duration-300"
              >
                Hệ thống phòng họp
              </button>
            </div>
          </div>

          <!-- Content Scrollable -->
          <div
            class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-50/30"
          >
            <!-- Actions -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex flex-col">
                <span
                  class="text-xss font-black text-emerald-500 uppercase tracking-widest mb-0.5"
                  >Explorer</span
                >
                <h4
                  class="text-xss font-black text-zinc-900 uppercase tracking-tighter italic"
                >
                  Danh sách {{ subTab === "areas" ? "cơ sở" : "phòng họp" }}
                </h4>
              </div>
              <button
                @click="openForm(null)"
                class="px-4 py-1.5 bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white text-xss font-black uppercase tracking-[0.2em] rounded-xl hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 hover:shadow-lg hover:shadow-emerald-100 transition-all flex items-center gap-2 active:scale-95"
              >
                <i class="bi bi-plus-lg"></i> Thêm mới
              </button>
            </div>

            <!-- Areas List -->
            <div v-if="subTab === 'areas'" class="space-y-3">
              <div
                v-for="area in internalAreas"
                :key="area.id"
                class="group bg-white p-4 rounded-2xl border border-zinc-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md cursor-default"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        class="w-2 h-2 rounded-full shadow-sm"
                        :class="area.active ? 'bg-emerald-500' : 'bg-red-400'"
                      ></span>
                      <span
                        class="text-xss  text-zinc-400 uppercase tracking-widest"
                        >REF: AREA_{{ area.id }}</span
                      >
                    </div>
                    <h5
                      class="text-sm font-black text-zinc-900 group-hover:text-emerald-500 transition-colors uppercase italic tracking-tighter"
                    >
                      {{ area.name }}
                    </h5>
                    <p
                      class="text-xss text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed"
                    >
                      {{ area.address }}
                    </p>
                  </div>
                  <div class="flex gap-1.5 ml-3">
                    <button
                      @click="openForm(area)"
                      class="w-8 h-8 rounded-lg bg-zinc-50 text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-all shadow-sm"
                    >
                      <i class="bi bi-pencil-square text-xss"></i>
                    </button>
                    <button
                      @click="handleDelete(area.id, area.name)"
                      :disabled="isSaving"
                      class="w-8 h-8 rounded-lg bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all shadow-sm disabled:opacity-50"
                    >
                      <i class="bi bi-trash text-xss"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rooms List -->
            <div v-else class="space-y-4">
              <!-- Area Filtering Dropdown -->
              <div class="space-y-1.5">
                <p
                  class="text-xss font-black uppercase tracking-widest bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 bg-clip-text text-transparent"
                >
                  Lọc theo khu vực
                </p>
                <div
                  class="rounded-xl p-px bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400"
                >
                  <select
                    v-model="roomFilterAreaId"
                    class="w-full bg-white text-zinc-700 px-3 py-2 text-xs font-semibold rounded-[11px] border-0 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option :value="null">Tất cả khu vực</option>
                    <option
                      v-for="area in internalAreas"
                      :key="area.id"
                      :value="area.id"
                    >
                      {{ area.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="room in filteredRoomsList"
                  :key="room.id"
                  class="group bg-white p-4 rounded-2xl border border-zinc-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-md cursor-default"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1.5">
                        <span
                          class="text-xss font-black text-emerald-500 uppercase tracking-widest"
                        >
                          {{
                            internalAreas.find(
                              (a) => Number(a.id) === Number(room.area_id),
                            )?.name || "Unknown"
                          }}
                        </span>
                        <span
                          :class="
                            room.available
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-red-50 text-red-600 border-red-100'
                          "
                          class="px-2 py-0.5 rounded-lg text-xss font-black uppercase border"
                        >
                          {{ room.available ? "Available" : "Busy" }}
                        </span>
                      </div>
                      <h5
                        class="text-sm font-black text-zinc-900 group-hover:text-emerald-500 transition-colors uppercase italic tracking-tighter"
                      >
                        {{ room.name }}
                      </h5>
                      <div class="flex gap-3 mt-2.5">
                        <div
                          class="px-2 py-0.5 bg-zinc-50 rounded-lg flex items-center gap-1 grayscale group-hover:grayscale-0 transition-all"
                        >
                          <i
                            class="bi bi-people-fill text-emerald-500 text-xss"
                          ></i>
                          <span class="text-xss  text-zinc-600"
                            >{{ room.capacity }} P</span
                          >
                        </div>
                        <div
                          class="px-2 py-0.5 bg-zinc-50 rounded-lg flex items-center gap-1 grayscale group-hover:grayscale-0 transition-all"
                        >
                          <i
                            class="bi bi-layers-fill text-teal-500 text-xss"
                          ></i>
                          <span class="text-xss  text-zinc-600"
                            >Floor {{ room.floor }}</span
                          >
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-1.5 ml-3">
                      <button
                        @click="openForm(room)"
                        class="w-8 h-8 rounded-lg bg-zinc-50 text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center transition-all shadow-sm"
                      >
                        <i class="bi bi-pencil-square text-xss"></i>
                      </button>
                      <button
                        @click="handleDelete(room.id, room.name)"
                        :disabled="isSaving"
                        class="w-8 h-8 rounded-lg bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all shadow-sm disabled:opacity-50"
                      >
                        <i class="bi bi-trash text-xss"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Actions / Notification Area -->
            <div class="px-8 py-5 border-t border-zinc-200 bg-white shrink-0">
              <div
                class="flex items-center justify-center gap-2 text-xss  text-zinc-400 uppercase tracking-widest"
              >
                <i class="bi bi-info-circle"></i> Thay đổi sẽ được đồng bộ ngay
                lập tức
              </div>
            </div>

            <!-- Form Overlay (Inside Drawer) -->
            <Transition
              enter-active-class="transition-all duration-500 ease-out"
              enter-from-class="translate-y-full opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-full opacity-0"
            >
              <div
                v-if="showForm"
                class="absolute inset-0 bg-white z-20 flex flex-col"
              >
                <div
                  class="px-6 py-3 border-b border-zinc-200 flex items-center justify-between shrink-0 bg-zinc-50/50"
                >
                  <h4
                    class="text-xss font-black text-zinc-900 uppercase tracking-tighter italic"
                  >
                    {{ isEdit ? "Hiệu chỉnh" : "Thêm mới" }}
                    <span class="text-emerald-500">{{
                      subTab === "areas" ? "Cơ sở" : "Phòng họp"
                    }}</span>
                  </h4>
                  <button
                    @click="showForm = false"
                    class="w-8 h-8 rounded-full hover:bg-zinc-200/50 flex items-center justify-center transition-all"
                  >
                    <i class="bi bi-chevron-down text-base text-zinc-400"></i>
                  </button>
                </div>

                <div class="flex-1 overflow-y-auto p-5 space-y-5">
                  <!-- Area Form -->
                  <div v-if="subTab === 'areas'" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-1.5">
                        <label
                          class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                          >Tên cơ sở định danh</label
                        >
                        <input
                          v-model="areaForm.name"
                          type="text"
                          class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xss  focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                          placeholder="VD: Head Office..."
                        />
                      </div>
                      <div class="space-y-1.5">
                        <label
                          class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                          >Thành phố / Khu vực</label
                        >
                        <input
                          v-model="areaForm.city"
                          type="text"
                          class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xss  focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>
                    <div class="space-y-1.5">
                      <label
                        class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                        >Địa chỉ pháp lý trực thuộc:</label
                      >
                      <AddressLocation
                        v-model="areaForm.address"
                        label-class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1 block mb-1"
                        input-class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xss focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                      />
                    </div>
                    <div class="space-y-1.5">
                      <label
                        class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                        >Email hỗ trợ kỹ thuật (IT Support)</label
                      >
                      <input
                        v-model="areaForm.it_support_emails"
                        type="text"
                        class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xss  focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                        placeholder="VD: support@company.com, help@hq.com"
                      />
                    </div>
                  </div>

                  <!-- Room Form -->
                  <div v-else class="space-y-4">
                    <div class="space-y-1.5">
                      <label
                        class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                        >Thuộc hệ thống cơ sở</label
                      >
                      <div class="relative group">
                        <select
                          v-model="roomForm.area_id"
                          class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xss  focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option
                            v-for="area in internalAreas"
                            :key="area.id"
                            :value="area.id"
                          >
                            {{ area.name }}
                          </option>
                        </select>
                        <i
                          class="bi bi-chevron-expand absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none group-focus-within:text-emerald-500 transition-colors"
                        ></i>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-1.5">
                        <label
                          class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                          >Tên phòng họp</label
                        >
                        <input
                          v-model="roomForm.name"
                          type="text"
                          class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xss  focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                        />
                      </div>
                      <div class="space-y-1.5">
                        <label
                          class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                          >Sức chứa tối đa (P)</label
                        >
                        <input
                          v-model="roomForm.capacity"
                          type="number"
                          class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xss  focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-1.5">
                        <label
                          class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                          >Vị trí tầng</label
                        >
                        <input
                          v-model="roomForm.floor"
                          type="number"
                          class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xss  focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                        />
                      </div>
                      <div class="flex items-center gap-4 pt-6">
                        <label
                          class="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            v-model="roomForm.available"
                            class="sr-only"
                          />
                          <span
                            :class="
                              roomForm.available
                                ? 'bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 border-transparent text-white shadow-md'
                                : 'bg-white border-zinc-300 text-transparent'
                            "
                            class="w-5 h-5 rounded-md border flex items-center justify-center transition-all"
                          >
                            <i class="bi bi-check2 text-xs"></i>
                          </span>
                          <span
                            class="text-xss font-black text-zinc-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors"
                            >Sẵn sàng</span
                          >
                        </label>
                      </div>
                    </div>

                    <div class="space-y-3">
                      <label
                        class="text-xss font-black text-zinc-400 uppercase tracking-widest ml-1"
                        >Tiện ích tích hợp</label
                      >
                      <div class="flex flex-wrap gap-2">
                        <button
                          v-for="tag in [
                            'Projector',
                            'Whiteboard',
                            'Teams Display',
                            'Coffee Machine',
                            'Video Conf',
                            'AC',
                          ]"
                          :key="tag"
                          type="button"
                          @click="toggleFacility(tag)"
                          :class="
                            roomForm.facilities &&
                            roomForm.facilities.includes(tag)
                              ? 'bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white shadow-md scale-105 border-transparent'
                              : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400 hover:text-zinc-600'
                          "
                          class="px-3 py-1.5 text-xss font-black uppercase rounded-xl border transition-all active:scale-95"
                        >
                          {{ tag }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form Footer -->
                <div
                  class="p-5 border-t border-zinc-100 bg-zinc-50/30 flex gap-3 shrink-0"
                >
                  <button
                    @click="showForm = false"
                    class="flex-1 py-2.5 text-xss font-black uppercase tracking-widest rounded-xl bg-white border border-zinc-200 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 transition-all shadow-xs"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    @click="handleSave"
                    :disabled="isSaving"
                    class="flex-2 py-2.5 text-xss font-black uppercase tracking-widest rounded-xl bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 hover:shadow-xl hover:shadow-emerald-100 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:bg-zinc-400"
                  >
                    <i
                      v-if="isSaving"
                      class="bi bi-arrow-clockwise animate-spin"
                    ></i>
                    {{
                      isSaving
                        ? isEdit
                          ? "Đang cập nhật..."
                          : "Đang khởi tạo..."
                        : isEdit
                          ? "Cập nhật"
                          : "Khởi tạo"
                    }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const props = defineProps({
  areas: { type: Array, required: true },
  rooms: { type: Array, required: true },
});

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase || "http://localhost:8000/api";
const authStore = useAuthStore();
const tenantId = computed(() => authStore.User?.tenant_id ?? "");

const emit = defineEmits(["update", "refresh", "toast"]);

const isOpen = ref(false);
const subTab = ref("areas");
const roomFilterAreaId = ref(null);
const showForm = ref(false);
const isEdit = ref(false);
const currentId = ref(null);
const isSaving = ref(false);

// Local clones to work with
const internalAreas = ref([...props.areas]);
const internalRooms = ref([...props.rooms]);

watch(
  () => props.areas,
  (val) => (internalAreas.value = [...val]),
  { deep: true },
);
watch(
  () => props.rooms,
  (val) => (internalRooms.value = [...val]),
  { deep: true },
);

const filteredRoomsList = computed(() => {
  if (!roomFilterAreaId.value) return internalRooms.value;
  return internalRooms.value.filter(
    (r) => Number(r.area_id) === Number(roomFilterAreaId.value),
  );
});

// Initialize filter if not set
watch(
  internalAreas,
  (val) => {
    if (val.length > 0 && !roomFilterAreaId.value) {
      roomFilterAreaId.value = val[0].id;
    }
  },
  { immediate: true },
);

const areaForm = reactive({
  name: "",
  city: "",
  address: "",
  it_support_emails: "",
  active: true,
});
const roomForm = reactive({
  area_id: null,
  name: "",
  capacity: 10,
  floor: 1,
  available: true,
  facilities: [],
});

const openDrawer = () => {
  isOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeDrawer = () => {
  isOpen.value = false;
  showForm.value = false;
  document.body.style.overflow = "";
  // Notify parent to refresh if needed
  emit("refresh");
};

const openForm = (data = null) => {
  isEdit.value = !!data;
  currentId.value = data?.id || null;

  if (subTab.value === "areas") {
    Object.assign(
      areaForm,
      data || {
        name: "",
        city: "",
        address: "",
        it_support_emails: "",
        active: true,
      },
    );
  } else {
    Object.assign(
      roomForm,
      data || {
        area_id: internalAreas.value[0]?.id,
        name: "",
        capacity: 10,
        floor: 1,
        available: true,
        facilities: [],
      },
    );
  }
  showForm.value = true;
};

const handleSave = async () => {
  if (isSaving.value) return;
  isSaving.value = true;

  try {
    const isArea = subTab.value === "areas";
    const endpoint = isArea ? "areas" : "rooms";
    const payload = isArea
      ? { ...areaForm, tenant_id: tenantId.value }
      : { ...roomForm };

    // Convert IDs to numbers if necessary
    if (!isArea && payload.area_id) payload.area_id = Number(payload.area_id);
    if (!isArea && payload.capacity)
      payload.capacity = Number(payload.capacity);
    if (!isArea && payload.floor) payload.floor = Number(payload.floor);

    const url = isEdit.value
      ? `${apiBaseUrl}/v1/${endpoint}/${currentId.value}`
      : `${apiBaseUrl}/v1/${endpoint}/`;

    await useFetchAuth(url, {
      method: isEdit.value ? "PUT" : "POST",
      body: payload,
    });

    console.log(
      `[API] ${endpoint} ${isEdit.value ? "updated" : "created"} successfully`,
    );
    emit("refresh");
    showForm.value = false;
  } catch (error) {
    console.error("[API ERROR]:", error);
    emit("toast", { type: "error", message: error?.data?.detail || error.message });
  } finally {
    isSaving.value = false;
  }
};

const handleDelete = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    try {
      const endpoint = subTab.value === "areas" ? "areas" : "rooms";
      await useFetchAuth(`${apiBaseUrl}/v1/${endpoint}/${id}`, {
        method: "DELETE",
      });

      console.log(`[API] ${endpoint} deleted successfully`);
      emit("refresh");
    } catch (error) {
      console.error("[API ERROR]:", error);
      emit("toast", { type: "error", message: error?.data?.detail || error.message });
    }
  }
};

const toggleFacility = (tag) => {
  if (!roomForm.facilities) roomForm.facilities = [];
  const idx = roomForm.facilities.indexOf(tag);
  if (idx > -1) roomForm.facilities.splice(idx, 1);
  else roomForm.facilities.push(tag);
};

const handleEscapeKey = (event) => {
  if (event.key === "Escape" && isOpen.value) {
    closeDrawer();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleEscapeKey);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #10b981;
}

.line-clamp-1 {
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
