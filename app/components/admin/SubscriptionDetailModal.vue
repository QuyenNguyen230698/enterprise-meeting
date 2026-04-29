<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="subscription?.type === 'email' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'">
              <i :class="subscription?.type === 'email' ? 'bi bi-envelope' : 'bi bi-arrow-repeat'" class="text-xl"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">Chi tiết Subscription</h2>
              <p class="text-xs text-gray-500">{{ subscription?.type === 'email' ? 'Email Package' : 'Conversion Package' }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <!-- User Info -->
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Thông tin User</h3>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                {{ getInitials(subscription?.userId?.email) }}
              </div>
              <div>
                <div class="font-bold text-gray-900">{{ subscription?.userId?.firstName }} {{ subscription?.userId?.lastName }}</div>
                <div class="text-sm text-gray-500">{{ subscription?.userId?.email }}</div>
                <div class="text-xs text-gray-400 mt-1">Code: {{ subscription?.userId?.userCode }}</div>
              </div>
            </div>
          </div>

          <!-- Subscription Info -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Gói</div>
              <div class="text-lg font-bold text-gray-900">{{ subscription?.plan || subscription?.packageSlug || subscription?.productId?.name || 'N/A' }}</div>
              <div class="text-sm text-gray-500">{{ subscription?.billingPeriod }}</div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Số tiền</div>
              <div class="text-lg font-bold text-green-600">{{ formatCurrency(subscription?.amount) }}</div>
              <div class="text-sm text-gray-500">{{ subscription?.currency || 'VND' }}</div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Trạng thái</div>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(subscription?.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(subscription?.status)"></span>
                {{ subscription?.status }}
              </span>
            </div>

            <div class="bg-gray-50 rounded-xl p-4">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Payment</div>
              <div class="text-lg font-bold text-gray-900">{{ subscription?.paymentProvider || subscription?.paymentMethod || 'N/A' }}</div>
              <div v-if="subscription?.paymentOrderCode" class="text-xs text-gray-500 font-mono">Order: {{ subscription.paymentOrderCode }}</div>
            </div>
          </div>

          <!-- Dates -->
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Thời gian</h3>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <div class="text-xs text-gray-400 mb-1">Ngày tạo</div>
                <div class="text-sm font-medium text-gray-900">{{ formatDateTime(subscription?.createdAt) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-400 mb-1">Ngày bắt đầu</div>
                <div class="text-sm font-medium text-gray-900">{{ formatDateTime(subscription?.startDate) }}</div>
              </div>
              <div>
                <div class="text-xs text-gray-400 mb-1">Ngày kết thúc</div>
                <div class="text-sm font-medium" :class="isExpiringSoon(subscription?.endDate) ? 'text-red-600' : 'text-gray-900'">
                  {{ formatDateTime(subscription?.endDate) }}
                  <span v-if="isExpiringSoon(subscription?.endDate)" class="text-xs ml-1">(sắp hết hạn)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div v-if="subscription?.features" class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Giới hạn</h3>
            <div class="grid grid-cols-3 gap-4">
              <div v-if="subscription.features.emailLimit">
                <div class="text-xs text-gray-400 mb-1">Email Limit</div>
                <div class="text-lg font-bold text-gray-900">{{ formatNumber(subscription.features.emailLimit) }}</div>
              </div>
              <div v-if="subscription.features.imageLimit">
                <div class="text-xs text-gray-400 mb-1">Image Limit</div>
                <div class="text-lg font-bold text-gray-900">{{ formatNumber(subscription.features.imageLimit) }}</div>
              </div>
              <div v-if="subscription.features.dailyConversionLimit">
                <div class="text-xs text-gray-400 mb-1">Daily Conversion</div>
                <div class="text-lg font-bold text-gray-900">{{ formatNumber(subscription.features.dailyConversionLimit) }}</div>
              </div>
            </div>
          </div>

          <!-- IDs -->
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">IDs</h3>
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between">
                <span class="text-gray-400">Subscription ID:</span>
                <span class="text-gray-600">{{ subscription?._id }}</span>
              </div>
              <div v-if="subscription?.productId" class="flex justify-between">
                <span class="text-gray-400">Product ID:</span>
                <span class="text-gray-600">{{ subscription.productId._id || subscription.productId }}</span>
              </div>
              <div v-if="subscription?.merchTxnRef" class="flex justify-between">
                <span class="text-gray-400">Merchant Ref:</span>
                <span class="text-gray-600">{{ subscription.merchTxnRef }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Đóng
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

defineEmits(['close'])

const getInitials = (email) => {
  if (!email) return 'NA'
  return email.substring(0, 2).toUpperCase()
}

const formatCurrency = (amount) => {
  if (!amount) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('vi-VN').format(num)
}

const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isExpiringSoon = (endDate) => {
  if (!endDate) return false
  const end = new Date(endDate)
  const now = new Date()
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return daysLeft <= 7 && daysLeft > 0
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-700',
    expired: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    superseded: 'bg-purple-100 text-purple-700'
  }
  return classes[status] || classes.pending
}

const getStatusDotClass = (status) => {
  const classes = {
    active: 'bg-green-500',
    expired: 'bg-gray-500',
    cancelled: 'bg-red-500',
    pending: 'bg-yellow-500',
    superseded: 'bg-purple-500'
  }
  return classes[status] || classes.pending
}
</script>
