<template>
  <div class="prop-field">
    <label v-if="label" class="prop-label">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="url"
      class="prop-input"
      :placeholder="placeholder"
    />
    <div
      v-if="modelValue"
      class="mt-1.5 p-2 bg-white border border-slate-200 rounded-lg"
    >
      <img
        :src="modelValue"
        :alt="altText || label"
        :class="[
          'object-contain border border-gray-200 shadow-xl',
          imageClass
        ]"
        :style="{ height: previewHeight }"
        @error="handleImageError"
      />
    </div>
    <p v-if="showError" class="text-xs text-red-500 mt-1">
      <i class="bi bi-exclamation-circle"></i>
      Không thể tải hình ảnh
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Hình ảnh'
  },
  placeholder: {
    type: String,
    default: 'https://example.com/image.jpg'
  },
  altText: {
    type: String,
    default: ''
  },
  previewHeight: {
    type: String,
    default: '2rem' // 8 * 0.25rem = 2rem (h-8)
  },
  imageClass: {
    type: String,
    default: 'h-8'
  }
})

defineEmits(['update:modelValue'])

const showError = ref(false)

const handleImageError = () => {
  showError.value = true
}
</script>
