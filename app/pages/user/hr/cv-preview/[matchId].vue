<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const matchId = route.params.matchId
const token = route.query.token

// Disable authentication middleware if token is present (Magic Link)
// or we make this page public but handle auth manually
definePageMeta({
  middleware: [] // Remove 'auth' if it was applied via directory
})

const match = ref(null)
const pdfUrl = ref(null)
const isLoading = ref(true)
const error = ref(null)
const showFeedbackModal = ref(false)

onMounted(async () => {
    if (!matchId) {
        error.value = 'Invalid Link'
        isLoading.value = false
        return
    }

    try {
        let data;
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || ''; 
        
        if (token) {
            // Public Access via Token
            const url = apiBase ? `${apiBase}/public/matches/${matchId}/preview` : `/api/public/matches/${matchId}/preview`;
            const response = await useFetch(`${url}?token=${token}`)
            
            if (response.error.value) {
                throw new Error(response.error.value.message || 'Error fetching data')
            }
            data = response.data.value
        } else {
            // Private Access via Auth
            data = await useFetchAuth(`/hr/matches/${matchId}/view-cv`, {
                method: 'GET'
            })
        }
        
        if (!data) {
             throw new Error('No data received')
        }

        if (data && data.success === false) {
             throw new Error(data.message || 'Error')
        }

        const matchData = data.data || data.match
        
        if (matchData) {
             match.value = matchData
             // Construct PDF URL from cv field
             if (match.value.employeeId?.cv?.filename) {
                 const imgBase = config.public.apiBase;
                 // Ensure no double slash
                 const cleanBase = imgBase.endsWith('/') ? imgBase.slice(0, -1) : imgBase; 
                 pdfUrl.value = `${cleanBase}/cloudflare/cdn/uploads/hr-employee/employee/${match.value.employeeId.cv.filename}`
             }
             
             // Show feedback modal if not yet rated
             if (!match.value.hrFeedback?.status) {
                 setTimeout(() => {
                     showFeedbackModal.value = true
                 }, 2000)
             }
        } else {
             throw new Error('No data found')
        }

    } catch (err) {
        console.error(err)
        error.value = 'Không thể tải hồ sơ. Có thể liên kết đã hết hạn hoặc bạn không có quyền truy cập.'
        
        // If not token and error is 401, redirect to login? 
        // useFetchAuth usually handles this, but if we removed middleware, we might need manual check.
        if (!token && !localStorage.getItem('token')) {
             router.push('/login?redirect=' + route.fullPath)
        }
    } finally {
        isLoading.value = false
    }
})

const submitFeedback = async (feedback) => {
    try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiBase || '';
        
        if (token) {
            // Public Submit
            const url = apiBase ? `${apiBase}/public/matches/${matchId}/feedback` : `/api/public/matches/${matchId}/feedback`;
            await useFetch(`${url}?token=${token}`, {
                method: 'POST',
                body: { status: feedback }
            })
        } else {
            // Private Submit
            await useFetchAuth(`/hr/matches/${matchId}/feedback`, {
                method: 'POST',
                body: { status: feedback }
            })
        }
        
        toast.success(`Đã đánh giá ứng viên: ${feedback === 'interested' ? 'Quan tâm' : 'Không phù hợp'}`)
        showFeedbackModal.value = false
        
        // Update local match status
        if (match.value) {
            match.value.status = feedback
            match.value.hrFeedback = {
                status: feedback,
                feedbackAt: new Date()
            }
        }
    } catch (err) {
        console.error(err)
        toast.error('Không thể gửi đánh giá')
    }
}

const goBack = () => router.push('/user/hr')
</script>

<template>
    <div class="w-full h-full flex flex-col bg-white min-h-0">
        <!-- Enhanced Toolbar -->
        <div class="border-b border-gray-200 shrink-0 bg-white">
            <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <!-- Left: Navigation -->
                    <button
                        @click="goBack"
                        class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                        <i class="bi bi-arrow-left"></i>
                        Quay lại
                    </button>

                    <!-- Right: Actions -->
                    <div v-if="match" class="flex items-center gap-2">
                        <button 
                            @click="showFeedbackModal = true"
                            class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            Đánh giá
                        </button>
                        <a
                            :href="`mailto:${match.employeeId?.email}`"
                            class="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-black transition-colors"
                        >
                            Liên Hệ
                        </a>
                    </div>
                </div>
            </div>

            <!-- Candidate Info Card -->
            <div v-if="match" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div class="flex items-start gap-4">
                    <div class="h-14 w-14 rounded bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700 shrink-0">
                        {{ match.employeeId?.fullName?.charAt(0)?.toUpperCase() }}
                    </div>
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-4 mb-2">
                            <div class="flex-1 min-w-0">
                                <h1 class="text-lg font-semibold text-gray-900 truncate">
                                    {{ match.employeeId?.fullName }}
                                </h1>
                                <p class="text-sm text-gray-600 truncate">
                                    {{ match.employeeId?.desiredPosition }}
                                </p>
                            </div>
                            
                            <div class="flex items-center gap-3 shrink-0">
                                <div class="text-right">
                                    <p class="text-xs text-gray-500">Match Score</p>
                                    <p class="text-lg font-semibold text-green-600">{{ match.score }}%</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-xs">
                            <div class="flex items-center gap-2 text-gray-600">
                                <i class="bi bi-envelope text-gray-400"></i>
                                <span class="truncate">{{ match.employeeId?.email }}</span>
                            </div>
                            <div v-if="match.employeeId?.phone" class="flex items-center gap-2 text-gray-600">
                                <i class="bi bi-telephone text-gray-400"></i>
                                <span>{{ match.employeeId?.phone }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600">
                                <i class="bi bi-geo-alt text-gray-400"></i>
                                <span>{{ match.employeeId?.province || 'N/A' }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-600">
                                <i class="bi bi-award text-gray-400"></i>
                                <span>{{ match.employeeId?.experienceYears || 0 }} năm kinh nghiệm</span>
                            </div>
                        </div>
                        
                        <div v-if="match.employeeId?.skills?.length" class="mt-3 pt-3 border-t border-gray-200">
                            <div class="flex flex-wrap gap-2">
                                <span
                                    v-for="skill in match.employeeId.skills.slice(0, 8)"
                                    :key="skill"
                                    class="px-2 py-1 bg-white border border-gray-300 text-gray-700 text-xs"
                                >
                                    {{ skill }}
                                </span>
                                <span v-if="match.employeeId.skills.length > 8" class="px-2 py-1 text-gray-500 text-xs">
                                    +{{ match.employeeId.skills.length - 8 }} more
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-hidden">
            <!-- Loading State -->
            <div v-if="isLoading" class="h-full flex flex-col items-center justify-center">
                <div class="w-10 h-10 border-3 border-gray-200 border-t-gray-700 rounded-full animate-spin mb-3"></div>
                <p class="text-sm text-gray-600">Đang tải...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="h-full flex items-center justify-center">
                <div class="text-center max-w-md px-6">
                    <i class="bi bi-exclamation-circle text-5xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Lỗi Truy Cập</h3>
                    <p class="text-sm text-gray-600 mb-6">{{ error }}</p>
                    <button
                        @click="goBack"
                        class="px-5 py-2.5 bg-gray-900 text-white text-sm hover:bg-black transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>

            <!-- PDF Viewer -->
            <div v-else class="h-full w-full bg-gray-100">
                <PDFPreview
                    v-if="pdfUrl"
                    :url="pdfUrl"
                    class="w-full h-full"
                />
                <div v-else class="h-full flex flex-col items-center justify-center text-gray-500">
                    <i class="bi bi-file-earmark-pdf text-6xl text-gray-300 mb-4"></i>
                    <p class="text-sm text-gray-600">File PDF không khả dụng</p>
                </div>
            </div>
        </div>
        
        <!-- Minimal Feedback Modal -->
        <Transition
            enter-active-class="transition duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showFeedbackModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" @click.self="showFeedbackModal = false">
                <div class="bg-white max-w-md w-full border border-gray-200 shadow-xl">
                    <div class="px-6 py-5 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">Đánh giá ứng viên</h3>
                        <p class="text-sm text-gray-600 mt-1">Ứng viên này có phù hợp với vị trí bạn đang tuyển dụng không?</p>
                    </div>
                    
                    <div class="p-6 space-y-3">
                        <button
                            @click="submitFeedback('interested')"
                            class="w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
                        >
                            <i class="bi bi-hand-thumbs-up mr-2"></i>
                            Quan tâm
                        </button>
                        
                        <button
                            @click="submitFeedback('not_interested')"
                            class="w-full px-4 py-3 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <i class="bi bi-hand-thumbs-down mr-2"></i>
                            Không phù hợp
                        </button>
                        
                        <button
                            @click="showFeedbackModal = false"
                            class="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Đánh giá sau
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
