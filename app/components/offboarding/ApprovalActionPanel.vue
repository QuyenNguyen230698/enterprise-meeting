<template>
  <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
    <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
      <i class="bi bi-lightning-charge-fill text-amber-500"></i>Thao Tác Phê Duyệt
    </h3>

    <div v-if="!canActOnCurrentStep" class="text-center py-6 text-gray-400">
      <i class="bi bi-lock text-2xl mb-2 block"></i>
      <p class="text-sm">Không có thao tác nào ở bước này với vai trò của bạn.</p>
      <p class="text-xs mt-1 text-gray-400">{{ roleLabel }} · Bước {{ currentStep }}/7</p>
    </div>

    <div v-else-if="['REJECTED','COMPLETED','COMPLETED_BLOCKED'].includes(process.status)" class="text-center py-6">
      <i class="text-3xl mb-2 block" :class="process.status === 'REJECTED' ? 'bi bi-x-circle text-red-400' : 'bi bi-check-circle text-green-400'"></i>
      <p class="text-sm font-semibold" :class="process.status === 'REJECTED' ? 'text-red-600' : 'text-green-600'">
        {{ process.status === 'REJECTED' ? 'Đơn đã bị từ chối' : 'Quy trình đã hoàn tất' }}
      </p>
    </div>

    <template v-else>

      <!-- Step 2: Manager -->
      <div v-if="activePanel === 'step2'" class="space-y-4">
        <OffboardingStepNote v-model="note" placeholder="Ý kiến của quản lý (bắt buộc nếu từ chối)..." />
        <div class="flex gap-3">
          <OffboardingActionBtn variant="reject"  :loading="submitting" @click="act('reject')" />
          <OffboardingActionBtn variant="approve" :loading="submitting" @click="act('approve')" />
        </div>
      </div>

      <!-- Step 3: HR Staff -->
      <div v-if="activePanel === 'step3'" class="space-y-4">
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
          <i class="bi bi-info-circle mr-1"></i>Kiểm tra tính hợp lệ: notice period, BHXH, phép tồn.
        </div>
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" v-model="noticePeriodValid" class="accent-green-600 w-4 h-4" />
            Notice period hợp lệ
          </label>
          <span class="text-xs text-gray-400">(LWD: {{ formatDate(process.last_working_day) }})</span>
        </div>
        <OffboardingStepNote v-model="note" placeholder="Ghi chú nội bộ HR (không hiển thị cho nhân viên)..." />
        <OffboardingActionBtn variant="process" label="Hoàn Tất Xử Lý" :loading="submitting" @click="act('process')" />
      </div>

      <!-- Step 4: HR Director / Manager -->
      <div v-if="activePanel === 'step4'" class="space-y-4">
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
          <i class="bi bi-file-earmark-check mr-1"></i>Ký duyệt đơn và chuẩn bị dự thảo Quyết định thôi việc.
        </div>
        <OffboardingStepNote v-model="note" placeholder="Ghi chú phê duyệt..." />
        <div class="flex gap-3">
          <OffboardingActionBtn variant="reject"    :loading="submitting" @click="act('reject')" />
          <OffboardingActionBtn variant="authorize" label="Ký Duyệt (Authorize)" :loading="submitting" @click="act('authorize')" />
        </div>
      </div>

      <!-- Step 5: GM -->
      <div v-if="activePanel === 'step5'" class="space-y-4">
        <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700">
          <i class="bi bi-award mr-1"></i>Phê duyệt cuối cùng. Sau khi approve, Email Mẫu 01 sẽ gửi cho nhân viên.
        </div>
        <OffboardingStepNote v-model="note" placeholder="Ghi chú GM..." />
        <div class="flex gap-3">
          <OffboardingActionBtn variant="reject"  :loading="submitting" @click="act('reject')" />
          <OffboardingActionBtn variant="approve" label="Phê Duyệt (GM Approve)" :loading="submitting" @click="act('approve')" />
        </div>
      </div>

      <!-- Step 7 -->
      <div v-if="activePanel === 'step7'" class="space-y-4">
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <p class="text-xs text-gray-600 font-medium mb-1">Điều kiện mở khóa Step 7:</p>
          <div class="space-y-1">
            <OffboardingCheckItem :ok="handoverProgress >= 1" label="HO-1: Bàn giao công việc (QF-HRA-17)" />
            <OffboardingCheckItem :ok="handoverProgress >= 2" label="HO-2: Bàn giao tài sản (QF-HRA-12)" />
            <OffboardingCheckItem :ok="handoverProgress >= 3" label="HO-3: Phỏng vấn nghỉ việc (QF-HRA-11)" />
          </div>
        </div>
        <OffboardingStepNote v-model="note" placeholder="Ghi chú hoàn tất quy trình..." />
        <div class="flex gap-3">
          <OffboardingActionBtn v-if="isGMDept" variant="block" label="Block Chế Độ" :loading="submitting" @click="act('block')" />
          <OffboardingActionBtn variant="complete" label="Hoàn Tất Quy Trình" :disabled="handoverProgress < 3" :loading="submitting" @click="act('complete')" />
        </div>
        <p v-if="handoverProgress < 3" class="text-xs text-red-500"><i class="bi bi-exclamation-circle mr-1"></i>Cần hoàn tất bàn giao (HO 3/3).</p>
      </div>

      <!-- Override return step 6 -->
      <div v-if="isGMDept && currentStep > 6" class="mt-4 pt-4 border-t border-gray-100">
        <button @click="showReturnModal = true" class="w-full text-xs text-orange-600 hover:text-orange-700 flex items-center justify-center gap-1 py-2 rounded-xl hover:bg-orange-50 transition-colors">
          <i class="bi bi-arrow-counterclockwise"></i>Yêu cầu làm lại bàn giao (Override)
        </button>
      </div>

    </template>

    <!-- Override modal -->
    <div v-if="showReturnModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h4 class="font-bold text-gray-800 mb-3">Yêu cầu làm lại Bàn Giao</h4>
        <textarea v-model="overrideReason" rows="3" placeholder="Lý do yêu cầu làm lại (bắt buộc)..." class="w-full text-sm border border-gray-200 rounded-xl p-3 focus:border-orange-400 focus:outline-none resize-none" />
        <div class="flex gap-3 mt-4">
          <button @click="showReturnModal = false; overrideReason = ''" class="flex-1 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Hủy</button>
          <button :disabled="!overrideReason.trim()" @click="handleOverride" class="flex-1 py-2 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50">Xác Nhận</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  process:          { type: Object, required: true },
  currentStep:      { type: Number, required: true },
  handoverProgress: { type: Number, required: true },
})

const emit = defineEmits(['action', 'override'])

const { offboardingRole, roleLabel } = useOffboardingRole()
const { profileDeptCode, profileDepartment, profileTitle, fetchProfile } = useUserProfile()

const note              = ref('')
const noticePeriodValid = ref(true)
const submitting        = ref(false)
const showReturnModal   = ref(false)
const overrideReason    = ref('')
const currentDeptCode   = profileDeptCode
const currentDepartment = profileDepartment
const currentTitle      = profileTitle
// Lấy dept root của employee từ dept_code hoặc department (ví dụ: "IT_EMPLOYEE" hoặc "IT" → "IT")
const processDeptCode = computed(() =>
  String(props.process?.dept_code ?? props.process?.department ?? '').toUpperCase()
)

onMounted(() => fetchProfile())

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

const activePanel = computed(() => {
  if (['REJECTED','COMPLETED','COMPLETED_BLOCKED'].includes(props.process.status)) return null
  const step = props.currentStep
  if (step === 2 && isManagerOrDirectorSameDept.value)                return 'step2'
  if (step === 3 && isHRStaff.value)                                  return 'step3'
  if (step === 4 && isHRManagerOrDirector.value)                      return 'step4'
  if (step === 5 && isGMDept.value)                                   return 'step5'
  if (step === 7 && (offboardingRole.value === 'GM' || isGMDept.value)) return 'step7'
  return null
})

const canActOnCurrentStep = computed(() => !!activePanel.value)

const act = (action) => {
  const extra = activePanel.value === 'step3' ? { notice_period_valid: noticePeriodValid.value } : {}
  emit('action', props.currentStep, action, note.value, extra)
}

const handleOverride = () => {
  emit('override', overrideReason.value)
  showReturnModal.value = false
  overrideReason.value = ''
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
