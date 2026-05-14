<template>
  <div>
  <div class="flex h-[calc(100vh-64px)] overflow-hidden bg-[#1a1a1a] text-gray-300 font-sans">
    <ToastContainer />
    <ConfirmModal
      :is-visible="confirmState.visible"
      :title="confirmState.title"
      :message="confirmState.message"
      :type="confirmState.type"
      :loading="confirmState.loading"
      @confirm="confirmState.onConfirm"
      @cancel="confirmState.visible = false"
    />

    <!-- Summary Modal -->
    <Transition name="fade">
      <div v-if="showSummaryModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="bg-[#1f1f1f] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-black text-white">Tóm tắt hội thoại</h2>
            <button @click="showSummaryModal = false" class="h-9 w-9 rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition flex items-center justify-center">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div v-if="isSummarizing" class="flex flex-col items-center justify-center py-12 gap-3">
            <i class="bi bi-arrow-repeat animate-spin text-2xl text-emerald-500"></i>
            <span class="text-xs text-gray-400">{{ summaryStatusMsg }}</span>
          </div>
          <div v-else class="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{{ summaryText }}</div>
        </div>
      </div>
    </Transition>

    <!-- Upload Modal -->
    <Transition name="fade">
      <div v-if="showUploadModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" @click.self="closeUploadModal">
        <div class="bg-[#1f1f1f] border border-white/10 rounded-[2rem] w-full max-w-xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[90vh]">

          <!-- Glow accent — màu đổi theo scope -->
          <div :class="['absolute -top-20 -right-20 h-64 w-64 blur-[100px] rounded-full transition-all duration-500', uploadScope === 'internal' ? 'bg-emerald-600/15' : 'bg-blue-600/15']"></div>

          <!-- Header -->
          <div class="flex justify-between items-center px-8 pt-8 pb-5 relative">
            <div>
              <h2 class="text-xl font-black text-white tracking-tighter">Nạp tài liệu tri thức</h2>
              <p class="text-[10px] text-gray-500 font-black mt-1 uppercase tracking-widest">Enterprise AI Learning</p>
            </div>
            <button @click="closeUploadModal" class="h-9 w-9 rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition flex items-center justify-center shrink-0">
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>

          <div class="overflow-y-auto px-8 pb-8 space-y-5 custom-scrollbar relative">

            <!-- ① SCOPE TOGGLE -->
            <div>
              <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2.5">
                <i class="bi bi-layers-half mr-1"></i>Loại tài liệu <span class="text-red-500">*</span>
              </p>
              <div class="grid grid-cols-2 gap-3">
                <!-- Internal -->
                <button
                  @click="uploadScope = 'internal'; uploadCategory = 'hr'"
                  :class="[
                    'flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                    uploadScope === 'internal'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  ]"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <div :class="['h-7 w-7 rounded-lg flex items-center justify-center text-sm', uploadScope === 'internal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500']">
                      <i class="bi bi-shield-lock-fill"></i>
                    </div>
                    <span :class="['text-xs font-black', uploadScope === 'internal' ? 'text-white' : 'text-gray-400']">Nội bộ</span>
                    <i v-if="uploadScope === 'internal'" class="bi bi-check-circle-fill text-emerald-500 text-xs ml-auto"></i>
                  </div>
                  <p class="text-[10px] text-gray-500 leading-relaxed font-bold">Chỉ nhân viên đã đăng nhập truy vấn được</p>
                </button>

                <!-- Public / External -->
                <button
                  @click="uploadScope = 'public'; uploadCategory = 'public-faq'"
                  :class="[
                    'flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                    uploadScope === 'public'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  ]"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <div :class="['h-7 w-7 rounded-lg flex items-center justify-center text-sm', uploadScope === 'public' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500']">
                      <i class="bi bi-globe2"></i>
                    </div>
                    <span :class="['text-xs font-black', uploadScope === 'public' ? 'text-white' : 'text-gray-400']">Công khai</span>
                    <i v-if="uploadScope === 'public'" class="bi bi-check-circle-fill text-blue-500 text-xs ml-auto"></i>
                  </div>
                  <p class="text-[10px] text-gray-500 leading-relaxed font-bold">Chatbot website, khách hàng hỏi được</p>
                </button>
              </div>
            </div>

            <!-- ② CATEGORY (chỉ hiện khi scope = internal) -->
            <div v-if="uploadScope === 'internal'">
              <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2.5">
                <i class="bi bi-tag-fill mr-1"></i>Danh mục <span class="text-red-500">*</span>
              </p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="cat in internalCategories"
                  :key="cat.value"
                  @click="uploadCategory = cat.value"
                  :class="[
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-150 text-center',
                    uploadCategory === cat.value
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-gray-500 hover:border-white/10 hover:text-gray-300'
                  ]"
                >
                  <i :class="['text-base', cat.icon, uploadCategory === cat.value ? cat.activeColor : '']"></i>
                  <span class="text-[10px] font-black leading-tight">{{ cat.label }}</span>
                </button>
              </div>
            </div>

            <!-- ② CATEGORY = public-faq badge (khi scope = public) -->
            <div v-else class="flex items-center gap-2 px-3 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <i class="bi bi-info-circle text-blue-400 text-sm"></i>
              <p class="text-[11px] text-blue-300 font-bold">Tài liệu công khai sẽ được phân loại tự động là <span class="font-black">FAQ & Hỗ trợ</span></p>
            </div>

            <!-- ③ DROP ZONE -->
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              :class="[
                'border-2 border-dashed rounded-2xl py-8 text-center transition-all duration-300 relative',
                isDragging
                  ? (uploadScope === 'internal' ? 'border-emerald-500 bg-emerald-500/5' : 'border-blue-500 bg-blue-500/5')
                  : 'border-white/10 hover:border-white/20'
              ]"
            >
              <div :class="['h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform', uploadScope === 'internal' ? 'bg-emerald-600/10' : 'bg-blue-600/10', isDragging ? 'scale-110' : '']">
                <i :class="['text-2xl', uploadScope === 'internal' ? 'bi bi-cloud-arrow-up-fill text-emerald-500' : 'bi bi-cloud-arrow-up-fill text-blue-400']"></i>
              </div>
              <p class="text-xs font-black text-white mb-1">Kéo thả file vào đây</p>
              <p class="text-[10px] text-gray-600 font-bold mb-4">PDF, DOCX, TXT, XLSX · Tối đa 10MB</p>
              <label :class="['px-6 py-2 rounded-xl text-[11px] font-black cursor-pointer transition shadow-lg active:scale-95 inline-block', uploadScope === 'internal' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20']">
                Chọn từ máy tính
                <input type="file" class="hidden" @change="handleFileChange" accept=".pdf,.docx,.doc,.txt,.xlsx" />
              </label>
            </div>

            <!-- ④ FILE PREVIEW -->
            <div v-if="selectedFile" :class="['p-4 border rounded-2xl flex items-center justify-between gap-3 transition-all', uploadScope === 'internal' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-blue-500/5 border-blue-500/20']">
              <div class="flex items-center gap-3 overflow-hidden">
                <!-- file type icon -->
                <div :class="['h-10 w-10 rounded-xl flex items-center justify-center text-lg shrink-0', uploadScope === 'internal' ? 'bg-emerald-600/15' : 'bg-blue-600/15']">
                  <i :class="getFileIcon(selectedFile.name.split('.').pop() || '')"></i>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black text-white truncate">{{ selectedFile.name }}</p>
                  <!-- Scope + Category badge -->
                  <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black', uploadScope === 'internal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400']">
                      <i :class="uploadScope === 'internal' ? 'bi bi-shield-lock-fill' : 'bi bi-globe2'"></i>
                      {{ uploadScope === 'internal' ? 'Nội bộ' : 'Công khai' }}
                    </span>
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-white/5 text-gray-400">
                      <i class="bi bi-tag-fill"></i>
                      {{ currentCategoryLabel }}
                    </span>
                    <span class="text-[9px] text-gray-600 font-bold">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</span>
                  </div>
                </div>
              </div>
              <button @click="selectedFile = null" class="h-8 w-8 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition shrink-0">
                <i class="bi bi-trash-fill text-sm"></i>
              </button>
            </div>

            <!-- ⑤ SUBMIT -->
            <button
              @click="uploadFile"
              :disabled="!selectedFile || isUploading"
              :class="[
                'w-full py-3.5 rounded-2xl font-black transition-all flex items-center justify-center gap-2.5 shadow-2xl active:scale-[0.98] disabled:opacity-20 text-white text-sm',
                uploadScope === 'internal'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              ]"
            >
              <i v-if="isUploading" class="bi bi-arrow-repeat animate-spin"></i>
              <i v-else :class="uploadScope === 'internal' ? 'bi bi-shield-check' : 'bi bi-globe-americas'"></i>
              <span>{{ isUploading ? 'Đang xử lý...' : (uploadScope === 'internal' ? 'Nạp vào kho nội bộ' : 'Nạp lên kho công khai') }}</span>
            </button>

          </div>
        </div>
      </div>
    </Transition>

    <!-- Sidebar (chat tab only) -->
    <Transition name="sidebar">
      <aside
        v-if="currentTab === 'chat' && sidebarOpen"
        class="w-64 border-r border-white/[0.06] flex flex-col bg-[#111] shrink-0 overflow-hidden"
      >
        <!-- Top: title + toggle button -->
        <div class="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
          <span class="text-sm font-semibold text-white tracking-tight">AI Nội bộ</span>
          <button
            @click="sidebarOpen = false"
            class="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition"
            title="Đóng sidebar"
          >
            <!-- panels icon giống Claude -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="14" height="14" rx="2.5" stroke="currentColor" stroke-width="1.4"/>
              <line x1="5.5" y1="1.7" x2="5.5" y2="14.3" stroke="currentColor" stroke-width="1.4"/>
            </svg>
          </button>
        </div>

        <!-- New chat + Search -->
        <div class="px-3 pb-2 space-y-1.5 shrink-0">
          <button
            @click="startNewChat"
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition text-sm font-medium"
          >
            <i class="bi bi-plus-lg text-sm"></i>
            <span>Cuộc hội thoại mới</span>
          </button>
          <button
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition text-sm font-medium"
            @click="threadSearchFocused = true"
          >
            <i class="bi bi-search text-sm"></i>
            <span>Tìm kiếm</span>
          </button>
          <!-- Search input (hiện khi click Tìm kiếm) -->
          <div v-if="threadSearchFocused" class="flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-xl">
            <i class="bi bi-search text-[10px] text-gray-600"></i>
            <input
              v-model="threadSearch"
              type="text"
              placeholder="Tìm hội thoại..."
              class="bg-transparent text-xs text-white placeholder:text-gray-600 outline-none w-full"
              @blur="() => { if (!threadSearch) threadSearchFocused = false }"
              ref="threadSearchInput"
              autofocus
            />
            <button v-if="threadSearch" @click="threadSearch = ''; threadSearchFocused = false" class="text-gray-600 hover:text-gray-400">
              <i class="bi bi-x text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Thread List -->
        <div class="flex-1 overflow-y-auto px-2 py-1 custom-scrollbar">
          <!-- Recents label -->
          <p v-if="filteredHistory.length > 0" class="px-3 text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1 mt-1">Gần đây</p>

          <div v-if="filteredHistory.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-600">
            <i class="bi bi-chat-dots text-2xl mb-2 opacity-20"></i>
            <p class="text-[11px] font-bold">{{ threadSearch ? 'Không tìm thấy' : 'Chưa có hội thoại' }}</p>
          </div>

          <div v-else v-for="(group, label) in groupedFilteredHistory" :key="label" class="mb-3">
            <h3 class="px-3 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">{{ label }}</h3>
            <div class="space-y-0.5">
              <div
                v-for="item in group"
                :key="item.id"
                :class="[
                  'w-full flex items-center px-3 py-2 rounded-xl transition group relative cursor-pointer overflow-hidden',
                  currentThreadId === item.id
                    ? 'bg-white/10 text-white'
                    : 'hover:bg-white/[0.06] text-gray-400 hover:text-gray-200'
                ]"
                @click="loadThread(item.id)"
              >
                <div class="flex-1 min-w-0 pr-12">
                  <template v-if="editingThreadId === item.id">
                    <input
                      v-model="editingTitle"
                      @blur="saveThreadTitle(item.id)"
                      @keydown.enter="saveThreadTitle(item.id)"
                      @keydown.esc="editingThreadId = null"
                      @click.stop
                      class="bg-white/10 border border-emerald-500/40 text-white text-[11px] font-bold rounded-lg px-2 py-0.5 w-full outline-none"
                      ref="titleInput"
                    />
                  </template>
                  <template v-else>
                    <p class="text-[13px] font-medium truncate">{{ item.title || 'Hội thoại mới' }}</p>
                  </template>
                </div>
                <!-- Thread action buttons -->
                <div class="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button @click.stop="startEditThread(item)" class="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition" title="Đổi tên">
                    <i class="bi bi-pencil text-[9px]"></i>
                  </button>
                  <button @click.stop="confirmDeleteThread(item.id)" class="p-1 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition" title="Xóa">
                    <i class="bi bi-trash3 text-[9px]"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Footer -->
        <div class="p-3 border-t border-white/[0.06] shrink-0">
          <div class="flex items-center gap-2 px-3 py-2 text-[9px] text-gray-600 font-bold uppercase tracking-wider">
            <i class="bi bi-shield-lock-fill text-emerald-600 text-xs"></i>
            Dữ liệu bảo mật nội bộ
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative min-w-0 bg-[#181818]">
      <!-- Header -->
      <header class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#181818] sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <!-- Toggle sidebar button — chỉ hiện ở tab chat -->
          <button
            v-if="currentTab === 'chat'"
            @click="sidebarOpen = !sidebarOpen"
            :class="['h-8 w-8 rounded-lg flex items-center justify-center transition shrink-0', sidebarOpen ? 'text-white bg-white/10' : 'text-gray-500 hover:text-white hover:bg-white/[0.06]']"
            :title="sidebarOpen ? 'Đóng sidebar' : 'Mở sidebar'"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="14" height="14" rx="2.5" stroke="currentColor" stroke-width="1.4"/>
              <line x1="5.5" y1="1.7" x2="5.5" y2="14.3" stroke="currentColor" stroke-width="1.4"/>
            </svg>
          </button>

          <!-- Brand -->
          <div class="flex items-center gap-2">
            <div class="h-7 w-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <i class="bi bi-stars text-emerald-400 text-xs"></i>
            </div>
            <span class="text-sm font-semibold text-white hidden md:block">AI Nội bộ</span>
          </div>

          <!-- Tab switcher -->
          <div class="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <button
              @click="currentTab = 'chat'"
              :class="['px-3.5 py-1.5 text-xs rounded-md transition-all duration-200 font-medium flex items-center gap-1.5', currentTab === 'chat' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300']"
            >
              <i class="bi bi-chat-dots text-[10px]"></i> Chat
            </button>
            <button
              @click="switchToFiles"
              :class="['px-3.5 py-1.5 text-xs rounded-md transition-all duration-200 font-medium flex items-center gap-1.5', currentTab === 'files' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300']"
            >
              <i class="bi bi-folder text-[10px]"></i> Tài liệu
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <p class="text-xs text-gray-500 hidden lg:block">{{ authUser.display_name || authUser.full_name || authUser.name || '' }}</p>
          <div class="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-semibold text-gray-300">{{ getInitials(authUser.display_name || authUser.full_name || authUser.name || authUser.email || '') }}</div>
        </div>
      </header>

      <!-- ───────────── TAB: CHAT ───────────── -->
      <div v-if="currentTab === 'chat'" class="flex-1 flex flex-col min-h-0">

        <!-- Thread action bar — chỉ hiện khi có messages -->
        <Transition name="slide-down">
          <div v-if="messages.length > 0" class="flex items-center justify-between px-6 py-2.5 border-b border-white/[0.06]">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <p class="text-xs font-semibold text-gray-400 truncate">{{ currentThreadTitle || 'Cuộc hội thoại' }}</p>
            </div>
            <div class="flex items-center gap-0.5">
              <button @click="exportThread" :disabled="isExporting" class="h-7 w-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 transition disabled:opacity-30" title="Tải xuống">
                <i :class="isExporting ? 'bi bi-arrow-repeat animate-spin text-[11px]' : 'bi bi-download text-[11px]'"></i>
              </button>
              <button @click="summarizeThread" class="h-7 w-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 transition" title="Tóm tắt">
                <i class="bi bi-text-paragraph text-[11px]"></i>
              </button>
              <button @click="shareThread" :disabled="isSharing" class="h-7 w-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 transition disabled:opacity-30" title="Chia sẻ">
                <i :class="isSharing ? 'bi bi-arrow-repeat animate-spin text-[11px]' : 'bi bi-share text-[11px]'"></i>
              </button>
              <div class="w-px h-4 bg-white/10 mx-1"></div>
              <button @click="currentThreadId && confirmDeleteThread(currentThreadId)" class="h-7 w-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition" title="Xóa">
                <i class="bi bi-trash3 text-[11px]"></i>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Empty state -->
        <div v-if="messages.length === 0" class="flex-1 flex flex-col items-center justify-center px-6 pb-6 overflow-y-auto">
          <!-- Icon -->
          <div class="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
            <i class="bi bi-stars text-2xl text-emerald-400"></i>
          </div>
          <h2 class="text-lg font-semibold text-white mb-1 tracking-tight">Xin chào, {{ authUser.display_name || authUser.full_name || authUser.name || 'bạn' }}</h2>
          <p class="text-sm text-gray-500 text-center max-w-sm leading-relaxed mb-10">
            Đặt câu hỏi về quy trình, chính sách hoặc tài liệu nội bộ.
          </p>

          <!-- Quick prompts -->
          <div class="w-full max-w-xl space-y-2">
            <button @click="handleSendQuick('Quy trình xin nghỉ phép năm 2025?')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition text-left group">
              <i class="bi bi-calendar-check text-emerald-500 text-sm shrink-0"></i>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-200">Quy trình nghỉ phép</p>
                <p class="text-xs text-gray-600 truncate">Thời hạn nộp đơn và các cấp phê duyệt</p>
              </div>
              <i class="bi bi-arrow-right text-gray-700 group-hover:text-gray-500 text-xs transition shrink-0"></i>
            </button>
            <button @click="handleSendQuick('Các bước bảo mật thông tin nội bộ?')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition text-left group">
              <i class="bi bi-shield-check text-emerald-500 text-sm shrink-0"></i>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-200">Bảo mật thông tin</p>
                <p class="text-xs text-gray-600 truncate">Quy định sử dụng dữ liệu và tài liệu nội bộ</p>
              </div>
              <i class="bi bi-arrow-right text-gray-700 group-hover:text-gray-500 text-xs transition shrink-0"></i>
            </button>
            <button @click="handleSendQuick('Chính sách lương thưởng và phúc lợi nhân viên?')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition text-left group">
              <i class="bi bi-gift text-emerald-500 text-sm shrink-0"></i>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-200">Lương thưởng & phúc lợi</p>
                <p class="text-xs text-gray-600 truncate">Chính sách đãi ngộ và các khoản phúc lợi</p>
              </div>
              <i class="bi bi-arrow-right text-gray-700 group-hover:text-gray-500 text-xs transition shrink-0"></i>
            </button>
          </div>
        </div>

        <!-- Message list -->
        <div v-else ref="chatContainer" class="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">
            <div v-for="(msg, index) in messages" :key="index">

              <!-- User message -->
              <div v-if="msg.role === 'user'" class="flex justify-end">
                <div class="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm bg-emerald-600 text-white text-sm leading-relaxed">
                  {{ msg.content }}
                </div>
              </div>

              <!-- AI message — hide empty bubble while waiting for first chunk -->
              <div v-else v-show="msg.content || !(isStreaming && index === messages.length - 1)" class="flex gap-3">
                <div class="h-7 w-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <i class="bi bi-stars text-emerald-400 text-xs"></i>
                </div>
                <div class="flex-1 min-w-0 space-y-2">
                  <div class="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap markdown-content">{{ msg.content }}</div>

                  <!-- Sources — click to open doc viewer -->
                  <div v-if="msg.sources && msg.sources.length && !(isStreaming && index === messages.length - 1)" class="pt-2 space-y-1.5">
                    <p class="text-[10px] text-gray-600 font-medium uppercase tracking-wider">Tài liệu tham khảo</p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="src in msg.sources"
                        :key="src"
                        @click="openDocViewerByFilename(src)"
                        class="group inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all duration-150 cursor-pointer max-w-[220px]"
                      >
                        <div class="h-6 w-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <i :class="getSourceIcon(src)" class="text-emerald-400 text-[10px]"></i>
                        </div>
                        <span class="text-[11px] text-gray-400 group-hover:text-gray-200 truncate transition-colors leading-tight">{{ src.replace(/^huong-dan-/, '').replace(/-/g, ' ').replace(/\.txt$/, '') }}</span>
                        <i class="bi bi-box-arrow-up-right text-[9px] text-gray-600 group-hover:text-emerald-400 shrink-0 transition-colors"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Actions — hidden while last message is still streaming -->
                  <div v-if="!(isStreaming && index === messages.length - 1)" class="flex items-center gap-1 pt-0.5">
                    <button @click="copyToClipboard(msg.content)" class="h-6 px-2 rounded-md flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-300 hover:bg-white/5 transition">
                      <i class="bi bi-clipboard text-[10px]"></i> Sao chép
                    </button>
                    <button @click="sendFeedback(msg, 1)" :class="['h-6 w-6 rounded-md flex items-center justify-center transition text-[10px]', msg.feedback === 1 ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-600 hover:text-gray-300 hover:bg-white/5']" title="Hữu ích">
                      <i class="bi bi-hand-thumbs-up"></i>
                    </button>
                    <button @click="sendFeedback(msg, -1)" :class="['h-6 w-6 rounded-md flex items-center justify-center transition text-[10px]', msg.feedback === -1 ? 'text-red-400 bg-red-500/10' : 'text-gray-600 hover:text-gray-300 hover:bg-white/5']" title="Không hữu ích">
                      <i class="bi bi-hand-thumbs-down"></i>
                    </button>
                    <button @click="retryMessage(index)" class="h-6 px-2 rounded-md flex items-center gap-1 text-[10px] text-gray-600 hover:text-gray-300 hover:bg-white/5 transition">
                      <i class="bi bi-arrow-clockwise text-[10px]"></i> Thử lại
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Streaming indicator -->
            <div v-if="isStreaming" class="flex gap-3">
              <div class="h-7 w-7 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <i class="bi bi-stars text-emerald-400 text-xs"></i>
              </div>
              <div class="flex items-center gap-1 pt-2">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-bounce"></span>
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-bounce [animation-delay:0.15s]"></span>
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input area -->
        <div class="px-4 pb-4 pt-2">
          <div class="max-w-2xl mx-auto space-y-2">

            <!-- Attach & context pills — chỉ hiện khi có -->
            <div v-if="chatAttachFile || selectedContextDoc" class="flex items-center gap-2 flex-wrap">
              <div v-if="chatAttachFile" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                <i :class="getFileIcon(chatAttachFile.name.split('.').pop() || '')" class="text-[10px]"></i>
                <span class="truncate max-w-[120px]">{{ chatAttachFile.name }}</span>
                <button @click="chatAttachFile = null" class="text-gray-600 hover:text-red-400 transition ml-0.5">
                  <i class="bi bi-x text-xs"></i>
                </button>
              </div>
              <div v-if="selectedContextDoc" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                <i class="bi bi-database-fill-check text-[10px]"></i>
                <span class="truncate max-w-[120px]">{{ selectedContextDoc.filename }}</span>
                <button @click="selectedContextDoc = null" class="text-emerald-600 hover:text-red-400 transition ml-0.5">
                  <i class="bi bi-x text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Doc picker dropdown -->
            <div v-if="showDocPickerDropdown" data-doc-picker class="border border-white/10 rounded-xl overflow-hidden shadow-xl bg-[#1c1c1c]">
              <div class="flex items-center gap-2 px-3 py-2 border-b border-white/5">
                <i class="bi bi-search text-[10px] text-gray-600"></i>
                <input v-model="docPickerSearch" type="text" placeholder="Tìm tài liệu trong kho..." autofocus class="bg-transparent text-xs text-white placeholder:text-gray-600 outline-none w-full" />
              </div>
              <div class="max-h-44 overflow-y-auto custom-scrollbar">
                <div v-if="filteredPickerDocs.length === 0" class="px-4 py-5 text-center text-xs text-gray-600">Không tìm thấy tài liệu nào</div>
                <button v-for="doc in filteredPickerDocs" :key="doc.id" @click="selectContextDoc(doc)" class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition text-left">
                  <div :class="['h-6 w-6 rounded-md flex items-center justify-center text-xs shrink-0', getFileIconBg(doc.type)]">
                    <i :class="getFileIcon(doc.type)"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-gray-200 truncate">{{ doc.filename }}</p>
                    <p class="text-[10px] text-gray-600">{{ categoryLabels[doc.category] || doc.category }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Input box -->
            <div :class="['flex items-end gap-2 px-3 py-2.5 rounded-xl border transition', isStreaming ? 'bg-[#1e1e1e] border-white/[0.05]' : 'bg-[#252525] border-white/[0.07] focus-within:border-white/15']">
              <textarea
                v-model="input"
                rows="1"
                @keydown.enter.exact.prevent="handleSend"
                placeholder="Hỏi về tài liệu nội bộ..."
                class="flex-1 bg-transparent text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none resize-none leading-relaxed py-0.5 disabled:opacity-100 disabled:cursor-not-allowed"
                style="max-height: 120px; color: inherit; -webkit-text-fill-color: rgb(243 244 246);"
                :disabled="isStreaming"
              ></textarea>

              <!-- Toolbar -->
              <div class="flex items-center gap-1 shrink-0">
                <label class="h-7 w-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 transition cursor-pointer" title="Đính kèm file">
                  <i class="bi bi-paperclip text-sm"></i>
                  <input type="file" class="hidden" @change="handleChatAttach" accept=".pdf,.docx,.doc,.txt,.xlsx,.png,.jpg,.jpeg" />
                </label>
                <button data-doc-picker @click="showDocPickerDropdown = !showDocPickerDropdown" :class="['h-7 w-7 rounded-lg flex items-center justify-center transition', showDocPickerDropdown || selectedContextDoc ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-600 hover:text-gray-300 hover:bg-white/5']" title="Chọn tài liệu từ kho">
                  <i class="bi bi-database-fill-check text-sm"></i>
                </button>
                <!-- Provider selector -->
                <div class="relative" ref="providerDropdownRef">
                  <button
                    @click="showProviderDropdown = !showProviderDropdown"
                    :title="`Model: ${selectedProvider?.label}`"
                    class="h-7 px-1.5 rounded-lg flex items-center gap-1 text-gray-500 hover:text-gray-300 hover:bg-white/5 transition text-[11px]"
                  >
                    <span :class="selectedProvider?.dot"></span>
                    <span class="hidden sm:inline">{{ selectedProvider?.short }}</span>
                    <i class="bi bi-chevron-down text-[9px]"></i>
                  </button>
                  <div v-if="showProviderDropdown" class="absolute bottom-9 right-0 w-44 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                    <div class="px-3 py-1.5 text-[10px] text-gray-600 uppercase tracking-wider">AI Model</div>
                    <button
                      v-for="p in providerOptions"
                      :key="p.value"
                      @click="selectedProvider = p; showProviderDropdown = false"
                      :class="['w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition', selectedProvider?.value === p.value ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]']"
                    >
                      <span :class="p.dot + ' shrink-0'"></span>
                      <div>
                        <div class="font-medium">{{ p.label }}</div>
                        <div class="text-[10px] text-gray-600">{{ p.desc }}</div>
                      </div>
                      <i v-if="selectedProvider?.value === p.value" class="bi bi-check ml-auto text-emerald-400"></i>
                    </button>
                  </div>
                </div>

                <div class="w-px h-4 bg-white/10 mx-0.5"></div>
                <button
                  @click="handleSend"
                  :disabled="(!input.trim() && !chatAttachFile) || isStreaming"
                  :class="['h-7 w-7 rounded-lg flex items-center justify-center transition', (input.trim() || chatAttachFile) && !isStreaming ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'text-gray-700 cursor-not-allowed']"
                >
                  <i class="bi bi-arrow-up text-sm font-black"></i>
                </button>
              </div>
            </div>

            <!-- Quick suggestions inline -->
            <div v-if="messages.length > 0 && showSuggestions" class="flex flex-wrap gap-1.5">
              <button @click="handleSendQuick('Số ngày phép còn lại của tôi?')" class="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-500 hover:text-gray-300 hover:bg-white/[0.08] transition">Số ngày phép còn lại?</button>
              <button @click="handleSendQuick('Cho tôi mẫu đơn xin nghỉ phép.')" class="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-500 hover:text-gray-300 hover:bg-white/[0.08] transition">Mẫu đơn xin nghỉ</button>
              <button @click="handleSendQuick('Ai là người duyệt đơn này?')" class="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-gray-500 hover:text-gray-300 hover:bg-white/[0.08] transition">Ai duyệt đơn?</button>
            </div>

          </div>
        </div>
      </div>

      <!-- ───────────── TAB: FILES ───────────── -->
      <div v-else class="flex-1 flex overflow-hidden">

        <!-- Category sidebar -->
        <div class="w-48 border-r border-white/[0.06] bg-[#181818] flex flex-col shrink-0">
          <div class="px-4 pt-4 pb-2 flex items-center justify-between">
            <p class="text-[10px] font-medium text-gray-600 uppercase tracking-widest">Danh mục</p>
            <!-- Badge quyền hiện tại -->
            <span v-if="canManage" class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-400 text-[9px] font-black">
              <i class="bi bi-stars"></i> Super
            </span>
            <span v-else-if="canUpload" class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[9px] font-black">
              <i class="bi bi-shield-fill"></i> Admin
            </span>
            <span v-else class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 text-gray-600 text-[9px] font-black">
              <i class="bi bi-eye"></i> Xem
            </span>
          </div>
          <div class="flex-1 overflow-y-auto px-2 pb-3 custom-scrollbar space-y-0.5">
            <div
              v-for="cat in fileCategories"
              :key="cat.key"
              :class="['w-full flex items-center gap-2 px-3 py-2 rounded-lg transition text-left group relative', activeCategory === cat.key ? 'bg-white/[0.08] text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]']"
            >
              <button class="flex items-center gap-2 flex-1 min-w-0 text-left" @click="activeCategory = cat.key">
                <i :class="['text-xs shrink-0', cat.icon]"></i>
                <span class="text-xs truncate flex-1">{{ cat.label }}</span>
                <span class="text-[10px] text-gray-700 shrink-0">{{ cat.count }}</span>
              </button>
              <!-- Sửa/Xóa danh mục — chỉ SuperAdmin, không hiện với "all" -->
              <div v-if="canManage && cat.key !== 'all'" class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0 ml-0.5">
                <button @click.stop="openEditCategory(cat)" class="h-5 w-5 rounded flex items-center justify-center text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition" title="Sửa danh mục">
                  <i class="bi bi-pencil text-[9px]"></i>
                </button>
                <button @click.stop="confirmDeleteCategory(cat)" class="h-5 w-5 rounded flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition" title="Xóa danh mục">
                  <i class="bi bi-trash3 text-[9px]"></i>
                </button>
              </div>
            </div>

            <template v-if="canUpload">
              <div class="px-3 pt-4 pb-1">
                <p class="text-[10px] font-medium text-gray-600 uppercase tracking-widest">Quyền</p>
              </div>
              <button
                @click="activeCategory = activeCategory === 'admin-only' ? 'all' : 'admin-only'"
                :class="['w-full flex items-center gap-2 px-3 py-2 rounded-lg transition text-left', activeCategory === 'admin-only' ? 'bg-amber-500/10 text-amber-300' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]']"
              >
                <i class="bi bi-lock text-xs shrink-0 text-amber-500"></i>
                <span class="text-xs flex-1">Chỉ Admin</span>
                <span class="text-[10px] text-gray-700 shrink-0">{{ documents.filter(d => d.scope === 'admin-only').length }}</span>
              </button>
            </template>
          </div>

          <!-- Permission legend footer -->
          <div class="px-3 py-3 border-t border-white/[0.04] shrink-0 space-y-1">
            <div class="flex items-center gap-1.5 text-[9px] text-gray-700">
              <i class="bi bi-eye text-gray-600"></i>
              <span>Member: Xem tài liệu</span>
            </div>
            <div :class="['flex items-center gap-1.5 text-[9px]', canUpload ? 'text-amber-600' : 'text-gray-700']">
              <i class="bi bi-upload" :class="canUpload ? 'text-amber-600' : 'text-gray-700'"></i>
              <span>Admin: Upload, xóa</span>
            </div>
            <div :class="['flex items-center gap-1.5 text-[9px]', canManage ? 'text-purple-500' : 'text-gray-700']">
              <i class="bi bi-folder-symlink" :class="canManage ? 'text-purple-500' : 'text-gray-700'"></i>
              <span>SuperAdmin: Quản lý danh mục</span>
            </div>
          </div>
        </div>

        <!-- File main area -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

          <!-- Toolbar -->
          <div class="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2">
            <div class="flex items-center gap-2 flex-1 px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg">
              <i class="bi bi-search text-[10px] text-gray-600"></i>
              <input v-model="fileSearch" type="text" placeholder="Tìm tài liệu..." class="bg-transparent text-xs text-gray-200 placeholder:text-gray-600 outline-none w-full" />
            </div>
            <!-- Type filters -->
            <div class="flex items-center gap-1">
              <button
                v-for="f in fileTypeFilters" :key="f.key"
                @click="activeFileType = f.key"
                :class="['px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition', activeFileType === f.key ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]']"
              >{{ f.label }}</button>
            </div>
            <!-- Status filters -->
            <div class="flex items-center gap-1 pl-1 border-l border-white/[0.06]">
              <button
                @click="activeStatusFilter = activeStatusFilter === 'indexed' ? '' : 'indexed'"
                :class="['px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1', activeStatusFilter === 'indexed' ? 'bg-emerald-500/15 text-emerald-400' : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]']"
              ><i class="bi bi-check-circle text-[10px]"></i> Indexed</button>
              <button
                @click="activeStatusFilter = activeStatusFilter === 'processing' ? '' : 'processing'"
                :class="['px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center gap-1', activeStatusFilter === 'processing' ? 'bg-amber-500/15 text-amber-400' : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.04]']"
              ><i class="bi bi-hourglass-split text-[10px]"></i> Processing</button>
            </div>
            <div class="flex-1"></div>
            <button v-if="canManage" @click="confirmDeleteAllDocs" class="h-8 w-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition" title="Xóa tất cả tài liệu (SuperAdmin)">
              <i class="bi bi-trash3 text-sm"></i>
            </button>
            <button v-if="canManage" @click="openCreateCategory" class="h-8 w-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] transition" title="Tạo danh mục">
              <i class="bi bi-folder-plus text-sm"></i>
            </button>
            <button v-if="canUpload" @click="showUploadModal = true" class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition active:scale-95">
              <i class="bi bi-plus-lg text-xs"></i> Upload
            </button>
          </div>

          <!-- File list -->
          <div class="flex-1 overflow-y-auto custom-scrollbar">
            <!-- Empty -->
            <div v-if="filteredDocuments.length === 0" class="flex flex-col items-center justify-center h-full gap-2 text-gray-700">
              <i class="bi bi-folder2-open text-3xl opacity-20"></i>
              <p class="text-sm">Chưa có tài liệu nào</p>
            </div>

            <!-- Rows -->
            <div
              v-for="doc in filteredDocuments"
              :key="doc.id"
              class="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition group"
            >
              <!-- Icon -->
              <div :class="['h-8 w-8 rounded-lg flex items-center justify-center text-sm shrink-0', getFileIconBg(doc.type)]">
                <i :class="getFileIcon(doc.type)"></i>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-200 truncate font-medium">{{ doc.filename }}</p>
                <p class="text-[10px] text-gray-600 mt-0.5">
                  {{ categoryLabels[doc.category] || doc.category }} · {{ formatFileSize(doc.file_size) }} · {{ formatDateLabel(doc.created_at) }}
                </p>
              </div>

              <!-- Admin-only badge -->
              <span v-if="doc.scope === 'admin-only'" class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400">
                <i class="bi bi-lock text-[9px]"></i> Admin
              </span>

              <!-- Status -->
              <div :class="['shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium', getStatusBadge(doc.status)]">
                <i :class="doc.status === 'completed' ? 'bi bi-check-circle' : doc.status === 'processing' ? 'bi bi-hourglass-split' : 'bi bi-clock'"></i>
                {{ getStatusLabel(doc.status) }}
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition shrink-0">
                <button v-if="canUpload" @click.stop="toggleDocScope(doc)" :class="['h-7 w-7 rounded-md flex items-center justify-center transition text-[11px]', doc.scope === 'admin-only' ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' : 'text-gray-600 hover:text-amber-400 hover:bg-amber-500/10']" title="Toggle Admin-only">
                  <i class="bi bi-lock"></i>
                </button>
                <button v-if="canView" @click.stop="openDocViewer(doc)" class="h-7 w-7 rounded-md flex items-center justify-center text-gray-600 hover:text-gray-200 hover:bg-white/[0.06] transition text-[11px]" title="Xem file">
                  <i class="bi bi-eye"></i>
                </button>
                <button v-if="canUpload" @click.stop="confirmDeleteDoc(doc.id)" class="h-7 w-7 rounded-md flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition text-[11px]" title="Xóa">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>

            <!-- Drop zone — chỉ admin mới upload được -->
            <div
              v-if="canUpload"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDropInList"
              @click="showUploadModal = true"
              :class="['mx-4 my-3 border border-dashed rounded-xl py-8 text-center cursor-pointer transition-all', isDragging ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/[0.06] hover:border-white/10']"
            >
              <i class="bi bi-cloud-upload text-xl text-gray-700 block mb-1.5"></i>
              <p class="text-xs text-gray-700">Kéo thả để upload · PDF, DOCX, XLSX, TXT</p>
            </div>
          </div>

          <!-- Stats footer -->
          <div class="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06]">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-semibold text-white">{{ documents.length }}</span>
              <span class="text-[10px] text-gray-600">tài liệu</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span class="text-[10px] text-gray-600">{{ documents.filter(d => d.status === 'completed').length }} indexed</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span class="text-[10px] text-gray-600">{{ documents.filter(d => d.status === 'processing').length }} processing</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Share Fallback Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="shareUrl" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="shareUrl = ''"></div>
        <div class="relative z-10 w-full max-w-md bg-[#1f1f1f] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-black text-white">Link chia se</p>
            <button @click="shareUrl = ''" class="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition">
              <i class="bi bi-x-lg text-xs"></i>
            </button>
          </div>
          <p class="text-[10px] text-amber-400 font-bold mb-3"><i class="bi bi-exclamation-triangle mr-1"></i>Clipboard bi tu choi — sao chep thu cong:</p>
          <div class="flex items-center gap-2 px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl">
            <span class="text-xs text-gray-300 font-mono break-all flex-1 select-all">{{ shareUrl }}</span>
            <button @click="copyShareUrlManual" class="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black hover:bg-emerald-500 transition">
              <i class="bi bi-clipboard"></i>
            </button>
          </div>
          <p class="text-[9px] text-gray-600 font-bold mt-2">Het han sau 7 ngay</p>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Create / Edit Category Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showCreateCategoryModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeCreateCategoryModal"></div>
        <div class="relative z-10 w-full max-w-sm bg-[#1f1f1f] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-5">
            <div>
              <p class="text-sm font-black text-white">{{ categoryModalTitle }}</p>
              <p class="text-[10px] text-gray-500 font-bold mt-0.5">{{ editingCategory ? 'Cập nhật tên và loại danh mục' : 'Thêm nhóm phân loại tài liệu' }}</p>
            </div>
            <button @click="closeCreateCategoryModal" class="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition">
              <i class="bi bi-x-lg text-xs"></i>
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Tên danh mục <span class="text-red-500">*</span></label>
              <input v-model="newCategory.label" type="text" placeholder="VD: Đào tạo & Phát triển" class="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-emerald-500/50 font-bold transition" />
            </div>
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Key (slug) <span class="text-red-500">*</span></label>
              <input v-model="newCategory.key" type="text" placeholder="VD: training" :disabled="!!editingCategory" :class="['w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm placeholder:text-gray-600 outline-none focus:border-emerald-500/50 font-mono font-bold transition', editingCategory ? 'text-gray-500 cursor-not-allowed' : 'text-white']" />
              <p class="text-[9px] text-gray-600 mt-1 font-bold">{{ editingCategory ? 'Key không thể thay đổi sau khi tạo' : 'Chỉ chữ thường, số và dấu -' }}</p>
            </div>
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Loại</label>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="s in [{v:'internal',l:'Nội bộ'},{v:'public',l:'Công khai'},{v:'both',l:'Cả hai'}]" :key="s.v"
                  @click="newCategory.scope = s.v"
                  :class="['py-2 rounded-xl text-[10px] font-black border transition', newCategory.scope === s.v ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10']"
                >{{ s.l }}</button>
              </div>
            </div>
          </div>
          <button @click="createCategory" :disabled="isCreatingCategory || !newCategory.label.trim() || !newCategory.key.trim()" class="w-full mt-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black transition disabled:opacity-30 flex items-center justify-center gap-2">
            <i v-if="isCreatingCategory" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else :class="editingCategory ? 'bi bi-pencil-square' : 'bi bi-folder-plus'"></i>
            {{ isCreatingCategory ? (editingCategory ? 'Đang lưu...' : 'Đang tạo...') : (editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục') }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Doc Viewer Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="viewingDoc" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeDocViewer"></div>
        <div class="relative z-10 w-full max-w-5xl h-[88vh] bg-[#0f1117] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">

          <!-- Header -->
          <div class="flex items-center gap-3 px-5 py-3.5 border-b border-white/10 shrink-0">
            <div :class="['h-9 w-9 rounded-xl flex items-center justify-center text-base shrink-0 border border-white/5', getFileIconBg(viewingDoc.type)]">
              <i :class="getFileIcon(viewingDoc.type)"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-black text-white truncate">{{ viewingDoc.filename }}</p>
              <p class="text-[10px] text-gray-500 font-bold mt-0.5">
                {{ categoryLabels[viewingDoc.category] || viewingDoc.category }}
                · {{ formatFileSize(viewingDoc.file_size) }}
                · {{ formatDateLabel(viewingDoc.created_at) }}
              </p>
            </div>
            <div :class="['flex items-center gap-1.5 px-2.5 py-1 rounded-2xl text-[10px] font-black shrink-0', getStatusBadge(viewingDoc.status)]">
              <i :class="viewingDoc.status === 'completed' ? 'bi bi-check-circle-fill' : 'bi bi-hourglass-split'"></i>
              {{ getStatusLabel(viewingDoc.status) }}
            </div>
            <!-- Download button -->
            <button
              v-if="docPreviewUrl"
              @click="downloadDoc"
              :disabled="isDownloading"
              class="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition shrink-0 disabled:opacity-40"
              title="Tải xuống"
            >
              <i :class="isDownloading ? 'bi bi-arrow-repeat animate-spin text-xs' : 'bi bi-download text-xs'"></i>
            </button>
            <button @click="closeDocViewer" class="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition shrink-0">
              <i class="bi bi-x-lg text-xs"></i>
            </button>
          </div>

          <!-- Content area -->
          <div class="flex-1 overflow-hidden bg-[#080a0f] relative">

            <!-- Loading state -->
            <div v-if="isLoadingPreview" class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-600">
              <div class="h-8 w-8 border-2 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
              <p class="text-xs font-bold text-gray-500">Đang tải file...</p>
            </div>

            <!-- Error state -->
            <div v-else-if="previewError" class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-600 px-8">
              <div class="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">
                <i class="bi bi-exclamation-triangle text-red-400"></i>
              </div>
              <div class="text-center">
                <p class="text-sm font-black text-gray-400 mb-1">Không thể tải file</p>
                <p class="text-xs text-gray-600">{{ previewError }}</p>
              </div>
            </div>

            <!-- PDF: native browser render -->
            <iframe
              v-else-if="viewingDoc.type === 'pdf' && docPreviewUrl"
              :src="docPreviewUrl"
              class="w-full h-full border-0"
              @load="isLoadingPreview = false"
            ></iframe>

            <!-- DOCX / DOC: Google Docs Viewer (file phải public) hoặc fallback -->
            <iframe
              v-else-if="['docx', 'doc'].includes(viewingDoc.type) && docPreviewUrl"
              :src="`https://docs.google.com/gview?url=${encodeURIComponent(docPreviewUrl || '')}&embedded=true`"
              class="w-full h-full border-0"
              @load="isLoadingPreview = false"
            ></iframe>

            <!-- XLSX / XLS: Google Sheets Viewer -->
            <iframe
              v-else-if="['xlsx', 'xls'].includes(viewingDoc.type) && docPreviewUrl"
              :src="`https://docs.google.com/gview?url=${encodeURIComponent(docPreviewUrl || '')}&embedded=true`"
              class="w-full h-full border-0"
              @load="isLoadingPreview = false"
            ></iframe>

            <!-- TXT: fetch và render text -->
            <div
              v-else-if="viewingDoc.type === 'txt' && txtContent !== null"
              class="w-full h-full overflow-y-auto custom-scrollbar p-6"
            >
              <pre class="text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{{ txtContent }}</pre>
            </div>

            <!-- Fallback: không hỗ trợ preview -->
            <div v-else-if="!isLoadingPreview" class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-600">
              <div :class="['h-20 w-20 rounded-2xl flex items-center justify-center text-4xl border border-white/5', getFileIconBg(viewingDoc.type)]">
                <i :class="getFileIcon(viewingDoc.type)"></i>
              </div>
              <div class="text-center">
                <p class="text-sm font-black text-gray-400 mb-1">Không hỗ trợ xem trực tiếp</p>
                <p class="text-xs text-gray-600">Loại file <span class="uppercase font-black text-gray-400">{{ viewingDoc.type }}</span></p>
              </div>
              <a
                v-if="docPreviewUrl"
                :href="docPreviewUrl"
                target="_blank"
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-gray-300 hover:text-white hover:bg-white/10 transition"
              >
                <i class="bi bi-download"></i> Tải xuống
              </a>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useKnowledgeChat } from '~/composables/useKnowledgeChat'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '../../stores/auth'

interface AuthUser {
  display_name?: string
  full_name?: string
  name?: string
  email?: string
  role_id?: string
  permission_ids?: string[]
  [key: string]: any
}

definePageMeta({ middleware: ['auth', 'permission'] })

const auth = useAuthStore()
const authUser = computed((): AuthUser => (auth.user as unknown as AuthUser) || {})

// canView   : tất cả nhân viên đã đăng nhập (isMember | isAdmin | isSuperAdmin)
// canUpload : Admin trở lên (isAdminOnly | isSuperAdmin)
// canManage : SuperAdmin (isSuperAdmin)
const canView    = computed(() => auth.isMember || auth.isAdmin)
const canUpload  = computed(() => auth.isAdmin)
const canManage  = computed(() => auth.isSuperAdmin)

const { messages, isStreaming, threadId: currentThreadId, sendMessage, clearChat, activeProvider } = useKnowledgeChat()
const toast = useToast()

// ── Provider selector ──────────────────────────────────────────────────────
const providerOptions = [
  { value: 'auto',        label: 'Auto',       short: 'Auto', desc: 'Tự động chọn tốt nhất',   dot: 'w-1.5 h-1.5 rounded-full bg-emerald-400' },
  { value: 'gemini',      label: 'Gemini',     short: 'GEM',  desc: 'Google Gemini 2.0 Flash', dot: 'w-1.5 h-1.5 rounded-full bg-blue-400' },
  { value: 'huggingface', label: 'HuggingFace',short: 'HF',   desc: 'DeepSeek V3 via HF',     dot: 'w-1.5 h-1.5 rounded-full bg-yellow-400' },
  { value: 'peb',         label: 'PEB',        short: 'PEB',  desc: 'Qwen3 on-premise',        dot: 'w-1.5 h-1.5 rounded-full bg-purple-400' },
]
const selectedProvider = ref(providerOptions[0])
const showProviderDropdown = ref(false)
const providerDropdownRef = ref<HTMLElement | null>(null)
onClickOutside(providerDropdownRef, () => { showProviderDropdown.value = false })

// ── State ──────────────────────────────────────────────────────────────────
const input = ref('')
const history = ref<any[]>([])
const documents = ref<any[]>([])
const currentTab = ref<'chat' | 'files'>('chat')
const chatContainer = ref<HTMLElement | null>(null)
const showUploadModal = ref(false)
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const showSuggestions = ref(true)
const sidebarOpen = ref(true)
const threadSearch = ref('')
const threadSearchFocused = ref(false)
const fileSearch = ref('')
const activeCategory = ref('all')
const activeFileType = ref('all')
const activeStatusFilter = ref('')

// Export loading
const isExporting = ref(false)

// Share fallback
const isSharing = ref(false)
const shareUrl = ref('')
const copyShareUrlManual = () => {
  navigator.clipboard.writeText(shareUrl.value).catch(() => {})
  toast.success('Đã sao chép!')
}

// Create / Edit category modal
const showCreateCategoryModal = ref(false)
const isCreatingCategory = ref(false)
const editingCategory = ref<any>(null)
const newCategory = ref({ key: '', label: '', scope: 'internal' })
const categoryModalTitle = computed(() => editingCategory.value ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới')

const openCreateCategory = () => {
  editingCategory.value = null
  newCategory.value = { key: '', label: '', scope: 'internal' }
  showCreateCategoryModal.value = true
}

const openEditCategory = (cat: any) => {
  if (!canManage.value) return
  editingCategory.value = cat
  newCategory.value = { key: cat.key, label: cat.label, scope: cat.scope || 'internal' }
  showCreateCategoryModal.value = true
}

const closeCreateCategoryModal = () => {
  showCreateCategoryModal.value = false
  editingCategory.value = null
  newCategory.value = { key: '', label: '', scope: 'internal' }
}

const createCategory = async () => {
  if (!canUpload.value || !newCategory.value.key.trim() || !newCategory.value.label.trim()) return
  if (!editingCategory.value && !/^[a-z0-9-]+$/.test(newCategory.value.key)) {
    toast.error('Key chỉ được chứa chữ thường, số và dấu -')
    return
  }
  isCreatingCategory.value = true
  const { headers, base } = apiHeaders()
  try {
    const isEdit = !!editingCategory.value
    const url = isEdit
      ? `${base}/v1/knowledge/documents/categories/${editingCategory.value.key}`
      : `${base}/v1/knowledge/documents/categories`
    const method = isEdit ? 'PUT' : 'POST'
    const body = isEdit
      ? JSON.stringify({ label: newCategory.value.label, scope: newCategory.value.scope })
      : JSON.stringify(newCategory.value)
    const res = await fetch(url, { method, headers: { ...headers, 'Content-Type': 'application/json' }, body })
    if (res.ok) {
      toast.success(isEdit ? 'Đã cập nhật danh mục!' : 'Đã tạo danh mục mới!')
      closeCreateCategoryModal()
      fetchDocuments()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.detail || (isEdit ? 'Không thể cập nhật danh mục' : 'Không thể tạo danh mục'))
    }
  } catch { toast.error('Lỗi kết nối server') }
  finally { isCreatingCategory.value = false }
}

const confirmDeleteCategory = (cat: any) => {
  if (!canManage.value) return
  confirmState.value = {
    visible: true,
    title: 'Xóa danh mục',
    message: `Xóa danh mục "${cat.label}"? Tài liệu trong danh mục này sẽ chuyển về "Khác".`,
    type: 'danger',
    loading: false,
    onConfirm: async () => {
      confirmState.value.loading = true
      const { headers, base } = apiHeaders()
      try {
        const res = await fetch(`${base}/v1/knowledge/documents/categories/${cat.key}`, { method: 'DELETE', headers })
        if (res.ok) {
          confirmState.value.visible = false
          toast.success('Đã xóa danh mục')
          fetchDocuments()
        } else {
          const err = await res.json().catch(() => ({}))
          toast.error(err.detail || 'Không thể xóa danh mục')
        }
      } catch { toast.error('Lỗi kết nối server') }
      finally { confirmState.value.loading = false }
    }
  }
}

// Xóa tất cả tài liệu (SuperAdmin only)
const confirmDeleteAllDocs = () => {
  if (!canManage.value) return
  confirmState.value = {
    visible: true,
    title: 'Xóa tất cả tài liệu',
    message: 'Hành động này sẽ xóa TOÀN BỘ tài liệu trong kho tri thức và không thể hoàn tác. Bạn chắc chắn muốn tiếp tục?',
    type: 'danger',
    loading: false,
    onConfirm: async () => {
      confirmState.value.loading = true
      const { headers, base } = apiHeaders()
      try {
        const res = await fetch(`${base}/v1/knowledge/documents/all`, { method: 'DELETE', headers })
        if (res.ok) {
          documents.value = []
          confirmState.value.visible = false
          toast.success('Đã xóa toàn bộ tài liệu')
        } else {
          const err = await res.json().catch(() => ({}))
          toast.error(err.detail || 'Không thể xóa tài liệu')
        }
      } catch { toast.error('Lỗi kết nối server') }
      finally { confirmState.value.loading = false }
    }
  }
}

// Chat attach file
const chatAttachFile = ref<File | null>(null)
const handleChatAttach = (e: any) => {
  if (e.target.files?.[0]) chatAttachFile.value = e.target.files[0]
}

// Doc picker (chon tai lieu lam context)
const showDocPickerDropdown = ref(false)
const selectedContextDoc = ref<any>(null)
const docPickerSearch = ref('')
const filteredPickerDocs = computed(() => {
  const q = docPickerSearch.value.toLowerCase()
  return documents.value.filter(d =>
    d.status === 'completed' && (!q || d.filename.toLowerCase().includes(q))
  )
})
const selectContextDoc = (doc: any) => {
  selectedContextDoc.value = doc
  showDocPickerDropdown.value = false
  docPickerSearch.value = ''
}

// Doc viewer
const viewingDoc = ref<any>(null)
const docPreviewUrl = ref('')
const isLoadingPreview = ref(false)
const isDownloading = ref(false)
const previewError = ref<string | null>(null)
const txtContent = ref<string | null>(null)

const closeDocViewer = () => {
  viewingDoc.value = null
  docPreviewUrl.value = ''
  previewError.value = null
  txtContent.value = null
  isLoadingPreview.value = false
}

const downloadDoc = async () => {
  if (!docPreviewUrl.value || !viewingDoc.value || isDownloading.value) return
  isDownloading.value = true
  try {
    const res = await fetch(docPreviewUrl.value)
    if (!res.ok) { toast.error('Không thể tải file'); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = viewingDoc.value.filename || viewingDoc.value.original_name || 'download'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Đã tải xuống!')
  } catch { toast.error('Lỗi kết nối server') }
  finally { isDownloading.value = false }
}

const openDocViewerByFilename = async (filename: string) => {
  if (documents.value.length === 0) await fetchDocuments()
  const doc = documents.value.find(d => d.filename === filename)
  if (doc) {
    openDocViewer(doc)
  } else {
    // Doc not in list — open with minimal info so viewer shows error gracefully
    openDocViewer({ filename, type: filename.split('.').pop() ?? 'txt' })
  }
}

const openDocViewer = async (doc: any) => {
  viewingDoc.value = doc
  docPreviewUrl.value = ''
  previewError.value = null
  txtContent.value = null
  isLoadingPreview.value = true

  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/documents/${doc.id}/preview-url`, { headers })
    if (!res.ok) { previewError.value = 'Không thể lấy URL xem file'; isLoadingPreview.value = false; return }
    const data = await res.json()
    const fullUrl = `${base}${data.preview_url}`
    docPreviewUrl.value = fullUrl

    // Với TXT: fetch nội dung text luôn
    if (doc.type === 'txt') {
      const txtRes = await fetch(fullUrl)
      txtContent.value = txtRes.ok ? await txtRes.text() : 'Không thể tải nội dung file.'
    }
  } catch {
    previewError.value = 'Lỗi kết nối server'
  } finally {
    // Với PDF/Office: loading sẽ tắt khi iframe @load; TXT/error tắt ngay
    if (doc.type === 'txt' || previewError.value) isLoadingPreview.value = false
  }
}


// Summary modal
const showSummaryModal = ref(false)
const isSummarizing = ref(false)
const summaryText = ref('')
const summaryStatusMsg = ref('')

// Upload modal — scope & category
const uploadScope = ref<'internal' | 'public'>('internal')
const uploadCategory = ref('hr')

const internalCategories = [
  { value: 'hr',      label: 'Nhân sự & HR',       icon: 'bi bi-people-fill',            activeColor: 'text-emerald-400' },
  { value: 'legal',   label: 'Pháp lý',             icon: 'bi bi-file-earmark-text-fill', activeColor: 'text-blue-400'    },
  { value: 'process', label: 'Quy trình',            icon: 'bi bi-diagram-3-fill',         activeColor: 'text-purple-400'  },
  { value: 'finance', label: 'Tài chính',            icon: 'bi bi-graph-up-arrow',         activeColor: 'text-amber-400'   },
  { value: 'sop',     label: 'Chính sách & SOP',    icon: 'bi bi-clipboard2-check-fill',  activeColor: 'text-pink-400'    },
  { value: 'other',   label: 'Khác',                 icon: 'bi bi-three-dots',             activeColor: 'text-gray-300'    },
]

const categoryLabels: Record<string, string> = {
  hr: 'Nhân sự & HR', legal: 'Pháp lý', process: 'Quy trình',
  finance: 'Tài chính', sop: 'Chính sách & SOP', 'public-faq': 'FAQ & Hỗ trợ', other: 'Khác',
}

const currentCategoryLabel = computed(() => categoryLabels[uploadCategory.value] || uploadCategory.value)

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
  uploadScope.value = 'internal'
  uploadCategory.value = 'hr'
}

// Thread rename
const editingThreadId = ref<string | null>(null)
const editingTitle = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

const confirmState = ref({
  visible: false,
  title: '',
  message: '',
  type: 'danger' as 'danger' | 'warning' | 'info' | 'success',
  loading: false,
  onConfirm: () => {}
})

// ── Static config ──────────────────────────────────────────────────────────
const fileCategoryDefs = [
  { key: 'all', label: 'Tất cả tài liệu', icon: 'bi bi-folder-fill text-gray-400' },
  { key: 'hr', label: 'Nhân sự & HR', icon: 'bi bi-people-fill text-emerald-500' },
  { key: 'legal', label: 'Pháp lý & Hợp đồng', icon: 'bi bi-file-earmark-text-fill text-blue-500' },
  { key: 'process', label: 'Quy trình nội bộ', icon: 'bi bi-diagram-3-fill text-purple-500' },
  { key: 'finance', label: 'Báo cáo & Tài chính', icon: 'bi bi-graph-up-arrow text-amber-500' },
]

const fileCategories = computed(() =>
  fileCategoryDefs.map(c => ({
    ...c,
    count: c.key === 'all' ? documents.value.length : documents.value.filter(d => d.category === c.key).length
  }))
)

const fileTypeFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pdf', label: 'PDF' },
  { key: 'docx', label: 'Word' },
  { key: 'xlsx', label: 'Excel' },
]

// ── Computed ───────────────────────────────────────────────────────────────
const currentThreadTitle = computed(() => {
  if (!currentThreadId.value) return ''
  return history.value.find(h => h.id === currentThreadId.value)?.title || 'Cuộc hội thoại'
})

const filteredHistory = computed(() => {
  if (!threadSearch.value) return history.value
  const q = threadSearch.value.toLowerCase()
  return history.value.filter(h => (h.title || '').toLowerCase().includes(q))
})

const groupedFilteredHistory = computed(() => {
  const groups: Record<string, any[]> = { 'Hôm nay': [], 'Hôm qua': [], '7 ngày trước': [], 'Cũ hơn': [] }
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7)

  filteredHistory.value.forEach(item => {
    const d = new Date(item.created_at)
    if (d >= today) groups['Hôm nay'].push(item)
    else if (d >= yesterday) groups['Hôm qua'].push(item)
    else if (d >= lastWeek) groups['7 ngày trước'].push(item)
    else groups['Cũ hơn'].push(item)
  })
  return Object.fromEntries(Object.entries(groups).filter(([, v]) => v.length > 0))
})

const filteredDocuments = computed(() => {
  let list = documents.value
  // Member không thấy tài liệu admin-only
  if (!canUpload.value) list = list.filter(d => d.scope !== 'admin-only')
  if (activeCategory.value === 'admin-only') {
    list = list.filter(d => d.scope === 'admin-only')
  } else if (activeCategory.value !== 'all') {
    list = list.filter(d => d.category === activeCategory.value)
  }
  if (activeFileType.value !== 'all') list = list.filter(d => d.type === activeFileType.value)
  if (activeStatusFilter.value === 'indexed') list = list.filter(d => d.status === 'completed')
  if (activeStatusFilter.value === 'processing') list = list.filter(d => d.status === 'processing')
  if (fileSearch.value) {
    const q = fileSearch.value.toLowerCase()
    list = list.filter(d => d.filename?.toLowerCase().includes(q))
  }
  return list
})

// ── API helpers ────────────────────────────────────────────────────────────
const apiHeaders = () => {
  const token = useCookie('accessToken').value
  const config = useRuntimeConfig()
  return { headers: { 'Authorization': `Bearer ${token}` }, base: config.public.apiBase }
}

const fetchHistory = async () => {
  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/chat/history/threads`, { headers })
    if (res.ok) history.value = await res.json()
  } catch {}
}

const fetchDocuments = async () => {
  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/documents`, { headers })
    if (res.ok) documents.value = await res.json()
  } catch {}
}

// ── Thread actions ─────────────────────────────────────────────────────────
const startNewChat = () => {
  clearChat()
  currentThreadId.value = null
  showSuggestions.value = true
}

const loadThread = async (id: string) => {
  currentThreadId.value = id
  messages.value = []
  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/chat/history/${id}`, { headers })
    if (res.ok) {
      const data = await res.json()
      messages.value = data.map((m: any) => ({ role: m.role, content: m.content, sources: m.sources || [] }))
      nextTick(scrollToBottom)
    }
  } catch {}
}

const startEditThread = (item: any) => {
  editingThreadId.value = item.id
  editingTitle.value = item.title || ''
  nextTick(() => (titleInput.value as any)?.[0]?.focus())
}

const saveThreadTitle = async (id: string) => {
  if (!editingTitle.value.trim()) { editingThreadId.value = null; return }
  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/chat/history/${id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editingTitle.value.trim() })
    })
    if (res.ok) {
      const thread = history.value.find(h => h.id === id)
      if (thread) thread.title = editingTitle.value.trim()
      toast.success('Đã đổi tên hội thoại')
    }
  } catch {}
  editingThreadId.value = null
}

const confirmDeleteThread = (id: string) => {
  confirmState.value = {
    visible: true,
    title: 'Xóa hội thoại',
    message: 'Bạn có chắc chắn muốn xóa cuộc hội thoại này? Hành động này không thể hoàn tác.',
    type: 'danger',
    loading: false,
    onConfirm: async () => {
      confirmState.value.loading = true
      const { headers, base } = apiHeaders()
      try {
        const res = await fetch(`${base}/v1/knowledge/chat/history/${id}`, { method: 'DELETE', headers })
        if (res.ok) {
          history.value = history.value.filter(h => h.id !== id)
          if (currentThreadId.value === id) startNewChat()
          confirmState.value.visible = false
          toast.success('Đã xóa cuộc hội thoại')
        }
      } catch { toast.error('Lỗi khi xóa hội thoại') }
      finally { confirmState.value.loading = false }
    }
  }
}

const exportThread = async () => {
  if (!currentThreadId.value || isExporting.value) return
  isExporting.value = true
  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/chat/history/${currentThreadId.value}/export`, { headers })
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentThreadTitle.value || 'chat'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Đã tải xuống!')
    } else {
      toast.error('Không thể xuất hội thoại')
    }
  } catch { toast.error('Lỗi kết nối server') }
  finally { isExporting.value = false }
}

const summarizeThread = async () => {
  showSummaryModal.value = true
  isSummarizing.value = true
  summaryText.value = ''
  summaryStatusMsg.value = 'Đang khởi tạo...'
  const { headers, base } = apiHeaders()

  try {
    // Bước 1: enqueue job — trả về ngay lập tức
    const enqueueRes = await fetch(`${base}/v1/knowledge/chat/history/${currentThreadId.value}/summarize`, { method: 'POST', headers })
    if (!enqueueRes.ok) { summaryText.value = 'Không thể tóm tắt lúc này. Vui lòng thử lại.'; return }
    const { job_id } = await enqueueRes.json()

    // Bước 2: polling cho đến khi done/failed (tối đa 3 phút)
    summaryStatusMsg.value = 'AI đang xử lý...'
    const maxAttempts = 36  // 36 × 5s = 3 phút
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 5000))
      const pollRes = await fetch(`${base}/v1/knowledge/chat/summarize/job/${job_id}`, { headers })
      if (!pollRes.ok) continue
      const job = await pollRes.json()

      if (job.status === 'done') {
        summaryText.value = job.summary || 'Không có nội dung để tóm tắt.'
        return
      }
      if (job.status === 'failed') {
        summaryText.value = 'AI tạm thời quá tải. Vui lòng thử lại sau vài phút.'
        return
      }
      if (job.status === 'retrying') {
        summaryStatusMsg.value = `AI đang thử lại (${job.retries}/5)...`
      }
    }
    summaryText.value = 'Hết thời gian chờ. Vui lòng thử lại.'
  } catch {
    summaryText.value = 'Lỗi kết nối server.'
  } finally {
    isSummarizing.value = false
    summaryStatusMsg.value = ''
  }
}

const shareThread = async () => {
  if (!currentThreadId.value || isSharing.value) return
  isSharing.value = true
  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/chat/history/${currentThreadId.value}/share`, { method: 'POST', headers })
    if (res.ok) {
      const data = await res.json()
      try {
        await navigator.clipboard.writeText(data.share_url)
        toast.success('Đã sao chép link chia sẻ (hết hạn sau 7 ngày)')
      } catch {
        // Clipboard bị từ chối → hiển thị fallback modal
        shareUrl.value = data.share_url
      }
    } else {
      toast.error('Không thể tạo link chia sẻ')
    }
  } catch { toast.error('Lỗi kết nối server') }
  finally { isSharing.value = false }
}

// ── Message actions ────────────────────────────────────────────────────────
const handleSend = async () => {
  if (!input.value.trim() && !chatAttachFile.value) return
  const text = input.value
  input.value = ''
  showSuggestions.value = false
  showDocPickerDropdown.value = false

  // Upload file đính kèm trước nếu có
  let attachId: string | null = null
  if (chatAttachFile.value) {
    const { headers, base } = apiHeaders()
    const fd = new FormData()
    fd.append('file', chatAttachFile.value)
    try {
      const res = await fetch(`${base}/v1/knowledge/chat/attach`, { method: 'POST', headers, body: fd })
      if (res.ok) {
        const d = await res.json()
        attachId = d.attach_id
      } else {
          toast.error('Không thể đính kèm file')
      }
    } catch { toast.error('Lỗi kết nối server') }
    chatAttachFile.value = null
  }

  // Ghép context doc + attach_id vào prompt
  const parts: string[] = []
  if (selectedContextDoc.value) parts.push(`[Tài liệu: ${selectedContextDoc.value.filename}]`)
  if (attachId) parts.push(`[File đính kèm: ${attachId}]`)
  if (text) parts.push(text)
  const finalText = parts.join('\n')

  await sendMessage(finalText, 'internal', selectedProvider.value?.value ?? 'auto')
  selectedContextDoc.value = null
  fetchHistory()
}

const handleSendQuick = async (text: string) => {
  input.value = text
  await handleSend()
}

const retryMessage = async (index: number) => {
  const userMsg = messages.value[index - 1]
  if (!userMsg) return
  messages.value.splice(index, 1)
  await sendMessage(userMsg.content, 'internal', selectedProvider.value?.value ?? 'auto')
}

const sendFeedback = async (msg: any, rating: 1 | -1) => {
  if (msg.feedback === rating) return
  msg.feedback = rating
  const { headers, base } = apiHeaders()
  try {
    await fetch(`${base}/v1/knowledge/chat/feedback`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id: msg.id, rating })
    })
  } catch {}
  toast.success(rating === 1 ? 'Cảm ơn phản hồi hữu ích!' : 'Đã ghi nhận phản hồi')
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success('Đã sao chép vào bộ nhớ tạm')
}

// ── Document actions ───────────────────────────────────────────────────────
const toggleDocScope = async (doc: any) => {
  if (!canUpload.value) return
  const newScope = doc.scope === 'admin-only' ? 'internal' : 'admin-only'
  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/documents/${doc.id}/scope`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ scope: newScope }),
    })
    if (res.ok) {
      doc.scope = newScope
      toast.success(newScope === 'admin-only' ? 'Đã chuyển sang chỉ Admin' : 'Đã chuyển về Nội bộ')
    } else {
      toast.error('Không thể đổi quyền truy cập')
    }
  } catch { toast.error('Loi ket noi server') }
}

const confirmDeleteDoc = (id: number) => {
  if (!canUpload.value) return
  confirmState.value = {
    visible: true,
    title: 'Xóa tài liệu tri thức',
    message: 'Bạn có chắc chắn muốn xóa tài liệu này? Mọi tri thức liên quan sẽ bị loại bỏ khỏi AI.',
    type: 'danger',
    loading: false,
    onConfirm: async () => {
      confirmState.value.loading = true
      const { headers, base } = apiHeaders()
      try {
        const res = await fetch(`${base}/v1/knowledge/documents/${id}`, { method: 'DELETE', headers })
        if (res.ok) {
          documents.value = documents.value.filter(d => d.id !== id)
          confirmState.value.visible = false
          toast.success('Đã xóa tài liệu thành công')
        }
      } catch { toast.error('Lỗi khi xóa tài liệu') }
      finally { confirmState.value.loading = false }
    }
  }
}

const handleFileChange = (e: any) => {
  if (e.target.files?.[0]) selectedFile.value = e.target.files[0]
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files?.[0]) selectedFile.value = e.dataTransfer.files[0]
}

const handleDropInList = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files?.[0]) {
    selectedFile.value = e.dataTransfer.files[0]
    showUploadModal.value = true
  }
}

const uploadFile = async () => {
  if (!canUpload.value || !selectedFile.value) return
  isUploading.value = true
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('scope', uploadScope.value)
  formData.append('category', uploadScope.value === 'public' ? 'public-faq' : uploadCategory.value)
  const { headers, base } = apiHeaders()
  try {
    const res = await fetch(`${base}/v1/knowledge/documents/upload`, {
      method: 'POST',
      headers,
      body: formData
    })
    if (res.ok) {
      const data = await res.json()
      toast.success(data.message || 'Tài liệu đã được nạp thành công!')
      closeUploadModal()
      fetchDocuments()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.detail || 'Lỗi tải lên tài liệu')
    }
  } catch { toast.error('Lỗi kết nối server') }
  finally { isUploading.value = false }
}

const switchToFiles = () => {
  currentTab.value = 'files'
  fetchDocuments()
}

// ── Helpers ────────────────────────────────────────────────────────────────
const scrollToBottom = () => {
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}

const formatDateLabel = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

const formatDateMini = (dateStr: string) => {
  const d = new Date(dateStr)
  if (d.toDateString() === new Date().toDateString()) return 'Hôm nay'
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const formatFileSize = (bytes: number) => {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const getFileIcon = (type: string) => {
  if (type === 'pdf') return 'bi bi-file-earmark-pdf-fill text-red-400'
  if (['docx', 'doc'].includes(type)) return 'bi bi-file-earmark-word-fill text-blue-400'
  if (['xlsx', 'xls'].includes(type)) return 'bi bi-file-earmark-spreadsheet-fill text-emerald-400'
  return 'bi bi-file-earmark-text-fill text-gray-400'
}

const getFileIconBg = (type: string) => {
  if (type === 'pdf') return 'bg-red-500/10'
  if (['docx', 'doc'].includes(type)) return 'bg-blue-500/10'
  if (['xlsx', 'xls'].includes(type)) return 'bg-emerald-500/10'
  return 'bg-white/5'
}

const getInitials = (str: string) => {
  if (!str) return '?'
  const parts = str.trim().split(/\s+/).filter(Boolean)
  if (parts.length > 1) return ((parts[0]?.charAt(0) ?? '') + (parts[parts.length - 1]?.charAt(0) ?? '')).toUpperCase()
  return str.slice(0, 2).toUpperCase()
}

const getSourceIcon = (filename: string) => {
  if (filename.endsWith('.pdf')) return 'bi bi-file-earmark-pdf text-red-400'
  if (filename.match(/\.docx?$/)) return 'bi bi-file-earmark-word text-blue-400'
  return 'bi bi-file-earmark-text text-gray-400'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = { pending: 'Đang chờ', processing: 'Đang xử lý', completed: 'Sẵn sàng', error: 'Lỗi' }
  return map[status] || status
}

const getStatusBadge = (status: string) => {
  if (status === 'completed') return 'bg-emerald-500/15 text-emerald-400'
  if (status === 'processing') return 'bg-amber-500/15 text-amber-400'
  if (status === 'error') return 'bg-red-500/15 text-red-400'
  return 'bg-white/5 text-gray-500'
}

// ── Watchers & lifecycle ───────────────────────────────────────────────────
watch(messages, () => nextTick(scrollToBottom), { deep: true })

// Fetch docs khi mở picker lần đầu
watch(showDocPickerDropdown, (open) => {
  if (open && documents.value.length === 0) fetchDocuments()
})

// Click-outside đóng doc picker
const handleClickOutside = (e: MouseEvent) => {
  if (!showDocPickerDropdown.value) return
  const target = e.target as HTMLElement
  if (!target.closest('[data-doc-picker]')) showDocPickerDropdown.value = false
}

onMounted(() => {
  fetchHistory()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }

.markdown-content :deep(strong) { color: #fff; font-weight: 900; }
.markdown-content :deep(p) { margin-bottom: 0.5rem; }
.markdown-content :deep(p:last-child) { margin-bottom: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-4px); }

.sidebar-enter-active, .sidebar-leave-active { transition: width 0.22s ease, opacity 0.18s ease; overflow: hidden; }
.sidebar-enter-from, .sidebar-leave-to { width: 0 !important; opacity: 0; }
.sidebar-enter-to, .sidebar-leave-from { width: 16rem; opacity: 1; }
</style>
