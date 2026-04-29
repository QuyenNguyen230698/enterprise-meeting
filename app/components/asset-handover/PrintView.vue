<template>
  <div class="print-root">
    <div class="no-print toolbar">
      <button class="btn" @click="$emit('print')">
        <i class="bi bi-printer"></i>
        In / Save PDF
      </button>
      <span class="text-sm text-gray-500">{{ typeMeta.title }}</span>
    </div>

    <div class="a4-page">
      <div class="bg-white border border-gray-300 overflow-hidden shadow-sm print-form">

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
            <p class="text-sm font-bold text-gray-900">{{ typeMeta.title }}</p>
            <p class="text-xs italic text-gray-600">{{ typeMeta.titleEn }}</p>
          </div>
          <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
            <p class="text-xs text-gray-500">ISO Document Code</p>
            <p class="text-xs font-bold text-gray-800">{{ typeMeta.code }}</p>
            <p class="text-xs text-gray-500 mt-1">Mã biên bản</p>
            <p class="text-xs font-semibold text-blue-700 break-all">{{ handover?.ref_code || '—' }}</p>
          </div>
        </div>

        <!-- ═══ THÔNG TIN CHUNG ═══ -->
        <div class="grid grid-cols-12 text-sm">
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Họ và tên</div>
          <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover?.employee_name || '—' }}</div>
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Mã nhân viên</div>
          <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover?.employee_code || '—' }}</div>

          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Phòng ban</div>
          <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover?.department || '—' }}</div>
          <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Chức danh</div>
          <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover?.job_title || '—' }}</div>

          <template v-if="formType !== 'ho3'">
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày lập</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(handover?.created_date || handover?.created_at) }}</div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">{{ formType === 'ho1' ? 'Ngày nghỉ việc' : 'Ngày bàn giao' }}</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(handover?.last_working_day || handover?.handover_date) || '—' }}</div>
          </template>
          <template v-else>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày lập</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(handover?.created_date || handover?.created_at) }}</div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày phỏng vấn</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(handover?.interview_date) || '—' }}</div>
          </template>
        </div>

        <!-- ═══ HO-1: BIÊN BẢN BÀN GIAO CÔNG VIỆC ═══ -->
        <template v-if="formType === 'ho1'">
          <!-- Bên giao / nhận / lý do -->
          <div class="grid grid-cols-12 text-sm">
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
              <p class="font-semibold text-gray-900">{{ handover?.employee_name || '—' }}</p>
              <p class="text-xs text-gray-500">{{ handover?.job_title || '' }}</p>
            </div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover?.hr_signer_name || '—' }}</div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Lý do</div>
            <div class="col-span-10 border-b border-gray-300 px-3 py-2">
              <div class="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <label class="flex items-center gap-1.5">
                  <input type="checkbox" :checked="handover?.reason_resign === 'true'" disabled class="accent-blue-700" />
                  <span :class="handover?.reason_resign === 'true' ? 'font-semibold text-blue-800' : 'text-gray-400'">Nghỉ việc</span>
                </label>
                <label class="flex items-center gap-1.5">
                  <input type="checkbox" :checked="handover?.reason_transfer === 'true'" disabled class="accent-blue-700" />
                  <span :class="handover?.reason_transfer === 'true' ? 'font-semibold text-blue-800' : 'text-gray-400'">Chuyển công tác / điều động</span>
                </label>
                <label class="flex items-center gap-1.5">
                  <input type="checkbox" :checked="handover?.reason_other === 'true'" disabled class="accent-blue-700" />
                  <span :class="handover?.reason_other === 'true' ? 'font-semibold text-blue-800' : 'text-gray-400'">Lý do khác</span>
                </label>
              </div>
            </div>
          </div>

          <!-- I. Danh sách công việc -->
          <div class="section-header border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">I. Danh sách bàn giao công việc</p>
          </div>
          <table class="w-full border-collapse table-fixed text-xs">
            <thead class="thead-blue">
              <tr>
                <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                <th class="border border-blue-600 px-2 py-2 text-left">NỘI DUNG CÔNG VIỆC BÀN GIAO</th>
                <th class="w-28 border border-blue-600 px-2 py-2 text-center">Tiến độ / Tình trạng</th>
                <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in (handover?.content?.jobRows ?? [])" :key="`job-${idx}`">
                <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-2 py-2 text-gray-800">{{ row.content }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center text-gray-600">{{ row.status }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">
                  <input type="checkbox" :checked="row.receiverConfirmed" disabled class="accent-green-600" />
                </td>
              </tr>
              <tr v-for="i in Math.max(0, 3 - (handover?.content?.jobRows?.length ?? 0))" :key="`jblank-${i}`">
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
              </tr>
            </tbody>
          </table>

          <!-- II. Tài liệu -->
          <div class="section-header border-y border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">II. Tài liệu, dữ liệu bàn giao</p>
          </div>
          <table class="w-full border-collapse table-fixed text-xs">
            <thead class="thead-blue">
              <tr>
                <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                <th class="border border-blue-600 px-2 py-2 text-left">TÀI LIỆU / FILE / DỮ LIỆU</th>
                <th class="w-24 border border-blue-600 px-2 py-2 text-center">Số lượng</th>
                <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in (handover?.content?.docRows ?? [])" :key="`doc-${idx}`">
                <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-2 py-2 text-gray-800 break-all">{{ row.content }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center text-gray-600">{{ row.quantity }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">
                  <input type="checkbox" :checked="row.receiverConfirmed" disabled class="accent-green-600" />
                </td>
              </tr>
              <tr v-for="i in Math.max(0, 3 - (handover?.content?.docRows?.length ?? 0))" :key="`dblank-${i}`">
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
              </tr>
            </tbody>
          </table>

          <!-- III. Tài khoản -->
          <div class="section-header border-y border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">III. Tài khoản / Quyền truy cập cần thu hồi</p>
          </div>
          <table class="w-full border-collapse table-fixed text-xs">
            <thead class="thead-blue">
              <tr>
                <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                <th class="border border-blue-600 px-2 py-2 text-left">Hệ thống / Công cụ</th>
                <th class="w-36 border border-blue-600 px-2 py-2 text-center">Tài khoản / Email</th>
                <th class="w-24 border border-blue-600 px-2 py-2 text-center">Đã thu hồi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in (handover?.content?.accessRows ?? [])" :key="`acc-${idx}`">
                <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-2 py-2 text-gray-800">{{ row.system }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center text-gray-600">{{ row.account }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">
                  <input type="checkbox" :checked="row.revoked" disabled class="accent-green-600" />
                </td>
              </tr>
              <tr v-for="i in Math.max(0, 3 - (handover?.content?.accessRows?.length ?? 0))" :key="`ablank-${i}`">
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
              </tr>
            </tbody>
          </table>
        </template>

        <!-- ═══ HO-2: BIÊN BẢN BÀN GIAO TÀI SẢN ═══ -->
        <template v-else-if="formType === 'ho2'">
          <!-- Bên giao / nhận / lý do -->
          <div class="grid grid-cols-12 text-sm">
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
              <p class="font-semibold text-gray-900">{{ handover?.employee_name || '—' }}</p>
              <p class="text-xs text-gray-500">{{ handover?.job_title || '' }}</p>
            </div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover?.hr_signer_name || '—' }}</div>
          </div>

          <!-- Danh sách tài sản -->
          <div class="section-header border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Danh sách bàn giao tài sản thiết bị</p>
          </div>
          <table class="w-full text-xs border-collapse table-fixed">
            <thead class="thead-blue">
              <tr>
                <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                <th class="border border-blue-600 px-2 py-2 text-left">Tên tài sản / Nội dung bàn giao</th>
                <th class="w-28 border border-blue-600 px-2 py-2 text-left">Mã / Serial</th>
                <th class="w-20 border border-blue-600 px-2 py-2 text-center">Tình trạng</th>
                <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(asset, idx) in (handover?.assets ?? [])" :key="idx">
                <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                <td class="border border-gray-300 px-2 py-2 text-gray-800">{{ asset.name || '—' }}</td>
                <td class="border border-gray-300 px-2 py-2 font-mono text-gray-600">{{ asset.serial || '—' }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center text-xs font-semibold" :class="conditionClass(asset.condition)">{{ conditionLabel(asset.condition) }}</td>
                <td class="border border-gray-300 px-2 py-2 text-center">
                  <input type="checkbox" :checked="asset.receiverConfirmed" disabled class="accent-green-600" />
                </td>
              </tr>
              <tr v-for="i in Math.max(0, 5 - (handover?.assets?.length ?? 0))" :key="`blank-${i}`">
                <td class="border border-gray-300 px-2 py-4 text-center text-gray-300">{{ (handover?.assets?.length ?? 0) + i }}</td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
                <td class="border border-gray-300 px-2 py-4"></td>
              </tr>
            </tbody>
          </table>
          <div v-if="handover?.general_note" class="border-b border-gray-300 px-4 py-3">
            <p class="text-xs font-semibold text-gray-500 mb-1">Ghi chú chung:</p>
            <p class="text-sm text-gray-700">{{ handover.general_note }}</p>
          </div>
        </template>

        <!-- ═══ HO-3: PHỎNG VẤN NGHỈ VIỆC ═══ -->
        <template v-else-if="formType === 'ho3'">
          <!-- Người phỏng vấn / hợp đồng -->
          <div class="grid grid-cols-12 text-sm">
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Người phỏng vấn</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover?.hr_signer_name || '—' }}</div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Loại hợp đồng</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 text-gray-900">{{ handover?.contract_type || '—' }}</div>
          </div>

          <!-- I. Lý do nghỉ việc -->
          <div class="section-header border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">I. Lý do nghỉ việc <span class="normal-case italic font-normal">(Reason for leaving)</span></p>
          </div>
          <div class="px-3 py-3 border-b border-gray-300 text-sm">
            <div class="grid grid-cols-2 gap-x-6 gap-y-1.5">
              <label v-for="r in ho3Reasons" :key="r.key" class="flex items-start gap-2">
                <input type="checkbox" :checked="content[r.key]" disabled class="accent-blue-700 mt-0.5" />
                <span :class="content[r.key] ? 'font-semibold text-blue-800' : 'text-gray-400'">{{ r.label }}</span>
              </label>
              <label class="flex items-start gap-2 col-span-2">
                <input type="checkbox" :checked="content.reason_other" disabled class="accent-blue-700 mt-0.5" />
                <span :class="content.reason_other ? 'font-semibold text-blue-800' : 'text-gray-400'">
                  Lý do khác<span v-if="content.reason_other_text">: {{ content.reason_other_text }}</span>
                </span>
              </label>
            </div>
            <div v-if="content.reason_detail" class="mt-2">
              <p class="text-xs font-semibold text-gray-600 mb-1">Mô tả chi tiết:</p>
              <p class="text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">{{ content.reason_detail }}</p>
            </div>
          </div>

          <!-- II. Đánh giá -->
          <div class="section-header border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">II. Đánh giá môi trường &amp; điều kiện làm việc</p>
          </div>
          <div class="px-3 py-3 border-b border-gray-300">
            <table class="w-full text-xs border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 w-1/2">Nội dung đánh giá</th>
                  <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-16">Rất tốt</th>
                  <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-12">Tốt</th>
                  <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-20">Bình thường</th>
                  <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-12">Kém</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in assessmentItems" :key="idx">
                  <td class="border border-gray-300 px-2 py-1.5 text-gray-700">{{ item.label }}</td>
                  <td v-for="val in ['very_good','good','normal','poor']" :key="val" class="border border-gray-300 px-2 py-1.5 text-center">
                    <input type="radio" :name="`assess-print-${idx}`" :value="val" :checked="content.assessment?.[idx] === val" disabled class="accent-blue-600" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- III. Ý kiến -->
          <div class="section-header border-b border-gray-300 px-3 py-1.5 bg-gray-50">
            <p class="text-xs font-semibold text-gray-700 uppercase tracking-wide">III. Ý kiến đề xuất cải tiến</p>
          </div>
          <div class="px-3 py-3 border-b border-gray-300 space-y-2 text-sm">
            <div v-if="content.liked_most">
              <p class="text-xs font-semibold text-gray-600">Điều thích nhất:</p>
              <p class="text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">{{ content.liked_most }}</p>
            </div>
            <div v-if="content.improvement">
              <p class="text-xs font-semibold text-gray-600">Cần cải thiện:</p>
              <p class="text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">{{ content.improvement }}</p>
            </div>
            <div v-if="content.return_intent" class="flex items-center gap-3">
              <p class="text-xs font-semibold text-gray-600">Muốn quay lại:</p>
              <div class="flex gap-4">
                <label v-for="opt in [{v:'yes',l:'Có'},{v:'maybe',l:'Có thể'},{v:'no',l:'Không'}]" :key="opt.v" class="flex items-center gap-1.5">
                  <input type="radio" :name="`return-print`" :value="opt.v" :checked="content.return_intent === opt.v" disabled class="accent-blue-600" />
                  <span :class="content.return_intent === opt.v ? 'font-semibold text-blue-800' : 'text-gray-400'">{{ opt.l }}</span>
                </label>
              </div>
            </div>
            <div v-if="content.hr_note" class="p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800">
              <strong>Ghi chú HR:</strong> {{ content.hr_note }}
            </div>
          </div>
        </template>

        <!-- ═══ CHỮ KÝ ═══ -->
        <div class="grid grid-cols-2 border-t border-gray-300">
          <div class="border-r border-gray-300 px-4 py-4 flex flex-col">
            <p class="text-xs font-bold text-gray-700 text-center mb-1">
              {{ formType === 'ho1' ? 'Người bàn giao' : formType === 'ho3' ? 'Nhân viên' : 'Nhân viên ký giao' }}
            </p>
            <p class="text-[10px] text-gray-500 text-center italic mb-3">
              {{ formType === 'ho1' ? '(Handed over by)' : formType === 'ho3' ? '(Interviewee)' : '(Xác nhận đã bàn giao)' }}
            </p>
            <div class="signature-holder min-h-12">
              <img v-if="handover?.employee_signature_url" :src="handover.employee_signature_url" alt="signature" class="signature-img" />
              <span v-else class="text-gray-300 text-xs">—</span>
            </div>
            <div class="mt-2 text-center">
              <p class="text-xs font-semibold text-gray-700">{{ handover?.employee_name || '' }}</p>
              <p class="text-[10px] text-gray-500">{{ formatDate(handover?.employee_signed_at) }}</p>
            </div>
          </div>
          <div class="px-4 py-4 flex flex-col">
            <p class="text-xs font-bold text-gray-700 text-center mb-1">
              {{ formType === 'ho1' ? 'Người nhận bàn giao' : formType === 'ho3' ? 'Người phỏng vấn (HR)' : 'HR Staff ký nhận' }}
            </p>
            <p class="text-[10px] text-gray-500 text-center italic mb-3">
              {{ formType === 'ho1' ? '(Received by)' : formType === 'ho3' ? '(Interviewer)' : '(Xác nhận đã nhận lại tài sản)' }}
            </p>
            <div class="signature-holder min-h-12">
              <img v-if="handover?.hr_signature_url" :src="handover.hr_signature_url" alt="signature" class="signature-img" />
              <span v-else class="text-gray-300 text-xs">—</span>
            </div>
            <div class="mt-2 text-center">
              <p class="text-xs font-semibold text-gray-700">{{ handover?.hr_signer_name || '' }}</p>
              <p class="text-[10px] text-gray-500">{{ formatDate(handover?.hr_signed_at) }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  handover:  { type: Object, default: null },
  formType:  { type: String, default: 'ho2' },
})

defineEmits(['print'])

const TYPE_META = {
  ho1: { code: 'QF-HRA-17', title: 'BIÊN BẢN BÀN GIAO CÔNG VIỆC',  titleEn: 'JOB HANDOVER FORM' },
  ho2: { code: 'QF-HRA-12', title: 'BIÊN BẢN BÀN GIAO TÀI SẢN THIẾT BỊ', titleEn: 'ASSET HANDOVER RECORD' },
  ho3: { code: 'QF-HRA-11', title: 'BIÊN BẢN PHỎNG VẤN NGHỈ VIỆC', titleEn: 'EXIT INTERVIEW FORM' },
}
const typeMeta = computed(() => TYPE_META[props.formType] ?? TYPE_META.ho2)
const content  = computed(() => props.handover?.content ?? {})

const ho3Reasons = [
  { key: 'reason_personal',    label: 'Lý do cá nhân (Personal reason)' },
  { key: 'reason_salary',      label: 'Thu nhập / Lương thưởng (Compensation)' },
  { key: 'reason_career',      label: 'Cơ hội phát triển nghề nghiệp (Career growth)' },
  { key: 'reason_management',  label: 'Phong cách quản lý (Management style)' },
  { key: 'reason_worklife',    label: 'Cân bằng công việc - cuộc sống (Work-life balance)' },
  { key: 'reason_environment', label: 'Môi trường / văn hóa làm việc (Work environment)' },
]
const assessmentItems = [
  { label: 'Môi trường làm việc (Work environment)' },
  { label: 'Chính sách lương thưởng (Compensation & Benefits)' },
  { label: 'Phong cách quản lý (Management style)' },
  { label: 'Cơ hội đào tạo & phát triển (Training & Development)' },
  { label: 'Văn hóa công ty (Company culture)' },
  { label: 'Điều kiện làm việc / cơ sở vật chất (Working conditions)' },
  { label: 'Sự cân bằng công việc - cuộc sống (Work-life balance)' },
]

const conditionLabel = (c) => ({ GOOD: 'Tốt', DAMAGED: 'Hỏng', LOST: 'Mất' }[c] ?? c ?? '')
const conditionClass  = (c) => ({ GOOD: 'text-green-700', DAMAGED: 'text-amber-700', LOST: 'text-red-700' }[c] ?? '')

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.print-root { background: #f3f4f6; min-height: 100vh; padding: 16px; }
.toolbar { max-width: 210mm; margin: 0 auto 10px; display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
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
.brand-title { font-weight: 800; font-size: 1.05rem; text-align: center; }

.signature-holder {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.signature-img {
  height: 60px;
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
  .print-form p, .print-form span, .print-form div, .print-form td, .print-form th { line-height: 1.1 !important; }
  .signature-img { height: 60px; width: auto; }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .thead-blue, .thead-blue th {
    background-color: #1e40af !important;
    color: #ffffff !important;
  }
  .print-form .bg-gray-50, .section-header {
    background-color: #f9fafb !important;
  }
}
</style>
