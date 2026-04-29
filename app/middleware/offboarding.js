export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const appsStore = useAppsStore()

  if (!auth.isAuthenticated) return navigateTo('/login')

  const permissionIds = auth.permissionIds
  const hasAccessByCode = appsStore.hasPermission('offboarding', permissionIds)
  const hasAccessByPath = appsStore
    .visibleApps(permissionIds)
    .some(app => typeof app.path === 'string' && app.path.startsWith('/offboarding'))
  const hasAccess = hasAccessByCode || hasAccessByPath

  if (auth.isSuperAdmin) return

  if (!hasAccess) return navigateTo('/error-permission')

  if (to.path === '/offboarding/submit' && !auth.isMember) {
    return navigateTo('/offboarding')
  }
})
