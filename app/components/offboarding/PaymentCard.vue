<template>
  <div class="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
    <div class="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0">
      <i class="bi bi-cash-coin text-white text-xl"></i>
    </div>
    <div>
      <p class="text-xs text-emerald-600 font-medium">Lịch thanh toán cuối</p>
      <p class="text-lg font-bold text-emerald-800 mt-0.5">{{ formattedDate }}</p>
      <p class="text-[11px] text-emerald-500 mt-0.5">Chốt lương + phép tồn + BHXH</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  paymentDate: { type: String, required: true },
})

const formattedDate = computed(() => {
  if (!props.paymentDate) return '—'
  return new Date(props.paymentDate).toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })
})
</script>
