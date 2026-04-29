<!-- Dashboard Page Stat Card Component -->
<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div class="flex items-center">
      <div :class="[iconBg, 'p-2 rounded-lg']">
        <i :class="[icon, iconColor, 'text-xl']"></i>
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-lg font-semibold text-gray-900">
          {{ value }}
          <span class="text-xs font-normal text-gray-500 ml-1">{{ unit }}</span>
        </p>
        <div v-if="trend" class="mt-1">
          <span :class="[trendColor, 'text-xs flex items-center']">
            <i :class="[trendIcon, 'mr-0.5']"></i>
            {{ trend }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  iconBg: {
    type: String,
    required: true,
  },
  iconColor: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  trend: {
    type: String,
    default: "",
  },
  trendIcon: {
    type: String,
    default: "",
  },
  trendColor: {
    type: String,
    default: "",
  },
});
</script>
