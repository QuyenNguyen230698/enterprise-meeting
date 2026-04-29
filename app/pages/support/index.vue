<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Sticky Header -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-30">
      <div class="px-4 sm:px-6 py-4">
        <div class="flex flex-col gap-4">

          <!-- Top Row -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <i class="bi bi-headset text-white text-lg sm:text-xl"></i>
              </div>
              <div>
                <h1 class="text-lg sm:text-2xl font-bold text-gray-900">Quản Lý Ticket</h1>
                <p class="text-xs text-gray-500 hidden sm:block">
                  <span v-if="authStore.isSuperAdmin">SuperAdmin · Tất cả yêu cầu hỗ trợ</span>
                  <span v-else-if="authStore.isAdminOnly">Admin · Ticket tenant của bạn</span>
                  <span v-else>Member · Ticket của bạn</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button @click="viewMode = 'grid'" :class="['px-3 py-1.5 rounded-md text-sm transition-all', viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
                  <i class="bi bi-grid-fill"></i>
                </button>
                <button @click="viewMode = 'list'" :class="['px-3 py-1.5 rounded-md text-sm transition-all', viewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
                  <i class="bi bi-list-ul"></i>
                </button>
              </div>
              <NuxtLink to="/support/create" class="px-4 py-2 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2">
                <i class="bi bi-plus-lg"></i>
                <span class="hidden sm:inline">Tạo Ticket</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Stats Tabs -->
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <button
              v-for="stat in statItems"
              :key="stat.key"
              @click="filterStatus = stat.key; pagination.page = 1; fetchTickets()"
              :class="['flex flex-col items-center justify-center py-2 px-2 rounded-xl border transition-all text-center', filterStatus === stat.key ? `${stat.activeBg} ${stat.activeText} border-transparent shadow-sm` : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600']"
            >
              <span class="text-lg font-bold leading-none">{{ stats[stat.key] ?? 0 }}</span>
              <span class="text-xs mt-0.5 whitespace-nowrap">{{ stat.label }}</span>
            </button>
          </div>

          <!-- Search & Filters -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <i class="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input v-model="searchQuery" @input="debouncedSearch" type="text" placeholder="Tìm kiếm ticket..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-xl text-sm transition-all outline-none shadow-sm" />
            </div>
            <div class="flex gap-2 flex-wrap sm:flex-nowrap">
              <!-- Danh mục (ẩn với member) -->
              <select v-if="!authStore.isMember" v-model="filterCategory" @change="pagination.page = 1; fetchTickets()" class="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:border-emerald-500 outline-none cursor-pointer shadow-sm">
                <option value="">Tất cả danh mục</option>
                <option value="question">Câu hỏi</option>
                <option value="bug">Báo lỗi</option>
                <option value="feature">Tính năng</option>
                <option value="billing">Thanh toán</option>
                <option value="other">Khác</option>
              </select>
              <select v-model="filterPriority" @change="pagination.page = 1; fetchTickets()" class="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:border-emerald-500 outline-none cursor-pointer shadow-sm">
                <option value="">Tất cả mức độ</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
              <select v-model="sortBy" @change="pagination.page = 1; fetchTickets()" class="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:border-emerald-500 outline-none cursor-pointer shadow-sm">
                <option value="-created_at">Mới nhất</option>
                <option value="created_at">Cũ nhất</option>
                <option value="-priority">Ưu tiên cao</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-h-0 overflow-y-auto bg-gray-50 p-4 sm:p-6">
      <div class="max-w-full mx-auto min-h-full flex flex-col">

        <!-- Loading -->
        <div v-if="loading" :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'">
          <div v-for="n in 6" :key="n" class="bg-gray-200 rounded-xl animate-pulse" :class="viewMode === 'grid' ? 'h-64' : 'h-20'"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="!tickets.length" class="flex-1 flex flex-col items-center justify-center min-h-100 text-center p-8">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <i class="bi bi-ticket-perforated text-gray-400 text-4xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Không Có Ticket Nào</h3>
          <p class="text-gray-500 mb-8 max-w-md">{{ searchQuery || filterStatus !== 'all' ? 'Không tìm thấy ticket phù hợp.' : 'Chưa có ticket hỗ trợ nào.' }}</p>
          <NuxtLink to="/support/create" class="px-6 py-3 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 text-white rounded-xl hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 transition-colors font-medium">
            <i class="bi bi-plus-lg mr-2"></i>Tạo Ticket Mới
          </NuxtLink>
        </div>

        <!-- Grid -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink v-for="ticket in tickets" :key="ticket.id" :to="`/support/${ticket.id}`" class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-emerald-300 group overflow-hidden flex flex-col">
            <div class="p-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-gray-100 group-hover:from-emerald-50 group-hover:to-lime-50 transition-colors">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform shrink-0">
                  <i :class="['bi text-emerald-600', getCategoryIcon(ticket.category)]"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-0.5">
                    <p class="text-xs font-mono text-gray-500">#{{ ticket.ticketNumber }}</p>
                    <span class="text-xs text-gray-400">{{ formatDate(ticket.createdAt) }}</span>
                  </div>
                  <h3 class="font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors text-sm">{{ ticket.subject }}</h3>
                  <p class="text-xs text-gray-400 mt-0.5 truncate">
                    <i class="bi bi-person mr-1"></i>{{ ticket.userName || ticket.userEmail || ticket.guestDisplayName || 'Ẩn danh' }}
                  </p>
                </div>
              </div>
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <p class="text-sm text-gray-600 line-clamp-2 mb-3 flex-1 leading-relaxed">{{ ticket.description }}</p>
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium border', getStatusClass(ticket.status)]">{{ getStatusLabel(ticket.status) }}</span>
                <span :class="['px-2 py-0.5 rounded-full text-xs font-medium border', getPriorityClass(ticket.priority)]">{{ getPriorityLabel(ticket.priority) }}</span>
                <span v-if="ticket.source === 'contact_form'" class="px-2 py-0.5 rounded-full text-xs font-medium border bg-teal-50 text-teal-700 border-teal-200">
                  <i class="bi bi-send mr-1"></i>Contact
                </span>
                <!-- Assigned badge -->
                <span v-if="ticket.assignedTo" class="px-2 py-0.5 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                  <i class="bi bi-person-check mr-1"></i>{{ ticket.assignedToName || ' Admin đang xử lý' }}
                </span>
                <!-- Locked badge -->
                <span v-if="ticket.isLocked" class="px-2 py-0.5 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                  <i class="bi bi-lock mr-1"></i>Đã khóa
                </span>
              </div>
              <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <i class="bi bi-chat-left-text"></i>
                  {{ ticket.comments?.length || 0 }} phản hồi
                </div>
                <span class="text-sm font-medium text-emerald-600 group-hover:underline decoration-2 underline-offset-2 flex items-center gap-1">
                  Xem <i class="bi bi-arrow-right"></i>
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- List -->
        <div v-else class="space-y-2">
          <NuxtLink v-for="ticket in tickets" :key="ticket.id" :to="`/support/${ticket.id}`" class="group bg-white rounded-xl border border-gray-200 px-4 py-3 hover:shadow-md transition-all flex items-center gap-4">
            <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <i :class="['bi', getCategoryIcon(ticket.category)]"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="font-mono text-xs text-gray-400">#{{ ticket.ticketNumber }}</span>
                <h3 class="font-semibold text-gray-900 truncate text-sm">{{ ticket.subject }}</h3>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <i class="bi bi-person"></i>
                <span class="truncate">{{ ticket.userName || ticket.userEmail || ticket.guestDisplayName || 'Ẩn danh' }}</span>
                <span>·</span>
                <span>{{ formatDate(ticket.createdAt) }}</span>
                <span v-if="ticket.assignedTo" class="text-blue-500">
                  · <i class="bi bi-person-check"></i> {{ ticket.assignedToName }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span v-if="ticket.isLocked" class="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                <i class="bi bi-lock mr-1"></i>Khóa
              </span>
              <span v-if="ticket.source === 'contact_form'" class="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium border bg-teal-50 text-teal-700 border-teal-200">Contact</span>
              <span :class="['px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap', getStatusClass(ticket.status)]">{{ getStatusLabel(ticket.status) }}</span>
              <span :class="['hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap', getPriorityClass(ticket.priority)]">{{ getPriorityLabel(ticket.priority) }}</span>
              <div class="hidden sm:flex items-center gap-1 text-xs text-gray-400 min-w-10 justify-end">
                <i class="bi bi-chat-left-text"></i> {{ ticket.comments?.length || 0 }}
              </div>
              <i class="bi bi-chevron-right text-gray-300 group-hover:text-emerald-500 transition-colors ml-1"></i>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="shrink-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
      <div class="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="text-sm text-gray-500">Hiển thị {{ tickets.length }} / {{ pagination.total }} ticket</div>
        <div class="flex items-center gap-2">
          <button @click="goToPage(pagination.page - 1)" :disabled="pagination.page <= 1" class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Trước</button>
          <div class="hidden sm:flex items-center gap-1">
            <button v-for="p in paginationPages" :key="p" @click="goToPage(p)" :class="['w-8 h-8 rounded-lg text-sm font-medium transition-colors', pagination.page === p ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 text-white' : 'text-gray-600 hover:bg-gray-50']">{{ p }}</button>
          </div>
          <span class="sm:hidden text-sm font-medium text-gray-900">Trang {{ pagination.page }} / {{ pagination.pages }}</span>
          <button @click="goToPage(pagination.page + 1)" :disabled="pagination.page >= pagination.pages" class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Sau</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'permission'] })

const ticketApi  = useTicketApi()
const authStore  = useAuthStore()
const { error: showError } = useToast()

const tickets    = ref([])
const stats      = ref({ all: 0, open: 0, in_progress: 0, waiting: 0, resolved: 0, closed: 0 })
const loading    = ref(false)
const pagination = ref({ page: 1, limit: 12, total: 0, pages: 1 })
const filterStatus   = ref('all')
const filterCategory = ref('')
const filterPriority = ref('')
const sortBy         = ref('-created_at')
const searchQuery    = ref('')
const viewMode       = ref('grid')

const statItems = [
  { key: 'all',         label: 'Tất cả', activeBg: 'bg-gray-800',   activeText: 'text-white' },
  { key: 'open',        label: 'Mở',     activeBg: 'bg-teal-100',   activeText: 'text-teal-700' },
  { key: 'in_progress', label: 'Xử lý',  activeBg: 'bg-amber-100',  activeText: 'text-amber-700' },
  { key: 'waiting',     label: 'Chờ',    activeBg: 'bg-lime-100',   activeText: 'text-lime-700' },
  { key: 'resolved',    label: 'Xong',   activeBg: 'bg-green-100',  activeText: 'text-green-700' },
  { key: 'closed',      label: 'Đóng',   activeBg: 'bg-gray-100',   activeText: 'text-gray-700' },
]

const paginationPages = computed(() => {
  const total = pagination.value.pages || 1
  const cur   = pagination.value.page
  const range = []
  for (let i = Math.max(1, cur - 2); i <= Math.min(total, cur + 2); i++) range.push(i)
  return range
})

// Member dùng /my-tickets, admin/superAdmin dùng /tickets
const fetchTickets = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sort: sortBy.value,
      status: filterStatus.value,
      category: filterCategory.value,
      priority: filterPriority.value,
      search: searchQuery.value,
    }
    const res = authStore.isMember
      ? await ticketApi.getMyTickets(params)
      : await ticketApi.getAllTickets(params)

    if (res.success) {
      tickets.value   = res.data
      pagination.value = res.pagination
    } else {
      showError(res.message || 'Không thể tải danh sách ticket')
    }
  } catch {
    showError('Không thể kết nối đến server')
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const res = authStore.isMember
      ? await ticketApi.getMyStats()
      : await ticketApi.getStats()
    if (res.success) stats.value = { all: res.data.total || 0, ...res.data }
  } catch {}
}

const goToPage = (page) => {
  if (page < 1 || page > pagination.value.pages) return
  pagination.value.page = page
  fetchTickets()
}

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { pagination.value.page = 1; fetchTickets() }, 300)
}

const getCategoryIcon  = (cat) => ({ question: 'bi-question-circle', bug: 'bi-bug', feature: 'bi-stars', billing: 'bi-credit-card', other: 'bi-ticket-detailed' })[cat] || 'bi-ticket-detailed'
const getStatusClass   = (s) => ({ open: 'bg-teal-50 text-teal-700 border-teal-200', in_progress: 'bg-amber-50 text-amber-700 border-amber-200', waiting: 'bg-lime-50 text-lime-700 border-lime-200', resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200', closed: 'bg-gray-100 text-gray-600 border-gray-200' })[s] || 'bg-gray-100 text-gray-600 border-gray-200'
const getStatusLabel   = (s) => ({ open: 'Mở', in_progress: 'Đang xử lý', waiting: 'Chờ phản hồi', resolved: 'Đã giải quyết', closed: 'Đã đóng' })[s] || s
const getPriorityClass = (p) => ({ low: 'bg-gray-50 text-gray-600 border-gray-200', medium: 'bg-teal-50 text-teal-700 border-teal-200', high: 'bg-orange-50 text-orange-700 border-orange-200', urgent: 'bg-red-50 text-red-700 border-red-200' })[p] || 'bg-gray-100 text-gray-600 border-gray-200'
const getPriorityLabel = (p) => ({ low: 'Thấp', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp' })[p] || p
const formatDate       = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

onMounted(() => { fetchTickets(); fetchStats() })
</script>
