export const useTemplateAPI = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBase || 'http://localhost:8000/api'
  const authStore = useAuthStore()

  const getAuthHeaders = async () => {
   
    // Ensure token is valid before using
    try {
    } catch (error) {
      throw new Error('Authentication required. Please login again.')
    }
    
    const token = authStore.accessToken
    
    if (token) {
    } else {
      throw new Error('No authentication token available')
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  /**
   * Get template by ID
   */
  const getTemplate = async (templateId) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/templates/${templateId}`, {
        headers
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Không thể tải template')
      }

      return data.data
    } catch (error) {
      console.error('Error fetching template:', error)
      throw error
    }
  }

  /**
   * Create new template
   */
  const createTemplate = async (templateData) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/templates`, {
        method: 'POST',
        headers,
        body: JSON.stringify(templateData)
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Không thể tạo template')
      }

      return data.data
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  /**
   * Update existing template
   */
  const updateTemplate = async (templateId, templateData) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/templates/${templateId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(templateData)
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Không thể cập nhật template')
      }

      return data.data
    } catch (error) {
      console.error('Error updating template:', error)
      throw error
    }
  }

  /**
   * Delete template
   */
  const deleteTemplate = async (templateId) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/templates/${templateId}`, {
        method: 'DELETE',
        headers
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Không thể xóa template')
      }

      return data
    } catch (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }

  /**
   * Get user templates
   */
  const getUserTemplates = async (options = {}) => {
    try {
      const queryParams = new URLSearchParams()
      
      Object.entries(options).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const headers = await getAuthHeaders()
      const response = await fetch(`${apiBaseUrl}/v1/templates/my-templates?${queryParams}`, {
        headers
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Không thể tải danh sách templates')
      }

      return {
        templates: data.data,
        pagination: data.pagination
      }
    } catch (error) {
      console.error('Error fetching user templates:', error)
      throw error
    }
  }

  /**
   * Increment template usage
   */
  const incrementUsage = async (templateId) => {
    try {
      const headers = await getAuthHeaders()
      await fetch(`${apiBaseUrl}/v1/templates/${templateId}/use`, {
        method: 'POST',
        headers
      })
    } catch (error) {
      console.error('Error incrementing usage:', error)
    }
  }

  return {
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getUserTemplates,
    incrementUsage
  }
}
