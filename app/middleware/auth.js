// middleware/auth.js

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  const publicRoutes = ['/login', '/callback', '/auth'];
  if (publicRoutes.some((p) => to.path.startsWith(p))) return;

  if (!auth.isAuthenticated) return navigateTo('/login');
});