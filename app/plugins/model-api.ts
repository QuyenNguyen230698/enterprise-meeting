

export default defineNuxtPlugin((nuxtApp) => {
  const { $moment, $filters, $_ } = nuxtApp;
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  return {
    provide: {
      modelAPI: {
       
      },
    }
  }
});