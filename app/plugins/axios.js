import axios from 'axios'
import Cookies from 'js-cookie'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public
  const authStore = useAuthStore()

  const instance = axios.create({
    baseURL: config.apiBase,
  })

  instance.interceptors.request.use((request) => {
    const accessToken = authStore.accessToken || Cookies.get('accessToken')
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`
    }
    return request
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true
        if (authStore.refreshToken || Cookies.get('refreshToken')) {
          try {
            const response = await instance.post('/auth/refresh-token', {
              refreshToken: authStore.refreshToken || Cookies.get('refreshToken')
            })
            authStore.setTokens(response.data)
            Cookies.set('accessToken', response.data.accessToken)
            Cookies.set('refreshToken', response.data.refreshToken)
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
            return instance(originalRequest)
          } catch (refreshError) {
            authStore.clearTokens()
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            await navigateTo('/')
          }
        } else {
          authStore.clearTokens()
          Cookies.remove('accessToken')
          Cookies.remove('refreshToken')
          await navigateTo('/')
        }
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios: instance,
    },
  }
})
