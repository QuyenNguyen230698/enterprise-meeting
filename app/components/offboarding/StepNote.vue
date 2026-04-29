<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
    rows="3"
    class="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:border-blue-400 focus:outline-none resize-none"
  />
</template>

<script setup>
defineProps({
  modelValue:  { type: String, default: '' },
  placeholder: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>
