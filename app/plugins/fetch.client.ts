// Global $fetch plugin with Auth interceptor
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const customFetch = $fetch.create({
    onRequest(context) {
      const { options } = context
      const token = authStore.accessToken
      
      if (token) {
        options.headers = options.headers || {}
        
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${token}`)
        } else if (Array.isArray(options.headers)) {
          options.headers.push(['Authorization', `Bearer ${token}`])
        } else if (typeof options.headers === 'object') {
          options.headers['Authorization'] = `Bearer ${token}`
        }
      }
    }
  })

  if (process.client) {
    globalThis.$fetch = customFetch
  }
})
