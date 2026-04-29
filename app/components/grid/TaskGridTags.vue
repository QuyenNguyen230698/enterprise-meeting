<template>
  <div class="flex items-center gap-1">
    <span
      v-for="tag in tags"
      :key="tag"
      class="px-2 py-0.5 text-xs font-bold rounded-full border border-blue-500/20 text-blue-400 bg-blue-500/10"
    >
      {{ tag }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({ tags: [] }),
  },
});
const tags = computed(() => props.data?.tags || []);
</script>
