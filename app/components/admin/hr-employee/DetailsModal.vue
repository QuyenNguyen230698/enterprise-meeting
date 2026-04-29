<template>
  <div class="fixed inset-0 z-999999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
      <!-- Header -->
      <div :class="type === 'hr' ? 'from-indigo-600 to-blue-600' : 'from-purple-600 to-pink-600'"
           class="bg-gradient-to-r px-6 py-4 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg">
              <i :class="type === 'hr' ? 'bi-building' : 'bi-person-badge'" class="text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold">Chi Tiết Hồ Sơ</h2>
              <p :class="type === 'hr' ? 'text-indigo-100' : 'text-purple-100'" class="text-sm">
                {{ type === 'hr' ? 'Nhà tuyển dụng' : 'Ứng viên' }}
              </p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
        <!-- HR Details -->
        <div v-if="type === 'hr'" class="space-y-6">
          <!-- Basic Info -->
          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase mb-3">Thông Tin Cơ Bản</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Tên công ty</p>
                <p class="font-semibold text-gray-900">{{ record.companyName }}</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Lĩnh vực</p>
                <p class="font-semibold text-gray-900">{{ record.industry || 'N/A' }}</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Website</p>
                <a v-if="record.website" :href="record.website" target="_blank" class="font-semibold text-indigo-600 hover:underline">
                  {{ record.website }}
                </a>
                <p v-else class="text-gray-400">N/A</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Email liên hệ</p>
                <p class="font-semibold text-gray-900">{{ record.userId?.email }}</p>
              </div>
            </div>
          </div>

          <!-- Positions -->
          <div v-if="record.positions?.length">
            <h3 class="text-sm font-bold text-gray-400 uppercase mb-3">Vị Trí Tuyển Dụng ({{ record.positions.length }})</h3>
            <div class="space-y-3">
              <div
                v-for="(pos, idx) in record.positions"
                :key="idx"
                class="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-gray-900">{{ pos.title }}</h4>
                  <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                    {{ pos.category }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">{{ pos.description || 'Không có mô tả' }}</p>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div v-if="record.companyDoc">
            <h3 class="text-sm font-bold text-gray-400 uppercase mb-3">Tài Liệu</h3>
            <div class="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="bi bi-file-earmark-pdf text-3xl text-red-500"></i>
                <div>
                  <p class="font-semibold text-gray-900">{{ record.companyDoc.originalName }}</p>
                  <p class="text-xs text-gray-500">Tải lên: {{ new Date(record.companyDoc.uploadedAt).toLocaleDateString('vi-VN') }}</p>
                </div>
              </div>
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                <i class="bi bi-download mr-2"></i>
                Tải xuống
              </button>
            </div>
          </div>
        </div>

        <!-- Employee Details -->
        <div v-else class="space-y-6">
          <!-- Basic Info -->
          <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase mb-3">Thông Tin Cơ Bản</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Họ và tên</p>
                <p class="font-semibold text-gray-900">{{ record.fullName }}</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Email</p>
                <p class="font-semibold text-gray-900">{{ record.email }}</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Vị trí mong muốn</p>
                <p class="font-semibold text-gray-900">{{ record.desiredPosition || 'N/A' }}</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Kinh nghiệm</p>
                <p class="font-semibold text-gray-900">{{ record.experienceYears }} năm</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Khu vực</p>
                <p class="font-semibold text-gray-900">{{ record.location || 'N/A' }}</p>
              </div>
              <div class="p-4 bg-gray-50 rounded-xl">
                <p class="text-xs text-gray-500 mb-1">Hình thức làm việc</p>
                <p class="font-semibold text-gray-900 capitalize">{{ record.workTypePreference }}</p>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div v-if="record.skills?.length">
            <h3 class="text-sm font-bold text-gray-400 uppercase mb-3">Kỹ Năng</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in record.skills"
                :key="skill"
                class="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-sm font-medium rounded-lg"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- CV -->
          <div v-if="record.cv">
            <h3 class="text-sm font-bold text-gray-400 uppercase mb-3">CV</h3>
            <div class="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="bi bi-file-earmark-pdf text-3xl text-red-500"></i>
                <div>
                  <p class="font-semibold text-gray-900">{{ record.cv.originalName }}</p>
                  <p class="text-xs text-gray-500">Tải lên: {{ new Date(record.cv.uploadedAt).toLocaleDateString('vi-VN') }}</p>
                </div>
              </div>
              <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                <i class="bi bi-download mr-2"></i>
                Tải xuống
              </button>
            </div>
          </div>
        </div>

        <!-- Registration Info -->
        <div class="pt-6 border-t border-gray-200">
          <h3 class="text-sm font-bold text-gray-400 uppercase mb-3">Thông Tin Đăng Ký</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">Ngày đăng ký</p>
              <p class="font-semibold text-gray-900">{{ new Date(record.createdAt).toLocaleString('vi-VN') }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 mb-1">Trạng thái</p>
              <span class="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
                Chờ duyệt
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  record: { type: Object, required: true },
  type: { type: String, required: true }
})

defineEmits(['close'])
</script>

<style scoped>
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
