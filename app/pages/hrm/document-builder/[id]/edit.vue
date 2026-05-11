<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <template v-else>
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
                  <span class="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Đang chỉnh sửa</span>
                </div>
              </div>
            </div>

            <!-- Center: step indicator -->
            <div class="hidden md:flex justify-center">
              <div class="w-full max-w-sm">
                <HrmDocumentBuilderStepIndicator
                  :current="store.currentStep"
                  :maxReached="3"
                  @go="store.goToStep($event)"
                />
              </div>
            </div>

            <!-- Right: actions -->
            <div class="flex items-center gap-2 shrink-0">
              <NuxtLink
                :to="`/hrm/document-builder/${route.params.id}/preview`"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <i class="bi bi-eye"></i> Preview
              </NuxtLink>
              <button
                @click="handleSave"
                :disabled="store.saving"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <i class="bi bi-cloud" :class="{ 'animate-pulse': store.saving }"></i>
                {{ store.saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
              </button>
            </div>
          </div>

          <!-- Mobile step indicator -->
          <div class="md:hidden mt-3">
            <HrmDocumentBuilderStepIndicator
              :current="store.currentStep"
              :maxReached="3"
              @go="store.goToStep($event)"
            />
          </div>
        </div>
      </div>

      <!-- Step content (same as create) -->
      <div class="flex-1 overflow-hidden flex flex-col">
        <div v-if="store.currentStep === 1" class="flex-1 flex overflow-hidden">
          <HrmDocumentBuilderCmsBlockToolbar @add="store.addBlock($event)" />
          <HrmDocumentBuilderCmsCanvas class="flex-1 min-w-0 overflow-hidden" />
          <HrmDocumentBuilderCmsPropertyPanel />
        </div>
        <div v-else-if="store.currentStep === 2" class="flex-1 overflow-hidden">
          <HrmDocumentBuilderSignersSignerConfig />
        </div>
        <div v-else-if="store.currentStep === 3" class="flex-1 overflow-hidden">
          <HrmDocumentBuilderWorkflowBuilder />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'

const store = useDocumentBuilderStore()
const route = useRoute()
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await useFetchAuth(`/v1/hrm/document-templates/${route.params.id}`)
    const data = res?.data || res
    if (data) store.loadTemplate(data)
  } catch (e) {
    console.error('Load error', e)
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  try {
    await store.saveTemplate()
  } catch (e) {
    console.error('Save error', e)
  }
}
</script>
