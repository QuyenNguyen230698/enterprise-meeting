<template>
  <div
    id="app"
    class="h-full flex flex-col bg-zinc-50 overflow-hidden font-sans select-none"
  >
    <ToastContainer />

    <!-- Header -->
    <header class="bg-white shrink-0 z-20" style="box-shadow: 0 1px 0 #e4e4e7;">

      <!-- ── ROW 1: Brand · Filter bar ── -->
      <div class="h-11 px-6 flex items-center gap-3 border-b border-zinc-100">

        <!-- Brand -->
        <span class="text-xss font-black text-zinc-800 uppercase tracking-tight italic shrink-0">
          <span class="text-emerald-500">Enterprise</span>&nbsp;Meeting
        </span>

        <div class="w-px h-4 bg-zinc-200 shrink-0"></div>

        <!-- Search -->
        <div class="relative shrink-0">
          <i class="bi bi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xss pointer-events-none"></i>
          <input
            v-model="filterSearch"
            type="text"
            placeholder="Tìm cuộc họp..."
            class="h-7 w-44 pl-7 pr-3 text-xss font-medium border border-zinc-200 rounded-md bg-zinc-50 focus:bg-white focus:outline-none focus:border-emerald-400 placeholder:text-zinc-400 transition-all"
          />
        </div>

        <!-- Area -->
        <select
          v-model="filterAreaId"
          class="h-7 px-2 text-xss border border-zinc-200 rounded-md bg-zinc-50 focus:bg-white focus:outline-none focus:border-emerald-400 text-zinc-600 transition-all shrink-0 cursor-pointer"
        >
          <option value="">Tất cả khu vực</option>
          <option v-for="area in areaData" :key="area.id" :value="area.id">{{ area.name }}</option>
        </select>

        <!-- Room -->
        <select
          v-model="filterRoomId"
          class="h-7 px-2 text-xss border border-zinc-200 rounded-md bg-zinc-50 focus:bg-white focus:outline-none focus:border-emerald-400 text-zinc-600 transition-all shrink-0 cursor-pointer"
        >
          <option value="">Tất cả phòng</option>
          <option v-for="room in filterableRooms" :key="room.id" :value="room.id">{{ room.name }}</option>
        </select>

        <!-- IT Support -->
        <label
          class="h-7 flex items-center gap-1.5 px-2.5 border rounded-md text-xss font-semibold cursor-pointer select-none shrink-0 transition-all"
          :class="filterITSupport
            ? 'bg-teal-50 border-teal-300 text-teal-700'
            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'"
        >
          <input type="checkbox" v-model="filterITSupport" class="accent-teal-500 w-3 h-3" />
          <i class="bi bi-headset text-xss"></i>
          IT Support
        </label>

        <!-- Clear -->
        <button
          v-if="filterSearch || filterAreaId || filterRoomId || filterITSupport"
          @click="clearFilters"
          class="h-7 px-2.5 flex items-center gap-1 text-xss font-semibold text-zinc-400 hover:text-red-500 transition-colors shrink-0"
        >
          <i class="bi bi-x-circle text-xss"></i> Xóa filter
        </button>
      </div>

      <!-- ── ROW 2: Left actions · Center tabs · Right tools ── -->
      <div class="h-9 px-6 flex items-center">

        <!-- Left: Export + Find time -->
        <div class="flex items-center gap-1.5">

          <div class="relative" ref="exportRef">
            <button
              @click="exportOpen = !exportOpen"
              class="h-7 px-3 flex items-center gap-1.5 text-xss font-bold border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-600 transition-all"
            >
              <i class="bi bi-file-earmark-excel text-xss text-zinc-400"></i>
              Export Excel
              <i class="bi bi-chevron-down text-xss text-zinc-300"></i>
            </button>
            <Transition name="modal-bounce">
              <div v-if="exportOpen" class="absolute top-full mt-1 left-0 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden min-w-44">
                <div class="px-3 py-1.5 text-xss font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Theo khoảng thời gian</div>
                <button @click="exportExcel('day'); exportOpen = false" class="w-full px-4 py-2 text-left text-xss font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5">
                  <i class="bi bi-calendar-day text-emerald-500 text-xs w-3"></i> Hôm nay
                </button>
                <button @click="exportExcel('week'); exportOpen = false" class="w-full px-4 py-2 text-left text-xss font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5">
                  <i class="bi bi-calendar-week text-teal-500 text-xs w-3"></i> Tuần này
                </button>
                <button @click="exportExcel('month'); exportOpen = false" class="w-full px-4 py-2 text-left text-xss font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5">
                  <i class="bi bi-calendar-month text-lime-600 text-xs w-3"></i> Tháng này
                </button>
              </div>
            </Transition>
          </div>

          <button
            @click="showFindTimeModal = true"
            class="h-7 px-3 flex items-center gap-1.5 text-xss font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-all"
          >
            <i class="bi bi-magic text-xss"></i>
            Tìm giờ trống
          </button>
        </div>

        <!-- Center: Tabs (absolute center) -->
        <div class="flex-1 flex justify-center">
          <nav class="inline-flex items-center gap-px bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
            <button
              @click="activeTab = 'bookings'"
              :class="activeTab === 'bookings'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/60'"
              class="h-6 px-4 text-xss font-black uppercase tracking-widest rounded-md transition-all"
            >Meetings</button>
            <button
              @click="activeTab = 'room-view'"
              :class="activeTab === 'room-view'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/60'"
              class="h-6 px-4 text-xss font-black uppercase tracking-widest rounded-md transition-all"
            >Room View</button>
            <button
              @click="activeTab = 'analytics'"
              :class="activeTab === 'analytics'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-white/60'"
              class="h-6 px-4 text-xss font-black uppercase tracking-widest rounded-md transition-all"
            >Analytics</button>
          </nav>
        </div>

        <!-- Right: Sync + Resource Manager -->
        <div class="flex items-center gap-1.5">
          <button
            @click="handleManualRefresh"
            :disabled="isRefreshing"
            class="h-7 px-3 flex items-center gap-1.5 text-xss font-bold border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-600 hover:text-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Sync dữ liệu"
          >
            <i :class="['bi bi-arrow-clockwise text-sm', isRefreshing ? 'animate-spin text-emerald-500' : 'text-zinc-400']"></i>
            {{ isRefreshing ? 'Syncing...' : 'Sync' }}
          </button>

          <ResourceManagerDrawer
            :areas="areas"
            :rooms="rooms"
            @update="handleResourcesUpdate"
            @refresh="loadData"
            @toast="({ type, message }) => triggerToast(type, message)"
          />
        </div>
      </div>

      <!-- ── ROW 3: Room View controls (chỉ hiện khi tab room-view active) ── -->
      <Transition name="tab-fade">
        <div
          v-if="activeTab === 'room-view'"
          class="h-auto px-3 sm:px-6 py-2 border-t border-zinc-100 flex flex-col gap-1.5"
        >
          <!-- Controls row -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Week navigation -->
            <div class="flex items-center gap-1">
              <button @click="roomViewPrevWeek" class="w-7 h-7 flex items-center justify-center rounded-md border border-zinc-200 hover:border-emerald-400 hover:text-emerald-600 text-zinc-500 transition-all bg-white">
                <i class="bi bi-chevron-left text-xss"></i>
              </button>
              <span class="text-xs font-black text-zinc-800 min-w-36 sm:min-w-48 text-center select-none">{{ roomViewWeekLabel }}</span>
              <button @click="roomViewNextWeek" class="w-7 h-7 flex items-center justify-center rounded-md border border-zinc-200 hover:border-emerald-400 hover:text-emerald-600 text-zinc-500 transition-all bg-white">
                <i class="bi bi-chevron-right text-xss"></i>
              </button>
              <button @click="roomViewCurrentWeek" class="px-2 py-1 text-xss font-black border border-zinc-200 rounded-md hover:border-emerald-400 hover:text-emerald-600 text-zinc-500 bg-white transition-all">
                Hôm nay
              </button>
            </div>

            <div class="hidden sm:block h-4 w-px bg-zinc-200"></div>

            <!-- Area filter -->
            <select v-model="roomViewAreaFilter" class="h-7 px-2 text-xss font-bold border border-zinc-200 rounded-md bg-white focus:outline-none focus:border-emerald-400 text-zinc-700 transition-all cursor-pointer">
              <option value="">Tất cả khu vực</option>
              <option v-for="area in areaData" :key="area.id" :value="area.id">{{ area.name }}</option>
            </select>

            <!-- Stats chips -->
            <div class="hidden sm:flex items-center gap-1.5">
              <span class="px-2 py-0.5 text-xss font-black bg-zinc-100 text-zinc-600 rounded-full">
                {{ roomViewGrouped.reduce((s, g) => s + g.rooms.length, 0) }} phòng
              </span>
              <span class="px-2 py-0.5 text-xss font-black bg-emerald-50 text-emerald-700 rounded-full">
                {{ roomViewWeekMeetingCount }} cuộc họp tuần này
              </span>
            </div>

            <!-- Create button -->
            <button
              @click="rvOpenCreateEditor()"
              class="ml-auto flex items-center gap-1.5 h-7 px-3 text-xss font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-all shadow-sm shrink-0"
            >
              <i class="bi bi-plus-lg"></i>
              <p>Tạo cuộc họp</p>
            </button>
          </div>

          <!-- Legend row — scroll ngang trên mobile -->
          <div class="flex items-center gap-3 overflow-x-auto custom-scrollbar-x pb-0.5">
            <div class="flex items-center gap-1 text-xss font-bold text-zinc-400 shrink-0"><span class="w-2 h-2 rounded-sm inline-block" style="background:#64748b"></span>Đã lên lịch</div>
            <div class="flex items-center gap-1 text-xss font-bold text-zinc-400 shrink-0"><span class="w-2 h-2 rounded-sm inline-block" style="background:#2563eb"></span>Zoom</div>
            <div class="flex items-center gap-1 text-xss font-bold text-zinc-400 shrink-0"><span class="w-2 h-2 rounded-sm inline-block" style="background:#14b8a6"></span>Sắp bắt đầu</div>
            <div class="flex items-center gap-1 text-xss font-bold text-zinc-400 shrink-0"><span class="w-2 h-2 rounded-sm inline-block" style="background:#f59e0b"></span>Đang diễn ra / Chờ duyệt</div>
            <div class="flex items-center gap-1 text-xss font-bold text-zinc-400 shrink-0"><span class="w-2 h-2 rounded-sm inline-block" style="background:#10b981"></span>Đã check-in</div>
            <div class="flex items-center gap-1 text-xss font-bold text-zinc-400 shrink-0"><span class="w-2 h-2 rounded-sm inline-block" style="background:#ef4444"></span>Từ chối</div>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden relative">
      <!-- Analytics: v-if để unmount khi không dùng (chart nặng) -->
      <Transition mode="out-in" name="tab-fade">
        <!-- 1. ANALYTICS TAB -->
        <div
          v-if="activeTab === 'analytics'"
          class="h-full overflow-y-auto p-10 space-y-10 custom-scrollbar bg-zinc-50"
        >

          <!-- ── ANALYTICS CONTROLS ── -->
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="h-1 w-8 rounded-full bg-emerald-400 inline-block"></span>
              <h2 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em]">Analytics Dashboard</h2>
            </div>
            <div class="flex items-center gap-3">
              <!-- Range selector -->
              <div class="flex items-center bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  v-for="r in analyticsRanges"
                  :key="r.value"
                  @click="analyticsRange = r.value"
                  class="px-3 py-1.5 text-xss font-black uppercase tracking-wider transition-all"
                  :class="analyticsRange === r.value ? 'bg-emerald-500 text-white' : 'text-zinc-500 hover:text-zinc-900'"
                >{{ r.label }}</button>
              </div>
              <!-- Export dropdown -->
              <div class="relative" ref="analyticsExportRef">
                <button
                  @click="exportMenuOpen = !exportMenuOpen"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xss font-black uppercase tracking-widest bg-white border border-zinc-200 rounded-xl hover:border-emerald-400 text-zinc-600 transition-all shadow-sm"
                >
                  <i class="bi bi-file-earmark-excel"></i> Export Excel
                  <i class="bi bi-chevron-down text-xss"></i>
                </button>
                <Transition name="modal-bounce">
                  <div v-if="exportMenuOpen" class="absolute right-0 top-9 w-48 bg-white rounded-xl shadow-xl border border-zinc-200 z-50 overflow-hidden">
                    <div class="px-3 py-1.5 text-xss font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100">Theo khoảng thời gian</div>
                    <button @click="exportExcel('day'); exportMenuOpen = false" class="w-full flex items-center gap-2 px-4 py-2.5 text-xss font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                      <i class="bi bi-calendar-day text-emerald-500"></i> Hôm nay
                    </button>
                    <button @click="exportExcel('week'); exportMenuOpen = false" class="w-full flex items-center gap-2 px-4 py-2.5 text-xss font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                      <i class="bi bi-calendar-week text-teal-500"></i> Tuần này
                    </button>
                    <button @click="exportExcel('month'); exportMenuOpen = false" class="w-full flex items-center gap-2 px-4 py-2.5 text-xss font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                      <i class="bi bi-calendar-month text-lime-600"></i> Tháng này
                    </button>
                    <button @click="exportExcel('quarter'); exportMenuOpen = false" class="w-full flex items-center gap-2 px-4 py-2.5 text-xss font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                      <i class="bi bi-calendar3 text-violet-500"></i> Quý này
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- ── SUMMARY STATS (range-aware) ── -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              v-for="(stat, idx) in rangeStats"
              :key="idx"
              class="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group"
            >
              <div class="flex items-center justify-between mb-1.5">
                <p class="text-xss font-black text-zinc-400 uppercase tracking-widest">{{ stat.label }}</p>
                <i :class="['bi', stat.icon, `text-${stat.color}-400 text-sm`]"></i>
              </div>
              <div class="flex items-end gap-2">
                <h3 class="text-xl font-black text-zinc-900 group-hover:text-emerald-500 transition-colors tracking-tighter">{{ stat.val }}</h3>
                <span v-if="stat.delta !== null" class="text-xss font-black mb-0.5 flex items-center gap-0.5"
                  :class="stat.delta > 0 ? 'text-emerald-500' : stat.delta < 0 ? 'text-red-500' : 'text-zinc-400'">
                  <i :class="stat.delta > 0 ? 'bi-arrow-up-short' : stat.delta < 0 ? 'bi-arrow-down-short' : 'bi-dash'" class="bi"></i>
                  {{ stat.delta !== 0 ? Math.abs(stat.delta) + '%' : '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- ── CHARTS ROW 1: Bar + Doughnut ── -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-emerald-400">
                Tần suất đặt lịch ({{ analyticsRangeLabel }})
              </h4>
              <div class="h-56">
                <Bar :data="rangeBarChartData" :options="barChartOptions" />
              </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-teal-400">
                Phân bổ phòng họp ({{ analyticsRangeLabel }})
              </h4>
              <div class="h-56 flex items-center justify-center">
                <template v-if="rangeMeetings.length > 0">
                  <Doughnut :data="rangeDoughnutData" :options="doughnutChartOptions" />
                </template>
                <p v-else class="text-xss text-zinc-400 font-bold uppercase tracking-widest">Không có dữ liệu</p>
              </div>
            </div>
          </div>

          <!-- ── CHARTS ROW 2: Peak Hours Heatmap + Room Utilization ── -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Peak Hours Heatmap -->
            <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-5 pl-3 border-l-4 border-lime-400">
                Peak Hours · Giờ cao điểm
              </h4>
              <div class="flex flex-col gap-1.5">
                <div v-for="(row, hIdx) in peakHoursData" :key="hIdx" class="flex items-center gap-2">
                  <span class="w-10 text-right text-xss font-bold text-zinc-400 shrink-0">{{ row.hour }}</span>
                  <div class="flex-1 flex gap-0.5">
                    <div
                      v-for="(val, dIdx) in row.days"
                      :key="dIdx"
                      class="flex-1 rounded-sm h-5 transition-all"
                      :style="{ backgroundColor: heatmapColor(val, peakHoursMax), opacity: val === 0 ? 0.15 : 1 }"
                      :title="`${row.hour} ${weekLabels[dIdx]}: ${val} meetings`"
                    ></div>
                  </div>
                </div>
                <div class="flex items-center gap-2 mt-1 ml-12">
                  <span v-for="d in weekLabels" :key="d" class="flex-1 text-center text-xss font-bold text-zinc-400">{{ d }}</span>
                </div>
              </div>
            </div>

            <!-- Room Utilization Rate -->
            <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
              <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-5 pl-3 border-l-4 border-emerald-300">
                Room Utilization · Tỉ lệ sử dụng
              </h4>
              <div class="space-y-3">
                <div v-if="roomUtilization.length === 0" class="text-center py-6">
                  <p class="text-xss text-zinc-400 font-bold uppercase tracking-widest">Không có dữ liệu</p>
                </div>
                <div v-for="item in roomUtilization" :key="item.roomId" class="flex items-center gap-3">
                  <span class="w-28 text-xss font-bold text-zinc-600 truncate shrink-0">{{ item.name }}</span>
                  <div class="flex-1 bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-700"
                      :style="{ width: item.pct + '%', background: item.pct > 70 ? '#10b981' : item.pct > 40 ? '#14b8a6' : '#84cc16' }"
                    ></div>
                  </div>
                  <span class="w-10 text-right text-xss font-black"
                    :class="item.pct > 70 ? 'text-emerald-600' : item.pct > 40 ? 'text-teal-600' : 'text-lime-600'"
                  >{{ item.pct }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── TOP ORGANIZERS ── -->
          <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
            <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-5 pl-3 border-l-4 border-teal-300">
              Top Organizers · Người đặt phòng nhiều nhất
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-if="topOrganizers.length === 0" class="col-span-3 text-center py-4">
                <p class="text-xss text-zinc-400 font-bold uppercase tracking-widest">Không có dữ liệu</p>
              </div>
              <div
                v-for="(org, i) in topOrganizers.slice(0, 6)"
                :key="org.id"
                class="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 hover:border-emerald-200 transition-all"
              >
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-xss font-black shrink-0"
                  :class="i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-zinc-100 text-zinc-600' : 'bg-emerald-50 text-emerald-600'"
                >#{{ i + 1 }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-xss font-black text-zinc-800 truncate">{{ org.email }}</p>
                  <p class="text-xss text-zinc-400">{{ org.count }} cuộc họp</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── LEGACY WEEK COMPARISON (collapsible) ── -->
          <details class="group">
            <summary class="flex items-center gap-3 cursor-pointer list-none mb-5 select-none">
              <span class="h-1 w-8 rounded-full bg-zinc-300 inline-block"></span>
              <h3 class="text-xss font-black text-zinc-600 uppercase tracking-[0.2em]">So sánh Tuần này vs Tuần trước</h3>
              <i class="bi bi-chevron-down text-zinc-400 text-xs group-open:rotate-180 transition-transform"></i>
            </summary>

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
                v-for="(stat, idx) in currentWeekStats"
                :key="idx"
                class="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <p class="text-xss font-black text-zinc-400 uppercase tracking-widest">{{ stat.label }}</p>
                  <i :class="['bi', stat.icon, `text-${stat.color}-400 text-sm`]"></i>
                </div>
                <div class="flex items-end gap-2">
                  <h3 class="text-xl font-black text-zinc-900 group-hover:text-emerald-500 transition-colors tracking-tighter">
                    {{ stat.val }}
                  </h3>
                  <span
                    v-if="stat.delta !== null"
                    class="text-xss font-black mb-0.5 flex items-center gap-0.5"
                    :class="stat.delta > 0 ? 'text-emerald-500' : stat.delta < 0 ? 'text-red-500' : 'text-zinc-400'"
                  >
                    <i :class="stat.delta > 0 ? 'bi-arrow-up-short' : stat.delta < 0 ? 'bi-arrow-down-short' : 'bi-dash'" class="bi"></i>
                    {{ stat.delta !== 0 ? Math.abs(stat.delta) + '%' : 'Không đổi' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-emerald-400">
                  Tần suất đặt lịch họp (tuần này)
                </h4>
                <div class="h-56">
                  <Bar :data="barChartData" :options="barChartOptions" />
                </div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-teal-400">
                  Phân bổ phòng họp (tuần này)
                </h4>
                <div class="h-56 flex items-center justify-center">
                  <template v-if="currentWeekMeetings.length > 0">
                    <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
                  </template>
                  <p v-else class="text-xss text-zinc-400 font-bold uppercase tracking-widest">Không có dữ liệu</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── PREVIOUS WEEK ── -->
          <div>
            <div class="flex items-center gap-3 mb-5">
              <span class="h-1 w-8 rounded-full bg-zinc-400 inline-block"></span>
              <h3 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em]">
                Tuần trước &nbsp;
                <span class="text-zinc-400 font-medium normal-case tracking-normal">
                  {{ prevWeekRange.start.format("DD/MM") }} – {{ prevWeekRange.end.format("DD/MM/YYYY") }}
                </span>
              </h3>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div
                v-for="(stat, idx) in prevWeekStats"
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
                  Tần suất đặt lịch họp (tuần trước)
                </h4>
                <div class="h-56">
                  <Bar :data="barChartDataPrev" :options="barChartOptions" />
                </div>
              </div>
              <div class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
                <h4 class="text-xss font-black text-zinc-900 uppercase tracking-[0.2em] mb-6 pl-3 border-l-4 border-zinc-300">
                  Phân bổ phòng họp (tuần trước)
                </h4>
                <div class="h-56 flex items-center justify-center">
                  <template v-if="prevWeekMeetings.length > 0">
                    <Doughnut :data="doughnutChartDataPrev" :options="doughnutChartOptions" />
                  </template>
                  <p v-else class="text-xss text-zinc-400 font-bold uppercase tracking-widest">Không có dữ liệu</p>
                </div>
              </div>
            </div>
          </div>

          </details>
        </div>
      </Transition>

      <!-- 2. BOOKINGS TAB — ẩn bằng opacity+pointer-events, KHÔNG dùng display:none để EJS scheduler luôn có kích thước -->
      <div
        class="h-full bg-white flex flex-col absolute inset-0 transition-opacity duration-150"
        :class="activeTab === 'bookings' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'"
      >

          <!-- ── FIND TIME MODAL ── -->
          <Teleport to="body">
          <Transition name="modal-bounce">
            <div
              v-if="showFindTimeModal"
              class="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm"
              @click.self="showFindTimeModal = false"
            >
              <div class="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-lg mx-4 overflow-hidden">
                <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <div class="flex items-center gap-2">
                    <i class="bi bi-magic text-emerald-600"></i>
                    <h3 class="text-sm font-black text-emerald-800 uppercase tracking-widest">Find Available Time</h3>
                  </div>
                  <button @click="showFindTimeModal = false" class="text-zinc-400 hover:text-zinc-700 transition-colors">
                    <i class="bi bi-x-lg text-sm"></i>
                  </button>
                </div>

                <div class="p-6 space-y-4">
                  <!-- Attendee selector -->
                  <div>
                    <label class="block text-xss font-black text-zinc-500 uppercase tracking-widest mb-2">Chọn người tham dự</label>
                    <div class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto custom-scrollbar pr-1">
                      <label
                        v-for="user in otherUsers"
                        :key="user.portal_user_id"
                        class="px-2.5 py-1 text-xss font-bold rounded-full border cursor-pointer transition-all"
                        :class="findTimeAttendees.includes(user.portal_user_id)
                          ? 'bg-emerald-500 text-white border-transparent'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-emerald-400'"
                      >
                        <input type="checkbox" class="hidden" :checked="findTimeAttendees.includes(user.portal_user_id)" @change="toggleFindTimeAttendee(user.portal_user_id)" />
                        {{ user.email }}
                      </label>
                    </div>
                  </div>

                  <!-- Duration & date -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xss font-black text-zinc-500 uppercase tracking-widest mb-1">Thời lượng (phút)</label>
                      <select v-model="findTimeDuration" class="w-full px-3 py-2 text-xs font-bold border border-zinc-200 rounded-lg focus:outline-none focus:border-emerald-400 bg-white">
                        <option :value="30">30 phút</option>
                        <option :value="60">1 giờ</option>
                        <option :value="90">1.5 giờ</option>
                        <option :value="120">2 giờ</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xss font-black text-zinc-500 uppercase tracking-widest mb-1">Từ ngày</label>
                      <input type="date" v-model="findTimeFromDate" class="w-full px-3 py-2 text-xs font-bold border border-zinc-200 rounded-lg focus:outline-none focus:border-emerald-400 bg-white" />
                    </div>
                  </div>

                  <button
                    @click="runFindTime"
                    class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xss font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <i class="bi bi-search"></i> Tìm khung giờ trống
                  </button>

                  <!-- Results -->
                  <div v-if="findTimeResults.length > 0" class="space-y-2">
                    <p class="text-xss font-black text-zinc-400 uppercase tracking-widest">Gợi ý {{ findTimeResults.length }} khung giờ phù hợp</p>
                    <div
                      v-for="(slot, i) in findTimeResults"
                      :key="i"
                      @click="applyFindTimeSlot(slot)"
                      class="flex items-center justify-between px-4 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl cursor-pointer transition-all group"
                    >
                      <div>
                        <p class="text-xs font-black text-emerald-800">{{ slot.dateLabel }}</p>
                        <p class="text-xss text-emerald-600 font-bold">{{ slot.startLabel }} – {{ slot.endLabel }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xss font-bold text-zinc-500">{{ slot.roomName }}</p>
                        <i class="bi bi-arrow-right text-emerald-500 group-hover:translate-x-1 transition-transform inline-block text-sm mt-0.5"></i>
                      </div>
                    </div>
                  </div>
                  <p v-else-if="findTimeRan" class="text-xss text-zinc-400 text-center font-bold py-2">Không tìm thấy khung giờ trống phù hợp.</p>
                </div>
              </div>
            </div>
          </Transition>
          </Teleport>
          <!-- Scheduler fills remaining space, filter bar is absolute at bottom -->
          <div id="container" class="w-full grow overflow-hidden relative">
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
                :eventSettings="filteredEventSettings"
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

                <template v-slot:quickInfoContent="{ data }">
                  <!-- Cell popup (click ô trống): chỉ hiện nút tạo mới -->
                  <div v-if="!data.id" class="min-w-72 bg-white">
                    <div class="flex items-center justify-between px-4 pt-4 pb-3 border-b border-zinc-100">
                      <div class="flex items-center gap-2">
                        <i class="bi bi-calendar-plus text-emerald-500"></i>
                        <span class="text-sm font-black text-zinc-700">Tạo cuộc họp mới</span>
                      </div>
                      <button
                        class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all"
                        @click="scheduleObj?.ej2Instances?.closeQuickInfoPopup()"
                      ><i class="bi bi-x-lg text-xs"></i></button>
                    </div>
                    <div class="px-4 py-3 text-xss text-zinc-500">
                      <div class="flex items-center gap-1.5 mb-3">
                        <i class="bi bi-clock text-emerald-500"></i>
                        <span class="font-bold text-zinc-700">{{ formatQuickTime(data.startTime || data.start_time) }} – {{ formatQuickTime(data.endTime || data.end_time) }}</span>
                      </div>
                      <button
                        @click="scheduleObj?.ej2Instances?.openEditor(data, 'Add')"
                        class="w-full py-1.5 text-xss font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <i class="bi bi-plus-lg"></i> Tạo cuộc họp
                      </button>
                    </div>
                  </div>

                  <!-- Event popup (click event có sẵn): full info -->
                  <div v-else class="min-w-80 max-w-88 bg-white overflow-hidden">

                    <!-- Header strip -->
                    <div class="px-4 pt-4 pb-3 border-b border-zinc-100">
                      <div class="flex items-start justify-between gap-2 mb-2">
                        <h4 class="text-sm font-black text-zinc-900 leading-snug">{{ data.title || 'Cuộc họp' }}</h4>
                        <div class="flex items-center gap-1.5 shrink-0">
                          <!-- Approval badge -->
                          <span v-if="data.status"
                            class="px-2 py-0.5 text-xss font-black rounded-full uppercase tracking-wider flex items-center gap-1"
                            :class="{
                              'bg-amber-100 text-amber-700': data.status === 'pending',
                              'bg-emerald-100 text-emerald-700': data.status === 'approved',
                              'bg-red-100 text-red-700': data.status === 'rejected',
                            }">
                            <i class="bi text-xss" :class="{
                              'bi-hourglass-split': data.status === 'pending',
                              'bi-check-circle-fill': data.status === 'approved',
                              'bi-x-circle-fill': data.status === 'rejected',
                            }"></i>
                            {{ { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' }[data.status] }}
                          </span>
                          <!-- Zoom / Offline badge -->
                          <span
                            class="px-2 py-0.5 text-xss font-black rounded-full uppercase tracking-wider"
                            :class="data.zoomUrl ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500'"
                          >{{ data.zoomUrl ? 'Zoom' : 'Offline' }}</span>
                        </div>
                      </div>

                      <!-- Time row -->
                      <div class="flex items-center gap-1.5 text-xs">
                        <i class="bi bi-clock-fill text-emerald-500 text-xss"></i>
                        <span class="font-bold text-zinc-800">{{ formatQuickTime(data.start_time) }} – {{ formatQuickTime(data.end_time) }}</span>
                        <span class="text-zinc-400 font-medium">· {{ formatDuration(data.start_time, data.end_time) }}</span>
                        <!-- Meeting status dot -->
                        <span class="ml-auto flex items-center gap-1 font-bold text-xss" :class="getMeetingStatusColor(data.start_time, data.end_time, data.checkedIn)">
                          <i class="bi bi-circle-fill text-xss"></i>
                          {{ getMeetingStatusLabel(data.start_time, data.end_time, data.checkedIn) }}
                        </span>
                      </div>
                    </div>

                    <!-- Body -->
                    <div class="px-4 py-3 space-y-2.5 text-xss text-zinc-600">

                      <!-- Location -->
                      <div v-if="getAreaName(data.areaId) || getRoomName(data.roomId)" class="flex items-start gap-2">
                        <i class="bi bi-geo-alt-fill text-teal-500 mt-0.5 shrink-0"></i>
                        <div class="leading-snug">
                          <span v-if="getAreaName(data.areaId)" class="text-zinc-500">{{ getAreaName(data.areaId) }}</span>
                          <span v-if="getAreaName(data.areaId) && getRoomName(data.roomId)" class="text-zinc-300 mx-1">/</span>
                          <span v-if="getRoomName(data.roomId)" class="font-bold text-zinc-800">{{ getRoomName(data.roomId) }}</span>
                          <span v-if="getRoomCapacity(data.roomId)" class="text-zinc-400 ml-1">({{ getRoomCapacity(data.roomId) }} người)</span>
                        </div>
                      </div>

                      <!-- Tags row: IT support + Recurrence -->
                      <div v-if="data.need_it_support || data.recurrenceRule" class="flex flex-wrap gap-1.5">
                        <span v-if="data.need_it_support"
                          class="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full font-bold">
                          <i class="bi bi-headset text-xss"></i> Hỗ trợ IT
                        </span>
                        <span v-if="data.recurrenceRule"
                          class="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full font-bold">
                          <i class="bi bi-arrow-repeat text-xss"></i> {{ formatRecurrenceLabel(data.recurrenceRule) }}
                        </span>
                      </div>

                      <!-- Zoom link -->
                      <div v-if="data.zoomUrl" class="flex items-center gap-2">
                        <i class="bi bi-camera-video-fill text-blue-500 shrink-0"></i>
                        <a :href="data.zoomUrl" target="_blank"
                          class="text-blue-600 hover:text-blue-800 font-bold underline truncate">Tham gia Zoom</a>
                      </div>

                      <!-- Attendees -->
                      <div v-if="data.attendee_ids && data.attendee_ids.length > 0" class="flex items-start gap-2">
                        <i class="bi bi-people-fill text-emerald-500 mt-0.5 shrink-0"></i>
                        <div class="flex flex-wrap gap-1">
                          <span
                            v-for="email in getAttendeeEmails(data.attendee_ids)"
                            :key="email"
                            class="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium"
                          >{{ email }}</span>
                        </div>
                      </div>

                      <!-- Description -->
                      <div v-if="data.description" class="flex items-start gap-2 pt-1 border-t border-zinc-100">
                        <i class="bi bi-journal-text text-zinc-400 mt-0.5 shrink-0"></i>
                        <p class="text-zinc-500 leading-relaxed line-clamp-3">{{ data.description }}</p>
                      </div>
                    </div>

                    <!-- Footer actions -->
                    <div v-if="(data.status === 'pending' && isAdmin) || isCheckInWindow(data.start_time, data.end_time)"
                      class="px-4 pb-4 pt-2 border-t border-zinc-100 space-y-2">

                      <!-- Admin approve/reject -->
                      <div v-if="data.status === 'pending' && isAdmin" class="flex gap-2">
                        <button @click="approveBooking(data.id)"
                          class="flex-1 py-1.5 text-xss font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all flex items-center justify-center gap-1">
                          <i class="bi bi-check-lg"></i> Duyệt
                        </button>
                        <button @click="rejectBooking(data.id)"
                          class="flex-1 py-1.5 text-xss font-black uppercase tracking-widest bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all flex items-center justify-center gap-1">
                          <i class="bi bi-x-lg"></i> Từ chối
                        </button>
                      </div>

                      <!-- Check-in -->
                      <button v-if="isCheckInWindow(data.start_time, data.end_time)"
                        @click="handleCheckIn(data)"
                        class="w-full py-1.5 text-xss font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                        :class="data.checkedIn
                          ? 'bg-zinc-100 text-zinc-500 cursor-default'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'"
                        :disabled="data.checkedIn"
                      >
                        <i :class="data.checkedIn ? 'bi-check-circle-fill' : 'bi-box-arrow-in-right'" class="bi"></i>
                        {{ data.checkedIn ? 'Đã check-in' : 'Check In' }}
                      </button>
                    </div>

                    <!-- Edit button always visible for existing events -->
                    <div class="px-4 pb-4 pt-0">
                      <button
                        @click="scheduleObj?.ej2Instances?.openEditor(data, 'Edit')"
                        class="w-full py-1.5 text-xss font-black uppercase tracking-widest border border-zinc-200 hover:border-emerald-400 hover:text-emerald-600 text-zinc-500 rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <i class="bi bi-pencil-square"></i> Chỉnh sửa
                      </button>
                    </div>
                  </div>
                </template>

                <template v-slot:editorTemplate>
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
                        {{ editorData.id ? "Edit Appointment" : "New Appointment" }}
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
                              {{ room.name }}{{ room.capacity ? ` (${room.capacity} người)` : '' }}
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
                          <p
                            v-if="capacityWarning"
                            class="text-xss text-amber-600 mt-1.5 flex items-center gap-1 font-bold"
                          >
                            <i class="bi bi-people-fill"></i> {{ capacityWarning }}
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
                          <label class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1 overflow-hidden">Start Time</label>
                          <ejs-datetimepicker
                            v-model="editorData.start_time"
                            format="dd/MM/yyyy HH:mm"
                            cssClass="minimal-ej-field"
                          ></ejs-datetimepicker>
                        </div>
                        <div>
                          <label class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1 overflow-hidden">End Time</label>
                          <ejs-datetimepicker
                            v-model="editorData.end_time"
                            format="dd/MM/yyyy HH:mm"
                            cssClass="minimal-ej-field"
                          ></ejs-datetimepicker>
                        </div>
                      </div>

                      <!-- Recurring -->
                      <div class="mt-4 pt-3 border-t border-emerald-50 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1">Repeat</label>
                          <select
                            v-model="editorData.recurrenceType"
                            class="w-full border-b-2 border-emerald-100 bg-transparent px-1 py-2 text-sm font-bold text-emerald-900 focus:outline-none focus:border-emerald-600"
                          >
                            <option value="">Không lặp</option>
                            <option value="DAILY">Hằng ngày</option>
                            <option value="WEEKLY">Hằng tuần</option>
                            <option value="MONTHLY">Hằng tháng</option>
                          </select>
                        </div>
                        <div v-if="editorData.recurrenceType">
                          <label class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-1">Ends On</label>
                          <input
                            type="date"
                            v-model="editorData.recurrenceEndDate"
                            class="w-full border-b-2 border-emerald-100 bg-transparent px-1 py-2 text-sm font-bold text-emerald-900 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>
                      <!-- Recurring preview badge -->
                      <p v-if="recurrencePreview" class="mt-2 text-xss text-teal-600 font-bold flex items-center gap-1">
                        <i class="bi bi-arrow-repeat"></i> {{ recurrencePreview }}
                      </p>
                    </div>

                    <!-- Timezone Card -->
                    <div class="bg-white px-4 py-3 rounded-lg shadow-[0_6px_18px_rgba(16,185,129,0.10)] border border-emerald-100 flex items-center justify-between gap-4">
                      <div class="flex items-center gap-2">
                        <i class="bi bi-globe text-teal-500 text-sm"></i>
                        <span class="text-xss font-black text-emerald-700 uppercase tracking-widest">Timezone</span>
                      </div>
                      <select
                        v-model="editorData.timezone"
                        class="flex-1 border-b-2 border-emerald-100 bg-transparent px-1 py-1 text-xs font-bold text-emerald-900 focus:outline-none focus:border-emerald-600 max-w-xs"
                      >
                        <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
                      </select>
                      <span v-if="editorData.timezone && editorData.start_time" class="text-xss text-zinc-400 font-bold shrink-0">
                        {{ formatInTimezone(editorData.start_time, editorData.timezone) }}
                      </span>
                    </div>

                    <!-- Agenda / Description Card -->
                    <div class="bg-white p-4 rounded-lg shadow-[0_6px_18px_rgba(16,185,129,0.10)] border border-emerald-100">
                      <label class="block text-xss font-black text-emerald-700 uppercase tracking-widest mb-2">Agenda / Notes</label>
                      <textarea
                        v-model="editorData.description"
                        rows="3"
                        placeholder="Mục tiêu, chủ đề, tài liệu cần chuẩn bị..."
                        class="w-full border-b-2 border-emerald-100 bg-transparent px-1 py-1 text-xs font-medium text-emerald-900 focus:outline-none focus:border-emerald-600 placeholder:text-emerald-300 resize-none transition-all leading-relaxed"
                      ></textarea>
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
                          CC ngoài hệ thống
                        </label>
                        <input
                          v-model="editorData.extra_cc_emails"
                          type="text"
                          placeholder="check@gmail.com, test@gmail.com, ..."
                          class="w-full border-b-2 border-emerald-100 bg-transparent px-1 py-1 text-xs font-medium text-emerald-900 focus:outline-none focus:border-emerald-500 placeholder:text-emerald-300 transition-all"
                        />
                        <p class="text-zinc-400 text-xss mt-0.5">Nhập nhiều email, cách nhau bằng dấu phẩy</p>
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

      <!-- 3. ROOM VIEW TAB -->
      <div
        class="h-full bg-zinc-50 flex flex-col overflow-hidden absolute inset-0 transition-opacity duration-150"
        :class="activeTab === 'room-view' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'"
      >
          <!-- ── ROOM VIEW MATRIX ── -->
          <div ref="rvScrollContainer" class="flex-1 overflow-auto custom-scrollbar" @click="hideRvTooltip">
            <div class="min-w-max">

              <!-- Sticky header: room col + day/hour columns -->
              <div class="flex sticky top-0 z-20 bg-white border-b border-zinc-200 shadow-sm">
                <div class="w-44 shrink-0 border-r border-zinc-200 bg-zinc-50 flex items-end px-3 pb-1 sticky left-0 z-30">
                  <span class="text-xss font-black text-zinc-400 uppercase tracking-widest">Phòng họp</span>
                </div>
                <div
                  v-for="(day, dIdx) in roomViewWeekDays"
                  :key="dIdx"
                  :ref="day.isToday ? 'rvTodayCol' : undefined"
                  class="flex-1 min-w-64 border-r border-zinc-100 last:border-r-0"
                >
                  <!-- Day label -->
                  <div class="px-2 py-1.5 text-center border-b border-zinc-100" :class="day.isToday ? 'bg-emerald-50' : 'bg-white'">
                    <p class="text-xss font-black uppercase tracking-widest" :class="day.isToday ? 'text-emerald-600' : 'text-zinc-400'">{{ day.dayLabel }}</p>
                    <p class="text-sm font-black leading-none mt-0.5" :class="day.isToday ? 'text-emerald-700' : 'text-zinc-800'">{{ day.dateLabel }}</p>
                  </div>
                  <!-- Hour ticks -->
                  <div class="flex">
                    <div
                      v-for="h in roomViewHours"
                      :key="h"
                      class="flex-1 text-center py-0.5 border-r border-zinc-50 last:border-r-0"
                      style="min-width: 40px;"
                    >
                      <span class="text-xss font-bold" :class="day.isToday && h === roomViewNow.hours() ? 'text-red-400' : 'text-zinc-300'">
                        {{ String(h).padStart(2,'0') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Area groups -->
              <div v-for="areaGroup in roomViewGrouped" :key="areaGroup.id">

                <!-- Area row header -->
                <div class="flex bg-linear-to-r from-zinc-100 to-zinc-50 border-b border-zinc-200 border-t border-t-zinc-200">
                  <div class="w-44 shrink-0 px-3 py-1.5 flex items-center gap-2 border-r border-zinc-200 sticky left-0 z-10 bg-zinc-100">
                    <i class="bi bi-building-fill text-emerald-500 text-xss"></i>
                    <span class="text-xss font-black text-zinc-700 uppercase tracking-widest">{{ areaGroup.name }}</span>
                    <span class="ml-auto text-xss font-bold text-zinc-400">{{ areaGroup.rooms.length }} phòng</span>
                  </div>
                  <!-- Area summary: meeting count per day -->
                  <div
                    v-for="(day, dIdx) in roomViewWeekDays"
                    :key="dIdx"
                    class="flex-1 min-w-64 border-r border-zinc-100 last:border-r-0 flex items-center justify-center"
                    :class="day.isToday ? 'bg-emerald-50/40' : ''"
                  >
                    <span
                      v-if="areaGroup.rooms.reduce((s,r) => s + getRoomDayMeetings(r.id, day.date).length, 0) > 0"
                      class="text-xss font-black text-zinc-400"
                    >
                      {{ areaGroup.rooms.reduce((s,r) => s + getRoomDayMeetings(r.id, day.date).length, 0) }} cuộc họp
                    </span>
                  </div>
                </div>

                <!-- Room rows -->
                <div
                  v-for="room in areaGroup.rooms"
                  :key="room.id"
                  class="flex border-b border-zinc-100 hover:bg-white/60 transition-colors group"
                  style="height: 56px;"
                >
                  <!-- Room label -->
                  <div class="w-44 shrink-0 px-3 flex flex-col justify-center border-r border-zinc-200 bg-white group-hover:bg-zinc-50 transition-colors sticky left-0 z-10">
                    <div class="flex items-center gap-1.5">
                      <!-- Trạng thái phòng: đang có cuộc họp hôm nay giờ này -->
                      <span
                        class="w-1.5 h-1.5 rounded-full shrink-0"
                        :class="getRoomDayMeetings(room.id, moment().format('YYYY-MM-DD')).some(m => Date.now() >= new Date(m.start_time) && Date.now() <= new Date(m.end_time))
                          ? 'bg-red-400'
                          : 'bg-emerald-400'"
                      ></span>
                      <span class="text-xss font-black text-zinc-800 truncate">{{ room.name }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span v-if="room.capacity" class="text-xss text-zinc-400 font-medium">
                        <i class="bi bi-people-fill text-xss"></i> {{ room.capacity }}
                      </span>
                      <span v-if="room.need_it_support || room.has_it_support" class="text-xss text-teal-500 font-bold">
                        <i class="bi bi-headset text-xss"></i> IT
                      </span>
                    </div>
                  </div>

                  <!-- Day cells -->
                  <div
                    v-for="(day, dIdx) in roomViewWeekDays"
                    :key="dIdx"
                    class="flex-1 min-w-64 border-r border-zinc-100 last:border-r-0 relative overflow-hidden"
                    :class="day.isToday ? 'bg-emerald-50/20' : 'bg-white'"
                  >
                    <!-- Hour grid lines -->
                    <div class="absolute inset-0 flex pointer-events-none">
                      <div
                        v-for="h in roomViewHours"
                        :key="h"
                        class="flex-1 border-r border-zinc-100 last:border-r-0"
                        style="min-width: 40px;"
                      ></div>
                    </div>

                    <!-- Current time indicator (chỉ hiện hôm nay, khi giờ trong range) -->
                    <div
                      v-if="day.isToday && roomViewNowPct !== null"
                      class="absolute top-0 bottom-0 w-px bg-red-400 z-10 pointer-events-none"
                      :style="{ left: roomViewNowPct + '%' }"
                    >
                      <div class="w-2 h-2 rounded-full bg-red-400 absolute -top-1 -translate-x-1/2"></div>
                    </div>

                    <!-- Meeting blocks -->
                    <div
                      v-for="meeting in getRoomDayMeetings(room.id, day.date)"
                      :key="meeting.id"
                      class="absolute top-1.5 bottom-1.5 rounded text-xss font-bold text-white px-1.5 overflow-hidden cursor-pointer transition-all shadow-sm flex items-center gap-1 hover:brightness-110 hover:shadow-md hover:-translate-y-px"
                      :style="getMeetingBlockStyle(meeting)"
                      @click.stop="showRvTooltip($event, meeting)"
                    >
                      <!-- Recurring icon -->
                      <i v-if="meeting.recurrenceRule" class="bi bi-arrow-repeat shrink-0 text-xss opacity-80"></i>
                      <!-- IT support dot -->
                      <i v-if="meeting.need_it_support" class="bi bi-headset shrink-0 text-xss opacity-80"></i>
                      <span class="truncate leading-tight">{{ meeting.title }}</span>
                      <span class="shrink-0 opacity-75 hidden group-hover:inline">{{ formatQuickTime(meeting.start_time) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div v-if="roomViewGrouped.length === 0" class="flex items-center justify-center py-24">
                <div class="text-center">
                  <i class="bi bi-building text-zinc-200 text-5xl"></i>
                  <p class="text-xss text-zinc-400 font-black uppercase tracking-widest mt-3">Không có phòng nào</p>
                  <p class="text-xss text-zinc-300 font-medium mt-1">Thêm khu vực / phòng trong Resource Manager</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── ROOM VIEW TOOLTIP POPUP ── -->
          <Teleport to="body">
            <Transition name="modal-bounce">
              <div
                v-if="rvTooltip"
                class="fixed z-9999 pointer-events-auto"
                :style="rvTooltipStyle"
                @click.stop
              >
                <div class="w-80 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">

                  <!-- Header strip (màu theo status) -->
                  <div
                    class="px-4 pt-3 pb-2.5 border-b border-zinc-100"
                    :style="{ borderTop: `3px solid ${getMeetingBlockColor(rvTooltip.meeting).border}` }"
                  >
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                      <h4 class="text-sm font-black text-zinc-900 leading-snug flex-1">{{ rvTooltip.meeting.title || 'Cuộc họp' }}</h4>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <!-- Status badge -->
                        <span class="px-2 py-0.5 text-xss font-black rounded-full uppercase tracking-wider flex items-center gap-1"
                          :class="{
                            'bg-amber-100 text-amber-700': rvTooltip.meeting.status === 'pending',
                            'bg-emerald-100 text-emerald-700': rvTooltip.meeting.status === 'approved',
                            'bg-red-100 text-red-700': rvTooltip.meeting.status === 'rejected',
                          }">
                          <i class="bi text-xss" :class="{
                            'bi-hourglass-split': rvTooltip.meeting.status === 'pending',
                            'bi-check-circle-fill': rvTooltip.meeting.status === 'approved',
                            'bi-x-circle-fill': rvTooltip.meeting.status === 'rejected',
                          }"></i>
                          {{ { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' }[rvTooltip.meeting.status] || rvTooltip.meeting.status }}
                        </span>
                        <!-- Close -->
                        <button @click="hideRvTooltip" class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 transition-all">
                          <i class="bi bi-x-lg text-xss"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Time row -->
                    <div class="flex items-center gap-1.5 text-xs">
                      <i class="bi bi-clock-fill text-emerald-500 text-xss"></i>
                      <span class="font-black text-zinc-800">{{ formatQuickTime(rvTooltip.meeting.start_time) }} – {{ formatQuickTime(rvTooltip.meeting.end_time) }}</span>
                      <span class="text-zinc-400 font-medium">· {{ formatDuration(rvTooltip.meeting.start_time, rvTooltip.meeting.end_time) }}</span>
                      <span class="ml-auto font-bold text-xss" :class="getMeetingStatusColor(rvTooltip.meeting.start_time, rvTooltip.meeting.end_time, rvTooltip.meeting.checkedIn)">
                        <i class="bi bi-circle-fill text-xss"></i>
                        {{ getMeetingStatusLabel(rvTooltip.meeting.start_time, rvTooltip.meeting.end_time, rvTooltip.meeting.checkedIn) }}
                      </span>
                    </div>
                  </div>

                  <!-- Body -->
                  <div class="px-4 py-3 space-y-2 text-xss text-zinc-600">
                    <!-- Location -->
                    <div class="flex items-center gap-2">
                      <i class="bi bi-geo-alt-fill text-teal-500 shrink-0"></i>
                      <span class="text-zinc-500">{{ getAreaName(rvTooltip.meeting.areaId) }}</span>
                      <span class="text-zinc-300">/</span>
                      <span class="font-black text-zinc-800">{{ getRoomName(rvTooltip.meeting.roomId) }}</span>
                      <span v-if="getRoomCapacity(rvTooltip.meeting.roomId)" class="text-zinc-400">({{ getRoomCapacity(rvTooltip.meeting.roomId) }} người)</span>
                    </div>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-1.5">
                      <span v-if="rvTooltip.meeting.need_it_support" class="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full font-bold">
                        <i class="bi bi-headset text-xss"></i> Hỗ trợ IT
                      </span>
                      <span v-if="rvTooltip.meeting.zoomUrl" class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold">
                        <i class="bi bi-camera-video-fill text-xss"></i> Zoom
                      </span>
                      <span v-if="rvTooltip.meeting.recurrenceRule" class="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full font-bold">
                        <i class="bi bi-arrow-repeat text-xss"></i> {{ formatRecurrenceLabel(rvTooltip.meeting.recurrenceRule) }}
                      </span>
                    </div>

                    <!-- Attendees -->
                    <div v-if="rvTooltip.meeting.attendee_ids?.length" class="flex items-start gap-2">
                      <i class="bi bi-people-fill text-emerald-500 mt-0.5 shrink-0"></i>
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="email in getAttendeeEmails(rvTooltip.meeting.attendee_ids)"
                          :key="email"
                          class="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium"
                        >{{ email }}</span>
                      </div>
                    </div>

                    <!-- Description -->
                    <div v-if="rvTooltip.meeting.description" class="flex items-start gap-2 pt-1 border-t border-zinc-100">
                      <i class="bi bi-journal-text text-zinc-400 mt-0.5 shrink-0"></i>
                      <p class="text-zinc-500 leading-relaxed line-clamp-2">{{ rvTooltip.meeting.description }}</p>
                    </div>
                  </div>

                  <!-- Footer actions -->
                  <div class="px-4 pb-3 pt-0 space-y-2">
                    <!-- Admin: approve / reject -->
                    <div v-if="rvTooltip.meeting.status === 'pending' && isAdmin" class="flex gap-2">
                      <button @click="rvApprove(rvTooltip.meeting.id)"
                        class="flex-1 py-1.5 text-xss font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all flex items-center justify-center gap-1">
                        <i class="bi bi-check-lg"></i> Duyệt
                      </button>
                      <button @click="rvReject(rvTooltip.meeting.id)"
                        class="flex-1 py-1.5 text-xss font-black uppercase tracking-widest bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-all flex items-center justify-center gap-1">
                        <i class="bi bi-x-lg"></i> Từ chối
                      </button>
                    </div>

                    <!-- Check-in -->
                    <button
                      v-if="isCheckInWindow(rvTooltip.meeting.start_time, rvTooltip.meeting.end_time)"
                      @click="rvCheckIn(rvTooltip.meeting)"
                      class="w-full py-1.5 text-xss font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1.5"
                      :class="rvTooltip.meeting.checkedIn ? 'bg-zinc-100 text-zinc-500 cursor-default' : 'bg-emerald-500 hover:bg-emerald-600 text-white'"
                      :disabled="rvTooltip.meeting.checkedIn"
                    >
                      <i :class="rvTooltip.meeting.checkedIn ? 'bi-check-circle-fill' : 'bi-box-arrow-in-right'" class="bi"></i>
                      {{ rvTooltip.meeting.checkedIn ? 'Đã check-in' : 'Check In' }}
                    </button>

                    <!-- Zoom link -->
                    <a v-if="rvTooltip.meeting.zoomUrl" :href="rvTooltip.meeting.zoomUrl" target="_blank"
                      class="w-full py-1.5 text-xss font-black uppercase tracking-widest bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-all flex items-center justify-center gap-1.5">
                      <i class="bi bi-camera-video-fill"></i> Tham gia Zoom
                    </a>

                    <!-- Edit button -->
                    <button
                      @click="rvOpenEditEditor(rvTooltip.meeting)"
                      class="w-full py-1.5 text-xss font-black uppercase tracking-widest border border-zinc-200 hover:border-emerald-400 hover:text-emerald-600 text-zinc-500 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <i class="bi bi-pencil-square"></i> Chỉnh sửa lịch họp
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </div>

    </main>

  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'permission'] });
import { ref, onMounted, onUnmounted, nextTick, provide, computed, watch } from "vue";
import * as XLSX from "xlsx";
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

// --- FILTER STATE ---
const filterSearch = ref("");
const filterAreaId = ref("");
const filterRoomId = ref("");
const filterITSupport = ref(false);

const clearFilters = () => {
  filterSearch.value = "";
  filterAreaId.value = "";
  filterRoomId.value = "";
  filterITSupport.value = false;
};

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
      description: item.description || "",
      recurrenceRule: item.recurrence_rule || null,
      checkedIn: item.checked_in || false,
      timezone: item.timezone || "Asia/Ho_Chi_Minh",
    };
  });
};

const scheduleDataList = ref([]);
const CHECKIN_WINDOW_MINS = 15;

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
  const { status, zoomUrl, checkedIn, recurrenceRule, start_time, end_time } = args.data;
  const now = Date.now();
  const start = new Date(start_time).getTime();
  const end = new Date(end_time).getTime();
  const isOngoing = now >= start && now <= end;
  const isSoon = now >= start - CHECKIN_WINDOW_MINS * 60000 && now < start;

  if (status === "pending") {
    args.element.style.backgroundColor = "#f59e0b";
    args.element.style.borderLeft = "4px solid #b45309";
  } else if (status === "rejected") {
    args.element.style.backgroundColor = "#ef4444";
    args.element.style.borderLeft = "4px solid #b91c1c";
    args.element.style.opacity = "0.7";
  } else if (status === "approved" || status === "scheduled") {
    if (isOngoing && checkedIn) {
      args.element.style.backgroundColor = "#10b981";
      args.element.style.borderLeft = "4px solid #065f46";
    } else if (isOngoing) {
      args.element.style.backgroundColor = "#f59e0b";
      args.element.style.borderLeft = "4px solid #b45309";
    } else if (isSoon) {
      args.element.style.backgroundColor = "#14b8a6";
      args.element.style.borderLeft = "4px solid #0f766e";
    } else if (zoomUrl) {
      args.element.style.backgroundColor = "#2563eb";
      args.element.style.borderLeft = "4px solid #1e3a8a";
    } else {
      args.element.style.backgroundColor = "#64748b";
      args.element.style.borderLeft = "4px solid #334155";
    }
  }

  args.element.style.borderRadius = "4px";
  args.element.style.fontSize = "10px";
  args.element.style.fontWeight = "bold";

  // Recurring icon overlay
  if (recurrenceRule) {
    const icon = document.createElement("span");
    icon.textContent = "↻";
    icon.style.cssText = "position:absolute;top:2px;right:4px;font-size:9px;opacity:0.8;";
    args.element.style.position = "relative";
    args.element.appendChild(icon);
  }
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
  description: "",
  recurrenceType: "",
  recurrenceEndDate: "",
  timezone: "Asia/Ho_Chi_Minh",
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
  const backendUrl = config.public.realtimeServer || (config.public.apiBase || '').replace('/api', '');
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

let roomViewTicker = null;

onUnmounted(() => {
  if (socket.value) socket.value.disconnect();
  document.removeEventListener("click", handleOutsideClick);
  if (roomViewTicker) clearInterval(roomViewTicker);
});
// ---------------------------------------------

const filteredRoomData = computed(() => {
  if (!editorData.value.areaId) return [];
  return getRoomsByArea(editorData.value.areaId).map((room) => ({
    id: room.id,
    name: room.name,
    capacity: room.capacity || null,
  }));
});

// Room capacity warning in editor
const capacityWarning = computed(() => {
  if (!editorData.value.roomId) return null;
  const room = rooms.value.find((r) => Number(r.id) === Number(editorData.value.roomId));
  if (!room?.capacity) return null;
  const attendeeCount = (editorData.value.attendee_ids?.length || 0) + 1;
  if (attendeeCount > room.capacity) {
    return `Số người (${attendeeCount}) vượt sức chứa phòng (${room.capacity} người).`;
  }
  return null;
});

// Filter bar: rooms available for dropdown (all rooms, not just editor area)
const filterableRooms = computed(() => {
  if (filterAreaId.value) {
    return rooms.value.filter((r) => Number(r.area_id) === Number(filterAreaId.value));
  }
  return rooms.value;
});

// Filtered schedule data for calendar
const filteredScheduleData = computed(() => {
  return scheduleDataList.value.filter((m) => {
    if (filterSearch.value) {
      const q = filterSearch.value.toLowerCase();
      if (!m.title?.toLowerCase().includes(q)) return false;
    }
    if (filterAreaId.value && Number(m.areaId) !== Number(filterAreaId.value)) return false;
    if (filterRoomId.value && Number(m.roomId) !== Number(filterRoomId.value)) return false;
    if (filterITSupport.value && !m.need_it_support) return false;
    return true;
  });
});

const filteredEventSettings = computed(() => ({
  ...eventSettings.value,
  dataSource: filteredScheduleData.value,
}));

// Quick-info helpers
const formatQuickTime = (date) => date ? moment(date).format("HH:mm") : "";
const formatDuration = (start, end) => {
  if (!start || !end) return "";
  const mins = Math.round((new Date(end) - new Date(start)) / 60000);
  if (mins < 60) return `${mins} phút`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}g${m}p` : `${h} giờ`;
};
const getAreaName = (areaId) => areas.value.find((a) => Number(a.id) === Number(areaId))?.name || "";
const getRoomName = (roomId) => rooms.value.find((r) => Number(r.id) === Number(roomId))?.name || "";
const getRoomCapacity = (roomId) => rooms.value.find((r) => Number(r.id) === Number(roomId))?.capacity || null;
const getAttendeeEmails = (attendeeIds = []) => getEmailsByAttendeeIds(attendeeIds);

// Quick info templates binding
const quickInfoTemplates = {
  content: "quickInfoContent",
};

// ─── PHASE 2: RECURRING MEETINGS ───────────────────────────────────────────
const recurrencePreview = computed(() => {
  const type = editorData.value.recurrenceType;
  const until = editorData.value.recurrenceEndDate;
  if (!type) return null;
  const labels = { DAILY: 'Lặp hằng ngày', WEEKLY: 'Lặp hằng tuần', MONTHLY: 'Lặp hằng tháng' };
  return until ? `${labels[type]} đến ${moment(until).format('DD/MM/YYYY')}` : labels[type];
});

const buildRecurrenceRule = () => {
  const type = editorData.value.recurrenceType;
  if (!type) return null;
  let rule = `FREQ=${type}`;
  if (editorData.value.recurrenceEndDate) {
    rule += `;UNTIL=${moment(editorData.value.recurrenceEndDate).format('YYYYMMDD')}T235959Z`;
  }
  return rule;
};

const formatRecurrenceLabel = (rule) => {
  if (!rule) return '';
  if (rule.includes('DAILY')) return 'Lặp hằng ngày';
  if (rule.includes('WEEKLY')) return 'Lặp hằng tuần';
  if (rule.includes('MONTHLY')) return 'Lặp hằng tháng';
  return 'Lặp lại';
};

// ─── PHASE 2: MEETING AGENDA / DESCRIPTION ─────────────────────────────────
// description field is part of editorData, see editorData init below

// ─── PHASE 2: CHECK-IN / ROOM STATUS ───────────────────────────────────────
const isCheckInWindow = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return now >= start - CHECKIN_WINDOW_MINS * 60000 && now <= end;
};

const getMeetingStatusLabel = (startTime, endTime, checkedIn) => {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (now > end) return 'Đã kết thúc';
  if (now >= start && now <= end) return checkedIn ? 'Đang diễn ra · Đã check-in' : 'Đang diễn ra · Chờ check-in';
  if (now >= start - CHECKIN_WINDOW_MINS * 60000) return 'Sắp bắt đầu';
  return 'Sắp tới';
};

const getMeetingStatusColor = (startTime, endTime, checkedIn) => {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (now > end) return 'text-zinc-400';
  if (now >= start && now <= end) return checkedIn ? 'text-emerald-500' : 'text-amber-500';
  if (now >= start - CHECKIN_WINDOW_MINS * 60000) return 'text-teal-500';
  return 'text-zinc-400';
};

const handleCheckIn = async (eventData) => {
  if (eventData.checkedIn) return;
  try {
    await useFetchAuth(`${apiBaseUrl}/v1/meetings/${eventData.id}/checkin`, { method: 'POST' });
    const idx = scheduleDataList.value.findIndex((m) => m.id === eventData.id);
    if (idx > -1) scheduleDataList.value[idx].checkedIn = true;
    eventSettings.value = { ...eventSettings.value, dataSource: [...scheduleDataList.value] };
    socket.value?.emit('room_checkin', { meetingId: eventData.id, roomId: eventData.roomId });
    triggerToast('success', 'Check-in thành công!');
  } catch {
    triggerToast('error', 'Không thể check-in. Vui lòng thử lại.');
  }
};

// ─── PHASE 2: SMART TIME SUGGESTION ────────────────────────────────────────
const showFindTimeModal = ref(false);
const findTimeAttendees = ref([]);
const findTimeDuration = ref(60);
const findTimeFromDate = ref(moment().format('YYYY-MM-DD'));
const findTimeResults = ref([]);
const findTimeRan = ref(false);

const openFindTimeModal = () => {
  findTimeAttendees.value = [...(editorData.value.attendee_ids || [])];
  findTimeDuration.value = 60;
  findTimeFromDate.value = moment().format('YYYY-MM-DD');
  findTimeResults.value = [];
  findTimeRan.value = false;
  showFindTimeModal.value = true;
};

const toggleFindTimeAttendee = (id) => {
  const idx = findTimeAttendees.value.indexOf(id);
  if (idx > -1) findTimeAttendees.value.splice(idx, 1);
  else findTimeAttendees.value.push(id);
};

const runFindTime = () => {
  findTimeRan.value = true;
  const durationMs = findTimeDuration.value * 60000;
  const fromDate = moment(findTimeFromDate.value).startOf('day');
  const toDate = fromDate.clone().add(7, 'days');
  const workStart = 8; // 08:00
  const workEnd = 18;  // 18:00

  // Build busy blocks per attendee (union of all their meetings)
  const busyBlocks = scheduleDataList.value
    .filter((m) => {
      if (!findTimeAttendees.value.length) return true;
      return findTimeAttendees.value.some((id) => (m.attendee_ids || []).includes(id));
    })
    .map((m) => ({ start: new Date(m.start_time).getTime(), end: new Date(m.end_time).getTime(), roomId: m.roomId }));

  const slots = [];
  const cursor = fromDate.clone();

  while (cursor.isBefore(toDate) && slots.length < 5) {
    const dayStart = cursor.clone().hours(workStart).minutes(0).seconds(0);
    const dayEnd = cursor.clone().hours(workEnd).minutes(0).seconds(0);
    let t = dayStart.valueOf();

    while (t + durationMs <= dayEnd.valueOf() && slots.length < 5) {
      const slotEnd = t + durationMs;
      const conflict = busyBlocks.some((b) => b.start < slotEnd && b.end > t);

      if (!conflict) {
        // Find first available room in any area at this time
        const usedRoomIds = busyBlocks
          .filter((b) => b.start < slotEnd && b.end > t)
          .map((b) => b.roomId);
        const freeRoom = rooms.value.find((r) => r.available && !usedRoomIds.includes(Number(r.id)));

        if (freeRoom) {
          slots.push({
            start: t,
            end: slotEnd,
            roomId: freeRoom.id,
            roomName: freeRoom.name,
            dateLabel: moment(t).format('ddd, DD/MM/YYYY'),
            startLabel: moment(t).format('HH:mm'),
            endLabel: moment(slotEnd).format('HH:mm'),
          });
          t = slotEnd; // jump past this slot to avoid overlapping suggestions
          continue;
        }
      }
      t += 30 * 60000; // step 30 min
    }
    cursor.add(1, 'day');
  }

  findTimeResults.value = slots;
};

const applyFindTimeSlot = (slot) => {
  editorData.value.start_time = new Date(slot.start);
  editorData.value.end_time = new Date(slot.end);
  const room = rooms.value.find((r) => Number(r.id) === Number(slot.roomId));
  if (room) {
    editorData.value.areaId = Number(room.area_id);
    editorData.value.roomId = Number(room.id);
  }
  showFindTimeModal.value = false;
  // Open the editor with pre-filled time
  const instance = scheduleObj.value?.ej2Instances;
  if (instance) instance.openEditor({ start_time: new Date(slot.start), end_time: new Date(slot.end) }, 'Add');
};

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
  description: editorData.value.description || "",
  recurrence_rule: buildRecurrenceRule(),
  timezone: editorData.value.timezone || "Asia/Ho_Chi_Minh",
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
    // EJS truyền camelCase (startTime/endTime) hoặc snake_case tuỳ context
    const resolveDate = (snakeVal, camelVal) => {
      const d = snakeVal || camelVal;
      const parsed = d ? new Date(d) : null;
      return parsed && !isNaN(parsed) ? parsed : null;
    };

    // _rvEditPendingId được set bởi rvOpenEditEditor khi mở edit từ Room View
    const eventId = _rvEditPendingId.value || popupData.id;
    _rvEditPendingId.value = null; // reset sau khi dùng
    const persistedRecord = eventId
      ? scheduleDataList.value.find((event) => event.id === eventId)
      : null;
    // Ưu tiên: persistedRecord (đầy đủ) > popupData (EJS internal)
    const source = persistedRecord || popupData;

    // Thời gian: đọc cả snake_case lẫn camelCase từ EJS
    const resolvedStart =
      resolveDate(source.start_time, source.startTime || source.StartTime) ||
      resolveDate(popupData.start_time, popupData.startTime || popupData.StartTime);
    const resolvedEnd =
      resolveDate(source.end_time, source.endTime || source.EndTime) ||
      resolveDate(popupData.end_time, popupData.endTime || popupData.EndTime);

    // Fallback giờ hành chính hôm nay (08:00 – 09:00)
    const defaultStart = (() => { const d = new Date(); d.setHours(8, 0, 0, 0); return d; })();
    const defaultEnd   = (() => { const d = new Date(); d.setHours(9, 0, 0, 0); return d; })();



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
      start_time: resolvedStart || defaultStart,
      end_time: resolvedEnd || defaultEnd,
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
      description: source.description || "",
      recurrenceType: (() => {
        const rule = source.recurrenceRule || "";
        if (rule.includes("DAILY")) return "DAILY";
        if (rule.includes("WEEKLY")) return "WEEKLY";
        if (rule.includes("MONTHLY")) return "MONTHLY";
        return "";
      })(),
      recurrenceEndDate: (() => {
        const rule = source.recurrenceRule || "";
        const m = rule.match(/UNTIL=(\d{8})/);
        return m ? moment(m[1], "YYYYMMDD").format("YYYY-MM-DD") : "";
      })(),
      timezone: source.timezone || "Asia/Ho_Chi_Minh",
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
    // editorData.id có giá trị = mở từ rvOpenEditEditor (Add mode giả) → thực chất là PUT
    if (editorData.value.id) {
      try {
        await useFetchAuth(`${apiBaseUrl}/v1/meetings/${editorData.value.id}`, {
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
        triggerToast("error", "Lỗi khi cập nhật lịch họp.");
        loadData();
      }
      return;
    }
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

// % delta helper: so sánh current vs prev, trả về % thay đổi làm tròn
const calcDelta = (curr, prev) => {
  if (prev === 0) return curr > 0 ? 100 : null;
  return Math.round(((curr - prev) / prev) * 100);
};

const currentWeekStats = computed(() => {
  const curr = currentWeekMeetings.value;
  const prev = prevWeekMeetings.value;
  const currRooms = new Set(curr.map((m) => m.roomId)).size;
  const prevRooms = new Set(prev.map((m) => m.roomId)).size;
  const currAvg = parseFloat((curr.length / 7).toFixed(1));
  const prevAvg = parseFloat((prev.length / 7).toFixed(1));
  return [
    { label: 'Tổng cuộc họp', val: curr.length, icon: 'bi-calendar-check', color: 'emerald', delta: calcDelta(curr.length, prev.length) },
    { label: 'Số phòng sử dụng', val: currRooms, icon: 'bi-door-open', color: 'teal', delta: calcDelta(currRooms, prevRooms) },
    { label: 'Tổng thời lượng (phút)', val: currentWeekTotalDuration.value, icon: 'bi-clock', color: 'lime', delta: calcDelta(currentWeekTotalDuration.value, prevWeekTotalDuration.value) },
    { label: 'Trung bình/ngày', val: currAvg, icon: 'bi-bar-chart', color: 'emerald', delta: calcDelta(currAvg, prevAvg) },
  ];
});

const prevWeekStats = computed(() => {
  const prev = prevWeekMeetings.value;
  return [
    { label: 'Tổng cuộc họp', val: prev.length, icon: 'bi-calendar-check', color: 'zinc' },
    { label: 'Số phòng sử dụng', val: new Set(prev.map((m) => m.roomId)).size, icon: 'bi-door-open', color: 'zinc' },
    { label: 'Tổng thời lượng (phút)', val: prevWeekTotalDuration.value, icon: 'bi-clock', color: 'zinc' },
    { label: 'Trung bình/ngày', val: parseFloat((prev.length / 7).toFixed(1)), icon: 'bi-bar-chart', color: 'zinc' },
  ];
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

// ════════════════════════════════════════════════════════════════
// PHASE 3 — Advanced Analytics, Export, Approval, Timezone, Notifications
// ════════════════════════════════════════════════════════════════

// ─── 3.3 ADVANCED ANALYTICS ─────────────────────────────────────────────────
const analyticsRange = ref("week");
const analyticsRanges = [
  { value: "week",    label: "7 ngày"  },
  { value: "month",   label: "Tháng"   },
  { value: "quarter", label: "Quý"     },
];

const analyticsRangeLabel = computed(() => {
  return analyticsRanges.find((r) => r.value === analyticsRange.value)?.label ?? "";
});

const getRangeWindow = () => {
  const end = moment().endOf("day");
  let start;
  if (analyticsRange.value === "month")   start = moment().startOf("month");
  else if (analyticsRange.value === "quarter") start = moment().startOf("quarter");
  else start = moment().subtract(6, "days").startOf("day");
  return { start, end };
};

const rangeMeetings = computed(() => {
  const { start, end } = getRangeWindow();
  return scheduleDataList.value.filter((m) => {
    const d = moment(m.start_time);
    return d.isSameOrAfter(start) && d.isSameOrBefore(end);
  });
});

const rangeStats = computed(() => {
  const curr = rangeMeetings.value;
  const prev = prevWeekMeetings.value;
  const currRooms = new Set(curr.map((m) => m.roomId)).size;
  const prevRooms = new Set(prev.map((m) => m.roomId)).size;
  const currDur = curr.reduce((s, m) => s + Math.max(0, Math.round((new Date(m.end_time) - new Date(m.start_time)) / 60000)), 0);
  const prevDur = prevWeekTotalDuration.value;
  const days = analyticsRange.value === "quarter" ? 91 : analyticsRange.value === "month" ? 30 : 7;
  const currAvg = parseFloat((curr.length / days).toFixed(1));
  const prevAvg = parseFloat((prev.length / 7).toFixed(1));
  return [
    { label: "Tổng cuộc họp",          val: curr.length,  icon: "bi-calendar-check", color: "emerald", delta: calcDelta(curr.length,  prev.length) },
    { label: "Số phòng sử dụng",        val: currRooms,    icon: "bi-door-open",       color: "teal",    delta: calcDelta(currRooms,     prevRooms)   },
    { label: "Tổng thời lượng (phút)",  val: currDur,      icon: "bi-clock",           color: "lime",    delta: calcDelta(currDur,       prevDur)     },
    { label: "Trung bình/ngày",         val: currAvg,      icon: "bi-bar-chart",       color: "emerald", delta: calcDelta(currAvg,       prevAvg)     },
  ];
});

// Range bar chart — group by day (≤14 days) or by week
const rangeBarChartData = computed(() => {
  const { start, end } = getRangeWindow();
  const days = end.diff(start, "days") + 1;
  if (days <= 14) {
    const labels = [];
    const data = [];
    for (let i = 0; i < days; i++) {
      const d = start.clone().add(i, "days");
      labels.push(d.format("DD/MM"));
      data.push(rangeMeetings.value.filter((m) => moment(m.start_time).isSame(d, "day")).length);
    }
    return { labels, datasets: [{ label: "Cuộc họp", data, backgroundColor: "#10b981", borderRadius: 6 }] };
  }
  // Group by week
  const weeks = Math.ceil(days / 7);
  const labels = [];
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const ws = start.clone().add(w * 7, "days");
    const we = ws.clone().add(6, "days");
    labels.push(`${ws.format("DD/MM")}–${we.format("DD/MM")}`);
    data.push(rangeMeetings.value.filter((m) => {
      const d = moment(m.start_time);
      return d.isSameOrAfter(ws) && d.isSameOrBefore(we);
    }).length);
  }
  return { labels, datasets: [{ label: "Cuộc họp", data, backgroundColor: "#10b981", borderRadius: 6 }] };
});

const rangeDoughnutData = computed(() => {
  const counts = buildDoughnutData(rangeMeetings.value);
  const labels = Object.keys(counts);
  return {
    labels,
    datasets: [{ data: labels.map((l) => counts[l]), backgroundColor: CHART_COLORS.slice(0, labels.length), borderWidth: 0 }],
  };
});

// Peak Hours heatmap — 8–18h x Mon–Sun
const WORK_HOURS = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);
const peakHoursData = computed(() => {
  return WORK_HOURS.map((hour) => {
    const h = parseInt(hour);
    const days = weekLabels.map((_, dayIdx) => {
      return rangeMeetings.value.filter((m) => {
        const d = moment(m.start_time);
        return d.isoWeekday() - 1 === dayIdx && d.hour() === h;
      }).length;
    });
    return { hour, days };
  });
});

const peakHoursMax = computed(() => {
  return Math.max(1, ...peakHoursData.value.flatMap((r) => r.days));
});

const heatmapColor = (val, max) => {
  if (val === 0) return "#f4f4f5";
  const intensity = val / max;
  const r = Math.round(16  + (6   - 16)  * intensity);
  const g = Math.round(185 + (95  - 185) * intensity);
  const b = Math.round(129 + (70  - 129) * intensity);
  return `rgb(${r},${g},${b})`;
};

// Room Utilization — % of available working minutes used
const roomUtilization = computed(() => {
  const { start, end } = getRangeWindow();
  const workMinsPerDay = 10 * 60; // 08:00–18:00 = 10h
  const days = end.diff(start, "days") + 1;
  const totalMins = workMinsPerDay * days;

  return rooms.value
    .filter((r) => r.available)
    .map((r) => {
      const used = rangeMeetings.value
        .filter((m) => Number(m.roomId) === Number(r.id))
        .reduce((s, m) => s + Math.max(0, Math.round((new Date(m.end_time) - new Date(m.start_time)) / 60000)), 0);
      return {
        roomId: r.id,
        name: r.name,
        pct: Math.min(100, Math.round((used / totalMins) * 100)),
      };
    })
    .sort((a, b) => b.pct - a.pct);
});

// Top Organizers — người đặt phòng (createdBy) hoặc attendee xuất hiện nhiều nhất
const topOrganizers = computed(() => {
  const counts = {};
  rangeMeetings.value.forEach((m) => {
    (m.attendee_ids || []).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([id, count]) => {
      const u = users.value.find((u) => u.portal_user_id === id);
      return { id, email: u?.email ?? id, count };
    })
    .sort((a, b) => b.count - a.count);
});

// ─── 3.1 EXPORT ─────────────────────────────────────────────────────────────
const exportMenuOpen = ref(false);
const bookingExportOpen = ref(false);
const exportRef = ref(null);
const analyticsExportRef = ref(null);
const bookingExportRef = ref(null);

// Lọc dữ liệu theo period (day|week|month|quarter) và theo tab đang active
const getExportData = (period = "week") => {
  // Source tuỳ tab: Room View chỉ lấy phòng đang hiển thị, Bookings dùng filtered, Analytics lấy tất cả
  let base;
  if (activeTab.value === "room-view") {
    const validRoomIds = new Set(roomViewGrouped.value.flatMap((g) => g.rooms.map((r) => Number(r.id))));
    base = scheduleDataList.value.filter((m) => validRoomIds.has(Number(m.roomId)));
  } else if (activeTab.value === "bookings") {
    base = filteredScheduleData.value.length > 0 ? filteredScheduleData.value : scheduleDataList.value;
  } else {
    base = scheduleDataList.value;
  }
  const now = moment();
  let start, end;
  if (period === "day") {
    start = now.clone().startOf("day");
    end   = now.clone().endOf("day");
  } else if (period === "week") {
    start = now.clone().startOf("isoWeek");
    end   = now.clone().endOf("isoWeek");
  } else if (period === "month") {
    start = now.clone().startOf("month");
    end   = now.clone().endOf("month");
  } else {
    // quarter
    start = now.clone().startOf("quarter");
    end   = now.clone().endOf("quarter");
  }
  return base.filter((m) => {
    const d = moment(m.start_time);
    return d.isSameOrAfter(start) && d.isSameOrBefore(end);
  });
};

const periodLabel = (period) => ({
  day: `ngày ${moment().format("DD-MM-YYYY")}`,
  week: `tuần ${moment().isoWeek()}-${moment().format("YYYY")}`,
  month: `tháng ${moment().format("MM-YYYY")}`,
  quarter: `Q${moment().quarter()}-${moment().format("YYYY")}`,
})[period] || "all";

// Xây rows chung cho cả Bookings tab và Room View tab
const buildMeetingRows = (data) =>
  data.map((m) => ({
    "ID": m.id,
    "Tiêu đề": m.title || "",
    "Ngày": moment(m.start_time).format("DD/MM/YYYY"),
    "Giờ bắt đầu": moment(m.start_time).format("HH:mm"),
    "Giờ kết thúc": moment(m.end_time).format("HH:mm"),
    "Thời lượng (phút)": Math.round((new Date(m.end_time) - new Date(m.start_time)) / 60000),
    "Khu vực": getAreaName(m.areaId),
    "Phòng": getRoomName(m.roomId),
    "Attendees": getEmailsByAttendeeIds(m.attendee_ids || []).join("; "),
    "IT Support": m.need_it_support ? "Có" : "Không",
    "Zoom": m.zoomUrl || "",
    "Lặp lại": m.recurrenceRule ? formatRecurrenceLabel(m.recurrenceRule) : "",
    "Trạng thái": { scheduled: "Đã lên lịch", pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối", cancelled: "Đã hủy" }[m.status] || m.status || "",
    "Check-in": m.checkedIn ? "Có" : "Không",
  }));

// Xây rows cho Analytics tab (thống kê theo phòng)
const buildAnalyticsRows = (data) => {
  const roomMap = {};
  data.forEach((m) => {
    const key = Number(m.roomId);
    if (!roomMap[key]) roomMap[key] = { phong: getRoomName(m.roomId), khuVuc: getAreaName(m.areaId), soLuot: 0, tongPhut: 0 };
    roomMap[key].soLuot++;
    roomMap[key].tongPhut += Math.max(0, Math.round((new Date(m.end_time) - new Date(m.start_time)) / 60000));
  });
  return Object.values(roomMap).map((r) => ({
    "Phòng": r.phong,
    "Khu vực": r.khuVuc,
    "Số lượt họp": r.soLuot,
    "Tổng thời lượng (phút)": r.tongPhut,
    "TB phút/lượt": r.soLuot > 0 ? Math.round(r.tongPhut / r.soLuot) : 0,
  }));
};

const exportExcel = (period = "week") => {
  const data = getExportData(period);
  const label = periodLabel(period);
  const tab = activeTab.value;

  const wb = XLSX.utils.book_new();

  if (tab === "analytics") {
    // Sheet 1: chi tiết cuộc họp
    const detailRows = buildMeetingRows(data);
    const ws1 = XLSX.utils.json_to_sheet(detailRows.length ? detailRows : [{}]);
    XLSX.utils.book_append_sheet(wb, ws1, "Chi tiết cuộc họp");
    // Sheet 2: thống kê theo phòng
    const statsRows = buildAnalyticsRows(data);
    const ws2 = XLSX.utils.json_to_sheet(statsRows.length ? statsRows : [{}]);
    XLSX.utils.book_append_sheet(wb, ws2, "Thống kê theo phòng");
  } else {
    // Bookings tab + Room View tab: 1 sheet duy nhất
    const rows = buildMeetingRows(data);
    const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{}]);
    // Auto column width
    const colWidths = rows.length
      ? Object.keys(rows[0]).map((k) => ({ wch: Math.max(k.length, ...rows.map((r) => String(r[k] ?? "").length)) + 2 }))
      : [];
    ws["!cols"] = colWidths;
    XLSX.utils.book_append_sheet(wb, ws, "Cuộc họp");
  }

  XLSX.writeFile(wb, `meetings-${tab}-${label}.xlsx`);
  triggerToast("success", `Đã xuất ${data.length} cuộc họp (${label}) ra file Excel.`);
};

// ─── 3.2 APPROVAL WORKFLOW ───────────────────────────────────────────────────
const isAdmin = computed(() => currentUser.value?.role === "admin" || currentUser.value?.is_admin);

const approveBooking = async (id) => {
  try {
    await useFetchAuth(`${apiBaseUrl}/v1/meetings/${id}/approve`, { method: "POST" });
    const idx = scheduleDataList.value.findIndex((m) => m.id === id);
    if (idx > -1) scheduleDataList.value[idx].status = "approved";
    eventSettings.value = { ...eventSettings.value, dataSource: [...scheduleDataList.value] };
    triggerToast("success", "Đã duyệt cuộc họp.");
    addNotification({ type: "approved", message: "Cuộc họp đã được duyệt." });
  } catch {
    triggerToast("error", "Không thể duyệt. Vui lòng thử lại.");
  }
};

const rejectBooking = async (id) => {
  try {
    await useFetchAuth(`${apiBaseUrl}/v1/meetings/${id}/reject`, { method: "POST" });
    const idx = scheduleDataList.value.findIndex((m) => m.id === id);
    if (idx > -1) scheduleDataList.value[idx].status = "rejected";
    eventSettings.value = { ...eventSettings.value, dataSource: [...scheduleDataList.value] };
    triggerToast("warning", "Đã từ chối cuộc họp.");
    addNotification({ type: "rejected", message: "Cuộc họp đã bị từ chối." });
  } catch {
    triggerToast("error", "Không thể từ chối. Vui lòng thử lại.");
  }
};

// ─── 3.4 TIMEZONE SUPPORT ────────────────────────────────────────────────────
const commonTimezones = [
  { value: "Asia/Ho_Chi_Minh", label: "GMT+7 — Hồ Chí Minh" },
  { value: "Asia/Bangkok",     label: "GMT+7 — Bangkok"      },
  { value: "Asia/Singapore",   label: "GMT+8 — Singapore"    },
  { value: "Asia/Tokyo",       label: "GMT+9 — Tokyo"        },
  { value: "Asia/Seoul",       label: "GMT+9 — Seoul"        },
  { value: "Europe/London",    label: "GMT+0 — London"       },
  { value: "Europe/Paris",     label: "GMT+1 — Paris"        },
  { value: "America/New_York", label: "GMT-5 — New York"     },
  { value: "America/Los_Angeles", label: "GMT-8 — Los Angeles" },
  { value: "UTC",              label: "UTC"                  },
];

const formatInTimezone = (date, tz) => {
  if (!date || !tz) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(date));
  } catch {
    return "";
  }
};

// ─── 3.5 NOTIFICATION (data only — bell UI removed) ──────────────────────────
const notifications = ref([]);

const addNotification = ({ type, message, meetingId = null }) => {
  notifications.value.unshift({
    id: Date.now(),
    type,
    message,
    meetingId,
    read: false,
    timeAgo: "Vừa xong",
  });
  if (notifications.value.length > 50) notifications.value.pop();
};

// Close dropdowns on outside click
const handleOutsideClick = (e) => {
  if (exportRef.value && !exportRef.value.contains(e.target)) exportOpen.value = false;
  if (analyticsExportRef.value && !analyticsExportRef.value.contains(e.target)) exportMenuOpen.value = false;
  if (bookingExportRef.value && !bookingExportRef.value.contains(e.target)) bookingExportOpen.value = false;
};

// Socket notifications
const setupNotificationSocket = () => {
  if (!socket.value) return;
  socket.value.on("meeting_reminder", (data) => {
    addNotification({ type: "reminder", message: `Nhắc nhở: "${data.title}" bắt đầu sau ${data.minutesBefore} phút.`, meetingId: data.id });
    triggerToast("info", `Nhắc nhở: "${data.title}" bắt đầu sau ${data.minutesBefore} phút.`);
  });
  socket.value.on("meeting_invite", (data) => {
    addNotification({ type: "invite", message: `Bạn được mời vào cuộc họp "${data.title}".`, meetingId: data.id });
    loadData();
  });
  socket.value.on("meeting_cancelled", (data) => {
    addNotification({ type: "cancelled", message: `Cuộc họp "${data.title}" đã bị huỷ.`, meetingId: data.id });
    loadData();
  });
  socket.value.on("meeting_approved", (data) => {
    addNotification({ type: "approved", message: `Cuộc họp "${data.title}" đã được duyệt.`, meetingId: data.id });
    loadData();
  });
  socket.value.on("meeting_rejected", (data) => {
    addNotification({ type: "rejected", message: `Cuộc họp "${data.title}" bị từ chối.`, meetingId: data.id });
    loadData();
  });
};

// ─── APPROVAL color in onEventRendered ───────────────────────────────────────
// (handled via status field — see onEventRendered which already reads status)

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

// ─── ROOM VIEW TAB ────────────────────────────────────────────────────────────
const roomViewWeekOffset = ref(0);
const roomViewAreaFilter = ref("");
const exportOpen = ref(false);

// Current time ticker — cập nhật mỗi phút để vẽ đường "now"
const roomViewNow = ref(moment());

const ROOM_VIEW_START_HOUR = 7;
const ROOM_VIEW_END_HOUR = 22;
const roomViewHours = Array.from(
  { length: ROOM_VIEW_END_HOUR - ROOM_VIEW_START_HOUR },
  (_, i) => ROOM_VIEW_START_HOUR + i
);

const roomViewWeekStart = computed(() =>
  moment().startOf("isoWeek").add(roomViewWeekOffset.value, "weeks")
);

const roomViewWeekDays = computed(() => {
  const start = roomViewWeekStart.value;
  const today = moment().startOf("day");
  return Array.from({ length: 7 }, (_, i) => {
    const d = start.clone().add(i, "days");
    return {
      date: d.format("YYYY-MM-DD"),
      dayLabel: d.format("ddd").toUpperCase(),
      dateLabel: d.format("DD/MM"),
      isToday: d.isSame(today, "day"),
    };
  });
});

const roomViewWeekLabel = computed(() => {
  const days = roomViewWeekDays.value;
  return `${days[0].dateLabel} – ${days[6].dateLabel} / ${roomViewWeekStart.value.format("YYYY")}`;
});

const roomViewPrevWeek = () => (roomViewWeekOffset.value--);
const roomViewNextWeek = () => (roomViewWeekOffset.value++);
const roomViewCurrentWeek = () => (roomViewWeekOffset.value = 0);

// Tổng cuộc họp trong tuần đang xem, chỉ tính phòng thuộc filter
const roomViewWeekMeetingCount = computed(() => {
  const dates = new Set(roomViewWeekDays.value.map((d) => d.date));
  const validRoomIds = new Set(
    roomViewGrouped.value.flatMap((g) => g.rooms.map((r) => Number(r.id)))
  );
  return scheduleDataList.value.filter((m) => {
    const dateStr = moment(m.start_time).format("YYYY-MM-DD");
    return dates.has(dateStr) && validRoomIds.has(Number(m.roomId));
  }).length;
});

// Nhóm rooms theo area, chỉ lấy area active + room available
const roomViewGrouped = computed(() => {
  const activeAreas = roomViewAreaFilter.value
    ? areas.value.filter((a) => a.active && a.id == roomViewAreaFilter.value)
    : areas.value.filter((a) => a.active);

  return activeAreas
    .map((area) => ({
      id: area.id,
      name: area.name,
      rooms: rooms.value.filter(
        (r) => Number(r.area_id) === Number(area.id) && r.available
      ),
    }))
    .filter((g) => g.rooms.length > 0);
});

// Meetings của một room trong một ngày
const getRoomDayMeetings = (roomId, dateStr) => {
  return scheduleDataList.value.filter((m) => {
    if (Number(m.roomId) !== Number(roomId)) return false;
    return moment(m.start_time).format("YYYY-MM-DD") === dateStr;
  });
};

// Màu block — logic giống onEventRendered
const getMeetingBlockColor = (meeting) => {
  const now = Date.now();
  const start = new Date(meeting.start_time).getTime();
  const end = new Date(meeting.end_time).getTime();
  const isOngoing = now >= start && now <= end;
  const isSoon = now >= start - CHECKIN_WINDOW_MINS * 60000 && now < start;

  const approvedGradient = "linear-gradient(135deg, #059669 0%, #0d9488 50%, #65a30d 100%)";
  if (meeting.status === "pending")   return { bg: "#f59e0b", border: "#b45309" };
  if (meeting.status === "rejected")  return { bg: "#ef4444", border: "#b91c1c", opacity: 0.6 };
  if (isOngoing && meeting.checkedIn) return { bg: "#10b981", border: "#065f46", gradient: approvedGradient };
  if (isOngoing)  return { bg: "#f59e0b", border: "#b45309" };
  if (isSoon)     return { bg: "#14b8a6", border: "#0f766e" };
  if (meeting.zoomUrl) return { bg: "#2563eb", border: "#1e3a8a" };
  return { bg: "#059669", border: "#065f46", gradient: approvedGradient };
};

// Position + style block (left%, width% + màu)
const getMeetingBlockStyle = (meeting) => {
  const totalMins = (ROOM_VIEW_END_HOUR - ROOM_VIEW_START_HOUR) * 60;
  const startMins = Math.max(
    0,
    moment(meeting.start_time).hours() * 60 + moment(meeting.start_time).minutes() - ROOM_VIEW_START_HOUR * 60
  );
  const endMins = Math.min(
    totalMins,
    moment(meeting.end_time).hours() * 60 + moment(meeting.end_time).minutes() - ROOM_VIEW_START_HOUR * 60
  );
  const left = (startMins / totalMins) * 100;
  const width = Math.max(0.8, ((endMins - startMins) / totalMins) * 100);
  const { bg, border, opacity, gradient } = getMeetingBlockColor(meeting);
  return {
    left: `${left}%`,
    width: `${width}%`,
    background: gradient ?? bg,
    borderLeft: `3px solid ${border}`,
    opacity: opacity ?? 1,
  };
};

// Current-time indicator position (% trên trục X trong ngày hôm nay)
const roomViewNowPct = computed(() => {
  const now = roomViewNow.value;
  const totalMins = (ROOM_VIEW_END_HOUR - ROOM_VIEW_START_HOUR) * 60;
  const nowMins = now.hours() * 60 + now.minutes() - ROOM_VIEW_START_HOUR * 60;
  if (nowMins < 0 || nowMins > totalMins) return null;
  return (nowMins / totalMins) * 100;
});

// ── ROOM VIEW: mở EJS editor dùng chung với Bookings tab ────────────────────
// Scheduler luôn render (v-show) nên gọi thẳng openEditor, không cần chuyển tab

const rvOpenCreateEditor = () => {
  const now = new Date();
  const start = new Date(now); start.setHours(8, 0, 0, 0);
  const end   = new Date(now); end.setHours(9, 0, 0, 0);
  const instance = scheduleObj.value?.ej2Instances;
  instance?.openEditor(
    { start_time: start, end_time: end, startTime: start, endTime: end },
    "Add",
  );
};

// ID của meeting đang cần edit từ Room View — onPopupOpen đọc ref này
const _rvEditPendingId = ref(null);

const rvOpenEditEditor = (meeting) => {
  hideRvTooltip();
  const instance = scheduleObj.value?.ej2Instances;
  if (!instance) return;

  const source = scheduleDataList.value.find((e) => e.id === meeting.id) || meeting;

  // Lưu id vào ref — onPopupOpen sẽ dùng để tìm persistedRecord dù EJS reset popupData
  _rvEditPendingId.value = source.id;

  instance.openEditor(
    {
      startTime: new Date(source.start_time),
      endTime: new Date(source.end_time),
      start_time: new Date(source.start_time),
      end_time: new Date(source.end_time),
    },
    "Add",
  );
};

const rvScrollContainer = ref(null);

const rvTodayCol = ref(null);

const scrollRvToToday = () => {
  nextTick(() => {
    const container = rvScrollContainer.value;
    if (!container) return;
    // Dùng ref trực tiếp trên cột today để lấy offsetLeft thực tế
    const todayEl = Array.isArray(rvTodayCol.value)
      ? rvTodayCol.value[0]?.$el ?? rvTodayCol.value[0]
      : rvTodayCol.value?.$el ?? rvTodayCol.value;
    if (!todayEl) return;
    // Scroll sao cho cột today hiện ở đầu vùng nhìn (sau sticky room label w-44 = 176px)
    const targetX = todayEl.offsetLeft - 176;
    container.scrollTo({ left: Math.max(0, targetX), behavior: "smooth" });
  });
};

watch(activeTab, (tab) => {
  if (tab === "room-view") scrollRvToToday();
});

const rvTooltip = ref(null); // { meeting, x, y }

const rvTooltipStyle = computed(() => {
  if (!rvTooltip.value) return {};
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const tooltipW = 320;
  // Canh giữa theo block, tránh tràn phải màn hình
  let x = rvTooltip.value.x - tooltipW / 2;
  if (x + tooltipW > vw - 8) x = vw - tooltipW - 8;
  if (x < 8) x = 8;
  // Hiển thị phía trên block — dùng bottom tính từ viewport thay vì top + transform
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const bottom = vh - rvTooltip.value.y + 6;
  return { left: x + "px", bottom: bottom + "px" };
});

const showRvTooltip = (event, meeting) => {
  event.stopPropagation();
  const rect = event.currentTarget.getBoundingClientRect();
  rvTooltip.value = {
    meeting,
    x: rect.left + rect.width / 2,
    y: rect.top,   // top của block — tooltip sẽ hiện phía trên
  };
};

const hideRvTooltip = () => {
  rvTooltip.value = null;
};

// Đóng tooltip khi click ra ngoài (thêm vào handleOutsideClick đã có)
watch(
  () => rvTooltip.value,
  (val) => {
    if (val) {
      const close = () => {
        hideRvTooltip();
        window.removeEventListener("click", close);
      };
      setTimeout(() => window.addEventListener("click", close), 0);
    }
  }
);

// Approve / Reject từ Room View (dùng lại API giống tab Meetings)
const rvApprove = async (id) => {
  await approveBooking(id);
  hideRvTooltip();
};
const rvReject = async (id) => {
  await rejectBooking(id);
  hideRvTooltip();
};
const rvCheckIn = async (meeting) => {
  await handleCheckIn(meeting);
  hideRvTooltip();
};

onMounted(async () => {
  await loadData();
  document.addEventListener("click", handleOutsideClick);
  // Room View: cập nhật "now" mỗi phút để vẽ đường thời gian hiện tại
  roomViewTicker = setInterval(() => { roomViewNow.value = moment(); }, 60000);
  nextTick(() => {
    setupNotificationSocket();
    setTimeout(() => {
      const instance = scheduleObj.value?.ej2Instances;
      if (instance) {
        instance.dataBind();
        instance.refreshEvents();
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
    transform: scale(0.95) translateY(6px);
  }
  60% {
    transform: scale(1.01) translateY(-2px);
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
.custom-scrollbar-x::-webkit-scrollbar {
  height: 3px;
}
.custom-scrollbar-x::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 20px;
}
.custom-scrollbar-x::-webkit-scrollbar-thumb:hover {
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

/* ── QuickInfo popup overrides ─────────────────────────── */
/* Ẩn toàn bộ header mặc định (title bar + close icon của Syncfusion) */
.e-quick-popup-wrapper .e-popup-header {
  display: none !important;
}

/* Ẩn footer mặc định (More Details + Save / Edit + Delete) */
.e-quick-popup-wrapper .e-popup-footer {
  display: none !important;
}

/* Bỏ padding thừa của content wrapper vì header/footer đã ẩn */
.e-quick-popup-wrapper .e-popup-content {
  padding: 0 !important;
}

/* Bo góc + shadow gọn hơn */
.e-quick-popup-wrapper.e-popup {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
  border: 1px solid #f0f0f0 !important;
  overflow: hidden !important;
}
</style>
