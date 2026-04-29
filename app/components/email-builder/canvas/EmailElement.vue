<template>
  <div 
    class="relative group mb-2"
    @click.stop="$emit('select', element)"
    :class="{ 'ring-2 ring-blue-500 ring-offset-2': selectedElement?.id === element.id }"
  >
    <!-- Element Controls -->
    <div 
      v-if="selectedElement?.id === element.id"
      class="absolute -top-10 left-0 flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-xs z-20 shadow-lg"
    >
      <i :class="getElementIcon(element.type)" class="mr-1"></i>
      <span class="font-medium">{{ getElementName(element.type) }}</span>
      <div class="ml-2 flex items-center gap-1">
        <button 
          @click.stop="$emit('move-up', index)" 
          :disabled="index === 0" 
          class="p-1 hover:bg-blue-700 rounded disabled:opacity-50"
          title="Move Up"
        >
          <i class="bi bi-arrow-up"></i>
        </button>
        <button 
          @click.stop="$emit('move-down', index)" 
          class="p-1 hover:bg-blue-700 rounded"
          title="Move Down"
        >
          <i class="bi bi-arrow-down"></i>
        </button>
        <button 
          @click.stop="$emit('delete', index)" 
          class="p-1 hover:bg-red-600 rounded"
          title="Delete"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Column Layout -->
    <div v-if="element.type.startsWith('columns')" class="w-full" :style="element.style">
      <div class="flex gap-2 w-full">
        <div 
          v-for="i in getColumnCount(element.type)" 
          :key="i"
          class="flex-1 min-h-32 border-2 border-dashed border-gray-300 rounded-lg p-3 transition-colors hover:border-blue-400"
          @drop="(e) => handleColumnDrop(e, i - 1)"
          @dragover.prevent
          @dragenter.prevent
        >
          <!-- Column Header -->
          <div class="text-xs text-gray-500 mb-2 font-medium">Column {{ i }}</div>
          
          <!-- Column Elements -->
          <div v-if="element.children && element.children[i - 1] && element.children[i - 1].length > 0">
            <EmailElement
              v-for="(childElement, childIndex) in element.children[i - 1]"
              :key="childElement.id"
              :element="childElement"
              :index="childIndex"
              :selected-element="selectedElement"
              :parent-id="element.id"
              :column-index="i - 1"
              @select="$emit('select', childElement)"
              @move-up="(idx) => moveChildUp(i - 1, idx)"
              @move-down="(idx) => moveChildDown(i - 1, idx)"
              @delete="(idx) => deleteChild(i - 1, idx)"
            />
          </div>
          
          <!-- Column Empty State -->
          <div v-else class="text-center py-6 text-gray-400">
            <i class="bi bi-plus text-2xl mb-2"></i>
            <p class="text-xs">Drop elements here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Social Element -->
    <div v-else-if="element.type.startsWith('social-')" class="inline-flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" :style="element.style">
      <i :class="getSocialIcon(element.type)" class="text-xl"></i>
      <span>{{ element.props.children }}</span>
    </div>

    <!-- Regular Elements -->
    <component 
      v-else
      :is="getElementComponent(element.type)"
      v-bind="getElementProps(element)"
      :style="element.style"
      class="cursor-pointer hover:opacity-90 transition-opacity"
    >
      {{ element.props.children }}
    </component>
  </div>
</template>

<script setup>
import { EHeading, EText, EButton, EImg, EHr } from 'vue-email'

const props = defineProps({
  element: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  selectedElement: {
    type: Object,
    default: null
  },
  parentId: {
    type: [String, Number],
    default: null
  },
  columnIndex: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['select', 'move-up', 'move-down', 'delete', 'drop-in-column'])

// Get column count from type
const getColumnCount = (type) => {
  const counts = {
    columns2: 2,
    columns3: 3,
    columns4: 4
  }
  return counts[type] || 1
}

// Get element component
const getElementComponent = (type) => {
  const components = {
    heading1: EHeading,
    heading2: EHeading,
    heading3: EHeading,
    text: EText,
    button: EButton,
    image: EImg,
    divider: EHr,
    link: 'a',
    spacer: 'div'
  }
  return components[type] || EText
}

// Get element props
const getElementProps = (element) => {
  const props = { ...element.props }
  
  if (element.type.startsWith('heading')) {
    props.as = element.type.replace('heading', 'h')
  }
  
  if (element.type === 'button') {
    props.href = 'javascript:void(0)'
  }
  
  return props
}

// Get element icon
const getElementIcon = (type) => {
  const icons = {
    heading1: 'bi bi-type-h1',
    heading2: 'bi bi-type-h2',
    heading3: 'bi bi-type-h3',
    text: 'bi bi-type',
    button: 'bi bi-mouse2',
    image: 'bi bi-image',
    link: 'bi bi-link-45deg',
    divider: 'bi bi-hr',
    spacer: 'bi bi-arrows-expand',
    columns2: 'bi bi-columns',
    columns3: 'bi bi-layout-three-columns',
    columns4: 'bi bi-grid-3x2'
  }
  return icons[type] || 'bi bi-square'
}

// Get element name
const getElementName = (type) => {
  const names = {
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    text: 'Text',
    button: 'Button',
    image: 'Image',
    link: 'Link',
    divider: 'Divider',
    spacer: 'Spacer',
    columns2: '2 Columns',
    columns3: '3 Columns',
    columns4: '4 Columns'
  }
  return names[type] || type
}

// Get social icon
const getSocialIcon = (type) => {
  const icons = {
    'social-facebook': 'bi bi-facebook',
    'social-twitter': 'bi bi-twitter',
    'social-instagram': 'bi bi-instagram',
    'social-linkedin': 'bi bi-linkedin',
    'social-youtube': 'bi bi-youtube',
    'social-tiktok': 'bi bi-tiktok'
  }
  return icons[type] || 'bi bi-link'
}

// Handle column drop
const handleColumnDrop = (event, columnIndex) => {
  event.preventDefault()
  event.stopPropagation()
  
  const elementType = event.dataTransfer.getData('text/plain')
  if (elementType) {
    emit('drop-in-column', {
      parentId: props.element.id,
      columnIndex,
      elementType
    })
  }
}

// Move child element up
const moveChildUp = (columnIndex, childIndex) => {
  // Implementation will be handled by parent
}

// Move child element down  
const moveChildDown = (columnIndex, childIndex) => {
  // Implementation will be handled by parent
}

// Delete child element
const deleteChild = (columnIndex, childIndex) => {
  // Implementation will be handled by parent
}
</script>
