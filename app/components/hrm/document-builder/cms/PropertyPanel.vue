<template>
  <div class="w-56 shrink-0 bg-white border-l border-gray-100 overflow-y-auto flex flex-col">

    <!-- No selection -->
    <div v-if="!block" class="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <i class="bi bi-cursor text-3xl text-gray-200 mb-2"></i>
      <p class="text-xs text-gray-400 font-medium">Chọn một khối để chỉnh sửa thuộc tính</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <i :class="[blockIcon, 'text-sm text-blue-600']"></i>
          <p class="text-xs font-bold text-gray-700">{{ blockLabel }}</p>
        </div>
        <button @click="store.clearSelection()" class="text-gray-400 hover:text-gray-600 p-0.5">
          <i class="bi bi-x text-base"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3 space-y-4">

        <!-- Block-level typography (for header, richtext, legal, divider) -->
        <div v-if="showBlockStyle" class="space-y-3">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Kiểu chữ khối</p>

          <!-- Font size -->
          <div>
            <label class="text-xs text-gray-600 font-medium block mb-1">Cỡ chữ</label>
            <div class="flex gap-1">
              <button
                v-for="sz in fontSizes"
                :key="sz.value"
                @click="updateStyle('fontSize', sz.value)"
                class="flex-1 py-1 text-xs font-semibold rounded-lg border transition-colors"
                :class="block.style?.fontSize === sz.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
              >{{ sz.label }}</button>
            </div>
          </div>

          <!-- Font weight + style -->
          <div>
            <label class="text-xs text-gray-600 font-medium block mb-1">Định dạng</label>
            <div class="flex gap-1">
              <button
                @click="toggleStyle('fontWeight', 'bold', 'normal')"
                class="w-8 h-8 rounded-lg border text-sm font-bold transition-colors"
                :class="block.style?.fontWeight === 'bold'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                title="In đậm"
              ><strong>B</strong></button>
              <button
                @click="toggleStyle('fontStyle', 'italic', 'normal')"
                class="w-8 h-8 rounded-lg border text-sm transition-colors"
                :class="block.style?.fontStyle === 'italic'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                title="In nghiêng"
              ><em>I</em></button>
              <button
                @click="toggleStyle('textDecoration', 'underline', 'none')"
                class="w-8 h-8 rounded-lg border text-sm transition-colors"
                :class="block.style?.textDecoration === 'underline'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                title="Gạch chân"
              ><u>U</u></button>
            </div>
          </div>

          <!-- Text align -->
          <div>
            <label class="text-xs text-gray-600 font-medium block mb-1">Căn lề</label>
            <div class="flex gap-1">
              <button
                v-for="align in aligns"
                :key="align.value"
                @click="updateStyle('textAlign', align.value)"
                class="flex-1 h-8 rounded-lg border text-sm transition-colors flex items-center justify-center"
                :class="block.style?.textAlign === align.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
                :title="align.label"
              ><i :class="align.icon"></i></button>
            </div>
          </div>

          <!-- Text color -->
          <div>
            <label class="text-xs text-gray-600 font-medium block mb-1">Màu chữ</label>
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="c in textColors"
                :key="c.value"
                @click="updateStyle('color', c.value)"
                class="w-6 h-6 rounded-full border-2 transition-all"
                :style="{ backgroundColor: c.value }"
                :class="block.style?.color === c.value ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'"
                :title="c.label"
              ></button>
            </div>
          </div>
        </div>

        <!-- Checklist item editor -->
        <div v-if="block.type === 'checklist'" class="space-y-3">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Danh sách mục</p>
          <div
            v-for="item in block.content?.items || []"
            :key="item.id"
            class="border border-gray-200 rounded-xl p-2 space-y-2"
          >
            <input
              :value="item.text"
              @input="updateItemText(item.id, $event.target.value)"
              class="w-full text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Nội dung mục..."
            />
            <!-- Per-item style -->
            <div class="flex gap-1">
              <button
                @click="toggleItemStyle(item.id, 'fontWeight', 'bold', 'normal')"
                class="w-6 h-6 rounded border text-[10px] font-bold transition-colors"
                :class="item.style?.fontWeight === 'bold' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'"
              ><strong>B</strong></button>
              <button
                @click="toggleItemStyle(item.id, 'fontStyle', 'italic', 'normal')"
                class="w-6 h-6 rounded border text-[10px] transition-colors"
                :class="item.style?.fontStyle === 'italic' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'"
              ><em>I</em></button>
              <button
                @click="toggleItemStyle(item.id, 'textDecoration', 'underline', 'none')"
                class="w-6 h-6 rounded border text-[10px] transition-colors"
                :class="item.style?.textDecoration === 'underline' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600'"
              ><u>U</u></button>
              <select
                :value="item.style?.fontSize || '13'"
                @change="updateItemStyle(item.id, 'fontSize', $event.target.value)"
                class="ml-auto text-[10px] border border-gray-200 rounded px-1 focus:outline-none"
              >
                <option v-for="sz in fontSizes" :key="sz.value" :value="sz.value">{{ sz.label }}</option>
              </select>
              <button
                @click="store.removeChecklistItem(block.id, item.id)"
                class="ml-1 text-red-400 hover:text-red-600 text-xs"
              ><i class="bi bi-x"></i></button>
            </div>
          </div>
          <button
            @click="store.addChecklistItem(block.id)"
            class="w-full py-1.5 text-xs font-semibold text-blue-600 border border-dashed border-blue-300 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <i class="bi bi-plus mr-1"></i>Thêm mục
          </button>
        </div>

        <!-- Table column editor -->
        <div v-if="block.type === 'table'" class="space-y-3">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Cột bảng</p>
          <div
            v-for="col in block.content?.headers || []"
            :key="col.key"
            class="flex items-center gap-1.5"
          >
            <input
              :value="col.label"
              @input="store.updateTableHeaderLabel(block.id, col.key, $event.target.value)"
              class="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Tên cột..."
            />
            <button
              @click="store.removeTableColumn(block.id, col.key)"
              class="text-red-400 hover:text-red-600 text-xs shrink-0 p-1"
            ><i class="bi bi-trash3"></i></button>
          </div>
          <div class="flex gap-1.5">
            <button
              @click="store.addTableColumn(block.id)"
              class="flex-1 py-1.5 text-xs font-semibold text-blue-600 border border-dashed border-blue-300 rounded-xl hover:bg-blue-50 transition-colors"
            ><i class="bi bi-plus mr-1"></i>Thêm cột</button>
            <button
              @click="store.addTableRow(block.id)"
              class="flex-1 py-1.5 text-xs font-semibold text-green-600 border border-dashed border-green-300 rounded-xl hover:bg-green-50 transition-colors"
            ><i class="bi bi-plus mr-1"></i>Thêm hàng</button>
          </div>
        </div>

        <!-- Party block config -->
        <div v-if="block.type === 'party'" class="space-y-3">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Cấu hình bên</p>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="block.content?.showPartyB"
              @change="store.updateBlockContent(block.id, { showPartyB: $event.target.checked })"
              class="w-4 h-4 accent-blue-600"
            />
            <span class="text-xs text-gray-700 font-medium">Hiển thị Bên B</span>
          </label>
          <div v-if="block.content?.showPartyB" class="space-y-2">
            <div>
              <label class="text-xs text-gray-500 font-medium">Nhãn Bên B (VN)</label>
              <input
                :value="block.content?.partyBLabel"
                @input="store.updateBlockContent(block.id, { partyBLabel: $event.target.value })"
                class="w-full mt-0.5 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="VD: Bên nhận"
              />
            </div>
            <div>
              <label class="text-xs text-gray-500 font-medium">Nhãn Bên B (EN)</label>
              <input
                :value="block.content?.partyBLabelEn"
                @input="store.updateBlockContent(block.id, { partyBLabelEn: $event.target.value })"
                class="w-full mt-0.5 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="VD: Recipient"
              />
            </div>
          </div>
        </div>

        <!-- Divider label -->
        <div v-if="block.type === 'divider'" class="space-y-2">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Tiêu mục</p>
          <input
            :value="block.content?.label"
            @input="store.updateBlockContent(block.id, { label: $event.target.value })"
            class="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            placeholder="VD: II. Nội dung thỏa thuận (để trống = đường kẻ)"
          />
        </div>

        <!-- Block actions -->
        <div class="space-y-2 border-t border-gray-100 pt-3">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Vị trí</p>
          <div class="flex gap-1.5">
            <button
              @click="store.moveBlockUp(block.id)"
              class="flex-1 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            ><i class="bi bi-arrow-up mr-1"></i>Lên</button>
            <button
              @click="store.moveBlockDown(block.id)"
              class="flex-1 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            ><i class="bi bi-arrow-down mr-1"></i>Xuống</button>
          </div>
          <button
            v-if="block.type !== 'header'"
            @click="store.removeBlock(block.id)"
            class="w-full py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            <i class="bi bi-trash3 mr-1"></i>Xóa khối này
          </button>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'

const store = useDocumentBuilderStore()
const block = computed(() => store.selectedBlock)

const BLOCK_META = {
  header: { label: 'Tiêu đề văn bản', icon: 'bi bi-building' },
  party: { label: 'Thông tin các bên', icon: 'bi bi-people' },
  legal: { label: 'Căn cứ pháp lý', icon: 'bi bi-balance-scale' },
  richtext: { label: 'Đoạn văn bản', icon: 'bi bi-textarea-t' },
  table: { label: 'Bảng dữ liệu', icon: 'bi bi-table' },
  checklist: { label: 'Danh sách tick', icon: 'bi bi-check2-square' },
  divider: { label: 'Phân cách', icon: 'bi bi-dash-lg' },
  signature: { label: 'Ô chữ ký', icon: 'bi bi-pen' },
}
const blockLabel = computed(() => BLOCK_META[block.value?.type]?.label || block.value?.type)
const blockIcon = computed(() => BLOCK_META[block.value?.type]?.icon || 'bi bi-box')

const showBlockStyle = computed(() =>
  block.value && ['header', 'richtext', 'legal', 'divider'].includes(block.value.type)
)

const fontSizes = [
  { label: 'XS', value: '11' },
  { label: 'S', value: '12' },
  { label: 'M', value: '13' },
  { label: 'L', value: '15' },
  { label: 'XL', value: '18' },
]

const aligns = [
  { value: 'left', label: 'Trái', icon: 'bi bi-text-left' },
  { value: 'center', label: 'Giữa', icon: 'bi bi-text-center' },
  { value: 'right', label: 'Phải', icon: 'bi bi-text-right' },
]

const textColors = [
  { value: '#111827', label: 'Đen' },
  { value: '#1d4ed8', label: 'Xanh dương' },
  { value: '#166534', label: 'Xanh lá' },
  { value: '#991b1b', label: 'Đỏ' },
  { value: '#92400e', label: 'Nâu' },
  { value: '#6b7280', label: 'Xám' },
]

const updateStyle = (key, val) => {
  if (block.value) store.updateBlockStyle(block.value.id, { [key]: val })
}

const toggleStyle = (key, onVal, offVal) => {
  if (!block.value) return
  const current = block.value.style?.[key]
  store.updateBlockStyle(block.value.id, { [key]: current === onVal ? offVal : onVal })
}

const updateItemText = (itemId, text) => {
  if (!block.value) return
  const item = block.value.content?.items?.find(i => i.id === itemId)
  if (item) item.text = text
}

const toggleItemStyle = (itemId, key, onVal, offVal) => {
  if (!block.value) return
  const item = block.value.content?.items?.find(i => i.id === itemId)
  if (!item) return
  const current = item.style?.[key]
  store.updateChecklistItemStyle(block.value.id, itemId, { [key]: current === onVal ? offVal : onVal })
}

const updateItemStyle = (itemId, key, val) => {
  if (!block.value) return
  store.updateChecklistItemStyle(block.value.id, itemId, { [key]: val })
}
</script>
