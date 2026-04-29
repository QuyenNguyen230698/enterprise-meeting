<script setup>
import { ref, onMounted } from 'vue'
import HRPositionModal from '../../../components/user/hr/HRPositionModal.vue'
import HRProfileEditModal from '../../../components/user/hr/HRProfileEditModal.vue'
import EmployeeDetailModal from '../../../components/user/hr/EmployeeDetailModal.vue'
definePageMeta({
  middleware: ['auth','permission']
})
const profile = ref(null)
const matches = ref([])
const isLoading = ref(true)

// Pagination state
const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
})

// Profile Edit Modal State
const isProfileEditModalOpen = ref(false)

// Position Modal State
const isPositionModalOpen = ref(false)

// Employee Detail Modal State
const isEmployeeModalOpen = ref(false)
const selectedMatch = ref(null)

const fetchProfile = async () => {
    try {
        const profileData = await useFetchAuth('/hr/profile')
        if (profileData && profileData.data) {
            profile.value = profileData.data
        }
    } catch (e) {
        console.error(e)
    }
}

const fetchMatches = async (page = 1) => {
    try {
        const query = new URLSearchParams({
            page: page.toString(),
            limit: pagination.value.limit.toString()
        }).toString()

        const matchesData = await useFetchAuth(`/hr/matches?${query}`)
        if (matchesData && matchesData.matches) {
            matches.value = matchesData.matches
            if (matchesData.pagination) {
                pagination.value = matchesData.pagination
            }
        } else if (matchesData && matchesData.data) {
             if (matchesData.pagination) {
                matches.value = matchesData.data
                pagination.value = matchesData.pagination
            } else {
                 matches.value = matchesData.data
            }
        }
    } catch (e) {
        console.error('Error fetching matches:', e)
    }
}

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.value.totalPages) {
        fetchMatches(newPage)
    }
}

const handleRefresh = () => {
    fetchMatches(pagination.value.page)
}

const openEmployeeModal = async (match) => {
    selectedMatch.value = match
    isEmployeeModalOpen.value = true
    
    // Mark as viewed if not already
    if (!match.viewedByHR) {
        try {
            await useFetchAuth(`/hr/matches/${match._id}/view-cv`, {
                method: 'GET'
            })
            // Refresh matches to update status
            await fetchMatches(pagination.value.page)
        } catch (err) {
            console.error('Error marking as viewed:', err)
        }
    }
}

const closeEmployeeModal = () => {
    isEmployeeModalOpen.value = false
    selectedMatch.value = null
}

onMounted(async () => {
    try {
        await Promise.all([
            fetchProfile(),
            fetchMatches(1)
        ])
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
})

const getStatusConfig = (status) => {
    const configs = {
        pending: {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
            icon: 'bi-clock-history',
            label: 'Chờ Duyệt',
        },
        approved: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            icon: 'bi-check-circle-fill',
            label: 'Đã Duyệt',
        },
        rejected: {
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-200',
            icon: 'bi-x-circle-fill',
            label: 'Từ Chối',
        }
    }
    return configs[status] || configs.pending
}
</script>

<template>
    <div class="w-full h-full flex flex-col bg-gradient-to-br from-gray-50 to-white min-h-0">
        <div class="flex-1 w-full px-6 py-5 flex flex-col overflow-y-auto min-h-0">
            <!-- Enhanced Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-100">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                        <i class="bi bi-building text-white text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-gray-900">Dashboard Nhà Tuyển Dụng</h1>
                        <p class="text-sm text-gray-600 mt-0.5">Quản lý vị trí và ứng viên</p>
                    </div>
                </div>
                
                <div v-if="profile" class="flex items-center gap-2">
                    <button @click="isPositionModalOpen = true"
                            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
                        <i class="bi bi-plus-circle-fill"></i>
                        Thêm vị trí
                    </button>
                    <button @click="isProfileEditModalOpen = true"
                            class="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                        <i class="bi bi-pencil-square"></i>
                        Chỉnh sửa
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
                <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                <p class="text-sm text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>

            <!-- Content -->
            <div v-else class="flex-1 flex flex-col min-h-0">
                <!-- No Profile State -->
                <div v-if="!profile" class="flex-1 flex items-center justify-center">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center max-w-md">
                        <div class="inline-flex p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mb-4">
                            <i class="bi bi-building text-6xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Chưa có hồ sơ nhà tuyển dụng</h3>
                        <p class="text-sm text-gray-600 mb-6">
                            Hoàn tất đăng ký thông tin công ty để bắt đầu tìm kiếm ứng viên tài năng
                        </p>
                        <RouterLink
                            to="/hr-and-employee"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                        >
                            <i class="bi bi-plus-circle-fill"></i>
                            Đăng Ký Ngay
                        </RouterLink>
                    </div>
                </div>

                <!-- Dashboard -->
                <div v-else class="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                    <!-- Left Sidebar -->
                    <div class="space-y-4 lg:w-64 lg:shrink-0">
                        <!-- Company Card -->
                        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                            <div class="flex items-center gap-3 mb-3">
                                <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 bg-cover bg-center flex items-center justify-center overflow-hidden shrink-0"
                                     :style="profile.logo ? `background-image: url('${profile.logo}')` : ''">
                                    <span v-if="!profile.logo" class="text-base font-bold text-blue-700">
                                        {{ profile.companyName?.charAt(0)?.toUpperCase() }}
                                    </span>
                                </div>
                                
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-bold text-sm text-gray-900 truncate">
                                        {{ profile.companyName }}
                                    </h3>
                                    <p class="text-xs text-gray-600 flex items-center gap-1 truncate">
                                        <i class="bi bi-briefcase-fill text-blue-600"></i>
                                        {{ profile.industry || 'N/A' }}
                                    </p>
                                </div>
                            </div>
                            
                            <a v-if="profile.website" :href="profile.website" target="_blank"
                               class="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                                <i class="bi bi-globe"></i>
                                Website
                            </a>
                        </div>

                        <!-- Colorful Stats -->
                        <div class="grid grid-cols-3 gap-2">
                            <div @click="isPositionModalOpen = true" class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-center cursor-pointer hover:shadow-lg transition-all group">
                                <i class="bi bi-list-ul text-white text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                                <p class="text-2xl font-black text-white">{{ profile.positions?.length || 0 }}</p>
                                <p class="text-xs text-blue-100 font-medium mt-1">Vị trí</p>
                            </div>
                            
                            <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-3 text-center hover:shadow-lg transition-shadow">
                                <i class="bi bi-people-fill text-white text-xl mb-1"></i>
                                <p class="text-2xl font-black text-white">{{ matches.length }}</p>
                                <p class="text-xs text-emerald-100 font-medium mt-1">Ứng viên</p>
                            </div>
                            
                            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-center hover:shadow-lg transition-shadow">
                                <i class="bi bi-chat-dots-fill text-white text-xl mb-1"></i>
                                <p class="text-2xl font-black text-white">0</p>
                                <p class="text-xs text-purple-100 font-medium mt-1">Liên hệ</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Matches List -->
                    <div class="flex-1 min-w-0 flex flex-col min-h-0">
                        <!-- Header -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <i class="bi bi-stars text-amber-600 text-lg"></i>
                                <h2 class="text-base font-bold text-gray-900">
                                    Gợi Ý Ứng Viên <span class="text-blue-600">({{ pagination.total }})</span>
                                </h2>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-if="matches.length === 0" class="flex-1 flex items-center justify-center border border-gray-200 p-8">
                            <div class="text-center">
                                <i class="bi bi-inbox text-4xl text-gray-300 mb-3"></i>
                                <p class="text-sm text-gray-600">Chưa có ứng viên mới</p>
                            </div>
                        </div>

                        <!-- Match Cards -->
                        <div v-else class="space-y-3">
                            <div
                                v-for="match in matches"
                                :key="match._id"
                                class="bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer overflow-hidden"
                                @click="openEmployeeModal(match)"
                            >
                                <div class="p-4">
                                    <div class="flex items-start gap-3">
                                        <div class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700 shrink-0">
                                            {{ match.employeeId?.fullName?.charAt(0)?.toUpperCase() }}
                                        </div>
                                        
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-start justify-between gap-3 mb-2">
                                                <div class="flex-1 min-w-0">
                                                    <h3 class="font-medium text-sm text-gray-900 truncate">
                                                        {{ match.employeeId?.fullName }}
                                                    </h3>
                                                    <p class="text-xs text-gray-500 truncate">
                                                        {{ match.employeeId?.desiredPosition }}
                                                    </p>
                                                </div>
                                                
                                                <span class="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium shrink-0">
                                                    {{ match.score }}%
                                                </span>
                                            </div>
                                            
                                            
                                            <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-2">
                                                <span class="truncate">{{ match.employeeId?.email }}</span>
                                                <span v-if="match.employeeId?.phone">{{ match.employeeId?.phone }}</span>
                                                <span>{{ match.employeeId?.province }}</span>
                                            </div>
                                            
                                            <div v-if="match.employeeId?.skills?.length" class="mt-2 pt-2 border-t border-gray-100">
                                                <div class="flex flex-wrap gap-1">
                                                    <span
                                                        v-for="skill in match.employeeId.skills.slice(0, 3)"
                                                        :key="skill"
                                                        class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs"
                                                    >
                                                        {{ skill }}
                                                    </span>
                                                    <span v-if="match.employeeId.skills.length > 3" class="px-2 py-0.5 text-gray-400 text-xs">
                                                        +{{ match.employeeId.skills.length - 3 }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                                    {{ new Date(match.updatedAt).toLocaleDateString('vi-VN') }}
                                </div>
                            </div>

                            <!-- Pagination -->
                            <div v-if="pagination.totalPages > 1" class="flex items-center justify-between pt-4 border-t border-gray-200">
                                <button 
                                    @click="changePage(pagination.page - 1)"
                                    :disabled="pagination.page === 1"
                                    class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ← Trước
                                </button>
                                
                                <span class="text-xs text-gray-600">
                                    Trang {{ pagination.page }} / {{ pagination.totalPages }}
                                </span>
                                
                                <button 
                                    @click="changePage(pagination.page + 1)"
                                    :disabled="pagination.page === pagination.totalPages"
                                    class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Tiếp →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modals -->
    <HRProfileEditModal
        v-if="profile"
        :isOpen="isProfileEditModalOpen"
        :profile="profile"
        @close="isProfileEditModalOpen = false"
        @refresh="fetchProfile" />
    
    <HRPositionModal 
           v-if="profile"
           :isOpen="isPositionModalOpen"
           :positions="profile.positions"
           @close="isPositionModalOpen = false"
           @refresh="fetchProfile" />
    
    <EmployeeDetailModal
        v-if="selectedMatch"
        :isOpen="isEmployeeModalOpen"
        :match="selectedMatch"
        @close="closeEmployeeModal"
        @refresh="handleRefresh" />
</template>
