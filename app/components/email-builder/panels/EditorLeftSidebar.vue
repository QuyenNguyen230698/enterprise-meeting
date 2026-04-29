<template>
  <div
    :class="[
      'bg-white border-r z-999999 lg:z-1 border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out shrink-0',
      // Desktop behavior
      'md:relative',
      collapsed && !isMobile ? 'md:w-16' : 'md:w-72',
      // Mobile behavior - drawer from left
      'fixed md:relative top-0 left-0 bottom-0 z-50',
      showPanel ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      isMobile ? 'w-80' : ''
    ]"
  >
    <!-- Sidebar Header with Collapse Toggle -->
    <div
      class="pt-20 lg:p-0 border-b border-gray-200 bg-white flex items-center justify-between"
      :class="collapsed && !isMobile ? 'p-2' : 'p-4'"
    >
      <div v-if="!collapsed || isMobile" class="flex items-center gap-2">
        <button
          v-if="!isPublicMode"
          @click="$router.push('/templates')"
          class="w-8 h-8 p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          title="Quay lại danh sách templates"
        >
          <i class="bi bi-arrow-left text-lg"></i>
        </button>
        <div>
          <h2 class="text-sm font-bold text-gray-900">Trình Tạo Email</h2>
          <p class="text-xs text-gray-500">Chỉnh sửa chuyên nghiệp</p>
        </div>
      </div>
      <button
        v-if="!isMobile"
        @click="$emit('update:collapsed', !collapsed)"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
        :title="collapsed ? 'Expand' : 'Collapse'"
      >
        <i :class="collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'" class="text-sm"></i>
      </button>
      <button
        v-if="isMobile"
        @click="$emit('close')"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <i class="bi bi-x-lg text-sm"></i>
      </button>
    </div>

    <!-- Tab Navigation - Full View -->
    <div v-if="!collapsed || isMobile" class="border-b border-gray-200 bg-gray-50">
      <div class="flex">
        <button
          @click="$emit('update:activeTab', 'elements')"
          :class="[
            'flex-1 px-3 py-3 text-xs font-medium transition-all',
            activeTab === 'elements'
              ? 'text-blue-600 bg-white border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
        >
          <i class="bi bi-grid-3x3 mr-1"></i>
          Elements
        </button>
        <button
          @click="$emit('update:activeTab', 'templates')"
          :class="[
            'flex-1 px-3 py-3 text-xs font-medium transition-all',
            activeTab === 'templates'
              ? 'text-green-600 bg-white border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
        >
          <i class="bi bi-file-earmark-richtext mr-1"></i>
          Templates
        </button>
        <button
          @click="$emit('update:activeTab', 'fields')"
          :class="[
            'flex-1 px-3 py-3 text-xs font-medium transition-all',
            activeTab === 'fields'
              ? 'text-purple-600 bg-white border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
        >
          <i class="bi bi-braces mr-1"></i>
          Fields
        </button>
      </div>
    </div>

    <!-- Collapsed State - Icon Tabs -->
    <div v-else class="border-b border-gray-200 bg-gray-50">
      <div class="flex flex-col">
        <button
          @click="$emit('update:activeTab', 'elements')"
          :class="[
            'p-3 text-lg transition-all',
            activeTab === 'elements'
              ? 'text-blue-600 bg-white border-l-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
          title="Elements"
        >
          <i class="bi bi-grid-3x3"></i>
        </button>
        <button
          @click="$emit('update:activeTab', 'templates')"
          :class="[
            'p-3 text-lg transition-all',
            activeTab === 'templates'
              ? 'text-green-600 bg-white border-l-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
          title="Templates"
        >
          <i class="bi bi-file-earmark-richtext"></i>
        </button>
        <button
          @click="$emit('update:activeTab', 'fields')"
          :class="[
            'p-3 text-lg transition-all',
            activeTab === 'fields'
              ? 'text-purple-600 bg-white border-l-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          ]"
          title="Dynamic Fields"
        >
          <i class="bi bi-braces"></i>
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div v-if="!collapsed || isMobile" class="flex-1 overflow-y-auto bg-white">
      <ElementLibrary v-if="activeTab === 'elements'" @add-element="handleAddElement" />
      <TemplateLibrary v-else-if="activeTab === 'templates'" @select-template="handleSelectTemplate" />
      <DynamicFieldsPanel v-else-if="activeTab === 'fields'" @insert-field="handleInsertField" />
    </div>
  </div>
</template>

<script setup>
import ElementLibrary from '~/components/email-builder/ElementLibrary.vue'
import TemplateLibrary from '~/components/email-builder/TemplateLibrary.vue'
import DynamicFieldsPanel from '~/components/email-builder/DynamicFieldsPanel.vue'

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  showPanel: {
    type: Boolean,
    default: false
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  activeTab: {
    type: String,
    default: 'elements'
  },
  isPublicMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:collapsed',
  'update:showPanel',
  'update:activeTab',
  'add-element',
  'load-template',
  'insert-field',
  'close'
])

const handleAddElement = (type) => {
  emit('add-element', type)
}

const handleSelectTemplate = (template) => {
  emit('load-template', template)
}

const handleInsertField = (field) => {
  emit('insert-field', field)
}
</script>
