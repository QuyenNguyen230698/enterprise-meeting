import { defineStore } from 'pinia';

// Các route pattern cần xử lý breadcrumb đặc biệt
const SPECIAL_ROUTES = [
  '/app/wms/:id',  // Chi tiết WMS order
  '/app/oms/:id',  // Chi tiết OMS order
  '/app/wms/print/:id',  // In WMS order
  // Thêm các route pattern khác nếu cần
];

export const useBreadcrumbStore = defineStore('breadcrumb', {
  state: () => ({
    specialRoutes: SPECIAL_ROUTES,
    breadcrumbs: [],
  }),
  actions: {
    isSpecialRoute(path) {
      return this.specialRoutes.some(pattern => {
        // Chuyển pattern thành regex và làm cho nó case-insensitive
        const regexPattern = pattern.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${regexPattern}$`, 'i');
        return regex.test(path);
      });
    },
    setBreadcrumbs(items, path) {
      // Chỉ set breadcrumbs nếu là route đặc biệt
      if (this.isSpecialRoute(path)) {
        this.breadcrumbs = items;
      }
    },
    updateLastBreadcrumb(newName, keepUrl = true) {
      if (!this.breadcrumbs?.length) {
        console.warn('Cannot update last breadcrumb: breadcrumbs array is empty');
        return;
      }
      if (!newName && newName !== 0) {
        console.warn('Cannot update last breadcrumb: new name is empty');
        return;
      }

      const lastIndex = this.breadcrumbs.length - 1;
      const currentItem = this.breadcrumbs[lastIndex];
      
      this.breadcrumbs[lastIndex] = {
        ...currentItem,
        name: String(newName), // đảm bảo newName luôn là string
        url: keepUrl ? currentItem.url : undefined
      };
    },
    addBreadcrumb(item) {
      this.breadcrumbs.push(item);
    },
    removeBreadcrumb(index) {
      this.breadcrumbs.splice(index, 1);
    },
    clearBreadcrumbs() {
      this.breadcrumbs = [];
    }
  },
  getters: {
    currentBreadcrumbs: (state) => state.breadcrumbs,
    lastBreadcrumb: (state) => state.breadcrumbs[state.breadcrumbs.length - 1] || null
  }
});
