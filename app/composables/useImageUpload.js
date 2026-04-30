export const useImageUpload = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBase 
  const authStore = useAuthStore()

  const getAuthHeaders = async () => {
    return {
      'Authorization': `Bearer ${authStore.accessToken}`
    }
  }

  /**
   * Upload multiple images with authentication
   */
  const uploadImages = async (files, folder = 'DATools', metadata = {}) => {
    const formData = new FormData()
    
    files.forEach(file => formData.append('images', file))
    formData.append('folder', folder)
    formData.append('metadata', JSON.stringify({ type: 'images', ...metadata }))

    try {
      const headers = await getAuthHeaders()
      const response = await $fetch(`${apiBaseUrl}/images/upload-multiple`, {
        method: 'POST',
        headers,
        body: formData
      })

      if (response?.success && response?.data) {
        return {
          success: true,
          data: response.data,
          urls: response.data.filter(item => item.url).map(item => item.url)
        }
      } else {
        throw new Error('Upload response invalid')
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      return {
        success: false,
        error: error.message || 'Upload failed'
      }
    }
  }

  /**
   * Upload single image with authentication
   */
  const uploadSingleImage = async (file, folder = 'DATools') => {
    const result = await uploadImages([file], folder)
    if (result.success && result.urls.length > 0) {
      return {
        success: true,
        url: result.urls[0],
        data: result.data[0]
      }
    }
    return result
  }

  /**
   * Get user's images with pagination
   */
  const getUserImages = async (options = {}) => {
    try {
      const headers = await getAuthHeaders()
      const params = new URLSearchParams()
      Object.entries(options).forEach(([k, v]) => { if (v) params.append(k, v) })
      
      const response = await $fetch(`${apiBaseUrl}/images/my-images?${params}`, {
        headers
      })

      if (response?.success) {
        return {
          success: true,
          images: response.data,
          pagination: response.pagination
        }
      }
      return { success: false, images: [], pagination: null }
    } catch (error) {
      console.error('Failed to fetch images:', error)
      return { success: false, images: [], error: error.message }
    }
  }

  /**
   * Delete image by ID
   */
  const deleteImage = async (imageId) => {
    try {
      const headers = await getAuthHeaders()
      headers['Content-Type'] = 'application/json'
      
      const response = await $fetch(`${apiBaseUrl}/images/delete`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ imageId })
      })

      return { success: response?.success || false }
    } catch (error) {
      console.error('Failed to delete image:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get storage stats
   */
  const getStorageStats = async () => {
    try {
      const headers = await getAuthHeaders()
      const response = await $fetch(`${apiBaseUrl}/images/storage-stats`, { headers })
      
      if (response?.success) {
        return { success: true, stats: response.data }
      }
      return { success: false, stats: null }
    } catch (error) {
      console.error('Failed to fetch storage stats:', error)
      return { success: false, stats: null }
    }
  }

  return {
    uploadImages,
    uploadSingleImage,
    getUserImages,
    deleteImage,
    getStorageStats
  }
}
