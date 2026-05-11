<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-5">
    <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
      <i class="bi bi-hand-index-thumb text-blue-500"></i>
      Thao tác phê duyệt
    </h3>

    <!-- Biên bản hoàn thành -->
    <div v-if="doc.status === 'COMPLETED'" class="text-center py-6">
      <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <i class="bi bi-check-circle-fill text-green-500 text-2xl"></i>
      </div>
      <p class="text-sm font-bold text-green-700">Biên bản đã hoàn thành</p>
      <p class="text-xs text-gray-400 mt-1">Tất cả các bước phê duyệt đã hoàn tất</p>
      <button
        @click="$emit('print')"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
      >
        <i class="bi bi-printer"></i>
        In biên bản
      </button>
    </div>

    <!-- Biên bản bị từ chối -->
    <div v-else-if="doc.status === 'REJECTED'" class="text-center py-6">
      <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <i class="bi bi-x-circle-fill text-red-500 text-2xl"></i>
      </div>
      <p class="text-sm font-bold text-red-700">Biên bản bị từ chối</p>
      <p v-if="rejectionNote" class="text-xs text-gray-500 mt-1 italic">"{{ rejectionNote }}"</p>
      <!-- Người tạo có thể tạo lại -->
      <button
        v-if="isOwner"
        @click="$emit('recreate')"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors"
      >
        <i class="bi bi-arrow-clockwise"></i>
        Tạo lại biên bản
      </button>
    </div>

    <!-- Bước 1: Người tạo nộp biên bản -->
    <div v-else-if="currentStep?.stepNumber === 1 && isOwner && doc.status === 'DRAFT'">
      <div class="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <p class="text-xs text-blue-700 font-medium">
          <i class="bi bi-info-circle mr-1"></i>
          Xem lại nội dung biên bản trước khi nộp. Sau khi nộp sẽ được chuyển đến bước phê duyệt tiếp theo.
        </p>
      </div>
      <textarea
        v-model="actionNote"
        rows="3"
        placeholder="Ghi chú khi nộp (không bắt buộc)..."
        class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:border-blue-400 focus:outline-none resize-none"
      ></textarea>
      <button
        @click="handleSubmit"
        :disabled="store.submitting"
        class="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <i class="bi bi-send" :class="{ 'animate-pulse': store.submitting }"></i>
        {{ store.submitting ? 'Đang nộp...' : 'Nộp biên bản' }}
      </button>
    </div>

    <!-- Bước phê duyệt (bước 2+): Người có quyền -->
    <div v-else-if="currentStep && canActOnCurrentStep">
      <!-- Yêu cầu ký số trước khi approve -->
      <div
        v-if="currentStep.signatureRequired && !hasSignature"
        class="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200"
      >
        <p class="text-xs text-amber-800 font-semibold mb-1">
          <i class="bi bi-pen-fill mr-1"></i>
          Bước này yêu cầu chữ ký số
        </p>
        <p class="text-[11px] text-amber-700">Bạn cần có chữ ký số đã đăng ký để phê duyệt bước này.</p>
        <NuxtLink
          to="/settings/profile"
          class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 underline"
        >
          <i class="bi bi-box-arrow-up-right text-[10px]"></i>
          Đăng ký chữ ký số
        </NuxtLink>
      </div>

      <!-- Action type label -->
      <div class="mb-3 flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
          <i :class="actionTypeIcon(currentStep.actionType)"></i>
          {{ actionTypeLabel(currentStep.actionType) }}
        </span>
        <span class="text-xs text-gray-400">— Bước {{ currentStep.stepNumber }}</span>
      </div>

      <!-- Note field -->
      <textarea
        v-model="actionNote"
        rows="3"
        placeholder="Ghi chú (không bắt buộc khi phê duyệt, bắt buộc khi từ chối)..."
        class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:border-blue-400 focus:outline-none resize-none"
      ></textarea>

      <!-- Action buttons -->
      <div class="mt-3 flex gap-2">
        <!-- Approve / Sign button -->
        <button
          @click="handleApprove"
          :disabled="store.submitting || (currentStep.signatureRequired && !hasSignature)"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl disabled:opacity-40 transition-colors"
          :class="currentStep.signatureRequired
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-green-600 text-white hover:bg-green-700'"
        >
          <i
            :class="currentStep.signatureRequired ? 'bi bi-pen-fill' : 'bi bi-check-lg'"
            :style="store.submitting ? 'animation: pulse 1s infinite' : ''"
          ></i>
          {{ store.submitting ? 'Đang xử lý...' : (currentStep.signatureRequired ? 'Ký & Phê duyệt' : 'Phê duyệt') }}
        </button>

        <button
          v-if="currentStep.canReject"
          @click="handleReject"
          :disabled="store.submitting"
          class="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 disabled:opacity-40 transition-colors"
          title="Phải nhập lý do trước khi từ chối"
        >
          <i class="bi bi-x-lg"></i>
          Từ chối
        </button>
      </div>
    </div>

    <!-- Không có quyền thao tác -->
    <div v-else-if="doc.status !== 'DRAFT'" class="text-center py-6 text-gray-400">
      <i class="bi bi-lock text-3xl mb-2 block"></i>
      <p class="text-sm">Không có thao tác nào cho bạn ở bước này</p>
      <p class="text-xs mt-1">
        Đang chờ:
        <span class="font-semibold text-gray-600">{{ deptLabel(currentStep?.deptCode) }}</span>
      </p>
    </div>

    <!-- Người tạo nhưng không phải bước 1 -->
    <div v-else-if="isOwner && doc.status === 'DRAFT'" class="text-center py-6 text-gray-400">
      <i class="bi bi-hourglass-split text-3xl mb-2 block"></i>
      <p class="text-sm">Biên bản đang ở trạng thái nháp</p>
      <p class="text-xs mt-1">Xem lại nội dung và nộp biên bản</p>
    </div>
    
    <!-- Delete button for owner when un-signed -->
    <div v-if="canDelete" class="mt-4 pt-4 border-t border-gray-100">
      <button
        @click="handleDelete"
        :disabled="store.submitting"
        class="w-full py-2.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
      >
        <i class="bi bi-trash mr-1"></i> Xóa biên bản
      </button>
    </div>

    <!-- OTP Modal để ký số -->
    <div
      v-if="showOtpModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showOtpModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="bi bi-shield-lock-fill text-blue-600"></i>
          </div>
          <div>
            <p class="font-bold text-gray-900 text-sm">Xác thực chữ ký số</p>
            <p class="text-xs text-gray-500">Nhập mã OTP gửi đến email của bạn</p>
          </div>
        </div>

        <p v-if="otpMaskedEmail" class="text-xs text-center text-gray-500 mb-4">
          Mã đã gửi đến <strong>{{ otpMaskedEmail }}</strong>
        </p>

        <!-- 6 OTP inputs -->
        <div class="flex gap-2 justify-center mb-4">
          <input
            v-for="(_, i) in otpDigits"
            :key="i"
            :ref="el => { if (el) otpRefs[i] = el }"
            v-model="otpDigits[i]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-10 h-12 text-center text-lg font-bold border-2 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            :class="otpError ? 'border-red-400' : 'border-gray-200'"
            @input="onOtpInput(i)"
            @keydown.backspace="onOtpBackspace(i)"
          />
        </div>

        <p v-if="otpError" class="text-xs text-red-600 text-center mb-3">{{ otpError }}</p>

        <!-- Resend timer -->
        <div class="text-center mb-4">
          <button
            v-if="otpResendTimer === 0"
            @click="sendOtp"
            class="text-xs text-blue-600 font-semibold underline"
          >
            Gửi lại mã OTP
          </button>
          <p v-else class="text-xs text-gray-400">
            Gửi lại sau <span class="font-semibold text-gray-600">{{ otpResendTimer }}s</span>
          </p>
        </div>

        <div class="flex gap-2">
          <button
            @click="showOtpModal = false"
            class="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            @click="verifyOtpAndSign"
            :disabled="otpDigits.join('').length < 6 || otpVerifying"
            class="flex-1 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {{ otpVerifying ? 'Đang xác thực...' : 'Xác nhận' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocumentStore } from '~/stores/hrm/document'

const props = defineProps({
  doc:          { type: Object, required: true },
  currentUser:  { type: Object, default: null },
  hasSignature: { type: Boolean, default: false },
})

const emit = defineEmits(['actioned', 'print', 'recreate'])

const store = useDocumentStore()
const actionNote = ref('')
const { $toast } = useNuxtApp()

// ── Quyền hạn ──────────────────────────────────────────────────────────────────
const isOwner = computed(() =>
  props.currentUser?.portal_user_id === props.doc?.submittedBy ||
  props.currentUser?.employee_id === props.doc?.submittedByEmployeeId
)

const currentStep = computed(() =>
  props.doc?.workflowSteps?.find(s => s.statusPending === props.doc?.status) || null
)

const canActOnCurrentStep = computed(() => {
  if (!currentStep.value || !props.currentUser) return false
  const myId = String(props.currentUser.portal_user_id || props.currentUser.id || '')
  // Ưu tiên: kiểm tra assignedUsers (người được giao cụ thể)
  const assigned = currentStep.value.assignedUsers || []
  if (assigned.length > 0) {
    return assigned.some(u => String(u.userId || u.id || '') === myId)
  }
  // Fallback: deptCode (nếu template cũ không có assignedUsers)
  const deptCode = props.currentUser.deptCode || props.currentUser.department_code
  return currentStep.value.deptCode === deptCode
})

const canDelete = computed(() => {
  if (!props.doc || !props.currentUser) return false
  if (props.doc.submittedBy !== props.currentUser.portal_user_id) return false
  // Chỉ cho xóa nếu chưa có ai xử lý khác submit
  const otherLogs = (props.doc.approvalLogs || []).filter(l => !['submit', 'create'].includes(l.action))
  return otherLogs.length === 0
})

const rejectionNote = computed(() => {
  const log = props.doc?.approvalLogs?.find(l => l.action === 'reject')
  return log?.note || ''
})

// ── Submit (Step 1) ────────────────────────────────────────────────────────────
async function handleSubmit() {
  await store.submitDocument(props.doc.id, actionNote.value)
  // Gửi thông báo cho những người ở bước kế tiếp
  await store.notifySigners(props.doc.id)
  actionNote.value = ''
  emit('actioned')
}

// ── Approve ────────────────────────────────────────────────────────────────────
async function handleApprove() {
  if (currentStep.value?.signatureRequired) {
    await sendOtp()
    showOtpModal.value = true
    pendingAction.value = 'approve'
    return
  }
  await store.takeAction(props.doc.id, currentStep.value.stepNumber, {
    action: 'approve',
    note: actionNote.value,
  })
  // Gửi thông báo cho những người ở bước kế tiếp
  await store.notifySigners(props.doc.id)
  actionNote.value = ''
  emit('actioned')
}

// ── Reject ─────────────────────────────────────────────────────────────────────
async function handleReject() {
  if (!actionNote.value.trim()) {
    $toast.error('Vui lòng nhập lý do từ chối')
    return
  }
  try {
    await store.takeAction(props.doc.id, currentStep.value.stepNumber, {
      action: 'reject',
      note: actionNote.value.trim(),
    })
    $toast.success('Đã từ chối biên bản')
    emit('actioned')
    actionNote.value = ''
  } catch (e) {
    $toast.error(e?.message || 'Không thể thực hiện')
  }
}

async function handleDelete() {
  if (!confirm('Bạn có chắc chắn muốn xóa biên bản này?')) return
  try {
    const res = await store.deleteDocument(props.doc.id)
    if (res?.success) {
      $toast.success('Đã xóa biên bản')
      navigateTo('/hrm/documents')
    } else {
      $toast.error(res?.message || 'Không thể xóa biên bản')
    }
  } catch (e) {
    $toast.error('Lỗi khi xóa biên bản')
  }
}

// ── OTP / Ký số ───────────────────────────────────────────────────────────────
const showOtpModal  = ref(false)
const otpDigits     = ref(['', '', '', '', '', ''])
const otpRefs       = ref([])
const otpError      = ref('')
const otpVerifying  = ref(false)
const otpMaskedEmail = ref('')
const otpResendTimer = ref(0)
const pendingAction  = ref('')
let resendInterval = null

async function sendOtp() {
  try {
    const res = await useFetchAuth('/v1/profile/signature/send-otp', { method: 'POST' })
    otpMaskedEmail.value = res?.data?.masked_email || res?.masked_email || ''
    startResendTimer(res?.data?.rate_limit_seconds || res?.rate_limit_seconds || 60)
    otpError.value = ''
    otpDigits.value = ['', '', '', '', '', '']
  } catch (e) {
    otpError.value = e?.message || 'Không thể gửi OTP'
  }
}

function startResendTimer(seconds) {
  otpResendTimer.value = seconds
  clearInterval(resendInterval)
  resendInterval = setInterval(() => {
    if (otpResendTimer.value > 0) otpResendTimer.value--
    else clearInterval(resendInterval)
  }, 1000)
}

function onOtpInput(idx) {
  const val = otpDigits.value[idx]
  if (val && idx < 5) otpRefs.value[idx + 1]?.focus()
}

function onOtpBackspace(idx) {
  if (!otpDigits.value[idx] && idx > 0) {
    otpDigits.value[idx - 1] = ''
    otpRefs.value[idx - 1]?.focus()
  }
}

async function verifyOtpAndSign() {
  const code = otpDigits.value.join('')
  if (code.length < 6) return
  otpVerifying.value = true
  otpError.value = ''
  try {
    const res = await useFetchAuth('/v1/profile/signature/verify-otp', {
      method: 'POST',
      body: { otp: code },
    })
    const verifyToken = res?.data?.verify_token || res?.verify_token
    showOtpModal.value = false

    await store.takeAction(props.doc.id, currentStep.value.stepNumber, {
      action: pendingAction.value,
      note: actionNote.value,
      verifyToken,
    })
    // Gửi thông báo cho những người ở bước kế tiếp
    await store.notifySigners(props.doc.id)
    actionNote.value = ''
    emit('actioned')
  } catch (e) {
    otpError.value = e?.message || 'Mã OTP không đúng hoặc đã hết hạn'
  } finally {
    otpVerifying.value = false
  }
}

onUnmounted(() => clearInterval(resendInterval))

// ── Label helpers ──────────────────────────────────────────────────────────────
const DEPT_LABEL = {
  EMPLOYEE: 'Nhân viên tạo', MANAGER: 'Trưởng phòng',
  HR_STAFF: 'Nhân sự', HR_MANAGER: 'Trưởng/Phó Nhân sự', GM: 'Ban Giám đốc',
}
const deptLabel = (code) => DEPT_LABEL[code] || code || '—'

const ACTION_TYPE = {
  submit:    { label: 'Nộp biên bản',  icon: 'bi bi-send' },
  approve:   { label: 'Phê duyệt',     icon: 'bi bi-check-circle' },
  process:   { label: 'Xử lý',         icon: 'bi bi-gear' },
  authorize: { label: 'Ủy quyền',      icon: 'bi bi-award' },
}
const actionTypeLabel = (t) => ACTION_TYPE[t]?.label || t
const actionTypeIcon  = (t) => ACTION_TYPE[t]?.icon || 'bi bi-circle'
</script>
