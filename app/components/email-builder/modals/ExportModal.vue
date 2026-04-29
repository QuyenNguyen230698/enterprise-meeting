<template>
  <div class="fixed inset-0  flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <i class="bi bi-download text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Export Template</h2>
            <p class="text-sm text-gray-500">View and export your template JSON</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <i class="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 p-6 overflow-hidden flex flex-col">
        <!-- Template Info -->
        <div class="mb-4 flex items-center justify-between">
          <div class="text-sm text-gray-600 space-x-4">
            <span><i class="bi bi-layers text-blue-600"></i> <strong>{{ templateData?.elements?.length || 0 }}</strong> elements</span>
            <span><i class="bi bi-file-text text-green-600"></i> <strong>{{ formatFileSize(jsonString.length) }}</strong></span>
          </div>
          <button
            @click="copyToClipboard"
            :class="[
              'px-6 py-1.5 rounded-lg transition-all flex items-center gap-2 text-sm font-medium',
              copied 
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            <i :class="copied ? 'bi bi-check-lg' : 'bi bi-clipboard'" class="text-base"></i>
            {{ copied ? 'Copied!' : 'Copy JSON' }}
          </button>
        </div>

        <!-- JSON Preview -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-2">Template JSON</label>
          <textarea
            :value="jsonString"
            readonly
            class="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs bg-gray-50 resize-none min-h-96"
            spellcheck="false"
          ></textarea>
        </div>

        <!-- Success Message -->
        <div v-if="showSuccess && !copied" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <i class="bi bi-check-circle-fill text-green-600"></i>
          <span class="text-sm text-green-700">{{ successMessage }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
        <button
          @click="$emit('close')"
          class="px-6 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Close
        </button>
        
        <button
          @click="downloadFile"
          :disabled="isDownloading"
          :class="[
            'px-6 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 font-medium',
            'bg-green-600 text-white hover:bg-green-700',
            isDownloading ? 'opacity-50 cursor-not-allowed' : ''
          ]"
        >
          <i :class="isDownloading ? 'bi bi-hourglass-split animate-spin' : 'bi bi-download'" class="text-base"></i>
          {{ isDownloading ? 'Downloading...' : 'Download File' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>


const props = defineProps({
  templateData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// State
const copied = ref(false)
const isDownloading = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')

// Computed JSON string
const jsonString = computed(() => {
  return JSON.stringify(props.templateData, null, 2)
})

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
  return Math.round(bytes / (1024 * 1024)) + ' MB'
}

// Copy to clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(jsonString.value)
    copied.value = true
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

// Download as file
const downloadFile = async () => {
  isDownloading.value = true
  
  try {
    const blob = new Blob([jsonString.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `email-template-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    successMessage.value = 'Template downloaded successfully!'
    showSuccess.value = true
    
    setTimeout(() => {
      showSuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Download failed:', error)
  } finally {
    isDownloading.value = false
  }
}
</script>
