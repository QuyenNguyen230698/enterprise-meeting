import { defineStore } from "pinia";

// Theme map giữ ở frontend — UI concern, không đưa vào DB
const APP_THEME_MAP = {
  "asset-handover":{ gradientClass: "bg-linear-to-br from-teal-500 via-teal-400 to-teal-700", textColor: "text-white" },
  "offboarding":   { gradientClass: "bg-linear-to-br from-orange-500 via-red-500 to-pink-500", textColor: "text-white" },
  "sign-hub":      { gradientClass: "bg-linear-to-br from-emerald-500 via-teal-400 to-violet-500", textColor: "text-white" },
  "bookings":      { gradientClass: "bg-linear-to-br from-emerald-500 via-teal-400 to-violet-500", textColor: "text-white" },
  "editor":        { gradientClass: "bg-linear-to-br from-sky-500 via-sky-400 to-sky-700", textColor: "text-white" },
  "email-lists":   { gradientClass: "bg-linear-to-br from-emerald-500 via-emerald-400 to-emerald-700", textColor: "text-white" },
  "templates":     { gradientClass: "bg-linear-to-br from-amber-500 via-amber-400 to-amber-700", textColor: "text-white" },
  "notifications": { gradientClass: "bg-linear-to-br from-red-500 via-red-400 to-red-600", textColor: "text-white" },
  "settings":      { gradientClass: "bg-linear-to-br from-gray-500 via-gray-400 to-gray-700", textColor: "text-white" },
  "user":          { gradientClass: "bg-linear-to-br from-violet-500 via-violet-400 to-violet-700", textColor: "text-white" },
  "dashboard":     { gradientClass: "bg-linear-to-br from-pink-500 via-pink-400 to-pink-700", textColor: "text-white" },
  "email-config":  { gradientClass: "bg-linear-to-br from-blue-500 via-blue-400 to-blue-700", textColor: "text-white" },
  "profile":       { gradientClass: "bg-linear-to-br from-violet-500 via-violet-400 to-violet-700", textColor: "text-white" },
  "recruitment":   { gradientClass: "bg-linear-to-br from-rose-500 via-rose-400 to-pink-600", textColor: "text-white" },
};

// Label hiển thị cho từng group (app_group từ DB → tên + icon sidebar)
const GROUP_META = {
  admin:    { name: "Meeting Room",    icon: "bi bi-shield-check" },
  email:    { name: "Email Marketing", icon: "bi bi-envelope" },
  system:   { name: "Hệ Thống",        icon: "bi bi-cpu" },
  settings: { name: "Cài đặt",         icon: "bi bi-gear" },
  hrm:      { name: "HRM System",      icon: "bi bi-people" },
  recruitment: { name: "HR — Recruitment", icon: "bi bi-people" },
};

// Fallback khi permission chưa có theme
const DEFAULT_THEME = { gradientClass: "bg-linear-to-br from-blue-500 to-blue-700", textColor: "text-white" };

export const useAppsStore = defineStore("apps", {
  state: () => ({
    // apps được build động từ API, cấu trúc: { [app_group]: { name, icon, apps: [...] } }
    apps: null,
    // Map: appCode (permission.name) → permission_id — dùng cho middleware + hasPermission
    permissionMap: {},
    loading: false,
    error: null,
  }),

  getters: {
    isReady: (state) => state.apps !== null,

    // Flat list toàn bộ apps (không lọc quyền)
    allApps: (state) => {
      if (!state.apps) return [];
      return Object.values(state.apps).reduce((acc, dept) => {
        return acc.concat(
          (dept.apps || []).map((a) => ({
            ...a,
            theme: APP_THEME_MAP[a.appCode] ?? DEFAULT_THEME,
          }))
        );
      }, []);
    },

    // Lọc departments theo permission_ids của user (từ JWT)
    visibleDepartments: (state) => (permissionIds) => {
      if (!state.apps) return {};
      const ids = new Set(permissionIds || []);
      const result = {};
      for (const [key, dept] of Object.entries(state.apps)) {
        const visibleApps = (dept.apps || []).filter((app) => {
          // Sub-page: cần cả permission của chính nó
          const pid = state.permissionMap[app.appCode];
          return pid === null || (pid && ids.has(pid));
        });
        if (visibleApps.length > 0) {
          result[key] = { ...dept, apps: visibleApps };
        }
      }
      return result;
    },

    // Flat list apps có quyền (dùng cho favorites filter)
    visibleApps: (state) => (permissionIds) => {
      if (!state.apps) return [];
      const ids = new Set(permissionIds || []);
      return Object.values(state.apps).flatMap((dept) =>
        (dept.apps || []).filter((app) => {
          const pid = state.permissionMap[app.appCode];
          return pid === null || (pid && ids.has(pid));
        })
      );
    },

    // Kiểm tra một appCode cụ thể có được phép không
    hasPermission: (state) => (appCode, permissionIds) => {
      const normalizedCode = typeof appCode === "string" ? appCode.toLowerCase() : appCode;
      const pid = state.permissionMap[appCode] || state.permissionMap[normalizedCode];
      return pid ? (permissionIds || []).includes(pid) : false;
    },
  },

  actions: {
    // Gọi API lấy toàn bộ permissions, build apps tree động
    async fetchApps() {
      if (this.loading || this.apps !== null) return;
      this.loading = true;
      this.error = null;
      try {
        const res = await useFetchAuth("/v1/roles/permissions");
        const permissions = res?.data || res || [];
        this._buildFromPermissions(permissions);
      } catch (e) {
        console.error("[appsStore] fetchApps error:", e);
        this.error = e?.message ?? "Không thể tải danh sách apps";
      } finally {
        this.loading = false;
      }
    },

    _buildFromPermissions(permissions) {
      const newPermissionMap = {};
      const groups = {};

      for (const perm of permissions) {
        const appCode = perm.name;
        const group   = perm.app_group;

        // Build permissionMap: appCode → permission_id
        newPermissionMap[appCode] = perm.permission_id;
        if (typeof appCode === "string") {
          newPermissionMap[appCode.toLowerCase()] = perm.permission_id;
        }

        // Chỉ hiển thị app trong sidebar nếu có app_path và app_group
        if (!perm.app_path || !group) continue;

        if (!groups[group]) {
          const meta = GROUP_META[group] ?? { name: group, icon: "bi bi-grid" };
          groups[group] = { name: meta.name, icon: meta.icon, apps: [] };
        }

        groups[group].apps.push({
          name:        _toDisplayName(appCode),
          appCode,
          icon:        perm.app_icon || "bi bi-app",
          path:        perm.app_path,
          description: perm.description || "",
          parentName:  perm.parent_name || null,
          theme:       APP_THEME_MAP[appCode] ?? DEFAULT_THEME,
        });
      }

      this.permissionMap = newPermissionMap;
      this.apps = groups;
    },

    // Dùng khi user đã login (từ plugin)
    initialize() {
      return this.fetchApps();
    },
  },
});

function _toDisplayName(appCode) {
  const map = {
    "bookings":      "Bookings",
    "editor":        "Editor",
    "email-lists":   "Email Lists",
    "templates":     "Templates",
    "notifications": "Notifications",
    "settings":      "Settings",
    "user":          "User Management",
    "dashboard":     "Dashboard",
    "email-config":  "Email Config",
    "profile":       "Profile",
    "offboarding":   "Offboarding",
    "sign-hub":      "Sign Hub",
    "asset-handover": "Asset Handover",
    "recruitment":    "Email Recruitment",
  };
  return map[appCode] ?? appCode;
}
