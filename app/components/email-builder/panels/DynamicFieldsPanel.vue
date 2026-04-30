<template>
  <div class="p-4">
    <!-- Header with Help Button -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-900 flex items-center gap-2">
        <i class="bi bi-braces text-purple-600"></i>
        Trường động
      </h3>
      <div class="flex items-center gap-2">
        <button
          v-if="selectedListIds.length > 0"
          @click="loadFields"
          class="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
          :disabled="loading"
          title="Tải lại"
        >
          <i class="bi bi-arrow-clockwise" :class="{ 'animate-spin': loading }"></i>
        </button>
        <button
          @click="showHelpModal = true"
          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="Hướng dẫn sử dụng"
        >
          <i class="bi bi-info-circle"></i>
        </button>
      </div>
    </div>

    <!-- Select Email Lists -->
    <div class="mb-4">
      <label class="block text-xs font-medium text-gray-700 mb-2">Chọn Danh Sách Khách Hàng</label>
      <div class="space-y-2 max-h-32 overflow-auto border rounded-lg p-2 bg-gray-50">
        <label 
          v-for="list in emailLists" 
          :key="list._id" 
          class="flex items-center gap-2 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
        >
          <input 
            type="checkbox" 
            :value="list._id" 
            v-model="selectedListIds"
            @change="loadFields"
            class="rounded text-purple-600 focus:ring-purple-500"
          />
          <span class="text-sm text-gray-700 flex-1">{{ list.name }}</span>
          <span class="text-xs text-gray-400">{{ list.stats?.activeSubscribers || 0 }}</span>
        </label>
        <p v-if="!emailLists.length" class="text-xs text-gray-400 text-center py-2">
          Chưa có Danh Sách Khách Hàng
        </p>
      </div>
    </div>

    <!-- Available Fields -->
    <div v-if="fields.length > 0" class="space-y-3">
      <p class="text-xs text-gray-500">Click để copy placeholder:</p>
      
      <!-- Standard Fields -->
      <div>
        <p class="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
          <i class="bi bi-bookmark text-blue-500"></i>
          Trường cơ bản
        </p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="field in standardFields"
            :key="field.fieldKey"
            @click="insertField(field)"
            class="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
          >
            <i class="bi bi-clipboard text-blue-400"></i>
            {{ field.fieldName }}
          </button>
        </div>
      </div>

      <!-- Custom Fields -->
      <div v-if="customFields.length > 0">
        <p class="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
          <i class="bi bi-tag text-purple-500"></i>
          Trường tùy chỉnh
        </p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="field in customFields"
            :key="field.fieldKey"
            @click="insertField(field)"
            class="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
          >
            <i class="bi bi-clipboard text-purple-400"></i>
            {{ field.fieldName }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && selectedListIds.length === 0" class="text-center py-8">
      <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <i class="bi bi-braces text-xl text-purple-500"></i>
      </div>
      <p class="text-sm text-gray-600 mb-1">Chọn Danh Sách Khách Hàng</p>
      <p class="text-xs text-gray-400">để xem các trường có sẵn</p>
    </div>

    <!-- No Fields Found -->
    <div v-else-if="!loading && fields.length === 0" class="text-center py-6">
      <i class="bi bi-inbox text-2xl text-gray-300 block mb-2"></i>
      <p class="text-xs text-gray-500">Không tìm thấy trường nào</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-6">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
      <p class="text-xs text-gray-500">Đang tải...</p>
    </div>

    <!-- Help Modal -->
    <div style="z-index:999999 !important" v-if="showHelpModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="showHelpModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col" @click.stop>
        <div class="flex items-center justify-between p-4 border-b shrink-0">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i class="bi bi-info-circle text-blue-600"></i>
            Hướng dẫn sử dụng
          </h3>
          <button @click="showHelpModal = false" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div class="p-5 space-y-4 overflow-y-auto flex-1">
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <span class="text-blue-600 font-bold">1</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">Chọn Danh Sách Khách Hàng</p>
              <p class="text-sm text-gray-500">Tick chọn các Danh Sách Khách Hàng mà bạn muốn sử dụng trường động.</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <span class="text-blue-600 font-bold">2</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">Click vào trường để copy</p>
              <p class="text-sm text-gray-500">Nhấn vào nút trường (ví dụ: "firstName") để copy placeholder vào clipboard.</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <span class="text-blue-600 font-bold">3</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">Dán vào nội dung email</p>
              <p class="text-sm text-gray-500">Dán placeholder (Ctrl+V) vào bất kỳ element text nào trong email.</p>
            </div>
          </div>
          
          <div class="bg-purple-50 rounded-xl p-4">
            <p class="text-sm font-medium text-purple-800 mb-2">Ví dụ:</p>
            <p class="text-sm text-purple-700">
              "Xin chào <code class="bg-purple-200 px-1 rounded">&#123;&#123;firstName&#125;&#125;</code>,"
            </p>
            <p class="text-xs text-purple-600 mt-2">
              → Khi gửi email sẽ thành: "Xin chào <strong>Nguyễn Văn A</strong>,"
            </p>
          </div>
          
          <div class="bg-yellow-50 rounded-xl p-4">
            <p class="text-sm text-yellow-800 flex items-center gap-2">
              <i class="bi bi-lightbulb text-yellow-600 mt-0.5"></i>
              <span><strong>Mẹo:</strong> Các trường cơ bản (email, firstName, lastName) luôn có sẵn. Trường tùy chỉnh phụ thuộc vào cấu hình của từng Danh Sách Khách Hàng.</span>
            </p>
          </div>
        </div>
        
        <div class="p-4 border-t bg-gray-50 rounded-b-2xl shrink-0">
          <button 
            @click="showHelpModal = false" 
            class="w-full px-6 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


const props = defineProps({
  initialListIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['insert-field', 'copy-field'])

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase 
const authStore = useAuthStore()
const { success } = useToast()

const emailLists = ref([])
const fields = ref([])
const selectedListIds = ref([])
const loading = ref(false)
const showHelpModal = ref(false)

const standardFields = computed(() => fields.value.filter(f => f.isStandard))
const customFields = computed(() => fields.value.filter(f => !f.isStandard))

const getAuthHeaders = async () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authStore.accessToken}`
  }
}

const fetchEmailLists = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/email-lists?limit=100`, { headers })
    const data = await response.json()
    if (data.success) {
      emailLists.value = data.data
    }
  } catch (error) {
    console.error('Error fetching lists:', error)
  }
}

const loadFields = async () => {
  if (selectedListIds.value.length === 0) {
    fields.value = []
    return
  }

  loading.value = true
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBaseUrl}/v1/email-lists/combined-fields`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ listIds: selectedListIds.value })
    })
    const data = await response.json()
    if (data.success) {
      fields.value = data.data
    }
  } catch (error) {
    console.error('Error loading fields:', error)
  } finally {
    loading.value = false
  }
}

const insertField = async (field) => {
  const placeholder = `{{${field.fieldKey}}}`
  
  // Copy to clipboard
  try {
    await navigator.clipboard.writeText(placeholder)
    success(`Copied ${placeholder} to clipboard`)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = placeholder
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    success(`Copied ${placeholder} to clipboard`)
  }
  
  emit('insert-field', field)
  emit('copy-field', placeholder)
}

onMounted(() => {
  fetchEmailLists()
  if (props.initialListIds.length > 0) {
    selectedListIds.value = props.initialListIds
    loadFields()
  }
})

// Expose methods for parent component
defineExpose({
  loadFields,
  selectedListIds
})
</script>
