<template>
  <section class="py-32 relative overflow-hidden">
    <!-- Background Elements -->
    
    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
          Bảng giá
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
          Chọn gói phù hợp với bạn
        </h2>
        <p class="text-gray-400 max-w-2xl mx-auto text-lg">
          Bắt đầu miễn phí, nâng cấp khi bạn cần thêm tính năng
        </p>
      </div>

      <!-- Email Packages Section -->
      <div class="mb-20">
        <h3 class="text-3xl font-bold text-white text-center mb-8">Gói Email</h3>
        <div v-if="loading" class="text-center text-gray-400">Đang tải...</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto z-40">
          <div
            v-for="pkg in emailPackages"
            :key="pkg._id"
            class="z-10 pricing-card relative p-8 rounded-3xl transition-all duration-500"
            :class="getEmailCardClass(pkg)"
          >
            <!-- Popular Badge -->
            <div v-if="pkg.isPopular" class="absolute -top-4 left-1/2 -translate-x-1/2">
              <span class="inline-block px-4 py-1.5 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold">
                Phổ biến nhất
              </span>
            </div>

            <div class="mb-6">
              <h3 class="text-2xl font-bold text-white mb-2">{{ pkg.name }}</h3>
              <div class="flex items-baseline gap-2 mb-4">
                <span
                  class="text-5xl font-bold"
                  :class="pkg.isPopular ? 'bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400' : 'text-white'"
                >
                  {{ getPrice(pkg) === 0 ? 'Free' : formatCurrency(getPrice(pkg)) + '₫' }}
                </span>
                <span v-if="getPrice(pkg) > 0" class="text-gray-400">/tháng</span>
              </div>
              <p :class="pkg.isPopular ? 'text-gray-300' : 'text-gray-400'">{{ pkg.description }}</p>
            </div>

            <ul class="space-y-4 mb-8">
              <li v-for="(feature, idx) in pkg.features" :key="idx" class="flex items-center gap-3">
                <i
                  class="bi bi-check-circle-fill text-xl mt-0.5"
                  :class="getEmailIconClass(pkg)"
                ></i>
                <span
                  :class="pkg.isPopular ? 'text-white font-medium' : 'text-gray-300'"
                >
                  {{ feature }}
                </span>
              </li>
            </ul>

            <button
              v-if="getPrice(pkg) === 0"
              @click="selectPlan(pkg.slug)"
              class="cursor-pointer z-40 block w-full py-3 px-6 text-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              Bắt đầu miễn phí
            </button>
            <button
              v-else
              @click="selectPlan(pkg.slug)"
              class="z-40 block w-full py-3 px-6 text-center rounded-full font-semibold transition-all duration-300"
              :class="pkg.isPopular
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-indigo-500/25 hover:scale-105'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'"
            >
              Nâng cấp {{ pkg.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Feature Comparison -->
      <div class="mt-20 text-center">
        <p class="text-gray-400">
          Tất cả các gói đều bao gồm: SSL bảo mật, sao lưu tự động, và cập nhật miễn phí
        </p>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase || 'http://localhost:8000/api'

const emailPackages = ref([])
const loading = ref(true)

const formatCurrency = (amount) => {
  if (!amount) return '0'
  return new Intl.NumberFormat('vi-VN').format(amount)
}

// Helper to get price from product (handles both old package structure and new Product structure)
const getPrice = (pkg) => {
  // New Product structure: price is in variants
  if (pkg.variants && pkg.variants.length > 0) {
    const activeVariant = pkg.variants.find(v => v.isActive) || pkg.variants[0]
    return activeVariant.price || 0
  }
  // Old package structure: price is direct field
  return pkg.price || 0
}

const getEmailCardClass = (pkg) => {
  if (pkg.isPopular) {
    return 'bg-linear-to-br from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500/50 hover:border-indigo-400 transform scale-105'
  }
  return 'bg-white/3 border border-white/10 hover:bg-white/5 hover:border-white/20'
}

const getEmailIconClass = (pkg) => {
  if (pkg.isPopular) return 'text-indigo-400'
  return 'text-green-400'
}


const fetchEmailPackages = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/products/public?type=email`)
    const data = await response.json()
    if (data.success && data.data) {
      emailPackages.value = data.data
    }
  } catch (error) {
    console.error('Error fetching email packages:', error)
  }
}


const selectPlan = (planSlug) => {
  // Chỉ dùng cho landing page - redirect đến login
  navigateTo(`/login?redirect=/pricing&plan=${planSlug}`)
}

// Fetch packages on mount
onMounted(async () => {
  loading.value = true
  await fetchEmailPackages()
  loading.value = false
})
</script>

<style scoped>

</style>
