export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const appsStore = useAppsStore();

  // Await ensures appsStore is ready before any middleware or page runs.
  // Without await, middleware sees apps=null on hard refresh and redirects to /error-permission.
  if (authStore.isAuthenticated && !appsStore.isReady) {
    await appsStore.fetchApps();
  }

  authStore.$subscribe((_mutation, state) => {
    if (state.user && !appsStore.isReady) {
      appsStore.fetchApps();
    }
  });
});
