<template>
  <div class="border-b border-gray-300 overflow-x-auto" :style="blockStyle">
    <table class="w-full border-collapse table-fixed text-xs">
      <thead class="bg-blue-800 text-white">
        <tr>
          <th
            v-for="col in content.headers"
            :key="col.key"
            class="border border-blue-600 px-2 py-1.5 text-center font-semibold"
            :style="{ width: col.width || 'auto' }"
          >
            <template v-if="editable">
              <input
                :value="col.label"
                @input="store.updateTableHeaderLabel(blockId, col.key, $event.target.value)"
                class="bg-transparent text-white placeholder-blue-300 text-center text-xs font-semibold focus:outline-none w-full"
                :placeholder="col.key === 'stt' ? 'STT' : 'Tên cột'"
              />
              <input
                :value="col.labelEn"
                @input="updateHeaderField(col.key, 'labelEn', $event.target.value)"
                class="bg-transparent text-blue-200 placeholder-blue-400 text-center text-[10px] italic font-normal focus:outline-none w-full"
                placeholder="English label"
              />
            </template>
            <template v-else>
              <span class="block">{{ col.label }}</span>
              <span v-if="col.labelEn" class="block text-[10px] italic font-normal text-blue-200">{{ col.labelEn }}</span>
            </template>
          </th>
          <!-- Remove column buttons (editable only) -->
          <th v-if="editable" class="w-6 border border-blue-700 bg-blue-900"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIdx) in content.rows"
          :key="row.id"
          class="hover:bg-blue-50/30 transition-colors"
        >
          <td
            v-for="col in content.headers"
            :key="col.key"
            class="border border-gray-200 px-2 py-1"
            :class="{ 'text-center font-semibold': col.key === 'stt' }"
          >
            <template v-if="col.key === 'stt'">{{ rowIdx + 1 }}</template>
            <template v-else-if="editable">
              <input
                :value="row[col.key]"
                @input="store.updateTableCell(blockId, row.id, col.key, $event.target.value)"
                class="w-full bg-transparent text-xs text-gray-800 focus:outline-none placeholder-gray-300"
                :placeholder="col.label"
              />
            </template>
            <template v-else>{{ row[col.key] || '' }}</template>
          </td>
          <!-- Row remove (editable) -->
          <td v-if="editable" class="border border-gray-200 text-center w-6">
            <button
              @click="store.removeTableRow(blockId, row.id)"
              class="text-red-400 hover:text-red-600 text-xs p-0.5"
            ><i class="bi bi-x"></i></button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Footer actions -->
    <div v-if="editable" class="flex gap-2 px-2 py-1.5 bg-gray-50 border-t border-gray-200">
      <button
        @click="store.addTableRow(blockId)"
        class="text-xs text-green-600 font-semibold hover:text-green-800"
      ><i class="bi bi-plus mr-0.5"></i>Thêm hàng</button>
      <span class="text-gray-300">|</span>
      <button
        @click="store.addTableColumn(blockId)"
        class="text-xs text-blue-600 font-semibold hover:text-blue-800"
      ><i class="bi bi-plus mr-0.5"></i>Thêm cột</button>
      <span class="text-gray-400 text-xs ml-auto">{{ content.rows?.length || 0 }} hàng · {{ content.headers?.length || 0 }} cột</span>
    </div>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'

const props = defineProps({
  blockId: { type: String, required: true },
  content: { type: Object, default: () => ({ headers: [], rows: [] }) },
  editable: { type: Boolean, default: true },
  blockStyle: { type: Object, default: () => ({}) },
})

const store = useDocumentBuilderStore()

const updateHeaderField = (colKey, field, val) => {
  const block = store.template.contentBlocks.find(b => b.id === props.blockId)
  if (!block) return
  const h = block.content.headers.find(h => h.key === colKey)
  if (h) h[field] = val
}
</script>
