export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  const appsStore = useAppsStore()

  if (!auth.isAuthenticated) return navigateTo('/login')

  if (auth.isSuperAdmin) return

  const permissionIds = auth.permissionIds
  const hasAccess =
    appsStore.hasPermission('asset_handover', permissionIds) ||
    appsStore.hasPermission('offboarding', permissionIds) ||
    appsStore.visibleApps(permissionIds).some(app =>
      typeof app.path === 'string' && (
        app.path.startsWith('/asset-handover') ||
        app.path.startsWith('/offboarding')
      )
    )

  if (!hasAccess) return navigateTo('/error-permission')
})
