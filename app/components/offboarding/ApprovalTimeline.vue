<template>
  <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide" :class="statusClass">{{ statusLabel }}</span>
        <span class="text-xs text-gray-400">{{ completedCount }} of 7 steps completed</span>
      </div>
      <div class="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
        <span v-if="process.created_at"><i class="bi bi-calendar3 mr-1"></i>First submitted: {{ formatDate(process.created_at) }}</span>
        <span v-if="process.last_working_day" :class="isLWDSoon ? 'text-red-500 font-semibold' : ''">
          <i class="bi bi-flag mr-1"></i>Last day: {{ formatDate(process.last_working_day) }}
        </span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="mb-8">
      <div class="w-full bg-gray-100 rounded-full h-1.5">
        <div class="h-1.5 rounded-full bg-linear-to-r from-green-400 to-emerald-500 transition-all duration-500" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="text-right text-xs text-gray-400 mt-1">{{ progressPercent }}%</div>
    </div>

    <!-- Steps -->
    <div class="flex items-start justify-between gap-2 overflow-x-auto pb-2">
      <div v-for="(step, index) in steps" :key="step.number" class="flex flex-col items-center flex-1 min-w-22.5">
        <div class="flex items-center w-full">
          <div v-if="index > 0" class="flex-1 h-0.5 transition-colors" :class="lineClass(index)"></div>
          <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all" :class="circleClass(step)">
            <i v-if="step.status === 'done'" class="bi bi-check-lg text-white text-base"></i>
            <i v-else-if="step.status === 'active' || step.status === 'rejected'" :class="step.icon + ' text-white text-base'"></i>
            <span v-else class="text-gray-400 text-sm font-semibold">{{ step.number }}</span>
          </div>
          <div v-if="index < steps.length - 1" class="flex-1 h-0.5 transition-colors" :class="lineClass(index + 1)"></div>
        </div>
        <div class="mt-2 text-center">
          <p class="text-xs font-semibold" :class="stepLabelClass(step.status)">{{ step.label }}</p>
          <p class="text-[10px] text-gray-400 mt-0.5">{{ step.sla }}</p>
          <span v-if="step.badge" class="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full" :class="step.badgeClass">{{ step.badge }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  process: { type: Object, required: true },
})

const STEP_META = [
  { number: 1, label: 'Submit resignation', sla: 'Day 1',           icon: 'bi bi-file-earmark-text' },
  { number: 2, label: 'Manager approval',   sla: '1-3 days',        icon: 'bi bi-person-check' },
  { number: 3, label: 'HR process',         sla: '1-3 days',        icon: 'bi bi-clipboard-check' },
  { number: 4, label: 'HR Approval',        sla: '1 days',          icon: 'bi bi-patch-check' },
  { number: 5, label: 'GM Approval',        sla: '1 days',          icon: 'bi bi-award' },
  { number: 6, label: 'Handover & Form',    sla: '1 day before LWD',icon: 'bi bi-box-arrow-right' },
  { number: 7, label: 'Complete',           sla: 'Last day',        icon: 'bi bi-check-circle' },
]

const STATUS_STEP_MAP = {
  DRAFT: 1, PENDING_MANAGER: 2, PENDING_HR_PROCESS: 3,
  PENDING_HR_APPROVAL: 4, PENDING_GM: 5, PENDING_HANDOVER: 6,
  COMPLETED: 7, COMPLETED_BLOCKED: 7, REJECTED: 0,
}

const currentStep = computed(() => STATUS_STEP_MAP[props.process.status] ?? 1)

const rejectedStep = computed(() => {
  if (props.process.status !== 'REJECTED') return null
  const rejected = (props.process.steps ?? [])
    .filter((st) => {
      const action = String(st?.action ?? '').toLowerCase()
      return action === 'reject' || action === 'reject_ho1' || action === 'reject_ho2' || action === 'reject_ho3'
    })
    .sort((a, b) => new Date(b?.acted_at ?? 0).getTime() - new Date(a?.acted_at ?? 0).getTime())[0]
  const action = String(rejected?.action ?? '').toLowerCase()
  if (action === 'reject_ho1' || action === 'reject_ho2' || action === 'reject_ho3') return 6
  const stepNumber = Number(rejected?.step_number)
  return Number.isFinite(stepNumber) && stepNumber >= 1 && stepNumber <= 7 ? stepNumber : 2
})

const completedCount = computed(() => {
  if (props.process.status === 'REJECTED') {
    if (!rejectedStep.value) return 0
    return Math.max(0, rejectedStep.value - 1)
  }
  if (props.process.status === 'COMPLETED' || props.process.status === 'COMPLETED_BLOCKED') return 7
  return Math.max(0, currentStep.value - 1)
})

const progressPercent = computed(() => {
  if (props.process.status === 'COMPLETED' || props.process.status === 'COMPLETED_BLOCKED') return 100
  if (props.process.status === 'REJECTED') return Math.round((completedCount.value / 7) * 100)
  return Math.round((completedCount.value / 7) * 100)
})

const stepBadge = (stepNum) => {
  const s = props.process
  if (s.status === 'REJECTED' && rejectedStep.value === stepNum) {
    return { badge: 'Rejected', badgeClass: 'bg-red-100 text-red-700' }
  }
  if (stepNum === 1 && currentStep.value > 1) return { badge: 'Done', badgeClass: 'bg-green-100 text-green-700' }
  if (stepNum === 2) {
    if (currentStep.value > 2) return { badge: 'Approved', badgeClass: 'bg-green-100 text-green-700' }
  }
  if (stepNum === 3 && currentStep.value > 3) return { badge: 'Approved', badgeClass: 'bg-green-100 text-green-700' }
  if (stepNum === 4 && currentStep.value > 4) return { badge: 'Authorized', badgeClass: 'bg-blue-100 text-blue-700' }
  if (stepNum === 5 && currentStep.value > 5) return { badge: 'Approved', badgeClass: 'bg-green-100 text-green-700' }
  if (stepNum === 6 && currentStep.value === 6) {
    const h = s.handover
    const count = [h?.ho1_status, h?.ho2_status, h?.ho3_status].filter(x => x === 'CONFIRMED').length
    return { badge: `HO ${count}/3 · Exit pending`, badgeClass: 'bg-blue-100 text-blue-700' }
  }
  if (stepNum === 6 && currentStep.value > 6) return { badge: 'HO 3/3', badgeClass: 'bg-green-100 text-green-700' }
  if (stepNum === 7 && s.status === 'COMPLETED') return { badge: 'Completed', badgeClass: 'bg-green-100 text-green-700' }
  if (stepNum === 7 && s.status === 'COMPLETED_BLOCKED') return { badge: 'Blocked', badgeClass: 'bg-red-100 text-red-700' }
  return null
}

const steps = computed(() => STEP_META.map(meta => {
  const isRejected = rejectedStep.value === meta.number
  const isDone   = rejectedStep.value
    ? meta.number < rejectedStep.value
    : meta.number < currentStep.value
  const isActive = rejectedStep.value
    ? false
    : meta.number === currentStep.value
  const status   = isDone ? 'done' : isActive ? 'active' : 'pending'
  const finalStatus = isRejected ? 'rejected' : status
  const b = stepBadge(meta.number)
  return { ...meta, status: finalStatus, badge: b?.badge ?? null, badgeClass: b?.badgeClass ?? '' }
}))

const circleClass = (step) => {
  if (step.status === 'done')   return 'bg-green-500 shadow-md shadow-green-500/30'
  if (step.status === 'rejected') return 'bg-red-500 shadow-md shadow-red-500/30'
  if (step.status === 'active') return 'bg-blue-600 shadow-md shadow-blue-500/30'
  return 'bg-gray-100 border-2 border-gray-200'
}

const stepLabelClass = (status) => {
  if (status === 'done') return 'text-green-600'
  if (status === 'active') return 'text-blue-600'
  if (status === 'rejected') return 'text-red-600'
  return 'text-gray-400'
}

const lineClass = (lineAfterStepNumber) => {
  if (rejectedStep.value) {
    if (lineAfterStepNumber < rejectedStep.value) return 'bg-green-400'
    if (lineAfterStepNumber === rejectedStep.value) return 'bg-red-400'
    return 'bg-gray-200'
  }
  return lineAfterStepNumber <= currentStep.value ? 'bg-green-400' : 'bg-gray-200'
}

const STATUS_CLASS = {
  DRAFT: 'bg-gray-100 text-gray-600', PENDING_MANAGER: 'bg-amber-100 text-amber-700',
  PENDING_HR_PROCESS: 'bg-amber-100 text-amber-700', PENDING_HR_APPROVAL: 'bg-amber-100 text-amber-700',
  PENDING_GM: 'bg-blue-100 text-blue-700', PENDING_HANDOVER: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700', COMPLETED_BLOCKED: 'bg-red-100 text-red-700',
  REJECTED: 'bg-red-100 text-red-700',
}
const STATUS_LABELS = {
  DRAFT: 'Draft', PENDING_MANAGER: 'Pending Manager', PENDING_HR_PROCESS: 'HR Processing',
  PENDING_HR_APPROVAL: 'Pending HR Approval', PENDING_GM: 'Pending GM',
  PENDING_HANDOVER: 'Pending Handover', COMPLETED: 'Completed',
  COMPLETED_BLOCKED: 'Blocked', REJECTED: 'Rejected',
}

const statusClass = computed(() => STATUS_CLASS[props.process.status] ?? 'bg-gray-100 text-gray-600')
const statusLabel = computed(() => STATUS_LABELS[props.process.status] ?? props.process.status)
const isLWDSoon   = computed(() => {
  if (!props.process.last_working_day) return false
  return (new Date(props.process.last_working_day).getTime() - Date.now()) / 86400000 <= 3
})

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
