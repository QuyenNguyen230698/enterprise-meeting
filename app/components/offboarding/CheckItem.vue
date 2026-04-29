<template>
  <div class="flex items-center gap-2 text-xs">
    <i class="text-base shrink-0" :class="ok ? 'bi bi-check-circle-fill text-green-500' : 'bi bi-circle text-gray-300'"></i>
    <span :class="ok ? 'text-green-700 font-medium' : 'text-gray-400'">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  ok:    { type: Boolean, required: true },
  label: { type: String,  required: true },
})
</script>
