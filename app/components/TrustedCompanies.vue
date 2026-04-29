<template>
  <section ref="sectionRef" class="py-24 relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-linear-to-b from-transparent via-white/2 to-transparent"></div>
    
    <div class="relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-emerald-400 text-sm font-medium mb-4">
          Đối tác
        </span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Được tin dùng bởi
        </h2>
        <p class="text-gray-400 max-w-xl mx-auto">
          Các doanh nghiệp đang sử dụng EM cho chiến dịch email marketing & Meeting Zoom của họ
        </p>
      </div>

      <!-- Companies Slider -->
      <div class="relative">
        <!-- Gradient Masks -->
        <div class="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none"></div>
        
        <!-- Scrolling Container -->
        <div class="overflow-hidden">
          <div class="scroll-track">
            <!-- First set -->
            <div 
              v-for="(company, index) in companies" 
              :key="`first-${index}`"
              class="company-card shrink-0 group"
            >
              <div class="w-44 h-20 flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  v-if="company.logo"
                  :src="company.logo" 
                  :alt="company.name"
                  class="max-h-10 max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <span 
                  v-else 
                  class="text-lg font-bold text-gray-500 group-hover:text-white transition-colors duration-300"
                >
                  {{ company.name }}
                </span>
              </div>
            </div>
            <!-- Duplicate set -->
            <div 
              v-for="(company, index) in companies" 
              :key="`second-${index}`"
              class="company-card shrink-0 group"
            >
              <div class="w-44 h-20 flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  v-if="company.logo"
                  :src="company.logo" 
                  :alt="company.name"
                  class="max-h-10 max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <span 
                  v-else 
                  class="text-lg font-bold text-gray-500 group-hover:text-white transition-colors duration-300"
                >
                  {{ company.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  companies: {
    type: Array,
    default: () => [
      // JSON structure for companies - user can fill this
      { name: 'Tran Duc Corporation', logo: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/78610132-f950-40d4-3835-cef3d9b54b00/public?w=128&h=40&format=webp&quality=80' },
      { name: 'AnLam Retreats', logo: 'https://anlam.com/wp-content/uploads/2018/11/an-lam-bullet.png' },
      { name: 'TD CASA', logo: 'https://td-casa.com/logo/logo-white.png' },
      { name: 'Velante Living', logo: '/logo/logo-main-white.png' },
      { name: 'Verita Living', logo: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/63af9cad-e22e-475f-b368-466e42079d00/2K' },
      { name: 'Modulux Homes', logo: 'https://moduluxhomes.com/Logo_MDL_white.svg' },
      { name: 'Gateway City Homes', logo: 'https://res.cloudinary.com/dpcigceaq/image/upload/v1765281506/Media%20Gateway%20City/iiingth1w5eatij5cju0.svg' },
      { name: 'Tran Duc Furnishings', logo: 'https://tranducfurnishings.com/wp-content/uploads/2020/02/Logo_TDF-1536x702.png' },
      { name: 'Tran Duc Home', logo: 'https://tranduchomes.com/wp-content/uploads/2023/05/Logo_TDH_315-300x97.png' },
    ]
  }
})

const sectionRef = ref(null)
</script>

<style scoped>
.scroll-track {
  display: flex;
  gap: 64px;
  animation: scroll 30s linear infinite;
  will-change: transform;
}

.scroll-track:hover {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.company-card {
  transition: transform 0.3s ease;
  flex-shrink: 0;
}
</style>
