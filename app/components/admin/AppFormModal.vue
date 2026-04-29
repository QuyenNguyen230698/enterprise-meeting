<template>
  <div style="z-index:99999 !important" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

    <!-- Modal panel -->
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
      <!-- Header -->
      <div class="bg-linear-to-r  from-blue-600 to-indigo-600 px-8 py-6 text-white shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <i :class="formData.icon || 'bi bi-app'" class="text-2xl text-white"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold">
                {{ props.app ? 'Edit Application' : 'Create New Application' }}
              </h3>
              <p class="text-blue-100 mt-1">{{ props.app ? 'Update application details and configuration' : 'Configure new application settings' }}</p>
            </div>
          </div>
          <button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors rounded-lg p-2 hover:bg-white/10">
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-1 min-h-0 overflow-hidden">
        <!-- Sidebar Navigation -->
        <div class="w-64 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto shrink-0">
          <nav class="space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              @click="currentTab = tab.id"
              :class="[
                'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                currentTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              ]"
            >
              <i :class="tab.icon" class="text-lg"></i>
              {{ tab.label }}
            </button>
          </nav>
          
          <!-- Preview Card -->
          <div class="mt-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Live Preview</h4>
            <div class="flex items-center gap-3">
              <div :class="[formData.theme?.bgColor || 'bg-gray-100', 'w-10 h-10 rounded-lg flex items-center justify-center']">
                <i :class="[formData.icon || 'bi bi-app', formData.theme?.textColor || 'text-gray-600', 'text-lg']"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ formData.name || 'App Name' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ formData.code || 'app-code' }}</p>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Status:</span>
                <span :class="formData.isActive ? 'text-green-600' : 'text-red-600'">
                  {{ formData.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto">
          <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
            <!-- Basic Info Tab -->
            <div v-show="currentTab === 'basic'" class="space-y-6">
              <!-- App Identity Section -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="bi bi-info-circle text-blue-600"></i>
                  Application Identity
                </h4>
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Application Code <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.code"
                      type="text"
                      required
                      :disabled="!!props.app"
                      class="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="app-code"
                    />
                    <p class="text-xs text-gray-500 mt-1">Unique identifier (cannot be changed after creation)</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Application Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter application name"
                    />
                    <p class="text-xs text-gray-500 mt-1">Display name shown to users</p>
                  </div>
                </div>
                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    class="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Brief description of the application purpose and features"
                  ></textarea>
                </div>
              </div>

              <!-- Configuration Section -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="bi bi-gear text-blue-600"></i>
                  Configuration
                </h4>
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Group</label>
                    <select
                      v-model="formData.group"
                      class="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">App (Default)</option>
                      <option value="admin">Admin</option>
                      <option value="marketing">Marketing</option>
                      <option value="convert">Convert File</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="system">System</option>
                      <option value="recruitment">Recruitment</option>
                      <option value="it">IT</option>
                      <option value="order">Order</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Route Path <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.path"
                      type="text"
                      required
                      class="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      placeholder="/admin/app-name"
                    />
                  </div>
                </div>
              </div>

              <!-- Appearance Section -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="bi bi-palette text-blue-600"></i>
                  Appearance
                </h4>
                
                <!-- Icon Selection -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Application Icon</label>
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white">
                      <i :class="formData.icon || 'bi bi-app'" class="text-2xl text-gray-600"></i>
                    </div>
                    <div class="flex-1">
                      <input
                        v-model="formData.icon"
                        type="text"
                        class="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="bi bi-app"
                      />
                    </div>
                    <button
                      type="button"
                      class="px-4 py-3 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      @click="toggleIconPicker"
                    >
                      Browse Icons
                    </button>
                  </div>
                </div>

                <!-- Theme Selection -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <label class="block text-sm font-medium text-gray-700">Color Theme</label>
                    <button
                      type="button"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      @click="randomizeTheme"
                    >
                      <i class="bi bi-shuffle mr-1"></i>
                      Randomize
                    </button>
                  </div>
                  <div class="grid grid-cols-5 gap-3">
                    <button
                      v-for="theme in themeOptions"
                      :key="theme.name"
                      type="button"
                      @click="selectTheme(theme)"
                      :class="[
                        'p-4 rounded-xl border-2 transition-all duration-200 text-center',
                        theme.bgColor,
                        theme.textColor,
                        isThemeSelected(theme) ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 hover:border-gray-300'
                      ]"
                    >
                      <div class="text-lg font-bold mb-1">Aa</div>
                      <div class="text-xs opacity-80">{{ theme.name }}</div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Status Toggle -->
              <div class="bg-gray-50 rounded-xl p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <i class="bi bi-toggle-on text-blue-600"></i>
                      Application Status
                    </h4>
                    <p class="text-sm text-gray-500 mt-1">Control whether this application is active and accessible</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="formData.isActive"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Permissions Tab -->
            <div v-show="currentTab === 'permissions'" class="space-y-6">
              <!-- Basic Permissions -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="bi bi-shield-check text-blue-600"></i>
                  Basic Permissions
                </h4>
                <div class="grid grid-cols-2 gap-4">
                  <label
                    v-for="action in basicActions"
                    :key="action"
                    class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                  >
                    <input
                      v-model="formData.availableActions"
                      type="checkbox"
                      :value="action"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <div>
                      <span class="text-sm font-medium text-gray-900 capitalize">{{ action }}</span>
                      <p class="text-xs text-gray-500">Allow {{ action }} operations</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Custom Permissions -->
              <div class="bg-gray-50 rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <i class="bi bi-key text-purple-600 text-lg"></i>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900">Custom Permissions</h4>
                      <p class="text-sm text-gray-500">Define specific permissions for this application</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="addCustomPermission"
                    class="inline-flex items-center gap-2 px-6 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <i class="bi bi-plus-circle text-sm"></i>
                    Add Permission
                  </button>
                </div>
                
                <div v-if="formData.customPermissions.length === 0" class="text-center py-12">
                  <div class="w-20 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="bi bi-key text-purple-500 text-2xl"></i>
                  </div>
                  <h5 class="text-lg font-semibold text-gray-900 mb-2">No Custom Permissions</h5>
                  <p class="text-gray-500 mb-4 max-w-sm mx-auto">Create custom permissions to define specific access controls for your application.</p>
                  <button
                    type="button"
                    @click="addCustomPermission"
                    class="inline-flex items-center gap-2 px-6 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <i class="bi bi-plus-lg"></i>
                    Create First Permission
                  </button>
                </div>
                
                <div v-else class="space-y-4">
                  <div
                    v-for="(perm, index) in formData.customPermissions"
                    :key="index"
                    class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <!-- Permission Header -->
                    <div class="bg-linear-to-r  from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="bi bi-shield-check text-purple-600 text-sm"></i>
                          </div>
                          <div>
                            <h6 class="font-semibold text-gray-900">Permission #{{ index + 1 }}</h6>
                            <p class="text-xs text-gray-500">{{ perm.name || 'Unnamed Permission' }}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          @click="removeCustomPermission(index)"
                          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Remove Permission"
                        >
                          <i class="bi bi-trash text-sm"></i>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Permission Form -->
                    <div class="p-6 space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Permission Code <span class="text-red-500">*</span>
                          </label>
                          <div class="relative">
                            <i class="bi bi-code-slash absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input
                              v-model="perm.code"
                              type="text"
                              placeholder="delete_many"
                              class="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
                            />
                          </div>
                          <p class="text-xs text-gray-500 mt-1">Unique identifier (snake_case recommended)</p>
                        </div>
                        
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Display Name <span class="text-red-500">*</span>
                          </label>
                          <div class="relative">
                            <i class="bi bi-tag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input
                              v-model="perm.name"
                              type="text"
                              placeholder="Delete Multiple Items"
                              class="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <p class="text-xs text-gray-500 mt-1">Human-readable name for users</p>
                        </div>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <div class="relative">
                          <i class="bi bi-chat-text absolute left-3 top-3 text-gray-400 text-sm"></i>
                          <textarea
                            v-model="perm.description"
                            rows="3"
                            placeholder="Allows users to delete multiple items at once for bulk operations"
                            class="block w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                          ></textarea>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Explain what this permission allows users to do</p>
                      </div>
                      
                      <!-- Permission Preview -->
                      <div v-if="perm.code && perm.name" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                            <i class="bi bi-eye text-purple-600 text-sm"></i>
                          </div>
                          <div class="flex-1">
                            <h6 class="text-sm font-semibold text-gray-900 mb-1">Preview</h6>
                            <div class="space-y-1 text-xs">
                              <div><span class="text-gray-500">Code:</span> <code class="bg-white px-2 py-1 rounded border font-mono">{{ perm.code }}</code></div>
                              <div><span class="text-gray-500">Name:</span> <span class="font-medium">{{ perm.name }}</span></div>
                              <div v-if="perm.description"><span class="text-gray-500">Description:</span> {{ perm.description }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Icon Picker Modal -->
            <div
              v-if="showIconPicker"
              class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              @click="showIconPicker = false"
            >
              <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" @click.stop>
                <div class="p-6 border-b border-gray-200">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Choose an Icon</h3>
                  <input
                    v-model="iconSearch"
                    type="text"
                    placeholder="Search icons..."
                    class="w-full px-6 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="p-6 max-h-96 overflow-y-auto">
                  <div class="grid grid-cols-6 gap-3">
                    <button
                      v-for="icon in filteredIcons"
                      :key="icon"
                      type="button"
                      class="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 transition-colors"
                      @click="selectIcon(icon)"
                    >
                      <i :class="icon" class="text-2xl text-gray-600 mb-1"></i>
                      <span class="text-xs text-gray-500 text-center">{{ icon.replace('bi bi-', '') }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-between shrink-0">
        <div class="text-sm text-gray-500">
          <i class="bi bi-info-circle mr-1"></i>
          {{ props.app ? 'Changes will be saved immediately' : 'Application will be created with these settings' }}
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i :class="props.app ? 'bi bi-check-lg' : 'bi bi-plus-lg'"></i>
            {{ props.app ? 'Update Application' : 'Create Application' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  app: Object
});

const emit = defineEmits(['close', 'save']);

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: 'bi bi-info-circle' },
  { id: 'permissions', label: 'Permissions', icon: 'bi bi-shield-check' }
];

const currentTab = ref('basic');

const themeOptions = [
  { name: 'Ocean Blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { name: 'Royal Indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700' },
  { name: 'Emerald', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700' },
  { name: 'Sunrise', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  { name: 'Violet', bgColor: 'bg-violet-100', textColor: 'text-violet-700' },
  { name: 'Rose', bgColor: 'bg-rose-100', textColor: 'text-rose-700' },
  { name: 'Slate', bgColor: 'bg-slate-100', textColor: 'text-slate-700' },
  { name: 'Teal', bgColor: 'bg-teal-100', textColor: 'text-teal-700' },
  { name: 'Citrus', bgColor: 'bg-lime-100', textColor: 'text-lime-700' },
  { name: 'Coral', bgColor: 'bg-orange-100', textColor: 'text-orange-700' }
];

const iconOptions = [
  'bi bi-123','bi bi-alarm','bi bi-align-bottom','bi bi-align-center','bi bi-align-end','bi bi-align-middle','bi bi-align-start','bi bi-align-top','bi bi-alt','bi bi-app','bi bi-app-indicator','bi bi-archive','bi bi-arrow-bar-down','bi bi-arrow-bar-left','bi bi-arrow-bar-right','bi bi-arrow-bar-up','bi bi-arrow-clockwise','bi bi-arrow-counterclockwise','bi bi-arrow-down','bi bi-arrow-down-circle','bi bi-arrow-down-left','bi bi-arrow-down-right','bi bi-arrow-down-short','bi bi-arrow-down-square','bi bi-arrow-left','bi bi-arrow-left-circle','bi bi-arrow-left-right','bi bi-arrow-left-short','bi bi-arrow-left-square','bi bi-arrow-repeat','bi bi-arrow-return-left','bi bi-arrow-return-right','bi bi-arrow-right','bi bi-arrow-right-circle','bi bi-arrow-right-short','bi bi-arrow-right-square','bi bi-arrow-up','bi bi-arrow-up-circle','bi bi-arrow-up-left','bi bi-arrow-up-right','bi bi-arrow-up-short','bi bi-arrow-up-square','bi bi-arrows-angle-contract','bi bi-arrows-angle-expand','bi bi-arrows-collapse','bi bi-arrows-expand','bi bi-arrows-fullscreen','bi bi-arrows-move','bi bi-aspect-ratio','bi bi-asterisk','bi bi-at','bi bi-award','bi bi-back','bi bi-backspace','bi bi-badge-3d','bi bi-badge-4k','bi bi-badge-8k','bi bi-badge-ad','bi bi-badge-ar','bi bi-badge-cc','bi bi-badge-hd','bi bi-badge-tm','bi bi-badge-vo','bi bi-badge-vr','bi bi-badge-wc','bi bi-bag','bi bi-bag-check','bi bi-bag-dash','bi bi-bag-fill','bi bi-bag-plus','bi bi-bag-x','bi bi-bar-chart','bi bi-bar-chart-fill','bi bi-bar-chart-line','bi bi-bar-chart-steps','bi bi-basket','bi bi-basket-fill','bi bi-basket2','bi bi-basket3','bi bi-battery','bi bi-battery-charging','bi bi-battery-full','bi bi-battery-half','bi bi-bell','bi bi-bell-fill','bi bi-bell-slash','bi bi-bezier','bi bi-bezier2','bi bi-bicycle','bi bi-binoculars','bi bi-blockquote-left','bi bi-blockquote-right','bi bi-book','bi bi-book-fill','bi bi-book-half','bi bi-bookmark','bi bi-bookmark-check','bi bi-bookmark-dash','bi bi-bookmark-fill','bi bi-bookmark-heart','bi bi-bookmark-plus','bi bi-bookmark-star','bi bi-bookmark-x','bi bi-bookmarks','bi bi-bookshelf','bi bi-bootstrap','bi bi-border','bi bi-border-all','bi bi-border-bottom','bi bi-border-center','bi bi-border-inner','bi bi-border-left','bi bi-border-middle','bi bi-border-outer','bi bi-border-right','bi bi-border-style','bi bi-border-top','bi bi-border-width','bi bi-bounding-box','bi bi-box','bi bi-box-arrow-down','bi bi-box-arrow-down-left','bi bi-box-arrow-down-right','bi bi-box-arrow-in-down','bi bi-box-arrow-in-down-left','bi bi-box-arrow-in-down-right','bi bi-box-arrow-in-left','bi bi-box-arrow-in-right','bi bi-box-arrow-in-up','bi bi-box-arrow-in-up-left','bi bi-box-arrow-in-up-right','bi bi-box-arrow-left','bi bi-box-arrow-right','bi bi-box-arrow-up','bi bi-box-arrow-up-left','bi bi-box-arrow-up-right','bi bi-box-seam','bi bi-boxes','bi bi-braces','bi bi-bricks','bi bi-briefcase','bi bi-briefcase-fill','bi bi-brightness-alt-high','bi bi-brightness-high','bi bi-brightness-low','bi bi-broadcast','bi bi-brush','bi bi-bucket','bi bi-bug','bi bi-building','bi bi-bullseye','bi bi-calculator','bi bi-calendar','bi bi-calendar-check','bi bi-calendar-date','bi bi-calendar-day','bi bi-calendar-event','bi bi-calendar-fill','bi bi-calendar-minus','bi bi-calendar-month','bi bi-calendar-plus','bi bi-calendar-range','bi bi-calendar-week','bi bi-calendar-x','bi bi-calendar2','bi bi-calendar2-check','bi bi-calendar2-date','bi bi-calendar2-day','bi bi-calendar2-event','bi bi-calendar2-fill','bi bi-calendar2-minus','bi bi-calendar2-month','bi bi-calendar2-plus','bi bi-calendar2-range','bi bi-calendar2-week','bi bi-calendar2-x','bi bi-calendar3','bi bi-calendar3-event','bi bi-calendar3-fill','bi bi-calendar3-range','bi bi-calendar3-week','bi bi-calendar4','bi bi-calendar4-event','bi bi-calendar4-range','bi bi-calendar4-week','bi bi-camera','bi bi-camera-fill','bi bi-camera-reels','bi bi-camera-video','bi bi-camera-video-fill','bi bi-camera2','bi bi-capslock','bi bi-card-checklist','bi bi-card-heading','bi bi-card-image','bi bi-card-list','bi bi-card-text','bi bi-caret-down','bi bi-caret-down-fill','bi bi-caret-down-square','bi bi-caret-left','bi bi-caret-left-fill','bi bi-caret-left-square','bi bi-caret-right','bi bi-caret-right-fill','bi bi-caret-right-square','bi bi-caret-up','bi bi-caret-up-fill','bi bi-caret-up-square','bi bi-cart','bi bi-cart-check','bi bi-cart-dash','bi bi-cart-fill','bi bi-cart-plus','bi bi-cart-x','bi bi-cart2','bi bi-cart3','bi bi-cart4','bi bi-cash','bi bi-cash-stack','bi bi-cast','bi bi-chat','bi bi-chat-dots','bi bi-chat-fill','bi bi-chat-left','bi bi-chat-left-dots','bi bi-chat-left-fill','bi bi-chat-left-quote','bi bi-chat-left-text','bi bi-chat-quote','bi bi-chat-right','bi bi-chat-right-dots','bi bi-chat-right-fill','bi bi-chat-right-quote','bi bi-chat-right-text','bi bi-chat-square','bi bi-chat-square-dots','bi bi-chat-square-fill','bi bi-chat-square-quote','bi bi-chat-square-text','bi bi-chat-text','bi bi-check','bi bi-check-all','bi bi-check-circle','bi bi-check-lg','bi bi-check-square','bi bi-check2','bi bi-check2-all','bi bi-check2-circle','bi bi-check2-square','bi bi-chevron-bar-contract','bi bi-chevron-bar-down','bi bi-chevron-bar-expand','bi bi-chevron-bar-left','bi bi-chevron-bar-right','bi bi-chevron-bar-up','bi bi-chevron-compact-down','bi bi-chevron-compact-left','bi bi-chevron-compact-right','bi bi-chevron-compact-up','bi bi-chevron-contract','bi bi-chevron-double-down','bi bi-chevron-double-left','bi bi-chevron-double-right','bi bi-chevron-double-up','bi bi-chevron-down','bi bi-chevron-expand','bi bi-chevron-left','bi bi-chevron-right','bi bi-chevron-up','bi bi-circle','bi bi-circle-fill','bi bi-circle-half','bi bi-circle-square','bi bi-clipboard','bi bi-clipboard-check','bi bi-clipboard-data','bi bi-clipboard-minus','bi bi-clipboard-plus','bi bi-clipboard-pulse','bi bi-clipboard-x','bi bi-clock','bi bi-clock-fill','bi bi-clock-history','bi bi-cloud','bi bi-cloud-arrow-down','bi bi-cloud-arrow-up','bi bi-cloud-check','bi bi-cloud-download','bi bi-cloud-drizzle','bi bi-cloud-fill','bi bi-cloud-fog','bi bi-cloud-fog2','bi bi-cloud-hail','bi bi-cloud-haze','bi bi-cloud-lightning','bi bi-cloud-minus','bi bi-cloud-moon','bi bi-cloud-plus','bi bi-cloud-rain','bi bi-cloud-rain-heavy','bi bi-cloud-slash','bi bi-cloud-sleet','bi bi-cloud-snow','bi bi-cloud-sun','bi bi-cloud-upload','bi bi-clouds','bi bi-cloudy','bi bi-code','bi bi-code-slash','bi bi-code-square','bi bi-coin','bi bi-collection','bi bi-collection-fill','bi bi-collection-play','bi bi-columns','bi bi-columns-gap','bi bi-command','bi bi-compass','bi bi-cone','bi bi-cone-striped','bi bi-controller','bi bi-cpu','bi bi-credit-card','bi bi-credit-card-2-back','bi bi-credit-card-2-front','bi bi-crop','bi bi-cup','bi bi-cup-straw','bi bi-currency-bitcoin','bi bi-currency-dollar','bi bi-currency-euro','bi bi-currency-exchange','bi bi-currency-pound','bi bi-currency-yen','bi bi-cursor','bi bi-cursor-fill','bi bi-cursor-text','bi bi-dash','bi bi-dash-circle','bi bi-dash-lg','bi bi-dash-square','bi bi-database','bi bi-device-hdd','bi bi-device-ssd','bi bi-diagram-2','bi bi-diagram-3','bi bi-diamond','bi bi-diamond-fill','bi bi-diamond-half','bi bi-dice-1','bi bi-dice-2','bi bi-dice-3','bi bi-dice-4','bi bi-dice-5','bi bi-dice-6','bi bi-disc','bi bi-discord','bi bi-display','bi bi-distribute-horizontal','bi bi-distribute-vertical','bi bi-door-closed','bi bi-door-open','bi bi-dot','bi bi-download','bi bi-droplet','bi bi-droplet-fill','bi bi-droplet-half','bi bi-earbuds','bi bi-easel','bi bi-egg','bi bi-egg-fill','bi bi-egg-fried','bi bi-eject','bi bi-emoji-angry','bi bi-emoji-dizzy','bi bi-emoji-expressionless','bi bi-emoji-frown','bi bi-emoji-heart-eyes','bi bi-emoji-laughing','bi bi-emoji-neutral','bi bi-emoji-smile','bi bi-emoji-smile-upside-down','bi bi-emoji-sunglasses','bi bi-emoji-wink','bi bi-envelope','bi bi-envelope-fill','bi bi-envelope-open','bi bi-envelope-open-fill','bi bi-eraser','bi bi-exclamation','bi bi-exclamation-circle','bi bi-exclamation-diamond','bi bi-exclamation-lg','bi bi-exclamation-octagon','bi bi-exclamation-square','bi bi-exclamation-triangle','bi bi-exclude','bi bi-eye','bi bi-eye-fill','bi bi-eye-slash','bi bi-eyedropper','bi bi-eyeglasses','bi bi-facebook','bi bi-file','bi bi-file-arrow-down','bi bi-file-arrow-up','bi bi-file-bar-graph','bi bi-file-binary','bi bi-file-break','bi bi-file-check','bi bi-file-code','bi bi-file-diff','bi bi-file-earmark','bi bi-file-earmark-arrow-down','bi bi-file-earmark-arrow-up','bi bi-file-earmark-bar-graph','bi bi-file-earmark-binary','bi bi-file-earmark-break','bi bi-file-earmark-check','bi bi-file-earmark-code','bi bi-file-earmark-diff','bi bi-file-earmark-easel','bi bi-file-earmark-excel','bi bi-file-earmark-fill','bi bi-file-earmark-font','bi bi-file-earmark-image','bi bi-file-earmark-lock','bi bi-file-earmark-lock2','bi bi-file-earmark-medical','bi bi-file-earmark-minus','bi bi-file-earmark-music','bi bi-file-earmark-pdf','bi bi-file-earmark-person','bi bi-file-earmark-play','bi bi-file-earmark-plus','bi bi-file-earmark-post','bi bi-file-earmark-ppt','bi bi-file-earmark-richtext','bi bi-file-earmark-ruled','bi bi-file-earmark-slides','bi bi-file-earmark-spreadsheet','bi bi-file-earmark-text','bi bi-file-earmark-word','bi bi-file-earmark-x','bi bi-file-earmark-zip','bi bi-file-easel','bi bi-file-excel','bi bi-file-fill','bi bi-file-font','bi bi-file-image','bi bi-file-lock','bi bi-file-lock2','bi bi-file-medical','bi bi-file-minus','bi bi-file-music','bi bi-file-pdf','bi bi-file-person','bi bi-file-play','bi bi-file-plus','bi bi-file-post','bi bi-file-ppt','bi bi-file-richtext','bi bi-file-ruled','bi bi-file-slides','bi bi-file-spreadsheet','bi bi-file-text','bi bi-file-word','bi bi-file-x','bi bi-file-zip','bi bi-files','bi bi-film','bi bi-filter','bi bi-filter-circle','bi bi-filter-left','bi bi-filter-right','bi bi-filter-square','bi bi-fingerprint','bi bi-flag','bi bi-flag-fill','bi bi-flower1','bi bi-flower2','bi bi-flower3','bi bi-folder','bi bi-folder-check','bi bi-folder-fill','bi bi-folder-minus','bi bi-folder-plus','bi bi-folder-symlink','bi bi-folder-x','bi bi-folder2','bi bi-folder2-open','bi bi-fonts','bi bi-forward','bi bi-forward-fill','bi bi-front','bi bi-fullscreen','bi bi-fullscreen-exit','bi bi-funnel','bi bi-funnel-fill','bi bi-gear','bi bi-gear-fill','bi bi-gear-wide','bi bi-gear-wide-connected','bi bi-gem','bi bi-geo','bi bi-geo-alt','bi bi-geo-alt-fill','bi bi-gift','bi bi-gift-fill','bi bi-git','bi bi-github','bi bi-globe','bi bi-globe2','bi bi-google','bi bi-graph-down','bi bi-graph-up','bi bi-grid','bi bi-grid-1x2','bi bi-grid-3x2','bi bi-grid-3x3','bi bi-grid-fill','bi bi-grip-horizontal','bi bi-grip-vertical','bi bi-hammer','bi bi-hand-index','bi bi-hand-index-thumb','bi bi-hand-thumbs-down','bi bi-hand-thumbs-up','bi bi-handbag','bi bi-hash','bi bi-hdd','bi bi-hdd-fill','bi bi-hdd-network','bi bi-hdd-rack','bi bi-hdd-stack','bi bi-headphones','bi bi-headset','bi bi-heart','bi bi-heart-fill','bi bi-heart-half','bi bi-heartbreak','bi bi-hearts','bi bi-heptagon','bi bi-heptagon-fill','bi bi-heptagon-half','bi bi-hexagon','bi bi-hexagon-fill','bi bi-hexagon-half','bi bi-hourglass','bi bi-hourglass-bottom','bi bi-hourglass-split','bi bi-hourglass-top','bi bi-house','bi bi-house-door','bi bi-house-door-fill','bi bi-house-fill','bi bi-hr','bi bi-hurricane','bi bi-image','bi bi-image-alt','bi bi-image-fill','bi bi-images','bi bi-inbox','bi bi-inbox-fill','bi bi-inboxes','bi bi-info','bi bi-info-circle','bi bi-info-lg','bi bi-info-square','bi bi-input-cursor','bi bi-input-cursor-text','bi bi-instagram','bi bi-intersect','bi bi-journal','bi bi-journal-album','bi bi-journal-arrow-down','bi bi-journal-arrow-up','bi bi-journal-bookmark','bi bi-journal-bookmark-fill','bi bi-journal-check','bi bi-journal-code','bi bi-journal-medical','bi bi-journal-minus','bi bi-journal-plus','bi bi-journal-richtext','bi bi-journal-text','bi bi-journal-x','bi bi-journals','bi bi-joystick','bi bi-justify','bi bi-justify-left','bi bi-justify-right','bi bi-kanban','bi bi-key','bi bi-key-fill','bi bi-keyboard','bi bi-ladder','bi bi-lamp','bi bi-laptop','bi bi-layer-backward','bi bi-layer-forward','bi bi-layers','bi bi-layers-fill','bi bi-layers-half','bi bi-layout-sidebar','bi bi-layout-sidebar-inset','bi bi-layout-sidebar-inset-reverse','bi bi-layout-sidebar-reverse','bi bi-layout-split','bi bi-layout-text-sidebar','bi bi-layout-text-sidebar-reverse','bi bi-layout-text-window','bi bi-layout-text-window-reverse','bi bi-layout-three-columns','bi bi-layout-wtf','bi bi-life-preserver','bi bi-lightbulb','bi bi-lightbulb-fill','bi bi-lightbulb-off','bi bi-lightning','bi bi-lightning-charge','bi bi-lightning-fill','bi bi-link','bi bi-link-45deg','bi bi-linkedin','bi bi-list','bi bi-list-check','bi bi-list-nested','bi bi-list-ol','bi bi-list-stars','bi bi-list-task','bi bi-list-ul','bi bi-lock','bi bi-lock-fill','bi bi-mailbox','bi bi-mailbox2','bi bi-map','bi bi-map-fill','bi bi-markdown','bi bi-mask','bi bi-megaphone','bi bi-megaphone-fill','bi bi-menu-app','bi bi-menu-button','bi bi-menu-button-fill','bi bi-menu-button-wide','bi bi-menu-down','bi bi-menu-up','bi bi-mic','bi bi-mic-fill','bi bi-mic-mute','bi bi-minecart','bi bi-minecart-loaded','bi bi-moisture','bi bi-moon','bi bi-moon-fill','bi bi-moon-stars','bi bi-moon-stars-fill','bi bi-mouse','bi bi-mouse-fill','bi bi-mouse2','bi bi-mouse3','bi bi-music-note','bi bi-music-note-beamed','bi bi-music-note-list','bi bi-music-player','bi bi-newspaper','bi bi-node-minus','bi bi-node-plus','bi bi-nut','bi bi-octagon','bi bi-octagon-fill','bi bi-octagon-half','bi bi-option','bi bi-outlet','bi bi-paint-bucket','bi bi-palette','bi bi-palette-fill','bi bi-palette2','bi bi-paperclip','bi bi-paragraph','bi bi-patch-check','bi bi-patch-exclamation','bi bi-patch-minus','bi bi-patch-plus','bi bi-patch-question','bi bi-pause','bi bi-pause-btn','bi bi-pause-circle','bi bi-pause-fill','bi bi-peace','bi bi-pen','bi bi-pen-fill','bi bi-pencil','bi bi-pencil-fill','bi bi-pencil-square','bi bi-pentagon','bi bi-pentagon-fill','bi bi-pentagon-half','bi bi-people','bi bi-people-fill','bi bi-percent','bi bi-person','bi bi-person-badge','bi bi-person-badge-fill','bi bi-person-bounding-box','bi bi-person-check','bi bi-person-circle','bi bi-person-dash','bi bi-person-fill','bi bi-person-lines-fill','bi bi-person-plus','bi bi-person-plus-fill','bi bi-person-square','bi bi-person-x','bi bi-phone','bi bi-phone-fill','bi bi-phone-landscape','bi bi-phone-vibrate','bi bi-pie-chart','bi bi-pie-chart-fill','bi bi-piggy-bank','bi bi-pin','bi bi-pin-angle','bi bi-pin-fill','bi bi-pin-map','bi bi-pip','bi bi-play','bi bi-play-btn','bi bi-play-circle','bi bi-play-fill','bi bi-plug','bi bi-plug-fill','bi bi-plus','bi bi-plus-circle','bi bi-plus-lg','bi bi-plus-square','bi bi-power','bi bi-printer','bi bi-printer-fill','bi bi-puzzle','bi bi-puzzle-fill','bi bi-question','bi bi-question-circle','bi bi-question-diamond','bi bi-question-lg','bi bi-question-octagon','bi bi-question-square','bi bi-rainbow','bi bi-receipt','bi bi-receipt-cutoff','bi bi-reception-0','bi bi-reception-1','bi bi-reception-2','bi bi-reception-3','bi bi-reception-4','bi bi-record','bi bi-record-btn','bi bi-record-circle','bi bi-record-fill','bi bi-record2','bi bi-recycle','bi bi-reply','bi bi-reply-all','bi bi-reply-fill','bi bi-rss','bi bi-rss-fill','bi bi-rulers','bi bi-save','bi bi-save-fill','bi bi-save2','bi bi-save2-fill','bi bi-scissors','bi bi-screwdriver','bi bi-search','bi bi-segmented-nav','bi bi-send','bi bi-send-fill','bi bi-server','bi bi-share','bi bi-share-fill','bi bi-shield','bi bi-shield-check','bi bi-shield-exclamation','bi bi-shield-fill','bi bi-shield-fill-check','bi bi-shield-fill-exclamation','bi bi-shield-fill-minus','bi bi-shield-fill-plus','bi bi-shield-fill-x','bi bi-shield-lock','bi bi-shield-lock-fill','bi bi-shield-minus','bi bi-shield-plus','bi bi-shield-shaded','bi bi-shield-slash','bi bi-shield-x','bi bi-shift','bi bi-shop','bi bi-shop-window','bi bi-shuffle','bi bi-signpost','bi bi-signpost-2','bi bi-signpost-fill','bi bi-signpost-split','bi bi-sim','bi bi-skip-backward','bi bi-skip-backward-btn','bi bi-skip-backward-circle','bi bi-skip-backward-fill','bi bi-skip-end','bi bi-skip-end-btn','bi bi-skip-end-circle','bi bi-skip-end-fill','bi bi-skip-forward','bi bi-skip-forward-btn','bi bi-skip-forward-circle','bi bi-skip-forward-fill','bi bi-skip-start','bi bi-skip-start-btn','bi bi-skip-start-circle','bi bi-skip-start-fill','bi bi-slack','bi bi-slash','bi bi-slash-circle','bi bi-slash-lg','bi bi-slash-square','bi bi-sliders','bi bi-smartwatch','bi bi-snow','bi bi-snow2','bi bi-snow3','bi bi-sort-alpha-down','bi bi-sort-alpha-down-alt','bi bi-sort-alpha-up','bi bi-sort-alpha-up-alt','bi bi-sort-down','bi bi-sort-down-alt','bi bi-sort-numeric-down','bi bi-sort-numeric-down-alt','bi bi-sort-numeric-up','bi bi-sort-numeric-up-alt','bi bi-sort-up','bi bi-sort-up-alt','bi bi-soundwave','bi bi-speaker','bi bi-speaker-fill','bi bi-speedometer','bi bi-speedometer2','bi bi-spellcheck','bi bi-square','bi bi-square-fill','bi bi-square-half','bi bi-stack','bi bi-star','bi bi-star-fill','bi bi-star-half','bi bi-stars','bi bi-stickies','bi bi-sticky','bi bi-stop','bi bi-stop-btn','bi bi-stop-circle','bi bi-stop-fill','bi bi-stoplights','bi bi-stopwatch','bi bi-stopwatch-fill','bi bi-subtract','bi bi-suit-club','bi bi-suit-club-fill','bi bi-suit-diamond','bi bi-suit-diamond-fill','bi bi-suit-heart','bi bi-suit-heart-fill','bi bi-suit-spade','bi bi-suit-spade-fill','bi bi-sun','bi bi-sun-fill','bi bi-sunglasses','bi bi-sunrise','bi bi-sunrise-fill','bi bi-sunset','bi bi-sunset-fill','bi bi-symmetry-horizontal','bi bi-symmetry-vertical','bi bi-table','bi bi-tablet','bi bi-tablet-fill','bi bi-tablet-landscape','bi bi-tag','bi bi-tag-fill','bi bi-tags','bi bi-telegram','bi bi-telephone','bi bi-telephone-fill','bi bi-telephone-forward','bi bi-telephone-inbound','bi bi-telephone-minus','bi bi-telephone-outbound','bi bi-telephone-plus','bi bi-telephone-x','bi bi-terminal','bi bi-text-center','bi bi-text-indent-left','bi bi-text-indent-right','bi bi-text-left','bi bi-text-paragraph','bi bi-text-right','bi bi-textarea','bi bi-textarea-resize','bi bi-textarea-t','bi bi-thermometer','bi bi-thermometer-half','bi bi-thermometer-high','bi bi-thermometer-low','bi bi-thermometer-snow','bi bi-thermometer-sun','bi bi-three-dots','bi bi-three-dots-vertical','bi bi-toggle-off','bi bi-toggle-on','bi bi-toggle2-off','bi bi-toggle2-on','bi bi-toggles','bi bi-toggles2','bi bi-tools','bi bi-tornado','bi bi-translate','bi bi-trash','bi bi-trash-fill','bi bi-trash2','bi bi-trash2-fill','bi bi-tree','bi bi-tree-fill','bi bi-triangle','bi bi-triangle-fill','bi bi-triangle-half','bi bi-trophy','bi bi-trophy-fill','bi bi-truck','bi bi-truck-flatbed','bi bi-tsunami','bi bi-tv','bi bi-tv-fill','bi bi-twitch','bi bi-twitter','bi bi-type','bi bi-type-bold','bi bi-type-h1','bi bi-type-h2','bi bi-type-h3','bi bi-type-italic','bi bi-type-strikethrough','bi bi-type-underline','bi bi-ui-checks','bi bi-ui-checks-grid','bi bi-ui-radios','bi bi-ui-radios-grid','bi bi-umbrella','bi bi-umbrella-fill','bi bi-union','bi bi-unlock','bi bi-unlock-fill','bi bi-upc','bi bi-upc-scan','bi bi-upload','bi bi-vector-pen','bi bi-view-list','bi bi-view-stacked','bi bi-vinyl','bi bi-vinyl-fill','bi bi-voicemail','bi bi-volume-down','bi bi-volume-mute','bi bi-volume-off','bi bi-volume-up','bi bi-vr','bi bi-wallet','bi bi-wallet-fill','bi bi-wallet2','bi bi-watch','bi bi-water','bi bi-whatsapp','bi bi-wifi','bi bi-wifi-1','bi bi-wifi-2','bi bi-wifi-off','bi bi-wind','bi bi-window','bi bi-window-dock','bi bi-window-sidebar','bi bi-window-split','bi bi-window-stack','bi bi-windows','bi bi-wordpress','bi bi-wrench','bi bi-x','bi bi-x-circle','bi bi-x-diamond','bi bi-x-lg','bi bi-x-octagon','bi bi-x-square','bi bi-youtube','bi bi-zoom-in','bi bi-zoom-out'
];

const showIconPicker = ref(false);
const iconSearch = ref('');

const pickRandomTheme = () => {
  const randomIndex = Math.floor(Math.random() * themeOptions.length);
  return { ...themeOptions[randomIndex] };
};

const emptyForm = () => ({
  code: '',
  name: '',
  description: '',
  group: '',
  icon: '',
  path: '',
  availableActions: ['view'],
  customPermissions: [],
  isActive: true,
  theme: pickRandomTheme()
});

const formData = ref(emptyForm());

const filteredIcons = computed(() => {
  const keyword = iconSearch.value.trim().toLowerCase();
  if (!keyword) return iconOptions;
  return iconOptions.filter(icon => icon.toLowerCase().includes(keyword));
});

const findMatchingTheme = (theme) => {
  if (!theme) return null;
  const match = themeOptions.find(
    option => option.bgColor === theme.bgColor && option.textColor === theme.textColor
  );
  return match ? { ...match } : { ...theme };
};

watch(() => props.app, (newApp) => {
  if (newApp) {
    const matchedTheme = findMatchingTheme(newApp.theme);
    formData.value = {
      code: newApp.code || '',
      name: newApp.name || '',
      description: newApp.description || '',
      group: newApp.group || '',
      icon: newApp.icon || '',
      path: newApp.path || '',
      availableActions: [...(newApp.availableActions || ['view'])],
      customPermissions: JSON.parse(JSON.stringify(newApp.customPermissions || [])),
      isActive: newApp.isActive !== false,
      theme: matchedTheme || pickRandomTheme()
    };
  } else {
    formData.value = emptyForm();
  }
}, { immediate: true });

const selectTheme = (theme) => {
  formData.value.theme = { ...theme };
};

const isThemeSelected = (theme) => {
  if (!formData.value.theme) return false;
  return formData.value.theme.bgColor === theme.bgColor && formData.value.theme.textColor === theme.textColor;
};

const randomizeTheme = () => {
  selectTheme(pickRandomTheme());
};

const toggleIconPicker = () => {
  showIconPicker.value = !showIconPicker.value;
};

const selectIcon = (icon) => {
  formData.value.icon = icon;
  showIconPicker.value = false;
};

const addCustomPermission = () => {
  formData.value.customPermissions.push({
    code: '',
    name: '',
    description: ''
  });
};

const removeCustomPermission = (index) => {
  formData.value.customPermissions.splice(index, 1);
};

const handleSubmit = () => {
  const cleanedData = {
    ...formData.value,
    customPermissions: formData.value.customPermissions.filter(
      p => p.code && p.name
    )
  };
  emit('save', cleanedData);
};
</script>
