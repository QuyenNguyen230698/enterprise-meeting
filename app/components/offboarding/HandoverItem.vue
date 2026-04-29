<template>
  <div
    class="flex items-start justify-between gap-3 p-3 rounded-xl border transition-colors"
    :class="confirmed ? 'bg-green-50 border-green-200' : rejected ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'"
  >
    <div class="flex items-start gap-2 flex-1 min-w-0">
      <i class="text-base mt-0.5 shrink-0" :class="confirmed ? 'bi bi-check-circle-fill text-green-500' : rejected ? 'bi bi-x-circle-fill text-red-500' : 'bi bi-circle text-gray-300'"></i>
      <div class="min-w-0">
        <p class="text-xs font-semibold" :class="confirmed ? 'text-green-800' : rejected ? 'text-red-800' : 'text-gray-700'">{{ title }}</p>
        <p class="text-[10px] text-gray-400 mt-0.5">{{ subtitle }}</p>
        <p v-if="confirmed && confirmedBy" class="text-[10px] text-green-600 mt-0.5">✓ {{ confirmedBy }} · {{ formatDate(date) }}</p>
        <p v-if="rejected && rejectedBy" class="text-[10px] text-red-600 mt-0.5">✕ {{ rejectedBy }} · {{ formatDate(rejectedDate) }}</p>
        <p v-if="rejected && rejectReason" class="text-[10px] text-red-700 mt-0.5">Lý do: {{ rejectReason }}</p>
      </div>
    </div>

    <div class="shrink-0 flex flex-col items-end gap-2">
      <NuxtLink
        v-if="linkUrl"
        :to="linkUrl"
        class="px-3 py-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg transition-colors"
      >
        {{ linkLabel || 'Mở Biên Bản' }}
      </NuxtLink>
      <div v-if="!confirmed" class="flex items-center gap-2">
        <button
          v-if="canReject"
          :disabled="loading"
          @click="showRejectBox = !showRejectBox"
          class="px-3 py-1.5 text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
        >
          Reject
        </button>
        <button
          v-if="canConfirm"
          :disabled="loading"
          @click="$emit('confirm')"
          class="px-3 py-1.5 text-[11px] font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors active:scale-95 disabled:opacity-50"
        >
          <i v-if="loading" class="bi bi-arrow-repeat animate-spin mr-1"></i>Xác nhận
        </button>
      </div>
      <div v-if="showRejectBox && canReject" class="w-52">
        <textarea
          v-model="rejectComment"
          rows="2"
          placeholder="Nhập lý do reject..."
          class="w-full text-[11px] border border-red-200 rounded-lg p-2 focus:border-red-400 focus:outline-none resize-none"
        />
        <button
          :disabled="loading || !rejectComment.trim()"
          @click="submitReject"
          class="mt-1 w-full px-2 py-1 text-[11px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
        >
          Xác nhận Reject
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:       { type: String,  required: true },
  subtitle:    { type: String,  required: true },
  confirmed:   { type: Boolean, required: true },
  confirmedBy: { type: String,  default: null },
  date:        { type: String,  default: null },
  rejected:    { type: Boolean, default: false },
  rejectedBy:  { type: String,  default: null },
  rejectedDate:{ type: String,  default: null },
  rejectReason:{ type: String,  default: null },
  canConfirm:  { type: Boolean, default: false },
  canReject:   { type: Boolean, default: false },
  loading:     { type: Boolean, default: false },
  linkUrl:     { type: String, default: null },
  linkLabel:   { type: String, default: null },
})
const emit = defineEmits(['confirm', 'reject'])

const showRejectBox = ref(false)
const rejectComment = ref('')

const submitReject = () => {
  if (!rejectComment.value.trim()) return
  emit('reject', rejectComment.value.trim())
  rejectComment.value = ''
  showRejectBox.value = false
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
