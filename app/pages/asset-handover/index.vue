<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header + Tabs -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-20">
      <div class="px-4 sm:px-6 py-4 space-y-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <i class="bi bi-journal-check text-white text-lg sm:text-xl"></i>
            </div>
            <div>
              <h1 class="text-lg sm:text-2xl font-bold text-gray-900">Trung Tâm Biên Bản Bàn Giao</h1>
              <p class="text-xs text-gray-500 hidden sm:block">Tạo &amp; quản lý 3 loại biên bản: QF-HRA-17, QF-HRA-12, QF-HRA-11</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap border-b border-gray-100 -mb-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-xl border-b-2 transition-colors flex items-center gap-2"
            :class="activeTab === tab.key
              ? 'text-teal-700 border-teal-500 bg-teal-50'
              : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'"
          >
            <i class="bi" :class="tab.icon"></i>
            <span class="hidden sm:inline" v-if="tab.code">{{ tab.code }}</span>{{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-5xl mx-auto">

        <!-- ═══ MINE TAB ═══ -->
        <div v-if="activeTab === 'mine'" class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
            <div class="relative grow min-w-64">
              <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input v-model.trim="searchQuery" type="text" placeholder="Tìm theo mã biên bản, nhân viên..." class="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:border-teal-400 focus:outline-none" />
            </div>
            <select v-model="typeFilter" class="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:border-teal-400 focus:outline-none">
              <option value="ALL">Tất cả loại</option>
              <option value="ho1">QF-HRA-17 · Công việc</option>
              <option value="ho2">QF-HRA-12 · Tài sản</option>
              <option value="ho3">QF-HRA-11 · Phỏng vấn</option>
            </select>
            <select v-model="statusFilter" class="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:border-teal-400 focus:outline-none">
              <option value="ALL">Tất cả trạng thái</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="PENDING_EMPLOYEE_SIGN">Chờ NV ký</option>
              <option value="PENDING_HR_CONFIRM">Chờ HR xác nhận</option>
              <option value="COMPLETED">Hoàn tất</option>
              <option value="REJECTED">Từ chối</option>
            </select>
            <button @click="loadMyList" :disabled="myLoading" class="px-3 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5">
              <i class="bi" :class="myLoading ? 'bi-arrow-repeat animate-spin' : 'bi-arrow-clockwise'"></i>
              Cập nhật
            </button>
          </div>

          <div v-if="myLoading" class="flex items-center justify-center py-16">
            <div class="animate-spin rounded-full h-10 w-10 border-2 border-teal-500 border-t-transparent"></div>
          </div>
          <div v-else-if="filteredMyList.length === 0" class="text-center py-16">
            <i class="bi bi-inbox text-5xl text-gray-200 mb-4 block"></i>
            <p class="text-gray-500 font-medium">Bạn chưa tạo biên bản nào</p>
            <p class="text-xs text-gray-400 mt-1">Chuyển qua các tab khác để tạo biên bản mới</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="item in filteredMyList"
              :key="`${item._type}-${item.id}`"
              class="bg-white border border-gray-200 rounded-2xl p-4 hover:border-teal-300 hover:shadow-sm transition-all cursor-pointer group"
              @click="navigateTo(`/asset-handover/${item.id}?type=${item._type}`)"
            >
              <div class="flex items-start justify-between gap-4 flex-wrap">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0" :class="typeBadgeBg(item._type)">
                    {{ typeShort(item._type) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-gray-900">
                      {{ item.ref_code || `#${item.id}` }}
                      <span class="ml-2 text-xs font-mono text-gray-400">{{ typeCode(item._type) }}</span>
                    </p>
                    <p class="text-xs text-gray-500">{{ typeLabel(item._type) }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ item.employee_name || '—' }} · {{ formatDate(item.created_at) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <span class="px-2.5 py-1 text-[11px] font-bold rounded-full uppercase tracking-wide" :class="statusBadgeClass(item.status)">{{ statusLabel(item.status) }}</span>
                  <i class="bi bi-chevron-right text-gray-300 group-hover:text-teal-400 transition-colors"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ FORM (A4 LAYOUT) ═══ -->
        <div v-else class="max-w-4xl mx-auto">
          <div class="bg-white border border-gray-300 overflow-hidden shadow-sm">

            <!-- Document header: 3 cột -->
            <div class="grid grid-cols-12 border-b border-gray-300 min-h-22">
              <div class="col-span-3 border-r border-gray-300 flex items-center justify-center px-3">
                <div class="text-center leading-tight">
                  <h2 class="font-extrabold text-lg text-gray-900 tracking-tight">Enterprise Meeting</h2>
                  <p class="text-xs text-gray-500">Internal Platform</p>
                </div>
              </div>
              <div class="col-span-6 border-r border-gray-300 flex flex-col items-center justify-center px-3 text-center">
                <p class="text-xs text-gray-500">Enterprise Meeting Co., Ltd.</p>
                <p class="text-base font-bold text-gray-900">{{ activeMeta.title }}</p>
                <p class="text-xs italic text-gray-600">{{ activeMeta.titleEn }}</p>
              </div>
              <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
                <p class="text-xs text-gray-500">ISO Document Code</p>
                <p class="text-xs font-bold text-gray-800">{{ activeMeta.code }}</p>
                <p class="text-xs text-gray-500 mt-1">Mã đơn / Application ref.</p>
                <p class="text-xs font-semibold text-blue-700">{{ pendingRef }}</p>
              </div>
            </div>

            <!-- Thông tin chung -->
            <div class="grid grid-cols-12 text-[13px]">
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Họ và tên</div>
              <div class="col-span-4 border-r border-b border-gray-300 px-2 py-1.5">
                <input v-model="activeForm.employee.employee_name" type="text" class="w-full text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none" placeholder="Họ tên..." />
              </div>
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Mã nhân viên</div>
              <div class="col-span-4 border-b border-gray-300 px-2 py-1.5">
                <input v-model="activeForm.employee.employee_code" type="text" class="w-full text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none" placeholder="Mã NV..." />
              </div>

              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Phòng ban</div>
              <div class="col-span-4 border-r border-b border-gray-300 px-2 py-1.5">
                <input v-model="activeForm.employee.department" type="text" class="w-full text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none" placeholder="Phòng ban..." />
              </div>
              <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Chức danh</div>
              <div class="col-span-4 border-b border-gray-300 px-2 py-1.5">
                <input v-model="activeForm.employee.job_title" type="text" class="w-full text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none" placeholder="Chức danh..." />
              </div>

              <!-- HO-1 / HO-2: Ngày lập + Ngày nghỉ việc -->
              <template v-if="activeTab === 'ho1' || activeTab === 'ho2'">
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày lập biên bản</div>
                <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ currentDateTimeLabel }}</div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày nghỉ việc</div>
                <div class="col-span-4 border-b border-gray-300 px-2 py-1.5">
                  <input v-model="activeForm.employee.last_working_day" type="date" class="w-full text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none" />
                </div>
              </template>

              <!-- HO-3: Ngày lập + Ngày vào làm -->
              <template v-if="activeTab === 'ho3'">
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày lập biên bản</div>
                <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ currentDateTimeLabel }}</div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày vào làm</div>
                <div class="col-span-4 border-b border-gray-300 px-2 py-1.5">
                  <input v-model="ho3.joining_date" type="date" class="w-full text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none" />
                </div>
              </template>
            </div>

            <!-- ════ HO-1: BIÊN BẢN BÀN GIAO CÔNG VIỆC (QF-HRA-17) ════ -->
            <template v-if="activeTab === 'ho1'">
              <!-- Bên giao / Bên nhận / Lý do -->
              <div class="grid grid-cols-12 text-[13px]">
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
                <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 text-gray-900">
                  <p class="font-semibold">{{ ho1.employee.employee_name || '—' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">Chức vụ: {{ ho1.employee.job_title || '—' }}</p>
                </div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
                <div class="col-span-4 border-b border-gray-300 px-3 py-2 text-gray-900">
                  <p class="text-xs text-gray-400 italic">Người ký nhận sẽ hiển thị sau khi phê duyệt</p>
                </div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Lý do bàn giao</div>
                <div class="col-span-10 border-b border-gray-300 px-3 py-2 text-gray-900">
                  <div class="flex flex-wrap gap-x-4 gap-y-1">
                    <label class="flex items-center gap-1"><input type="checkbox" v-model="ho1.reason_resign" class="accent-blue-700 w-3.5 h-3.5"> <span>Nghỉ việc</span></label>
                    <label class="flex items-center gap-1"><input type="checkbox" v-model="ho1.reason_transfer" class="accent-blue-700 w-3.5 h-3.5"> <span>Chuyển công tác / điều động</span></label>
                    <label class="flex items-center gap-1"><input type="checkbox" v-model="ho1.reason_other" class="accent-blue-700 w-3.5 h-3.5"> <span>Lý do khác</span></label>
                  </div>
                </div>
              </div>

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
                    <th class="w-8 border border-blue-600 no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in ho1.jobRows" :key="`job-${idx}`">
                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.content" type="text" class="w-full border-0 bg-transparent text-sm focus:outline-none" placeholder="Nhập nội dung công việc bàn giao..." /></td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.status" type="text" class="w-full border-0 bg-transparent text-sm text-center focus:outline-none" placeholder="Tiến độ / tình trạng..." /></td>
                    <td class="border border-gray-300 px-2 py-2 text-center"><input type="checkbox" v-model="row.receiverConfirmed" class="accent-green-600 w-4 h-4" /></td>
                    <td class="border border-gray-300 px-1 py-2 text-center no-print"><button @click="ho1.jobRows.splice(idx,1)" class="text-gray-400 hover:text-red-500"><i class="bi bi-x-lg text-xs"></i></button></td>
                  </tr>
                </tbody>
              </table>
              <div class="border-t border-gray-300 px-3 py-1.5 bg-gray-50 no-print">
                <button @click="ho1.jobRows.push({content:'',status:'',receiverConfirmed:false})" class="text-xs font-semibold text-blue-700 hover:text-blue-900"><i class="bi bi-plus-lg"></i> Thêm dòng</button>
              </div>

              <div class="border-b border-t border-gray-300 px-3 py-2 bg-gray-50">
                <p class="text-[13px] font-semibold text-gray-700">II. Tài liệu, dữ liệu bàn giao</p>
              </div>
              <table class="w-full border-collapse table-fixed text-xs">
                <thead class="bg-blue-800 text-white">
                  <tr>
                    <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                    <th class="border border-blue-600 px-2 py-2 text-left">TÀI LIỆU / FILE / DỮ LIỆU<div class="text-[10px] font-normal italic">(Ghi rõ đường dẫn nếu là file mềm)</div></th>
                    <th class="w-24 border border-blue-600 px-2 py-2 text-center">Số lượng</th>
                    <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
                    <th class="w-8 border border-blue-600 no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in ho1.docRows" :key="`doc-${idx}`">
                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.content" type="text" class="w-full border-0 bg-transparent text-sm focus:outline-none" placeholder="Tên tài liệu / đường dẫn..." /></td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.quantity" type="text" class="w-full border-0 bg-transparent text-sm text-center focus:outline-none" placeholder="SL" /></td>
                    <td class="border border-gray-300 px-2 py-2 text-center"><input type="checkbox" v-model="row.receiverConfirmed" class="accent-green-600 w-4 h-4" /></td>
                    <td class="border border-gray-300 px-1 py-2 text-center no-print"><button @click="ho1.docRows.splice(idx,1)" class="text-gray-400 hover:text-red-500"><i class="bi bi-x-lg text-xs"></i></button></td>
                  </tr>
                </tbody>
              </table>
              <div class="border-t border-gray-300 px-3 py-1.5 bg-gray-50 no-print">
                <button @click="ho1.docRows.push({content:'',quantity:'',receiverConfirmed:false})" class="text-xs font-semibold text-blue-700 hover:text-blue-900"><i class="bi bi-plus-lg"></i> Thêm dòng</button>
              </div>

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
                    <th class="w-8 border border-blue-600 no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in ho1.accessRows" :key="`acc-${idx}`">
                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.system" type="text" class="w-full border-0 bg-transparent text-sm focus:outline-none" placeholder="VD: Google Workspace, Slack, GitHub..." /></td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.account" type="text" class="w-full border-0 bg-transparent text-sm text-center focus:outline-none" placeholder="account@..." /></td>
                    <td class="border border-gray-300 px-2 py-2 text-center"><input type="checkbox" v-model="row.revoked" class="accent-green-600 w-4 h-4" /></td>
                    <td class="border border-gray-300 px-1 py-2 text-center no-print"><button @click="ho1.accessRows.splice(idx,1)" class="text-gray-400 hover:text-red-500"><i class="bi bi-x-lg text-xs"></i></button></td>
                  </tr>
                </tbody>
              </table>
              <div class="border-t border-gray-300 px-3 py-1.5 bg-gray-50 no-print">
                <button @click="ho1.accessRows.push({system:'',account:'',revoked:false})" class="text-xs font-semibold text-blue-700 hover:text-blue-900"><i class="bi bi-plus-lg"></i> Thêm dòng</button>
              </div>
              <div class="text-xs text-gray-500 px-3 py-2 border-t border-gray-200">
                Ghi chú: Nội dung bàn giao gồm công việc đã hoàn thành, đang thực hiện dở dang, tồn đọng, tài liệu, dữ liệu, tài khoản hệ thống… (Nếu ghi không đủ có thể ghi sang trang khác và đánh số trang)
              </div>
            </template>

            <!-- ════ HO-2: BIÊN BẢN BÀN GIAO TÀI SẢN (QF-HRA-12) ════ -->
            <template v-if="activeTab === 'ho2'">
              <!-- Bên giao / Bên nhận / Lý do -->
              <div class="grid grid-cols-12 text-[13px]">
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
                <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 text-gray-900">
                  <p class="font-semibold">{{ ho2.employee.employee_name || '—' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">Chức vụ: {{ ho2.employee.job_title || '—' }}</p>
                </div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
                <div class="col-span-4 border-b border-gray-300 px-3 py-2 text-gray-900">
                  <p class="text-xs text-gray-400 italic">Người ký nhận sẽ hiển thị sau khi phê duyệt</p>
                </div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Lý do bàn giao</div>
                <div class="col-span-10 border-b border-gray-300 px-3 py-2 text-gray-900">
                  <div class="flex flex-wrap gap-x-4 gap-y-1">
                    <label class="flex items-center gap-1"><input type="checkbox" v-model="ho2.reason_resign" class="accent-blue-700 w-3.5 h-3.5"> <span>Nghỉ việc</span></label>
                    <label class="flex items-center gap-1"><input type="checkbox" v-model="ho2.reason_transfer" class="accent-blue-700 w-3.5 h-3.5"> <span>Chuyển công tác / điều động</span></label>
                    <label class="flex items-center gap-1"><input type="checkbox" v-model="ho2.reason_sick" class="accent-blue-700 w-3.5 h-3.5"> <span>Nghỉ bệnh</span></label>
                    <label class="flex items-center gap-1"><input type="checkbox" v-model="ho2.reason_other" class="accent-blue-700 w-3.5 h-3.5"> <span>Lý do khác</span></label>
                  </div>
                </div>
              </div>

              <div class="border-b border-gray-300 px-3 py-2 bg-gray-50">
                <p class="text-[13px] font-semibold text-gray-700">Danh sách bàn giao tài sản</p>
              </div>
              <table class="w-full border-collapse table-fixed text-xs">
                <thead class="bg-blue-800 text-white">
                  <tr>
                    <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                    <th class="border border-blue-600 px-2 py-2 text-left">TÊN TÀI SẢN / THIẾT BỊ</th>
                    <th class="w-28 border border-blue-600 px-2 py-2 text-center">Mã / Serial</th>
                    <th class="w-24 border border-blue-600 px-2 py-2 text-center">Tình trạng</th>
                    <th class="w-32 border border-blue-600 px-2 py-2 text-left">Ghi chú</th>
                    <th class="w-8 border border-blue-600 no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in ho2.handoverRows" :key="`handover-${idx}`">
                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-500">{{ idx + 1 }}</td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.name" type="text" class="w-full border-0 bg-transparent text-sm focus:outline-none" placeholder="Tên tài sản..." /></td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.serial" type="text" class="w-full border-0 bg-transparent text-sm text-center focus:outline-none font-mono" placeholder="—" /></td>
                    <td class="border border-gray-300 px-1 py-1.5">
                      <select v-model="row.condition" class="w-full border-0 bg-transparent text-xs text-center focus:outline-none cursor-pointer"
                        :class="row.condition === 'GOOD' ? 'text-green-700 font-semibold' : row.condition === 'DAMAGED' ? 'text-amber-700 font-semibold' : 'text-red-700 font-semibold'">
                        <option value="GOOD">Tốt</option>
                        <option value="DAMAGED">Hỏng</option>
                        <option value="LOST">Mất</option>
                      </select>
                    </td>
                    <td class="border border-gray-300 px-2 py-2"><input v-model="row.note" type="text" class="w-full border-0 bg-transparent text-xs focus:outline-none" placeholder="Ghi chú..." /></td>
                    <td class="border border-gray-300 px-1 py-2 text-center no-print"><button @click="ho2.handoverRows.splice(idx,1)" class="text-gray-400 hover:text-red-500"><i class="bi bi-x-lg text-xs"></i></button></td>
                  </tr>
                  <tr v-if="ho2.handoverRows.length === 0">
                    <td colspan="6" class="border border-gray-300 px-3 py-6 text-center text-sm text-gray-400">Chưa có tài sản. Nhấn "Thêm dòng".</td>
                  </tr>
                </tbody>
              </table>
              <div class="border-t border-gray-300 px-3 py-1.5 bg-gray-50 no-print">
                <button @click="ho2.handoverRows.push({name:'',serial:'',condition:'GOOD',note:''})" class="text-xs font-semibold text-blue-700 hover:text-blue-900"><i class="bi bi-plus-lg"></i> Thêm tài sản</button>
              </div>
              <div class="text-xs text-gray-500 px-3 py-2 border-t border-gray-200">
                Ghi chú: Nội dung bàn giao gồm: Công việc đã hoàn thành, đang thực hiện dở dang, tồn đọng, máy móc, thiết bị VP…. (Nếu ghi không đủ có thể ghi sang trang khác và đánh số trang)
              </div>
            </template>

            <!-- ════ HO-3: BIÊN BẢN PHỎNG VẤN NGHỈ VIỆC (QF-HRA-11) ════ -->
            <template v-if="activeTab === 'ho3'">
              <!-- Người phỏng vấn / Ngày phỏng vấn -->
              <div class="grid grid-cols-12 text-[13px]">
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Người phỏng vấn</div>
                <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 text-gray-900">
                  <p class="text-xs text-gray-400 italic">HR Staff sẽ hiển thị sau khi phê duyệt</p>
                </div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày phỏng vấn</div>
                <div class="col-span-4 border-b border-gray-300 px-2 py-1.5">
                  <input v-model="ho3.interview_date" type="date" class="w-full text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none" />
                </div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Loại hợp đồng</div>
                <div class="col-span-4 border-b border-gray-300 px-2 py-1.5">
                  <input v-model="ho3.contract_type" type="text" class="w-full text-sm font-semibold text-gray-900 border-0 bg-transparent focus:outline-none" placeholder="HĐ chính thức / thử việc..." />
                </div>
              </div>

              <!-- I. Lý do nghỉ việc -->
              <div class="border-b border-t border-gray-300 px-3 py-2 bg-gray-50">
                <p class="text-[13px] font-semibold text-gray-700">I. Lý do nghỉ việc <span class="text-[11px] font-normal italic text-gray-500">(Reason for leaving)</span></p>
              </div>
              <div class="px-3 py-3 border-b border-gray-300 text-[13px]">
                <div class="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                  <label class="flex items-start gap-2">
                    <input type="checkbox" v-model="ho3.reason_personal" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                    <span>Lý do cá nhân (Personal reason)</span>
                  </label>
                  <label class="flex items-start gap-2">
                    <input type="checkbox" v-model="ho3.reason_salary" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                    <span>Thu nhập / Lương thưởng (Compensation)</span>
                  </label>
                  <label class="flex items-start gap-2">
                    <input type="checkbox" v-model="ho3.reason_career" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                    <span>Cơ hội phát triển nghề nghiệp (Career growth)</span>
                  </label>
                  <label class="flex items-start gap-2">
                    <input type="checkbox" v-model="ho3.reason_management" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                    <span>Phong cách quản lý (Management style)</span>
                  </label>
                  <label class="flex items-start gap-2">
                    <input type="checkbox" v-model="ho3.reason_worklife" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                    <span>Cân bằng công việc - cuộc sống (Work-life balance)</span>
                  </label>
                  <label class="flex items-start gap-2">
                    <input type="checkbox" v-model="ho3.reason_environment" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                    <span>Môi trường / văn hóa làm việc (Work environment)</span>
                  </label>
                  <label class="flex items-start gap-2 col-span-2">
                    <input type="checkbox" v-model="ho3.reason_other" class="accent-blue-700 w-3.5 h-3.5 mt-0.5">
                    <span class="flex-1">Lý do khác: <input v-model="ho3.reason_other_text" type="text" class="border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent ml-1 flex-1 text-xs" placeholder="Ghi rõ..." /></span>
                  </label>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-600 block mb-1">Mô tả chi tiết lý do nghỉ việc:</label>
                  <textarea v-model="ho3.reason_detail" rows="3" class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-blue-500 focus:outline-none resize-none" placeholder="Nhân viên mô tả chi tiết lý do nghỉ việc..." />
                </div>
              </div>

              <!-- II. Đánh giá môi trường -->
              <div class="border-b border-gray-300 px-3 py-2 bg-gray-50">
                <p class="text-[13px] font-semibold text-gray-700">II. Đánh giá môi trường &amp; điều kiện làm việc <span class="text-[11px] font-normal italic text-gray-500">(Work environment assessment)</span></p>
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
                      <td v-for="val in ['very_good','good','normal','poor']" :key="val" class="border border-gray-300 px-2 py-1.5 text-center">
                        <input type="radio" :name="`assess-${idx}`" :value="val" v-model="ho3.assessment[idx]" class="accent-blue-600" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- III. Ý kiến đề xuất -->
              <div class="border-b border-gray-300 px-3 py-2 bg-gray-50">
                <p class="text-[13px] font-semibold text-gray-700">III. Ý kiến đề xuất cải tiến <span class="text-[11px] font-normal italic text-gray-500">(Suggestions for improvement)</span></p>
              </div>
              <div class="px-3 py-3 border-b border-gray-300 space-y-3 text-[13px]">
                <div>
                  <label class="text-xs font-semibold text-gray-600 block mb-1">Điều bạn thích nhất khi làm việc tại công ty:</label>
                  <textarea v-model="ho3.liked_most" rows="2" class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-blue-500 focus:outline-none resize-none" placeholder="Chia sẻ điều bạn đánh giá cao..." />
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-600 block mb-1">Điều bạn nghĩ công ty cần cải thiện:</label>
                  <textarea v-model="ho3.improvement" rows="2" class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-blue-500 focus:outline-none resize-none" placeholder="Góp ý để công ty phát triển tốt hơn..." />
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-600 block mb-1">Bạn có muốn quay lại công ty trong tương lai không?</label>
                  <div class="flex gap-6 mt-1">
                    <label class="flex items-center gap-1.5"><input type="radio" name="return_intent" value="yes" v-model="ho3.return_intent" class="accent-blue-600"> Có (Yes)</label>
                    <label class="flex items-center gap-1.5"><input type="radio" name="return_intent" value="maybe" v-model="ho3.return_intent" class="accent-blue-600"> Có thể (Maybe)</label>
                    <label class="flex items-center gap-1.5"><input type="radio" name="return_intent" value="no" v-model="ho3.return_intent" class="accent-blue-600"> Không (No)</label>
                  </div>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-600 block mb-1">Nhận xét / Ghi chú thêm của HR sau phỏng vấn:</label>
                  <textarea v-model="ho3.hr_note" rows="2" class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-blue-500 focus:outline-none resize-none" placeholder="HR ghi chú sau buổi phỏng vấn..." />
                </div>
              </div>
            </template>

            <!-- ════ SIGNATURE MATRIX (dynamic theo HO type) ════ -->
            <div class="bg-white border-t border-gray-300 overflow-x-auto">
              <table class="w-full min-w-140 border-collapse table-fixed text-xs">
                <thead class="bg-blue-800 text-white">
                  <tr>
                    <th class="w-26 border border-blue-600 px-2 py-2"></th>
                    <th v-for="col in signerColumns" :key="col.labelEn" class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">
                      {{ col.label }}<br><span class="text-xs italic font-normal">{{ col.labelEn }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="text-gray-800">
                  <tr>
                    <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chữ ký /<br><span class="italic font-normal">Signature</span></td>
                    <td v-for="col in signerColumns" :key="`sig-${col.labelEn}`" class="border border-gray-300 p-4 text-center text-gray-400 text-[11px]">— Sẽ ký sau khi tạo —</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Họ và tên /<br><span class="italic font-normal">Name</span></td>
                    <td v-for="col in signerColumns" :key="`name-${col.labelEn}`" class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ col.actor || '—' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chức danh /<br><span class="italic font-normal">Position</span></td>
                    <td v-for="col in signerColumns" :key="`pos-${col.labelEn}`" class="border border-gray-300 px-2 py-2 text-center">{{ col.title || '—' }}</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Ngày /<br><span class="italic font-normal">Date</span></td>
                    <td v-for="col in signerColumns" :key="`date-${col.labelEn}`" class="border border-gray-300 px-2 py-2 text-center">{{ col.date || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Submit -->
          <div class="flex justify-end gap-3 pt-4 pb-6 no-print">
            <button
              @click="submit"
              :disabled="!isFormValid || isSubmitting"
              class="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-md"
              :class="isFormValid && !isSubmitting
                ? 'bg-blue-700 hover:bg-blue-800 shadow-blue-500/25'
                : 'bg-gray-300 cursor-not-allowed shadow-none'"
            >
              <i v-if="isSubmitting" class="bi bi-arrow-repeat animate-spin"></i>
              <i v-else class="bi bi-check2-all"></i>
              {{ isSubmitting ? 'Đang tạo...' : 'Tạo biên bản' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'asset-handover'] })

const auth = useAuthStore()
const toast = useToast()
const route = useRoute()
const { profileData, profileLoading, fetchProfile } = useUserProfile()

const assetStore = useAssetHandoverStore()
const jobStore = useJobHandoverStore()
const exitStore = useExitInterviewStore()

const tabs = [
  { key: 'mine', code: '',          label: 'Biên bản của tôi',       icon: 'bi-person-lines-fill' },
  { key: 'ho1',  code: 'QF-HRA-17', label: 'BB BÀN GIAO CÔNG VIỆC',  icon: 'bi-clipboard-check' },
  { key: 'ho2',  code: 'QF-HRA-12', label: 'BB BÀN GIAO TÀI SẢN',    icon: 'bi-box-seam' },
  { key: 'ho3',  code: 'QF-HRA-11', label: 'BB PHỎNG VẤN NGHỈ VIỆC', icon: 'bi-chat-square-text' },
]
const activeTab = ref(['mine', 'ho1', 'ho2', 'ho3'].includes(route.query.tab) ? route.query.tab : 'mine')

const portalUserId = computed(() => String(auth.user?.portal_user_id ?? auth.user?.id ?? '').trim())

// ═══ MINE TAB ═══
const searchQuery = ref('')
const typeFilter = ref('ALL')
const statusFilter = ref('ALL')
const myLoading = ref(false)
const myList = ref([])

const loadMyList = async () => {
  if (!portalUserId.value) return
  myLoading.value = true
  try {
    const params = { created_by: portalUserId.value }
    await Promise.all([
      assetStore.fetchList(params).catch(() => {}),
      jobStore.fetchList(params).catch(() => {}),
      exitStore.fetchList(params).catch(() => {}),
    ])
    const a = (assetStore.list || []).map(i => ({ ...i, _type: 'ho2' }))
    const b = (jobStore.list || []).map(i => ({ ...i, _type: 'ho1' }))
    const c = (exitStore.list || []).map(i => ({ ...i, _type: 'ho3' }))
    const combined = [...a, ...b, ...c]
    combined.sort((x, y) => new Date(y.created_at ?? 0) - new Date(x.created_at ?? 0))
    myList.value = combined
  } finally {
    myLoading.value = false
  }
}

const filteredMyList = computed(() => {
  const kw = searchQuery.value.toLowerCase()
  return myList.value.filter(i => {
    if (typeFilter.value !== 'ALL' && i._type !== typeFilter.value) return false
    if (statusFilter.value !== 'ALL' && i.status !== statusFilter.value) return false
    if (!kw) return true
    return [i.ref_code, i.employee_name, i.employee_code].some(v => String(v ?? '').toLowerCase().includes(kw))
  })
})

// ═══ AUTOFILL ═══
const buildEmployee = () => {
  const u = auth.user || {}
  const p = profileData.value || {}
  return {
    employee_name: p.full_name ?? p.name ?? u.full_name ?? u.name ?? u.email ?? '',
    employee_code: p.employee_code ?? p.e_code ?? u.employee_code ?? u.e_code ?? u.hr_code ?? '',
    employee_id:   String(u.portal_user_id ?? u.id ?? p.id ?? ''),
    department:    p.department ?? p.dept_code ?? u.department ?? u.dept_code ?? '',
    job_title:     p.title ?? p.job_title ?? u.title ?? u.job_title ?? '',
    email:         p.email ?? u.email ?? '',
  }
}

// ═══ HO-1 ═══
const ho1 = reactive({
  employee: buildEmployee(),
  reason_resign: false,
  reason_transfer: false,
  reason_other: false,
  jobRows: Array.from({ length: 10 }, () => ({ content: '', status: '', receiverConfirmed: false })),
  docRows: Array.from({ length: 10 }, () => ({ content: '', quantity: '', receiverConfirmed: false })),
  accessRows: Array.from({ length: 5 }, () => ({ system: '', account: '', revoked: false })),
})

// ═══ HO-2 ═══
const ho2 = reactive({
  employee: buildEmployee(),
  reason_resign: false,
  reason_transfer: false,
  reason_sick: false,
  reason_other: false,
  handoverRows: Array.from({ length: 10 }, () => ({ name: '', serial: '', condition: 'GOOD', note: '' })),
})

// ═══ HO-3 ═══
const assessmentItems = [
  { label: 'Môi trường làm việc (Work environment)' },
  { label: 'Chính sách lương thưởng (Compensation & Benefits)' },
  { label: 'Phong cách quản lý (Management style)' },
  { label: 'Cơ hội đào tạo & phát triển (Training & Development)' },
  { label: 'Văn hóa công ty (Company culture)' },
  { label: 'Điều kiện làm việc / cơ sở vật chất (Working conditions)' },
  { label: 'Sự cân bằng công việc - cuộc sống (Work-life balance)' },
]
const assessmentOptions = [
  { value: 'very_good', label: 'Rất tốt' },
  { value: 'good',      label: 'Tốt' },
  { value: 'normal',    label: 'Bình thường' },
  { value: 'poor',      label: 'Kém' },
]
const returnOptions = [
  { value: 'yes',   label: 'Có' },
  { value: 'maybe', label: 'Có thể' },
  { value: 'no',    label: 'Không' },
]
const ho3 = reactive({
  employee: buildEmployee(),
  interview_date: new Date().toISOString().slice(0, 10),
  interviewer_name: '',
  joining_date: '',
  contract_type: '',
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

// ═══ PENDING REF & DATE ═══
const pendingRef = computed(() => {
  const year = new Date().getFullYear()
  const rand = String(Math.floor(Math.random() * 90000) + 10000)
  return `HRM-AH-${year}-${rand}`
})

const currentDateTimeLabel = computed(() => {
  const d = new Date()
  const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
})

// ═══ ACTIVE FORM RESOLVER ═══
const FORM_META = {
  ho1: { code: 'QF-HRA-17', title: 'BIÊN BẢN BÀN GIAO CÔNG VIỆC',  titleEn: 'JOB HANDOVER FORM' },
  ho2: { code: 'QF-HRA-12', title: 'BIÊN BẢN BÀN GIAO TÀI SẢN',    titleEn: 'ASSET HANDOVER FORM' },
  ho3: { code: 'QF-HRA-11', title: 'BIÊN BẢN PHỎNG VẤN NGHỈ VIỆC', titleEn: 'EXIT INTERVIEW FORM' },
}
const activeMeta = computed(() => FORM_META[activeTab.value] ?? { code: '', title: '', titleEn: '' })
const activeForm = computed(() => {
  if (activeTab.value === 'ho1') return ho1
  if (activeTab.value === 'ho2') return ho2
  if (activeTab.value === 'ho3') return ho3
  return { employee: {} }
})

const ho1Valid = computed(() =>
  ho1.employee.employee_name?.trim() && ho1.jobRows.some(r => r.content?.trim())
)
const ho2Valid = computed(() =>
  ho2.employee.employee_name?.trim() && ho2.handoverRows.some(r => r.name?.trim())
)
const ho3Valid = computed(() =>
  ho3.employee.employee_name?.trim() && !!ho3.interview_date &&
  [ho3.reason_personal, ho3.reason_salary, ho3.reason_career, ho3.reason_management, ho3.reason_worklife, ho3.reason_environment, ho3.reason_other].some(v => v)
)

const signerColumns = computed(() => {
  const emp = activeForm.value.employee
  if (activeTab.value === 'ho1') {
    return [
      { label: 'Bên giao', labelEn: 'Handed over by', actor: emp.employee_name, title: emp.job_title || 'Employee', done: false, signature: null, at: null },
      { label: 'Bên nhận', labelEn: 'Received by', actor: null, title: 'Manager / Director', done: false, signature: null, at: null },
    ]
  }
  if (activeTab.value === 'ho3') {
    return [
      { label: 'Nhân viên', labelEn: 'Interviewee', actor: emp.employee_name, title: emp.job_title || 'Employee', done: false, signature: null, at: null },
      { label: 'Người phỏng vấn', labelEn: 'Interviewer (HR)', actor: ho3.interviewer_name || null, title: 'HR Staff', done: false, signature: null, at: null },
    ]
  }
  // HO-2
  return [
    { label: 'Người làm đơn', labelEn: 'Requested by', actor: emp.employee_name, title: 'Employee', done: false, signature: null, at: null },
    { label: 'Xác nhận bởi', labelEn: 'Verified by', actor: null, title: 'HR Staff', done: false, signature: null, at: null },
  ]
})

const timelineSteps = computed(() => {
  if (activeTab.value === 'ho1') {
    return [
      { key: 'employee-sign', label: 'Bên giao ký', done: false },
      { key: 'authenticate',  label: 'Line Manager xác thực', done: false },
      { key: 'sign',          label: 'Manager/Director ký', done: false },
      { key: 'complete',      label: 'Complete/Reject', done: false },
    ]
  }
  if (activeTab.value === 'ho3') {
    return [
      { key: 'employee-sign', label: 'Nhân viên ký', done: false },
      { key: 'authenticate',  label: 'HR xác thực', done: false },
      { key: 'sign',          label: 'HR Ký', done: false },
      { key: 'complete',      label: 'Complete/Reject', done: false },
    ]
  }
  return [
    { key: 'employee-sign', label: 'Người làm đơn ký', done: false },
    { key: 'verify',        label: 'HR Xác thực', done: false },
    { key: 'sign',          label: 'HR Ký', done: false },
    { key: 'complete',      label: 'Complete/Reject', done: false },
  ]
})
const isFormValid = computed(() => {
  if (activeTab.value === 'ho1') return ho1Valid.value
  if (activeTab.value === 'ho2') return ho2Valid.value
  if (activeTab.value === 'ho3') return ho3Valid.value
  return false
})
const isSubmitting = computed(() =>
  jobStore.submitting || assetStore.submitting || exitStore.submitting
)

const submit = async () => {
  if (!isFormValid.value) return
  if (activeTab.value === 'ho1') {
    const payload = {
      ...ho1.employee,
      created_by: portalUserId.value,
      reason_resign: ho1.reason_resign,
      reason_transfer: ho1.reason_transfer,
      reason_other: ho1.reason_other,
      content: {
        jobRows: ho1.jobRows.filter(r => r.content?.trim()),
        docRows: ho1.docRows.filter(r => r.content?.trim()),
        accessRows: ho1.accessRows.filter(r => r.system?.trim()),
      },
    }
    const res = await jobStore.create(payload)
    if (res.success) {
      toast.success('Đã tạo biên bản bàn giao công việc')
      navigateTo(`/asset-handover/${res.data.id}?type=ho1`)
    } else toast.error(res.message || 'Không thể tạo biên bản')
  } else if (activeTab.value === 'ho2') {
    const payload = {
      ...ho2.employee,
      created_by: portalUserId.value,
      handover_date: new Date().toISOString().slice(0, 10),
      assets: ho2.handoverRows.filter(r => r.name?.trim()).map(r => ({
        name: r.name.trim(),
        serial: r.serial || null,
        condition: r.condition || 'GOOD',
        note: r.note || null,
      })),
    }
    const res = await assetStore.create(payload)
    if (res.success) {
      toast.success('Đã tạo biên bản bàn giao tài sản')
      navigateTo(`/asset-handover/${res.data.id}?type=ho2`)
    } else toast.error(res.message || 'Không thể tạo biên bản')
  } else if (activeTab.value === 'ho3') {
    const payload = {
      ...ho3.employee,
      created_by: portalUserId.value,
      interview_date: ho3.interview_date,
      interviewer_name: ho3.interviewer_name,
      joining_date: ho3.joining_date,
      contract_type: ho3.contract_type,
      content: {
        reason_personal: ho3.reason_personal,
        reason_salary: ho3.reason_salary,
        reason_career: ho3.reason_career,
        reason_management: ho3.reason_management,
        reason_worklife: ho3.reason_worklife,
        reason_environment: ho3.reason_environment,
        reason_other: ho3.reason_other,
        reason_other_text: ho3.reason_other_text,
        reason_detail: ho3.reason_detail,
        assessment: ho3.assessment,
        liked_most: ho3.liked_most,
        improvement: ho3.improvement,
        return_intent: ho3.return_intent,
        hr_note: ho3.hr_note,
      },
    }
    const res = await exitStore.create(payload)
    if (res.success) {
      toast.success('Đã tạo biên bản phỏng vấn nghỉ việc')
      navigateTo(`/asset-handover/${res.data.id}?type=ho3`)
    } else toast.error(res.message || 'Không thể tạo biên bản')
  }
}

// ═══ HELPERS ═══
const STATUS_LABEL = {
  DRAFT: 'Bản nháp',
  PENDING_EMPLOYEE_SIGN: 'Chờ NV ký',
  PENDING_HR_CONFIRM: 'Chờ HR xác nhận',
  COMPLETED: 'Hoàn tất',
  REJECTED: 'Từ chối',
}
const statusLabel = (s) => STATUS_LABEL[s] ?? s
const statusBadgeClass = (s) => ({
  DRAFT: 'bg-gray-100 text-gray-600',
  PENDING_EMPLOYEE_SIGN: 'bg-amber-100 text-amber-700',
  PENDING_HR_CONFIRM: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}[s] ?? 'bg-gray-100 text-gray-600')

const TYPE_META = {
  ho1: { code: 'QF-HRA-17', label: 'Bàn giao công việc',   short: 'CV', bg: 'bg-linear-to-br from-violet-500 to-fuchsia-500' },
  ho2: { code: 'QF-HRA-12', label: 'Bàn giao tài sản',     short: 'TS', bg: 'bg-linear-to-br from-teal-500 to-cyan-500' },
  ho3: { code: 'QF-HRA-11', label: 'Phỏng vấn nghỉ việc',  short: 'PV', bg: 'bg-linear-to-br from-amber-500 to-orange-500' },
}
const typeCode = (t) => TYPE_META[t]?.code ?? ''
const typeLabel = (t) => TYPE_META[t]?.label ?? ''
const typeShort = (t) => TYPE_META[t]?.short ?? ''
const typeBadgeBg = (t) => TYPE_META[t]?.bg ?? 'bg-gray-400'

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(async () => {
  await fetchProfile()
  Object.assign(ho1.employee, buildEmployee())
  Object.assign(ho2.employee, buildEmployee())
  Object.assign(ho3.employee, buildEmployee())
  await loadMyList()
})
</script>

<style>
@media print {
  .no-print { display: none !important; }
}
</style>
