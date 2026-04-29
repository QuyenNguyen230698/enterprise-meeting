<template>
  <div class="bg-white border border-gray-300 overflow-hidden shadow-sm">
    <!-- Form header -->
    <div class="grid grid-cols-12 border-b border-gray-300 min-h-22">
      <div class="col-span-3 border-r border-gray-300 flex items-center justify-center px-3">
        <div class="text-center leading-tight">
          <h2 class="font-extrabold text-lg text-gray-900 tracking-tight">Enterprise Meeting</h2>
          <p class="text-xs text-gray-500">Internal Platform</p>
        </div>
      </div>
      <div class="col-span-6 border-r border-gray-300 flex flex-col items-center justify-center px-3 text-center">
        <p class="text-xs text-gray-500">Enterprise Meeting Co., Ltd.</p>
        <p class="text-base font-bold text-gray-900">ĐƠN XIN THÔI VIỆC</p>
        <p class="text-xs italic text-gray-600">RESIGNATION NOTICE FORM</p>
      </div>
      <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
        <p class="text-xs text-gray-500">ISO Document Code</p>
        <p class="text-xs font-bold text-gray-800">QF-HRA-18/R07</p>
        <p class="text-xs text-gray-500 mt-1">Mã đơn / Application ref.</p>
        <p class="text-xs font-semibold text-blue-700 break-all">{{ applicationRef || "—" }}</p>
      </div>
    </div>

    <!-- Main table -->
    <div class="grid grid-cols-12 text-[13px]">
      <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Họ và tên / <span class="text-xs font-normal italic">Full Name</span>
      </div>
      <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
        <input
          v-if="!readonly"
          v-model="profileForm.full_name"
          type="text"
          class="w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b focus:outline-none"
          :class="fieldErrorClass(isMissing('full_name'))"
          placeholder="Nhập họ và tên"
        />
        <div v-else class="font-semibold text-gray-900">{{ profileForm.full_name || "—" }}</div>
        <p v-if="!readonly && isMissing('full_name')" class="text-xs text-red-500 mt-1">Vui lòng nhập họ và tên</p>
      </div>
      <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Mã NV / <span class="text-xs font-normal italic">E.Code</span>
      </div>
      <div class="col-span-4 border-b border-gray-300 px-3 py-2">
        <input
          v-if="!readonly"
          v-model="profileForm.e_code"
          type="text"
          class="w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b focus:outline-none"
          :class="fieldErrorClass(isMissing('hr_code'))"
          placeholder="Nhập mã nhân viên"
        />
        <div v-else class="font-semibold text-gray-900">{{ profileForm.e_code || "—" }}</div>
        <p v-if="!readonly && isMissing('hr_code')" class="text-xs text-red-500 mt-1">Vui lòng nhập mã nhân viên</p>
      </div>

      <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Phòng ban / <span class="text-xs font-normal italic">Department</span>
      </div>
      <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
        <input
          v-if="!readonly"
          v-model="profileForm.department"
          type="text"
          class="w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b focus:outline-none"
          :class="fieldErrorClass(isMissing('department'))"
          placeholder="Nhập phòng ban"
        />
        <div v-else class="font-semibold text-gray-900">{{ profileForm.department || "—" }}</div>
        <p v-if="!readonly && isMissing('department')" class="text-xs text-red-500 mt-1">Vui lòng nhập phòng ban</p>
      </div>
      <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Chức danh / <span class="text-xs font-normal italic">Position</span>
      </div>
      <div class="col-span-4 border-b border-gray-300 px-3 py-2">
        <input
          v-if="!readonly"
          v-model="profileForm.title"
          type="text"
          class="w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b focus:outline-none"
          :class="fieldErrorClass(isMissing('title'))"
          placeholder="Nhập chức danh"
        />
        <div v-else class="font-semibold text-gray-900">{{ profileForm.title || "—" }}</div>
        <p v-if="!readonly && isMissing('title')" class="text-xs text-red-500 mt-1">Vui lòng nhập chức danh</p>
      </div>

      <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Ngày vào làm / <span class="text-xs font-normal italic">Joining Date</span>
      </div>
      <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
        <input
          v-if="!readonly"
          v-model="profileForm.joined_at"
          type="date"
          class="w-full text-sm font-semibold text-gray-900 bg-transparent border-0 border-b focus:outline-none"
          :class="fieldErrorClass(isMissing('joined_at'))"
        />
        <div v-else class="font-semibold text-gray-900">{{ formatDate(profileForm.joined_at) }}</div>
        <p v-if="!readonly && isMissing('joined_at')" class="text-xs text-red-500 mt-1">Vui lòng chọn ngày vào làm</p>
      </div>
      <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-blue-700">
        Ngày nộp đơn / <span class="text-xs font-normal italic">Resignation Date</span>
      </div>
      <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-bold text-blue-700">
        {{ formatDate(resignationDate) }}
      </div>

      <div class="col-span-2 border-r border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Ngày làm việc cuối cùng / <span class="text-xs font-normal italic">Last Working Day</span>
      </div>
      <div class="col-span-10 px-3 py-2">
        <input
          v-if="!readonly"
          v-model="form.last_working_day"
          type="date"
          :min="minLWD"
          class="w-full text-sm font-semibold border-0 border-b focus:outline-none py-0.5 bg-transparent"
          :class="lwdError || isMissing('last_working_day') ? 'border-red-400 text-red-600' : 'border-gray-300 text-gray-800'"
        />
        <div v-else class="text-sm font-semibold text-gray-800">{{ formatDate(form.last_working_day) }}</div>
        <p v-if="lwdError" class="text-xs text-red-500 mt-1">{{ lwdError }}</p>
      </div>
    </div>

    <div
      v-if="!readonly && missingRequiredFields.length"
      class="border-b border-gray-300 px-3 py-2 bg-red-50"
    >
      <p class="text-[11px] font-semibold text-red-700">
        Vui lòng điền đầy đủ thông tin bắt buộc:
        {{ missingRequiredFields.join(', ') }}.
      </p>
    </div>

    <div class="border-t border-b border-gray-300 px-3 py-2">
      <div class="text-[13px] font-semibold text-gray-700 mb-1.5">
        Loại hợp đồng lao động ký với Enterprise Meeting /
        <span class="text-[11px] italic font-normal">Type of Labor Contract with Enterprise Meeting</span>
      </div>
      <div class="flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
        <label class="flex items-center gap-2 cursor-pointer" :class="readonly ? 'pointer-events-none' : ''">
          <input type="radio" v-model="form.contract_type" value="INDEFINITE" class="accent-blue-700" />
          <span>Không xác định thời hạn / <span class="italic">Indefinite employment contract</span></span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer" :class="readonly ? 'pointer-events-none' : ''">
          <input type="radio" v-model="form.contract_type" value="DEFINITE" class="accent-blue-700" />
          <span>Xác định thời hạn / <span class="italic">Definite employment contract</span></span>
        </label>
      </div>
    </div>

    <div class="border-b border-gray-300 px-3 py-2">
      <div class="text-[13px] font-semibold text-gray-700 mb-1.5">
        Lý do thôi việc / <span class="text-[11px] italic font-normal">Reasons for Resignation</span>
      </div>
      <textarea
        v-if="!readonly"
        v-model="form.reason_for_resignation"
        rows="4"
        placeholder="Nhập lý do thôi việc (tối thiểu 20 ký tự)..."
        class="w-full text-sm text-gray-800 border border-gray-300 rounded-sm p-2 focus:border-blue-600 focus:outline-none resize-none"
        :class="reasonError || isMissing('reason_for_resignation') ? 'border-red-400' : ''"
      />
      <div v-else class="text-sm text-gray-900 leading-relaxed min-h-20">
        {{ form.reason_for_resignation || "—" }}
      </div>
      <p v-if="reasonError" class="text-xs text-red-500 mt-1">{{ reasonError }}</p>
    </div>

    <div class="border-b border-gray-300 px-3 py-2">
      <p class="text-xs text-gray-700 leading-relaxed">
        Tôi cam đoan hoàn thành tốt nhiệm vụ được giao cho đến ngày tôi được phép nghỉ việc và hoàn tất mọi thủ tục bàn giao
        (về chứng từ, tài sản,...) liên quan đến lĩnh vực và nhiệm vụ tôi phụ trách. /
        <span class="italic">I commit to fulfill all my duties and complete all hand-over formalities before leaving the company.</span>
      </p>
      <label v-if="!readonly" class="flex items-center gap-2 mt-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="form.commitment_accepted"
          class="accent-blue-700 w-4 h-4"
          :class="isMissing('commitment_accepted') ? 'ring-2 ring-red-300 rounded-xs' : ''"
        />
        <span class="text-sm text-gray-800">Tôi đồng ý với nội dung cam kết trên</span>
      </label>
      <div v-else class="flex items-center gap-2 mt-2">
        <i class="bi bi-check-circle-fill text-green-600"></i>
        <h3 class="text-sm text-gray-700">Đã xác nhận cam kết</h3>
      </div>
      <p v-if="commitmentError" class="text-xs text-red-500 mt-1">{{ commitmentError }}</p>
    </div>

    <div class="px-3 py-2 bg-red-50">
      <p class="text-xs font-semibold text-red-700">Ghi chú / <span class="italic font-normal">Remarks</span>:</p>
      <p class="text-xs text-red-700 mt-1 leading-relaxed">
        Vui lòng trả thẻ BHYT và đồ Bảo hộ lao động trong vòng 03 ngày kể từ ngày làm việc cuối cùng /
        <span class="italic">Please return Health Insurance Card and PPE within 03 days from the last working day.</span>
      </p>
    </div>

    <!-- Signature & approval matrix -->
    <div class="border-t border-gray-300 overflow-x-auto">
      <table class="w-full min-w-180 border-collapse table-fixed text-xs">
        <thead class="bg-blue-800 text-white">
          <tr>
            <th class="w-26 border border-blue-600 px-2 py-2"></th>
            <th class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">Người làm đơn /<br><span class="text-xs italic font-normal">Requested by</span><br><span class="text-xss italic font-extralight">Nhân viên/Staff</span></th>
            <th class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">Xác nhận bởi /<br><span class="text-xs italic font-normal">Verified by</span><br><span class="text-xss italic font-extralight">Trường phòng/Head of Dept.</span></th>
            <th class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">Kiểm tra /<br><span class="text-xs italic font-normal">Checked by</span><br><span class="text-xss italic font-extralight">Phòng nhân sự/HR Dept.</span></th>
            <th class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">Phê duyệt bởi /<br><span class="text-xs italic font-normal">Approved by</span><br><span class="text-xss italic font-extralight">Ban lãnh đạo/Management</span></th>
          </tr>
        </thead>
        <tbody class="text-gray-800">
          <tr>
            <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chữ ký /<br><span class="italic font-normal">Signature</span></td>
            <td v-for="(row, idx) in approvalRows" :key="`sig-${idx}`" class="border border-gray-300 p-6 text-center">
              <img
                v-if="row.signature_image_url || row.signature_data"
                :src="row.signature_image_url || row.signature_data"
                alt="signature"
                class="mx-auto h-20 w-auto object-contain"
              />
              <span v-else class="text-gray-500 text-[11px] wrap-break-word">{{ row.signature_text || '—' }}</span>
            </td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Họ và tên /<br><span class="italic font-normal">Name</span></td>
            <td v-for="(row, idx) in approvalRows" :key="`name-${idx}`" class="border border-gray-300 px-2 py-2 text-center font-semibold wrap-break-word">
              {{ row.name || '—' }}
            </td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chức danh /<br><span class="italic font-normal">Position</span></td>
            <td v-for="(row, idx) in approvalRows" :key="`pos-${idx}`" class="border border-gray-300 px-2 py-2 text-center font-medium wrap-break-word">
              {{ row.title || '—' }}
            </td>
          </tr>
          <tr>
            <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Ngày /<br><span class="italic font-normal">Date</span></td>
            <td v-for="(row, idx) in approvalRows" :key="`date-${idx}`" class="border border-gray-300 px-2 py-2 text-center font-medium">
              {{ formatDate(row.date) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Notice period regulation -->
    <div class="border-t border-gray-300 px-3 py-3">
      <p class="text-sm font-semibold text-gray-700 mb-2">
        Quy định về thời gian báo trước / <span class="italic font-normal">Notice in Advance</span>:
      </p>
      <div class="space-y-1.5 text-xs text-gray-800">
        <p><span class="font-semibold">a.</span> Ít nhất 45 ngày đối với HĐLĐ không xác định thời hạn / <span class="italic">At least 45 calendar days in respect of a labor contract with an indefinite term.</span></p>
        <p><span class="font-semibold">b.</span> Ít nhất 30 ngày đối với HĐLĐ xác định thời hạn từ 12 tháng đến 36 tháng / <span class="italic">At least 30 calendar days in respect of a labor contract with a definite term of full 12 months to 36 months.</span></p>
        <p><span class="font-semibold">c.</span> Ít nhất 03 ngày làm việc đối với HĐLĐ xác định thời hạn dưới 12 tháng / <span class="italic">At least 03 working days in respect of a labor contract less than 12 months.</span></p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  profile:         { type: Object,  required: true },
  applicationRef:  { type: String,  default: '' },
  readonly:        { type: Boolean, default: false },
  modelValue:      { type: Object,  default: () => ({}) },
  approvals:       { type: Object,  default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'valid'])

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

const resignationDate = computed(() =>
  props.modelValue?.resignation_date || new Date().toISOString().split('T')[0]
)

const form = reactive({
  last_working_day:       props.modelValue?.last_working_day       ?? '',
  contract_type:          props.modelValue?.contract_type          ?? 'DEFINITE',
  reason_for_resignation: props.modelValue?.reason_for_resignation ?? '',
  commitment_accepted:    props.modelValue?.commitment_accepted    ?? false,
  resignation_date:       props.modelValue?.resignation_date       ?? resignationDate.value,
})

const profileForm = reactive({
  full_name:    props.modelValue?.full_name ?? props.profile?.full_name ?? '',
  e_code:       props.modelValue?.e_code ?? props.profile?.e_code ?? props.modelValue?.hr_code ?? props.profile?.hr_code ?? '',
  department:   props.modelValue?.department ?? props.profile?.department ?? props.modelValue?.dept_code ?? props.profile?.dept_code ?? '',
  title:        props.modelValue?.title ?? props.profile?.title ?? '',
  joined_at:    normalizeDateOnly(
    props.modelValue?.joined_at ?? props.profile?.joined_at ?? props.modelValue?.joining_date ?? props.profile?.joining_date
  ),
})

const noticeDays = computed(() => form.contract_type === 'INDEFINITE' ? 45 : 30)

const minLWD = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + noticeDays.value)
  return d.toISOString().split('T')[0]
})

const lwdError = computed(() => {
  if (!form.last_working_day) return 'Vui lòng chọn ngày làm việc cuối cùng'
  if (form.last_working_day < minLWD.value) return `Cần báo trước ít nhất ${noticeDays.value} ngày`
  return ''
})

const reasonError = computed(() => {
  if (!form.reason_for_resignation.trim()) return 'Vui lòng nhập lý do thôi việc'
  if (form.reason_for_resignation.trim().length < 20) return 'Lý do tối thiểu 20 ký tự'
  return ''
})

const commitmentError = computed(() => {
  if (!form.commitment_accepted) return 'Vui lòng xác nhận cam kết trước khi nộp đơn'
  return ''
})

const missingRequiredFields = computed(() => {
  const missing = []
  if (!String(profileForm.full_name ?? '').trim()) missing.push('Họ và tên')
  if (!String(profileForm.e_code ?? '').trim()) missing.push('Mã NV')
  if (!String(profileForm.department ?? '').trim()) missing.push('Phòng ban')
  if (!String(profileForm.title ?? '').trim()) missing.push('Chức danh')
  if (!String(profileForm.joined_at ?? '').trim()) missing.push('Ngày vào làm')
  if (!String(form.last_working_day ?? '').trim()) missing.push('Ngày làm việc cuối cùng')
  if (!String(form.reason_for_resignation ?? '').trim()) missing.push('Lý do thôi việc')
  return missing
})

const isMissing = (field) => {
  const text = (v) => String(v ?? '').trim()
  if (field === 'full_name') return !text(profileForm.full_name)
  if (field === 'hr_code') return !text(profileForm.e_code)
  if (field === 'department') return !text(profileForm.department)
  if (field === 'title') return !text(profileForm.title)
  if (field === 'joined_at') return !text(profileForm.joined_at)
  if (field === 'last_working_day') return !text(form.last_working_day)
  if (field === 'reason_for_resignation') return !text(form.reason_for_resignation)
  if (field === 'commitment_accepted') return !form.commitment_accepted
  return false
}

const fieldErrorClass = (missing) =>
  missing ? 'border-red-400 text-red-600' : 'border-gray-200'

const isValid = computed(() =>
  !lwdError.value &&
  !reasonError.value &&
  !commitmentError.value &&
  !!form.contract_type &&
  missingRequiredFields.value.length === 0
)

watch(() => props.modelValue, (val) => {
  form.last_working_day = val?.last_working_day ?? form.last_working_day
  form.contract_type = val?.contract_type ?? form.contract_type
  form.reason_for_resignation = val?.reason_for_resignation ?? form.reason_for_resignation
  form.commitment_accepted = val?.commitment_accepted ?? form.commitment_accepted
  form.resignation_date = val?.resignation_date ?? form.resignation_date
}, { deep: true })

watch(() => props.profile, (val) => {
  if (!val) return
  if (!profileForm.full_name) profileForm.full_name = val.full_name ?? ''
  if (!profileForm.e_code) profileForm.e_code = val.e_code ?? val.hr_code ?? ''
  if (!profileForm.department) profileForm.department = val.department ?? val.dept_code ?? ''
  if (!profileForm.title) profileForm.title = val.title ?? ''
  if (!profileForm.joined_at) profileForm.joined_at = normalizeDateOnly(val.joined_at ?? val.joining_date)
}, { deep: true, immediate: true })

watch([form, profileForm], () => {
  emit('update:modelValue', { ...profileForm, ...form })
  emit('valid', isValid.value)
}, { deep: true })

const approvalRows = computed(() => {
  const requested = props.approvals?.requested || {}
  const verified = props.approvals?.verified || {}
  const checked = props.approvals?.checked || {}
  const approved = props.approvals?.approved || {}
  return [requested, verified, checked, approved]
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
