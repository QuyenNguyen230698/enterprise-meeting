<script setup>
import { ref, computed, watch } from 'vue'

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

// Company Info Form
const companyForm = ref({
    companyName: '',
    industry: '',
    website: '',
    companyDescription: '',
    logo: null
})

const logoPreview = ref(null)
const logoFile = ref(null)

// Watch profile changes to update form
watch(() => props.profile, (newProfile) => {
    if (newProfile) {
        companyForm.value = {
            companyName: newProfile.companyName || '',
            industry: newProfile.industry || '',
            website: newProfile.website || '',
            companyDescription: newProfile.companyDescription || '',
            logo: null
        }
        logoPreview.value = newProfile.logo || null
    }
}, { immediate: true })

// Logo upload handler
const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        logoFile.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
            logoPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

// Save company info
const saveCompanyInfo = async () => {
    try {
        isLoading.value = true
        error.value = null

        const formData = new FormData()
        formData.append('companyName', companyForm.value.companyName)
        formData.append('industry', companyForm.value.industry)
        formData.append('website', companyForm.value.website)
        formData.append('companyDescription', companyForm.value.companyDescription)
        
        if (logoFile.value) {
            formData.append('logo', logoFile.value)
        }

        await useFetchAuth('/hr/profile', {
            method: 'PUT',
            body: formData
        })

        emit('refresh')
        useToast().success('Cập nhật thông tin thành công')
        emit('close')
    } catch (e) {
        console.error(e)
        error.value = e.message || 'Có lỗi xảy ra'
        useToast().error('Không thể cập nhật thông tin')
    } finally {
        isLoading.value = false
    }
}

const closeModal = () => {
    emit('close')
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 z-999999 overflow-y-auto" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[600px] max-h-[90vh]">
                
                <!-- Header -->
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
                    <h3 class="text-xl font-bold text-gray-900">Chỉnh Sửa Thông Tin Công Ty</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="bi bi-x-lg text-lg"></i>
                    </button>
                </div>

                <!-- Content Area -->
                <div class="p-6 overflow-y-auto bg-gray-50 flex-1">
                    <div class="space-y-4">
                        <!-- Logo Upload -->
                        <div class="bg-white rounded-xl p-4 border border-gray-200">
                            <label class="text-sm font-bold text-gray-700 mb-3 block">Logo công ty</label>
                            <div class="flex items-center gap-4">
                                <div class="h-20 w-20 rounded-lg bg-gray-100 bg-cover bg-center flex items-center justify-center overflow-hidden border-2 border-gray-200"
                                     :style="logoPreview ? `background-image: url('${logoPreview}')` : ''">
                                    <span v-if="!logoPreview" class="text-2xl font-bold text-gray-400">
                                        {{ companyForm.companyName?.charAt(0)?.toUpperCase() }}
                                    </span>
                                </div>
                                <div class="flex-1">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        @change="handleLogoUpload"
                                        class="hidden"
                                        id="logo-upload"
                                    >
                                    <label 
                                        for="logo-upload"
                                        class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-all text-sm font-medium"
                                    >
                                        <i class="bi bi-upload"></i>
                                        Tải lên logo mới
                                    </label>
                                    <p class="text-xs text-gray-500 mt-2">PNG, JPG tối đa 2MB</p>
                                </div>
                            </div>
                        </div>

                        <!-- Company Name & Industry -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white rounded-xl p-4 border border-gray-200">
                                <label class="text-sm font-bold text-gray-700 mb-2 block">
                                    Tên doanh nghiệp <span class="text-red-500">*</span>
                                </label>
                                <input 
                                    v-model="companyForm.companyName" 
                                    type="text" 
                                    placeholder="VD: Công ty TNHH ABC"
                                    class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                                >
                            </div>
                            <div class="bg-white rounded-xl p-4 border border-gray-200">
                                <label class="text-sm font-bold text-gray-700 mb-2 block">
                                    Ngành nghề <span class="text-red-500">*</span>
                                </label>
                                <input 
                                    v-model="companyForm.industry" 
                                    type="text" 
                                    placeholder="VD: Công nghệ thông tin"
                                    class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                                >
                            </div>
                        </div>

                        <!-- Website -->
                        <div class="bg-white rounded-xl p-4 border border-gray-200">
                            <label class="text-sm font-bold text-gray-700 mb-2 block">Website</label>
                            <input 
                                v-model="companyForm.website" 
                                type="url" 
                                placeholder="https://example.com"
                                class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                            >
                        </div>

                        <!-- Description -->
                        <div class="bg-white rounded-xl p-4 border border-gray-200">
                            <label class="text-sm font-bold text-gray-700 mb-2 block">Mô tả công ty</label>
                            <textarea 
                                v-model="companyForm.companyDescription" 
                                rows="4" 
                                placeholder="Giới thiệu về công ty..."
                                class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm resize-none"
                            ></textarea>
                        </div>

                        <!-- Error Message -->
                        <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
                            <i class="bi bi-exclamation-circle-fill"></i>
                            {{ error }}
                        </div>

                        <!-- Save Button -->
                        <button 
                            @click="saveCompanyInfo"
                            :disabled="isLoading"
                            class="w-full px-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span v-if="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <i v-else class="bi bi-check-circle"></i>
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
