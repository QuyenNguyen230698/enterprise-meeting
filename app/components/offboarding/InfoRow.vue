<template>
  <div class="p-3" :class="[borderTop ? 'border-t border-gray-200' : '', borderRight ? 'border-r border-gray-200' : '']">
    <div class="text-[10px] text-gray-400 font-medium mb-0.5">{{ label }}</div>
    <div class="text-sm font-semibold text-gray-800">{{ value || '—' }}</div>
  </div>
</template>

<script setup>
defineProps({
  label:       { type: String,  required: true },
  value:       { type: String,  default: '' },
  borderTop:   { type: Boolean, default: false },
  borderRight: { type: Boolean, default: false },
})
</script>
