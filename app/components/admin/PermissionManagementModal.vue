<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div>
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Manage Permissions: {{ app.name }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">{{ app.description }}</p>
            </div>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
              <i class="bi bi-x-lg text-xl"></i>
            </button>
          </div>

          <!-- Tabs -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button
                @click="activeTab = 'users'"
                :class="[
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                <i class="bi bi-people mr-2"></i>
                Users with Access
              </button>
              <button
                @click="activeTab = 'permissions'"
                :class="[
                  activeTab === 'permissions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                <i class="bi bi-shield-check mr-2"></i>
                Available Permissions
              </button>
            </nav>
          </div>

          <!-- Users Tab -->
          <div v-if="activeTab === 'users'">
            <div class="flex justify-between items-center mb-4">
              <input
                v-model="searchUser"
                type="text"
                placeholder="Search users..."
                class="px-6 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                @click="openGrantModal"
                class="px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <i class="bi bi-plus-lg mr-2"></i>
                Grant Access
              </button>
            </div>

            <div v-if="loadingUsers" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <div v-else-if="filteredUsers.length === 0" class="text-center py-12 text-gray-500">
              <i class="bi bi-inbox text-4xl block mb-2"></i>
              No users with access
            </div>

            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="userPerm in filteredUsers"
                :key="userPerm.user._id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <i class="bi bi-person text-gray-600"></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ userPerm.user.name || 'N/A' }}</p>
                    <p class="text-sm text-gray-500">{{ userPerm.user.email }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="perm in userPerm.permissions"
                      :key="perm"
                      class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {{ perm }}
                    </span>
                  </div>
                  <button
                    @click="editUserPermission(userPerm)"
                    class="p-2 text-gray-600 hover:text-blue-600 transition"
                    title="Edit"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    @click="revokeUserAccess(userPerm)"
                    class="p-2 text-gray-600 hover:text-red-600 transition"
                    title="Revoke Access"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Permissions Tab -->
          <div v-if="activeTab === 'permissions'">
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Available Actions</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    v-for="action in app.availableActions"
                    :key="action"
                    class="p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <i class="bi bi-check-circle text-blue-600 mr-2"></i>
                    <span class="font-medium text-blue-900">{{ action }}</span>
                  </div>
                </div>
              </div>

              <div v-if="app.customPermissions && app.customPermissions.length > 0">
                <h4 class="font-medium text-gray-900 mb-3">Custom Permissions</h4>
                <div class="space-y-2">
                  <div
                    v-for="perm in app.customPermissions"
                    :key="perm.code"
                    class="p-3 bg-purple-50 rounded-lg border border-purple-200"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-purple-900">{{ perm.name }}</p>
                        <p class="text-sm text-purple-700">Code: {{ perm.code }}</p>
                        <p v-if="perm.description" class="text-sm text-gray-600 mt-1">
                          {{ perm.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <button
                  @click="openAddPermissionModal"
                  class="px-6 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  <i class="bi bi-plus-lg mr-2"></i>
                  Add Custom Permission
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grant Access Modal -->
    <PermissionGrantModal
      v-if="showGrantModal"
      :app="app"
      @close="showGrantModal = false"
      @save="handleGrantAccess"
    />
  </div>
</template>

<script setup>

import PermissionGrantModal from './PermissionGrantModal.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'

const { isVisible, confirmData, confirm: confirmAction, cancel: cancelAction, confirmAction: showConfirmAction } = useConfirm()

const props = defineProps({
  app: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const config = useRuntimeConfig()
const { $toast } = useNuxtApp()

const activeTab = ref('users')
const searchUser = ref('')
const loadingUsers = ref(false)
const users = ref([])
const showGrantModal = ref(false)

const filteredUsers = computed(() => {
  if (!searchUser.value) return users.value
  
  const search = searchUser.value.toLowerCase()
  return users.value.filter(
    u => u.user.name?.toLowerCase().includes(search) || u.user.email.toLowerCase().includes(search)
  )
})

const fetchUsers = async () => {
  loadingUsers.value = true
  try {
    const token = useCookie('token')
    const response = await $fetch(`${config.public.apiBase}/app-management/permissions/app/${props.app._id}/users`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    if (response.success) {
      users.value = response.data
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loadingUsers.value = false
  }
}

const openGrantModal = () => {
  showGrantModal.value = true
}

const handleGrantAccess = async (data) => {
  await fetchUsers()
  showGrantModal.value = false
}

const editUserPermission = (userPerm) => {
  // TODO: Open edit modal
}

const revokeUserAccess = async (userPerm) => {
  const confirmed = await showConfirmAction(
    'Thu hồi quyền truy cập',
    `Thu hồi tất cả quyền truy cập cho ${userPerm.user.name || userPerm.user.email}?`,
    { type: 'danger', confirmText: 'Thu hồi' }
  )
  if (!confirmed) return

  try {
    const token = useCookie('token')
    const response = await $fetch(`${config.public.apiBase}/app-management/permissions/revoke`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        userId: userPerm.user._id,
        appId: props.app._id,
        permissions: userPerm.permissions
      }
    })

    if (response.success) {
      $toast.success('Access revoked successfully')
      await fetchUsers()
    }
  } catch (error) {
    $toast.error('Failed to revoke access')
    console.error('Error revoking access:', error)
  }
}

const openAddPermissionModal = () => {
  // TODO: Open add custom permission modal
  $toast.info('Add custom permission feature coming soon')
}

onMounted(() => {
  fetchUsers()
})
</script>
