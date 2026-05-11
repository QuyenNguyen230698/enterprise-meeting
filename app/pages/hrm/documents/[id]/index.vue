<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3 z-20">
      <NuxtLink to="/hrm/documents" class="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
        <i class="bi bi-arrow-left"></i>
      </NuxtLink>

      <div class="flex-1 min-w-0">
        <h1 class="text-base font-black text-gray-900 truncate">
          {{ doc?.name || 'Chi tiết biên bản' }}
        </h1>
        <p class="text-xs font-mono text-gray-400 mt-0.5">
          {{ doc?.code }} · #{{ String(docId).slice(0, 8) }}
        </p>
      </div>

      <!-- Status badge -->
      <span
        v-if="doc"
        class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        :class="statusInfo.color"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="statusInfo.dot"></span>
        {{ statusInfo.label }}
      </span>

      <!-- Print button -->
      <DocumentPdfView
        v-if="doc?.status === 'COMPLETED'"
        :doc="doc"
        :signers="doc.signers || []"
      >
        <template #default="{ print }">
          <button
            @click="print"
            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <i class="bi bi-printer"></i>
            <span class="hidden sm:inline">In biên bản</span>
          </button>
        </template>
      </DocumentPdfView>
    </div>

    <!-- Loading -->
    <div v-if="store.detailLoading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Error -->
    <div v-else-if="store.detailError" class="flex-1 flex items-center justify-center text-center px-4">
      <div>
        <i class="bi bi-exclamation-circle text-4xl text-red-300 mb-3 block"></i>
        <p class="text-gray-600 font-medium">{{ store.detailError }}</p>
        <button @click="load" class="mt-3 text-sm text-blue-600 underline">Thử lại</button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="doc" class="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
      <div class="max-w-5xl mx-auto">

        <!-- Mobile status -->
        <div class="sm:hidden mb-4">
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            :class="statusInfo.color"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="statusInfo.dot"></span>
            {{ statusInfo.label }}
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <!-- LEFT: nội dung biên bản + timeline -->
          <div class="lg:col-span-2 space-y-5">

            <!-- Document content preview -->
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <i class="bi bi-file-earmark-text text-blue-500"></i>
                  Nội dung biên bản
                </h2>
                <span class="text-[10px] font-mono text-gray-400">{{ doc.code }}</span>
              </div>

              <div class="px-5 py-4 max-h-[500px] overflow-y-auto">
                <!-- Title -->
                <div class="text-center mb-5">
                  <p class="text-base font-black uppercase text-gray-900">{{ doc.titleVn || doc.name }}</p>
                  <p v-if="doc.titleEn" class="text-xs italic text-gray-400 mt-0.5">{{ doc.titleEn }}</p>
                </div>

                <!-- Blocks render (readonly) -->
                <div class="space-y-4">
                  <template v-for="block in sortedBlocks" :key="block.id">

                    <div v-if="block.type === 'party'" class="text-sm space-y-1 border-l-4 border-blue-200 pl-3">
                      <p class="font-semibold text-gray-700">Bên A: {{ doc.submittedByName }}</p>
                      <p v-if="block.content?.showPartyB && block.content?.partyBName" class="font-semibold text-gray-700">
                        {{ block.content.partyBLabel || 'Bên B' }}: {{ block.content.partyBName }}
                      </p>
                    </div>

                    <div v-else-if="block.type === 'legal'" class="text-[11px] text-gray-500 italic whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-3">
                      {{ block.content?.text }}
                    </div>

                    <div
                      v-else-if="block.type === 'richtext'"
                      class="prose prose-sm max-w-none text-[13px]"
                      v-html="block.content?.html"
                    ></div>

                    <div v-else-if="block.type === 'table'" class="overflow-x-auto">
                      <table class="w-full text-xs border-collapse">
                        <thead>
                          <tr>
                            <th
                              v-for="h in block.content?.headers"
                              :key="h.key"
                              class="border border-gray-200 bg-gray-50 px-2 py-1.5 font-bold text-gray-700 text-left"
                            >{{ h.label }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in block.content?.rows" :key="row.id">
                            <td
                              v-for="h in block.content?.headers"
                              :key="h.key"
                              class="border border-gray-100 px-2 py-1.5"
                            >{{ row[h.key] }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div v-else-if="block.type === 'checklist'" class="space-y-1.5">
                      <div v-for="item in block.content?.items" :key="item.id" class="flex items-start gap-2 text-sm">
                        <span class="mt-0.5 w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center text-[10px] shrink-0"
                          :class="item.checked ? 'bg-blue-500 border-blue-500 text-white' : ''"
                        >{{ item.checked ? '✓' : '' }}</span>
                        <span :class="item.checked ? 'line-through text-gray-400' : 'text-gray-700'">{{ item.text }}</span>
                      </div>
                    </div>

                    <div v-else-if="block.type === 'divider'" class="border-t border-gray-200 my-1"></div>

                    <!-- Signature block: hiện chữ ký đã ký -->
                    <div v-else-if="block.type === 'signature'" class="mt-4 border-t border-gray-100 pt-4">
                      <div class="grid gap-4" :class="`grid-cols-${Math.min(doc.signers?.length || 2, 4)}`">
                        <div
                          v-for="signer in doc.signers"
                          :key="signer.id"
                          class="text-center"
                        >
                          <p class="text-xs font-semibold text-gray-700">{{ signer.labelVn }}</p>
                          <div class="my-2 h-14 border-b-2 border-dashed border-gray-200 flex items-center justify-center">
                            <img
                              v-if="getSignerLog(signer)?.signatureUrl"
                              :src="getSignerLog(signer).signatureUrl"
                              class="max-h-12 max-w-full object-contain"
                              alt="Chữ ký"
                            />
                            <span v-else class="text-[10px] text-gray-300">
                              {{ doc.status === 'COMPLETED' ? '(không ký)' : '(chờ ký)' }}
                            </span>
                          </div>
                          <p class="text-[11px] font-semibold text-gray-600">{{ getSignerLog(signer)?.actorName || '—' }}</p>
                          <p v-if="getSignerLog(signer)?.actionAt" class="text-[10px] text-gray-400">
                            {{ formatDate(getSignerLog(signer).actionAt) }}
                          </p>
                        </div>
                      </div>
                    </div>

                  </template>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <HrmDocumentDocumentTimeline
              :steps="doc.workflowSteps || []"
              :logs="doc.approvalLogs || []"
              :status="doc.status"
              :completed-at="doc.completedAt"
            />
          </div>

          <!-- RIGHT: action panel + info -->
          <div class="space-y-5">

            <!-- Info card -->
            <div class="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
              <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                <i class="bi bi-info-circle text-gray-400"></i>
                Thông tin biên bản
              </h3>
              <div class="space-y-2 text-xs text-gray-600">
                <div class="flex items-start gap-2">
                  <span class="text-gray-400 w-20 shrink-0">Người tạo</span>
                  <span class="font-semibold">{{ doc.submittedByName || '—' }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-400 w-20 shrink-0">Ngày tạo</span>
                  <span>{{ formatDate(doc.createdAt) }}</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-gray-400 w-20 shrink-0">Loại</span>
                  <span
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    :class="docTypeClass(doc.docType)"
                  >
                    <i :class="docTypeIcon(doc.docType)"></i>{{ docTypeLabel(doc.docType) }}
                  </span>
                </div>
                <div v-if="doc.completedAt" class="flex items-start gap-2">
                  <span class="text-gray-400 w-20 shrink-0">Hoàn thành</span>
                  <span class="text-green-700 font-semibold">{{ formatDate(doc.completedAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Action panel -->
            <HrmDocumentDocumentActionPanel
              :doc="doc"
              :current-user="currentUser"
              :has-signature="hasSignature"
              @actioned="load"
              @print="triggerPrint"
              @recreate="navigateTo('/hrm/documents/create')"
            />

          </div>
        </div>
      </div>
    </div>

    <!-- Hidden PDF view (for print) -->
    <DocumentPdfView
      v-if="doc"
      ref="pdfViewRef"
      :doc="doc"
      :signers="doc.signers || []"
    />
  </div>
</template>

<script setup>
import { useDocumentStore, DOC_STATUS_LABEL } from '~/stores/hrm/document'

const route  = useRoute()
const store  = useDocumentStore()
const auth   = useAuthStore()

const docId  = computed(() => route.params.id)
const doc    = computed(() => store.currentDocument)
const pdfViewRef = ref(null)

const currentUser   = computed(() => auth.user)
const hasSignature  = ref(false)

onMounted(async () => {
  await load()
  // Check signature status
  try {
    const res = await useFetchAuth('/v1/profile/signature')
    hasSignature.value = res?.data?.has_signature || res?.has_signature || false
  } catch { /* ignore */ }
})

async function load() {
  await store.fetchDocument(docId.value)
}

function triggerPrint() {
  pdfViewRef.value?.triggerPrint?.()
}

// ── Computed ───────────────────────────────────────────────────────────────────
const sortedBlocks = computed(() =>
  [...(doc.value?.contentBlocks || [])].sort((a, b) => a.order - b.order)
)

const statusInfo = computed(() => {
  const s = doc.value?.status || 'DRAFT'
  if (s?.startsWith('PENDING')) return { label: 'Đang phê duyệt', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' }
  return DOC_STATUS_LABEL[s] || { label: s, color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' }
})

function getSignerLog(signer) {
  return doc.value?.approvalLogs?.find(
    l => l.signerRoleKey === signer.roleKey && l.action !== 'reject'
  ) || null
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const DOC_TYPE_MAP = {
  MEETING_MINUTES:   { label: 'Biên bản họp',  icon: 'bi bi-people',             cls: 'bg-blue-50 text-blue-700'   },
  HANDOVER:          { label: 'Bàn giao',       icon: 'bi bi-arrow-left-right',   cls: 'bg-purple-50 text-purple-700' },
  INTERNAL_DECISION: { label: 'Quyết định',     icon: 'bi bi-award',              cls: 'bg-red-50 text-red-700'     },
  NDA:               { label: 'NDA',            icon: 'bi bi-shield-lock',        cls: 'bg-amber-50 text-amber-700' },
  DISCIPLINE:        { label: 'Kỷ luật',        icon: 'bi bi-exclamation-triangle', cls: 'bg-rose-50 text-rose-700' },
  CUSTOM:            { label: 'Tùy chỉnh',      icon: 'bi bi-file-earmark-text',  cls: 'bg-gray-100 text-gray-600'  },
}
const docTypeLabel = t => DOC_TYPE_MAP[t]?.label || t
const docTypeIcon  = t => DOC_TYPE_MAP[t]?.icon  || 'bi bi-file-text'
const docTypeClass = t => DOC_TYPE_MAP[t]?.cls   || 'bg-gray-100 text-gray-500'

const formatDate = (val) => {
  if (!val) return '—'
  return new Date(val).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>
