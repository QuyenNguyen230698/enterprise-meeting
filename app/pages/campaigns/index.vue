<template>
  <div class="flex flex-col w-full h-full bg-slate-50 font-sans">
    <ToastContainer />
    <ConfirmModal
      :is-visible="isVisible"
      :title="confirmData.title || 'Xác nhận'"
      :message="confirmData.message || 'Bạn có chắc chắn muốn thực hiện hành động này?'"
      :type="confirmData.type"
      @confirm="confirm"
      @cancel="cancel"
    />

    <!-- Header (Synced with Email Lists) -->
    <div class="w-full px-4 sm:px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 z-10 sticky top-0 shadow-sm">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <i class="bi bi-megaphone text-white text-lg"></i>
          </div>
          <div class="min-w-0">
            <h1 class="text-xl font-bold text-slate-900 truncate">Chiến Dịch</h1>
            <p class="text-xs text-slate-500 font-medium">Quản lý và theo dõi các chiến dịch email</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Stats Summary (Desktop) -->
          <div class="hidden lg:flex items-center gap-6 mr-4 border-r border-slate-100 pr-6">
             <div class="text-center">
                <span class="block text-lg font-bold text-slate-900 leading-none">{{ pagination?.total || 0 }}</span>
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tổng</span>
             </div>
             <div class="text-center">
                <span class="block text-lg font-bold text-emerald-600 leading-none">{{ campaigns.filter(c => c.status === 'completed').length }}</span>
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hoàn thành</span>
             </div>
             <div class="text-center">
                <span class="block text-lg font-bold text-amber-500 leading-none">{{ campaigns.filter(c => c.status === 'sending').length }}</span>
                <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Đang gửi</span>
             </div>
          </div>
          
           <button 
             @click="createCampaign" 
             class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
           >
              <i class="bi bi-plus-lg"></i>
              <span class="hidden sm:inline">Tạo mới</span>
           </button>
        </div>
      </div>
    </div>

    <!-- Filters & Search Bar (Synced Style) -->
    <div class="w-full bg-white border-b border-slate-100 px-4 sm:px-6 py-3">
       <div class="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
             <i class="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
             <input
               v-model="filters.search"
               @input="debouncedSearch"
               type="text"
               placeholder="Tìm kiếm chiến dịch..."
               class="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-slate-50/50 hover:bg-slate-50 transition-colors font-medium"
             />
          </div>
          <div class="flex gap-3 overflow-x-auto pb-1 sm:pb-0">
             <select v-model="filters.status" @change="fetchCampaigns" class="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap">
               <option value="">Tất cả trạng thái</option>
               <option value="draft">Nháp</option>
               <option value="scheduled">Đã lên lịch</option>
               <option value="sending">Đang gửi</option>
               <option value="completed">Hoàn thành</option>
               <option value="paused">Tạm dừng</option>
             </select>
             <select v-model="filters.sortBy" @change="fetchCampaigns" class="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap">
               <option value="createdAt">Mới nhất</option>
               <option value="updatedAt">Cập nhật gần đây</option>
               <option value="name">Tên A-Z</option>
             </select>
          </div>
       </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 w-full overflow-y-auto bg-slate-50/50">
       <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
          
          <!-- Loading State -->
          <div v-if="loading && !campaigns.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             <div v-for="n in 6" :key="n" class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm animate-pulse">
                <div class="h-4 bg-slate-100 rounded-full w-24 mb-4"></div>
                <div class="h-6 bg-slate-100 rounded-lg w-3/4 mb-2"></div>
                <div class="h-4 bg-slate-100 rounded-lg w-1/2 mb-6"></div>
                <div class="h-10 bg-slate-100 rounded-xl w-full"></div>
             </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!campaigns.length" class="flex flex-col items-center justify-center py-20 text-center">
             <div class="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm rotate-3">
                <i class="bi bi-megaphone-fill text-4xl text-indigo-400"></i>
             </div>
             <h3 class="text-xl font-bold text-slate-900 mb-2">Chưa có chiến dịch nào</h3>
             <p class="text-slate-500 max-w-sm mx-auto mb-8">Hãy tạo chiến dịch đầu tiên để bắt đầu gửi email marketing đến khách hàng của bạn.</p>
             <button @click="createCampaign" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <i class="bi bi-plus-lg"></i> Tạo chiến dịch ngay
             </button>
          </div>

          <!-- Campaign Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
             <div 
               v-for="campaign in campaigns" 
               :key="campaign._id"
               class="group bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden"
             >
                <!-- Status Bar -->
                <div class="h-1.5 w-full" :class="getStatusColor(campaign.status)"></div>
                
                <div class="p-5 flex-1 flex flex-col">
                   <div class="flex items-start justify-between mb-3">
                      <span class="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide" :class="getStatusBadgeClass(campaign.status)">
                         {{ getStatusLabel(campaign.status) }}
                      </span>
                      
                      <!-- Actions Dropdown (Optional, or just inline buttons) -->
                      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button @click="editCampaign(campaign._id)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Chỉnh sửa">
                            <i class="bi bi-pencil-fill text-xs"></i>
                         </button>
                         <button @click="deleteCampaign(campaign._id, campaign.name)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                            <i class="bi bi-trash-fill text-xs"></i>
                         </button>
                      </div>
                   </div>

                   <h3 class="text-base font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors" :title="campaign.name">
                      {{ campaign.name }}
                   </h3>
                   <p class="text-xs text-slate-500 font-medium mb-4 line-clamp-1" :title="campaign.subject">
                      <span class="text-slate-400 mr-1">Subject:</span> {{ campaign.subject }}
                   </p>

                   <!-- Stats Grid -->
                   <div class="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-50/80 mb-4 bg-slate-50/30 rounded-lg">
                      <div class="text-center border-r border-slate-100 last:border-0">
                         <div class="text-[10px] uppercase font-bold text-slate-400">Gửi</div>
                         <div class="text-sm font-bold text-slate-700">{{ campaign.stats?.totalRecipients || 0 }}</div>
                      </div>
                      <div class="text-center border-r border-slate-100 last:border-0">
                         <div class="text-[10px] uppercase font-bold text-slate-400">Mở</div>
                         <div class="text-sm font-bold text-emerald-600">{{ campaign.stats?.openRate || 0 }}%</div>
                      </div>
                      <div class="text-center">
                         <div class="text-[10px] uppercase font-bold text-slate-400">Click</div>
                         <div class="text-sm font-bold text-indigo-600">{{ campaign.stats?.clickRate || 0 }}%</div>
                      </div>
                   </div>

                   <div class="mt-auto flex items-center gap-2">
                       <button
                         @click.stop="confirmSendCampaign(campaign)"
                         :disabled="sendingCampaignIds.has(campaign._id)"
                         class="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5"
                         :class="[
                           sendingCampaignIds.has(campaign._id) 
                             ? 'bg-slate-400 cursor-not-allowed' 
                             : campaign.status === 'draft' 
                               ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700' 
                               : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                         ]"
                       >
                         <i :class="sendingCampaignIds.has(campaign._id) ? 'bi-hourglass-split animate-spin' : (campaign.status === 'draft' ? 'bi-send-fill' : 'bi-arrow-repeat')" class="text-xs"></i>
                         {{ sendingCampaignIds.has(campaign._id) ? 'Đang gửi...' : (campaign.status === 'draft' ? 'Gửi ngay' : 'Gửi lại') }}
                       </button>
                       <button @click="viewAnalytics(campaign._id)" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors" title="Xem báo cáo">
                          <i class="bi bi-bar-chart-fill text-xs"></i>
                       </button>
                   </div>

                </div>
             </div>
          </div>

          <!-- Pagination -->
          <div v-if="campaignTotalPages > 1" class="mt-10 flex items-center justify-center gap-4">
             <button 
                @click="campaignPage = Math.max(1, campaignPage - 1)"
                :disabled="campaignPage <= 1"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
                <i class="bi bi-chevron-left"></i>
             </button>
             <span class="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                Trang {{ campaignPage }} / {{ campaignTotalPages }}
             </span>
             <button 
                @click="campaignPage = Math.min(campaignTotalPages, campaignPage + 1)"
                :disabled="campaignPage >= campaignTotalPages"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
                <i class="bi bi-chevron-right"></i>
             </button>
          </div>

       </div>
    </div>

    <!-- Campaign Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 transition-opacity">
       <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
             <div>
                <h3 class="text-lg font-bold text-slate-900">{{ editingId ? 'Chỉnh Sửa Chiến Dịch' : 'Tạo Chiến Dịch Mới' }}</h3>
                <p class="text-xs text-slate-500 font-medium mt-0.5">Thiết lập thông tin cơ bản và nội dung</p>
             </div>
             <button @click="showModal = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200/50 text-slate-500 transition-colors">
                <i class="bi bi-x-lg"></i>
             </button>
          </div>

          <div class="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
             <!-- Form Content (Keeping functionality same as before, just styling) -->
             <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Tên Chiến Dịch <span class="text-red-500">*</span></label>
                  <input v-model="form.name" type="text" class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white transition-all font-medium" placeholder="VD: Khuyến mãi tháng 7" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Tiêu Đề Email <span class="text-red-500">*</span></label>
                  <input v-model="form.subject" type="text" class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white transition-all font-medium" placeholder="VD: Đừng bỏ lỡ ưu đãi này!" />
                </div>
             </div>

             <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Preheader (Văn bản xem trước)</label>
                <input v-model="form.preheader" type="text" class="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white transition-all font-medium" placeholder="Hiển thị ngay sau tiêu đề trong hộp thư đến..." />
             </div>

             <!-- Sender Info Box -->
             <div class="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100/50">
                <h4 class="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-4 flex items-center gap-2"><i class="bi bi-person-badge-fill"></i> Thông Tin Người Gửi</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <div>
                      <label class="block text-xs font-semibold text-slate-600 mb-1.5">Tên hiển thị <span class="text-red-500">*</span></label>
                      <input v-model="form.sender.name" type="text" class="w-full px-3 py-2 text-sm border border-indigo-100 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" placeholder="Công Ty ABC" />
                   </div>
                   <div>
                      <label class="block text-xs font-semibold text-slate-600 mb-1.5">Email gửi <span class="text-red-500">*</span></label>
                      <input v-model="form.sender.email" type="email" class="w-full px-3 py-2 text-sm border border-indigo-100 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" placeholder="newsletter@company.com" />
                   </div>
                </div>
                <!-- Advanced Sender Options -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                      <label class="block text-xs font-medium text-slate-500 mb-1">Reply-To</label>
                      <input v-model="form.sender.replyTo" type="email" class="w-full px-3 py-2 text-xs border border-indigo-100 rounded-lg bg-white/80" placeholder="reply@..." />
                   </div>
                   <div>
                      <label class="block text-xs font-medium text-slate-500 mb-1">CC</label>
                      <input v-model="form.sender.cc" type="text" class="w-full px-3 py-2 text-xs border border-indigo-100 rounded-lg bg-white/80" placeholder="cc@..." />
                   </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-500 mb-1">BCC</label>
                      <input v-model="form.sender.bcc" type="text" class="w-full px-3 py-2 text-xs border border-indigo-100 rounded-lg bg-white/80" placeholder="bcc@..." />
                   </div>
                </div>
             </div>
             
             <!-- Lists & Templates -->
             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Lists -->
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                   <div class="flex items-center justify-between mb-3">
                      <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">Danh Sách Nhận</h4>
                      <span v-if="form.emailListIds.length" class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{{ form.emailListIds.length }} đã chọn</span>
                   </div>
                   <input v-model="listSearch" type="text" placeholder="Lọc danh sách..." class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg mb-2 focus:border-indigo-400 focus:ring-0" />
                   <div class="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                      <label 
                         v-for="list in filteredEmailLists" 
                         :key="list._id" 
                         class="flex items-center gap-3 p-2.5 bg-white border border-slate-100 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors group"
                         :class="{ 'ring-1 ring-indigo-500 border-indigo-500 bg-indigo-50/50': form.emailListIds.includes(list._id) }"
                      >
                         <input type="checkbox" v-model="form.emailListIds" :value="list._id" class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                         <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-slate-900 truncate">{{ list.name }}</div>
                            <div class="text-[10px] text-slate-500">{{ list.stats?.activeSubscribers || 0 }} emails</div>
                         </div>
                      </label>
                      <div v-if="!filteredEmailLists.length" class="text-center py-4 text-xs text-slate-400 italic">Không tìm thấy danh sách</div>
                   </div>
                </div>

                <!-- Templates -->
                 <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                   <div class="flex items-center justify-between mb-3">
                      <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">Mẫu Email</h4>
                      <NuxtLink to="/templates" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Tạo mẫu mới</NuxtLink>
                   </div>
                   <input v-model="templateSearch" type="text" placeholder="Lọc mẫu..." class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg mb-2 focus:border-indigo-400 focus:ring-0" />
                   <div class="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                       <div 
                         v-for="tpl in filteredTemplates" 
                         :key="tpl._id" 
                         @click="form.templateId = tpl._id"
                         class="flex items-center gap-3 p-2.5 bg-white border border-slate-100 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors"
                         :class="{ 'ring-1 ring-indigo-500 border-indigo-500 bg-indigo-50/50': form.templateId === tpl._id }"
                      >
                         <div class="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-400"><i class="bi bi-file-earmark-richtext"></i></div>
                         <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-slate-900 truncate">{{ tpl.name }}</div>
                         </div>
                         <i v-if="form.templateId === tpl._id" class="bi bi-check-circle-fill text-indigo-600"></i>
                      </div>
                      <div v-if="!filteredTemplates.length" class="text-center py-4 text-xs text-slate-400 italic">Không tìm thấy mẫu</div>
                   </div>
                </div>
             </div>

          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 shrink-0">
             <button @click="showModal = false" class="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">Hủy bỏ</button>
             <button 
               @click="saveCampaign" 
               :disabled="!isFormValid || saving" 
               class="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 transition-all hover:-translate-y-0.5"
             >
                <i v-if="saving" class="bi bi-hourglass-split animate-spin"></i>
                <i v-else class="bi bi-check-lg"></i>
                <span>{{ saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Tạo Chiến Dịch') }}</span>
             </button>
          </div>
       </div>
    </div>

  </div>
</template>

<script setup>
import ConfirmModal from '~/components/ConfirmModal.vue'

definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:2222/api'
const { success, error: showError } = useToast()
const authStore = useAuthStore()
const { isVisible, confirmData, confirm, cancel, confirmDelete: showConfirmDelete, confirmResend: showConfirmResend } = useConfirm()

// State
const campaigns = ref([])
const emailLists = ref([])
const templates = ref([])
// const emailConfigs = ref([]) // Removed unused
const pagination = ref(null)
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingId = ref(null)
const sendingCampaignIds = ref(new Set())

// Filters & Pagination
const filters = ref({ search: '', status: '', sortBy: 'createdAt', sortOrder: 'desc', page: 1, limit: 12 })
const campaignPage = computed({
   get: () => filters.value.page,
   set: (val) => { filters.value.page = val; fetchCampaigns() }
})
const campaignTotalPages = computed(() => pagination.value?.totalPages || 1)

// Form
const form = ref({
  name: '',
  subject: '',
  preheader: '',
  sender: { name: '', email: '', replyTo: '', cc: '', bcc: '' },
  emailListIds: [],
  templateId: ''
})

// Search helpers
const listSearch = ref('')
const templateSearch = ref('')

const filteredEmailLists = computed(() => {
  if (!listSearch.value) return emailLists.value
  const search = listSearch.value.toLowerCase()
  return emailLists.value.filter(list => list.name.toLowerCase().includes(search))
})

const filteredTemplates = computed(() => {
  if (!templateSearch.value) return templates.value
  const search = templateSearch.value.toLowerCase()
  return templates.value.filter(tpl => tpl.name.toLowerCase().includes(search))
})

const isFormValid = computed(() => form.value.name && form.value.subject && form.value.sender.name && form.value.sender.email)

// Debounce Search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { filters.value.page = 1; fetchCampaigns() }, 500)
}

// Helpers
const getAuthHeaders = async () => {
  await authStore.ensureTokenValidity()
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.accessToken}` }
}

const getStatusLabel = (status) => {
   const map = {
      draft: 'Nháp',
      scheduled: 'Đã lên lịch',
      sending: 'Đang gửi',
      completed: 'Hoàn thành',
      paused: 'Tạm dừng',
      cancelled: 'Đã hủy'
   }
   return map[status] || status
}

const getStatusColor = (status) => {
   const map = {
      draft: 'bg-gray-400',
      scheduled: 'bg-blue-500',
      sending: 'bg-amber-500',
      completed: 'bg-emerald-500',
      paused: 'bg-orange-500',
      cancelled: 'bg-red-500'
   }
   return map[status] || 'bg-gray-400'
}

const getStatusBadgeClass = (status) => {
   const map = {
      draft: 'bg-gray-100 text-gray-600',
      scheduled: 'bg-blue-100 text-blue-700',
      sending: 'bg-amber-100 text-amber-700 animate-pulse',
      completed: 'bg-emerald-100 text-emerald-700',
      paused: 'bg-orange-100 text-orange-700',
      cancelled: 'bg-red-100 text-red-700'
   }
   return map[status] || 'bg-gray-100 text-gray-600'
}

// Actions
const fetchCampaigns = async () => {
  loading.value = true
  try {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams()
    Object.entries(filters.value).forEach(([k, v]) => { if (v) params.append(k, v) })
    
    const response = await fetch(`${apiBaseUrl}/v1/campaigns?${params}`, { headers })
    const data = await response.json()
    
    if (data.success) {
      campaigns.value = data.data
      pagination.value = data.pagination
    }
  } catch (error) {
    showError('Không thể tải danh sách chiến dịch')
  } finally {
    loading.value = false
  }
}

const fetchEmailLists = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/email-lists?limit=100`, { headers })
    const data = await response.json()
    if (data.success) emailLists.value = data.data
  } catch (error) { console.error(error) }
}

const fetchTemplates = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/templates/my-templates?limit=100`, { headers })
    const data = await response.json()
    if (data.success) templates.value = data.data
  } catch (error) { console.error(error) }
}

const createCampaign = () => {
  editingId.value = null
  form.value = { name: '', subject: '', preheader: '', sender: { name: '', email: '', replyTo: '', cc: '', bcc: '' }, emailListIds: [], templateId: '' }
  showModal.value = true
}

const editCampaign = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/campaigns/${id}`, { headers })
    const data = await response.json()
    if (data.success) {
      editingId.value = id
      const c = data.data
      form.value = {
        name: c.name, subject: c.subject, preheader: c.preheader || '',
        sender: { 
          name: c.sender?.name || '', email: c.sender?.email || '',
          replyTo: c.sender?.replyTo || '', cc: c.sender?.cc || '', bcc: c.sender?.bcc || ''
        },
        emailListIds: c.emailListIds?.map(l => l._id || l) || [],
        templateId: c.templateId?._id || c.templateId || ''
      }
      showModal.value = true
    }
  } catch (error) { showError('Lỗi tải thông tin chiến dịch') }
}

const saveCampaign = async () => {
  saving.value = true
  try {
    const headers = await getAuthHeaders()
    const url = editingId.value ? `${apiBaseUrl}/v1/campaigns/${editingId.value}` : `${apiBaseUrl}/v1/campaigns`
    const method = editingId.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, { method, headers, body: JSON.stringify(form.value) })
    const data = await response.json()
    
    if (data.success) {
      success(editingId.value ? 'Cập nhật thành công!' : 'Tạo mới thành công!')
      showModal.value = false
      fetchCampaigns()
    } else {
      showError(data.message)
    }
  } catch (error) { showError('Lỗi lưu chiến dịch') } finally { saving.value = false }
}

const deleteCampaign = async (id, name) => {
  const confirmed = await showConfirmDelete(`chiến dịch "${name}"`)
  if (!confirmed) return
  try {
    const headers = await getAuthHeaders()
    await fetch(`${apiBaseUrl}/v1/campaigns/${id}`, { method: 'DELETE', headers })
    success('Đã xóa chiến dịch')
    fetchCampaigns()
  } catch (error) { showError('Xóa thất bại') }
}

const confirmSendCampaign = async (campaign) => {
   // Simplified for UI demo - assumes email configured or handled by backend error
   if (campaign.status !== 'draft') {
      const confirmed = await showConfirmResend(campaign.name)
      if (!confirmed) return
   }
   await sendCampaign(campaign._id)
}

const sendCampaign = async (id) => {
   sendingCampaignIds.value.add(id)
   try {
      const headers = await getAuthHeaders()
      // Trigger load recipients first
      await fetch(`${apiBaseUrl}/v1/campaigns/${id}/load-recipients`, { method: 'POST', headers })
      // Then send
      const response = await fetch(`${apiBaseUrl}/v1/campaigns/${id}/send`, { 
        method: 'POST', 
        headers,
        body: JSON.stringify({ mode: 'multi' })
      })
      const data = await response.json()
      
      if (data.success) {
         success('Đã bắt đầu gửi chiến dịch!')
         fetchCampaigns()
      } else {
         showError(data.message)
      }
   } catch (error) {
      showError('Gửi thất bại')
   } finally {
      sendingCampaignIds.value.delete(id)
   }
}

const viewAnalytics = (id) => navigateTo(`/campaigns/${id}`)

onMounted(() => {
  fetchCampaigns()
  fetchEmailLists()
  fetchTemplates()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 6px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
