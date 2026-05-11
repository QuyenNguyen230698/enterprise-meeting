<template>
  <div class="grid grid-cols-12 border-b border-gray-300 min-h-[5rem]" :style="blockStyle">
    <div class="col-span-3 border-r border-gray-300 flex items-center justify-center px-3">
      <div class="text-center leading-tight w-full">
        <h2 class="font-black text-gray-900 tracking-tight text-base">Enterprise Meeting</h2>
        <div class="text-xs text-gray-500">Internal Platform</div>
      </div>
    </div>
    <div class="col-span-6 border-r border-gray-300 flex flex-col gap-1 items-center justify-center px-3 text-center">
      <p class="text-xs text-gray-500">Enterprise Meeting Co., Ltd.</p>
      <input
        v-if="editable"
        :value="titleVn"
        @input="emit('update:titleVn', $event.target.value)"
        class="text-sm font-bold text-gray-900 text-center bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 w-full"
        placeholder="TÊN VĂN BẢN (TIẾNG VIỆT)"
      />
      <p v-else class="text-sm font-bold text-gray-900">{{ titleVn || 'TÊN VĂN BẢN' }}</p>
      <input
        v-if="editable"
        :value="titleEn"
        @input="emit('update:titleEn', $event.target.value)"
        class="text-xs italic text-gray-600 text-center bg-transparent border-b border-dashed border-gray-200 focus:outline-none focus:border-blue-400 w-full"
        placeholder="DOCUMENT TITLE (ENGLISH)"
      />
      <p v-else class="text-xs italic text-gray-600">{{ titleEn || 'DOCUMENT TITLE' }}</p>
    </div>
    <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
      <p class="text-xs text-gray-500">ISO Document Code</p>
      <input
        v-if="editable"
        :value="code"
        @input="emit('update:code', $event.target.value)"
        class="text-xs font-bold text-gray-800 text-center bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500"
        placeholder="QF-HRM-XX"
      />
      <p v-else class="text-xs font-bold text-gray-800">{{ code || 'QF-HRM-XX' }}</p>
      <p class="text-xs text-gray-500 mt-1">Số hiệu / No.</p>
      <p class="text-xs font-semibold text-blue-700">{{ docRef || '[Tự động]' }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  titleVn: String,
  titleEn: String,
  code: String,
  docRef: String,
  editable: { type: Boolean, default: true },
  blockStyle: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:titleVn', 'update:titleEn', 'update:code'])
</script>
