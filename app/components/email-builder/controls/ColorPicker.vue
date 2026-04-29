<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    
    <!-- Color Input Row -->
    <div class="flex items-center gap-2">
      <input
        :value="modelValue || defaultColor"
        @input="$emit('update:modelValue', $event.target.value)"
        type="color"
        class="w-10 h-8 border border-gray-300 rounded cursor-pointer"
      />
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        class="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        :placeholder="placeholder || '#000000'"
      />
    </div>
    
    <!-- Color Presets -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="color in presetColors"
        :key="color.value"
        @click="$emit('update:modelValue', color.value)"
        :title="color.name"
        class="w-6 h-6 rounded border-2 transition-all hover:scale-110"
        :class="modelValue === color.value ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'"
        :style="{ backgroundColor: color.value }"
      />
      <!-- Transparent option -->
      <button
        v-if="allowTransparent"
        @click="$emit('update:modelValue', 'transparent')"
        title="Trong suốt"
        class="w-6 h-6 rounded border-2 transition-all hover:scale-110 flex items-center justify-center text-xs"
        :class="modelValue === 'transparent' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'"
        style="background: repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 8px 8px"
      >
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '#000000'
  },
  defaultColor: {
    type: String,
    default: '#000000'
  },
  allowTransparent: {
    type: Boolean,
    default: false
  },
  colorType: {
    type: String,
    default: 'all' // 'all', 'text', 'background', 'brand'
  }
})

defineEmits(['update:modelValue'])

// Common color presets
const allColors = [
  // Grayscale
  { name: 'Đen', value: '#000000' },
  { name: 'Xám đậm', value: '#374151' },
  { name: 'Xám', value: '#6b7280' },
  { name: 'Xám nhạt', value: '#9ca3af' },
  { name: 'Xám rất nhạt', value: '#e5e7eb' },
  { name: 'Trắng', value: '#ffffff' },
  
  // Primary colors
  { name: 'Đỏ', value: '#ef4444' },
  { name: 'Cam', value: '#f97316' },
  { name: 'Vàng', value: '#eab308' },
  { name: 'Xanh lá', value: '#22c55e' },
  { name: 'Xanh dương', value: '#3b82f6' },
  { name: 'Tím', value: '#8b5cf6' },
  { name: 'Hồng', value: '#ec4899' },
  
  // Brand colors
  { name: 'Facebook', value: '#1877f2' },
  { name: 'Twitter', value: '#1da1f2' },
  { name: 'LinkedIn', value: '#0a66c2' },
  { name: 'YouTube', value: '#ff0000' },
]

const textColors = [
  { name: 'Đen', value: '#000000' },
  { name: 'Xám đậm', value: '#1f2937' },
  { name: 'Xám', value: '#374151' },
  { name: 'Xám nhạt', value: '#6b7280' },
  { name: 'Trắng', value: '#ffffff' },
  { name: 'Đỏ', value: '#dc2626' },
  { name: 'Xanh dương', value: '#2563eb' },
  { name: 'Xanh lá', value: '#16a34a' },
  { name: 'Cam', value: '#ea580c' },
  { name: 'Tím', value: '#7c3aed' },
]

const backgroundColors = [
  { name: 'Trắng', value: '#ffffff' },
  { name: 'Xám rất nhạt', value: '#f9fafb' },
  { name: 'Xám nhạt', value: '#f3f4f6' },
  { name: 'Xám', value: '#e5e7eb' },
  { name: 'Xanh nhạt', value: '#eff6ff' },
  { name: 'Xanh lá nhạt', value: '#f0fdf4' },
  { name: 'Vàng nhạt', value: '#fefce8' },
  { name: 'Hồng nhạt', value: '#fdf2f8' },
  { name: 'Tím nhạt', value: '#faf5ff' },
  { name: 'Đen', value: '#000000' },
  { name: 'Xanh dương', value: '#3b82f6' },
  { name: 'Đỏ', value: '#ef4444' },
]

const brandColors = [
  { name: 'Xanh dương', value: '#3b82f6' },
  { name: 'Xanh đậm', value: '#1d4ed8' },
  { name: 'Xanh lá', value: '#22c55e' },
  { name: 'Đỏ', value: '#ef4444' },
  { name: 'Cam', value: '#f97316' },
  { name: 'Tím', value: '#8b5cf6' },
  { name: 'Hồng', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
]

const presetColors = computed(() => {
  switch (props.colorType) {
    case 'text':
      return textColors
    case 'background':
      return backgroundColors
    case 'brand':
      return brandColors
    default:
      return allColors
  }
})
</script>
