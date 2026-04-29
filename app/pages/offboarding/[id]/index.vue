<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-20">
      <div class="px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/offboarding"
            class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <i class="bi bi-arrow-left text-gray-600"></i>
          </NuxtLink>
          <div class="w-10 h-10 bg-linear-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <i class="bi bi-file-earmark-text-fill text-white text-lg"></i>
          </div>
          <div>
            <h1 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              {{ process?.application_ref || 'Đơn Thôi Việc' }}
              <span
                v-if="process"
                class="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase"
                :class="statusBadgeClass"
              >{{ statusLabel }}</span>
            </h1>
            <p class="text-xs text-gray-500">{{ process?.employee_name }} · {{ process?.dept_code || process?.department }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="canPrintForm"
            @click="openPrintView"
            class="px-3 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-1"
          >
            <i class="bi bi-printer"></i>
            <span class="hidden sm:inline">Xem & In đơn</span>
          </button>

          <!-- Process History + Raw DB buttons (HR/GM only) -->
          <div v-if="can('view_raw_db')" class="flex items-center gap-2">
          <button
            @click="showHistory = true"
            class="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <i class="bi bi-clock-history"></i>
            <span class="hidden sm:inline">Process History</span>
          </button>
          <button
            @click="showRawDb = true"
            class="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            <i class="bi bi-database"></i>
            <span class="hidden sm:inline">Raw DB</span>
          </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="offboardingStore.loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
    </div>

    <!-- Not found -->
    <div v-else-if="!process" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <i class="bi bi-file-earmark-x text-4xl text-gray-300 mb-3 block"></i>
        <p class="text-gray-500 font-medium">Không tìm thấy đơn thôi việc</p>
        <NuxtLink to="/offboarding" class="text-sm text-blue-500 underline mt-2 inline-block">Quay lại danh sách</NuxtLink>
      </div>
    </div>

    <!-- Main content -->
    <div v-else class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-6xl mx-auto space-y-5">

        <!-- Timeline -->
        <OffboardingApprovalTimeline :process="process" />

        <div
          v-if="showEmailPreview"
          class="flex items-start gap-3"
        >
          <!-- Email Mẫu 01 preview (sau GM approve, chỉ HR/GM xem) -->
          <OffboardingEmailMau01Preview
            :process="process"
            class="grow"
          />
          <button
            v-if="!isEmployeeRole"
            class="shrink-0 px-3 py-2 text-xs font-semibold rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-60 flex items-center gap-1.5"
            :disabled="offboardingStore.submitting"
            @click="handleResendConfirmationEmail"
          >
            <i :class="offboardingStore.submitting ? 'bi bi-arrow-repeat animate-spin' : 'bi bi-envelope-paper'"></i>
            Gửi lại Email Mẫu 01
          </button>
        </div>

        <!-- 2-col layout: Form + Action Panel -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <!-- Form (readonly view) -->
          <div class="lg:col-span-2">
            <OffboardingResignationForm
              :model-value="formSnapshot"
              :profile="employeeProfile"
              :application-ref="process.application_ref"
              :approvals="approvalSnapshot"
              readonly
            />
          </div>

          <!-- Right column: Action panel + Handover summary -->
          <div class="space-y-5">
            <div
              v-if="signatureRequiredNotice"
              class="bg-amber-50 border border-amber-200 rounded-2xl p-4"
            >
              <p class="text-xs font-semibold text-amber-800 flex items-center gap-1">
                <i class="bi bi-pen"></i>
                Bạn cần tạo chữ ký SignHub trước khi phê duyệt.
              </p>
              <p class="text-xs text-amber-700 mt-1">
                Hệ thống sẽ chuyển bạn đến trang Sign Hub...
              </p>
            </div>

            <!-- Approval action panel -->
            <OffboardingApprovalActionPanel
              :process="process"
              :current-step="offboardingStore.currentStep"
              :handover-progress="offboardingStore.handoverProgress"
              @action="handleAction"
              @override="handleOverride"
            />

            <!-- Handover checklist summary (Step 6+) -->
            <div
              v-if="process.status === 'PENDING_HANDOVER' || currentStep >= 6"
              class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="bi bi-box-arrow-right text-purple-500"></i>
                Bàn Giao ({{ offboardingStore.handoverProgress }}/3)
              </h3>
              <div
                v-if="handoverRejectedBanners.length && !isEmployeeRole"
                class="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 space-y-2"
              >
                <div class="text-xs font-bold text-red-800 flex items-center gap-1">
                  <i class="bi bi-exclamation-triangle-fill"></i>
                  Có hạng mục bàn giao bị từ chối
                </div>
                <div
                  v-for="item in handoverRejectedBanners"
                  :key="item.key"
                  class="text-xs text-red-700 bg-white border border-red-100 rounded-lg px-2.5 py-2"
                >
                  <span class="font-semibold">{{ item.label }}</span>
                  bị reject bởi <span class="font-semibold">{{ item.by || '—' }}</span>
                  <span class="mx-1">/</span>
                  Lý do: {{ item.reason || '—' }}
                </div>
              </div>
              <div class="space-y-3">
                <!-- HO-1 -->
                <OffboardingHandoverItem
                  title="HO-1: Bàn giao công việc"
                  subtitle="QF-HRA-17 · Xác nhận bởi Quản Lý"
                  :confirmed="process.handover?.ho1_status === 'CONFIRMED'"
                  :confirmed-by="process.handover?.ho1_confirmed_name"
                  :date="process.handover?.ho1_date"
                  :rejected="process.handover?.ho1_status === 'REJECTED'"
                  :rejected-by="process.handover?.ho1_rejected_name"
                  :rejected-date="process.handover?.ho1_rejected_date"
                  :reject-reason="process.handover?.ho1_reject_reason"
                  :can-confirm="false"
                  :can-reject="false"
                  :link-url="ho1LinkUrl"
                  :link-label="ho1LinkLabel"
                  :loading="offboardingStore.submitting"
                />
                <!-- HO-2 -->
                <OffboardingHandoverItem
                  title="HO-2: Bàn giao tài sản"
                  subtitle="QF-HRA-12 · Xác nhận bởi HR Staff"
                  :confirmed="process.handover?.ho2_status === 'CONFIRMED'"
                  :confirmed-by="process.handover?.ho2_confirmed_name"
                  :date="process.handover?.ho2_date"
                  :rejected="process.handover?.ho2_status === 'REJECTED'"
                  :rejected-by="process.handover?.ho2_rejected_name"
                  :rejected-date="process.handover?.ho2_rejected_date"
                  :reject-reason="process.handover?.ho2_reject_reason"
                  :can-confirm="false"
                  :can-reject="false"
                  :link-url="ho2LinkUrl"
                  :link-label="ho2LinkLabel"
                  :loading="offboardingStore.submitting"
                />
                <!-- HO-3 -->
                <OffboardingHandoverItem
                  title="HO-3: Phỏng vấn nghỉ việc"
                  subtitle="QF-HRA-11 · Xác nhận bởi HR Staff"
                  :confirmed="process.handover?.ho3_status === 'CONFIRMED'"
                  :confirmed-by="process.handover?.ho3_confirmed_name"
                  :date="process.handover?.ho3_date"
                  :rejected="process.handover?.ho3_status === 'REJECTED'"
                  :rejected-by="process.handover?.ho3_rejected_name"
                  :rejected-date="process.handover?.ho3_rejected_date"
                  :reject-reason="process.handover?.ho3_reject_reason"
                  :can-confirm="false"
                  :can-reject="false"
                  :link-url="ho3LinkUrl"
                  :link-label="ho3LinkLabel"
                  :loading="offboardingStore.submitting"
                />
              </div>

              <!-- Payment date (Step 7 completed) -->
              <div
                v-if="process.payment_date"
                class="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-600"
              >
                <i class="bi bi-calendar-check text-green-500"></i>
                Ngày thanh toán cuối: <span class="font-semibold text-green-600">{{ formatDate(process.payment_date) }}</span>
              </div>
            </div>

            <!-- Step 7: Complete / Block panel -->
            <OffboardingStep7CompletePanel
              v-if="currentStep >= 6 && isGMDept"
              :process="process"
              :is-gm-user="isGMDept"
              :loading="offboardingStore.submitting"
              @complete="handleStep7Complete"
              @block="handleStep7Block"
              @unblock="handleStep7Unblock"
            />

            <div
              v-if="rejectNotes.length"
              class="bg-red-50 border border-red-200 rounded-2xl p-5"
            >
              <h3 class="text-xs font-bold text-red-800 mb-3 flex items-center gap-1">
                <i class="bi bi-exclamation-octagon-fill"></i> Ghi Chú Từ Chối
              </h3>
              <div class="space-y-2">
                <div v-for="s in rejectNotes" :key="s.id" class="text-xs text-red-700 bg-white rounded-lg p-2 border border-red-100">
                  <span class="font-medium">{{ rejectStepLabel(s) }} · {{ rejectActorDisplay(s) }}</span>
                  <span class="text-red-300 mx-1">·</span>
                  {{ formatDate(s.acted_at) }}
                  <p class="mt-1 text-red-600">{{ s.note }}</p>
                </div>
              </div>
            </div>

            <!-- Internal notes (HR/GM only) -->
            <div
              v-if="can('view_internal_notes') && internalNotes.length"
              class="bg-amber-50 border border-amber-200 rounded-2xl p-5"
            >
              <h3 class="text-xs font-bold text-amber-800 mb-3 flex items-center gap-1">
                <i class="bi bi-sticky-fill"></i> Ghi Chú Nội Bộ HR
              </h3>
              <div class="space-y-2">
                <div v-for="s in internalNotes" :key="s.id" class="text-xs text-amber-700 bg-white rounded-lg p-2 border border-amber-100">
                  <span class="font-medium">{{ s.actor_name }}</span>
                  <span class="text-amber-400 mx-1">·</span>
                  {{ formatDate(s.acted_at) }}
                  <p class="mt-1 text-amber-600">{{ s.note }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Process History Modal -->
    <div v-if="showHistory" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div class="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <i class="bi bi-clock-history text-blue-500"></i> Process History
          </h3>
          <button @click="showHistory = false" class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
            <i class="bi bi-x-lg text-gray-500"></i>
          </button>
        </div>
        <div class="overflow-y-auto p-5 space-y-3">
          <div v-for="step in process?.steps ?? []" :key="step.id" class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-bold text-gray-500">
              {{ step.step_number }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-semibold text-gray-800">{{ step.actor_name || '—' }}</span>
                <span
                  class="px-1.5 py-0.5 text-[10px] rounded-full font-medium"
                  :class="actionBadgeClass(step.action)"
                >{{ step.action }}</span>
                <span class="text-[10px] text-gray-400">{{ formatDate(step.acted_at) }}</span>
              </div>
              <p v-if="step.note" class="text-xs text-gray-500 mt-0.5">{{ step.note }}</p>
            </div>
          </div>
          <div v-if="!process?.steps?.length" class="text-center py-6 text-gray-400 text-sm">
            Chưa có lịch sử thao tác.
          </div>
        </div>
      </div>
    </div>

    <!-- Raw DB Modal -->
    <div v-if="showRawDb" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div class="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <i class="bi bi-database text-blue-500"></i> Raw DB
          </h3>
          <button @click="showRawDb = false" class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100">
            <i class="bi bi-x-lg text-gray-500"></i>
          </button>
        </div>
        <div class="overflow-y-auto p-5">
          <pre class="text-xs bg-gray-50 rounded-xl p-4 overflow-x-auto text-gray-700">{{ JSON.stringify(process, null, 2) }}</pre>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'offboarding'] })

const route = useRoute()
const offboardingStore = useOffboardingStore()
const toast = useToast()
const auth = useAuthStore()
const { can, offboardingRole } = useOffboardingRole()
const { profileDeptCode, profileDepartment, profileTitle, fetchProfile } = useUserProfile()

const showHistory = ref(false)
const showRawDb   = ref(false)
const signatureRequiredNotice = ref(false)

const process = computed(() => offboardingStore.currentProcess)
const currentStep = computed(() => offboardingStore.currentStep)
const currentDeptCode   = profileDeptCode
const currentDepartment = profileDepartment
const currentTitle      = profileTitle
const processDeptCode = computed(() =>
  String(process.value?.dept_code ?? process.value?.department ?? '').toUpperCase()
)
const canPrintForm = computed(() => process.value?.status === 'COMPLETED')
const deptRoot = (code) => String(code || '').toUpperCase().split('_')[0] || ''
const inferDeptRootFromTitle = (title) => {
  const t = String(title || '').toUpperCase()
  if (!t) return ''
  if (t.includes('NHÂN SỰ') || t.includes('HR')) return 'HR'
  if (t.includes('TỔNG GIÁM ĐỐC') || t.includes('GM')) return 'GM'
  if (t.includes(' IT') || t.startsWith('IT') || t.includes('CÔNG NGHỆ THÔNG TIN')) return 'IT'
  if (t.includes('MARKETING') || t.includes('MKT')) return 'MKT'
  if (t.includes('KINH DOANH') || t.includes('SALES')) return 'SALES'
  if (t.includes('KẾ TOÁN') || t.includes('ACC')) return 'ACC'
  if (t.includes('SẢN XUẤT') || t.includes('PROD')) return 'PROD'
  if (t.includes('KHO VẬN') || t.includes('LOG')) return 'LOG'
  if (t.includes('KỸ THUẬT') || t.includes('TECH')) return 'TECH'
  return ''
}
const actorDeptRoot = computed(() => deptRoot(currentDeptCode.value) || deptRoot(currentDepartment.value) || inferDeptRootFromTitle(currentTitle.value))
const isManagerOrDirectorSameDept = computed(() => {
  const actorCode = currentDeptCode.value
  const actorRoot = actorDeptRoot.value
  const isManagerLevel =
    actorCode.includes('MANAGER') ||
    actorCode.includes('DIRECTOR') ||
    currentTitle.value.includes('MANAGER') ||
    currentTitle.value.includes('DIRECTOR') ||
    currentTitle.value.includes('TRƯỞNG PHÒNG') ||
    currentTitle.value.includes('GIÁM ĐỐC')
  return actorRoot && actorRoot === deptRoot(processDeptCode.value) && isManagerLevel
})
const isHRStaff = computed(() => {
  const actorCode = currentDeptCode.value
  return actorDeptRoot.value === 'HR' && (actorCode.includes('HR_STAFF') || currentTitle.value.includes('CHUYÊN VIÊN NHÂN SỰ'))
})
const isHRManagerOrDirector = computed(() => {
  const actorCode = currentDeptCode.value
  const isTitleHRLead = currentTitle.value.includes('TRƯỞNG PHÒNG NHÂN SỰ') || currentTitle.value.includes('GIÁM ĐỐC NHÂN SỰ')
  return actorDeptRoot.value === 'HR' && (actorCode.includes('HR_MANAGER') || actorCode.includes('HR_DIRECTOR') || isTitleHRLead)
})
const isGMDept = computed(() => {
  const actorCode = currentDeptCode.value
  return actorCode === 'GM' || actorCode.includes('GM_DIRECTOR') || actorDeptRoot.value === 'GM' || currentTitle.value.includes('TỔNG GIÁM ĐỐC')
})
const canConfirmHO1 = computed(() => isManagerOrDirectorSameDept.value && process.value?.status === 'PENDING_HANDOVER')
const canRejectHO1 = computed(() => canConfirmHO1.value && process.value?.handover?.ho1_status !== 'REJECTED')
const canConfirmHO2 = computed(() => (isHRStaff.value || isHRManagerOrDirector.value) && process.value?.status === 'PENDING_HANDOVER')
const canConfirmHO3 = computed(() => (isHRStaff.value || isHRManagerOrDirector.value) && process.value?.status === 'PENDING_HANDOVER')
const canRejectHO3 = computed(() => canConfirmHO3.value && process.value?.handover?.ho3_status !== 'REJECTED')
const isProcessEmployee = computed(() =>
  String(process.value?.employee_id ?? '') === String(auth.user?.portal_user_id ?? auth.user?.id ?? '')
)

const ho1LinkUrl = computed(() => {
  if (!process.value) return null
  if (process.value.handover?.ho1_status === 'CONFIRMED') return `/offboarding/${process.value.id}/handover-form/ho1`
  return (canConfirmHO1.value || isProcessEmployee.value) ? `/offboarding/${process.value.id}/handover-form/ho1` : null
})
const ho1LinkLabel = computed(() =>
  process.value?.handover?.ho1_status === 'CONFIRMED' ? 'Xem Biên Bản QF-HRA-17' : 'Mở Biên Bản QF-HRA-17'
)

const ho2AssetHandoverId = computed(() => process.value?.handover?.ho2_asset_handover_id ?? null)
const ho2LinkUrl = computed(() => {
  const p = process.value
  if (!p) return null
  if (p.handover?.ho2_status === 'CONFIRMED') return `/offboarding/${p.id}/handover-form/ho2`
  return (canConfirmHO2.value || isProcessEmployee.value) ? `/offboarding/${p.id}/handover-form/ho2` : null
})
const ho2LinkLabel = computed(() => {
  if (process.value?.handover?.ho2_status === 'CONFIRMED') return 'Xem Biên Bản QF-HRA-12'
  return 'Mở Biên Bản QF-HRA-12'
})

const ho3LinkUrl = computed(() => {
  if (!process.value) return null
  if (process.value.handover?.ho3_status === 'CONFIRMED') return `/offboarding/${process.value.id}/handover-form/ho3`
  return (canConfirmHO3.value || isProcessEmployee.value) ? `/offboarding/${process.value.id}/handover-form/ho3` : null
})
const ho3LinkLabel = computed(() =>
  process.value?.handover?.ho3_status === 'CONFIRMED' ? 'Xem Biên Bản QF-HRA-11' : 'Mở Biên Bản QF-HRA-11'
)

const formSnapshot = computed(() => ({
  resignation_date:       process.value?.resignation_date ?? '',
  last_working_day:       process.value?.last_working_day ?? '',
  contract_type:          process.value?.contract_type ?? 'DEFINITE',
  reason_for_resignation: process.value?.reason_for_resignation ?? '',
  commitment_accepted:    process.value?.commitment_accepted ?? true,
}))

const employeeProfile = computed(() => ({
  full_name:    process.value?.employee_name ?? '',
  e_code:       process.value?.employee_code ?? '',
  dept_code:    process.value?.dept_code ?? process.value?.department ?? '',
  title:        process.value?.job_title ?? '',
  joining_date: process.value?.joining_date ?? '',
}))

const findStep = (stepNumber, action) =>
  (process.value?.steps ?? []).find(s => s.step_number === stepNumber && s.action === action)

const approvalSnapshot = computed(() => {
  if (process.value?.approval_summary) return process.value.approval_summary

  const requestedStep = findStep(1, 'submit')
  const verifiedStep = findStep(2, 'approve') ?? findStep(2, 'reject')
  const checkedStep = findStep(4, 'approve') ?? findStep(4, 'authorize') ?? findStep(4, 'reject')
  const approvedStep = findStep(5, 'approve') ?? findStep(5, 'reject') ?? findStep(5, 'authorize')

  return {
    requested: {
      signature_text: requestedStep ? 'Signed' : '',
      name: process.value?.employee_name ?? '',
      title: process.value?.job_title ?? '',
      date: requestedStep?.acted_at ?? process.value?.resignation_date ?? '',
    },
    verified: {
      signature_text: verifiedStep ? 'Signed' : '',
      name: verifiedStep?.actor_name ?? '',
      title: 'Head of Dept.',
      date: verifiedStep?.acted_at ?? '',
    },
    checked: {
      signature_text: checkedStep ? 'Signed' : '',
      name: checkedStep?.actor_name ?? '',
      title: 'HR Dept.',
      date: checkedStep?.acted_at ?? '',
    },
    approved: {
      signature_text: approvedStep ? 'Signed' : '',
      name: approvedStep?.actor_name ?? '',
      title: 'Management',
      date: approvedStep?.acted_at ?? '',
    },
  }
})

const internalNotes = computed(() =>
  (process.value?.steps ?? []).filter(s => s.step_number === 3 && s.note)
)
const rejectNotes = computed(() =>
  (process.value?.steps ?? []).filter((s) => {
    if (!s?.note) return false
    const isCoreReject = s.action === 'reject' && s.step_number >= 2 && s.step_number <= 5
    const isHandoverReject = ['reject_ho1', 'reject_ho2', 'reject_ho3'].includes(s.action)
    return isCoreReject || isHandoverReject
  })
)

const AFTER_GM_STATUSES = ['PENDING_HANDOVER', 'COMPLETED', 'COMPLETED_BLOCKED']
const showEmailPreview = computed(() =>
  !!process.value &&
  AFTER_GM_STATUSES.includes(process.value.status)
)
const isEmployeeRole = computed(() => offboardingRole.value === 'EMPLOYEE')
const handoverRejectedBanners = computed(() => {
  const h = process.value?.handover
  if (!h) return []

  const map = [
    { key: 'ho1', label: 'HO-1: Bàn giao công việc' },
    { key: 'ho2', label: 'HO-2: Bàn giao tài sản' },
    { key: 'ho3', label: 'HO-3: Phỏng vấn nghỉ việc' },
  ]

  return map
    .filter(({ key }) => h?.[`${key}_status`] === 'REJECTED')
    .map(({ key, label }) => ({
      key,
      label,
      by: h?.[`${key}_rejected_name`] ?? '',
      reason: h?.[`${key}_reject_reason`] ?? '',
    }))
})

onMounted(async () => {
  await Promise.all([
    fetchProfile(),
    offboardingStore.fetchProcess(route.params.id),
  ])
})

onUnmounted(() => {
  offboardingStore.clearCurrentProcess()
})

// ── Actions ────────────────────────────────────────────────────────────────────
const handleAction = async (stepNumber, action, note, extra) => {
  const result = await offboardingStore.takeAction(
    process.value.id,
    stepNumber,
    { action, note, ...(extra ?? {}) }
  )
  if (result.success) {
    toast.success(actionSuccessMsg(action))
  } else {
    if (handleSignatureRequired(result.message)) return
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const handleOverride = async (reason) => {
  const result = await offboardingStore.forceReturnToHandover(process.value.id, reason)
  if (result.success) {
    toast.success('Đã yêu cầu làm lại bàn giao.')
  } else {
    if (handleSignatureRequired(result.message)) return
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const confirmHandover = async (hoKey) => {
  const result = await offboardingStore.confirmHandover(process.value.id, hoKey)
  if (result.success) {
    toast.success(`Đã xác nhận ${hoKey.toUpperCase()}`)
  } else {
    if (handleSignatureRequired(result.message)) return
    toast.error(result.message ?? 'Không thể xác nhận bàn giao')
  }
}

const rejectHandover = async (hoKey, reason) => {
  const result = await offboardingStore.rejectHandover(process.value.id, hoKey, reason)
  if (result.success) {
    toast.success(`Đã reject ${hoKey.toUpperCase()}`)
  } else {
    if (handleSignatureRequired(result.message)) return
    toast.error(result.message ?? 'Không thể reject bàn giao')
  }
}

const handleStep7Complete = async (note) => {
  const result = await offboardingStore.takeAction(
    process.value.id,
    7,
    { action: 'complete', note }
  )
  if (result.success) {
    toast.success('Quy trình đã hoàn tất!')
  } else {
    if (handleSignatureRequired(result.message)) return
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const handleStep7Block = async (reason) => {
  const result = await offboardingStore.takeAction(
    process.value.id,
    7,
    { action: 'block', note: reason }
  )
  if (result.success) {
    toast.success('Đã chặn chế độ thanh toán.')
  } else {
    if (handleSignatureRequired(result.message)) return
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const handleStep7Unblock = async () => {
  const result = await offboardingStore.takeAction(
    process.value.id,
    7,
    { action: 'unblock', note: 'GM mở lại chế độ thanh toán' }
  )
  if (result.success) {
    toast.success('Đã mở lại chế độ thanh toán.')
  } else {
    if (handleSignatureRequired(result.message)) return
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const handleResendConfirmationEmail = async () => {
  const result = await offboardingStore.resendConfirmationEmail(process.value.id)
  if (result.success) {
    toast.success('Đã gửi lại Email Mẫu 01 cho nhân viên.')
  } else {
    toast.error(result.message ?? 'Không thể gửi lại email xác nhận')
  }
}

const openPrintView = () => {
  if (!process.value?.id) return
  const targetUrl = `/print/offboarding/${process.value.id}`
  window.open(targetUrl, '_blank', 'noopener,noreferrer')
}

const handleSignatureRequired = (message) => {
  const msg = String(message ?? '')
  if (!msg.toLowerCase().includes('chữ ký')) return false
  signatureRequiredNotice.value = true
  toast.error(msg || 'Bạn cần tạo chữ ký SignHub trước khi phê duyệt.')
  setTimeout(() => navigateTo('/sign-hub'), 1200)
  return true
}

const rejectStepLabel = (step) => {
  if (step.action === 'reject_ho1') return 'HO-1'
  if (step.action === 'reject_ho2') return 'HO-2'
  if (step.action === 'reject_ho3') return 'HO-3'
  return `Bước ${step.step_number}`
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

// ── Helpers ────────────────────────────────────────────────────────────────────
const actionSuccessMsg = (action) => {
  const map = {
    approve:   'Đã phê duyệt thành công!',
    reject:    'Đã từ chối đơn.',
    process:   'Đã hoàn tất xử lý HR.',
    authorize: 'Đã ký duyệt thành công!',
    complete:  'Quy trình đã hoàn tất!',
    block:     'Đã chặn chế độ thanh toán.',
    unblock:   'Đã mở lại chế độ thanh toán.',
    submit:    'Đã nộp đơn.',
  }
  return map[action] ?? 'Thao tác thành công'
}

const STATUS_LABEL = {
  DRAFT:               'Draft',
  PENDING_MANAGER:     'Chờ Manager',
  PENDING_HR_PROCESS:  'HR Đang Xử Lý',
  PENDING_HR_APPROVAL: 'Chờ HR Duyệt',
  PENDING_GM:          'Chờ GM',
  PENDING_HANDOVER:    'Bàn Giao',
  COMPLETED:           'Hoàn Tất',
  COMPLETED_BLOCKED:   'Bị Chặn',
  REJECTED:            'Từ Chối',
}

const statusLabel = computed(() => STATUS_LABEL[process.value?.status ?? 'DRAFT'])

const STATUS_BADGE = {
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

const statusBadgeClass = computed(() => STATUS_BADGE[process.value?.status ?? 'DRAFT'])

const ACTION_BADGE = {
  approve:   'bg-green-100 text-green-700',
  authorize: 'bg-blue-100 text-blue-700',
  reject:    'bg-red-100 text-red-700',
  process:   'bg-amber-100 text-amber-700',
  complete:  'bg-emerald-100 text-emerald-700',
  block:     'bg-red-100 text-red-700',
  submit:    'bg-gray-100 text-gray-700',
}

const actionBadgeClass = (action) => {
  if (!action) return 'bg-gray-100 text-gray-500'
  return ACTION_BADGE[action] ?? 'bg-gray-100 text-gray-500'
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
