<template>
  <div class="bg-white border border-gray-300 overflow-hidden shadow-sm">
    <div class="grid grid-cols-12 border-b border-gray-300 min-h-22">
      <div class="col-span-3 border-r border-gray-300 flex items-center justify-center px-3">
        <div class="text-center leading-tight">
          <h2 class="font-extrabold text-lg text-gray-900 tracking-tight">Enterprise Meeting</h2>
          <p class="text-xs text-gray-500">Internal Platform</p>
        </div>
      </div>
      <div class="col-span-6 border-r border-gray-300 flex flex-col items-center justify-center px-3 text-center">
        <p class="text-xs text-gray-500">Enterprise Meeting Co., Ltd.</p>
        <p class="text-base font-bold text-gray-900">BIÊN BẢN BÀN GIAO</p>
        <p class="text-xs italic text-gray-600">HANDOVER FORM</p>
      </div>
      <div class="col-span-3 flex flex-col justify-center px-3 py-2 text-center">
        <p class="text-xs text-gray-500">Form Code</p>
        <p class="text-xs font-bold text-gray-800">QF-HRA-{{ stepNum === 1 ? '17' : stepNum === 2 ? '12' : '11' }}</p>
        <p class="text-xs text-gray-500 mt-1">Status</p>
        <p class="text-xs font-semibold" :class="confirmed ? 'text-green-700' : canConfirm ? 'text-amber-700' : 'text-gray-500'">
          {{ confirmed ? 'CONFIRMED' : canConfirm ? 'PENDING' : 'WAITING' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-12 text-[13px]">
      <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Mục / Section
      </div>
      <div class="col-span-10 border-b border-gray-300 px-3 py-2 font-semibold text-gray-900">
        {{ title }}
      </div>
      <div class="col-span-2 border-r border-b border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Mô tả / Description
      </div>
      <div class="col-span-10 border-b border-gray-300 px-3 py-2 text-gray-700">
        {{ subtitle }}
      </div>
      <div class="col-span-2 border-r border-gray-300 px-3 py-2 font-semibold text-gray-700">
        Vai trò xác nhận
      </div>
      <div class="col-span-10 px-3 py-2 font-medium text-gray-800">
        {{ confirmerRole }}
      </div>
    </div>

    <div class="border-t border-gray-300">
      <div class="border-b border-gray-300 px-3 py-2 bg-gray-50">
        <p class="text-[13px] font-semibold text-gray-700">
          Phần B — Danh sách checklist bàn giao
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-160 border-collapse table-fixed text-xs">
          <thead class="bg-blue-800 text-white">
            <tr>
              <th class="w-14 border border-blue-600 px-2 py-2 text-center">#</th>
              <th class="border border-blue-600 px-2 py-2 text-left">Nội dung bàn giao / Handover item</th>
              <th class="w-28 border border-blue-600 px-2 py-2 text-center">Xác nhận</th>
            </tr>
          </thead>
          <tbody class="text-gray-800">
            <tr v-for="(item, idx) in checklistItems" :key="item.key">
              <td class="border border-gray-300 px-2 py-2 text-center font-semibold">{{ idx + 1 }}</td>
              <td class="border border-gray-300 px-2 py-2">
                <p class="font-medium text-sm">{{ item.label }}</p>
                <p v-if="item.hint" class="text-[11px] text-gray-500 mt-0.5">{{ item.hint }}</p>
              </td>
              <td class="border border-gray-300 px-2 py-2 text-center">
                <input
                  type="checkbox"
                  v-model="checkedItems[item.key]"
                  :disabled="!canConfirm || confirmed"
                  class="accent-green-600 w-4 h-4"
                />
              </td>
            </tr>
            <tr v-if="!checklistItems.length">
              <td colspan="3" class="border border-gray-300 px-3 py-3 text-center text-gray-500">
                Không có checklist cho bước này.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="confirmed" class="border-t border-b border-gray-300 px-3 py-2 bg-green-50">
        <p class="text-sm font-semibold text-green-800">Đã xác nhận bàn giao</p>
        <p class="text-xs text-green-700 mt-1">Bởi {{ confirmedBy || '—' }} · {{ formatDate(confirmedDate) }}</p>
        <p v-if="confirmedNotes" class="text-xs text-green-700 mt-1 italic">"{{ confirmedNotes }}"</p>
      </div>

      <div v-if="!confirmed && canConfirm" class="border-b border-gray-300 px-3 py-2">
        <label class="text-xs font-semibold text-gray-500 mb-1.5 block">Ghi chú xác nhận (tuỳ chọn)</label>
        <textarea
          v-model="notes"
          rows="2"
          placeholder="Ghi chú thêm..."
          class="w-full text-sm border border-gray-300 rounded-sm p-2 focus:border-green-500 focus:outline-none resize-none"
        />
      </div>

      <template v-if="linkUrl">
        <div class="px-3 py-2 bg-teal-50">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-teal-800">Bước này được xử lý qua biên bản riêng</p>
              <p v-if="linkedStatusLabel" class="text-xs text-teal-600 mt-0.5">
                Trạng thái: <span class="font-semibold">{{ linkedStatusLabel }}</span>
              </p>
            </div>
            <NuxtLink
              :to="linkUrl"
              class="shrink-0 px-3 py-2 text-xs font-semibold text-teal-700 bg-white border border-teal-300 hover:bg-teal-100 rounded-sm transition-colors"
            >
              {{ linkLabel || 'Xem biên bản' }}
            </NuxtLink>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-if="!confirmed && canConfirm" class="px-3 py-2 border-t border-gray-300 flex items-center justify-between gap-3">
          <p v-if="!allChecked" class="text-[11px] text-amber-700">
            Vui lòng tick đầy đủ checklist trước khi xác nhận.
          </p>
          <button
            :disabled="!allChecked || loading"
            @click="$emit('confirm', notes)"
            class="ml-auto px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i v-if="loading" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-check2-all"></i>
            Xác nhận bàn giao
          </button>
        </div>

        <div v-if="!confirmed && !canConfirm" class="px-3 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-300">
          Bàn giao này cần được xác nhận bởi {{ confirmerRole }}.
        </div>
      </template>
    </div>

    <div class="grid grid-cols-12 border-t border-gray-300 text-xs">
      <div class="col-span-4 border-r border-gray-300 px-3 py-2 min-h-20">
        <p class="font-semibold text-gray-700">Người xác nhận / Confirmed by</p>
        <p class="mt-2 font-semibold text-gray-900">{{ confirmedBy || '—' }}</p>
      </div>
      <div class="col-span-4 border-r border-gray-300 px-3 py-2 min-h-20">
        <p class="font-semibold text-gray-700">Ngày / Date</p>
        <p class="mt-2 font-semibold text-gray-900">{{ formatDate(confirmedDate) }}</p>
      </div>
      <div class="col-span-4 px-3 py-2 min-h-20">
        <p class="font-semibold text-gray-700">Ghi chú / Notes</p>
        <p class="mt-2 text-gray-800">{{ confirmedNotes || '—' }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  stepNum:        { type: Number,  required: true },
  title:          { type: String,  required: true },
  subtitle:       { type: String,  required: true },
  confirmerRole:  { type: String,  required: true },
  checklistItems: { type: Array,   default: () => [] },
  confirmed:      { type: Boolean, required: true },
  confirmedBy:    { type: String,  default: null },
  confirmedDate:  { type: String,  default: null },
  confirmedNotes: { type: String,  default: null },
  canConfirm:     { type: Boolean, default: false },
  loading:        { type: Boolean, default: false },
  // Link mode — thay thế nút confirm bằng link đến trang xử lý riêng
  linkUrl:        { type: String,  default: null },
  linkLabel:      { type: String,  default: null },
  linkedStatus:   { type: String,  default: null },
})

const LINKED_STATUS_LABEL = {
  DRAFT: 'Bản nháp',
  PENDING_EMPLOYEE_SIGN: 'Chờ nhân viên ký',
  PENDING_HR_CONFIRM: 'Chờ HR xác nhận',
  COMPLETED: 'Hoàn tất',
  REJECTED: 'Từ chối',
}
const linkedStatusLabel = computed(() => props.linkedStatus ? (LINKED_STATUS_LABEL[props.linkedStatus] ?? props.linkedStatus) : '')

defineEmits(['confirm'])

const notes    = ref('')

const checkedItems = reactive(
  Object.fromEntries(props.checklistItems.map(i => [i.key, false]))
)

const allChecked = computed(() =>
  props.checklistItems.length === 0 || props.checklistItems.every(i => checkedItems[i.key])
)

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }
.slide-down-enter-to, .slide-down-leave-from { max-height: 600px; opacity: 1; }
</style>
