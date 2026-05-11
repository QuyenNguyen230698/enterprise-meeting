<template>
  <div class="h-full overflow-y-auto bg-gray-100 p-4">
    <!-- A4 canvas -->
    <div class="a4-canvas mx-auto bg-white shadow-lg border border-gray-200 rounded-sm">

      <!-- Empty state -->
      <div
        v-if="store.sortedBlocks.length === 0"
        class="h-64 flex flex-col items-center justify-center text-center p-8"
      >
        <i class="bi bi-file-earmark-plus text-4xl text-gray-200 mb-3"></i>
        <p class="text-sm text-gray-400 font-medium">Canvas trống</p>
        <p class="text-xs text-gray-400 mt-1">Chọn loại văn bản hoặc kéo khối từ thanh bên trái</p>
      </div>

      <!-- Blocks -->
      <div
        v-for="block in store.sortedBlocks"
        :key="block.id"
        class="relative group"
        :class="{ 'ring-2 ring-blue-400 ring-inset': store.selectedBlockId === block.id }"
        @click.stop="store.selectBlock(block.id)"
        :draggable="true"
        @dragstart="onDragStart(block.id)"
        @dragover.prevent="onDragOver(block.id)"
        @drop.prevent="onDrop(block.id)"
      >
        <!-- Block controls overlay -->
        <div
          class="absolute top-0 right-0 z-10 flex items-center gap-0.5 p-0.5 bg-blue-600 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"
          :class="{ 'opacity-100': store.selectedBlockId === block.id }"
          @click.stop
        >
          <button @click="store.moveBlockUp(block.id)" class="block-ctrl-btn" title="Lên">
            <i class="bi bi-arrow-up text-[10px]"></i>
          </button>
          <button @click="store.moveBlockDown(block.id)" class="block-ctrl-btn" title="Xuống">
            <i class="bi bi-arrow-down text-[10px]"></i>
          </button>
          <div class="w-px h-3 bg-blue-400"></div>
          <button
            v-if="block.type !== 'header'"
            @click="store.removeBlock(block.id)"
            class="block-ctrl-btn hover:bg-red-500"
            title="Xóa"
          ><i class="bi bi-trash3 text-[10px]"></i></button>
          <!-- Drag handle -->
          <span class="block-ctrl-btn cursor-grab active:cursor-grabbing" title="Kéo để sắp xếp">
            <i class="bi bi-grip-vertical text-[10px]"></i>
          </span>
        </div>

        <!-- Block type label -->
        <div
          v-if="store.selectedBlockId === block.id"
          class="absolute top-0 left-0 z-10 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-br-lg"
        >{{ blockTypeLabel(block.type) }}</div>

        <!-- ── Block renders ─────────────────────────────────────────────── -->

        <HrmDocumentBuilderCmsBlocksBlockHeader
          v-if="block.type === 'header'"
          :titleVn="store.template.titleVn"
          :titleEn="store.template.titleEn"
          :code="store.template.code"
          :blockStyle="computedStyle(block)"
          @update:titleVn="store.template.titleVn = $event"
          @update:titleEn="store.template.titleEn = $event"
          @update:code="store.template.code = $event"
        />

        <HrmDocumentBuilderCmsBlocksBlockParty
          v-else-if="block.type === 'party'"
          :content="block.content"
          :blockStyle="computedStyle(block)"
          @update:content="store.updateBlockContent(block.id, $event)"
        />

        <HrmDocumentBuilderCmsBlocksBlockLegal
          v-else-if="block.type === 'legal'"
          :content="block.content"
          :blockStyle="computedStyle(block)"
          @update:content="store.updateBlockContent(block.id, $event)"
        />

        <HrmDocumentBuilderCmsBlocksBlockRichText
          v-else-if="block.type === 'richtext'"
          :content="block.content"
          :blockStyle="computedStyle(block)"
          @update:content="store.updateBlockContent(block.id, $event)"
        />

        <HrmDocumentBuilderCmsBlocksBlockTable
          v-else-if="block.type === 'table'"
          :blockId="block.id"
          :content="block.content"
          :blockStyle="computedStyle(block)"
        />

        <HrmDocumentBuilderCmsBlocksBlockChecklist
          v-else-if="block.type === 'checklist'"
          :blockId="block.id"
          :content="block.content"
          :blockStyle="computedStyle(block)"
        />

        <HrmDocumentBuilderCmsBlocksBlockDivider
          v-else-if="block.type === 'divider'"
          :content="block.content"
          :blockStyle="computedStyle(block)"
          @update:content="store.updateBlockContent(block.id, $event)"
        />

        <HrmDocumentBuilderCmsBlocksBlockSignature
          v-else-if="block.type === 'signature'"
          :signers="store.template.signers"
          :editable="true"
        />

        <!-- Drop indicator -->
        <div
          v-if="dragOverId === block.id && dragId !== block.id"
          class="h-0.5 bg-blue-500 mx-3 rounded-full"
        ></div>
      </div>

      <!-- Drop zone at bottom -->
      <div
        class="h-8 flex items-center justify-center border-t border-dashed border-gray-200 mt-2 mx-3 mb-3"
        @dragover.prevent
        @drop.prevent="onDropBottom"
      >
        <span class="text-[10px] text-gray-300">Thả khối vào đây</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'

const store = useDocumentBuilderStore()

const BLOCK_LABELS = {
  header: 'Tiêu đề',
  party: 'Các bên',
  legal: 'Căn cứ PL',
  richtext: 'Đoạn văn',
  table: 'Bảng',
  checklist: 'Danh sách',
  divider: 'Phân cách',
  signature: 'Chữ ký',
}
const blockTypeLabel = (t) => BLOCK_LABELS[t] || t

const computedStyle = (block) => ({
  fontSize: block.style?.fontSize || '13',
  fontWeight: block.style?.fontWeight || 'normal',
  fontStyle: block.style?.fontStyle || 'normal',
  textAlign: block.style?.textAlign || 'left',
  color: block.style?.color || '#111827',
  textDecoration: block.style?.textDecoration || 'none',
})

// ── Drag & drop ────────────────────────────────────────────────────────────────
const dragId = ref(null)
const dragOverId = ref(null)

const onDragStart = (id) => { dragId.value = id }
const onDragOver = (id) => { dragOverId.value = id }
const onDrop = (toId) => {
  if (dragId.value && dragId.value !== toId) {
    store.reorderBlocks(dragId.value, toId)
  }
  dragId.value = null
  dragOverId.value = null
}
const onDropBottom = () => {
  dragId.value = null
  dragOverId.value = null
}
</script>

<style scoped>
.a4-canvas {
  width: 100%;
  max-width: 210mm;
  min-height: 500px;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  color: #111827;
}

.block-ctrl-btn {
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
  font-size: 10px;
  transition: background-color 0.15s;
}
.block-ctrl-btn:hover { background-color: rgb(59 130 246); }

@media (max-width: 900px) {
  .a4-canvas {
    width: 100%;
    min-height: unset;
  }
}
</style>
