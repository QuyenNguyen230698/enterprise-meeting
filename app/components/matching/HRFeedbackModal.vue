<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 rounded-t-3xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <i class="bi bi-chat-heart-fill text-2xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold">Đánh Giá Ứng Viên</h2>
              <p class="text-sm text-indigo-100">{{ match.employee?.fullName }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-white/20 rounded-lg transition">
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Candidate Summary -->
        <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-200">
          <div class="flex items-start gap-4">
            <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0 shadow-sm">
              {{ match.employee?.fullName?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-lg text-gray-900 mb-2">{{ match.employee?.fullName }}</h3>
              <div class="flex flex-wrap gap-2 text-sm text-gray-600">
                <span class="flex items-center gap-1.5">
                  <i class="bi bi-briefcase text-gray-400"></i>
                  {{ match.employee?.desiredPosition }}
                </span>
                <span class="flex items-center gap-1.5">
                  <i class="bi bi-award text-gray-400"></i>
                  {{ match.employee?.experienceYears }} năm
                </span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg">
                  <i class="bi bi-check-circle-fill"></i>
                  {{ match.score }}% Phù Hợp
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback Options -->
        <div class="space-y-3">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <i class="bi bi-hand-thumbs-up text-indigo-600"></i>
            Đánh giá của bạn
          </h3>
          <p class="text-sm text-gray-600">Chọn một trong các lựa chọn sau:</p>

          <div class="grid grid-cols-1 gap-3">
            <!-- Interested -->
            <button
              @click="selectedStatus = 'interested'"
              :class="[
                'relative p-5 border-2 rounded-2xl transition-all text-left group overflow-hidden',
                selectedStatus === 'interested'
                  ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
              ]"
            >
              <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
              <div class="relative flex items-center gap-4">
                <div :class="[
                  'w-14 h-14 rounded-xl flex items-center justify-center transition-all',
                  selectedStatus === 'interested' ? 'bg-green-500 text-white shadow-lg' : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                ]">
                  <i class="bi bi-check-circle-fill text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-lg text-gray-900 mb-1">✅ Phù hợp - Quan tâm</h4>
                  <p class="text-sm text-gray-600">Ứng viên này rất phù hợp với vị trí tuyển dụng</p>
                </div>
                <div v-if="selectedStatus === 'interested'" class="shrink-0">
                  <i class="bi bi-check-circle-fill text-2xl text-green-500"></i>
                </div>
              </div>
            </button>

            <!-- Maybe -->
            <button
              @click="selectedStatus = 'maybe'"
              :class="[
                'relative p-5 border-2 rounded-2xl transition-all text-left group overflow-hidden',
                selectedStatus === 'maybe'
                  ? 'border-amber-500 bg-amber-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
              ]"
            >
              <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
              <div class="relative flex items-center gap-4">
                <div :class="[
                  'w-14 h-14 rounded-xl flex items-center justify-center transition-all',
                  selectedStatus === 'maybe' ? 'bg-amber-500 text-white shadow-lg' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                ]">
                  <i class="bi bi-question-circle-fill text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-lg text-gray-900 mb-1">🤔 Cân nhắc thêm</h4>
                  <p class="text-sm text-gray-600">Cần xem xét thêm hoặc phỏng vấn để quyết định</p>
                </div>
                <div v-if="selectedStatus === 'maybe'" class="shrink-0">
                  <i class="bi bi-check-circle-fill text-2xl text-amber-500"></i>
                </div>
              </div>
            </button>

            <!-- Not Interested -->
            <button
              @click="selectedStatus = 'not_interested'"
              :class="[
                'relative p-5 border-2 rounded-2xl transition-all text-left group overflow-hidden',
                selectedStatus === 'not_interested'
                  ? 'border-red-500 bg-red-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
              ]"
            >
              <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
              <div class="relative flex items-center gap-4">
                <div :class="[
                  'w-14 h-14 rounded-xl flex items-center justify-center transition-all',
                  selectedStatus === 'not_interested' ? 'bg-red-500 text-white shadow-lg' : 'bg-red-100 text-red-600 group-hover:bg-red-200'
                ]">
                  <i class="bi bi-x-circle-fill text-2xl"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-lg text-gray-900 mb-1">❌ Không phù hợp</h4>
                  <p class="text-sm text-gray-600">Ứng viên không đáp ứng yêu cầu của vị trí</p>
                </div>
                <div v-if="selectedStatus === 'not_interested'" class="shrink-0">
                  <i class="bi bi-check-circle-fill text-2xl text-red-500"></i>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Optional Note -->
        <div class="space-y-2">
          <label class="block font-semibold text-gray-900 flex items-center gap-2">
            <i class="bi bi-pencil text-gray-400"></i>
            Ghi chú (Tùy chọn)
          </label>
          <textarea
            v-model="note"
            rows="3"
            placeholder="Thêm ghi chú về ứng viên này..."
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
            maxlength="500"
          ></textarea>
          <p class="text-xs text-gray-500">{{ note.length }}/500 ký tự</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-3xl flex items-center justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
        >
          Hủy
        </button>
        <button
          @click="handleSubmit"
          :disabled="!selectedStatus || loading"
          class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <i class="bi bi-send-fill"></i>
          <span v-if="loading">Đang gửi...</span>
          <span v-else>Gửi Đánh Giá</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  match: {
    type: Object,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const selectedStatus = ref(null)
const note = ref('')
const loading = ref(false)

const handleSubmit = () => {
  if (!selectedStatus.value) return
  
  loading.value = true
  emit('submit', {
    status: selectedStatus.value,
    note: note.value.trim()
  })
}
</script>
