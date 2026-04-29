<template>
  <div>
    <div v-if="loading" class="loading">Đang tải dữ liệu...</div>
    <div v-else-if="error" class="loading">{{ error }}</div>
    <AssetHandoverPrintView
      v-else-if="handover"
      :handover="handover"
      :form-type="formType"
      @print="printNow"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: false, middleware: ['auth', 'asset-handover'] })

const route = useRoute()
const handover = ref(null)
const loading = ref(true)
const error = ref('')

const formType = String(route.query.type ?? 'ho2').toLowerCase()

const API_MAP = {
  ho1: (id) => `/v1/job-handover/${id}`,
  ho2: (id) => `/v1/asset-handover/${id}`,
  ho3: (id) => `/v1/exit-interview/${id}`,
}

const printNow = () => {
  if (typeof window !== 'undefined') window.print()
}

onMounted(async () => {
  try {
    const apiUrl = (API_MAP[formType] ?? API_MAP.ho2)(route.params.id)
    const res = await useFetchAuth(apiUrl)
    handover.value = res?.data ?? res
    setTimeout(printNow, 200)
  } catch (e) {
    error.value = e?.data?.message || e?.data?.error || 'Không thể tải biên bản để in'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-size: 14px;
}
</style>
