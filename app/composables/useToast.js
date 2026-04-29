import { ref } from 'vue'

const toasts = ref([])
const recentMessages = new Map() // Track recent messages to prevent duplicates

export const useToast = () => {
  const show = (message, type = 'info', duration = 3000) => {
    // Prevent duplicate toasts within 500ms
    const key = `${type}:${message}`
    const now = Date.now()
    const lastShown = recentMessages.get(key)
    
    if (lastShown && now - lastShown < 500) {
      return null // Skip duplicate
    }
    recentMessages.set(key, now)
    
    // Clean up old entries
    if (recentMessages.size > 20) {
      const oldestKey = recentMessages.keys().next().value
      recentMessages.delete(oldestKey)
    }
    
    const id = now
    const toast = { id, message, type, visible: true }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
    
    return id
  }
  
  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message, duration) => show(message, 'success', duration)
  const error = (message, duration = 5000) => show(message, 'error', duration)
  const warning = (message, duration) => show(message, 'warning', duration)
  const info = (message, duration) => show(message, 'info', duration)
  
  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}
