<template>
  <div class="space-y-4">
    <div
      v-for="colorConfig in colors"
      :key="colorConfig.prop"
      class="space-y-2"
    >
      <label class="block text-sm font-medium text-gray-700">{{ colorConfig.label }}</label>
      
      <!-- Color Input Row -->
      <div class="flex items-center gap-2">
        <input
          :value="getColorValue(colorConfig)"
          @input="updateColor(colorConfig.prop, $event.target.value)"
          type="color"
          class="w-10 h-8 border border-gray-300 rounded cursor-pointer"
        />
        <input
          :value="getColorValue(colorConfig)"
          @input="updateColor(colorConfig.prop, $event.target.value)"
          type="text"
          class="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          :placeholder="colorConfig.default"
        />
      </div>
      
      <!-- Color Presets -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="color in getPresetColors()"
          :key="color.value"
          @click="updateColor(colorConfig.prop, color.value)"
          :title="color.name"
          class="w-6 h-6 rounded border-2 transition-all hover:scale-110"
          :class="getColorValue(colorConfig) === color.value ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'"
          :style="{ backgroundColor: color.value }"
        />
        <!-- Transparent option -->
        <button
          @click="updateColor(colorConfig.prop, 'transparent')"
          title="Trong suốt"
          class="w-6 h-6 rounded border-2 transition-all hover:scale-110 flex items-center justify-center text-xs"
          :class="getColorValue(colorConfig) === 'transparent' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'"
          style="background: repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 8px 8px"
        >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  colors: {
    type: Array,
    required: true,
    // Format: [{ label: 'Nền', prop: 'bgColor', default: '#ffffff' }]
  },
  elementProps: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

const getColorValue = (colorConfig) => {
  return props.elementProps[colorConfig.prop] || colorConfig.default
}

const updateColor = (prop, value) => {
  props.elementProps[prop] = value
  emit('update')
}

// Common color presets (same as ColorPicker)
const getPresetColors = () => [
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
</script>

<style scoped>
/* No custom CSS needed - using Tailwind utility classes */
</style>
