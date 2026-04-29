<template>
  <div class="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
    <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
      <i class="bi bi-envelope-check-fill text-emerald-600 text-base"></i>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-emerald-800">
        Email xác nhận đã gửi tới nhân viên
      </p>
      <p class="text-xs text-emerald-600 mt-0.5">
        Hướng dẫn hoàn tất bàn giao đã được gửi:
        <span class="font-medium">HO-1 (QF-HRA-17)</span> ·
        <span class="font-medium">HO-2 (QF-HRA-12)</span> ·
        <span class="font-medium">HO-3 (QF-HRA-11)</span>
      </p>
    </div>
    <span class="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
      Đã gửi
    </span>
  </div>
</template>

<script setup>
defineProps({
  process: { type: Object, required: true },
})
</script>
