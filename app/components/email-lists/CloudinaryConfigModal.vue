<template>
  <ConfirmModal
    :is-visible="showDeleteConfirm"
    title="Xóa cấu hình Cloudinary"
    message="Bạn có chắc muốn xóa cấu hình Cloudinary? Bạn sẽ không thể upload ảnh cho đến khi cấu hình lại."
    type="danger"
    @confirm="executeDelete"
    @cancel="showDeleteConfirm = false"
  />

  <div style="z-index: 999999 !important" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="bi bi-cloud-upload text-blue-600 text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Cấu hình Cloudinary</h2>
            <p class="text-sm text-gray-500">Quản lý upload ảnh cho email list</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Step Indicator -->
        <div class="flex items-center justify-center gap-2 mb-4">
          <div :class="currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'" class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
          <div :class="currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'" class="h-1 w-16"></div>
          <div :class="currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'" class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
          <div :class="currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'" class="h-1 w-16"></div>
          <div :class="currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'" class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
        </div>

        <!-- Step 1: Info Banner -->
        <div v-if="currentStep === 1" class="space-y-4">
          <div class="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div class="flex gap-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Tại sao cần Cloudinary?</h3>
                <p class="text-sm text-gray-700 mb-4">Cloudinary giúp bạn lưu trữ và quản lý hình ảnh một cách chuyên nghiệp với CDN toàn cầu, tối ưu hóa tự động và bảo mật cao.</p>
                
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="bg-white rounded-lg p-3 border border-blue-100">
                    <i class="bi bi-lightning-charge text-blue-600 text-xl mb-1"></i>
                    <p class="text-xs font-medium text-gray-900">Tải nhanh</p>
                    <p class="text-xs text-gray-600">CDN toàn cầu</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-blue-100">
                    <i class="bi bi-shield-check text-blue-600 text-xl mb-1"></i>
                    <p class="text-xs font-medium text-gray-900">Bảo mật</p>
                    <p class="text-xs text-gray-600">HTTPS & backup</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-blue-100">
                    <i class="bi bi-gear text-blue-600 text-xl mb-1"></i>
                    <p class="text-xs font-medium text-gray-900">Tự động</p>
                    <p class="text-xs text-gray-600">Tối ưu hình ảnh</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-blue-100">
                    <i class="bi bi-infinity text-blue-600 text-xl mb-1"></i>
                    <p class="text-xs font-medium text-gray-900">Miễn phí</p>
                    <p class="text-xs text-gray-600">25GB storage</p>
                  </div>
                </div>

                <div class="bg-blue-600 rounded-lg p-4 text-white">
                  <p class="text-sm font-medium mb-2"> Hướng dẫn lấy thông tin:</p>
                  <ol class="list-decimal list-inside space-y-1 text-sm">
                    <li>Truy cập <a href="https://cloudinary.com/console" target="_blank" class="underline font-medium">Cloudinary Console</a></li>
                    <li>Đăng nhập hoặc tạo tài khoản miễn phí (chỉ 2 phút)</li>
                    <li>Copy Cloud Name, API Key và API Secret từ Dashboard</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Credentials Form -->
        <div v-if="currentStep === 2" class="space-y-4">

          <div v-if="hasConfig" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-center gap-2 text-green-800">
              <i class="bi bi-check-circle-fill text-green-600"></i>
              <span class="font-medium">Cloudinary đã được cấu hình</span>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <!-- Cloud Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                <i class="bi bi-cloud mr-2 text-blue-600"></i>Cloud Name *
              </label>
              <input
                v-model="form.cloudName"
                type="text"
                required
                placeholder="vd: my-cloud-name"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <p class="text-xs text-gray-500 mt-1">Tìm thấy ở Dashboard → Account Details</p>
            </div>

            <!-- API Key -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                <i class="bi bi-key mr-2 text-blue-600"></i>API Key *
              </label>
              <input
                v-model="form.apiKey"
                type="text"
                required
                placeholder="vd: 123456789012345"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <p class="text-xs text-gray-500 mt-1">Tìm thấy ở Dashboard → API Keys</p>
            </div>

            <!-- API Secret -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                <i class="bi bi-shield-lock mr-2 text-blue-600"></i>API Secret *
              </label>
              <div class="relative">
                <input
                  v-model="form.apiSecret"
                  :type="showSecret ? 'text' : 'password'"
                  :required="!hasConfig"
                  :placeholder="hasConfig ? '••••••••••••••••' : 'Nhập API Secret'"
                  class="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  @click="showSecret = !showSecret"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <i :class="showSecret ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ hasConfig ? 'Để trống nếu không muốn thay đổi' : 'Tìm thấy ở Dashboard → API Keys (click để hiện)' }}
              </p>
            </div>

            <!-- Folder -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                <i class="bi bi-folder mr-2 text-blue-600"></i>Folder (tùy chọn)
              </label>
              <input
                v-model="form.folder"
                type="text"
                placeholder=""
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <p class="text-xs text-gray-500 mt-1">Thư mục lưu trữ ảnh trên Cloudinary</p>
            </div>
          </div>
        </div>

        <!-- Step 3: Review -->
        <div v-if="currentStep === 3" class="space-y-4">
          <div class="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <i class="bi bi-check-circle text-white text-2xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Xác nhận thông tin</h3>
                <p class="text-sm text-gray-600">Kiểm tra lại trước khi lưu</p>
              </div>
            </div>

            <div class="bg-white rounded-lg p-4 space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Cloud Name:</span>
                <span class="text-sm font-semibold text-gray-900">{{ form.cloudName || '-' }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">API Key:</span>
                <span class="text-sm font-semibold text-gray-900">{{ form.apiKey || '-' }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-gray-600">Folder:</span>
                <span class="text-sm font-semibold text-gray-900">{{ form.folder }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-col gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
        <!-- Delete Button - Above Navigation -->
        <div v-if="hasConfig && currentStep !== 1" class="flex justify-center w-full">
          <button
            @click="showDeleteConfirm = true"
            :disabled="loading"
            class="w-full flex justify-center px-6 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            <i class="bi bi-trash"></i>
            <span>Xóa cấu hình</span>
          </button>
        </div>
        
        <!-- Action Buttons Container -->
        <div class="flex items-center justify-between w-full gap-2">
          <!-- Back and Next Buttons - Same Row on Mobile -->
          <div v-if="currentStep > 1 && currentStep < 3" class="flex w-full gap-2">
            <button 
              @click="currentStep--"
              type="button"
              class="flex-1 px-4 py-2.5 text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-lg transition font-medium text-sm sm:text-base"
            >
              <i class="bi bi-chevron-left mr-1"></i>
              Quay lại
            </button>
            <button
              @click="nextStep"
              class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-600/30 text-sm sm:text-base"
            >
              <span>Tiếp tục</span>
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
          
          <!-- Single Buttons -->
          <button 
            v-if="currentStep === 1"
            @click="$emit('close')"
            type="button"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-lg transition font-medium text-sm sm:text-base"
          >
            Đóng
          </button>
          
          <button
            v-if="currentStep === 1"
            @click="nextStep"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium shadow-lg shadow-blue-600/30 text-sm sm:text-base"
          >
            <span>Bắt đầu</span>
            <i class="bi bi-chevron-right"></i>
          </button>
          
          <button
            v-if="currentStep === 3"
            @click="saveConfig"
            :disabled="loading || !canSave"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-lg shadow-green-600/30 text-sm sm:text-base"
          >
            <i v-if="loading" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-check-lg"></i>
            <span>{{ loading ? 'Đang lưu...' : 'Hoàn tất' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ConfirmModal from '~/components/ConfirmModal.vue'

const props = defineProps({
  listId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const config = useRuntimeConfig()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const showSecret = ref(false)
const hasConfig = ref(false)
const currentStep = ref(1)
const showDeleteConfirm = ref(false)

const form = ref({
  cloudName: '',
  apiKey: '',
  apiSecret: '',
  folder: ''
})

const canSave = computed(() => {
  return form.value.cloudName && form.value.apiKey && (form.value.apiSecret || hasConfig.value)
})

const nextStep = () => {
  if (currentStep.value === 2 && !canSave.value) {
    toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }
  currentStep.value++
}

const loadConfig = async () => {
  try {
    const response = await $fetch(`${config.public.apiBase}/email-lists/${props.listId}/cloudinary-config`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })

    if (response.success && response.data) {
      form.value.cloudName = response.data.cloudName || ''
      form.value.apiKey = response.data.apiKey || ''
      form.value.folder = response.data.folder || ''
      // Check if config exists by checking if cloudName or apiKey is present
      hasConfig.value = !!(response.data.cloudName || response.data.apiKey)
    }
  } catch (error) {
    console.error('Error loading config:', error)
    hasConfig.value = false
  }
}

const saveConfig = async () => {
  loading.value = true
  try {
    const payload = {
      cloudName: form.value.cloudName,
      apiKey: form.value.apiKey,
      folder: form.value.folder
    }

    if (form.value.apiSecret) {
      payload.apiSecret = form.value.apiSecret
    }

    const response = await $fetch(`${config.public.apiBase}/email-lists/${props.listId}/cloudinary-config`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })

    if (response.success) {
      toast.success(response.message || 'Lưu cấu hình thành công')
      emit('saved')
      emit('close')
    }
  } catch (error) {
    toast.error(error.data?.message || 'Lỗi khi lưu cấu hình')
  } finally {
    loading.value = false
  }
}

const executeDelete = async () => {
  showDeleteConfirm.value = false
  loading.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/email-lists/${props.listId}/cloudinary-config`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })

    if (response.success) {
      toast.success(response.message || 'Xóa cấu hình thành công')
      emit('saved')
      emit('close')
    }
  } catch (error) {
    toast.error(error.data?.message || 'Lỗi khi xóa cấu hình')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>
