<template>
  <div class="prop-field">
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="prop-checkbox"
      />
      <span class="text-xs font-medium text-slate-700">{{ label }}</span>
    </label>
    <p v-if="description" class="text-xs text-slate-500 ml-6">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.prop-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.prop-checkbox {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 2px solid rgb(203, 213, 225);
  cursor: pointer;
  transition: all 0.2s;
  accent-color: rgb(99, 102, 241);
}

.prop-checkbox:checked {
  background-color: rgb(99, 102, 241);
  border-color: rgb(99, 102, 241);
}

.prop-checkbox:hover {
  border-color: rgb(148, 163, 184);
}

.prop-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style>
