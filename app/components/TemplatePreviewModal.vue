<template>
  <div v-if="isVisible">
    <!-- PreviewModal with template data -->
    <PreviewModal
      v-if="showPreview"
      :elements="templateElements"
      :devices="devices"
      :global-settings="templateGlobalSettings"
      @close="closeModal"
    />
    
    <!-- Simple action bar -->
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex gap-2 bg-white/95 backdrop-blur px-6 py-1.5 rounded-full shadow-xl border border-gray-200">
      <button
        @click="editTemplate"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm font-medium"
      >
        <i class="bi bi-pencil text-xs"></i>
        <span>Edit</span>
      </button>
      <button
        @click="closeModal"
        class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition text-sm font-medium"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import PreviewModal from '~/components/email-builder/PreviewModal.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  template: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'edit'])

const showPreview = ref(false)
const templateElements = ref([])
const templateGlobalSettings = ref({
  backgroundColor: '#f3f4f6',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  textColor: '#374151',
  contentWidth: 600
})

// Device presets - Same as editor
const devices = ref([
  { name: 'Desktop', width: 900, icon: 'bi bi-display' },
  { name: 'Tablet', width: 768, icon: 'bi bi-tablet' },
  { name: 'Mobile', width: 375, icon: 'bi bi-phone' }
])

// Watch for modal visibility
watch(() => props.isVisible, async (visible) => {
  if (visible && props.template) {
    await loadPreview()
    showPreview.value = true
  } else {
    showPreview.value = false
  }
}, { immediate: true })

const loadPreview = async () => {
  if (!props.template) return
  
  try {
    const templateData = props.template
    
    // Get jsonData from template
    const contentData = templateData.jsonData
    
    if (contentData) {
      const parsedContent = typeof contentData === 'string' 
        ? JSON.parse(contentData) 
        : contentData
      
      // Set elements and global settings from template
      templateElements.value = parsedContent.elements || []
      templateGlobalSettings.value = parsedContent.globalSettings || {
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        textColor: '#374151',
        contentWidth: 600
      }
    } else {
      templateElements.value = []
    }
    
  } catch (error) {
    console.error('Error loading preview:', error)
    templateElements.value = []
  }
}

const closeModal = () => {
  showPreview.value = false
  emit('close')
}

const editTemplate = () => {
  emit('edit', props.template._id)
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
