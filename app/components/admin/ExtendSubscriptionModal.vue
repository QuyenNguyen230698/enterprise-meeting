<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <i class="bi bi-calendar-plus text-xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">Gia hạn Subscription</h2>
              <p class="text-xs text-gray-500">{{ subscription?.userId?.email }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <!-- Current Info -->
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-gray-400 mb-1">Gói hiện tại</div>
                <div class="font-bold text-gray-900">{{ subscription?.plan || subscription?.packageSlug }}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-400 mb-1">Ngày hết hạn</div>
                <div class="font-bold" :class="isExpiringSoon(subscription?.endDate) ? 'text-red-600' : 'text-gray-900'">
                  {{ formatDate(subscription?.endDate) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Extension Type -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Loại gia hạn</label>
            <div class="flex gap-2">
              <button
                @click="extensionType = 'days'"
                class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
                :class="extensionType === 'days'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                Theo ngày
              </button>
              <button
                @click="extensionType = 'months'"
                class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
                :class="extensionType === 'months'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                Theo tháng
              </button>
            </div>
          </div>

          <!-- Duration Input -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Số {{ extensionType === 'days' ? 'ngày' : 'tháng' }} gia hạn
            </label>
            <input
              v-model.number="duration"
              type="number"
              min="1"
              :max="extensionType === 'days' ? 365 : 24"
              class="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :placeholder="extensionType === 'days' ? '30' : '1'"
            />
          </div>

          <!-- Quick Select -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Chọn nhanh</label>
            <div class="flex flex-wrap gap-2">
              <template v-if="extensionType === 'days'">
                <button v-for="d in [7, 14, 30, 60, 90]" :key="d" @click="duration = d"
                  class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  :class="duration === d ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  {{ d }} ngày
                </button>
              </template>
              <template v-else>
                <button v-for="m in [1, 3, 6, 12]" :key="m" @click="duration = m"
                  class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  :class="duration === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                >
                  {{ m }} tháng
                </button>
              </template>
            </div>
          </div>

          <!-- New End Date Preview -->
          <div v-if="duration > 0" class="bg-green-50 border border-green-100 rounded-xl p-4">
            <div class="flex items-center gap-2 text-green-700">
              <i class="bi bi-calendar-check"></i>
              <span class="text-sm font-medium">Ngày hết hạn mới:</span>
              <span class="font-bold">{{ formatDate(newEndDate) }}</span>
            </div>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Lý do (tùy chọn)</label>
            <textarea
              v-model="reason"
              rows="2"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="VD: Gia hạn theo yêu cầu hỗ trợ..."
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Hủy
          </button>
          <button
            @click="handleSave"
            :disabled="!duration || duration <= 0 || saving"
            class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <i v-if="saving" class="bi bi-arrow-repeat animate-spin"></i>
            <span>{{ saving ? 'Đang xử lý...' : 'Gia hạn' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  subscription: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const extensionType = ref('days')
const duration = ref(30)
const reason = ref('')
const saving = ref(false)

const newEndDate = computed(() => {
  if (!props.subscription?.endDate || !duration.value) return null

  const currentEnd = new Date(props.subscription.endDate)
  if (extensionType.value === 'days') {
    currentEnd.setDate(currentEnd.getDate() + duration.value)
  } else {
    currentEnd.setMonth(currentEnd.getMonth() + duration.value)
  }
  return currentEnd
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const isExpiringSoon = (endDate) => {
  if (!endDate) return false
  const end = new Date(endDate)
  const now = new Date()
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return daysLeft <= 7 && daysLeft > 0
}

const handleSave = () => {
  if (!duration.value || duration.value <= 0) return

  saving.value = true

  const data = {
    reason: reason.value || 'Admin extended'
  }

  if (extensionType.value === 'days') {
    data.days = duration.value
  } else {
    data.months = duration.value
  }

  emit('save', data)

  // Reset saving after a bit in case parent doesn't close modal
  setTimeout(() => {
    saving.value = false
  }, 3000)
}

// Reset when type changes
watch(extensionType, () => {
  duration.value = extensionType.value === 'days' ? 30 : 1
})
</script>
