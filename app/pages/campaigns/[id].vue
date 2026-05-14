<template>
  <div class="flex flex-col w-full h-full overflow-hidden bg-slate-50">
    <ToastContainer />
    <ConfirmModal
      :is-visible="isVisible"
      :title="confirmData.title || 'Xác nhận'"
      :message="confirmData.message || 'Bạn có chắc chắn muốn thực hiện hành động này?'"
      :type="confirmData.type"
      @confirm="confirmAction"
      @cancel="cancelAction"
    />

    <!-- Compact Header -->
    <div class="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-10 shadow-sm">
      <div class="flex flex-col w-full px-4 sm:px-6 py-3 gap-3">
        <!-- Breadcrumb & Back -->
        <div class="flex items-center gap-2">
           <NuxtLink to="/campaigns" class="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
             <i class="bi bi-arrow-left"></i> Danh sách
           </NuxtLink>
           <span class="text-slate-300">/</span>
           <span class="text-xs sm:text-sm font-medium text-slate-900 truncate max-w-[200px] md:max-w-full line-clamp-1">{{ campaign?.name || 'Chi tiết chiến dịch' }}</span>
        </div>

        <!-- Title & Actions Row -->
        <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <i class="bi bi-box-seam text-slate-500 text-lg"></i>
                </div>
                <div class="min-w-0">
                    <h1 class="text-lg sm:text-xl font-bold text-slate-900 truncate">{{ campaign?.name }}</h1>
                    <div v-if="campaign" class="flex items-center gap-2 mt-0.5">
                       <span :class="getStatusBadgeClass(campaign.status)" class="px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                         {{ campaign.status }}
                       </span>
                       <span class="text-xs text-slate-400">|</span>
                       <span class="text-xs text-slate-500 truncate max-w-[200px] md:max-w-full line-clamp-1">{{ campaign.subject }}</span>
                    </div>
                </div>
            </div>

            <!-- Actions Toolbar -->
            <div v-if="campaign" class="flex items-center gap-2">
                <!-- Status Actions -->
                <!-- Send button removed for draft status as per user request to use list view distribution modal -->
                
                <button 
                  v-if="campaign.status === 'sending'" 
                  @click="pauseCampaign"
                  :disabled="pausingLoading"
                  class="px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <i :class="pausingLoading ? 'bi bi-arrow-repeat animate-spin' : 'bi bi-pause-fill'" class=""></i>
                  <span class="hidden sm:inline">Tạm dừng</span>
                </button>

                <button 
                  v-if="campaign.status === 'paused'" 
                  @click="resumeCampaign"
                  :disabled="resumingLoading"
                  class="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <i :class="resumingLoading ? 'bi bi-arrow-repeat animate-spin' : 'bi bi-play-fill'" class=""></i>
                  <span class="hidden sm:inline">Tiếp tục</span>
                </button>

                <!-- More Actions Dropdown -->
                <div class="relative ml-1">
                   <!-- Desktop Group -->
                   <div class="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                      <button @click="recalculateStats" :disabled="recalculateLoading" class="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white rounded transition-all" title="Tính lại thống kê">
                        <i :class="recalculateLoading ? 'animate-spin bi bi-arrow-clockwise' : 'bi bi-calculator'"></i>
                      </button>
                      <button @click="exportReport" :disabled="exportLoading || campaign.status === 'draft'" class="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-white rounded transition-all" title="Xuất báo cáo">
                        <i :class="exportLoading ? 'animate-spin bi bi-arrow-clockwise' : 'bi bi-file-earmark-spreadsheet'"></i>
                      </button>
                      <div class="w-px h-4 bg-slate-300 mx-1"></div>
                      <button @click="deleteCampaign" class="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-white rounded transition-all" title="Xóa chiến dịch">
                        <i class="bi bi-trash"></i>
                      </button>
                   </div>
                   
                   <!-- Mobile Menu Button -->
                   <button @click="showActionsMenu = !showActionsMenu" class="sm:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                     <i class="bi bi-three-dots-vertical"></i>
                   </button>
                   
                   <!-- Mobile Dropdown -->
                   <div v-if="showActionsMenu" @click="showActionsMenu = false" class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 sm:hidden">
                       <button @click="recalculateStats" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                           <i class="bi bi-calculator"></i> Tính lại thống kê
                       </button>
                       <button @click="exportReport" class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                           <i class="bi bi-file-earmark-excel"></i> Xuất Excel
                       </button>
                       <div class="border-t border-slate-100 my-1"></div>
                       <button @click="deleteCampaign" class="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                           <i class="bi bi-trash"></i> Xóa chiến dịch
                       </button>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 p-6 flex items-center justify-center">
      <div class="text-center">
         <div class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
         <p class="text-slate-500 text-sm">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="campaign" class="flex-1 overflow-auto p-4 sm:p-6">
      
      <!-- Top Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Tổng Nhận</div>
            <div class="text-2xl font-bold text-slate-900">{{ campaign.stats?.totalRecipients || 0 }}</div>
            <div class="absolute right-0 top-0 p-3 opacity-10"><i class="bi bi-people-fill text-3xl"></i></div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Đã Gửi</div>
             <div class="text-2xl font-bold text-blue-600">{{ campaign.stats?.sent || 0 }}</div>
             <div class="text-xs text-slate-400 mt-1 font-medium">{{ getSentPercent }}% hoàn thành</div>
             <div class="absolute right-0 top-0 p-3 opacity-10"><i class="bi bi-send-fill text-3xl text-blue-600"></i></div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Đã Mở</div>
             <div class="text-2xl font-bold text-emerald-600">{{ campaign.stats?.opened || 0 }}</div>
             <div class="text-xs text-slate-400 mt-1 font-medium">{{ campaign.stats?.openRate?.toFixed(1) || 0 }}% tỷ lệ mở</div>
             <div class="absolute right-0 top-0 p-3 opacity-10"><i class="bi bi-envelope-open-fill text-3xl text-emerald-600"></i></div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Đã Click</div>
             <div class="text-2xl font-bold text-purple-600">{{ campaign.stats?.clicked || 0 }}</div>
             <div class="text-xs text-slate-400 mt-1 font-medium">{{ campaign.stats?.clickRate?.toFixed(1) || 0 }}% tỷ lệ click</div>
             <div class="absolute right-0 top-0 p-3 opacity-10"><i class="bi bi-cursor-fill text-3xl text-purple-600"></i></div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-6">
           <!-- Details Card -->
           <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-50 flex items-center gap-2">
                  <i class="bi bi-info-circle text-slate-400"></i> Thông Tin Chi Tiết
              </h3>
              <div class="space-y-3 text-sm">
                  <div class="flex flex-col sm:flex-row sm:justify-between py-1 gap-1">
                      <span class="text-slate-500">Người gửi</span>
                      <span class="font-medium text-slate-900">{{ campaign.sender?.name }} &lt;{{ campaign.sender?.email }}&gt;</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between py-1 gap-1">
                      <span class="text-slate-500">Tiêu đề email</span>
                      <span class="font-medium text-slate-900">{{ campaign.subject }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between py-1 gap-1">
                      <span class="text-slate-500">Ngày tạo</span>
                      <span class="font-medium text-slate-900">{{ formatDate(campaign.createdAt) }}</span>
                  </div>
                  <div v-if="campaign.scheduledAt" class="flex flex-col sm:flex-row sm:justify-between py-1 gap-1">
                      <span class="text-slate-500">Lịch gửi</span>
                      <span class="font-medium text-blue-600">{{ formatDate(campaign.scheduledAt) }}</span>
                  </div>
              </div>
           </div>

           <!-- Target Lists -->
           <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
               <h3 class="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-50 flex items-center gap-2">
                  <i class="bi bi-list-check text-slate-400"></i> Danh Sách Mục Tiêu ({{ campaign.emailListIds?.length || 0 }})
               </h3>
               <div v-if="campaign.emailListIds?.length" class="space-y-2">
                  <div v-for="list in campaign.emailListIds" :key="list._id || list" class="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-colors group">
                      <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-200 group-hover:text-indigo-700 transition-colors">
                            {{ (list.name || 'L').charAt(0).toUpperCase() }}
                          </div>
                          <div>
                              <div class="text-sm font-semibold text-slate-900">{{ list.name || 'Unknown List' }}</div>
                              <div class="text-xs text-slate-500">{{ list.stats?.activeSubscribers || 0 }} người đăng ký</div>
                          </div>
                      </div>
                      <NuxtLink :to="`/email-lists/${list._id || list}`" class="text-xs font-semibold text-indigo-600 hover:underline">Chi tiết</NuxtLink>
                  </div>
               </div>
               <div v-else class="text-sm text-slate-400 italic text-center py-4">Chưa chọn danh sách nào</div>
           </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
            <!-- Progress Box -->
            <div v-if="campaign.status !== 'draft'" class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 class="text-sm font-bold text-slate-900 mb-4">Tiến Độ Gửi</h3>
                <div class="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div class="bg-indigo-600 h-full rounded-full transition-all duration-500 relative" :style="{ width: getSentPercent + '%' }">
                         <div class="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
                <div class="flex justify-between text-xs font-medium text-slate-500 mb-4">
                    <span>0%</span>
                    <span>{{ getSentPercent }}%</span>
                    <span>100%</span>
                </div>
                
                <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                    <div class="text-center p-2 bg-slate-50 rounded-lg">
                        <div class="text-lg font-bold text-slate-900">{{ campaign.stats?.sent || 0 }}</div>
                        <div class="text-[10px] text-slate-500 uppercase">Thành công</div>
                    </div>
                    <div class="text-center p-2 bg-rose-50 rounded-lg">
                        <div class="text-lg font-bold text-rose-600">{{ campaign.stats?.failed || 0 }}</div>
                        <div class="text-[10px] text-rose-500 uppercase">Thất bại</div>
                    </div>
                </div>
            </div>

            <!-- Template Preview Box -->
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 class="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i class="bi bi-file-richtext text-slate-400"></i> Template
                </h3>
                <div v-if="campaign.templateId" class="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div class="text-sm font-bold text-slate-900 mb-1">{{ campaign.templateId.name }}</div>
                    <div class="text-xs text-slate-500 mb-3">{{ campaign.templateId.category || 'Mặc định' }}</div>
                    <button class="w-full py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-50 transition-colors">
                        Xem nội dung
                    </button>
                </div>
                <div v-else class="text-center py-6 text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    Chưa chọn template
                </div>
            </div>
            
            <!-- Attachments -->
            <div v-if="campaign.attachments?.length" class="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 class="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <i class="bi bi-paperclip text-slate-400"></i> Tệp Đính Kèm ({{ campaign.attachments.length }})
                </h3>
                <div class="space-y-2">
                    <div v-for="(file, idx) in campaign.attachments" :key="idx" class="flex items-center gap-3 p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                       <div class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded text-slate-500">
                           <i class="bi bi-file-earmark"></i>
                       </div>
                       <div class="flex-1 min-w-0">
                           <div class="text-xs font-medium text-slate-900 truncate">{{ file.filename }}</div>
                           <div class="text-[10px] text-slate-500">{{ formatFileSize(file.size) }}</div>
                       </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
    
    <!-- Empty/Error State -->
    <div v-else-if="!loading" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 text-2xl">
            <i class="bi bi-search"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">Không tìm thấy chiến dịch</h3>
        <p class="text-slate-500 text-sm mb-6 max-w-md">Chiến dịch bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <NuxtLink to="/campaigns" class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Quay lại danh sách
        </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:2222/api'
const { success, error: showError } = useToast()
const authStore = useAuthStore()
const { isVisible, confirmData, confirm: confirmAction, cancel: cancelAction, confirmDelete: showConfirmDelete } = useConfirm()

const campaign = ref(null)
const loading = ref(true)
const sendingLoading = ref(false)
const pausingLoading = ref(false)
const resumingLoading = ref(false)
const recalculateLoading = ref(false)
const showActionsMenu = ref(false)

const getSentPercent = computed(() => {
  if (!campaign.value?.stats?.totalRecipients) return 0
  return Math.round((campaign.value.stats.sent / campaign.value.stats.totalRecipients) * 100)
})

const getStatusBadgeClass = (status) => ({
  draft: 'bg-slate-100 text-slate-600',
  scheduled: 'bg-blue-50 text-blue-600',
  sending: 'bg-indigo-50 text-indigo-600',
  paused: 'bg-amber-50 text-amber-600',
  completed: 'bg-emerald-50 text-emerald-600',
  failed: 'bg-rose-50 text-rose-600'
}[status] || 'bg-slate-100 text-slate-600')

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getAuthHeaders = async () => {
  await authStore.ensureTokenValidity()
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.accessToken}` }
}

const fetchCampaign = async () => {
  loading.value = true
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${route.params.id}`, { headers })
    const data = await response.json()
    if (data.success) {
      campaign.value = data.data
    }
  } catch (error) {
    console.error('Error fetching campaign:', error)
  } finally {
    loading.value = false
  }
}

const sendCampaign = async () => {
  if (sendingLoading.value) return
  
  sendingLoading.value = true
  try {
    const headers = await getAuthHeaders()
    await fetch(`${apiBaseUrl}/v1/campaigns/${route.params.id}/load-recipients`, { method: 'POST', headers })
    
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${route.params.id}/send`, { 
        method: 'POST', 
        headers,
        body: JSON.stringify({ mode: 'multi' })
    })
    const data = await response.json()
    
    if (response.ok && (data.success || data.result)) {
      success('Campaign started sending!')
      await fetchCampaign()
    } else {
      if (response.status === 403 && data.limitReached) {
        showError(data.message || 'Daily email limit reached. Please upgrade your plan.')
        // You could trigger an upgrade modal here if available
      } else {
        showError(data.message || 'Failed to send campaign')
      }
    }
  } catch (error) {
    showError('Failed to send campaign: ' + error.message)
  } finally {
    sendingLoading.value = false
  }
}

const pauseCampaign = async () => {
  if (pausingLoading.value) return
  
  pausingLoading.value = true
  try {
    const headers = await getAuthHeaders()
    await fetch(`${apiBaseUrl}/v1/campaigns/${route.params.id}/pause`, { method: 'POST', headers })
    success('Campaign paused')
    await fetchCampaign()
  } catch (error) {
    showError('Failed to pause')
  } finally {
    pausingLoading.value = false
  }
}

const resumeCampaign = async () => {
  if (resumingLoading.value) return
  
  resumingLoading.value = true
  try {
    const headers = await getAuthHeaders()
    await fetch(`${apiBaseUrl}/v1/campaigns/${route.params.id}/resume`, { method: 'POST', headers })
    success('Campaign resumed')
    await fetchCampaign()
  } catch (error) {
    showError('Failed to resume')
  } finally {
    resumingLoading.value = false
  }
}

const recalculateStats = async () => {
  if (recalculateLoading.value) return
  
  recalculateLoading.value = true
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${route.params.id}/recalculate-stats`, { method: 'POST', headers })
    const data = await response.json()
    if (data.success) {
      success('Stats recalculated successfully!')
      await fetchCampaign()
    } else {
      showError(data.message)
    }
  } catch (error) {
    showError('Failed to recalculate stats')
  } finally {
    recalculateLoading.value = false
  }
}

const exportLoading = ref(false)

const exportReport = async () => {
  if (!campaign.value || campaign.value.status === 'draft') {
    showError('Chỉ có thể export campaign đã gửi')
    return
  }
  
  exportLoading.value = true
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${route.params.id}/tracking-data`, { headers })
    const data = await response.json()
    
    if (!data.success) {
      showError('Không thể tải dữ liệu tracking')
      return
    }
    
    const allEmails = data.data || []
    
    // Dynamic import xlsx library from CDN
    const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs')
    
    const rows = [['Email', 'Trạng thái', 'Thời gian gửi', 'Thời gian mở', 'Số lần mở']]
    allEmails.forEach(item => {
        rows.push([
            item.to, 
            item.opened ? 'Đã mở' : 'Chưa mở',
            item.sentAt || '',
            item.firstOpenedAt || '',
            item.openCount || 0
        ])
    })

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    
    const filename = `${campaign.value.name || 'campaign'}_report.xlsx`
    XLSX.writeFile(wb, filename)
    
    success('Đã export báo cáo Excel thành công!')
  } catch (error) {
    console.error('Export error:', error)
    showError('Lỗi khi export báo cáo')
  } finally {
    exportLoading.value = false
  }
}

const deleteCampaign = async () => {
  const confirmed = await showConfirmDelete('campaign này')
  if (!confirmed) return
  try {
    const headers = await getAuthHeaders()
    await fetch(`${apiBaseUrl}/v1/campaigns/${route.params.id}`, { method: 'DELETE', headers })
    success('Campaign deleted')
    router.push('/campaigns')
  } catch (error) {
    showError('Failed to delete')
  }
}

const duplicateCampaign = () => {
  success('Duplicate feature coming soon')
}

onMounted(fetchCampaign)
</script>
