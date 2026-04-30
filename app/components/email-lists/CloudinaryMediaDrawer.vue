<template>
  <teleport to="body">
    <div v-if="isVisible" class="fixed inset-0 overflow-hidden" style="z-index: 9999999 !important">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 transition-opacity duration-300" :class="isVisible ? 'opacity-100' : 'opacity-0'" @click="closeDrawer"></div>
      
      <!-- Drawer -->
      <div class="absolute right-0 top-0 h-full w-full bg-white shadow-2xl flex flex-col md:max-w-2xl transform transition-transform duration-300 ease-out"
           :class="isVisible ? 'translate-x-0' : 'translate-x-full'">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
          <div class="min-w-0 flex-1">
            <h3 class="text-base md:text-lg font-semibold text-gray-900 truncate">Thư viện ảnh</h3>
            <p class="text-xs md:text-sm text-gray-500 mt-1">Chọn ảnh từ thư viện</p>
          </div>
          <button @click="closeDrawer" class="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
            <i class="bi bi-x-lg text-lg md:text-xl"></i>
          </button>
        </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-hidden flex flex-col">
        <!-- Search Bar -->
        <div class="p-3 md:p-4 border-b border-gray-200 bg-gray-50">
          <div class="relative">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm md:text-base"></i>
            <input
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text"
              placeholder="Tìm kiếm ảnh..."
              class="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
            />
          </div>
        </div>
        
        <!-- Images Grid -->
        <div class="flex-1 overflow-auto p-3 md:p-4">
          <div v-if="loading" class="flex items-center justify-center h-48 md:h-64">
            <i class="bi bi-arrow-repeat animate-spin text-xl md:text-2xl text-gray-400"></i>
          </div>
          
          <div v-else-if="images.length === 0" class="text-center py-8 md:py-12">
            <i class="bi bi-images text-3xl md:text-4xl text-gray-300 block mb-3"></i>
            <p class="text-sm md:text-base text-gray-500">Không tìm thấy ảnh nào</p>
          </div>
          
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div
              v-for="image in images"
              :key="image.public_id"
              @click="selectImage(image)"
              class="relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all aspect-square"
              :class="selectedImage?.public_id === image.public_id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'"
            >
              <img
                :src="image.secure_url"
                :alt="image.public_id"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              
              <!-- Selected Check Icon - Top Left -->
              <div v-if="selectedImage?.public_id === image.public_id" class="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <i class="bi bi-check text-white text-xs font-bold"></i>
              </div>
              
              <!-- Hover Actions -->
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="flex gap-2">
                  <button
                    @click.stop="copyImageUrl(image)"
                    class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                    title="Copy URL"
                  >
                    <i class="bi bi-link-45deg text-gray-700 text-xs"></i>
                  </button>
                  <button
                    @click.stop="openPreview(image)"
                    class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                    title="Preview"
                  >
                    <i class="bi bi-eye text-gray-700 text-xs"></i>
                  </button>
                </div>
              </div>
              
              <!-- Info -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p class="text-white text-xs truncate font-medium">{{ image.public_id.split('/').pop() }}</p>
                <p class="text-white/80 text-xs">{{ formatFileSize(image.bytes) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <button
              @click="prevPage"
              :disabled="currentPage <= 1"
              class="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="bi bi-chevron-left text-sm md:text-base"></i>
            </button>
            <span class="text-xs md:text-sm text-gray-600 font-medium">Trang {{ currentPage }} / {{ totalPages }}</span>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i class="bi bi-chevron-right text-sm md:text-base"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-3 md:p-4 border-t border-gray-200 bg-white shadow-lg">
        <!-- Selected Image Preview -->
        <div v-if="selectedImage" class="mb-3 md:mb-4">
          <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div class="shrink-0">
              <img
                :src="selectedImage.secure_url"
                class="h-12 w-12 md:h-14 md:w-14 object-cover rounded-lg border border-gray-200"
                alt="Selected image"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs md:text-sm font-medium text-gray-900 truncate">{{ selectedImage.public_id.split('/').pop() }}</p>
              <p class="text-xs text-gray-500 mb-2 truncate">{{ selectedImage.secure_url }}</p>
              <button
                @click="copyImageUrl(selectedImage)"
                class="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs text-gray-700 transition-colors"
              >
                <i class="bi bi-clipboard"></i>
                Copy URL
              </button>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            @click="closeDrawer"
            class="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors order-2 sm:order-1"
          >
            <i class="bi bi-x-lg mr-2"></i>
            <span>Hủy</span>
          </button>
          <button
            @click="confirmSelection"
            :disabled="!selectedImage"
            class="w-full sm:w-auto px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 flex items-center justify-center"
          >
            <i class="bi bi-check-lg mr-2"></i>
            <span>Chọn ảnh</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Preview Modal -->
    <div v-if="previewImage" class="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999999]" @click="closePreview">
      <div class="relative max-w-4xl max-h-[90vh] m-4">
        <img
          :src="previewImage.secure_url"
          :alt="previewImage.public_id"
          class="w-full h-full object-contain rounded-lg"
        />
        <button
          @click="closePreview"
          class="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
        >
          <i class="bi bi-x-lg text-gray-700"></i>
        </button>
      </div>
    </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  listId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'select'])

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase 
const authStore = useAuthStore()

const images = ref([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const selectedImage = ref(null)
const searchTimeout = ref(null)
const previewImage = ref(null)

const debouncedSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1
    fetchImages()
  }, 500)
}

const fetchImages = async () => {
  loading.value = true
  try {
    const headers = { 'Authorization': `Bearer ${authStore.accessToken}` }
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: 18,
      ...(searchQuery.value && { search: searchQuery.value })
    })
    
    const response = await fetch(`${apiBaseUrl}/email-lists/${props.listId}/cloudinary-images?${params}`, { headers })
    const data = await response.json()
    
    if (data.success) {
      images.value = data.data.images || []
      totalPages.value = data.data.totalPages || 1
    }
  } catch (error) {
    console.error('Error fetching images:', error)
  } finally {
    loading.value = false
  }
}

const selectImage = (image) => {
  selectedImage.value = image
}

const copyImageUrl = async (image) => {
  try {
    await navigator.clipboard.writeText(image.secure_url)
    // Show success feedback
    const originalText = event.target?.innerHTML
    if (event.target) {
      event.target.innerHTML = '<i class="bi bi-check text-green-600"></i>'
      setTimeout(() => {
        event.target.innerHTML = originalText
      }, 2000)
    }
  } catch (error) {
    console.error('Failed to copy URL:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = image.secure_url
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

const openPreview = (image) => {
  previewImage.value = image
}

const closePreview = () => {
  previewImage.value = null
}

const confirmSelection = () => {
  if (selectedImage.value) {
    emit('select', selectedImage.value.secure_url)
    closeDrawer()
  }
}

const closeDrawer = () => {
  emit('close')
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchImages()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchImages()
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    selectedImage.value = null
    searchQuery.value = ''
    currentPage.value = 1
    fetchImages()
  }
})
</script>
