<template>
  <div class="h-full min-h-96 relative">
    <!-- Loading State -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Đang tải PDF...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
      <div class="text-center p-6">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="bi bi-exclamation-triangle text-red-500 text-2xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Không thể tải PDF</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <a 
          v-if="effectiveUrl"
          :href="effectiveUrl"
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
        >
          <i class="bi bi-box-arrow-up-right"></i>
          Mở trong tab mới
        </a>
      </div>
    </div>

    <!-- PDF Viewer using object tag -->
    <object 
      v-else-if="blobUrl"
      :data="blobUrl"
      type="application/pdf"
      class="w-full h-full border-0 rounded-lg shadow-sm min-h-96"
    >
      <!-- Fallback for browsers that don't support object -->
      <div class="flex items-center justify-center h-full p-6 bg-gray-50 rounded-lg">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="bi bi-file-pdf text-blue-600 text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Preview không khả dụng</h3>
          <p class="text-gray-500 mb-4">Trình duyệt của bạn không hỗ trợ xem PDF trực tiếp</p>
          <a 
            :href="effectiveUrl"
            target="_blank"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
          >
            <i class="bi bi-download"></i>
            Tải về PDF
          </a>
        </div>
      </div>
    </object>
    
    <!-- Fallback when no file or url -->
    <div v-else class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="bi bi-file-pdf text-gray-400 text-2xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">PDF Document</h3>
        <p class="text-gray-500">Không có file PDF để hiển thị</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  file: {
    type: [File, Blob],
    default: null
  },
  url: {
    type: String,
    default: null
  }
})

const blobUrl = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Effective URL for download links
const effectiveUrl = computed(() => props.url || (props.file ? blobUrl.value : null))

// Create blob URL from file or fetch from URL
const loadPdf = async () => {
  // Cleanup previous URL
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = null
  }
  
  error.value = null
  
  // Handle local file
  if (props.file) {
    blobUrl.value = URL.createObjectURL(props.file)
    return
  }
  
  // Handle remote URL - fetch and convert to blob
  if (props.url) {
    isLoading.value = true
    try {
      const response = await fetch(props.url, {
        credentials: 'include' // Include cookies for auth
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const blob = await response.blob()
      blobUrl.value = URL.createObjectURL(blob)
    } catch (err) {
      console.error('Error loading PDF:', err)
      error.value = 'Không thể tải file PDF. Vui lòng thử lại.'
    } finally {
      isLoading.value = false
    }
  }
}

watch([() => props.file, () => props.url], () => {
  loadPdf()
}, { immediate: true })

onUnmounted(() => {
  // Cleanup URL on component destroy
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
  }
})
</script>

<style scoped>
object {
  background: white;
}
</style>
