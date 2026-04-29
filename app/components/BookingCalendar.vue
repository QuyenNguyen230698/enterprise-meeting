<script setup>
import { ref, computed, onMounted, watch } from "vue";
import moment from "moment";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  rooms: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["selectSlot", "selectEvent", "update:modelValue"]);

// Calendar State
const currentWeekStart = ref(moment().startOf("week").add(1, "days")); // Start with Monday
const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 AM to 9:00 PM

const weekDays = computed(() => {
  const days = [];
  let start = currentWeekStart.value.clone();
  for (let i = 0; i < 7; i++) {
    days.push(start.clone().add(i, "days"));
  }
  return days;
});

const monthYearLabel = computed(() =>
  currentWeekStart.value.format("MMMM YYYY"),
);

// Navigation
const nextWeek = () => {
  currentWeekStart.value = currentWeekStart.value.clone().add(1, "week");
};
const prevWeek = () => {
  currentWeekStart.value = currentWeekStart.value.clone().subtract(1, "week");
};
const today = () => {
  currentWeekStart.value = moment().startOf("week").add(1, "days");
};

// Event Helpers
const getEventsForDay = (day) => {
  return props.modelValue.filter((event) => {
    return moment(event.start_time).isSame(day, "day");
  });
};

const getEventStyle = (event) => {
  const start = moment(event.start_time);
  const end = moment(event.end_time);

  const startHour = start.hours() + start.minutes() / 60;
  const duration = end.diff(start, "minutes") / 60;

  const top = (startHour - 7) * 80; // 80px per hour
  const height = duration * 80;

  let bgColor = "bg-blue-500/20 border-blue-500/50 text-blue-300";
  if (event.status === "hoàn thành") {
    bgColor = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
  }

  return {
    top: `${top}px`,
    height: `${height}px`,
    zIndex: 10,
  };
};

const handleSlotClick = (day, hour) => {
  const start = day.clone().hour(hour).minute(0).second(0);
  const end = start.clone().add(1, "hour");
  emit("selectSlot", { start: start.toDate(), end: end.toDate() });
};

const handleEventClick = (event) => {
  emit("selectEvent", event);
};
</script>

<template>
  <div
    class="flex flex-col h-full bg-slate-950 text-slate-200 select-none overflow-hidden border border-white/10 rounded-2xl shadow-2xl"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md"
    >
      <div class="flex items-center gap-6">
        <h2 class="text-xl font-bold tracking-tight text-white">
          {{ monthYearLabel }}
        </h2>
        <div
          class="flex items-center bg-slate-900 rounded-lg p-1 border border-white/10"
        >
          <button
            @click="prevWeek"
            class="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            @click="today"
            class="px-3 py-1 text-xs font-bold hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white uppercase tracking-widest border-x border-white/5"
          >
            Today
          </button>
          <button
            @click="nextWeek"
            class="p-1.5 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div
          class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
        >
          <span
            class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
          ></span>
          Room System Active
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grow overflow-auto relative custom-scrollbar">
      <div class="min-w-[800px] flex">
        <!-- Time Gutter -->
        <div
          class="w-20 border-r border-white/5 bg-slate-950/50 sticky left-0 z-20"
        >
          <div class="h-12 border-b border-white/5"></div>
          <!-- Corner space -->
          <div
            v-for="hour in hours"
            :key="hour"
            class="h-20 flex justify-center items-start pt-2 group relative"
          >
            <span
              class="text-xs font-bold text-slate-500 uppercase tracking-tighter"
              >{{ hour > 12 ? hour - 12 + " PM" : hour + " AM" }}</span
            >
            <div class="absolute right-0 top-0 w-2 h-px bg-white/10"></div>
          </div>
        </div>

        <!-- Days Columns -->
        <div class="grow flex">
          <div
            v-for="day in weekDays"
            :key="day.format()"
            class="grow min-w-[120px] border-r border-white/5 relative"
          >
            <!-- Day Header -->
            <div
              class="h-12 border-b border-white/5 flex flex-col items-center justify-center sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10"
              :class="{ 'bg-emerald-500/5': day.isSame(moment(), 'day') }"
            >
              <span
                class="text-xs font-bold uppercase tracking-widest"
                :class="
                  day.isSame(moment(), 'day')
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                "
                >{{ day.format("ddd") }}</span
              >
              <span
                class="text-sm font-black"
                :class="
                  day.isSame(moment(), 'day')
                    ? 'text-emerald-400'
                    : 'text-white'
                "
                >{{ day.date() }}</span
              >
            </div>

            <!-- Hour Grid -->
            <div class="relative bg-striped">
              <div
                v-for="hour in hours"
                :key="hour"
                @click="handleSlotClick(day, hour)"
                class="h-20 border-b border-white/5 hover:bg-white/5 transition-colors cursor-crosshair group relative"
              >
                <!-- Half hour line hint -->
                <div
                  class="absolute left-0 top-1/2 w-full h-px border-t border-white/3 pointer-events-none"
                ></div>
              </div>

              <!-- Events -->
              <div
                v-for="event in getEventsForDay(day)"
                :key="event.id"
                @click.stop="handleEventClick(event)"
                :style="getEventStyle(event)"
                class="absolute left-1 right-1 p-2 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 group overflow-hidden"
                :class="
                  event.status === 'hoàn thành'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                "
              >
                <div class="flex items-center justify-between">
                  <span
                    class="text-[9px] font-black uppercase tracking-tighter opacity-80"
                  >
                    {{ moment(event.start_time).format("HH:mm") }} -
                    {{ moment(event.end_time).format("HH:mm") }}
                  </span>
                  <div
                    class="w-1.5 h-1.5 rounded-full"
                    :class="
                      event.status === 'hoàn thành'
                        ? 'bg-emerald-400'
                        : 'bg-blue-400'
                    "
                  ></div>
                </div>

                <h4
                  class="text-xs font-bold leading-tight truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all"
                >
                  {{ event.title }}
                </h4>
                <div class="flex items-center gap-1 mt-auto">
                  <div
                    class="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold"
                  >
                    👤
                  </div>
                  <span class="text-[8px] font-medium opacity-60 truncate"
                    >Room: {{ event.room_id || event.roomId }}</span
                  >
                </div>

                <!-- Glassy overlay on hover -->
                <div
                  class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-striped {
  background-image: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.02) 1px,
    transparent 1px
  );
  background-size: 100% 40px;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
