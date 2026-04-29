// middleware/permission.js

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  const appsStore = useAppsStore();

  const publicRoutes = ['/login', '/callback', '/auth', '/error-permission'];
  if (publicRoutes.some((p) => to.path.startsWith(p))) return;

  if (!auth.isAuthenticated) return navigateTo('/login');

  const alwaysAllowed = ['/dashboard', '/settings/profile', '/guide', '/roadmap', '/support-dev', '/support'];
  if (alwaysAllowed.some((p) => to.path.startsWith(p))) return;

  // apps.client.ts plugin is async — appsStore is guaranteed ready before middleware runs.
  // If fetch failed (network error), fall through to error-permission rather than crash.
  const permissionIds = auth.permissionIds;
  const visibleDepts = appsStore.visibleDepartments(permissionIds);
  const allowedPaths = Object.values(visibleDepts).flatMap((dept) =>
    (dept.apps || []).map((app) => app.path)
  );

  const isAllowed = allowedPaths.some((p) => to.path.startsWith(p));
  if (!isAllowed) return navigateTo('/error-permission');
});
