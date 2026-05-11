<template>
  <div class="print-root">
    <ToastContainer />

    <!-- Toolbar (no-print) -->
    <div class="no-print toolbar">
      <div class="flex items-center gap-2">
        <NuxtLink
          :to="`/hrm/document-builder/${route.params.id}/edit`"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <i class="bi bi-arrow-left mr-1"></i>Quay lại chỉnh sửa
        </NuxtLink>
        <span class="text-xs text-gray-500 font-mono">{{ store.template.code }}</span>
      </div>
      <button
        @click="printPage"
        class="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-300 rounded-xl hover:bg-green-100 transition-colors"
      >
        <i class="bi bi-printer"></i> In / Lưu PDF
      </button>
    </div>

    <!-- A4 Print Page -->
    <div class="a4-page">
      <div class="bg-white border border-gray-300 overflow-hidden print-form">

        <!-- Render all blocks in print mode -->
        <template v-for="block in store.sortedBlocks" :key="block.id">

          <!-- Header -->
          <HrmDocumentBuilderCmsBlocksBlockHeader
            v-if="block.type === 'header'"
            :titleVn="store.template.titleVn"
            :titleEn="store.template.titleEn"
            :code="store.template.code"
            :docRef="docRef"
            :editable="false"
            :blockStyle="computedStyle(block)"
          />

          <!-- Party -->
          <HrmDocumentBuilderCmsBlocksBlockParty
            v-else-if="block.type === 'party'"
            :content="block.content"
            :editable="false"
            :blockStyle="computedStyle(block)"
          />

          <!-- Legal -->
          <HrmDocumentBuilderCmsBlocksBlockLegal
            v-else-if="block.type === 'legal'"
            :content="block.content"
            :editable="false"
            :blockStyle="computedStyle(block)"
          />

          <!-- RichText -->
          <div
            v-else-if="block.type === 'richtext'"
            class="border-b border-gray-300 px-3 py-2.5"
            :style="{
              fontSize: (block.style?.fontSize || '13') + 'px',
              fontWeight: block.style?.fontWeight || 'normal',
              fontStyle: block.style?.fontStyle || 'normal',
              textAlign: block.style?.textAlign || 'left',
              color: block.style?.color || '#111827',
            }"
            v-html="resolveVars(block.content?.html)"
          ></div>

          <!-- Table -->
          <HrmDocumentBuilderCmsBlocksBlockTable
            v-else-if="block.type === 'table'"
            :blockId="block.id"
            :content="block.content"
            :editable="false"
            :blockStyle="computedStyle(block)"
          />

          <!-- Checklist -->
          <HrmDocumentBuilderCmsBlocksBlockChecklist
            v-else-if="block.type === 'checklist'"
            :blockId="block.id"
            :content="block.content"
            :editable="false"
            :blockStyle="computedStyle(block)"
          />

          <!-- Divider -->
          <HrmDocumentBuilderCmsBlocksBlockDivider
            v-else-if="block.type === 'divider'"
            :content="block.content"
            :editable="false"
            :blockStyle="computedStyle(block)"
          />

          <!-- Signature matrix -->
          <HrmDocumentBuilderCmsBlocksBlockSignature
            v-else-if="block.type === 'signature'"
            :signers="store.template.signers"
            :editable="false"
          />

        </template>

        <!-- Nếu không có signature block, thêm signature cuối trang -->
        <HrmDocumentBuilderCmsBlocksBlockSignature
          v-if="!hasSignatureBlock"
          :signers="store.template.signers"
          :editable="false"
        />

        <!-- Legal footer -->
        <div class="border-t border-gray-200 px-3 py-2 bg-gray-50">
          <p class="text-[10px] text-gray-400 leading-relaxed text-center">
            Biên bản này được lập và ký kết theo đúng quy định của pháp luật Việt Nam, có giá trị pháp lý kể từ ngày ký.
            Tuân thủ Bộ Luật Lao động số 45/2019/QH14 và Luật Giao dịch điện tử số 20/2023/QH15.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'
import { useUserProfile } from '~/composables/useUserProfile'

const store = useDocumentBuilderStore()
const route = useRoute()
const { profileData, fetchProfile } = useUserProfile()

const loading = ref(true)
const printPage = () => { if (process.client) window.print() }

onMounted(async () => {
  await fetchProfile()
  try {
    const res = await useFetchAuth(`/v1/hrm/document-templates/${route.params.id}`)
    const data = res?.data || res
    if (data) store.loadTemplate(data)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const docRef = computed(() => {
  const d = new Date()
  return `${store.template.code}/${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-001`
})

const hasSignatureBlock = computed(() =>
  store.sortedBlocks.some(b => b.type === 'signature')
)

const computedStyle = (block) => ({
  fontSize: block.style?.fontSize || '13',
  fontWeight: block.style?.fontWeight || 'normal',
  fontStyle: block.style?.fontStyle || 'normal',
  textAlign: block.style?.textAlign || 'left',
  color: block.style?.color || '#111827',
})

// Resolve template variables với dữ liệu user thực
const resolveVars = (html) => {
  if (!html) return ''
  const profile = profileData.value
  const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return html
    .replace(/\{\{employee_name\}\}/g, profile?.full_name || profile?.name || '____________________')
    .replace(/\{\{employee_code\}\}/g, profile?.employee_code || '____________________')
    .replace(/\{\{department\}\}/g, profile?.department || '____________________')
    .replace(/\{\{job_title\}\}/g, profile?.title || '____________________')
    .replace(/\{\{dept_code\}\}/g, profile?.dept_code || '____________________')
    .replace(/\{\{today\}\}/g, today)
    .replace(/\{\{company_name\}\}/g, 'Enterprise Meeting Co., Ltd.')
}
</script>

<style scoped>
.print-root {
  background: #f3f4f6;
  min-height: 100vh;
  padding: 16px;
}

.toolbar {
  max-width: 210mm;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.a4-page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #fff;
  color: #111827;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

.print-form { font-weight: 500; }

@media print {
  @page { size: A4 portrait; margin: 6mm 7mm; }

  .no-print { display: none !important; }
  .print-root { padding: 0 !important; background: #fff !important; }

  .a4-page {
    width: 100% !important;
    min-height: unset !important;
    box-shadow: none !important;
    margin: 0 !important;
    overflow: visible !important;
  }

  .print-form {
    font-size: 9.5px !important;
    line-height: 1.05 !important;
  }

  .print-form p,
  .print-form span,
  .print-form div,
  .print-form td,
  .print-form th {
    line-height: 1.05 !important;
  }

  .print-form .px-3 { padding-left: 0.3rem !important; padding-right: 0.3rem !important; }
  .print-form .px-2 { padding-left: 0.2rem !important; padding-right: 0.2rem !important; }
  .print-form .py-2 { padding-top: 0.15rem !important; padding-bottom: 0.15rem !important; }
  .print-form .py-3 { padding-top: 0.2rem !important; padding-bottom: 0.2rem !important; }
  .print-form .py-1\.5 { padding-top: 0.12rem !important; padding-bottom: 0.12rem !important; }
  .print-form .py-1 { padding-top: 0.08rem !important; padding-bottom: 0.08rem !important; }

  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}

@media (max-width: 900px) {
  .a4-page {
    width: 100%;
    min-height: unset;
  }
  .toolbar {
    max-width: 100%;
  }
}
</style>
