<template>
  <div style="z-index: 999999  !important" class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            {{ isEdit ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới' }}
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ isEdit ? 'Cập nhật thông tin người dùng' : 'Thêm người dùng mới vào hệ thống' }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Account Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                placeholder="user@example.com"
                class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                placeholder="+84 123 456 789"
                class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

         

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                v-model="formData.isActive"
                class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="true">Hoạt động</option>
                <option :value="false">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Profile Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                v-model="formData.profileData.fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <input
                v-model="formData.profileData.birthday"
                type="date"
                class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                v-model="formData.profileData.gender"
                class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email liên hệ
              </label>
              <input
                v-model="formData.profileData.email"
                type="email"
                placeholder="profile@example.com"
                class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <textarea
                v-model="formData.profileData.address"
                rows="2"
                placeholder="Nhập địa chỉ"
                class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Roles -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Vai trò & Quyền hạn</h3>
          <div class="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
            <div v-if="roles.length === 0" class="text-center py-4 text-gray-500">
              Chưa có vai trò nào
            </div>
            <div v-else class="space-y-2">
              <label
                v-for="role in roles"
                :key="role._id"
                class="flex items-start p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="role._id"
                  v-model="formData.roles"
                  class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div class="ml-3 flex-1">
                  <div class="text-sm font-medium text-gray-900">{{ role.name }}</div>
                  <div class="text-xs text-gray-500">{{ role.description }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span v-if="saving">
              <i class="bi bi-arrow-repeat animate-spin"></i>
            </span>
            <span>{{ isEdit ? 'Cập nhật' : 'Tạo mới' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  roles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.user)
const showPassword = ref(false)
const saving = ref(false)

const formData = ref({
  email: '',
  password: '',
  phone: '',
  isActive: true,
  roles: [],
  profileData: {
    fullName: '',
    birthday: '',
    gender: '',
    email: '',
    address: ''
  }
})

// Watch for user prop changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    formData.value = {
      email: newUser.email || '',
      password: '',
      phone: newUser.phone || '',
      isActive: newUser.isActive !== undefined ? newUser.isActive : true,
      roles: newUser.roles?.map(r => r._id || r) || [],
      profileData: {
        fullName: newUser.profile?.fullName || '',
        birthday: newUser.profile?.birthday || '',
        gender: newUser.profile?.gender || '',
        email: newUser.profile?.email || '',
        address: newUser.profile?.address || ''
      }
    }
  } else {
    // Reset form for new user
    formData.value = {
      email: '',
      password: '',
      phone: '',
      isActive: true,
      roles: [],
      profileData: {
        fullName: '',
        birthday: '',
        gender: '',
        email: '',
        address: ''
      }
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  saving.value = true
  try {
    const submitData = { ...formData.value }
    
    // Remove password if edit and empty
    if (isEdit.value && !submitData.password) {
      delete submitData.password
    }

    emit('save', submitData)
  } finally {
    saving.value = false
  }
}
</script>
