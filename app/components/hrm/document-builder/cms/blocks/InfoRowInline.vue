<template>
  <div class="flex gap-1 items-start text-xs">
    <span class="text-gray-500 font-medium shrink-0 w-24">
      {{ label }}
      <span v-if="labelEn" class="italic font-normal text-[10px] text-gray-400"> / {{ labelEn }}</span>:
    </span>
    <span
      v-if="placeholder"
      class="text-blue-400 italic font-mono text-[10px] truncate"
    >{{ '{{' + (value?.replace(/[{}]/g, '') || '') + '}}' }}</span>
    <span v-else class="text-gray-800 font-semibold truncate">{{ value || '—' }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  labelEn: String,
  value: String,
  placeholder: { type: Boolean, default: false },
})
</script>
