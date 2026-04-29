<template>
  <div>
    <div v-if="loading" class="loading">Dang tai du lieu...</div>
    <div v-else-if="error" class="loading">{{ error }}</div>
    <OffboardingResignationPrintView
      v-else-if="process"
      :process="process"
      @print="printNow"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: false, middleware: ["auth", "offboarding"] })

const route = useRoute()
const process = ref(null)
const loading = ref(true)
const error = ref("")

const printNow = () => {
  if (typeof window !== "undefined") window.print()
}

onMounted(async () => {
  try {
    const res = await useFetchAuth(`/v1/offboarding/processes/${route.params.processId}`)
    process.value = res?.data ?? res
    setTimeout(printNow, 200)
  } catch (e) {
    error.value = e?.data?.message || e?.data?.error || "Khong the tai don de in"
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
