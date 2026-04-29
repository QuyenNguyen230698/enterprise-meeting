<!-- Dashboard Page Filters Component -->
<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row gap-4 py-4">
      <div class="flex-1">
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="bi bi-search text-gray-400"></i>
          </div>
          <input
            :value="search"
            type="text"
            placeholder="Tìm kiếm..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="$emit('update:search', $event.target.value)"
          />
        </div>
      </div>
      <div class="hidden lg:flex items-center gap-2">
        <select
          :value="category"
          class="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="$emit('update:category', $event.target.value)"
        >
          <option value="all">All Categories</option>
          <option
            v-for="[key, department] in Object.entries(departments)"
            :key="key"
            :value="key"
          >
            {{ department.name }}
          </option>
        </select>
        <div class="border-l border-gray-300 h-8"></div>
        <div class="flex bg-gray-100 p-1 rounded-lg">
          <button
            @click="$emit('update:viewMode', 'grid')"
            class="p-1.5 rounded-md transition-all"
            :class="
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            <i class="bi bi-grid-fill"></i>
          </button>
          <button
            @click="$emit('update:viewMode', 'list')"
            class="p-1.5 rounded-md transition-all"
            :class="
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            <i class="bi bi-list-ul"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Search Results Info -->
    <div v-if="search || category !== 'all'" class="text-sm text-gray-600">
      Found {{ totalResults }} {{ totalResults === 1 ? "result" : "results" }}
      <template v-if="search"> for "{{ search }}"</template>
      <template v-if="category !== 'all'">
        in {{ departments[category]?.name || category }}</template
      >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  search: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "all",
  },
  totalResults: {
    type: Number,
    default: 0,
  },
  viewMode: {
    type: String,
    default: "grid",
  },
});

defineEmits(["update:search", "update:category", "update:viewMode"]);

// Get departments from apps store
const appsStore = useAppsStore();
const departments = computed(() => appsStore.apps || {});
</script>
