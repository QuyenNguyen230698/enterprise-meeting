<template>
  <div class="bg-white border-l border-gray-300 w-full flex flex-col h-full">
    <!-- Header -->
    <div class="p-3 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center gap-2">
        <i class="bi bi-diagram-3 text-blue-600"></i>
        <h3 class="font-semibold text-gray-900 text-sm">Cấu Trúc</h3>
      </div>
    </div>

    <!-- Element Tree -->
    <div class="flex-1 overflow-y-auto p-3">
      <div v-if="elements.length === 0" class="text-center py-8 text-gray-400">
        <i class="bi bi-diagram-3 text-2xl mb-2"></i>
        <p class="text-sm">No elements yet</p>
      </div>

      <div v-else class="space-y-1">
        <ElementMapItem
          v-for="(element, index) in elements"
          :key="element.id"
          :element="element"
          :index="index"
          :level="0"
          :selected-id="selectedElement?.id"
          @select="$emit('select-element', element)"
          @move-up="$emit('move-up', index)"
          @move-down="$emit('move-down', index)"
          @delete="$emit('delete-element', index)"
        />
      </div>
    </div>

    <!-- Stats -->
    <div class="p-3 border-t border-gray-200 bg-gray-50">
      <div class="text-xs text-gray-600 space-y-1">
        <div class="flex justify-between">
          <span>Tổng cộng:</span>
          <span class="font-medium">{{ elements.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ElementMapItem from './ElementMapItem.vue'

const props = defineProps({
  elements: {
    type: Array,
    default: () => []
  },
  selectedElement: {
    type: Object,
    default: null
  }
})

defineEmits(['select-element', 'move-up', 'move-down', 'delete-element'])

const textElementsCount = computed(() => {
  return props.elements.filter(el => 
    ['heading1', 'heading2', 'heading3', 'text', 'button', 'link'].includes(el.type)
  ).length
})

const layoutElementsCount = computed(() => {
  return props.elements.filter(el => 
    ['columns2', 'columns3', 'columns4', 'container', 'divider', 'spacer'].includes(el.type)
  ).length
})
</script>
