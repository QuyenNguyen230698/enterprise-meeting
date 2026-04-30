<template>
  <div
    id="app"
    class="h-full flex flex-col bg-zinc-50 overflow-hidden font-sans select-none"
  >
    <ToastContainer />

    <!-- Simplified Smaller Header -->
    <header
      class="bg-white border-b border-zinc-200 px-8 py-2 shrink-0 shadow-sm z-20"
    >
      <div class="flex items-center justify-between gap-4">
        <!-- Left spacer to maintain center alignment -->
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <span
              class="text-xs font-black text-zinc-900 uppercase tracking-tighter italic"
            >
              <span class="text-emerald-500">Enterprise</span> Meeting
            </span>
            <button 
              @click="handleManualRefresh"
              :disabled="isRefreshing"
              class="inline-flex h-8 min-w-27.5 items-center justify-center gap-1.5 px-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-emerald-600 rounded-lg border border-zinc-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <i :class="['bi bi-arrow-clockwise text-sm', isRefreshing ? 'animate-spin text-emerald-500' : '']"></i>
              <span class="text-xss font-bold uppercase tracking-widest">{{ isRefreshing ? 'Refreshing...' : 'Sync' }}</span>
            </button>
          </div>
        </div>

        <!-- Center: Main Navigation -->
        <nav
          class="inline-flex items-center gap-1 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200 shadow-inner backdrop-blur-sm"
        >
          <button
            @click="activeTab = 'bookings'"
            :class="
              activeTab === 'bookings'
                ? 'bg-white text-emerald-600 shadow-md ring-1 ring-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900'
            "
            class="min-w-27 px-4 py-1.5 text-xss font-black uppercase tracking-widest rounded-lg transition-all duration-300"
          >
            Meetings
          </button>
          <button
            @click="activeTab = 'analytics'"
            :class="
              activeTab === 'analytics'
                ? 'bg-white text-emerald-600 shadow-md ring-1 ring-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900'
            "
            class="min-w-27 px-4 py-1.5 text-xss font-black uppercase tracking-widest rounded-lg transition-all duration-300"
          >
            Analytics
          </button>
        </nav>

        <!-- Right: Resource Manager -->
        <div class="flex-1 flex justify-end">
          <ResourceManagerDrawer
            :areas="areas"
            :rooms="rooms"
            @update="handleResourcesUpdate"
            @refresh="loadData"
            @toast="({ type, message }) => triggerToast(type, message)"
          />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden relative">
      <Transition mode="out-in" name="tab-fade">
        <!-- 1. ANALYTICS TAB -->
        <div
          v-if="activeTab === 'analytics'"
          class="h-full overflow-y-auto p-10 space-y-10 custom-scrollbar bg-zinc-50"
        >
          <!-- ── CURRENT WEEK ── -->
          <div>
            <div class="flex items-center gap-3 mb-5">
              <span class="h-1 w-8 rounded-full bg-emerald-400 inline-block"></span>
              <h3 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em]">
                Tuần này &nbsp;
                <span class="text-zinc-400 font-medium normal-case tracking-normal">
                  {{ currentWeekRange.start.format("DD/MM") }} – {{ currentWeekRange.end.format("DD/MM/YYYY") }}
                </span>
              </h3>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div
                v-for="(stat, idx) in [
                  { label: 'Tong cuoc hop', val: currentWeekMeetings.length, icon: 'bi-calendar-check', color: 'emerald' },
                  { label: 'So phong su dung', val: new Set(currentWeekMeetings.map(m => m.roomId)).size, icon: 'bi-door-open', color: 'teal' },
                  { label: 'Tong thoi luong (phut)', val: currentWeekTotalDuration, icon: 'bi-clock', color: 'lime' },
                  { label: 'Trung binh/ngay', val: (currentWeekMeetings.length / 7).toFixed(1), icon: 'bi-bar-chart', color: 'emerald' },
                ]"
                :key="idx"
                class="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <p class="text-xss font-black text-zinc-400 uppercase tracking-widest">{{ stat.label }}</p>
                  <i :class="['bi', stat.icon, `text-${stat.color}-400 text-sm`]"></i>
                </div>
                <h3 class="text-xl font-black text-zinc-900 group-hover:text-emerald-500 transition-colors tracking-tighter">
                  {{ stat.val }}
                </h3>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-emerald-400">
                  Tan suat dat lich hop (tuan nay)
                </h4>
                <div class="h-56">
                  <Bar :data="barChartData" :options="barChartOptions" />
                </div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-teal-400">
                  Phan bo phong hop (tuan nay)
                </h4>
                <div class="h-56 flex items-center justify-center">
                  <template v-if="currentWeekMeetings.length > 0">
                    <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
                  </template>
                  <p v-else class="text-xss text-zinc-400 font-bold uppercase tracking-widest">Khong co du lieu</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── PREVIOUS WEEK ── -->
          <div>
            <div class="flex items-center gap-3 mb-5">
              <span class="h-1 w-8 rounded-full bg-zinc-400 inline-block"></span>
              <h3 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em]">
                Tuan truoc &nbsp;
                <span class="text-zinc-400 font-medium normal-case tracking-normal">
                  {{ prevWeekRange.start.format("DD/MM") }} – {{ prevWeekRange.end.format("DD/MM/YYYY") }}
                </span>
              </h3>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div
                v-for="(stat, idx) in [
                  { label: 'Tong cuoc hop', val: prevWeekMeetings.length, icon: 'bi-calendar-check', color: 'zinc' },
                  { label: 'So phong su dung', val: new Set(prevWeekMeetings.map(m => m.roomId)).size, icon: 'bi-door-open', color: 'zinc' },
                  { label: 'Tong thoi luong (phut)', val: prevWeekTotalDuration, icon: 'bi-clock', color: 'zinc' },
                  { label: 'Trung binh/ngay', val: (prevWeekMeetings.length / 7).toFixed(1), icon: 'bi-bar-chart', color: 'zinc' },
                ]"
                :key="idx"
                class="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <p class="text-xss font-black text-zinc-400 uppercase tracking-widest">{{ stat.label }}</p>
                  <i :class="['bi', stat.icon, 'text-zinc-400 text-sm']"></i>
                </div>
                <h3 class="text-xl font-black text-zinc-900 group-hover:text-zinc-600 transition-colors tracking-tighter">
                  {{ stat.val }}
                </h3>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-zinc-400">
                  Tan suat dat lich hop (tuan truoc)
                </h4>
                <div class="h-56">
                  <Bar :data="barChartDataPrev" :options="barChartOptions" />
                </div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-zinc-300">
                  Phan bo phong hop (tuan truoc)
                </h4>
                <div class="h-56 flex items-center justify-center">
                  <template v-if="prevWeekMeetings.length > 0">
                    <Doughnut :data="doughnutChartDataPrev" :options="doughnutChartOptions" />
                  </template>
                  <p v-else class="text-xss text-zinc-400 font-bold uppercase tracking-widest">Khong co du lieu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. BOOKINGS TAB (Full original functionality preserved exactly) -->
        <div
          v-else-if="activeTab === 'bookings'"
          class="h-full bg-white flex flex-col"
        >
          <div id="container" class="w-full grow overflow-hidden">
            <ClientOnly>
              <template #fallback>
                <div
                  class="w-full h-full flex items-center justify-center bg-white"
                >
                  <div class="text-center">
                    <div
                      class="w-8 h-8 border-2 border-slate-300 border-t-emerald-500 animate-spin mx-auto mb-3"
                    ></div>
                    <p
                      class="text-xss font-bold uppercase tracking-widest text-slate-400"
                    >
                      Loading Scheduler...
                    </p>
                  </div>
                </div>
              </template>
              <ejs-schedule
                ref="scheduleObj"
                width="100%"
                height="100%"
                :selectedDate="selectedDate"
                :eventSettings="eventSettings"
                :showQuickInfo="false"
                startHour="07:00"
                endHour="22:00"
                :currentView="'Week'"
                :editorTemplate="'editorTemplate'"
                @popupOpen="onPopupOpen"
                @actionBegin="onActionBegin"
                @actionComplete="onActionComplete"
                @eventRendered="onEventRendered"
              >
                <e-views>
                  <e-view option="TimelineDay"></e-view>
                  <e-view option="Day"></e-view>
                  <e-view option="Week"></e-view>
                  <e-view option="Month"></e-view>
                </e-views>

                <template v-slot:editorTemplate="{ data }">
                  <div
                    class="px-5 py-6 bg-slate-50 min-w-[500px] h-full flex flex-col gap-4"
                  >
                    <div
                      class="flex items-center pb-2 border-b border-emerald-200/70"
                    >
                      <h3
                        class="text-lg font-black text-emerald-800 tracking-tight flex items-center gap-2"
                      >
                        <i class="bi bi-building text-teal-600"></i>
                        {{ data.id ? "Edit Appointment" : "New Appointment" }}
                      </h3>
                    </div>

                    <!-- General Info Card -->
                    <div
                      class="bg-white p-4 rounded-lg shadow-[0_6px_18px_rgba(16,185,129,0.10)] border border-emerald-100"
                    >
                      <div class="mb-4 flex items-center justify-between bg-linear-to-r from-emerald-50 via-teal-50 to-lime-50 p-2 rounded-md border border-emerald-100">
                        <div class="flex items-center gap-2">
                          <i class="bi bi-headset text-teal-500"></i>
                          <span class="text-xss font-black text-emerald-700 uppercase tracking-widest">Need IT Support?</span>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" v-model="editorData.need_it_support" class="sr-only peer">
                          <div class="w-9 h-5 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-emerald-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-emerald-400 peer-checked:via-teal-400 peer-checked:to-lime-400"></div>
                        </label>
                      </div>
                      <div class="mb-4">
                        <label
                          class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-2 overflow-hidden"
                          >Meeting Title</label
                        >
                        <input
                          v-model="editorData.title"
                          type="text"
                          name="title"
                          class="e-field w-full border-b-2 border-emerald-100 bg-transparent px-1 py-1 text-sm font-bold text-emerald-900 transition-all duration-300 focus:outline-none focus:border-emerald-600 placeholder:font-medium placeholder:text-emerald-300"
                          placeholder="Type your meeting title here..."
                        />
                      </div>
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label
                            class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1 overflow-hidden"
                            >Area</label
                          >
                          <select
                            name="areaId"
                            class="e-field w-full border-b-2 border-emerald-100 bg-transparent px-1 py-2 text-sm font-bold text-emerald-900 focus:outline-none focus:border-emerald-600"
                            :value="editorData.areaId"
                            @change="onAreaChange"
                          >
                            <option
                              v-for="area in areaData"
                              :key="area.id"
                              :value="area.id"
                            >
                              {{ area.name }}
                            </option>
                          </select>
                        </div>
                        <div>
                          <label
                            class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1 overflow-hidden"
                            >Conference Room</label
                          >
                          <select
                            name="roomId"
                            :key="`room-${editorData.areaId}`"
                            class="e-field w-full border-b-2 border-emerald-100 bg-transparent px-1 py-2 text-sm font-bold focus:outline-none focus:border-emerald-600 transition-all"
                            :class="
                              !editorData.roomId
                                ? 'text-red-500'
                                : 'text-emerald-900'
                            "
                            :value="editorData.roomId"
                            :disabled="!editorData.areaId"
                            @change="onRoomChange"
                          >
                            <option value="" disabled>
                              --- Chọn phòng ---
                            </option>
                            <option
                              v-for="room in filteredRoomData"
                              :key="room.id"
                              :value="room.id"
                              :disabled="
                                unavailableRoomIds.includes(Number(room.id))
                              "
                            >
                              {{ room.name }}
                              {{
                                unavailableRoomIds.includes(Number(room.id))
                                  ? " 🔒 (Đang bận)"
                                  : ""
                              }}
                            </option>
                          </select>
                          <p
                            v-if="
                              !editorData.roomId &&
                              unavailableRoomIds.length > 0
                            "
                            class="text-xss text-red-500 mt-1.5 flex items-center gap-1 font-bold"
                          >
                            <i class="bi bi-exclamation-circle-fill"></i> Tạm
                            thời không có phòng trống khung giờ này!
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Timing Card -->
                    <div
                      class="bg-white p-4 rounded-lg shadow-[0_6px_18px_rgba(16,185,129,0.10)] border border-emerald-100"
                    >
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label
                            class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1 overflow-hidden"
                            >Start Time</label
                          >
                          <ejs-datetimepicker
                            v-model="editorData.start_time"
                            format="dd/MM/yyyy HH:mm"
                            cssClass="minimal-ej-field"
                          ></ejs-datetimepicker>
                        </div>
                        <div>
                          <label
                            class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1 overflow-hidden"
                            >End Time</label
                          >
                          <ejs-datetimepicker
                            v-model="editorData.end_time"
                            format="dd/MM/yyyy HH:mm"
                            cssClass="minimal-ej-field"
                          ></ejs-datetimepicker>
                        </div>
                      </div>
                    </div>

                    <!-- Participants Card -->
                    <div
                      class="bg-white p-4 rounded-lg shadow-[0_6px_18px_rgba(16,185,129,0.10)] border border-emerald-100 grow"
                    >
                      <label
                        class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-3 overflow-hidden"
                        >Participants / Emails</label
                      >
                      <div class="flex flex-wrap gap-2">
                        <label
                          v-for="user in otherUsers"
                          :key="user.portal_user_id"
                          class="px-2.5 py-1 text-xss font-bold rounded-full border transition-all duration-300 ease-in-out flex items-center gap-1.5 cursor-pointer"
                          :class="
                            editorData.attendee_ids.includes(
                              user.portal_user_id,
                            )
                              ? 'bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white border-transparent shadow-md'
                              : 'bg-transparent text-emerald-700 border-emerald-200 hover:border-teal-400 hover:text-emerald-900'
                          "
                        >
                          <input
                            type="checkbox"
                            class="hidden"
                            :checked="
                              editorData.attendee_ids.includes(
                                user.portal_user_id,
                              )
                            "
                            @change="toggleParticipant(user)"
                          />
                          <i
                            v-if="
                              editorData.attendee_ids.includes(
                                user.portal_user_id,
                              )
                            "
                            class="bi bi-check-circle-fill text-white"
                          ></i>
                          <i v-else class="bi bi-person"></i>
                          {{ user.email }}
                        </label>
                      </div>
                      <!-- Extra CC emails (people outside the system) -->
                      <div class="mt-3">
                        <label class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1">
                          CC ngoai he thong
                        </label>
                        <input
                          v-model="editorData.extra_cc_emails"
                          type="text"
                          placeholder="check@gmail.com, test@gmail.com, ..."
                          class="w-full border-b-2 border-emerald-100 bg-transparent px-1 py-1 text-xs font-medium text-emerald-900 focus:outline-none focus:border-emerald-500 placeholder:text-emerald-300 transition-all"
                        />
                        <p class="text-zinc-400 text-xss mt-0.5">Nhap nhieu email cach nhau bang dau phay</p>
                      </div>

                      <input
                        type="hidden"
                        name="participants"
                        class="e-field"
                        :value="editorData.participants.join(',')"
                      />
                      <input
                        type="hidden"
                        name="attendee_ids"
                        class="e-field"
                        :value="editorData.attendee_ids.join(',')"
                      />
                      <input
                        type="hidden"
                        name="cc_emails"
                        class="e-field"
                        :value="editorData.extra_cc_emails || ''"
                      />
                    </div>
                  </div>
                </template>
              </ejs-schedule>
            </ClientOnly>
          </div>
        </div>
      </Transition>
    </main>

  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'permission'] });
import { ref, onMounted, onUnmounted, nextTick, provide, computed, watch } from "vue";
import { io } from "socket.io-client";
import { L10n } from "@syncfusion/ej2-base";
import {
  ScheduleComponent as EjsSchedule,
  ViewsDirective as EViews,
  ViewDirective as EView,
} from "@syncfusion/ej2-vue-schedule";
import { DateTimePickerComponent as EjsDatetimepicker } from "@syncfusion/ej2-vue-calendars";
import { Day, Week, TimelineViews, Month } from "@syncfusion/ej2-schedule";
import moment from "moment";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "vue-chartjs";
import { useAuthStore } from "~/stores/auth";
import { useFetchAuth } from "~/composables/useFetchAuth";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);

// --- GLOBAL STATE ---
const activeTab = ref("bookings");

L10n.load({
  "en-US": {
    schedule: {
      saveButton: "Save",
      cancelButton: "Close",
      deleteButton: "Remove",
      newEvent: "New Booking",
      editEvent: "Edit Booking",
      today: "Today",
    },
  },
});

const scheduleObj = ref(null);
const selectedDate = ref(new Date());
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase ;
const { success, error: showError, warning, info } = useToast();

// Auth — lấy user từ token, không cần gọi API users
const authStore = useAuthStore();
const currentUser = computed(() => authStore.User);
const portalUserId = computed(() => currentUser.value?.portal_user_id ?? "");

// Removed old mock apiResponse to clean up code.


const mapApiToSchedule = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    // Use moment for reliable cross-browser date parsing
    const start = moment(`${item.date} ${item.start_time}`, "YYYY-MM-DD HH:mm");
    const end = moment(`${item.date} ${item.end_time}`, "YYYY-MM-DD HH:mm");
    
    return {
      id: item.id,
      title: item.title,
      start_time: start.toDate(),
      end_time: end.toDate(),
      status: item.status,
      need_it_support: item.need_it_support || false,
      areaId: Number(item.area_id),
      roomId: Number(item.room_id),
      participants: item.cc_emails
        ? item.cc_emails.split(",").map((e) => e.trim())
        : [],
      attendee_ids: Array.isArray(item.attendee_ids)
        ? [...item.attendee_ids]
        : [],
      cc_emails: item.cc_emails || "",
      createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      zoomUrl: item.zoom_join_url,
    };
  });
};

const scheduleDataList = ref([]);

const eventSettings = ref({
  dataSource: [],
  fields: {
    id: "id",
    subject: { name: "title" },
    startTime: { name: "start_time" },
    endTime: { name: "end_time" },
  },
});

const onEventRendered = (args) => {
  const status = args.data.status;
  const hasZoom = !!args.data.zoomUrl;

  if (status === "scheduled") {
    args.element.style.backgroundColor = hasZoom ? "#2563eb" : "#64748b";
    args.element.style.borderLeft = hasZoom
      ? "4px solid #1e3a8a"
      : "4px solid #334155";
  }

  args.element.style.borderRadius = "4px";
  args.element.style.fontSize = "10px";
  args.element.style.fontWeight = "bold";
};

const areas = ref([]);

const rooms = ref([]);

const users = ref([]);
const otherUsers = computed(() =>
  users.value.filter((u) => u.portal_user_id !== portalUserId.value),
);

const HEAD_OFFICE_AREA_ID = 1;
const areaData = computed(() =>
  areas.value
    .filter((area) => area.active)
    .map((area) => ({ id: Number(area.id), name: area.name })),
);
const getDefaultAreaId = () =>
  areaData.value.some((area) => area.id === HEAD_OFFICE_AREA_ID)
    ? HEAD_OFFICE_AREA_ID
    : areaData.value[0]?.id || null;
const getRoomsByArea = (areaId) => {
  const normalizedAreaId = Number(areaId);
  return rooms.value.filter(
    (room) => Number(room.area_id) === normalizedAreaId && room.available,
  );
};
const getFirstRoomIdByArea = (areaId) => getRoomsByArea(areaId)[0]?.id || null;
const getEmailsByAttendeeIds = (attendeeIds = []) => {
  if (!Array.isArray(attendeeIds)) return [];
  return users.value
    .filter((user) => attendeeIds.includes(user.portal_user_id))
    .map((user) => user.email);
};
const getAttendeeIdsByEmails = (emails = []) => {
  if (!Array.isArray(emails)) return [];
  return users.value
    .filter((user) => emails.includes(user.email))
    .map((user) => user.portal_user_id);
};

const editorData = ref({
  title: "",
  start_time: new Date(),
  end_time: new Date(),
  status: "scheduled",
  areaId: getDefaultAreaId(),
  roomId: getFirstRoomIdByArea(getDefaultAreaId()),
  priority: "Daily",
  participants: [],
  attendee_ids: [],
  cc_emails: "",
  extra_cc_emails: "",
  need_it_support: false,
});

// --- ADVANCED REAL-TIME COLLISION DETECTION ---
const socket = ref(null);
const activeDrafts = ref([]);
const unavailableRoomIds = ref([]);
const isRefreshing = ref(false);

const handleManualRefresh = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  
  // Call the actual data loading function
  await loadData();
  
  // Ensure the loading state lasts for exactly 1.5s for visual feedback
  setTimeout(() => {
    isRefreshing.value = false;
    triggerToast("success", "Đã cập nhật dữ liệu mới nhất.");
  }, 1500);
};

const checkAvailability = () => {
  if (!editorData.value.start_time || !editorData.value.end_time) return;

  const selectedStart = new Date(editorData.value.start_time).getTime();
  const selectedEnd = new Date(editorData.value.end_time).getTime();

  // Check Confirmed Bookings (simulated from local memory)
  const bookedRooms = scheduleDataList.value
    .filter((meeting) => {
      // Ignore if this is the meeting we are editing
      if (editorData.value.id && meeting.id === editorData.value.id)
        return false;

      const mStart = new Date(meeting.start_time).getTime();
      const mEnd = new Date(meeting.end_time).getTime();
      return mStart < selectedEnd && mEnd > selectedStart;
    })
    .map((m) => Number(m.roomId));

  // Check Temporary Socket Drafts
  const draftRooms = activeDrafts.value
    .filter((draft) => {
      if (draft.userId === portalUserId.value) return false; // Ignore our own drafts
      const dStart = new Date(draft.startTime).getTime();
      const dEnd = new Date(draft.endTime).getTime();
      return dStart < selectedEnd && dEnd > selectedStart;
    })
    .map((d) => Number(d.roomId));

  unavailableRoomIds.value = [...new Set([...bookedRooms, ...draftRooms])];

  // Auto-switch or clear if current room becomes unavailable
  if (
    editorData.value.roomId &&
    unavailableRoomIds.value.includes(Number(editorData.value.roomId))
  ) {
    const firstAvailable = filteredRoomData.value.find(
      (r) => !unavailableRoomIds.value.includes(Number(r.id)),
    );
    if (firstAvailable) {
      editorData.value.roomId = firstAvailable.id;
    } else {
      editorData.value.roomId = null;
    }
  }
};

watch(
  [
    () => editorData.value.start_time,
    () => editorData.value.end_time,
    () => editorData.value.roomId,
    () => editorData.value.areaId,
  ],
  () => {
    checkAvailability();

    if (
      socket.value &&
      editorData.value.roomId &&
      editorData.value.start_time &&
      editorData.value.end_time
    ) {
      socket.value.emit("draft_schedule", {
        roomId: editorData.value.roomId,
        date: moment(editorData.value.start_time).format("YYYY-MM-DD"),
        startTime: editorData.value.start_time,
        endTime: editorData.value.end_time,
        userId: portalUserId.value,
      });
    } else if (socket.value) {
      socket.value.emit("draft_schedule", null); // clear draft if incomplete
    }
  },
  { deep: true },
);

onMounted(() => {
  const config = useRuntimeConfig();
  const backendUrl = (config.public.apiBase || '').replace('/api', '');
  socket.value = io(backendUrl, { transports: ["websocket"] });

  socket.value.on("active_drafts_updated", (drafts) => {
    activeDrafts.value = drafts;
    checkAvailability();
  });

  socket.value.emit("get_active_drafts", (drafts) => {
    if (drafts) {
      activeDrafts.value = drafts;
      checkAvailability();
    }
  });

  socket.value.on("refresh_bookings", () => {
    console.log("[SOCKET] Received refresh_bookings signal");
    loadData();
    triggerToast("success", "Dữ liệu đã được cập nhật từ tab khác.");
  });
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
// ---------------------------------------------

const filteredRoomData = computed(() => {
  if (!editorData.value.areaId) return [];
  return getRoomsByArea(editorData.value.areaId).map((room) => ({
    id: room.id,
    name: room.name,
  }));
});

const onAreaChange = (args) => {
  const value =
    args && typeof args === "object" && "value" in args
      ? args.value
      : args && args.target
        ? args.target.value
        : null;
  const areaId = Number(value);
  editorData.value.areaId = areaId;
  editorData.value.roomId = getFirstRoomIdByArea(areaId);
};

const onRoomChange = (args) => {
  const value =
    args && typeof args === "object" && "value" in args
      ? args.value
      : args && args.target
        ? args.target.value
        : null;
  editorData.value.roomId = Number(value);
};

const onPriorityChange = (args) => {
  const value =
    args && typeof args === "object" && "value" in args
      ? args.value
      : args && args.target
        ? args.target.value
        : null;
  editorData.value.priority = value;
};

const formatDatePart = (date) => moment(date).format("YYYY-MM-DD");
const formatTimePart = (date) => moment(date).format("HH:mm");
const buildApiPayload = () => ({
  area_id: Number(editorData.value.areaId),
  attendee_ids: Array.isArray(editorData.value.attendee_ids)
    ? [...editorData.value.attendee_ids]
    : [],
  date: formatDatePart(editorData.value.start_time),
  end_time: formatTimePart(editorData.value.end_time),
  duration: String(Math.round((new Date(editorData.value.end_time) - new Date(editorData.value.start_time)) / 60000)),
  room_id: Number(editorData.value.roomId),
  start_time: formatTimePart(editorData.value.start_time),
  title: editorData.value.title || "",
  type: "internal",
  cc_emails: (editorData.value.extra_cc_emails || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)
    .join(", "),
  attendee_count: (editorData.value.attendee_ids || []).length || 1,
  need_it_support: !!editorData.value.need_it_support,
});

const toggleParticipant = (user) => {
  const portalUserId = user.portal_user_id;
  if (!Array.isArray(editorData.value.attendee_ids))
    editorData.value.attendee_ids = [];
  const idx = editorData.value.attendee_ids.indexOf(portalUserId);
  if (idx > -1) {
    editorData.value.attendee_ids = editorData.value.attendee_ids.filter(
      (id) => id !== portalUserId,
    );
  } else {
    editorData.value.attendee_ids.push(portalUserId);
  }
  editorData.value.participants = getEmailsByAttendeeIds(
    editorData.value.attendee_ids,
  );
  editorData.value.cc_emails = editorData.value.participants.join(", ");
};

const triggerToast = (type, message) => {
  if (!message) return;

  switch (type) {
    case "success":
      success(message);
      break;
    case "error":
      showError(message);
      break;
    case "warning":
      warning(message);
      break;
    default:
      info(message);
  }
};

const onPopupOpen = (args) => {
  if (args.type === "Editor") {
    const popupData = args.data || {};
    const eventId = popupData.id;
    const persistedRecord = scheduleDataList.value.find(
      (event) => event.id === eventId,
    );
    const source = persistedRecord || popupData;

    console.log("[DEBUG] Editor Opened:", {
      popupData,
      persistedRecord,
      source,
    });

    const normalizedAreaId = Number(source.areaId || getDefaultAreaId());
    const normalizedRoomId = Number(
      source.roomId || getFirstRoomIdByArea(normalizedAreaId),
    );
    const normalizedAttendeeIds = Array.isArray(source.attendee_ids)
      ? [...source.attendee_ids]
      : getAttendeeIdsByEmails(
          Array.isArray(source.participants) ? source.participants : [],
        );
    const normalizedParticipants = getEmailsByAttendeeIds(
      normalizedAttendeeIds,
    );

    editorData.value = {
      id: source.id,
      title: source.title || "",
      start_time: source.start_time || popupData.start_time || new Date(),
      end_time: source.end_time || popupData.end_time || new Date(),
      status: source.status || "scheduled",
      areaId: normalizedAreaId,
      roomId: normalizedRoomId,
      priority: source.priority || "Daily",
      participants: normalizedParticipants,
      attendee_ids: normalizedAttendeeIds,
      cc_emails: normalizedParticipants.join(", "),
      extra_cc_emails: (() => {
        const attendeeEmails = new Set(normalizedParticipants);
        return (source.cc_emails || "")
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e && !attendeeEmails.has(e))
          .join(", ");
      })(),
      need_it_support: source.need_it_support || false,
    };
  }
};

const validateEventDate = (date, isEdit = false) => {
  if (!date) return true;
  const threshold = moment().startOf("day").subtract(30, "days");
  const checkDate = moment(date);

  if (isEdit && checkDate.isBefore(threshold)) {
    triggerToast(
      "warning",
      "Edit blocked: This record was created more than 30 days ago.",
    );
    return false;
  }
  return true;
};

const onActionBegin = (args) => {
  if (args.requestType === "eventCreate" || args.requestType === "eventChange") {
    // Final check before allowing the action to proceed to completion
    checkAvailability();
    
    const data = Array.isArray(args.data) ? args.data[0] : args.data;
    const targetRoomId = Number(editorData.value.roomId || data.roomId);
    
    if (!targetRoomId) {
      triggerToast("error", "Vui lòng chọn phòng họp.");
      args.cancel = true;
      return;
    }
    
    if (unavailableRoomIds.value.includes(targetRoomId)) {
      triggerToast("error", "Phòng họp đã bị bận trong khung giờ này. Vui lòng kiểm tra lại.");
      args.cancel = true;
      return;
    }
    
    console.log("[VALIDATION] Action allowed:", args.requestType);
  }
};

const onActionComplete = async (args) => {
  const apiPayload = buildApiPayload();

  if (args.requestType === "eventCreated") {
    try {
      const resData = await useFetchAuth(`${apiBaseUrl}/v1/meetings/`, {
        method: "POST",
        body: apiPayload,
      });
      socket.value?.emit("booking_saved");
      triggerToast("success", "Đặt lịch họp thành công.");
      loadData();
    } catch (error) {
      if (error?.response?.status === 409) {
        triggerToast("error", "Xung đột lịch họp! Phòng đã được đặt bởi người khác.");
        loadData();
        return;
      }
      console.error("[API ERROR] Create failed:", error);
      triggerToast("error", "Đã xảy ra lỗi khi lưu lịch họp.");
      loadData();
    }
  } else if (args.requestType === "eventChanged") {
    const record = args.changedRecords[0];
    try {
      await useFetchAuth(`${apiBaseUrl}/v1/meetings/${record.id}`, {
        method: "PUT",
        body: apiPayload,
      });
      socket.value?.emit("booking_saved");
      triggerToast("success", "Cập nhật lịch họp thành công.");
      loadData();
    } catch (error) {
      if (error?.response?.status === 409) {
        triggerToast("error", "Xung đột lịch họp! Không thể cập nhật vì phòng đã bị bận.");
        loadData();
        return;
      }
      console.error("[API ERROR] Update failed:", error);
      triggerToast("error", "Lỗi khi cập nhật lịch họp.");
      loadData();
    }
  } else if (args.requestType === "eventRemoved") {
    const removed = args.deletedRecords[0];
    try {
      await useFetchAuth(`${apiBaseUrl}/v1/meetings/${removed.id}`, {
        method: "DELETE",
      });
      console.log("[API] Deleted Successfully");
      socket.value?.emit("booking_saved");
      triggerToast("warning", "Đã xóa lịch họp.");
    } catch (error) {
      console.error("[API ERROR] Delete failed:", error);
      triggerToast("error", "Lỗi khi xóa lịch họp.");
      loadData();
    }
  }
};

// --- ANALYTICS CALCULATIONS ---
const getWeekRange = (offsetWeeks = 0) => {
  const now = moment().startOf("isoWeek").add(offsetWeeks, "weeks");
  return { start: now.clone(), end: now.clone().endOf("isoWeek") };
};

const meetingsInRange = (start, end) =>
  scheduleDataList.value.filter((m) => {
    const d = moment(m.start_time);
    return d.isSameOrAfter(start) && d.isSameOrBefore(end);
  });

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const buildBarData = (meetings, weekStart) =>
  weekLabels.map((_, i) => {
    const day = weekStart.clone().add(i, "days").format("YYYY-MM-DD");
    return meetings.filter((m) => moment(m.start_time).format("YYYY-MM-DD") === day).length;
  });

const buildDoughnutData = (meetings) => {
  const counts = {};
  meetings.forEach((m) => {
    const room = rooms.value.find((r) => Number(r.id) === Number(m.roomId));
    const name = room?.name || `Room ${m.roomId}`;
    counts[name] = (counts[name] || 0) + 1;
  });
  return counts;
};

const CHART_COLORS = ["#10b981", "#14b8a6", "#84cc16", "#22c55e", "#6ee7b7", "#a3e635"];

// Current week
const currentWeekRange = computed(() => getWeekRange(0));
const currentWeekMeetings = computed(() =>
  meetingsInRange(currentWeekRange.value.start, currentWeekRange.value.end),
);
const currentWeekTotalDuration = computed(() =>
  currentWeekMeetings.value.reduce((sum, m) => {
    const diff = Math.round((new Date(m.end_time) - new Date(m.start_time)) / 60000);
    return sum + (diff > 0 ? diff : 0);
  }, 0),
);

const barChartData = computed(() => ({
  labels: weekLabels,
  datasets: [{
    label: "Cuộc họp",
    data: buildBarData(currentWeekMeetings.value, currentWeekRange.value.start),
    backgroundColor: "#10b981",
    borderRadius: 8,
  }],
}));

const doughnutChartData = computed(() => {
  const counts = buildDoughnutData(currentWeekMeetings.value);
  const labels = Object.keys(counts);
  return {
    labels,
    datasets: [{
      data: labels.map((l) => counts[l]),
      backgroundColor: CHART_COLORS.slice(0, labels.length),
      borderWidth: 0,
    }],
  };
});

// Previous week
const prevWeekRange = computed(() => getWeekRange(-1));
const prevWeekMeetings = computed(() =>
  meetingsInRange(prevWeekRange.value.start, prevWeekRange.value.end),
);
const prevWeekTotalDuration = computed(() =>
  prevWeekMeetings.value.reduce((sum, m) => {
    const diff = Math.round((new Date(m.end_time) - new Date(m.start_time)) / 60000);
    return sum + (diff > 0 ? diff : 0);
  }, 0),
);

const barChartDataPrev = computed(() => ({
  labels: weekLabels,
  datasets: [{
    label: "Cuộc họp",
    data: buildBarData(prevWeekMeetings.value, prevWeekRange.value.start),
    backgroundColor: "#64748b",
    borderRadius: 8,
  }],
}));

const doughnutChartDataPrev = computed(() => {
  const counts = buildDoughnutData(prevWeekMeetings.value);
  const labels = Object.keys(counts);
  return {
    labels,
    datasets: [{
      data: labels.map((l) => counts[l]),
      backgroundColor: CHART_COLORS.slice(0, labels.length),
      borderWidth: 0,
    }],
  };
});

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f3f4f6" } },
    x: { grid: { display: false } },
  },
};
const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } },
  cutout: "75%",
};

// --- ROOMS MANAGEMENT HANDLERS ---
const handleResourcesUpdate = ({
  areas: updatedAreas,
  rooms: updatedRooms,
}) => {
  areas.value = [...updatedAreas];
  rooms.value = [...updatedRooms];
  triggerToast("success", "Cập nhật tài nguyên thành công.");
};

const loadData = async () => {
  try {
    const [bookingsData, areasData, roomsData, membersData] = await Promise.all([
      fetchBookings(),
      fetchAreas(),
      fetchRooms(),
      fetchTenantMembers(),
    ]);

    if (areasData) areas.value = areasData;
    if (roomsData) rooms.value = roomsData;
    if (membersData) users.value = membersData;
    if (Array.isArray(bookingsData)) {
      const mappedData = mapApiToSchedule(bookingsData);
      scheduleDataList.value = mappedData;
      eventSettings.value = { ...eventSettings.value, dataSource: [...mappedData] };
      nextTick(() => {
        const instance = scheduleObj.value?.ej2Instances;
        if (instance) {
          instance.dataBind();
          instance.refreshEvents();
        }
      });
    }

    if (areas.value.length > 0 && !editorData.value.areaId) {
      editorData.value.areaId = getDefaultAreaId();
      editorData.value.roomId = getFirstRoomIdByArea(editorData.value.areaId);
    }
  } catch (error) {
    console.error("Critical error loading data:", error);
    triggerToast("error", "Không thể tải dữ liệu từ server.");
  }
};

// Tất cả fetch dùng useFetchAuth — gửi Bearer token tự động
const fetchBookings = async () => {
  try {
    const data = await useFetchAuth(`${apiBaseUrl}/v1/meetings/`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

const fetchAreas = async () => {
  try {
    return await useFetchAuth(`${apiBaseUrl}/v1/areas/`);
  } catch (error) {
    console.error("Error fetching areas:", error);
    return null;
  }
};

const fetchRooms = async () => {
  try {
    return await useFetchAuth(`${apiBaseUrl}/v1/rooms/`);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return null;
  }
};

// Lấy danh sách thành viên cùng tenant từ token — không lộ toàn bộ users
const fetchTenantMembers = async () => {
  try {
    return await useFetchAuth(`${apiBaseUrl}/v1/users/tenant-members`);
  } catch (error) {
    console.error("Error fetching tenant members:", error);
    return null;
  }
};

provide("schedule", [Day, Week, TimelineViews, Month]);

onMounted(async () => {
  await loadData();
  console.log(
    "Enterprise Scheduler — API Data Loaded:",
    scheduleDataList.value,
  );
  nextTick(() => {
    setTimeout(() => {
      const instance = scheduleObj.value?.ej2Instances;
      if (instance) {
        instance.dataBind();
        instance.refreshEvents();
        console.log("[FIX] Schedule refreshed — events repositioned");
      }
    }, 300);
  });
});
</script>

<style>
@import "@syncfusion/ej2-base/styles/material3.css";
@import "@syncfusion/ej2-vue-buttons/styles/material3.css";
@import "@syncfusion/ej2-vue-calendars/styles/material3.css";
@import "@syncfusion/ej2-vue-dropdowns/styles/material3.css";
@import "@syncfusion/ej2-vue-inputs/styles/material3.css";
@import "@syncfusion/ej2-vue-navigations/styles/material3.css";
@import "@syncfusion/ej2-vue-popups/styles/material3.css";
@import "@syncfusion/ej2-vue-schedule/styles/material3.css";

#app {
  height: 100vh !important;
  width: 100% !important;
}

.e-schedule {
  border: none !important;
  background: white !important;
}

.e-appointment {
  /* Thiết lập gradient dài gấp đôi: 
     Nửa trên là màu gốc (Emerald -> Teal -> Lime)
     Nửa dưới là màu đảo ngược (Lime -> Teal -> Emerald) */
  background-image: 
    /* Lớp bóng loáng (Glossy) */
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 50%
    ),
    /* Lớp màu chính: kéo dài gấp đôi chiều cao phần tử */
    linear-gradient(
        to bottom,
        #059669 0%,
        #45C895 25%,
        #86D41F 50%,
        /* Màu xuôi */ #86D41F 50%,
        #45C895 75%,
        #059669 100% /* Màu ngược */
      ) !important;

  /* Kích thước nền: chiều rộng 100%, chiều cao 200% */
  background-size: 100% 200% !important;
  /* Vị trí mặc định: hiển thị nửa trên */
  background-position: top center !important;

  /* Hiệu ứng chuyển cảnh 500ms */
  transition:
    background-position 500ms ease-in-out,
    transform 300ms ease !important;

  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  cursor: pointer;
}

.e-appointment:hover {
  /* Khi hover: đẩy nền lên để hiển thị nửa dưới (màu đảo ngược từ dưới lên) */
  background-position: bottom center !important;

  /* Thêm một chút hiệu ứng nổi khối khi hover */
  transform: translateY(-2px);
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.3) !important;
}

/* Override Editor Dialog Size & Borders */
.e-dialog.e-schedule-dialog {
  width: 80% !important;
  max-width: 1200px !important;
}
.e-dialog.e-schedule-dialog .e-dlg-content,
.e-dialog.e-schedule-dialog .e-dlg-header-content,
.e-dialog.e-schedule-dialog .e-footer-content {
  border: none !important;
}

/* Primary button */
.e-footer-content .e-btn.e-primary {
  background: #0f172a !important;
  border: none !important;
  color: white !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  transition: all 0.3s ease-in-out !important;
}
.e-footer-content .e-btn.e-primary:hover,
.e-schedule .e-month-view .e-current-date .e-date-header,
.e-schedule .e-month-agenda-view .e-current-date .e-date-header {
  background: #10b981 !important;
  box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39) !important;
  transform: translateY(-1px) !important;
}
.e-footer-content .e-btn.e-primary:active {
  transform: translateY(1px) !important;
  box-shadow: none !important;
}

/* Selected cell & calendar selected day — emerald gradient */
.e-schedule .e-month-view .e-selected-cell,
.e-schedule .e-month-agenda-view .e-selected-cell,
.e-schedule .e-timeline-view .e-selected-cell,
.e-schedule .e-timeline-month-view .e-selected-cell,
.e-schedule .e-vertical-view .e-selected-cell,
.e-schedule .e-vertical-month-view .e-selected-cell,
.e-calendar .e-content td.e-today.e-selected:hover span.e-day,
.e-calendar .e-content td.e-selected:hover span.e-day,
.e-calendar .e-content td.e-selected.e-focused-date span.e-day,
.e-bigger.e-small .e-calendar .e-content td.e-today.e-selected:hover span.e-day,
.e-bigger.e-small .e-calendar .e-content td.e-selected:hover span.e-day,
.e-bigger.e-small .e-calendar .e-content td.e-selected.e-focused-date span.e-day {
  background: linear-gradient(to bottom, #45C895 0%, #45C895 50%, #86D41F 100%) !important;
}

/* Today border */
.e-schedule .e-schedule-toolbar .e-toolbar-items.e-tbar-pos .e-toolbar-right .e-toolbar-item.e-active-view .e-tbar-btn,
.e-calendar .e-content td.e-today span.e-day {
  border: 1px solid #10b981 !important;
}

/* Emerald text — active view, current day, flat primary btn */
.e-schedule .e-schedule-toolbar .e-active-view .e-tbar-btn-text,
.e-schedule .e-schedule-toolbar .e-active-view .e-icons,
.e-btn.e-flat.e-primary,
.e-css.e-btn.e-flat.e-primary,
.e-schedule .e-vertical-view .e-header-cells.e-current-day,
.e-footer-content .e-btn.e-flat:not([DISABLED]),
.e-calendar .e-content td.e-today span.e-day,
.e-schedule .e-timeline-view .e-date-header-wrap table td.e-current-day,
.e-schedule .e-timeline-month-view .e-date-header-wrap table td.e-current-day,
.e-schedule .e-vertical-view .e-clone-time-indicator,
.e-schedule .e-vertical-view .e-current-time {
  color: #10b981 !important;
}

/* Current timeline */
.e-schedule .e-vertical-view .e-current-timeline,
.e-schedule .e-vertical-view .e-previous-timeline {
  border-top: 1px solid #10b981 !important;
}

.e-footer-content .e-btn:not(.e-primary) {
  transition: all 0.3s ease-in-out !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
}
.e-footer-content .e-btn:not(.e-primary):hover {
  background: #f1f5f9 !important;
  color: #334155 !important;
}

/* Minimal Syncfusion Fields */
.minimal-ej-field.e-control-wrapper {
  border: none !important;
  border-bottom: 2px solid #10b981 !important; /* slate-100 */
  background: transparent !important;
  transition: all 0.3s ease-in-out !important;
}
.minimal-ej-field.e-control-wrapper.e-input-focus {
  border-bottom: 2px solid #0f172a !important; /* slate-900 */
  box-shadow: none !important;
}
.minimal-ej-field.e-control-wrapper .e-input {
  font-size: 0.875rem !important; /* text-sm */
  font-weight: 700 !important; /* font-bold */
  color: #0f172a !important; /* slate-900 */
  padding-left: 4px !important;
  transition: all 0.3s ease-in-out !important;
}
.minimal-ej-field.e-control-wrapper:hover {
  border-bottom: 2px solid #cbd5e1 !important; /* slate-300 */
}
.minimal-ej-field.e-control-wrapper:hover .e-input-group-icon {
  color: #0f172a !important;
}

/* Custom Checkbox mapping */
.e-checkbox-wrapper .e-frame.e-check {
  background-color: #0f172a !important;
  border-color: #0f172a !important;
}

/* Custom Transitions */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-bounce-enter-active {
  animation: bounce-in 0.5s;
}
.modal-bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(40px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Scrollbars */
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

/* ── EJ2 DateTimePicker Time Popup ── */
.e-datetimepicker.e-popup.minimal-ej-field {
  border: 1px solid #10b981 !important;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.12) !important;
}
.e-datetimepicker.e-popup.minimal-ej-field .e-content {
  background-color: #ffffff !important;
}
.e-datetimepicker.e-popup.minimal-ej-field .e-list-item {
  color: #374151 !important;
  background-color: transparent !important;
}
.e-datetimepicker.e-popup.minimal-ej-field .e-list-item:hover {
  background-color: #d1fae5 !important;
  color: #065f46 !important;
}
.e-datetimepicker.e-popup.minimal-ej-field .e-list-item.e-active,
.e-datetimepicker.e-popup.minimal-ej-field .e-list-item.e-active:hover {
  background: linear-gradient(to bottom, #45C895 0%, #45C895 50%, #86D41F 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
}
</style>
