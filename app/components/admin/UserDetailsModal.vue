<template>
  <div style="z-index: 999999  !important" class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Chi tiết người dùng</h2>
          <p class="text-sm text-gray-600 mt-1">Xem thông tin chi tiết người dùng</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- User Header -->
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <span class="text-blue-600 font-bold text-2xl">
              {{ getInitials(user.email) }}
            </span>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900">
              {{ user.profile?.fullName || 'N/A' }}
            </h3>
            <p class="text-sm text-gray-600">{{ user.email }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full font-medium',
                  user.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                ]"
              >
                {{ user.isActive ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
              <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                {{ user.provider }}
              </span>
            </div>
          </div>
        </div>

        <!-- Account Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Mã người dùng</p>
              <code class="text-sm font-medium text-gray-900">{{ user.userCode }}</code>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Email</p>
              <p class="text-sm font-medium text-gray-900">{{ user.email }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">SĐT</p>
              <p class="text-sm font-medium text-gray-900">{{ user.phone || 'N/A' }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Nhà cung cấp</p>
              <p class="text-sm font-medium text-gray-900 capitalize">{{ user.provider }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Ngày tạo</p>
              <p class="text-sm font-medium text-gray-900">{{ formatDate(user.createdAt) }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Cập nhật</p>
              <p class="text-sm font-medium text-gray-900">{{ formatDate(user.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Profile Information -->
        <div v-if="user.profile">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Họ và tên</p>
              <p class="text-sm font-medium text-gray-900">{{ user.profile.fullName || 'N/A' }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Ngày sinh</p>
              <p class="text-sm font-medium text-gray-900">{{ user.profile.birthday || 'N/A' }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Giới tính</p>
              <p class="text-sm font-medium text-gray-900 capitalize">{{ user.profile.gender || 'N/A' }}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Email liên hệ</p>
              <p class="text-sm font-medium text-gray-900">{{ user.profile.email || 'N/A' }}</p>
            </div>
            <div class="md:col-span-2 p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">Địa chỉ</p>
              <p class="text-sm font-medium text-gray-900">{{ user.profile.address || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Roles & Permissions -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Vai trò & Quyền hạn</h3>
          <div v-if="user.roles && user.roles.length > 0" class="space-y-3">
            <div
              v-for="role in user.roles"
              :key="role._id"
              class="p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">{{ role.name }}</h4>
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    role.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ role.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ role.description }}</p>
              <div v-if="role.permissions && role.permissions.length > 0" class="mt-3">
                <p class="text-xs text-gray-500 mb-2">Quyền:</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(perm, idx) in role.permissions"
                    :key="idx"
                    class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {{ perm.appId?.name || 'Unknown' }}: {{ perm.actions?.join(', ') || 'N/A' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <i class="bi bi-shield-x text-4xl"></i>
            <p class="mt-2">Chưa được gán vai trò</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button
          @click="$emit('close')"
          class="px-6 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const getInitials = (email) => {
  return email.substring(0, 2).toUpperCase()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
