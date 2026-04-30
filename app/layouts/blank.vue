<template>
  <!-- AMP Auto Ads - Place immediately after body tag -->
  <!-- <AmpAutoAds /> -->

  <div
    ref="mainWrapper"
    class="fixed inset-0 flex flex-col w-full overflow-hidden"
    :class="[isDarkTheme ? 'bg-[#0a0a0f]' : 'bg-gray-50']"
  >
    <!-- Header -->
    <header
      ref="headerRef"
      class="transition-all duration-500"
      :class="[
        headerVisible ? 'translate-y-0' : '-translate-y-full',
        'shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-10 shadow-sm',
        isDarkTheme
          ? isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
          : isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm'
            : 'bg-white/50 backdrop-blur-sm',
      ]"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <EMLogo
              :variant="isDarkTheme ? 'dark' : 'light'"
              :width="140"
              :height="35"
            />
          </NuxtLink>

          <!-- Navigation -->
          <nav class="hidden lg:flex items-center gap-1">
            <template v-for="link in navLinks" :key="link.path">
              <!-- Regular Links -->
              <NuxtLink
                v-if="link.name !== 'Công Cụ'"
                :to="link.path"
                class="nav-link relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full group"
                :class="[
                  isDarkTheme
                    ? 'text-gray-300 hover:text-emerald-400'
                    : 'text-gray-600 hover:text-emerald-600',
                  isActiveLink(link.path) &&
                    (isDarkTheme ? 'text-emerald-400' : 'text-emerald-600'),
                ]"
              >
                <span class="relative z-10">{{ link.name }}</span>
                <div
                  class="absolute inset-0 top-2 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
                  :class="[
                    isDarkTheme ? 'bg-emerald-500/10' : 'bg-emerald-100',
                    isActiveLink(link.path) && 'scale-100',
                  ]"
                ></div>
              </NuxtLink>

              <!-- Tools Dropdown -->
              <div
                v-else
                class="relative"
                @mouseenter="toolsDropdownOpen = true"
                @mouseleave="toolsDropdownOpen = false"
              >
                <button
                  class="nav-link relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full group flex items-center gap-2"
                  :class="[
                    isDarkTheme
                      ? 'text-gray-300 hover:text-emerald-400'
                      : 'text-gray-600 hover:text-emerald-600',
                  ]"
                >
                  <span class="relative z-10">{{ link.name }}</span>
                  <i
                    class="bi bi-chevron-down text-xs transition-transform"
                    :class="toolsDropdownOpen ? 'rotate-180' : ''"
                  ></i>
                  <div
                    class="absolute inset-0 top-2 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
                    :class="isDarkTheme ? 'bg-emerald-500/10' : 'bg-emerald-100'"
                  ></div>
                </button>

                <!-- Dropdown Menu -->
                <div
                  class="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-200"
                  :class="
                    toolsDropdownOpen
                      ? 'opacity-100 translate-y-0 visible'
                      : 'opacity-0 -translate-y-2 invisible'
                  "
                >
                  <div class="py-2">
                    <NuxtLink
                      v-if="!user"
                      to="/editor?mode=public"
                      class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i class="bi bi-pencil-square text-emerald-500"></i>
                      <span>Thiết kế Email</span>
                    </NuxtLink>
                    <NuxtLink
                      v-else
                      to="/editor"
                      class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i class="bi bi-pencil-square text-emerald-500"></i>
                      <span>Thiết kế Email</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </template>
          </nav>

          <!-- Auth Buttons -->
          <div class="hidden lg:flex items-center gap-4">
            <template v-if="isLoggedIn">
              <NuxtLink
                to="/dashboard"
                class="magnetic-btn relative px-6 py-2 text-sm font-medium text-white bg-linear-to-r from-emerald-600 to-purple-600 rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden group"
              >
                <span class="relative z-10 flex items-center gap-2">
                  <i class="bi bi-grid-3x3-gap"></i>
                  Dashboard
                </span>
                <div
                  class="absolute inset-0 bg-linear-to-r from-purple-600 to-lime-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="magnetic-btn relative px-6 py-2 text-sm font-medium text-white bg-linear-to-r from-emerald-600 to-purple-600 rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden group"
              >
                <span class="relative z-10">Đăng nhập</span>
                <div
                  class="absolute inset-0 bg-linear-to-r from-purple-600 to-lime-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </NuxtLink>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden relative p-3 rounded-full transition-colors"
            :class="
              isDarkTheme
                ? 'text-white hover:bg-white/10'
                : 'text-gray-700 hover:bg-gray-100'
            "
          >
            <div class="w-6 h-5 flex flex-col justify-between">
              <span
                class="w-full h-0.5 rounded-full transition-all duration-300 origin-left"
                :class="[
                  isDarkTheme ? 'bg-white' : 'bg-gray-700',
                  mobileMenuOpen && 'rotate-45 translate-x-0.5',
                ]"
              ></span>
              <span
                class="w-full h-0.5 rounded-full transition-all duration-300"
                :class="[
                  isDarkTheme ? 'bg-white' : 'bg-gray-700',
                  mobileMenuOpen && 'opacity-0 translate-x-3',
                ]"
              ></span>
              <span
                class="w-full h-0.5 rounded-full transition-all duration-300 origin-left"
                :class="[
                  isDarkTheme ? 'bg-white' : 'bg-gray-700',
                  mobileMenuOpen && '-rotate-45 translate-x-0.5',
                ]"
              ></span>
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main
      class="relative z-10 flex-1 min-h-0 flex flex-col w-full"
      :class="[
        route.name === 'editor' ||
        route.path.startsWith('/guide') ||
        route.path.startsWith('/roadmap') ||
        route.path.startsWith('/support-dev')
          ? 'overflow-hidden'
          : 'overflow-auto',
      ]"
    >
      <slot />
    </main>

    <!-- Mobile Drawer Menu -->
    <Transition name="drawer">
      <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-60">
        <!-- Overlay -->
        <div
          @click="mobileMenuOpen = false"
          class="absolute inset-0 backdrop-blur-md"
          :class="isDarkTheme ? 'bg-black/80' : 'bg-black/50'"
        ></div>

        <!-- Drawer -->
        <div
          class="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] backdrop-blur-xl border-l flex flex-col"
          :class="
            isDarkTheme
              ? 'bg-[#0a0a0f]/95 border-white/10'
              : 'bg-white/95 border-gray-200'
          "
        >
          <!-- Drawer Header -->
          <div
            class="flex items-center justify-between p-6 border-b"
            :class="isDarkTheme ? 'border-white/10' : 'border-gray-200'"
          >
            <EMLogo
              :variant="isDarkTheme ? 'dark' : 'light'"
              :width="120"
              :height="30"
            />
            <button
              @click="mobileMenuOpen = false"
              class="p-2 rounded-full transition-colors"
              :class="isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-gray-100'"
            >
              <i
                class="bi bi-x text-2xl"
                :class="isDarkTheme ? 'text-white' : 'text-gray-700'"
              ></i>
            </button>
          </div>

          <!-- Drawer Navigation -->
          <nav class="flex-1 overflow-y-auto p-6">
            <div class="space-y-2">
              <template v-for="link in navLinks" :key="link.path">
                <!-- Regular Links -->
                <NuxtLink
                  v-if="link.name !== 'Công Cụ'"
                  :to="link.path"
                  @click="mobileMenuOpen = false"
                  class="flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300"
                  :class="[
                    isDarkTheme
                      ? 'text-gray-300 hover:text-emerald-400 hover:bg-white/5'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50',
                    isActiveLink(link.path) &&
                      (isDarkTheme
                        ? 'bg-white/10 text-emerald-400'
                        : 'bg-emerald-50 text-emerald-600'),
                  ]"
                >
                  <i :class="link.icon" class="text-lg"></i>
                  <span class="font-medium">{{ link.name }}</span>
                </NuxtLink>

                <!-- Tools Dropdown -->
                <div v-else>
                  <button
                    @click="mobileToolsDropdownOpen = !mobileToolsDropdownOpen"
                    class="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300"
                    :class="[
                      isDarkTheme
                        ? 'text-gray-300 hover:text-emerald-400 hover:bg-white/5'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50',
                    ]"
                  >
                    <i :class="link.icon" class="text-lg"></i>
                    <span class="flex-1 text-left font-medium">{{
                      link.name
                    }}</span>
                    <i
                      class="bi bi-chevron-down text-xs transition-transform"
                      :class="mobileToolsDropdownOpen ? 'rotate-180' : ''"
                    ></i>
                  </button>

                  <!-- Dropdown Items -->
                  <div
                    v-if="mobileToolsDropdownOpen"
                    class="ml-4 mt-2 space-y-1"
                  >
                    <NuxtLink
                      v-if="!user"
                      to="/editor?mode=public"
                      @click="mobileMenuOpen = false"
                      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                      :class="
                        isDarkTheme
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      "
                    >
                      <i class="bi bi-pencil-square text-emerald-500"></i>
                      <span class="text-sm">Thiết kế Email</span>
                    </NuxtLink>
                    <NuxtLink
                      v-else
                      to="/editor"
                      @click="mobileMenuOpen = false"
                      class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
                      :class="
                        isDarkTheme
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      "
                    >
                      <i class="bi bi-pencil-square text-emerald-500"></i>
                      <span class="text-sm">Thiết kế Email</span>
                    </NuxtLink>
                  </div>
                </div>
              </template>
            </div>
          </nav>

          <!-- Drawer Footer -->
          <div
            class="p-6 border-t"
            :class="isDarkTheme ? 'border-white/10' : 'border-gray-200'"
          >
            <template v-if="isLoggedIn">
              <NuxtLink
                to="/dashboard"
                @click="mobileMenuOpen = false"
                class="flex items-center justify-center gap-2 w-full px-4 py-4 text-white bg-linear-to-r from-emerald-600 to-purple-600 rounded-xl font-medium"
              >
                <i class="bi bi-grid-3x3-gap"></i>
                Dashboard
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                @click="mobileMenuOpen = false"
                class="flex items-center justify-center gap-2 w-full px-4 py-4 text-white bg-linear-to-r from-emerald-600 to-purple-600 rounded-xl font-medium"
              >
                <i class="bi bi-box-arrow-in-right"></i>
                Đăng nhập
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const route = useRoute();
const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const headerVisible = ref(true);
const toolsDropdownOpen = ref(false);
const mobileToolsDropdownOpen = ref(false);

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
const user = computed(() => authStore.user);
const isLoggedIn = computed(() => !!authStore.accessToken);

// Define which pages use dark theme
const darkThemePages = ["/", "/about", "/contact", "/index"];
const lightThemePages = ["/support-dev", "/guide", "/roadmap"];

const isDarkTheme = computed(() => {
  // Editor always uses light theme
  if (route.name === "editor" || route.path.startsWith("/editor")) {
    return false;
  }
  // Check if current path is in light theme pages
  if (
    lightThemePages.some(
      (p) => route.path === p || route.path.startsWith(p + "/"),
    )
  ) {
    return false;
  }
  // Default to dark for home and other dark pages
  return darkThemePages.some((p) => route.path === p) || route.path === "/";
});

const showThreeBackground = computed(() => {
  return (
    route.name !== "editor" && route.path !== "/editor" && isDarkTheme.value
  );
});

const navLinks = [
  { name: "Trang chủ", path: "/", icon: "bi bi-house" },
  { name: "Công Cụ", path: "#", icon: "bi bi-tools" },
  { name: "Về chúng tôi", path: "/about", icon: "bi bi-info-circle" },
  { name: "Phát Triển", path: "/roadmap", icon: "bi bi-calendar-check" },
  { name: "Hướng dẫn", path: "/guide", icon: "bi bi-book" },
  { name: "Ủng hộ", path: "/support-dev", icon: "bi bi-heart" },
  { name: "Liên hệ", path: "/contact", icon: "bi bi-envelope" },
];

const isActiveLink = (path) => {
  if (path === "/") return route.path === "/";
  if (path.includes("?")) return route.path.startsWith(path.split("?")[0]);
  return route.path.startsWith(path);
};

// Scroll to top function
const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Close mobile menu on route change and scroll to top
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
    scrollToTop();
  },
);

onMounted(() => {});

onUnmounted(() => {});
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-active .absolute.right-0,
.drawer-leave-active .absolute.right-0 {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from .absolute.bg-black\/80,
.drawer-leave-to .absolute.bg-black\/80 {
  opacity: 0;
}

.drawer-enter-from .absolute.right-0,
.drawer-leave-to .absolute.right-0 {
  transform: translateX(100%);
}

/* Magnetic button effect */
.magnetic-btn {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Navigation link underline effect */
.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #6366f1, #a855f7);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 60%;
}
</style>
