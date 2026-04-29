<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Chỉnh Sửa Quyền
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <!-- User Info -->
              <div class="p-4 bg-gray-50 rounded-md">
                <div class="text-sm font-medium text-gray-900">
                  {{ permission?.user?.name || 'N/A' }}
                </div>
                <div class="text-xs text-gray-500">{{ permission?.user?.email }}</div>
              </div>

              <!-- App Info -->
              <div class="p-3 bg-blue-50 rounded-md border border-blue-200">
                <div class="flex items-center gap-2">
                  <i :class="[permission?.app?.icon || 'bi bi-app', 'text-blue-600']"></i>
                  <span class="text-sm font-medium text-blue-900">{{ permission?.app?.name }}</span>
                </div>
              </div>

              <!-- Basic Permissions -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Basic Permissions
                </label>
                <div class="space-y-2">
                  <label
                    v-for="action in permission?.app?.availableActions"
                    :key="action"
                    class="flex items-center"
                  >
                    <input
                      v-model="formData.permissions[action]"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700 capitalize">{{ action }}</span>
                  </label>
                </div>
              </div>

              <!-- Custom Permissions -->
              <div v-if="permission?.app?.customPermissions && permission.app.customPermissions.length > 0">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Custom Permissions
                </label>
                <div class="space-y-2">
                  <label
                    v-for="perm in permission.app.customPermissions"
                    :key="perm.code"
                    class="flex items-center"
                    :title="perm.description"
                  >
                    <input
                      v-model="formData.permissions[perm.code]"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ perm.name }}</span>
                  </label>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  @click="selectAllPermissions"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  Chọn tất cả
                </button>
                <span class="text-gray-300">|</span>
                <button
                  type="button"
                  @click="clearAllPermissions"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="$emit('close')"
                class="px-6 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-6 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
  permission: Object
});

const emit = defineEmits(['close', 'save']);

const formData = reactive({
  permissions: {}
});

// Initialize permissions when permission prop changes
watch(() => props.permission, (newVal) => {
  if (newVal && newVal.permissions) {
    formData.permissions = {};
    
    // Set current permissions
    newVal.permissions.forEach(perm => {
      formData.permissions[perm] = true;
    });
  }
}, { immediate: true });

const selectAllPermissions = () => {
  // Select all basic permissions
  props.permission?.app?.availableActions?.forEach(action => {
    formData.permissions[action] = true;
  });
  
  // Select all custom permissions
  props.permission?.app?.customPermissions?.forEach(perm => {
    formData.permissions[perm.code] = true;
  });
};

const clearAllPermissions = () => {
  formData.permissions = {};
};

const handleSubmit = () => {
  // Convert permissions object to array
  const permissions = Object.keys(formData.permissions).filter(
    key => formData.permissions[key]
  );

  emit('save', {
    userId: props.permission.user._id,
    appId: props.permission.app._id,
    permissions
  });
};
</script>
