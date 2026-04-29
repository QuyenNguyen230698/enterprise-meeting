<template>
  <div class="prop-field">
    <label v-if="label" class="prop-label">{{ label }}</label>
    <div class="flex gap-1">
      <button
        v-for="align in alignments"
        :key="align"
        @click="$emit('update:modelValue', align)"
        :class="[
          'flex-1 p-2 rounded-xl text-xs transition-all',
          (modelValue || defaultAlign) === align
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        <i :class="getIconClass(align)"></i>
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
    default: 'Căn chỉnh'
  },
  alignments: {
    type: Array,
    default: () => ['left', 'center', 'right']
  },
  defaultAlign: {
    type: String,
    default: 'center'
  }
})

defineEmits(['update:modelValue'])

const getIconClass = (align) => {
  const iconMap = {
    left: 'bi bi-text-left',
    center: 'bi bi-text-center',
    right: 'bi bi-text-right',
    justify: 'bi bi-text-justify'
  }
  return iconMap[align] || 'bi bi-text-left'
}
</script>
