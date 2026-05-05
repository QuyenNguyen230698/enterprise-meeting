<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Sticky Header -->
    <div class="shrink-0 bg-white border-b border-gray-200 z-20">
      <div class="px-4 sm:px-6 py-4">
        <div class="flex flex-col gap-3">

          <!-- Top Row -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <i class="bi bi-people-fill text-white text-lg sm:text-xl"></i>
              </div>
              <div>
                <h1 class="text-lg sm:text-2xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
                <p class="text-xs text-gray-500 hidden sm:block">
                  {{ isSuperAdmin ? 'SuperAdmin · Quản trị toàn hệ thống' : 'Admin · Quản trị tenant của bạn' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="isSuperAdmin && activeTab === 'users' && !selectedTenant"
                @click="openCreateTenant"
                class="px-4 py-2 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <i class="bi bi-plus-lg"></i>
                <span class="hidden sm:inline">Tạo Tenant</span>
              </button>
              <button
                v-if="activeTab === 'users' && selectedTenant"
                @click="addUserToTenant"
                class="px-4 py-2 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 hover:from-emerald-600 hover:via-teal-600 hover:to-lime-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <i class="bi bi-person-plus"></i>
                <span class="hidden sm:inline">Thêm User</span>
              </button>
            </div>
          </div>

          <!-- Tabs (superAdmin only) + Breadcrumb -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <!-- Tabs -->
            <div v-if="isSuperAdmin" class="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
              <button
                @click="activeTab = 'users'"
                :class="activeTab === 'users'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              >
                <i class="bi bi-people"></i>
                <span class="hidden sm:inline">Người Dùng</span>
              </button>
              <button
                @click="activeTab = 'roles'; fetchRolesWithPermissions()"
                :class="activeTab === 'roles'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              >
                <i class="bi bi-shield-lock"></i>
                <span class="hidden sm:inline">Roles & Permissions</span>
              </button>
            </div>

            <!-- Breadcrumb (inside header, visible when tenant selected) -->
            <div v-if="selectedTenant && activeTab === 'users'" class="flex items-center gap-2 text-sm text-gray-500">
              <button @click="backToTenants" class="hover:text-emerald-600 transition-colors font-medium">
                <i class="bi bi-building mr-1"></i>Tenants
              </button>
              <i class="bi bi-chevron-right text-xs text-gray-400"></i>
              <span class="text-gray-900 font-semibold">{{ selectedTenant.name || selectedTenant.tenant_id }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 min-h-0 overflow-y-auto bg-gray-50 p-4 sm:p-6">

    <!-- ===== TAB: ROLES & PERMISSIONS ===== -->
    <div v-if="isSuperAdmin && activeTab === 'roles'">
      <div v-if="rolesLoading" class="flex justify-center items-center py-20">
        <div class="w-8 h-8 border-2 border-emerald-200 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
      <div v-else class="space-y-6">

        <!-- Role cards + Permission matrix side by side -->
        <div class="flex flex-col xl:flex-row gap-6">

          <!-- Left: Role list -->
          <div class="xl:w-72 shrink-0 space-y-3">
            <div class="flex items-center justify-between px-1">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Roles</p>
              <button
                @click="openAddRoleModal"
                class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                <i class="bi bi-plus-lg"></i>
                Add Role
              </button>
            </div>
            <div
              v-for="role in allRoles"
              :key="role.role_id"
              @click="selectRoleForMatrix(role)"
              class="group bg-white border rounded-xl p-4 cursor-pointer transition-all"
              :class="matrixRole?.role_id === role.role_id
                ? 'border-emerald-400 shadow-md ring-1 ring-emerald-300'
                : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg shrink-0" :class="matrixRole?.role_id === role.role_id ? 'bg-emerald-100' : 'bg-gray-50'">
                  <i class="bi bi-shield-fill text-lg" :class="matrixRole?.role_id === role.role_id ? 'text-emerald-500' : 'text-gray-400'"></i>
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-gray-900 text-sm truncate">{{ role.name }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ (role.permissions || []).length }} permissions</p>
                </div>
                <i class="bi bi-chevron-right text-xs text-emerald-400 ml-auto shrink-0" v-if="matrixRole?.role_id === role.role_id"></i>
                <button
                  v-if="matrixRole?.role_id !== role.role_id"
                  @click.stop="confirmDeleteRole(role)"
                  class="ml-auto shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  title="Xóa role"
                >
                  <i class="bi bi-trash3 text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Permission matrix cho role đang chọn -->
          <div class="flex-1 min-w-0">
            <div v-if="!matrixRole" class="flex flex-col items-center justify-center h-64 text-gray-400">
              <i class="bi bi-arrow-left-circle text-4xl mb-3"></i>
              <p class="text-sm">Chọn một role để quản lý permissions</p>
            </div>

            <div v-else class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <!-- Matrix header -->
              <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
                <div>
                  <h3 class="font-bold text-gray-900 flex items-center gap-2">
                    <i class="bi bi-shield-fill text-emerald-500"></i>
                    {{ matrixRole.name }}
                    <span class="text-xs font-normal text-gray-400 font-mono">#{{ matrixRole.role_id }}</span>
                  </h3>
                  <p class="text-xs text-gray-400 mt-0.5">{{ matrixRole.description }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <!-- Unsaved badge -->
                  <span v-if="matrixDirty" class="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg">
                    <i class="bi bi-circle-fill text-[6px] animate-pulse"></i>
                    Chưa lưu
                  </span>
                  <button
                    @click="openAddPermissionDrawer"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-300 text-emerald-600 text-xs font-medium rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    <i class="bi bi-plus-lg"></i>
                    Tạo permission
                  </button>
                  <button
                    @click="saveMatrixPermissions"
                    :disabled="!matrixDirty || matrixSaving"
                    class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white text-xs font-semibold rounded-lg hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <i v-if="matrixSaving" class="bi bi-arrow-clockwise animate-spin"></i>
                    <i v-else class="bi bi-floppy"></i>
                    {{ matrixSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
                  </button>
                </div>
              </div>

              <!-- Search bar -->
              <div class="px-5 py-3 border-b border-gray-100">
                <div class="relative">
                  <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    v-model="permissionSearch"
                    type="text"
                    placeholder="Tìm permission..."
                    class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <!-- Loading permissions -->
              <div v-if="permissionsLoading" class="flex justify-center py-12">
                <div class="w-7 h-7 border-2 border-emerald-200 border-t-teal-500 rounded-full animate-spin"></div>
              </div>

              <!-- Permission rows grouped by app_group -->
              <div v-else class="divide-y divide-gray-50">
                <div v-for="(perms, group) in groupedFilteredPermissions" :key="group">
                  <!-- Group header -->
                  <div class="px-5 py-2 bg-gray-50/80 flex items-center gap-2">
                    <i class="bi bi-folder text-gray-400 text-xs"></i>
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ group || 'Other' }}</span>
                    <span class="ml-auto text-xs text-gray-400">{{ perms.filter(p => matrixDraft.has(p.permission_id)).length }}/{{ perms.length }}</span>
                  </div>
                  <!-- Permission rows -->
                  <div
                    v-for="perm in perms"
                    :key="perm.permission_id"
                    class="group flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors"
                    :class="{ 'opacity-50': !perm.app_path }"
                  >
                    <input
                      type="checkbox"
                      :id="`perm-${perm.permission_id}`"
                      :checked="matrixDraft.has(perm.permission_id)"
                      @change="toggleDraft(perm.permission_id)"
                      class="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400 cursor-pointer shrink-0"
                    />
                    <label :for="`perm-${perm.permission_id}`" class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                      <i :class="[perm.app_icon || 'bi bi-key', 'text-gray-400 text-base w-5 text-center shrink-0']"></i>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-gray-800 truncate">{{ perm.name }}</p>
                        <p class="text-xs text-gray-400 truncate">{{ perm.description || perm.app_path || '-' }}</p>
                      </div>
                    </label>
                    <span v-if="perm.app_path" class="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded shrink-0 hidden sm:inline">
                      {{ perm.app_path }}
                    </span>
                    <span v-if="perm.parent_name" class="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded shrink-0">
                      sub
                    </span>
                    <button
                      @click.stop="openEditPermission(perm)"
                      class="w-7 h-7 rounded-lg bg-transparent text-gray-300 hover:bg-emerald-50 hover:text-emerald-500 flex items-center justify-center transition-all shrink-0 opacity-0 group-hover:opacity-100"
                    >
                      <i class="bi bi-pencil-square text-xs"></i>
                    </button>
                  </div>
                </div>
                <div v-if="!Object.keys(groupedFilteredPermissions).length" class="py-12 text-center text-gray-400 text-sm">
                  No permissions found
                </div>
              </div>

              <!-- Footer summary -->
              <div class="px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between text-xs text-gray-500">
                <span>{{ matrixDraft.size }} / {{ allPermissions.length }} permissions được cấp</span>
                <button v-if="matrixDirty" @click="resetMatrix" class="text-gray-400 hover:text-red-500 transition-colors">
                  <i class="bi bi-arrow-counterclockwise mr-1"></i>Hoàn tác
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== TAB: USERS (original content) ===== -->
    <div v-if="!isSuperAdmin || activeTab === 'users'">

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-2 border-emerald-200 border-t-teal-500 rounded-full animate-spin"></div>
    </div>

    <!-- Tenant List (superAdmin) or Single Tenant Card (admin) -->
    <div v-else-if="!selectedTenant">
      <div
        v-if="!tenants.length"
        class="text-center py-20 text-gray-400"
      >
        <i class="bi bi-building text-5xl mb-3 block"></i>
        <p>Chưa có tenant nào</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tenant in tenants"
          :key="tenant.tenant_id"
          @click="selectTenant(tenant)"
          class="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 bg-linear-to-br from-emerald-400 via-teal-400 to-lime-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {{ getInitials(tenant.name || tenant.tenant_id) }}
              </div>
              <div class="min-w-0">
                <h3 class="font-semibold text-gray-900 truncate">{{ tenant.name || tenant.tenant_id }}</h3>
                <p class="text-[11px] text-gray-400 font-mono truncate">#{{ tenant.tenant_id || '—' }}</p>
              </div>
            </div>
            <div v-if="isSuperAdmin" class="flex gap-1" @click.stop>
              <button
                @click="openEditTenant(tenant)"
                class="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <i class="bi bi-pencil text-sm"></i>
              </button>
              <button
                @click="confirmDeleteTenant(tenant)"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i class="bi bi-trash text-sm"></i>
              </button>
            </div>
          </div>

          <div class="space-y-1.5 mb-3">
            <p class="text-xs text-gray-500 truncate">
              <i class="bi bi-globe2 mr-1"></i>{{ tenant.domain || 'Chưa có domain' }}
            </p>
            <p v-if="tenant.email" class="text-xs text-gray-500 truncate">
              <i class="bi bi-envelope mr-1"></i>{{ tenant.email }}
            </p>
            <p v-if="tenant.phone" class="text-xs text-gray-500 truncate">
              <i class="bi bi-telephone mr-1"></i>{{ tenant.phone }}
            </p>
            <p v-if="tenant.address" class="text-xs text-gray-500 line-clamp-2">
              <i class="bi bi-geo-alt mr-1"></i>{{ tenant.address }}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap mb-3">
            <span
              class="px-2 py-0.5 rounded-md text-[10px] font-semibold"
              :class="tenant.is_active === false ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'"
            >
              {{ tenant.is_active === false ? 'Inactive' : 'Active' }}
            </span>
            <span class="px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-600">
              Site: {{ displayTenantSite(tenant) }}
            </span>
          </div>

          <div class="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
            <span class="text-gray-500">
              <i class="bi bi-person-fill mr-1"></i>
              {{ displayTenantUserCount(tenant) }} users
            </span>
            <span class="text-gray-400">{{ formatTenantMetaDate(tenant.updated_at || tenant.created_at) }}</span>
          </div>
          <div class="mt-2 flex justify-end text-emerald-500 group-hover:translate-x-0.5 transition-transform">
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- User List inside Tenant -->
    <div v-else>
      <div
        v-if="!users.length"
        class="text-center py-20 text-gray-400"
      >
        <i class="bi bi-person-x text-5xl mb-3 block"></i>
        <p>Chưa có user nào trong tenant này</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div class="flex items-start justify-between mb-3">
            <div
              @click="openEditUser(user)"
              class="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
            >
              <div class="w-10 h-10 bg-linear-to-br from-emerald-400 via-teal-400 to-lime-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {{ getInitials(user.full_name || user.name || user.email) }}
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 truncate">{{ user.full_name || user.name || '—' }}</p>
                <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
              </div>
            </div>
            <button
              @click="confirmRemoveUser(user)"
              class="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2"
            >
              <i class="bi bi-person-dash text-sm"></i>
            </button>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            <!-- <span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-medium">
              {{ getRoleName(user) }}
            </span> -->
            <span v-if="user.title" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
              {{ user.title }}
            </span>
            <span
              v-if="user.admin_meeting_room"
              class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-medium"
            >
              Tenant Admin
            </span>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-100">
            <button
              @click="openEditUser(user)"
              class="text-xs text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
            >
              <i class="bi bi-pencil-square mr-1"></i>Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
    </div>

    </div><!-- end tab users -->

    </div><!-- end scrollable content -->

    <!-- Modal: Create/Edit Tenant -->
    <Teleport to="body">
      <div
        v-if="showTenantModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeTenantModal"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-100 rounded-lg">
                <i class="bi bi-building text-emerald-600 text-lg"></i>
              </div>
              <h2 class="text-lg font-bold text-gray-900">
                {{ editingTenant ? 'Chỉnh Sửa Tenant' : 'Tạo Tenant Mới' }}
              </h2>
            </div>
            <button @click="closeTenantModal" class="text-gray-400 hover:text-gray-600">
              <i class="bi bi-x-lg text-xl"></i>
            </button>
          </div>
          <form @submit.prevent="saveTenant" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tenant ID <span class="text-red-500">*</span></label>
              <input
                v-model="tenantForm.tenant_id"
                :disabled="!!editingTenant"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                placeholder="vd: company-abc"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên Tenant</label>
              <input
                v-model="tenantForm.name"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Tên hiển thị"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input
                v-model="tenantForm.domain"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="vd: company.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                v-model="tenantForm.logo_url"
                type="url"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="tenantForm.email"
                type="email"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                v-model="tenantForm.phone"
                type="tel"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0912 345 678"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <AddressLocation
                v-model="tenantForm.address"
                :dark-theme="false"
              />
            </div>
            <div class="md:col-span-2 flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-700">Kích hoạt</p>
                <p class="text-xs text-gray-400">Tenant có thể hoạt động trong hệ thống</p>
              </div>
              <button
                type="button"
                @click="tenantForm.is_active = !tenantForm.is_active"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0',
                  tenantForm.is_active ? 'bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                    tenantForm.is_active ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>
            <div class="md:col-span-2 flex gap-3 pt-2 border-t border-gray-100 mt-1">
              <button
                type="button"
                @click="closeTenantModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 px-4 py-2 bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white text-sm rounded-lg hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 transition-colors disabled:opacity-60"
              >
                <span v-if="saving"><i class="bi bi-arrow-repeat animate-spin mr-1"></i>Đang lưu...</span>
                <span v-else>{{ editingTenant ? 'Lưu thay đổi' : 'Tạo mới' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Add User to Tenant -->
    <Teleport to="body">
      <div
        v-if="showAddUserModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeAddUserModal"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-[91.666667%] mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-100 rounded-lg">
                <i class="bi bi-person-plus text-emerald-600 text-lg"></i>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Thêm User Vào Tenant</h2>
                <p class="text-xs text-gray-400">{{ selectedTenant?.name || selectedTenant?.tenant_id }}</p>
              </div>
            </div>
            <button @click="closeAddUserModal" class="text-gray-400 hover:text-gray-600">
              <i class="bi bi-x-lg text-xl"></i>
            </button>
          </div>
          <form @submit.prevent="saveAddUser" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
              <input
                v-model="addUserForm.email"
                type="email"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                v-model="addUserForm.name"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="username"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                v-model="addUserForm.full_name"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Nguyen Van A"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mã nhân sự (e_code)</label>
              <input
                v-model="addUserForm.e_code"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                placeholder="Tự sinh từ hệ thống"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Chức danh / Phòng ban</label>
              <select
                v-model="addUserForm.dept_code"
                @change="applyDepartmentPreset(addUserForm, addUserForm.dept_code)"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn chức danh --</option>
                <option
                  v-for="preset in departmentPresets"
                  :key="preset.dept_code"
                  :value="preset.dept_code"
                >
                  {{ preset.department }} - {{ preset.title }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <input
                :value="addUserForm.department"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Chức danh</label>
              <input
                :value="addUserForm.title"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                v-model="addUserForm.phone"
                type="tel"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0912 345 678"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Site / Chi nhánh</label>
              <select
                v-model="addUserForm.site_id"
                @change="applySiteSelection(addUserForm, addUserForm.site_id)"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn site --</option>
                <option
                  v-for="siteOption in siteOptions"
                  :key="siteOption.id"
                  :value="siteOption.id"
                >
                  {{ siteOption.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Site ID</label>
              <input
                :value="addUserForm.site_id"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tenant ID</label>
              <select
                v-model="addUserForm.tenant_id"
                @change="loadAreasForTenant(addUserForm.tenant_id)"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn tenant --</option>
                <option
                  v-for="tenant in tenants"
                  :key="tenant.tenant_id"
                  :value="tenant.tenant_id"
                >
                  {{ tenant.name || tenant.tenant_id }}
                </option>
              </select>
            </div>
            <div v-if="isSuperAdmin">
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                v-model="addUserForm.role_id"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn role --</option>
                <option
                  v-for="role in availableRoles"
                  :key="role.role_id"
                  :value="role.role_id"
                >
                  {{ role.name }}{{ role.description ? ` - ${role.description}` : "" }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-3 lg:col-span-3">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">is_tenant_admin</label>
                <p class="text-xs text-gray-400">Cấp quyền quản trị tenant</p>
              </div>
              <button
                type="button"
                @click="addUserForm.is_tenant_admin = !addUserForm.is_tenant_admin"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0',
                  addUserForm.is_tenant_admin ? 'bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                    addUserForm.is_tenant_admin ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>

            <!-- Actions -->
            <div class="md:col-span-2 lg:col-span-3 flex gap-3 pt-2 border-t border-gray-100 mt-2">
              <button type="button" @click="closeAddUserModal" class="px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
              <button type="submit" :disabled="saving" class="px-6 py-2 bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white text-sm rounded-lg hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 transition-colors disabled:opacity-60">
                <span v-if="saving"><i class="bi bi-arrow-repeat animate-spin mr-1"></i>Đang thêm...</span>
                <span v-else>Thêm User</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Edit User (max-w-11/12) -->
    <Teleport to="body">
      <div
        v-if="showEditUserModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeEditUserModal"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-[91.666667%] mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-linear-to-br from-emerald-400 via-teal-400 to-lime-400 rounded-full flex items-center justify-center text-white font-semibold">
                {{ getInitials(editUserForm.full_name || editUserForm.name || editUserForm.email) }}
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Chỉnh Sửa Người Dùng</h2>
                <p class="text-xs text-gray-400">{{ editUserForm.email }}</p>
              </div>
            </div>
            <button @click="closeEditUserModal" class="text-gray-400 hover:text-gray-600">
              <i class="bi bi-x-lg text-xl"></i>
            </button>
          </div>
          <form @submit.prevent="saveEditUser" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="editUserForm.email"
                type="email"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                v-model="editUserForm.name"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                v-model="editUserForm.full_name"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mã nhân sự (e_code)</label>
              <input
                v-model="editUserForm.e_code"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Chức danh / Phòng ban</label>
              <select
                v-model="editUserForm.dept_code"
                @change="applyDepartmentPreset(editUserForm, editUserForm.dept_code)"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn chức danh --</option>
                <option
                  v-for="preset in departmentPresets"
                  :key="preset.dept_code"
                  :value="preset.dept_code"
                >
                  {{ preset.department }} - {{ preset.title }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <input
                :value="editUserForm.department"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Chức danh</label>
              <input
                :value="editUserForm.title"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                v-model="editUserForm.phone"
                type="tel"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Site / Chi nhánh</label>
              <select
                v-model="editUserForm.site_id"
                @change="applySiteSelection(editUserForm, editUserForm.site_id)"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn site --</option>
                <option
                  v-for="siteOption in siteOptions"
                  :key="siteOption.id"
                  :value="siteOption.id"
                >
                  {{ siteOption.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Site ID</label>
              <input
                :value="editUserForm.site_id"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tenant ID</label>
              <select
                v-model="editUserForm.tenant_id"
                @change="loadAreasForTenant(editUserForm.tenant_id)"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn tenant --</option>
                <option
                  v-for="tenant in tenants"
                  :key="tenant.tenant_id"
                  :value="tenant.tenant_id"
                >
                  {{ tenant.name || tenant.tenant_id }}
                </option>
              </select>
            </div>
            <div v-if="isSuperAdmin">
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                v-model="editUserForm.role_id"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Chọn role --</option>
                <option
                  v-for="role in availableRoles"
                  :key="role.role_id"
                  :value="role.role_id"
                >
                  {{ role.name }}{{ role.description ? ` - ${role.description}` : "" }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-3 lg:col-span-1">
              <div class="flex-1">
                <p class="text-xs text-gray-400">Cấp quyền quản trị tenant này</p>
              </div>
              <button
                type="button"
                @click="editUserForm.is_tenant_admin = !editUserForm.is_tenant_admin"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0',
                  editUserForm.is_tenant_admin ? 'bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                    editUserForm.is_tenant_admin ? 'translate-x-6' : 'translate-x-1'
                  ]"
                ></span>
              </button>
            </div>

            <!-- Actions -->
            <div class="md:col-span-2 lg:col-span-3 flex gap-3 pt-2 border-t border-gray-100 mt-2">
              <button
                type="button"
                @click="closeEditUserModal"
                class="px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-6 py-2 bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white text-sm rounded-lg hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 transition-colors disabled:opacity-60"
              >
                <span v-if="saving"><i class="bi bi-arrow-repeat animate-spin mr-1"></i>Đang lưu...</span>
                <span v-else>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Delete Modal -->
    <Teleport to="body">
      <div v-if="confirmModal.show" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="confirmModal.show = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 z-10">
          <div class="text-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="bi bi-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">{{ confirmModal.title }}</h3>
            <p class="text-sm text-gray-500 mb-5">{{ confirmModal.message }}</p>
            <div class="flex gap-3">
              <button @click="confirmModal.show = false" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
              <button @click="confirmModal.onConfirm" :disabled="saving" class="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60">Xác nhận</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Add Role -->
    <Teleport to="body">
      <div
        v-if="showRoleModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeAddRoleModal"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 z-10">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-100 rounded-lg">
                <i class="bi bi-shield-plus text-emerald-600 text-lg"></i>
              </div>
              <h2 class="text-lg font-bold text-gray-900">Tạo Role Mới</h2>
            </div>
            <button @click="closeAddRoleModal" class="text-gray-400 hover:text-gray-600">
              <i class="bi bi-x-lg text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="saveNewRole" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role ID</label>
              <input
                v-model="newRoleForm.role_id"
                type="text"
                readonly
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed font-mono"
              />
              <p class="text-xs text-gray-400 mt-1">Tự tăng theo chuẩn 200000000n và không trùng.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role Name <span class="text-red-500">*</span></label>
              <input
                v-model="newRoleForm.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="vd: hrManager"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="newRoleForm.description"
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Mô tả role..."
              ></textarea>
            </div>
            <div class="flex gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                @click="closeAddRoleModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="roleSaving || !newRoleForm.name"
                class="flex-1 px-4 py-2 bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white text-sm rounded-lg hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 transition-colors disabled:opacity-60"
              >
                <span v-if="roleSaving"><i class="bi bi-arrow-repeat animate-spin mr-1"></i>Đang tạo...</span>
                <span v-else>Tạo Role</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Drawer: Add Permission -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showPermDrawer"
          @click="showPermDrawer = false"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="showPermDrawer"
          class="fixed right-0 top-0 h-full w-full sm:w-95 lg:w-120 bg-white shadow-2xl z-9999 flex flex-col border-l border-zinc-200 overflow-hidden"
        >
          <!-- Drawer Header -->
          <div class="px-6 py-4 border-b border-zinc-200 bg-linear-to-r from-emerald-50 via-teal-50 to-lime-50 flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-xl font-black text-zinc-900 tracking-tighter uppercase italic">
                <span class="text-emerald-500">Permission</span> Management
              </h3>
              <p class="text-xs text-zinc-400 uppercase tracking-widest mt-1">{{ editingPerm ? 'Chỉnh sửa permission' : 'Tạo mới app permission' }}</p>
            </div>
            <button
              @click="showPermDrawer = false"
              class="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-all hover:rotate-90 group"
            >
              <i class="bi bi-x-lg text-zinc-400 text-lg group-hover:text-zinc-600"></i>
            </button>
          </div>

          <!-- Drawer Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-black text-zinc-400 uppercase tracking-widest">App Icon</label>
                <div class="relative" ref="iconDropdownRef">
                  <button
                    type="button"
                    @click="showIconDropdown = !showIconDropdown"
                    class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all flex items-center justify-between gap-2"
                    :class="showIconDropdown ? 'border-emerald-500 bg-white' : ''"
                  >
                    <span v-if="newPermForm.app_icon" class="flex items-center gap-2">
                      <i :class="newPermForm.app_icon" class="text-zinc-600"></i>
                      <span class="text-zinc-700">{{ newPermForm.app_icon }}</span>
                    </span>
                    <span v-else class="text-zinc-400">-- Chọn icon Bootstrap --</span>
                    <i class="bi bi-chevron-down text-xs text-zinc-400 transition-transform" :class="showIconDropdown ? 'rotate-180' : ''"></i>
                  </button>
                  <div
                    v-show="showIconDropdown"
                    class="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg max-h-52 overflow-y-auto"
                  >
                    <div
                      @click="newPermForm.app_icon = ''; showIconDropdown = false"
                      class="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-50 cursor-pointer border-b border-zinc-100"
                    >
                      -- Chọn icon Bootstrap --
                    </div>
                    <div
                      v-for="icon in bootstrapIconOptions"
                      :key="icon"
                      @click="newPermForm.app_icon = icon; showIconDropdown = false"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-colors"
                      :class="newPermForm.app_icon === icon ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-zinc-700'"
                    >
                      <i :class="icon" class="text-base w-5 text-center"></i>
                      <span>{{ icon }}</span>
                    </div>
                  </div>
                </div>
                <p class="text-xs text-zinc-400">Ví dụ: bi bi-grid, bi bi-people, bi bi-gear.</p>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black text-zinc-400 uppercase tracking-widest">Tên Permission <span class="text-red-500">*</span></label>
                <input
                  v-model="newPermForm.name"
                  type="text"
                  class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="vd: bookings, email-config..."
                />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black text-zinc-400 uppercase tracking-widest">Mô tả</label>
                <textarea
                  v-model="newPermForm.description"
                  rows="2"
                  class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all resize-none"
                  placeholder="Mô tả chức năng của permission..."
                ></textarea>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black text-zinc-400 uppercase tracking-widest">App Path</label>
                <input
                  v-model="newPermForm.app_path"
                  type="text"
                  class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="vd: /bookings, /settings/email-config"
                />
                <p class="text-xs text-zinc-400">Route path trong app. Sub-page dùng dạng /parent/child.</p>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black text-zinc-400 uppercase tracking-widest">App Group</label>
                <select
                  v-model="newPermForm.app_group"
                  class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                >
                  <option value="">-- Chọn group --</option>
                  <option value="admin">admin — Meeting Room</option>
                  <option value="email">email — Email Marketing</option>
                  <option value="system">system — Hệ Thống</option>
                  <option value="settings">settings — Cài đặt</option>
                  <option value="hrm">hrm — HRM System</option>
                  <option value="recruitment">HR — Recruitment</option>
                </select>
                <p class="text-xs text-zinc-400">Nhóm hiển thị trong sidebar.</p>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-black text-zinc-400 uppercase tracking-widest">Parent Permission</label>
                <input
                  v-model="newPermForm.parent_name"
                  type="text"
                  class="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="vd: settings (để trống nếu là top-level)"
                />
                <p class="text-xs text-zinc-400">AppCode của permission cha. Điền nếu đây là sub-page.</p>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-5 border-t border-zinc-100 bg-zinc-50/30 flex gap-3 shrink-0">
            <button
              @click="showPermDrawer = false"
              class="flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-white border border-zinc-200 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 transition-all"
            >Hủy bỏ</button>
            <button
              @click="editingPerm ? saveEditPermission() : saveNewPermission()"
              :disabled="permSaving || !newPermForm.name"
              class="flex-2 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-linear-to-r from-emerald-400 via-teal-400 to-lime-400 text-white hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500 hover:shadow-xl hover:shadow-emerald-100 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:bg-zinc-400"
            >
              <i v-if="permSaving" class="bi bi-arrow-clockwise animate-spin"></i>
              {{ permSaving ? 'Đang lưu...' : editingPerm ? 'Lưu thay đổi' : 'Khởi tạo' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Global Confirm Modal -->
    <ConfirmModal
      :is-visible="isVisible"
      :title="confirmData.title"
      :subtitle="confirmData.subtitle"
      :message="confirmData.message"
      :confirm-text="confirmData.confirmText"
      :cancel-text="confirmData.cancelText"
      :type="confirmData.type"
      :loading="confirmData.loading"
      :loading-text="confirmData.loadingText"
      @confirm="doConfirm"
      @cancel="doCancel"
    />
  </div>
</template>

<script setup>
import ConfirmModal from "~/components/ConfirmModal.vue";

definePageMeta({ middleware: ["auth", "permission"] });

const authStore = useAuthStore();
const { success, error: showError } = useToast();
const { isVisible, confirmData, confirm: doConfirm, cancel: doCancel, confirmDelete, confirmLeave } = useConfirm();
const isSuperAdmin = computed(() => authStore.isSuperAdmin);
const isAdminOnly  = computed(() => authStore.isAdminOnly);

// State
const loading = ref(false);
const saving = ref(false);
const tenants = ref([]);
const users = ref([]);
const roles = ref([]);
const areas = ref([]);
const tenantMeta = ref({});
const selectedTenant = ref(null);

// Modals
const showTenantModal = ref(false);
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const editingTenant = ref(null);
const editingUser = ref(null);

const tenantForm = reactive({
  tenant_id: "", name: "", domain: "", logo_url: "",
  address: "", phone: "", email: "", is_active: true,
});
const addUserForm = reactive({
  email: "", e_code: "", name: "", full_name: "",
  dept_code: "", department: "", title: "", phone: "", joined_at: "", site: "", site_id: "",
  tenant_id: "", role_id: "", is_tenant_admin: false,
});
const editUserForm = reactive({
  email: "", e_code: "", name: "", full_name: "",
  dept_code: "", department: "", title: "", phone: "", joined_at: "", site: "", site_id: "",
  tenant_id: "", role_id: "", is_tenant_admin: false,
});

const departmentPresets = [
  { department: "GM", dept_code: "GM_DIRECTOR", title: "Tổng Giám Đốc" },
  { department: "HR", dept_code: "HR_DIRECTOR", title: "Giám đốc Nhân sự" },
  { department: "HR", dept_code: "HR_MANAGER", title: "Trưởng phòng Nhân sự" },
  { department: "HR", dept_code: "HR_STAFF", title: "Chuyên viên Nhân sự" },
  { department: "HR", dept_code: "HR_EMPLOYEE", title: "Nhân viên Hành chính Nhân sự" },
  { department: "IT", dept_code: "IT_DIRECTOR", title: "Giám đốc IT" },
  { department: "IT", dept_code: "IT_MANAGER", title: "Trưởng phòng IT" },
  { department: "IT", dept_code: "IT_EMPLOYEE", title: "Nhân viên IT" },
  { department: "MKT", dept_code: "MKT_MANAGER", title: "Trưởng phòng Marketing" },
  { department: "MKT", dept_code: "MKT_SPECIALIST", title: "Chuyên viên Marketing" },
  { department: "MKT", dept_code: "MKT_DIRECTOR", title: "Giám đốc Marketing" },
  { department: "MKT", dept_code: "MKT_DIGITAL", title: "Chuyên viên Marketing Digital" },
  { department: "MKT", dept_code: "MKT_EMPLOYEE", title: "Nhân viên Marketing" },
  { department: "MKT", dept_code: "MKT_CONTENT", title: "Chuyên viên Content Marketing" },
  { department: "MKT", dept_code: "MKT_SOCIAL", title: "Chuyên viên Social Media Marketing" },
  { department: "SALES", dept_code: "SALES_MANAGER", title: "Trưởng phòng Kinh doanh" },
  { department: "SALES", dept_code: "SALES_DIRECTOR", title: "Giám đốc Kinh doanh" },
  { department: "SALES", dept_code: "SALES_LEADER", title: "Trưởng nhóm Kinh doanh" },
  { department: "SALES", dept_code: "SALES_EMPLOYEE", title: "Nhân viên Kinh doanh" },
  { department: "ACC", dept_code: "ACC_CHIEF", title: "Kế toán trưởng" },
  { department: "ACC", dept_code: "ACC_MANAGER", title: "Trưởng phòng Kế toán" },
  { department: "ACC", dept_code: "ACC_EMPLOYEE", title: "Nhân viên Kế toán" },
  { department: "PROD", dept_code: "PROD_MANAGER", title: "Quản đốc sản xuất" },
  { department: "PROD", dept_code: "PROD_ENGINEER", title: "Kỹ sư sản xuất" },
  { department: "PROD", dept_code: "PROD_EMPLOYEE", title: "Nhân viên Sản xuất (Công nhân)" },
  { department: "LOG", dept_code: "LOG_MANAGER", title: "Trưởng bộ phận Kho vận" },
  { department: "LOG", dept_code: "LOG_PURCHASING", title: "Chuyên viên Thu mua" },
  { department: "LOG", dept_code: "LOG_EMPLOYEE", title: "Nhân viên Kho vận" },
  { department: "TECH", dept_code: "TECH_MANAGER", title: "Trưởng phòng Kỹ thuật" },
  { department: "TECH", dept_code: "TECH_DIRECTOR", title: "Giám đốc Kỹ thuật" },
  { department: "TECH", dept_code: "TECH_EMPLOYEE", title: "Nhân viên Kỹ thuật" },
];

const confirmModal = reactive({
  show: false, title: "", message: "", onConfirm: () => {},
});

const roleMap = computed(() =>
  Object.fromEntries(roles.value.map((r) => [r.role_id, r.name]))
);

const getRoleName = (user) => roleMap.value[user.role] || user.role || "member";

// superAdmin thấy tất cả roles, admin loại trừ superAdmin
const availableRoles = computed(() => {
  if (isSuperAdmin.value) return roles.value;
  return roles.value.filter((r) => r.name !== "superAdmin");
});
const siteOptions = computed(() =>
  (areas.value || []).map((area) => ({ id: area.id, name: area.name }))
);

const getInitials = (str) => {
  if (!str) return "?";
  const parts = str.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : str.slice(0, 2).toUpperCase();
};

const formatTenantMetaDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const inferSiteFromDomain = (domain) => {
  const raw = String(domain || "").trim().toLowerCase();
  if (!raw) return "—";
  const host = raw.replace(/^https?:\/\//, "").split("/")[0];
  const first = host.split(".")[0];
  if (!first) return "—";
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const displayTenantSite = (tenant) => {
  const tid = tenant?.tenant_id;
  const fromMeta = tid ? tenantMeta.value?.[tid]?.site : null;
  return fromMeta || tenant?.site || tenant?.site_name || inferSiteFromDomain(tenant?.domain);
};

const displayTenantUserCount = (tenant) => {
  const tid = tenant?.tenant_id;
  const fromMeta = tid ? tenantMeta.value?.[tid]?.user_count : null;
  return fromMeta ?? tenant?.user_count ?? tenant?.users_count ?? 0;
};

const loadTenantCardMeta = async (tenantList = []) => {
  if (!isSuperAdmin.value || !tenantList.length) {
    tenantMeta.value = {};
    return;
  }

  const entries = await Promise.all(
    tenantList.map(async (tenant) => {
      const tid = tenant?.tenant_id;
      if (!tid) return [null, null];
      try {
        const res = await useFetchAuth(`/v1/users?tenant_id=${encodeURIComponent(tid)}`);
        const tenantUsers = res?.data || res || [];
        const firstWithSite = tenantUsers.find((u) => u?.site) || tenantUsers.find((u) => u?.site_id);
        return [
          tid,
          {
            user_count: tenantUsers.length,
            site: firstWithSite?.site || null,
          },
        ];
      } catch (_) {
        return [
          tid,
          {
            user_count: tenant?.user_count ?? tenant?.users_count ?? 0,
            site: tenant?.site || tenant?.site_name || null,
          },
        ];
      }
    })
  );

  tenantMeta.value = Object.fromEntries(entries.filter(([k]) => !!k));
};

const normalizeDateOnly = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
};

// apiBase = http://localhost:8000/api → paths start with /v1/
//
// superAdmin (role_id=2000000001):
//   fetchTenants → GET /v1/tenants          (all tenants, no filter)
//   fetchUsers   → GET /v1/users?tenant_id= (explicit, JWT has no tenant_id)
//
// admin (role_id=2000000002):
//   fetchTenants → GET /v1/tenants/{tenant_id} (own tenant only)
//   fetchUsers   → GET /v1/users               (gateway filters by JWT tenant_id)
const fetchTenants = async () => {
  loading.value = true;
  try {
    if (isSuperAdmin.value) {
      // superAdmin: lấy toàn bộ tenants
      const res = await useFetchAuth("/v1/tenants");
      tenants.value = res?.data || res || [];
      await loadTenantCardMeta(tenants.value);
    } else if (isAdminOnly.value) {
      // admin: chỉ lấy tenant của mình qua /:tenant_id
      const tenantId = authStore.User?.tenant_id;
      if (!tenantId) { tenants.value = []; return; }
      const res = await useFetchAuth(`/v1/tenants/${tenantId}`);
      const t = res?.data || res;
      tenants.value = t ? [t] : [];
      tenantMeta.value = {};
    }
    // member: không gọi API tenant
  } finally {
    loading.value = false;
  }
};

const fetchUsers = async (tenantId) => {
  loading.value = true;
  try {
    if (isSuperAdmin.value) {
      // superAdmin không có tenant_id trong JWT — phải truyền qua query
      const res = await useFetchAuth(`/v1/users?tenant_id=${encodeURIComponent(tenantId)}`);
      users.value = res?.data || res || [];
    } else if (isAdminOnly.value) {
      // admin: gateway tự lấy tenant_id từ JWT
      const res = await useFetchAuth("/v1/users");
      users.value = res?.data || res || [];
    }
  } finally {
    loading.value = false;
  }
};

const fetchRoles = async () => {
  try {
    const res = await useFetchAuth("/v1/roles");
    roles.value = res?.data || res || [];
  } catch {
    roles.value = [];
  }
};

const loadAreasForTenant = async (tenantId) => {
  if (!tenantId) {
    areas.value = [];
    return;
  }
  try {
    const query = isSuperAdmin.value
      ? `tenant_id=${encodeURIComponent(tenantId)}`
      : "";
    const url = `/v1/areas${query ? `?${query}` : ""}`;
    const res = await useFetchAuth(url);
    areas.value = res?.data || res || [];
  } catch {
    areas.value = [];
  }
};

const selectTenant = async (tenant) => {
  selectedTenant.value = tenant;
  await loadAreasForTenant(tenant.tenant_id);
  await fetchUsers(tenant.tenant_id);
};

const backToTenants = () => {
  selectedTenant.value = null;
  users.value = [];
  areas.value = [];
};

const refreshUserPageState = async () => {
  await fetchTenants();
  if (!selectedTenant.value?.tenant_id) return;

  const latestTenant =
    tenants.value.find((t) => t.tenant_id === selectedTenant.value.tenant_id) ||
    selectedTenant.value;
  selectedTenant.value = latestTenant;

  await Promise.all([
    fetchUsers(selectedTenant.value.tenant_id),
    loadAreasForTenant(selectedTenant.value.tenant_id),
  ]);
};

// Tenant CRUD
const openCreateTenant = () => {
  editingTenant.value = null;
  Object.assign(tenantForm, { tenant_id: "", name: "", domain: "", logo_url: "", address: "", phone: "", email: "", is_active: true });
  showTenantModal.value = true;
};

const openEditTenant = (tenant) => {
  editingTenant.value = tenant;
  Object.assign(tenantForm, {
    tenant_id: tenant.tenant_id, name: tenant.name || "",
    domain: tenant.domain || "", logo_url: tenant.logo_url || "",
    address: tenant.address || "", phone: tenant.phone || "",
    email: tenant.email || "", is_active: tenant.is_active !== false,
  });
  showTenantModal.value = true;
};

const closeTenantModal = () => { showTenantModal.value = false; };

const saveTenant = async () => {
  saving.value = true;
  try {
    if (editingTenant.value) {
      const { tenant_id, ...editPayload } = tenantForm;
      await useFetchAuth(`/v1/tenants/${tenantForm.tenant_id}`, {
        method: "PUT", body: editPayload,
      });
      const t = tenants.value.find((t) => t.tenant_id === tenantForm.tenant_id);
      if (t) Object.assign(t, editPayload);
    } else {
      const res = await useFetchAuth("/v1/tenants", {
        method: "POST", body: { ...tenantForm },
      });
      tenants.value.push(res?.data || res);
    }
    success(editingTenant.value ? "Cập nhật tenant thành công" : "Tạo tenant thành công");
    closeTenantModal();
  } catch (e) {
    showError(e?.data?.message || e?.message || "Không thể lưu tenant");
  } finally {
    saving.value = false;
  }
};

const confirmDeleteTenant = (tenant) => {
  Object.assign(confirmModal, {
    show: true,
    title: "Xóa Tenant",
    message: `Bạn có chắc muốn xóa tenant "${tenant.name || tenant.tenant_id}"? Hành động này không thể hoàn tác.`,
    onConfirm: async () => {
      saving.value = true;
      try {
        await useFetchAuth(`/v1/tenants/${tenant.tenant_id}`, { method: "DELETE" });
        tenants.value = tenants.value.filter((t) => t.tenant_id !== tenant.tenant_id);
        confirmModal.show = false;
        success("Đã xóa tenant");
      } catch (e) {
        showError(e?.data?.message || e?.message || "Không thể xóa tenant");
      } finally {
        saving.value = false;
      }
    },
  });
};

// User management
const addUserToTenant = () => {
  Object.assign(addUserForm, {
    email: "", e_code: "", name: "", full_name: "",
    dept_code: "", department: "", title: "", phone: "", joined_at: "", site: "", site_id: "",
    tenant_id: selectedTenant.value?.tenant_id || "",
    role_id: "",
    is_tenant_admin: false,
  });
  loadAreasForTenant(addUserForm.tenant_id);
  showAddUserModal.value = true;
};

const closeAddUserModal = () => { showAddUserModal.value = false; };

const saveAddUser = async () => {
  saving.value = true;
  try {
    const { is_tenant_admin, role_id, site_id, ...rest } = addUserForm;
    await useFetchAuth("/v1/users", {
      method: "POST",
      body: {
        ...rest,
        site_id: site_id ? Number(site_id) : null,
        tenant_id: addUserForm.tenant_id || selectedTenant.value.tenant_id,
        role: isSuperAdmin.value && role_id ? role_id : undefined,
        is_tenant_admin,
        admin_meeting_room: is_tenant_admin,
      },
    });
    await refreshUserPageState();
    success("Tạo người dùng thành công");
    closeAddUserModal();
  } catch (e) {
    showError(e?.data?.message || e?.message || "Không thể tạo người dùng");
  } finally {
    saving.value = false;
  }
};

const confirmRemoveUser = (user) => {
  Object.assign(confirmModal, {
    show: true,
    title: "Xóa User Khỏi Tenant",
    message: `Bạn có chắc muốn xóa "${user.full_name || user.email}" khỏi tenant này?`,
    onConfirm: async () => {
      saving.value = true;
      try {
        await useFetchAuth(`/v1/users/${user.id}`, { method: "DELETE" });
        await refreshUserPageState();
        confirmModal.show = false;
        success("Đã xóa người dùng");
      } catch (e) {
        showError(e?.data?.message || e?.message || "Không thể xóa người dùng");
      } finally {
        saving.value = false;
      }
    },
  });
};

const openEditUser = (user) => {
  editingUser.value = user;
  const deptCode = user.dept_code || "";
  const matchedPreset = departmentPresets.find((p) => p.dept_code === deptCode);
  Object.assign(editUserForm, {
    email: user.email || "",
    e_code: user.e_code || "",
    name: user.name || "",
    full_name: user.full_name || "",
    dept_code: deptCode,
    department: user.department || matchedPreset?.department || "",
    title: user.title || matchedPreset?.title || "",
    phone: user.phone || "",
    joined_at: normalizeDateOnly(
      user.joined_at ??
      user.joining_date ??
      user.profile?.joined_at ??
      user.profile?.joining_date
    ),
    site: user.site || "",
    site_id: user.site_id || "",
    tenant_id: user.tenant_id || selectedTenant.value?.tenant_id || "",
    role_id: user.role || "",
    is_tenant_admin: !!(user.is_tenant_admin ?? user.admin_meeting_room),
  });
  loadAreasForTenant(editUserForm.tenant_id);
  showEditUserModal.value = true;
};

const closeEditUserModal = () => { showEditUserModal.value = false; };

const saveEditUser = async () => {
  saving.value = true;
  try {
    const { is_tenant_admin, role_id, site_id, ...rest } = editUserForm;
    const payload = {
      ...rest,
      site_id: site_id ? Number(site_id) : null,
      role: isSuperAdmin.value && role_id ? role_id : undefined,
      is_tenant_admin,
      admin_meeting_room: is_tenant_admin,
    };
    await useFetchAuth(
      `/v1/users/${editingUser.value.id}`,
      { method: "PUT", body: payload }
    );
    await refreshUserPageState();
    success("Cập nhật người dùng thành công");
    closeEditUserModal();
  } catch (e) {
    showError(e?.data?.message || e?.message || "Không thể cập nhật người dùng");
  } finally {
    saving.value = false;
  }
};

const applyDepartmentPreset = (targetForm, deptCode) => {
  const preset = departmentPresets.find((item) => item.dept_code === deptCode);
  if (!preset) {
    targetForm.department = "";
    targetForm.title = "";
    return;
  }
  targetForm.department = preset.department;
  targetForm.title = preset.title;
};

const applySiteSelection = (targetForm, siteId) => {
  const selectedSite = siteOptions.value.find((item) => String(item.id) === String(siteId));
  targetForm.site_id = selectedSite ? String(selectedSite.id) : "";
  targetForm.site = selectedSite ? selectedSite.name : "";
};

// ===== ROLES & PERMISSIONS TAB =====
const activeTab = ref('users');
const allRoles = ref([]);
const allPermissions = ref([]);
const rolesLoading = ref(false);
const permissionsLoading = ref(false);
const permSaving = ref(false);
const showPermDrawer = ref(false);
const showRoleModal = ref(false);
const roleSaving = ref(false);
const permissionSearch = ref('');

const newPermForm = reactive({
  name: '', description: '', app_path: '', app_icon: '', app_group: '', parent_name: '',
});
const newRoleForm = reactive({
  role_id: '',
  name: '',
  description: '',
});

const showIconDropdown = ref(false)
const iconDropdownRef = ref(null)

const handleIconClickOutside = (e) => {
  if (iconDropdownRef.value && !iconDropdownRef.value.contains(e.target)) {
    showIconDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', handleIconClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleIconClickOutside))

const bootstrapIconOptions = [
  // --- Hệ thống & Điều hướng ---
  'bi bi-grid', 'bi bi-speedometer2', 'bi bi-gear', 'bi bi-gear-wide-connected',
  'bi bi-sliders', 'bi bi-list', 'bi bi-house', 'bi bi-search', 
  'bi bi-box-arrow-right', 'bi bi-box-arrow-in-right', 'bi bi-shield-check',

  // --- Quản lý & Người dùng ---
  'bi bi-people', 'bi bi-person-badge', 'bi bi-person-circle', 'bi bi-person-plus',
  'bi bi-building', 'bi bi-briefcase', 'bi bi-mortarboard',

  // --- Truyền thông & Thông báo ---
  'bi bi-envelope', 'bi bi-megaphone', 'bi bi-bell', 'bi bi-chat-dots',
  'bi bi-telephone', 'bi bi-share', 'bi bi-info-circle', 'bi bi-exclamation-triangle',

  // --- Công việc & Tài liệu ---
  'bi bi-pencil-square', 'bi bi-kanban', 'bi bi-clipboard-data', 
  'bi bi-file-earmark-text', 'bi bi-folder2-open', 'bi bi-archive',
  'bi bi-calendar-check', 'bi bi-clock-history', 'bi bi-cloud-arrow-up',

  // --- Tài chính & Thương mại (Bổ sung mới) ---
  'bi bi-cart3', 'bi bi-bag-check', 'bi bi-credit-card', 'bi bi-wallet2',
  'bi bi-cash-stack', 'bi bi-graph-up-arrow', 'bi bi-tag', 'bi bi-gem',

  // --- Công cụ & Đồ họa (Bổ sung mới) ---
  'bi bi-camera', 'bi bi-image', 'bi bi-play-circle', 'bi bi-mic',
  'bi bi-palette', 'bi bi-tools', 'bi bi-life-preserver', 'bi bi-cpu',
  'bi bi-database', 'bi bi-code-slash', 'bi bi-terminal',

  // --- Tương tác (Bổ sung mới) ---
  'bi bi-hand-thumbs-up', 'bi bi-heart', 'bi bi-star', 'bi bi-bookmark',
  'bi bi-check2-circle', 'bi bi-plus-lg', 'bi bi-trash', 'bi bi-eye'
]

// Matrix state — single role selected, draft Set of permission_ids
const matrixRole = ref(null);
const matrixDraft = ref(new Set());
const matrixSaving = ref(false);

const matrixDirty = computed(() => {
  if (!matrixRole.value) return false;
  const original = new Set(matrixRole.value.permissions || []);
  if (original.size !== matrixDraft.value.size) return true;
  for (const id of matrixDraft.value) if (!original.has(id)) return true;
  return false;
});

const selectRoleForMatrix = async (role) => {
  if (matrixDirty.value && matrixRole.value?.role_id !== role.role_id) {
    const ok = await confirmLeave();
    if (!ok) return;
  }
  matrixRole.value = role;
  matrixDraft.value = new Set(role.permissions || []);
  if (!allPermissions.value.length) await fetchAllPermissions();
};

const toggleDraft = (permId) => {
  const s = new Set(matrixDraft.value);
  if (s.has(permId)) s.delete(permId);
  else s.add(permId);
  matrixDraft.value = s;
};

const resetMatrix = () => {
  if (!matrixRole.value) return;
  matrixDraft.value = new Set(matrixRole.value.permissions || []);
};

const saveMatrixPermissions = async () => {
  if (!matrixRole.value || matrixSaving.value) return;
  matrixSaving.value = true;
  try {
    const updatedPerms = [...matrixDraft.value];
    await useFetchAuth(`/v1/roles/${matrixRole.value.role_id}`, {
      method: 'PUT', body: { permissions: updatedPerms },
    });
    // Sync back to allRoles
    const idx = allRoles.value.findIndex((r) => r.role_id === matrixRole.value.role_id);
    if (idx !== -1) {
      allRoles.value[idx].permissions = updatedPerms;
      matrixRole.value = { ...allRoles.value[idx] };
    }
    matrixDraft.value = new Set(updatedPerms);
    // Refresh sidebar store
    const appsStore = useAppsStore();
    await appsStore.fetchApps();
    success("Đã lưu phân quyền role");
  } catch (e) {
    console.error('[saveMatrixPermissions]', e);
    showError(e?.data?.message || e?.message || "Không thể lưu phân quyền");
  } finally {
    matrixSaving.value = false;
  }
};

// Permissions grouped by app_group, filtered by search
const groupedFilteredPermissions = computed(() => {
  const q = permissionSearch.value.toLowerCase();
  const filtered = q
    ? allPermissions.value.filter(
        (p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
      )
    : allPermissions.value;

  return filtered.reduce((acc, perm) => {
    const group = perm.app_group || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {});
});

const fetchRolesWithPermissions = async () => {
  if (allRoles.value.length) return;
  rolesLoading.value = true;
  try {
    const [rolesRes, permsRes] = await Promise.all([
      useFetchAuth('/v1/roles'),
      useFetchAuth('/v1/roles/permissions'),
    ]);
    allRoles.value = rolesRes?.data || rolesRes || [];
    allPermissions.value = permsRes?.data || permsRes || [];
  } catch {
    allRoles.value = [];
  } finally {
    rolesLoading.value = false;
  }
};

const openAddRoleModal = () => {
  Object.assign(newRoleForm, {
    role_id: '',
    name: '',
    description: '',
  });
  showRoleModal.value = true;
};

const closeAddRoleModal = () => {
  showRoleModal.value = false;
};

const saveNewRole = async () => {
  if (roleSaving.value || !newRoleForm.name) return;
  roleSaving.value = true;
  try {
    const body = {
      ...(newRoleForm.role_id ? { role_id: newRoleForm.role_id } : {}),
      name: newRoleForm.name.trim(),
      description: newRoleForm.description?.trim() || undefined,
      permissions: [],
    };
    const res = await useFetchAuth('/v1/roles', { method: 'POST', body });
    const created = res?.data || res;
    allRoles.value.push(created);
    allRoles.value.sort((a, b) => Number(a.role_id) - Number(b.role_id));
    roles.value.push(created);
    roles.value.sort((a, b) => Number(a.role_id) - Number(b.role_id));
    matrixRole.value = created;
    matrixDraft.value = new Set(created.permissions || []);
    closeAddRoleModal();
    success("Tạo role thành công");
  } catch (e) {
    console.error('[saveNewRole]', e);
    showError(e?.data?.message || e?.message || "Không thể tạo role");
  } finally {
    roleSaving.value = false;
  }
};

const confirmDeleteRole = async (role) => {
  const ok = await confirmDelete(`role "${role.name}"`);
  if (!ok) return;
  deleteRole(role);
};

const deleteRole = async (role) => {
  try {
    await useFetchAuth(`/v1/roles/${role.role_id}`, { method: 'DELETE' });
    allRoles.value = allRoles.value.filter((r) => r.role_id !== role.role_id);
    roles.value = roles.value.filter((r) => r.role_id !== role.role_id);
    if (matrixRole.value?.role_id === role.role_id) {
      matrixRole.value = null;
      matrixDraft.value = new Set();
    }
    success(`Đã xóa role "${role.name}"`);
  } catch (e) {
    console.error('[deleteRole]', e);
    showError(e?.data?.message || e?.message || 'Không thể xóa role');
  }
};

const fetchAllPermissions = async () => {
  permissionsLoading.value = true;
  try {
    const res = await useFetchAuth('/v1/roles/permissions');
    allPermissions.value = res?.data || res || [];
  } catch (e) {
    console.error('[fetchAllPermissions]', e);
  } finally {
    permissionsLoading.value = false;
  }
};

const editingPerm = ref(null);

const openAddPermissionDrawer = () => {
  editingPerm.value = null;
  Object.assign(newPermForm, { name: '', description: '', app_path: '', app_icon: '', app_group: '', parent_name: '' });
  showPermDrawer.value = true;
};

const openEditPermission = (perm) => {
  editingPerm.value = perm;
  Object.assign(newPermForm, {
    name:        perm.name        || '',
    description: perm.description || '',
    app_path:    perm.app_path    || '',
    app_icon:    perm.app_icon    || '',
    app_group:   perm.app_group   || '',
    parent_name: perm.parent_name || '',
  });
  showPermDrawer.value = true;
};

const saveEditPermission = async () => {
  if (permSaving.value || !newPermForm.name || !editingPerm.value) return;
  permSaving.value = true;
  try {
    const body = {
      name:        newPermForm.name,
      description: newPermForm.description || undefined,
      app_path:    newPermForm.app_path    || undefined,
      app_icon:    newPermForm.app_icon    || undefined,
      app_group:   newPermForm.app_group   || undefined,
      parent_name: newPermForm.parent_name || undefined,
    };
    const res = await useFetchAuth(`/v1/roles/permissions/${editingPerm.value.permission_id}`, { method: 'PUT', body });
    const updated = res?.data || res;
    const idx = allPermissions.value.findIndex(p => p.permission_id === editingPerm.value.permission_id);
    if (idx !== -1) allPermissions.value[idx] = { ...allPermissions.value[idx], ...updated };
    const appsStore = useAppsStore();
    await appsStore.fetchApps();
    showPermDrawer.value = false;
    success('Cập nhật permission thành công');
  } catch (e) {
    console.error('[saveEditPermission]', e);
    showError(e?.data?.message || e?.message || 'Không thể cập nhật permission');
  } finally {
    permSaving.value = false;
  }
};

const saveNewPermission = async () => {
  if (permSaving.value || !newPermForm.name) return;
  permSaving.value = true;
  try {
    const body = {
      name:        newPermForm.name,
      description: newPermForm.description || undefined,
      app_path:    newPermForm.app_path    || undefined,
      app_icon:    newPermForm.app_icon    || undefined,
      app_group:   newPermForm.app_group   || undefined,
      parent_name: newPermForm.parent_name || undefined,
    };
    const res = await useFetchAuth('/v1/roles/permissions', { method: 'POST', body });
    const created = res?.data || res;
    allPermissions.value.push(created);
    const appsStore = useAppsStore();
    await appsStore.fetchApps();
    showPermDrawer.value = false;
    success("Tạo permission thành công");
  } catch (e) {
    console.error('[saveNewPermission]', e);
    showError(e?.data?.message || e?.message || "Không thể tạo permission");
  } finally {
    permSaving.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchTenants(), fetchRoles()]);
  // admin: auto-select tenant của mình
  if (!isSuperAdmin.value && tenants.value.length === 1) {
    await selectTenant(tenants.value[0]);
  }
});
</script>
