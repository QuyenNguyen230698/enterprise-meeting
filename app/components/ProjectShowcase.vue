<template>
  <section 
    ref="sectionRef" 
    class="relative h-screen overflow-hidden opacity-70"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Background Images (changes with scroll) -->
    <div 
      v-for="(project, index) in projects" 
      :key="'bg-' + project.id"
      class="absolute inset-0 transition-opacity duration-1000"
      :class="currentProject === index ? 'opacity-100' : 'opacity-0'"
    >
      <!-- Project Background Image -->
      <div 
        v-if="project.bgImage"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${project.bgImage})` }"
      ></div>
      <!-- Fallback Gradient Background -->
      <div 
        v-else
        class="absolute inset-0"
        :class="project.bgGradient || 'bg-[#0a0a0f]'"
      >
        <div class="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-lime-500 rounded-full blur-[100px]"></div>
      </div>
      <!-- Dark Overlay -->
      <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <!-- Pinned Content Container -->
    <div class="relative z-10 h-full flex items-center">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Text Content (changes with scroll) -->
          <div class="relative">
            <div 
              v-for="(project, index) in projects" 
              :key="project.id"
              ref="projectRefs"
              class="project-slide absolute inset-0 transition-all duration-700"
              :class="[
                currentProject === index ? 'opacity-100 translate-y-0' : 
                currentProject > index ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20'
              ]"
            >
              <!-- Project Number -->
              <div class="flex items-center gap-4 mb-6">
                <span class="text-emerald-400 text-sm font-mono tracking-wider">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <div class="w-12 h-px bg-emerald-500/50"></div>
                <span class="text-gray-400 text-sm uppercase tracking-wider">
                  {{ project.category }}
                </span>
              </div>

              <!-- Title -->
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {{ project.title }}
              </h2>

              <!-- Description -->
              <p class="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                {{ project.description }}
              </p>

              <!-- Features/Tags -->
              <div class="flex flex-wrap gap-3 mb-10">
                <span 
                  v-for="tag in project.tags" 
                  :key="tag"
                  class="px-4 py-2 text-sm text-gray-300 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- CTA Button -->
              <NuxtLink 
                :to="project.link"
                class="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-emerald-100 transition-all duration-300"
              >
                {{ project.cta || 'Khám phá' }}
                <i class="bi bi-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </NuxtLink>
            </div>
            
            <!-- Spacer for absolute positioning -->
            <div class="invisible">
              <div class="flex items-center gap-4 mb-6">
                <span class="text-sm">00</span>
              </div>
              <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Placeholder</h2>
              <p class="text-lg mb-8">Placeholder description text here</p>
              <div class="flex gap-3 mb-10">
                <span class="px-4 py-2">Tag</span>
              </div>
              <span class="px-8 py-4">Button</span>
            </div>
          </div>

          <!-- Right: Visual Preview -->
          <div class="hidden lg:block relative">
            <div 
              v-for="(project, index) in projects" 
              :key="'visual-' + project.id"
              class="project-visual absolute inset-0 transition-all duration-700"
              :class="[
                currentProject === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              ]"
            >
              <div class="relative">
                <!-- Decorative elements -->
                <div class="absolute -top-8 -left-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-8 -right-8 w-40 h-40 bg-lime-500/20 rounded-full blur-3xl"></div>
                
                <!-- Preview Card -->
                <div class="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl overflow-hidden">
                  <div class="aspect-4/3 rounded-2xl bg-linear-to-br from-emerald-500/20 to-lime-500/20 flex items-center justify-center">
                    <i :class="project.icon || 'bi bi-envelope'" class="text-8xl text-white/30"></i>
                  </div>
          
                </div>
              </div>
            </div>
            
            <!-- Spacer -->
            <div class="invisible">
              <div class="relative bg-white/5 rounded-3xl p-8">
                <div class="aspect-4/3"></div>
                <div class="mt-6 grid grid-cols-3 gap-4">
                  <div class="text-center"><div>0</div><div>label</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Dots -->
    <div class="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-20">
      <button 
        v-for="(project, i) in projects" 
        :key="'dot-' + i"
        @click="goToProject(i)"
        class="group relative w-3 h-3 flex items-center justify-center"
      >
        <span 
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentProject === i ? 'bg-emerald-500 scale-150' : 'bg-white/30 group-hover:bg-white/50'"
        ></span>
        <span 
          class="absolute right-6 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          {{ project.title }}
        </span>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
      <span class="text-gray-500 text-xs font-mono">{{ String(currentProject + 1).padStart(2, '0') }}</span>
      <div class="w-32 h-px bg-white/10 relative overflow-hidden">
        <div 
          class="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500"
          :style="{ width: `${((currentProject + 1) / projects.length) * 100}%` }"
        ></div>
      </div>
      <span class="text-gray-500 text-xs font-mono">{{ String(projects.length).padStart(2, '0') }}</span>
    </div>

    <!-- Scroll Hint -->
    <div class="hidden lg:flex absolute bottom-8 left-8  items-center gap-2 text-gray-500 text-xs z-20">
      <i class="bi bi-mouse"></i>
    </div>

    <!-- Navigation Arrows -->
    <div class="absolute left-1/2 -translate-x-1/2 bottom-24 flex items-center gap-6 z-20">
      <!-- Previous Button -->
      <button
        @click="goToProject(currentProject - 1)"
        :disabled="currentProject === 0"
        class="hidden lg:flex group w-14 h-14 rounded-full border-2 transition-all duration-300 items-center justify-center"
        :class="[
          currentProject === 0 
            ? 'border-white/20 text-white/20 cursor-not-allowed' 
            : 'border-white/40 text-white hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-500/10'
        ]"
      >
        <i class="bi bi-arrow-left text-xl transition-transform"></i>
      </button>

      <!-- Next Button -->
      <button
        @click="goToProject(currentProject + 1)"
        :disabled="currentProject === projects.length - 1"
        class="hidden lg:flex group w-14 h-14 rounded-full border-2 transition-all duration-300 items-center justify-center"
        :class="[
          currentProject === projects.length - 1
            ? 'border-white/20 text-white/20 cursor-not-allowed' 
            : 'border-white/40 text-white hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-500/10'
        ]"
      >
        <i class="bi bi-arrow-right text-xl transition-transform"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  projects: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: 'Meeting Solution',
        category: 'Enterprise',
        description: 'Giải pháp toàn diện cho quản lý phòng họp và tài nguyên doanh nghiệp. Tối ưu hóa hiệu suất làm việc với hệ thống đặt lịch thông minh, minh bạch và hiệu quả.',
        tags: ['Smart Booking', 'Resources', 'Professional'],
        link: '/bookings',
        cta: 'Đặt lịch ngay',
        icon: 'bi bi-calendar-check' 
      },
      {
        id: 2,
        title: 'Email Builder',
        category: 'Công cụ chính',
        description: 'Tạo email chuyên nghiệp với trình soạn thảo kéo thả trực quan. Không cần code, dễ sử dụng cho mọi người.',
        tags: ['Drag & Drop', 'Responsive', 'Templates'],
        link: '/editor?mode=public',
        cta: 'Thử ngay',
        icon: 'bi bi-envelope-paper',
      },
      {
        id: 3,
        title: 'Template Gallery',
        category: 'Thư viện',
        description: 'Hàng trăm mẫu email đẹp mắt, chuyên nghiệp. Từ welcome email đến newsletter, promotion và nhiều hơn nữa.',
        tags: ['Professional', 'Modern', 'Customizable'],
        link: '/templates',
        cta: 'Xem mẫu',
        icon: 'bi bi-grid-3x3-gap'
      },
      {
        id: 4,
        title: 'Analytics',
        category: 'Theo dõi',
        description: 'Theo dõi hiệu suất email với dashboard analytics chi tiết. Biết được ai mở, click và tương tác với email của bạn.',
        tags: ['Real-time', 'Insights', 'Reports'],
        link: '/dashboard',
        cta: 'Dashboard',
        icon: 'bi bi-graph-up-arrow'
      }
    ]
  }
})

const sectionRef = ref(null)
const projectRefs = ref([])
const currentProject = ref(0)

// Touch/Swipe state
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const SWIPE_THRESHOLD = 50 // Minimum distance for swipe

const goToProject = (index) => {
  if (index >= 0 && index < props.projects.length) {
    currentProject.value = index
  }
}

// Touch event handlers
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX
  touchEndY.value = e.changedTouches[0].clientY
  
  handleSwipe()
}

const handleSwipe = () => {
  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value
  
  // Check if horizontal swipe is more significant than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
    if (deltaX > 0) {
      // Swipe right - previous project
      goToProject(currentProject.value - 1)
    } else {
      // Swipe left - next project
      goToProject(currentProject.value + 1)
    }
  }
}

let scrollTimeout = null
let scrollDelta = 0
const SCROLL_THRESHOLD = 30 // Reduced for more sensitivity

const handleWheel = (e) => {
  if (!sectionRef.value) return
  
  const rect = sectionRef.value.getBoundingClientRect()
  const isInView = rect.top <= 0 && rect.bottom >= window.innerHeight
  
  if (!isInView) return
  
  // Prevent default scroll when in view
  e.preventDefault()
  
  // Accumulate scroll
  scrollDelta += e.deltaY
  
  // Clear existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  // Debounce scroll events - reduced for faster response
  scrollTimeout = setTimeout(() => {
    if (Math.abs(scrollDelta) < SCROLL_THRESHOLD) {
      scrollDelta = 0
      return
    }
    
    const direction = scrollDelta > 0 ? 1 : -1
    const nextIndex = currentProject.value + direction
    
    // Change slide if within bounds
    if (nextIndex >= 0 && nextIndex < props.projects.length) {
      currentProject.value = nextIndex
    } else {
      // Allow scroll to continue by temporarily removing event listener
      window.removeEventListener('wheel', handleWheel)
      
      // Re-add after a delay
      setTimeout(() => {
        window.addEventListener('wheel', handleWheel, { passive: false })
      }, 300)
    }
    
    scrollDelta = 0
  }, 30)
}

onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
.project-slide {
  pointer-events: none;
}

.project-slide.opacity-100 {
  pointer-events: auto;
}
</style>
