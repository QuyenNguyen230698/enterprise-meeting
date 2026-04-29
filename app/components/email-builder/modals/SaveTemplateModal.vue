<template>
  <div
    v-if="modelValue"
    style="z-index: 999999!important"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ currentTemplateId ? 'Cập nhật' : 'Lưu Thiết Kế' }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            {{ currentTemplateId ? 'Cập nhật mẫu email của bạn' : 'Lưu mẫu email của bạn' }}
          </p>
        </div>
        <button
          @click="close"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tên Thiết Kế *</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My Email Template"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả *</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            :class="validationErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
            placeholder="Brief description of your template..."
          ></textarea>
          <p v-if="validationErrors.description" class="text-red-500 text-xs mt-1">
            <i class="bi bi-exclamation-circle mr-1"></i>{{ validationErrors.description }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
          <select
            v-model="form.category"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            :class="validationErrors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          >
            <option value="">Chọn Danh Mục</option>
            <option value="newsletter">Bản Tin</option>
            <option value="promotional">Khuyến mại</option>
            <option value="announcement">Thông báo</option>
            <option value="other">Khác</option>
          </select>
          <p v-if="validationErrors.category" class="text-red-500 text-xs mt-1">
            <i class="bi bi-exclamation-circle mr-1"></i>{{ validationErrors.category }}
          </p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
        <button
          @click="close"
          class="px-6 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Đóng
        </button>
        <button
          @click="handleSave"
          :disabled="!form.name || isSaving"
          class="px-6 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2"
          :class="[
            !form.name || isSaving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          ]"
        >
          <i class="bi bi-cloud-upload"></i>
          <span>{{ isSaving ? 'Đang lưu...' : (currentTemplateId ? 'Cập nhật' : 'Lưu') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentTemplateId: {
    type: String,
    default: null
  },
  initialForm: {
    type: Object,
    default: () => ({ name: '', description: '', category: '' })
  },
  isSaving: {
    type: Boolean,
    default: false
  },
  validationErrors: {
    type: Object,
    default: () => ({ category: '', description: '' })
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

// Local form state synced with initialForm
const form = ref({ ...props.initialForm })

// Watch for external changes to initialForm
watch(() => props.initialForm, (newVal) => {
  form.value = { ...newVal }
}, { deep: true })

// Sync local form changes back to parent
watch(form, (newVal) => {
  emit('save', { ...newVal, action: 'update-form' })
}, { deep: true })

const close = () => {
  emit('update:modelValue', false)
}

const handleSave = () => {
  emit('save', { ...form.value, action: 'save' })
}
</script>
