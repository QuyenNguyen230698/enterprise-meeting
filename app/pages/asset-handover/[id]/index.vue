<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- ═══ HEADER ═══ -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-20">
      <div class="px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3">
          <NuxtLink to="/asset-handover" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <i class="bi bi-arrow-left text-gray-600"></i>
          </NuxtLink>
          <div class="w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shrink-0" :class="typeBg">
            <i class="text-white text-lg" :class="typeIcon"></i>
          </div>
          <div>
            <h1 class="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              {{ handover?.ref_code || 'Biên Bản Bàn Giao' }}
              <span v-if="handover" class="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase" :class="statusBadgeClass(handover.status)">
                {{ statusLabel(handover.status) }}
              </span>
            </h1>
            <p class="text-xs text-gray-500">{{ handover?.employee_name }} · {{ typeCode }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="handover?.status === 'COMPLETED'" @click="openPrintView"
            class="px-3 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-1">
            <i class="bi bi-printer"></i><span class="hidden sm:inline">Xem & In</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading && !handover" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-teal-500 border-t-transparent"></div>
    </div>
    <div v-else-if="!handover" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <i class="bi bi-file-earmark-x text-4xl text-gray-300 mb-3 block"></i>
        <p class="text-gray-500 font-medium">Không tìm thấy biên bản</p>
        <NuxtLink to="/asset-handover" class="text-sm text-teal-500 underline mt-2 inline-block">Quay lại danh sách</NuxtLink>
      </div>
    </div>

    <!-- ═══ MAIN CONTENT ═══ -->
    <div v-else class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-6xl mx-auto space-y-5">

        <!-- ── APPROVAL TIMELINE ── -->
        <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide" :class="statusBadgeClass(handover.status)">
                {{ statusLabel(handover.status) }}
              </span>
              <span class="text-xs text-gray-400">{{ completedSteps }}/{{ STEPS.length }} bước hoàn tất</span>
            </div>
            <span class="text-xs text-gray-400"><i class="bi bi-calendar3 mr-1"></i>{{ formatDate(handover.created_at) }}</span>
          </div>
          <div class="mb-6">
            <div class="w-full bg-gray-100 rounded-full h-1.5">
              <div class="h-1.5 rounded-full transition-all duration-500"
                :class="handover.status === 'REJECTED' ? 'bg-red-400' : 'bg-linear-to-r from-teal-400 to-cyan-500'"
                :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="text-right text-xs text-gray-400 mt-1">{{ progressPercent }}%</div>
          </div>
          <div class="flex items-start justify-between gap-2 overflow-x-auto pb-2">
            <div v-for="(step, index) in timelineSteps" :key="step.key" class="flex flex-col items-center flex-1 min-w-20">
              <div class="flex items-center w-full">
                <div v-if="index > 0" class="flex-1 h-0.5 transition-colors" :class="lineClass(index)"></div>
                <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all" :class="circleClass(step.status)">
                  <i v-if="step.status === 'done'" class="bi bi-check-lg text-white text-sm"></i>
                  <i v-else-if="step.status === 'rejected'" class="bi bi-x-lg text-white text-sm"></i>
                  <i v-else-if="step.status === 'active'" :class="step.icon + ' text-white text-sm'"></i>
                  <span v-else class="text-gray-400 text-xs font-semibold">{{ index + 1 }}</span>
                </div>
                <div v-if="index < timelineSteps.length - 1" class="flex-1 h-0.5 transition-colors" :class="lineClass(index + 1)"></div>
              </div>
              <div class="mt-2 text-center">
                <p class="text-[11px] font-semibold" :class="stepLabelClass(step.status)">{{ step.label }}</p>
                <span v-if="step.badge" class="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full" :class="step.badgeClass">{{ step.badge }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Offboarding link -->
        <div v-if="handover.offboarding_id" class="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl">
          <i class="bi bi-link-45deg text-teal-500 shrink-0"></i>
          <p class="text-xs font-semibold text-teal-800 flex-1">Liên kết offboarding: <span class="font-mono">{{ handover.offboarding_ref || handover.offboarding_id }}</span></p>
          <NuxtLink :to="`/offboarding/${handover.offboarding_id}/handover`" class="shrink-0 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-white border border-teal-200 hover:bg-teal-50 rounded-lg transition-colors">Xem Offboarding</NuxtLink>
        </div>

        <!-- ── 2-COLUMN LAYOUT: Biên bản (trái) + Thao tác (phải) ── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <!-- ════ LEFT: BIÊN BẢN A4 LAYOUT ════ -->
          <div class="lg:col-span-2">
            <div class="bg-white border border-gray-300 overflow-hidden shadow-sm">

              <!-- Document header 3 cột -->
              <div class="grid grid-cols-12 border-b border-gray-300 min-h-[5.5rem]">
                <div class="col-span-3 border-r border-gray-300 flex items-center justify-center px-3">
                  <div class="text-center leading-tight">
                    <h2 class="font-extrabold text-base text-gray-900 tracking-tight">Enterprise Meeting</h2>
                    <p class="text-xs text-gray-500">Internal Platform</p>
                  </div>
                </div>
                <div class="col-span-6 border-r border-gray-300 flex flex-col items-center justify-center px-3 text-center py-2">
                  <p class="text-xs text-gray-500">Enterprise Meeting Co., Ltd.</p>
                  <p class="text-sm font-bold text-gray-900">{{ typeMeta.title }}</p>
                  <p class="text-xs italic text-gray-600">{{ typeMeta.titleEn }}</p>
                </div>
                <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
                  <p class="text-xs text-gray-500">ISO Document Code</p>
                  <p class="text-xs font-bold text-gray-800">{{ typeCode }}</p>
                  <p class="text-xs text-gray-500 mt-1">Mã đơn / Ref.</p>
                  <p class="text-xs font-semibold text-blue-700">{{ handover.ref_code }}</p>
                </div>
              </div>

              <!-- Thông tin chung -->
              <div class="grid grid-cols-12 text-[13px]">
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Họ và tên</div>
                <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover.employee_name || '—' }}</div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Mã nhân viên</div>
                <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover.employee_code || '—' }}</div>

                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Phòng ban</div>
                <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover.department || '—' }}</div>
                <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Chức danh</div>
                <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ handover.job_title || '—' }}</div>

                <!-- HO-1 / HO-2 -->
                <template v-if="formType !== 'ho3'">
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày lập</div>
                  <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(handover.created_date || handover.created_at) }}</div>
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">{{ formType === 'ho1' ? 'Ngày nghỉ việc' : 'Ngày bàn giao' }}</div>
                  <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(handover.last_working_day || handover.handover_date) || '—' }}</div>
                </template>
                <!-- HO-3 -->
                <template v-else>
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày lập</div>
                  <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(handover.created_date || handover.created_at) }}</div>
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ngày phỏng vấn</div>
                  <div class="col-span-4 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">{{ formatDate(handover.interview_date) || '—' }}</div>
                </template>
              </div>

              <!-- ══ HO-1 ══ -->
              <template v-if="formType === 'ho1'">
                <!-- Bên giao / Bên nhận / Lý do -->
                <div class="grid grid-cols-12 text-[13px]">
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
                  <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
                    <p class="font-semibold text-gray-900">{{ handover.employee_name || '—' }}</p>
                    <p class="text-xs text-gray-500">Chức vụ: {{ handover.job_title || '—' }}</p>
                  </div>
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
                  <div class="col-span-4 border-b border-gray-300 px-3 py-2">
                    <p v-if="handover.hr_signer_name" class="font-semibold text-gray-900">{{ handover.hr_signer_name }}</p>
                    <p v-else class="text-xs text-gray-400 italic">Sẽ hiển thị sau khi hoàn tất</p>
                  </div>
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Lý do</div>
                  <div class="col-span-10 border-b border-gray-300 px-3 py-2 text-[13px]">
                    <div class="flex flex-wrap gap-x-5 gap-y-1">
                      <label class="flex items-center gap-1.5 cursor-default">
                        <input type="checkbox" :checked="handover.reason_resign === 'true'" disabled class="accent-blue-700 w-3.5 h-3.5" />
                        <span :class="handover.reason_resign === 'true' ? 'font-semibold text-blue-800' : 'text-gray-400'">Nghỉ việc</span>
                      </label>
                      <label class="flex items-center gap-1.5 cursor-default">
                        <input type="checkbox" :checked="handover.reason_transfer === 'true'" disabled class="accent-blue-700 w-3.5 h-3.5" />
                        <span :class="handover.reason_transfer === 'true' ? 'font-semibold text-blue-800' : 'text-gray-400'">Chuyển công tác / điều động</span>
                      </label>
                      <label class="flex items-center gap-1.5 cursor-default">
                        <input type="checkbox" :checked="handover.reason_other === 'true'" disabled class="accent-blue-700 w-3.5 h-3.5" />
                        <span :class="handover.reason_other === 'true' ? 'font-semibold text-blue-800' : 'text-gray-400'">Lý do khác</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- I. Công việc -->
                <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
                  <p class="text-[13px] font-semibold text-gray-700">I. Danh sách bàn giao công việc</p>
                </div>
                <table class="w-full border-collapse table-fixed text-xs">
                  <thead class="bg-blue-800 text-white">
                    <tr>
                      <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                      <th class="border border-blue-600 px-2 py-2 text-left">NỘI DUNG CÔNG VIỆC BÀN GIAO<div class="text-[10px] font-normal italic">(Công việc đang thực hiện, tồn đọng, đường dẫn file nếu có)</div></th>
                      <th class="w-28 border border-blue-600 px-2 py-2 text-center">Tiến độ / Tình trạng</th>
                      <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in localContent.jobRows" :key="`job-${idx}`" class="hover:bg-blue-50/30">
                      <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-gray-800">{{ row.content }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-center text-gray-600">{{ row.status }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-center">
                        <input type="checkbox" v-model="row.receiverConfirmed"
                          :disabled="!canToggleCheckbox"
                          class="w-4 h-4"
                          :class="canToggleCheckbox ? 'accent-green-600 cursor-pointer' : 'accent-green-600 cursor-not-allowed opacity-70'" />
                      </td>
                    </tr>
                    <tr v-if="!localContent.jobRows?.length">
                      <td colspan="4" class="border border-gray-300 px-3 py-4 text-center text-xs text-gray-400">Chưa có dữ liệu</td>
                    </tr>
                  </tbody>
                </table>

                <!-- II. Tài liệu -->
                <div class="border-y border-gray-300 px-3 py-1.5 bg-gray-50">
                  <p class="text-[13px] font-semibold text-gray-700">II. Tài liệu, dữ liệu bàn giao</p>
                </div>
                <table class="w-full border-collapse table-fixed text-xs">
                  <thead class="bg-blue-800 text-white">
                    <tr>
                      <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                      <th class="border border-blue-600 px-2 py-2 text-left">TÀI LIỆU / FILE / DỮ LIỆU<div class="text-[10px] font-normal italic">(Ghi rõ đường dẫn nếu là file mềm)</div></th>
                      <th class="w-24 border border-blue-600 px-2 py-2 text-center">Số lượng</th>
                      <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in localContent.docRows" :key="`doc-${idx}`" class="hover:bg-blue-50/30">
                      <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-gray-800 break-all">{{ row.content }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-center text-gray-600">{{ row.quantity }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-center">
                        <input type="checkbox" v-model="row.receiverConfirmed"
                          :disabled="!canToggleCheckbox"
                          class="w-4 h-4"
                          :class="canToggleCheckbox ? 'accent-green-600 cursor-pointer' : 'accent-green-600 cursor-not-allowed opacity-70'" />
                      </td>
                    </tr>
                    <tr v-if="!localContent.docRows?.length">
                      <td colspan="4" class="border border-gray-300 px-3 py-4 text-center text-xs text-gray-400">Chưa có dữ liệu</td>
                    </tr>
                  </tbody>
                </table>

                <!-- III. Tài khoản -->
                <div class="border-y border-gray-300 px-3 py-1.5 bg-gray-50">
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
                    <tr v-for="(row, idx) in localContent.accessRows" :key="`acc-${idx}`" class="hover:bg-blue-50/30">
                      <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-gray-800">{{ row.system }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-center text-gray-600">{{ row.account }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-center">
                        <input type="checkbox" v-model="row.revoked"
                          :disabled="!canToggleCheckbox"
                          class="w-4 h-4"
                          :class="canToggleCheckbox ? 'accent-green-600 cursor-pointer' : 'accent-green-600 cursor-not-allowed opacity-70'" />
                      </td>
                    </tr>
                    <tr v-if="!localContent.accessRows?.length">
                      <td colspan="4" class="border border-gray-300 px-3 py-4 text-center text-xs text-gray-400">Chưa có dữ liệu</td>
                    </tr>
                  </tbody>
                </table>
                <div class="text-xs text-gray-400 px-3 py-2 border-t border-gray-200">
                  Ghi chú: Nội dung bàn giao gồm công việc đã hoàn thành, đang thực hiện dở dang, tồn đọng, tài liệu, dữ liệu, tài khoản hệ thống…
                </div>
              </template>

              <!-- ══ HO-2 ══ -->
              <template v-else-if="formType === 'ho2'">
                <!-- Bên giao / Bên nhận -->
                <div class="grid grid-cols-12 text-[13px]">
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên giao</div>
                  <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
                    <p class="font-semibold text-gray-900">{{ handover.employee_name || '—' }}</p>
                    <p class="text-xs text-gray-500">Chức vụ: {{ handover.job_title || '—' }}</p>
                  </div>
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Bên nhận</div>
                  <div class="col-span-4 border-b border-gray-300 px-3 py-2">
                    <p v-if="handover.hr_signer_name" class="font-semibold text-gray-900">{{ handover.hr_signer_name }}</p>
                    <p v-else class="text-xs text-gray-400 italic">Sẽ hiển thị sau khi hoàn tất</p>
                  </div>
                  <div v-if="handover.general_note" class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Ghi chú</div>
                  <div v-if="handover.general_note" class="col-span-10 border-b border-gray-300 px-3 py-2 text-gray-700">{{ handover.general_note }}</div>
                </div>

                <!-- Danh sách tài sản -->
                <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
                  <p class="text-[13px] font-semibold text-gray-700">Danh sách bàn giao tài sản thiết bị</p>
                </div>
                <table class="w-full border-collapse table-fixed text-xs">
                  <thead class="bg-blue-800 text-white">
                    <tr>
                      <th class="w-10 border border-blue-600 px-2 py-2 text-center">STT</th>
                      <th class="border border-blue-600 px-2 py-2 text-left">TÊN TÀI SẢN / THIẾT BỊ</th>
                      <th class="w-28 border border-blue-600 px-2 py-2 text-center">Mã / Serial</th>
                      <th class="w-20 border border-blue-600 px-2 py-2 text-center">Tình trạng</th>
                      <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận bên nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in localContent.assets" :key="`ho2-${idx}`" class="hover:bg-blue-50/30">
                      <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-gray-800">{{ row.name }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-center font-mono text-gray-600">{{ row.serial || '—' }}</td>
                      <td class="border border-gray-300 px-2 py-2 text-center text-xs font-semibold"
                        :class="row.condition === 'GOOD' ? 'text-green-700' : row.condition === 'DAMAGED' ? 'text-amber-700' : row.condition === 'LOST' ? 'text-red-700' : 'text-gray-600'">
                        {{ { GOOD: 'Tốt', DAMAGED: 'Hỏng', LOST: 'Mất' }[row.condition] || row.condition || '—' }}
                      </td>
                      <td class="border border-gray-300 px-2 py-2 text-center">
                        <input type="checkbox" v-model="row.receiverConfirmed"
                          :disabled="!canToggleCheckbox"
                          class="w-4 h-4"
                          :class="canToggleCheckbox ? 'accent-green-600 cursor-pointer' : 'accent-green-600 cursor-not-allowed opacity-70'" />
                      </td>
                    </tr>
                    <tr v-if="!localContent.assets?.length">
                      <td colspan="5" class="border border-gray-300 px-3 py-4 text-center text-xs text-gray-400">Chưa có dữ liệu tài sản</td>
                    </tr>
                  </tbody>
                </table>
                <div class="text-xs text-gray-400 px-3 py-2 border-t border-gray-200">
                  Ghi chú: Nội dung bàn giao gồm máy tính, điện thoại, thẻ từ, thiết bị văn phòng và các tài sản công ty được cấp phát…
                </div>
              </template>

              <!-- ══ HO-3 ══ -->
              <template v-else-if="formType === 'ho3'">
                <!-- Người phỏng vấn / Loại hợp đồng -->
                <div class="grid grid-cols-12 text-[13px]">
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Người phỏng vấn</div>
                  <div class="col-span-4 border-r border-b border-gray-300 px-3 py-2">
                    <p v-if="handover.hr_signer_name" class="font-semibold text-gray-900">{{ handover.hr_signer_name }}</p>
                    <p v-else class="text-xs text-gray-400 italic">HR Staff — sau khi phê duyệt</p>
                  </div>
                  <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">Loại hợp đồng</div>
                  <div class="col-span-4 border-b border-gray-300 px-3 py-2 text-gray-900">{{ handover.contract_type || '—' }}</div>
                </div>

                <!-- I. Lý do nghỉ việc -->
                <div class="border-y border-gray-300 px-3 py-1.5 bg-gray-50">
                  <p class="text-[13px] font-semibold text-gray-700">I. Lý do nghỉ việc <span class="font-normal italic text-gray-500 text-[11px]">(Reason for leaving)</span></p>
                </div>
                <div class="px-3 py-3 border-b border-gray-300 text-[13px]">
                  <div class="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                    <label v-for="r in ho3Reasons" :key="r.key" class="flex items-start gap-2 cursor-default">
                      <input type="checkbox" :checked="localContent[r.key]" disabled class="accent-blue-700 w-3.5 h-3.5 mt-0.5" />
                      <span :class="localContent[r.key] ? 'font-semibold text-blue-800' : 'text-gray-400'">{{ r.label }}</span>
                    </label>
                    <label class="flex items-start gap-2 col-span-2 cursor-default">
                      <input type="checkbox" :checked="localContent.reason_other" disabled class="accent-blue-700 w-3.5 h-3.5 mt-0.5" />
                      <span :class="localContent.reason_other ? 'font-semibold text-blue-800' : 'text-gray-400'">
                        Lý do khác<span v-if="localContent.reason_other_text">: {{ localContent.reason_other_text }}</span>
                      </span>
                    </label>
                  </div>
                  <div v-if="localContent.reason_detail">
                    <p class="text-xs font-semibold text-gray-600 mb-1">Mô tả chi tiết:</p>
                    <p class="text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">{{ localContent.reason_detail }}</p>
                  </div>
                </div>

                <!-- II. Đánh giá môi trường -->
                <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
                  <p class="text-[13px] font-semibold text-gray-700">II. Đánh giá môi trường &amp; điều kiện làm việc</p>
                </div>
                <div class="px-3 py-3 border-b border-gray-300">
                  <table class="w-full text-xs border-collapse">
                    <thead>
                      <tr class="bg-gray-100">
                        <th class="border border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 w-1/2">Nội dung đánh giá</th>
                        <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-14">Rất tốt</th>
                        <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-10">Tốt</th>
                        <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-16">Bình thường</th>
                        <th class="border border-gray-300 px-2 py-1.5 text-center font-semibold text-gray-700 w-10">Kém</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, idx) in assessmentItems" :key="idx">
                        <td class="border border-gray-300 px-2 py-1.5 text-gray-700">{{ item.label }}</td>
                        <td v-for="val in ['very_good','good','normal','poor']" :key="val" class="border border-gray-300 px-2 py-1.5 text-center">
                          <input type="radio" :name="`assess-view-${idx}`" :value="val" :checked="localContent.assessment?.[idx] === val" disabled class="accent-blue-600" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- III. Ý kiến đề xuất -->
                <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50">
                  <p class="text-[13px] font-semibold text-gray-700">III. Ý kiến đề xuất cải tiến</p>
                </div>
                <div class="px-3 py-3 border-b border-gray-300 space-y-3 text-[13px]">
                  <div v-if="localContent.liked_most">
                    <p class="text-xs font-semibold text-gray-600 mb-1">Điều thích nhất:</p>
                    <p class="text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">{{ localContent.liked_most }}</p>
                  </div>
                  <div v-if="localContent.improvement">
                    <p class="text-xs font-semibold text-gray-600 mb-1">Cần cải thiện:</p>
                    <p class="text-sm text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">{{ localContent.improvement }}</p>
                  </div>
                  <div v-if="localContent.return_intent" class="flex items-center gap-3">
                    <p class="text-xs font-semibold text-gray-600">Muốn quay lại:</p>
                    <div class="flex gap-4">
                      <label v-for="opt in [{v:'yes',l:'Có'},{v:'maybe',l:'Có thể'},{v:'no',l:'Không'}]" :key="opt.v" class="flex items-center gap-1.5 cursor-default">
                        <input type="radio" :name="`return-view`" :value="opt.v" :checked="localContent.return_intent === opt.v" disabled class="accent-blue-600" />
                        <span :class="localContent.return_intent === opt.v ? 'font-semibold text-blue-800' : 'text-gray-400'">{{ opt.l }}</span>
                      </label>
                    </div>
                  </div>
                  <div v-if="localContent.hr_note" class="p-2 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800">
                    <strong>Ghi chú HR:</strong> {{ localContent.hr_note }}
                  </div>
                </div>
              </template>

              <!-- ══ SIGNATURE MATRIX ══ -->
              <div class="bg-white border-t border-gray-300 overflow-x-auto">
                <table class="w-full border-collapse table-fixed text-xs">
                  <thead class="bg-blue-800 text-white">
                    <tr>
                      <th class="w-24 border border-blue-600 px-2 py-2"></th>
                      <th v-for="col in signerColumns" :key="col.labelEn" class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs">
                        {{ col.label }}<br><span class="text-[10px] italic font-normal">{{ col.labelEn }}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-800">
                    <tr>
                      <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">Chữ ký /<br><span class="italic font-normal">Signature</span></td>
                      <td v-for="col in signerColumns" :key="`sig-${col.labelEn}`" class="border border-gray-300 p-3 text-center">
                        <img v-if="col.signatureUrl" :src="col.signatureUrl" alt="sig" class="h-10 object-contain mx-auto" />
                        <span v-else class="text-gray-300 text-[11px]">—</span>
                      </td>
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

            </div><!-- /biên bản -->
          </div>

          <!-- ════ RIGHT: ACTION + LOG ════ -->
          <div class="space-y-5">

            <!-- Signature required notice -->
            <div v-if="signatureRequiredNotice" class="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p class="text-xs font-semibold text-amber-800 flex items-center gap-1">
                <i class="bi bi-pen"></i>Bạn cần tạo chữ ký SignHub trước khi thực hiện thao tác này.
              </p>
            </div>

            <!-- Checkbox hint -->
            <div v-if="canToggleCheckbox" class="bg-blue-50 border border-blue-200 rounded-2xl p-3">
              <p class="text-xs text-blue-700 font-semibold flex items-center gap-1.5">
                <i class="bi bi-info-circle"></i>
                Bạn có thể tích checkbox xác nhận / thu hồi trực tiếp trên biên bản. Trạng thái sẽ được lưu khi bạn nhấn thao tác.
              </p>
            </div>

            <!-- Action panel -->
            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="bi bi-lightning-charge-fill text-amber-500"></i>Thao Tác
              </h3>

              <div v-if="handover.status === 'COMPLETED'" class="text-center py-6">
                <i class="bi bi-check-circle text-4xl text-green-400 mb-2 block"></i>
                <p class="text-sm font-semibold text-green-600">Biên bản đã hoàn tất</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(handover.completed_at) }}</p>
              </div>

              <div v-else-if="handover.status === 'REJECTED'" class="text-center py-6">
                <i class="bi bi-x-circle text-4xl text-red-400 mb-2 block"></i>
                <p class="text-sm font-semibold text-red-600">Biên bản đã bị từ chối</p>
                <p v-if="handover.reject_note" class="text-xs text-red-500 mt-1">{{ handover.reject_note }}</p>
              </div>

              <template v-else>

                <!-- DRAFT → gửi NV ký -->
                <div v-if="canSendToEmployee(handover)" class="space-y-3">
                  <div class="p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-700">
                    <i class="bi bi-info-circle mr-1"></i>Kiểm tra nội dung biên bản bên trái trước khi gửi cho nhân viên ký.
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Ghi chú (tuỳ chọn)</label>
                    <textarea v-model="actionNote" rows="2" placeholder="Ghi chú gửi cho nhân viên..." class="w-full text-sm border border-gray-200 rounded-xl p-3 focus:border-teal-400 focus:outline-none resize-none" />
                  </div>
                  <button @click="handleAction('send_to_employee')" :disabled="store.submitting"
                    class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-teal-500 hover:bg-teal-600 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                    <i v-if="store.submitting" class="bi bi-arrow-repeat animate-spin"></i>
                    <i v-else class="bi bi-send"></i>Gửi Cho Nhân Viên Ký
                  </button>
                </div>

                <!-- PENDING_EMPLOYEE_SIGN → NV ký -->
                <div v-else-if="canEmployeeSign(handover)" class="space-y-3">
                  <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
                    <i class="bi bi-info-circle mr-1"></i>Xem lại nội dung biên bản bên trái. Nếu đúng thì ký xác nhận, nếu có sai sót hãy từ chối để HR điều chỉnh lại.
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Ghi chú (tuỳ chọn)</label>
                    <textarea v-model="actionNote" rows="2" placeholder="Ghi chú khi ký..." class="w-full text-sm border border-gray-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none resize-none" />
                  </div>
                  <div class="flex gap-2">
                    <button @click="showEmployeeRejectBox = !showEmployeeRejectBox"
                      class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                      <i class="bi bi-x-lg mr-1"></i>Từ Chối
                    </button>
                    <button @click="handleAction('sign')" :disabled="store.submitting"
                      class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                      <i v-if="store.submitting" class="bi bi-arrow-repeat animate-spin"></i>
                      <i v-else class="bi bi-pen"></i>Ký Xác Nhận
                    </button>
                  </div>
                  <div v-if="showEmployeeRejectBox" class="space-y-2 pt-1 border-t border-red-100">
                    <p class="text-xs font-semibold text-red-600">Lý do từ chối (bắt buộc):</p>
                    <textarea v-model="employeeRejectNote" rows="2" placeholder="Ví dụ: Nội dung biên bản không đúng, thiếu tài sản..." class="w-full text-sm border border-red-200 rounded-xl p-3 focus:border-red-400 focus:outline-none resize-none" />
                    <button @click="handleEmployeeReject" :disabled="store.submitting || !employeeRejectNote.trim()"
                      class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50 transition-colors">
                      <i v-if="store.submitting" class="bi bi-arrow-repeat animate-spin mr-1"></i>
                      Xác Nhận Từ Chối
                    </button>
                  </div>
                </div>

                <!-- PENDING_HR_CONFIRM → HR xác nhận -->
                <div v-else-if="canHRConfirm(handover)" class="space-y-3">
                  <div class="p-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700">
                    <i class="bi bi-check2-circle mr-1"></i>Nhân viên đã ký. Tích checkbox xác nhận trên biên bản rồi nhấn Xác Nhận.
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Ghi chú (tuỳ chọn)</label>
                    <textarea v-model="actionNote" rows="2" placeholder="Ghi chú HR..." class="w-full text-sm border border-gray-200 rounded-xl p-3 focus:border-green-400 focus:outline-none resize-none" />
                  </div>
                  <div class="flex gap-2">
                    <button @click="showRejectBox = !showRejectBox"
                      class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                      <i class="bi bi-x-lg mr-1"></i>Từ Chối
                    </button>
                    <button @click="handleAction('confirm')" :disabled="store.submitting"
                      class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                      <i v-if="store.submitting" class="bi bi-arrow-repeat animate-spin"></i>
                      <i v-else class="bi bi-check2-all"></i>Xác Nhận
                    </button>
                  </div>
                  <div v-if="showRejectBox" class="space-y-2">
                    <textarea v-model="rejectNote" rows="2" placeholder="Lý do từ chối (bắt buộc)..." class="w-full text-sm border border-red-200 rounded-xl p-3 focus:border-red-400 focus:outline-none resize-none" />
                    <button @click="handleReject" :disabled="store.submitting || !rejectNote.trim()"
                      class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50">
                      Xác Nhận Từ Chối
                    </button>
                  </div>
                </div>

                <!-- HR ở bước PENDING_EMPLOYEE_SIGN — chỉ từ chối -->
                <div v-else-if="isHR && handover.status === 'PENDING_EMPLOYEE_SIGN'" class="space-y-3 pt-3 border-t border-gray-100">
                  <p class="text-xs text-gray-500">Chờ nhân viên ký nhận...</p>
                  <button @click="showRejectBox = !showRejectBox"
                    class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                    <i class="bi bi-x-lg mr-1"></i>Từ Chối Biên Bản
                  </button>
                  <div v-if="showRejectBox" class="space-y-2">
                    <textarea v-model="rejectNote" rows="2" placeholder="Lý do từ chối (bắt buộc)..." class="w-full text-sm border border-red-200 rounded-xl p-3 focus:border-red-400 focus:outline-none resize-none" />
                    <button @click="handleReject" :disabled="store.submitting || !rejectNote.trim()"
                      class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl disabled:opacity-50">
                      Xác Nhận Từ Chối
                    </button>
                  </div>
                </div>

                <div v-else class="text-center py-6 text-gray-400">
                  <i class="bi bi-lock text-2xl mb-2 block"></i>
                  <p class="text-sm">Không có thao tác nào với vai trò của bạn ở bước này.</p>
                </div>

              </template>
            </div>

            <!-- Timeline log -->
            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="bi bi-clock-history text-gray-400"></i>Lịch sử
              </h3>
              <div v-if="handover.steps?.length" class="space-y-2">
                <div v-for="step in handover.steps" :key="step.id" class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-xs font-semibold text-gray-800">{{ step.actor_name || '—' }}</span>
                      <span class="px-1.5 py-0.5 text-[10px] rounded-full font-medium" :class="actionBadgeClass(step.action)">{{ step.action }}</span>
                      <span class="text-[10px] text-gray-400">{{ formatDate(step.acted_at) }}</span>
                    </div>
                    <p v-if="step.note" class="text-xs text-gray-500 mt-0.5">{{ step.note }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-xs text-gray-400 text-center py-4">Chưa có lịch sử</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'asset-handover'] })

const route = useRoute()
const toast = useToast()
const { isHR, canSendToEmployee, canEmployeeSign, canHRConfirm, fetchProfile } = useAssetHandoverRole()

const formType = String(route.query.type ?? 'ho2').toLowerCase()
const assetStore = useAssetHandoverStore()
const jobStore   = useJobHandoverStore()
const exitStore  = useExitInterviewStore()
const store = formType === 'ho1' ? jobStore : formType === 'ho3' ? exitStore : assetStore

const actionNote  = ref('')
const rejectNote  = ref('')
const showRejectBox = ref(false)
const showEmployeeRejectBox = ref(false)
const employeeRejectNote = ref('')
const signatureRequiredNotice = ref(false)

const handover = computed(() => store.currentHandover)

// ── Type meta ──────────────────────────────────────────────────────────────────
const TYPE_META = {
  ho1: { code: 'QF-HRA-17', icon: 'bi-clipboard-check',  bg: 'bg-linear-to-br from-violet-500 to-fuchsia-500', title: 'BIÊN BẢN BÀN GIAO CÔNG VIỆC',  titleEn: 'JOB HANDOVER FORM' },
  ho2: { code: 'QF-HRA-12', icon: 'bi-box-seam',         bg: 'bg-linear-to-br from-teal-500 via-cyan-500 to-blue-500', title: 'BIÊN BẢN BÀN GIAO TÀI SẢN',   titleEn: 'ASSET HANDOVER FORM' },
  ho3: { code: 'QF-HRA-11', icon: 'bi-chat-square-text', bg: 'bg-linear-to-br from-amber-500 to-orange-500',   title: 'BIÊN BẢN PHỎNG VẤN NGHỈ VIỆC', titleEn: 'EXIT INTERVIEW FORM' },
}
const typeMeta = TYPE_META[formType] ?? TYPE_META.ho2
const typeCode = typeMeta.code
const typeIcon = typeMeta.icon
const typeBg   = typeMeta.bg

// ── Signer columns ─────────────────────────────────────────────────────────────
const signerColumns = computed(() => {
  if (!handover.value) return []
  const h = handover.value
  if (formType === 'ho1') return [
    { label: 'Bên giao', labelEn: 'Handed over by', actor: h.employee_name, title: h.job_title || 'Employee', signatureUrl: h.employee_signed_at ? h.employee_signature_url : null, date: h.employee_signed_at ? formatDate(h.employee_signed_at) : null },
    { label: 'Bên nhận', labelEn: 'Received by',    actor: h.hr_signer_name || null, title: 'Manager / HR', signatureUrl: h.hr_signature_url || null, date: h.hr_signed_at ? formatDate(h.hr_signed_at) : null },
  ]
  if (formType === 'ho3') return [
    { label: 'Nhân viên', labelEn: 'Interviewee',      actor: h.employee_name, title: h.job_title || 'Employee', signatureUrl: h.employee_signed_at ? h.employee_signature_url : null, date: h.employee_signed_at ? formatDate(h.employee_signed_at) : null },
    { label: 'Người phỏng vấn', labelEn: 'Interviewer (HR)', actor: h.hr_signer_name || null, title: 'HR Staff', signatureUrl: h.hr_signature_url || null, date: h.hr_signed_at ? formatDate(h.hr_signed_at) : null },
  ]
  return [
    { label: 'Người làm đơn', labelEn: 'Requested by', actor: h.employee_name, title: 'Employee', signatureUrl: h.employee_signed_at ? h.employee_signature_url : null, date: h.employee_signed_at ? formatDate(h.employee_signed_at) : null },
    { label: 'Xác nhận bởi',  labelEn: 'Verified by',  actor: h.hr_signer_name || null, title: 'HR Staff', signatureUrl: h.hr_signature_url || null, date: h.hr_signed_at ? formatDate(h.hr_signed_at) : null },
  ]
})

// ── Local content (reactive copy để checkbox update real-time) ─────────────────
const localContent = reactive({
  // HO-1
  jobRows: [], docRows: [], accessRows: [],
  // HO-2 — tài sản lưu trong handover.assets (không phải content)
  assets: [],
  // HO-3
  reason_personal: false, reason_salary: false, reason_career: false,
  reason_management: false, reason_worklife: false, reason_environment: false,
  reason_other: false, reason_other_text: '', reason_detail: '',
  assessment: [], liked_most: '', improvement: '', return_intent: '', hr_note: '',
})

const syncLocalContent = () => {
  const c = handover.value?.content ?? {}
  if (formType === 'ho1') {
    localContent.jobRows    = (c.jobRows    ?? []).map(r => ({ ...r }))
    localContent.docRows    = (c.docRows    ?? []).map(r => ({ ...r }))
    localContent.accessRows = (c.accessRows ?? []).map(r => ({ ...r }))
  } else if (formType === 'ho2') {
    localContent.assets = (handover.value?.assets ?? []).map(r => ({ ...r }))
  } else if (formType === 'ho3') {
    Object.assign(localContent, {
      reason_personal:   c.reason_personal   ?? false,
      reason_salary:     c.reason_salary     ?? false,
      reason_career:     c.reason_career     ?? false,
      reason_management: c.reason_management ?? false,
      reason_worklife:   c.reason_worklife   ?? false,
      reason_environment:c.reason_environment?? false,
      reason_other:      c.reason_other      ?? false,
      reason_other_text: c.reason_other_text ?? '',
      reason_detail:     c.reason_detail     ?? '',
      assessment:        (c.assessment ?? []).slice(),
      liked_most:        c.liked_most        ?? '',
      improvement:       c.improvement       ?? '',
      return_intent:     c.return_intent     ?? '',
      hr_note:           c.hr_note           ?? '',
    })
  }
}

watch(handover, (val) => { if (val) syncLocalContent() }, { immediate: true })

// ── Ai được tích checkbox? ──────────────────────────────────────────────────────
// - DRAFT: HR có thể send_to_employee — checkbox unlock khi HR ở bước này
// - PENDING_EMPLOYEE_SIGN: employee ký — unlock cho employee (bên nhận tích confirm)
// - PENDING_HR_CONFIRM: HR xác nhận — unlock cho HR
const canToggleCheckbox = computed(() => {
  if (!handover.value) return false
  const s = handover.value.status
  if (s === 'DRAFT' && canSendToEmployee(handover.value)) return true
  if (s === 'PENDING_EMPLOYEE_SIGN' && canEmployeeSign(handover.value)) return true
  if (s === 'PENDING_HR_CONFIRM' && canHRConfirm(handover.value)) return true
  return false
})

// ── Build payload content từ localContent ─────────────────────────────────────
const buildContent = () => {
  if (formType === 'ho1') return {
    jobRows:    localContent.jobRows,
    docRows:    localContent.docRows,
    accessRows: localContent.accessRows,
  }
  if (formType === 'ho2') return { assets: localContent.assets }
  // ho3 — content không thay đổi nhiều, trả nguyên
  return { ...handover.value?.content }
}

// ── Approval timeline ──────────────────────────────────────────────────────────
const STEPS = [
  { key: 'create',  label: 'Tạo biên bản', icon: 'bi-file-earmark-plus' },
  { key: 'send',    label: 'Gửi NV ký',    icon: 'bi-send' },
  { key: 'sign',    label: 'NV đã ký',     icon: 'bi-pen' },
  { key: 'confirm', label: 'HR xác nhận',  icon: 'bi-check2-all' },
]
const STATUS_STEP = { DRAFT: 1, PENDING_EMPLOYEE_SIGN: 2, PENDING_HR_CONFIRM: 3, COMPLETED: 4, REJECTED: 0 }
const currentStepNum = computed(() => STATUS_STEP[handover.value?.status ?? 'DRAFT'] ?? 1)
const isRejected     = computed(() => handover.value?.status === 'REJECTED')
const completedSteps = computed(() => {
  if (handover.value?.status === 'COMPLETED') return STEPS.length
  return Math.max(0, currentStepNum.value - 1)
})
const progressPercent = computed(() =>
  handover.value?.status === 'COMPLETED' ? 100 : Math.round((completedSteps.value / STEPS.length) * 100)
)
const timelineSteps = computed(() => STEPS.map((s, i) => {
  const num = i + 1
  const isDone   = !isRejected.value && num < currentStepNum.value
  const isActive = !isRejected.value && num === currentStepNum.value
  const isRej    = isRejected.value && num === currentStepNum.value
  const status   = isRej ? 'rejected' : isDone ? 'done' : isActive ? 'active' : 'pending'
  return {
    ...s, status,
    badge:      isDone ? 'Done' : isRej ? 'Rejected' : null,
    badgeClass: isDone ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
  }
}))
const lineClass = (idx) => {
  if (isRejected.value) {
    if (idx < currentStepNum.value) return 'bg-green-400'
    if (idx === currentStepNum.value) return 'bg-red-400'
    return 'bg-gray-200'
  }
  return idx <= currentStepNum.value ? 'bg-teal-400' : 'bg-gray-200'
}
const circleClass = (status) => ({
  done:    'bg-green-500 shadow-md shadow-green-500/30',
  rejected:'bg-red-500 shadow-md shadow-red-500/30',
  active:  'bg-teal-600 shadow-md shadow-teal-500/30',
  pending: 'bg-gray-100 border-2 border-gray-200',
}[status] ?? 'bg-gray-100 border-2 border-gray-200')
const stepLabelClass = (status) => ({ done:'text-green-600', active:'text-teal-700', rejected:'text-red-600', pending:'text-gray-400' }[status] ?? 'text-gray-400')

// ── Actions ────────────────────────────────────────────────────────────────────
const checkSignature = async () => {
  try { return !!(await useFetchAuth('/v1/profile/signature'))?.data?.has_signature }
  catch (_) { return false }
}

const handleAction = async (action) => {
  if (['sign', 'confirm'].includes(action)) {
    if (!(await checkSignature())) {
      signatureRequiredNotice.value = true
      toast.error('Bạn cần tạo chữ ký SignHub trước khi thực hiện thao tác này.')
      setTimeout(() => { signatureRequiredNotice.value = false }, 5000)
      return
    }
  }

  // Luôn gửi kèm content hiện tại (với checkbox đã tích)
  const payload = { action, note: actionNote.value, content: buildContent() }

  const result = await store.takeActionWithContent(route.params.id, payload)
  if (result.success) {
    toast.success({ send_to_employee: 'Đã gửi cho nhân viên ký.', sign: 'Đã ký xác nhận.', confirm: 'Đã xác nhận hoàn tất.' }[action] ?? 'Thao tác thành công.')
    actionNote.value = ''
    showRejectBox.value = false
  } else {
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const handleReject = async () => {
  if (!rejectNote.value.trim()) return
  const result = await store.takeAction(route.params.id, 'reject', rejectNote.value.trim())
  if (result.success) {
    toast.success('Đã từ chối biên bản.')
    rejectNote.value = ''
    showRejectBox.value = false
  } else {
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const handleEmployeeReject = async () => {
  if (!employeeRejectNote.value.trim()) return
  const result = await store.takeAction(route.params.id, 'reject', employeeRejectNote.value.trim())
  if (result.success) {
    toast.success('Đã từ chối biên bản. HR sẽ được thông báo để điều chỉnh lại.')
    employeeRejectNote.value = ''
    showEmployeeRejectBox.value = false
  } else {
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

// ── HO-3 static data ────────────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────────
const STATUS_LABEL = { DRAFT:'Bản Nháp', PENDING_EMPLOYEE_SIGN:'Chờ NV Ký', PENDING_HR_CONFIRM:'Chờ HR Xác Nhận', COMPLETED:'Hoàn Tất', REJECTED:'Từ Chối' }
const statusLabel = (s) => STATUS_LABEL[s] ?? s
const statusBadgeClass = (s) => ({
  DRAFT:'bg-gray-100 text-gray-600', PENDING_EMPLOYEE_SIGN:'bg-amber-100 text-amber-700',
  PENDING_HR_CONFIRM:'bg-blue-100 text-blue-700', COMPLETED:'bg-green-100 text-green-700', REJECTED:'bg-red-100 text-red-700',
}[s] ?? 'bg-gray-100 text-gray-600')
const actionBadgeClass = (a) => (['confirm','sign'].includes(a) ? 'bg-green-100 text-green-700' : a==='reject' ? 'bg-red-100 text-red-700' : a==='send_to_employee' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600')
const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }) : '—'
const openPrintView = () => window.open(`/print/asset-handover/${route.params.id}?type=${formType}`, '_blank')

onMounted(async () => {
  await fetchProfile()
  await store.fetchById(route.params.id)
})
</script>

<style scoped>
@media print { .no-print { display: none !important; } }
</style>
