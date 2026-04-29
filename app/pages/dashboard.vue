<template>
  <div
    class="w-full bg-gray-50 flex flex-col h-full overflow-auto px-4 sm:px-6 lg:px-8 py-4"
  >
    <DashboardPageHeader :username="authStore.User?.profile?.fullName || ''" />

    <DashboardPageStats
      :total-apps="allApps.length"
      :active-apps="filteredApps.length + filteredFavoriteApps.length"
      :total-users="1"
      :recent-activities="5"
    />

    <DashboardPageFilters
      v-model:search="searchQuery"
      v-model:category="selectedCategory"
      v-model:viewMode="viewMode"
      :total-results="filteredApps.length + filteredFavoriteApps.length"
    />

    <TransitionGroup name="favorite-section">
      <section
        v-if="filteredFavoriteApps.length"
        :key="'favorite'"
        class="mb-4 lg:mb-8"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              Ứng Dụng Yêu Thích
            </h2>
            <p class="text-sm text-gray-500 mt-1">Ứng dụng được ghim của bạn</p>
          </div>
        </div>
        <TransitionGroup
          tag="div"
          :class="
            viewMode === 'list'
              ? 'flex flex-col gap-3'
              : 'grid grid-cols-2 lg:grid-cols-3 gap-4'
          "
          name="favorite-cards"
        >
          <DashboardPageAppCard
            v-for="app in filteredFavoriteApps"
            :key="app.appCode"
            :app="app"
            :is-favorite="true"
            :view-mode="viewMode"
            @toggle-favorite="toggleFavorite(app.appCode)"
          />
        </TransitionGroup>
      </section>
    </TransitionGroup>

    <!-- All Apps -->
    <section v-if="!loading && !error" class="space-y-4">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Tất cả ứng dụng</h2>
          <p class="text-sm text-gray-500 mt-1">Tất cả các ứng dụng có sẵn</p>
        </div>
      </div>
      <TransitionGroup
        tag="div"
        :class="
          viewMode === 'list'
            ? 'flex flex-col gap-3'
            : 'grid grid-cols-2 lg:grid-cols-3 gap-4'
        "
        name="app-cards"
      >
        <DashboardPageAppCard
          v-for="app in filteredApps"
          :key="app.appCode"
          :app="app"
          :is-favorite="favoriteApps.includes(app.appCode)"
          :view-mode="viewMode"
          @toggle-favorite="toggleFavorite(app.appCode)"
        />
      </TransitionGroup>
    </section>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";

definePageMeta({
  middleware: ["auth", "permission"],
});

const authStore = useAuthStore();
const { $dayjs } = useNuxtApp();

// Get apps store
const appsStore = useAppsStore();

// Initialize favorite store only
onMounted(() => {
  favoriteStore.init();
});

// State for loading and error handling
const loading = ref(false);
const error = ref(null);

// Get all apps from store
const allApps = computed(() => appsStore.allApps);
const visibleApps = computed(() => appsStore.visibleApps(authStore.permissionIds));

// Keep dashboard permission logic consistent with NavigationSidebar
const hasAppAccess = (app) => {
  if (!app?.appCode) return false;
  return visibleApps.value.some((visibleApp) => visibleApp.appCode === app.appCode);
};

// Search and filter state
const searchQuery = ref("");
const selectedCategory = ref("all");
const viewMode = ref("grid");

// Use favorite store
const favoriteStore = useFavoriteStore();
const favoriteApps = computed(() => favoriteStore.favoriteApps);

// Toggle favorite status
const toggleFavorite = (appCode) => {
  favoriteStore.toggleFavorite(appCode);
};

// Filtered apps based on search and category
const filteredApps = computed(() => {
  if (!visibleApps.value?.length) return [];

  let filtered = visibleApps.value.filter((app) => app.appCode !== "default");

  // 2. Remove favorite apps since they're shown separately
  filtered = filtered.filter(
    (app) => !favoriteApps.value.includes(app.appCode),
  );

  // 3. Apply category filter
  if (selectedCategory.value && selectedCategory.value !== "all") {
    const selectedDepartment = appsStore.apps?.[selectedCategory.value];
    if (selectedDepartment) {
      const departmentAppCodes =
        selectedDepartment.apps?.map((a) => a.appCode) || [];
      filtered = filtered.filter((app) =>
        departmentAppCodes.includes(app.appCode),
      );
    }
  }

  // 4. Apply search filter
  if (searchQuery.value?.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    const searchTerms = query.split(" ").filter(Boolean);

    filtered = filtered.filter((app) => {
      const appTexts = [
        app.name,
        app.description,
        app.appCode,
        ...(app.modules?.flatMap((module) => [
          module.name,
          module.description,
          module.code,
        ]) || []),
      ]
        .filter(Boolean)
        .map((text) => text.toLowerCase());

      return searchTerms.every((term) =>
        appTexts.some((text) => text.includes(term)),
      );
    });
  }

  return filtered;
});

// Get favorite filtered apps
const filteredFavoriteApps = computed(() => {
  if (!allApps.value?.length) return [];

  let filtered = allApps.value.filter(
    (app) => favoriteApps.value.includes(app.appCode) && hasAppAccess(app),
  );

  // Apply category filter
  if (selectedCategory.value && selectedCategory.value !== "all") {
    const selectedDepartment = appsStore.apps?.[selectedCategory.value];
    if (selectedDepartment) {
      const departmentAppCodes =
        selectedDepartment.apps?.map((a) => a.appCode) || [];
      filtered = filtered.filter((app) =>
        departmentAppCodes.includes(app.appCode),
      );
    }
  }

  // Apply search filter
  if (searchQuery.value?.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    const searchTerms = query.split(" ").filter(Boolean);

    filtered = filtered.filter((app) => {
      const appTexts = [
        app.name,
        app.description,
        app.appCode,
        ...(app.modules?.flatMap((module) => [
          module.name,
          module.description,
          module.code,
        ]) || []),
      ]
        .filter(Boolean)
        .map((text) => text.toLowerCase());

      return searchTerms.every((term) =>
        appTexts.some((text) => text.includes(term)),
      );
    });
  }

  return filtered;
});

onMounted(() => {
  const accessToken = authStore.accessToken || Cookies.get("accessToken");
  if (!accessToken) {
    navigateTo("/login");
  }
});
</script>

<style>
.app-cards-move,
.favorite-cards-move {
  transition: transform 0.3s ease;
}

.app-cards-enter-active,
.app-cards-leave-active,
.favorite-cards-enter-active,
.favorite-cards-leave-active {
  transition: all 0.3s ease;
}

.app-cards-enter-from,
.app-cards-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.favorite-cards-enter-from,
.favorite-cards-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.favorite-section-enter-active,
.favorite-section-leave-active {
  transition: opacity 0.3s ease;
}

.favorite-section-enter-from,
.favorite-section-leave-to {
  opacity: 0;
}
</style>
