<template>
  <div 
    class="relative group mb-2"
    @click.stop="$emit('select', element)"
    :class="{ 'ring-2 ring-blue-500 ring-offset-2': selectedElement?.id === element.id }"
  >
    <!-- Element Controls -->
    <div 
      v-if="selectedElement?.id === element.id"
      class="absolute -top-8 left-0 flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs z-20 shadow-lg"
    >
      <i :class="getElementIcon(element.type)" class="mr-1"></i>
      <span class="font-medium">{{ getElementName(element.type) }}</span>
      <div class="ml-2 flex items-center gap-1">
        <button @click.stop="$emit('move-up', index)" :disabled="index === 0" class="p-1 hover:bg-blue-700 rounded disabled:opacity-50">
          <i class="bi bi-arrow-up"></i>
        </button>
        <button @click.stop="$emit('move-down', index)" class="p-1 hover:bg-blue-700 rounded">
          <i class="bi bi-arrow-down"></i>
        </button>
        <button @click.stop="$emit('delete', index)" class="p-1 hover:bg-red-600 rounded">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Column Layout Elements -->
    <div v-if="isColumnElement" class="w-full border border-gray-200 rounded-lg p-3" :style="element.style">
      <div class="text-xs text-gray-500 mb-2 font-medium">{{ getElementName(element.type) }}</div>
      <div class="flex gap-2">
        <div 
          v-for="i in getColumnCount(element.type)" 
          :key="i"
          class="flex-1 min-h-32 border-2 border-dashed border-gray-300 rounded-lg p-2 transition-colors hover:border-blue-400"
          @drop="(e) => handleColumnDrop(e, i - 1)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div class="text-xs text-gray-400 mb-2">Column {{ i }}</div>
          
          <!-- Column Elements -->
          <div v-if="element.children && element.children[i - 1] && element.children[i - 1].length > 0" class="space-y-1">
            <CanvasElement
              v-for="(childElement, childIndex) in element.children[i - 1]"
              :key="childElement.id"
              :element="childElement"
              :index="childIndex"
              :selected-element="selectedElement"
              :global-settings="globalSettings"
              @select="$emit('select', childElement)"
              @update="(id, updates) => updateChildElement(i - 1, id, updates)"
              @move-up="(idx) => moveChildUp(i - 1, idx)"
              @move-down="(idx) => moveChildDown(i - 1, idx)"
              @delete="(idx) => deleteChild(i - 1, idx)"
            />
          </div>
          
          <!-- Column Empty State -->
          <div v-else class="text-center py-4 text-gray-400">
            <i class="bi bi-plus text-lg mb-1"></i>
            <p class="text-xs">Drop here</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Element -->
    <div v-else-if="element.type === 'section'" class="w-full border border-gray-200 rounded-lg p-4 bg-gray-50" :style="element.style">
      <div class="text-xs text-gray-500 mb-3 font-medium">Section</div>
      <div 
        class="min-h-24 border-2 border-dashed border-gray-300 rounded-lg p-3"
        @drop="handleSectionDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <div v-if="element.children && element.children.length > 0" class="space-y-2">
          <CanvasElement
            v-for="(childElement, childIndex) in element.children"
            :key="childElement.id"
            :element="childElement"
            :index="childIndex"
            :selected-element="selectedElement"
            :global-settings="globalSettings"
            @select="$emit('select', childElement)"
            @update="(id, updates) => updateSectionChild(id, updates)"
            @move-up="(idx) => moveSectionChildUp(idx)"
            @move-down="(idx) => moveSectionChildDown(idx)"
            @delete="(idx) => deleteSectionChild(idx)"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <i class="bi bi-plus text-2xl mb-2"></i>
          <p class="text-sm">Drop elements here</p>
        </div>
      </div>
    </div>

    <!-- Row Element -->
    <div v-else-if="element.type === 'row'" class="w-full border border-gray-200 rounded-lg p-3 bg-blue-50" :style="element.style">
      <div class="text-xs text-gray-500 mb-2 font-medium">Row</div>
      <div 
        class="min-h-20 border-2 border-dashed border-blue-300 rounded-lg p-2"
        @drop="handleRowDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <div v-if="element.children && element.children.length > 0" class="flex gap-2 flex-wrap">
          <CanvasElement
            v-for="(childElement, childIndex) in element.children"
            :key="childElement.id"
            :element="childElement"
            :index="childIndex"
            :selected-element="selectedElement"
            :global-settings="globalSettings"
            class="shrink-0"
            @select="$emit('select', childElement)"
            @update="(id, updates) => updateRowChild(id, updates)"
            @move-up="(idx) => moveRowChildUp(idx)"
            @move-down="(idx) => moveRowChildDown(idx)"
            @delete="(idx) => deleteRowChild(idx)"
          />
        </div>
        <div v-else class="text-center py-6 text-gray-400">
          <i class="bi bi-plus text-xl mb-1"></i>
          <p class="text-xs">Drop elements here</p>
        </div>
      </div>
    </div>

    <!-- Social Elements -->
    <div v-else-if="element.type.startsWith('social-')" class="inline-flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" :style="element.style">
      <i :class="getSocialIcon(element.type)" class="text-xl" :style="{ color: element.style.color }"></i>
      <span>{{ element.props.children }}</span>
    </div>

    <!-- Custom Elements -->
    <div v-else-if="isCustomElement" class="border border-gray-200 rounded-lg p-4" :style="element.style">
      <div class="flex items-center gap-2 mb-2">
        <i :class="getElementIcon(element.type)" class="text-blue-600"></i>
        <span class="text-sm font-medium text-gray-700">{{ getElementName(element.type) }}</span>
      </div>
      <div class="text-gray-600">
        <component 
          :is="getCustomComponent(element.type)"
          v-bind="element.props"
          :style="element.style"
        />
      </div>
    </div>

    <!-- Regular Vue Email Elements -->
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
import { computed } from 'vue'
import { EHeading, EText, EButton, EImg, EHr, EHtml, ESection, ERow, EContainer } from 'vue-email'

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
  globalSettings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['select', 'update', 'move-up', 'move-down', 'delete', 'drop-in-column'])

// Computed properties
const isColumnElement = computed(() => {
  return ['columns2', 'columns3', 'columns4'].includes(props.element.type)
})

const isCustomElement = computed(() => {
  return ['cta-block', 'testimonial', 'product-card', 'footer', 'header'].includes(props.element.type)
})

// Get column count
const getColumnCount = (type) => {
  const counts = { columns2: 2, columns3: 3, columns4: 4 }
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
    html: EHtml,
    section: ESection,
    row: ERow,
    container: EContainer,
    link: 'a',
    spacer: 'div'
  }
  return components[type] || EText
}

// Get custom component
const getCustomComponent = (type) => {
  const components = {
    'cta-block': 'div',
    'testimonial': 'blockquote',
    'product-card': 'div',
    'footer': 'footer',
    'header': 'header'
  }
  return components[type] || 'div'
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
  
  if (element.type.startsWith('social-')) {
    props.href = element.props.href || '#'
    props.target = '_blank'
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
    html: 'bi bi-code-slash',
    section: 'bi bi-layout-split',
    row: 'bi bi-distribute-horizontal',
    container: 'bi bi-square',
    columns2: 'bi bi-columns',
    columns3: 'bi bi-layout-three-columns',
    columns4: 'bi bi-grid-3x2',
    'social-facebook': 'bi bi-facebook',
    'social-twitter': 'bi bi-twitter',
    'social-instagram': 'bi bi-instagram',
    'social-linkedin': 'bi bi-linkedin',
    'social-youtube': 'bi bi-youtube',
    'social-tiktok': 'bi bi-tiktok',
    'cta-block': 'bi bi-megaphone',
    'testimonial': 'bi bi-chat-quote',
    'product-card': 'bi bi-card-image',
    'footer': 'bi bi-layout-text-window-reverse',
    'header': 'bi bi-layout-text-window',
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
    html: 'HTML',
    section: 'Section',
    row: 'Row',
    container: 'Container',
    columns2: '2 Columns',
    columns3: '3 Columns',
    columns4: '4 Columns',
    'social-facebook': 'Facebook',
    'social-twitter': 'Twitter',
    'social-instagram': 'Instagram',
    'social-linkedin': 'LinkedIn',
    'social-youtube': 'YouTube',
    'social-tiktok': 'TikTok',
    'cta-block': 'CTA Block',
    'testimonial': 'Testimonial',
    'product-card': 'Product Card',
    'footer': 'Footer',
    'header': 'Header',
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

// Drop handlers
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

const handleSectionDrop = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const elementType = event.dataTransfer.getData('text/plain')
  if (elementType) {
    emit('drop-in-column', {
      parentId: props.element.id,
      columnIndex: 0,
      elementType,
      containerType: 'section'
    })
  }
}

const handleRowDrop = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  const elementType = event.dataTransfer.getData('text/plain')
  if (elementType) {
    emit('drop-in-column', {
      parentId: props.element.id,
      columnIndex: 0,
      elementType,
      containerType: 'row'
    })
  }
}

// Child element handlers (will be implemented by parent)
const updateChildElement = (columnIndex, id, updates) => {
  // Implementation handled by parent
}

const moveChildUp = (columnIndex, childIndex) => {
  // Implementation handled by parent
}

const moveChildDown = (columnIndex, childIndex) => {
  // Implementation handled by parent
}

const deleteChild = (columnIndex, childIndex) => {
  // Implementation handled by parent
}

// Section child handlers
const updateSectionChild = (id, updates) => {
  // Implementation handled by parent
}

const moveSectionChildUp = (childIndex) => {
  // Implementation handled by parent
}

const moveSectionChildDown = (childIndex) => {
  // Implementation handled by parent
}

const deleteSectionChild = (childIndex) => {
  // Implementation handled by parent
}

// Row child handlers
const updateRowChild = (id, updates) => {
  // Implementation handled by parent
}

const moveRowChildUp = (childIndex) => {
  // Implementation handled by parent
}

const moveRowChildDown = (childIndex) => {
  // Implementation handled by parent
}

const deleteRowChild = (childIndex) => {
  // Implementation handled by parent
}
</script>
