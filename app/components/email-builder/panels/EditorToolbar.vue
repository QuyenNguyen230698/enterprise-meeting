<template>
  <div class="lg:relative lg:top-0 lg:left-0 lg:mt-0 lg:shrink-0 fixed top-18 -mt-1 left-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-4 z-20 lg:z-auto w-full">
    <!-- Left Section -->
    <div class="flex items-center gap-2">
      <!-- Mobile Left Panel Button - Far left -->
      <button
        @click="$emit('toggle-left-panel')"
        class="md:hidden px-3 py-1 hover:bg-gray-100 rounded transition-colors flex gap-2 items-center bg-yellow-200 mr-1"
        title="Elements & Templates"
      >
        <i class="bi bi-grid text-base text-black"></i>
        <span class="text-black sm:inline text-small md:text-xs">Bố cục</span>
      </button>

      <!-- Device Selection Dropdown -->
      <details ref="deviceDropdown" class="dropdown relative hidden md:block">
        <summary class="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg cursor-pointer text-sm transition-colors">
          <i :class="currentDevice.icon + ' text-base'"></i>
          <span class="hidden sm:inline">{{ currentDevice.name }}</span>
          <i class="bi bi-chevron-down text-xs"></i>
        </summary>
        <ul class="absolute top-12 left-0 dropdown-content menu bg-white rounded-lg shadow-xl border border-gray-200 w-56 p-2 z-50">
          <li v-for="device in devices" :key="device.name">
            <a
              @click="handleSelectDevice(device)"
              :class="[
                'flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 rounded-md cursor-pointer'
              ]"
            >
              <i :class="device.icon + ' text-base'"></i>
              <div>
                <div class="font-medium">{{ device.name }}</div>
                <div class="text-xs text-gray-500">{{ device.width }}px</div>
              </div>
              <i
                v-if="currentDevice.name === device.name"
                class="bi bi-check-lg text-blue-600"
              ></i>
            </a>
          </li>
        </ul>
      </details>

      <!-- Structure Map Button -->
      <button
        @click="$emit('show-element-map')"
        class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        title="Xem cấu trúc email"
      >
        <i class="bi bi-diagram-3"></i>
        <span class="hidden lg:inline">Structure</span>
      </button>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-2">
      <!-- Action Groups - Desktop -->
      <div class="hidden lg:flex items-center gap-2">
        <!-- Save Button -->
        <button
          @click="$emit('save')"
          class="px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-2 bg-green-500 text-white hover:bg-green-700"
          title="Save Template"
        >
          <i class="bi bi-cloud-upload text-base"></i>
          <span class="hidden xl:inline">Lưu Thiết Kế</span>
        </button>

        <!-- Divider -->
        <div class="w-px h-6 bg-gray-300"></div>

        <!-- Import Button -->
        <button
          @click="$emit('import')"
          class="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          title="Import JSON"
        >
          <i class="bi bi-upload text-base"></i>
          <span class="hidden xl:inline">Nhập Thiết Kế</span>
        </button>
      </div>

      <!-- Preview Button -->
      <button
        @click="$emit('preview')"
        class="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <i class="bi bi-eye text-base"></i>
        <span class="sm:inline text-small md:text-xs">Xem trước</span>
      </button>

      <!-- Mobile Save Button - Visible on mobile -->
      <button
        @click="$emit('save')"
        class="md:hidden px-3 py-1 text-sm bg-green-200 text-white rounded-lg hover:bg-green-300 transition-colors flex items-center gap-2"
        title="Lưu Thiết Kế"
      >
        <i class="bi bi-cloud-upload text-base text-green-900"></i>
        <span class="sm:inline text-small md:text-xs text-green-900">Lưu</span>
      </button>

      <!-- Mobile Right Panel Button - Far right -->
      <button
        @click="$emit('toggle-right-panel')"
        class="md:hidden p-1.5 hover:bg-gray-100 rounded transition-colors mr-1"
        title="Properties Panel"
      >
        <i class="bi bi-sliders text-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentDevice: {
    type: Object,
    required: true
  },
  devices: {
    type: Array,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'select-device',
  'show-element-map',
  'save',
  'import',
  'preview',
  'toggle-left-panel',
  'toggle-right-panel'
])

const deviceDropdown = ref(null)

const handleSelectDevice = (device) => {
  emit('select-device', device)
  // Close dropdown
  if (deviceDropdown.value) {
    deviceDropdown.value.removeAttribute('open')
  }
}
</script>
