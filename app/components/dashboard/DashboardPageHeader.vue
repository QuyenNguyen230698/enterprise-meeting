<!-- Dashboard Page Header Component -->
<template>
  <div
    class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4"
  >
    <div>
      <h1 class="text-base font-bold text-gray-900">
        Chào mừng trở lại, {{ username }}
      </h1>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});
</script>
