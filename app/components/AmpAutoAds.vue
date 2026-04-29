<template>
  <!-- AMP Auto Ads - Place immediately after body tag -->
  <div v-if="!isClient" />
  <amp-auto-ads 
    v-else
    type="adsense"
    data-ad-client="ca-pub-4065642758618862"
  />
</template>

<script setup>
// AMP Auto Ads component
// This component should be placed immediately after the body tag
const isClient = process.client
</script>
