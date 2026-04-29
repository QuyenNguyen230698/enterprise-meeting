<template>
  <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
    <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
      <i class="bi bi-flag-fill text-emerald-500"></i>Bước 7 — Hoàn Tất Quy Trình
    </h3>

    <!-- Completed -->
    <div v-if="process.status === 'COMPLETED'" class="space-y-4">
      <div class="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <i class="bi bi-check-circle-fill text-green-500 text-2xl shrink-0 mt-0.5"></i>
        <div>
          <p class="text-sm font-bold text-green-800">Quy trình đã hoàn tất</p>
          <p class="text-xs text-green-600 mt-0.5">Tất cả thủ tục đã được xử lý xong.</p>
        </div>
      </div>
      <OffboardingPaymentCard v-if="process.payment_date" :payment-date="process.payment_date" />
    </div>

    <!-- Blocked -->
    <div v-else-if="process.status === 'COMPLETED_BLOCKED'" class="space-y-4">
      <div class="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <i class="bi bi-slash-circle-fill text-red-500 text-2xl shrink-0 mt-0.5"></i>
        <div>
          <p class="text-sm font-bold text-red-800">Chế độ bị chặn</p>
          <p class="text-xs text-red-600 mt-1">{{ process.block_reason || 'Không tuân thủ quy trình bàn giao hoặc thời hạn báo trước.' }}</p>
        </div>
      </div>
      <button
        v-if="canUnblock"
        :disabled="loading || !allHODone"
        @click="$emit('unblock')"
        class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all active:scale-95 disabled:opacity-50"
      >
        <i v-if="loading" class="bi bi-arrow-repeat animate-spin"></i>
        <i v-else class="bi bi-unlock"></i>
        Unlock Thanh Toán
      </button>
      <p v-if="canUnblock && !allHODone" class="text-[11px] text-red-500 flex items-center gap-1">
        <i class="bi bi-exclamation-circle"></i>Cần hoàn tất HO-1/2/3 trước khi unlock thanh toán.
      </p>
    </div>

    <!-- Active -->
    <template v-else-if="canAct">

      <div class="border border-gray-100 rounded-xl overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Điều kiện mở khóa</p>
        </div>
        <div class="p-4 space-y-2">
          <OffboardingCheckItem :ok="ho1Done" label="HO-1: Bàn giao công việc (QF-HRA-17)" />
          <OffboardingCheckItem :ok="ho2Done" label="HO-2: Bàn giao tài sản (QF-HRA-12)" />
          <OffboardingCheckItem :ok="ho3Done" label="HO-3: Phỏng vấn nghỉ việc (QF-HRA-11)" />
          <OffboardingCheckItem :ok="!process.at_risk_benefits"
            :label="process.at_risk_benefits ? '⚠ Notice period không hợp lệ — kiểm tra trước khi thanh toán' : 'Notice period hợp lệ'" />
        </div>
      </div>

      <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div class="flex items-center gap-2 text-xs text-emerald-700">
          <i class="bi bi-calendar-check text-emerald-500 text-base"></i>
          Ngày thanh toán cuối sẽ là: <span class="font-bold text-emerald-800 ml-1">{{ previewPaymentDate }}</span>
        </div>
        <p class="text-[11px] text-emerald-600 mt-1">(Ngày 05 của tháng tiếp theo sau LWD)</p>
      </div>

      <div>
        <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Ghi chú hoàn tất</label>
        <textarea v-model="note" rows="2" placeholder="Ghi chú khi chốt sổ bảo hiểm, thanh toán lương cuối..." class="w-full text-sm border border-gray-200 rounded-xl p-3 focus:border-emerald-400 focus:outline-none resize-none" />
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <button v-if="canBlock" :disabled="loading" @click="showBlockModal = true"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all active:scale-95 disabled:opacity-50">
          <i class="bi bi-slash-circle"></i>Block Chế Độ
        </button>
        <button :disabled="!allHODone || loading" @click="$emit('complete', note)"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          :class="allHODone ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25' : 'bg-gray-300 shadow-none'">
          <i v-if="loading" class="bi bi-arrow-repeat animate-spin"></i>
          <i v-else class="bi bi-check2-all"></i>Hoàn Tất Quy Trình
        </button>
      </div>
      <p v-if="!allHODone" class="text-[11px] text-red-500 flex items-center gap-1">
        <i class="bi bi-exclamation-circle"></i>Cần hoàn tất toàn bộ bàn giao (HO 3/3) trước khi chốt quy trình.
      </p>

    </template>

    <!-- No permission -->
    <div v-else class="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-400">
      <i class="bi bi-lock"></i>Bước này cần được xử lý bởi HR Staff / HR Manager / HR Director.
    </div>

    <!-- Block Modal -->
    <div v-if="showBlockModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <i class="bi bi-slash-circle-fill text-red-500 text-lg"></i>
          </div>
          <div>
            <h4 class="font-bold text-gray-800">Block Chế Độ Thanh Toán</h4>
            <p class="text-xs text-gray-400 mt-0.5">Nhân viên sẽ không được giải quyết các chế độ.</p>
          </div>
        </div>
        <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Lý do block <span class="text-red-500">*</span></label>
        <textarea v-model="blockReason" rows="3" placeholder="Vd: Không bàn giao đúng hạn..." class="w-full text-sm border border-gray-200 rounded-xl p-3 focus:border-red-400 focus:outline-none resize-none" />
        <div class="flex gap-3 mt-4">
          <button @click="showBlockModal = false; blockReason = ''" class="flex-1 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Hủy</button>
          <button :disabled="!blockReason.trim() || loading" @click="handleBlock" class="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50">
            <i v-if="loading" class="bi bi-arrow-repeat animate-spin mr-1"></i>Xác Nhận Block
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  process:  { type: Object,  required: true },
  loading:  { type: Boolean, default: false },
  isGmUser: { type: Boolean, default: false },
})

const emit = defineEmits(['complete', 'block', 'unblock'])

const note           = ref('')
const blockReason    = ref('')
const showBlockModal = ref(false)

const canAct   = computed(() => props.isGmUser && props.process.status === 'PENDING_HANDOVER')
const canBlock = computed(() => props.isGmUser)
const canUnblock = computed(() => props.isGmUser && props.process.status === 'COMPLETED_BLOCKED')

const ho1Done   = computed(() => props.process.handover?.ho1_status === 'CONFIRMED')
const ho2Done   = computed(() => props.process.handover?.ho2_status === 'CONFIRMED')
const ho3Done   = computed(() => props.process.handover?.ho3_status === 'CONFIRMED')
const allHODone = computed(() => ho1Done.value && ho2Done.value && ho3Done.value)

const previewPaymentDate = computed(() => {
  if (!props.process.last_working_day) return '—'
  const d = new Date(props.process.last_working_day)
  const pay = new Date(d.getFullYear(), d.getMonth() + 1, 5)
  return pay.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

const handleBlock = () => {
  emit('block', blockReason.value)
  showBlockModal.value = false
}
</script>
