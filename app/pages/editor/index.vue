<template>
  <NuxtLayout :name="layout">
  <div class="editor-theme lg:relative lg:top-0 lg:left-0 fixed top-0 left-0 flex-1 h-[100dvh] lg:h-full min-h-0 flex w-full bg-gray-50 overflow-hidden max-w-full">
    
    
   
    
    <!-- Mobile Backdrop -->
    <div
      v-if="(showLeftPanel || showRightPanel) && isMobile"
      @click="closeAllPanels"
      class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
    ></div>

    <!-- Left Sidebar - Elements & Templates -->
    <div
      :class="[
        'bg-white border-r z-999999 lg:z-1 border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out shrink-0',
        // Desktop behavior
        'md:relative',
        leftPanelCollapsed && !isMobile ? 'md:w-16' : 'md:w-72',
        // Mobile behavior - drawer from left
        'fixed md:relative top-0 left-0 bottom-0 z-50',
        showLeftPanel ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        isMobile ? 'w-80' : ''
      ]"
    >
      <!-- Sidebar Header with Collapse Toggle -->
      <div class="pt-20 lg:pt-2 border-b border-gray-200 bg-white flex items-center justify-between" :class="leftPanelCollapsed && !isMobile ? 'p-2' : 'p-2'">
        <div v-if="!leftPanelCollapsed || isMobile" class="flex items-center gap-2">
          <button
            v-if="route.query.mode !== 'public'"
            @click="router.push('/templates')"
            class="w-8 h-8 p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            title="Quay lại danh sách templates"
          >
            <i class="bi bi-arrow-left text-lg"></i>
            <!-- <span class="hidden sm:inline text-sm">Templates</span> -->
          </button>
          <button
            v-else
            @click="router.push('/')"
            class="w-8 h-8 p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            title="Quay lại trang chủ"
          >
            <i class="bi bi-arrow-left text-lg"></i>
            <!-- <span class="hidden sm:inline text-sm">Templates</span> -->
          </button>
          <div>
            <h2 class="text-sm font-bold text-gray-900">Trình Tạo Email</h2>
            <p class="text-xs text-gray-500">Chỉnh sửa chuyên nghiệp</p>
          </div>
        </div>
        <button
          v-if="!isMobile"
          @click="toggleLeftPanel"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
          :title="leftPanelCollapsed ? 'Expand' : 'Collapse'"
        >
          <i :class="leftPanelCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'" class="text-sm"></i>
        </button>
        <button
          v-if="isMobile"
          @click="closeAllPanels"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i class="bi bi-x-lg text-sm"></i>
        </button>
      </div>

      <!-- Tab Navigation - Full View -->
      <div v-if="!leftPanelCollapsed || isMobile" class="border-b border-gray-200 bg-gray-50">
        <div class="flex">
          <button
            @click="activeTab = 'elements'"
            :class="[
              'flex-1 px-3 py-3 text-xs font-medium transition-all',
              activeTab === 'elements'
                ? 'text-teal-600 bg-white border-b-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
          >
            <i class="bi bi-grid-3x3 mr-1"></i>
            Elements
          </button>
          <button
            @click="activeTab = 'templates'"
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
            @click="activeTab = 'fields'"
            :class="[
              'flex-1 px-3 py-3 text-xs font-medium transition-all',
              activeTab === 'fields'
                ? 'text-lime-600 bg-white border-b-2 border-lime-600'
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
            @click="activeTab = 'elements'"
            :class="[
              'p-3 text-lg transition-all',
              activeTab === 'elements'
                ? 'text-teal-600 bg-white border-l-2 border-teal-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
            title="Elements"
          >
            <i class="bi bi-grid-3x3"></i>
          </button>
          <button
            @click="activeTab = 'templates'"
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
            @click="activeTab = 'fields'"
            :class="[
              'p-3 text-lg transition-all',
              activeTab === 'fields'
                ? 'text-lime-600 bg-white border-l-2 border-lime-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
            title="Dynamic Fields"
          >
            <i class="bi bi-braces"></i>
          </button>
        </div>
      </div>
      
      <!-- Tab Content -->
      <div v-if="!leftPanelCollapsed || isMobile" class="flex-1 overflow-y-auto bg-white">
        <ElementLibrary v-if="activeTab === 'elements'" @add-element="addElement" />
        <TemplateLibrary v-else-if="activeTab === 'templates'" @select-template="loadTemplate" />
        <DynamicFieldsPanel v-else-if="activeTab === 'fields'" @insert-field="handleInsertField" />
      </div>
    </div>

    <!-- Main Editor Area -->
    <div class="relative flex-1 flex flex-col w-full h-full min-w-0 overflow-hidden">
      <!-- Top Toolbar -->
      <div class="lg:relative lg:top-0 lg:left-0 lg:mt-0 lg:shrink-0 fixed top-18 -mt-1 left-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-4 z-20 lg:z-auto w-full">
        <div class="flex items-center gap-2">
          <!-- Mobile Left Panel Button - Far left -->
          <button
            @click="toggleLeftPanel"
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
                  @click="selectDevice(device)"
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
                    class="bi bi-check-lg text-emerald-600"
                  ></i>
                </a>
              </li>
            </ul>
          </details>

          <!-- Structure Map Button -->
          <button
            @click="showElementMap = true"
            class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            title="Xem cấu trúc email"
          >
            <i class="bi bi-diagram-3"></i>
            <span class="hidden lg:inline">Structure</span>
          </button>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Action Groups - Desktop -->
          <div class="hidden lg:flex items-center gap-2">
            <!-- Save Button -->
            <button
              @click="showSaveModal = true"
              class="px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-2 bg-green-500 text-white hover:bg-green-700"
              title="Save Template"
            >
              <i class="bi bi-cloud-upload text-base"></i>
              <span class="hidden xl:inline">Lưu Thiết Kế</span>
            </button>

            <!-- Divider -->
            <div class="w-px h-6 bg-gray-300"></div>

            <!-- Import/Export -->
            <button
              @click="importJson"
              class="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              title="Import JSON"
            >
              <i class="bi bi-upload text-base"></i>
              <span class="hidden xl:inline">Nhập Thiết Kế</span>
            </button>
          </div>
          <!-- Preview Button -->
          <button
            @click="showPreview = true"
            class="px-3 py-1 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <i class="bi bi-eye text-base"></i>
            <span class="sm:inline text-small md:text-xs">Xem trước</span>
          </button>
          <!-- Mobile Save Button - Visible on mobile -->
          <button
            @click="showSaveModal = true"
            class="md:hidden px-3 py-1 text-sm bg-green-200 text-white rounded-lg hover:bg-green-300 transition-colors flex items-center gap-2"
            title="Lưu Thiết Kế"
          >
            <i class="bi bi-cloud-upload text-base text-green-900"></i>
            <span class="sm:inline text-small md:text-xs text-green-900">Lưu</span>
          </button>
          <!-- Mobile Right Panel Button - Far right -->
          <button
            @click="toggleRightPanel"
            class="md:hidden p-1.5 hover:bg-gray-100 rounded transition-colors mr-1"
            title="Properties Panel"
          >
            <i class="bi bi-sliders text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Editor Content -->
      <div class="pt-20 lg:pt-0 flex-1 flex h-full overflow-hidden z-1">
        <!-- Canvas Area -->
        <div :class="[
          'bg-gray-50 flex flex-col h-full w-full overflow-hidden transition-all duration-300 py-2 lg:py-4',
          rightPanelCollapsed && !isMobile ? 'flex-1' : 'flex-1'
        ]">
          <!-- Canvas Header -->
          <div class="hidden h-10 bg-white border-b border-gray-200 items-center justify-center">
            <div class="text-xs text-gray-500 font-medium">
              {{ currentDevice.name }} 
              <!-- Preview ({{ currentDevice.width }}px) -->
            </div>
          </div>
          
          <!-- Canvas Container: Single scroll container -->
          <div ref="mainCanvas" class="flex-1 w-full bg-gray-50 overflow-auto pt-14 z-10 lg:pt-2 lg:pb-2">
            <div class="flex-1 h-full w-full flex justify-center">
              <EmailCanvas 
                v-model:elements="emailElements"
                :device="currentDevice"
                :global-settings="globalSettings"
                @select-element="selectElement"
                @show-element-library="handleShowElementLibrary"
              />
            </div>
          </div>
        </div>

        <!-- Properties Panel - Desktop Only -->
        <div
          :class="[
            'bg-white border-l border-gray-200 flex flex-col h-full overflow-auto transition-all duration-300 ease-in-out shrink-0 hidden lg:flex',
            rightPanelCollapsed ? 'lg:w-16' : 'lg:w-80'
          ]"
        >
          <!-- Panel Content -->
          <div v-if="!rightPanelCollapsed" class="flex-1 overflow-auto">
            <PropertiesPanel 
              :selected-element="selectedElement"
              :global-settings="globalSettings"
              :is-mobile="false"
              @update-element="updateElement"
              @update-global="updateGlobalSettings"
              @upload-image="handleImageUpload"
              @toggle-panel="toggleRightPanel"
              @close-panel="closeAllPanels"
              @open-html-editor="showHtmlEditor = true"
            />
          </div>
          
          <!-- Collapsed State - Icon View -->
          <div v-else class="flex-1 flex flex-col items-center py-4 gap-4">
            <button
              @click="toggleRightPanel"
              class="p-3 hover:bg-gray-100 rounded-lg transition-colors"
              title="Expand Properties"
            >
              <i class="bi bi-sliders text-xl text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- Properties Panel - Mobile/Tablet Only -->
      <div
        :class="[
          'z-999999 bg-white border-l border-gray-200 flex flex-col h-full overflow-auto transition-all duration-300 ease-in-out shrink-0 lg:hidden',
          // Mobile/Tablet behavior - drawer from right
          'fixed top-0 right-0 bottom-0',
          showRightPanel ? 'translate-x-0' : 'translate-x-full',
          'w-80'
        ]"
      >
        <!-- Panel Content -->
        <div v-if="!rightPanelCollapsed || isMobile" class="flex-1 overflow-auto pt-20 lg:0">
          <PropertiesPanel 
            :selected-element="selectedElement"
            :global-settings="globalSettings"
            :is-mobile="isMobile"
            @update-element="updateElement"
            @update-global="updateGlobalSettings"
            @upload-image="handleImageUpload"
            @toggle-panel="toggleRightPanel"
            @close-panel="closeAllPanels"
            @open-html-editor="showHtmlEditor = true"
          />
        </div>
        
        <!-- Collapsed State - Icon View -->
        <div v-else class="flex-1 flex flex-col items-center py-4 gap-4">
          <button
            @click="toggleRightPanel"
            class="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            title="Expand Properties"
          >
            <i class="bi bi-sliders text-xl text-gray-600"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
    
    <!-- HTML Editor Modal -->
    <HtmlEditorModal
      v-if="showHtmlEditor"
      :is-visible="showHtmlEditor"
      :html-code="selectedElement?.props?.children || ''"
      @close="showHtmlEditor = false"
      @apply="applyHtmlFromEditor"
    />
  <!-- Element Map Modal -->
    <div style="z-index: 999999 !important" v-if="showElementMap" class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[80vh] flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Bản Đồ Cấu Trúc</h3>
          <button
            @click="showElementMap = false"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="flex-1 overflow-hidden">
          <ElementMap
            :elements="emailElements"
            :selected-element="selectedElement"
            @select-element="selectElement"
            @move-up="moveElementUp"
            @move-down="moveElementDown"
            @delete-element="deleteElementByIndex"
          />
        </div>
      </div>
    </div>

    <!-- Import JSON Modal -->
    <ImportJsonModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @import="handleImportJson"
    />

    <!-- Export Modal -->
    <ExportModal
      v-if="showExportModal"
      :template-data="exportToJSON()"
      @close="showExportModal = false"
    />

    <!-- Save Template Modal -->
    <div style="z-index: 999999!important" v-if="showSaveModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ currentTemplateId ? 'Cập nhật' : 'Lưu Thiết Kế' }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ currentTemplateId ? 'Cập nhật mẫu email của bạn' : 'Lưu mẫu email của bạn' }}</p>
          </div>
          <button
            @click="showSaveModal = false"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tên Thiết Kế *</label>
            <input
              v-model="saveForm.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="My Email Template"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả *</label>
            <textarea
              v-model="saveForm.description"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              :class="validationErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'"
              placeholder="Brief description of your template..."
            ></textarea>
            <p v-if="validationErrors.description" class="text-red-500 text-xs mt-1">
              <i class="bi bi-exclamation-circle mr-1"></i>{{ validationErrors.description }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
            <select
              v-model="saveForm.category"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              :class="validationErrors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'"
            >
              <option value="">Chọn Danh Mục</option>
              <option value="newsletter">Bản Tin</option>
              <option value="promotional">Khuyến mại</option>
              <option value="announcement">Thông báo</option>
              <option value="other">Khác</option>
            </select>
            <p v-if="validationErrors.category" class="text-red-500 text-xs mt-1">
              <i class="bi bi-exclamation-circle mr-1"></i>{{ validationErrors.category }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            @click="showSaveModal = false"
            class="px-6 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
          <button
            @click="handleSaveTemplate"
            :disabled="!saveForm.name || isSaving"
            class="px-6 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2"
            :class="[
              !saveForm.name || isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            ]"
          >
            <i class="bi bi-cloud-upload"></i>
            <span>{{ isSaving ? 'Đang lưu...' : (currentTemplateId ? 'Cập nhật' : 'Lưu') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Test Email Modal -->
    <div style="z-index:999999 !important" v-if="showTestEmailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-gray-100 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <i class="bi bi-send text-violet-600"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Gửi Email Test</h3>
              <p class="text-xs text-gray-500">{{ isPublicMode ? 'Sử dụng Gmail của bạn để Gửi Email' : 'Kiểm tra template trên email thật' }}</p>
            </div>
          </div>
        </div>
        
        <div class="p-6 space-y-4 overflow-y-auto flex-1">
          <!-- Gmail Credentials for Public Mode -->
          <div v-if="isPublicMode" class="space-y-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="bi bi-google text-teal-600"></i>
                <span class="text-sm font-medium text-teal-800">Gmail Credentials</span>
                <span v-if="hasStoredCredentials" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  <i class="bi bi-check-circle-fill mr-1"></i>Đã lưu
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button v-if="hasStoredCredentials" @click="resetGmailCredentials" class="text-red-500 hover:text-red-700 text-xs flex items-center gap-1">
                  <i class="bi bi-trash"></i> Reset
                </button>
                <button @click="showGmailHelp = !showGmailHelp" class="text-teal-600 hover:text-teal-800 text-xs">
                  <i class="bi bi-question-circle"></i> Hướng dẫn
                </button>
              </div>
            </div>
            
            <!-- Gmail Help -->
            <div v-if="showGmailHelp" class="p-3 bg-white rounded-lg text-xs text-gray-600 space-y-2">
              <p><strong>Để lấy App Password:</strong></p>
              <ol class="list-decimal list-inside space-y-1 ml-2">
                <li>Vào <a href="https://myaccount.google.com/security" target="_blank" class="text-teal-600 underline">Google Account Security</a></li>
                <li>Bật 2-Step Verification nếu chưa bật</li>
                <li>Tìm "App Passwords" và tạo mới</li>
                <li>Chọn "Mail" và "Other (Custom name)"</li>
                <li>Copy mật khẩu 16 ký tự được tạo</li>
              </ol>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Gmail của bạn *</label>
              <input 
                v-model="gmailEmail"
                type="email"
                class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                placeholder="your-email@gmail.com"
                :disabled="hasStoredCredentials"
                :class="{ 'bg-gray-100': hasStoredCredentials }"
              />
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">App Password *</label>
              <input 
                v-model="gmailAppPassword"
                :type="hasStoredCredentials ? 'password' : 'text'"
                class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                placeholder="xxxx xxxx xxxx xxxx"
                :disabled="hasStoredCredentials"
                :class="{ 'bg-gray-100': hasStoredCredentials }"
              />
              <p class="text-xs text-gray-500 mt-1">{{ hasStoredCredentials ? 'Thông tin đã được lưu và mã hóa' : 'Không phải mật khẩu Gmail thông thường' }}</p>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email nhận *</label>
            <input 
              v-model="testEmailAddress"
              type="email"
              class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              placeholder="recipient@example.com"
              @keyup.enter="sendTestEmail"
            />
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Tiêu đề email</label>
            <input 
              v-model="testEmailSubject"
              type="text"
              class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              placeholder="Email Test - Emailer Builder"
            />
          </div>

          <div v-if="testEmailResult" class="p-4 rounded-xl" :class="testEmailResult.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'">
            <div class="flex items-center gap-3">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                :class="testEmailResult.success ? 'bg-emerald-100' : 'bg-red-100'"
              >
                <i :class="testEmailResult.success ? 'bi bi-check-lg text-emerald-600' : 'bi bi-x-lg text-red-600'"></i>
              </div>
              <div class="flex-1">
                <span :class="testEmailResult.success ? 'text-emerald-700' : 'text-red-700'" class="text-sm font-medium">
                  {{ testEmailResult.message }}
                </span>
                <p v-if="testEmailResult.remaining !== undefined" class="text-xs text-gray-500 mt-1">
                  Còn lại: {{ testEmailResult.remaining }}/50 lượt gửi trong giờ này
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100 shrink-0">
          <button 
            @click="showTestEmailModal = false" 
            class="px-6 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Đóng
          </button>
          <button 
            @click="sendTestEmail"
            :disabled="sendingTestEmail || !testEmailAddress || (isPublicMode && (!gmailEmail || !gmailAppPassword))"
            class="px-6 py-1.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <i v-if="sendingTestEmail" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-send"></i>
            {{ sendingTestEmail ? 'Đang gửi...' : 'Gửi Email' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Nested Element Library Modal -->
    <div v-if="showNestedElementLibrary" class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 backdrop-blur-sm transition-all ease-in-out duration-500">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r  from-teal-50 to-emerald-50">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Add Element</h3>
            <p class="text-xs text-gray-600 mt-1">Choose an element to add</p>
          </div>
          <button
            @click="showNestedElementLibrary = false"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-2 gap-3">
            <!-- Basic Elements -->
            <button
              @click="addElementToNested('heading1')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-type-h1 text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Heading 1</div>
              <div class="text-xs text-gray-500">Large heading</div>
            </button>

            <button
              @click="addElementToNested('heading2')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-type-h2 text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Heading 2</div>
              <div class="text-xs text-gray-500">Medium heading</div>
            </button>

            <button
              @click="addElementToNested('heading3')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-type-h3 text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Heading 3</div>
              <div class="text-xs text-gray-500">Small heading</div>
            </button>

            <button
              @click="addElementToNested('text')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-type text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Text</div>
              <div class="text-xs text-gray-500">Paragraph text</div>
            </button>

            <button
              @click="addElementToNested('button')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-mouse2 text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Button</div>
              <div class="text-xs text-gray-500">Call to action</div>
            </button>

            <button
              @click="addElementToNested('image')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-image text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Image</div>
              <div class="text-xs text-gray-500">Add image</div>
            </button>

            <button
              @click="addElementToNested('video')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-play-circle text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Video</div>
              <div class="text-xs text-gray-500">Video player</div>
            </button>

            <button
              @click="addElementToNested('divider')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-hr text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Divider</div>
              <div class="text-xs text-gray-500">Horizontal line</div>
            </button>

            <button
              @click="addElementToNested('spacer')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-arrows-expand text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Spacer</div>
              <div class="text-xs text-gray-500">Vertical space</div>
            </button>

            <button
              @click="addElementToNested('quote')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-quote text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Quote</div>
              <div class="text-xs text-gray-500">Blockquote</div>
            </button>

            <button
              @click="addElementToNested('link')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <i class="bi bi-link-45deg text-2xl text-teal-600 mb-2 block"></i>
              <div class="text-sm font-semibold text-gray-900">Link</div>
              <div class="text-xs text-gray-500">Hyperlink</div>
            </button>
          </div>
        </div>
      </div>
    </div>
   <!-- Confirm Modal -->
    <ConfirmModal
      :is-visible="isVisible"
      :title="confirmData.title || 'Xác nhận'"
      :subtitle="confirmData.subtitle || ''"
      :message="confirmData.message || 'Bạn có chắc chắn muốn thực hiện hành động này?'"
      :confirm-text="confirmData.confirmText"
      :cancel-text="confirmData.cancelText"
      :type="confirmData.type"
      :loading="confirmData.loading"
      :loading-text="confirmData.loadingText"
      @confirm="confirm"
      @cancel="cancel"
    />
  <PreviewModal 
      v-if="showPreview"
      :elements="emailElements"
      :devices="devices"
      :global-settings="globalSettings"
      :generate-html-fn="generateEmailHTML"
      @close="showPreview = false"
    />
  </NuxtLayout>
  <ToastContainer />
    
    <!-- Warning Toast Notification -->
    <Teleport to="body">
      <Transition name="toast">
        <div style="z-index: 999999 !important"
          v-if="showToast" 
          class="fixed top-16 right-4 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm"
        >
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span class="text-sm font-medium">{{ toastMessage }}</span>
        </div>
      </Transition>
    </Teleport>
</template>

<script setup>
// Canvas Components
import EmailCanvas from '~/components/email-builder/canvas/EmailCanvas.vue'

// Panel Components
import PropertiesPanel from '~/components/email-builder/panels/PropertiesPanel.vue'
import DynamicFieldsPanel from '~/components/email-builder/panels/DynamicFieldsPanel.vue'

// Modal Components
import PreviewModal from '~/components/email-builder/modals/PreviewModal.vue'
import HtmlEditorModal from '~/components/email-builder/modals/HtmlEditorModal.vue'
import ImportJsonModal from '~/components/email-builder/modals/ImportJsonModal.vue'
import ExportModal from '~/components/email-builder/modals/ExportModal.vue'

// Element Components
import ElementLibrary from '~/components/email-builder/elements/ElementLibrary.vue'
import TemplateLibrary from '~/components/email-builder/elements/TemplateLibrary.vue'
import ElementMap from '~/components/email-builder/elements/ElementMap.vue'

import ConfirmModal from '~/components/ConfirmModal.vue'
import { getSocialIcon, SOCIAL_COLORS } from '~/utils/emailIcons.js'
import { getDefaultProps, getDefaultStyle, restrictedContainerElements } from '~/utils/emailElementDefaults.js'

// Template API integration
const route = useRoute()
const router = useRouter()

// Dynamic layout based on mode
const layout = computed(() => route.query.mode === 'public' ? 'blank' : 'default')

definePageMeta({
  layout: false,
  ssr: false,
  middleware: (to) => {
    if (to.query.mode === 'public') return
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return navigateTo('/login')
    const appsStore = useAppsStore()
    const visiblePaths = Object.values(appsStore.visibleDepartments(authStore.permissionIds))
      .flatMap(d => d.apps.map(a => a.path))
    if (!visiblePaths.some(p => to.path.startsWith(p))) return navigateTo('/error-permission')
  }
})

// Utility functions
const getYouTubeEmbedId = (url) => {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : null
}

const { getTemplate, createTemplate, updateTemplate } = useTemplateAPI()
const { success, error: showError, warning } = useToast()
const { isVisible, confirmData, confirm, cancel, confirmLeave } = useConfirm()

// Editor mode: 'create', 'edit', 'public', or 'standalone'
const editorMode = ref(route.query.mode || 'standalone')
const templateId = ref(route.query.templateId || null)
const isLoadingTemplate = ref(false)
const autoSaveAfterLogin = ref(route.query.autoSave === 'true')

// Public mode state
const isPublicMode = computed(() => editorMode.value === 'public')
const authStore = useAuthStore()
const appConfig = useAppConfig()

// Responsive state management
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)

const isMobile = computed(() => windowWidth.value < 768)
const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)
const isDesktop = computed(() => windowWidth.value >= 1024)

// Panel visibility states
const leftPanelCollapsed = ref(false)
const rightPanelCollapsed = ref(false)
const showLeftPanel = ref(false)  // For mobile drawer - start closed
const showRightPanel = ref(false)  // For mobile drawer

// Update window width on resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
  
  // Auto-open panels on desktop
  if (isDesktop.value) {
    showLeftPanel.value = true
    showRightPanel.value = false
  }
  
  // Auto-collapse panels on tablet if not already collapsed
  if (isTablet.value && !leftPanelCollapsed.value && !rightPanelCollapsed.value) {
    // Keep current state
  }
  
  // Auto-close mobile drawers on resize to desktop
  if (!isMobile.value) {
    showLeftPanel.value = true
    showRightPanel.value = false
  }
}

// Toggle functions
const toggleLeftPanel = () => {
  if (isMobile.value) {
    showLeftPanel.value = !showLeftPanel.value
    if (showLeftPanel.value) {
      showRightPanel.value = false
    }
  } else {
    leftPanelCollapsed.value = !leftPanelCollapsed.value
  }
}

const toggleRightPanel = () => {
  if (isMobile.value) {
    showRightPanel.value = !showRightPanel.value
    if (showRightPanel.value) {
      showLeftPanel.value = false
    }
  } else {
    rightPanelCollapsed.value = !rightPanelCollapsed.value
  }
}

const closeAllPanels = () => {
  showLeftPanel.value = false
  showRightPanel.value = false
}

// Device presets - Simplified to 3 main breakpoints (Desktop reduced to fit modal)
const devices = ref([
  { name: 'Desktop', width: 900, icon: 'bi bi-display' },
  { name: 'Tablet', width: 768, icon: 'bi bi-tablet' },
  { name: 'Mobile', width: 375, icon: 'bi bi-phone' }
])

const currentDevice = ref(devices.value[0])
const showPreview = ref(false)
const showElementMap = ref(false)
const showImportModal = ref(false)
const showExportModal = ref(false)
const showHtmlEditor = ref(false)
const showSaveModal = ref(false)
const emailElements = ref([])
const selectedElement = ref(null)
const activeTab = ref('elements')
const isDragging = ref(false)

// Template info
const currentTemplateId = ref(null)
const saveForm = ref({
  name: '',
  description: '',
  category: ''
})

// Element library modal for nested structures
const showNestedElementLibrary = ref(false)
const nestedElementTarget = ref(null)

// Toast notification
const showToast = ref(false)
const toastMessage = ref('')

const showWarningToast = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Global email settings
const globalSettings = ref({
  backgroundColor: '#f3f4f6',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '1.6',
  textColor: '#374151',
  linkColor: '#3b82f6',
  contentWidth: 700, // Unlayer-style: 600 or 700px
  padding: '0',
  textAlign: 'center',
  margin: '0'
})

// State for saving
const isSaving = ref(false)
const LOCALSTORAGE_KEY = 'DATools_draft_template'
const lastSavedTime = ref(Date.now())

// Validation errors for save modal
const validationErrors = ref({
  category: '',
  description: ''
})

// Test Email State
const showTestEmailModal = ref(false)
const testEmailAddress = ref('')
const testEmailSubject = ref('Email Test - Emailer Builder')
const sendingTestEmail = ref(false)
const testEmailResult = ref(null)

// Gmail credentials for public mode
const gmailEmail = ref('')
const gmailAppPassword = ref('')
const showGmailHelp = ref(false)
const hasStoredCredentials = ref(false)

// Simple encryption/decryption for localStorage (base64 + reverse)
const GMAIL_STORAGE_KEY = 'emailer_gmail_credentials'

const encryptCredentials = (email, password) => {
  const data = JSON.stringify({ e: email, p: password })
  return btoa(data.split('').reverse().join(''))
}

const decryptCredentials = (encrypted) => {
  try {
    const reversed = atob(encrypted).split('').reverse().join('')
    return JSON.parse(reversed)
  } catch {
    return null
  }
}

const loadStoredGmailCredentials = () => {
  try {
    const stored = localStorage.getItem(GMAIL_STORAGE_KEY)
    if (stored) {
      const creds = decryptCredentials(stored)
      if (creds && creds.e && creds.p) {
        gmailEmail.value = creds.e
        gmailAppPassword.value = creds.p
        hasStoredCredentials.value = true
        return true
      }
    }
  } catch (e) {
    console.error('Failed to load Gmail credentials:', e)
  }
  return false
}

const saveGmailCredentials = () => {
  try {
    if (gmailEmail.value && gmailAppPassword.value) {
      const encrypted = encryptCredentials(gmailEmail.value, gmailAppPassword.value)
      localStorage.setItem(GMAIL_STORAGE_KEY, encrypted)
      hasStoredCredentials.value = true
    }
  } catch (e) {
    console.error('Failed to save Gmail credentials:', e)
  }
}

const resetGmailCredentials = () => {
  gmailEmail.value = ''
  gmailAppPassword.value = ''
  hasStoredCredentials.value = false
  localStorage.removeItem(GMAIL_STORAGE_KEY)
}

// Open test email modal
const openTestEmailModal = () => {
  testEmailResult.value = null
  // Load stored credentials if available
  if (isPublicMode.value && !hasStoredCredentials.value) {
    loadStoredGmailCredentials()
  }
  showTestEmailModal.value = true
}

// Send test email
const sendTestEmail = async () => {
  if (!testEmailAddress.value) return
  
  // For public mode, require Gmail credentials
  if (isPublicMode.value) {
    if (!gmailEmail.value || !gmailAppPassword.value) {
      testEmailResult.value = {
        success: false,
        message: 'Vui lòng nhập Gmail và App Password của bạn'
      }
      return
    }
  }
  
  sendingTestEmail.value = true
  testEmailResult.value = null
  
  try {
    // Generate HTML content using the same function as preview
    const htmlContent = generateEmailHTML()
    
    let response
    
    if (isPublicMode.value) {
      // Public mode: Use user's Gmail credentials
      response = await fetch(`${apiBaseUrl}/v1/public/email/send-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: testEmailAddress.value,
          subject: testEmailSubject.value || 'Email Test - Email Builder',
          html: htmlContent,
          gmailEmail: gmailEmail.value,
          gmailAppPassword: gmailAppPassword.value
        })
      })
    } else {
      // Authenticated mode: Use system email
      
      response = await fetch(`${apiBaseUrl}/v1/admin/system-email-config/send-template-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.accessToken}`
        },
        body: JSON.stringify({
          to: testEmailAddress.value,
          subject: testEmailSubject.value || 'Email Test - Emailer Builder',
          html: htmlContent
        })
      })
    }
    
    const data = await response.json()
    
    testEmailResult.value = {
      success: data.success,
      message: data.success ? 'Email đã được gửi thành công! Kiểm tra hộp thư của bạn.' : (data.message || 'Gửi thất bại'),
      remaining: data.remaining
    }
    
    // Save Gmail credentials on success (public mode only)
    if (data.success && isPublicMode.value) {
      saveGmailCredentials()
    }
  } catch (error) {
    console.error('Send test email error:', error)
    testEmailResult.value = {
      success: false,
      message: isPublicMode.value 
        ? 'Không thể gửi email. Vui lòng kiểm tra Gmail và App Password.'
        : 'Không thể gửi email test. Vui lòng kiểm tra cấu hình SMTP.'
    }
  } finally {
    sendingTestEmail.value = false
  }
}

// Auto-save when elements or globalSettings change
watch([emailElements, globalSettings], () => {
  autoSave()
}, { deep: true })

// Initialize
onMounted(async () => {
  // Check for pending template save after Google login
  if (autoSaveAfterLogin.value) {
    const pendingData = localStorage.getItem('pendingTemplateSave')
    if (pendingData) {
      try {
        const data = JSON.parse(pendingData)
        
        // Restore template data
        emailElements.value = data.elements || []
        globalSettings.value = { ...globalSettings.value, ...(data.globalSettings || {}) }
        saveForm.value = data.saveForm || { name: '', description: '', category: '' }
        
        // Update mode to create for saving
        editorMode.value = 'create'
        
        // Wait for data to be set then auto-save
        await nextTick()
        
        // Show save modal and trigger save
        if (saveForm.value.name) {
          showSaveModal.value = true
          // Auto-trigger save after a short delay
          setTimeout(async () => {
            await handleSaveTemplate()
          }, 500)
        } else {
          // If no name, just show the save modal
          showSaveModal.value = true
        }
        
      } catch (error) {
        console.error('Failed to load pending template:', error)
        localStorage.removeItem('pendingTemplateSave')
      }
    }
  }
  // Load template if in edit mode
  else if (editorMode.value === 'edit' && templateId.value) {
    await loadTemplateFromServer()
    
    // Auto-open preview modal if preview=true query param
    if (route.query.preview === 'true') {
      await nextTick() // Wait for template to load
      showPreview.value = true
    }
  } 
  
  // Setup resize listener
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
    handleResize() // Initial call
  }
  
  // Load stored Gmail credentials for public mode
  if (isPublicMode.value) {
    loadStoredGmailCredentials()
  }
  
})

// Load template from server
const loadTemplateFromServer = async () => {
  if (!templateId.value) return
  
  isLoadingTemplate.value = true
  try {
    const template = await getTemplate(templateId.value)
    
    // Load template data
    if (template.jsonData) {
      emailElements.value = template.jsonData.elements || []
      globalSettings.value = { ...globalSettings.value, ...(template.jsonData.globalSettings || {}) }
    }
    
    // Load template metadata
    saveForm.value = {
      name: template.name || '',
      description: template.description || '',
      category: template.category || ''
    }
    
  } catch (error) {
    console.error('Error loading template:', error)
    showError('Không thể tải template. Vui lòng thử lại.')
  } finally {
    isLoadingTemplate.value = false
  }
}

// Cleanup
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})

// Add element
const mainCanvas = ref(null) 
const addElement = (type) => {
  const newElement = {
    id: Date.now(),
    type,
    props: getDefaultProps(type),
    style: getDefaultStyle(type)
  }
  
  // Initialize children for layout elements
  if (['columns2', 'columns3', 'columns4', 'row2', 'row3', 'row4'].includes(type)) {
    const count = type.includes('columns') ? parseInt(type.replace('columns', '')) : parseInt(type.replace('row', ''))
    newElement.children = Array.from({ length: count }, () => [])
  }
  
  // Directly add to emailElements - watch will auto-save
  emailElements.value = [...emailElements.value, newElement]
  
  // Auto-select
  nextTick(() => {
    selectedElement.value = { ...newElement }
     if(isMobile.value){
        toggleLeftPanel()
        scrollToBottom()
    }
  })

}

const scrollToBottom = () => {
  // Scroll to bottom of canvas to show newly added element
  nextTick(() => {
    if (mainCanvas.value) {
      mainCanvas.value.scrollTop = mainCanvas.value.scrollHeight
    }
  })
}
// Select element with deep copy to avoid reference issues
const selectElement = (element) => {
  if (element && element.id) {
    // Deep copy to ensure nested objects (props, style) are also copied
    selectedElement.value = JSON.parse(JSON.stringify(element))
    
    // Auto-open right panel on mobile when selecting an element
    if (isMobile.value && !showRightPanel.value) {
      showRightPanel.value = true
      // Close left panel if it's open to avoid overlap
      if (showLeftPanel.value) {
        showLeftPanel.value = false
      }
    }
    
  } else {
    selectedElement.value = null
  }
}

// Update element with deep reactivity
const updateElement = (updatedElement) => {
  if (!updatedElement || !updatedElement.id) return
  
  
  // TRULY recursive helper function to update at any depth
  const deepUpdate = (elements) => {
    return elements.map(el => {
      // Found the element at this level
      if (el.id === updatedElement.id) {
        return JSON.parse(JSON.stringify(updatedElement))
      }
      
      // Check nested children RECURSIVELY
      if (el.children) {
        if (Array.isArray(el.children[0])) {
          // Array of arrays (columns/rows) - RECURSE into each array
          const newChildren = el.children.map(childArray => {
            return deepUpdate(childArray) // RECURSIVE CALL
          })
          return { ...JSON.parse(JSON.stringify(el)), children: newChildren }
        } else if (Array.isArray(el.children)) {
          // Single array (section/row) - RECURSE into children
          const newChildren = deepUpdate(el.children) // RECURSIVE CALL
          return { ...JSON.parse(JSON.stringify(el)), children: newChildren }
        }
      }
      
      // No match, return unchanged
      return JSON.parse(JSON.stringify(el))
    })
  }
  
  // Update the elements array - watch will auto-save
  const updated = deepUpdate(emailElements.value)
  emailElements.value = updated
  
  
  // CRITICAL: Update selectedElement to keep it in sync with the actual element in the tree
  // This ensures PropertiesPanel always shows current values
  selectedElement.value = JSON.parse(JSON.stringify(updatedElement))
}

// Load template
const loadTemplate = (template) => {
  emailElements.value = [...template.elements]
  selectedElement.value = null
  activeTab.value = 'elements'
}

// Update global settings
const updateGlobalSettings = (settings) => {
  globalSettings.value = { ...globalSettings.value, ...settings }
}

// Device dropdown ref and selection
const deviceDropdown = ref(null)
const actionsDropdown = ref(null)

// Select device and close dropdown
const selectDevice = (device) => {
  currentDevice.value = device
  // Close dropdown by removing open attribute
  if (deviceDropdown.value) {
    deviceDropdown.value.removeAttribute('open')
  }
}

// Close actions dropdown helper
const closeActionsDropdown = () => {
  if (actionsDropdown.value) {
    actionsDropdown.value.removeAttribute('open')
  }
}

// HTML Editor methods
const applyHtmlFromEditor = (htmlCode) => {
  if (selectedElement.value) {
    selectedElement.value.props.children = htmlCode
    updateElement(selectedElement.value)
  }
  showHtmlEditor.value = false
}

// Export JSON - Show modal
const exportJson = () => {
  showExportModal.value = true
  closeActionsDropdown()
}

// Import JSON - Show modal
const importJson = () => {
  showImportModal.value = true
  closeActionsDropdown()
}

// Handle import from modal
const handleImportJson = (jsonData) => {
  try {
    const success = importFromJSON(jsonData)
    if (success) {
    } else {
      console.error('❌ Failed to import template')
    }
  } catch (error) {
    console.error('❌ Import error:', error)
  }
}

// Handle image upload
const handleImageUpload = async (files) => {
  const formData = new FormData()
  files.forEach(file => formData.append('images', file))
  formData.append('folder', 'DATools')
  formData.append('metadata', JSON.stringify({ type: 'images' }))

  try {
    const response = await $fetch(`${config.public.apiBase}/cloudflare/upload-multiple`, {
      method: 'POST',
      body: formData
    })
    return response
  } catch (error) {
    console.error('Image upload failed:', error)
    throw error
  }
}

// Element Map helpers
const moveElementUp = (index) => {
  if (index > 0) {
    const newElements = [...emailElements.value]
    const temp = newElements[index]
    newElements[index] = newElements[index - 1]
    newElements[index - 1] = temp
    emailElements.value = newElements
  }
}

const moveElementDown = (index) => {
  if (index < emailElements.value.length - 1) {
    const newElements = [...emailElements.value]
    const temp = newElements[index]
    newElements[index] = newElements[index + 1]
    newElements[index + 1] = temp
    emailElements.value = newElements
  }
}

const deleteElementByIndex = (index) => {
  const newElements = [...emailElements.value]
  newElements.splice(index, 1)
  
  // Directly update emailElements - the watch will handle history
  emailElements.value = newElements
  
  nextTick(() => {
    selectedElement.value = null
  })
}

// Handle show element library for nested structures
const handleShowElementLibrary = (targetInfo) => {

  nestedElementTarget.value = targetInfo
  showNestedElementLibrary.value = true
}

// Handle insert dynamic field - copy to clipboard and show notification
const handleInsertField = (field) => {
  const placeholder = `{{${field.fieldKey}}}`
  success(`Field "${field.fieldName}" copied! Paste ${placeholder} in your email content.`)
}

// Export/Import functions for database operations
const exportToJSON = () => {
  return {
    version: '1.0',
    elements: emailElements.value,
    globalSettings: globalSettings.value,
    metadata: {
      createdAt: new Date().toISOString(),
      elementCount: emailElements.value.length
    }
  }
}

const importFromJSON = (jsonData) => {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
    
    if (data.elements && Array.isArray(data.elements)) {
      emailElements.value = data.elements
      
      if (data.globalSettings) {
        globalSettings.value = { ...globalSettings.value, ...data.globalSettings }
      }
      
      selectedElement.value = null
      return true
    }
    console.warn(' Invalid JSON structure')
    return false
  } catch (error) {
    console.error(' Import failed:', error)
    return false
  }
}

const downloadJSON = () => {
  const data = exportToJSON()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `email-template-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Auto-save to localStorage (debounced)
let autoSaveTimeout = null
const autoSave = () => {
  clearTimeout(autoSaveTimeout)
  autoSaveTimeout = setTimeout(() => {
    try {
      const data = exportToJSON()
      data._id = currentTemplateId.value // Preserve _id if exists
      lastSavedTime.value = Date.now()
    } catch (error) {
      console.error('❌ Failed to auto-save:', error)
    }
  }, 1000) // Debounce 1 second
}

// Load from localStorage
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      
      // Restore _id if exists
      if (data._id) {
        currentTemplateId.value = data._id
        saveForm.value.name = data.name || ''
        saveForm.value.description = data.description || ''
        saveForm.value.category = data.category || ''
      }
      
      const success = importFromJSON(data)
      if (success) {
        return true
      }
    }
    return false
  } catch (error) {
    console.error('❌ Failed to load from localStorage:', error)
    return false
  }
}

// Upload base64 image to Cloudflare
const uploadBase64Image = async (base64Data, filename = 'overlay-image.jpg') => {
  try {
    // Convert base64 to blob
    const base64Response = await fetch(base64Data)
    const blob = await base64Response.blob()
    
    // Create File object
    const file = new File([blob], filename, { type: 'image/jpeg' })
    
    // Upload using composable
    const { uploadSingleImage } = useImageUpload()
    const result = await uploadSingleImage(file, 'emailer')
    
    if (result.success && result.url) {
      return result.url
    }
    throw new Error('Upload failed')
  } catch (error) {
    console.error('Failed to upload base64 image:', error)
    throw error
  }
}

// Process elements to upload temporary overlay images
const processOverlayImages = async (elements) => {
  const processedElements = []
  
  for (const element of elements) {
    const processedElement = { ...element }
    
    // Skip images with dynamic overlay config - they will be rendered at email send time
    if (element.type === 'image' && element.props?.hasDynamicOverlay && element.props?.overlayConfig) {
      processedElement.props = {
        ...element.props,
        // Keep overlayConfig and hasDynamicOverlay for backend processing
      }
    }
    // QR code overlay: No special processing needed - qrConfig is saved and originalImageUrl is kept
    // Backend will render QR at send time using qrConfig and originalImageUrl
    
    // Check if this is an image element with temporary overlay (static text)
    else if (element.type === 'image' && element.props?.isTemporaryOverlay && element.props?.src?.startsWith('data:image')) {
      try {
        const cloudflareUrl = await uploadBase64Image(element.props.src, `overlay-${Date.now()}.jpg`)
        
        // Update element props with Cloudflare URL
        processedElement.props = {
          ...element.props,
          src: cloudflareUrl,
          isTemporaryOverlay: false // Mark as permanent
        }
      } catch (error) {
        console.error('[Save Template] Failed to upload overlay image:', error)
        // Keep the base64 if upload fails
      }
    }
    
    // Process nested elements recursively
    if (element.children && Array.isArray(element.children)) {
      processedElement.children = await processOverlayImages(element.children)
    }
    
    processedElements.push(processedElement)
  }
  
  return processedElements
}

// Save template to server
const handleSaveTemplate = async () => {
  // Clear previous validation errors
  validationErrors.value = {
    category: '',
    description: ''
  }
  
  // Validate required fields
  let hasErrors = false
  
  if (!saveForm.value.name) {
    warning('Vui lòng nhập tên template')
    return
  }
  
  if (!saveForm.value.category) {
    validationErrors.value.category = 'Vui lòng chọn danh mục'
    hasErrors = true
  }
  
  if (!saveForm.value.description || saveForm.value.description.trim() === '') {
    validationErrors.value.description = 'Vui lòng nhập mô tả'
    hasErrors = true
  }
  
  if (hasErrors) {
    return
  }
  
  // For public mode, check if user is authenticated
  if (isPublicMode.value && !authStore.isAuthenticated) {
    // Store template data in localStorage for after login
    const pendingData = {
      elements: emailElements.value,
      globalSettings: globalSettings.value,
      saveForm: saveForm.value
    }
    localStorage.setItem('pendingTemplateSave', JSON.stringify(pendingData))
    
    // Redirect to Google login
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${appConfig.googleAuth.clientId}&redirect_uri=${appConfig.googleAuth.redirectUri}&response_type=code&scope=openid%20profile%20email`
    window.location.href = oauthUrl
    return
  }
  
  isSaving.value = true
  
  try {
    // Process overlay images before saving
    const processedElements = await processOverlayImages(emailElements.value)
    
    // Update emailElements with processed data
    emailElements.value = processedElements
    
    const templateData = exportToJSON()
    
    // Generate HTML for htmlCache - this is the full rendered email HTML
    const renderedHtml = generateEmailHTML()
    
    const payload = {
      name: saveForm.value.name,
      description: saveForm.value.description,
      category: saveForm.value.category,
      jsonData: {
        elements: processedElements,
        globalSettings: globalSettings.value
      },
      htmlCache: renderedHtml
    }
    
    // If in edit mode or has templateId, update existing template
    if (editorMode.value === 'edit' && templateId.value) {
      const updated = await updateTemplate(templateId.value, payload)
      success('Template đã được cập nhật thành công!')
    } else if (editorMode.value === 'create' || isPublicMode.value) {
      // Create new template
      const created = await createTemplate(payload)
      templateId.value = created._id
      success('Template đã được tạo thành công!')
      
      // Clear pending save data
      localStorage.removeItem('pendingTemplateSave')
      
      // Update URL to edit mode
      router.replace(`/editor?mode=edit&templateId=${created._id}`)
      editorMode.value = 'edit'
    } else {
      // Standalone mode - save to localStorage only
      currentTemplateId.value = 'local_' + Date.now()
      autoSave()
      success('Template đã được lưu locally!')
    }
    
    showSaveModal.value = false
    
    // Stay on editor page after saving - no redirect
  } catch (error) {
    console.error('❌ Failed to save template:', error)
    showError('Không thể lưu template. Vui lòng thử lại.')
  } finally {
    isSaving.value = false
  }
}

// Expose functions for parent component access
defineExpose({
  exportToJSON,
  importFromJSON,
  downloadJSON,
  handleSaveTemplate,
  emailElements,
  globalSettings
})

// Add element to nested structure
// Note: restrictedContainerElements is imported from ~/utils/emailElementDefaults.js

const addElementToNested = (elementType) => {
  if (!nestedElementTarget.value) return
  
  const { type, parentId, columnIndex, rowIndex } = nestedElementTarget.value
  
  // Block E-commerce, Real Estate, Recruitment elements from being nested in Column/Row
  if ((type === 'column' || type === 'row' || type === 'row-item') && restrictedContainerElements.includes(elementType)) {
    showWarningToast('Thành phần này không hỗ trợ đặt trong Column/Row')
    showNestedElementLibrary.value = false
    nestedElementTarget.value = null
    return
  }
  
  // Create new element
  const newElement = {
    id: Date.now(),
    type: elementType,
    props: getDefaultProps(elementType),
    style: getDefaultStyle(elementType)
  }
  
  // Initialize children for layout elements
  if (['columns2', 'columns3', 'columns4'].includes(elementType)) {
    const count = parseInt(elementType.replace('columns', ''))
    newElement.children = Array.from({ length: count }, () => [])
  } else if (['row2', 'row3', 'row4'].includes(elementType)) {
    const count = parseInt(elementType.replace('row', ''))
    newElement.children = Array.from({ length: count }, () => [])
  }
  
  // Find parent element recursively
  const findAndUpdateParent = (elements, targetId, targetColumnIndex, targetRowIndex) => {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]
      
      if (el.id === targetId) {
        // Found the parent element
        if (!el.children) el.children = []
        
        if (targetColumnIndex !== null && targetColumnIndex !== undefined) {
          // Adding to a column
          if (!el.children[targetColumnIndex]) el.children[targetColumnIndex] = []
          el.children[targetColumnIndex].push(newElement)
        } else if (targetRowIndex !== null && targetRowIndex !== undefined) {
          // Adding to a row
          if (!el.children[targetRowIndex]) el.children[targetRowIndex] = []
          el.children[targetRowIndex].push(newElement)
        } else {
          // Adding to a section or single-array structure
          el.children.push(newElement)
        }
        return true
      }
      
      // Search in children
      if (el.children) {
        if (Array.isArray(el.children[0])) {
          // Array of arrays (columns/rows)
          for (let j = 0; j < el.children.length; j++) {
            if (findAndUpdateParent(el.children[j], targetId, targetColumnIndex, targetRowIndex)) {
              return true
            }
          }
        } else if (Array.isArray(el.children)) {
          // Single array (section/row)
          if (findAndUpdateParent(el.children, targetId, targetColumnIndex, targetRowIndex)) {
            return true
          }
        }
      }
    }
    return false
  }
  
  // Clone elements array and update
  const newElements = JSON.parse(JSON.stringify(emailElements.value))
  if (findAndUpdateParent(newElements, parentId, columnIndex, rowIndex)) {
    emailElements.value = newElements
    
    // Auto-select the new element
    nextTick(() => {
      selectedElement.value = { ...newElement }
    })
  }
  
  // Close modal
  showNestedElementLibrary.value = false
  nestedElementTarget.value = null
}

// Generate responsive email HTML with media queries (Unlayer-style)
const generateEmailHTML = () => {
 
  const contentWidth = globalSettings.value.contentWidth || 700
  const breakpoint = contentWidth + 20 // Add 20px buffer for breakpoint
  
  const html = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title>${globalSettings.value.title || 'Email Template'}</title>
  
  <style type="text/css">
    @media only screen and (min-width: ${breakpoint}px) {
      .u-row {
        width: ${contentWidth}px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
      .u-row .u-col-100 {
        width: ${contentWidth}px !important;
      }
      .u-row .u-col-50 {
        width: ${contentWidth / 2}px !important;
      }
      .u-row .u-col-33 {
        width: ${Math.round(contentWidth / 3)}px !important;
      }
      .u-row .u-col-25 {
        width: ${contentWidth / 4}px !important;
      }
    }

    @media only screen and (max-width: ${breakpoint}px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row {
        width: 100% !important;
      }
      .u-row .u-col {
        display: block !important;
        width: 100% !important;
        min-width: 100% !important;
        max-width: 100% !important;
      }
      .u-row .u-col > div {
        margin: 0 auto;
      }
      
      table[role="presentation"] {
        width: 100% !important;
        max-width: 100% !important;
      }
      /* Header mobile responsive - keep inline layout */
      table.header-inline-table {
        width: auto !important;
        margin: 0 auto !important;
      }
      img.header-logo {
        max-height: 32px !important;
        height: 32px !important;
        width: auto !important;
      }
      .header-nav a {
        font-size: 12px !important;
        margin: 0 6px !important;
      }
      /* Footer mobile responsive */
      .footer-logo {
        height: 32px !important;
        max-height: 32px !important;
      }
    }

body{margin:0;padding:0}table,td,tr{;vertical-align:top}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors=true]{color:inherit!important;text-decoration:none!important}


/* Preserve custom link colors - use .link-preserve class */
a.link-preserve, a.link-preserve span { color: inherit !important; text-decoration: inherit !important; }
a.link-white, a.link-white span { color: #ffffff !important; }
a.link-red, a.link-red span { color: #dc2626 !important; }
a.link-blue, a.link-blue span { color: #2563eb !important; }
  </style>

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: ${globalSettings.value.backgroundColor || '#F7F8F9'};color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table role="presentation" id="u_body" style="table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: ${globalSettings.value.backgroundColor || '#F7F8F9'};width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: ${globalSettings.value.backgroundColor || '#F7F8F9'};"><![endif]-->
    
${renderEmailElements()}

    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>
</html>`
 
  return html
}

// Render email elements to HTML (Unlayer-style)
const renderEmailElements = () => {
  const contentWidth = globalSettings.value.contentWidth || 700
  
  if (!emailElements.value || emailElements.value.length === 0) {
    return `
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="width: 100%;margin: 0 auto;min-width: 320px;max-width: ${contentWidth}px;">
    <div class="u-col u-col-100" style="max-width: 100%;min-width: 320px;display: table-cell;">
      <div style="padding: 40px;text-align: center; color: #999;">
        Không có nội dung - Bắt đầu xây dựng email của bạn!
      </div>
    </div>
  </div>
</div>`
  }
  
  const elementGap = globalSettings.value.elementGap || 0
  return emailElements.value.map((element, index) => {
    let html = ''
    // Add gap between elements (not before first element)
    if (index > 0 && elementGap > 0) {
      html += `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tr><td style="height:${elementGap}px;line-height:${elementGap}px;font-size:1px;">&nbsp;</td></tr></table>\n`
    }
    html += renderUnlayerRow(element)
    return html
  }).join('\n')
}

// Render nested element (recursive for columns/rows)
// IMPORTANT: This function now uses the SAME rendering logic as renderElementContent
// to ensure 100% consistency between Email Canvas and Preview/Export HTML
const renderNestedElement = (element, contentWidth) => {
  const style = element.style || {}
  const props = element.props || {}

  // Handle nested columns
  if (['columns2', 'columns3', 'columns4'].includes(element.type)) {
    const colCount = parseInt(element.type.replace('columns', ''))
    const colWidthPercent = Math.floor(100 / colCount)

    let html = `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>`

    if (element.children && Array.isArray(element.children)) {
      element.children.forEach((col) => {
        html += `
      <td width="${colWidthPercent}%" style="vertical-align: top; padding: 0px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">`

        if (col && Array.isArray(col) && col.length > 0) {
          col.forEach(child => {
            html += `
          <tr>
            <td>${renderNestedElement(child, contentWidth)}</td>
          </tr>`
          })
        }

        html += `
        </table>
      </td>`
      })
    }

    html += `
    </tr>
  </tbody>
</table>`
    return html
  }

  // Handle nested rows
  if (['row2', 'row3', 'row4'].includes(element.type)) {
    let html = `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>`

    if (element.children && Array.isArray(element.children)) {
      element.children.forEach((row) => {
        if (row && Array.isArray(row) && row.length > 0) {
          row.forEach(child => {
            html += `
    <tr>
      <td style="padding: 0px;">${renderNestedElement(child, contentWidth)}</td>
    </tr>`
          })
        }
      })
    }

    html += `
  </tbody>
</table>`
    return html
  }

  // Handle Custom Elements FIRST - using same logic as renderElementContent
  if (['header', 'footer', 'cta-block', 'testimonial', 'product-card', 'quote',
       'product-grid', 'coupon-code', 'cart-reminder', 'order-summary',
       'property-card', 'property-features', 'location-map', 'agent-contact',
       'job-listing', 'benefits-list', 'company-intro', 'apply-button',
       'transaction-card','credit-card-info',
       'course-card', 'achievement-badge', 'progress-bar',
       'menu-item', 'room-card', 'booking-summary', 'rating-review'].includes(element.type)) {
    return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;padding:0px !important ;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
        ${renderCustomElementHTML(element)}
      </td>
    </tr>
  </tbody>
</table>`
  }

  // Render basic elements with proper table structure (matching renderElementContent)
  switch (element.type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
      const tag = element.type.replace('heading', 'h')
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
        <${tag} style="margin: 0; font-size: ${style.fontSize || '32px'}; color: ${style.color || '#000'}; font-weight: ${style.fontWeight || 'bold'}; line-height: 1.2; text-align: ${style.textAlign || 'left'};">${props.children || ''}</${tag}>
      </td>
    </tr>
  </tbody>
</table>`

    case 'text':
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
        <div style="font-size: ${style.fontSize || '16px'}; color: ${style.color || '#374151'}; line-height: ${style.lineHeight || '1.6'}; text-align: ${style.textAlign || 'left'};">${props.children || ''}</div>
      </td>
    </tr>
  </tbody>
</table>`

    case 'button':
      const btnColor = style.color || '#ffffff'
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="center">
<div align="center">
  <a href="${props.href || '#'}" target="_blank" class="link-preserve" style="box-sizing: border-box;display: inline-block;text-decoration: none;text-align: center;color: ${btnColor}; background-color: ${style.backgroundColor || '#3b82f6'}; border-radius: ${style.borderRadius || '6px'}; width:auto; max-width:100%; font-size: ${style.fontSize || '16px'};">
    <span style="display:block;padding:${style.padding || '12px 24px'};line-height:120%;color:${btnColor};"><strong style="color:${btnColor};">${props.children || 'Button'}</strong></span>
  </a>
</div>
      </td>
    </tr>
  </tbody>
</table>`

    case 'image':
      const imgSrc = style.backgroundImage || props.src || ''
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
      ${props.href ? `<a href="${props.href}" target="_blank">` : ''}
      <img align="center" border="0" src="${imgSrc}" alt="${props.alt || ''}" title="${props.title || ''}" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block;border: none;height: auto;float: none;width: 100%;max-width: 100%;" />
      ${props.href ? '</a>' : ''}
    </td>
  </tr>
</table>
      </td>
    </tr>
  </tbody>
</table>`

    case 'divider':
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;" align="left">
        <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;border-spacing: 0;vertical-align: top;border-top: 1px solid ${style.borderColor || '#e5e7eb'};-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"><span>&#160;</span></td></tr></tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`

    case 'spacer':
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;" align="left">
        <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;border-spacing: 0;vertical-align: top;">
          <tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;height: ${style.height || '20px'};"><span>&#160;</span></td></tr></tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`

    case 'video':
      const vidWidth = props.width || '100%'
      const vidAlign = props.align || 'center'
      const vidMargin = vidAlign === 'center' ? '0 auto' : vidAlign === 'right' ? '0 0 0 auto' : '0'
      let videoHtml = ''
      if (props.videoType === 'youtube' && props.youtubeUrl) {
        const ytId = getYouTubeEmbedId(props.youtubeUrl)
        if (ytId) {
          // Simple thumbnail + button below (no overlay)
          videoHtml = `<div style="text-align:center;">
            <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" alt="Video thumbnail" style="width: 100%; height: auto; display: block; border-radius: ${props.borderRadius || '8px'}; margin: 0 auto;" />
            <div style="margin-top: 16px; text-align: center;">
              <a href="${props.youtubeUrl}" target="_blank" class="link-preserve" style="display: inline-block; padding: 12px 24px; background: #cc0000; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500;">
                <span style="font-size: 18px; vertical-align: middle; margin-right: 8px;">▶</span>
                <span style="vertical-align: middle;">Xem Video</span>
              </a>
            </div>
          </div>
          `
        }
      }
      if (!videoHtml) {
        videoHtml = `<div style="background-color:#1f2937;padding:40px;text-align:center;border-radius:${props.borderRadius || '8px'};">
          <div style="font-size:48px;color:#9ca3af;">▶</div>
          <p style="color:#9ca3af;margin:8px 0 0 0;font-size:14px;">Video</p>
        </div>`
      }
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;font-family:arial,helvetica,sans-serif;" align="${vidAlign}">
        <div style="width: ${vidWidth}; margin: ${vidMargin};">
          ${props.title ? `<p style="font-weight: 600; margin: 0 0 12px 0; text-align: ${vidAlign}; font-size: 16px;">${props.title}</p>` : ''}
          ${videoHtml}
          ${props.caption ? `<p style="font-size: 12px; color: #6b7280; margin: 12px 0 0 0; font-style: italic; text-align: ${vidAlign};">${props.caption}</p>` : ''}
        </div>
      </td>
    </tr>
  </tbody>
</table>`

    case 'unsubscribe':
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding: 10px 0px;font-family:arial,helvetica,sans-serif;border-top:1px solid #e5e7eb;" align="center">
        <p style="color: ${props.textColor || '#9ca3af'}; font-size: ${props.fontSize || '12px'}; margin: 0 0 12px 0; line-height: 1.5;">${props.description || 'Nếu bạn không muốn nhận email từ chúng tôi, bạn có thể hủy đăng ký bất cứ lúc nào.'}</p>
        <a href="${props.href || '{{UNSUBSCRIBE_URL}}'}" style="color: ${props.linkColor || '#2563eb'}; font-size: ${props.fontSize || '12px'}; text-decoration: underline;">${props.children || 'Hủy đăng ký'}</a>
      </td>
    </tr>
  </tbody>
</table>`

    case 'html':
      // Keep full HTML with CSS support including @media queries for export
      let fullHtml = (props.children || '').trim()

      // Only remove dangerous scripts but keep all CSS including <style> tags
      fullHtml = fullHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      fullHtml = fullHtml.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
      fullHtml = fullHtml.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
      fullHtml = fullHtml.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"')
      fullHtml = fullHtml.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""')

      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
        <div style="width: 100%; box-sizing: border-box;">${fullHtml}</div>
      </td>
    </tr>
  </tbody>
</table>`

    default:
      return ''
  }
}

// Helper to render icon as inline SVG (email-safe)
// Icons8 CDN - PNG icons (email-safe, Gmail compatible)
const ICONS8_BASE = 'https://img.icons8.com/fluency/48'

// Map Bootstrap icon names to Icons8 equivalents
const iconMap = {
  'currency-dollar': 'us-dollar-circled',
  'geo-alt-fill': 'marker',
  'arrows-angle-expand': 'expand',
  'door-open': 'open-door',
  'droplet': 'water',
  'check-lg': 'checkmark',
  'cart3': 'shopping-cart',
  'cart-fill': 'shopping-cart',
  'clipboard-check': 'task-completed',
  'ticket-perforated-fill': 'ticket',
  'briefcase-fill': 'briefcase',
  'lightning-fill': 'flash-on'
}

const renderIcon = (icon, fallback, size = '16', customUrl = '', color = 'currentColor') => {
  // If customUrl is provided, use image
  if (customUrl && customUrl.trim()) {
    return `<img src="${customUrl}" alt="icon" style="width:${size}px;height:${size}px;vertical-align:middle;object-fit:contain;" />`
  }
  
  // Use Icons8 PNG for email compatibility (Gmail doesn't render SVG well)
  let iconId = icon || fallback
  if (!iconId || iconId === 'none') return ''
  
  const icons8Name = iconMap[iconId] || iconId
  const iconUrl = `${ICONS8_BASE}/${icons8Name}.png`
  return `<img src="${iconUrl}" alt="${iconId}" style="width:${size}px;height:${size}px;vertical-align:middle;" />`
}

// Helper to render icon in a circle with proper centering
const renderIconInCircle = (icon, fallback, iconSize = '20', circleSize = '40', bgColor = '#fee2e2', customUrl = '', color = '#22c55e') => {
  // If customUrl is provided, use image in circle
  if (customUrl && customUrl.trim()) {
    return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td style="width:${circleSize}px;height:${circleSize}px;background:${bgColor};border-radius:50%;text-align:center;vertical-align:middle;line-height:${circleSize}px;"><img src="${customUrl}" alt="icon" style="width:${iconSize}px;height:${iconSize}px;vertical-align:middle;display:inline-block;" /></td></tr></table>`
  }
  
  // Use Icons8 PNG for email compatibility (Gmail doesn't render SVG well)
  let iconId = icon || fallback
  if (!iconId || iconId === 'none') {
    iconId = fallback
  }
  if (!iconId) return ''
  
  const icons8Name = iconMap[iconId] || iconId
  const iconUrl = `${ICONS8_BASE}/${icons8Name}.png`
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td style="width:${circleSize}px;height:${circleSize}px;background:${bgColor};border-radius:50%;text-align:center;vertical-align:middle;line-height:${circleSize}px;"><img src="${iconUrl}" alt="${iconId}" style="width:${iconSize}px;height:${iconSize}px;vertical-align:middle;display:inline-block;" /></td></tr></table>`
}

// Render custom elements HTML ( footer, etc.)
const renderCustomElementHTML = (element) => {
  const props = element.props || {}
  const style = element.style || {}
  
  const styleStr = Object.entries(style).map(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    return `${cssKey}: ${value}`
  }).join('; ')
  
  const elementId = `custom-${Math.random().toString(36).substr(2, 9)}`
  
  switch (element.type) {
    
    
    case 'header':
      const headerBgColor = props.backgroundColor || '#1f2937'
      const headerTextColor = props.textColor || '#ffffff'
      const headerLinkColor = props.linkColor || '#60a5fa'
      const headerLogoPosition = props.logoPosition || 'center'
      const headerNavAlign = props.navAlign || 'center'
      const headerLayout = props.headerLayout || 'inline'
      const headerPadding = props.padding || '16px'
      const headerLogoAlignStyle = headerLogoPosition === 'left' ? 'left' : headerLogoPosition === 'right' ? 'right' : 'center'
      const headerNavAlignStyle = headerNavAlign === 'left' ? 'left' : headerNavAlign === 'right' ? 'right' : 'center'
      
      const headerNavHtml = (props.showNav && props.navLinks && props.navLinks.length > 0) 
        ? `<table class="header-nav" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="margin-top:12px;border-top:1px solid rgba(255,255,255,0.2);padding-top:12px;">
            <tr><td style="text-align:${headerNavAlignStyle};padding-top: 12px;">
              ${props.navLinks.map(link => `<a href="${link.url || '#'}" class="link-preserve" style="color:${headerLinkColor} !important;text-decoration:none;font-size:14px;margin:0 12px;display:inline-block;"><span style="color:${headerLinkColor};">${link.text}</span></a>`).join('')}
            </td></tr>
          </table>` 
        : ''
      
      // Stacked layout: logo on top, company name below
      if (headerLayout === 'stacked') {
        return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${headerPadding};background:${headerBgColor};text-align:${headerLogoAlignStyle};${styleStr}">
    <div style="max-width:${globalSettings.value.contentWidth || 700}px;margin:0 auto;">
      ${props.logo ? `<img class="header-logo" src="${props.logo}" alt="Logo" style="height:48px;max-height:48px;display:block;margin-bottom:8px;object-fit:contain;${headerLogoPosition === 'center' ? 'margin-left:auto;margin-right:auto;' : ''}" />` : ''}
      ${props.companyName ? `<div style="font-size:18px;font-weight:700;color:${headerTextColor};line-height:1.4;">${props.companyName}</div>` : ''}
      ${props.tagline ? `<div style="font-size:12px;color:${headerTextColor};opacity:0.8;margin-top:4px;line-height:1.4;">${props.tagline}</div>` : ''}
      ${headerNavHtml}
    </div>
  </td></tr>
</table>`
      }
      
      // Inline layout (default): logo and company name side by side
      return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tr><td style="padding:${headerPadding};background:${headerBgColor};text-align:center;${styleStr}">
    <table class="header-inline-table" role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        ${props.logo ? `<td style="vertical-align:middle;${props.companyName ? 'padding-right:12px;' : ''}"><img class="header-logo" src="${props.logo}" alt="Logo" style="height:40px;max-height:40px;display:block;object-fit:contain;" /></td>` : ''}
        ${(props.companyName || props.tagline) ? `<td style="vertical-align:middle;text-align:left;">
          ${props.companyName ? `<div style="font-size:18px;font-weight:700;color:${headerTextColor};line-height:1.4;">${props.companyName}</div>` : ''}
          ${props.tagline ? `<div style="font-size:12px;color:${headerTextColor};opacity:0.8;line-height:1.4;">${props.tagline}</div>` : ''}
        </td>` : ''}
      </tr>
    </table>
    ${headerNavHtml}
  </td></tr>
</table>`
    
    case 'footer':
      // Use default props if not provided
      const footerSocials = props.socials || []
      const footerIconStyle = props.socialIconStyle || 'circle'
      const footerIconSize = props.socialIconSize || 'medium'
      const footerIconRadius = { square: '4px', rounded: '8px', circle: '50%' }
      const footerElementId = `footer-${Math.random().toString(36).substr(2, 9)}`
      const footerSvgSize = footerIconSize === 'small' ? 16 : footerIconSize === 'large' ? 24 : 20
      const footerPadding = footerIconSize === 'small' ? '6px' : footerIconSize === 'large' ? '10px' : '8px'
      
      // Only use actual props, no defaults for content
      const footerLogo = props.logo || ''
      const footerCompanyName = props.companyName || ''
      const footerAddress = props.address || ''
      const footerPhone = props.phone || ''
      const footerEmail = props.email || ''
      const footerCopyright = props.children || '© 2025 Your Company. All rights reserved.'
      
      // Build contact info
      const footerContactHtml = (footerPhone || footerEmail) ? `
        <div style="margin: 0 0 16px 0; font-size: 12px;">
          ${footerPhone ? `<p style="margin: 0;">${footerPhone}</p>` : ''}
          ${footerEmail ? `<p style="margin: 0;">${footerEmail}</p>` : ''}
        </div>` : ''
      
      // Build socials HTML
      const footerSocialsHtml = footerSocials.filter(s => s.enabled !== false).map(social => {
        const platformColor = SOCIAL_COLORS[social.platform] || '#666666'
        if (social.logo) {
          return `<a href="${social.url}" target="_blank" style="text-decoration: none; display: inline-block; background: white; padding: ${footerPadding}; border-radius: ${footerIconRadius[footerIconStyle]}; margin: 0 4px;">
            <img src="${social.logo}" alt="${social.platform}" style="height: ${footerSvgSize}px; width: ${footerSvgSize}px; object-fit: contain; display: block;" />
          </a>`
        } else {
          return `<a href="${social.url}" target="_blank" style="text-decoration: none; display: inline-block; background: ${platformColor}; padding: ${footerPadding}; border-radius: ${footerIconRadius[footerIconStyle]}; margin: 0 4px;">
            ${getSocialIcon(social.platform, 'white', footerSvgSize, {'vertical-align': 'middle', 'display': 'block'})}
          </a>`
        }
      }).join('')
      
      const footerBgColor = props.backgroundColor || '#1f2937'
      const footerTextColor = props.textColor || '#9ca3af'
      
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr><td style="padding: 24px; background-color: ${footerBgColor}; color: ${footerTextColor}; font-size: 14px; text-align: center; ${styleStr}">
            <div style="max-width:${globalSettings.value.contentWidth || 700}px;margin:0 auto;">
              ${footerLogo ? `<div style="margin-bottom: 16px;"><img class="footer-logo" src="${footerLogo}" alt="Logo" style="height: 40px; max-height: 40px; object-fit: contain; margin: 0 auto;" /></div>` : ''}
              ${footerCompanyName ? `<p style="color: white; font-weight: 600; margin: 0 0 8px 0; font-size: 14px; line-height: 1.4;">${footerCompanyName}</p>` : ''}
              ${footerAddress ? `<p style="font-size: 12px; margin: 0 0 8px 0; line-height: 1.5;">${footerAddress}</p>` : ''}
              ${footerContactHtml}
              ${footerSocialsHtml ? `<div style="margin: 16px 0;">${footerSocialsHtml}</div>` : ''}
              <p style="font-size: 12px; margin: 0; line-height: 1.4;">${footerCopyright}</p>
            </div>
          </td></tr>
        </table>
      `
    
    case 'cta-block':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr><td style="padding: 24px; background: linear-gradient(to right, #eff6ff, #eef2ff); border: 1px solid #bfdbfe; border-radius: 8px; text-align: center; ${styleStr}">
            <h4 style="font-weight: bold; margin: 0 0 12px 0; color: #1f2937; font-size: 18px;">${props.children || 'Call to Action'}</h4>
            <a href="${props.href || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
              ${props.buttonText || 'Get Started'}
            </a>
          </td></tr>
        </table>
      `
    
    case 'testimonial':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr><td style="padding: 16px; border-left: 4px solid #3b82f6; background-color: #f9fafb; border-radius: 4px; ${styleStr}">
            <p style="color: #4b5563; font-style: italic; margin: 0 0 8px 0; font-size: 14px;">"${props.children || 'Great product!'}"</p>
            <p style="font-size: 14px; font-weight: 600; color: #1f2937; margin: 0;">— ${props.author || 'Customer Name'}</p>
            <div style="margin-top: 4px;">
              ${'★'.repeat(props.rating || 5).split('').map(() => '<span style="color: #fbbf24; font-size: 12px;">★</span>').join('')}
            </div>
          </td></tr>
        </table>
      `
    
    case 'product-card':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr><td style="background: white; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; ${styleStr}">
            <img src="${props.image || 'https://placehold.co/400x300/f8fafc/64748b?text=Product'}" alt="Product" style="width: 100%; height: auto; display: block;" />
            <div style="padding: 16px;">
              <h4 style="font-weight: bold; font-size: 18px; margin: 0 0 12px 0; color: #1f2937;">${props.children || 'Product Name'}</h4>
              <div style="margin-bottom: 16px;">
                <span style="font-size: 24px; font-weight: bold; color: #3b82f6;">${props.price || '$99.99'}</span>
                ${props.oldPrice ? `<span style="font-size: 16px; color: #9ca3af; text-decoration: line-through; margin-left: 8px;">${props.oldPrice}</span>` : ''}
              </div>
              <a href="${props.href || '#'}" style="display: block; width: 100%; padding: 12px; background: linear-gradient(to right, #3b82f6, #2563eb); color: white; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 600; box-sizing: border-box;">
                ${props.buttonText || 'Add to Cart'}
              </a>
            </div>
          </td></tr>
        </table>
      `
    
    case 'quote':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr><td style="padding: 20px 24px; border-left: 4px solid #3b82f6; background: linear-gradient(to right, #eff6ff, #f8fafc); border-radius: 0 8px 8px 0; ${styleStr}">
            <p style="font-size: 18px; font-style: italic; color: #374151; margin: 0; line-height: 1.6;">"${props.children || 'Quote text'}"</p>
          </td></tr>
        </table>
      `
    
    // E-commerce Elements
    case 'product-grid': {
      const products = props.products || []
      const columns = props.columns || 3
      const colWidth = Math.floor(100 / columns)
      const titleAlign = props.titleAlign || 'center'
      const titleFontSize = props.titleFontSize || '20px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const textAlign = titleAlign === 'center' ? 'center' : titleAlign === 'right' ? 'right' : 'left'
      const alignStyle = titleAlign === 'center' ? 'margin:0 auto 24px auto;' : titleAlign === 'right' ? 'margin:0 0 24px auto;' : 'margin:0 0 24px 0;'
      
      // Create rows of products based on columns
      const rows = []
      for (let i = 0; i < products.length; i += columns) {
        const rowProducts = products.slice(i, i + columns)
        rows.push(rowProducts)
      }
      
      // Render title with icon (matching EmailCanvas)
      const hasIcon = props.icon || props.iconUrl
      const titleHtml = hasIcon 
        ? `<table cellpadding="0" cellspacing="0" border="0" style="${alignStyle}"><tr><td style="vertical-align:middle;">${renderIconInCircle(props.icon, 'cart3', '20', '40', props.iconBgColor || '#dbeafe', props.iconUrl, props.iconColor || '#3b82f6')}</td><td style="vertical-align:middle;padding-left:12px;"><span style="font-size:${titleFontSize};font-weight:${titleFontWeight};font-style:${titleFontStyle};color:${props.titleColor || '#0f172a'};">${props.children || 'Sản phẩm nổi bật'}</span></td></tr></table>`
        : `<p style="font-size:${titleFontSize};font-weight:${titleFontWeight};font-style:${titleFontStyle};text-align:${textAlign};margin:0 0 24px 0;color:${props.titleColor || '#0f172a'};">${props.children || 'Sản phẩm nổi bật'}</p>`
      
      // Email-safe product card rendering (no relative/absolute positioning)
      // Using VML for Outlook and CSS background for modern clients
      const cardBgColor = props.cardBgColor || '#ffffff'
      const cardBorderColor = props.cardBorderColor || '#e5e7eb'
      const cardBorderWidth = props.cardBorderWidth || '1px'
      const cardBorderRadius = props.cardBorderRadius || '12px'
      const cardPadding = props.cardPadding || '12px'
      const productNameColor = props.productNameColor || '#1f2937'
      const oldPriceColor = props.oldPriceColor || '#9ca3af'
      const imageHeight = props.imageHeight || '140px'
      const imageBorderRadius = props.imageBorderRadius || '0px'
      
      const renderProductCard = (p) => {
        const imgUrl = p.image || 'https://placehold.co/200x140'
        const hasSale = !!p.oldPrice
        
        // Sale badge HTML - positioned at top-left using table cells
        const saleBadgeCell = hasSale 
          ? `<td width="60" style="vertical-align:top;padding:8px 0 0 8px;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#ef4444;padding:4px 10px;border-radius:4px;"><span style="color:#ffffff;font-size:11px;font-weight:bold;font-family:Arial,sans-serif;">SALE</span></td></tr></table></td>`
          : ''
        
        // Calculate image border radius for top corners only (matching card radius)
        const imgTopRadius = cardBorderRadius !== '0px' ? cardBorderRadius.replace('px', '') : '0'
        const imgTopRadiusStyle = `${imgTopRadius}px ${imgTopRadius}px 0 0`
        
        return `
          <td width="${colWidth}%" style="padding:8px;vertical-align:top;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background-color:${cardBgColor};border-radius:${cardBorderRadius};border:${cardBorderWidth} solid ${cardBorderColor};overflow:hidden;border-collapse:separate;">
              <!-- Product Image -->
              <tr>
                <td style="padding:0;overflow:hidden;border-radius:${imgTopRadiusStyle};">
                  <!--[if gte mso 9]>
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:100%;height:${imageHeight};">
                    <v:fill type="frame" src="${imgUrl}" />
                    <v:textbox inset="0,0,0,0">
                  <![endif]-->
                  <div style="overflow:hidden;border-radius:${imgTopRadiusStyle};">
                    <img src="${imgUrl}" alt="${p.name}" style="width:100%;height:${imageHeight};object-fit:cover;display:block;border-radius:${imgTopRadiusStyle};" />
                  </div>
                  <!--[if gte mso 9]>
                    </v:textbox>
                  </v:rect>
                  <![endif]-->
                </td>
              </tr>
              <!-- Product Info -->
              <tr>
                <td style="padding:${cardPadding};">
                  <!-- Product Name -->
                  <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:${productNameColor};line-height:1.4;font-family:Arial,sans-serif;">${p.name}</p>
                  <!-- Price Section -->
                  <p style="margin:0;">
                    <span style="font-size:18px;font-weight:bold;color:${props.priceColor || '#2563eb'};font-family:Arial,sans-serif;">${p.price}</span>
                    ${p.oldPrice ? `<span style="font-size:13px;color:${oldPriceColor};text-decoration:line-through;margin-left:8px;font-family:Arial,sans-serif;">${p.oldPrice}</span>` : ''}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        `
      }
      
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr><td style="padding:24px;background:${props.bgColor || '#f8fafc'};border-radius:16px;${styleStr}">
          ${titleHtml}
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            ${rows.map(rowProducts => `
              <tr>
                ${rowProducts.map(p => renderProductCard(p)).join('')}
                ${rowProducts.length < columns ? `<td colspan="${columns - rowProducts.length}" style="padding:8px;"></td>` : ''}
              </tr>
            `).join('')}
          </table>
          </td></tr>
        </table>
      `
    }
    
    case 'coupon-code':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#fffbeb'}; border: 2px dashed ${props.borderColor || '#f59e0b'}; border-radius: 12px; ${styleStr}">
          <tr><td style="padding: 24px; text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom: 12px;"><tr><td style="background: ${props.iconBgColor || '#f59e0b'}; color: #78350f; padding: 6px 12px 6px 10px; border-radius: 20px 0 0 20px; font-size: 14px; font-weight: bold; vertical-align: middle;">${renderIcon(props.icon, 'ticket-perforated-fill', '14', props.iconUrl)}</td><td style="background: ${props.iconBgColor || '#f59e0b'}; color: #78350f; padding: 6px 12px 6px 0; border-radius: 0 20px 20px 0; font-size: 14px; font-weight: bold; vertical-align: middle;">${props.discount || '20% OFF'}</td></tr></table>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 12px;"><tr><td style="background: white; border: 2px solid #fcd34d; border-radius: 8px; padding: 16px; text-align: center;"><span style="font-size: 24px; font-weight: bold; color: ${props.codeColor || '#d97706'}; letter-spacing: 4px; font-family: monospace;">${props.children || 'SAVE20'}</span></td></tr></table>
            <p style="color: #57534e; font-size: 14px; margin: 0 0 8px 0;">${props.description || 'Use this code at checkout'}</p>
            ${props.expiryDate ? `<p style="color: #78716c; font-size: 12px; margin: 0;">ExpiHạn sử dụngres: ${props.expiryDate}</p>` : ''}
          </td></tr>
        </table>
      `
    
    case 'cart-reminder':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#fff7ed'}; border-radius: 0 8px 8px 0; ${styleStr}">
          <tr>
            <td style="padding: 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tr>
                  <td style="width: 52px; vertical-align: middle;">
                    ${renderIconInCircle(props.icon, 'cart-fill', '24', '48', props.iconBgColor || '#fed7aa', props.iconUrl, props.iconColor || '#f97316')}
                  </td>
                  <td style="vertical-align: top; padding-left: 16px;">
                    <h4 style="font-weight: bold; color: ${props.titleColor || '#1f2937'}; margin: 0 0 4px 0; font-size: 16px;">${props.children || 'Bạn còn sản phẩm trong giỏ hàng!'}</h4>
                    <p style="color: #57534e; font-size: 14px; margin: 0;">${props.subtitle || 'Hoàn tất đơn hàng ngay'}</p>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 16px;">
                <a href="${props.href || '#'}" style="display: inline-block; padding: 12px 24px; background: ${props.buttonBgColor || '#f97316'}; color: ${props.buttonTextColor || '#ffffff'}; text-decoration: none; border-radius: ${props.buttonRadius || '12px'}; font-weight: 600;">${props.buttonText || 'Xem giỏ hàng →'}</a>
              </div>
            </td>
          </tr>
        </table>
      `
    
    case 'order-summary': {
      const items = props.items || []
      const titleAlign = props.titleAlign || 'left'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      const alignStyle = titleAlign === 'center' ? 'margin:0 auto;' : titleAlign === 'right' ? 'margin-left:auto;' : ''
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr><td style="padding: 24px; background: ${props.bgColor || '#ffffff'}; border: 1px solid ${props.borderColor || '#e5e7eb'}; border-radius: 16px; ${styleStr}">
            <table style="${alignStyle} margin-bottom: 16px;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 44px; vertical-align: middle;">
                  ${renderIconInCircle(props.icon, 'clipboard-check', '20', '40', props.iconBgColor || '#dbeafe', props.iconUrl, props.iconColor || '#3b82f6')}
                </td>
                <td style="vertical-align: middle; padding-left: 12px;">
                  <h4 style="font-weight: ${titleFontWeight}; font-size: ${titleFontSize}; font-style: ${titleFontStyle}; margin: 0; color: ${props.titleColor || '#1f2937'};">${props.children || 'Đơn hàng'}</h4>
                </td>
              </tr>
            </table>
            <table style="width: 100%; margin-bottom: 16px;" cellpadding="0" cellspacing="0">
              ${items.map(item => `
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; border-bottom: 1px dashed #e5e7eb;">
                    <span style="display: inline-block; width: 24px; height: 24px; background: #f3f4f6; border-radius: 4px; text-align: center; line-height: 24px; font-size: 12px; font-weight: 500; margin-right: 8px;">${item.quantity}</span>
                    ${item.name}
                  </td>
                  <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 600; border-bottom: 1px dashed #e5e7eb;">${item.price}</td>
                </tr>
              `).join('')}
            </table>
            <table style="width: 100%; background: #f9fafb; border-radius: 12px;" cellpadding="16" cellspacing="0">
              <tr><td>
                <table style="width: 100%;" cellpadding="0" cellspacing="0">
                  <tr><td style="font-size: 14px; padding: 4px 0; color: #6b7280;">Tạm tính</td><td style="text-align: right; font-size: 14px; color: #6b7280;">${props.subtotal || '$0'}</td></tr>
                  <tr><td style="font-size: 14px; padding: 4px 0; color: #6b7280;">Phí vận chuyển</td><td style="text-align: right; font-size: 14px; color: #6b7280;">${props.shipping || '$0'}</td></tr>
                  <tr><td style="font-weight: bold; font-size: 18px; padding-top: 8px; border-top: 1px solid #e5e7eb;">Tổng cộng</td><td style="text-align: right; font-weight: bold; font-size: 18px; color: ${props.totalColor || '#2563eb'}; padding-top: 8px; border-top: 1px solid #e5e7eb;">${props.total || '$0'}</td></tr>
                </table>
              </td></tr>
            </table>
          </td></tr>
        </table>
      `
    }
    
    // Real Estate Elements
    case 'property-card': {
      const titleAlign = props.align || props.titleAlign || 'left'
      const titleFontSize = props.fontSize || props.titleFontSize || '22px'
      const titleFontWeight = props.fontWeight || props.titleFontWeight || '700'
      const titleFontStyle = props.fontStyle || props.titleFontStyle || 'normal'
      const cardId = `pc-${Date.now()}`
      
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; border-radius: 16px; overflow: hidden; ${styleStr}">
          <tr>
            <td style="padding: 0;">
              <img src="${props.image || 'https://placehold.co/600x300'}" alt="Property" style="width: 100%; height: auto; display: block;" />
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;background:linear-gradient(135deg, #b8860b 0%, #daa520 100%);">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tr>
                  <td><span style="font-size:20px;font-weight:bold;color:#fff;">${props.price || '0'}</span></td>
                  ${(props.discount || props.badge) ? `<td style="text-align:right;">
                    ${props.discount ? `<span style="display:inline-block;padding:4px 12px;background:linear-gradient(135deg, #ef4444 0%, #dc2626 100%);color:#fff;font-size:11px;font-weight:bold;border-radius:4px;margin-left:6px;">-${props.discount}%</span>` : ''}
                    ${props.badge ? `<span style="display:inline-block;padding:4px 12px;background:#10b981;color:#fff;font-size:11px;font-weight:bold;border-radius:4px;text-transform:uppercase;margin-left:6px;">${props.badge}</span>` : ''}
                  </td>` : ''}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <h3 style="font-weight: ${titleFontWeight}; font-size: ${titleFontSize}; font-style: ${titleFontStyle}; text-align: ${titleAlign}; margin: 0 0 12px 0; color: ${props.titleColor || '#1a1a2e'}; line-height: 1.3;">${props.children || 'Căn hộ cao cấp'}</h3>
              <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px; display: flex; align-items: center; gap: 6px;">${renderIcon(null, 'geo-alt-fill', '14', props.locationIconUrl)} ${props.location || 'Vị trí đắc địa'}</p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="border-top: 1px solid #e5e7eb;">
                <tr>
                  <td width="33%" style="padding: 16px 4px; vertical-align: middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="width: 40px; height: 40px; background: ${props.areaIconBgColor || '#fef3c7'}; border-radius: 50%; text-align: center; vertical-align: middle;">
                          <img src="${props.areaIconUrl || ICONS8_BASE + '/expand.png'}" alt="area" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;" />
                        </td>
                        <td style="padding-left: 8px; font-size: 14px; font-weight: 500; color: #4b5563; vertical-align: middle;">${props.area || '120m²'}</td>
                      </tr>
                    </table>
                  </td>
                  <td width="34%" style="padding: 16px 4px; vertical-align: middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="width: 40px; height: 40px; background: ${props.bedroomsIconBgColor || '#e0e7ff'}; border-radius: 50%; text-align: center; vertical-align: middle;">
                          <img src="${props.bedroomsIconUrl || ICONS8_BASE + '/open-door.png'}" alt="bedrooms" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;" />
                        </td>
                        <td style="padding-left: 8px; font-size: 14px; font-weight: 500; color: #4b5563; vertical-align: middle;">${props.bedrooms || 3} Phòng Ngủ</td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%" style="padding: 16px 4px; vertical-align: middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="width: 40px; height: 40px; background: ${props.bathroomsIconBgColor || '#cffafe'}; border-radius: 50%; text-align: center; vertical-align: middle;">
                          <img src="${props.bathroomsIconUrl || ICONS8_BASE + '/water.png'}" alt="bathrooms" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;" />
                        </td>
                        <td style="padding-left: 8px; font-size: 14px; font-weight: 500; color: #4b5563; vertical-align: middle;">${props.bathrooms || 2} Vệ Sinh</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `
    }
    
    case 'property-features': {
      const features = props.features || []
      const layout = props.layout || 'grid'
      const cols = props.columns || 2
      const colWidth = Math.floor(100 / cols)
      const titleAlign = props.titleAlign || 'left'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      // Use props.iconBgColor or default light green background
      const iconBgColor = props.iconBgColor || '#dcfce7'
      
      if (layout === 'grid' && cols > 1) {
        // Grid layout
        const rows = []
        for (let i = 0; i < features.length; i += cols) {
          const rowFeatures = features.slice(i, i + cols)
          rows.push(`<tr>${rowFeatures.map(f => `
            <td width="${colWidth}%" style="padding: 6px; vertical-align: top;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: #f9fafb; border-radius: 12px;">
                <tr>
                  <td style="width: 44px; padding: 12px 8px 12px 12px; vertical-align: middle;">
                    ${renderIconInCircle(props.icon, 'check-lg', '16', '32', iconBgColor, props.iconUrl, props.iconColor || '#22c55e')}
                  </td>
                  <td style="padding: 12px 12px 12px 0; vertical-align: middle;">
                    <span style="font-weight: 500; font-size: 14px; color: ${props.textColor || '#374151'};">${f}</span>
                  </td>
                </tr>
              </table>
            </td>
          `).join('')}</tr>`)
        }
        return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; ${styleStr}">
          <tr><td style="padding: 24px;">
            <p style="font-weight: ${titleFontWeight}; font-size: ${titleFontSize}; font-style: ${titleFontStyle}; text-align: ${titleAlign}; margin: 0 0 20px 0; color: ${props.titleColor || '#1f2937'};">${props.children || 'Tiện ích'}</p>
            <table style="width: 100%;" cellpadding="0" cellspacing="0">
              ${rows.join('')}
            </table>
          </td></tr>
        </table>
      `
      } else {
        // List layout
        return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; ${styleStr}">
          <tr><td style="padding: 24px;">
            <p style="font-weight: ${titleFontWeight}; font-size: ${titleFontSize}; font-style: ${titleFontStyle}; text-align: ${titleAlign}; margin: 0 0 20px 0; color: ${props.titleColor || '#1f2937'};">${props.children || 'Tiện ích'}</p>
            <table style="width: 100%;" cellpadding="0" cellspacing="0">
              ${features.map(f => `
                <tr>
                  <td style="padding: 6px; vertical-align: top;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: #f9fafb; border-radius: 12px;">
                      <tr>
                        <td style="width: 44px; padding: 12px 8px 12px 12px; vertical-align: middle;">
                          ${renderIconInCircle(props.icon, 'check-lg', '16', '32', iconBgColor, props.iconUrl, props.iconColor || '#22c55e')}
                        </td>
                        <td style="padding: 12px 12px 12px 0; vertical-align: middle;">
                          <span style="font-weight: 500; font-size: 14px; color: ${props.textColor || '#374151'};">${f}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              `).join('')}
            </table>
          </td></tr>
        </table>
      `
      }
    }
    
    case 'location-map': {
      const titleAlign = props.titleAlign || 'left'
      const alignStyle = titleAlign === 'center' ? 'margin:0 auto;' : titleAlign === 'right' ? 'margin-left:auto;' : ''
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; border-radius: ${props.borderRadius || '16px'}; ${styleStr}">
          <tr><td style="padding: 24px;">
            <table style="${alignStyle} margin-bottom: 16px;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 44px; vertical-align: middle;">
                  ${renderIconInCircle(props.icon, 'geo-alt-fill', '20', '40', props.iconBgColor || '#fee2e2', props.iconUrl, props.iconColor || '#ef4444')}
                </td>
                <td style="vertical-align: middle; padding-left: 12px;">
                  <p style="font-weight: bold; margin: 0 0 4px 0; color: ${props.titleColor || '#1f2937'};">${props.children || 'Vị trí'}</p>
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">${props.address || 'Address'}</p>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius: 12px; overflow: hidden;">
              <tr><td>
                <img src="${props.mapImage || 'https://placehold.co/600x300/e2e8f0/64748b?text=Map'}" alt="Map" style="width: 100%; height: 250px; object-fit: cover; display: block;" />
              </td></tr>
            </table>
          </td></tr>
        </table>
      `
    }
    
    // Recruitment Elements
    case 'job-listing':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; border-radius: ${props.borderRadius || '16px'}; border: 1px solid #e5e7eb; ${styleStr}">
          <tr><td style="padding: 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
              <tr>
                <td style="width: 52px; vertical-align: top;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr><td style="width: 48px; height: 48px; background: ${props.iconBgColor || props.buttonBgColor || '#2563eb'}; border-radius: 12px; text-align: center; vertical-align: middle;">
                    <img src="${props.iconUrl || ICONS8_BASE + '/briefcase.png'}" alt="job" style="width: 24px; height: 24px; display: inline-block; vertical-align: middle;" />
                  </td></tr></table>
                </td>
                <td style="vertical-align: middle; padding-left: 12px;">
                  <h3 style="font-weight: bold; font-size: 18px; margin: 0 0 4px 0; color: ${props.titleColor || '#1f2937'};">${props.children || 'Vị trí tuyển dụng'}</h3>
                  <p style="color: ${props.companyColor || '#2563eb'}; font-weight: 600; font-size: 14px; margin: 0;">${props.company || 'Tên công ty'}</p>
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
              <tr>
                <td style="padding-right: 6px; padding-bottom: 6px;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="background: #f3f4f6; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; color: #374151;">${props.location || 'Địa điểm'}</td></tr></table></td>
                <td style="padding-right: 6px; padding-bottom: 6px;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="background: #dbeafe; color: #1d4ed8; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;">${props.type || 'Full-time'}</td></tr></table></td>
                <td style="padding-bottom: 6px;"><table cellpadding="0" cellspacing="0" border="0"><tr><td style="background: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;">${props.salary || 'Thương lượng'}</td></tr></table></td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td style="background: ${props.buttonBgColor || '#2563eb'}; border-radius: 8px; text-align: center;"><a href="${props.href || '#'}" style="display: block; padding: 12px 20px; color: ${props.buttonTextColor || '#ffffff'}; text-decoration: none; font-weight: 600;">${props.buttonText || 'Ứng tuyển ngay'} →</a></td></tr>
            </table>
            ${props.deadline ? `<p style="text-align: center; font-size: 12px; color: #9ca3af; margin: 12px 0 0 0;">Hạn nộp: ${props.deadline}</p>` : ''}
          </td></tr>
        </table>
      `
    
    case 'benefits-list': {
      const benefits = props.benefits || []
      const layout = props.layout || 'list'
      const cols = props.columns || 1
      const colWidth = Math.floor(100 / cols)
      const titleAlign = props.titleAlign || 'left'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      // Use props.iconBgColor or default light green background
      const iconBgColor = props.iconBgColor || '#dcfce7'
      
      if (layout === 'grid' && cols > 1) {
        // Grid layout
        const rows = []
        for (let i = 0; i < benefits.length; i += cols) {
          const rowBenefits = benefits.slice(i, i + cols)
          rows.push(`<tr>${rowBenefits.map(b => `
            <td width="${colWidth}%" style="padding: 6px; vertical-align: top;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: #f9fafb; border-radius: 12px;">
                <tr>
                  <td style="width: 44px; padding: 12px 8px 12px 12px; vertical-align: middle;">
                    ${renderIconInCircle(props.icon, 'check-lg', '16', '32', iconBgColor, props.iconUrl, props.iconColor || '#22c55e')}
                  </td>
                  <td style="padding: 12px 12px 12px 0; vertical-align: middle;">
                    <span style="font-weight: 500; color: ${props.textColor || '#374151'};">${b}</span>
                  </td>
                </tr>
              </table>
            </td>
          `).join('')}</tr>`)
        }
        return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; ${styleStr}">
          <tr><td style="padding: 24px;">
            <p style="font-weight: ${titleFontWeight}; font-size: ${titleFontSize}; font-style: ${titleFontStyle}; text-align: ${titleAlign}; margin: 0 0 20px 0; color: ${props.titleColor || '#1f2937'};">${props.children || 'Phúc lợi'}</p>
            <table style="width: 100%;" cellpadding="0" cellspacing="0">
              ${rows.join('')}
            </table>
          </td></tr>
        </table>
      `
      } else {
        // List layout
        return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; ${styleStr}">
          <tr><td style="padding: 24px;">
            <p style="font-weight: ${titleFontWeight}; font-size: ${titleFontSize}; font-style: ${titleFontStyle}; text-align: ${titleAlign}; margin: 0 0 20px 0; color: ${props.titleColor || '#1f2937'};">${props.children || 'Phúc lợi'}</p>
            <table style="width: 100%;" cellpadding="0" cellspacing="0">
              ${benefits.map(b => `
                <tr>
                  <td style="padding: 6px; vertical-align: top;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: #f9fafb; border-radius: 12px;">
                      <tr>
                        <td style="width: 44px; padding: 12px 8px 12px 12px; vertical-align: middle;">
                          ${renderIconInCircle(props.icon, 'check-lg', '16', '32', iconBgColor, props.iconUrl, props.iconColor || '#22c55e')}
                        </td>
                        <td style="padding: 12px 12px 12px 0; vertical-align: middle;">
                          <span style="font-weight: 500; color: ${props.textColor || '#374151'};">${b}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              `).join('')}
            </table>
          </td></tr>
        </table>
      `
      }
    }
    
    // Real Estate: Agent Contact
    case 'agent-contact':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: #eff6ff; border-radius: 12px; ${styleStr}">
          <tr><td style="padding: 16px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                ${props.avatar ? `<td style="width: 60px; vertical-align: top;"><img src="${props.avatar}" alt="Agent" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" /></td>` : ''}
                <td style="vertical-align: top; ${props.avatar ? 'padding-left: 12px;' : ''}">
                  <p style="font-weight: 600; margin: 0 0 4px 0; color: #1f2937;">${props.name || 'Agent Name'}</p>
                  ${props.title ? `<p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">${props.title}</p>` : ''}
                  ${props.phone ? `<p style="color: #2563eb; font-size: 14px; margin: 0 0 4px 0;">📞 ${props.phone}</p>` : ''}
                  ${props.email ? `<p style="color: #2563eb; font-size: 14px; margin: 0;">✉️ ${props.email}</p>` : ''}
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      `
    
    // Recruitment: Company Intro
    case 'company-intro':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#f9fafb'}; border-radius: 12px; text-align: center; ${styleStr}">
          <tr><td style="padding: 24px;">
            ${props.logo ? `<img src="${props.logo}" alt="Company" style="max-height: 60px; margin-bottom: 12px;" />` : ''}
            <h4 style="font-weight: bold; margin: 0 0 8px 0; color: ${props.titleColor || '#1f2937'};">${props.children || 'Company Name'}</h4>
            ${props.description ? `<p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">${props.description}</p>` : ''}
          </td></tr>
        </table>
      `
    
    // Recruitment: Apply Button
    case 'apply-button':
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr><td style="padding: 16px; text-align: center;">
            <a href="${props.href || '#'}" style="display: inline-block; padding: 14px 32px; background: ${props.bgColor || '#2563eb'}; color: ${props.textColor || '#ffffff'}; text-decoration: none; border-radius: ${props.borderRadius || '8px'}; font-weight: 600; font-size: 16px;">${props.children || 'Apply Now'} →</a>
          </td></tr>
        </table>
      `

    // Banking: Transaction Card
    case 'transaction-card': {
      const statusColors = {
        success: { bg: '#dcfce7', text: '#166534', label: 'Thành công' },
        pending: { bg: '#fef3c7', text: '#92400e', label: 'Đang xử lý' },
        failed: { bg: '#fee2e2', text: '#991b1b', label: 'Thất bại' }
      }
      const status = statusColors[props.status || 'success']
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#f0fdf4'}; border-radius: 12px; ${styleStr}">
          <tr><td style="padding: 20px;">
            <!-- Header Section: Icon + Title + Status -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 40px;">
                  <div style="width: 40px; height: 40px; background: ${props.iconBgColor || '#dcfce7'}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    ${props.iconUrl ? `<img src="${props.iconUrl}" alt="Icon" style="width: 20px; height: 20px;" />` : `<div style="width: 20px; height: 20px; background: ${props.iconColor || '#22c55e'}; border-radius: 4px;"></div>`}
                  </div>
                </td>
                <td style="padding-left: 12px;">
                  <p style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '16px'}; font-style: ${props.titleFontStyle || 'normal'}; color: ${props.titleColor || '#15803d'}; margin: 0 0 4px 0; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; text-align: ${props.titleAlign || 'left'};">${props.children || 'Giao dịch thành công'}</p>
                  <p style="font-size: ${props.dateFontSize || '12px'}; font-weight: ${props.dateFontWeight || 'normal'}; color: ${props.dateColor || '#6b7280'}; margin: 0; font-family: ${props.dateFontFamily || 'Arial, sans-serif'}; text-align: ${props.dateAlign || 'left'};">${props.date || '31/12/2025 14:30'}</p>
                </td>
                <td align="right">
                  <span style="background: ${status.bg}; color: ${status.text}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${status.label}</span>
                </td>
              </tr>
            </table>
            
            <!-- Amount Section with borders -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; margin: 16px 0;">
              <tr><td style="padding: 16px 0; text-align: center;">
                <p style="font-weight: 700; font-size: 18px; color: ${props.amountColor || '#16a34a'}; margin: 0; font-family: arial,helvetica,sans-serif;">${props.amount || '5,000,000đ'}</p>
              </td></tr>
            </table>
            
            <!-- Details Section -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: ${props.labelColor || '#6b7280'}; font-family: arial,helvetica,sans-serif;">Mã GD:</td>
                <td style="padding: 4px 0;" align="right"><span style="font-weight: 500; color: ${props.detailsColor || '#374151'}; font-family: arial,helvetica,sans-serif;">${props.transactionId || 'TXN123456789'}</span></td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: ${props.labelColor || '#6b7280'}; font-family: arial,helvetica,sans-serif;">Từ TK:</td>
                <td style="padding: 4px 0;" align="right"><span style="color: ${props.detailsColor || '#374151'}; font-family: arial,helvetica,sans-serif;">${props.fromAccount || '**** 1234'}</span></td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 14px; color: ${props.labelColor || '#6b7280'}; font-family: arial,helvetica,sans-serif;">Đến:</td>
                <td style="padding: 4px 0;" align="right"><span style="color: ${props.detailsColor || '#374151'}; font-family: arial,helvetica,sans-serif;">${props.toName || 'Nguyễn Văn A'} (${props.toAccount || '**** 5678'})</span></td>
              </tr>
            </table>
          </td></tr>
        </table>
      `
    }


    // Banking: Credit Card Info
    case 'credit-card-info': {
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgGradient || 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'}; border-radius: 16px; ${styleStr}">
          <tr><td style="padding: 20px;">
            <!-- Header: Title + Card Type -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td><p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">${props.children || 'Thẻ tín dụng'}</p></td>
                <td align="right"><span style="color: #ffffff; font-weight: 600; font-size: 18px; text-transform: uppercase;">${props.cardType || 'VISA'}</span></td>
              </tr>
            </table>
            
            <!-- Card Number -->
            <p style="font-family: monospace; font-size: 20px; letter-spacing: 2px; color: #ffffff; margin: 16px 0;">${props.cardNumber || '**** **** **** 9876'}</p>
            
            <!-- Card Holder + Expiry -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width: 50%;">
                  <p style="color: rgba(255,255,255,0.6); font-size: 10px; margin: 0;">CHỦ THẺ</p>
                  <p style="color: #ffffff; font-size: 14px; margin: 4px 0 0 0;">${props.cardHolder || 'NGUYEN VAN A'}</p>
                </td>
                <td style="width: 50%;" align="right">
                  <p style="color: rgba(255,255,255,0.6); font-size: 10px; margin: 0;">HẾT HẠN</p>
                  <p style="color: #ffffff; font-size: 14px; margin: 4px 0 0 0;">${props.expiryDate || '12/28'}</p>
                </td>
              </tr>
            </table>
            
            <!-- Usage Info (optional) -->
            ${props.showUsage ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid rgba(255,255,255,0.2); margin-top: 16px; padding-top: 16px;">
                <tr>
                  <td style="padding: 2px 0;"><span style="color: rgba(255,255,255,0.7); font-size: 14px;">Hạn mức:</span></td>
                  <td style="padding: 2px 0;" align="right"><span style="color: #ffffff;">${props.creditLimit || '100,000,000đ'}</span></td>
                </tr>
                <tr>
                  <td style="padding: 2px 0;"><span style="color: rgba(255,255,255,0.7); font-size: 14px;">Đã dùng:</span></td>
                  <td style="padding: 2px 0;" align="right"><span style="color: #ffffff;">${props.usedAmount || '35,000,000đ'}</span></td>
                </tr>
              </table>
            ` : ''}
          </td></tr>
        </table>
      `
    }

    // Gaming/Course: Course Card
    case 'course-card': {
      // Generate dynamic avatar from instructor name
      const generateAvatarFromName = (name) => {
        if (!name) return 'https://placehold.co/32x32/e2e8f0/64748b?text=GV'
        
        const words = name.trim().split(/\s+/)
        let initials = ''
        
        if (words.length >= 2) {
          initials = words[0][0] + words[1][0]
        } else if (words.length === 1 && words[0].length >= 2) {
          initials = words[0].substring(0, 2)
        } else {
          initials = words[0][0] + (words[1] ? words[1][0] : '')
        }
        
        initials = initials.toUpperCase()
        
        const colors = [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
          '#DDA0DD', '#98D8C8', '#FFD93D', '#6BCB77', '#FF6B9D',
          '#C44569', '#F8B195', '#F67280', '#355C7D', '#6C5CE7'
        ]
        
        let hash = 0
        for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }
        const colorIndex = Math.abs(hash) % colors.length
        const backgroundColor = colors[colorIndex]
        
        return `https://placehold.co/32x32/${backgroundColor.replace('#', '')}/ffffff?text=${encodeURIComponent(initials)}`
      }
      
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid #e5e7eb; ${styleStr}">
          ${props.thumbnail ? `<tr><td><img src="${props.thumbnail}" alt="Course" style="width: 100%; height: 160px; object-fit: cover; border-radius: 12px 12px 0 0;" /></td></tr>` : ''}
          <tr><td style="padding: 16px;">
            <!-- Title -->
            <h3 style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '18px'}; font-style: ${props.titleFontStyle || 'normal'}; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; color: ${props.titleColor || '#1f2937'}; margin: 0 0 12px 0; text-align: ${props.titleAlign || 'left'};">${props.children || 'Khóa học Python'}</h3>
            
            <!-- Instructor with avatar -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
              <tr>
                <td style="width: 32px;">
                  <img src="${props.instructorAvatar || generateAvatarFromName(props.instructor || 'Giảng viên')}" alt="Instructor" style="width: 32px; height: 32px; border-radius: 50%;" />
                </td>
                <td style="padding-left: 8px;">
                  <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}">${props.instructor || 'Giảng viên'}</span>
                </td>
              </tr>
            </table>
            
            <!-- Stats: Duration + Lessons + Students -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
              <tr>
                <td style="padding-right: 16px;">
                  <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}"><img src="${props.durationIconUrl || 'https://img.icons8.com/ios/100/alarm-clock--v1.png'}" style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;" /> ${props.duration || '20 giờ'}</span>
                </td>
                <td style="padding-right: 16px;">
                  <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}"><img src="${props.lessonsIconUrl || 'https://img.icons8.com/carbon-copy/100/book.png'}" style="width: 16px; height: 16px; margin-right: 4px; vertical-align: middle;" /> ${props.lessons || 45} bài</span>
                </td>
              </tr>
            </table>
            
            <!-- Rating (optional) -->
            ${props.showRating ? `
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                <tr>
                  ${Array.from({length: 5}, (_, i) => 
                    `<td style="padding: 0 2px 0 0;"><img src="${props.starIconUrl || 'https://img.icons8.com/emoji/48/star-emoji.png'}" style="width: 14px; height: 14px; vertical-align: middle; filter: ${i < Math.floor(props.rating || 4.8) ? 'none' : 'grayscale(100%)'}; opacity: ${i < Math.floor(props.rating || 4.8) ? '1' : '0.3'};" /></td>`
                  ).join('')}
                  <td style="padding-left: 4px;"><span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}">${props.rating || 4.8}</span></td>
                </tr>
              </table>
            ` : ''}
            
            <!-- Price -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-weight: ${props.priceFontWeight || '700'}; font-size: ${props.priceFontSize || '20px'}; font-style: ${props.priceFontStyle || 'normal'}; font-family: ${props.priceFontFamily || 'Arial, sans-serif'}; color: ${props.priceColor || '#dc2626'}; text-align: ${props.priceAlign || 'left'}">${props.price || '799,000đ'}</span>
                  ${props.originalPrice ? `<span style="color: #9ca3af; text-decoration: line-through; font-size: 14px; margin-left: 8px;">${props.originalPrice}</span>` : ''}
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      `
    }

    // Gaming/Course: Game Item Card
    case 'game-item-card': {
      const rarityColors = { common: '#9ca3af', rare: '#3b82f6', epic: '#8b5cf6', legendary: '#f59e0b' }
      const rarityLabels = { common: 'Thường', rare: 'Hiếm', epic: 'Sử Thi', legendary: 'Huyền Thoại' }
      const rarity = props.rarity || 'rare'
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: linear-gradient(135deg, ${props.bgColor || '#1e1b4b'} 0%, ${props.bgColorEnd || '#312e81'} 100%); border-radius: 16px; border: 2px solid ${rarityColors[rarity]}; ${styleStr}">
          <tr><td style="padding: 20px; text-align: center;">
            ${props.image ? `<img src="${props.image}" alt="Item" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 16px;" />` : `<div style="width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 48px;">💎</span></div>`}
            <span style="background: ${rarityColors[rarity]}20; color: ${rarityColors[rarity]}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${rarityLabels[rarity]}</span>
            <h3 style="font-weight: 700; font-size: 18px; color: #ffffff; margin: 12px 0 8px 0;">${props.children || 'Kiếm Rồng Lửa'}</h3>
            <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0 0 16px 0;">${props.description || '+50 Sát thương, +20% Chí mạng'}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px;">
              <tr>
                <td style="padding: 8px;"><span style="color: rgba(255,255,255,0.6); font-size: 12px;">Sức mạnh</span><br/><span style="color: #ffffff; font-weight: 600;">${props.power || '+150'}</span></td>
                <td style="padding: 8px;"><span style="color: rgba(255,255,255,0.6); font-size: 12px;">Cấp độ</span><br/><span style="color: #ffffff; font-weight: 600;">${props.level || 'Lv.50'}</span></td>
                <td style="padding: 8px;"><span style="color: rgba(255,255,255,0.6); font-size: 12px;">Giá</span><br/><span style="color: #fbbf24; font-weight: 600;">${props.price || '500 💎'}</span></td>
              </tr>
            </table>
          </td></tr>
        </table>
      `
    }

    // Gaming/Course: Achievement Badge
    case 'achievement-badge': {
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#fffbeb'}; border-radius: 12px; border: 2px solid ${props.borderColor || '#f59e0b'}; ${styleStr}">
          <tr><td style="padding: 20px; text-align: center;">
            <!-- Icon Circle -->
            <div style="width: 64px; height: 64px; background: ${props.iconBgColor || '#fde68a'}; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 28px; color: ${props.iconColor || '#f59e0b'};">${props.icon || '🏆'}</span>
            </div>
            
            <!-- Title -->
            <h3 style="font-weight: 700; font-size: 18px; color: ${props.titleColor || '#78350f'}; margin: 0 0 4px 0;">${props.children || 'Master Developer'}</h3>
            
            <!-- Description -->
            <p style="color: ${props.textColor || '#92400e'}; font-size: 14px; margin: 0 0 12px 0;">${props.description || 'Hoàn thành 100 bài tập'}</p>
            
            <!-- Points (optional) -->
            ${props.showPoints ? `
              <div style="display: inline-flex; align-items: center; gap: 4px; background: ${props.borderColor || '#f59e0b'}; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                <span style="font-size: 12px;">⭐</span> ${props.points || 500} điểm
              </div>
            ` : ''}
            
            <!-- Date -->
            <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">${props.earnedDate || '31/12/2025'}</p>
          </td></tr>
        </table>
      `
    }

    // Gaming/Course: Progress Bar
    case 'progress-bar': {
      const currentValue = props.currentValue || 75
      const maxValue = props.maxValue || 100
      const percent = Math.round((currentValue / maxValue) * 100)
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: transparent; ${styleStr}">
          <tr><td style="padding: 16px;">
            <!-- Header: Label + Percentage (optional) -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
              <tr>
                <td><span style="font-weight: 500; color: ${props.titleColor || '#1f2937'}; font-size: 14px;">${props.label || 'Hoàn thành khóa học'}</span></td>
                ${props.showPercentage ? `<td align="right"><span style="font-weight: 700; color: ${props.color || '#3b82f6'}; font-size: 14px;">${percent}%</span></td>` : ''}
              </tr>
            </table>
            
            <!-- Progress Bar -->
            <div style="background: ${props.bgColor || '#e5e7eb'}; border-radius: 9999px; height: ${props.height || '12px'}; overflow: hidden;">
              <div style="background: ${props.color || '#3b82f6'}; width: ${percent}%; height: 100%; border-radius: 9999px;"></div>
            </div>
            
            <!-- Sublabel (optional) -->
            ${props.sublabel ? `<p style="color: #6b7280; font-size: 12px; margin: 8px 0 0 0;">${props.sublabel}</p>` : ''}
          </td></tr>
        </table>
      `
    }

    // F&B/Hotel: Menu Item
    case 'menu-item': {
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; ${styleStr}">
          <tr>
            ${props.image ? `<td style="width: 128px; vertical-align: top;"><img src="${props.image}" alt="Food" style="width: 128px; height: 128px; object-fit: cover;" /></td>` : ''}
            <td style="padding: 16px; vertical-align: top;">
              <!-- Title + Price -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 4px;">
                <tr>
                  <td style="vertical-align: top;">
                    <h3 style="font-weight: 600; font-size: 16px; color: ${props.titleColor || '#1f2937'}; margin: 0;">${props.children || 'Phở Bò Đặc Biệt'}</h3>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <span style="font-weight: 700; font-size: 16px; color: ${props.priceColor || '#dc2626'};">${props.price || '85,000đ'}</span>
                  </td>
                </tr>
              </table>
              
              <!-- Description -->
              <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0; line-height: 1.4;">${props.description || 'Phở bò truyền thống'}</p>
              
              <!-- Tags (optional) -->
              ${props.showTags && props.tags ? `
                <table cellpadding="0" cellspacing="0" style="margin-top: 8px;">
                  <tr>
                    ${props.tags.map(tag => 
                      `<td style="padding: 0 4px 0 0;"><span style="background: #fed7aa; color: #ea580c; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${tag}</span></td>`
                    ).join('')}
                  </tr>
                </table>
              ` : ''}
            </td>
          </tr>
        </table>
      `
    }

    // F&B/Hotel: Room Card
    // Matches EmailPreview.vue:719-746 (Canvas rendering)
    case 'room-card': {
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid ${props.borderColor || '#e5e7eb'}; overflow: hidden; ${styleStr}">
          ${props.image ? `<tr><td><img src="${props.image}" alt="Room" style="width: 100%; height: 200px; object-fit: cover; display: block;" /></td></tr>` : ''}
          <tr><td style="padding: 20px;">
            <!-- Title and Availability Badge -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
              <tr>
                <td style="width: 70%;">
                  <h3 style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '18px'}; font-style: ${props.titleFontStyle || 'normal'}; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; color: ${props.titleColor || '#1f2937'}; margin: 0; text-align: ${props.titleAlign || 'left'};">${props.children || 'Phòng Deluxe Ocean View'}</h3>
                </td>
                <td align="right" style="width: 30%;">
                  <span style="background: ${props.available ? '#dcfce7' : '#fee2e2'}; color: ${props.available ? '#166534' : '#991b1b'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; white-space: nowrap;">${props.available ? 'Còn phòng' : 'Hết phòng'}</span>
                </td>
              </tr>
            </table>

            <!-- Room Details (capacity, size, bed) - simulating flex gap with table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
              <tr>
                <td style="padding-right: 16px; font-size: ${props.detailsFontSize || '14px'}; color: ${props.detailsColor || '#6b7280'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}; white-space: nowrap;">
                  <img src="${props.capacityIconUrl || 'https://img.icons8.com/ios/100/users.png'}" style="width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;" alt="" />${props.capacity || '2'} người
                </td>
                <td style="padding-right: 16px; font-size: ${props.detailsFontSize || '14px'}; color: ${props.detailsColor || '#6b7280'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}; white-space: nowrap;">
                  <img src="${props.sizeIconUrl || 'https://img.icons8.com/ios/100/resize.png'}" style="width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;" alt="" />${props.size || '45'}m²
                </td>
                <td style="font-size: ${props.detailsFontSize || '14px'}; color: ${props.detailsColor || '#6b7280'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}; white-space: nowrap;">
                  <img src="${props.bedIconUrl || 'https://img.icons8.com/ios/100/bed.png'}" style="width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;" alt="" />${props.bedType || 'King bed'}
                </td>
                <td style="width: 1%;"></td>
              </tr>
            </table>

            <!-- Amenities -->
            <p style="color: ${props.amenitiesColor || '#6b7280'}; font-size: ${props.amenitiesFontSize || '14px'}; font-weight: ${props.amenitiesFontWeight || 'normal'}; font-style: ${props.amenitiesFontStyle || 'normal'}; font-family: ${props.amenitiesFontFamily || 'Arial, sans-serif'}; margin: 0 0 16px 0; text-align: ${props.amenitiesAlign || 'left'};">✓ ${props.amenities || 'WiFi, Minibar, Bồn tắm, Ban công'}</p>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 16px 0;">
              <tr><td style="border-top: 1px solid #e5e7eb; line-height: 0; font-size: 0;">&nbsp;</td></tr>
            </table>

            <!-- Price and Book Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align: middle;">
                  ${props.originalPrice ? `<span style="color: #9ca3af; font-size: ${props.originalPriceFontSize || '14px'}; text-decoration: line-through; margin-right: 8px; display: inline-block;">${props.originalPrice}</span><br/>` : ''}
                  <span style="font-weight: ${props.priceFontWeight || '700'}; font-size: ${props.priceFontSize || '24px'}; font-style: ${props.priceFontStyle || 'normal'}; font-family: ${props.priceFontFamily || 'Arial, sans-serif'}; color: ${props.priceColor || '#2563eb'}; text-align: ${props.priceAlign || 'left'};">${props.price || '2,500,000đ'}</span><span style="color: ${props.priceUnitColor || '#6b7280'}; font-size: ${props.priceUnitFontSize || '14px'};">/${props.priceUnit || 'đêm'}</span>
                </td>
                <td align="right" style="vertical-align: middle;">
                  <a href="${props.buttonLink || '#'}" class="link-preserve" style="display: inline-block; background: ${props.buttonBgColor || '#2563eb'}; color: ${props.buttonTextColor || '#ffffff'}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; white-space: nowrap;">Đặt ngay</a>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      `
    }

    // F&B/Hotel: Booking Summary
    // Matches EmailPreview.vue:749-782 (Canvas rendering)
    case 'booking-summary': {
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#f0f9ff'}; border-radius: 12px; border: 1px solid ${props.borderColor || '#bae6fd'}; ${styleStr}">
          <tr><td style="padding: 24px;">
            <!-- Title and Status Badge -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
              <tr>
                <td style="width: 70%;">
                  <h3 style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '18px'}; font-style: ${props.titleFontStyle || 'normal'}; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; color: ${props.titleColor || '#0369a1'}; margin: 0; text-align: ${props.titleAlign || 'left'};">${props.children || 'Xác nhận đặt phòng'}</h3>
                </td>
                <td align="right" style="width: 30%;">
                  <span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; white-space: nowrap;">${props.status || 'Đã xác nhận'}</span>
                </td>
              </tr>
            </table>

            <!-- Confirmation Code -->
            <p style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; margin: 0 0 20px 0; text-align: ${props.detailsAlign || 'left'};">Mã đặt phòng: <strong style="color: #1f2937;">${props.confirmationCode || 'BK2025011234'}</strong></p>

            <!-- Booking Details Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; margin-bottom: 20px;">
              <tr><td style="padding: 16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <!-- Property Name -->
                  <tr><td style="padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}; display: block;">Khách sạn:</span>
                    <span style="font-weight: 600; color: #1f2937; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; display: block; margin-top: 4px;">${props.propertyName || 'Grand Hotel Saigon'}</span>
                  </td></tr>

                  <!-- Room Type -->
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}; display: block;">Loại phòng:</span>
                    <span style="font-weight: 600; color: #1f2937; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; display: block; margin-top: 4px;">${props.roomType || 'Deluxe Ocean View'}</span>
                  </td></tr>

                  <!-- Check-in & Check-out -->
                  <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 45%; vertical-align: top;">
                          <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}; display: block;">Nhận phòng:</span>
                          <span style="font-weight: 600; color: #1f2937; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; display: block; margin-top: 4px;">${props.checkInDate || '15/01/2025'}</span>
                        </td>
                        <td style="width: 10%; text-align: center; vertical-align: middle; font-size: 16px; color: #9ca3af;">→</td>
                        <td style="width: 45%; vertical-align: top;">
                          <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: right; display: block;">Trả phòng:</span>
                          <span style="font-weight: 600; color: #1f2937; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; display: block; margin-top: 4px; text-align: right;">${props.checkOutDate || '17/01/2025'}</span>
                        </td>
                      </tr>
                    </table>
                  </td></tr>

                  <!-- Number of Guests -->
                  <tr><td style="padding-top: 8px;">
                    <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'}; display: block;">Số khách:</span>
                    <span style="font-weight: 600; color: #1f2937; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; display: block; margin-top: 4px;">${props.guests || '2 người lớn'}</span>
                  </td></tr>
                </table>
              </td></tr>
            </table>

            <!-- Total Price -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align: middle;">
                  <span style="font-size: ${props.priceFontSize || '16px'}; color: ${props.priceColor || '#374151'}; font-weight: ${props.priceFontWeight || 'normal'}; font-style: ${props.priceFontStyle || 'normal'}; font-family: ${props.priceFontFamily || 'Arial, sans-serif'}; text-align: ${props.priceAlign || 'left'};">Tổng thanh toán:</span>
                </td>
                <td align="right" style="vertical-align: middle;">
                  <span style="font-weight: ${props.totalFontWeight || '700'}; font-size: ${props.totalFontSize || '24px'}; font-style: ${props.totalFontStyle || 'normal'}; font-family: ${props.totalFontFamily || 'Arial, sans-serif'}; color: ${props.totalColor || '#0369a1'}; text-align: right;">${props.total || '5,000,000đ'}</span>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      `
    }

    // F&B/Hotel: Rating Review
    // Matches EmailPreview.vue:785-806 (Canvas rendering)
    case 'rating-review': {
      const rating = props.rating || 5
      // Generate star icons (matching Canvas rendering with image icons)
      const starIcons = Array.from({length: 5}, (_, i) => {
        const isFilledStar = i < Math.floor(rating)
        return `<img src="${props.starIconUrl || 'https://img.icons8.com/emoji/48/star-emoji.png'}" alt="star" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 2px; filter: ${isFilledStar ? 'none' : 'grayscale(100%)'}; opacity: ${isFilledStar ? '1' : '0.3'};" />`
      }).join('')

      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid ${props.borderColor || '#e5e7eb'}; ${styleStr}">
          <tr><td style="padding: 20px;">
            <!-- Reviewer Info (Avatar + Name/Stars/Date) -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
              <tr>
                <td style="width: 60px; vertical-align: top;">
                  ${props.reviewerAvatar ? `<img src="${props.reviewerAvatar}" alt="Avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; display: block;" />` : `<table cellpadding="0" cellspacing="0" border="0" style="width: 48px; height: 48px; background: #e5e7eb; border-radius: 50%;"><tr><td align="center" valign="middle" style="font-size: 20px; line-height: 48px;">👤</td></tr></table>`}
                </td>
                <td style="vertical-align: top;">
                  <!-- Reviewer Name -->
                  <p style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '14px'}; font-style: ${props.titleFontStyle || 'normal'}; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; color: ${props.titleColor || '#1f2937'}; margin: 0; text-align: ${props.titleAlign || 'left'};">${props.reviewerName || 'Nguyễn Văn A'}</p>

                  <!-- Star Rating -->
                  <p style="color: ${props.starColor || '#f59e0b'}; font-size: 14px; margin: 4px 0; line-height: 1;">
                    ${starIcons}
                  </p>

                  <!-- Review Date -->
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">${props.reviewDate || '15/01/2025'}</p>
                </td>
              </tr>
            </table>

            <!-- Review Title -->
            <h4 style="font-weight: ${props.reviewTitleFontWeight || '600'}; font-size: ${props.reviewTitleFontSize || '16px'}; font-style: ${props.reviewTitleFontStyle || 'normal'}; font-family: ${props.reviewTitleFontFamily || 'Arial, sans-serif'}; color: ${props.reviewTitleColor || '#1f2937'}; margin: 0 0 8px 0; text-align: ${props.reviewTitleAlign || 'left'};">${props.title || 'Trải nghiệm tuyệt vời!'}</h4>

            <!-- Review Content -->
            <p style="color: ${props.contentColor || '#374151'}; font-size: ${props.contentFontSize || '14px'}; font-weight: ${props.contentFontWeight || 'normal'}; font-style: ${props.contentFontStyle || 'normal'}; font-family: ${props.contentFontFamily || 'Arial, sans-serif'}; margin: 0; line-height: 1.5; text-align: ${props.contentAlign || 'left'};">${props.content || 'Phòng sạch sẽ, view đẹp, nhân viên thân thiện. Chắc chắn sẽ quay trở lại.'}</p>

            <!-- Helpful Count (if provided) -->
            ${props.helpful ? `
              <p style="color: #9ca3af; font-size: 12px; margin: 12px 0 0 0;">
                <img src="https://img.icons8.com/ios/50/thumb-up.png" style="width: 12px; height: 12px; margin-right: 4px; vertical-align: middle;" alt="helpful" />${props.helpful} người thấy hữu ích
              </p>
            ` : ''}
          </td></tr>
        </table>
      `
    }

    default:
      // Fallback for other custom elements
      return `<div style="padding: 10px; ${styleStr}">${props.children || ''}</div>`
  }
}

// Render Unlayer row wrapper
const renderUnlayerRow = (element) => {
  const contentWidth = globalSettings.value.contentWidth || 700
  const globalBgColor = globalSettings.value.backgroundColor || '#ffffff'
  const style = element.style || {}
  const padding = style.padding || '0px'
  const borderRadius = style.borderRadius || '0px'
  
  return `
<div class="u-row-container" style="background-color: transparent;">
  <div class="u-row" style="width: 100%;margin: 0 auto;min-width: 320px;max-width: ${contentWidth}px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: ${padding};background-color: transparent;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:${contentWidth}px;"><tr style="background-color: transparent;"><![endif]-->
      
<!--[if (mso)|(IE)]><td align="center" width="${contentWidth}" style="width: ${contentWidth}px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: ${borderRadius};-webkit-border-radius: ${borderRadius}; -moz-border-radius: ${borderRadius};" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 100%;min-width: 320px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;border-radius: ${borderRadius};-webkit-border-radius: ${borderRadius}; -moz-border-radius: ${borderRadius};">
  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: ${borderRadius};-webkit-border-radius: ${borderRadius}; -moz-border-radius: ${borderRadius};"><!--<![endif]-->
  
${renderElementContent(element)}

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>`
}

// Render element content
const renderElementContent = (element) => {
  const style = element.style || {}
  const props = element.props || {}
  const contentWidth = globalSettings.value.contentWidth || 700
  
  // Handle Columns Layout (columns2, columns3, columns4)
  if (['columns2', 'columns3', 'columns4'].includes(element.type)) {
    const colCount = parseInt(element.type.replace('columns', ''))
    const colWidth = Math.floor(contentWidth / colCount)
    const colWidthPercent = Math.floor(100 / colCount)
    
    let html = `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>`
    
    if (element.children && Array.isArray(element.children)) {
      element.children.forEach((col, index) => {
        html += `
      <td width="${colWidthPercent}%" style="vertical-align: top; padding: 0px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">`
        
        if (col && Array.isArray(col) && col.length > 0) {
          col.forEach(child => {
            html += `
          <tr>
            <td>${renderNestedElement(child, contentWidth)}</td>
          </tr>`
          })
        }
        
        html += `
        </table>
      </td>`
      })
    }
    
    html += `
    </tr>
  </tbody>
</table>`
    return html
  }
  
  // Handle Row Layout (row2, row3, row4)
  if (['row2', 'row3', 'row4'].includes(element.type)) {
    let html = `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>`
    
    if (element.children && Array.isArray(element.children)) {
      element.children.forEach((row, index) => {
        if (row && Array.isArray(row) && row.length > 0) {
          row.forEach(child => {
            html += `
    <tr>
      <td style="padding: 0px;">${renderNestedElement(child, contentWidth)}</td>
    </tr>`
          })
        }
      })
    }
    
    html += `
  </tbody>
</table>`
    return html
  }
  
  // Handle Custom Elements FIRST - before basic elements
  if (['header', 'footer', 'cta-block', 'testimonial', 'product-card', 'quote',
       'product-grid', 'coupon-code', 'cart-reminder', 'order-summary',
       'property-card', 'property-features', 'location-map', 'agent-contact',
       'job-listing', 'benefits-list', 'company-intro', 'apply-button',
       'transaction-card','credit-card-info',
       'course-card', 'achievement-badge', 'progress-bar',
       'menu-item', 'room-card', 'booking-summary', 'rating-review'].includes(element.type)) {
    return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;padding:0px !important ;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
        ${renderCustomElementHTML(element)}
      </td>
    </tr>
  </tbody>
</table>`
  }
  
  switch (element.type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
      const tag = element.type.replace('heading', 'h')
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
        <${tag} style="margin: 0; font-size: ${style.fontSize || '32px'}; color: ${style.color || '#000'}; font-weight: ${style.fontWeight || 'bold'}; line-height: 1.2; text-align: ${style.textAlign || 'left'};">${props.children || ''}</${tag}>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'text':
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
        <div style="font-size: ${style.fontSize || '16px'}; color: ${style.color || '#374151'}; line-height: ${style.lineHeight || '1.6'}; text-align: ${style.textAlign || 'left'};">${props.children || ''}</div>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'button':
      const btnColor = style.color || '#ffffff'
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="center">
<div align="center">
  <a href="${props.href || '#'}" target="_blank" class="link-preserve" style="box-sizing: border-box;display: inline-block;text-decoration: none;text-align: center;color: ${btnColor}; background-color: ${style.backgroundColor || '#3b82f6'}; border-radius: ${style.borderRadius || '6px'}; width:auto; max-width:100%; font-size: ${style.fontSize || '16px'};">
    <span style="display:block;padding:${style.padding || '12px 24px'};line-height:120%;color:${btnColor};"><strong style="color:${btnColor};">${props.children || 'Button'}</strong></span>
  </a>
</div>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'image':
      const imgSrc = style.backgroundImage || props.src || ''
      const imgContentWidth = globalSettings.value.contentWidth || 700
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
      ${props.href ? `<a href="${props.href}" target="_blank">` : ''}
      <img align="center" border="0" src="${imgSrc}" alt="${props.alt || ''}" title="${props.title || ''}" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block;border: none;height: auto;float: none;width: 100%;max-width: 100%;" />
      ${props.href ? '</a>' : ''}
    </td>
  </tr>
</table>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'divider':
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;" align="left">
        <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;border-spacing: 0;vertical-align: top;border-top: 1px solid ${style.borderColor || '#e5e7eb'};-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"><span>&#160;</span></td></tr></tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'spacer':
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;" align="left">
        <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;border-spacing: 0;vertical-align: top;">
          <tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;height: ${style.height || '20px'};"><span>&#160;</span></td></tr></tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'video':
      const vidWidth = props.width || '100%'
      const vidAlign = props.align || 'center'
      const vidMargin = vidAlign === 'center' ? '0 auto' : vidAlign === 'right' ? '0 0 0 auto' : '0'
      let videoHtml = ''
      if (props.videoType === 'youtube' && props.youtubeUrl) {
        const ytId = getYouTubeEmbedId(props.youtubeUrl)
        if (ytId) {
          // Simple thumbnail + button below (no overlay)
          videoHtml = `<div style="text-align:center;">
            <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" alt="Video thumbnail" style="width: 100%; height: auto; display: block; border-radius: ${props.borderRadius || '8px'}; margin: 0 auto;" />
            <div style="margin-top: 16px; text-align: center;">
              <a href="${props.youtubeUrl}" target="_blank" class="link-preserve" style="display: inline-block; padding: 12px 24px; background: #cc0000; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500;">
                <span style="font-size: 18px; vertical-align: middle; margin-right: 8px;">▶</span>
                <span style="vertical-align: middle;">Xem Video</span>
              </a>
            </div>
          </div>
          `
        }
      }
      if (!videoHtml) {
        videoHtml = `<div style="background-color:#1f2937;padding:40px;text-align:center;border-radius:${props.borderRadius || '8px'};">
          <div style="font-size:48px;color:#9ca3af;">▶</div>
          <p style="color:#9ca3af;margin:8px 0 0 0;font-size:14px;">Video</p>
        </div>`
      }
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;font-family:arial,helvetica,sans-serif;" align="${vidAlign}">
        <div style="width: ${vidWidth}; margin: ${vidMargin};">
          ${props.title ? `<p style="font-weight: 600; margin: 0 0 12px 0; text-align: ${vidAlign}; font-size: 16px;">${props.title}</p>` : ''}
          ${videoHtml}
          ${props.caption ? `<p style="font-size: 12px; color: #6b7280; margin: 12px 0 0 0; font-style: italic; text-align: ${vidAlign};">${props.caption}</p>` : ''}
        </div>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'unsubscribe':
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding: 10px 0px;font-family:arial,helvetica,sans-serif;border-top:1px solid #e5e7eb;" align="center">
        <p style="color: ${props.textColor || '#9ca3af'}; font-size: ${props.fontSize || '12px'}; margin: 0 0 12px 0; line-height: 1.5;">${props.description || 'Nếu bạn không muốn nhận email từ chúng tôi, bạn có thể hủy đăng ký bất cứ lúc nào.'}</p>
        <a href="${props.href || '{{UNSUBSCRIBE_URL}}'}" style="color: ${props.linkColor || '#2563eb'}; font-size: ${props.fontSize || '12px'}; text-decoration: underline;">${props.children || 'Hủy đăng ký'}</a>
      </td>
    </tr>
  </tbody>
</table>`
    
    case 'html':
      // Keep full HTML with CSS support including @media queries for export
      let fullHtml = (props.children || '').trim()
      
      // Only remove dangerous scripts but keep all CSS including <style> tags
      fullHtml = fullHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      fullHtml = fullHtml.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
      fullHtml = fullHtml.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
      fullHtml = fullHtml.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"')
      fullHtml = fullHtml.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""')
      
      return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="left">
        <div style="width: 100%; box-sizing: border-box;">${fullHtml}</div>
      </td>
    </tr>
  </tbody>
</table>`
    
    default:
      return ''
  }
}

// SEO Configuration
useSeoMeta({
  title: 'Email Builder - Công cụ Tạo Email Marketing Chuyên nghiệp',
  description: 'Công cụ tạo email marketing trực quan với drag & drop. Thiết kế template email đẹp, responsive và hiệu quả. Không cần code, hoàn toàn online.',
  keywords: 'email builder, công cụ tạo email, email marketing, template email, drag and drop email editor, thiết kế email, email marketing tool',
  author: 'Emailer',
  ogTitle: 'Email Builder - Công cụ Tạo Email Marketing Chuyên nghiệp',
  ogDescription: 'Thiết kế email marketing đẹp và hiệu quả với công cụ drag & drop trực quan của chúng tôi. Không cần code, hoàn toàn online.',
  ogImage: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/858fa715-31e2-4b81-85e2-a2e8db6e0f00/8K',
  ogUrl: 'https://datools.info/editor',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Email Builder - Công cụ Tạo Email Marketing',
  twitterDescription: 'Công cụ tạo email marketing trực quan với drag & drop. Thiết kế template email đẹp và hiệu quả.',
  twitterImage: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/858fa715-31e2-4b81-85e2-a2e8db6e0f00/8K',
  robots: 'index, follow',
  canonical: 'https://datools.info/editor'
})

// Structured Data for SEO
// useSchemaOrg([
//   {
//     '@type': 'WebApplication',
//     name: 'Email Builder',
//     description: 'Công cụ tạo email marketing trực quan với drag & drop. Thiết kế template email đẹp, responsive và hiệu quả.',
//     url: 'https://datools.info/editor',
//     applicationCategory: 'Productivity',
//     operatingSystem: 'Web Browser',
//     offers: {
//       '@type': 'Offer',
//       price: '0',
//       priceCurrency: 'USD'
//     },
//     featureList: [
//       'Drag & drop editor',
//       'Template library',
//       'Responsive design',
//       'Preview on devices',
//       'Export HTML',
//       'Save templates',
//       'Professional elements'
//     ],
//     screenshot: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/858fa715-31e2-4b81-85e2-a2e8db6e0f00/8K'
//   },
//   {
//     '@type': 'Service',
//     name: 'Dịch vụ Thiết kế Email Marketing',
//     description: 'Dịch vụ thiết kế email marketing chuyên nghiệp với công cụ trực quan và hiệu quả.',
//     provider: {
//       '@type': 'Organization',
//       name: 'Emailer',
//       url: 'https://datools.info'
//     },
//     serviceType: 'Email Design',
//     areaServed: 'Worldwide',
//     hasOfferCatalog: {
//       '@type': 'OfferCatalog',
//       name: 'Dịch vụ Email Marketing',
//       itemListElement: [
//         {
//           '@type': 'Offer',
//           itemOffered: {
//             '@type': 'Service',
//             name: 'Template Design',
//             description: 'Thiết kế template email marketing chuyên nghiệp'
//           }
//         },
//         {
//           '@type': 'Offer',
//           itemOffered: {
//             '@type': 'Service',
//             name: 'Email Campaign Builder',
//             description: 'Công cụ xây dựng chiến dịch email marketing'
//           }
//         }
//       ]
//     }
//   },
//   {
//     '@type': 'FAQPage',
//     mainEntity: [
//       {
//         '@type': 'Question',
//         name: 'Email Builder có miễn phí không?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'Có, Email Builder của chúng tôi hoàn toàn miễn phí sử dụng. Bạn có thể thiết kế không giới hạn template email và lưu lại cho các chiến dịch sau này.'
//         }
//       },
//       {
//         '@type': 'Question',
//         name: 'Có cần kỹ năng lập trình để sử dụng Email Builder không?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'Không, bạn không cần bất kỳ kỹ năng lập trình nào. Email Builder sử dụng giao diện drag & drop trực quan, chỉ cần kéo thả các yếu tố để thiết kế email.'
//         }
//       },
//       {
//         '@type': 'Question',
//         name: 'Email được tạo có tương thích với các email client không?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'Có, các email được tạo bởi Email Builder đều được tối ưu để tương thích với hầu hết các email client phổ biến như Gmail, Outlook, Apple Mail và các thiết bị di động.'
//         }
//       },
//       {
//         '@type': 'Question',
//         name: 'Có thể xuất template email ra HTML không?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'Có, bạn có thể xuất template email đã thiết kế sang định dạng HTML để sử dụng với các nền tảng email marketing khác hoặc gửi email trực tiếp.'
//         }
//       }
//     ]
//   }
// ])
</script>

<style scoped>
.editor-theme :deep(.bg-indigo-600),
.editor-theme :deep(.bg-indigo-500),
.editor-theme :deep(.bg-purple-600),
.editor-theme :deep(.bg-blue-600),
.editor-theme :deep(.bg-blue-500) {
  background-image: linear-gradient(to right, #34d399, #2dd4bf, #a3e635) !important;
  color: #ffffff !important;
}

.editor-theme :deep(.text-indigo-700),
.editor-theme :deep(.text-indigo-600),
.editor-theme :deep(.text-purple-700),
.editor-theme :deep(.text-purple-600),
.editor-theme :deep(.text-blue-700),
.editor-theme :deep(.text-blue-600) {
  color: #059669 !important;
}

.editor-theme :deep(.bg-indigo-50),
.editor-theme :deep(.bg-purple-50),
.editor-theme :deep(.bg-blue-50) {
  background-color: #ecfdf5 !important;
}

.editor-theme :deep(.border-indigo-500),
.editor-theme :deep(.border-indigo-300),
.editor-theme :deep(.border-indigo-200),
.editor-theme :deep(.border-purple-500),
.editor-theme :deep(.border-blue-500),
.editor-theme :deep(.border-blue-300),
.editor-theme :deep(.border-blue-200) {
  border-color: #34d399 !important;
}

.editor-theme :deep(.focus\:border-indigo-500:focus),
.editor-theme :deep(.focus\:border-purple-500:focus),
.editor-theme :deep(.focus\:border-blue-500:focus) {
  border-color: #10b981 !important;
}

.editor-theme :deep(.focus\:ring-indigo-200:focus),
.editor-theme :deep(.focus\:ring-indigo-500:focus),
.editor-theme :deep(.focus\:ring-purple-200:focus),
.editor-theme :deep(.focus\:ring-blue-200:focus),
.editor-theme :deep(.focus\:ring-blue-500:focus) {
  --tw-ring-color: rgba(52, 211, 153, 0.35) !important;
}

.editor-theme :deep([class*="from-purple-"]) { --tw-gradient-from: #34d399 var(--tw-gradient-from-position) !important; }
.editor-theme :deep([class*="to-purple-"]) { --tw-gradient-to: #84cc16 var(--tw-gradient-to-position) !important; }

.editor-theme :deep([class*="hover:bg-indigo-700"]:hover),
.editor-theme :deep([class*="hover:bg-purple-700"]:hover),
.editor-theme :deep([class*="hover:bg-blue-700"]:hover) {
  background-image: linear-gradient(to right, #10b981, #14b8a6, #84cc16) !important;
}

.editor-theme :deep([class*="hover:text-indigo-600"]:hover),
.editor-theme :deep([class*="hover:text-purple-600"]:hover),
.editor-theme :deep([class*="hover:text-blue-600"]:hover) {
  color: #047857 !important;
}

.editor-theme :deep([class*="hover:border-indigo-300"]:hover),
.editor-theme :deep([class*="hover:border-purple-300"]:hover),
.editor-theme :deep([class*="hover:border-blue-300"]:hover) {
  border-color: #34d399 !important;
}

.editor-theme :deep([class*="shadow-indigo"]),
.editor-theme :deep([class*="shadow-purple"]),
.editor-theme :deep([class*="shadow-blue"]) {
  --tw-shadow-color: rgba(16, 185, 129, 0.3) !important;
}

.editor-theme :deep([class*="ring-indigo"]),
.editor-theme :deep([class*="ring-purple"]),
.editor-theme :deep([class*="ring-blue"]) {
  --tw-ring-color: rgba(52, 211, 153, 0.35) !important;
}
</style>
