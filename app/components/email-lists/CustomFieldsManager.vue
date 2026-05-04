<template>
  <div class="space-y-6">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Trường Tùy Chỉnh</h3>
        <p class="text-sm text-gray-500 mt-1">Quản lý các trường thông tin bổ sung cho danh sách này</p>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Thêm Trường</span>
      </button>
    </div>

    <!-- Fields List -->
    <div v-if="customFields.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="field in customFields"
        :key="field._id"
        class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-gray-900 truncate">{{ field.fieldName }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <code class="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">{{ field.fieldKey }}</code>
              <span class="text-xs px-2 py-0.5 rounded-full" :class="getTypeClass(field.fieldType)">
                {{ getTypeLabel(field.fieldType) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1 ml-2">
            <button
              @click="openEditModal(field)"
              class="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
              title="Chỉnh sửa"
            >
              <i class="bi bi-pencil text-sm"></i>
            </button>
            <button
              @click="confirmDelete(field)"
              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Xóa"
            >
              <i class="bi bi-trash text-sm"></i>
            </button>
          </div>
        </div>
        
        <div v-if="field.description" class="text-sm text-gray-600 mb-2">
          {{ field.description }}
        </div>
        
        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span v-if="field.required" class="flex items-center gap-1">
            <i class="bi bi-asterisk text-red-500"></i>
            Bắt buộc
          </span>
          <span v-if="field.defaultValue" class="flex items-center gap-1">
            <i class="bi bi-star"></i>
            Mặc định: {{ field.defaultValue }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
      <i class="bi bi-input-cursor-text text-4xl text-slate-300 mb-3"></i>
      <p class="text-gray-600 mb-4">Chưa có trường tùy chỉnh nào</p>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <i class="bi bi-plus-lg mr-2"></i>
        Tạo trường đầu tiên
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ editingField ? 'Chỉnh Sửa' : 'Thêm' }} Trường Tùy Chỉnh
            </h3>
            <p class="text-sm text-gray-500 mt-1">Cấu hình thông tin cho trường dữ liệu</p>
          </div>
          <button
            @click="closeModal"
            class="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-auto p-6">
          <div class="space-y-5">
            <!-- Field Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên Trường <span class="text-red-500">*</span>
              </label>
              <input
                v-model="fieldForm.fieldName"
                type="text"
                placeholder="Ví dụ: Địa chỉ, Tuổi, Website..."
                class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                :disabled="saving"
              />
            </div>

            <!-- Auto-generated Key Preview -->
            <div v-if="!editingField && generatedKey" class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                  <i class="bi bi-key text-white"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-emerald-700 font-medium mb-1">Key tự động:</p>
                  <code class="text-sm text-emerald-900 font-mono font-semibold">{{ generatedKey }}</code>
                </div>
                <i class="bi bi-check-circle-fill text-emerald-600 text-xl"></i>
              </div>
            </div>

            <!-- Field Key (when editing) -->
            <div v-if="editingField">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Key (Mã trường)
              </label>
              <div class="relative">
                <input
                  v-model="fieldForm.fieldKey"
                  type="text"
                  disabled
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-100 cursor-not-allowed text-slate-600"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <i class="bi bi-lock"></i>
                </div>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                <i class="bi bi-info-circle"></i> Key không thể thay đổi sau khi tạo
              </p>
            </div>

            <!-- Field Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Loại Dữ Liệu <span class="text-red-500">*</span>
              </label>
              <select
                v-model="fieldForm.fieldType"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                :disabled="saving"
              >
                <option value="text">Văn bản (Text)</option>
                <option value="number">Số (Number)</option>
                <option value="email">Email</option>
                <option value="phone">Số điện thoại (Phone)</option>
                <option value="url">Đường dẫn (URL)</option>
                <option value="date">Ngày tháng (Date)</option>
                <option v-if="hasCloudinaryConfig" value="image">Hình ảnh (Image - Cloudinary)</option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mô Tả
              </label>
              <textarea
                v-model="fieldForm.description"
                rows="3"
                placeholder="Mô tả ngắn về trường này..."
                class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                :disabled="saving"
              ></textarea>
            </div>

            <!-- Options Row -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Required -->
              <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <input
                  v-model="fieldForm.required"
                  type="checkbox"
                  id="field-required"
                  class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  :disabled="saving"
                />
                <label for="field-required" class="text-sm font-medium text-gray-700 cursor-pointer">
                  Bắt buộc nhập
                </label>
              </div>

              <!-- Default Value -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Giá Trị Mặc Định
                </label>
                <input
                  v-model="fieldForm.defaultValue"
                  type="text"
                  placeholder="Tùy chọn..."
                  class="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  :disabled="saving"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            @click="closeModal"
            class="px-4 py-2.5 text-gray-700 hover:bg-slate-200 rounded-lg transition-colors font-medium"
            :disabled="saving"
          >
            Hủy
          </button>
          <button
            @click="saveField"
            class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            :disabled="!canSave || saving"
          >
            <i v-if="saving" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-check-lg"></i>
            <span>{{ saving ? 'Đang lưu...' : 'Lưu' }}</span>
          </button>
        </div>
      </div>
    </div>
    <ConfirmModal
      :is-visible="confirmVisible"
      :title="confirmData.title"
      :subtitle="confirmData.subtitle"
      :message="confirmData.message"
      :confirm-text="confirmData.confirmText"
      :cancel-text="confirmData.cancelText"
      :type="confirmData.type"
      :loading="confirmData.loading"
      :loading-text="confirmData.loadingText"
      @confirm="doConfirm"
      @cancel="doCancel"
    />
  </div>
</template>

<script setup>
import ConfirmModal from '~/components/ConfirmModal.vue'

const { isVisible: confirmVisible, confirmData, confirm: doConfirm, cancel: doCancel, confirmDelete: showConfirmDelete } = useConfirm()

const props = defineProps({
  listId: {
    type: String,
    required: true
  },
  customFields: {
    type: Array,
    default: () => []
  },
  hasCloudinaryConfig: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBase 
const { success, error: showError } = useToast()
const authStore = useAuthStore()

const showModal = ref(false)
const editingField = ref(null)
const saving = ref(false)

const fieldForm = ref({
  fieldName: '',
  fieldKey: '',
  fieldType: 'text',
  description: '',
  required: false,
  defaultValue: ''
})

// Auto-generate key from field name
const generatedKey = computed(() => {
  if (!fieldForm.value.fieldName || editingField.value) return ''
  
  let key = fieldForm.value.fieldName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  
  // Check for duplicates
  let finalKey = key
  let counter = 1
  while (props.customFields.some(f => f.fieldKey === finalKey)) {
    finalKey = `${key}_${counter}`
    counter++
  }
  
  return finalKey
})

const canSave = computed(() => {
  return fieldForm.value.fieldName.trim() && fieldForm.value.fieldType
})

const openAddModal = () => {
  editingField.value = null
  fieldForm.value = {
    fieldName: '',
    fieldKey: '',
    fieldType: 'text',
    description: '',
    required: false,
    defaultValue: ''
  }
  showModal.value = true
}

const openEditModal = (field) => {
  editingField.value = field
  fieldForm.value = {
    fieldName: field.fieldName,
    fieldKey: field.fieldKey,
    fieldType: field.fieldType,
    description: field.description || '',
    required: field.required || false,
    defaultValue: field.defaultValue || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingField.value = null
  fieldForm.value = {
    fieldName: '',
    fieldKey: '',
    fieldType: 'text',
    description: '',
    required: false,
    defaultValue: ''
  }
}

const saveField = async () => {
  if (!canSave.value) return
  
  saving.value = true
  
  try {
    const payload = {
      fieldName: fieldForm.value.fieldName.trim(),
      fieldKey: editingField.value ? fieldForm.value.fieldKey : generatedKey.value,
      fieldType: fieldForm.value.fieldType,
      description: fieldForm.value.description.trim(),
      required: fieldForm.value.required,
      defaultValue: fieldForm.value.defaultValue.trim()
    }
    
    const url = editingField.value
      ? `${apiBaseUrl}/email-lists/${props.listId}/custom-fields/${editingField.value._id}`
      : `${apiBaseUrl}/email-lists/${props.listId}/custom-fields`
    
    const method = editingField.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Có lỗi xảy ra')
    }
    
    success(editingField.value ? 'Cập nhật trường thành công!' : 'Thêm trường thành công!')
    closeModal()
    emit('refresh')
  } catch (err) {
    showError(err.message || 'Có lỗi xảy ra')
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (field) => {
  const ok = await showConfirmDelete(`trường "${field.fieldName}"`)
  if (!ok) return
  
  try {
    const response = await fetch(
      `${apiBaseUrl}/email-lists/${props.listId}/custom-fields/${field._id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.accessToken}`
        }
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Có lỗi xảy ra')
    }
    
    success('Xóa trường thành công!')
    emit('refresh')
  } catch (err) {
    showError(err.message || 'Có lỗi xảy ra')
  }
}

const getTypeClass = (type) => {
  const classes = {
    text: 'bg-blue-100 text-blue-700',
    number: 'bg-green-100 text-green-700',
    email: 'bg-purple-100 text-purple-700',
    phone: 'bg-orange-100 text-orange-700',
    url: 'bg-cyan-100 text-cyan-700',
    date: 'bg-pink-100 text-pink-700',
    image: 'bg-emerald-100 text-emerald-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}

const getTypeLabel = (type) => {
  const labels = {
    text: 'Text',
    number: 'Number',
    email: 'Email',
    phone: 'Phone',
    url: 'URL',
    date: 'Date',
    image: 'Image'
  }
  return labels[type] || type
}
</script>
