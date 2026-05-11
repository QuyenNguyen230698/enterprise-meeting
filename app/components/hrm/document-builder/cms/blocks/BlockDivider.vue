<template>
  <div class="border-b border-gray-300 px-3 py-1.5 bg-gray-50" :style="blockStyle">
    <input
      v-if="editable"
      :value="content.label"
      @input="emit('update:content', { ...content, label: $event.target.value })"
      class="w-full bg-transparent text-sm font-bold text-gray-700 focus:outline-none border-b border-dashed border-gray-300 focus:border-blue-400"
      :style="{
        fontWeight: blockStyle.fontWeight || 'bold',
        fontStyle: blockStyle.fontStyle || 'normal',
        textAlign: blockStyle.textAlign || 'left',
        fontSize: blockStyle.fontSize ? blockStyle.fontSize + 'px' : '13px',
        color: blockStyle.color || '#374151',
      }"
      placeholder="Nhập tiêu mục (VD: II. Nội dung thỏa thuận)..."
    />
    <div
      v-else-if="content.label"
      class="text-sm font-bold text-gray-700"
      :style="{
        fontWeight: blockStyle.fontWeight || 'bold',
        fontStyle: blockStyle.fontStyle || 'normal',
        textAlign: blockStyle.textAlign || 'left',
        fontSize: blockStyle.fontSize ? blockStyle.fontSize + 'px' : '13px',
        color: blockStyle.color || '#374151',
      }"
    >{{ content.label }}</div>
    <div v-else class="h-px bg-gray-300 my-1"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: { type: Object, default: () => ({ label: '' }) },
  editable: { type: Boolean, default: true },
  blockStyle: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:content'])
</script>
