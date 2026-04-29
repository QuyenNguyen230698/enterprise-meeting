<template>
  <div class="prop-field">
    <label v-if="label" class="prop-label">{{ label }}</label>
    <div class="flex gap-1 flex-wrap">
      <button
        v-for="size in sizes"
        :key="size"
        @click="$emit('update:modelValue', size)"
        :class="[
          'px-2 py-1 rounded-lg text-xs transition-all',
          (modelValue || defaultSize) === size
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
        ]"
      >
        {{ formatSize(size) }}
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
    default: 'Cỡ chữ'
  },
  sizes: {
    type: Array,
    default: () => ['14px', '16px', '18px', '20px', '24px', '28px']
  },
  defaultSize: {
    type: String,
    default: '16px'
  }
})

defineEmits(['update:modelValue'])

const formatSize = (size) => {
  return size.replace('px', '')
}
</script>
