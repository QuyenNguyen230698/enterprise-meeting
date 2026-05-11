<template>
  <div class="border-b border-gray-300 px-3 py-3" :style="blockStyle">
    <p class="text-xs font-bold text-gray-700 mb-2">
      <i class="bi bi-balance-scale mr-1 text-purple-600"></i>
      Căn cứ pháp lý / <span class="font-normal italic">Legal Basis</span>
    </p>
    <textarea
      v-if="editable"
      :value="content.text"
      @input="emit('update:content', { ...content, text: $event.target.value })"
      rows="6"
      class="w-full text-xs text-gray-700 leading-relaxed bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 resize-y font-normal"
      :style="{ ...blockStyle, fontSize: blockStyle.fontSize ? blockStyle.fontSize + 'px' : '12px' }"
      placeholder="Nhập căn cứ pháp lý..."
    ></textarea>
    <div
      v-else
      class="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap"
      :style="{ ...blockStyle, fontSize: blockStyle.fontSize ? blockStyle.fontSize + 'px' : '12px' }"
    >{{ content.text }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: { type: Object, default: () => ({ text: '' }) },
  editable: { type: Boolean, default: true },
  blockStyle: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:content'])
</script>
