<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div v-if="isOpen" class="fixed inset-0 z-999999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="$emit('close')">
            <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col">
                <!-- Header -->
                <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white shrink-0">
                    <div class="flex items-center gap-4">
                        <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                            {{ match.employeeId?.fullName?.charAt(0)?.toUpperCase() }}
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-900">{{ match.employeeId?.fullName }}</h2>
                            <p class="text-sm text-gray-600 flex items-center gap-2">
                                <i class="bi bi-briefcase"></i>
                                {{ match.employeeId?.desiredPosition }}
                            </p>
                        </div>
                    </div>
                    <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <i class="bi bi-x-lg text-xl text-gray-600"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto p-6">
                    <!-- Match Score & Status -->
                    <div class="flex flex-wrap items-center gap-2 mb-6">
                        <span class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-lg">
                            <i class="bi bi-check-circle-fill"></i>
                            {{ match.score }}% Phù Hợp
                        </span>
                        <span v-if="!match.viewedByHR" class="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium rounded-lg">
                            <i class="bi bi-eye-slash"></i>
                            Chưa xem CV
                        </span>
                        <span v-else class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded-lg">
                            <i class="bi bi-eye-fill"></i>
                            Đã xem CV
                        </span>
                        <span v-if="match.status === 'interested'" class="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm font-bold rounded-lg">
                            <i class="bi bi-hand-thumbs-up-fill"></i>
                            Quan tâm
                        </span>
                        <span v-else-if="match.status === 'not_interested'" class="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-lg">
                            <i class="bi bi-hand-thumbs-down-fill"></i>
                            Không phù hợp
                        </span>
                    </div>

                    <!-- Contact Information -->
                    <div class="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Thông tin liên hệ</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-white rounded-lg border border-gray-200">
                                    <i class="bi bi-envelope text-gray-600"></i>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Email</p>
                                    <p class="text-sm font-medium text-gray-900">{{ match.employeeId?.email }}</p>
                                </div>
                            </div>
                            <div v-if="match.employeeId?.phone" class="flex items-center gap-3">
                                <div class="p-2 bg-white rounded-lg border border-gray-200">
                                    <i class="bi bi-telephone text-gray-600"></i>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Số điện thoại</p>
                                    <p class="text-sm font-medium text-gray-900">{{ match.employeeId?.phone }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-white rounded-lg border border-gray-200">
                                    <i class="bi bi-geo-alt text-gray-600"></i>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Địa chỉ</p>
                                    <p class="text-sm font-medium text-gray-900">{{ match.employeeId?.ward }}, {{ match.employeeId?.province }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-white rounded-lg border border-gray-200">
                                    <i class="bi bi-award text-gray-600"></i>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500">Kinh nghiệm</p>
                                    <p class="text-sm font-medium text-gray-900">{{ match.employeeId?.experienceYears || 0 }} năm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Skills -->
                    <div v-if="match.employeeId?.skills?.length" class="mb-6">
                        <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Kỹ năng</h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="skill in match.employeeId.skills"
                                :key="skill"
                                class="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                            >
                                {{ skill }}
                            </span>
                        </div>
                    </div>

                    <!-- CV Section -->
                    <div v-if="match.employeeId?.cv" class="mb-6">
                        <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Hồ sơ CV</h3>
                        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="p-3 bg-red-50 rounded-lg border border-red-200">
                                        <i class="bi bi-file-earmark-pdf text-2xl text-red-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900">{{ match.employeeId.cv.filename || 'CV.pdf' }}</p>
                                        <p class="text-xs text-gray-500">PDF Document</p>
                                    </div>
                                </div>
                                <RouterLink
                                    :to="`/user/hr/cv-preview/${match._id}`"
                                    class="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium hover:from-gray-900 hover:to-black transition-all flex items-center gap-2"
                                >
                                    <i class="bi bi-eye"></i>
                                    Xem CV
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                    <div v-else class="mb-6">
                        <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Hồ sơ CV</h3>
                        <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                            <i class="bi bi-file-earmark-x text-4xl text-gray-400 mb-2"></i>
                            <p class="text-gray-600">Ứng viên chưa tải lên CV</p>
                        </div>
                    </div>

                    <!-- Feedback Section -->
                    <div v-if="!match.status || match.status === 'pending' || match.status === 'viewed'" class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                        <h3 class="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <i class="bi bi-star-fill text-blue-600"></i>
                            Đánh giá ứng viên
                        </h3>
                        <p class="text-sm text-gray-600 mb-4">Ứng viên này có phù hợp với vị trí bạn đang tuyển dụng không?</p>
                        <div class="flex gap-3">
                            <button
                                @click="submitFeedback('interested')"
                                :disabled="isSubmitting"
                                class="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <i class="bi bi-hand-thumbs-up-fill"></i>
                                Quan tâm
                            </button>
                            <button
                                @click="submitFeedback('not_interested')"
                                :disabled="isSubmitting"
                                class="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <i class="bi bi-hand-thumbs-down-fill"></i>
                                Không phù hợp
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 shrink-0">
                    <button @click="$emit('close')" class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                        Đóng
                    </button>
                    <a
                        :href="`mailto:${match.employeeId?.email}`"
                        class="px-6 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <i class="bi bi-envelope-fill"></i>
                        Gửi Email
                    </a>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    match: Object
})

const emit = defineEmits(['close', 'refresh'])

const toast = useToast()
const isSubmitting = ref(false)

const submitFeedback = async (feedback) => {
    if (!props.match?._id) return
    
    isSubmitting.value = true
    try {
        await useFetchAuth(`/hr/matches/${props.match._id}/feedback`, {
            method: 'POST',
            body: { status: feedback }
        })
        
        toast.success(`Đã đánh giá: ${feedback === 'interested' ? 'Quan tâm' : 'Không phù hợp'}`)
        emit('refresh')
        emit('close')
    } catch (err) {
        console.error(err)
        toast.error('Không thể gửi đánh giá')
    } finally {
        isSubmitting.value = false
    }
}
</script>
