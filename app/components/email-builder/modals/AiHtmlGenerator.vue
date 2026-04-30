<template>
  <div>
    <!-- Trigger Button -->
    <button
      @click="openModal"
      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-linear-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-violet-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
    >
      <i class="bi bi-stars"></i>
      <span>AI Generate HTML</span>
    </button>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div style="z-index:999999 !important" v-if="showModal" class="fixed inset-0 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="px-5 py-4 border-b border-gray-100 bg-linear-to-r from-violet-500 to-purple-600">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <i class="bi bi-stars text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-white">AI HTML Generator</h3>
                    <p class="text-xs text-white/80">Mô tả nội dung bạn muốn tạo</p>
                  </div>
                </div>
                <button @click="closeModal" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <i class="bi bi-x-lg text-white"></i>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-5 space-y-4">

              <!-- Prompt Input -->
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                  Mô tả nội dung HTML *
                </label>
                <textarea 
                  v-model="prompt"
                  rows="4"
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
                  placeholder="Ví dụ: Tạo một banner khuyến mãi Black Friday với nền đen, chữ vàng, hiển thị giảm 50%, có nút CTA màu đỏ"
                  @keyup.ctrl.enter="generateHtml"
                ></textarea>
              </div>

              <!-- Quick Prompts -->
              <div>
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Gợi ý nhanh</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="suggestion in quickPrompts"
                    :key="suggestion"
                    @click="prompt = suggestion"
                    class="px-3 py-1.5 text-xs bg-gray-100 hover:bg-violet-100 hover:text-violet-700 rounded-full transition-colors"
                  >
                    {{ suggestion }}
                  </button>
                </div>
              </div>

              <!-- Result -->
              <div v-if="generatedHtml" class="space-y-2">
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Kết quả</label>
                <div class="relative">
                  <pre class="p-3 bg-gray-900 text-green-400 text-xs rounded-lg overflow-x-auto max-h-48 font-mono">{{ generatedHtml }}</pre>
                  <button 
                    @click="copyResult"
                    class="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                  >
                    <i :class="copied ? 'bi bi-check' : 'bi bi-clipboard'"></i>
                  </button>
                </div>
              </div>

              <!-- Error -->
              <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">
                  <i class="bi bi-exclamation-circle mr-1"></i>
                  {{ error }}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
              <button
                @click="generateHtml"
                :disabled="!prompt || generating"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="generating ? 'bi bi-arrow-repeat animate-spin' : 'bi bi-magic'"></i>
                <span>{{ generating ? 'Đang tạo...' : 'Generate HTML' }}</span>
              </button>
              <button
                v-if="generatedHtml"
                @click="applyResult"
                class="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <i class="bi bi-check-lg"></i>
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const emit = defineEmits(['apply'])

// State
const showModal = ref(false)
const prompt = ref('')
const generatedHtml = ref('')
const generating = ref(false)
const error = ref('')
const copied = ref(false)

// Quick prompts
const quickPrompts = [
  'Banner khuyến mãi 50%',
  'Thông báo sự kiện',
  'Card sản phẩm với giá',
  'Footer với social links',
  'Testimonial khách hàng',
  'Stats/số liệu nổi bật'
]

// Open/close modal
const openModal = () => {
  showModal.value = true
  error.value = ''
}

const closeModal = () => {
  showModal.value = false
}

// Copy result
const copyResult = async () => {
  if (generatedHtml.value) {
    await navigator.clipboard.writeText(generatedHtml.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}

// Generate HTML using AI (Gemini Free)
const generateHtml = async () => {
  if (!prompt.value) return
  
  generating.value = true
  error.value = ''
  generatedHtml.value = ''
  
  try {
    await generateWithGemini()
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra khi generate HTML'
  } finally {
    generating.value = false
  }
}

// Generate HTML via backend API (secure)
const generateWithGemini = async () => {
  // Get runtime config for API base URL
  const runtimeConfig = useRuntimeConfig()
  const apiBaseUrl = runtimeConfig.public.apiBase 
  
  // Get auth token
  const authStore = useAuthStore()
  
  // Call backend API
  const response = await fetch(`${apiBaseUrl}/ai/generate-html`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt.value
    })
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to generate HTML')
  }
  
  const data = await response.json()
  
  if (!data.success || !data.html) {
    throw new Error(data.message || 'No HTML returned from server')
  }
  
  generatedHtml.value = data.html
}

// Apply result to parent
const applyResult = () => {
  if (generatedHtml.value) {
    emit('apply', generatedHtml.value)
    closeModal()
  }
}
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
