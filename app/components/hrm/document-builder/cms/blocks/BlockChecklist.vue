<template>
  <div class="border-b border-gray-300 px-3 py-3" :style="blockStyle">
    <div class="space-y-1.5">
      <div
        v-for="item in content.items || []"
        :key="item.id"
        class="flex items-start gap-2"
      >
        <input
          type="checkbox"
          :checked="item.checked"
          @change="!editable && toggleCheck(item.id, $event.target.checked)"
          :disabled="editable"
          class="mt-0.5 w-3.5 h-3.5 accent-blue-600 shrink-0"
        />
        <span
          v-if="!editable"
          class="text-xs text-gray-800 leading-relaxed"
          :style="{
            fontWeight: item.style?.fontWeight || 'normal',
            fontStyle: item.style?.fontStyle || 'normal',
            textDecoration: item.style?.textDecoration || 'none',
            fontSize: item.style?.fontSize ? item.style.fontSize + 'px' : '12px',
          }"
        >{{ item.text }}</span>
        <input
          v-else
          :value="item.text"
          @input="updateItemText(item.id, $event.target.value)"
          class="flex-1 bg-transparent text-xs text-gray-800 focus:outline-none border-b border-dashed border-gray-200 focus:border-blue-400"
          :style="{
            fontWeight: item.style?.fontWeight || 'normal',
            fontStyle: item.style?.fontStyle || 'normal',
            textDecoration: item.style?.textDecoration || 'none',
            fontSize: item.style?.fontSize ? item.style.fontSize + 'px' : '12px',
          }"
          placeholder="Nội dung mục..."
        />
      </div>
    </div>
    <div v-if="editable" class="mt-2">
      <button
        @click="store.addChecklistItem(blockId)"
        class="text-xs text-blue-600 font-semibold hover:text-blue-800"
      ><i class="bi bi-plus mr-0.5"></i>Thêm mục</button>
    </div>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'

const props = defineProps({
  blockId: { type: String, required: true },
  content: { type: Object, default: () => ({ items: [] }) },
  editable: { type: Boolean, default: true },
  blockStyle: { type: Object, default: () => ({}) },
})

const store = useDocumentBuilderStore()

const updateItemText = (itemId, text) => {
  const block = store.template.contentBlocks.find(b => b.id === props.blockId)
  if (!block) return
  const item = block.content.items.find(i => i.id === itemId)
  if (item) item.text = text
}

const toggleCheck = (itemId, checked) => {
  const block = store.template.contentBlocks.find(b => b.id === props.blockId)
  if (!block) return
  const item = block.content.items.find(i => i.id === itemId)
  if (item) item.checked = checked
}
</script>
