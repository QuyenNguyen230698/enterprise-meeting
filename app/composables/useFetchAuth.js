
export const useFetchAuth = async (request, opts = {}) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return $fetch(request, {
    baseURL: opts.baseURL || config.public.apiBase,
    ...opts,
    headers: {
      Authorization: authStore.accessToken ? `Bearer ${authStore.accessToken}` : undefined,
      ...opts?.headers
    },
    onResponseError({ response }) {
        if (response.status === 401) {
            authStore.logout()
        }
    }
  })
}
