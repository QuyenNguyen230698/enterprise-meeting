<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-3xl">
      <!-- Error Card -->
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <!-- Error Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center">
            <div class="shrink-0">
              <div class="h-8 w-8">
                <i :class="['text-2xl', errorDetails.icon, errorDetails.color]"></i>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">
                {{ errorDetails.title }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ errorDetails.message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error Content -->
        <div class="px-6 py-4">
          <!-- Error Stack in Development -->
          <div v-if="error?.stack && isDev" class="mb-4 bg-gray-50 rounded-md overflow-hidden">
            <div class="px-6 py-1.5 bg-gray-100 border-b border-gray-200">
              <h4 class="text-sm font-medium text-gray-900">Error Stack</h4>
            </div>
            <pre class="p-4 text-xs text-gray-600 overflow-auto max-h-40 whitespace-pre-wrap">{{ error.stack }}</pre>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              @click="handleError"
              class="inline-flex items-center justify-center px-6 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              <i class="bi bi-arrow-clockwise mr-2"></i>
              Try Again
            </button>
            <button
              @click="navigateToHome"
              class="inline-flex items-center justify-center px-6 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              <i class="bi bi-house mr-2"></i>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// Props
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

// Composables
const router = useRouter()

// Environment check
const isDev = process.env.NODE_ENV === 'development'

// Computed
const errorDetails = computed(() => {
  if (!props.error) {
    return {
      title: 'An Error Occurred',
      message: 'Sorry, something went wrong.',
      icon: 'bi-exclamation-circle',
      color: 'text-yellow-600'
    }
  }

  let title = ''
  let message = props.error.message || ''
  let icon = ''
  let color = ''

  switch (props.error.statusCode) {
    case 404:
      title = 'Page Not Found'
      icon = 'bi-question-circle'
      color = 'text-blue-600'
      if (message.includes('not found:')) {
        try {
          const path = message.split('not found:')[1].trim()
          message = `Cannot find page: ${decodeURIComponent(path)}`
        } catch (e) {
          console.error('Error decoding URL:', e)
        }
      }
      break

    case 403:
      title = 'Access Denied'
      message = 'You do not have permission to access this resource'
      icon = 'bi-lock'
      color = 'text-red-600'
      break

    case 500:
      title = 'Server Error'
      icon = 'bi-exclamation-triangle'
      color = 'text-red-600'
      break

    case 503:
      title = 'Service Unavailable'
      message = 'The server is temporarily unable to handle your request'
      icon = 'bi-clock-history'
      color = 'text-yellow-600'
      break

    default:
      title = 'An Error Occurred'
      icon = 'bi-exclamation-circle'
      color = 'text-yellow-600'
  }

  return { title, message, icon, color }
})

// Methods
const handleError = () => {
  clearError()
  router.go()
}

const navigateToHome = () => {
  clearError()
  router.push('/')
}

</script>

<style>
/* Animations will be handled by Tailwind */
</style>