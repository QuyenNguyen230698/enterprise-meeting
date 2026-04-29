<template>
  <div class="fixed inset-0 z-999999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
      <!-- Header -->
      <div class="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg">
              <i class="bi bi-check-circle-fill text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold">Phê Duyệt Hồ Sơ</h2>
              <p class="text-sm text-emerald-100">
                {{ type === 'hr' ? 'Nhà tuyển dụng' : 'Ứng viên' }}: {{ getName }}
              </p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="space-y-6">
          <!-- Info Box -->
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <i class="bi bi-info-circle text-emerald-600 text-xl mt-0.5"></i>
              <div class="text-sm text-emerald-800">
                <p class="font-semibold mb-1">Lưu ý khi phê duyệt:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Người dùng sẽ nhận được email thông báo</li>
                  <li>Hệ thống sẽ tự động cấp quyền truy cập dựa trên vai trò được chọn</li>
                  <li>Bạn có thể chọn nhiều vai trò cho người dùng</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Role Assignment -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-3">
              Chọn vai trò cho người dùng <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                v-for="role in filteredRoles"
                :key="role._id"
                class="relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-indigo-300 hover:bg-indigo-50/50"
                :class="selectedRoles.includes(role._id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'"
              >
                <input
                  type="checkbox"
                  :value="role._id"
                  v-model="selectedRoles"
                  class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
                />
                <div class="ml-3 flex-1">
                  <div class="font-semibold text-gray-900 flex items-center gap-2">
                    {{ role.name }}
                    <span v-if="isRecommendedRole(role)" class="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                      Khuyến nghị
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">{{ role.description || 'Không có mô tả' }}</p>
                </div>
              </label>
            </div>
            <p v-if="selectedRoles.length === 0" class="mt-2 text-xs text-red-600">
              * Vui lòng chọn ít nhất một vai trò
            </p>
            <p v-else class="mt-2 text-xs text-gray-600">
              <i class="bi bi-check-circle-fill text-green-600 mr-1"></i>
              Đã chọn {{ selectedRoles.length }} vai trò
            </p>
          </div>

          <!-- Additional Notes -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              v-model="notes"
              rows="3"
              class="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Thêm ghi chú nội bộ về quyết định phê duyệt..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
        >
          Hủy
        </button>
        <button
          @click="submitApproval"
          :disabled="selectedRoles.length === 0"
          class="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <i class="bi bi-check-circle-fill"></i>
          Phê Duyệt & Cấp Quyền
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  record: { type: Object, required: true },
  type: { type: String, required: true }, // 'hr' or 'employee'
  roles: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'approve'])

const selectedRoles = ref([])
const notes = ref('')

const getName = computed(() => {
  return props.type === 'hr' ? props.record.companyName : props.record.fullName
})

const filteredRoles = computed(() => {
  // Filter roles based on type - you can customize this logic
  return props.roles.filter(role => {
    if (props.type === 'hr') {
      // Show roles suitable for HR (e.g., 'HR', 'Recruiter', etc.)
      return ['HR', 'Recruiter', 'Company Admin'].some(name =>
        role.name.toLowerCase().includes(name.toLowerCase())
      ) || !role.name.toLowerCase().includes('employee')
    } else {
      // Show roles suitable for Employee (e.g., 'Employee', 'Job Seeker', etc.)
      return ['Employee', 'Job Seeker', 'Candidate'].some(name =>
        role.name.toLowerCase().includes(name.toLowerCase())
      ) || !role.name.toLowerCase().includes('hr')
    }
  })
})

const isRecommendedRole = (role) => {
  if (props.type === 'hr') {
    return role.name.toLowerCase().includes('hr') || role.name.toLowerCase().includes('recruiter')
  } else {
    return role.name.toLowerCase().includes('employee') || role.name.toLowerCase().includes('job seeker')
  }
}

const submitApproval = () => {
  if (selectedRoles.value.length === 0) {
    return
  }

  emit('approve', {
    roles: selectedRoles.value,
    notes: notes.value
  })
}
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
