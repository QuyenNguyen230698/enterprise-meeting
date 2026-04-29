<template>
  <div class="p-4">
    <!-- Header Section -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-1">Thư Viện Mẫu</h3>
      <p class="text-xs text-gray-500">Chọn mẫu để bắt đầu nhanh</p>
    </div>

    <!-- Open Gallery Button -->
    <button 
      @click="openGallery"
      class="w-full mb-4 px-4 py-3 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 text-white rounded-xl font-medium hover:from-emerald-700 hover:via-teal-700 hover:to-lime-700 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
    >
      <i class="bi bi-collection text-lg"></i>
      <span>Mở Thư Viện ({{ allTemplates.length }} mẫu)</span>
    </button>

    <!-- Quick Templates List -->
    <div class="space-y-2">
      <div
        v-for="template in quickTemplates"
        :key="template.id"
        class="group border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-200"
        @click="selectTemplate(template)"
      >
        <div class="flex items-center gap-3">
          <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm" 
            :style="{ background: template.gradient || 'linear-gradient(135deg, #3b82f6, #6366f1)' }"
          >
            <i :class="template.icon" class="text-white text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 truncate">{{ template.name }}</h4>
            <span 
              class="inline-block text-xs px-2 py-0.5 rounded mt-1" 
              :style="{ background: getCategoryColor(template.category).bg, color: getCategoryColor(template.category).text }"
            >
              {{ template.category }}
            </span>
          </div>
          <i class="bi bi-chevron-right text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
        </div>
      </div>
    </div>

    <!-- Template Gallery Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div style="z-index:999999 !important" v-if="showGallery" class="fixed inset-0 flex">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeGallery"></div>
          
          <!-- Modal Container -->
          <div class="relative flex w-full h-full md:items-center md:justify-center md:p-6">
            <div class="bg-white w-full h-full md:rounded-2xl md:shadow-2xl md:max-w-3/4 md:max-h-[85vh] flex overflow-hidden">
              
              <!-- Desktop: Two Column Layout -->
              <div class="hidden md:flex w-full">
                <!-- Left: Categories Panel -->
                <div class="w-64 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
                  <!-- Header -->
                  <div class="p-4 border-b border-gray-200 bg-white">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <i class="bi bi-collection text-white text-lg"></i>
                      </div>
                      <div>
                        <h2 class="text-base font-bold text-gray-900">Thư Viện Mẫu</h2>
                        <p class="text-xs text-gray-500">{{ allTemplates.length }} mẫu có sẵn</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Category List -->
                  <div class="flex-1 overflow-y-auto p-2">
                    <div class="space-y-1">
                      <button
                        v-for="cat in categories"
                        :key="cat.id"
                        @click="selectedCategory = cat.id"
                        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                        :class="selectedCategory === cat.id 
                          ? 'bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 text-white shadow-md shadow-emerald-500/30' 
                          : 'text-gray-700 hover:bg-gray-100'"
                      >
                        <i :class="cat.icon" class="text-base w-5"></i>
                        <span class="flex-1 text-sm font-medium">{{ cat.name }}</span>
                        <span 
                          class="text-xs px-2 py-0.5 rounded-full"
                          :class="selectedCategory === cat.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'"
                        >
                          {{ cat.count }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right: Templates Panel -->
                <div class="flex-1 flex flex-col min-w-0">
                  <!-- Header -->
                  <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">
                        {{ selectedCategory === 'all' ? 'Tất Cả Mẫu' : selectedCategoryName }}
                      </h3>
                      <p class="text-xs text-gray-500">{{ filteredTemplates.length }} mẫu</p>
                    </div>
                    <button 
                      @click="closeGallery" 
                      class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <i class="bi bi-x-lg text-gray-500"></i>
                    </button>
                  </div>

                  <!-- Templates Grid -->
                  <div class="flex-1 overflow-y-auto p-4">
                    <div class="grid grid-cols-2 xl:grid-cols-3 gap-4">
                      <div
                        v-for="template in filteredTemplates"
                        :key="template.id"
                        @click="selectTemplate(template); closeGallery()"
                        class="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:border-blue-400 transition-all duration-300 hover:-translate-y-1"
                      >
                        <!-- Preview -->
                        <div 
                          class="h-36 relative overflow-hidden"
                          :style="{ 
                            background: template.previewBg || '#f8fafc',
                            backgroundImage: template.previewImage ? `url(${template.previewImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }"
                        >
                          <div v-if="!template.previewImage" class="absolute inset-0 flex items-center justify-center">
                            <div 
                              class="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" 
                              :style="{ background: template.gradient || 'linear-gradient(135deg, #3b82f6, #6366f1)' }"
                            >
                              <i :class="template.icon" class="text-white text-2xl"></i>
                            </div>
                          </div>
                          <!-- Overlay -->
                          <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                            <span class="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-blue-600 shadow-lg">
                              <i class="bi bi-plus-circle mr-1"></i>Sử dụng
                            </span>
                          </div>
                        </div>
                        
                        <!-- Info -->
                        <div class="p-3">
                          <h4 class="font-medium text-gray-900 text-sm mb-1 truncate">{{ template.name }}</h4>
                          <p class="text-xs text-gray-500 line-clamp-1 mb-2">{{ template.description }}</p>
                          <div class="flex items-center justify-between">
                            <span 
                              class="text-xs px-2 py-0.5 rounded-full"
                              :style="{ background: getCategoryColor(template.category).bg, color: getCategoryColor(template.category).text }"
                            >
                              {{ template.category }}
                            </span>
                            <span class="text-xs text-gray-400">{{ template.elements.length }} blocks</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Empty State -->
                    <div v-if="filteredTemplates.length === 0" class="flex flex-col items-center justify-center py-16">
                      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i class="bi bi-inbox text-2xl text-gray-400"></i>
                      </div>
                      <p class="text-gray-500 text-sm">Không có mẫu nào</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile: Tab-based Layout -->
              <div class="flex md:hidden flex-col w-full h-full">
                <!-- Mobile Header -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
                  <div class="flex items-center gap-3">
                    <button 
                      v-if="mobileView === 'templates'"
                      @click="mobileView = 'categories'"
                      class="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <i class="bi bi-arrow-left text-gray-600"></i>
                    </button>
                    <div>
                      <h2 class="text-base font-bold text-gray-900">
                        {{ mobileView === 'categories' ? 'Thư Viện Mẫu' : selectedCategoryName }}
                      </h2>
                      <p class="text-xs text-gray-500">
                        {{ mobileView === 'categories' ? `${allTemplates.length} mẫu` : `${filteredTemplates.length} mẫu` }}
                      </p>
                    </div>
                  </div>
                  <button @click="closeGallery" class="p-2 hover:bg-gray-100 rounded-lg">
                    <i class="bi bi-x-lg text-gray-500"></i>
                  </button>
                </div>

                <!-- Mobile: Categories View -->
                <div v-if="mobileView === 'categories'" class="flex-1 overflow-y-auto">
                  <div class="p-3 space-y-1">
                    <button
                      v-for="cat in categories"
                      :key="cat.id"
                      @click="selectCategoryMobile(cat.id)"
                      class="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all"
                    >
                      <div 
                        class="w-10 h-10 rounded-lg flex items-center justify-center"
                        :style="{ background: getCategoryGradient(cat.id) }"
                      >
                        <i :class="cat.icon" class="text-white"></i>
                      </div>
                      <div class="flex-1 text-left">
                        <span class="text-sm font-medium text-gray-900">{{ cat.name }}</span>
                        <span class="block text-xs text-gray-500">{{ cat.count }} mẫu</span>
                      </div>
                      <i class="bi bi-chevron-right text-gray-400"></i>
                    </button>
                  </div>
                </div>

                <!-- Mobile: Templates View -->
                <div v-else class="flex-1 overflow-y-auto">
                  <div class="p-3 grid grid-cols-2 gap-3">
                    <div
                      v-for="template in filteredTemplates"
                      :key="template.id"
                      @click="selectTemplate(template); closeGallery()"
                      class="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                    >
                      <div 
                        class="h-28 relative"
                        :style="{ 
                          background: template.previewBg || '#f8fafc',
                          backgroundImage: template.previewImage ? `url(${template.previewImage})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }"
                      >
                        <div v-if="!template.previewImage" class="absolute inset-0 flex items-center justify-center">
                          <div 
                            class="w-12 h-12 rounded-lg flex items-center justify-center shadow-md" 
                            :style="{ background: template.gradient }"
                          >
                            <i :class="template.icon" class="text-white text-lg"></i>
                          </div>
                        </div>
                      </div>
                      <div class="p-2.5">
                        <h4 class="font-medium text-gray-900 text-xs truncate">{{ template.name }}</h4>
                        <span class="text-xs text-gray-400">{{ template.elements.length }} blocks</span>
                      </div>
                    </div>
                  </div>

                  <!-- Empty -->
                  <div v-if="filteredTemplates.length === 0" class="flex flex-col items-center justify-center py-12">
                    <i class="bi bi-inbox text-3xl text-gray-300 mb-2"></i>
                    <p class="text-gray-500 text-sm">Không có mẫu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import emailTemplatesData from '~/data/emailTemplates.json'
import emailTemplatesData_1 from '~/data/additionalTemplates.json'
import emailTemplatesData_2 from '~/data/newTemplates.json'


const emit = defineEmits(['select-template'])

// State
const showGallery = ref(false)
const selectedCategory = ref('all')
const mobileView = ref('categories') // 'categories' | 'templates'

// Actions
const openGallery = () => {
  showGallery.value = true
  mobileView.value = 'categories'
}

const closeGallery = () => {
  showGallery.value = false
  mobileView.value = 'categories'
}

const selectTemplate = (template) => {
  emit('select-template', template)
}

const selectCategoryMobile = (catId) => {
  selectedCategory.value = catId
  mobileView.value = 'templates'
}

// Category colors
const getCategoryColor = (category) => {
  const colors = {
    'Welcome': { bg: '#dbeafe', text: '#1d4ed8' },
    'Product': { bg: '#fae8ff', text: '#a21caf' },
    'E-Commerce': { bg: '#fee2e2', text: '#dc2626' },
    'Real Estate': { bg: '#dcfce7', text: '#16a34a' },
    'HR / Recruitment': { bg: '#f3e8ff', text: '#7c3aed' },
    'Sales': { bg: '#dbeafe', text: '#1e40af' },
    'Marketing': { bg: '#cffafe', text: '#0891b2' },
    'Event': { bg: '#fef3c7', text: '#d97706' },
    'Feedback': { bg: '#ccfbf1', text: '#14b8a6' },
    'Education': { bg: '#e0f2fe', text: '#0284c7' },
    'Christmas': { bg: '#fee2e2', text: '#dc2626' },
    'Tết': { bg: '#fef3c7', text: '#b45309' },
    'New Year': { bg: '#e0e7ff', text: '#4338ca' },
    'Travel': { bg: '#cffafe', text: '#0891b2' },
    'Resort': { bg: '#d1fae5', text: '#059669' },
    'Restaurant': { bg: '#ffedd5', text: '#ea580c' },
    'Hotel': { bg: '#fce7f3', text: '#be185d' },
    'Banking': { bg: '#dbeafe', text: '#1d4ed8' },
    'Finance': { bg: '#f0fdf4', text: '#15803d' },
    'Gaming': { bg: '#fae8ff', text: '#c026d3' }
  }
  return colors[category] || { bg: '#f3f4f6', text: '#4b5563' }
}

// Category gradients for mobile
const getCategoryGradient = (catId) => {
  const gradients = {
    'all': 'linear-gradient(135deg, #3b82f6, #6366f1)',
    'Welcome': 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    'Product': 'linear-gradient(135deg, #a855f7, #ec4899)',
    'E-Commerce': 'linear-gradient(135deg, #f43f5e, #ef4444)',
    'Real Estate': 'linear-gradient(135deg, #10b981, #34d399)',
    'HR / Recruitment': 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    'Sales': 'linear-gradient(135deg, #1e40af, #3b82f6)',
    'Marketing': 'linear-gradient(135deg, #06b6d4, #0891b2)',
    'Event': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'Feedback': 'linear-gradient(135deg, #14b8a6, #2dd4bf)',
    'Education': 'linear-gradient(135deg, #0284c7, #38bdf8)',
    'Christmas': 'linear-gradient(135deg, #dc2626, #16a34a)',
    'Tết': 'linear-gradient(135deg, #f59e0b, #dc2626)',
    'New Year': 'linear-gradient(135deg, #6366f1, #a855f7)',
    'Travel': 'linear-gradient(135deg, #0891b2, #06b6d4)',
    'Resort': 'linear-gradient(135deg, #059669, #10b981)',
    'Restaurant': 'linear-gradient(135deg, #ea580c, #f97316)',
    'Hotel': 'linear-gradient(135deg, #be185d, #ec4899)',
    'Banking': 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    'Finance': 'linear-gradient(135deg, #15803d, #22c55e)',
    'Gaming': 'linear-gradient(135deg, #c026d3, #a855f7)'
  }
  return gradients[catId] || gradients['all']
}

// Selected category name
const selectedCategoryName = computed(() => {
  if (selectedCategory.value === 'all') return 'Tất Cả'
  return selectedCategory.value
})

const inlineTemplates = [
  
]

// Templates from JSON file (with inline templates as fallback/additional)
const jsonTemplates = emailTemplatesData.templates || []
const templates = [...jsonTemplates, ...inlineTemplates,...emailTemplatesData_1.templates || [],...emailTemplatesData_2.templates || []]

// Category icons from JSON or defaults
const categoryIconsFromJson = emailTemplatesData.categoryIcons || {}

// Categories for the gallery
const categories = computed(() => {
  const cats = [
    { id: 'all', name: 'Tất Cả', icon: 'bi bi-grid-3x3-gap' }
  ]
  
  const categorySet = new Set()
  templates.forEach(t => categorySet.add(t.category))
  
  const categoryIcons = {
    ...categoryIconsFromJson,
    'Welcome': 'bi bi-hand-thumbs-up',
    'Product': 'bi bi-box-seam',
    'E-Commerce': 'bi bi-cart4',
    'Real Estate': 'bi bi-house-door',
    'HR / Recruitment': 'bi bi-people',
    'Sales': 'bi bi-graph-up-arrow',
    'Marketing': 'bi bi-megaphone',
    'Event': 'bi bi-calendar-event',
    'Feedback': 'bi bi-chat-heart',
    'Education': 'bi bi-book',
    'Christmas': 'bi bi-gift',
    'Tết': 'bi bi-flower1',
    'New Year': 'bi bi-stars',
    'Travel': 'bi bi-airplane',
    'Resort': 'bi bi-sun',
    'Restaurant': 'bi bi-shop',
    'Hotel': 'bi bi-building',
    'Banking': 'bi bi-bank',
    'Finance': 'bi bi-graph-up',
    'Gaming': 'bi bi-controller'
  }
  
  categorySet.forEach(cat => {
    cats.push({
      id: cat,
      name: cat,
      icon: categoryIcons[cat] || 'bi bi-folder',
      count: templates.filter(t => t.category === cat).length
    })
  })
  
  cats[0].count = templates.length
  return cats
})

// All templates
const allTemplates = computed(() => templates)

// Quick templates (first 5)
const quickTemplates = computed(() => templates.slice(0, 5))

// Filtered templates based on selected category
const filteredTemplates = computed(() => {
  if (selectedCategory.value === 'all') return templates
  return templates.filter(t => t.category === selectedCategory.value)
})
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>
