<template>
  <div class="print-root">
    <div class="no-print toolbar">
      <button class="btn" @click="$emit('print')">
        <i class="bi bi-printer"></i>
        In / Save PDF
      </button>
      <span class="ref-label">{{ hoRef }}</span>
    </div>

    <div class="a4-page">
      <div class="bg-white border border-gray-300 overflow-hidden print-form">

        <!-- ═══ HEADER ═══ -->
        <div class="grid grid-cols-12 border-b border-gray-300 min-h-22">
          <div class="col-span-3 border-r border-gray-300 flex items-center justify-center px-3">
            <div class="text-center leading-tight w-full">
              <h2 class="brand-title text-gray-900 tracking-tight">Enterprise Meeting</h2>
              <div class="text-xs text-gray-500">Internal Platform</div>
            </div>
          </div>
          <div class="col-span-6 border-r border-gray-300 flex flex-col gap-1 items-center justify-center px-3 text-center">
            <p class="text-xs text-gray-500">Enterprise Meeting Co., Ltd.</p>
            <p class="text-base font-bold text-gray-900">{{ formTitle }}</p>
            <p class="text-xs italic text-gray-600">{{ formTitleEn }}</p>
          </div>
          <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
            <p class="text-xs text-gray-500">ISO Document Code</p>
            <p class="text-xs font-bold text-gray-800">{{ formCode }}</p>
            <p class="text-xs text-gray-500 mt-1">Mã biên bản</p>
            <p class="text-xs font-semibold text-blue-700 break-all">{{ hoRef }}</p>
          </div>
        </div>

        <!-- ═══ THÔNG TIN CHUNG ═══ -->
        <div class="grid grid-cols-12 text-sm">
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Họ và tên / <span class="text-xs font-normal italic">Full Name</span>
          </div>
          <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ process?.employee_name || '—' }}
          </div>
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Mã NV / <span class="text-xs font-normal italic">E.Code</span>
          </div>
          <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ process?.employee_code || '—' }}
          </div>

          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Phòng ban / <span class="text-xs font-normal italic">Department</span>
          </div>
          <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ process?.department || process?.dept_code || '—' }}
          </div>
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Chức danh / <span class="text-xs font-normal italic">Position</span>
          </div>
          <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ process?.job_title || '—' }}
          </div>

          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Ngày lập biên bản
          </div>
          <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ printDate }}
          </div>
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
            Ngày nghỉ việc / <span class="text-xs font-normal italic">Last Working Day</span>
          </div>
          <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
            {{ formatDate(process?.last_working_day) }}
          </div>
        </div>

        <!-- ═══ HO-1: BIÊN BẢN BÀN GIAO CÔNG VIỆC ═══ -->
        <template v-if="isHO1">
          <div class="grid grid-cols-12 text-sm">
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
              <p class="font-semibold">{{ process?.employee_name || '—' }}</p>
              <p class="text-xs text-gray-500">Chức vụ: {{ process?.job_title || '—' }}</p>
            </div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2">
              <p class="font-semibold">{{ receiverName || '—' }}</p>
              <p class="text-xs text-gray-500">Chức vụ: Manager / Director</p>
            </div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Lý do bàn giao</div>
            <div class="col-span-10 border-b border-gray-300 px-3 py-2">
              <div class="flex flex-wrap gap-x-4 gap-y-0.5 text-sm">
                <span>(x) Nghỉ việc</span>
                <span>( ) Chuyển công tác / điều động</span>
                <span>( ) Lý do khác</span>
              </div>
            </div>
          </div>

          <!-- Bảng I: Công việc -->
          <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700">I. Danh sách bàn giao công việc</p>
          </div>
          <table class="w-full border-collapse table-fixed text-xs">
            <thead class="bg-blue-800 text-white">
              <tr>
                <th class="w-8 border border-blue-600 px-2 py-1.5 text-center">STT</th>
                <th class="border border-blue-600 px-2 py-1.5 text-left">
                  NỘI DUNG CÔNG VIỆC BÀN GIAO
                  <span class="block text-[10px] font-normal italic">(Công việc đang thực hiện, tồn đọng, đường dẫn file nếu có)</span>
                </th>
                <th class="w-24 border border-blue-600 px-2 py-1.5 text-center">Tiến độ / Tình trạng</th>
                <th class="w-20 border border-blue-600 px-2 py-1.5 text-center">Xác nhận bên nhận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in jobRows" :key="`job-${idx}`" class="h-7">
                <td class="border border-gray-300 px-2 py-1 text-center font-semibold">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-2 py-1">{{ row.content }}</td>
                <td class="border border-gray-300 px-2 py-1 text-center">{{ row.status }}</td>
                <td class="border border-gray-300 px-2 py-1 text-center">{{ row.receiverConfirmed ? '☑' : '☐' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Bảng II: Tài liệu -->
          <div class="border-b border-t border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700">II. Tài liệu, dữ liệu bàn giao</p>
          </div>
          <table class="w-full border-collapse table-fixed text-xs">
            <thead class="bg-blue-800 text-white">
              <tr>
                <th class="w-8 border border-blue-600 px-2 py-1.5 text-center">STT</th>
                <th class="border border-blue-600 px-2 py-1.5 text-left">
                  TÀI LIỆU / FILE / DỮ LIỆU
                  <span class="block text-[10px] font-normal italic">(Ghi rõ đường dẫn nếu là file mềm)</span>
                </th>
                <th class="w-20 border border-blue-600 px-2 py-1.5 text-center">Số lượng</th>
                <th class="w-20 border border-blue-600 px-2 py-1.5 text-center">Xác nhận bên nhận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in docRows" :key="`doc-${idx}`" class="h-7">
                <td class="border border-gray-300 px-2 py-1 text-center font-semibold">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-2 py-1">{{ row.content }}</td>
                <td class="border border-gray-300 px-2 py-1 text-center">{{ row.quantity }}</td>
                <td class="border border-gray-300 px-2 py-1 text-center">{{ row.receiverConfirmed ? '☑' : '☐' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Bảng III: Tài khoản -->
          <div class="border-b border-t border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700">III. Tài khoản / Quyền truy cập cần thu hồi</p>
          </div>
          <table class="w-full border-collapse table-fixed text-xs">
            <thead class="bg-blue-800 text-white">
              <tr>
                <th class="w-8 border border-blue-600 px-2 py-1.5 text-center">STT</th>
                <th class="border border-blue-600 px-2 py-1.5 text-left">Hệ thống / Công cụ</th>
                <th class="w-36 border border-blue-600 px-2 py-1.5 text-center">Tài khoản / Email</th>
                <th class="w-20 border border-blue-600 px-2 py-1.5 text-center">Đã thu hồi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in accessRows" :key="`access-${idx}`" class="h-7">
                <td class="border border-gray-300 px-2 py-1 text-center font-semibold">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-2 py-1">{{ row.system }}</td>
                <td class="border border-gray-300 px-2 py-1">{{ row.account }}</td>
                <td class="border border-gray-300 px-2 py-1 text-center">{{ row.revoked ? '☑' : '☐' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
            Ghi chú: Nội dung bàn giao gồm công việc đã hoàn thành, đang thực hiện dở dang, tồn đọng, tài liệu, dữ liệu, tài khoản hệ thống…
            (Nếu ghi không đủ có thể ghi sang trang khác và đánh số trang)
          </div>
        </template>

        <!-- ═══ HO-2: BIÊN BẢN BÀN GIAO TÀI SẢN ═══ -->
        <template v-if="isHO2">
          <div class="grid grid-cols-12 text-sm">
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
              <p class="font-semibold">{{ process?.employee_name || '—' }}</p>
              <p class="text-xs text-gray-500">Chức vụ: {{ process?.job_title || '—' }}</p>
            </div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2">
              <p class="font-semibold">{{ receiverName || '—' }}</p>
              <p class="text-xs text-gray-500">Chức vụ: HR Staff</p>
            </div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Lý do bàn giao</div>
            <div class="col-span-10 border-b border-gray-300 px-3 py-2">
              <div class="flex flex-wrap gap-x-4 gap-y-0.5 text-sm">
                <span>(x) Nghỉ việc</span>
                <span>( ) Chuyển công tác / điều động</span>
                <span>( ) Nghỉ bệnh</span>
                <span>( ) Lý do khác</span>
              </div>
            </div>
          </div>

          <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700">Danh sách bàn giao tài sản thiết bị</p>
          </div>
          <table class="w-full border-collapse table-fixed text-xs">
            <thead class="bg-blue-800 text-white">
              <tr>
                <th class="w-8 border border-blue-600 px-2 py-1.5 text-center">STT</th>
                <th class="border border-blue-600 px-2 py-1.5 text-left">Tên tài sản / Nội dung bàn giao</th>
                <th class="w-24 border border-blue-600 px-2 py-1.5 text-left">Mã / Serial</th>
                <th class="w-16 border border-blue-600 px-2 py-1.5 text-center">Tình trạng</th>
                <th class="w-24 border border-blue-600 px-2 py-1.5 text-center">Xác nhận bên nhận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in ho2Rows" :key="`asset-${idx}`" class="h-7">
                <td class="border border-gray-300 px-2 py-1 text-center font-semibold">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-2 py-1">{{ row.name || row.content }}</td>
                <td class="border border-gray-300 px-2 py-1 font-mono text-gray-600">{{ row.serial || '—' }}</td>
                <td class="border border-gray-300 px-2 py-1 text-center text-xs font-semibold" :class="{ 'text-green-700': row.condition === 'GOOD', 'text-amber-700': row.condition === 'DAMAGED', 'text-red-700': row.condition === 'LOST' }">{{ { GOOD: 'Tốt', DAMAGED: 'Hỏng', LOST: 'Mất' }[row.condition] || row.condition || '' }}</td>
                <td class="border border-gray-300 px-2 py-1 text-center">{{ row.receiverConfirmed ? '☑' : '☐' }}</td>
              </tr>
            </tbody>
          </table>
          <div class="border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
            Ghi chú: Liệt kê đầy đủ tài sản, thiết bị bàn giao. Ghi rõ tình trạng từng món.
          </div>
        </template>

        <!-- ═══ HO-3: BIÊN BẢN PHỎNG VẤN NGHỈ VIỆC ═══ -->
        <template v-if="isHO3">
          <div class="grid grid-cols-12 text-sm">
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Người phỏng vấn</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
              <p class="font-semibold">{{ receiverName || '—' }}</p>
              <p class="text-xs text-gray-500">Chức vụ: HR Staff</p>
            </div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày phỏng vấn</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ interviewDateDisplay || '—' }}</div>

            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày vào làm</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(process?.joining_date) }}</div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Loại hợp đồng</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ process?.contract_type || '—' }}</div>
          </div>

          <!-- Phần I -->
          <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700">I. Lý do nghỉ việc <span class="text-xs font-normal italic text-gray-500">(Reason for leaving)</span></p>
          </div>
          <div class="px-3 py-2 border-b border-gray-300">
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
              <span>{{ ho3Data.reason_personal ? '☑' : '☐' }} Lý do cá nhân (Personal reason)</span>
              <span>{{ ho3Data.reason_salary ? '☑' : '☐' }} Thu nhập / Lương thưởng (Compensation)</span>
              <span>{{ ho3Data.reason_career ? '☑' : '☐' }} Cơ hội phát triển nghề nghiệp (Career growth)</span>
              <span>{{ ho3Data.reason_management ? '☑' : '☐' }} Phong cách quản lý (Management style)</span>
              <span>{{ ho3Data.reason_worklife ? '☑' : '☐' }} Cân bằng công việc - cuộc sống (Work-life balance)</span>
              <span>{{ ho3Data.reason_environment ? '☑' : '☐' }} Môi trường / văn hóa làm việc (Work environment)</span>
              <span class="col-span-2">{{ ho3Data.reason_other ? '☑' : '☐' }} Lý do khác: {{ ho3Data.reason_other_text || '' }}</span>
            </div>
            <div class="text-xs font-semibold text-gray-600 mb-1">Mô tả chi tiết lý do nghỉ việc:</div>
            <div class="border border-gray-300 rounded min-h-14 px-2 py-1 text-xs">{{ ho3Data.reason_detail || '' }}</div>
          </div>

          <!-- Phần II -->
          <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700">II. Đánh giá môi trường & điều kiện làm việc <span class="text-xs font-normal italic text-gray-500">(Work environment assessment)</span></p>
          </div>
          <div class="px-3 py-2 border-b border-gray-300">
            <table class="w-full text-xs border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-2 py-1 text-left font-semibold text-gray-700 w-1/2">Nội dung đánh giá</th>
                  <th class="border border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 w-14">Rất tốt</th>
                  <th class="border border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 w-10">Tốt</th>
                  <th class="border border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 w-16">Bình thường</th>
                  <th class="border border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 w-10">Kém</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in assessmentItems" :key="item" class="h-7">
                  <td class="border border-gray-300 px-2 py-1">{{ item }}</td>
                  <td class="border border-gray-300 px-2 py-1 text-center">{{ (ho3Data.assessment || [])[idx] === 'Rất tốt' ? '●' : '○' }}</td>
                  <td class="border border-gray-300 px-2 py-1 text-center">{{ (ho3Data.assessment || [])[idx] === 'Tốt' ? '●' : '○' }}</td>
                  <td class="border border-gray-300 px-2 py-1 text-center">{{ (ho3Data.assessment || [])[idx] === 'Bình thường' ? '●' : '○' }}</td>
                  <td class="border border-gray-300 px-2 py-1 text-center">{{ (ho3Data.assessment || [])[idx] === 'Kém' ? '●' : '○' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Phần III -->
          <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-sm font-semibold text-gray-700">III. Ý kiến đề xuất cải tiến <span class="text-xs font-normal italic text-gray-500">(Suggestions for improvement)</span></p>
          </div>
          <div class="px-3 py-2 border-b border-gray-300 space-y-2 text-xs">
            <div>
              <div class="font-semibold text-gray-600 mb-0.5">Điều bạn thích nhất khi làm việc tại công ty:</div>
              <div class="border border-gray-300 rounded min-h-10 px-2 py-1">{{ ho3Data.liked_most || '' }}</div>
            </div>
            <div>
              <div class="font-semibold text-gray-600 mb-0.5">Điều bạn nghĩ công ty cần cải thiện:</div>
              <div class="border border-gray-300 rounded min-h-10 px-2 py-1">{{ ho3Data.improvement || '' }}</div>
            </div>
            <div class="flex items-center gap-6">
              <span class="font-semibold text-gray-600">Bạn có muốn quay lại công ty không?</span>
              <span>{{ ho3Data.return_intent === 'yes' ? '●' : '○' }} Có (Yes)</span>
              <span>{{ ho3Data.return_intent === 'maybe' ? '●' : '○' }} Có thể (Maybe)</span>
              <span>{{ ho3Data.return_intent === 'no' ? '●' : '○' }} Không (No)</span>
            </div>
            <div>
              <div class="font-semibold text-gray-600 mb-0.5">Nhận xét / Ghi chú thêm của HR sau phỏng vấn:</div>
              <div class="border border-gray-300 rounded min-h-10 px-2 py-1">{{ ho3Data.hr_note || '' }}</div>
            </div>
          </div>
        </template>

        <!-- ═══ SIGNATURE MATRIX (chung cho cả 3 HO) ═══ -->
        <div class="border-t border-gray-300 overflow-x-hidden">
          <table class="w-full border-collapse table-fixed text-xs approval-table">
            <thead class="bg-blue-800 text-white">
              <tr>
                <th class="w-26 border border-blue-600 px-2 py-2"></th>
                <th v-for="col in signerColumns" :key="col.key" class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">
                  {{ col.label }}<br>
                  <span class="text-xs italic font-normal">{{ col.labelEn }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr>
                <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chữ ký /<br><span class="italic font-normal">Signature</span></td>
                <td v-for="col in signerColumns" :key="`sig-${col.key}`" class="border border-gray-300 p-4 text-center">
                  <div class="signature-holder">
                    <img
                      v-if="col.signature"
                      :src="col.signature"
                      alt="signature"
                      class="signature-img"
                    />
                    <span v-else class="text-gray-400 text-xs">—</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Họ và tên /<br><span class="italic font-normal">Name</span></td>
                <td v-for="col in signerColumns" :key="`name-${col.key}`" class="border border-gray-300 px-2 py-2 text-center font-semibold wrap-break-word">
                  {{ col.actor || '—' }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chức danh /<br><span class="italic font-normal">Position</span></td>
                <td v-for="col in signerColumns" :key="`pos-${col.key}`" class="border border-gray-300 px-2 py-2 text-center font-medium wrap-break-word">
                  {{ col.title || '—' }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Ngày /<br><span class="italic font-normal">Date</span></td>
                <td v-for="col in signerColumns" :key="`date-${col.key}`" class="border border-gray-300 px-2 py-2 text-center font-medium">
                  {{ formatDate(col.at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  process: { type: Object, required: true },
  hoKey: { type: String, required: true }, // 'ho1' | 'ho2' | 'ho3'
  interviewDate: { type: String, default: '' },
})
defineEmits(['print'])

const isHO1 = computed(() => props.hoKey === 'ho1')
const isHO2 = computed(() => props.hoKey === 'ho2')
const isHO3 = computed(() => props.hoKey === 'ho3')

const formCode = computed(() => {
  if (isHO1.value) return 'QF-HRA-17'
  if (isHO2.value) return 'QF-HRA-12'
  return 'QF-HRA-11'
})
const formTitle = computed(() => {
  if (isHO1.value) return 'BIÊN BẢN BÀN GIAO CÔNG VIỆC'
  if (isHO2.value) return 'BIÊN BẢN BÀN GIAO TÀI SẢN'
  return 'BIÊN BẢN PHỎNG VẤN NGHỈ VIỆC'
})
const formTitleEn = computed(() => {
  if (isHO1.value) return 'JOB HANDOVER FORM'
  if (isHO2.value) return 'ASSET HANDOVER FORM'
  return 'EXIT INTERVIEW FORM'
})

const parentRef = computed(() => props.process?.application_ref || `HRM-R-${props.process?.id || '?'}`)
const hoRef = computed(() => {
  const suffix = isHO1.value ? 'HO-1' : isHO2.value ? 'HO-2' : 'HO-3'
  return `${parentRef.value}/${suffix}`
})

const printDate = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

const interviewDateDisplay = computed(() => {
  if (!props.interviewDate) return printDate.value
  return formatDate(props.interviewDate)
})

// Lấy thông tin từ handover timeline
const handover = computed(() => props.process?.handover || {})
const timeline = computed(() => handover.value?.[`${props.hoKey}_timeline`] || {})
const savedContent = computed(() => handover.value?.[`${props.hoKey}_content`] || {})

const blankJobRows = Array.from({ length: 15 }, () => ({ content: '', status: '', receiverConfirmed: false }))
const blankDocRows = Array.from({ length: 8 }, () => ({ content: '', quantity: '', receiverConfirmed: false }))
const blankAccessRows = Array.from({ length: 5 }, () => ({ system: '', account: '', revoked: false }))
const blankHandoverRows = Array.from({ length: 20 }, () => ({ name: '', serial: '', condition: 'GOOD', note: '', receiverConfirmed: false }))

const jobRows = computed(() => savedContent.value.jobRows || blankJobRows)
const docRows = computed(() => savedContent.value.docRows || blankDocRows)
const accessRows = computed(() => savedContent.value.accessRows || blankAccessRows)
const ho2Rows = computed(() => savedContent.value.assets || savedContent.value.handoverRows || blankHandoverRows)
const ho3Data = computed(() => savedContent.value.exitInterview || {})

// confirmed_name là tên thật (gateway lưu actorProfile.title vào signed_by/verified_by nên không dùng)
const receiverName = computed(() =>
  handover.value?.[`${props.hoKey}_confirmed_name`] ||
  timeline.value?.signed_by ||
  ''
)

const employeeSignature = computed(() =>
  timeline.value?.verified_signature_image_url || timeline.value?.verified_signature_data || null
)
const receiverSignature = computed(() =>
  timeline.value?.signed_signature_image_url || timeline.value?.signed_signature_data ||
  handover.value?.[`${props.hoKey}_confirmed_signature_image_url`] ||
  handover.value?.[`${props.hoKey}_confirmed_signature_data`] || null
)

const signerColumns = computed(() => {
  if (isHO1.value) {
    return [
      {
        key: 'employee',
        label: 'Bên giao',
        labelEn: 'Handed over by',
        actor: props.process?.employee_name,
        at: timeline.value?.verified_at,
        signature: employeeSignature.value,
        title: props.process?.job_title || 'Employee',
      },
      {
        key: 'receiver',
        label: 'Bên nhận',
        labelEn: 'Received by',
        actor: receiverName.value,
        at: timeline.value?.signed_at,
        signature: receiverSignature.value,
        title: 'Manager / Director',
      },
    ]
  }
  if (isHO3.value) {
    return [
      {
        key: 'employee',
        label: 'Nhân viên',
        labelEn: 'Interviewee',
        actor: props.process?.employee_name,
        at: timeline.value?.verified_at,
        signature: employeeSignature.value,
        title: props.process?.job_title || 'Employee',
      },
      {
        key: 'interviewer',
        label: 'Người phỏng vấn',
        labelEn: 'Interviewer (HR)',
        actor: receiverName.value,
        at: timeline.value?.signed_at,
        signature: receiverSignature.value,
        title: 'HR Staff',
      },
    ]
  }
  // HO-2
  return [
    {
      key: 'employee',
      label: 'Người làm đơn',
      labelEn: 'Requested by',
      actor: props.process?.employee_name,
      at: timeline.value?.verified_at,
      signature: employeeSignature.value,
      title: 'Employee',
    },
    {
      key: 'hr',
      label: 'Xác nhận bởi',
      labelEn: 'Verified by (HR)',
      actor: receiverName.value,
      at: timeline.value?.signed_at,
      signature: receiverSignature.value,
      title: 'HR Staff',
    },
  ]
})

const assessmentItems = [
  'Môi trường làm việc (Work environment)',
  'Chính sách lương thưởng (Compensation & Benefits)',
  'Phong cách quản lý (Management style)',
  'Cơ hội đào tạo & phát triển (Training & Development)',
  'Văn hóa công ty (Company culture)',
  'Điều kiện làm việc / cơ sở vật chất (Working conditions)',
  'Sự cân bằng công việc - cuộc sống (Work-life balance)',
]

const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}
</script>

<style scoped>
.print-root { background: #f3f4f6; min-height: 100vh; padding: 16px; }
.toolbar {
  max-width: 210mm;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn {
  border: 1px solid #16a34a;
  background: #dcfce7;
  color: #166534;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
}
.btn i { margin-right: 6px; }
.ref-label { font-size: 11px; color: #6b7280; font-weight: 600; }
.a4-page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #fff;
  color: #111827;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}
.print-form { font-weight: 500; }
.brand-title { font-weight: 800; font-size: 1.1rem; text-align: center; }
.signature-holder {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72px;
}
.signature-img {
  height: 72px;
  width: auto;
  object-fit: contain;
  display: block;
}

@media print {
  @page { size: A4 portrait; margin: 6mm 7mm; }

  .no-print { display: none !important; }
  .print-root { padding: 0 !important; background: #fff !important; }

  /* A4 page: không fix height, để browser tự xuống trang 2 nếu tràn */
  .a4-page {
    width: 100% !important;
    min-height: unset !important;
    max-height: unset !important;
    box-shadow: none !important;
    margin: 0 !important;
    overflow: visible !important;
  }

  /* Font compact — ưu tiên gom 1 trang, nội dung dài tự xuống trang 2 */
  .print-form {
    font-size: 9.5px !important;
    line-height: 1.05 !important;
  }
  .print-form p,
  .print-form span,
  .print-form div,
  .print-form td,
  .print-form th { line-height: 1.05 !important; }

  .print-form .text-base { font-size: 0.82rem !important; }
  .print-form .text-sm  { font-size: 0.62rem !important; }
  .print-form .text-xs  { font-size: 0.58rem !important; }
  .print-form .text-\[10px\] { font-size: 0.55rem !important; }

  /* Padding rất nhỏ để tiết kiệm diện tích */
  .print-form .px-3 { padding-left: 0.3rem !important; padding-right: 0.3rem !important; }
  .print-form .px-2 { padding-left: 0.2rem !important; padding-right: 0.2rem !important; }
  .print-form .py-2 { padding-top: 0.15rem !important; padding-bottom: 0.15rem !important; }
  .print-form .py-1\.5 { padding-top: 0.12rem !important; padding-bottom: 0.12rem !important; }
  .print-form .py-1 { padding-top: 0.08rem !important; padding-bottom: 0.08rem !important; }
  .print-form .p-4 { padding: 0.4rem !important; }
  .print-form .min-h-22 { min-height: 3rem !important; }
  .print-form .min-h-14 { min-height: 2rem !important; }
  .print-form .min-h-10 { min-height: 1.5rem !important; }

  /* Rows bảng compact */
  .print-form .h-7 { height: 1.35rem !important; }
  .print-form .space-y-2 > * + * { margin-top: 0.2rem !important; }

  /* Signature */
  .signature-holder { min-height: 52px !important; }
  .signature-img { height: 52px !important; }

  .brand-title { font-size: 0.9rem !important; }

  /* Signature matrix không bị cắt giữa trang */
  .approval-table { page-break-inside: avoid; break-inside: avoid; }

  /* Màu sắc khi in */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .approval-table thead th {
    background-color: #1d4ed8 !important;
    color: #ffffff !important;
    border-color: #2563eb !important;
  }
  .approval-table thead { background-color: #1d4ed8 !important; }
  .bg-gray-50  { background-color: #f9fafb !important; }
  .bg-gray-100 { background-color: #f3f4f6 !important; }
  .bg-blue-800 { background-color: #1e40af !important; }
  .text-white  { color: #ffffff !important; }
}
</style>
