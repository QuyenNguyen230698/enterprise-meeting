<template>
  <div ref="docxViewer" class="w-full h-full overflow-auto min-h-96"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { renderAsync } from 'docx-preview'

const docxViewer = ref(null)
const props = defineProps({
  file: {
    type: [File, Blob],
    default: null
  }
})

const renderDocument = async () => {
  if (!props.file || !docxViewer.value) return

  try {
    // Clear previous content
    docxViewer.value.innerHTML = ''
    
    // For actual Word files, use docx-preview
    if (props.file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      await renderAsync(props.file, docxViewer.value, null, {
        className: "docx-preview",
        inWrapper: true,
        ignoreLastRenderedPage: true,
        experimental: false
      })
      return
    }
    
    // Check if it's an HTML blob (converted content)
    if (props.file.type === 'text/html') {
      
      // For HTML blobs, use iframe instead of docx-preview
      const iframe = document.createElement('iframe')
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = 'none'
      iframe.style.borderRadius = '8px'
      
      const url = URL.createObjectURL(props.file)
      iframe.src = url
      
      // Cleanup URL when iframe loads
      iframe.onload = () => {
        URL.revokeObjectURL(url)
      }
      
      docxViewer.value.appendChild(iframe)
      return
    }
    
    // Fallback: try to display as text for unknown types
    try {
      const text = await props.file.text()
      docxViewer.value.innerHTML = `
        <div class="docx-wrapper">
          <div class="docx">
            <pre style="white-space: pre-wrap; font-family: monospace; background: #f5f5f5; padding: 20px; border-radius: 8px;">${text}</pre>
          </div>
        </div>
      `
      return
    } catch (textError) {
      console.error('Error reading file as text:', textError)
    }
    
  } catch (error) {
    console.error('Error rendering Word document:', error)
  }
  
  // Final fallback UI
  docxViewer.value.innerHTML = `
    <div class="flex items-center justify-center h-full text-center">
      <div class="max-w-md">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="bi bi-file-word text-red-500 text-2xl"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Preview Error</h3>
        <p class="text-gray-600 text-sm">Unable to preview this document</p>
        <p class="text-gray-500 text-xs mt-2">File type: ${props.file.type}</p>
        <p class="text-gray-500 text-xs mt-1">Size: ${props.file.size} bytes</p>
      </div>
    </div>
  `
}

onMounted(() => {
  renderDocument()
})

watch(() => props.file, () => {
  renderDocument()
}, { immediate: false })
</script>

<style scoped>
.docx-preview {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* Custom styles for docx-preview */
:deep(.docx-preview .docx) {
  width: 100%;
  height: auto;
  min-height: 600px;
}

:deep(.docx-preview .docx-wrapper) {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 0 auto;
  max-width: 800px;
}
</style>
