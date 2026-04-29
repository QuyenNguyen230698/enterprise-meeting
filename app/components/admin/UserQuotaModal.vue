<template>
  <div style="z-index:999999 !important" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-4">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="bi bi-sliders text-blue-600 text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Gán gói dịch vụ</h2>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 px-6">
        <div class="flex gap-4">
          <button
            @click="activeTab = 'email'"
            :class="[
              'px-4 py-3 font-medium text-sm border-b-2 transition-colors',
              activeTab === 'email'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <i class="bi bi-envelope mr-2"></i>
            Gói Email
          </button>
          <button
            @click="activeTab = 'conversion'"
            :class="[
              'px-4 py-3 font-medium text-sm border-b-2 transition-colors',
              activeTab === 'conversion'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <i class="bi bi-arrow-repeat mr-2"></i>
            Gói Conversion
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Email Package Tab -->
        <div v-if="activeTab === 'email'" class="space-y-6">
        <!-- Subscription Plan Selection -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div class="flex items-center gap-2 mb-3">
            <i class="bi bi-star-fill text-yellow-500"></i>
            <h3 class="font-semibold text-gray-900">Gói dịch vụ</h3>
          </div>
          <div class="space-y-3">
            <div class="flex gap-2">
              <button
                v-for="plan in plans"
                :key="plan.value"
                @click="selectPlan(plan.value)"
                :class="[
                  'flex-1 px-4 py-3 rounded-lg border-2 transition-all',
                  isPlanSelected(plan.value)
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                ]"
              >
                <div class="text-sm">{{ plan.name }}</div>
                <div class="text-xs opacity-75">{{ plan.limits }}</div>
              </button>
            </div>
              <button
                v-if="selectedPlan"
                @click="assignSubscription"
                :disabled="saving || isCurrentEmailPlan"
                :class="[
                  'w-full px-4 py-2 rounded-lg transition flex items-center justify-center gap-2',
                  isCurrentEmailPlan
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                ]"
              >
                <i class="bi bi-check-circle"></i>
                <span v-if="isCurrentEmailPlan">Đã gán gói này</span>
                <span v-else>Gán gói {{ (plans && plans.length > 0) ? (plans.find(p => p.value === selectedPlan)?.name || 'N/A') : 'N/A' }} {{ selectedPlan !== 'basic' ? '(1 tháng)' : '' }}</span>
              </button>
          </div>
        </div>

        <!-- Current Subscription Info -->
        <div v-if="currentSubscription || quotaSource === 'user'" class="bg-green-50 rounded-lg p-4 border border-green-200">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <i class="bi bi-check-circle-fill text-green-600"></i>
              <span class="font-semibold text-green-900">
                Gói hiện tại: {{ 
                  currentSubscription?.plan?.toUpperCase() || 
                  (quotaForm.notes?.includes('Pro') ? 'PRO' : 
                   quotaForm.notes?.includes('Enterprise') ? 'ENTERPRISE' : 'BASIC')
                }}
              </span>
            </div>
            <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {{ quotaSource === 'subscription' ? 'Từ subscription' : 'Admin gán' }}
            </span>
          </div>
          <div class="text-sm text-green-700">
            {{ quotaForm.notes || 'Gói Basic' }}
          </div>
        </div>

        <!-- Current Usage Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-center gap-2 text-blue-600 mb-2">
              <i class="bi bi-image"></i>
              <span class="text-sm font-medium">Ảnh đã tải lên</span>
            </div>
            <div class="text-2xl font-bold text-blue-700">{{ currentUsage.imagesUploaded || 0 }}</div>
            <div class="text-xs text-blue-500">{{  quotaForm.imageUploadLimit === -1 ? 'Không giới hạn' : '/ '+ quotaForm.imageUploadLimit }} ảnh</div>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center gap-2 text-green-600 mb-2">
              <i class="bi bi-envelope"></i>
              <span class="text-sm font-medium">Email đã gửi hôm nay</span>
            </div>
            <div class="text-2xl font-bold text-green-700">{{ currentUsage.emailsSentToday || 0 }}</div>
            <div class="text-xs text-green-500">{{ quotaForm.dailyEmailLimit === -1 ? 'Không giới hạn' : '/' + quotaForm.dailyEmailLimit }} email</div>
          </div>
        </div>

        <!-- Notes -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            <i class="bi bi-sticky mr-2"></i>Ghi chú
          </label>
          <textarea
            v-model="quotaForm.notes"
            rows="2"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Lý do gán gói, ghi chú thêm..."
          ></textarea>
        </div>
        </div>

        <!-- Conversion Package Tab -->
        <div v-if="activeTab === 'conversion'" class="space-y-6">
          <!-- Conversion Plan Selection -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div class="flex items-center gap-2 mb-3">
              <i class="bi bi-arrow-repeat text-purple-600"></i>
              <h3 class="font-semibold text-gray-900">Gói Conversion</h3>
            </div>
            <div class="space-y-3">
              <div class="flex gap-2">
                <button
                  v-for="plan in conversionPlans"
                  :key="plan.value"
                  @click="selectConversionPlan(plan.value)"
                  :class="[
                    'flex-1 px-4 py-3 rounded-lg border-2 transition-all',
                    isConversionPlanSelected(plan.value)
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-semibold'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                  ]"
                >
                  <div class="text-sm">{{ plan.name }}</div>
                  <div class="text-xs opacity-75">{{ plan.limits }}</div>
                </button>
              </div>
              <button
                v-if="selectedConversionPlan"
                @click="assignConversionSubscription"
                :disabled="savingConversion || isCurrentConversionPlan"
                :class="[
                  'w-full px-4 py-2 rounded-lg transition flex items-center justify-center gap-2',
                  isCurrentConversionPlan
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
                ]"
              >
                <i class="bi bi-check-circle"></i>
                <span v-if="isCurrentConversionPlan">Đã gán gói này</span>
                <span v-else>Gán gói {{ conversionPlans.find(p => p.value === selectedConversionPlan)?.name }} {{ selectedConversionPlan !== 'conversion-basic' ? '(1 tháng)' : '' }}</span>
              </button>
            </div>
          </div>

          <!-- Current Conversion Subscription Info -->
          <div v-if="currentConversionSubscription" class="bg-green-50 rounded-lg p-4 border border-green-200">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <i class="bi bi-check-circle-fill text-green-600"></i>
                <span class="font-semibold text-green-900">Gói hiện tại: {{ resolvedConversionPackage?.name || currentConversionSubscription.packageSlug }}</span>
              </div>
              <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Admin gán</span>
            </div>
            <div v-if="currentConversionSubscription.endDate" class="text-sm text-green-700">
              Hết hạn: {{ formatDate(currentConversionSubscription.endDate) }}
            </div>
            <div class="text-sm text-green-700 mt-1">
              Giới hạn: {{ resolvedConversionPackage?.dailyLimit ? resolvedConversionPackage.dailyLimit : 'Không giới hạn' }} files/ngày
            </div>
          </div>

          <!-- Current Conversion Usage Stats -->
          <div class="bg-purple-50 rounded-lg p-4">
            <div class="flex items-center gap-2 text-purple-600 mb-2">
              <i class="bi bi-arrow-repeat"></i>
              <span class="text-sm font-medium">Chuyển đổi hôm nay</span>
            </div>
            <div class="text-2xl font-bold text-purple-700">{{ currentConversionUsage.todayConversions || 0 }}</div>
            <div class="text-xs text-purple-500">{{ resolvedConversionPackage?.dailyLimit ? '/' + resolvedConversionPackage.dailyLimit : '' }} files</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0">
        <button 
          @click="$emit('close')"
          class="px-6 py-1.5 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const config = useRuntimeConfig()
const { success, error: showError } = useToast()
const authStore = useAuthStore()

const activeTab = ref('email')
const saving = ref(false)
const savingConversion = ref(false)
const currentUsage = ref({
  imagesUploaded: 0,
  emailsSentToday: 0
})
const currentConversionUsage = ref({
  todayConversions: 0
})

const quotaForm = ref({
  imageUploadLimit: 50,
  dailyEmailLimit: 50,
  notes: ''
})

const currentSubscription = ref(null)
const currentConversionSubscription = ref(null)
const quotaSource = ref('default')
const selectedPlan = ref('basic')
const selectedConversionPlan = ref('conversion-basic')
const durationMonths = ref(1)
const emailPackages = ref([])
const conversionPackages = ref([])

const plans = computed(() => {
  return emailPackages.value.map(pkg => ({
    value: pkg._id, // Use ID as value
    name: pkg.name,
    limits: `${pkg.imageStorageLimit} ảnh / ${pkg.emailLimit} email`,
    slug: pkg.slug
  }))
})

const conversionPlans = computed(() => {
  return conversionPackages.value.map(pkg => ({
    value: pkg._id, // Use ID as value
    name: pkg.name,
    limits: `${pkg.dailyLimit} files/ngày`,
    slug: pkg.slug
  }))
})

// Load user's current quota settings
const loadUserQuota = async () => {
  try {
    const token = authStore.accessToken || useCookie('accessToken').value
    // Add timestamp to prevent 304 cache
    const response = await $fetch(`${config.public.apiBase}/user-management/users/${props.user._id}/quota?_t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    
    if (response.success && response.quota) {
      quotaForm.value = {
        imageUploadLimit: response.quota.imageUploadLimit ?? 50,
        dailyEmailLimit: response.quota.dailyEmailLimit ?? 50,
        notes: response.quota.notes || ''
      }
      
      
      if (response.usage) {
        currentUsage.value = response.usage
      }

      if (response.subscription) {
        currentSubscription.value = response.subscription
        // Normalize plan value to match slug (lowercase)
        // Also handle legacy 'email-' prefix potential mismatch if needed, 
        // but let's assume slug and plan stored are consistent enough or at least match case-insensitively
        // Normalize plan value to match ID if possible
        // We need to find the package ID corresponding to the subscription's packageSlug or productId
        let planValue = null
        if (response.subscription.productId) {
            planValue = response.subscription.productId // Optimally use productId from sub
        } else if (response.subscription.packageSlug) {
            // Fallback find by slug
            const pkg = emailPackages.value.find(p => p.slug === response.subscription.packageSlug)
            planValue = pkg ? pkg._id : null
        }
        
        selectedPlan.value = planValue || (emailPackages.value[0]?._id) // Default to first package if not found
      } else if (response.quotaSource === 'user' && quotaForm.value.notes) {
        // Set selectedPlan based on notes when quotaSource is 'user'
        selectedPlan.value = 'basic'
      }

      if (response.quotaSource) {
        quotaSource.value = response.quotaSource
      }
    }
  } catch (err) {
    console.error('[UserQuotaModal] Error loading quota:', err)
    // Use default values if endpoint doesn't exist yet
  }
}

const selectPlan = (plan) => {
  selectedPlan.value = plan
  if (plan === 'basic') {
    durationMonths.value = 0
  } else if (!durationMonths.value) {
    durationMonths.value = 1
  }
}

const assignSubscription = async () => {
  saving.value = true
  try {
    const token = authStore.accessToken || useCookie('accessToken').value
    const response = await $fetch(`${config.public.apiBase}/user-management/users/${props.user._id}/subscription`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        packageId: selectedPlan.value, // Send packageId
        durationMonths: durationMonths.value // Simple duration
      }
    })
    
    if (response.success) {
      success(response.message || 'Gán gói thành công!')
      await loadUserQuota()
      emit('save', response.data)
    } else {
      showError(response.message || 'Không thể gán gói')
    }
  } catch (err) {
    showError(err.data?.message || 'Không thể gán gói')
  } finally {
    saving.value = false
  }
}

const loadConversionSubscription = async () => {
  try {
    const token = authStore.accessToken || useCookie('accessToken').value
    const response = await $fetch(`${config.public.apiBase}/user-management/users/${props.user._id}/conversion-subscription`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    
    if (response.success) {
      if (response.subscription) {
        currentConversionSubscription.value = response.subscription
        const pkg = conversionPackages.value.find(p => p.slug === response.subscription.packageSlug)
        selectedConversionPlan.value = pkg ? pkg._id : (conversionPackages.value[0]?._id)
      }
      if (response.usage) {
        currentConversionUsage.value = response.usage
      }
    }
  } catch (err) {
    console.error('[UserQuotaModal] Failed to load conversion subscription:', err)
  }
}

const selectConversionPlan = (plan) => {
  selectedConversionPlan.value = plan
}

const assignConversionSubscription = async () => {
  savingConversion.value = true
  try {
    const token = authStore.accessToken || useCookie('accessToken').value
    const response = await $fetch(`${config.public.apiBase}/user-management/users/${props.user._id}/conversion-subscription`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        packageId: selectedConversionPlan.value, // Send packageId
        durationMonths: durationMonths.value || 1 // Default 1 month
      }
    })
    
    if (response.success) {
      success(response.message || 'Gán gói conversion thành công!')
      await loadConversionSubscription()
      emit('save', response.data)
    } else {
      showError(response.message || 'Không thể gán gói conversion')
    }
  } catch (err) {
    showError(err.data?.message || 'Không thể gán gói conversion')
  } finally {
    savingConversion.value = false
  }
}

const isPlanSelected = (planValue) => {
  if (!selectedPlan.value) return false
  return selectedPlan.value === planValue
}

const isConversionPlanSelected = (planValue) => {
  if (!selectedConversionPlan.value) return false
  return selectedConversionPlan.value === planValue
}

const isCurrentEmailPlan = computed(() => {
  if (!currentSubscription.value || !selectedPlan.value) return false
  // Use productId check if available
  if (currentSubscription.value?.productId === selectedPlan.value) return true
  return false
})

const isCurrentConversionPlan = computed(() => {
  if (!currentConversionSubscription.value || !selectedConversionPlan.value) return false
  // Check if they match by ID
  if (currentConversionSubscription.value?.productId === selectedConversionPlan.value) return true
  return false
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchEmailPackages = async () => {
  try {
    const token = authStore.accessToken || useCookie('accessToken').value
    const response = await $fetch(`${config.public.apiBase}/products?type=email`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.success) {
      emailPackages.value = response.data.map(p => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          emailLimit: p.specifications?.emailLimit || 0,
          imageStorageLimit: p.specifications?.imageStorageLimit || 0
        }))
    }
  } catch (error) {
    console.error('Error fetching email packages:', error)
  }
}

const fetchConversionPackages = async () => {
  try {
    const token = authStore.accessToken || useCookie('accessToken').value
    const response = await $fetch(`${config.public.apiBase}/products?type=conversion`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.success) {
      conversionPackages.value = response.data.map(p => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          dailyLimit: p.specifications?.dailyConversionLimit || 0
        }))
    }
  } catch (error) {
    console.error('Error fetching conversion packages:', error)
  }
}

const resolvedConversionPackage = computed(() => {
  if (!currentConversionSubscription.value) return null
  
  // Case 1: Read from subscription features (NEW Product-based model)
  if (currentConversionSubscription.value.features?.dailyConversionLimit !== undefined) {
    // Try to get name from packages list using slug
    const foundPkg = conversionPackages.value.find(p => p.slug === currentConversionSubscription.value.packageSlug)
    
    return {
      name: foundPkg?.name || currentConversionSubscription.value.packageSlug,
      dailyLimit: currentConversionSubscription.value.features.dailyConversionLimit
    }
  }
  
  // Case 2: Package is already populated (OLD model)
  if (currentConversionSubscription.value.packageId && typeof currentConversionSubscription.value.packageId === 'object' && currentConversionSubscription.value.packageId.name) {
    return {
      name: currentConversionSubscription.value.packageId.name,
      dailyLimit: currentConversionSubscription.value.packageId.dailyLimit || 0
    }
  }

  // Case 3: Look up by ID or Slug from local packages
  const pkgId = currentConversionSubscription.value.packageId?._id || currentConversionSubscription.value.packageId
  const pkgSlug = currentConversionSubscription.value.packageSlug

  const foundPkg = conversionPackages.value.find(p => p._id === pkgId || p.slug === pkgSlug)
  
  if (foundPkg) {
    return {
      name: foundPkg.name,
      dailyLimit: foundPkg.dailyLimit
    }
  }

  return {
    name: pkgSlug || 'Unknown Package',
    dailyLimit: 0
  }
})

onMounted(async () => {
  await fetchEmailPackages()
  await fetchConversionPackages()
  loadUserQuota()
  loadConversionSubscription()
})
</script>
