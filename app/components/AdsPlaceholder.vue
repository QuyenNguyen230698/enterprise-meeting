<template>
  <div class="ads-container w-full flex justify-center my-6 overflow-hidden min-h-[100px] bg-gray-50/50 rounded-lg relative">
    <!-- Dev Placeholder -->
    <div v-if="isDev" class="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 text-xs font-mono select-none pointer-events-none">
       ADS SPACE ({{ format || 'auto' }})
    </div>

    <!-- Google Adsense Code -->
    <ins class="adsbygoogle"
         style="display:block"
         :style="customStyle"
         :data-ad-client="client"
         :data-ad-slot="slotId"
         :data-ad-format="format"
         :data-full-width-responsive="responsive ? 'true' : 'false'"></ins>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  client: {
    type: String,
    default: 'ca-pub-XXXXXXXXXXXXXXXX' // Replace with user's actual AdSense Pub ID or configure via runtimeConfig
  },
  slotId: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: 'auto'
  },
  responsive: {
    type: Boolean,
    default: true
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
})

const isDev = process.env.NODE_ENV === 'development'

onMounted(() => {
  try {
    // Ensure adsbygoogle is loaded or push to queue
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  } catch (e) {
    console.warn('AdSense push failed', e)
  }
})
</script>

<style scoped>
.ads-container {
  max-width: 100%;
}
</style>
