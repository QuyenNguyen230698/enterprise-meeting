
export const useFetchAuth = async (request, opts = {}) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  try {
    return await $fetch(request, {
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
  } catch (err) {
    // $fetch throws FetchError for non-2xx responses; return the parsed response body
    // so callers can handle {success: false, message: ...} normally instead of catching
    if (err?.data !== undefined) return err.data
    throw err
  }
}
