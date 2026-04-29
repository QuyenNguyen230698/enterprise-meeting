<template>
  <div class="print-root">
    <div class="no-print toolbar">
      <button class="btn" @click="$emit('print')">
        <i class="bi bi-printer"></i>
        In / Save PDF
      </button>
    </div>

    <div class="a4-page">
      <div class="bg-white border border-gray-300 overflow-hidden shadow-sm print-form">
        <div class="grid grid-cols-12 border-b border-gray-300 min-h-22">
          <div class="col-span-3 border-r border-gray-300 flex items-center justify-center px-3">
            <div class="text-center leading-tight w-full">
              <h2 class="brand-title text-gray-900 tracking-tight">Enterprise Meeting</h2>
              <div class="text-xs text-gray-500">Internal Platform</div>
            </div>
          </div>
          <div class="col-span-6 border-r border-gray-300 flex flex-col gap-1 items-center justify-center px-3 text-center">
            <p class="text-xs text-gray-500">Enterprise Meeting Co., Ltd.</p>
            <p class="text-base font-bold text-gray-900">ĐƠN XIN THÔI VIỆC</p>
            <p class="text-xs italic text-gray-600">RESIGNATION NOTICE FORM</p>
          </div>
          <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
            <p class="text-xs text-gray-500">ISO Document Code</p>
            <p class="text-xs font-bold text-gray-800">QF-HRA-18/R07</p>
            <p class="text-xs text-gray-500 mt-1">Mã đơn / Application ref.</p>
            <p class="text-xs font-semibold text-blue-700 break-all">{{ process?.application_ref || "—" }}</p>
          </div>
        </div>

        <div class="grid grid-cols-12 text-sm">
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Họ và tên / <span class="text-xs font-normal italic">Full Name</span>
          </div>
          <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ process?.employee_name || "—" }}
          </div>
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Mã NV / <span class="text-xs font-normal italic">E.Code</span>
          </div>
          <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ process?.employee_code || "—" }}
          </div>

          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Phòng ban / <span class="text-xs font-normal italic">Department</span>
          </div>
          <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ process?.department || process?.dept_code || "—" }}
          </div>
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Chức danh / <span class="text-xs font-normal italic">Position</span>
          </div>
          <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ process?.job_title || "—" }}
          </div>

          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Ngày vào làm / <span class="text-xs font-normal italic">Joining Date</span>
          </div>
          <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ formatDate(process?.joining_date) }}
          </div>
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-blue-700">
            Ngày nộp đơn / <span class="text-xs font-normal italic">Resignation Date</span>
          </div>
          <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-bold text-blue-700">
            {{ formatDate(process?.resignation_date) }}
          </div>

          <div class="col-span-2 border-r border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Ngày làm việc cuối cùng / <span class="text-xs font-normal italic">Last Working Day</span>
          </div>
          <div class="col-span-10 px-3 py-2 text-sm font-semibold text-gray-800">
            {{ formatDate(process?.last_working_day) }}
          </div>
        </div>

        <div class="border-t border-b border-gray-300 px-3 py-2">
          <div class="text-sm font-semibold text-gray-700 mb-1.5">
            Loại hợp đồng lao động ký với Enterprise Meeting /
            <span class="text-xs italic font-normal">Type of Labor Contract with Enterprise Meeting</span>
          </div>
          <div class="flex flex-col gap-y-1 text-sm">
            <div>{{ isIndefinite ? "(x)" : "( )" }} Không xác định thời hạn / <span class="italic">Indefinite employment contract</span></div>
            <div>{{ isIndefinite ? "( )" : "(x)" }} Xác định thời hạn / <span class="italic">Definite employment contract</span></div>
          </div>
        </div>

        <div class="border-b border-gray-300 px-3 py-2">
          <div class="text-sm font-semibold text-gray-700 mb-1.5">
            Lý do thôi việc / <span class="text-xs italic font-normal">Reasons for Resignation</span>
          </div>
          <div class="text-sm text-gray-900 leading-relaxed min-h-20">
            {{ process?.reason_for_resignation || "—" }}
          </div>
        </div>

        <div class="border-b border-gray-300 px-3 py-2">
          <p class="text-xs text-gray-700 leading-relaxed">
            Tôi cam đoan hoàn thành tốt nhiệm vụ được giao cho đến ngày tôi được phép nghỉ việc và hoàn tất mọi thủ tục bàn giao
            (về chứng từ, tài sản,...) liên quan đến lĩnh vực và nhiệm vụ tôi phụ trách. /
            <span class="italic">I commit to fulfill all my duties and complete all hand-over formalities before leaving the company.</span>
          </p>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-sm text-gray-800">{{ process?.commitment_accepted ? "[x]" : "[ ]" }}</span>
            <span class="text-sm text-gray-700">Đã xác nhận cam kết</span>
          </div>
        </div>

        <div class="px-3 py-2 bg-red-50">
          <p class="text-xs font-semibold text-red-700">Ghi chú / <span class="italic font-normal">Remarks</span>:</p>
          <p class="text-xs text-red-700 mt-1 leading-relaxed">
            Vui lòng trả thẻ BHYT và đồ Bảo hộ lao động trong vòng 03 ngày kể từ ngày làm việc cuối cùng /
            <span class="italic">Please return Health Insurance Card and PPE within 03 days from the last working day.</span>
          </p>
        </div>

        <div class="border-t border-gray-300 overflow-x-hidden">
          <table class="w-full border-collapse table-fixed text-xs approval-table">
            <thead class="bg-blue-800 text-white">
              <tr>
                <th class="w-26 border border-blue-600 px-2 py-2"></th>
                <th v-for="h in headers" :key="h.key" class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">
                  {{ h.vn }} /<br />
                  <span class="text-xs italic font-normal">{{ h.en }}</span><br />
                  <span class="text-xss italic font-extralight">{{ h.role }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr>
                <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chữ ký /<br><span class="italic font-normal">Signature</span></td>
                <td v-for="h in headers" :key="`sig-${h.key}`" class="border border-gray-300 p-6 text-center">
                  <div class="signature-holder">
                    <img
                      v-if="signatureSrc(h.key)"
                      :src="signatureSrc(h.key)"
                      alt="signature"
                      class="signature-img object-contain"
                    />
                    <span v-else class="text-gray-500 text-xs">—</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Họ và tên /<br><span class="italic font-normal">Name</span></td>
                <td v-for="h in headers" :key="`name-${h.key}`" class="border border-gray-300 px-2 py-2 text-center font-semibold wrap-break-word">
                  {{ approval(h.key).name || "—" }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chức danh /<br><span class="italic font-normal">Position</span></td>
                <td v-for="h in headers" :key="`pos-${h.key}`" class="border border-gray-300 px-2 py-2 text-center font-medium wrap-break-word">
                  {{ approval(h.key).title || "—" }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Ngày /<br><span class="italic font-normal">Date</span></td>
                <td v-for="h in headers" :key="`date-${h.key}`" class="border border-gray-300 px-2 py-2 text-center font-medium">
                  {{ formatDate(approval(h.key).date) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  process: { type: Object, required: true },
})
defineEmits(["print"])

const headers = [
  { key: "requested", vn: "Người làm đơn", en: "Requested by", role: "Nhân viên/Staff" },
  { key: "verified", vn: "Xác nhận bởi", en: "Verified by", role: "Trường phòng/Head of Dept." },
  { key: "checked", vn: "Kiểm tra", en: "Checked by", role: "Phòng nhân sự/HR Dept." },
  { key: "approved", vn: "Phê duyệt bởi", en: "Approved by", role: "Ban lãnh đạo/Management" },
]

const isIndefinite = computed(() => String(props.process?.contract_type || "").toUpperCase().includes("INDEFINITE"))
const approval = (key) => props.process?.approval_summary?.[key] || {}
const signatureSrc = (key) => approval(key)?.signature_image_url || approval(key)?.signature_data || ""

const formatDate = (value) => {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}
</script>

<style scoped>
.print-root { background: #f3f4f6; min-height: 100vh; padding: 16px; }
.toolbar { max-width: 210mm; margin: 0 auto 10px; display: flex; justify-content: flex-end; }
.btn { border: 1px solid #16a34a; background: #dcfce7; color: #166534; border-radius: 8px; padding: 8px 12px; font-size: 12px; cursor: pointer; }
.btn i { margin-right: 6px; }
.a4-page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #fff;
  color: #111827;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}
.print-form { font-weight: 500; }
.brand-title { font-weight: 800; font-size: 1.2rem; text-align: center; }
.signature-holder {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.signature-img {
  height: 80px;
  width: auto;
  object-fit: contain;
  display: block;
}

@media print {
  @page { size: A4; margin: 8mm; }
  .no-print { display: none !important; }
  .print-root { padding: 0; background: #fff; }
  .a4-page { width: 100%; min-height: auto; box-shadow: none; margin: 0; }
  .print-form { font-size: 11px; line-height: 1.12; }
  .print-form .min-h-22 { min-height: 4.2rem !important; }
  .print-form .px-3 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
  .print-form .py-3 { padding-top: 0.4rem !important; padding-bottom: 0.4rem !important; }
  .print-form .py-2 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
  .print-form .mt-2 { margin-top: 0.25rem !important; }
  .print-form .mb-2 { margin-bottom: 0.25rem !important; }
  .print-form .mb-1\.5 { margin-bottom: 0.15rem !important; }
  .print-form .text-base { font-size: 0.92rem !important; }
  .print-form .text-sm { font-size: 0.72rem !important; line-height: 1.1 !important; }
  .print-form p, .print-form span, .print-form div, .print-form td, .print-form th { line-height: 1.1 !important; }
  .print-form .space-y-1\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.2rem !important; }
  .signature-holder { width: 100%; }
  .signature-img { height: 80px; width: auto; }
  .brand-title { font-size: 1.05rem; }
  .approval-table thead th {
    background-color: #1d4ed8 !important;
    color: #ffffff !important;
    border-color: #2563eb !important;
    -webkit-print-color-adjust: exact;
  }
}
</style>
