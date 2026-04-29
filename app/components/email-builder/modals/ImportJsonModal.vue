<template>
  <div style="z-index: 999999  !important" class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="upload" :size="18" class="text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Import JSON Template</h2>
            <p class="text-sm text-gray-500">Paste your JSON template data below</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <Icon name="close" :size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 flex flex-col p-6">
        <!-- JSON Input -->
        <div class="flex-1 flex flex-col">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            JSON Template Data
          </label>
          <textarea
            v-model="jsonInput"
            placeholder='Paste your JSON here, e.g.:
{
  "version": "1.0",
  "elements": [...],
  "globalSettings": {...}
}'
            class="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
            :class="{ 'border-red-300 bg-red-50': hasError }"
          ></textarea>
          
          <!-- Error Message -->
          <div v-if="hasError" class="mt-2 text-sm text-red-600 flex items-center gap-2">
            <Icon name="close" :size="16" class="text-red-500" />
            {{ errorMessage }}
          </div>
          
          <!-- Success Message -->
          <div v-if="isValid && jsonInput.trim()" class="mt-2 text-sm text-green-600 flex items-center gap-2">
            <Icon name="check" :size="16" class="text-green-500" />
            Valid JSON format detected
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <div class="flex items-center gap-4">
            <!-- File Upload -->
            <button
              @click="triggerFileUpload"
              class="px-6 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Icon name="upload" :size="16" />
              Upload File
            </button>
            <input
              ref="fileInput"
              type="file"
              accept=".json"
              @change="handleFileUpload"
              class="hidden"
            />
            
            <!-- Clear -->
            <button
              v-if="jsonInput.trim()"
              @click="clearInput"
              class="px-6 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="$emit('close')"
              class="px-6 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="importJson"
              :disabled="!isValid || !jsonInput.trim() || isImporting"
              :class="[
                'px-6 py-2 text-sm rounded-lg transition-colors flex items-center gap-2',
                isValid && jsonInput.trim() && !isImporting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              <Icon v-if="isImporting" name="upload" :size="16" class="animate-spin" />
              <Icon v-else name="check" :size="16" />
              {{ isImporting ? 'Importing...' : 'Import Template' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Icon from '~/components/ui/Icon.vue'

// State
const jsonInput = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const isImporting = ref(false)
const fileInput = ref(null)

// Validate JSON
const isValid = computed(() => {
  if (!jsonInput.value.trim()) return false
  
  try {
    const parsed = JSON.parse(jsonInput.value)
    return parsed && typeof parsed === 'object'
  } catch (error) {
    return false
  }
})

// Watch for JSON changes to validate
watch(jsonInput, (newValue) => {
  if (!newValue.trim()) {
    hasError.value = false
    errorMessage.value = ''
    return
  }
  
  try {
    const parsed = JSON.parse(newValue)
    if (!parsed || typeof parsed !== 'object') {
      hasError.value = true
      errorMessage.value = 'Invalid JSON format'
    } else if (!parsed.elements || !Array.isArray(parsed.elements)) {
      hasError.value = true
      errorMessage.value = 'JSON must contain an "elements" array'
    } else {
      hasError.value = false
      errorMessage.value = ''
    }
  } catch (error) {
    hasError.value = true
    errorMessage.value = `JSON Parse Error: ${error.message}`
  }
})

// File upload
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/json') {
    const reader = new FileReader()
    reader.onload = (e) => {
      jsonInput.value = e.target.result
    }
    reader.readAsText(file)
  }
}

// Clear input
const clearInput = () => {
  jsonInput.value = ''
  hasError.value = false
  errorMessage.value = ''
}

// Import JSON
const importJson = async () => {
  if (!isValid.value) return
  
  isImporting.value = true
  
  try {
    const parsed = JSON.parse(jsonInput.value)
    
    // Emit import event with parsed data
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate processing
    
    emit('import', parsed)
    emit('close')
  } catch (error) {
    hasError.value = true
    errorMessage.value = `Import failed: ${error.message}`
  } finally {
    isImporting.value = false
  }
}

const emit = defineEmits(['close', 'import'])
</script>
