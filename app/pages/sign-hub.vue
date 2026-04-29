<template>
  <OffboardingSignHubPage />
</template>

<script setup>
definePageMeta({ middleware: ["auth", "offboarding"] })

import OffboardingSignHubPage from "~/pages/offboarding/sign-hub.vue"
</script>
