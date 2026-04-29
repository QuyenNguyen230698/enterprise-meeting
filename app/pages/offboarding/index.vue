<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-20">
      <div class="px-4 sm:px-6 py-4">
        <div class="flex flex-col gap-3">

          <!-- Top Row -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <i class="bi bi-box-arrow-right text-white text-lg sm:text-xl"></i>
              </div>
              <div>
                <h1 class="text-lg sm:text-2xl font-bold text-gray-900">Offboarding</h1>
                <p class="text-xs text-gray-500 hidden sm:block">{{ roleLabel }} · Quản lý quy trình nghỉ việc</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <NuxtLink
                to="/sign-hub"
                class="px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <i class="bi bi-pen-fill"></i>
                <span class="hidden sm:inline">Sign Hub</span>
                <span
                  v-if="gmPendingCount"
                  class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center"
                >{{ gmPendingCount }}</span>
              </NuxtLink>

              <!-- HR/GM quick links -->
              <template v-if="!isEmployee">
                <NuxtLink
                  v-if="can('view_reports')"
                  to="/offboarding/dashboard"
                  class="px-3 py-2 text-sm font-semibold text-violet-600 bg-violet-50 border border-violet-200 hover:bg-violet-100 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <i class="bi bi-graph-up-arrow"></i>
                  <span class="hidden sm:inline">Dashboard</span>
                </NuxtLink>
              </template>

              <!-- Employee: nút nộp đơn -->
              <NuxtLink
                v-if="isEmployee && canSubmitByDeptCode && !hasPendingProcess"
                to="/offboarding/submit"
                class="px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <i class="bi bi-plus-lg"></i>
                <span class="hidden sm:inline">Nộp Đơn Thôi Việc</span>
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <div class="relative grow min-w-64">
              <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                v-model.trim="searchQuery"
                type="text"
                placeholder="Tìm theo mã đơn, tên nhân viên, mã nhân viên..."
                class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:border-orange-400 focus:outline-none"
              />
            </div>
            <button
              @click="handleRefresh"
              :disabled="offboardingStore.loading"
              class="px-3 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <i class="bi" :class="offboardingStore.loading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'"></i>
              Cập nhật
            </button>
          </div>

          <!-- Filters (HR/GM/Manager) -->
          <div v-if="!isEmployee" class="flex items-center gap-2 flex-wrap">
            <button
              v-for="f in statusFilters"
              :key="f.value"
              @click="activeFilter = f.value"
              class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              :class="activeFilter === f.value
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
            >
              {{ f.label }}
              <span v-if="f.count !== undefined" class="ml-1 opacity-70">({{ f.count }})</span>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-6xl mx-auto space-y-4">

        <!-- Loading -->
        <div v-if="offboardingStore.loading" class="flex items-center justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
        </div>

        <!-- Employee: My Process view -->
        <template v-else-if="isEmployee">
          <div
            v-if="!hasPendingProcess && rejectedMyProcesses.length"
            class="flex items-start justify-between gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div class="flex items-start gap-3">
              <i class="bi bi-x-octagon-fill text-red-500 text-lg mt-0.5 shrink-0"></i>
              <div>
                <p class="text-sm font-semibold text-red-800">Đơn trước đã bị từ chối, bạn có thể nộp lại.</p>
                <p class="text-xs text-red-600 mt-0.5">
                  Bạn có {{ rejectedMyProcesses.length }} đơn bị từ chối trước đó. Vui lòng cập nhật thông tin và gửi đơn mới để tiếp tục quy trình.
                </p>
              </div>
            </div>
            <NuxtLink
              to="/offboarding/submit"
              class="shrink-0 px-3 py-2 text-xs font-semibold text-red-700 bg-white border border-red-300 hover:bg-red-100 rounded-lg transition-colors"
            >
              Nộp lại
            </NuxtLink>
          </div>

          <div v-if="!activeMyProcesses.length && !rejectedMyProcesses.length" class="text-center py-16">
            <i class="bi bi-file-earmark-plus text-5xl text-gray-200 mb-4 block"></i>
            <p class="text-gray-500 font-medium">Bạn chưa có đơn thôi việc nào</p>
            <NuxtLink
              v-if="canSubmitByDeptCode"
              to="/offboarding/submit"
              class="inline-block mt-4 px-5 py-2.5 bg-linear-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-red-600 transition-all active:scale-95"
            >
              <i class="bi bi-plus-lg mr-1"></i>Nộp Đơn Thôi Việc
            </NuxtLink>
            <p v-else class="text-xs text-amber-600 mt-3">
              Tài khoản quản lý không được phép nộp đơn nghỉ việc trên hệ thống.
            </p>
          </div>

          <!-- Active process timeline -->
          <div v-if="activeMyProcesses.length" class="space-y-4">
            <div
              v-for="p in activeMyProcesses"
              :key="p.id"
              class="space-y-3"
            >
              <OffboardingApprovalTimeline :process="p" />
              <NuxtLink
                :to="`/offboarding/${p.id}`"
                class="inline-flex px-5 py-2.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-colors items-center gap-2"
              >
                <i class="bi bi-eye"></i> Xem Chi Tiết & Bàn Giao
              </NuxtLink>
            </div>
          </div>

          <!-- Rejected history -->
          <div v-if="rejectedMyProcesses.length" class="space-y-3">
            <button
              type="button"
              class="w-full flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left hover:bg-red-100 transition-colors"
              @click="showRejectedHistory = !showRejectedHistory"
            >
              <div class="flex items-center gap-2 min-w-0">
                <i class="bi bi-x-octagon-fill text-red-500"></i>
                <p class="text-sm font-semibold text-red-700 truncate">
                  Lịch sử đơn bị từ chối ({{ rejectedMyProcesses.length }}) · mới nhất trước
                </p>
              </div>
              <i
                class="bi text-red-500 transition-transform"
                :class="showRejectedHistory ? 'bi-chevron-up' : 'bi-chevron-down'"
              ></i>
            </button>

            <div v-if="showRejectedHistory" class="space-y-3">
              <div
                v-for="p in rejectedMyProcesses"
                :key="`rejected-${p.id}`"
                class="space-y-3"
              >
                <OffboardingApprovalTimeline :process="p" />
                <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <div class="flex items-start justify-between gap-3 flex-wrap">
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-red-800 flex items-center gap-1">
                        <i class="bi bi-sign-turn-right-fill"></i>
                        Action bị từ chối: {{ rejectMeta(p).stepLabel }}
                      </p>
                      <p class="text-xs text-red-700 mt-1">
                        Bởi: <span class="font-semibold">{{ rejectMeta(p).actor }}</span>
                        <span class="mx-1">·</span>
                        Thời điểm: <span class="font-semibold">{{ formatDate(rejectMeta(p).actedAt) }}</span>
                      </p>
                      <p class="text-xs text-red-600 mt-1">
                        Lý do: {{ rejectMeta(p).reason }}
                      </p>
                    </div>
                    <NuxtLink
                      v-if="!hasPendingProcess"
                      to="/offboarding/submit"
                      class="shrink-0 px-3 py-1.5 text-xs font-semibold text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Nộp lại
                    </NuxtLink>
                  </div>
                </div>
                <NuxtLink
                  :to="`/offboarding/${p.id}`"
                  class="inline-flex px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors items-center gap-2"
                >
                  <i class="bi bi-eye"></i> Xem Chi Tiết Đơn Bị Từ Chối
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>

        <!-- HR/Manager/GM: Dashboard table -->
        <template v-else>

          <!-- Empty state -->
          <div v-if="filteredProcesses.length === 0" class="text-center py-16">
            <i class="bi bi-inbox text-5xl text-gray-200 mb-4 block"></i>
            <p class="text-gray-500 font-medium">Không có đơn nào {{ activeFilter !== 'ALL' ? 'ở trạng thái này' : '' }}</p>
          </div>

          <!-- Process list -->
          <div v-else class="space-y-3">
            <div
              v-for="p in filteredProcesses"
              :key="p.id"
              class="bg-white border border-gray-200 rounded-2xl p-4 hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer group"
              @click="navigateTo(`/offboarding/${p.id}`)"
            >
              <div class="flex items-start justify-between gap-4 flex-wrap">

                <!-- Left: Employee info -->
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-linear-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {{ initials(p.employee_name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-gray-900">{{ p.employee_name }}</p>
                    <p class="text-xs text-gray-400">{{ p.employee_code }} · {{ p.dept_code || p.department }} · {{ p.job_title }}</p>
                  </div>
                </div>

                <!-- Middle: Application ref + dates -->
                <div class="hidden sm:flex flex-col items-center text-center min-w-30">
                  <p class="text-xs font-mono font-semibold text-blue-600">{{ p.application_ref }}</p>
                  <p class="text-[10px] text-gray-400 mt-0.5">Nộp: {{ formatDate(p.resignation_date) }}</p>
                  <p class="text-[10px] mt-0.5" :class="isLWDSoon(p.last_working_day) ? 'text-red-500 font-semibold' : 'text-gray-400'">
                    LWD: {{ formatDate(p.last_working_day) }}
                  </p>
                </div>

                <!-- Right: Status + action indicator -->
                <div class="flex items-center gap-3 shrink-0">
                  <span
                    class="px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wide"
                    :class="statusBadgeClass(p.status)"
                  >{{ statusLabel(p.status) }}</span>

                  <!-- Pending action dot for current user -->
                  <div
                    v-if="isPendingForMe(p)"
                    class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"
                    title="Cần thao tác của bạn"
                  ></div>

                  <i class="bi bi-chevron-right text-gray-300 group-hover:text-orange-400 transition-colors"></i>
                </div>
              </div>

              <!-- Handover progress (for PENDING_HANDOVER) -->
              <div v-if="p.status === 'PENDING_HANDOVER'" class="mt-3 pt-3 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-gray-400">Bàn giao:</span>
                  <div class="flex gap-1">
                    <div
                      v-for="i in 3" :key="i"
                      class="w-5 h-1.5 rounded-full"
                      :class="handoverCount(p) >= i ? 'bg-green-400' : 'bg-gray-200'"
                    ></div>
                  </div>
                  <span class="text-[10px] text-gray-500">{{ handoverCount(p) }}/3</span>
                </div>
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

const auth = useAuthStore()
const offboardingStore = useOffboardingStore()
const { offboardingRole, roleLabel, can } = useOffboardingRole()
const { profileDeptCode, profileDepartment, profileTitle, fetchProfile } = useUserProfile()
const toast = useToast()

const activeFilter = ref('ALL')
const searchQuery = ref('')
const showRejectedHistory = ref(false)

const isEmployee = computed(() => offboardingRole.value === 'EMPLOYEE')
const currentUserId = computed(() => auth.user?.portal_user_id ?? auth.user?.id ?? null)
const currentDeptCode   = profileDeptCode
const currentDepartment = profileDepartment
const currentTitle      = profileTitle
const canSubmitByDeptCode = computed(() => !['GM', 'DIRECTOR', 'MANAGER', 'LEADER', 'CHIEF'].some(k => currentDeptCode.value.includes(k)))

const deptRoot = (code) => String(code || '').toUpperCase().split('_')[0] || ''
const isManagerOrDirectorSameDept = (actorDeptCode, employeeDepartment) => {
  const actor = String(actorDeptCode || '').toUpperCase()
  const actorDeptRoot = deptRoot(actor) || deptRoot(currentDepartment.value)
  const isManagerLevel =
    actor.includes('MANAGER') ||
    actor.includes('DIRECTOR') ||
    currentTitle.value.includes('MANAGER') ||
    currentTitle.value.includes('DIRECTOR') ||
    currentTitle.value.includes('TRƯỞNG PHÒNG') ||
    currentTitle.value.includes('GIÁM ĐỐC')
  return actorDeptRoot === deptRoot(employeeDepartment) && isManagerLevel
}
const isHRStaff = (actorDeptCode) => {
  const actor = String(actorDeptCode || '').toUpperCase()
  return deptRoot(actor) === 'HR' && actor.includes('HR_STAFF')
}
const isHRManagerOrDirector = (actorDeptCode) => {
  const actor = String(actorDeptCode || '').toUpperCase()
  return deptRoot(actor) === 'HR' && (actor.includes('HR_MANAGER') || actor.includes('HR_DIRECTOR'))
}
const isGMDept = (actorDeptCode) => {
  const actor = String(actorDeptCode || '').toUpperCase()
  return actor === 'GM' || actor.includes('GM_DIRECTOR')
}

// Badge count cho Sign Hub button (số đơn đang chờ GM)
const gmPendingCount = computed(() =>
  offboardingStore.processes.filter(p => p.status === 'PENDING_GM').length
)

onMounted(() => {
  fetchProfile()
  offboardingStore.fetchProcesses()
})

// ── My process (Employee view) ─────────────────────────────────────────────────
const myProcesses = computed(() =>
  offboardingStore.processes
    .filter(p => String(p.employee_id) === String(currentUserId.value))
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
)

const hasPendingProcess = computed(() =>
  myProcesses.value.some(p => p.status !== 'REJECTED')
)

const rejectedMyProcesses = computed(() =>
  myProcesses.value
    .filter(p => p.status === 'REJECTED')
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
)

// Only show active/in-progress or completed flows in main employee list.
// Rejected records are surfaced by the warning card above.
const activeMyProcesses = computed(() =>
  myProcesses.value.filter(p => p.status !== 'REJECTED')
)

// ── Filters for dashboard ──────────────────────────────────────────────────────
const statusFilters = computed(() => {
  const all = offboardingStore.processes
  return [
    { value: 'ALL',                label: 'Tất cả',        count: all.length },
    { value: 'PENDING_MANAGER',    label: 'Chờ Manager',   count: all.filter(p => p.status === 'PENDING_MANAGER').length },
    { value: 'PENDING_HR_PROCESS', label: 'HR Xử Lý',      count: all.filter(p => p.status === 'PENDING_HR_PROCESS').length },
    { value: 'PENDING_HR_APPROVAL',label: 'Chờ HR Duyệt',  count: all.filter(p => p.status === 'PENDING_HR_APPROVAL').length },
    { value: 'PENDING_GM',         label: 'Chờ GM',        count: all.filter(p => p.status === 'PENDING_GM').length },
    { value: 'PENDING_HANDOVER',   label: 'Bàn Giao',      count: all.filter(p => p.status === 'PENDING_HANDOVER').length },
    { value: 'COMPLETED',          label: 'Hoàn Tất',      count: all.filter(p => p.status === 'COMPLETED').length },
    { value: 'REJECTED',           label: 'Từ Chối',       count: all.filter(p => p.status === 'REJECTED').length },
  ].filter(f => f.value === 'ALL' || f.count > 0)
})

const filteredProcesses = computed(() => {
  const keyword = searchQuery.value.toLowerCase()
  return offboardingStore.processes.filter((p) => {
    if (activeFilter.value !== 'ALL' && p.status !== activeFilter.value) return false
    if (!keyword) return true
    return [
      p.application_ref,
      p.employee_name,
      p.employee_code,
    ].some(v => String(v ?? '').toLowerCase().includes(keyword))
  })
})

const handleRefresh = async () => {
  await offboardingStore.fetchProcesses({ status: activeFilter.value === 'ALL' ? undefined : activeFilter.value })
  toast.success('Đã cập nhật danh sách')
}

// Orange dot: process đang chờ thao tác từ role hiện tại
const isPendingForMe = (p) => {
  const userDept = currentDeptCode.value
  const employeeDept = p?.department
  return (
    (p.status === 'PENDING_MANAGER' && isManagerOrDirectorSameDept(userDept, employeeDept)) ||
    (p.status === 'PENDING_HR_PROCESS' && isHRStaff(userDept)) ||
    (p.status === 'PENDING_HR_APPROVAL' && isHRManagerOrDirector(userDept)) ||
    (p.status === 'PENDING_GM' && isGMDept(userDept))
  )
}

const handoverCount = (p) => {
  const h = p.handover
  if (!h) return 0
  return [h.ho1_status, h.ho2_status, h.ho3_status].filter(s => s === 'CONFIRMED').length
}

const REJECT_STEP_LABEL = {
  2: 'Bước 2 · Manager approval',
  4: 'Bước 4 · HR approval',
  5: 'Bước 5 · GM approval',
  HO1: 'HO-1 · Bàn giao công việc',
  HO2: 'HO-2 · Bàn giao tài sản',
  HO3: 'HO-3 · Phỏng vấn nghỉ việc',
}

const rejectActorRoleLabel = (step) => {
  const action = String(step?.action ?? '').toLowerCase()
  if (action === 'reject_ho1') return 'Quản Lý Trực Tiếp'
  if (action === 'reject_ho2') return 'HR Staff'
  if (action === 'reject_ho3') return 'HR Staff'

  const stepNumber = Number(step?.step_number)
  if (stepNumber === 2) return 'Quản Lý Trực Tiếp'
  if (stepNumber === 4) return 'HR Manager/Director'
  if (stepNumber === 5) return 'Tổng Giám Đốc'
  return null
}

const rejectActorDisplay = (step) =>
  step?.actor_title ||
  rejectActorRoleLabel(step) ||
  step?.actor_name ||
  '—'

const rejectMeta = (p) => {
  const rejectedStep = (p?.steps ?? [])
    .filter((s) => {
      const action = String(s?.action ?? '').toLowerCase()
      return action === 'reject' || action === 'reject_ho1' || action === 'reject_ho2' || action === 'reject_ho3'
    })
    .sort((a, b) => new Date(b?.acted_at ?? 0).getTime() - new Date(a?.acted_at ?? 0).getTime())[0]

  if (!rejectedStep) {
    return {
      stepLabel: 'Không rõ bước',
      actor: '—',
      actedAt: null,
      reason: 'Không có ghi chú',
    }
  }

  const action = String(rejectedStep.action ?? '').toLowerCase()
  let stepLabel = REJECT_STEP_LABEL[Number(rejectedStep.step_number)] ?? `Bước ${rejectedStep.step_number}`
  if (action === 'reject_ho1') stepLabel = REJECT_STEP_LABEL.HO1
  if (action === 'reject_ho2') stepLabel = REJECT_STEP_LABEL.HO2
  if (action === 'reject_ho3') stepLabel = REJECT_STEP_LABEL.HO3

  return {
    stepLabel,
    actor: rejectActorDisplay(rejectedStep),
    actedAt: rejectedStep.acted_at || null,
    reason: rejectedStep.note || 'Không có ghi chú',
  }
}

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

const statusBadgeClass = (s) => {
  const map = {
    DRAFT:               'bg-gray-100 text-gray-600',
    PENDING_MANAGER:     'bg-amber-100 text-amber-700',
    PENDING_HR_PROCESS:  'bg-amber-100 text-amber-700',
    PENDING_HR_APPROVAL: 'bg-amber-100 text-amber-700',
    PENDING_GM:          'bg-blue-100 text-blue-700',
    PENDING_HANDOVER:    'bg-purple-100 text-purple-700',
    COMPLETED:           'bg-green-100 text-green-700',
    COMPLETED_BLOCKED:   'bg-red-100 text-red-700',
    REJECTED:            'bg-red-100 text-red-700',
  }
  return map[s] ?? 'bg-gray-100 text-gray-600'
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
