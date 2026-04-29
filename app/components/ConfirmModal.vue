<template>
  <div
    style="z-index:9999999 !important"
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="cancel"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100"
      :class="{ 'scale-95 opacity-0': !isVisible }"
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              iconConfig.bgClass
            ]"
          >
            <i :class="[iconConfig.iconClass, 'text-lg']"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="text-sm text-gray-500 mt-1">
              {{ subtitle }}
            </p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <p class="text-gray-700 leading-relaxed">
          {{ message }}
        </p>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
        <button
          @click="cancel"
          class="px-6 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          :disabled="loading"
        >
          {{ cancelText }}
        </button>
        <button
          @click="confirm"
          :class="[
            'px-6 py-1.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
            confirmButtonClass,
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          ]"
          :disabled="loading"
        >
          <div v-if="loading" class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ loadingText }}</span>
          </div>
          <span v-else>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Xác nhận'
  },
  subtitle: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: 'Bạn có chắc chắn muốn thực hiện hành động này?'
  },
  confirmText: {
    type: String,
    default: 'Xác nhận'
  },
  cancelText: {
    type: String,
    default: 'Hủy'
  },
  type: {
    type: String,
    default: 'warning', // warning, danger, info, success
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Đang xử lý...'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:isVisible'])

const iconConfig = computed(() => {
  const configs = {
    warning: {
      iconClass: 'bi bi-exclamation-triangle-fill text-yellow-600',
      bgClass: 'bg-yellow-100'
    },
    danger: {
      iconClass: 'bi bi-x-circle-fill text-red-600',
      bgClass: 'bg-red-100'
    },
    info: {
      iconClass: 'bi bi-info-circle-fill text-blue-600',
      bgClass: 'bg-blue-100'
    },
    success: {
      iconClass: 'bi bi-check-circle-fill text-green-600',
      bgClass: 'bg-green-100'
    }
  }
  return configs[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-600 focus:ring-yellow-500',
    danger: 'bg-red-600 focus:ring-red-500',
    info: 'bg-blue-600 focus:ring-blue-500',
    success: 'bg-green-600 focus:ring-green-500'
  }
  return classes[props.type]
})

const confirm = () => {
  if (props.loading) return
  emit('confirm')
}

const cancel = () => {
  if (props.loading) return
  emit('cancel')
  emit('update:isVisible', false)
}

// Close on Escape key
watch(() => props.isVisible, (visible) => {
  if (visible) {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !props.loading) {
        cancel()
      }
    }
    document.addEventListener('keydown', handleEscape)
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})
</script>

<style scoped>
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
