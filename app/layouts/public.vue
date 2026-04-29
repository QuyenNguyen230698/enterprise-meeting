<template>
  <!-- AMP Auto Ads - Place immediately after body tag -->
  <!-- <AmpAutoAds /> -->

  <div
    ref="mainWrapper"
    class="relative min-h-dvh flex flex-col w-full overflow-x-hidden"
    :class="[
      route.name === 'editor'
        ? 'h-dvh overflow-hidden'
        : 'h-full overflow-auto',
      isDarkTheme ? 'bg-[#0a0a0f]' : 'bg-gray-50',
    ]"
  >
    <!-- Loading Screen -->
    <LoadingScreen
      v-if="showLoading"
      @complete="onLoadingComplete"
      :duration="2000"
    />

    <!-- Three.js Background (only for dark theme) -->
    <div
      ref="threeContainer"
      class="fixed inset-0 z-0 pointer-events-none"
      v-show="showThreeBackground && isDarkTheme"
    ></div>

    <!-- Header -->
    <header
      ref="headerRef"
      class="transition-all duration-500"
      :class="[
        headerVisible ? 'translate-y-0' : '-translate-y-full',
        route.name === 'editor'
          ? 'shrink-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-10 shadow-sm'
          : 'fixed top-0 left-0 right-0 z-50',
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
              :width="100"
              :height="40"
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
                    (isDarkTheme ? 'text-green-400' : 'text-emerald-600'),
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
                class="magnetic-btn relative px-6 py-2 text-sm font-medium text-white bg-linear-to-r from-emerald-600 to-lime-600 rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden group"
              >
                <span class="relative z-10 flex items-center gap-2">
                  <i class="bi bi-grid-3x3-gap"></i>
                  Dashboard
                </span>
                <div
                  class="absolute inset-0 bg-linear-to-r from-lime-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="magnetic-btn relative px-6 py-2 text-sm font-medium text-white bg-linear-to-r from-emerald-600 to-lime-600 rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden group"
              >
                <span class="relative z-10">Đăng nhập</span>
                <div
                  class="absolute inset-0 bg-linear-to-r from-lime-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
      class="relative z-10 flex-1 flex flex-col w-full"
      :class="[route.name === 'editor' ? 'overflow-hidden' : '']"
    >
      <slot />
    </main>
    <!-- Footer -->
    <footer
      v-if="route.name !== 'editor'"
      class="relative z-10 backdrop-blur-xl border-t"
      :class="
        isDarkTheme ? 'bg-black/50 border-white/10' : 'bg-white border-gray-200'
      "
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <!-- Brand -->
          <div class="col-span-2 lg:col-span-1">
            <NuxtLink to="/" class="inline-block mb-4 sm:mb-6">
              <EMLogo
                :variant="isDarkTheme ? 'dark' : 'light'"
                :width="120"
                :height="40"
                class="sm:w-[160px] sm:h-[40px]"
              />
            </NuxtLink>
            <p
              :class="isDarkTheme ? 'text-gray-400' : 'text-gray-600'"
              class="text-xs sm:text-sm leading-relaxed max-w-sm mb-4 sm:mb-6"
            >
              Nền tảng thiết kế và gửi email chuyên nghiệp. Tạo các chiến dịch
              email marketing hiệu quả với công cụ miễn phí.
            </p>
            <div class="flex items-center gap-3 sm:gap-4">
              <a
                href="mailto:quyen.nc.dev@gmail.com"
                class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300"
                :class="
                  isDarkTheme
                    ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                "
              >
                <i class="bi bi-envelope text-sm sm:text-base"></i>
              </a>
              <a
                href="https://github.com/QuyenNguyen230698"
                target="_blank"
                class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300"
                :class="
                  isDarkTheme
                    ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                "
              >
                <i class="bi bi-github text-sm sm:text-base"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-span-1">
            <h4
              :class="isDarkTheme ? 'text-white' : 'text-gray-900'"
              class="font-semibold text-sm sm:text-base mb-3 sm:mb-6"
            >
              Về chúng tôi
            </h4>
            <ul class="space-y-2 sm:space-y-3">
              <li
                v-for="link in navLinks.filter((l) => l.name !== 'Công Cụ')"
                :key="link.path"
              >
                <NuxtLink
                  :to="link.path"
                  class="text-xs sm:text-sm transition-colors duration-300 block"
                  :class="
                    isDarkTheme
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  "
                >
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Tools Links -->
          <div class="col-span-1">
            <h4
              :class="isDarkTheme ? 'text-white' : 'text-gray-900'"
              class="font-semibold text-sm sm:text-base mb-3 sm:mb-6"
            >
              Công Cụ
            </h4>
            <ul class="space-y-2 sm:space-y-3">
              <li>
                <NuxtLink
                  v-if="!user"
                  to="/editor?mode=public"
                  class="text-xs sm:text-sm transition-colors duration-300 block"
                  :class="
                    isDarkTheme
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  "
                >
                  Thiết kế Email
                </NuxtLink>
                <NuxtLink
                  v-else
                  to="/editor"
                  class="text-xs sm:text-sm transition-colors duration-300 block"
                  :class="
                    isDarkTheme
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  "
                >
                  Thiết kế Email
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div
          class="mt-6 sm:mt-8 lg:mt-12 pt-4 sm:pt-6 lg:pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
          :class="isDarkTheme ? 'border-white/10' : 'border-gray-200'"
        >
          <p
            :class="isDarkTheme ? 'text-gray-500' : 'text-gray-400'"
            class="text-xs sm:text-sm text-center sm:text-left"
          >
            © {{ new Date().getFullYear() }} EM. All rights reserved.
          </p>
          <div class="flex items-center gap-2">
            <span
              :class="isDarkTheme ? 'text-gray-500' : 'text-gray-400'"
              class="text-xs sm:text-sm"
              >Made with</span
            >
            <i
              class="bi bi-heart-fill text-red-500 animate-pulse text-xs sm:text-sm"
            ></i>
            <span
              :class="isDarkTheme ? 'text-gray-500' : 'text-gray-400'"
              class="text-xs sm:text-sm"
              >in Vietnam</span
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
  <!-- Mobile Drawer Menu -->
  <Transition name="drawer">
    <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-9999">
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
                <div v-if="mobileToolsDropdownOpen" class="ml-4 mt-2 space-y-1">
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
              class="flex items-center justify-center gap-2 w-full px-4 py-4 text-white bg-linear-to-r from-emerald-600 to-lime-600 rounded-xl font-medium"
            >
              <i class="bi bi-grid-3x3-gap"></i>
              Dashboard
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 w-full px-4 py-4 text-white bg-linear-to-r from-emerald-600 to-lime-600 rounded-xl font-medium"
            >
              <i class="bi bi-box-arrow-in-right"></i>
              Đăng nhập
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useLenis } from "~/composables/useLenis";
import { useThreeBackground } from "~/composables/useThreeBackground";

const route = useRoute();
const authStore = useAuthStore();

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
// Get user from auth store
const user = computed(() => authStore.User);

const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const headerVisible = ref(true);
const lastScrollY = ref(0);
const toolsDropdownOpen = ref(false);
const mobileToolsDropdownOpen = ref(false);
const mainWrapper = ref(null);
const headerRef = ref(null);
const threeContainer = ref(null);
const showLoading = ref(false);
const hasShownLoading = ref(false);

const { initLenis, destroyLenis, getLenis } = useLenis();
const { initThreeBackground, destroy: destroyThree } = useThreeBackground();

const isLoggedIn = computed(() => !!authStore.accessToken);

// Define which pages use dark theme
const darkThemePages = ["/", "/about", "/contact", "/index", "/login", "/support-dev", "/roadmap"];
const lightThemePages = ["/guide"];

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

// Handle scroll for header visibility
const handleScroll = () => {
  const lenis = getLenis();
  if (!lenis) return;

  const currentScrollY = lenis.scroll;

  // Show/hide header based on scroll direction
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    headerVisible.value = false;
  } else {
    headerVisible.value = true;
  }

  // Add background to header when scrolled
  isScrolled.value = currentScrollY > 50;

  lastScrollY.value = currentScrollY;
};

const onLoadingComplete = () => {
  showLoading.value = false;
  hasShownLoading.value = true;
};

// Close mobile menu on route change
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  },
);

onMounted(() => {
  // Show loading screen every time on home page
  if (route.path === "/") {
    showLoading.value = true;
  }

  // Skip Lenis for editor page
  if (route.name !== "editor" && route.path !== "/editor") {
    // Initialize Lenis smooth scroll
    const lenis = initLenis();

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }

    // Initialize Three.js background
    nextTick(() => {
      if (threeContainer.value && showThreeBackground.value) {
        initThreeBackground(threeContainer.value, {
          particleCount: 1000,
          speed: 0.0002,
        });
      }
    });
  }
});

onUnmounted(() => {
  const lenis = getLenis();
  if (lenis) {
    lenis.off("scroll", handleScroll);
  }
  destroyLenis();
  destroyThree();
});
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
  background: linear-gradient(to right, #00BD80, #77CE00);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 60%;
}
</style>
