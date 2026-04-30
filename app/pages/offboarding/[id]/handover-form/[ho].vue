<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <div class="shrink-0 bg-white border-b border-gray-200">
      <div class="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <NuxtLink
            :to="`/offboarding/${route.params.id}`"
            class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <i class="bi bi-arrow-left text-gray-600"></i>
          </NuxtLink>
          <div>
            <h1 class="text-base sm:text-lg font-bold text-gray-900">{{ formTitle }}</h1>
            <p class="text-xs text-gray-500">{{ formCode }} · {{ hoRef }}</p>
          </div>
        </div>
        <button
          v-if="process && isConfirmed"
          @click="showPrint = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-colors"
        >
          <i class="bi bi-printer"></i>
          In biên bản
        </button>
      </div>
    </div>

    <!-- Print overlay -->
    <div v-if="showPrint" class="fixed inset-0 z-50 bg-black/60 overflow-auto">
      <!-- Toolbar ngoài vùng A4, không in -->
      <div class="no-print sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-gray-900/80 backdrop-blur-sm">
        <span class="text-xs text-gray-300 font-semibold">{{ hoRef }}</span>
        <button
          @click="showPrint = false"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <i class="bi bi-x-lg"></i> Đóng
        </button>
      </div>
      <div class="flex items-start justify-center py-4">
        <div class="w-full max-w-[230mm]">
          <OffboardingHandoverPrintView
            v-if="process"
            :process="process"
            :ho-key="hoKey"
            :interview-date="interviewDate"
            @print="triggerPrint"
          />
        </div>
      </div>
    </div>

    <div v-if="offboardingStore.loading && !process" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
    </div>

    <div v-else-if="!process" class="flex-1 flex items-center justify-center text-gray-500">
      Không tìm thấy dữ liệu offboarding.
    </div>

    <div v-else class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-4xl mx-auto">

        <!-- ════ DOCUMENT HEADER (chung cho tất cả HO) ════ -->
        <div class="bg-white border border-gray-300 overflow-hidden shadow-sm">
          <div class="grid grid-cols-12 border-b border-gray-300 min-h-22">
            <div class="col-span-3 border-r border-gray-300 flex items-center justify-center px-3">
              <div class="text-center leading-tight">
                <h2 class="font-extrabold text-lg text-gray-900 tracking-tight">Enterprise Meeting</h2>
                <p class="text-xs text-gray-500">Internal Platform</p>
              </div>
            </div>
            <div class="col-span-6 border-r border-gray-300 flex flex-col items-center justify-center px-3 text-center">
              <p class="text-xs text-gray-500">Enterprise Meeting Co., Ltd.</p>
              <p class="text-base font-bold text-gray-900">{{ formTitle }}</p>
              <p class="text-xs italic text-gray-600">{{ formTitleEn }}</p>
            </div>
            <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
              <p class="text-xs text-gray-500">ISO Document Code</p>
              <p class="text-xs font-bold text-gray-800">{{ formCode }}</p>
              <p class="text-xs text-gray-500 mt-1">Mã biên bản</p>
              <p class="text-xs font-semibold text-gray-800">{{ hoRef }}</p>
            </div>
          </div>

          <!-- Thông tin chung (giữ nguyên cho cả 3 HO) -->
          <div class="grid grid-cols-12 text-[13px]">
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Họ và tên</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ process.employee_name || '—' }}</div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Mã nhân viên</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ process.employee_code || '—' }}</div>

            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Phòng ban</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ process.department || process.dept_code || '—' }}</div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Chức danh</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ process.job_title || '—' }}</div>

            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày lập biên bản</div>
            <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ currentDateTimeLabel }}</div>
            <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày nghỉ việc</div>
            <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(process.last_working_day) }}</div>
          </div>

          <!-- ════ HO-1: BIÊN BẢN BÀN GIAO CÔNG VIỆC (QF-HRA-17) ════ -->
          <template v-if="isHO1">
            <!-- Thông tin bàn giao -->
            <div class="grid grid-cols-12 text-[13px]">
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
              <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 text-gray-900">
                <p class="font-semibold">{{ process.employee_name || '—' }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Chức vụ: {{ process.job_title || '—' }}</p>
              </div>
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
              <div class="col-span-4 border-b border-gray-300 px-3 py-2 text-gray-900">
                <p class="font-semibold">{{ approverDisplayName || '—' }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Chức vụ: {{ approverRoleLabel }}</p>
              </div>

              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Lý do bàn giao</div>
              <div class="col-span-10 border-b border-gray-300 px-3 py-2 text-gray-900">
                <div class="flex flex-wrap gap-x-4 gap-y-1">
                  <label class="flex items-center gap-1"><input type="checkbox" checked disabled class="accent-blue-700 w-3.5 h-3.5"> <span>Nghỉ việc</span></label>
                  <label class="flex items-center gap-1"><input type="checkbox" disabled class="accent-blue-700 w-3.5 h-3.5"> <span>Chuyển công tác / điều động</span></label>
                  <label class="flex items-center gap-1"><input type="checkbox" disabled class="accent-blue-700 w-3.5 h-3.5"> <span>Lý do khác</span></label>
                </div>
              </div>
            </div>

            <!-- Bảng danh sách bàn giao -->
            <div class="border-b border-gray-300 px-3 py-2 bg-gray-50">
              <p class="text-[13px] font-semibold text-gray-700">I. Danh sách bàn giao công việc</p>
            </div>
            <table class="w-full border-collapse table-fixed text-xs">
              <thead class="bg-blue-800 text-white">
                <tr>
                  <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                  <th class="border border-blue-600 px-2 py-2 text-left">
                    NỘI DUNG CÔNG VIỆC BÀN GIAO
                    <div class="text-[10px] font-normal italic">(Công việc đang thực hiện, tồn đọng, đường dẫn file nếu có)</div>
                  </th>
                  <th class="w-28 border border-blue-600 px-2 py-2 text-center">Tiến độ / Tình trạng</th>
                  <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in jobRows" :key="`job-row-${idx}`">
                  <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                  <td class="border border-gray-300 px-2 py-2">
                    <input
                      v-model="row.content"
                      type="text"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-sm focus:outline-none"
                      placeholder="Nhập nội dung công việc bàn giao..."
                    />
                  </td>
                  <td class="border border-gray-300 px-2 py-2 text-center">
                    <input
                      v-model="row.status"
                      type="text"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-sm text-center focus:outline-none"
                      placeholder="Tiến độ / tình trạng..."
                    />
                  </td>
                  <td class="border border-gray-300 px-2 py-2 text-center">
                    <input type="checkbox" v-model="row.receiverConfirmed" :disabled="!canEditForm" class="accent-green-600 w-4 h-4" />
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Bảng tài liệu / file bàn giao -->
            <div class="border-b border-t border-gray-300 px-3 py-2 bg-gray-50">
              <p class="text-[13px] font-semibold text-gray-700">II. Tài liệu, dữ liệu bàn giao</p>
            </div>
            <table class="w-full border-collapse table-fixed text-xs">
              <thead class="bg-blue-800 text-white">
                <tr>
                  <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                  <th class="border border-blue-600 px-2 py-2 text-left">
                    TÀI LIỆU / FILE / DỮ LIỆU
                    <div class="text-[10px] font-normal italic">(Ghi rõ đường dẫn nếu là file mềm)</div>
                  </th>
                  <th class="w-24 border border-blue-600 px-2 py-2 text-center">Số lượng</th>
                  <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in docRows" :key="`doc-row-${idx}`">
                  <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                  <td class="border border-gray-300 px-2 py-2">
                    <input
                      v-model="row.content"
                      type="text"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-sm focus:outline-none"
                      placeholder="Tên tài liệu / đường dẫn..."
                    />
                  </td>
                  <td class="border border-gray-300 px-2 py-2 text-center">
                    <input
                      v-model="row.quantity"
                      type="text"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-sm text-center focus:outline-none"
                      placeholder="SL"
                    />
                  </td>
                  <td class="border border-gray-300 px-2 py-2 text-center">
                    <input type="checkbox" v-model="row.receiverConfirmed" :disabled="!canEditForm" class="accent-green-600 w-4 h-4" />
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Bảng tài khoản / quyền truy cập -->
            <div class="border-b border-t border-gray-300 px-3 py-2 bg-gray-50">
              <p class="text-[13px] font-semibold text-gray-700">III. Tài khoản / Quyền truy cập cần thu hồi</p>
            </div>
            <table class="w-full border-collapse table-fixed text-xs">
              <thead class="bg-blue-800 text-white">
                <tr>
                  <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                  <th class="border border-blue-600 px-2 py-2 text-left">Hệ thống / Công cụ</th>
                  <th class="w-36 border border-blue-600 px-2 py-2 text-center">Tài khoản / Email</th>
                  <th class="w-28 border border-blue-600 px-2 py-2 text-center">Đã thu hồi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in accessRows" :key="`access-row-${idx}`">
                  <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                  <td class="border border-gray-300 px-2 py-2">
                    <input
                      v-model="row.system"
                      type="text"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-sm focus:outline-none"
                      placeholder="VD: Google Workspace, Slack, GitHub..."
                    />
                  </td>
                  <td class="border border-gray-300 px-2 py-2">
                    <input
                      v-model="row.account"
                      type="text"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-sm text-center focus:outline-none"
                      placeholder="account@..."
                    />
                  </td>
                  <td class="border border-gray-300 px-2 py-2 text-center">
                    <input type="checkbox" v-model="row.revoked" :disabled="!canEditForm" class="accent-green-600 w-4 h-4" />
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="text-xs text-gray-500 px-3 py-2 border-t border-gray-200">
              Ghi chú: Nội dung bàn giao gồm công việc đã hoàn thành, đang thực hiện dở dang, tồn đọng, tài liệu, dữ liệu, tài khoản hệ thống…
              (Nếu ghi không đủ có thể ghi sang trang khác và đánh số trang)
            </div>
          </template>

          <!-- ════ HO-2: BIÊN BẢN BÀN GIAO TÀI SẢN (QF-HRA-12) ════ -->
          <template v-if="isHO2">
            <div class="grid grid-cols-12 text-[13px]">
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
              <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 text-gray-900">
                <p class="font-semibold">{{ process.employee_name || '—' }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Chức vụ: {{ process.job_title || '—' }}</p>
              </div>
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
              <div class="col-span-4 border-b border-gray-300 px-3 py-2 text-gray-900">
                <p class="font-semibold">{{ approverDisplayName || '—' }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Chức vụ: {{ approverRoleLabel }}</p>
              </div>

              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Lý do bàn giao</div>
              <div class="col-span-10 border-b border-gray-300 px-3 py-2 text-gray-900">
                <div class="flex flex-wrap gap-x-4 gap-y-1">
                  <label class="flex items-center gap-1"><input type="checkbox" checked disabled class="accent-blue-700 w-3.5 h-3.5"> <span>Nghỉ việc</span></label>
                  <label class="flex items-center gap-1"><input type="checkbox" disabled class="accent-blue-700 w-3.5 h-3.5"> <span>Chuyển công tác / điều động</span></label>
                  <label class="flex items-center gap-1"><input type="checkbox" disabled class="accent-blue-700 w-3.5 h-3.5"> <span>Nghỉ bệnh</span></label>
                  <label class="flex items-center gap-1"><input type="checkbox" disabled class="accent-blue-700 w-3.5 h-3.5"> <span>Lý do khác</span></label>
                </div>
              </div>
            </div>

            <div class="border-b border-gray-300 px-3 py-2 bg-gray-50">
              <p class="text-[13px] font-semibold text-gray-700">Danh sách bàn giao tài sản thiết bị</p>
            </div>
            <table class="w-full border-collapse table-fixed text-xs">
              <thead class="bg-blue-800 text-white">
                <tr>
                  <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                  <th class="border border-blue-600 px-2 py-2 text-left">Tên tài sản / Nội dung bàn giao</th>
                  <th class="w-28 border border-blue-600 px-2 py-2 text-left">Mã / Serial</th>
                  <th class="w-24 border border-blue-600 px-2 py-2 text-center">Tình trạng</th>
                  <th class="w-24 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in handoverRows" :key="`handover-row-${idx}`">
                  <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                  <td class="border border-gray-300 px-2 py-2">
                    <input
                      v-model="row.name"
                      type="text"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-sm focus:outline-none"
                      placeholder="Tên tài sản..."
                    />
                  </td>
                  <td class="border border-gray-300 px-2 py-2">
                    <input
                      v-model="row.serial"
                      type="text"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-sm focus:outline-none"
                      placeholder="Mã / Serial..."
                    />
                  </td>
                  <td class="border border-gray-300 px-2 py-2 text-center">
                    <select
                      v-model="row.condition"
                      :disabled="isLocked"
                      class="w-full border-0 bg-transparent text-xs focus:outline-none"
                    >
                      <option value="GOOD">Tốt</option>
                      <option value="DAMAGED">Hỏng</option>
                      <option value="LOST">Mất</option>
                    </select>
                  </td>
                  <td class="border border-gray-300 px-2 py-2 text-center">
                    <input type="checkbox" v-model="row.receiverConfirmed" :disabled="!canEditForm" class="accent-green-600 w-4 h-4" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-xs text-gray-500 px-3 py-2">
              Ghi chú: Liệt kê đầy đủ tài sản, thiết bị bàn giao. Ghi rõ tình trạng từng món.
            </div>
          </template>

          <!-- ════ HO-3: BIÊN BẢN PHỎNG VẤN NGHỈ VIỆC (QF-HRA-11) ════ -->
          <template v-if="isHO3">
            <div class="grid grid-cols-12 text-[13px]">
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Người phỏng vấn</div>
              <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 text-gray-900">
                <p class="font-semibold">{{ approverDisplayName || '—' }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Chức vụ: {{ approverRoleLabel }}</p>
              </div>
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày phỏng vấn</div>
              <div class="col-span-4 border-b border-gray-300 px-3 py-1.5 font-semibold text-gray-900">
                <input
                  v-model="interviewDate"
                  type="date"
                  :disabled="!canEditForm"
                  class="w-full border-0 bg-transparent text-sm font-semibold text-gray-900 focus:outline-none disabled:text-gray-900"
                />
              </div>

              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày vào làm</div>
              <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(process.joining_date) }}</div>
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Loại hợp đồng</div>
              <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ process.contract_type || '—' }}</div>
            </div>

            <!-- Phần I: Lý do nghỉ việc -->
            <div class="border-b border-t border-gray-300 px-3 py-2 bg-gray-50">
              <p class="text-[13px] font-semibold text-gray-700">I. Lý do nghỉ việc <span class="text-[11px] font-normal italic text-gray-500">(Reason for leaving)</span></p>
            </div>
            <div class="px-3 py-3 border-b border-gray-300 text-[13px]">
              <div class="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                <label class="flex items-start gap-2">
                  <input type="checkbox" v-model="exitInterview.reason_personal" :disabled="!canEditForm" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                  <span>Lý do cá nhân (Personal reason)</span>
                </label>
                <label class="flex items-start gap-2">
                  <input type="checkbox" v-model="exitInterview.reason_salary" :disabled="!canEditForm" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                  <span>Thu nhập / Lương thưởng (Compensation)</span>
                </label>
                <label class="flex items-start gap-2">
                  <input type="checkbox" v-model="exitInterview.reason_career" :disabled="!canEditForm" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                  <span>Cơ hội phát triển nghề nghiệp (Career growth)</span>
                </label>
                <label class="flex items-start gap-2">
                  <input type="checkbox" v-model="exitInterview.reason_management" :disabled="!canEditForm" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                  <span>Phong cách quản lý (Management style)</span>
                </label>
                <label class="flex items-start gap-2">
                  <input type="checkbox" v-model="exitInterview.reason_worklife" :disabled="!canEditForm" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                  <span>Cân bằng công việc - cuộc sống (Work-life balance)</span>
                </label>
                <label class="flex items-start gap-2">
                  <input type="checkbox" v-model="exitInterview.reason_environment" :disabled="!canEditForm" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                  <span>Môi trường / văn hóa làm việc (Work environment)</span>
                </label>
                <label class="flex items-start gap-2 col-span-2">
                  <input type="checkbox" v-model="exitInterview.reason_other" :disabled="!canEditForm" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                  <span class="flex-1">Lý do khác: <input v-model="exitInterview.reason_other_text" type="text" :disabled="!canEditForm" class="border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent ml-1 flex-1 text-xs" placeholder="Ghi rõ..." /></span>
                </label>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 block mb-1">Mô tả chi tiết lý do nghỉ việc:</label>
                <textarea
                  v-model="exitInterview.reason_detail"
                  rows="3"
                  :disabled="!canEditForm"
                  placeholder="Nhân viên mô tả chi tiết lý do nghỉ việc..."
                  class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-blue-500 focus:outline-none resize-none disabled:bg-gray-50"
                />
              </div>
            </div>

            <!-- Phần II: Đánh giá môi trường làm việc -->
            <div class="border-b border-gray-300 px-3 py-2 bg-gray-50">
              <p class="text-[13px] font-semibold text-gray-700">II. Đánh giá môi trường & điều kiện làm việc <span class="text-[11px] font-normal italic text-gray-500">(Work environment assessment)</span></p>
            </div>
            <div class="px-3 py-3 border-b border-gray-300">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 w-1/2">Nội dung đánh giá</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-14">Rất tốt</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-10">Tốt</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-14">Bình thường</th>
                    <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-10">Kém</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in assessmentItems" :key="`assess-${idx}`">
                    <td class="border border-gray-300 px-2 py-1.5">{{ item.label }}</td>
                    <td v-for="val in ['very_good', 'good', 'normal', 'poor']" :key="val" class="border border-gray-300 px-2 py-1.5 text-center">
                      <input
                        type="radio"
                        :name="`assess-${idx}`"
                        :value="val"
                        v-model="exitInterview.assessment[idx]"
                        :disabled="!canEditForm"
                        class="accent-blue-600"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Phần III: Ý kiến đề xuất -->
            <div class="border-b border-gray-300 px-3 py-2 bg-gray-50">
              <p class="text-[13px] font-semibold text-gray-700">III. Ý kiến đề xuất cải tiến <span class="text-[11px] font-normal italic text-gray-500">(Suggestions for improvement)</span></p>
            </div>
            <div class="px-3 py-3 border-b border-gray-300 space-y-3 text-[13px]">
              <div>
                <label class="text-xs font-semibold text-gray-600 block mb-1">Điều bạn thích nhất khi làm việc tại công ty:</label>
                <textarea
                  v-model="exitInterview.liked_most"
                  rows="2"
                  :disabled="!canEditForm"
                  placeholder="Chia sẻ điều bạn đánh giá cao..."
                  class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-blue-500 focus:outline-none resize-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 block mb-1">Điều bạn nghĩ công ty cần cải thiện:</label>
                <textarea
                  v-model="exitInterview.improvement"
                  rows="2"
                  :disabled="!canEditForm"
                  placeholder="Góp ý để công ty phát triển tốt hơn..."
                  class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-blue-500 focus:outline-none resize-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 block mb-1">Bạn có muốn quay lại công ty trong tương lai không?</label>
                <div class="flex gap-6 mt-1">
                  <label class="flex items-center gap-1.5">
                    <input type="radio" name="return_intent" value="yes" v-model="exitInterview.return_intent" :disabled="!canEditForm" class="accent-blue-600"> Có (Yes)
                  </label>
                  <label class="flex items-center gap-1.5">
                    <input type="radio" name="return_intent" value="maybe" v-model="exitInterview.return_intent" :disabled="!canEditForm" class="accent-blue-600"> Có thể (Maybe)
                  </label>
                  <label class="flex items-center gap-1.5">
                    <input type="radio" name="return_intent" value="no" v-model="exitInterview.return_intent" :disabled="!canEditForm" class="accent-blue-600"> Không (No)
                  </label>
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 block mb-1">Nhận xét / Ghi chú thêm của HR sau phỏng vấn:</label>
                <textarea
                  v-model="exitInterview.hr_note"
                  rows="2"
                  :disabled="!canEditForm"
                  placeholder="HR ghi chú sau buổi phỏng vấn..."
                  class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-blue-500 focus:outline-none resize-none disabled:bg-gray-50"
                />
              </div>
            </div>
          </template>

          <!-- ════ SIGNATURE MATRIX (chung cho tất cả HO) ════ -->
          <div class="bg-white border-t border-gray-300 overflow-x-auto shadow-sm">
            <table class="w-full min-w-140 border-collapse table-fixed text-xs">
              <thead class="bg-blue-800 text-white">
                <tr>
                  <th class="w-26 border border-blue-600 px-2 py-2"></th>
                  <th v-for="(row, idx) in signerColumns" :key="`head-${idx}`" class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">
                    {{ row.label }}<br><span class="text-xs italic font-normal">{{ row.labelEn }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-800">
                <tr>
                  <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chữ ký /<br><span class="italic font-normal">Signature</span></td>
                  <td v-for="(row, idx) in signerColumns" :key="`sig-${idx}`" class="border border-gray-300 p-4 text-center">
                    <img
                      v-if="row.signature"
                      :src="row.signature"
                      alt="signature"
                      class="mx-auto h-20 w-auto object-contain"
                    />
                    <span v-else class="text-gray-500 text-[11px] wrap-break-word">{{ row.done ? 'Signed' : '—' }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Họ và tên /<br><span class="italic font-normal">Name</span></td>
                  <td v-for="(row, idx) in signerColumns" :key="`name-${idx}`" class="border border-gray-300 px-2 py-2 text-center font-semibold wrap-break-word">
                    {{ row.actor || '—' }}
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chức danh /<br><span class="italic font-normal">Position</span></td>
                  <td v-for="(row, idx) in signerColumns" :key="`pos-${idx}`" class="border border-gray-300 px-2 py-2 text-center font-medium wrap-break-word">
                    {{ row.title || '—' }}
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Ngày /<br><span class="italic font-normal">Date</span></td>
                  <td v-for="(row, idx) in signerColumns" :key="`date-${idx}`" class="border border-gray-300 px-2 py-2 text-center font-medium">
                    {{ formatDateTime(row.at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ════ TIMELINE ════ -->
        <div class="mt-4 bg-white border border-gray-200 shadow-sm">
          <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl flex items-center justify-between">
            <p class="text-sm font-bold text-gray-800 flex items-center gap-2">
              <i class="bi bi-clock-history text-violet-500"></i>
              Tiến trình
            </p>
            <p
              class="px-2 py-1 text-[10px] font-bold rounded-full uppercase"
              :class="isConfirmed ? 'bg-green-100 text-green-700' : isRejected ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ isConfirmed ? 'CONFIRMED' : isRejected ? 'REJECTED' : 'IN PROGRESS' }}
            </p>
          </div>
          <div class="px-4 py-5">
            <div class="flex items-center">
              <div v-for="(step, idx) in timelineSteps" :key="step.key" class="flex items-center flex-1">
                <div class="flex flex-col items-center text-center w-28">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors"
                    :class="step.done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'"
                  >
                    <i v-if="step.done" class="bi bi-check-lg"></i>
                    <span v-else>{{ idx + 1 }}</span>
                  </div>
                  <p class="mt-2 text-[11px] font-semibold" :class="step.done ? 'text-green-700' : 'text-gray-500'">{{ step.label }}</p>
                </div>
                <div
                  v-if="idx < timelineSteps.length - 1"
                  class="h-0.5 flex-1 mx-1 transition-colors"
                  :class="step.done ? 'bg-green-400' : 'bg-gray-200'"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ════ NOTES & ACTIONS ════ -->
        <div class="border border-gray-200 px-3 py-2">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Ghi chú xác nhận</label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="Ghi chú thêm..."
            :disabled="!canAct || isLocked"
            class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-green-500 focus:outline-none resize-none disabled:bg-gray-50"
          />
        </div>

        <div v-if="canAct && !isConfirmed && !isRejected" class="border border-gray-200 px-3 py-2">
          <label class="text-xs font-semibold text-gray-500 mb-1 block">Lý do reject</label>
          <textarea
            v-model="rejectReason"
            rows="2"
            placeholder="Nhập lý do từ chối biên bản..."
            class="w-full text-sm border border-red-200 rounded-sm p-2 focus:border-red-400 focus:outline-none resize-none"
          />
        </div>

        <div class="mt-4 bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-2 shadow-sm">
          <p v-if="!canAnyAction && !isConfirmed && !isRejected" class="text-xs text-gray-500">Bạn chưa có thao tác tại bước này.</p>
          <p v-else-if="isConfirmed" class="text-xs text-green-700 font-semibold">Biên bản đã xác nhận.</p>
          <p v-else-if="isRejected" class="text-xs text-red-700 font-semibold">Biên bản đã bị reject.</p>
          <div v-if="canAnyAction && !isConfirmed && !isRejected" class="ml-auto flex items-center gap-2">
            <button
              v-if="isEmployee"
              :disabled="!canVerify || workflow.verified || offboardingStore.submitting"
              @click="markVerified"
              class="px-3 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl disabled:opacity-50"
            >
              Nhân viên ký
            </button>
            <button
              v-if="canAct"
              :disabled="!canAuthenticate || !workflow.verified || workflow.authenticated || offboardingStore.submitting"
              @click="markAuthenticated"
              class="px-3 py-1.5 text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-xl disabled:opacity-50"
            >
              xác thực
            </button>
            <button
              v-if="canAct"
              :disabled="!canSign || !workflow.verified || !workflow.authenticated || workflow.signed || offboardingStore.submitting"
              @click="markSigned"
              class="px-3 py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl disabled:opacity-50"
            >
              Ký tên
            </button>
            <button
              v-if="canAct"
              :disabled="!canComplete || !workflow.signed || workflow.completed || offboardingStore.submitting"
              @click="markCompleted"
              class="px-3 py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl disabled:opacity-50"
            >
              Complete
            </button>
            <button
              v-if="canAct"
              :disabled="offboardingStore.submitting || !rejectReason.trim()"
              @click="handleReject"
              class="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </button>
            <button
              v-if="canAct"
              :disabled="!workflow.completed || offboardingStore.submitting"
              @click="handleConfirm"
              class="px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="offboardingStore.submitting" class="bi bi-arrow-repeat animate-spin mr-1"></i>
              Confirm
            </button>
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
const auth = useAuthStore()
const { profileDeptCode, profileDepartment, profileTitle, fetchProfile } = useUserProfile()

const process = computed(() => offboardingStore.currentProcess)
const hoKey = computed(() => String(route.params.ho || '').toLowerCase())
const isHO1 = computed(() => hoKey.value === 'ho1')
const isHO2 = computed(() => hoKey.value === 'ho2')
const isHO3 = computed(() => hoKey.value === 'ho3')

const formCode = computed(() => {
  if (isHO1.value) return 'QF-HRA-17'
  if (isHO2.value) return 'QF-HRA-12'
  return 'QF-HRA-11'
})

// Mã biên bản = mã đơn offboarding + "/HO-x" → liên kết rõ ràng với đơn gốc
const parentRef = computed(() => process.value?.application_ref || `HRM-R-${route.params.id}`)
const hoRef = computed(() => {
  const suffix = isHO1.value ? 'HO-1' : isHO2.value ? 'HO-2' : 'HO-3'
  return `${parentRef.value}/${suffix}`
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

const currentDateTimeLabel = computed(() => {
  const d = new Date()
  const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
})

const currentDeptCode = profileDeptCode
const currentDepartment = profileDepartment
const currentTitle = profileTitle
const processDeptCode = computed(() => String(process.value?.department ?? process.value?.dept_code ?? '').toUpperCase())
const deptRoot = (code) => String(code || '').toUpperCase().split('_')[0] || ''
const inferDeptRootFromTitle = (title) => {
  const t = String(title || '').toUpperCase()
  if (!t) return ''
  if (t.includes('NHÂN SỰ') || t.includes('HR')) return 'HR'
  if (t.includes('TỔNG GIÁM ĐỐC') || t.includes('GM')) return 'GM'
  if (t.includes(' IT') || t.startsWith('IT') || t.includes('CÔNG NGHỆ THÔNG TIN')) return 'IT'
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

const canAct = computed(() => {
  if (!process.value || process.value.status !== 'PENDING_HANDOVER') return false
  if (isHO1.value) return isManagerOrDirectorSameDept.value
  if (isHO2.value) return isHRStaff.value
  if (isHO3.value) return isHRStaff.value
  return false
})
const normalizeId = (value) => String(value ?? '').trim()
const isEmployee = computed(() => {
  const processIds = [
    process.value?.employee_id,
    process.value?.employee_code,
  ].map(normalizeId).filter(Boolean)
  const actorIds = [
    auth.user?.portal_user_id,
    auth.user?.id,
    auth.user?.employee_id,
    auth.user?.employee_code,
    auth.user?.e_code,
    auth.user?.hr_code,
  ].map(normalizeId).filter(Boolean)
  return actorIds.some((id) => processIds.includes(id))
})
const canVerify = computed(() => isEmployee.value)
const canAuthenticate = computed(() => canAct.value)
const canSign = computed(() => canAct.value)
const canComplete = computed(() => canAct.value)
const canAnyAction = computed(() => canVerify.value || canAuthenticate.value || canSign.value || canComplete.value)
const canEditForm = computed(() => !isLocked.value && (isEmployee.value || canAct.value))

const isConfirmed = computed(() => {
  if (!process.value) return false
  if (isHO1.value) return process.value?.handover?.ho1_status === 'CONFIRMED'
  if (isHO2.value) return process.value?.handover?.ho2_status === 'CONFIRMED'
  if (isHO3.value) return process.value?.handover?.ho3_status === 'CONFIRMED'
  return false
})
const confirmedBy = computed(() => {
  if (isHO1.value) return process.value?.handover?.ho1_confirmed_name
  if (isHO2.value) return process.value?.handover?.ho2_confirmed_name
  return process.value?.handover?.ho3_confirmed_name
})
const confirmedAt = computed(() => {
  if (isHO1.value) return process.value?.handover?.ho1_date
  if (isHO2.value) return process.value?.handover?.ho2_date
  return process.value?.handover?.ho3_date
})
const isRejected = computed(() => {
  if (!process.value) return false
  if (isHO1.value) return process.value?.handover?.ho1_status === 'REJECTED'
  if (isHO2.value) return process.value?.handover?.ho2_status === 'REJECTED'
  if (isHO3.value) return process.value?.handover?.ho3_status === 'REJECTED'
  return false
})
const isLocked = computed(() => isConfirmed.value || isRejected.value || workflow.value.completed)

const notes = ref('')
const rejectReason = ref('')
const interviewDate = ref(new Date().toISOString().slice(0, 10))
const showPrint = ref(false)

const triggerPrint = () => {
  nextTick(() => window.print())
}

// HO-2 rows (asset handover)
const handoverRows = ref(
  Array.from({ length: 10 }, () => ({ name: '', serial: '', condition: 'GOOD', note: '', receiverConfirmed: false }))
)

// HO-1 rows (job handover)
const jobRows = ref(
  Array.from({ length: 10 }, () => ({ content: '', status: '', receiverConfirmed: false }))
)
const docRows = ref(
  Array.from({ length: 10 }, () => ({ content: '', quantity: '', receiverConfirmed: false }))
)
const accessRows = ref(
  Array.from({ length: 5 }, () => ({ system: '', account: '', revoked: false }))
)

// HO-3 exit interview data
const assessmentItems = [
  { label: 'Môi trường làm việc (Work environment)' },
  { label: 'Chính sách lương thưởng (Compensation & Benefits)' },
  { label: 'Phong cách quản lý (Management style)' },
  { label: 'Cơ hội đào tạo & phát triển (Training & Development)' },
  { label: 'Văn hóa công ty (Company culture)' },
  { label: 'Điều kiện làm việc / cơ sở vật chất (Working conditions)' },
  { label: 'Sự cân bằng công việc - cuộc sống (Work-life balance)' },
]
const exitInterview = ref({
  reason_personal: false,
  reason_salary: false,
  reason_career: false,
  reason_management: false,
  reason_worklife: false,
  reason_environment: false,
  reason_other: false,
  reason_other_text: '',
  reason_detail: '',
  assessment: Array(assessmentItems.length).fill(''),
  liked_most: '',
  improvement: '',
  return_intent: '',
  hr_note: '',
})

const workflow = computed(() => {
  const timeline = process.value?.handover?.[`${hoKey.value}_timeline`] || {}
  return {
    verified: !!timeline.verified_at,
    authenticated: !!timeline.authenticated_at,
    signed: !!timeline.signed_at,
    completed: !!timeline.completed_at,
    verifiedAt: timeline.verified_at || null,
    authenticatedAt: timeline.authenticated_at || null,
    signedAt: timeline.signed_at || null,
    completedAt: timeline.completed_at || null,
    verifiedBy: timeline.verified_by || null,
    authenticatedBy: timeline.authenticated_by || null,
    signedBy: timeline.signed_by || null,
    completedBy: timeline.completed_by || null,
    verifiedSignature: timeline.verified_signature_image_url || timeline.verified_signature_data || null,
    signedSignature: timeline.signed_signature_image_url || timeline.signed_signature_data || null,
    completedSignature: timeline.completed_signature_image_url || timeline.completed_signature_data || null,
  }
})

const approverRoleLabel = computed(() => isHO1.value ? 'Manager/Director' : 'HR Staff')
// Bên nhận / người ký phía approver là signedBy hoặc confirmedBy — KHÔNG dùng verifiedBy
// vì verifiedBy là employee (bước ký đầu tiên "verify")
const approverDisplayName = computed(() =>
  workflow.value.authenticatedBy || workflow.value.signedBy || confirmedBy.value || ''
)
const employeeSignature = computed(() => workflow.value.verifiedSignature || null)
const confirmSignature = computed(() => {
  if (!process.value) return null
  const h = process.value.handover || {}
  if (isHO1.value) return h.ho1_confirmed_signature_image_url || h.ho1_confirmed_signature_data || null
  if (isHO2.value) return h.ho2_confirmed_signature_image_url || h.ho2_confirmed_signature_data || null
  return h.ho3_confirmed_signature_image_url || h.ho3_confirmed_signature_data || null
})

const timelineSteps = computed(() => {
  if (isHO1.value) {
    return [
      { key: 'employee-sign', label: 'Bên giao ký', done: workflow.value.verified, actor: workflow.value.verifiedBy, at: workflow.value.verifiedAt },
      { key: 'authenticate', label: 'Line Manager xác thực', done: workflow.value.authenticated, actor: workflow.value.authenticatedBy, at: workflow.value.authenticatedAt },
      { key: 'sign', label: 'Manager/Director ký', done: workflow.value.signed, actor: workflow.value.signedBy, at: workflow.value.signedAt },
      { key: 'complete', label: 'Complete/Reject', done: workflow.value.completed || isRejected.value, actor: workflow.value.completedBy || (isRejected.value ? process.value?.handover?.[`${hoKey.value}_rejected_name`] : null), at: workflow.value.completedAt || (isRejected.value ? process.value?.handover?.[`${hoKey.value}_rejected_date`] : null) },
    ]
  }
  if (isHO3.value) {
    return [
      { key: 'employee-sign', label: 'Nhân viên ký', done: workflow.value.verified, actor: workflow.value.verifiedBy, at: workflow.value.verifiedAt },
      { key: 'authenticate', label: 'HR xác thực', done: workflow.value.authenticated, actor: workflow.value.authenticatedBy, at: workflow.value.authenticatedAt },
      { key: 'sign', label: 'HR Ký', done: workflow.value.signed, actor: workflow.value.signedBy, at: workflow.value.signedAt },
      { key: 'complete', label: 'Complete/Reject', done: workflow.value.completed || isRejected.value, actor: workflow.value.completedBy || (isRejected.value ? process.value?.handover?.[`${hoKey.value}_rejected_name`] : null), at: workflow.value.completedAt || (isRejected.value ? process.value?.handover?.[`${hoKey.value}_rejected_date`] : null) },
    ]
  }
  // HO-2
  return [
    { key: 'employee-sign', label: 'Người làm đơn ký', done: workflow.value.verified, actor: workflow.value.verifiedBy, at: workflow.value.verifiedAt },
    { key: 'verify', label: 'HR Xác thực', done: workflow.value.authenticated, actor: workflow.value.authenticatedBy, at: workflow.value.authenticatedAt },
    { key: 'sign', label: 'HR Ký', done: workflow.value.signed, actor: workflow.value.signedBy, at: workflow.value.signedAt },
    { key: 'complete', label: 'Complete/Reject', done: workflow.value.completed || isRejected.value, actor: workflow.value.completedBy || (isRejected.value ? process.value?.handover?.[`${hoKey.value}_rejected_name`] : null), at: workflow.value.completedAt || (isRejected.value ? process.value?.handover?.[`${hoKey.value}_rejected_date`] : null) },
  ]
})

const signerColumns = computed(() => {
  if (isHO1.value) {
    return [
      {
        label: 'Bên giao',
        labelEn: 'Handed over by',
        actor: process.value?.employee_name,
        at: workflow.value.verifiedAt,
        done: workflow.value.verified,
        signature: employeeSignature.value,
        title: process.value?.job_title || 'Employee',
      },
      {
        label: 'Bên nhận',
        labelEn: 'Received by',
        actor: workflow.value.signedBy || workflow.value.authenticatedBy || confirmedBy.value,
        at: workflow.value.signedAt,
        done: !!workflow.value.signed || isConfirmed.value,
        signature: workflow.value.signedSignature || confirmSignature.value,
        title: 'Manager / Director',
      },
    ]
  }
  if (isHO3.value) {
    return [
      {
        label: 'Nhân viên',
        labelEn: 'Interviewee',
        actor: process.value?.employee_name,
        at: workflow.value.verifiedAt,
        done: workflow.value.verified,
        signature: employeeSignature.value,
        title: process.value?.job_title || 'Employee',
      },
      {
        label: 'Người phỏng vấn',
        labelEn: 'Interviewer (HR)',
        actor: workflow.value.signedBy || workflow.value.authenticatedBy || confirmedBy.value,
        at: workflow.value.signedAt,
        done: !!workflow.value.signed || isConfirmed.value,
        signature: workflow.value.signedSignature || confirmSignature.value,
        title: 'HR Staff',
      },
    ]
  }
  // HO-2
  return [
    {
      label: 'Người làm đơn',
      labelEn: 'Requested by',
      actor: process.value?.employee_name,
      at: workflow.value.verifiedAt,
      done: workflow.value.verified,
      signature: employeeSignature.value,
      title: 'Employee',
    },
    {
      label: 'Xác nhận bởi',
      labelEn: 'Verified by',
      actor: workflow.value.signedBy || workflow.value.authenticatedBy || confirmedBy.value,
      at: workflow.value.signedAt,
      done: !!workflow.value.signed || isConfirmed.value,
      signature: workflow.value.signedSignature || confirmSignature.value,
      title: 'HR Staff',
    },
  ]
})

const mergeRows = (defaults, saved) => {
  if (!saved?.length) return defaults
  return defaults.map((row, i) => saved[i] ? { ...row, ...saved[i] } : row)
}

const loadSavedContent = () => {
  const saved = process.value?.handover?.[`${hoKey.value}_content`]
  if (!saved) return
  if (isHO1.value) {
    if (saved.jobRows) jobRows.value = mergeRows(jobRows.value, saved.jobRows)
    if (saved.docRows) docRows.value = mergeRows(docRows.value, saved.docRows)
    if (saved.accessRows) accessRows.value = mergeRows(accessRows.value, saved.accessRows)
  } else if (isHO2.value) {
    const rows = saved.assets || saved.handoverRows
    if (rows) handoverRows.value = mergeRows(handoverRows.value, rows)
  } else if (isHO3.value) {
    if (saved.exitInterview) exitInterview.value = { ...exitInterview.value, ...saved.exitInterview }
    if (saved.interviewDate) interviewDate.value = saved.interviewDate
  }
}

const ensureData = async () => {
  if (!['ho1', 'ho2', 'ho3'].includes(hoKey.value)) {
    await navigateTo(`/offboarding/${route.params.id}`)
    return
  }
  await Promise.all([
    fetchProfile(),
    offboardingStore.fetchProcess(route.params.id),
  ])
  loadSavedContent()
}
onMounted(ensureData)
watch(() => [route.params.id, route.params.ho], ensureData)

const buildContent = () => {
  if (isHO1.value) return { jobRows: jobRows.value, docRows: docRows.value, accessRows: accessRows.value }
  if (isHO2.value) return { assets: handoverRows.value, handoverRows: handoverRows.value }
  return { exitInterview: exitInterview.value, interviewDate: interviewDate.value }
}

const saveContent = async () => {
  const result = await offboardingStore.saveHandoverContent(route.params.id, hoKey.value, buildContent())
  if (!result?.success) {
    toast.error(result?.message || 'Không thể lưu nội dung biên bản')
    return false
  }
  return true
}

const handleConfirm = async () => {
  const saved = await saveContent()
  if (!saved) return
  const result = await offboardingStore.confirmHandover(route.params.id, hoKey.value, notes.value)
  if (result.success) {
    toast.success(`Đã xác nhận ${formCode.value}`)
    await offboardingStore.fetchProcess(route.params.id)
  } else {
    toast.error(result.message || 'Không thể xác nhận biên bản')
  }
}

const handleReject = async () => {
  const result = await offboardingStore.rejectHandover(route.params.id, hoKey.value, rejectReason.value)
  if (result.success) {
    toast.success(`Đã reject ${formCode.value}`)
    await offboardingStore.fetchProcess(route.params.id)
    rejectReason.value = ''
  } else {
    toast.error(result.message || 'Không thể reject biên bản')
  }
}

const markVerified = async () => {
  const saved = await saveContent()
  if (!saved) return
  const result = await offboardingStore.handoverTimelineAction(route.params.id, hoKey.value, 'verify', notes.value)
  if (result.success) toast.success('Nhân viên đã ký biên bản')
  else toast.error(result.message || 'Không thể ký biên bản')
}
const markAuthenticated = async () => {
  const saved = await saveContent()
  if (!saved) return
  const result = await offboardingStore.handoverTimelineAction(route.params.id, hoKey.value, 'authenticate', notes.value)
  if (result.success) toast.success('HR đã xác thực biên bản')
  else toast.error(result.message || 'Không thể xác thực biên bản')
}
const markSigned = async () => {
  const saved = await saveContent()
  if (!saved) return
  const result = await offboardingStore.handoverTimelineAction(route.params.id, hoKey.value, 'sign', notes.value)
  if (result.success) toast.success('Đã ký biên bản')
  else toast.error(result.message || 'Không thể ký biên bản')
}
const markCompleted = async () => {
  const saved = await saveContent()
  if (!saved) return
  const result = await offboardingStore.handoverTimelineAction(route.params.id, hoKey.value, 'complete', notes.value)
  if (result.success) toast.success('Đã complete biên bản')
  else toast.error(result.message || 'Không thể complete biên bản')
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
const formatDateTime = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
