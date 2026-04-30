<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-lime-600 text-white px-6 py-4">
      <h3 class="font-bold text-lg flex items-center gap-2">
        <i class="bi bi-clock-history"></i>
        Lịch Sử Xem {{ userType === 'hr' ? 'CV' : 'Hồ Sơ' }}
      </h3>
      <p class="text-sm text-blue-100 mt-1">
        {{ history.length }} lượt xem
      </p>
    </div>

    <!-- Empty State -->
    <div v-if="history.length === 0" class="p-12 text-center">
      <div class="inline-flex p-6 bg-gray-100 rounded-full mb-4">
        <i class="bi bi-inbox text-4xl text-gray-400"></i>
      </div>
      <h4 class="font-semibold text-gray-900 mb-2">Chưa có lượt xem nào</h4>
      <p class="text-sm text-gray-600">
        {{ userType === 'hr' ? 'Chưa có ứng viên nào xem hồ sơ của bạn' : 'Chưa có công ty nào xem CV của bạn' }}
      </p>
    </div>

    <!-- Timeline -->
    <div v-else class="p-6">
      <div class="relative">
        <!-- Timeline Line -->
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <!-- Timeline Items -->
        <div class="space-y-6">
          <div
            v-for="(item, index) in history"
            :key="index"
            class="relative pl-16 group"
          >
            <!-- Timeline Dot -->
            <div :class="[
              'absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110',
              getFeedbackColor(item.feedback?.status).bg
            ]">
              <i :class="[
                'text-xl',
                getFeedbackColor(item.feedback?.status).icon,
                getFeedbackColor(item.feedback?.status).text
              ]"></i>
            </div>

            <!-- Content Card -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
              <!-- Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 mb-1">
                    {{ userType === 'hr' ? item.employee?.fullName : item.hr?.companyName }}
                  </h4>
                  <p class="text-sm text-gray-600 flex items-center gap-2">
                    <i class="bi bi-clock text-gray-400"></i>
                    {{ formatDateTime(item.viewedAt) }}
                  </p>
                </div>
                
                <!-- Feedback Badge -->
                <span v-if="item.feedback?.status" :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border',
                  getFeedbackColor(item.feedback.status).bg,
                  getFeedbackColor(item.feedback.status).text,
                  getFeedbackColor(item.feedback.status).border
                ]">
                  <i :class="getFeedbackColor(item.feedback.status).icon"></i>
                  {{ getFeedbackLabel(item.feedback.status) }}
                </span>
              </div>

              <!-- Details -->
              <div class="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
                <span v-if="item.source" class="flex items-center gap-1">
                  <i class="bi bi-link-45deg"></i>
                  {{ item.source }}
                </span>
                <span v-if="item.duration" class="flex items-center gap-1">
                  <i class="bi bi-stopwatch"></i>
                  {{ formatDuration(item.duration) }}
                </span>
                <span v-if="item.ipAddress" class="flex items-center gap-1">
                  <i class="bi bi-geo-alt"></i>
                  {{ item.ipAddress }}
                </span>
              </div>

              <!-- Feedback Note -->
              <div v-if="item.feedback?.note" class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-sm text-gray-700 italic">
                  <i class="bi bi-chat-quote text-gray-400 mr-1"></i>
                  "{{ item.feedback.note }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  history: {
    type: Array,
    required: true
  },
  userType: {
    type: String,
    required: true,
    validator: (value) => ['hr', 'employee'].includes(value)
  }
})

const getFeedbackColor = (status) => {
  const colors = {
    interested: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: 'bi-heart-fill'
    },
    maybe: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: 'bi-question-circle-fill'
    },
    not_interested: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: 'bi-x-circle-fill'
    }
  }
  return colors[status] || {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'bi-eye-fill'
  }
}

const getFeedbackLabel = (status) => {
  const labels = {
    interested: 'Quan tâm',
    maybe: 'Cân nhắc',
    not_interested: 'Không phù hợp'
  }
  return labels[status] || 'Đã xem'
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${seconds % 60}s`
}
</script>
