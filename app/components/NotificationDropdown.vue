<template>
  <div>
    <!-- Notification Bell Button -->
    <button 
      @click="toggleDrawer"
      class="relative p-2 text-gray-500 hover:text-white bg-linear-to-r hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 rounded-lg transition-colors"
    >
      <i class="bi bi-bell text-xl"></i>
      <span 
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Backdrop Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen"
        @click="closeDrawer"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      ></div>
    </Transition>

    <!-- Notification Drawer -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isOpen"
        class="fixed right-0 top-0 h-full w-full sm:w-96 lg:w-1/4 bg-white shadow-2xl z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-emerald-50 via-teal-50 to-lime-50 shrink-0">
          <div class="flex items-center gap-3">
            <button 
              @click="closeDrawer"
              class="p-1.5 hover:bg-white/50 rounded-lg transition-colors lg:hidden"
            >
              <i class="bi bi-x text-xl text-gray-600"></i>
            </button>
            <div class="flex items-center gap-2">
              <i class="bi bi-bell text-emerald-600 text-lg"></i>
              <h3 class="font-bold text-gray-900 text-lg">Thông báo</h3>
              <span v-if="unreadCount > 0" class="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {{ unreadCount }}
              </span>
            </div>
          </div>
          <button 
            v-if="unreadCount > 0"
            @click="handleMarkAllRead"
            class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold px-3 py-1.5 hover:bg-white/50 rounded-lg transition-colors"
          >
            Đọc hết
          </button>
        </div>

        <!-- Notifications List -->
        <div class="flex-1 overflow-y-auto">
          <!-- Loading -->
          <div v-if="loading && notifications.length === 0" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-sm text-gray-500 font-medium">Đang tải thông báo...</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="notifications.length === 0" class="flex items-center justify-center h-full">
            <div class="text-center px-6">
              <div class="w-20 h-20 bg-linear-to-br from-emerald-100 via-teal-100 to-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-bell-slash text-emerald-400 text-3xl"></i>
              </div>
              <h4 class="text-base font-semibold text-gray-900 mb-1">Chưa có thông báo</h4>
              <p class="text-sm text-gray-500">Thông báo mới sẽ xuất hiện ở đây</p>
            </div>
          </div>

          <!-- Notification Items -->
          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="notification in notifications"
              :key="notification._id"
              @click="handleNotificationClick(notification)"
              class="cursor-pointer transition-all duration-200 group"
              :class="{ 'bg-orange-50/40': !notification.isRead && isOffboarding(notification), 'bg-emerald-50/30': !notification.isRead && !isOffboarding(notification) }"
            >
              <!-- Offboarding notification: view-only card (no approve/reject) -->
              <div v-if="isOffboarding(notification)" class="px-4 py-3">
                <div class="flex items-start gap-3 bg-white border border-orange-200 rounded-xl p-3 shadow-sm group-hover:border-orange-300 transition-colors">
                  <div class="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <i class="bi bi-file-earmark-text-fill text-orange-500 text-sm"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">{{ notification.title }}</p>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <span class="text-[10px] text-gray-400">{{ formatTime(notification.createdAt) }}</span>
                        <div v-if="!notification.isRead" class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    <p class="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{{ notification.message }}</p>
                    <div class="flex items-center gap-1 mt-1.5">
                      <span class="text-[10px] font-medium text-orange-600 flex items-center gap-1">
                        <i class="bi bi-box-arrow-up-right text-[9px]"></i> Xem chi tiết
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Default notification -->
              <div v-else class="px-6 py-4 hover:bg-gray-50">
                <div class="flex gap-4">
                  <div
                    class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    :class="getNotificationColor(notification.type)"
                  >
                    <i :class="getNotificationIcon(notification.type)" class="text-lg"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <p class="text-sm font-semibold text-gray-900 line-clamp-2">{{ notification.title }}</p>
                      <div class="flex items-center gap-2 shrink-0">
                        <span class="text-xs text-gray-400 font-medium">{{ formatTime(notification.createdAt) }}</span>
                        <div v-if="!notification.isRead" class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600 line-clamp-2">{{ notification.message }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More -->
            <div v-if="hasMore" class="p-4 text-center bg-gray-50">
              <button 
                @click="loadMore"
                :disabled="loading"
                class="text-sm text-emerald-600 hover:text-emerald-700 font-semibold px-4 py-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
              >
                {{ loading ? 'Đang tải...' : 'Xem thêm thông báo' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
          <NuxtLink 
            to="/notifications" 
            @click="closeDrawer"
            class="w-full text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center justify-center gap-2 py-3 hover:bg-white rounded-lg transition-colors"
          >
            <span>Xem tất cả thông báo</span>
            <i class="bi bi-arrow-right"></i>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>

const { 
  notifications, 
  unreadCount, 
  loading, 
  hasMore,
  fetchNotifications, 
  fetchUnreadCount, 
  markAsRead, 
  markAllAsRead,
  loadMore,
  getNotificationIcon,
  getNotificationColor,
  connectSocket,
} = useNotifications()

const isOffboarding = (notification) => !!notification.link?.startsWith('/offboarding/')

const isOpen = ref(false)
const dropdownRef = ref(null)

// Mobile detection
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth < 768 // md breakpoint
  }
  return false
})

const toggleDrawer = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await fetchNotifications()
    // Prevent body scroll when drawer is open
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeDrawer = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}

const handleNotificationClick = async (notification) => {
  if (!notification.isRead) {
    await markAsRead(notification._id)
  }
  
  if (notification.link) {
    closeDrawer()
    window.location.href = notification.link
  }
}

const handleMarkAllRead = async () => {
  await markAllAsRead()
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút`
  if (diffHours < 24) return `${diffHours} giờ`
  if (diffDays < 7) return `${diffDays} ngày`
  
  return date.toLocaleDateString('vi-VN')
}

// Close drawer with Escape key
const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeDrawer()
  }
}

// Refresh notifications and reconnect socket when window gains focus
let lastFetchTime = 0
const FETCH_DEBOUNCE_MS = 5000 // Only fetch once every 5 seconds

const handleVisibilityChange = () => {
  if (!document.hidden) {
    // Reconnect socket to ensure we're in the right rooms
    connectSocket()
    // Don't fetch unread count - socket will update it
    if (isOpen.value) {
      fetchNotifications()
    }
  }
}

// Refresh on window focus
const handleWindowFocus = () => {
  const now = Date.now()
  if (now - lastFetchTime < FETCH_DEBOUNCE_MS) {
    return // Skip if called too recently
  }
  lastFetchTime = now
  
  // Reconnect socket to ensure we're in the right rooms
  connectSocket()
  // Don't fetch unread count - socket will update it
  if (isOpen.value) {
    fetchNotifications()
  }
}

// Track if notifications have been loaded
const notificationsLoaded = ref(false)

const loadNotifications = async () => {
  if (!notificationsLoaded.value) {
    // Only fetch once on first open - socket handles updates after that
    fetchUnreadCount()
    notificationsLoaded.value = true
  }
}

// Load notifications when dropdown opens
watch(isOpen, (newValue) => {
  if (newValue) {
    loadNotifications()
    fetchNotifications()
  }
})

onMounted(() => {
  connectSocket()
  fetchUnreadCount()

  document.addEventListener('keydown', handleEscapeKey)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleWindowFocus)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleEscapeKey)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleWindowFocus)
})
</script>
