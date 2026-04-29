<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-20">
      <div class="px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <NuxtLink
            :to="`/offboarding/${route.params.id}`"
            class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <i class="bi bi-arrow-left text-gray-600"></i>
          </NuxtLink>
          <div class="w-10 h-10 bg-linear-to-br from-purple-500 via-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <i class="bi bi-box-arrow-right text-white text-lg"></i>
          </div>
          <div>
            <h1 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              Handover & Form
              <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700 uppercase">
                {{ handoverProgress }}/3
              </span>
            </h1>
            <p class="text-xs text-gray-500">
              {{ process?.employee_name }} · LWD: {{ formatDate(process?.last_working_day) }}
            </p>
          </div>
        </div>

        <!-- LWD countdown -->
        <div
          v-if="daysUntilLWD !== null"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          :class="daysUntilLWD <= 3
            ? 'bg-red-100 text-red-700 border border-red-200'
            : daysUntilLWD <= 7
              ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : 'bg-gray-100 text-gray-600'"
        >
          <i class="bi bi-calendar-event"></i>
          <span v-if="daysUntilLWD === 0">Hôm nay là ngày cuối!</span>
          <span v-else-if="daysUntilLWD < 0">Đã quá hạn {{ Math.abs(daysUntilLWD) }} ngày</span>
          <span v-else>Còn {{ daysUntilLWD }} ngày đến LWD</span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="offboardingStore.loading && !process" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
    </div>

    <!-- Not in handover step -->
    <div
      v-else-if="process && process.status !== 'PENDING_HANDOVER'"
      class="flex-1 flex items-center justify-center"
    >
      <div class="text-center">
        <i class="bi bi-hourglass-split text-4xl text-gray-300 mb-3 block"></i>
        <p class="text-gray-500 font-medium">Bàn giao chưa bắt đầu</p>
        <p class="text-xs text-gray-400 mt-1">Quy trình cần đạt GM Approval trước khi bàn giao</p>
        <NuxtLink :to="`/offboarding/${route.params.id}`" class="text-sm text-blue-500 underline mt-3 inline-block">
          Xem tiến trình →
        </NuxtLink>
      </div>
    </div>

    <!-- Main content -->
    <div v-else-if="process" class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-3xl mx-auto space-y-5">

        <!-- Progress summary -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-gray-800">Tiến Độ Bàn Giao</h2>
            <span class="text-sm font-bold" :class="handoverProgress === 3 ? 'text-green-600' : 'text-gray-500'">
              {{ handoverProgress }}/3 hoàn tất
            </span>
          </div>
          <!-- Progress steps -->
          <div class="flex items-center gap-2">
            <div v-for="i in 3" :key="i" class="flex-1 flex flex-col items-center gap-1">
              <div
                class="w-full h-2 rounded-full transition-all duration-500"
                :class="handoverProgress >= i ? 'bg-green-400' : 'bg-gray-200'"
              ></div>
              <span class="text-[10px] text-gray-400">{{ ['QF-HRA-17','QF-HRA-12','QF-HRA-11'][i-1] }}</span>
            </div>
          </div>

          <!-- All done banner -->
          <div
            v-if="handoverProgress === 3"
            class="mt-4 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl"
          >
            <i class="bi bi-check-circle-fill text-green-500 text-xl shrink-0"></i>
            <div>
              <p class="text-sm font-bold text-green-800">Bàn giao hoàn tất!</p>
              <p class="text-xs text-green-600 mt-0.5">HR có thể tiến hành hoàn tất quy trình ở Bước 7.</p>
            </div>
          </div>

          <!-- Early exit eligible -->
          <div
            v-if="handoverProgress === 3 && can('override_early_exit') && daysUntilLWD !== null && daysUntilLWD > 0"
            class="mt-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <i class="bi bi-lightning-charge-fill text-blue-500 shrink-0"></i>
            <div class="flex-1">
              <p class="text-sm font-semibold text-blue-800">Đủ điều kiện nghỉ sớm</p>
              <p class="text-xs text-blue-600 mt-0.5">Bàn giao hoàn tất trước LWD — có thể cho phép Early Exit.</p>
            </div>
            <button
              :disabled="offboardingStore.submitting"
              @click="handleEarlyExit"
              class="shrink-0 px-3 py-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Approve Early Exit
            </button>
          </div>
        </div>

        <!-- HO-1: Bàn giao công việc (QF-HRA-17) -->
        <OffboardingHandoverForm
          :step-num="1"
          title="HO-1: Bàn giao công việc"
          subtitle="QF-HRA-17 · Xác nhận bởi Trưởng Phòng / Quản Lý Trực Tiếp"
          confirmer-role="Quản Lý Trực Tiếp (LINE_MANAGER)"
          :checklist-items="ho1Checklist"
          :confirmed="process.handover?.ho1_status === 'CONFIRMED'"
          :confirmed-by="process.handover?.ho1_confirmed_name"
          :confirmed-date="process.handover?.ho1_date"
          :confirmed-notes="process.handover?.ho1_notes"
          :can-confirm="false"
          :loading="offboardingStore.submitting"
          :link-url="ho1LinkUrl"
          :link-label="ho1LinkLabel"
        />

        <!-- HO-2: Bàn giao tài sản (QF-HRA-12) — xử lý qua biên bản asset-handover riêng -->
        <OffboardingHandoverForm
          :step-num="2"
          title="HO-2: Bàn giao tài sản & thiết bị"
          subtitle="QF-HRA-12 · Xác nhận qua Biên Bản Bàn Giao Tài Sản"
          confirmer-role="HR Staff"
          :checklist-items="[]"
          :confirmed="process.handover?.ho2_status === 'CONFIRMED'"
          :confirmed-by="process.handover?.ho2_confirmed_name"
          :confirmed-date="process.handover?.ho2_date"
          :confirmed-notes="process.handover?.ho2_notes"
          :can-confirm="false"
          :loading="offboardingStore.submitting"
          :link-url="ho2LinkUrl"
          :link-label="ho2LinkLabel"
          :linked-status="process.handover?.ho2_asset_handover_status"
        />

        <!-- HO-3: Phỏng vấn nghỉ việc + BHYT/BHLĐ (QF-HRA-11) -->
        <OffboardingHandoverForm
          :step-num="3"
          title="HO-3: Phỏng vấn nghỉ việc & hoàn trả"
          subtitle="QF-HRA-11 · Xác nhận bởi HR Staff"
          confirmer-role="HR Staff"
          :checklist-items="ho3Checklist"
          :confirmed="process.handover?.ho3_status === 'CONFIRMED'"
          :confirmed-by="process.handover?.ho3_confirmed_name"
          :confirmed-date="process.handover?.ho3_date"
          :confirmed-notes="process.handover?.ho3_notes"
          :can-confirm="false"
          :loading="offboardingStore.submitting"
          :link-url="ho3LinkUrl"
          :link-label="ho3LinkLabel"
        />

        <!-- Employee: thông tin bàn giao từ phía nhân viên -->
        <div
          v-if="can('action_step6_employee')"
          class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
        >
          <h3 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="bi bi-person-check text-blue-500"></i>
            Trách Nhiệm Của Nhân Viên
          </h3>
          <div class="space-y-2 text-xs text-gray-600">
            <div class="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <i class="bi bi-info-circle text-blue-500 shrink-0 mt-0.5"></i>
              <p>Phối hợp với Quản lý trực tiếp để hoàn tất bàn giao công việc, tài liệu và mật khẩu hệ thống trước ngày <strong>{{ formatDate(process.last_working_day) }}</strong>.</p>
            </div>
            <div class="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <i class="bi bi-exclamation-triangle text-amber-500 shrink-0 mt-0.5"></i>
              <p>Trả lại tất cả thiết bị, thẻ từ, thẻ BHYT và đồ bảo hộ lao động trong vòng 03 ngày kể từ ngày làm việc cuối.</p>
            </div>
          </div>
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
const { can } = useOffboardingRole()
const auth = useAuthStore()

const process = computed(() => offboardingStore.currentProcess)
const currentDeptCode = computed(() => String(auth.user?.dept_code ?? auth.user?.deptCode ?? '').toUpperCase())
const currentDepartment = computed(() => String(auth.user?.department ?? auth.user?.dept ?? '').toUpperCase())
const currentTitle = computed(() => String(auth.user?.title ?? '').toUpperCase())
const processDeptCode = computed(() => String(process.value?.department ?? '').toUpperCase())
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
const canConfirmHO1 = computed(() => isManagerOrDirectorSameDept.value)
const canConfirmHO3 = computed(() => isHRStaff.value || isHRManagerOrDirector.value)
const isProcessEmployee = computed(() =>
  String(process.value?.employee_id ?? '') === String(auth.user?.portal_user_id ?? auth.user?.id ?? '')
)
const ho1LinkUrl = computed(() => {
  const p = process.value
  if (!p) return null
  // Sau khi CONFIRMED: mọi người có thể xem — luôn hiển thị link
  if (p.handover?.ho1_status === 'CONFIRMED') return `/offboarding/${p.id}/handover-form/ho1`
  if (!(canConfirmHO1.value || isProcessEmployee.value)) return null
  return `/offboarding/${p.id}/handover-form/ho1`
})
const ho1LinkLabel = computed(() =>
  process.value?.handover?.ho1_status === 'CONFIRMED' ? 'Xem Biên Bản QF-HRA-17' : 'Mở Biên Bản QF-HRA-17'
)

// HO-2: không confirm trực tiếp — điều hướng qua biên bản asset-handover
const ho2AssetHandoverId = computed(() => process.value?.handover?.ho2_asset_handover_id ?? null)
const ho2LinkUrl = computed(() => {
  const p = process.value
  if (!p) return null
  if (p.handover?.ho2_status === 'CONFIRMED') return `/offboarding/${p.id}/handover-form/ho2`
  if (!(isHRStaff.value || isHRManagerOrDirector.value || isProcessEmployee.value)) return null
  return `/offboarding/${p.id}/handover-form/ho2`
})
const ho2LinkLabel = computed(() => {
  if (process.value?.handover?.ho2_status === 'CONFIRMED') return 'Xem Biên Bản QF-HRA-12'
  return 'Mở Biên Bản QF-HRA-12'
})
const ho3LinkUrl = computed(() => {
  const p = process.value
  if (!p) return null
  if (p.handover?.ho3_status === 'CONFIRMED') return `/offboarding/${p.id}/handover-form/ho3`
  if (!(canConfirmHO3.value || isProcessEmployee.value)) return null
  return `/offboarding/${p.id}/handover-form/ho3`
})
const ho3LinkLabel = computed(() =>
  process.value?.handover?.ho3_status === 'CONFIRMED' ? 'Xem Biên Bản QF-HRA-11' : 'Mở Biên Bản QF-HRA-11'
)

const handoverProgress = computed(() => {
  const h = process.value?.handover
  if (!h) return 0
  return [h.ho1_status, h.ho2_status, h.ho3_status].filter(s => s === 'CONFIRMED').length
})

const daysUntilLWD = computed(() => {
  if (!process.value?.last_working_day) return null
  return Math.ceil((new Date(process.value.last_working_day).getTime() - Date.now()) / 86400000)
})

onMounted(async () => {
  if (!offboardingStore.currentProcess || offboardingStore.currentProcess.id !== route.params.id) {
    await offboardingStore.fetchProcess(route.params.id)
  }
})

// ── Checklist definitions ──────────────────────────────────────────────────────
const ho1Checklist = [
  { key: 'tasks',      label: 'Bàn giao danh sách công việc đang thực hiện', hint: 'Mô tả chi tiết trạng thái từng task' },
  { key: 'docs',       label: 'Bàn giao tài liệu, hồ sơ liên quan',          hint: 'File cứng và file mềm' },
  { key: 'passwords',  label: 'Bàn giao mật khẩu hệ thống / tài khoản',      hint: 'Email, phần mềm, cổng thông tin...' },
  { key: 'knowledge',  label: 'Chia sẻ kiến thức / quy trình chuyên môn',    hint: '' },
]

const ho2Checklist = [
  { key: 'laptop',     label: 'Trả máy tính / thiết bị điện tử',    hint: 'Kiểm tra tình trạng máy trước khi nhận lại' },
  { key: 'access',     label: 'Thu hồi thẻ từ / thẻ truy cập',      hint: 'Thẻ tòa nhà, thẻ parking...' },
  { key: 'equipment',  label: 'Thu hồi tài sản khác của công ty',    hint: 'Điện thoại, đồng phục, dụng cụ...' },
  { key: 'systems',    label: 'Vô hiệu hóa tài khoản hệ thống',     hint: 'IT thực hiện sau khi nhận xác nhận' },
]

const ho3Checklist = [
  { key: 'interview',  label: 'Hoàn thành phỏng vấn nghỉ việc với HR',         hint: 'Exit interview form QF-HRA-11' },
  { key: 'bhyt',       label: 'Trả thẻ Bảo Hiểm Y Tế (BHYT)',                  hint: 'Trong vòng 03 ngày kể từ LWD' },
  { key: 'ppe',        label: 'Trả đồ Bảo Hộ Lao Động (PPE)',                  hint: 'Mũ bảo hiểm, áo phản quang...' },
  { key: 'clearance',  label: 'Ký xác nhận hoàn tất thủ tục',                  hint: 'HR giữ 1 bản, nhân viên giữ 1 bản' },
]

// ── Actions ────────────────────────────────────────────────────────────────────
const confirmHO = async (hoKey, notes) => {
  const result = await offboardingStore.confirmHandover(route.params.id, hoKey, notes)
  if (result.success) {
    toast.success(`${hoKey.toUpperCase()} đã được xác nhận!`)
  } else {
    toast.error(result.message ?? 'Không thể xác nhận bàn giao')
  }
}

const handleEarlyExit = async () => {
  const result = await offboardingStore.takeAction(
    route.params.id,
    6,
    { action: 'approve', note: 'Early exit approved — handover completed before LWD' }
  )
  if (result.success) {
    toast.success('Đã phê duyệt nghỉ sớm (Early Exit)!')
  } else {
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
