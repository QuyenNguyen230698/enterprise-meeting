<template>
  <div class="ads-section-one">
    <!-- HomePageSecssion-1 -->
    <ins 
      ref="adsenseElement"
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-4065642758618862"
      data-ad-slot="3281252883"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  </div>
</template>

<script setup>
// AdSense component for HomePage Section 1
const adsenseElement = ref(null)

// Load AdSense ads when component is mounted
onMounted(() => {
  if (process.client) {
    try {
      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script')
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4065642758618862'
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
        
        // Wait for script to load, then push ad
        script.onload = () => {
          setTimeout(() => {
            if (adsenseElement.value) {
              (window.adsbygoogle = window.adsbygoogle || []).push({})
            }
          }, 100)
        }
      } else {
        // Script already loaded, push ad immediately
        setTimeout(() => {
          if (adsenseElement.value) {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
          }
        }, 100)
      }
    } catch (error) {
      console.warn('AdSense loading error:', error)
    }
  }
})
</script>

<style lang="scss" scoped>
.ads-section-one {
  width: 100%;
  margin: 1rem 0;
  
  .adsbygoogle {
    display: block !important;
    width: 100% !important;
  }
}
</style>