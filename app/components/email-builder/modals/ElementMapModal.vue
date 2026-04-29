<template>
  <div
    v-if="modelValue"
    style="z-index: 999999 !important"
    class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[80vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Bản Đồ Cấu Trúc</h3>
        <button
          @click="close"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-hidden">
        <ElementMap
          :elements="elements"
          :selected-element="selectedElement"
          @select-element="handleSelectElement"
          @move-up="handleMoveUp"
          @move-down="handleMoveDown"
          @delete-element="handleDeleteElement"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ElementMap from '~/components/email-builder/ElementMap.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  elements: {
    type: Array,
    default: () => []
  },
  selectedElement: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'update:modelValue',
  'select-element',
  'move-up',
  'move-down',
  'delete-element'
])

const close = () => {
  emit('update:modelValue', false)
}

const handleSelectElement = (element) => {
  emit('select-element', element)
}

const handleMoveUp = (index) => {
  emit('move-up', index)
}

const handleMoveDown = (index) => {
  emit('move-down', index)
}

const handleDeleteElement = (index) => {
  emit('delete-element', index)
}
</script>
