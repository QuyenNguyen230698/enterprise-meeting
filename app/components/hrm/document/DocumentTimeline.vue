<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
        <i class="bi bi-diagram-3 text-blue-500"></i>
        Tiến trình phê duyệt
      </h3>
      <span class="text-xs text-gray-500">{{ doneCount }}/{{ steps.length }} bước</span>
    </div>

    <!-- Progress bar -->
    <div class="mb-5 bg-gray-100 rounded-full h-1.5">
      <div
        class="h-1.5 rounded-full transition-all duration-500"
        :class="isCompleted ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-blue-500'"
        :style="{ width: progressPct + '%' }"
      ></div>
    </div>

    <!-- Steps -->
    <div class="relative">
      <!-- Vertical connector line -->
      <div class="absolute left-4 top-5 bottom-5 w-px bg-gray-200"></div>

      <div class="space-y-4">
        <div
          v-for="(step, idx) in steps"
          :key="step.id || idx"
          class="relative flex gap-4"
        >
          <!-- Circle indicator -->
          <div class="relative z-10 shrink-0">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
              :class="stepCircleClass(step, idx)"
            >
              <i v-if="stepIsDone(step)" class="bi bi-check-lg text-sm"></i>
              <i v-else-if="stepIsRejected(step)" class="bi bi-x-lg text-sm"></i>
              <span v-else>{{ step.stepNumber }}</span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 pb-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 leading-tight">{{ step.name }}</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">
                    <span class="inline-flex items-center gap-1">
                      <i class="bi bi-building text-[10px]"></i>
                      {{ deptLabel(step.deptCode) }}
                    </span>
                    <span v-if="step.assignedUsers?.length" class="ml-2 inline-flex items-center gap-1 text-blue-600 font-medium">
                      <i class="bi bi-person-check text-[10px]"></i>
                      {{ step.assignedUsers.map(u => u.name).join(', ') }}
                    </span>
                    <span v-if="step.deadlineDays" class="ml-2 inline-flex items-center gap-1">
                      <i class="bi bi-clock text-[10px]"></i>
                      SLA: {{ step.deadlineDays }} ngày
                    </span>
                  </p>
              </div>

              <!-- Badge trạng thái -->
              <span
                class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                :class="stepBadgeClass(step, idx)"
              >
                <i :class="stepBadgeIcon(step, idx)" class="text-[10px]"></i>
                {{ stepBadgeLabel(step, idx) }}
              </span>
            </div>

            <!-- Log action của bước này (nếu có) -->
            <div
              v-if="getStepLog(step)"
              class="mt-2 pl-3 border-l-2 border-gray-200"
            >
              <p class="text-[11px] text-gray-600">
                <span class="font-semibold">{{ getStepLog(step).actorName }}</span>
                · {{ formatDate(getStepLog(step).actionAt) }}
              </p>
              <p v-if="getStepLog(step).note" class="text-[11px] text-gray-500 italic mt-0.5">
                "{{ getStepLog(step).note }}"
              </p>
              <!-- Chữ ký đã ký -->
              <div
                v-if="getStepLog(step).signatureUrl"
                class="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg"
              >
                <i class="bi bi-pen text-[10px]"></i>
                Đã ký số
              </div>
            </div>

            <!-- Bước bị từ chối: hiển thị lý do -->
            <div
              v-if="stepIsRejected(step) && getStepLog(step)?.note"
              class="mt-2 p-2 bg-red-50 rounded-lg border border-red-100"
            >
              <p class="text-[11px] text-red-700">
                <i class="bi bi-x-circle mr-1"></i>
                <strong>Lý do từ chối:</strong> {{ getStepLog(step)?.note }}
              </p>
            </div>

            <!-- Bước yêu cầu ký số -->
            <div
              v-if="stepIsActive(step, idx) && step.signatureRequired"
              class="mt-2 inline-flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-lg"
            >
              <i class="bi bi-pen-fill text-[10px]"></i>
              Bước này yêu cầu ký số
            </div>
          </div>
        </div>

        <!-- Hoàn thành -->
        <div v-if="isCompleted" class="relative flex gap-4">
          <div class="relative z-10 shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500">
              <i class="bi bi-trophy-fill text-white text-xs"></i>
            </div>
          </div>
          <div class="flex-1 pb-1">
            <p class="text-sm font-bold text-green-700">Biên bản hoàn thành</p>
            <p v-if="completedAt" class="text-[11px] text-gray-400 mt-0.5">
              {{ formatDate(completedAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  steps: { type: Array, default: () => [] },     // workflowSteps từ template
  logs:  { type: Array, default: () => [] },      // approval logs từ instance
  status: { type: String, default: 'DRAFT' },
  completedAt: { type: String, default: null },
})

const isCompleted = computed(() => props.status === 'COMPLETED')
const isRejected  = computed(() => props.status === 'REJECTED')

const doneCount = computed(() => {
  if (isCompleted.value) return props.steps.length
  const idx = props.steps.findIndex(s => s.statusPending === props.status)
  return idx === -1 ? 0 : idx
})

const progressPct = computed(() => {
  if (!props.steps.length) return 0
  if (isCompleted.value) return 100
  return Math.round((doneCount.value / props.steps.length) * 100)
})

// ── Step state helpers ─────────────────────────────────────────────────────────
function stepIsDone(step) {
  if (isCompleted.value) return true
  const current = props.steps.findIndex(s => s.statusPending === props.status)
  const stepIdx = props.steps.indexOf(step)
  return stepIdx < current
}

function stepIsActive(step, idx) {
  if (isCompleted.value || isRejected.value) return false
  return step.statusPending === props.status
}

function stepIsRejected(step) {
  if (!isRejected.value) return false
  const log = getStepLog(step)
  return log?.action === 'reject'
}

function stepIsPending(step, idx) {
  return !stepIsDone(step) && !stepIsActive(step, idx) && !stepIsRejected(step)
}

// ── Log lookup ─────────────────────────────────────────────────────────────────
function getStepLog(step) {
  return props.logs?.find(l => l.stepNumber === step.stepNumber) || null
}

// ── Circle / badge styling ─────────────────────────────────────────────────────
function stepCircleClass(step, idx) {
  if (stepIsDone(step))              return 'bg-green-500 border-green-500 text-white'
  if (stepIsRejected(step))          return 'bg-red-500 border-red-500 text-white'
  if (stepIsActive(step, idx))       return 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200'
  return 'bg-white border-gray-300 text-gray-400'
}

function stepBadgeClass(step, idx) {
  if (stepIsDone(step))              return 'bg-green-50 text-green-700'
  if (stepIsRejected(step))          return 'bg-red-50 text-red-700'
  if (stepIsActive(step, idx))       return 'bg-blue-50 text-blue-700 animate-pulse'
  return 'bg-gray-100 text-gray-400'
}

function stepBadgeIcon(step, idx) {
  if (stepIsDone(step))              return 'bi bi-check-circle-fill'
  if (stepIsRejected(step))          return 'bi bi-x-circle-fill'
  if (stepIsActive(step, idx))       return 'bi bi-hourglass-split'
  return 'bi bi-circle'
}

function stepBadgeLabel(step, idx) {
  if (stepIsDone(step))              return 'Hoàn thành'
  if (stepIsRejected(step))          return 'Từ chối'
  if (stepIsActive(step, idx))       return 'Đang xử lý'
  return 'Chờ'
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const DEPT_LABEL = {
  EMPLOYEE: 'Nhân viên tạo', MANAGER: 'Trưởng phòng',
  HR_STAFF: 'Nhân sự', HR_MANAGER: 'Trưởng/Phó Nhân sự', GM: 'Ban Giám đốc',
}
const deptLabel = (code) => DEPT_LABEL[code] || code || '—'

const formatDate = (val) => {
  if (!val) return '—'
  return new Date(val).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>
