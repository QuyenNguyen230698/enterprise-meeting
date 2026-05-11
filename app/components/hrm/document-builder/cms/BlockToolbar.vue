<template>
  <div class="w-48 shrink-0 bg-white border-r border-gray-100 overflow-y-auto flex flex-col">
    <div class="px-3 py-2.5 border-b border-gray-100">
      <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Khối nội dung</p>
    </div>

    <div class="p-2 flex flex-col gap-1">
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-2 pt-1 pb-0.5">Cấu trúc</p>

      <button
        v-for="block in structureBlocks"
        :key="block.type"
        @click="emit('add', block.type)"
        class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
      >
        <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors" :class="block.iconBg">
          <i :class="[block.icon, block.iconColor, 'text-sm']"></i>
        </div>
        <span class="leading-tight">{{ block.label }}</span>
      </button>

      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-2 pt-3 pb-0.5">Nội dung</p>

      <button
        v-for="block in contentBlocks"
        :key="block.type"
        @click="emit('add', block.type)"
        class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
      >
        <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors" :class="block.iconBg">
          <i :class="[block.icon, block.iconColor, 'text-sm']"></i>
        </div>
        <span class="leading-tight">{{ block.label }}</span>
      </button>

      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-2 pt-3 pb-0.5">Đặc biệt</p>

      <button
        v-for="block in specialBlocks"
        :key="block.type"
        @click="emit('add', block.type)"
        class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
      >
        <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors" :class="block.iconBg">
          <i :class="[block.icon, block.iconColor, 'text-sm']"></i>
        </div>
        <span class="leading-tight">{{ block.label }}</span>
      </button>
    </div>

    <!-- Tips -->
    <div class="mt-auto p-3 mx-2 mb-2 bg-blue-50 rounded-xl border border-blue-100">
      <p class="text-[10px] text-blue-600 font-semibold leading-relaxed">
        <i class="bi bi-lightbulb mr-1"></i>
        Click để thêm khối. Dùng ↑↓ trong canvas để sắp xếp thứ tự.
      </p>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['add'])

const structureBlocks = [
  { type: 'header', label: 'Tiêu đề văn bản', icon: 'bi bi-building', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { type: 'party', label: 'Thông tin các bên', icon: 'bi bi-people', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { type: 'divider', label: 'Phân cách / Tiêu mục', icon: 'bi bi-dash-lg', iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
]

const contentBlocks = [
  { type: 'richtext', label: 'Đoạn văn bản', icon: 'bi bi-textarea-t', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { type: 'table', label: 'Bảng dữ liệu', icon: 'bi bi-table', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { type: 'checklist', label: 'Danh sách tick', icon: 'bi bi-check2-square', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
]

const specialBlocks = [
  { type: 'legal', label: 'Căn cứ pháp lý', icon: 'bi bi-balance-scale', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { type: 'signature', label: 'Ô chữ ký', icon: 'bi bi-pen', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
]
</script>
