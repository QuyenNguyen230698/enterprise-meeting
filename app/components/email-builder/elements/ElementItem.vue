<!-- Item.vue -->
<template>
  <div
    class="p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md transition-all duration-300 group"
    @click="$emit('click')"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="flex flex-col items-center text-center">
      <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300">
        <i :class="[element.icon, 'text-xl text-gray-600 group-hover:text-emerald-600']"></i>
      </div>
      <div class="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 mb-1">
        {{ element.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  element: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const onDragStart = (event) => {
  event.dataTransfer.setData('text/plain', props.element.type)
  event.dataTransfer.effectAllowed = 'copy'
}
</script>