<template>
  <div
    class="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
    :class="
      viewMode === 'list'
        ? 'flex flex-row items-center p-3 h-auto'
        : 'flex flex-col h-full'
    "
  >
    <!-- Card Header with App Icon & Stats -->
    <div
      :class="
        viewMode === 'list'
          ? 'flex-1 flex items-center gap-4 min-w-0'
          : 'p-2 lg:p-6'
      "
    >
      <div
        class="flex items-center justify-between w-full"
        :class="{ 'gap-4': viewMode === 'list' }"
      >
        <!-- App Icon & Status -->
        <div
          @click="navigateTo(app.path)"
          class="flex items-center space-x-2 cursor-pointer min-w-0"
          :class="{ 'flex-1': viewMode === 'list' }"
        >
          <div class="relative shrink-0">
            <div
              class="rounded-xl flex items-center justify-center"
              :class="[
                app.theme?.gradientClass || app.theme?.bgColor || 'bg-gray-300',
                app.theme?.textColor || 'text-white',
                viewMode === 'list' ? 'w-10 h-10' : 'w-12 h-12',
              ]"
            >
              <i
                :class="[
                  app.icon || 'bi bi-app',
                  viewMode === 'list' ? 'text-lg' : 'text-2xl',
                ]"
              ></i>
            </div>
          </div>
          <div
            :class="
              viewMode === 'list' ? 'min-w-0' : 'hidden lg:block space-y-1'
            "
          >
            <p
              class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 truncate"
              :class="viewMode === 'list' ? 'text-sm' : 'text-base lg:text-lg'"
            >
              {{ app.name }}
            </p>
            <p
              class="text-xs text-gray-600 line-clamp-1"
              v-if="viewMode === 'grid'"
            >
              {{ app.description }}
            </p>
            <p class="text-xs text-gray-500 truncate" v-else>
              {{ app.description }}
            </p>
          </div>
        </div>

        <!-- Quick Actions (Grid Only) -->
        <div
          class="flex flex-col items-center space-x-3"
          v-if="viewMode === 'grid'"
        >
          <button
            @click.stop="$emit('toggle-favorite')"
            class="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            :class="
              isFavorite
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-400 hover:text-gray-600'
            "
          >
            <i class="bi" :class="isFavorite ? 'bi-star-fill' : 'bi-star'"></i>
          </button>
        </div>
      </div>

      <!-- App Description (Mobile Grid Only) -->
      <div class="lg:hidden pt-2 space-y-1" v-if="viewMode === 'grid'">
        <p
          class="text-base line-clamp-2 font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300"
        >
          {{ app.name }}
        </p>
      </div>
    </div>

    <!-- Module Quick Access (List: Hide or simplified? Let's hide for cleaner list) -->
    <div
      v-if="viewMode === 'grid' && displayedModules?.length > 0"
      class="flex flex-wrap gap-2 px-6 py-2"
    >
      <NuxtLink
        v-for="(module, index) in displayedModules"
        :key="module.appCode"
        :to="module.path"
        :class="[
          'text-xs inline-flex items-center px-3 py-1 rounded-lg font-medium',
          'backdrop-blur-sm border transform hover:scale-105 hover:shadow-sm transition-all duration-200 group/module',
          'bg-white/60 border-gray-100 text-gray-700',
          `hover:bg-${getModuleColor(index)}-50`,
          `hover:border-${getModuleColor(index)}-200`,
          `hover:text-${getModuleColor(index)}-700`,
          `active:bg-${getModuleColor(index)}-100`,
        ]"
      >
        <i
          :class="[
            module.icon || 'bi bi-circle-fill',
            'text-xs mr-2 transition-colors duration-200',
            'text-gray-400',
            `group-hover/module:text-${getModuleColor(index)}-600`,
          ]"
        ></i>
        {{ module.name }}
      </NuxtLink>
      <button
        v-if="hasMoreModules"
        class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white/60 backdrop-blur-sm border border-gray-100 text-gray-600 hover:bg-gray-50/80 hover:border-gray-200 hover:text-gray-800 active:bg-gray-100 active:border-gray-300 transform hover:scale-105 hover:shadow-sm transition-all duration-200"
      >
        +{{ app.modules.length - maxDisplayModules }}
      </button>
    </div>

    <!-- Card Footer with Stats & Action (Grid View) -->
    <div
      v-if="viewMode === 'grid'"
      class="mt-auto border-t border-gray-100 px-2 py-1 lg:px-6 lg:py-2 bg-gray-50 group-hover:bg-gray-100/50 transition-colors duration-300"
    >
      <div class="flex items-center justify-between">
        <!-- App Stats -->
        <div class="flex items-center space-x-4 text-small text-gray-500">
          <p class="flex items-center text-small gap-1">
            <i class="bi bi-info-circle"></i>
            {{ app?.departments }}
          </p>
          <p
            v-if="app.modules?.length > 0"
            class="flex items-center text-small text-gray-500 gap-1"
          >
            <i class="bi bi-grid"></i>
            {{ app.modules?.length || 0 }} modules
          </p>
        </div>

        <!-- Main Action -->
        <NuxtLink
          :to="app.path"
          class="inline-flex items-center px-3 py-1.5 text-small font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200"
        >
          Mở
          <i
            class="bi bi-arrow-right ml-1 text-small transition-transform group-hover:translate-x-0.5"
          ></i>
        </NuxtLink>
      </div>
    </div>

    <!-- List View Actions (Right Side) -->
    <div
      v-if="viewMode === 'list'"
      class="flex items-center gap-3 ml-4 shrink-0"
    >
      <!-- Stats (Optional) -->
      <div
        class="hidden sm:flex items-center space-x-4 text-xs text-gray-400 mr-2"
      >
        <span v-if="app.modules?.length > 0" class="flex items-center gap-1">
          <i class="bi bi-grid"></i> {{ app.modules?.length }}
        </span>
      </div>

      <button
        @click.stop="$emit('toggle-favorite')"
        class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        :class="
          isFavorite
            ? 'text-yellow-400 hover:text-yellow-500'
            : 'text-gray-300 hover:text-gray-500'
        "
      >
        <i class="bi" :class="isFavorite ? 'bi-star-fill' : 'bi-star'"></i>
      </button>

      <NuxtLink
        :to="app.path"
        class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200"
      >
        Mở
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  app: {
    type: Object,
    required: true,
  },
  maxDisplayModules: {
    type: Number,
    default: 3,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  viewMode: {
    type: String,
    default: "grid",
  },
});

const colors = ["blue", "purple", "orange", "teal", "red", "emerald"];

const getModuleColor = (index) => colors[index % colors.length];

const displayedModules = computed(() => {
  return props.app.modules?.slice(0, props.maxDisplayModules) || [];
});

const hasMoreModules = computed(() => {
  return props.app.modules?.length > props.maxDisplayModules;
});
</script>
