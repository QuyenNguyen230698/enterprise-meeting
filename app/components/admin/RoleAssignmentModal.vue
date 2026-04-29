<template>
  <div style="z-index:999999 !important" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div class="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <i class="bi bi-shield-lock text-purple-600 text-xl"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Phân Quyền Người Dùng</h2>
            <p class="text-sm text-gray-500 mt-0.5">
              <span class="font-medium text-gray-700">{{ user.email }}</span>
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <i class="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200 px-6 shrink-0">
        <button
          @click="activeTab = 'assign'"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition-all',
            activeTab === 'assign' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="bi bi-person-check mr-2"></i>Gán Vai Trò
        </button>
        <button
          @click="activeTab = 'roles'"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition-all',
            activeTab === 'roles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="bi bi-shield-check mr-2"></i>Quản Lý Roles
          <span class="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{{ roles.length }}</span>
        </button>
       
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- ========== TAB 1: ASSIGN ROLES ========== -->
        <div v-show="activeTab === 'assign'">
          <!-- SuperAdmin Warning -->
          <!-- <div v-if="hasSuperAdmin" class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div class="flex items-center gap-3">
              <i class="bi bi-exclamation-triangle text-amber-600 text-xl"></i>
              <div>
                <p class="font-semibold text-amber-800">Quyền Super Admin</p>
                <p class="text-sm text-amber-700 mt-1">
                  Người dùng này có vai trò <strong>Super Admin</strong> - có toàn quyền truy cập tất cả các ứng dụng và chức năng trong hệ thống.
                </p>
              </div>
            </div>
          </div> -->

          <!-- Role Selection -->
          <div class="space-y-3">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Chọn Vai Trò</h3>
              <span class="text-xs text-gray-500">{{ selectedRoles.length }} vai trò được chọn</span>
            </div>

            <div v-if="roles.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
              <i class="bi bi-shield-x text-5xl text-gray-300"></i>
              <p class="mt-3 font-medium">Chưa có vai trò nào</p>
              <p class="text-sm">Vui lòng tạo vai trò trước khi phân quyền</p>
            </div>

          <div v-else class="space-y-3">
            <!-- SuperAdmin Role (Special) -->
            <div
              v-for="role in sortedRoles"
              :key="role._id"
              @click="toggleRole(role._id)"
              :class="[
                'relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200',
                isSelected(role._id) 
                  ? isSuperAdmin(role) 
                    ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-100' 
                    : 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-100'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
              ]"
            >
              <!-- Selection Indicator -->
              <div class="absolute top-4 right-4">
                <div 
                  :class="[
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                    isSelected(role._id)
                      ? isSuperAdmin(role) ? 'bg-amber-500 border-amber-500' : 'bg-blue-500 border-blue-500'
                      : 'border-gray-300 bg-white'
                  ]"
                >
                  <i v-if="isSelected(role._id)" class="bi bi-check text-white text-sm"></i>
                </div>
              </div>

              <!-- Role Header -->
              <div class="flex items-center gap-3 pr-10">
                <div 
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    isSuperAdmin(role) ? 'bg-amber-100' : 'bg-gray-100'
                  ]"
                >
                  <i 
                    :class="[
                      'text-lg',
                      isSuperAdmin(role) ? 'bi bi-shield-fill-check text-amber-600' : 'bi bi-person-badge text-gray-600'
                    ]"
                  ></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="font-semibold text-gray-900">{{ role.name }}</h4>
                    
                    <span 
                      v-if="role.isActive"
                      class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      Hoạt động
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ role.description || 'Không có mô tả' }}</p>
                </div>
              </div>

              <!-- Apps/Permissions -->
              <div v-if="role.permissions && role.permissions.length > 0" class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  <i class="bi bi-grid-3x3-gap-fill mr-1"></i>
                  Ứng dụng được phép ({{ role.permissions.length }})
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    v-for="(perm, idx) in role.permissions.slice(0, 4)"
                    :key="idx"
                    class="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg"
                  >
                    <div class="w-8 h-8 bg-blue-50 rounded flex items-center justify-center shrink-0">
                      <i :class="perm.appId?.icon || 'bi bi-app'" class="text-blue-600 text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-800 truncate">{{ perm.appId?.name || 'Ứng dụng' }}</p>
                      <p class="text-xs text-gray-500">{{ perm.actions?.length || 0 }} quyền</p>
                    </div>
                  </div>
                </div>
                <div 
                  v-if="role.permissions.length > 4" 
                  class="mt-2 text-center"
                >
                  <button 
                    @click.stop="expandedRole = expandedRole === role._id ? null : role._id"
                    class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {{ expandedRole === role._id ? 'Thu gọn' : `Xem thêm ${role.permissions.length - 4} ứng dụng` }}
                    <i :class="expandedRole === role._id ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="ml-1"></i>
                  </button>
                  
                  <!-- Expanded Apps -->
                  <div v-if="expandedRole === role._id" class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div
                      v-for="(perm, idx) in role.permissions.slice(4)"
                      :key="idx"
                      class="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg"
                    >
                      <div class="w-8 h-8 bg-blue-50 rounded flex items-center justify-center shrink-0">
                        <i :class="perm.appId?.icon || 'bi bi-app'" class="text-blue-600 text-sm"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 truncate">{{ perm.appId?.name || 'Ứng dụng' }}</p>
                        <p class="text-xs text-gray-500">{{ perm.actions?.length || 0 }} quyền</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Permissions -->
              <!-- <div v-else class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-xs text-gray-400 italic">
                  <i class="bi bi-info-circle mr-1"></i>
                  {{ isSuperAdmin(role) ? 'Toàn quyền truy cập tất cả ứng dụng' : 'Chưa có quyền nào được gán' }}
                </p>
              </div> -->
            </div>
          </div>
        </div>

        <!-- Selected Roles Summary -->
          <div v-if="selectedRoles.length > 0" class="mt-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-semibold text-blue-900">
                <i class="bi bi-check2-circle mr-2"></i>
                Vai trò được chọn
              </h4>
              <span class="text-sm text-blue-600 font-medium">{{ selectedRoles.length }} vai trò</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="roleId in selectedRoles"
                :key="roleId"
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                  isSuperAdminById(roleId) 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                ]"
              >
                <i :class="isSuperAdminById(roleId) ? 'bi bi-shield-fill-check' : 'bi bi-person-badge'"></i>
                {{ getRoleName(roleId) }}
                <button 
                  @click.stop="toggleRole(roleId)"
                  class="ml-1 hover:bg-white/50 rounded-full p-0.5"
                >
                  <i class="bi bi-x text-sm"></i>
                </button>
              </span>
            </div>
            
            <!-- Total Apps Access -->
            <!-- <div class="mt-3 pt-3 border-t border-blue-200">
              <p class="text-xs text-blue-700">
                <i class="bi bi-info-circle mr-1"></i>
                Tổng cộng truy cập <strong>{{ totalAppsAccess }}</strong> ứng dụng
                <span v-if="hasSuperAdmin" class="text-amber-700">(Super Admin - toàn quyền)</span>
              </p>
            </div> -->
          </div>
        </div>

        <!-- ========== TAB 2: MANAGE ROLES ========== -->
        <div v-show="activeTab === 'roles'">
          <!-- Create New Role -->
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <h4 class="font-semibold text-green-800 mb-3">
              <i class="bi bi-plus-circle mr-2"></i>Tạo Role Mới
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                v-model="newRole.name"
                type="text"
                placeholder="Tên role (vd: Editor)"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
              />
              <input
                v-model="newRole.description"
                type="text"
                placeholder="Mô tả (tùy chọn)"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
              />
              <button
                @click="createRole"
                :disabled="!newRole.name || creatingRole"
                class="px-6 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm font-medium"
              >
                <i v-if="creatingRole" class="bi bi-arrow-repeat animate-spin mr-1"></i>
                <i v-else class="bi bi-plus-lg mr-1"></i>
                Tạo Role
              </button>
            </div>
          </div>

          <!-- Roles List -->
          <div class="space-y-3">
            <h4 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Danh Sách Roles ({{ roles.length }})
            </h4>
            
            <div v-if="roles.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
              <i class="bi bi-shield-x text-5xl text-gray-300"></i>
              <p class="mt-3 font-medium text-gray-500">Chưa có role nào</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="role in roles"
                :key="role._id"
                class="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', isSuperAdmin(role) ? 'bg-amber-100' : 'bg-blue-100']">
                      <i :class="['text-lg', isSuperAdmin(role) ? 'bi bi-shield-fill-check text-amber-600' : 'bi bi-person-badge text-blue-600']"></i>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h5 class="font-semibold text-gray-900">{{ role.name }}</h5>
                  </div>
                      <p class="text-sm text-gray-500">{{ role.description || 'Không có mô tả' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="editRolePermissions(role)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Sửa quyền"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      v-if="!isSuperAdmin(role)"
                      @click="deleteRole(role)"
                      :disabled="deletingRoleId === role._id"
                      class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Xóa role"
                    >
                      <i v-if="deletingRoleId === role._id" class="bi bi-arrow-repeat animate-spin"></i>
                      <i v-else class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Apps in Role -->
                <div class="mt-3 pt-3 border-t border-gray-100">
                  <p class="text-xs text-gray-500 mb-2">
                    <i class="bi bi-grid-3x3-gap mr-1"></i>
                    {{ role.permissions?.length || 0 }} apps được gán
                  </p>
                  <div v-if="role.permissions?.length" class="flex flex-wrap gap-1">
                    <span
                      v-for="perm in role.permissions.slice(0, 5)"
                      :key="perm.appId?._id"
                      class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {{ perm.appId?.name || 'App' }}
                    </span>
                    <span v-if="role.permissions.length > 5" class="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                      +{{ role.permissions.length - 5 }} khác
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <!-- ========== EDIT ROLE PERMISSIONS PANEL ========== -->
        <div v-if="editingRole" class="fixed inset-0 bg-black/30 flex items-center justify-center z-60">
          <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col m-4">
            <div class="flex items-center justify-between p-4 border-b">
              <h3 class="font-bold text-gray-900">
                <i class="bi bi-pencil mr-2"></i>Sửa quyền: {{ editingRole.name }}
              </h3>
              <button @click="editingRole = null" class="p-2 hover:bg-gray-100 rounded-lg">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-4">
              <p class="text-sm text-gray-600 mb-4">Chọn apps cho role này:</p>
              <div class="space-y-2">
                <label
                  v-for="app in apps"
                  :key="app._id"
                  class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  :class="isAppInRole(app._id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'"
                >
                  <input
                    type="checkbox"
                    :checked="isAppInRole(app._id)"
                    @change="toggleAppInRole(app._id)"
                    class="w-4 h-4 text-blue-600 rounded"
                  />
                  <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <i :class="app.icon || 'bi bi-app'" class="text-gray-600"></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ app.name }}</p>
                    <p class="text-xs text-gray-500">{{ app.code }}</p>
                  </div>
                </label>
              </div>
            </div>
            <div class="flex justify-end gap-3 p-4 border-t">
              <button @click="editingRole = null" class="px-6 py-1.5 border rounded-lg hover:bg-gray-100">Hủy</button>
              <button
                @click="saveRolePermissions"
                :disabled="savingRole"
                class="px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <i v-if="savingRole" class="bi bi-arrow-repeat animate-spin mr-1"></i>
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 shrink-0 rounded-b-xl">
        <p class="text-xs text-gray-500">
          <i class="bi bi-lightbulb mr-1"></i>
          Người dùng có thể có nhiều vai trò, quyền sẽ được gộp lại
        </p>
        <div class="flex gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Hủy
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="saving"
            class="px-6 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-sm"
          >
            <i v-if="saving" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-check2"></i>
            <span>{{ saving ? 'Đang lưu...' : 'Lưu Phân Quyền' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const config = useRuntimeConfig()
const { success, error: showError } = useToast()
const { confirmDelete: showConfirmDelete } = useConfirm()

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  roles: {
    type: Array,
    default: () => []
  },
  apps: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save', 'refresh-data'])

// Tab state
const activeTab = ref('assign')

// Assign tab state
const selectedRoles = ref([])
const saving = ref(false)
const expandedRole = ref(null)

// Role management state
const newRole = ref({ name: '', description: '' })
const creatingRole = ref(false)
const deletingRoleId = ref(null)
const editingRole = ref(null)
const editingRolePermissions = ref([])
const savingRole = ref(false)

// App management state
const newApp = ref({ code: '', name: '' })
const creatingApp = ref(false)
const deletingAppId = ref(null)

// Get token helper
const getToken = () => {
  const authStore = useAuthStore()
  return authStore.accessToken || useCookie('accessToken').value
}

// Initialize selected roles from user
watch(() => props.user, (newUser) => {
  if (newUser && newUser.roles) {
    selectedRoles.value = newUser.roles.map(r => r._id || r)
  }
}, { immediate: true })

// Sort roles: SuperAdmin first, then by name
const sortedRoles = computed(() => {
  return [...props.roles].sort((a, b) => {
    if (isSuperAdmin(a) && !isSuperAdmin(b)) return -1
    if (!isSuperAdmin(a) && isSuperAdmin(b)) return 1
    return a.name.localeCompare(b.name)
  })
})

// Check if any selected role is SuperAdmin
const hasSuperAdmin = computed(() => {
  return selectedRoles.value.some(roleId => {
    const role = props.roles.find(r => r._id === roleId)
    return role && isSuperAdmin(role)
  })
})

// Calculate total apps access
const totalAppsAccess = computed(() => {
  if (hasSuperAdmin.value) return 'Tất cả'
  
  const appIds = new Set()
  selectedRoles.value.forEach(roleId => {
    const role = props.roles.find(r => r._id === roleId)
    if (role && role.permissions) {
      role.permissions.forEach(perm => {
        if (perm.appId?._id) appIds.add(perm.appId._id)
      })
    }
  })
  return appIds.size
})

const isSuperAdmin = (role) => {
  const name = role.name?.toLowerCase() || ''
  return name.includes('superadmin') || name.includes('super admin') || name === 'admin'
}

const isSuperAdminById = (roleId) => {
  const role = props.roles.find(r => r._id === roleId)
  return role ? isSuperAdmin(role) : false
}

const isSelected = (roleId) => {
  return selectedRoles.value.includes(roleId)
}

const toggleRole = (roleId) => {
  const index = selectedRoles.value.indexOf(roleId)
  if (index === -1) {
    selectedRoles.value.push(roleId)
  } else {
    selectedRoles.value.splice(index, 1)
  }
}

const getRoleName = (roleId) => {
  const role = props.roles.find(r => r._id === roleId)
  return role ? role.name : 'Unknown'
}

const handleSave = async () => {
  saving.value = true
  try {
    emit('save', selectedRoles.value)
  } finally {
    saving.value = false
  }
}

// ========== ROLE MANAGEMENT ==========
const createRole = async () => {
  if (!newRole.value.name) return
  creatingRole.value = true
  try {
    const token = getToken()
    const response = await $fetch(`${config.public.apiBase}/role-management/roles`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: { name: newRole.value.name, description: newRole.value.description, isActive: true, permissions: [] }
    })
    if (response.success) {
      success('Tạo role thành công!')
      newRole.value = { name: '', description: '' }
      emit('refresh-data')
    }
  } catch (err) {
    showError(err.data?.message || 'Không thể tạo role')
  } finally {
    creatingRole.value = false
  }
}

const deleteRole = async (role) => {
  const confirmed = await showConfirmDelete(`role "${role.name}"`)
  if (!confirmed) return
  deletingRoleId.value = role._id
  try {
    const token = getToken()
    const response = await $fetch(`${config.public.apiBase}/role-management/roles/${role._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.success) {
      success('Xóa role thành công!')
      emit('refresh-data')
    }
  } catch (err) {
    showError(err.data?.message || 'Không thể xóa role')
  } finally {
    deletingRoleId.value = null
  }
}

const editRolePermissions = (role) => {
  editingRole.value = { ...role }
  editingRolePermissions.value = role.permissions?.map(p => p.appId?._id).filter(Boolean) || []
}

const isAppInRole = (appId) => {
  return editingRolePermissions.value.includes(appId)
}

const toggleAppInRole = (appId) => {
  const index = editingRolePermissions.value.indexOf(appId)
  if (index === -1) {
    editingRolePermissions.value.push(appId)
  } else {
    editingRolePermissions.value.splice(index, 1)
  }
}

const saveRolePermissions = async () => {
  savingRole.value = true
  try {
    const token = getToken()
    // Only include valid appIds that exist in the apps list
    const validAppIds = editingRolePermissions.value.filter(appId => 
      props.apps.some(app => app._id === appId && app.isActive)
    )
    const permissions = validAppIds.map(appId => ({
      appId,
      actions: ['view', 'create', 'update', 'delete']
    }))
    // Only send necessary fields, not the whole editingRole object
    const response = await $fetch(`${config.public.apiBase}/role-management/roles/${editingRole.value._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: {
        name: editingRole.value.name,
        description: editingRole.value.description,
        isActive: editingRole.value.isActive,
        permissions
      }
    })
    if (response.success) {
      success('Cập nhật quyền thành công!')
      editingRole.value = null
      emit('refresh-data')
    }
  } catch (err) {
    showError(err.data?.message || 'Không thể cập nhật quyền')
    console.error('Error saving role permissions:', err)
  } finally {
    savingRole.value = false
  }
}

// ========== APP MANAGEMENT ==========
const createApp = async () => {
  if (!newApp.value.code || !newApp.value.name) return
  creatingApp.value = true
  try {
    const token = getToken()
    const response = await $fetch(`${config.public.apiBase}/app-management/apps`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: {
        code: newApp.value.code.toLowerCase().replace(/\s+/g, '-'),
        name: newApp.value.name,
        path: `/${newApp.value.code.toLowerCase().replace(/\s+/g, '-')}`,
        availableActions: ['view', 'create', 'update', 'delete'],
        isActive: true
      }
    })
    if (response.success) {
      success('Tạo app thành công!')
      newApp.value = { code: '', name: '' }
      emit('refresh-data')
    }
  } catch (err) {
    showError(err.data?.message || 'Không thể tạo app')
  } finally {
    creatingApp.value = false
  }
}

const deleteApp = async (app) => {
  const confirmed = await showConfirmDelete(`app "${app.name}"`)
  if (!confirmed) return
  deletingAppId.value = app._id
  try {
    const token = getToken()
    const response = await $fetch(`${config.public.apiBase}/app-management/apps/${app._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.success) {
      success('Xóa app thành công!')
      emit('refresh-data')
    }
  } catch (err) {
    showError(err.data?.message || 'Không thể xóa app')
  } finally {
    deletingAppId.value = null
  }
}
</script>
