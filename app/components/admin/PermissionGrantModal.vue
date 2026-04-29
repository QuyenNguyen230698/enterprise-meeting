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
              Cấp Quyền Truy Cập
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
              <!-- User Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Người dùng <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  class="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  @input="searchUsers"
                />
                
                <!-- User list (simplified - in production, use proper user search/select) -->
                <div v-if="searchQuery" class="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                  <div
                    v-for="user in filteredUsers"
                    :key="user._id"
                    @click="selectUser(user)"
                    class="px-3 py-1 hover:bg-gray-50 cursor-pointer"
                  >
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                    <div class="text-xs text-gray-500">{{ user.email }}</div>
                  </div>
                </div>

                <!-- Selected user -->
                <div v-if="formData.userId" class="mt-2 flex items-center justify-between p-3 bg-blue-50 rounded-md">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ selectedUserName }}
                    </div>
                    <div class="text-xs text-gray-500">{{ selectedUserEmail }}</div>
                  </div>
                  <button
                    type="button"
                    @click="clearUser"
                    class="text-red-600 hover:text-red-800"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- App Selection (if apps array provided) -->
              <div v-if="apps && apps.length > 0">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Application <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="formData.appId"
                  required
                  class="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an app</option>
                  <option v-for="app in apps" :key="app._id" :value="app._id">
                    {{ app.name }}
                  </option>
                </select>
              </div>

              <!-- Basic Permissions -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Basic Permissions
                </label>
                <div class="space-y-2">
                  <label
                    v-for="action in currentApp?.availableActions"
                    :key="action"
                    class="flex items-center"
                  >
                    <input
                      v-model="selectedPermissions[action]"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700 capitalize">{{ action }}</span>
                  </label>
                </div>
              </div>

              <!-- Custom Permissions -->
              <div v-if="currentApp?.customPermissions && currentApp.customPermissions.length > 0">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Custom Permissions
                </label>
                <div class="space-y-2">
                  <label
                    v-for="perm in currentApp.customPermissions"
                    :key="perm.code"
                    class="flex items-center"
                    :title="perm.description"
                  >
                    <input
                      v-model="selectedPermissions[perm.code]"
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
                :disabled="!formData.userId || !formData.appId"
                class="px-6 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Grant Access
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

const props = defineProps({
  apps: Array,
  app: Object
});

const emit = defineEmits(['close', 'save']);

const config = useRuntimeConfig();
const { $toast } = useNuxtApp();

const searchQuery = ref('');
const filteredUsers = ref([]);
const selectedUserName = ref('');
const selectedUserEmail = ref('');

const formData = reactive({
  userId: null,
  appId: props.app?._id || '',
  permissions: []
});

const selectedPermissions = ref({});

const currentApp = computed(() => {
  if (props.app) return props.app;
  if (props.apps && formData.appId) {
    return props.apps.find(a => a._id === formData.appId);
  }
  return null;
});

const searchUsers = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    filteredUsers.value = [];
    return;
  }

  try {
    const token = useCookie('token')
    const response = await $fetch(`${config.public.apiBase}/account/search`, {
      params: { q: searchQuery.value },
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    if (response.success) {
      filteredUsers.value = response.data;
    }
  } catch (error) {
    console.error('Error searching users:', error);
  }
};

const selectUser = (user) => {
  formData.userId = user._id;
  selectedUserName.value = `${user.firstName} ${user.lastName}`;
  selectedUserEmail.value = user.email;
  searchQuery.value = '';
  filteredUsers.value = [];
};

const clearUser = () => {
  formData.userId = null;
  selectedUserName.value = '';
  selectedUserEmail.value = '';
};

const selectAllPermissions = () => {
  currentApp.value?.availableActions?.forEach(action => {
    selectedPermissions.value[action] = true;
  });
  
  currentApp.value?.customPermissions?.forEach(perm => {
    selectedPermissions.value[perm.code] = true;
  });
};

const clearAllPermissions = () => {
  selectedPermissions.value = {};
};

const handleSubmit = () => {
  // Convert selected permissions object to array
  const permissions = Object.keys(selectedPermissions.value).filter(
    key => selectedPermissions.value[key]
  );

  if (permissions.length === 0) {
    $toast.error('Please select at least one permission');
    return;
  }

  emit('save', {
    userId: formData.userId,
    appId: formData.appId,
    permissions
  });
};
</script>
