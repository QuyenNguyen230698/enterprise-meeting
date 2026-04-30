<template>
  <!-- AMP Auto Ads - Place immediately after body tag -->
  <!-- <AmpAutoAds /> -->

  <ClientOnly>
    <div
      class="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden w-full"
    >
      <!-- Desktop & Tablet Sidebar -->
      <aside
        class="hidden md:flex flex-col bg-white border-r border-zinc-200 transition-all duration-300 z-20 relative shrink-0"
        :class="[sidebarOpen ? 'w-64' : 'w-20', isTablet ? 'w-20' : '']"
      >
        <!-- Logo Section -->
        <div
          class="h-16 flex items-center p-4 border-b border-zinc-200 shrink-0 overflow-hidden"
          :class="
            sidebarOpen && !isTablet ? 'justify-center px-4' : 'justify-center'
          "
        >
          <NuxtLink to="/dashboard" class="flex items-center gap-3 whitespace-nowrap">
            <EMLogo :variant="isDarkTheme ? 'dark' : 'light'" class="w-8 h-8 shrink-0" />
          </NuxtLink>
        </div>

        <!-- Navigation Menu -->
        <NavigationSidebar
          :sidebar-open="sidebarOpen"
          :is-tablet="isTablet"
          @toggle-sidebar="toggleSidebar"
        />

        <!-- User Profile Section -->
        <ClientOnly>
          <div
            v-if="User || displayUserEmail"
            class="p-3 border-t border-zinc-200 bg-zinc-50/50 shrink-0"
          >
            <div
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-200 transition-colors"
              :class="{ 'justify-center': !sidebarOpen || isTablet }"
              @click="logout"
              title="Sign Out"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white shrink-0"
                :class="
                  userAvatar
                    ? ''
                    : 'bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400'
                "
              >
                <img
                  v-if="userAvatar"
                  class="h-8 w-8 rounded-full object-cover"
                  :src="userAvatar"
                />
                <span v-else>{{
                  getInitials(displayUserName || User?.username || "User")
                }}</span>
              </div>
              <div
                class="flex-1 min-w-0 transition-all duration-300 overflow-hidden"
                :class="{ 'w-0 opacity-0': !sidebarOpen || isTablet }"
              >
                <p class="text-sm font-semibold truncate text-zinc-900">
                  {{ displayUserName || User?.username || "Admin" }}
                </p>
                <p class="text-xs text-zinc-500 truncate">{{ displayUserEmail || User?.email }}</p>
              </div>
              <i
                class="bi bi-box-arrow-right text-zinc-400 hover:text-red-500 transition-colors"
                :class="{ hidden: !sidebarOpen || isTablet }"
              ></i>
            </div>
          </div>
        </ClientOnly>
      </aside>

      <!-- Main Content -->
      <main
        class="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-50 relative"
      >
        <!-- Header -->
        <header
          class="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0 sticky top-0 z-30 shadow-sm transition-all duration-300 w-full"
        >
          <div class="flex items-center justify-start gap-4 flex-1 min-w-0">
            <!-- Menu Button -->
            <button
              v-if="!isMobile"
              @click="toggleSidebar"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all focus:outline-none"
            >
              <i
                class="bi text-xl"
                :class="
                  sidebarOpen && !isTablet ? 'bi-text-indent-right' : 'bi-list'
                "
              ></i>
            </button>
            <button
              v-else
              @click="toggleDrawer"
              class="w-10 h-10 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors"
            >
              <i class="bi bi-list text-xl"></i>
            </button>

            <!-- Divider -->
            <div class="h-6 w-px bg-zinc-200 hidden sm:block"></div>

            <!-- Breadcrumb Navigation -->
            <nav
              class="hidden lg:flex flex-1 min-w-0 ml-1"
              aria-label="Breadcrumb"
            >
              <TransitionGroup
                tag="ol"
                class="flex items-center space-x-2 overflow-hidden"
                name="breadcrumb"
                mode="out-in"
              >
                <li
                  v-for="(item, index) in visibleBreadcrumbs"
                  :key="item.name + index"
                  class="flex items-center shrink-0"
                >
                  <template v-if="index > 0">
                    <i
                      class="bi bi-chevron-right text-zinc-400 mx-1 text-sm"
                    ></i>
                  </template>
                  <a
                    v-if="item?.url"
                    @click="router.push(item.url === '/app' ? '/' : item.url)"
                    class="text-sm font-medium text-zinc-500 hover:text-zinc-900 cursor-pointer truncate max-w-37.5"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </a>
                  <span
                    v-else
                    :class="{
                      'text-zinc-900 font-bold':
                        index === visibleBreadcrumbs.length - 1,
                      'text-zinc-500': index !== visibleBreadcrumbs.length - 1,
                    }"
                    class="text-sm truncate max-w-37.5"
                    :title="item.name"
                  >
                    {{ item.name }}
                  </span>
                </li>
              </TransitionGroup>
            </nav>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <!-- Notification Bell -->
            <NotificationDropdown />
            <!-- User Avatar Dropdown -->
            <ClientOnly>
              <div class="relative" ref="userDropdownRef">
                <button
                  @click="toggleUserDropdown"
                  class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  <div class="relative">
                    <img
                      v-if="userAvatar"
                      class="h-8 w-8 rounded-full object-cover border-2 border-zinc-200"
                      :src="userAvatar"
                      alt="User avatar"
                    />
                    <div
                      v-else
                      class="h-8 w-8 rounded-full bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-1 ring-zinc-200"
                    >
                      {{
                        getInitials(
                          displayUserName || User?.username || "User",
                        )
                      }}
                    </div>
                  </div>
                </button>

                <!-- User Dropdown Menu -->
                <Transition
                  name="dropdown"
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div
                    v-if="showUserDropdown"
                    class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-50 transform origin-top-right"
                  >
                    <div class="px-4 py-3 border-b border-zinc-100">
                      <div
                        class="flex items-center gap-2 text-sm font-semibold text-zinc-900 truncate"
                      >
                        <i class="bi bi-person text-zinc-400"></i>
                        {{
                          displayUserName || User?.username || "User"
                        }}
                      </div>
                      <div
                        class="flex items-center gap-2 text-xs text-zinc-500 truncate mt-1"
                      >
                        <i class="bi bi-envelope text-zinc-400"></i>
                        {{ displayUserEmail || User?.email }}
                      </div>
                    </div>

                    <div class="py-1">
                      <NuxtLink
                        to="/settings/profile"
                        @click="showUserDropdown = false"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        <i class="bi bi-person text-zinc-400"></i>
                        Trang Cá Nhân
                      </NuxtLink>
                      <NuxtLink
                        to="/settings/profile#subscription"
                        @click="showUserDropdown = false"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        <i class="bi bi-star text-zinc-400"></i>
                        Gói Dịch Vụ
                      </NuxtLink>
                      <NuxtLink
                        to="/settings/profile#cards"
                        @click="showUserDropdown = false"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        <i class="bi bi-credit-card text-zinc-400"></i>
                        Thẻ Thanh Toán
                      </NuxtLink>
                      <NuxtLink
                        to="/settings/profile#billing"
                        @click="showUserDropdown = false"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                      >
                        <i class="bi bi-clock-history text-zinc-400"></i>
                        Lịch Sử Thanh Toán
                      </NuxtLink>
                      <div class="border-t border-zinc-100 my-1"></div>
                      <button
                        @click="handleLogout"
                        class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <i class="bi bi-box-arrow-right"></i>
                        Đăng Xuất
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </ClientOnly>
          </div>
        </header>

        <!-- Main Content Area -->
        <div
          class="flex-1 overflow-y-auto relative scroll-smooth bg-zinc-50 "
        >
          <div
            :class="{ hidden: isLoadingPayload }"
            class="w-full h-full flex flex-col"
          >
            <slot />
          </div>
          <div
            :class="{ hidden: !isLoadingPayload }"
            class="absolute inset-0 flex items-center justify-center bg-zinc-50/80 z-10"
          >
            <span
              class="loading loading-spinner loading-lg text-emerald-500"
            ></span>
          </div>
        </div>
      </main>

      <!-- Mobile Drawer -->
      <Transition name="drawer">
        <div
          v-if="isDrawerOpen"
          class="fixed inset-0 z-50 md:hidden"
          style="z-index: 999999 !important"
        >
          <!-- Overlay -->
          <div
            class="fixed inset-0 bg-black/50 backdrop-blur-sm"
            @click="closeDrawer"
          ></div>

          <!-- Drawer Panel -->
          <div
            class="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col"
          >
            <!-- Mobile Header -->
            <div
              class="h-16 flex items-center justify-between px-4 border-b border-zinc-200 shrink-0"
            >
              <NuxtLink
                to="/dashboard"
                class="flex items-center gap-3 whitespace-nowrap"
              >
                <EMLogo :variant="isDarkTheme ? 'dark' : 'light'" class="w-8 h-8 shrink-0" />
              </NuxtLink>
              <button
                @click="closeDrawer"
                class="w-8 h-8 flex items-center justify-center text-zinc-500 rounded-lg hover:bg-zinc-100 transition-all focus:outline-none"
              >
                <i class="bi bi-x text-2xl"></i>
              </button>
            </div>

            <!-- Mobile Navigation -->
            <div class="flex-1 overflow-y-auto" @click="closeDrawer">
              <NavigationSidebar :sidebar-open="true" :is-tablet="false" />
            </div>

            <!-- Mobile Logout Only -->
            <div class="p-4 border-t border-zinc-200 shrink-0 bg-zinc-50">
              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
              >
                <i class="bi bi-box-arrow-right"></i>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script setup>
import NavigationSidebar from "~/components/navigation/NavigationSidebar.vue";

const { $util } = useNuxtApp();
const mediaBreakpoint = ref(null);

const updateMediaBreakpoint = () => {
  mediaBreakpoint.value = $util.media();
};
const isMobile = computed(() => ["sm", "xs"].includes(mediaBreakpoint.value));
const isTablet = computed(() => mediaBreakpoint.value === "md");

const authStore = useAuthStore();
const breadcrumbStore = useBreadcrumbStore();
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase ;
const apiV1 = `${apiBaseUrl}/v1`;
const isLoadingPayload = ref(true);
const sidebarOpen = ref(true);

// Dynamic canonical URL
const canonicalUrl = computed(() => `https://datools.info${route.path}`);
useHead({
  link: [{ rel: "canonical", href: canonicalUrl }],
});

// Dynamic theme-color based on page
const themeColor = computed(() => {
  // Dark theme for home, about, contact pages; others get white
  const darkPages = ["/", "/about", "/contact"];
  return darkPages.includes(route.path) ? "#1a1a1a" : "#FFFFFF";
});

// Update theme-color meta tag when route changes
watch(
  () => route.path,
  () => {
    if (process.client) {
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", themeColor.value);
      } else {
        // Create meta tag if it doesn't exist
        themeColorMeta = document.createElement("meta");
        themeColorMeta.name = "theme-color";
        themeColorMeta.content = themeColor.value;
        document.head.appendChild(themeColorMeta);
      }
    }
  },
  { immediate: true },
);

const routeNameMap = {
  app: "APP",
  wms: "WMS",
  oms: "OMS",
  settings: "Cài đặt",
  profile: "Hồ sơ",
  notifications: "Thông báo",
};

const breadcrumbs = computed(() => {
  if (breadcrumbStore.isSpecialRoute(route.path)) {
    return breadcrumbStore.currentBreadcrumbs;
  }

  const pathSegments = route.path.split("/").filter(Boolean);
  return pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const segmentLower = segment.toLowerCase();

    return {
      name:
        routeNameMap[segmentLower] ||
        segment.toUpperCase()?.replaceAll(/-/g, " "),
      url: path,
    };
  });
});

// Responsive breadcrumbs - show fewer items on smaller screens
const visibleBreadcrumbs = computed(() => {
  const crumbs = breadcrumbs.value;
  if (!crumbs || crumbs.length === 0) return [];

  if (isMobile.value) {
    // On mobile, show only the last 2 breadcrumbs
    return crumbs.length > 2 ? crumbs.slice(-2) : crumbs;
  } else if (isTablet.value) {
    // On tablet, show only the last 3 breadcrumbs
    return crumbs.length > 3 ? crumbs.slice(-3) : crumbs;
  }

  // On desktop, show all breadcrumbs
  return crumbs;
});

onMounted(async () => {
  nextTick().then(() => {
    setTimeout(async () => {
      try {
        // Initialize media breakpoint
        updateMediaBreakpoint();

        const storedSidebarState = localStorage.getItem("sidebarOpen");
        if (storedSidebarState !== null) {
          sidebarOpen.value = JSON.parse(storedSidebarState);
        }

        if (authStore.User && !appsStore.isReady) {
          await appsStore.fetchApps();
        }

        isLoadingPayload.value = false;
      } catch (error) {
        console.error("Layout onMounted error:", error);
        isLoadingPayload.value = false;
      }
      window.addEventListener("resize", updateMediaBreakpoint);
    }, 100);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", updateMediaBreakpoint);
});

// Close drawer when route changes
watch(route, () => {
  if (isDrawerOpen.value) {
    closeDrawer();
  }
});

// Apps are already fetched by middleware, no need to fetch again here
watch(() => authStore.User, async (newUser) => {
  if (newUser && !appsStore.isReady) {
    await appsStore.fetchApps();
  }
}, { immediate: false });

const getUserInitials = (user) => {
  if (user?.fullName) {
    const names = user.fullName.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  }
  if (user?.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  if (user?.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  return "U";
};

const logout = async () => {
  await authStore.logout();
  navigateTo("/login");
};

const toggleSidebar = () => {
  // On tablet, sidebar is always collapsed, so don't toggle
  if (isTablet.value) return;

  if (sidebarOpen.value) {
    const detailsElements = document.querySelectorAll(".nav-dropdown");
    detailsElements.forEach((element) => {
      element.removeAttribute("open");
    });
    setTimeout(() => {
      sidebarOpen.value = false;
      localStorage.setItem("sidebarOpen", "false");
    }, 150);
  } else {
    sidebarOpen.value = true;
    localStorage.setItem("sidebarOpen", "true");
  }
};

const isDrawerOpen = ref(false);

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

function closeDrawer() {
  isDrawerOpen.value = false;
}

// Prevent body scroll when drawer is open
watch(isDrawerOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
const RedirectURL = (url) => {
  navigateTo(url);
};

const auth = useAuthStore();
const appsStore = useAppsStore();
const profileData = ref({
  email: "",
  full_name: "",
  display_name: "",
  avatar_url: "",
});

const displayUserName = computed(() => {
  if (!process.client) return "";
  return (
    profileData.value.full_name ||
    profileData.value.display_name ||
    auth.user?.profile?.fullName ||
    auth.user?.full_name ||
    auth.user?.username ||
    ""
  );
});

const displayUserEmail = computed(() => {
  if (!process.client) return "";
  return profileData.value.email || auth.user?.email || "";
});

const userAvatar = computed(() =>
  process.client ? profileData.value.avatar_url || auth.user?.avatar || auth.user?.avatar_url || null : null,
);
const User = computed(() => (process.client ? auth.user : null));

const fetchLayoutProfile = async () => {
  if (!process.client || !authStore.accessToken) return;
  try {
    const response = await fetch(`${apiV1}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    if (!response.ok) return;
    const data = await response.json();
    const user = data?.data || data;
    if (!user?.email) return;

    profileData.value = {
      email: user.email || "",
      full_name: user.full_name || user.name || "",
      display_name: user.display_name || user.full_name || user.name || "",
      avatar_url: user.avatar_url || "",
    };
  } catch {
    // fallback to auth.user only
  }
};

// Remove redundant fetchApps calls - it's already called in middleware and on user change
// onMounted(() => {
//   appsStore.fetchApps();
// });

const departments = computed(() => appsStore.apps);

// User dropdown logic
const showUserDropdown = ref(false);
const userDropdownRef = ref(null);

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target)) {
    showUserDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

watch(
  () => authStore.accessToken,
  async (token) => {
    if (token) await fetchLayoutProfile();
  },
  { immediate: true },
);

// Get initials function
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Handle logout
const handleLogout = async () => {
  showUserDropdown.value = false;
  await logout();
};
</script>

<style scoped>
/* Responsive Design Improvements */
@media (max-width: 768px) {
  /* Mobile optimizations */
  .drawer-side {
    z-index: 1000;
  }

  /* Ensure proper touch targets on mobile */
  button {
    min-height: 30px;
    min-width: 30px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  /* Tablet optimizations */
  aside {
    width: 4rem !important; /* Force collapsed sidebar on tablet */
  }
}

/* Fade in up animation */
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth transitions for sidebar */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Breadcrumb transitions */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s ease;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.breadcrumb-move {
  transition: transform 0.3s ease;
}

.no-scroll {
  overflow: hidden;
}

/* Base Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sidebar Transitions */
aside {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Navigation Styles */

/* Dropdown Animation */
.nav-dropdown {
  transition: all 0.15s ease-in-out;
}

.nav-dropdown summary {
  list-style: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.nav-dropdown summary::-webkit-details-marker {
  display: none;
}

/* Space between summary and content */
.nav-dropdown summary ~ * {
  margin-top: 0.5rem;
  transition: all 0.15s ease-in-out;
  transform-origin: top;
}

/* Hover effect */
.nav-dropdown summary:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Active state */
.nav-dropdown[open] summary {
  background-color: rgba(0, 0, 0, 0.02);
}

.nav-dropdown[open] summary ~ * {
  animation: slideDown 0.15s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Collapsed Sidebar Styles */
.w-20 .nav-dropdown[open] summary ~ * {
  display: none;
}

.w-20 .nav-dropdown summary i.bi-chevron-down {
  display: none;
}

.shadow-soft {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Mobile drawer improvements */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active .fixed.inset-y-0,
.drawer-leave-active .fixed.inset-y-0 {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .fixed.inset-y-0 {
  transform: translateX(-100%);
}

.drawer-leave-to .fixed.inset-y-0 {
  transform: translateX(-100%);
}
</style>
