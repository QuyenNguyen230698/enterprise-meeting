<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    profile: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'refresh'])

const isLoading = ref(false)
const error = ref(null)
const cvFile = ref(null)

const form = ref({
    fullName: '',
    email: '',
    phone: '',
    desiredPosition: '',
    experienceYears: 0,
    skills: '',
    province: '',
    workTypePreference: 'onsite'
})

const workTypes = [
    { value: 'onsite', label: 'onsite' },
    { value: 'remote', label: 'Từ xa' },
    { value: 'hybrid', label: 'Linh hoạt (Hybrid)' }
]

// Watch for profile changes to populate form
watch(() => props.profile, (newProfile) => {
    if (newProfile) {
        form.value = {
            fullName: newProfile.fullName || '',
            email: newProfile.email || '',
            phone: newProfile.phone || '',
            desiredPosition: newProfile.desiredPosition || '',
            experienceYears: newProfile.experienceYears || 0,
            skills: Array.isArray(newProfile.skills) ? newProfile.skills.join(', ') : (newProfile.skills || ''),
            province: newProfile.province || '',
            workTypePreference: newProfile.workTypePreference || 'onsite'
        }
    }
}, { immediate: true })

const handleFileChange = (event) => {
    cvFile.value = event.target.files[0]
}

const handleSubmit = async () => {
    try {
        isLoading.value = true
        error.value = null

        const formData = new FormData()
        formData.append('fullName', form.value.fullName)
        formData.append('email', form.value.email)
        formData.append('phone', form.value.phone)
        formData.append('desiredPosition', form.value.desiredPosition)
        formData.append('experienceYears', form.value.experienceYears)
        formData.append('province', form.value.province)
        formData.append('workTypePreference', form.value.workTypePreference)

        // Process skills
        const skillsArray = form.value.skills.split(',').map(s => s.trim()).filter(Boolean)
        formData.append('skills', JSON.stringify(skillsArray))

        if (cvFile.value) {
            formData.append('cv', cvFile.value)
        }

        const data = await useFetchAuth('/employee/profile', {
            method: 'PUT',
            body: formData
        })

        emit('refresh')
        emit('close')
    } catch (e) {
        console.error(e)
        error.value = e.message || 'Có lỗi xảy ra khi cập nhật hồ sơ'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-999999 overflow-y-auto" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <!-- Header -->
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
                    <h3 class="text-xl font-bold text-gray-900">
                        Chỉnh Sửa Hồ Sơ Employee
                    </h3>
                    <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="bi bi-x-lg text-lg"></i>
                    </button>
                </div>

                <!-- Content Area -->
                <div class="p-6 overflow-y-auto min-h-0 bg-gray-50 flex-1">
                    <div class="space-y-4">
                        <!-- Basic Info -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Họ và tên <span class="text-red-500">*</span></label>
                                <input v-model="form.fullName" type="text"
                                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Email</label>
                                <input v-model="form.email" type="email" readonly
                                       class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed text-sm">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Số điện thoại</label>
                                <input v-model="form.phone" type="text"
                                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Khu vực (Tỉnh/Thành phố)</label>
                                <input v-model="form.province" type="text" placeholder="VD: Hồ Chí Minh"
                                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                            </div>
                        </div>

                        <!-- Professional Info -->
                        <div class="space-y-1">
                             <label class="text-xs font-bold text-gray-700">Vị trí mong muốn <span class="text-red-500">*</span></label>
                             <input v-model="form.desiredPosition" type="text" placeholder="VD: Frontend Developer"
                                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Số năm kinh nghiệm</label>
                                <input v-model.number="form.experienceYears" type="number" min="0"
                                       class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-700">Hình thức làm việc</label>
                                <select v-model="form.workTypePreference" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm">
                                    <option v-for="type in workTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-700">Kỹ năng (Phân cách bằng dấu phẩy)</label>
                            <textarea v-model="form.skills" rows="2" placeholder="VD: React, Vue, Node.js"
                                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"></textarea>
                        </div>

                        <!-- CV Upload -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-700">Cập nhật CV (Mới)</label>
                            <input type="file" accept=".pdf,.doc,.docx" @change="handleFileChange"
                                   class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transaction-all"/>
                            <p v-if="profile.cv" class="text-xs text-green-600 mt-1">
                                <i class="bi bi-check-circle"></i> Đã có CV: {{ profile.cv.originalName }}
                            </p>
                        </div>

                        <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                            <i class="bi bi-exclamation-circle-fill"></i>
                            {{ error }}
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-3 pt-2">
                            <button @click="$emit('close')" class="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm">
                                Hủy bỏ
                            </button>
                            <button @click="handleSubmit" 
                                    :disabled="isLoading"
                                    class="flex-1 px-4 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                {{ isLoading ? 'Đang lưu...' : 'Lưu hồ sơ' }}
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>
