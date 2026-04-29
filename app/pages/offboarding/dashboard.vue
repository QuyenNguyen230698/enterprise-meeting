<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-20">
      <div class="px-4 sm:px-6 py-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <i class="bi bi-graph-up-arrow text-white text-lg sm:text-xl"></i>
            </div>
            <div>
              <h1 class="text-lg sm:text-2xl font-bold text-gray-900">Offboarding Dashboard</h1>
              <p class="text-xs text-gray-500 hidden sm:block">Báo cáo biến động nhân sự · {{ currentYear }}</p>
            </div>
          </div>

          <!-- Period filter -->
          <div class="flex items-center gap-2">
            <select
              v-model="selectedYear"
              class="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:border-violet-400 focus:outline-none"
            >
              <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
            <select
              v-model="selectedMonth"
              class="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:border-violet-400 focus:outline-none"
            >
              <option value="">Cả năm</option>
              <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
            </select>
            <button
              @click="loadDashboard"
              class="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <i class="bi bi-arrow-clockwise" :class="loading ? 'animate-spin' : ''"></i>
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-6xl mx-auto space-y-6">

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-violet-500 border-t-transparent"></div>
        </div>

        <template v-else>

          <!-- KPI Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KpiCard
              label="Tổng đơn"
              :value="stats.total"
              icon="bi-file-earmark-text"
              color="violet"
            />
            <KpiCard
              label="Đang xử lý"
              :value="stats.inProgress"
              icon="bi-hourglass-split"
              color="amber"
            />
            <KpiCard
              label="Hoàn tất"
              :value="stats.completed"
              icon="bi-check-circle"
              color="emerald"
            />
            <KpiCard
              label="Từ chối / Blocked"
              :value="stats.rejectedOrBlocked"
              icon="bi-x-circle"
              color="red"
            />
          </div>

          <!-- Charts row -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <!-- By department -->
            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="bi bi-building text-violet-500"></i>
                Theo Bộ Phận
              </h3>
              <div class="space-y-3">
                <div
                  v-for="dept in statsByDept"
                  :key="dept.name"
                  class="flex items-center gap-3"
                >
                  <div class="w-28 text-xs text-gray-500 truncate shrink-0">{{ dept.name }}</div>
                  <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      class="h-2 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                      :style="{ width: `${dept.percent}%` }"
                    ></div>
                  </div>
                  <div class="w-8 text-xs font-semibold text-gray-700 text-right">{{ dept.count }}</div>
                </div>
                <div v-if="!statsByDept.length" class="text-center py-4 text-gray-400 text-xs">Không có dữ liệu</div>
              </div>
            </div>

            <!-- By status -->
            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="bi bi-pie-chart text-violet-500"></i>
                Theo Trạng Thái
              </h3>
              <div class="space-y-3">
                <div
                  v-for="s in statsByStatus"
                  :key="s.status"
                  class="flex items-center gap-3"
                >
                  <span
                    class="w-2 h-2 rounded-full shrink-0"
                    :class="s.dotClass"
                  ></span>
                  <div class="flex-1 text-xs text-gray-600">{{ s.label }}</div>
                  <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      class="h-2 rounded-full transition-all duration-500"
                      :class="s.barClass"
                      :style="{ width: `${s.percent}%` }"
                    ></div>
                  </div>
                  <div class="w-8 text-xs font-semibold text-gray-700 text-right">{{ s.count }}</div>
                </div>
                <div v-if="!statsByStatus.length" class="text-center py-4 text-gray-400 text-xs">Không có dữ liệu</div>
              </div>
            </div>

          </div>

          <!-- SLA Warning: overdue processes -->
          <div
            v-if="overdueProcesses.length"
            class="bg-red-50 border border-red-200 rounded-2xl p-5"
          >
            <h3 class="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
              <i class="bi bi-exclamation-triangle-fill text-red-500"></i>
              Cảnh Báo SLA — {{ overdueProcesses.length }} đơn quá hạn
            </h3>
            <div class="space-y-2">
              <div
                v-for="p in overdueProcesses"
                :key="p.id"
                class="flex items-center justify-between gap-3 p-3 bg-white border border-red-100 rounded-xl cursor-pointer hover:border-red-300 transition-colors"
                @click="navigateTo(`/offboarding/${p.id}`)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs shrink-0">
                    {{ initials(p.employee_name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-800 truncate">{{ p.employee_name }}</p>
                    <p class="text-[11px] text-gray-400">{{ p.dept_code || p.department }} · {{ p.application_ref }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <span class="px-2 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-700">
                    LWD: {{ formatDate(p.last_working_day) }}
                  </span>
                  <p class="text-[10px] text-red-500 mt-0.5">
                    {{ daysOverdue(p.last_working_day) }} ngày quá hạn
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent processes table -->
          <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                <i class="bi bi-clock-history text-violet-500"></i>
                Đơn Gần Đây
              </h3>
              <NuxtLink
                to="/offboarding"
                class="text-xs text-violet-600 hover:underline flex items-center gap-1"
              >
                Xem tất cả <i class="bi bi-arrow-right"></i>
              </NuxtLink>
            </div>

            <div v-if="!recentProcesses.length" class="text-center py-10 text-gray-400 text-sm">
              Không có đơn nào trong kỳ này.
            </div>

            <div v-else>
              <!-- Table header -->
              <div class="grid grid-cols-12 gap-3 px-5 py-2.5 bg-gray-50/50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                <div class="col-span-3">Nhân viên</div>
                <div class="col-span-2">Bộ phận</div>
                <div class="col-span-2">Ngày nộp</div>
                <div class="col-span-2">LWD</div>
                <div class="col-span-2">Trạng thái</div>
                <div class="col-span-1">HO</div>
              </div>

              <div
                v-for="p in recentProcesses"
                :key="p.id"
                class="grid grid-cols-12 gap-3 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer items-center"
                @click="navigateTo(`/offboarding/${p.id}`)"
              >
                <div class="col-span-3 flex items-center gap-2 min-w-0">
                  <div class="w-7 h-7 rounded-lg bg-linear-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {{ initials(p.employee_name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-gray-800 truncate">{{ p.employee_name }}</p>
                    <p class="text-[10px] text-gray-400 truncate">{{ p.employee_code }}</p>
                  </div>
                </div>
                <div class="col-span-2 text-xs text-gray-500 truncate">{{ p.dept_code || p.department }}</div>
                <div class="col-span-2 text-xs text-gray-500">{{ formatDate(p.resignation_date) }}</div>
                <div
                  class="col-span-2 text-xs font-medium"
                  :class="isLWDSoon(p.last_working_day) ? 'text-red-500 font-semibold' : 'text-gray-500'"
                >{{ formatDate(p.last_working_day) }}</div>
                <div class="col-span-2">
                  <span
                    class="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase"
                    :class="statusBadgeClass(p.status)"
                  >{{ statusLabel(p.status) }}</span>
                </div>
                <div class="col-span-1 text-xs font-semibold" :class="handoverCount(p) === 3 ? 'text-green-600' : 'text-gray-400'">
                  {{ handoverCount(p) }}/3
                </div>
              </div>
            </div>
          </div>

          <!-- Payment schedule this month -->
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i class="bi bi-cash-coin text-emerald-500"></i>
              Lịch Thanh Toán — Ngày 05/{{ nextMonthLabel }}
            </h3>
            <div v-if="!upcomingPayments.length" class="text-center py-6 text-gray-400 text-xs">
              Không có thanh toán nào trong kỳ tới.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="p in upcomingPayments"
                :key="p.id"
                class="flex items-center justify-between gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl"
              >
                <div class="flex items-center gap-3">
                  <i class="bi bi-person-check text-emerald-500"></i>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ p.employee_name }}</p>
                    <p class="text-xs text-gray-400">{{ p.dept_code || p.department }} · LWD: {{ formatDate(p.last_working_day) }}</p>
                  </div>
                </div>
                <span class="text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-3 py-1 rounded-lg">
                  {{ formatDate(p.payment_date) }}
                </span>
              </div>
            </div>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'offboarding'] })

const offboardingStore = useOffboardingStore()

const loading       = ref(false)
const selectedYear  = ref(new Date().getFullYear())
const selectedMonth = ref('')

const currentYear = computed(() => selectedYear.value)

const yearOptions = computed(() => {
  const y = new Date().getFullYear()
  return [y - 1, y, y + 1]
})

const nextMonthLabel = computed(() => {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
})

// ── Load data ──────────────────────────────────────────────────────────────────
const loadDashboard = async () => {
  loading.value = true
  await offboardingStore.fetchProcesses()
  loading.value = false
}

onMounted(loadDashboard)

// ── Filtered by period ─────────────────────────────────────────────────────────
const periodProcesses = computed(() => {
  return offboardingStore.processes.filter(p => {
    const d = new Date(p.resignation_date)
    if (d.getFullYear() !== selectedYear.value) return false
    if (selectedMonth.value !== '' && d.getMonth() + 1 !== selectedMonth.value) return false
    return true
  })
})

// ── KPI stats ─────────────────────────────────────────────────────────────────
const TERMINAL = ['COMPLETED', 'COMPLETED_BLOCKED', 'REJECTED']
const IN_PROGRESS_STATUSES = ['PENDING_MANAGER','PENDING_HR_PROCESS','PENDING_HR_APPROVAL','PENDING_GM','PENDING_HANDOVER']

const stats = computed(() => {
  const list = periodProcesses.value
  return {
    total:             list.length,
    inProgress:        list.filter(p => IN_PROGRESS_STATUSES.includes(p.status)).length,
    completed:         list.filter(p => p.status === 'COMPLETED').length,
    rejectedOrBlocked: list.filter(p => p.status === 'REJECTED' || p.status === 'COMPLETED_BLOCKED').length,
  }
})

// ── By department ──────────────────────────────────────────────────────────────
const statsByDept = computed(() => {
  const map = {}
  for (const p of periodProcesses.value) {
    const dept = p.dept_code || p.department || 'Không rõ'
    map[dept] = (map[dept] ?? 0) + 1
  }
  const total = periodProcesses.value.length || 1
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }))
})

// ── By status ──────────────────────────────────────────────────────────────────
const STATUS_META = {
  PENDING_MANAGER:     { label: 'Chờ Manager',     dotClass: 'bg-amber-400',   barClass: 'bg-amber-400' },
  PENDING_HR_PROCESS:  { label: 'HR Xử lý',        dotClass: 'bg-amber-500',   barClass: 'bg-amber-500' },
  PENDING_HR_APPROVAL: { label: 'Chờ HR Duyệt',    dotClass: 'bg-orange-400',  barClass: 'bg-orange-400' },
  PENDING_GM:          { label: 'Chờ GM',           dotClass: 'bg-blue-500',    barClass: 'bg-blue-500' },
  PENDING_HANDOVER:    { label: 'Bàn Giao',         dotClass: 'bg-purple-500',  barClass: 'bg-purple-500' },
  COMPLETED:           { label: 'Hoàn Tất',         dotClass: 'bg-emerald-500', barClass: 'bg-emerald-500' },
  COMPLETED_BLOCKED:   { label: 'Bị Chặn',          dotClass: 'bg-red-500',     barClass: 'bg-red-500' },
  REJECTED:            { label: 'Từ Chối',          dotClass: 'bg-red-400',     barClass: 'bg-red-400' },
}

const statsByStatus = computed(() => {
  const map = {}
  for (const p of periodProcesses.value) {
    map[p.status] = (map[p.status] ?? 0) + 1
  }
  const total = periodProcesses.value.length || 1
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([status, count]) => ({
      status,
      count,
      percent:  Math.round((count / total) * 100),
      label:    STATUS_META[status]?.label    ?? status,
      dotClass: STATUS_META[status]?.dotClass ?? 'bg-gray-400',
      barClass: STATUS_META[status]?.barClass ?? 'bg-gray-400',
    }))
})

// ── Overdue (LWD đã qua, chưa complete) ──────────────────────────────────────
const overdueProcesses = computed(() =>
  offboardingStore.processes.filter(p => {
    if (TERMINAL.includes(p.status)) return false
    if (!p.last_working_day) return false
    return new Date(p.last_working_day) < new Date(new Date().toDateString())
  })
)

// ── Recent 10 đơn ─────────────────────────────────────────────────────────────
const recentProcesses = computed(() =>
  [...periodProcesses.value]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
)

// ── Upcoming payments ─────────────────────────────────────────────────────────
const upcomingPayments = computed(() => {
  const next5 = (() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth() + 1, 5).toDateString()
  })()
  return offboardingStore.processes.filter(p =>
    p.status === 'COMPLETED' &&
    p.payment_date &&
    new Date(p.payment_date).toDateString() === next5
  )
})

// ── Helpers ────────────────────────────────────────────────────────────────────
const STATUS_LABEL = {
  DRAFT:               'Draft',
  PENDING_MANAGER:     'Chờ Manager',
  PENDING_HR_PROCESS:  'HR Xử Lý',
  PENDING_HR_APPROVAL: 'Chờ HR Duyệt',
  PENDING_GM:          'Chờ GM',
  PENDING_HANDOVER:    'Bàn Giao',
  COMPLETED:           'Hoàn Tất',
  COMPLETED_BLOCKED:   'Bị Chặn',
  REJECTED:            'Từ Chối',
}

const statusLabel = (s) => STATUS_LABEL[s] ?? s

const STATUS_BADGE = {
  DRAFT:               'bg-gray-100 text-gray-500',
  PENDING_MANAGER:     'bg-amber-100 text-amber-700',
  PENDING_HR_PROCESS:  'bg-amber-100 text-amber-700',
  PENDING_HR_APPROVAL: 'bg-orange-100 text-orange-700',
  PENDING_GM:          'bg-blue-100 text-blue-700',
  PENDING_HANDOVER:    'bg-purple-100 text-purple-700',
  COMPLETED:           'bg-emerald-100 text-emerald-700',
  COMPLETED_BLOCKED:   'bg-red-100 text-red-700',
  REJECTED:            'bg-red-100 text-red-700',
}

const statusBadgeClass = (s) => STATUS_BADGE[s] ?? 'bg-gray-100 text-gray-500'

const handoverCount = (p) => {
  const h = p.handover
  if (!h) return 0
  return [h.ho1_status, h.ho2_status, h.ho3_status].filter(s => s === 'CONFIRMED').length
}

const daysOverdue = (lwd) => {
  if (!lwd) return 0
  return Math.ceil((Date.now() - new Date(lwd).getTime()) / 86400000)
}

const isLWDSoon = (lwd) => {
  if (!lwd) return false
  return (new Date(lwd).getTime() - Date.now()) / 86400000 <= 3
}

const initials = (name) =>
  (name ?? '?').split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
