<template>
  <div class="nav-item">
    <!-- Main App Link -->
    <div class="flex items-center w-full">
      <NuxtLink
        :to="link.to"
        :class="[
          'flex-1 flex items-center px-3 py-1 text-sm rounded-lg transition-colors',
          isActive ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-100'
        ]"
      >
        <i :class="[link.iconClass, 'text-xl mr-3', isActive ? 'text-blue-600' : 'text-gray-500']"></i>
        <span v-if="sidebarOpen" class="font-medium truncate">{{ link.text }}</span>
      </NuxtLink>
      
      <!-- Expand Button - Separated from Link -->
      <button 
        v-if="link.children?.length && sidebarOpen"
        @click="$emit('toggle')"
        class="p-2 hover:bg-gray-100 rounded-lg"
      >
        <i 
          class="bi bi-chevron-down text-sm transition-transform"
          :class="[isExpanded ? 'rotate-180' : '', isActive ? 'text-blue-600' : 'text-gray-500']"
        ></i>
      </button>
    </div>

    <!-- Modules -->
    <div 
      v-if="link.children?.length && isExpanded" 
      class="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 pl-3"
    >
      <NuxtLink
        v-for="module in link.children" 
        :key="module.to"
        :to="module.to"
        :class="[
          'flex items-center px-3 py-1 text-sm rounded-lg transition-colors',
          isModuleActive(module.to) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        <i :class="[module.iconClass, 'text-lg mr-3', isModuleActive(module.to) ? 'text-blue-600' : 'text-gray-500']"></i>
        <span v-if="sidebarOpen" class="truncate">{{ module.text }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  link: {
    type: Object,
    required: true
  },
  sidebarOpen: {
    type: Boolean,
    default: true
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle']);

const route = useRoute();

const isActive = computed(() => {
  return route.path.startsWith(props.link.to);
});

const isModuleActive = (path) => {
  return route.path === path;
};
</script>
