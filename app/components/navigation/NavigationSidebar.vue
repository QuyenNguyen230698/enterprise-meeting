<template>
  <div class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">

    <!-- Favorite Apps -->
    <div v-if="filteredFavoriteApps.length" class="mb-4">
      <div
        class="px-3 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider transition-opacity duration-300 whitespace-nowrap overflow-hidden"
        :class="{ 'opacity-0 h-0 mb-0': !sidebarOpen || isTablet }"
      >
        App Yêu Thích
      </div>
      <NuxtLink
        v-for="app in filteredFavoriteApps"
        :key="app.appCode"
        :to="app.path"
        :class="[
          'flex items-center px-3 py-2.5 rounded-xl transition-all group relative',
          isActive(app.path)
            ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 !text-white shadow-sm hover:opacity-90'
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
        ]"
        :title="(!sidebarOpen || isTablet) ? app.name : ''"
      >
        <i :class="[app.icon, 'text-xl shrink-0']"></i>
        <span class="ml-3 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden" :class="{ 'w-0 opacity-0': !sidebarOpen || isTablet }">{{ app.name }}</span>
      </NuxtLink>
    </div>

    <!-- Divider after favorites -->
    <div v-if="filteredFavoriteApps.length" class="my-2 border-t border-zinc-100 mx-3"></div>    <!-- Dynamic Departments (from appsStore — filtered by permission_ids) -->
    <template v-for="(department, key) in visibleDepartments">
      <div :key="key" v-if="department.apps.length > 0" class="mb-1">
        <!-- Section Header (Clickable for Collapse) -->
        <button
          @click="toggleSection(key)"
          class="w-full flex items-center justify-between px-3 mt-4 mb-2 group/header focus:outline-none transition-all duration-300"
          :class="{ 'opacity-0 h-0 my-0 overflow-hidden': !sidebarOpen || isTablet }"
        >
          <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover/header:text-zinc-600 transition-colors">
            {{ department.name }}
          </span>
          <i 
            class="bi bi-chevron-down text-[10px] text-zinc-400 transition-transform duration-300"
            :class="{ 'rotate-[-90deg]': collapsedSections[key] }"
          ></i>
        </button>

        <Transition name="expand">
          <div v-show="!collapsedSections[key] || !sidebarOpen || isTablet" class="space-y-1 overflow-hidden">
            <NuxtLink
              v-for="app in department.apps"
              :key="app.appCode"
              :to="app.path"
              :class="[
                'flex items-center px-3 py-2.5 rounded-xl transition-all group relative',
                isActive(app.path)
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 !text-white shadow-sm hover:opacity-90'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
              ]"
              :title="(!sidebarOpen || isTablet) ? app.name : ''"
            >
              <i :class="[app.icon, 'text-xl shrink-0']"></i>
              <span class="ml-3 flex-1 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden" :class="{ 'w-0 opacity-0': !sidebarOpen || isTablet }">{{ app.name }}</span>
            </NuxtLink>
          </div>
        </Transition>

        <div v-if="hasNextVisibleDepartment(key)" class="my-2 border-t border-zinc-100 mx-3"></div>
      </div>
    </template>

    <!-- Help & Support -->
    <div class="my-2 border-t border-zinc-100 mx-3"></div>
    <button
      @click="toggleSection('help')"
      class="w-full flex items-center justify-between px-3 mt-4 mb-2 group/header focus:outline-none transition-all duration-300"
      :class="{ 'opacity-0 h-0 mb-0 overflow-hidden': !sidebarOpen || isTablet }"
    >
      <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover/header:text-zinc-600 transition-colors">
        Trợ Giúp
      </span>
      <i 
        class="bi bi-chevron-down text-[10px] text-zinc-400 transition-transform duration-300"
        :class="{ 'rotate-[-90deg]': collapsedSections['help'] }"
      ></i>
    </button>

    <Transition name="expand">
      <div v-show="!collapsedSections['help'] || !sidebarOpen || isTablet" class="space-y-1 overflow-hidden">
        <!-- Support — mọi role đã đăng nhập -->
        <NuxtLink
          to="/support"
          :class="[
            'flex items-center px-3 py-2.5 rounded-xl transition-all group relative',
            isActive('/support') && !isActive('/support-dev')
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 !text-white shadow-sm hover:opacity-90'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
          ]"
          :title="(!sidebarOpen || isTablet) ? 'Hỗ Trợ' : ''"
        >
          <i class="bi bi-headset text-xl shrink-0"></i>
          <span class="ml-3 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden" :class="{ 'w-0 opacity-0': !sidebarOpen || isTablet }">Hỗ Trợ</span>
        </NuxtLink>

        <NuxtLink
          to="/guide"
          :class="[
            'flex items-center px-3 py-2.5 rounded-xl transition-all group relative mt-1',
            isActive('/guide')
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 !text-white shadow-sm hover:opacity-90'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
          ]"
          :title="(!sidebarOpen || isTablet) ? 'Tài Liệu' : ''"
        >
          <i class="bi bi-book text-xl shrink-0"></i>
          <span class="ml-3 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden" :class="{ 'w-0 opacity-0': !sidebarOpen || isTablet }">Tài Liệu</span>
        </NuxtLink>

        <NuxtLink
          to="/roadmap"
          :class="[
            'flex items-center px-3 py-2.5 rounded-xl transition-all group relative mt-1',
            isActive('/roadmap')
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 !text-white shadow-sm hover:opacity-90'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
          ]"
          :title="(!sidebarOpen || isTablet) ? 'Lộ Trình Phát Triển' : ''"
        >
          <i class="bi bi-map text-xl shrink-0"></i>
          <span class="ml-3 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden" :class="{ 'w-0 opacity-0': !sidebarOpen || isTablet }">Lộ Trình Phát Triển</span>
        </NuxtLink>

        <NuxtLink
          to="/support-dev"
          :class="[
            'flex items-center px-3 py-2.5 rounded-xl transition-all group relative mt-1',
            isActive('/support-dev')
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 !text-white shadow-sm hover:opacity-90'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
          ]"
          :title="(!sidebarOpen || isTablet) ? 'Dự Án' : ''"
        >
          <i class="bi bi-heart-fill text-xl shrink-0"></i>
          <span class="ml-3 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden" :class="{ 'w-0 opacity-0': !sidebarOpen || isTablet }">Dự Án</span>
        </NuxtLink>
      </div>
    </Transition>

  </div>
</template>

<script setup>
const props = defineProps({
  sidebarOpen: { type: Boolean, default: true },
  isTablet:    { type: Boolean, default: false },
});

const appsStore    = useAppsStore();
const auth         = useAuthStore();
const favoriteStore = useFavoriteStore();
const route        = useRoute();

// Departments đã lọc theo permission_ids từ JWT — source of truth duy nhất
const visibleDepartments = computed(() => appsStore.visibleDepartments(auth.permissionIds));

// Kiểm tra permission theo appCode (dùng permissionMap từ store)
const hasPermission = (appCode) => appsStore.hasPermission(appCode, auth.permissionIds);

// Favorite apps: chỉ hiển thị app nằm trong visibleApps
const favoriteApps = computed(() => favoriteStore.favoriteApps);
const filteredFavoriteApps = computed(() => {
  const visibleList = appsStore.visibleApps(auth.permissionIds);
  return visibleList.filter((app) => favoriteApps.value.includes(app.appCode));
});

// isActive dùng app.path thay vì appCode để khớp đúng route
const isActive = (path) => {
  if (!path) return false;
  // Exact match cho root paths ngắn để tránh /settings match /settings/email-config
  if (path === '/dashboard') return route.path === '/dashboard' || route.path.startsWith('/dashboard/');
  return route.path.startsWith(path);
};

// Check if there is another visible department after current key (for divider)
const hasNextVisibleDepartment = (currentKey) => {
  const entries = Object.entries(visibleDepartments.value || {});
  const idx = entries.findIndex(([k]) => k === currentKey);
  for (let i = idx + 1; i < entries.length; i++) {
    if (entries[i][1].apps?.length > 0) return true;
  }
  return false;
};

// --- Collapse Logic ---
const collapsedSections = ref({});

// Load collapsed state from localStorage on mount (optional but recommended)
onMounted(() => {
  const saved = localStorage.getItem('sidebar_collapsed_sections');
  if (saved) {
    try {
      collapsedSections.value = JSON.parse(saved);
    } catch (e) {
      collapsedSections.value = {};
    }
  }
});

const toggleSection = (key) => {
  collapsedSections.value[key] = !collapsedSections.value[key];
  localStorage.setItem('sidebar_collapsed_sections', JSON.stringify(collapsedSections.value));
};

// Expand active submenu on mount
onMounted(() => {
  // Find which department the current app belongs to and ensure it's expanded
  const departments = visibleDepartments.value;
  for (const [key, dept] of Object.entries(departments)) {
    if (dept.apps.some(app => isActive(app.path))) {
      collapsedSections.value[key] = false;
    }
  }
});

// Close submenus when sidebar collapses
const openMenus = ref({});
watch(() => props.sidebarOpen, (val) => { if (!val) openMenus.value = {}; });
</script>

<style scoped>
.group { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.group:hover { transform: translateX(2px); }
i { transition: transform 0.2s ease; }
.group\/header:hover i { transform: translateX(2px); }

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 500px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
</style>
