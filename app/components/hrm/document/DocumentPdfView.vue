<template>
  <!-- Wrapper: ẩn trên màn hình, chỉ hiện khi in -->
  <div>
    <!-- Trigger button (slot mặc định) -->
    <slot :print="triggerPrint">
      <button
        @click="triggerPrint"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 transition-colors"
      >
        <i class="bi bi-printer"></i>
        In biên bản
      </button>
    </slot>

    <!-- Vùng nội dung để in (ẩn khỏi UI thường, chỉ hiện khi print) -->
    <div ref="printArea" class="hidden print:block">
      <div class="print-document font-serif text-[13px] text-black leading-relaxed max-w-[210mm] mx-auto px-[20mm] py-[15mm]">

        <!-- Header công ty -->
        <div class="flex items-start justify-between mb-6 border-b-2 border-black pb-4">
          <div class="text-[11px] leading-snug">
            <p class="font-bold uppercase">{{ doc.companyName || 'ENTERPRISE MEETING' }}</p>
            <p>{{ doc.companyAddress || '' }}</p>
            <p v-if="doc.companyPhone">Tel: {{ doc.companyPhone }}</p>
          </div>
          <div class="text-right text-[11px]">
            <p class="font-bold">Số: <span class="text-[12px]">{{ doc.docNumber || '___/____' }}</span></p>
            <p>Ngày: {{ formatDateVN(doc.createdAt) }}</p>
            <p class="font-mono text-gray-600">{{ doc.code }}</p>
          </div>
        </div>

        <!-- Tiêu đề văn bản -->
        <div class="text-center mb-6">
          <p class="text-[16px] font-black uppercase tracking-wide">{{ doc.titleVn || doc.name }}</p>
          <p v-if="doc.titleEn" class="text-[12px] italic text-gray-600 mt-0.5">{{ doc.titleEn }}</p>
        </div>

        <!-- Nội dung blocks -->
        <div class="space-y-4">
          <template v-for="block in sortedBlocks" :key="block.id">

            <!-- Header block -->
            <div v-if="block.type === 'header'" class="text-center">
              <p class="text-[15px] font-bold uppercase">{{ block.content?.titleVn || doc.titleVn }}</p>
              <p v-if="block.content?.docNumber" class="text-[11px] text-gray-600">Số: {{ block.content.docNumber }}</p>
            </div>

            <!-- Party block -->
            <div v-else-if="block.type === 'party'" class="text-[12px] space-y-1.5">
              <p class="font-bold">Bên A / Đại diện:</p>
              <div class="pl-4 space-y-0.5">
                <p>Họ tên: <span class="font-semibold">{{ doc.submittedByName || '______________________' }}</span></p>
                <p>Chức vụ: {{ doc.submittedByTitle || '______________________' }}</p>
                <p>Phòng ban: {{ doc.submittedByDept || '______________________' }}</p>
              </div>
              <template v-if="block.content?.showPartyB">
                <p class="font-bold mt-2">{{ block.content.partyBLabel || 'Bên B' }}:</p>
                <div class="pl-4 space-y-0.5">
                  <p>Họ tên: ______________________</p>
                  <p>Chức vụ: ______________________</p>
                </div>
              </template>
            </div>

            <!-- Legal block -->
            <div v-else-if="block.type === 'legal'" class="text-[11px] text-gray-700 border-l-4 border-gray-300 pl-3 italic whitespace-pre-line">
              {{ block.content?.text }}
            </div>

            <!-- Richtext block -->
            <div
              v-else-if="block.type === 'richtext'"
              class="prose prose-sm max-w-none text-[12px]"
              :style="blockStyle(block)"
              v-html="block.content?.html"
            ></div>

            <!-- Table block -->
            <div v-else-if="block.type === 'table'" class="overflow-hidden">
              <table class="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th
                      v-for="h in block.content?.headers"
                      :key="h.key"
                      class="border border-black px-2 py-1 bg-gray-100 font-bold text-center"
                      :style="{ width: h.width }"
                    >
                      {{ h.label }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in block.content?.rows" :key="row.id">
                    <td
                      v-for="h in block.content?.headers"
                      :key="h.key"
                      class="border border-black px-2 py-1"
                      :class="h.key === 'stt' ? 'text-center' : ''"
                    >
                      <template v-if="h.key === 'confirm'">
                        {{ row[h.key] ? '✓' : '' }}
                      </template>
                      <template v-else>{{ row[h.key] }}</template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Checklist block -->
            <div v-else-if="block.type === 'checklist'" class="text-[12px] space-y-1">
              <div v-for="item in block.content?.items" :key="item.id" class="flex items-start gap-2">
                <span class="mt-0.5 w-4 h-4 border border-black rounded-sm flex items-center justify-center text-[10px] shrink-0">
                  {{ item.checked ? '✓' : '' }}
                </span>
                <span>{{ item.text }}</span>
              </div>
            </div>

            <!-- Divider -->
            <div v-else-if="block.type === 'divider'" class="border-t border-gray-400 my-2">
              <p v-if="block.content?.label" class="text-center text-[10px] text-gray-500 -mt-2.5 bg-white inline-block px-2 mx-auto table">
                {{ block.content.label }}
              </p>
            </div>

            <!-- Signature block -->
            <div v-else-if="block.type === 'signature'" class="mt-8">
              <div class="grid text-[11px]" :class="`grid-cols-${signers.length > 2 ? signers.length : 2}`">
                <div
                  v-for="signer in signers"
                  :key="signer.id"
                  class="text-center px-2"
                >
                  <p class="font-bold uppercase">{{ signer.labelVn }}</p>
                  <p class="italic text-gray-600 text-[10px]">{{ signer.labelEn }}</p>

                  <!-- Chữ ký số (nếu đã ký) -->
                  <div class="my-3 h-16 flex items-center justify-center border-b border-dashed border-gray-400">
                    <img
                      v-if="getSignerLog(signer)?.signatureUrl"
                      :src="getSignerLog(signer).signatureUrl"
                      class="max-h-14 max-w-full object-contain"
                      alt="Chữ ký"
                    />
                    <p v-else class="text-gray-300 text-[10px]">(Chữ ký)</p>
                  </div>

                  <p class="font-semibold">{{ getSignerLog(signer)?.actorName || '______________________' }}</p>
                  <p v-if="getSignerLog(signer)?.actionAt" class="text-[10px] text-gray-500">
                    Ngày {{ formatDateVN(getSignerLog(signer).actionAt) }}
                  </p>
                </div>
              </div>
            </div>

          </template>
        </div>

        <!-- Footer: trạng thái pháp lý -->
        <div class="mt-10 pt-4 border-t border-gray-300 text-[10px] text-gray-500 text-center space-y-0.5">
          <p>Tài liệu này được tạo và phê duyệt điện tử trên hệ thống Enterprise Meeting</p>
          <p>Tuân thủ Luật Giao dịch điện tử số 20/2023/QH15 và Nghị định 13/2023/NĐ-CP</p>
          <p v-if="doc.id">ID biên bản: <span class="font-mono">{{ doc.id }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  doc:    { type: Object, required: true },
  signers: { type: Array, default: () => [] },
})

const printArea = ref(null)

const sortedBlocks = computed(() =>
  [...(props.doc?.contentBlocks || [])].sort((a, b) => a.order - b.order)
)

function getSignerLog(signer) {
  return props.doc?.approvalLogs?.find(
    l => l.signerRoleKey === signer.roleKey && l.action !== 'reject'
  ) || null
}

function blockStyle(block) {
  const s = block.style || {}
  return {
    fontSize:   s.fontSize ? s.fontSize + 'px' : undefined,
    fontWeight: s.fontWeight,
    fontStyle:  s.fontStyle,
    textAlign:  s.textAlign,
    color:      s.color,
  }
}

function triggerPrint() {
  if (!printArea.value) return
  // Tạm thời unhide vùng print rồi gọi window.print
  printArea.value.classList.remove('hidden')
  nextTick(() => {
    window.print()
    printArea.value.classList.add('hidden')
  })
}

const formatDateVN = (val) => {
  if (!val) return '____/____/________'
  const d = new Date(val)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}
</script>

<style>
@media print {
  body > * { display: none !important; }
  .print-document { display: block !important; }

  .print-document table { page-break-inside: avoid; }
  .print-document .prose p { margin: 0.25rem 0; }
}
</style>
