<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500"
    style="z-index: 999999 !important"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Add Element</h3>
          <p class="text-xs text-gray-600 mt-1">Choose an element to add</p>
        </div>
        <button
          @click="close"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="element in elements"
            :key="element.type"
            @click="selectElement(element.type)"
            class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
          >
            <i :class="element.icon" class="text-2xl text-blue-600 mb-2 block"></i>
            <div class="text-sm font-semibold text-gray-900">{{ element.name }}</div>
            <div class="text-xs text-gray-500">{{ element.description }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  targetInfo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'add-element'])

// Available elements for nested structures
const elements = [
  { type: 'heading1', name: 'Heading 1', description: 'Large heading', icon: 'bi bi-type-h1' },
  { type: 'heading2', name: 'Heading 2', description: 'Medium heading', icon: 'bi bi-type-h2' },
  { type: 'heading3', name: 'Heading 3', description: 'Small heading', icon: 'bi bi-type-h3' },
  { type: 'text', name: 'Text', description: 'Paragraph text', icon: 'bi bi-type' },
  { type: 'button', name: 'Button', description: 'Call to action', icon: 'bi bi-mouse2' },
  { type: 'image', name: 'Image', description: 'Add image', icon: 'bi bi-image' },
  { type: 'video', name: 'Video', description: 'Video player', icon: 'bi bi-play-circle' },
  { type: 'divider', name: 'Divider', description: 'Horizontal line', icon: 'bi bi-hr' },
  { type: 'spacer', name: 'Spacer', description: 'Vertical space', icon: 'bi bi-arrows-expand' },
  { type: 'quote', name: 'Quote', description: 'Blockquote', icon: 'bi bi-quote' },
  { type: 'link', name: 'Link', description: 'Hyperlink', icon: 'bi bi-link-45deg' }
]

const close = () => {
  emit('update:modelValue', false)
}

const selectElement = (elementType) => {
  emit('add-element', elementType)
  close()
}
</script>
