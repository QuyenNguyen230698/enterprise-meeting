<template>
  <div class="email-lists-theme flex flex-col w-full h-full overflow-hidden items-center bg-slate-50">
    <ToastContainer />
    
    <!-- Confirm Modal -->
    <ConfirmModal
      :is-visible="isVisible"
      :title="confirmData.title || 'Xác nhận'"
      :subtitle="confirmData.subtitle || ''"
      :message="confirmData.message || 'Bạn có chắc chắn muốn thực hiện hành động này?'"
      :confirm-text="confirmData.confirmText"
      :cancel-text="confirmData.cancelText"
      :type="confirmData.type"
      :loading="confirmData.loading"
      :loading-text="confirmData.loadingText"
      @confirm="confirm"
      @cancel="cancel"
    />

    <!-- Campaign Detail Modal -->
    <CampaignDetailModal
      :is-visible="showCampaignDetailModal"
      :campaign="selectedCampaignForDetail"
      @close="closeCampaignDetail"
      @refresh="fetchCampaigns"
    />

    <!-- Send Options Modal -->
    <div v-if="showSendOptionsModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" @click="closeSendOptionsModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[85dvh] overflow-y-auto z-10">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
              Chọn chế độ gửi
            </h3>
            
            <div class="space-y-4">
              <!-- Multi Thread Option -->
              <label class="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="{'border-teal-500 bg-teal-50': sendingMode === 'multi'}">
                <div class="flex items-center h-5">
                  <input type="radio" v-model="sendingMode" value="multi" class="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300">
                </div>
                <div class="ml-3 text-sm">
                  <span class="block font-medium text-gray-900" :class="{'text-teal-700': sendingMode === 'multi'}">Gửi đa luồng (Khuyên dùng)</span>
                  <span class="block text-gray-500 mt-1">Tự động phân phối email qua tất cả các cấu hình đang hoạt động để tối ưu tốc độ và hạn mức.</span>
                </div>
              </label>

              <!-- Single Thread Option -->
              <label class="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="{'border-teal-500 bg-teal-50': sendingMode === 'single'}">
                <div class="flex items-center h-5">
                  <input type="radio" v-model="sendingMode" value="single" class="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300">
                </div>
                <div class="ml-3 text-sm">
                  <span class="block font-medium text-gray-900" :class="{'text-teal-700': sendingMode === 'single'}">Gửi đơn luồng</span>
                  <span class="block text-gray-500 mt-1">Chỉ sử dụng cấu hình email mặc định. <strong>Yêu cầu email đã được xác minh (Verified).</strong></span>
                </div>
              </label>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="proceedToSend"
            >
              Tiếp tục
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeSendOptionsModal"
            >
              Hủy
            </button>
          </div>
        </div>
    </div>

    <!-- Email Distribution Plan Modal -->
    <div v-if="showDistributionModal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" @click="closeDistributionModal"></div>

      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85dvh] overflow-hidden flex flex-col z-10">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto flex-1">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Kế hoạch gửi email
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 mb-4">
                    Hệ thống sẽ phân phối {{ distributionPlan?.totalRecipients }} email qua {{ distributionPlan?.availableConfigs }} email configs.
                  </p>
                  
                  <!-- Subscription Limits Info -->
                  <div v-if="distributionPlan?.userQuota" class="bg-linear-to-r from-lime-50 to-teal-50 border border-lime-200 rounded-xl p-4 mb-6">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                          <i class="bi bi-speedometer2 text-lime-600 text-lg"></i>
                        </div>
                        <div class="text-sm">
                          <p class="font-semibold text-lime-900 mb-1">Giới hạn gửi trong ngày</p>
                          <p class="text-lime-700">
                            Hôm nay: <span class="font-bold">{{ distributionPlan.userQuota.emailsSentToday || 0 }}</span> / <span class="font-bold">{{ distributionPlan.userQuota.dailyEmailLimit || 50 }}</span> emails
                            <span class="text-lime-500 ml-2">({{ Math.round(((distributionPlan.userQuota.emailsSentToday || 0) / (distributionPlan.userQuota.dailyEmailLimit || 50)) * 100) }}%)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <!-- Progress Bar -->
                    <div class="mt-3 w-full bg-lime-200 rounded-full h-2">
                      <div 
                        class="bg-lime-600 h-2 rounded-full transition-all duration-500"
                        :style="{ width: Math.min(100, Math.round(((distributionPlan.userQuota.emailsSentToday || 0) / (distributionPlan.userQuota.dailyEmailLimit || 50)) * 100)) + '%' }"
                      ></div>
                    </div>
                  </div>

                  <!-- Sender Name (Alias) -->
                  <div class="mb-5">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tên người gửi (Alias) <span class="text-red-500">*</span></label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="bi bi-person text-gray-400"></i>
                        </div>
                        <input 
                            type="text" 
                            v-model="customSenderName" 
                            class="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" 
                            placeholder="Ví dụ: Marketing Team (Bắt buộc)"
                            :class="{'border-red-300': showSenderNameError}"
                            @input="showSenderNameError = false"
                        >
                    </div>
                     <p v-if="showSenderNameError" class="mt-1 text-xs text-red-600">Vui lòng nhập tên người gửi.</p>
                     <p v-else class="mt-1 text-xs text-gray-500">Tên này sẽ hiển thị là người gửi email.</p>
                  </div>

                  <!-- Quota Summary -->
                  <div class="bg-teal-50 rounded-lg p-3 mb-4">
                    <div class="flex justify-between items-center text-sm mb-1">
                      <span class="text-gray-600">Tổng quota còn lại:</span>
                      <span class="font-bold text-teal-700">{{ distributionPlan?.totalQuotaRemaining }} emails</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-gray-600">Tổng số người nhận:</span>
                      <span class="font-bold text-gray-900">{{ distributionPlan?.totalRecipients }} người</span>
                    </div>
                  </div>

                  <!-- Distribution Table -->
                  <div class="border rounded-lg overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                            Sử dụng
                          </th>
                          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Config</th>
                          <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sẽ gửi ({{ distributionPlan?.totalRecipients || 0 }})</th>
                          <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quota còn lại</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="item in paginatedDistribution" :key="item.emailConfigId" :class="{'bg-gray-50': isExcluded(item.emailConfigId)}">
                          <td class="px-3 py-2">
                             <input 
                               type="checkbox" 
                               :checked="!isExcluded(item.emailConfigId)"
                               @click.prevent="toggleConfig(item.emailConfigId)"
                               class="rounded border-gray-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 cursor-pointer"
                             >
                          </td>
                          <td class="px-3 py-2 text-sm text-gray-900">
                            {{ item.name }}
                            <span v-if="isExcluded(item.emailConfigId)" class="ml-2 text-xs text-red-500 italic">(Đã tắt)</span>
                          </td>
                          <td class="px-3 py-2 text-sm text-right font-medium">
                            <div v-if="isExcluded(item.emailConfigId)">-</div>
                            <div v-else class="flex items-center justify-end gap-2">
                                <input 
                                    type="number" 
                                    v-model.number="manualDistribution[item.emailConfigId]" 
                                    min="0"
                                    :max="item.remaining"
                                    class="w-20 text-right text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 py-1"
                                    :class="{'border-red-300 bg-red-50': (manualDistribution[item.emailConfigId] || 0) > item.remaining}"
                                >
                            </div>
                          </td>
                          <td class="px-3 py-2 text-sm text-right text-gray-500">
                             {{ isExcluded(item.emailConfigId) ? '-' : item.remaining }}
                          </td>
                        </tr>
                      </tbody>
                      <!-- Footer for Totals -->
                      <tfoot class="bg-gray-50 font-semibold text-gray-900 text-xs">
                        <tr>
                            <td colspan="2" class="px-3 py-2 text-right">Tổng cộng:</td>
                            <td class="px-3 py-2 text-right" :class="{'text-red-600': totalManualAssigned !== (distributionPlan?.totalRecipients || 0)}">
                                {{ totalManualAssigned }} / {{ distributionPlan?.totalRecipients || 0 }}
                            </td>
                            <td class="px-3 py-2"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <!-- Manual Distribution Error -->
                  <div v-if="totalManualAssigned !== (distributionPlan?.totalRecipients || 0)" class="mt-2 text-xs text-red-600 flex items-center gap-1 justify-end">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    Tổng số lượng gửi ({{ totalManualAssigned }}) chưa khớp với tổng recipients ({{ distributionPlan?.totalRecipients || 0 }}).
                  </div>

                  <!-- Pagination -->
                  <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-2">
                    <div class="flex flex-1 justify-between sm:hidden">
                      <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Trước</button>
                      <button @click="nextPage" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Sau</button>
                    </div>
                    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p class="text-sm text-gray-700">
                          Trang <span class="font-medium">{{ currentPage }}</span> / <span class="font-medium">{{ totalPages }}</span>
                        </p>
                      </div>
                      <div>
                        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                            <span class="sr-only">Previous</span>
                            <i class="bi bi-chevron-left"></i>
                          </button>
                          <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                            <span class="sr-only">Next</span>
                            <i class="bi bi-chevron-right"></i>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Add Config Shortcut -->
                  <div class="mt-4 text-right">
                    <NuxtLink to="/settings/email-config" class="text-sm text-teal-600 hover:text-teal-800 underline">
                      <i class="bi bi-gear-fill mr-1"></i> Quản lý Email Configs
                    </NuxtLink>
                  </div>
                </div>

          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              @click="confirmDistributionAndSend"
              :disabled="sendingDistribution || totalManualAssigned !== (distributionPlan?.totalRecipients || 0)"
            >
              <i v-if="sendingDistribution" class="bi bi-arrow-repeat animate-spin mr-2"></i>
              {{ sendingDistribution ? 'Đang xử lý...' : 'Xác nhận & Gửi' }}
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeDistributionModal"
            >
              Hủy
            </button>
          </div>
        </div>
    </div>

    <!-- Header -->
    <div class="w-full px-4 sm:px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 z-10 shadow-sm sticky top-0">
        <div class="flex w-full items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 bg-linear-to-br from-emerald-400 via-teal-400 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <i class="bi bi-people text-white text-base sm:text-lg"></i>
            </div>
            <div class="min-w-0">
              <h1 class="text-lg sm:text-xl font-bold text-slate-900 truncate">Danh Sách Email</h1>
            </div>
          </div>
          
          <div class="flex items-center gap-2 md:gap-3">
            <!-- Email Config Button -->
             <NuxtLink 
               to="/settings/email-config"
               class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
               :class="!hasPrimaryEmail && emailConfigs.length === 0 
                 ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' 
                 : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'"
             >
               <i class="bi" :class="!hasPrimaryEmail && emailConfigs.length === 0 ? 'bi-exclamation-triangle-fill' : 'bi-gear-fill'"></i>
               <span class="hidden sm:inline">Cấu hình Email</span>
             </NuxtLink>

            <!-- Report Button -->
            <NuxtLink
              to="/email-lists/report"
              class="p-1.5 md:p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              title="Xem báo cáo"
            >
              <i class="bi bi-graph-up-arrow text-base"></i>
            </NuxtLink>

            <!-- Action Button -->
            <button
              @click="showCreateModal = true"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-700 hover:via-teal-700 hover:to-lime-700 text-white rounded-lg transition-all text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <i class="bi bi-plus-lg"></i>
              <span class="hidden sm:inline">Tạo mới</span>
            </button>
          </div>
        </div>
    </div>


    <!-- Main Content - 2 Column Layout -->
    <div class="flex w-full px-4 lg:px-6 py-5 gap-6 flex-1 min-h-0">

      <!-- Left Sidebar - Lists Panel -->
      <div 
        class="border-r border-slate-200/60 bg-white/80 backdrop-blur-sm flex flex-col shrink-0 transition-all duration-300 rounded-2xl shadow-sm"
        :class="[
          // Mobile: full width or hidden based on mobileView
          mobileView === 'lists' ? 'w-full' : 'hidden',
          // Tablet & Desktop: show sidebar
          'md:block md:w-72 lg:w-80'
        ]"
      >
        <!-- Sidebar Header -->
        <div class="p-5 border-b border-slate-100">
          <div class="relative">
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Tìm kiếm danh sách..."
              class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-slate-50/50 placeholder:text-slate-400 font-medium transition-all"
            />
            <i class="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          </div>
          <!-- <div class="flex items-center justify-between mt-3">
            <select
              v-model="filters.sortBy"
              @change="fetchLists"
              class="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
            >
              <option value="createdAt">Mới nhất</option>
              <option value="name">Tên A-Z</option>
              <option value="stats.totalSubscribers">Nhiều nhất</option>
            </select>
            <span class="text-xs text-gray-500">{{ pagination?.total || 0 }} danh sách</span>
          </div> -->
        </div>

        <!-- Lists -->
        <div class="flex-1 overflow-y-auto">
          <!-- Loading -->
          <div v-if="loading && !lists.length" class="p-4 space-y-3">
            <div v-for="n in 5" :key="n" class="animate-pulse">
              <div class="h-16 bg-gray-100 rounded-lg"></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!lists.length" class="p-6 text-center">
            <i class="bi bi-inbox text-4xl text-gray-300"></i>
            <p class="text-sm text-gray-500 mt-2">Chưa có danh sách nào</p>
            <button @click="showCreateModal = true" class="mt-3 text-sm text-green-600 hover:text-green-700 font-medium">
              + Tạo danh sách đầu tiên
            </button>
          </div>

          <!-- List Items -->
          <div v-else class="p-3">
            <div
              v-for="list in lists"
              :key="list._id"
              @click="selectList(list)"
              class="p-3.5 rounded-xl cursor-pointer mb-2 transition-all duration-200 group"
              :class="selectedList?._id === list._id 
                ? 'bg-linear-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 shadow-sm' 
                : 'hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-200'"
            >
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-slate-900 text-sm truncate flex-1" :class="selectedList?._id === list._id ? 'text-emerald-900' : ''">{{ list.name }}</h4>
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                  {{ getListCampaigns(list._id).length }}
                </span>              
              </div>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="text-xs text-slate-600 truncate line-clamp-2">{{ list.description || 'Không có mô tả' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Footer - Pagination -->
        <div v-if="pagination && pagination.totalPages > 1" class="p-4 border-t border-slate-100 bg-slate-50/50">
          <div class="flex items-center justify-between">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="bi bi-chevron-left text-sm text-slate-600"></i>
            </button>
            <span class="text-xs text-slate-700 font-medium">{{ pagination.page }} / {{ pagination.totalPages }}</span>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="bi bi-chevron-right text-sm text-slate-600"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel - Main Content -->
      <div 
        class="flex-1 flex flex-col overflow-hidden"
        :class="[
          // Mobile: full width or hidden based on mobileView
          mobileView === 'detail' ? 'flex' : 'hidden',
          // Tablet & Desktop: always show
          'md:flex'
        ]"
      >
        

        <!-- No List Selected -->
        <div v-if="!selectedList" class="flex-1 flex items-center justify-center">
          <div class="text-center max-w-sm">
            <div class="w-24 h-24 bg-linear-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
              <i class="bi bi-hand-index text-4xl text-emerald-600"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Chọn một danh sách</h3>
            <p class="text-sm text-slate-500 leading-relaxed">Chọn danh sách từ bên trái để xem chi tiết và quản lý chiến dịch</p>
          </div>
        </div>

        <!-- Selected List Content -->
        <div v-else class="flex-1 overflow-y-auto">
          <!-- List Header -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 md:p-5 mb-5 md:mb-6">
            <div class="flex items-center gap-2 sm:gap-3">
              <!-- Mobile Back Button -->
              <button 
                @click="mobileView = 'lists'; selectedList = null"
                class="md:hidden p-2 -ml-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all shrink-0"
                title="Quay lại danh sách"
              >
                <i class="bi bi-arrow-left text-lg"></i>
              </button>
              
              <!-- List Name (clickable) -->
              <div @click="viewList(selectedList._id)" class="min-w-0 flex-1 cursor-pointer group max-w-[60%] sm:max-w-none">
                <h3 class="text-lg md:text-xl font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                  {{ selectedList.name }}
                  <i class="bi bi-box-arrow-up-right text-xs text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </h3>
                <p class="text-xs text-slate-500 line-clamp-2 group-hover:text-emerald-500 transition-colors">{{ selectedList.description || 'Không có mô tả' }}</p>
              </div>
              
              <!-- Stats Badge -->
              <span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 shrink-0">
                <i class="bi bi-people mr-1"></i>{{ selectedList.stats?.totalSubscribers || 0 }}
              </span>
              
              <!-- 3-dot Dropdown Menu -->
              <div class="relative shrink-0" ref="listActionDropdown">
                <button 
                  @click="showListActionMenu = !showListActionMenu"
                  class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                  title="Tùy chọn"
                >
                  <i class="bi bi-three-dots-vertical text-lg"></i>
                </button>
                
                <!-- Dropdown -->
                <div 
                  v-if="showListActionMenu" 
                  class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 min-w-[160px] z-20"
                >
                  <button 
                    @click="viewList(selectedList._id); showListActionMenu = false"
                    class="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                  >
                    <i class="bi bi-eye text-emerald-500"></i>
                    <span>Xem chi tiết</span>
                  </button>
                  <button 
                    @click="editList(selectedList); showListActionMenu = false"
                    class="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700"
                  >
                    <i class="bi bi-pencil text-amber-500"></i>
                    <span>Chỉnh sửa</span>
                  </button>
                  <div class="border-t border-slate-100 my-1"></div>
                  <button 
                    @click="confirmDeleteList(selectedList._id, selectedList.name); showListActionMenu = false"
                    class="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600"
                  >
                    <i class="bi bi-trash"></i>
                    <span>Xóa danh sách</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Campaigns Section -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <!-- Campaigns Header -->
            <div class="p-4 md:p-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="flex items-center gap-3">
                  <h3 class="font-bold text-slate-900 text-lg">Chiến dịch</h3>
                  <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                    {{ selectedListCampaigns.length }}
                  </span>
                </div>
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="relative flex-1 sm:flex-none">
                    <input
                      v-model="campaignSearch"
                      type="text"
                      placeholder="Tìm kiếm..."
                      class="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl w-full sm:w-48 lg:w-56 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white placeholder:text-slate-400 font-medium transition-all"
                    />
                    <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  </div>
                  <button
                    @click="openCampaignModal(selectedList._id)"
                    class="px-3 py-1.5 sm:px-4 sm:py-2 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md whitespace-nowrap hover:-translate-y-0.5 flex items-center gap-1.5"
                  >
                    <i class="bi bi-plus-lg"></i><span class="hidden sm:inline">Tạo mới</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Campaigns List -->
            <div class="divide-y divide-slate-100">
              <!-- No Campaigns -->
              <div v-if="!filteredSelectedListCampaigns.length" class="p-16 text-center">
                <div class="w-20 h-20 bg-linear-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/10">
                  <i class="bi bi-megaphone text-3xl text-emerald-600"></i>
                </div>
                <p class="text-slate-600 font-medium mt-3 mb-5">{{ campaignSearch ? 'Không tìm thấy chiến dịch' : 'Chưa có chiến dịch nào' }}</p>
                <button
                  v-if="!campaignSearch"
                  @click="openCampaignModal(selectedList._id)"
                  class="px-6 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
                >
                  <i class="bi bi-plus mr-2"></i>Tạo chiến dịch đầu tiên
                </button>
              </div>

              <!-- Campaign Items -->
              <div
                v-for="campaign in paginatedCampaigns"
                :key="campaign._id"
                class="p-4 md:p-5 hover:bg-linear-to-r hover:from-slate-50/50 hover:to-transparent transition-all duration-200 border-l-4 border-transparent hover:border-emerald-200"
              >
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2.5 mb-2 flex-wrap">
                      <span :class="getStatusClass(campaign.status)" class="px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0">
                        {{ getStatusLabel(campaign.status) }}
                      </span>
                      <h4 class="font-semibold text-slate-900 truncate text-sm md:text-base">{{ campaign.name }}</h4>
                    </div>
                    <p class="text-sm text-slate-600 truncate mb-2.5 font-medium">{{ campaign.subject }}</p>
                    <div class="flex items-center gap-4 md:gap-5 text-xs text-slate-500 flex-wrap">
                      <span class="flex items-center gap-1.5"><i class="bi bi-envelope-open text-emerald-600"></i><strong class="text-emerald-600">{{ campaign.stats?.openRate || 0 }}%</strong> mở</span>
                      <span class="flex items-center gap-1.5"><i class="bi bi-cursor text-emerald-600"></i><strong class="text-emerald-600">{{ campaign.stats?.clickRate || 0 }}%</strong> click</span>
                    </div>
                  </div>
                  <!-- Actions - horizontal on all screens -->
                  <div class="flex items-center gap-1.5 sm:gap-2 sm:ml-4">
                    <button @click="openCampaignDetail(campaign)" class="p-2 sm:p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Chi tiết">
                      <i class="bi bi-eye text-sm"></i>
                    </button>
                    <button @click="viewAnalytics(campaign._id)" class="p-2 sm:p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Thống kê">
                      <i class="bi bi-bar-chart text-sm"></i>
                    </button>
                    <button 
                      v-if="campaign.status === 'completed' || campaign.status === 'sent'"
                      @click="openExportModal(campaign)" 
                      class="p-2 sm:p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all" 
                      title="Export dữ liệu"
                    >
                      <i class="bi bi-download text-sm"></i>
                    </button>
                    <button @click="deleteCampaign(campaign._id, campaign.name)" class="p-2 sm:p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Xóa">
                      <i class="bi bi-trash text-sm"></i>
                    </button>
                    <button
                      v-if="campaign.status !== 'sending'"
                      title="Gửi Campaign"
                      @click="openSendOptions(campaign)"
                      :disabled="sendingCampaignIds.has(campaign._id)"
                      :class="[
                        sendingCampaignIds.has(campaign._id) 
                          ? 'bg-slate-400 cursor-not-allowed' 
                          : campaign.status === 'draft' 
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm' 
                            : 'bg-teal-600 hover:bg-teal-700 shadow-sm'
                      ]"
                      class="px-2.5 py-1.5 sm:px-3 sm:py-2 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 hover:-translate-y-0.5 flex items-center gap-1.5"
                    >
                      <i 
                        :class="sendingCampaignIds.has(campaign._id) ? 'bi-hourglass-split animate-spin' : (campaign.status === 'draft' ? 'bi-send' : 'bi-arrow-repeat')" 
                        class="bi"
                      ></i>
                      <span class="hidden sm:inline">
                        {{ 
                          sendingCampaignIds.has(campaign._id) 
                            ? '...' 
                            : campaign.status === 'draft' 
                              ? 'Gửi' 
                              : 'Gửi Lại' 
                        }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Campaigns Pagination -->
            <div v-if="campaignTotalPages > 1" class="p-3 md:p-4 border-t border-gray-100 bg-gray-50">
              <div class="flex items-center justify-between">
                <span class="text-xs sm:text-sm text-gray-600">
                  {{ (campaignPage - 1) * campaignsPerPage + 1 }}-{{ Math.min(campaignPage * campaignsPerPage, filteredSelectedListCampaigns.length) }} / {{ filteredSelectedListCampaigns.length }}
                </span>
                <div class="flex items-center gap-2">
                  <button
                    @click="campaignPage = Math.max(1, campaignPage - 1)"
                    :disabled="campaignPage <= 1"
                    class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <span class="text-sm text-gray-600">{{ campaignPage }} / {{ campaignTotalPages }}</span>
                  <button
                    @click="campaignPage = Math.min(campaignTotalPages, campaignPage + 1)"
                    :disabled="campaignPage >= campaignTotalPages"
                    class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit List Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85dvh] overflow-y-auto border border-slate-200/60">
        <div class="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {{ editingList ? 'Chỉnh sửa Danh sách' : 'Tạo Danh sách mới' }}
          </h3>
          <button @click="closeCreateModal" class="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
            <i class="bi bi-x-lg text-slate-600"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Tên danh sách *</label>
            <input
              v-model="listForm.name"
              type="text"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white placeholder:text-slate-400 font-medium transition-all"
              placeholder="VD: Người đăng ký bản tin"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Mô tả</label>
            <textarea
              v-model="listForm.description"
              rows="3"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white placeholder:text-slate-400 font-medium transition-all resize-none"
              placeholder="Mô tả ngắn gọn về danh sách này..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex items-center justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50/50">
          <button
            @click="closeCreateModal"
            class="px-6 py-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-medium transition-all"
          >
            Hủy
          </button>
          <button
            @click="saveList"
            :disabled="!listForm.name || saving"
            class="px-6 py-2.5 text-sm bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
          >
            {{ saving ? 'Đang lưu...' : (editingList ? 'Cập nhật' : 'Tạo') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div v-if="importModalVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85dvh] overflow-hidden flex flex-col">
        <div class="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Nhập người đăng ký</h3>
            <p class="text-xs text-gray-500 mt-1">Tải lên file Excel</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative" ref="templateDropdown">
              <button 
                @click="showTemplateDropdown = !showTemplateDropdown"
                class="px-3 py-2 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg text-sm font-medium flex items-center gap-2"
                title="Download sample template"
              >
                <i class="bi bi-download"></i>
                Mẫu
                <i class="bi bi-chevron-down text-xs"></i>
              </button>
              <div v-if="showTemplateDropdown" class="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border z-10 py-1 min-w-[140px]">
                <button @click="downloadTemplate('xlsx'); showTemplateDropdown = false" class="w-full px-6 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <i class="bi bi-file-earmark-excel text-green-600"></i>
                  Excel (.xls)
                </button>
                              </div>
            </div>
            <button @click="importModalVisible = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6 flex-1 overflow-auto">
          <!-- File Upload Method -->
          <div class="space-y-4">
            <div class="p-4 bg-teal-50 rounded-lg text-sm text-teal-700">
              <p class="font-medium">Định dạng hỗ trợ: Excel (.xlsx, .xls), TXT</p>
              <p>Dòng đầu tiên phải chứa tiêu đề: email, firstName, lastName, phone, company</p>
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
            <input ref="fileInput" type="file" accept=".xlsx,.xls,.txt" class="hidden" @change="handleFileSelect" />
            <div v-if="importFileName" class="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <i class="bi bi-file-earmark-check text-green-600"></i>
              <span class="text-sm text-green-700">{{ importFileName }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div class="text-xs text-gray-500">
            Phát hiện {{ importPreviewCount }} người đăng ký
          </div>
          <div class="flex gap-2">
            <button @click="importModalVisible = false" class="px-6 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <i class="bi bi-x-lg"></i>
              <span>Hủy</span>
            </button>
            <button
              @click="executeImport"
              :disabled="!importPreviewCount || importing"
              class="px-6 py-1.5 text-sm bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {{ importing ? 'Đang nhập...' : `Nhập ${importPreviewCount} người` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign Modal -->
    <div v-if="showCampaignModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-2 sm:p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90dvh] sm:max-h-[85dvh] flex flex-col">
        <div class="flex items-center justify-between p-4 sm:p-5 border-b shrink-0">
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">{{ editingCampaignId ? 'Chỉnh sửa' : 'Tạo' }} Campaign</h3>
            <p class="text-xs text-gray-500 mt-0.5">Cấu hình campaign email của bạn</p>
          </div>
          <button @click="closeCampaignModal" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div class="p-4 sm:p-5 space-y-4 overflow-auto flex-1">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">Tên Campaign *</label>
              <input v-model="campaignForm.name" type="text" class="w-full px-3 py-2.5 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-lime-500" placeholder="Summer Sale" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">Tiêu đề Email *</label>
              <input v-model="campaignForm.subject" type="text" class="w-full px-3 py-2.5 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-lime-500" placeholder="Don't miss our sale!" />
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Preheader (Preview text)</label>
            <input v-model="campaignForm.preheader" type="text" class="w-full px-3 py-2.5 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-lime-500" placeholder="This appears after subject..." />
          </div>
          
          <!-- Sender Info removed per new logic (configured at sending step) -->

          <!-- Template Selection -->
          <div class="p-3 sm:p-4 bg-lime-50 rounded-xl">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs font-semibold text-gray-700 uppercase tracking-wide">Mẫu Email</h4>
              <NuxtLink to="/templates" class="text-xs text-lime-600 hover:text-lime-700 flex items-center gap-1">
                <i class="bi bi-plus-circle"></i>Tạo mẫu mới
              </NuxtLink>
            </div>
            <div class="relative mb-3">
              <input 
                v-model="templateSearch" 
                type="text" 
                placeholder="Tìm kiếm mẫu..."
                class="w-full pl-9 pr-3 py-2.5 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-lime-500"
              />
              <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            </div>
            <div class="max-h-52 sm:max-h-48 overflow-auto">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div 
                  v-for="tpl in paginatedTemplates" 
                  :key="tpl._id" 
                  @click="campaignForm.templateId = tpl._id"
                  class="p-3 sm:p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition-all border-2"
                  :class="campaignForm.templateId === tpl._id ? 'border-lime-500 bg-lime-50' : 'border-transparent hover:border-lime-200'"
                >
                  <div class="flex items-center sm:items-start justify-between gap-3 sm:gap-0 sm:flex-col">
                    <div class="flex items-center gap-3 sm:block sm:mb-2">
                      <div class="w-10 h-10 sm:w-8 sm:h-8 bg-lime-100 rounded-lg flex items-center justify-center shrink-0">
                        <i class="bi bi-file-earmark-richtext text-lime-600"></i>
                      </div>
                      <div class="sm:hidden">
                        <h5 class="text-sm font-medium text-gray-900">{{ tpl.name }}</h5>
                        <p class="text-xs text-gray-500">{{ tpl.category || 'Chưa phân loại' }}</p>
                      </div>
                    </div>
                    <i v-if="campaignForm.templateId === tpl._id" class="bi bi-check-circle-fill text-lime-600 text-lg sm:text-base sm:absolute sm:top-2 sm:right-2"></i>
                  </div>
                  <h5 class="hidden sm:block text-sm font-medium text-gray-900 truncate">{{ tpl.name }}</h5>
                  <p class="hidden sm:block text-xs text-gray-500 mt-0.5">{{ tpl.category || 'Chưa phân loại' }}</p>
                </div>
              </div>
              <p v-if="!filteredTemplates.length" class="text-gray-400 text-sm p-4 text-center">
                {{ templates.length ? 'Không tìm thấy mẫu phù hợp' : 'Chưa có mẫu nào. Hãy tạo mẫu đầu tiên!' }}
              </p>
            </div>
            <!-- Template Pagination -->
            <div v-if="templateTotalPages > 1" class="flex items-center justify-center gap-2 mt-3 pt-3 border-t">
              <button 
                @click="templatePage = Math.max(1, templatePage - 1)" 
                :disabled="templatePage <= 1"
                class="p-2 rounded hover:bg-lime-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="bi bi-chevron-left text-sm"></i>
              </button>
              <span class="text-sm text-gray-600">{{ templatePage }} / {{ templateTotalPages }}</span>
              <button 
                @click="templatePage = Math.min(templateTotalPages, templatePage + 1)" 
                :disabled="templatePage >= templateTotalPages"
                class="p-2 rounded hover:bg-lime-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="bi bi-chevron-right text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Dynamic Fields Info -->
          <div class="p-3 bg-teal-50 rounded-xl">
            <p class="text-xs text-teal-700">
              <i class="bi bi-info-circle mr-1"></i>
              <strong>Trường động:</strong> Sử dụng <code class="bg-teal-100 px-1 rounded">&#123;&#123;firstName&#125;&#125;</code>, <code class="bg-teal-100 px-1 rounded">&#123;&#123;email&#125;&#125;</code> trong tiêu đề/mẫu.
            </p>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-4 border-t bg-gray-50 shrink-0">
          <div class="text-xs text-gray-500 text-center sm:text-left">
            <span v-if="selectedListForCampaign">Danh sách: <strong>{{ getListName(selectedListForCampaign) }}</strong></span>
          </div>
          <div class="flex gap-2">
            <button @click="closeCampaignModal" class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <i class="bi bi-x-lg"></i>
              <span>Hủy</span>
            </button>
            <button 
              @click="saveCampaign" 
              :disabled="!isCampaignFormValid || savingCampaign" 
              class="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-1.5 text-sm bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50"
            >
              {{ savingCampaign ? 'Đang lưu...' : 'Lưu chiến dịch' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div v-if="showHelpModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85dvh] flex flex-col">
        <div class="flex items-center justify-between p-5 border-b border-gray-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <i class="bi bi-book text-teal-600 text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Hướng dẫn sử dụng</h3>
              <p class="text-xs text-gray-500">Quản lý Email Lists & Chiến dịch</p>
            </div>
          </div>
          <button @click="showHelpModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div class="p-5 overflow-auto flex-1 space-y-5">
          <!-- Quick Start -->
          <div class="p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h4 class="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <i class="bi bi-lightning-charge"></i>Bắt đầu nhanh
            </h4>
            <ol class="text-sm text-green-700 space-y-1.5 list-decimal list-inside">
              <li>Tạo một <strong>Danh Sách Khách Hàng</strong> mới</li>
              <li>Nhập người đăng ký (import từ Excel hoặc thêm thủ công)</li>
              <li>Tạo một <strong>Chiến dịch</strong> cho danh sách đó</li>
              <li>Chọn mẫu email và gửi chiến dịch</li>
            </ol>
          </div>

          <!-- Features -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <h5 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <i class="bi bi-people text-green-600"></i>Quản lý Danh sách
              </h5>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Tạo nhiều danh sách riêng biệt</li>
                <li>• Import từ Excel hoặc TXT</li>
                <li>• Xem chi tiết người đăng ký</li>
                <li>• Xuất danh sách ra file</li>
              </ul>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-xl">
              <h5 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <i class="bi bi-megaphone text-lime-600"></i>Quản lý Chiến dịch
              </h5>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Tạo chiến dịch email marketing</li>
                <li>• Chọn mẫu email đã thiết kế</li>
                <li>• Theo dõi tỷ lệ mở, click</li>
                <li>• Gửi lại cho người chưa mở</li>
              </ul>
            </div>
          </div>

          <!-- Dynamic Fields -->
          <div class="p-4 bg-teal-50 rounded-xl border border-teal-200">
            <h5 class="font-medium text-teal-800 mb-2 flex items-center gap-2">
              <i class="bi bi-braces"></i>Trường động (Dynamic Fields)
            </h5>
            <p class="text-sm text-teal-700 mb-2">Sử dụng các biến sau để cá nhân hóa email:</p>
            <div class="flex flex-wrap gap-2">
              <code class="px-2 py-1 bg-white rounded text-xs text-teal-800">{{firstName}}</code>
              <code class="px-2 py-1 bg-white rounded text-xs text-teal-800">{{lastName}}</code>
              <code class="px-2 py-1 bg-white rounded text-xs text-teal-800">{{email}}</code>
              <code class="px-2 py-1 bg-white rounded text-xs text-teal-800">{{company}}</code>
              <code class="px-2 py-1 bg-white rounded text-xs text-teal-800">{{phone}}</code>
            </div>
          </div>

          <!-- Tips -->
          <div class="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h5 class="font-medium text-amber-800 mb-2 flex items-center gap-2">
              <i class="bi bi-lightbulb"></i>Mẹo hữu ích
            </h5>
            <ul class="text-sm text-amber-700 space-y-1">
              <li>• <strong>Preheader:</strong> Nội dung hiển thị sau tiêu đề trong inbox</li>
              <li>• <strong>Gửi lại:</strong> Chỉ gửi cho người chưa mở email trước đó</li>
              <li>• <strong>Mẫu:</strong> Tải mẫu Excel từ nút "Mẫu" khi import</li>
            </ul>
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
          <button 
            @click="showHelpModal = false" 
            class="w-full px-6 py-1.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>

    <!-- Export Campaign Data Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85dvh] flex flex-col">
        <div class="flex items-center justify-between p-5 border-b shrink-0">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Export Dữ Liệu Campaign</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ exportCampaign?.name }}</p>
          </div>
          <button @click="closeExportModal" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div class="p-5 space-y-4 overflow-auto flex-1">
          <!-- Loading -->
          <div v-if="exportLoading" class="flex flex-col items-center justify-center py-12">
            <div class="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
            <p class="text-gray-600">Đang tải dữ liệu...</p>
          </div>

          <!-- Export Data Summary -->
          <div v-else-if="exportData" class="space-y-4">
            <!-- Stats Cards -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ exportData.opened.length }}</div>
                <div class="text-xs text-green-700 mt-1">Đã mở email</div>
              </div>
              <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-gray-600">{{ exportData.notOpened.length }}</div>
                <div class="text-xs text-gray-700 mt-1">Chưa mở email</div>
              </div>
              <div class="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-orange-600">{{ exportData.botSuspect.length }}</div>
                <div class="text-xs text-orange-700 mt-1">
                  <i class="bi bi-exclamation-triangle mr-1"></i>Nghi ngờ Bot
                </div>
              </div>
            </div>

            <!-- Bot Warning Info -->
            <div v-if="exportData.botSuspect.length > 0" class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div class="flex items-center gap-3">
                <i class="bi bi-robot text-2xl text-orange-500"></i>
                <div>
                  <h4 class="font-semibold text-orange-800">Cảnh báo Bot Scanner</h4>
                  <p class="text-sm text-orange-700 mt-1">
                    Phát hiện <strong>{{ exportData.botSuspect.length }}</strong> email được mở trong vòng 5 phút sau khi gửi.
                    Đây có thể là bot quét email tự động, không phải người dùng thực.
                  </p>
                </div>
              </div>
            </div>

            <!-- Export Options -->
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">Chọn dữ liệu export:</h4>
              <div class="space-y-2">
                <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" v-model="exportOptions.opened" class="w-4 h-4 text-green-600 rounded">
                  <span class="flex-1">
                    <span class="font-medium text-gray-800">Khách hàng đã mở email</span>
                    <span class="text-xs text-gray-500 ml-2">({{ exportData.opened.length }} người)</span>
                  </span>
                </label>
                <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="checkbox" v-model="exportOptions.notOpened" class="w-4 h-4 text-gray-600 rounded">
                  <span class="flex-1">
                    <span class="font-medium text-gray-800">Khách hàng chưa mở email</span>
                    <span class="text-xs text-gray-500 ml-2">({{ exportData.notOpened.length }} người)</span>
                  </span>
                </label>
                <label class="flex items-center gap-3 p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100">
                  <input type="checkbox" v-model="exportOptions.botSuspect" class="w-4 h-4 text-orange-600 rounded">
                  <span class="flex-1">
                    <span class="font-medium text-orange-800">Nghi ngờ Bot (mở &lt; 5 phút)</span>
                    <span class="text-xs text-orange-600 ml-2">({{ exportData.botSuspect.length }} người)</span>
                  </span>
                </label>
              </div>
            </div>

            <!-- Preview Table -->
            <div v-if="selectedExportCount > 0" class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gray-50 px-6 py-1.5 border-b border-gray-200 flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Xem trước ({{ selectedExportCount }} dòng)</span>
              </div>
              <div class="max-h-48 overflow-auto">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th class="text-left px-3 py-2 text-gray-600 font-medium">Email</th>
                      <th class="text-left px-3 py-2 text-gray-600 font-medium">Trạng thái</th>
                      <th class="text-left px-3 py-2 text-gray-600 font-medium">Thời gian mở</th>
                      <th class="text-left px-3 py-2 text-gray-600 font-medium">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="item in previewExportData.slice(0, 10)" :key="item.email" class="hover:bg-gray-50">
                      <td class="px-3 py-2 text-gray-900">{{ item.email }}</td>
                      <td class="px-3 py-2">
                        <span :class="item.statusClass" class="px-2 py-0.5 rounded-full text-xs font-medium">
                          {{ item.statusLabel }}
                        </span>
                      </td>
                      <td class="px-3 py-2 text-gray-600 text-xs">{{ item.openedTime || '-' }}</td>
                      <td class="px-3 py-2">
                        <span v-if="item.isBot" class="text-orange-600 text-xs">
                          <i class="bi bi-exclamation-triangle mr-1"></i>Bot?
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 shrink-0">
          <span class="text-sm text-gray-600">
            Sẽ export <strong>{{ selectedExportCount }}</strong> dòng dữ liệu
          </span>
          <div class="flex gap-2">
            <button @click="closeExportModal" class="px-6 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <i class="bi bi-x-lg"></i>
              <span>Hủy</span>
            </button>
            <button
              @click="executeExport"
              :disabled="selectedExportCount === 0 || exportLoading"
              class="px-6 py-1.5 text-sm bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <i class="bi bi-file-earmark-excel"></i>
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import ConfirmModal from '~/components/ConfirmModal.vue'
import CampaignDetailModal from '~/components/email-lists/CampaignDetailModal.vue'

definePageMeta({
  middleware: ["auth", "permission"]
})

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:8000/api'
const { success, error: showError } = useToast()
const authStore = useAuthStore()
const { isVisible, confirmData, confirm, cancel, confirmDelete: showConfirmDelete, confirmResend: showConfirmResend, confirmAction } = useConfirm()

// ... (existing code)

// Distribution Modal State
const showDistributionModal = ref(false)
const distributionPlan = ref(null)
const sendingDistribution = ref(false)
const pendingCampaignId = ref(null)

// Sender Name
const customSenderName = ref('')
const showSenderNameError = ref(false)

// Excluded configs state
const excludedConfigIds = ref(new Set())
const manualDistribution = ref({})
const allDistributionItems = ref([]) // Stores the superset of all configs seen
const currentPage = ref(1)
const itemsPerPage = 5

// Computed for pagination
const totalPages = computed(() => Math.ceil(allDistributionItems.value.length / itemsPerPage))

const paginatedDistribution = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  
  // Create view model combining all items with current plan status
  const viewItems = allDistributionItems.value.map(item => {
    // If excluded, just show static info
    if (excludedConfigIds.value.has(item.emailConfigId)) {
        return item
    }
    // If active, try to find updated info from latest plan
    const updated = distributionPlan.value?.distribution?.find(d => d.emailConfigId === item.emailConfigId)
    return updated || item
  })
  
  return viewItems.slice(start, end)
})

const isExcluded = (id) => excludedConfigIds.value.has(id)

const totalManualAssigned = computed(() => {
    if (!manualDistribution.value) return 0
    return Object.entries(manualDistribution.value).reduce((sum, [id, count]) => {
        // Skip excluded IDs (though they should be removed from UI or handled by logic)
        // Actually manualDistribution might contain excluded ones if we toggled back and forth.
        // We should only count non-excluded ones.
        if (excludedConfigIds.value.has(id)) return sum
        return sum + (parseInt(count) || 0)
    }, 0)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const toggleConfig = async (configId) => {
  if (excludedConfigIds.value.has(configId)) {
    // Re-enabling a config - no check needed
    excludedConfigIds.value.delete(configId)
  } else {
    // Disabling a config - check if we have at least 1 remaining
    const activeCountAfterExclude = allDistributionItems.value.length - excludedConfigIds.value.size - 1
    if (activeCountAfterExclude < 1) {
       showError('Phải giữ ít nhất 1 email config')
       return
    }
    excludedConfigIds.value.add(configId)
  }
  
  // Re-check capacity with exclusion
  await checkSendingCapacity(pendingCampaignId.value, sendingMode.value, true)
}

// Send Options Modal State
const showSendOptionsModal = ref(false)
const sendingMode = ref('multi')
const targetCampaign = ref(null)

const openSendOptions = (campaign) => {
  // Check basic conditions first
  if (sendingCampaignIds.value.has(campaign._id) || campaign.status === 'sending') {
    return
  }
  
  targetCampaign.value = campaign
  sendingMode.value = 'multi' // Default
  showSendOptionsModal.value = true
}

const closeSendOptionsModal = () => {
  showSendOptionsModal.value = false
  targetCampaign.value = null
}

const proceedToSend = () => {
  if (targetCampaign.value) {
    const campaign = targetCampaign.value
    const mode = sendingMode.value
    closeSendOptionsModal()
    confirmSendCampaign(campaign, mode)
  }
}

const closeDistributionModal = () => {
  showDistributionModal.value = false
  distributionPlan.value = null
  pendingCampaignId.value = null
  sendingDistribution.value = false
  excludedConfigIds.value.clear()
}

const confirmDistributionAndSend = async () => {
    // Validate sender name
    if (!customSenderName.value.trim()) {
        showSenderNameError.value = true
        return
    }

    if (pendingCampaignId.value) {
        sendingDistribution.value = true
        await sendCampaign(pendingCampaignId.value, sendingMode.value)
        sendingDistribution.value = false
        showDistributionModal.value = false
    }
}

// Reusable check capacity function
const checkSendingCapacity = async (campaignId, mode, isRecheck = false) => {
  try {
    const headers = await getAuthHeaders()
    
    // FIX: Không gọi load-recipients ở đây để tránh thay đổi campaign state
    // Chỉ lấy recipient count từ campaign hiện tại
    const campaign = campaigns.value.find(c => c._id === campaignId)
    const recipientCount = campaign?.stats?.totalRecipients || campaign?.recipients?.length || 0
    
    if (recipientCount === 0) {
      showError('Campaign không có recipients nào')
      return false
    }

    const body = { 
        recipientCount, 
        mode,
        excludedConfigIds: Array.from(excludedConfigIds.value)
    }

    const valResponse = await fetch(`${apiBaseUrl}/v1/email-config/validate-capacity`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
    
    const valData = await valResponse.json()
    
    if (!valData.success) {
      if (valData.shortage) {
         showError(`Thiếu ${valData.shortage} email config. Vui lòng bật thêm config.`)
      } else {
         showError(valData.message)
      }
      return false
    }
    
    // Update plan
    distributionPlan.value = valData
    
    // Update allDistributionItems and redistribute:
    if (!isRecheck) {
        // First time: initialize everything
        allDistributionItems.value = valData.distribution || []
        manualDistribution.value = {}
        allDistributionItems.value.forEach(item => {
            manualDistribution.value[item.emailConfigId] = item.willSend || 0
        })
    } else {
        // Recheck: redistribute emails to active configs only
        const activeConfigs = valData.distribution || []
        const totalRecipients = recipientCount
        
        // Clear excluded configs from manual distribution
        excludedConfigIds.value.forEach(id => {
            manualDistribution.value[id] = 0
        })
        
        // Redistribute to active configs
        if (activeConfigs.length > 0) {
            const perConfig = Math.floor(totalRecipients / activeConfigs.length)
            const remainder = totalRecipients % activeConfigs.length
            
            activeConfigs.forEach((item, index) => {
                manualDistribution.value[item.emailConfigId] = perConfig + (index < remainder ? 1 : 0)
            })
        }
    }
    
    return true
    
  } catch (error) {
    console.error('Error validating:', error)
    showError('Lỗi kiểm tra capacity')
    return false
  }
}

const confirmSendCampaign = async (campaign, mode = 'multi') => {
  if (sendingCampaignIds.value.has(campaign._id)) return
  if (campaign.status === 'sending') {
    showError('Campaign đang được gửi')
    return
  }
  
  if (emailConfigs.value.length === 0) {
    showError('Vui lòng cấu hình email trước')
    navigateTo('/settings/email-config')
    return
  }
  
  // Resend confirm
  if (campaign.status !== 'draft') {
    const confirmed = await showConfirmResend(campaign.name, (campaign.resendCount || 0) + 1, campaign.stats?.totalRecipients || 0)
    if (!confirmed) return
  }
  
  // Reset state for new check
  excludedConfigIds.value.clear()
  currentPage.value = 1
  pendingCampaignId.value = campaign._id
  showSenderNameError.value = false
  
  // Initialize sender name
  const primaryConfig = emailConfigs.value.find(c => c.isDefault)
  if (primaryConfig && primaryConfig.sender?.name) {
    customSenderName.value = primaryConfig.sender.name
  } else if (emailConfigs.value.length > 0 && emailConfigs.value[0].sender?.name) {
     customSenderName.value = emailConfigs.value[0].sender.name
  } else {
    customSenderName.value = ''
  }
  
  // Validate
  const success = await checkSendingCapacity(campaign._id, mode)
  if (success) {
    showDistributionModal.value = true
  }
}

const sendCampaign = async (id, mode = 'multi') => {
  // Add campaign ID to sending set
  sendingCampaignIds.value.add(id)
  
  try {
    const headers = await getAuthHeaders()
    await fetch(`${apiBaseUrl}/v1/campaigns/${id}/load-recipients`, { method: 'POST', headers })
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${id}/send`, { 
        method: 'POST', 
        headers,
        body: JSON.stringify({ 
            mode,
            excludedConfigIds: Array.from(excludedConfigIds.value),
            senderName: customSenderName.value, // Pass sender name
            manualDistribution: manualDistribution.value
        })
    })
    const data = await response.json()
    
    if (data.success) {
      success('Đã bắt đầu gửi campaign!')
      fetchCampaigns()
      // Start polling for status updates
      pollCampaignStatus(id)
    } else {
      showError(data.message)
      // Remove from sending set on error
      sendingCampaignIds.value.delete(id)
    }
  } catch (error) {
    console.error('Error sending campaign:', error)
    showError('Không thể gửi campaign')
    // Remove from sending set on error
    sendingCampaignIds.value.delete(id)
    throw error // Re-throw to handle in UI
  }
}

const route = useRoute()

// State
const lists = ref([])
const pagination = ref(null)
const loading = ref(false)
const saving = ref(false)
const showCreateModal = ref(false)
const editingList = ref(null)
const listForm = ref({ name: '', description: '' })
const showHelpModal = ref(false)
const showListActionMenu = ref(false)
const listActionDropdown = ref(null)

// Campaign state
const campaigns = ref([])
const templates = ref([])
const emailConfigs = ref([])
const showCampaignModal = ref(false)
const editingCampaignId = ref(null)
const selectedListForCampaign = ref(null)
const savingCampaign = ref(false)
const expandedLists = ref([])
const templateSearch = ref('')
const templatePage = ref(1)
const templatesPerPage = 6
const sendingCampaignIds = ref(new Set())

// New 2-column layout state
const selectedList = ref(null)
const campaignSearch = ref('')
const campaignPage = ref(1)
const campaignsPerPage = 10
const mobileView = ref('lists') // 'lists' or 'detail'

const campaignForm = ref({
  name: '',
  subject: '',
  preheader: '',
  sender: { name: '', email: '', replyTo: '', cc: '', bcc: '' },
  emailListIds: [],
  templateId: ''
})

// Import state
const importModalVisible = ref(false)
const importListId = ref(null)
const importMethod = ref('paste')
const importData = ref('')
const importFileName = ref('')
const importing = ref(false)
const showTemplateDropdown = ref(false)

// Export state
const showExportModal = ref(false)
const exportCampaign = ref(null)
const exportLoading = ref(false)
const exportData = ref(null)
const exportOptions = ref({
  opened: true,
  notOpened: true,
  botSuspect: false
})

// Campaign detail modal state
const showCampaignDetailModal = ref(false)
const selectedCampaignForDetail = ref(null)

// Filters
const filters = ref({
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 12
})

// Computed
const hasPrimaryEmail = computed(() => emailConfigs.value.some(c => c.isDefault))
const primaryEmail = computed(() => emailConfigs.value.find(c => c.isDefault))

const totalSubscribers = computed(() => {
  return lists.value.reduce((sum, list) => sum + (list.stats?.totalSubscribers || 0), 0)
})

const totalCampaigns = computed(() => campaigns.value.length)

const filteredTemplates = computed(() => {
  if (!templateSearch.value) return templates.value
  const search = templateSearch.value.toLowerCase()
  return templates.value.filter(tpl => tpl.name.toLowerCase().includes(search))
})

const templateTotalPages = computed(() => Math.ceil(filteredTemplates.value.length / templatesPerPage))

const paginatedTemplates = computed(() => {
  const start = (templatePage.value - 1) * templatesPerPage
  return filteredTemplates.value.slice(start, start + templatesPerPage)
})

const isCampaignFormValid = computed(() => 
  campaignForm.value.name && 
  campaignForm.value.subject
)

const importPreviewCount = computed(() => {
  if (!importData.value.trim()) return 0
  const lines = importData.value.trim().split('\n').filter(l => l.trim())
  return Math.max(0, lines.length - 1) // Exclude header row
})

// 2-column layout computed properties
const selectedListCampaigns = computed(() => {
  if (!selectedList.value) return []
  return getListCampaigns(selectedList.value._id)
})

const filteredSelectedListCampaigns = computed(() => {
  if (!campaignSearch.value) return selectedListCampaigns.value
  const search = campaignSearch.value.toLowerCase()
  return selectedListCampaigns.value.filter(c => 
    c.name.toLowerCase().includes(search) || 
    c.subject?.toLowerCase().includes(search)
  )
})

const campaignTotalPages = computed(() => Math.ceil(filteredSelectedListCampaigns.value.length / campaignsPerPage))

const paginatedCampaigns = computed(() => {
  const start = (campaignPage.value - 1) * campaignsPerPage
  return filteredSelectedListCampaigns.value.slice(start, start + campaignsPerPage)
})

// Export computed properties
const selectedExportCount = computed(() => {
  if (!exportData.value) return 0
  let count = 0
  if (exportOptions.value.opened) count += exportData.value.opened.length
  if (exportOptions.value.notOpened) count += exportData.value.notOpened.length
  if (exportOptions.value.botSuspect) count += exportData.value.botSuspect.length
  return count
})

const previewExportData = computed(() => {
  if (!exportData.value) return []
  const items = []
  
  if (exportOptions.value.opened) {
    exportData.value.opened.forEach(item => {
      items.push({
        ...item,
        statusLabel: 'Đã mở',
        statusClass: 'bg-green-100 text-green-700',
        isBot: false
      })
    })
  }
  
  if (exportOptions.value.notOpened) {
    exportData.value.notOpened.forEach(item => {
      items.push({
        ...item,
        statusLabel: 'Chưa mở',
        statusClass: 'bg-gray-100 text-gray-700',
        isBot: false
      })
    })
  }
  
  if (exportOptions.value.botSuspect) {
    exportData.value.botSuspect.forEach(item => {
      items.push({
        ...item,
        statusLabel: 'Nghi Bot',
        statusClass: 'bg-orange-100 text-orange-700',
        isBot: true
      })
    })
  }
  
  return items
})

// Select list function
const selectList = (list) => {
  selectedList.value = list
  campaignSearch.value = ''
  campaignPage.value = 1
  // Auto switch to detail view on mobile
  mobileView.value = 'detail'
}

// Debounce search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.page = 1
    fetchLists()
  }, 500)
}

// API calls
const getAuthHeaders = async () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.accessToken}`
  }
}

const fetchLists = async () => {
  loading.value = true
  try {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    Object.entries(filters.value).forEach(([k, v]) => { if (v) params.append(k, v) })
    
    const response = await fetch(`${apiBaseUrl}/v1/email-lists?${params}`, { headers })
    const data = await response.json()
    
    if (data.success) {
      lists.value = data.data
      pagination.value = data.pagination
      // Auto-select first list if none selected
      if (!selectedList.value && data.data.length > 0) {
        selectedList.value = data.data[0]
      }
      // Update selectedList if it exists in new data
      if (selectedList.value) {
        const updated = data.data.find(l => l._id === selectedList.value._id)
        if (updated) selectedList.value = updated
      }
    }
  } catch (error) {
    console.error('Error fetching lists:', error)
    showError('Failed to load email lists')
  } finally {
    loading.value = false
  }
}

const saveList = async () => {
  if (!listForm.value.name) return
  
  saving.value = true
  try {
    const headers = await getAuthHeaders()
    const url = editingList.value 
      ? `${apiBaseUrl}/v1/email-lists/${editingList.value._id}`
      : `${apiBaseUrl}/v1/email-lists`
    
    const response = await fetch(url, {
      method: editingList.value ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify(listForm.value)
    })
    
    const data = await response.json()
    
    if (data.success) {
      success(editingList.value ? 'List updated!' : 'List created!')
      closeCreateModal()
      fetchLists()
    } else {
      showError(data.message || 'Failed to save list')
    }
  } catch (error) {
    console.error('Error saving list:', error)
    showError('Failed to save list')
  } finally {
    saving.value = false
  }
}

const deleteList = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/email-lists/${id}`, {
      method: 'DELETE',
      headers
    })
    
    const data = await response.json()
    if (data.success) {
      success('List deleted!')
      // Reset selectedList if we deleted the currently selected one
      if (selectedList.value && selectedList.value._id === id) {
        selectedList.value = null
        mobileView.value = 'lists'
      }
      fetchLists()
    }
  } catch (error) {
    console.error('Error deleting list:', error)
    showError('Failed to delete list')
  }
}

const confirmDeleteList = async (id, name) => {
  const confirmed = await showConfirmDelete(`list "${name}"`)
  if (confirmed) deleteList(id)
}

const exportList = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/email-lists/${id}/export?format=csv`, { headers })
    
    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `email-list-${id}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      success('Export downloaded!')
    }
  } catch (error) {
    console.error('Error exporting list:', error)
    showError('Failed to export list')
  }
}

const executeImport = async () => {
  if (!importPreviewCount.value || !importListId.value) return
  
  importing.value = true
  try {
    const lines = importData.value.trim().split('\n').filter(l => l.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    const subscribers = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const subscriber = {}
      headers.forEach((h, i) => {
        if (values[i]) subscriber[h] = values[i]
      })
      return subscriber
    }).filter(s => s.email)
    
    const authHeaders = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/email-lists/${importListId.value}/import`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ subscribers })
    })
    
    const data = await response.json()
    
    if (data.success) {
      success(`Imported ${data.data.added} subscribers!`)
      if (data.data.duplicates > 0) {
        showError(`${data.data.duplicates} duplicates skipped`)
      }
      importModalVisible.value = false
      importData.value = ''
      fetchLists()
    } else {
      showError(data.message || 'Import failed')
    }
  } catch (error) {
    console.error('Error importing:', error)
    showError('Import failed')
  } finally {
    importing.value = false
  }
}

// UI helpers
const editList = (list) => {
  editingList.value = list
  listForm.value = { name: list.name, description: list.description || '' }
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingList.value = null
  listForm.value = { name: '', description: '' }
}

const showImportModal = (listId) => {
  importListId.value = listId
  importData.value = ''
  importFileName.value = ''
  importModalVisible.value = true
}

const viewList = (id) => {
  navigateTo(`/email-lists/${id}`)
}

const handleFileDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file) readFile(file)
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) readFile(file)
}

const readFile = (file) => {
  importFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    importData.value = e.target.result
  }
  reader.readAsText(file)
}

const downloadTemplate = (format = 'xlsx') => {
  const headers = ['email', 'firstName', 'lastName', 'phone', 'company']
  const sampleData = [
    ['john.doe@example.com', 'John', 'Doe', '0901234567', 'ACME Corporation'],
    ['jane.smith@example.com', 'Jane', 'Smith', '0912345678', 'Tech Solutions'],
    ['bob.wilson@example.com', 'Bob', 'Wilson', '0923456789', 'Digital Agency'],
    ['alice.brown@example.com', 'Alice', 'Brown', '0934567890', 'Marketing Pro'],
    ['demo@example.com', 'Demo', 'User', '0945678901', 'Test Company']
  ]

  if (format === 'csv') {
    const csvContent = [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, 'subscribers_template.csv')
  } else {
    // Create simple Excel-compatible XML (works in Excel without external library)
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:officespreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:officespreadsheet">
  <Worksheet ss:Name="Subscribers">
    <Table>
      <Row>${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}</Row>
      ${sampleData.map(row => `<Row>${row.map(cell => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join('')}</Row>`).join('\n      ')}
    </Table>
  </Worksheet>
</Workbook>`
    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' })
    downloadBlob(blob, 'subscribers_template.xls')
  }
  success('Template downloaded!')
}

const downloadBlob = (blob, filename) => {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const changePage = (page) => {
  filters.value.page = page
  fetchLists()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Campaign functions
const fetchCampaigns = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/campaigns?limit=100`, { headers })
    const data = await response.json()
    if (data.success) campaigns.value = data.data
  } catch (error) {
    console.error('Error fetching campaigns:', error)
  }
}

const fetchTemplates = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/templates/my-templates?limit=100`, { headers })
    const data = await response.json()
    if (data.success) templates.value = data.data
  } catch (error) {
    console.error('Error fetching templates:', error)
  }
}

const fetchEmailConfigs = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/email-config`, { headers })
    const data = await response.json()
    if (data.success) emailConfigs.value = data.data
  } catch (error) {
    console.error('Error fetching email configs:', error)
  }
}

const normalizeId = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    if (value._id) return String(value._id)
    if (value.id) return String(value.id)
  }
  return String(value)
}

const getListCampaigns = (listId) => {
  const targetId = normalizeId(listId)
  return campaigns.value.filter((c) => {
    const raw = c.emailListIds
    const ids = Array.isArray(raw) ? raw : (raw ? [raw] : [])
    return ids.some((id) => normalizeId(id) === targetId)
  })
}

const getListName = (listId) => {
  const list = lists.value.find(l => l._id === listId)
  return list?.name || ''
}

const toggleListExpand = (listId) => {
  const index = expandedLists.value.indexOf(listId)
  if (index > -1) {
    expandedLists.value.splice(index, 1)
  } else {
    expandedLists.value.push(listId)
  }
}

const openCampaignModal = (listId) => {
  selectedListForCampaign.value = listId
  editingCampaignId.value = null
  campaignForm.value = {
    name: '',
    subject: '',
    preheader: '',
    sender: { 
      name: primaryEmail.value?.sender?.name || '', 
      email: primaryEmail.value?.sender?.email || '',
      replyTo: '',
      cc: '',
      bcc: ''
    },
    emailListIds: [listId],
    templateId: ''
  }
  templateSearch.value = ''
  showCampaignModal.value = true
}

const closeCampaignModal = () => {
  showCampaignModal.value = false
  editingCampaignId.value = null
  selectedListForCampaign.value = null
}

const editCampaign = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${id}`, { headers })
    const data = await response.json()
    
    if (data.success) {
      editingCampaignId.value = id
      selectedListForCampaign.value = data.data.emailListIds?.[0]?._id || data.data.emailListIds?.[0]
      campaignForm.value = {
        name: data.data.name,
        subject: data.data.subject,
        preheader: data.data.preheader || '',
        sender: { 
          name: data.data.sender?.name || '', 
          email: data.data.sender?.email || '',
          replyTo: data.data.sender?.replyTo || '',
          cc: data.data.sender?.cc || '',
          bcc: data.data.sender?.bcc || ''
        },
        emailListIds: data.data.emailListIds?.map(l => l._id || l) || [],
        templateId: data.data.templateId?._id || data.data.templateId || ''
      }
      showCampaignModal.value = true
    }
  } catch (error) {
    showError('Không thể tải campaign')
  }
}

const saveCampaign = async () => {
  savingCampaign.value = true
  try {
    const headers = await getAuthHeaders()
    const url = editingCampaignId.value 
      ? `${apiBaseUrl}/v1/campaigns/${editingCampaignId.value}` 
      : `${apiBaseUrl}/v1/campaigns`
    
    const response = await fetch(url, {
      method: editingCampaignId.value ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify(campaignForm.value)
    })
    
    const data = await response.json()
    if (data.success) {
      success(editingCampaignId.value ? 'Đã cập nhật campaign!' : 'Đã tạo campaign!')
      closeCampaignModal()
      fetchCampaigns()
    } else {
      showError(data.message)
    }
  } catch (error) {
    showError('Không thể lưu campaign')
  } finally {
    savingCampaign.value = false
  }
}

const deleteCampaign = async (id, name) => {
  const confirmed = await showConfirmDelete(`campaign "${name}"`)
  if (!confirmed) return
  
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${id}`, { 
      method: 'DELETE', 
      headers 
    })
    const data = await response.json()
    
    if (data.success) {
      success('Đã xóa campaign!')
      fetchCampaigns()
    } else {
      showError(data.message || 'Không thể xóa campaign')
    }
  } catch (error) {
    console.error('Error deleting campaign:', error)
    showError('Không thể xóa campaign')
  }
}


// Poll campaign status until it's no longer "sending"
const pollCampaignStatus = async (campaignId, maxAttempts = 30) => {
  let attempts = 0
  const pollInterval = setInterval(async () => {
    attempts++
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/campaigns/${campaignId}`, { headers })
      const data = await response.json()
      
      if (data.success) {
        const campaign = data.data
        // Update the campaign in our local state
        const index = campaigns.value.findIndex(c => c._id === campaignId)
        if (index !== -1) {
          campaigns.value[index] = campaign
        }
        
        // Stop polling if campaign is no longer sending or max attempts reached
        if (campaign.status !== 'sending' || attempts >= maxAttempts) {
          clearInterval(pollInterval)
          // Remove from sending set when done
          sendingCampaignIds.value.delete(campaignId)
          if (campaign.status === 'completed') {
            success('Campaign đã gửi thành công!')
          }
        }
      }
    } catch (error) {
      console.error('Error polling campaign status:', error)
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval)
        // Remove from sending set on error
        sendingCampaignIds.value.delete(campaignId)
      }
    }
  }, 2000) // Poll every 2 seconds
}

const viewAnalytics = (id) => navigateTo(`/campaigns/${id}`)

// Export functions
const openExportModal = async (campaign) => {
  exportCampaign.value = campaign
  showExportModal.value = true
  exportLoading.value = true
  exportData.value = null
  exportOptions.value = { opened: true, notOpened: true, botSuspect: false }
  
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${campaign._id}/tracking-data`, { headers })
    const data = await response.json()
    
    if (data.success) {
      const allEmails = data.data || []
      const BOT_THRESHOLD_MINUTES = 5
      
      const opened = []
      const notOpened = []
      const botSuspect = []
      
      allEmails.forEach(item => {
        const sentAt = new Date(item.sentAt)
        const firstOpenedAt = item.firstOpenedAt ? new Date(item.firstOpenedAt) : null
        
        const formatted = {
          email: item.to,
          sentAt: formatDateTime(item.sentAt),
          openedTime: firstOpenedAt ? formatDateTime(item.firstOpenedAt) : null,
          openCount: item.openCount || 0,
          status: item.opened ? 'opened' : 'not_opened'
        }
        
        if (!item.opened) {
          notOpened.push(formatted)
        } else {
          // Check if opened within 5 minutes (potential bot)
          if (firstOpenedAt) {
            const diffMinutes = (firstOpenedAt - sentAt) / (1000 * 60)
            if (diffMinutes <= BOT_THRESHOLD_MINUTES) {
              botSuspect.push({ ...formatted, timeDiff: Math.round(diffMinutes * 10) / 10 })
            } else {
              opened.push(formatted)
            }
          } else {
            opened.push(formatted)
          }
        }
      })
      
      exportData.value = { opened, notOpened, botSuspect }
    } else {
      showError('Không thể tải dữ liệu tracking')
      closeExportModal()
    }
  } catch (error) {
    showError('Lỗi khi tải dữ liệu')
    closeExportModal()
  } finally {
    exportLoading.value = false
  }
}

const closeExportModal = () => {
  showExportModal.value = false
  exportCampaign.value = null
  exportData.value = null
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return date.toLocaleString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const executeExport = async () => {
  if (!exportData.value || selectedExportCount.value === 0) return
  
  const rows = [['Email', 'Trạng thái', 'Thời gian gửi', 'Thời gian mở', 'Số lần mở', 'Ghi chú']]
  
  if (exportOptions.value.opened) {
    exportData.value.opened.forEach(item => {
      rows.push([item.email, 'Đã mở', item.sentAt, item.openedTime || '', item.openCount, ''])
    })
  }
  
  if (exportOptions.value.notOpened) {
    exportData.value.notOpened.forEach(item => {
      rows.push([item.email, 'Chưa mở', item.sentAt, '', 0, ''])
    })
  }
  
  if (exportOptions.value.botSuspect) {
    exportData.value.botSuspect.forEach(item => {
      rows.push([item.email, 'Nghi Bot', item.sentAt, item.openedTime || '', item.openCount, `Mở sau ${item.timeDiff} phút`])
    })
  }
  
  // Dynamic import xlsx library from CDN
  const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(rows)
  
  // Set column widths
  ws['!cols'] = [
    { wch: 30 }, // Email
    { wch: 12 }, // Trạng thái
    { wch: 20 }, // Thời gian gửi
    { wch: 20 }, // Thời gian mở
    { wch: 12 }, // Số lần mở
    { wch: 25 }  // Ghi chú
  ]
  
  XLSX.utils.book_append_sheet(wb, ws, 'Tracking Data')
  
  // Generate Excel file and download
  const filename = `${exportCampaign.value?.name || 'campaign'}_tracking_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
  
  success('Đã export dữ liệu Excel thành công!')
  closeExportModal()
}

const getStatusClass = (status) => ({
  draft: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-blue-100 text-blue-700',
  sending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  paused: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700'
}[status] || 'bg-gray-100 text-gray-700')

const getStatusLabel = (status) => ({
  draft: 'Nháp',
  scheduled: 'Đã lên lịch',
  sending: 'Đang gửi',
  completed: 'Hoàn thành',
  paused: 'Tạm dừng',
  cancelled: 'Đã hủy'
}[status] || status)

// Campaign detail modal functions
const openCampaignDetail = (campaign) => {
  selectedCampaignForDetail.value = campaign
  showCampaignDetailModal.value = true
}

const closeCampaignDetail = () => {
  showCampaignDetailModal.value = false
  selectedCampaignForDetail.value = null
}

onMounted(() => {
  fetchLists()
  fetchCampaigns()
  fetchTemplates()
  fetchEmailConfigs()
  
  // Persistent navigation: Check for open_list_id query param
  if (route.query.open_list_id) {
    const unwatch = watch(lists, (newLists) => {
      if (newLists && newLists.length > 0) {
        const targetList = newLists.find(l => l._id === route.query.open_list_id)
        if (targetList) {
          selectList(targetList)
        }
        unwatch()
      }
    }, { immediate: true })
  }
})
</script>

<style scoped>
.email-lists-theme :deep(.bg-emerald-600),
.email-lists-theme :deep(.bg-emerald-500),
.email-lists-theme :deep(.bg-purple-600),
.email-lists-theme :deep(.bg-blue-600),
.email-lists-theme :deep(.bg-blue-500) {
  background-image: linear-gradient(to right, #34d399, #2dd4bf, #a3e635) !important;
  color: #ffffff !important;
}

.email-lists-theme :deep(.text-emerald-700),
.email-lists-theme :deep(.text-emerald-600),
.email-lists-theme :deep(.text-purple-700),
.email-lists-theme :deep(.text-purple-600),
.email-lists-theme :deep(.text-blue-700),
.email-lists-theme :deep(.text-blue-600) {
  color: #059669 !important;
}

.email-lists-theme :deep(.bg-emerald-50),
.email-lists-theme :deep(.bg-purple-50),
.email-lists-theme :deep(.bg-blue-50) {
  background-color: #ecfdf5 !important;
}

.email-lists-theme :deep(.border-emerald-500),
.email-lists-theme :deep(.border-emerald-300),
.email-lists-theme :deep(.border-emerald-200),
.email-lists-theme :deep(.border-purple-500),
.email-lists-theme :deep(.border-blue-500),
.email-lists-theme :deep(.border-blue-300),
.email-lists-theme :deep(.border-blue-200) {
  border-color: #34d399 !important;
}

.email-lists-theme :deep(.focus\:border-emerald-500:focus),
.email-lists-theme :deep(.focus\:border-purple-500:focus),
.email-lists-theme :deep(.focus\:border-blue-500:focus) {
  border-color: #10b981 !important;
}

.email-lists-theme :deep(.focus\:ring-emerald-200:focus),
.email-lists-theme :deep(.focus\:ring-emerald-500:focus),
.email-lists-theme :deep(.focus\:ring-purple-200:focus),
.email-lists-theme :deep(.focus\:ring-blue-200:focus),
.email-lists-theme :deep(.focus\:ring-blue-500:focus) {
  --tw-ring-color: rgba(52, 211, 153, 0.35) !important;
}

.email-lists-theme :deep([class*="hover:bg-emerald-700"]:hover),
.email-lists-theme :deep([class*="hover:bg-purple-700"]:hover),
.email-lists-theme :deep([class*="hover:bg-blue-700"]:hover) {
  background-image: linear-gradient(to right, #10b981, #14b8a6, #84cc16) !important;
}

.email-lists-theme :deep([class*="hover:text-emerald-600"]:hover),
.email-lists-theme :deep([class*="hover:text-purple-600"]:hover),
.email-lists-theme :deep([class*="hover:text-blue-600"]:hover) {
  color: #047857 !important;
}

.email-lists-theme :deep([class*="hover:border-emerald-300"]:hover),
.email-lists-theme :deep([class*="hover:border-purple-300"]:hover),
.email-lists-theme :deep([class*="hover:border-blue-300"]:hover) {
  border-color: #34d399 !important;
}

.email-lists-theme :deep([class*="shadow-emerald"]),
.email-lists-theme :deep([class*="shadow-purple"]),
.email-lists-theme :deep([class*="shadow-blue"]) {
  --tw-shadow-color: rgba(16, 185, 129, 0.3) !important;
}

.email-lists-theme :deep([class*="ring-emerald"]),
.email-lists-theme :deep([class*="ring-purple"]),
.email-lists-theme :deep([class*="ring-blue"]) {
  --tw-ring-color: rgba(52, 211, 153, 0.35) !important;
}
</style>
