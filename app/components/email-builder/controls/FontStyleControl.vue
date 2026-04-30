<template>
  <div class="prop-field">
    <label v-if="label" class="prop-label">{{ label }}</label>
    <div class="flex gap-1">
      <button
        @click="$emit('update:modelValue', 'normal')"
        :class="[
          'flex-1 p-2 rounded-lg text-xs transition-all',
          (modelValue || defaultStyle) === 'normal'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
        ]"
      >
        <i class="bi bi-type"></i>
      </button>
      <button
        @click="$emit('update:modelValue', 'italic')"
        :class="[
          'flex-1 p-2 rounded-lg text-xs transition-all italic',
          modelValue === 'italic'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
        ]"
      >
        <i class="bi bi-type-italic"></i>
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
    default: 'Kiểu chữ'
  },
  defaultStyle: {
    type: String,
    default: 'normal'
  }
})

defineEmits(['update:modelValue'])
</script>
