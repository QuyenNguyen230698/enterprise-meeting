<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header bar -->
    <div class="shrink-0 bg-white border-b border-gray-100 z-30">
      <div class="px-4 sm:px-6 py-3">
        <!-- 3-column grid: title | steps | actions -->
        <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <!-- Left: back + title -->
          <div class="flex items-center gap-2 min-w-0">
            <NuxtLink to="/hrm/document-builder" class="shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-1.5 rounded-xl hover:bg-gray-100">
              <i class="bi bi-arrow-left text-base"></i>
            </NuxtLink>
            <div class="min-w-0">
              <input
                v-model="store.template.name"
                class="text-base font-black text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 w-full max-w-xs"
                placeholder="Tên mẫu văn bản..."
              />
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs text-gray-400">{{ store.template.code }}</span>
                <span class="text-gray-300">·</span>
                <span
                  class="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  :class="store.template.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                >{{ store.template.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp' }}</span>
              </div>
            </div>
          </div>

          <!-- Center: step indicator (hidden on mobile, shown via bottom row) -->
          <div class="hidden md:flex justify-center">
            <div class="w-full max-w-sm">
              <HrmDocumentBuilderStepIndicator
                :current="store.currentStep"
                :maxReached="maxReached"
                @go="goToStep"
              />
            </div>
          </div>

          <!-- Right: actions -->
          <div class="flex items-center gap-2 shrink-0">
            <button
              @click="handleSave"
              :disabled="store.saving"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <i class="bi bi-cloud" :class="{ 'animate-pulse': store.saving }"></i>
              {{ store.saving ? 'Đang lưu...' : 'Lưu nháp' }}
            </button>

            <button
              v-if="store.currentStep < 3"
              @click="nextStep"
              class="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Tiếp theo <i class="bi bi-arrow-right text-xs"></i>
            </button>

            <button
              v-if="store.currentStep === 3"
              @click="handlePublish"
              :disabled="store.saving"
              class="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <i class="bi bi-cloud-upload"></i>
              Xuất bản
            </button>
          </div>
        </div>

        <!-- Mobile step indicator -->
        <div class="md:hidden mt-3">
          <HrmDocumentBuilderStepIndicator
            :current="store.currentStep"
            :maxReached="maxReached"
            @go="goToStep"
          />
        </div>
      </div>
    </div>

    <!-- Doc type selector modal (shown on first load) -->
    <div
      v-if="showDocTypeSelector"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6">
        <h2 class="text-lg font-black text-gray-900 mb-1">Chọn loại văn bản</h2>
        <p class="text-xs text-gray-500 mb-5">Hệ thống sẽ tạo sẵn khung nội dung đầy đủ theo pháp luật.</p>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            v-for="dt in docTypes"
            :key="dt.value"
            @click="selectDocType(dt.value)"
            class="flex flex-col items-start gap-2 p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
          >
            <div class="w-9 h-9 rounded-xl flex items-center justify-center" :class="dt.iconBg">
              <i :class="[dt.icon, dt.iconColor, 'text-base']"></i>
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900 group-hover:text-blue-700">{{ dt.label }}</p>
              <p class="text-[10px] text-gray-400 font-mono mt-0.5">{{ dt.code }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="flex-1 overflow-hidden flex flex-col">

      <!-- ── Bước 1: CMS ──────────────────────────────────────────── -->
      <div v-if="store.currentStep === 1" class="flex-1 flex overflow-hidden">
        <!-- Block toolbar -->
        <HrmDocumentBuilderCmsBlockToolbar @add="store.addBlock($event)" />

        <!-- Canvas -->
        <HrmDocumentBuilderCmsCanvas
          class="flex-1 min-w-0 overflow-hidden"
          @click.self="store.clearSelection()"
        />

        <!-- Property panel -->
        <HrmDocumentBuilderCmsPropertyPanel />
      </div>

      <!-- ── Bước 2: Signers ──────────────────────────────────────── -->
      <div v-else-if="store.currentStep === 2" class="flex-1 overflow-hidden">
        <HrmDocumentBuilderSignersSignerConfig />
      </div>

      <!-- ── Bước 3: Workflow ─────────────────────────────────────── -->
      <div v-else-if="store.currentStep === 3" class="flex-1 overflow-hidden">
        <HrmDocumentBuilderWorkflowBuilder />
      </div>

    </div>

    <!-- Bottom nav (mobile step prev/next) -->
    <div class="shrink-0 md:hidden bg-white border-t border-gray-100 px-4 py-2 flex items-center justify-between">
      <button
        v-if="store.currentStep > 1"
        @click="store.goToStep(store.currentStep - 1)"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-xl"
      >
        <i class="bi bi-arrow-left text-xs"></i> Trước
      </button>
      <span v-else class="w-20"></span>

      <span class="text-xs text-gray-400 font-semibold">Bước {{ store.currentStep }}/3</span>

      <button
        v-if="store.currentStep < 3"
        @click="nextStep"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl"
      >
        Tiếp <i class="bi bi-arrow-right text-xs"></i>
      </button>
      <button
        v-else
        @click="handlePublish"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-xl"
      >
        <i class="bi bi-cloud-upload text-xs"></i> Xuất bản
      </button>
    </div>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore, DOC_PRESETS } from '~/stores/hrm/documentBuilder'

const store = useDocumentBuilderStore()
const router = useRouter()

const showDocTypeSelector = ref(false)
const maxReached = ref(1)

const docTypes = Object.entries(DOC_PRESETS).map(([value, preset]) => ({
  value,
  label: preset.name,
  code: preset.code,
  icon: {
    MEETING_MINUTES: 'bi bi-people',
    HANDOVER: 'bi bi-arrow-left-right',
    INTERNAL_DECISION: 'bi bi-award',
    NDA: 'bi bi-shield-lock',
    DISCIPLINE: 'bi bi-exclamation-triangle',
    CUSTOM: 'bi bi-file-earmark-text',
  }[value] || 'bi bi-file-text',
  iconBg: {
    MEETING_MINUTES: 'bg-blue-100',
    HANDOVER: 'bg-purple-100',
    INTERNAL_DECISION: 'bg-red-100',
    NDA: 'bg-amber-100',
    DISCIPLINE: 'bg-rose-100',
    CUSTOM: 'bg-gray-100',
  }[value] || 'bg-gray-100',
  iconColor: {
    MEETING_MINUTES: 'text-blue-600',
    HANDOVER: 'text-purple-600',
    INTERNAL_DECISION: 'text-red-600',
    NDA: 'text-amber-600',
    DISCIPLINE: 'text-rose-600',
    CUSTOM: 'text-gray-500',
  }[value] || 'text-gray-500',
}))

const selectDocType = (type) => {
  store.initNew(type)
  showDocTypeSelector.value = false
}

const goToStep = (n) => {
  if (n <= maxReached.value) store.goToStep(n)
}

const nextStep = () => {
  if (store.currentStep < 3) {
    const next = store.currentStep + 1
    store.goToStep(next)
    if (next > maxReached.value) maxReached.value = next
  }
}

const handleSave = async () => {
  try {
    await store.saveTemplate()
  } catch (e) {
    console.error('Save error', e)
  }
}

const handlePublish = async () => {
  try {
    await store.saveTemplate()
    await store.publishTemplate()
    router.push('/hrm/document-builder')
  } catch (e) {
    console.error('Publish error', e)
  }
}

onMounted(() => {
  // Luôn reset về trạng thái mới khi vào trang create
  store.initNew('CUSTOM')
  showDocTypeSelector.value = true
  maxReached.value = 1
})
</script>
