<template>
  <div style="z-index: 999999  !important" class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Select Image</h2>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <i class="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <div class="flex">
          <button
            @click="activeTab = 'upload'"
            :class="[
              'flex-1 px-4 py-3 text-sm font-medium',
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <i class="bi bi-cloud-upload mr-2"></i>
            Upload New
          </button>
          <button
            @click="activeTab = 'media'"
            :class="[
              'flex-1 px-4 py-3 text-sm font-medium',
              activeTab === 'media'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <i class="bi bi-images mr-2"></i>
            Media Library
          </button>
          <button
            @click="activeTab = 'url'"
            :class="[
              'flex-1 px-4 py-3 text-sm font-medium',
              activeTab === 'url'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            <i class="bi bi-link-45deg mr-2"></i>
            From URL
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-hidden">
        <!-- Upload Tab -->
        <div v-if="activeTab === 'upload'" class="h-full p-6">
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors h-full flex flex-col items-center justify-center"
          >
            <div v-if="!uploading">
              <i class="bi bi-cloud-upload text-6xl text-gray-400 mb-4"></i>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Upload Images</h3>
              <p class="text-gray-500 mb-4">Drag and drop your images here, or click to browse</p>
              <button
                @click="openFileDialog"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Files
              </button>
              <p class="text-xs text-gray-400 mt-2">Supports: JPG, PNG, GIF, WebP (Max 10MB each)</p>
            </div>
            
            <div v-else class="text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-600">Uploading images...</p>
            </div>
          </div>
          
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <!-- Media Library Tab -->
        <div v-else-if="activeTab === 'media'" class="h-full overflow-auto p-4">
          <!-- Loading State -->
          <div v-if="loadingMedia" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Loading images...</span>
          </div>
          
          <!-- Images Grid -->
          <div v-else-if="mediaImages.length > 0" class="grid grid-cols-4 gap-4">
            <div
              v-for="image in mediaImages"
              :key="image.id"
              @click="selectImage(image.url)"
              class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            >
              <img
                :src="image.thumbnail || image.url"
                :alt="image.alt"
                class="w-full h-full object-cover"
                @error="(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22%3ENo Image%3C/text%3E%3C/svg%3E'"
              />
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <i class="bi bi-images text-4xl text-gray-400 block mb-4"></i>
            <p class="text-gray-500 mb-2">Chưa có hình ảnh in media library</p>
            <p class="text-sm text-gray-400">Upload images to see them here</p>
          </div>
        </div>

        <!-- URL Tab -->
        <div v-else-if="activeTab === 'url'" class="h-full p-6">
          <div class="max-w-md mx-auto mt-12">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Add Image from URL</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  v-model="imageUrl"
                  type="url"
                  class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div v-if="imageUrl" class="border rounded-lg p-4">
                <p class="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  :src="imageUrl"
                  alt="Preview"
                  class="max-w-full h-32 object-contain mx-auto"
                  @error="imageError = true"
                  @load="imageError = false"
                />
                <p v-if="imageError" class="text-red-500 text-sm mt-2">Failed to load image</p>
              </div>
              
              <button
                @click="selectImage(imageUrl)"
                :disabled="!imageUrl || imageError"
                class="w-full px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Use This Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


const emit = defineEmits(['close', 'select'])

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase 
const authStore = useAuthStore()

const activeTab = ref('upload')
const uploading = ref(false)
const loadingMedia = ref(false)
const imageUrl = ref('')
const imageError = ref(false)
const fileInput = ref(null)

// Media library from API
const mediaImages = ref([])

const getAuthHeaders = async () => {
  return {
    'Authorization': `Bearer ${authStore.accessToken}`
  }
}

const loadMediaLibrary = async () => {
  loadingMedia.value = true
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/images/my-images?limit=50`, { headers })
    const data = await response.json()
    
    if (data?.success && data?.data) {
      mediaImages.value = data.data.map(img => {
        // variants is array of {variant, url} objects OR strings
        const getVariantUrl = (variants) => {
          if (!variants || variants.length === 0) return ''
          const first = variants[0]
          return typeof first === 'string' ? first : (first?.url || '')
        }
        
        const variantUrl = getVariantUrl(img.variants)
        return {
          id: img._id,
          url: img.url || variantUrl || '',
          thumbnail: img.thumbnail || variantUrl || img.url || '',
          alt: img.filename || 'Image'
        }
      })
    }
  } catch (error) {
    console.error('Failed to load media library:', error)
  } finally {
    loadingMedia.value = false
  }
}

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    await uploadFiles(files)
  }
}

const handleDrop = async (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  if (files.length > 0) {
    await uploadFiles(files)
  }
}

const uploadFiles = async (files) => {
  uploading.value = true
  
  try {
    const headers = await getAuthHeaders()
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    formData.append('folder', 'DATools')
    formData.append('metadata', JSON.stringify({ type: 'images' }))

    const response = await $fetch(`${apiBaseUrl}/images/upload-multiple`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (response?.success && response?.data?.length > 0) {
      // Use the first uploaded image
      const uploadedImage = response.data[0]
      selectImage(uploadedImage.url || uploadedImage.variants?.[0] || '')
    }
  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    uploading.value = false
  }
}

const selectImage = (url) => {
  if (url) {
    emit('select', url)
    emit('close')
  }
}

onMounted(() => {
  loadMediaLibrary()
})
</script>
