<template>
  <div style="z-index:999999 !important" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[85vh] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 bg-gradient-to-r from-emerald-50 to-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <i class="bi bi-shield-check text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">
              {{ isEdit ? 'Chỉnh Sửa Vai Trò' : 'Tạo Vai Trò Mới' }}
            </h2>
            <p class="text-xs text-gray-500">
              {{ isEdit ? 'Cập nhật thông tin và quyền' : 'Thêm vai trò mới vào hệ thống' }}
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

      <!-- 2-Column Layout -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Left Column (30%) - Basic Info -->
        <div class="w-[30%] border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto">
          <div class="space-y-5">
            <!-- Role Name -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Tên Vai Trò <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="VD: SuperAdmin"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>

            <!-- Status -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Trạng Thái
              </label>
              <select
                v-model="formData.isActive"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              >
                <option :value="true">Hoạt động</option>
                <option :value="false">Không hoạt động</option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Mô Tả
              </label>
              <textarea
                v-model="formData.description"
                rows="4"
                placeholder="Mô tả vai trò..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
              ></textarea>
            </div>

            <!-- Summary Card -->
            <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div class="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Tổng Quan
              </div>
              <div class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Ứng dụng:</span>
                  <span class="font-bold text-emerald-600">{{ selectedAppsCount }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Quyền hạn:</span>
                  <span class="font-bold text-green-600">{{ totalActionsCount }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="space-y-2">
              <button
                type="button"
                @click="selectAllApps"
                class="w-full px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <i class="bi bi-check-all"></i>
                Chọn Tất Cả
              </button>
              <button
                type="button"
                @click="deselectAllApps"
                class="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                <i class="bi bi-x-lg"></i>
                Bỏ Chọn
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column (70%) - Permissions -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Permissions Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-white shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-gray-900">Phân Quyền Ứng Dụng</h3>
                <p class="text-xs text-gray-500 mt-0.5">Chọn ứng dụng và quyền truy cập</p>
              </div>
              <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                {{ selectedAppsCount }}/{{ apps.length }} apps
              </span>
            </div>
          </div>

          <!-- Apps List -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Empty State -->
            <div v-if="apps.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
              <i class="bi bi-app text-5xl mb-3"></i>
              <p class="font-medium">Chưa có ứng dụng nào</p>
            </div>

            <!-- Apps Grid -->
            <div v-else class="space-y-3">
              <div
                v-for="app in apps"
                :key="app._id"
                :class="[
                  'border-2 rounded-xl p-4 transition-all',
                  isAppSelected(app._id) 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                ]"
              >
                <!-- App Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3 flex-1">
                    <div 
                      :class="[
                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                        isAppSelected(app._id) ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                      ]"
                    >
                      <i :class="app.icon || 'bi bi-app'"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-900 text-sm">{{ app.name }}</h4>
                        <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">{{ app.code }}</span>
                      </div>
                      <p class="text-xs text-gray-500 truncate mt-0.5">{{ app.description || 'Không có mô tả' }}</p>
                    </div>
                  </div>
                  
                  <!-- Toggle -->
                  <label class="relative inline-flex items-center cursor-pointer ml-3">
                    <input
                      type="checkbox"
                      :checked="isAppSelected(app._id)"
                      @change="toggleApp(app._id, app)"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <!-- Actions (when selected) -->
                <div v-if="isAppSelected(app._id)" class="pt-3 border-t border-emerald-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-semibold text-gray-700">Quyền được cấp:</span>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-emerald-600 font-bold">{{ getSelectedActionsCount(app._id) }}/{{ app.availableActions?.length || 0 }}</span>
                      <button
                        type="button"
                        @click="selectAllActionsForApp(app)"
                        class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition font-medium"
                      >
                        Tất cả
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <label
                      v-for="action in app.availableActions"
                      :key="action"
                      :class="[
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition text-xs font-medium border-2',
                        isActionSelected(app._id, action) 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
                      ]"
                    >
                      <input
                        type="checkbox"
                        :checked="isActionSelected(app._id, action)"
                        @change="toggleAction(app._id, action)"
                        class="sr-only"
                      />
                      <i :class="getActionIcon(action)"></i>
                      <span class="capitalize">{{ getActionLabel(action) }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
        <p class="text-xs text-gray-500">
          <i class="bi bi-lightbulb mr-1"></i>
          Tip: SuperAdmin nên có quyền truy cập tất cả ứng dụng
        </p>
        <div class="flex gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
          >
            Hủy
          </button>
          <button
            @click="handleSubmit"
            :disabled="saving || !formData.name"
            class="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/30 text-sm"
          >
            <i v-if="saving" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-check2"></i>
            <span>{{ saving ? 'Đang lưu...' : (isEdit ? 'Cập Nhật' : 'Tạo Vai Trò') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  role: {
    type: Object,
    default: null
  },
  apps: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.role)
const saving = ref(false)

const formData = ref({
  name: '',
  description: '',
  isActive: true,
  permissions: []
})

// Watch for role prop changes
watch(() => props.role, (newRole) => {
  if (newRole) {
    formData.value = {
      name: newRole.name || '',
      description: newRole.description || '',
      isActive: newRole.isActive !== undefined ? newRole.isActive : true,
      permissions: newRole.permissions ? JSON.parse(JSON.stringify(newRole.permissions)) : []
    }
  } else {
    formData.value = {
      name: '',
      description: '',
      isActive: true,
      permissions: []
    }
  }
}, { immediate: true })

// Computed
const selectedAppsCount = computed(() => formData.value.permissions.length)

const totalActionsCount = computed(() => {
  return formData.value.permissions.reduce((total, p) => total + (p.actions?.length || 0), 0)
})

// Methods
const isAppSelected = (appId) => {
  return formData.value.permissions.some(p => p.appId === appId || p.appId?._id === appId)
}

const isActionSelected = (appId, action) => {
  const perm = formData.value.permissions.find(p => p.appId === appId || p.appId?._id === appId)
  return perm?.actions?.includes(action) || false
}

const getSelectedActionsCount = (appId) => {
  const perm = formData.value.permissions.find(p => p.appId === appId || p.appId?._id === appId)
  return perm?.actions?.length || 0
}

const toggleApp = (appId, app) => {
  const index = formData.value.permissions.findIndex(p => p.appId === appId || p.appId?._id === appId)
  if (index > -1) {
    formData.value.permissions.splice(index, 1)
  } else {
    // Add with all actions by default
    formData.value.permissions.push({
      appId: appId,
      actions: app?.availableActions ? [...app.availableActions] : []
    })
  }
}

const toggleAction = (appId, action) => {
  const perm = formData.value.permissions.find(p => p.appId === appId || p.appId?._id === appId)
  if (perm) {
    const actionIndex = perm.actions.indexOf(action)
    if (actionIndex > -1) {
      perm.actions.splice(actionIndex, 1)
    } else {
      perm.actions.push(action)
    }
  }
}

const selectAllApps = () => {
  formData.value.permissions = props.apps.map(app => ({
    appId: app._id,
    actions: app.availableActions ? [...app.availableActions] : []
  }))
}

const deselectAllApps = () => {
  formData.value.permissions = []
}

const selectAllActionsForApp = (app) => {
  const perm = formData.value.permissions.find(p => p.appId === app._id || p.appId?._id === app._id)
  if (perm) {
    perm.actions = app.availableActions ? [...app.availableActions] : []
  }
}

const getActionIcon = (action) => {
  const icons = {
    read: 'bi bi-eye',
    write: 'bi bi-pencil',
    create: 'bi bi-plus-circle',
    update: 'bi bi-arrow-repeat',
    delete: 'bi bi-trash',
    manage: 'bi bi-gear',
    admin: 'bi bi-shield-check',
    export: 'bi bi-download',
    import: 'bi bi-upload'
  }
  return icons[action] || 'bi bi-check'
}

const getActionLabel = (action) => {
  const labels = {
    read: 'Xem',
    write: 'Ghi',
    create: 'Tạo',
    update: 'Sửa',
    delete: 'Xóa',
    manage: 'Quản lý',
    admin: 'Admin',
    export: 'Xuất',
    import: 'Nhập'
  }
  return labels[action] || action
}

const handleSubmit = async () => {
  saving.value = true
  try {
    // Clean up permissions - only send appId and actions
    const cleanPermissions = formData.value.permissions
      .map(p => ({
        appId: p.appId?._id || p.appId,
        actions: p.actions || []
      }))
      .filter(p => p.actions.length > 0)

    const submitData = {
      name: formData.value.name,
      description: formData.value.description,
      isActive: formData.value.isActive,
      permissions: cleanPermissions
    }

    emit('save', submitData)
  } finally {
    saving.value = false
  }
}
</script>
