<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl">

        <!-- Header -->
        <div class="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p class="text-xs text-gray-400 font-medium">{{ process.application_ref }} · HRM-R</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ process.employee_name }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 text-[11px] font-bold rounded-full uppercase bg-blue-100 text-blue-700">
              {{ headerBadge }}
            </span>
            <button
              class="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors inline-flex items-center gap-1"
              @click="$emit('view-detail')"
            >
              Chi tiết
              <i class="bi bi-arrow-right"></i>
            </button>
            <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
              <i class="bi bi-x-lg text-gray-500"></i>
            </button>
          </div>
        </div>

        <!-- Action buttons -->
        <div
          v-if="canAct"
          class="shrink-0 flex items-center justify-end gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/50"
        >
          <button
            v-for="btn in actionButtons"
            :key="btn.action"
            :disabled="submitting"
            @click="handleAction(btn.action)"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50"
            :class="btn.action === 'reject'
              ? 'text-red-600 bg-white border border-red-200 hover:bg-red-50'
              : 'text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25'"
          >
            <i
              v-if="submitting && btn.action !== 'reject'"
              class="bi bi-arrow-repeat animate-spin"
            ></i>
            <i
              v-else
              :class="btn.action === 'reject' ? 'bi bi-x-circle-fill' : 'bi bi-patch-check-fill'"
            ></i>
            {{ btn.label }}
          </button>
        </div>
        <div
          v-else
          class="shrink-0 px-6 py-3 border-b border-gray-100 bg-gray-50/50"
        >
          <p class="text-xs font-semibold text-gray-500">
            Hồ sơ đã đóng hoặc không thuộc quyền phê duyệt của bạn. Chỉ có thể xem chi tiết.
          </p>
        </div>

        <!-- Scrollable body -->
        <div class="flex-1 overflow-y-auto p-6">
          <OffboardingResignationForm :model-value="formSnapshot" :profile="employeeProfile" :application-ref="process.application_ref" :approvals="process.approval_summary || {}" :readonly="true" />

          <div v-if="canAct" class="mt-5">
            <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Ghi chú GM (tuỳ chọn)</label>
            <textarea v-model="note" rows="3" placeholder="Ghi chú khi phê duyệt hoặc từ chối..." class="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none resize-none" />
          </div>

          <!-- Reject reason -->
          <div v-if="showRejectReason" class="mt-3">
            <label class="text-xs font-semibold text-red-500 mb-1.5 block"><i class="bi bi-exclamation-circle mr-1"></i>Lý do từ chối (bắt buộc)</label>
            <textarea v-model="rejectReason" rows="2" placeholder="Nhập lý do từ chối..." class="w-full text-sm text-gray-800 border border-red-200 rounded-xl p-3 focus:border-red-400 focus:outline-none resize-none" />
            <div class="flex gap-3 mt-3">
              <button @click="showRejectReason = false; rejectReason = ''" class="flex-1 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Hủy</button>
              <button :disabled="!rejectReason.trim() || submitting" @click="confirmReject" class="flex-1 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50">
                <i v-if="submitting" class="bi bi-arrow-repeat animate-spin mr-1"></i>Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  process:    { type: Object,  required: true },
  submitting: { type: Boolean, default: false },
  canAct:     { type: Boolean, default: false },
  headerBadge:{ type: String,  default: 'Review' },
  actionButtons: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'action', 'view-detail'])

const note             = ref('')
const rejectReason     = ref('')
const showRejectReason = ref(false)

const formSnapshot = computed(() => ({
  resignation_date:       props.process.resignation_date,
  last_working_day:       props.process.last_working_day,
  contract_type:          props.process.contract_type,
  reason_for_resignation: props.process.reason_for_resignation,
  commitment_accepted:    props.process.commitment_accepted,
}))

const employeeProfile = computed(() => ({
  full_name:    props.process.employee_name,
  e_code:       props.process.employee_code,
  dept_code:    props.process.dept_code || props.process.department,
  title:        props.process.job_title,
  joining_date: props.process.joining_date,
}))

const handleAction = (action) => {
  if (!props.canAct) return
  if (action === 'reject') { showRejectReason.value = true; return }
  emit('action', action, note.value)
}

const confirmReject = () => emit('action', 'reject', rejectReason.value)
</script>
