<template>
  <div class="fixed inset-0 z-999999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg">
              <i class="bi bi-x-circle-fill text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold">Từ Chối Hồ Sơ</h2>
              <p class="text-sm text-red-100">
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
      <div class="p-6">
        <div class="space-y-4">
          <!-- Warning Box -->
          <div class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <i class="bi bi-exclamation-triangle text-red-600 text-xl mt-0.5"></i>
              <div class="text-sm text-red-800">
                <p class="font-semibold mb-1">Lưu ý khi từ chối:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Người dùng sẽ nhận được email thông báo từ chối</li>
                  <li>Họ có thể đăng ký lại sau khi sửa thông tin</li>
                  <li>Vui lòng cung cấp lý do rõ ràng để họ cải thiện</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Rejection Reason -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Lý do từ chối <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="reason"
              rows="5"
              class="w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="VD: Thông tin công ty chưa đầy đủ, thiếu giấy phép kinh doanh..."
              required
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">
              Lý do này sẽ được gửi cho người dùng qua email
            </p>
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
          @click="submitRejection"
          :disabled="!reason.trim()"
          class="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <i class="bi bi-x-circle-fill"></i>
          Xác Nhận Từ Chối
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  record: { type: Object, required: true },
  type: { type: String, required: true }
})

const emit = defineEmits(['close', 'reject'])

const reason = ref('')

const getName = computed(() => {
  return props.type === 'hr' ? props.record.companyName : props.record.fullName
})

const submitRejection = () => {
  if (!reason.value.trim()) {
    return
  }

  emit('reject', {
    reason: reason.value
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
