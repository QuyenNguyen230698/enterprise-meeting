<template>
  <div class="prop-field">
    <label v-if="label" class="prop-label">{{ label }}</label>
    <div class="flex gap-1">
      <button
        v-for="weight in weights"
        :key="weight.value"
        @click="$emit('update:modelValue', weight.value)"
        :class="[
          'flex-1 p-2 rounded-lg text-xs transition-all',
          (modelValue || defaultWeight) === weight.value
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
        ]"
        :style="{ fontWeight: weight.value }"
      >
        {{ weight.label }}
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
    default: 'Độ đậm'
  },
  weights: {
    type: Array,
    default: () => [
      { value: 'normal', label: 'N' },
      { value: '600', label: 'S' },
      { value: 'bold', label: 'B' }
    ]
  },
  defaultWeight: {
    type: String,
    default: 'normal'
  }
})

defineEmits(['update:modelValue'])
</script>
