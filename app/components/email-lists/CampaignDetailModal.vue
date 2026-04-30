<template>
  <div v-if="isVisible" style="z-index: 999999 !important" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 lg:gap-4">
          <!-- Stats Summary - Always visible but compact -->
          <div class="flex-1">
            <div class="grid grid-cols-5 gap-1 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div class="text-center">
                <div class="text-xs sm:text-sm font-bold text-gray-900">{{ stats.total || 0 }}</div>
                <div class="text-xs text-gray-500 hidden sm:block">Tổng</div>
                <div class="text-xs text-gray-500 sm:hidden">T</div>
              </div>
              <div class="text-center">
                <div class="text-xs sm:text-sm font-bold text-blue-600">{{ stats.sent || 0 }}</div>
                <div class="text-xs text-gray-500 hidden sm:block">Đã gửi</div>
                <div class="text-xs text-gray-500 sm:hidden">G</div>
              </div>
              <div class="text-center">
                <div class="text-xs sm:text-sm font-bold text-purple-600">{{ stats.opened || 0 }}</div>
                <div class="text-xs text-gray-500 hidden sm:block">Đã mở</div>
                <div class="text-xs text-gray-500 sm:hidden">M</div>
              </div>
              <div class="text-center">
                <div class="text-xs sm:text-sm font-bold text-emerald-600">{{ stats.clicked || 0 }}</div>
                <div class="text-xs text-gray-500 hidden sm:block">Đã click</div>
                <div class="text-xs text-gray-500 sm:hidden">C</div>
              </div>
              <div class="text-center">
                <div class="text-xs sm:text-sm font-bold text-red-600">{{ stats.failed || 0 }}</div>
                <div class="text-xs text-gray-500 hidden sm:block">Thất bại</div>
                <div class="text-xs text-gray-500 sm:hidden">TB</div>
              </div>
            </div>
          </div>

          <!-- Filters - Compact layout -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto lg:min-w-[500px]">
            <div class="flex gap-2 flex-1">
              <div class="relative flex-1">
                <input
                  v-model="searchQuery"
                  @input="debouncedSearch"
                  type="text"
                  placeholder="Tìm email..."
                  class="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <i class="bi bi-search absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </div>
              <select
                v-model="statusFilter"
                @change="fetchRecipients"
                class="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Tất cả</option>
                <option value="delivered">Đã nhận</option>
                <option value="opened">Đã mở</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
            <button
              @click="refreshData"
              class="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center whitespace-nowrap"
              :disabled="loading"
            >
              <i class="bi bi-arrow-clockwise" :class="{ 'animate-spin': loading }"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-auto min-h-0">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[500px] sm:min-w-[600px]">
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Email</th>
                <th class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Trạng thái</th>
                <th class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell w-1/6">Thời gian</th>
                <th class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell w-1/6">Mở/Click</th>
                <th class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Hành động</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading && recipients.length === 0">
                <td colspan="5" class="px-2 sm:px-4 py-6 sm:py-8 text-center text-gray-500">
                  <i class="bi bi-hourglass-split text-xl sm:text-2xl lg:text-3xl block mb-2"></i>
                  Đang tải...
                </td>
              </tr>
              <tr v-else-if="!loading && recipients.length === 0">
                <td colspan="5" class="px-2 sm:px-4 py-6 sm:py-8 text-center text-gray-500">
                  <i class="bi bi-inbox text-xl sm:text-2xl lg:text-3xl block mb-2"></i>
                  Không có dữ liệu
                </td>
              </tr>
              <tr v-else v-for="recipient in recipients" :key="recipient.email" class="hover:bg-gray-50">
                <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                  <div class="text-xs sm:text-sm font-medium text-gray-900 break-all">{{ recipient.email }}</div>
                  <div v-if="recipient.realTimeTracking?.ipAddress" class="text-xs text-gray-500 hidden sm:block">
                    IP: {{ recipient.realTimeTracking.ipAddress }}
                  </div>
                </td>
                <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                  <span :class="getStatusClass(recipient.status)" class="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(recipient.status) }}
                  </span>
                  <div v-if="recipient.failReason" class="text-xs text-red-600 mt-1 break-words">
                    {{ recipient.failReason }}
                  </div>
                </td>
                <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 hidden sm:table-cell">
                  <div class="text-xs sm:text-sm text-gray-900">
                    {{ formatDateTime(recipient.sentAt || recipient.deliveredAt || recipient.openedAt) }}
                  </div>
                  <div v-if="recipient.realTimeTracking?.lastUpdated" class="text-xs text-gray-500 hidden sm:block">
                    Cập nhật: {{ formatTime(recipient.realTimeTracking.lastUpdated) }}
                  </div>
                </td>
                <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 hidden md:table-cell">
                  <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div class="flex items-center gap-1">
                      <i class="bi bi-envelope-open text-xs sm:text-sm" :class="recipient.openCount > 0 ? 'text-purple-600' : 'text-gray-400'"></i>
                      <span>{{ recipient.openCount || 0 }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <i class="bi bi-cursor text-xs sm:text-sm" :class="recipient.clickCount > 0 ? 'text-blue-600' : 'text-gray-400'"></i>
                      <span>{{ recipient.clickCount || 0 }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-right">
                  <button
                    @click="resendEmail(recipient.email)"
                    :disabled="resending[recipient.email]"
                    class="px-1.5 sm:px-2 lg:px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Gửi lại email"
                  >
                    <i class="bi bi-arrow-clockwise mr-1 text-xs" :class="{ 'animate-spin': resending[recipient.email] }"></i>
                    <span class="hidden sm:inline">Gửi lại</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <span class="hidden lg:block text-xs sm:text-sm text-gray-600">
          {{ (pagination.page - 1) * pagination.limit + 1 }} - 
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} trong {{ pagination.total }}
        </span>
        <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="px-2 sm:px-3 lg:px-4 py-1 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors"
          >
            <i class="bi bi-chevron-left sm:mr-1"></i>
            <span class="hidden sm:inline">Trước</span>
          </button>
          <span class="text-xs sm:text-sm text-gray-600 px-1 sm:px-2">Trang {{ pagination.page }} / {{ pagination.totalPages }}</span>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="px-2 sm:px-3 lg:px-4 py-1 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors"
          >
            <span class="hidden sm:inline mr-1">Tiếp</span>
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-3 sm:p-6 border-t border-gray-200">
        <button @click="closeModal" class="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 transition-colors">
          Đóng
        </button>
      </div>
    </div>

    <!-- Email Config Selection Modal for Resend -->
    <div v-if="showResendModal" class="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60" @click="closeResendModal"></div>
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md z-10">
        <div class="p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Gửi lại email</h3>
          <p class="text-sm text-gray-600 mb-4">Gửi lại email cho: <strong>{{ pendingResendEmail }}</strong></p>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Chọn Email Config:</label>
            <select v-model="selectedConfigId" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option v-for="config in emailConfigs" :key="config._id" :value="config._id">
                {{ config.name }} ({{ config.sender?.email }})
              </option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-xl">
          <button @click="closeResendModal" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
            Hủy
          </button>
          <button @click="confirmResend" :disabled="!selectedConfigId || resendingModal" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            <i v-if="resendingModal" class="bi bi-arrow-clockwise animate-spin mr-1"></i>
            Gửi lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import { useToast } from '~/composables/useToast'
import Cookies from 'js-cookie'

const props = defineProps({
  isVisible: Boolean,
  campaign: Object
})

const emit = defineEmits(['close', 'refresh'])

const { success: showSuccess, error: showError } = useToast()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:8000/api'

// State
const realtimeStatus = ref(null)
const recipients = ref([])
const stats = ref({})
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const resending = ref({})
const pagination = ref({ page: 1, limit: 50, total: 0, totalPages: 0 })

// Resend modal state
const showResendModal = ref(false)
const pendingResendEmail = ref('')
const selectedConfigId = ref('')
const resendingModal = ref(false)
const emailConfigs = ref([])

// Auth
const authStore = useAuthStore()
const getAuthHeaders = async () => {
  const accessToken = authStore.accessToken || Cookies.get('accessToken')
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
}

const estimatedFinishTime = computed(() => {
  if (!realtimeStatus.value?.estimatedTimeRemaining) return '--:--'
  const now = new Date()
  const finishTime = new Date(now.getTime() + realtimeStatus.value.estimatedTimeRemaining * 60000)
  return formatTime(finishTime)
})

const fetchRecipients = async () => {
  if (!props.campaign?._id) return

  loading.value = true
  try {
    const headers = await getAuthHeaders()
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: pagination.value.limit
    })
    
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (searchQuery.value) params.append('search', searchQuery.value)

    const response = await fetch(
      `${apiBaseUrl}/campaigns/${props.campaign._id}/recipients/detailed?${params}`,
      { headers }
    )
    const data = await response.json()

    if (data.success) {
      recipients.value = data.data
      pagination.value = data.pagination
      stats.value = data.stats
    } else {
      showError(data.message || 'Lỗi khi tải dữ liệu')
    }
  } catch (error) {
    console.error('Error fetching recipients:', error)
    showError('Lỗi khi tải dữ liệu')
  } finally {
    loading.value = false
  }
}

// Fetch campaign sending status (Snapshot)
const fetchCampaignStatus = async () => {
  if (!props.campaign?._id) return
  // Fetch status regardless of current status to update progress if reopened
  
  try {
    const token = useCookie('token').value
    const headers = { Authorization: `Bearer ${token}` }
    
    const response = await $fetch(
      `${apiBaseUrl}/campaigns/${props.campaign._id}/progress`,
      { headers }
    )
    
    if (response.success && response.data) {
      realtimeStatus.value = {
        status: response.data.status,
        progress: response.data.progress || 0,
        queue: response.data.queue || {},
        schedule: response.data.schedule,
        estimatedTimeRemaining: response.data.estimatedTimeRemaining,
        nextEmailAt: response.data.nextEmailAt,
        startedAt: response.data.startedAt
      }
      
    }
  } catch (error) {
    console.error('Error fetching campaign status:', error)
  }
}

// Fetch email configs for user
const fetchEmailConfigs = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/email-config`, { headers })
    const data = await response.json()
    if (data.success) {
      emailConfigs.value = data.data || []
      // Select default config
      const defaultConfig = emailConfigs.value.find(c => c.isDefault) || emailConfigs.value[0]
      if (defaultConfig) selectedConfigId.value = defaultConfig._id
    }
  } catch (error) {
    console.error('Error fetching email configs:', error)
  }
}

const resendEmail = async (email) => {
  // Mở modal chọn email config thay vì alert
  pendingResendEmail.value = email
  if (emailConfigs.value.length === 0) {
    await fetchEmailConfigs()
  }
  showResendModal.value = true
}

const closeResendModal = () => {
  showResendModal.value = false
  pendingResendEmail.value = ''
}

const confirmResend = async () => {
  if (!pendingResendEmail.value || !selectedConfigId.value) return
  
  const email = pendingResendEmail.value
  resendingModal.value = true
  resending.value[email] = true
  
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(
      `${apiBaseUrl}/campaigns/${props.campaign._id}/recipients/${encodeURIComponent(email)}/resend`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ emailConfigId: selectedConfigId.value })
      }
    )
    const data = await response.json()

    if (data.success) {
      showSuccess('Email đã được gửi lại thành công')
      closeResendModal()
      await fetchRecipients()
      emit('refresh')
    } else {
      showError(data.message || 'Lỗi khi gửi email')
    }
  } catch (error) {
    console.error('Error resending email:', error)
    showError('Lỗi khi gửi email')
  } finally {
    resending.value[email] = false
    resendingModal.value = false
  }
}

const changePage = (page) => {
  pagination.value.page = page
  fetchRecipients()
}

const refreshData = () => {
  fetchRecipients()
  fetchCampaignStatus() // Also refresh status
}

const closeModal = () => {
  emit('close')
}

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchRecipients()
  }, 500)
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    opened: 'bg-purple-100 text-purple-800',
    clicked: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
    bounced: 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Chờ gửi',
    sent: 'Đã gửi',
    delivered: 'Đã nhận',
    opened: 'Đã mở',
    clicked: 'Đã click',
    failed: 'Thất bại',
    bounced: 'Bounced'
  }
  return texts[status] || status
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch for modal visibility
watch(() => props.isVisible, (visible) => {
  if (visible) {
    fetchRecipients()
    fetchCampaignStatus() // Load status once
  } else {
    realtimeStatus.value = null
  }
})

// Cleanup on unmount - nothing to clean up anymore
onUnmounted(() => {})
</script>
