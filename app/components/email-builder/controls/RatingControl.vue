<template>
  <div class="prop-field">
    <label v-if="label" class="prop-label">{{ label }}</label>
    <div class="flex gap-1">
      <button
        v-for="rating in ratingOptions"
        :key="rating"
        @click="$emit('update:modelValue', rating)"
        :class="[
          'flex-1 p-2 rounded-lg text-xs transition-all',
          (modelValue || defaultRating) === rating
            ? 'bg-amber-500 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
        ]"
      >
        {{ rating }}{{ starIcon }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  label: {
    type: String,
    default: 'Đánh giá'
  },
  max: {
    type: Number,
    default: 5
  },
  defaultRating: {
    type: Number,
    default: 5
  },
  starIcon: {
    type: String,
    default: '★'
  }
})

defineEmits(['update:modelValue'])

const ratingOptions = computed(() => {
  const options = []
  for (let i = props.max; i >= 1; i--) {
    options.push(i)
  }
  return options
})
</script>
