<template>
  <div class="bg-slate-50 flex flex-col h-full overflow-hidden">
    <ToastContainer />

    <ConfirmModal
      :is-visible="isVisible"
      :title="confirmData.title || 'Xác nhận'"
      :subtitle="confirmData.subtitle || ''"
      :message="
        confirmData.message || 'Bạn có chắc chắn muốn thực hiện hành động này?'
      "
      :confirm-text="confirmData.confirmText"
      :cancel-text="confirmData.cancelText"
      :type="confirmData.type"
      @confirm="confirm"
      @cancel="cancel"
    />

    <!-- Header -->
    <div
      class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-10 shadow-sm shrink-0"
    >
      <div class="px-3 lg:px-6 py-4">
        <!-- Top Row: Back button & Stats -->
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"
        >
          <div class="flex items-start gap-3 min-w-0 flex-1 md:flex-none">
            <button
              @click="navigateBack"
              class="mt-1 cursor-pointer inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors shrink-0"
            >
              <i class="bi bi-arrow-left text-lg"></i>
            </button>

            <div class="min-w-0 flex-1">
              <h1
                class="text-lg font-bold text-gray-900 leading-tight whitespace-normal break-words pr-2"
              >
                {{ list?.name || "Đang tải..." }}
              </h1>
              <p class="text-xs text-gray-500 mt-1 line-clamp-1 break-all">
                {{ list?.description || "Không có mô tả" }}
              </p>
            </div>

            <!-- Mobile Info Icon -->
            <div class="relative sm:hidden shrink-0" ref="infoDropdown">
              <button
                @click.stop="showInfoDropdown = !showInfoDropdown"
                class="p-1 text-slate-400 hover:text-indigo-600 rounded-full transition-colors"
              >
                <i class="bi bi-info-circle text-lg"></i>
              </button>

              <!-- Mobile Info Dropdown -->
              <div
                v-if="showInfoDropdown"
                class="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <div
                  class="flex items-center justify-between mb-3 pb-3 border-b border-slate-100"
                >
                  <span class="text-xs font-semibold text-slate-500 uppercase"
                    >Thống kê</span
                  >
                  <NuxtLink
                    :to="`/email-lists/report?id=${listId}`"
                    class="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    Xem báo cáo <i class="bi bi-arrow-right"></i>
                  </NuxtLink>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div
                    class="bg-slate-50 rounded-lg p-2 text-center border border-slate-100"
                  >
                    <div class="text-xs text-slate-500 uppercase font-medium">
                      Tổng
                    </div>
                    <div class="text-lg font-bold text-slate-900">
                      {{ list?.stats?.totalSubscribers || 0 }}
                    </div>
                  </div>
                  <div
                    class="bg-green-50 rounded-lg p-2 text-center border border-green-100"
                  >
                    <div class="text-xs text-green-600 uppercase font-medium">
                      Active
                    </div>
                    <div class="text-lg font-bold text-green-700">
                      {{ list?.stats?.activeSubscribers || 0 }}
                    </div>
                  </div>
                  <div
                    class="bg-red-50 rounded-lg p-2 text-center border border-red-100"
                  >
                    <div class="text-xs text-red-600 uppercase font-medium">
                      Hủy
                    </div>
                    <div class="text-lg font-bold text-red-700">
                      {{ list?.stats?.unsubscribedCount || 0 }}
                    </div>
                  </div>
                </div>
                <p
                  v-if="list?.description"
                  class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 italic line-clamp-3"
                >
                  {{ list?.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Desktop Stats & Report (Hidden on Mobile) -->
          <div class="hidden sm:flex items-center gap-2 self-end md:self-auto">
            <NuxtLink
              :to="`/email-lists/report?id=${listId}`"
              class="flex items-center justify-center w-9 h-9 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="Báo cáo"
            >
              <i class="bi bi-bar-chart-fill text-lg"></i>
            </NuxtLink>

            <div
              class="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-xl px-5 py-2 border border-slate-200 shadow-sm"
            >
              <div class="text-center">
                <div class="text-lg font-bold text-gray-900">
                  {{ list?.stats?.totalSubscribers || 0 }}
                </div>
                <div class="text-xs text-gray-500">Tổng</div>
              </div>
              <div class="w-px h-8 bg-gray-200"></div>
              <div class="text-center">
                <div class="text-lg font-bold text-green-600">
                  {{ list?.stats?.activeSubscribers || 0 }}
                </div>
                <div class="text-xs text-gray-500">Active</div>
              </div>
              <div class="w-px h-8 bg-gray-200"></div>
              <div class="text-center">
                <div class="text-lg font-bold text-red-600">
                  {{ list?.stats?.unsubscribedCount || 0 }}
                </div>
                <div class="text-xs text-gray-500">Hủy</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Row: Search, Filter & Actions -->
        <div
          class="flex flex-col md:flex-row items-stretch md:items-center gap-2"
        >
          <!-- Mobile: Row 1 - Search & Filter -->
          <div class="flex flex-row gap-2 md:hidden">
            <!-- Search -->
            <div class="flex-1 min-w-0">
              <div class="relative">
                <i
                  class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                ></i>
                <input
                  v-model="filters.search"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Tìm kiếm..."
                  class="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <!-- Filter -->
            <select
              v-model="filters.status"
              @change="fetchSubscribers"
              class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="unsubscribed">Hủy</option>
              <option value="bounced">Lỗi</option>
            </select>
          </div>

          <!-- Desktop: Search & Filter -->
          <div class="hidden md:flex flex-1 min-w-0 gap-2">
            <!-- Search -->
            <div class="flex-1 min-w-0">
              <div class="relative">
                <i
                  class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                ></i>
                <input
                  v-model="filters.search"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Tìm kiếm..."
                  class="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <!-- Filter -->
            <select
              v-model="filters.status"
              @change="fetchSubscribers"
              class="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="unsubscribed">Hủy</option>
              <option value="bounced">Lỗi</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div
            class="grid grid-cols-4 sm:flex sm:items-center sm:justify-end gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0"
          >
            <button
              @click="showCloudinaryConfig = true"
              class="col-span-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm h-full"
              title="Cấu hình Cloudinary"
            >
              <i class="bi bi-cloud-upload text-lg sm:text-base"></i>
              <span class="hidden sm:inline">Cloudinary</span>
            </button>
            <button
              @click="showCustomFields = true"
              class="col-span-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm h-full"
              title="Trường tùy chỉnh"
            >
              <i class="bi bi-input-cursor-text text-lg sm:text-base"></i>
              <span class="hidden sm:inline">Trường</span>
            </button>
            <button
              @click="showImportModal = true"
              class="col-span-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm h-full"
              title="Nhập Excel"
            >
              <i class="bi bi-file-earmark-arrow-up text-lg sm:text-base"></i>
              <span class="hidden sm:inline">Nhập</span>
            </button>
            <button
              @click="showAddSubscriber = true"
              class="col-span-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm h-full"
              title="Thêm mới"
            >
              <i class="bi bi-plus-lg text-lg sm:text-base"></i>
              <span class="hidden sm:inline">Thêm</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="flex flex-col flex-1 min-h-0 px-3 lg:px-6 py-4 overflow-hidden pb-4"
    >
      <!-- Subscribers Table -->
      <div
        class="flex flex-col flex-1 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden shadow-sm min-h-0"
      >
        <div class="flex-1 overflow-auto min-h-0">
          <div class="inline-block min-w-full align-middle">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <!-- Frozen Checkbox Column -->
                  <th
                    class="sticky left-0 z-30 bg-slate-50 px-4 py-3 text-left border-r border-slate-200 w-12"
                  >
                    <input
                      type="checkbox"
                      @change="toggleSelectAll"
                      :checked="allSelected"
                      class="rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                  <!-- Scrollable Columns -->
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap bg-slate-50"
                  >
                    Email
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap bg-slate-50"
                  >
                    Họ và tên
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap bg-slate-50"
                  >
                    Trạng thái
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap bg-slate-50"
                  >
                    Ngày đăng ký
                  </th>
                  <!-- Custom Fields -->
                  <th
                    v-for="field in list?.customFieldDefinitions || []"
                    :key="field._id"
                    class="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap bg-slate-50"
                  >
                    {{ field.fieldName }}
                  </th>
                  <!-- Frozen Actions Column -->
                  <th
                    class="sticky right-0 z-30 bg-slate-50 px-4 py-3 text-center text-xs font-semibold text-gray-700 border-l border-slate-200 whitespace-nowrap w-24"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-100">
                <!-- Loading State -->
                <tr
                  v-if="loading"
                  v-for="n in 5"
                  :key="n"
                  class="animate-pulse"
                >
                  <td
                    class="sticky left-0 z-10 bg-white px-4 py-4 border-r border-slate-100"
                  >
                    <div class="w-4 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td
                    v-for="field in list?.customFieldDefinitions || []"
                    :key="field._id"
                    class="px-4 py-4"
                  >
                    <div class="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td
                    class="sticky right-0 z-10 bg-white px-4 py-4 border-l border-slate-100"
                  >
                    <div class="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                </tr>
                <!-- Empty State -->
                <tr v-else-if="!subscribers.length">
                  <td
                    :colspan="6 + (list?.customFieldDefinitions?.length || 0)"
                    class="px-3 lg:px-6 py-12 text-center text-gray-500"
                  >
                    <i
                      class="bi bi-inbox text-4xl text-gray-300 block mb-3"
                    ></i>
                    <p class="text-sm">Không tìm thấy người đăng ký nào</p>
                  </td>
                </tr>
                <!-- Data Rows -->
                <tr
                  v-else
                  v-for="sub in subscribers"
                  :key="sub._id"
                  class="hover:bg-indigo-50/30 transition-colors group"
                >
                  <!-- Frozen Checkbox -->
                  <td
                    class="sticky left-0 z-10 bg-white group-hover:bg-indigo-50/30 px-4 py-3.5 border-r border-slate-100"
                  >
                    <input
                      type="checkbox"
                      v-model="selectedIds"
                      :value="sub._id"
                      class="rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <!-- Scrollable Data -->
                  <td
                    class="px-4 py-3.5 whitespace-nowrap bg-white group-hover:bg-indigo-50/30"
                  >
                    <span class="font-medium text-gray-900">{{
                      sub.email
                    }}</span>
                  </td>
                  <td
                    class="px-4 py-3.5 text-gray-600 whitespace-nowrap bg-white group-hover:bg-indigo-50/30"
                  >
                    {{
                      [sub.firstName, sub.lastName].filter(Boolean).join(" ") ||
                      "-"
                    }}
                  </td>
                  <td
                    class="px-4 py-3.5 whitespace-nowrap bg-white group-hover:bg-indigo-50/30"
                  >
                    <span
                      :class="getStatusClass(sub.status)"
                      class="px-2.5 py-1 rounded-md text-xs font-medium inline-block"
                    >
                      {{ getStatusText(sub.status) }}
                    </span>
                  </td>
                  <td
                    class="px-4 py-3.5 text-gray-600 text-sm whitespace-nowrap bg-white group-hover:bg-indigo-50/30"
                  >
                    {{ formatDate(sub.subscribedAt) }}
                  </td>
                  <!-- Custom Fields Data -->
                  <td
                    v-for="field in list?.customFieldDefinitions || []"
                    :key="field._id"
                    class="px-4 py-3.5 text-gray-600 text-sm whitespace-nowrap bg-white group-hover:bg-indigo-50/30"
                  >
                    <img
                      v-if="
                        field.fieldType === 'image' &&
                        sub.customFields?.[field.fieldKey]
                      "
                      :src="sub.customFields[field.fieldKey]"
                      class="h-12 w-auto rounded border border-gray-200"
                      :alt="field.fieldName"
                    />
                    <span v-else>{{
                      sub.customFields?.[field.fieldKey] || "-"
                    }}</span>
                  </td>
                  <!-- Frozen Actions -->
                  <td
                    class="sticky right-0 z-10 bg-white group-hover:bg-indigo-50/30 px-4 py-3.5 border-l border-slate-100 whitespace-nowrap text-center"
                  >
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click="editSubscriber(sub)"
                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        @click="deleteSubscriber(sub._id)"
                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination"
          class="px-4 py-3 border-t border-gray-200 flex items-center justify-center lg:justify-end bg-gray-50"
        >
          <span class="hidden text-sm text-gray-600">
            Hiển thị {{ (pagination.page - 1) * pagination.limit + 1 }} -
            {{
              Math.min(pagination.page * pagination.limit, pagination.total)
            }}
            trong tổng số {{ pagination.total }}
          </span>
          <div class="flex items-center gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="px-3 lg:px-6 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              <i class="bi bi-chevron-left"></i>
              <span class="hidden sm:inline ml-1">Trước</span>
            </button>
            <span class="text-sm text-gray-600 px-2"
              >Trang {{ pagination.page }} / {{ pagination.totalPages }}</span
            >
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="px-3 lg:px-6 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              <span class="hidden sm:inline mr-1">Tiếp</span>
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Fields Modal -->
    <div
      style="z-index: 999999 !important"
      v-if="showCustomFields"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[700px] overflow-hidden flex flex-col"
      >
        <div
          class="flex items-center justify-between p-6 border-b border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-900">
            Quản Lý Trường Tùy Chỉnh
          </h3>
          <button
            @click="showCustomFields = false"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="flex-1 overflow-auto p-6">
          <CustomFieldsManager
            :list-id="listId"
            :custom-fields="list?.customFieldDefinitions || []"
            :has-cloudinary-config="hasCloudinaryConfig"
            @refresh="fetchSubscribers"
          />
        </div>
      </div>
    </div>

    <!-- Add/Edit Subscriber Modal -->
    <div
      style="z-index: 999999 !important"
      v-if="showAddSubscriber"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[700px] flex flex-col"
      >
        <div
          class="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50"
        >
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ editingSub ? "Chỉnh sửa" : "Thêm" }} người đăng ký
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              Điền thông tin chi tiết của subscriber
            </p>
          </div>
          <button
            @click="closeSubModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>
        <!-- Add/Edit Subscriber Modal -->
        <div
          style="z-index: 999999 !important"
          v-if="showAddSubscriber"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div
            class="bg-white rounded-xl shadow-xl w-full max-w-7xl h-[700px] flex flex-col"
          >
            <div
              class="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50"
            >
              <div>
                <h3 class="text-xl font-bold text-gray-900">
                  {{ editingSub ? "Chỉnh sửa" : "Thêm" }} người đăng ký
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  Điền thông tin chi tiết của subscriber
                </p>
              </div>
              <button
                @click="closeSubModal"
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i class="bi bi-x-lg text-xl"></i>
              </button>
            </div>

            <!-- Mobile Tab Navigation -->
            <div class="md:hidden border-b border-gray-200 bg-white">
              <div class="flex">
                <button
                  @click="activeTab = 'basic'"
                  :class="[
                    'flex-1 py-4 px-4 text-center border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'basic'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700',
                  ]"
                >
                  <i class="bi bi-person mr-2"></i>
                  Thông tin cơ bản
                </button>
                <button
                  v-if="list?.customFieldDefinitions?.length > 0"
                  @click="activeTab = 'custom'"
                  :class="[
                    'flex-1 py-4 px-4 text-center border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'custom'
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700',
                  ]"
                >
                  <i class="bi bi-input-cursor-text mr-2"></i>
                  Trường tùy chỉnh
                </button>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="flex-1 overflow-hidden">
              <!-- Desktop: 2 Column Layout -->
              <div class="hidden md:flex h-full">
                <!-- Left Column: Tab Navigation -->
                <div
                  class="w-80 border-r border-gray-200 bg-gray-50/50 flex flex-col"
                >
                  <div class="p-6">
                    <div class="space-y-2">
                      <button
                        @click="activeTab = 'basic'"
                        :class="[
                          'w-full flex items-center gap-3 p-4 rounded-lg text-left transition-all',
                          activeTab === 'basic'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-100',
                        ]"
                      >
                        <div
                          :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                            activeTab === 'basic'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600',
                          ]"
                        >
                          <i class="bi bi-person"></i>
                        </div>
                        <div>
                          <div class="font-medium">Thông tin cơ bản</div>
                          <div class="text-xs opacity-75">
                            Email, tên, liên hệ
                          </div>
                        </div>
                      </button>

                      <button
                        v-if="list?.customFieldDefinitions?.length > 0"
                        @click="activeTab = 'custom'"
                        :class="[
                          'w-full flex items-center gap-3 p-4 rounded-lg text-left transition-all',
                          activeTab === 'custom'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'text-gray-600 hover:bg-gray-100',
                        ]"
                      >
                        <div
                          :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                            activeTab === 'custom'
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-200 text-gray-600',
                          ]"
                        >
                          <i class="bi bi-input-cursor-text"></i>
                        </div>
                        <div>
                          <div class="font-medium">Trường tùy chỉnh</div>
                          <div class="text-xs opacity-75">
                            {{ list.customFieldDefinitions.length }} trường
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Tab Content -->
                <div class="flex-1 overflow-auto">
                  <!-- Basic Info Tab -->
                  <div v-if="activeTab === 'basic'" class="p-6">
                    <div class="mb-6">
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div class="lg:col-span-2">
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Email <span class="text-red-500">*</span>
                          </label>
                          <input
                            v-model="subForm.email"
                            type="email"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Họ</label
                          >
                          <input
                            v-model="subForm.firstName"
                            type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nguyễn"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Tên</label
                          >
                          <input
                            v-model="subForm.lastName"
                            type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Văn A"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Số điện thoại</label
                          >
                          <input
                            v-model="subForm.phone"
                            type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0123456789"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Công ty</label
                          >
                          <input
                            v-model="subForm.company"
                            type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tên công ty"
                          />
                        </div>
                        <div v-if="editingSub">
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Trạng thái</label
                          >
                          <select
                            v-model="subForm.status"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="active">Hoạt động</option>
                            <option value="unsubscribed">Hủy đăng ký</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Custom Fields Tab -->
                  <div v-if="activeTab === 'custom'" class="p-6">
                    <div class="mb-6">
                      <!-- Custom Fields Grid - Better for image fields -->
                      <div class="space-y-6">
                        <div
                          v-for="field in list.customFieldDefinitions"
                          :key="field._id"
                          class="bg-gray-50/50 rounded-xl p-6 border border-gray-100"
                        >
                          <!-- Field Header -->
                          <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                              <div
                                class="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200"
                              >
                                <i
                                  :class="getFieldIcon(field.fieldType)"
                                  class="text-gray-600 text-sm"
                                ></i>
                              </div>
                              <div>
                                <h5 class="font-medium text-gray-900">
                                  {{ field.fieldName }}
                                </h5>
                                <p class="text-xs text-gray-500 font-mono">
                                  {{ field.fieldKey }}
                                </p>
                              </div>
                            </div>
                            <span
                              v-if="field.required"
                              class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium"
                              >Bắt buộc</span
                            >
                          </div>

                          <!-- Field Input -->
                          <div
                            v-if="
                              field.fieldType === 'text' ||
                              field.fieldType === 'email' ||
                              field.fieldType === 'url'
                            "
                          >
                            <input
                              v-model="subForm.customFields[field.fieldKey]"
                              :type="
                                field.fieldType === 'email'
                                  ? 'email'
                                  : field.fieldType === 'url'
                                    ? 'url'
                                    : 'text'
                              "
                              :placeholder="
                                field.defaultValue ||
                                `Nhập ${field.fieldName.toLowerCase()}`
                              "
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                            />
                          </div>

                          <div v-else-if="field.fieldType === 'number'">
                            <input
                              v-model.number="
                                subForm.customFields[field.fieldKey]
                              "
                              type="number"
                              :placeholder="
                                field.defaultValue ||
                                `Nhập ${field.fieldName.toLowerCase()}`
                              "
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                            />
                          </div>

                          <div v-else-if="field.fieldType === 'phone'">
                            <input
                              v-model="subForm.customFields[field.fieldKey]"
                              type="tel"
                              :placeholder="
                                field.defaultValue ||
                                `Nhập ${field.fieldName.toLowerCase()}`
                              "
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                            />
                          </div>

                          <div v-else-if="field.fieldType === 'date'">
                            <input
                              v-model="subForm.customFields[field.fieldKey]"
                              type="date"
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                            />
                          </div>

                          <!-- Image Field - Enhanced Layout -->
                          <div
                            v-else-if="field.fieldType === 'image'"
                            class="space-y-4"
                          >
                            <!-- Image Preview - Larger and better positioned -->
                            <div
                              v-if="subForm.customFields[field.fieldKey]"
                              class="relative group"
                            >
                              <div
                                class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                              >
                                <div class="flex items-start gap-4">
                                  <div class="relative flex-shrink-0">
                                    <img
                                      :src="
                                        subForm.customFields[field.fieldKey]
                                      "
                                      class="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                                      alt="Preview"
                                    />
                                    <button
                                      @click="
                                        subForm.customFields[field.fieldKey] =
                                          ''
                                      "
                                      type="button"
                                      class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center shadow-md transition-colors"
                                      title="Xóa ảnh"
                                    >
                                      <i class="bi bi-x text-sm"></i>
                                    </button>
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <p
                                      class="text-sm font-medium text-gray-900 mb-1"
                                    >
                                      Ảnh đã chọn
                                    </p>
                                    <p class="text-xs text-gray-500 break-all">
                                      {{ subForm.customFields[field.fieldKey] }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Upload Options - Better organized -->
                            <div
                              class="bg-white rounded-lg border border-gray-200 p-4"
                            >
                              <p class="text-sm font-medium text-gray-700 mb-3">
                                Chọn ảnh:
                              </p>
                              <div class="flex flex-wrap gap-3">
                                <!-- Upload Button -->
                                <div class="flex-1 min-w-0">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    @change="
                                      (e) =>
                                        handleImageUpload(e, field.fieldKey)
                                    "
                                    class="hidden"
                                    :ref="
                                      (el) =>
                                        (imageInputRefs[field.fieldKey] = el)
                                    "
                                  />
                                  <button
                                    @click="
                                      imageInputRefs[field.fieldKey]?.click()
                                    "
                                    type="button"
                                    :disabled="uploadingImage[field.fieldKey]"
                                    class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                  >
                                    <i
                                      :class="
                                        uploadingImage[field.fieldKey]
                                          ? 'bi bi-arrow-repeat animate-spin'
                                          : 'bi bi-cloud-upload'
                                      "
                                      class="text-lg"
                                    ></i>
                                    <span>{{
                                      uploadingImage[field.fieldKey]
                                        ? "Đang upload..."
                                        : "Upload ảnh mới"
                                    }}</span>
                                  </button>
                                </div>

                                <!-- Library Button -->
                                <div class="flex-1 min-w-0">
                                  <button
                                    @click="openMediaDrawer(field.fieldKey)"
                                    type="button"
                                    class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                                  >
                                    <i class="bi bi-images text-lg"></i>
                                    <span>Chọn từ thư viện</span>
                                  </button>
                                </div>
                              </div>

                              <!-- URL Input -->
                              <div class="mt-3 pt-3 border-t border-gray-100">
                                <label class="block text-sm text-gray-600 mb-2"
                                  >Hoặc nhập URL trực tiếp:</label
                                >
                                <input
                                  v-model="subForm.customFields[field.fieldKey]"
                                  type="url"
                                  placeholder="https://example.com/image.jpg"
                                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile: Single Column Layout -->
              <div class="md:hidden flex flex-col h-full">
                <!-- Mobile Tab Selection -->
                <div v-if="activeTab === 'tabs'" class="flex-shrink-0 p-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-6">
                    Chọn thông tin cần chỉnh sửa
                  </h4>
                  <div class="space-y-4">
                    <button
                      @click="activeTab = 'basic'"
                      class="w-full flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                    >
                      <div
                        class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center"
                      >
                        <i class="bi bi-person text-white text-xl"></i>
                      </div>
                      <div class="text-left">
                        <h5 class="font-medium text-blue-900">
                          Thông tin cơ bản
                        </h5>
                        <p class="text-sm text-blue-700">
                          Email, tên, số điện thoại, công ty
                        </p>
                      </div>
                    </button>

                    <button
                      v-if="list?.customFieldDefinitions?.length > 0"
                      @click="activeTab = 'custom'"
                      class="w-full flex items-center gap-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                    >
                      <div
                        class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center"
                      >
                        <i
                          class="bi bi-input-cursor-text text-white text-xl"
                        ></i>
                      </div>
                      <div class="text-left">
                        <h5 class="font-medium text-purple-900">
                          Trường tùy chỉnh
                        </h5>
                        <p class="text-sm text-purple-700">
                          {{ list.customFieldDefinitions.length }} trường đã cấu
                          hình
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Scrollable Content Area -->
                <div class="flex-1 overflow-y-auto">
                  <!-- Basic Info Tab -->
                  <div v-if="activeTab === 'basic'" class="p-6">
                    <div class="mb-6">
                      <div class="grid grid-cols-1 gap-4">
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Email <span class="text-red-500">*</span>
                          </label>
                          <input
                            v-model="subForm.email"
                            type="email"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Họ</label
                          >
                          <input
                            v-model="subForm.firstName"
                            type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nguyễn"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Tên</label
                          >
                          <input
                            v-model="subForm.lastName"
                            type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Văn A"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Số điện thoại</label
                          >
                          <input
                            v-model="subForm.phone"
                            type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0123456789"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Công ty</label
                          >
                          <input
                            v-model="subForm.company"
                            type="text"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tên công ty"
                          />
                        </div>
                        <div v-if="editingSub">
                          <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Trạng thái</label
                          >
                          <select
                            v-model="subForm.status"
                            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="active">Hoạt động</option>
                            <option value="unsubscribed">Hủy đăng ký</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Custom Fields Tab -->
                  <div v-if="activeTab === 'custom'" class="p-6">
                    <div class="mb-6">
                      <!-- Custom Fields Grid - Better for image fields -->
                      <div class="space-y-4">
                        <div
                          v-for="field in list.customFieldDefinitions"
                          :key="field._id"
                          class="bg-gray-50/50 rounded-xl p-4 border border-gray-100"
                        >
                          <!-- Field Header -->
                          <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                              <div
                                class="w-6 h-6 bg-white rounded-lg flex items-center justify-center border border-gray-200"
                              >
                                <i
                                  :class="getFieldIcon(field.fieldType)"
                                  class="text-gray-600 text-xs"
                                ></i>
                              </div>
                              <div>
                                <h5 class="font-medium text-gray-900 text-sm">
                                  {{ field.fieldName }}
                                </h5>
                                <p class="text-xs text-gray-500 font-mono">
                                  {{ field.fieldKey }}
                                </p>
                              </div>
                            </div>
                            <span
                              v-if="field.required"
                              class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium"
                              >Bắt buộc</span
                            >
                          </div>

                          <!-- Field Input -->
                          <div
                            v-if="
                              field.fieldType === 'text' ||
                              field.fieldType === 'email' ||
                              field.fieldType === 'url'
                            "
                          >
                            <input
                              v-model="subForm.customFields[field.fieldKey]"
                              :type="
                                field.fieldType === 'email'
                                  ? 'email'
                                  : field.fieldType === 'url'
                                    ? 'url'
                                    : 'text'
                              "
                              :placeholder="
                                field.defaultValue ||
                                `Nhập ${field.fieldName.toLowerCase()}`
                              "
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-sm"
                            />
                          </div>

                          <div v-else-if="field.fieldType === 'number'">
                            <input
                              v-model.number="
                                subForm.customFields[field.fieldKey]
                              "
                              type="number"
                              :placeholder="
                                field.defaultValue ||
                                `Nhập ${field.fieldName.toLowerCase()}`
                              "
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-sm"
                            />
                          </div>

                          <div v-else-if="field.fieldType === 'phone'">
                            <input
                              v-model="subForm.customFields[field.fieldKey]"
                              type="tel"
                              :placeholder="
                                field.defaultValue ||
                                `Nhập ${field.fieldName.toLowerCase()}`
                              "
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-sm"
                            />
                          </div>

                          <div v-else-if="field.fieldType === 'date'">
                            <input
                              v-model="subForm.customFields[field.fieldKey]"
                              type="date"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-sm"
                            />
                          </div>

                          <!-- Image Field - Mobile Optimized -->
                          <div
                            v-else-if="field.fieldType === 'image'"
                            class="space-y-4"
                          >
                            <!-- Image Preview - Mobile Friendly -->
                            <div
                              v-if="subForm.customFields[field.fieldKey]"
                              class="relative"
                            >
                              <div
                                class="bg-white rounded-lg border border-gray-200 p-3"
                              >
                                <div class="flex items-start gap-3">
                                  <div class="relative flex-shrink-0">
                                    <div
                                      class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                                    >
                                      <img
                                        :src="
                                          subForm.customFields[field.fieldKey]
                                        "
                                        class="w-full h-full object-cover"
                                        alt="Preview"
                                      />
                                    </div>
                                    <button
                                      @click="
                                        subForm.customFields[field.fieldKey] =
                                          ''
                                      "
                                      type="button"
                                      class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center text-xs"
                                      title="Xóa ảnh"
                                    >
                                      <i class="bi bi-x"></i>
                                    </button>
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <p
                                      class="text-xs font-medium text-gray-900 mb-1"
                                    >
                                      Ảnh đã chọn
                                    </p>
                                    <p
                                      class="text-xs text-gray-500 break-all line-clamp-2"
                                    >
                                      {{ subForm.customFields[field.fieldKey] }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Upload Options - Mobile Stack -->
                            <div class="space-y-3">
                              <!-- Upload New Image -->
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  @change="
                                    (e) => handleImageUpload(e, field.fieldKey)
                                  "
                                  class="hidden"
                                  :ref="
                                    (el) =>
                                      (imageInputRefs[field.fieldKey] = el)
                                  "
                                />
                                <button
                                  @click="
                                    imageInputRefs[field.fieldKey]?.click()
                                  "
                                  type="button"
                                  :disabled="uploadingImage[field.fieldKey]"
                                  class="w-full h-12 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                  <i
                                    :class="
                                      uploadingImage[field.fieldKey]
                                        ? 'bi bi-arrow-repeat animate-spin'
                                        : 'bi bi-cloud-upload'
                                    "
                                  ></i>
                                  <span>{{
                                    uploadingImage[field.fieldKey]
                                      ? "Đang upload..."
                                      : "Upload ảnh mới"
                                  }}</span>
                                </button>
                              </div>

                              <!-- Select from Library -->
                              <div>
                                <button
                                  @click="openMediaDrawer(field.fieldKey)"
                                  type="button"
                                  class="w-full h-12 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                  <i class="bi bi-images"></i>
                                  <span>Chọn từ thư viện</span>
                                </button>
                              </div>

                              <!-- URL Input -->
                              <div>
                                <input
                                  v-model="subForm.customFields[field.fieldKey]"
                                  type="url"
                                  placeholder="https://example.com/image.jpg"
                                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50"
            >
              <button
                @click="closeSubModal"
                class="px-3 lg:px-6 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <i class="bi bi-x-lg"></i>
                <span>Hủy</span>
              </button>
              <button
                @click="saveSub"
                :disabled="!subForm.email || savingSub"
                class="px-3 lg:px-6 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i class="bi bi-check-lg"></i>
                <span>{{ savingSub ? "Đang lưu..." : "Lưu" }}</span>
              </button>
            </div>
          </div>
        </div>
        <div
          class="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50"
        >
          <button
            @click="closeSubModal"
            class="px-3 lg:px-6 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i class="bi bi-x-lg"></i>
            <span>Hủy</span>
          </button>
          <button
            @click="saveSub"
            :disabled="!subForm.email || savingSub"
            class="px-3 lg:px-6 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i class="bi bi-check-lg"></i>
            <span>{{ savingSub ? "Đang lưu..." : "Lưu" }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Import Excel Modal -->
    <div
      style="z-index: 999999 !important"
      v-if="showImportModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div
          class="flex items-center justify-between p-5 border-b border-gray-200"
        >
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              Import người đăng ký
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              Tải lên Excel hoặc dán dữ liệu
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="downloadTemplate"
              class="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <i class="bi bi-download"></i>
              Tải mẫu Excel
            </button>
            <button
              @click="showImportModal = false"
              class="p-2 hover:bg-gray-100 rounded-lg"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div class="p-6 flex-1 overflow-auto">
          <!-- File Upload Method -->
          <div class="space-y-4">
            <div class="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
              <p class="font-medium">Định dạng hỗ trợ: Excel (.xlsx, .xls)</p>
              <p>
                Dòng đầu tiên phải chứa tiêu đề: email, firstName, lastName,
                phone, company
              </p>
              <p v-if="list?.customFieldDefinitions?.length > 0" class="mt-2">
                <strong>Trường tùy chỉnh:</strong>
                {{
                  list.customFieldDefinitions.map((f) => f.fieldKey).join(", ")
                }}
              </p>
            </div>
            <div
              @drop.prevent="handleFileDrop"
              @dragover.prevent
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
              @click="$refs.fileInput.click()"
            >
              <i class="bi bi-cloud-upload text-4xl text-gray-400 mb-3"></i>
              <p class="text-gray-600">Kéo thả tệp vào đây hoặc nhấp để chọn</p>
              <p class="text-xs text-gray-400 mt-2">Tối đa 10MB</p>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept=".xlsx,.xls"
              class="hidden"
              @change="handleFileSelect"
            />
            <div
              v-if="importFileName"
              class="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
            >
              <i class="bi bi-file-earmark-check text-green-600"></i>
              <span class="text-sm text-green-700">{{ importFileName }}</span>
              <button
                @click="clearImportFile"
                class="ml-auto text-gray-400 hover:text-red-500"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50"
        >
          <div class="text-xs text-gray-500">
            Phát hiện {{ importPreviewCount }} người đăng ký
          </div>
          <div class="flex gap-2">
            <button
              @click="showImportModal = false"
              class="px-3 lg:px-6 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i class="bi bi-x-lg"></i>
              <span>Hủy</span>
            </button>
            <button
              @click="executeImport"
              :disabled="importPreviewCount === 0 || importing"
              class="px-3 lg:px-6 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i
                :class="
                  importing
                    ? 'bi bi-arrow-repeat animate-spin'
                    : 'bi bi-file-earmark-arrow-up'
                "
              ></i>
              <span>{{ importing ? "Đang import..." : "Import" }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Bulk Action Bar -->
    <div
      v-if="selectedIds.length > 0"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-xl border border-gray-200 rounded-full px-5 py-2.5 z-[100] flex items-center gap-4 animate-bounce-in"
      style="animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
    >
      <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
        <span
          class="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold"
          >{{ selectedIds.length }}</span
        >
        <span class="hidden sm:inline">đã chọn</span>
      </div>
      <div class="h-4 w-px bg-gray-200"></div>
      <button
        @click="bulkDelete"
        class="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
      >
        <i class="bi bi-trash"></i>
        <span>Xóa</span>
      </button>
      <button
        @click="selectedIds = []"
        class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors ml-1"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <!-- Cloudinary Config Modal -->
    <CloudinaryConfigModal
      v-if="showCloudinaryConfig"
      :list-id="listId"
      @close="showCloudinaryConfig = false"
      @saved="handleCloudinarySaved"
    />

    <!-- Cloudinary Media Drawer -->
    <CloudinaryMediaDrawer
      :is-visible="showMediaDrawer"
      :list-id="listId"
      @close="showMediaDrawer = false"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup>
import ConfirmModal from "~/components/ConfirmModal.vue";
import CustomFieldsManager from "~/components/email-lists/CustomFieldsManager.vue";
import CloudinaryConfigModal from "~/components/email-lists/CloudinaryConfigModal.vue";
// Cloudinary Media Drawer
import CloudinaryMediaDrawer from "~/components/email-lists/CloudinaryMediaDrawer.vue";

// Header State
const showInfoDropdown = ref(false);
const infoDropdown = ref(null);

definePageMeta({ middleware: ["auth", "permission"] });

const route = useRoute();
const listId = ref("");

onMounted(() => {
  const routeId = route.params.id;
  listId.value = String(routeId || "").trim();
  fetchSubscribers();
});

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase || "http://localhost:8000/api";
const { success, error: showError } = useToast();
const authStore = useAuthStore();
const {
  isVisible,
  confirmData,
  confirm,
  cancel,
  confirmDelete: showConfirmDelete,
} = useConfirm();

const list = ref(null);
const subscribers = ref([]);
const pagination = ref(null);
const loading = ref(false);
const selectedIds = ref([]);
const showAddSubscriber = ref(false);
const showCustomFields = ref(false);
const showCloudinaryConfig = ref(false);
const editingSub = ref(null);
const savingSub = ref(false);
const subForm = ref({
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  company: "",
  status: "active",
  customFields: {},
});

// Modal tabs
const activeTab = ref("basic");

// Cloudinary config state
const hasCloudinaryConfig = ref(false);

// Image upload state
const imageInputRefs = ref({});
const uploadingImage = ref({});

// Media drawer state
const showMediaDrawer = ref(false);
const currentFieldKey = ref("");

// Import Modal State
const showImportModal = ref(false);
const importFileName = ref("");
const importData = ref("");
const importing = ref(false);
const parsedImportData = ref([]);

const filters = ref({ search: "", status: "", page: 1, limit: 50 });

const allSelected = computed(
  () =>
    subscribers.value.length > 0 &&
    selectedIds.value.length === subscribers.value.length,
);

// Computed for import preview count
const importPreviewCount = computed(() => {
  return parsedImportData.value.length;
});

let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.page = 1;
    fetchSubscribers();
  }, 500);
};

const getAuthHeaders = async () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authStore.accessToken}`,
  };
};

const checkCloudinaryConfig = async () => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/email-lists/${listId.value}/cloudinary-config`,
      {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      },
    );
    const data = await response.json();

    if (data.success && data.data) {
      hasCloudinaryConfig.value = !!(data.data.cloudName || data.data.apiKey);
    } else {
      hasCloudinaryConfig.value = false;
    }
  } catch (error) {
    hasCloudinaryConfig.value = false;
  }
};

const fetchSubscribers = async () => {
  loading.value = true;
  try {
    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    Object.entries(filters.value).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });

    const response = await fetch(
      `${apiBaseUrl}/email-lists/${listId.value}?${params}`,
      { headers },
    );
    const data = await response.json();

    if (data.success) {
      list.value = data.data;
      subscribers.value = data.data.subscribers || [];
      pagination.value = data.data.subscribersPagination;
    }

    // Check Cloudinary config
    await checkCloudinaryConfig();
  } catch (error) {
    console.error("Error:", error);
    showError("Tải dữ liệu thất bại");
  } finally {
    loading.value = false;
  }
};

const saveSub = async () => {
  if (!subForm.value.email) return;
  savingSub.value = true;
  try {
    const headers = await getAuthHeaders();
    const url = editingSub.value
      ? `${apiBaseUrl}/email-lists/${listId.value}/subscribers/${editingSub.value._id}`
      : `${apiBaseUrl}/email-lists/${listId.value}/subscribers`;

    const response = await fetch(url, {
      method: editingSub.value ? "PUT" : "POST",
      headers,
      body: JSON.stringify(subForm.value),
    });

    const data = await response.json();
    if (data.success) {
      success(editingSub.value ? "Cập nhật thành công!" : "Thêm thành công!");
      closeSubModal();
      fetchSubscribers();
    } else {
      showError(data.message);
    }
  } catch (error) {
    showError("Lưu thất bại");
  } finally {
    savingSub.value = false;
  }
};

const deleteSubscriber = async (subId) => {
  const confirmed = await showConfirmDelete("người đăng ký này");
  if (!confirmed) return;

  try {
    const headers = await getAuthHeaders();
    await fetch(
      `${apiBaseUrl}/email-lists/${listId.value}/subscribers/${subId}`,
      { method: "DELETE", headers },
    );
    success("Đã xóa thành công!");
    fetchSubscribers();
  } catch (error) {
    showError("Xóa thất bại");
  }
};

const bulkDelete = async () => {
  const confirmed = await showConfirmDelete(
    `${selectedIds.value.length} người đăng ký`,
  );
  if (!confirmed) return;

  try {
    const headers = await getAuthHeaders();
    await fetch(
      `${apiBaseUrl}/email-lists/${listId.value}/subscribers/bulk-delete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ subscriberIds: selectedIds.value }),
      },
    );
    success("Đã xóa thành công!");
    selectedIds.value = [];
    fetchSubscribers();
  } catch (error) {
    showError("Xóa thất bại");
  }
};

const editSubscriber = (sub) => {
  editingSub.value = sub;

  // Convert customFields Map to plain object
  let customFieldsObj = {};
  if (sub.customFields) {
    if (sub.customFields instanceof Map) {
      customFieldsObj = Object.fromEntries(sub.customFields);
    } else if (typeof sub.customFields === "object") {
      customFieldsObj = { ...sub.customFields };
    }
  }

  subForm.value = {
    ...sub,
    customFields: customFieldsObj,
  };
  showAddSubscriber.value = true;
};

const closeSubModal = () => {
  showAddSubscriber.value = false;
  editingSub.value = null;
  activeTab.value = "basic";
  subForm.value = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    status: "active",
    customFields: {},
  };
};

const handleImageUpload = async (event, fieldKey) => {
  const file = event.target.files?.[0];
  if (!file) return;

  uploadingImage.value[fieldKey] = true;

  try {
    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);

    await new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Image = reader.result;

          // Upload to Cloudinary via backend
          const response = await $fetch(
            `${apiBaseUrl}/email-lists/${listId.value}/upload-image`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authStore.accessToken}`,
              },
              body: JSON.stringify({ image: base64Image }),
            },
          );

          if (response.success) {
            subForm.value.customFields[fieldKey] = response.data.url;
            success("Upload ảnh thành công!");
            resolve();
          } else {
            throw new Error(response.message || "Upload thất bại");
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
    });
  } catch (error) {
    showError(
      error.message ||
        "Upload ảnh thất bại. Vui lòng kiểm tra cấu hình Cloudinary.",
    );
  } finally {
    uploadingImage.value[fieldKey] = false;
    // Reset input
    if (imageInputRefs.value[fieldKey]) {
      imageInputRefs.value[fieldKey].value = "";
    }
  }
};

const toggleSelectAll = (e) => {
  selectedIds.value = e.target.checked
    ? subscribers.value.map((s) => s._id)
    : [];
};

const changePage = (page) => {
  filters.value.page = page;
  fetchSubscribers();
};

const getStatusClass = (status) => {
  const statusMap = {
    active: "bg-green-100 text-green-700",
    unsubscribed: "bg-red-100 text-red-700",
    bounced: "bg-yellow-100 text-yellow-700",
  };
  return statusMap[status] || "bg-gray-100 text-gray-700";
};

const getStatusText = (status) =>
  ({
    active: "Hoạt động",
    unsubscribed: "Hủy đăng ký",
    bounced: "Lỗi gửi",
  })[status] || status;

// Import Functions
const handleFileSelect = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  importFileName.value = file.name;

  try {
    const XLSX =
      await import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Parse with dynamic custom fields
    const results = [];
    for (const row of jsonData) {
      const email = String(row.email || "")
        .trim()
        .toLowerCase();
      if (email && email.includes("@")) {
        const subscriber = {
          email,
          firstName: String(row.firstName || "").trim(),
          lastName: String(row.lastName || "").trim(),
          phone: String(row.phone || "").trim(),
          company: String(row.company || "").trim(),
          customFields: {},
        };

        // Add custom fields if they exist in the list definition
        if (list.value?.customFieldDefinitions) {
          for (const field of list.value.customFieldDefinitions) {
            if (
              row[field.fieldKey] !== undefined &&
              row[field.fieldKey] !== null &&
              row[field.fieldKey] !== ""
            ) {
              subscriber.customFields[field.fieldKey] = String(
                row[field.fieldKey],
              ).trim();
            }
          }
        }

        results.push(subscriber);
      }
    }
    parsedImportData.value = results;
    success(`Đã đọc ${results.length} người đăng ký từ file`);
  } catch (err) {
    console.error("Error reading file:", err);
    showError("Không thể đọc file Excel");
    clearImportFile();
  }
};

const handleFileDrop = (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file) {
    handleFileSelect({ target: { files: [file] } });
  }
};

const clearImportFile = () => {
  importFileName.value = "";
  parsedImportData.value = [];
};

const downloadTemplate = async () => {
  const XLSX =
    await import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");

  // Base headers
  const headers = ["email", "firstName", "lastName", "phone", "company"];
  const colWidths = [
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
  ];

  // Add custom field headers
  if (list.value?.customFieldDefinitions) {
    for (const field of list.value.customFieldDefinitions) {
      headers.push(field.fieldKey);
      colWidths.push({ wch: 20 });
    }
  }

  // Sample data with custom fields
  const sampleRow1 = [
    "user1@example.com",
    "Nguyen",
    "Van A",
    "0901234567",
    "ABC Corp",
  ];
  const sampleRow2 = [
    "user2@example.com",
    "Tran",
    "Thi B",
    "0912345678",
    "XYZ Ltd",
  ];

  // Add sample custom field values
  if (list.value?.customFieldDefinitions) {
    for (const field of list.value.customFieldDefinitions) {
      sampleRow1.push(field.defaultValue || `Sample ${field.fieldName}`);
      sampleRow2.push(field.defaultValue || `Sample ${field.fieldName}`);
    }
  }

  const sampleData = [sampleRow1, sampleRow2];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
  ws["!cols"] = colWidths;
  XLSX.utils.book_append_sheet(wb, ws, "Subscribers");
  XLSX.writeFile(wb, `${list.value?.name || "subscribers"}_template.xlsx`);
};

const executeImport = async () => {
  const dataToImport = parsedImportData.value;

  if (dataToImport.length === 0) {
    showError("Không có dữ liệu để import");
    return;
  }

  importing.value = true;
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${apiBaseUrl}/email-lists/${listId.value}/subscribers/bulk`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ subscribers: dataToImport }),
      },
    );

    const data = await response.json();
    if (data.success === true) {
      success(
        data.message ||
          `Đã import ${data.data?.added || dataToImport.length} người đăng ký!`,
      );
      showImportModal.value = false;
      importData.value = "";
      clearImportFile();
      fetchSubscribers();
    } else {
      showError(data.message || "Import thất bại");
    }
  } catch (err) {
    console.error("Import error:", err);
    showError("Lỗi khi import");
  } finally {
    importing.value = false;
  }
};
const handleCloudinarySaved = async () => {
  showCloudinaryConfig.value = false;
  await checkCloudinaryConfig();
  fetchSubscribers();
};

const openMediaDrawer = (fieldKey) => {
  currentFieldKey.value = fieldKey;
  showMediaDrawer.value = true;
};

const handleMediaSelect = (imageUrl) => {
  subForm.value.customFields[currentFieldKey.value] = imageUrl;
  showMediaDrawer.value = false;
  currentFieldKey.value = "";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getFieldIcon = (fieldType) => {
  const icons = {
    text: "bi bi-textarea-t",
    number: "bi bi-hash",
    email: "bi bi-envelope",
    phone: "bi bi-telephone",
    url: "bi bi-link-45deg",
    date: "bi bi-calendar",
    image: "bi bi-image",
  };
  return icons[fieldType] || "bi bi-input-cursor";
};

const navigateBack = () => {
  navigateTo({
    path: "/email-lists",
    query: { open_list_id: listId.value },
  });
};

onMounted(() => {
  fetchSubscribers();

  // Click outside listener for info dropdown
  document.addEventListener("click", (e) => {
    if (infoDropdown.value && !infoDropdown.value.contains(e.target)) {
      showInfoDropdown.value = false;
    }
  });
});
</script>
