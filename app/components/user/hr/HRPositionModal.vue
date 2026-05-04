<script setup>
import { ref, computed } from 'vue'
import ConfirmModal from '~/components/ConfirmModal.vue'

const { isVisible: confirmVisible, confirmData, confirm: doConfirm, cancel: doCancel, confirmDelete } = useConfirm()
const { error: showError } = useToast()

const props = defineProps({
    isOpen: Boolean,
    positions: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'refresh'])

const mode = ref('list') // 'list', 'create', 'edit'
const isLoading = ref(false)
const error = ref(null)
const editingId = ref(null)

const initialFormState = {
    title: '',
    category: '',
    description: '',
    requirements: '',
    salary: {
        min: null,
        max: null,
        currency: 'VND'
    },
    workType: 'onsite',
    experienceLevel: 'FRESHER',
    isActive: true
}

const form = ref({ ...initialFormState })

const workTypes = [
    { value: 'onsite', label: 'onsite' },
    { value: 'remote', label: 'Từ xa' },
    { value: 'hybrid', label: 'Linh hoạt (Hybrid)' }
]

const experienceLevels = [
    { value: 'INTERN', label: 'Thực tập sinh' },
    { value: 'FRESHER', label: 'Mới tốt nghiệp' },
    { value: 'JUNIOR', label: 'Junior (1-3 năm)' },
    { value: 'SENIOR', label: 'Senior (3-5 năm)' },
    { value: 'LEAD', label: 'Trưởng nhóm' },
    { value: 'MANAGER', label: 'Quản lý' }
]

const resetForm = () => {
    form.value = JSON.parse(JSON.stringify(initialFormState))
    error.value = null
    editingId.value = null
}

const switchToCreate = () => {
    resetForm()
    mode.value = 'create'
}

const switchToEdit = (position) => {
    resetForm()
    editingId.value = position._id
    
    // Transform requirements array back to string for textarea
    const requirementsStr = Array.isArray(position.requirements) 
        ? position.requirements.join('\n') 
        : position.requirements || ''

    form.value = {
        ...position,
        requirements: requirementsStr
    }
    mode.value = 'edit'
}

const switchToList = () => {
    resetForm()
    mode.value = 'list'
}

const handleDelete = async (id) => {
    const ok = await confirmDelete('vị trí này')
    if (!ok) return

    try {
        isLoading.value = true
        await useFetchAuth(`/hr/positions/${id}`, { method: 'DELETE' })
        emit('refresh')
    } catch (e) {
        console.error(e)
        showError('Có lỗi xảy ra khi xóa vị trí')
    } finally {
        isLoading.value = false
    }
}

const handleSubmit = async () => {
    try {
        isLoading.value = true
        error.value = null

        // Format requirements
        const payload = {
            ...form.value,
            requirements: form.value.requirements.split('\n').filter(line => line.trim())
        }

        if (mode.value === 'create') {
            await useFetchAuth('/hr/positions', {
                method: 'POST',
                body: payload
            })
        } else {
            await useFetchAuth(`/hr/positions/${editingId.value}`, {
                method: 'PUT',
                body: payload
            })
        }

        emit('refresh')
        switchToList()
    } catch (e) {
        console.error(e)
        error.value = e.message || 'Có lỗi xảy ra, vui lòng thử lại'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div>
    <div v-if="isOpen" class="fixed inset-0 z-999999 overflow-y-auto" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[600px] max-h-[90vh]">
                
                <!-- Header -->
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
                    <h3 class="text-xl font-bold text-gray-900">
                        {{ mode === 'list' ? 'Quản Lý Vị Trí Tuyển Dụng' : (mode === 'create' ? 'Thêm Vị Trí Mới' : 'Chỉnh Sửa Vị Trí') }}
                    </h3>
                    <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="bi bi-x-lg text-lg"></i>
                    </button>
                </div>

                <!-- Content Area -->
                <div class="p-6 overflow-y-auto min-h-0 bg-gray-50 flex-1">
                    
                    <!-- View: LIST -->
                    <div v-if="mode === 'list'" class="space-y-4">
                        <button @click="switchToCreate" 
                                class="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 group">
                            <i class="bi bi-plus-circle text-xl group-hover:scale-110 transition-transform"></i>
                            Thêm vị trí mới
                        </button>

                        <div v-if="positions.length === 0" class="text-center py-8 text-gray-500">
                            Chưa có vị trí nào được tạo
                        </div>

                        <div v-else class="space-y-3">
                            <div v-for="pos in positions" :key="pos._id" 
                                 class="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex items-start justify-between group">
                                <div>
                                    <h4 class="font-bold text-gray-900">{{ pos.title }}</h4>
                                    <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                        <span class="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">{{ pos.category }}</span>
                                        <span>•</span>
                                        <span class="capitalize">{{ workTypes.find(t => t.value === pos.workType)?.label || pos.workType }}</span>
                                        <span>•</span>
                                        <span class="capitalize">{{ experienceLevels.find(e => e.value === pos.experienceLevel)?.label || pos.experienceLevel }}</span>
                                    </div>
                                </div>
                                
                                <div class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button @click="switchToEdit(pos)" class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button @click="handleDelete(pos._id)" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- View: FORM (Create/Edit) -->
                    <div v-else class="space-y-4">
                        <!-- Basic Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Tiêu đề vị trí <span class="text-red-500">*</span></label>
                                <input v-model="form.title" type="text" placeholder="VD: Senior Frontend Developer"
                                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Ngành nghề/Danh mục <span class="text-red-500">*</span></label>
                                <input v-model="form.category" type="text" placeholder="VD: IT Software"
                                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                            </div>
                        </div>

                        <!-- Details -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Hình thức làm việc</label>
                                <select v-model="form.workType" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                                    <option v-for="type in workTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Cấp bậc</label>
                                <select v-model="form.experienceLevel" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                                    <option v-for="exp in experienceLevels" :key="exp.value" :value="exp.value">{{ exp.label }}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Salary -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-700">Mức lương (VND)</label>
                            <div class="flex items-center gap-2">
                                <input v-model.number="form.salary.min" type="number" placeholder="Tối thiểu"
                                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                                <span class="text-gray-400">-</span>
                                <input v-model.number="form.salary.max" type="number" placeholder="Tối đa"
                                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-700">Mô tả công việc</label>
                            <textarea v-model="form.description" rows="3" placeholder="Mô tả chi tiết về công việc..."
                                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"></textarea>
                        </div>

                        <!-- Requirements -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-700">Yêu cầu (Mỗi dòng một yêu cầu)</label>
                            <textarea v-model="form.requirements" rows="4" placeholder="- Có kinh nghiệm với Vue.js&#10;- Thành thạo CSS..."
                                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"></textarea>
                        </div>
                        
                        <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                            <i class="bi bi-exclamation-circle-fill"></i>
                            {{ error }}
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-3 pt-2">
                            <button @click="switchToList" class="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm">
                                Hủy bỏ
                            </button>
                            <button @click="handleSubmit" 
                                    :disabled="isLoading"
                                    class="flex-1 px-4 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                {{ mode === 'create' ? 'Tạo mới' : 'Lưu thay đổi' }}
                            </button>
                        </div>
                    </div>
                </div>
                
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
