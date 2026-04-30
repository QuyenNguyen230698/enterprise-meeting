// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: useCookie('accessToken').value || null,
    user: useCookie('authUser').value || null,
    isLoading: false,
  }),

  getters: {
    User: (state) => state.user,
    isAuthenticated: (state) => !!state.accessToken,
    token: (state) => state.accessToken,

    // Role info từ bảng roles
    roleId:   (state) => state.user?.role_id   || null,
    roleName: (state) => state.user?.role_name  || 'member',

    // Array permission_id — nguồn duy nhất để kiểm tra quyền
    permissionIds: (state) => state.user?.permission_ids || [],

    // Object permissions {appCode: ['view','create',...]} — backward compat với sidebar cũ
    permissions: (state) => state.user?.permissions || {},

    // Shortcuts dựa trên role_name (đọc từ DB, không hardcode logic)
    isSuperAdmin: (state) => state.user?.role_id === '2000000001',
    isAdminOnly:  (state) => state.user?.role_id === '2000000002',
    isAdmin:      (state) => ['2000000001', '2000000002'].includes(state.user?.role_id),
    isMember:     (state) => state.user?.role_id === '2000000003',
  },

  actions: {
    normalizeAuthPayload(data = {}) {
      const token = data.token || data.accessToken || null;
      const rawUser = data.user || data.profile || {};
      const permissionIds = Array.isArray(rawUser.permission_ids)
        ? rawUser.permission_ids.map((id) => String(id))
        : [];

      const user = {
        ...rawUser,
        role_id: rawUser?.role_id != null ? String(rawUser.role_id) : null,
        permission_ids: permissionIds,
      };

      return { token, user };
    },

    setAuth(data) {
      const tokenCookie = useCookie('accessToken', { maxAge: 60 * 60 * 24 });
      const userCookie = useCookie('authUser', { maxAge: 60 * 60 * 24 });

      const normalized = this.normalizeAuthPayload(data);
      this.accessToken = normalized.token;
      this.user = normalized.user;

      tokenCookie.value = normalized.token;
      userCookie.value = normalized.user;
    },

    async logout() {
      const tokenCookie = useCookie('accessToken');
      const userCookie = useCookie('authUser');

      this.accessToken = null;
      this.user = null;

      tokenCookie.value = null;
      userCookie.value = null;

      if (process.client) {
        window.location.href = '/login';
      } else {
        navigateTo('/login');
      }
    },

    async loginWithGoogle(code) {
      this.isLoading = true;
      try {
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase;
        const response = await $fetch(`${apiBase}/v1/auth/google`, {
          method: 'POST',
          body: { code, redirect_uri: config.public.googleRedirectUri },
        });

        const responseData = response?.data || response;
        const normalized = this.normalizeAuthPayload(responseData);
        const isSuccess =
          response?.status === 'success' ||
          response?.success === true ||
          (!!normalized.token && !!normalized.user);

        if (isSuccess && normalized.token && normalized.user) {
          this.setAuth(responseData);
          return { success: true };
        }

        return {
          success: false,
          message: response?.message || response?.error || 'Login failed',
        };
      } catch (error) {
        console.error('Google Login Error:', error);
        return {
          success: false,
          message:
            error?.data?.message ||
            error?.response?._data?.message ||
            error?.message ||
            'Login failed',
        };
      } finally {
        this.isLoading = false;
      }
    },

    initialize() {
      // Satisfy the plugin call in plugins/auth.client.ts
    },
  },
});