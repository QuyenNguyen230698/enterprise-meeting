const notifications = ref([])
const unreadCount = ref(0)
const loading = ref(false)
const pagination = ref({ page: 1, limit: 20, total: 0, totalPages: 0 })
let socketListenerBound = false

export const useNotifications = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBase || 'http://localhost:8000/api'
  const authStore = useAuthStore()
  const { getSocket } = useSocketIO()

  const getAuthHeaders = async () => {
    return { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${authStore.accessToken}` 
    }
  }

  const fetchNotifications = async (page = 1, unreadOnly = false) => {
    loading.value = true
    try {
      const headers = await getAuthHeaders()
      const params = new URLSearchParams({ page, limit: 20, unreadOnly })
      const response = await fetch(`${apiBaseUrl}/v1/notifications?${params}`, { headers })
      const data = await response.json()
      
      if (data.success) {
        if (page === 1) {
          notifications.value = data.data
        } else {
          notifications.value = [...notifications.value, ...data.data]
        }
        pagination.value = data.pagination
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/notifications/unread-count`, { headers })
      const data = await response.json()
      
      if (data.success) {
        unreadCount.value = data.data.count
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers
      })
      const data = await response.json()
      
      if (data.success) {
        const notification = notifications.value.find(n => n._id === notificationId)
        if (notification) {
          notification.isRead = true
        }
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/notifications/read-all`, {
        method: 'PUT',
        headers
      })
      const data = await response.json()
      
      if (data.success) {
        notifications.value.forEach(n => n.isRead = true)
        unreadCount.value = 0
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/notifications/${notificationId}`, {
        method: 'DELETE',
        headers
      })
      const data = await response.json()
      
      if (data.success) {
        const index = notifications.value.findIndex(n => n._id === notificationId)
        if (index > -1) {
          if (!notifications.value[index].isRead) {
            unreadCount.value = Math.max(0, unreadCount.value - 1)
          }
          notifications.value.splice(index, 1)
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      'ticket_new': 'bi-ticket-perforated',
      'ticket_reply': 'bi-chat-dots',
      'ticket_status': 'bi-arrow-repeat',
      'ticket_resolved': 'bi-check-circle',
      'system': 'bi-gear',
      'broadcast': 'bi-megaphone',
      'info': 'bi-info-circle',
      'warning': 'bi-exclamation-triangle',
      'success': 'bi-check-circle'
    }
    return icons[type] || 'bi-bell'
  }

  const getNotificationColor = (type) => {
    const colors = {
      'ticket_new': 'text-purple-600 bg-purple-100',
      'ticket_reply': 'text-blue-600 bg-blue-100',
      'ticket_status': 'text-amber-600 bg-amber-100',
      'ticket_resolved': 'text-emerald-600 bg-emerald-100',
      'system': 'text-gray-600 bg-gray-100',
      'broadcast': 'text-indigo-600 bg-indigo-100',
      'info': 'text-blue-600 bg-blue-100',
      'warning': 'text-amber-600 bg-amber-100',
      'success': 'text-emerald-600 bg-emerald-100'
    }
    return colors[type] || 'text-gray-600 bg-gray-100'
  }

  const hasMore = computed(() => pagination.value.page < pagination.value.totalPages)

  const loadMore = () => {
    if (hasMore.value && !loading.value) {
      fetchNotifications(pagination.value.page + 1)
    }
  }

  const connectSocket = () => {
    const socket = getSocket()
    if (!socket) return

    // Join rooms
    socket.emit('notification:join')
    if (authStore.user?.isSuperAdmin) {
      socket.emit('notification:join_admin')
    }

    // Đăng ký listener trực tiếp trên socket singleton, chỉ một lần
    if (!socketListenerBound) {
      socket.on('notification:new', (data) => {
        const notification = data.notification || data

        const exists = notifications.value.some(n => n._id === notification._id)
        if (!exists) {
          notifications.value.unshift(notification)
        }

        if (!notification.isRead) {
          unreadCount.value = unreadCount.value + 1
        }
      })

      // Rejoin rooms sau khi reconnect
      socket.on('connect', () => {
        socket.emit('notification:join')
        if (authStore.user?.isSuperAdmin) {
          socket.emit('notification:join_admin')
        }
      })

      socketListenerBound = true
    }
  }

  const disconnectSocket = () => {
    // Không cleanup listener — socket là singleton dùng chung
    // Chỉ reset khi user logout
  }

  return {
    notifications,
    unreadCount,
    loading,
    pagination,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    getNotificationIcon,
    getNotificationColor,
    connectSocket,
    disconnectSocket
  }
}
