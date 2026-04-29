<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-20">
      <div class="px-4 sm:px-6 py-4 flex items-center justify-between">
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
            <h1 class="text-lg sm:text-xl font-bold text-gray-900">Đơn Xin Thôi Việc</h1>
            <p class="text-xs text-gray-500">Resignation Notice Form · QF-HRA-18/R07</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-3xl mx-auto space-y-6">

        <!-- Alert: đã có đơn pending -->
        <div
          v-if="hasPendingProcess"
          class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <i class="bi bi-exclamation-triangle-fill text-amber-500 text-lg mt-0.5 shrink-0"></i>
          <div>
            <p class="text-sm font-semibold text-amber-800">Bạn đã có đơn thôi việc đang xử lý</p>
            <p class="text-xs text-amber-600 mt-0.5">Không thể nộp thêm đơn khi đơn cũ chưa được giải quyết.</p>
            <NuxtLink to="/offboarding" class="text-xs text-amber-700 underline mt-1 inline-block">Xem tiến trình →</NuxtLink>
          </div>
        </div>

        <div
          v-else-if="!canSubmitByDeptCode"
          class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <i class="bi bi-shield-lock-fill text-amber-500 text-lg mt-0.5 shrink-0"></i>
          <div>
            <p class="text-sm font-semibold text-amber-800">Tài khoản quản lý không được phép nộp đơn nghỉ việc</p>
            <p class="text-xs text-amber-600 mt-0.5">Chỉ nhân sự cấp nhân viên mới có thể tạo đơn offboarding ở bước 1.</p>
            <NuxtLink to="/offboarding" class="text-xs text-amber-700 underline mt-1 inline-block">Quay lại danh sách →</NuxtLink>
          </div>
        </div>

        <!-- Loading profile -->
        <div v-if="profileLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
        </div>

        <!-- Form -->
        <template v-else-if="!hasPendingProcess && canSubmitByDeptCode">
          <OffboardingResignationForm
            v-model="formData"
            :profile="employeeProfile"
            :application-ref="previewRef"
            @valid="formValid = $event"
          />

          <!-- Submit button -->
          <div class="flex justify-end gap-3 pb-6">
            <NuxtLink
              to="/offboarding"
              class="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </NuxtLink>
            <button
              @click="handleSubmit"
              :disabled="!formValid || offboardingStore.submitting"
              class="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-md"
              :class="formValid && !offboardingStore.submitting
                ? 'bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/25'
                : 'bg-gray-300 cursor-not-allowed shadow-none'"
            >
              <span v-if="offboardingStore.submitting">
                <i class="bi bi-arrow-repeat animate-spin mr-1"></i>Đang nộp đơn...
              </span>
              <span v-else>
                <i class="bi bi-send-fill mr-1"></i>Nộp Đơn Thôi Việc
              </span>
            </button>
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
const toast = useToast()

const profileLoading = ref(true)
const profileData = ref(null)
const formValid = ref(false)
const currentUserId = computed(() => auth.user?.portal_user_id ?? auth.user?.id ?? null)
const currentDeptCode = computed(() => String(auth.user?.dept_code ?? auth.user?.deptCode ?? '').toUpperCase())
const canSubmitByDeptCode = computed(() => !['GM', 'DIRECTOR', 'MANAGER', 'LEADER', 'CHIEF'].some(k => currentDeptCode.value.includes(k)))

const normalizeDateOnly = (value) => {
  if (!value) return ''
  const raw = String(value).trim()
  if (!raw) return ''
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  if (m) return m[1]
  const dt = new Date(raw)
  if (Number.isNaN(dt.getTime())) return ''
  return dt.toISOString().slice(0, 10)
}

const formData = ref({
  full_name: '',
  e_code: '',
  department: '',
  title: '',
  joined_at: '',
  last_working_day: '',
  contract_type: 'DEFINITE',
  reason_for_resignation: '',
  commitment_accepted: false,
})

// Profile nhân viên lấy từ auth user
const employeeProfile = computed(() => ({
  full_name:    profileData.value?.fullName ?? profileData.value?.full_name ?? auth.user?.full_name ?? auth.user?.display_name ?? '',
  e_code:       profileData.value?.e_code ?? profileData.value?.hr_code ?? auth.user?.e_code ?? auth.user?.hr_code ?? '',
  department:   profileData.value?.department ?? profileData.value?.dept_code ?? auth.user?.department ?? auth.user?.dept_code ?? '',
  title:        profileData.value?.title ?? auth.user?.title ?? '',
  joined_at:    normalizeDateOnly(
    profileData.value?.joined_at ?? profileData.value?.joining_date ?? auth.user?.joined_at ?? auth.user?.joining_date
  ),
}))

// Mã đơn preview (chỉ hiện khi submit thực tế mới có số thật)
const previewRef = computed(() => {
  const year = new Date().getFullYear()
  return `HRM-R-${year}-?????`
})

// Kiểm tra đã có đơn pending chưa
const hasPendingProcess = computed(() =>
  offboardingStore.processes.some(p =>
    String(p.employee_id) === String(currentUserId.value) &&
    p.status !== 'REJECTED'
  )
)

onMounted(async () => {
  await offboardingStore.fetchProcesses()
  try {
    const profileRes = await useFetchAuth('/v1/profile')
    profileData.value = profileRes?.data ?? null
  } catch (_) {
    profileData.value = null
  }
  formData.value = {
    ...formData.value,
    ...employeeProfile.value,
    joined_at: normalizeDateOnly(employeeProfile.value.joined_at),
  }
  profileLoading.value = false
})

const handleSubmit = async () => {
  if (!canSubmitByDeptCode.value) {
    toast.error('Tài khoản quản lý không được phép nộp đơn nghỉ việc.')
    return
  }
  if (!formValid.value) return
  const submitPayload = {
    ...formData.value,
    joining_date: formData.value.joined_at || undefined,
  }
  const result = await offboardingStore.submitResignation(submitPayload)
  if (result.success) {
    toast.success('Đơn thôi việc đã được nộp thành công!')
    navigateTo(`/offboarding/${result.data.id}`)
  } else {
    toast.error(result.message ?? 'Không thể nộp đơn, vui lòng thử lại.')
  }
}
</script>
