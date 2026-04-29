<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="toasts.length > 0"
        class="fixed top-4 right-4 z-50 space-y-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'max-w-sm p-4 rounded-lg shadow-lg border backdrop-blur-sm',
            toast.type === 'success' && 'bg-green-50 border-green-200 text-green-800',
            toast.type === 'error' && 'bg-red-50 border-red-200 text-red-800',
            toast.type === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
            toast.type === 'info' && 'bg-blue-50 border-blue-200 text-blue-800'
          ]"
        >
          <div class="flex items-start">
            <div class="shrink-0">
              <svg
                v-if="toast.type === 'success'"
                class="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else-if="toast.type === 'error'"
                class="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else-if="toast.type === 'warning'"
                class="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium">
                {{ toast.message }}
              </p>
              <p v-if="toast.description" class="mt-1 text-sm opacity-90">
                {{ toast.description }}
              </p>
            </div>
            <div class="ml-4 shrink-0">
              <button
                @click="removeToast(toast.id)"
                class="inline-flex rounded-md hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="[
                  toast.type === 'success' && 'focus:ring-green-500',
                  toast.type === 'error' && 'focus:ring-red-500',
                  toast.type === 'warning' && 'focus:ring-yellow-500',
                  toast.type === 'info' && 'focus:ring-blue-500'
                ]"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const toasts = ref([])
let toastId = 0

const addToast = (type, message, description = null, duration = 5000) => {
  const id = ++toastId
  const toast = { id, type, message, description }
  
  toasts.value.push(toast)
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Convenience methods
const success = (message, description = null) => addToast('success', message, description)
const error = (message, description = null) => addToast('error', message, description)
const warning = (message, description = null) => addToast('warning', message, description)
const info = (message, description = null) => addToast('info', message, description)

// Debounce function to prevent rapid calls
const { $_ } = useNuxtApp()
const isToastShowing = ref(false)

const showToastMessage = $_.debounce(async (data) => {
  if (data && !isToastShowing.value) {
    isToastShowing.value = true
    
    // Extract type and message from data
    const type = data.type || 'info'
    const message = data.customContent || data.message || 'Notification'
    const description = data.description || null
    
    // Add toast
    addToast(type, message, description)
    
    // Reset state after delay
    setTimeout(() => {
      isToastShowing.value = false
    }, 3000)
  }
}, 300)

defineExpose({
  success,
  error,
  warning,
  info,
  addToast,
  removeToast,
  showToastMessage
})
</script>