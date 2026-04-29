<template>
  <div class="flex-1 min-h-0 flex flex-col bg-gray-50">
    <ToastContainer />
    <ConfirmModal
      :is-visible="showConfirm"
      :title="confirmData.title"
      :message="confirmData.message"
      :type="confirmData.type"
      :confirm-text="confirmData.confirmText"
      @confirm="confirmData.onConfirm"
      @cancel="showConfirm = false"
    />

    <!-- Header -->
    <div class="bg-white border-b border-gray-200 shrink-0">
      <div class="px-4 sm:px-6 py-3">
        <div class="flex items-center justify-between mb-3">
          <NuxtLink to="/support" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <i class="bi bi-arrow-left"></i>
            <span>Quay lại</span>
          </NuxtLink>

          <!-- Actions (chỉ hiện nếu canManage hoặc superAdmin) -->
          <div v-if="ticket && ticket.status !== 'closed'" class="flex items-center gap-2">
            <!-- Claim button — hiện khi chưa có assignedTo và user có thể claim -->
            <button
              v-if="canClaim"
              @click="claimTicket"
              :disabled="claiming"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors disabled:opacity-60"
            >
              <div v-if="claiming" class="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <i v-else class="bi bi-hand-index-thumb"></i>
              <span class="hidden sm:inline">{{ claiming ? 'Đang nhận...' : 'Nhận xử lý' }}</span>
            </button>

            <!-- SuperAdmin: Lock/Unlock -->
            <template v-if="isSuperAdmin">
              <button
                v-if="ticket.isLocked"
                @click="unlockTicket"
                :disabled="locking"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors disabled:opacity-60"
              >
                <i class="bi bi-unlock"></i>
                <span class="hidden sm:inline">Mở khóa</span>
              </button>
              <button
                v-else
                @click="lockTicket"
                :disabled="locking"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-60"
              >
                <i class="bi bi-lock"></i>
                <span class="hidden sm:inline">Khóa ticket</span>
              </button>
            </template>

            <!-- Status dropdown — chỉ canManage -->
            <div v-if="canManage" class="relative" ref="statusDropdownRef">
              <button @click="showStatusDropdown = !showStatusDropdown" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                <i class="bi bi-arrow-repeat"></i>
                <span class="hidden sm:inline">Trạng thái</span>
                <i class="bi bi-chevron-down text-xs"></i>
              </button>
              <div v-if="showStatusDropdown" class="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-1 overflow-hidden">
                <button v-for="s in statusOptions" :key="s.value" @click="changeStatus(s.value)" :disabled="ticket.status === s.value"
                  class="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">
                  <span :class="['w-2 h-2 rounded-full', s.dot]"></span>
                  {{ s.label }}
                </button>
              </div>
            </div>

            <!-- Priority dropdown — chỉ canManage -->
            <div v-if="canManage" class="relative" ref="priorityDropdownRef">
              <button @click="showPriorityDropdown = !showPriorityDropdown" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                <i class="bi bi-flag"></i>
                <span class="hidden sm:inline">Ưu tiên</span>
                <i class="bi bi-chevron-down text-xs"></i>
              </button>
              <div v-if="showPriorityDropdown" class="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-1 overflow-hidden">
                <button v-for="p in priorityOptions" :key="p.value" @click="changePriority(p.value)" :disabled="ticket.priority === p.value"
                  class="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-colors">
                  <span :class="['text-xs font-bold', p.color]">{{ p.icon }}</span>
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Resolve Ticket — chỉ canManage, không hiện khi đã resolved -->
            <button
              v-if="canManage && ticket.status !== 'resolved'"
              @click="openResolveConfirm"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
            >
              <i class="bi bi-check-circle"></i>
              <span class="hidden sm:inline">Hoàn thành</span>
            </button>

            <!-- Close Ticket — chỉ canManage -->
            <button v-if="canManage" @click="openCloseConfirm" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
              <i class="bi bi-x-circle"></i>
              <span class="hidden sm:inline">Đóng</span>
            </button>
          </div>

          <div v-else-if="ticket && ticket.status === 'closed'" class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-500">
            <i class="bi bi-lock mr-1"></i> Ticket đã đóng
          </div>
        </div>

        <!-- Title Row -->
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-linear-to-br from-emerald-500 via-teal-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <i class="bi bi-ticket-detailed text-white text-xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-xl font-bold text-gray-900">{{ ticket?.ticketNumber }}</h1>
              <span v-if="ticket" class="px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset" :class="getStatusClass(ticket.status)">
                {{ getStatusLabel(ticket.status) }}
              </span>
              <span v-if="ticket" class="px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset" :class="getPriorityClass(ticket.priority)">
                {{ getPriorityLabel(ticket.priority) }}
              </span>
              <span v-if="ticket?.source === 'contact_form'" class="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700 ring-1 ring-teal-200">
                <i class="bi bi-send mr-1"></i>Contact Form
              </span>
              <!-- Locked badge -->
              <span v-if="ticket?.isLocked" class="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 ring-1 ring-red-200">
                <i class="bi bi-shield-lock mr-1"></i>Đã khóa
              </span>
            </div>
            <p class="text-sm text-gray-500 truncate mt-0.5">{{ ticket?.subject }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Đang tải ticket...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!ticket" class="flex-1 overflow-auto px-6 py-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="bi bi-exclamation-circle text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Không Tìm Thấy Ticket</h3>
        <p class="text-gray-500 mb-6">Ticket không tồn tại hoặc đã bị xoá.</p>
        <NuxtLink to="/support" class="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 text-white rounded-lg font-medium">
          <i class="bi bi-arrow-left"></i> Quay Lại Danh Sách
        </NuxtLink>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="flex-1 overflow-hidden px-4 py-4">
      <div class="h-full flex flex-col lg:grid lg:grid-cols-[380px_1fr] gap-4">

        <!-- Left: Info Panel -->
        <div class="hidden lg:flex flex-col gap-4 overflow-auto pr-1">

          <!-- Assigned / Locked Banner -->
          <div v-if="ticket.isLocked" class="bg-red-50 border border-red-200 rounded-xl p-4 shrink-0">
            <div class="flex items-start gap-3">
              <i class="bi bi-shield-lock text-red-500 text-lg shrink-0 mt-0.5"></i>
              <div>
                <p class="text-sm font-semibold text-red-700">Ticket đã bị khóa</p>
                <p class="text-xs text-red-500 mt-0.5">Chỉ SuperAdmin mới có thể can thiệp ticket này.</p>
              </div>
            </div>
          </div>

          <div v-else-if="ticket.assignedTo" class="bg-blue-50 border border-blue-200 rounded-xl p-4 shrink-0">
            <div class="flex items-start gap-3">
              <i class="bi bi-person-check text-blue-500 text-lg shrink-0 mt-0.5"></i>
              <div>
                <p class="text-xs text-blue-500 font-medium uppercase tracking-wider">Đang được xử lý bởi</p>
                <p class="text-sm font-semibold text-blue-800 mt-0.5">{{ ticket.assignedToName || 'Admin' }}</p>
                <p v-if="ticket.assignedAt" class="text-xs text-blue-400 mt-0.5">Từ {{ formatFullDate(ticket.assignedAt) }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="isAdminOrAbove" class="bg-amber-50 border border-amber-200 rounded-xl p-4 shrink-0">
            <div class="flex items-start gap-3">
              <i class="bi bi-inbox text-amber-500 text-lg shrink-0 mt-0.5"></i>
              <div>
                <p class="text-sm font-semibold text-amber-700">Chưa có người nhận xử lý</p>
                <p class="text-xs text-amber-500 mt-0.5">Nhấn "Nhận xử lý" để tiếp nhận ticket này.</p>
              </div>
            </div>
          </div>

          <!-- Submitter Info -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 shrink-0">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Người gửi</h3>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <i class="bi bi-person text-emerald-600"></i>
              </div>
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 text-sm truncate">
                  {{ ticket.guestDisplayName || ticket.userName || 'Ẩn danh' }}
                </p>
                <p class="text-xs text-gray-500 truncate">{{ ticket.userEmail || ticket.contactEmail || '—' }}</p>
              </div>
            </div>
          </div>

          <!-- Ticket Metadata -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 shrink-0">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Thông tin ticket</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Trạng thái</span>
                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(ticket.status)">{{ getStatusLabel(ticket.status) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Ưu tiên</span>
                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="getPriorityClass(ticket.priority)">{{ getPriorityLabel(ticket.priority) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Danh mục</span>
                <span class="text-xs font-medium text-gray-700">{{ getCategoryLabel(ticket.category) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Ngày tạo</span>
                <span class="text-xs text-gray-700">{{ formatFullDate(ticket.createdAt) }}</span>
              </div>
              <div v-if="ticket.updatedAt" class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Cập nhật</span>
                <span class="text-xs text-gray-700">{{ formatFullDate(ticket.updatedAt) }}</span>
              </div>
              <div v-if="ticket.source" class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Nguồn</span>
                <span class="text-xs font-medium text-teal-600">{{ ticket.source === 'contact_form' ? 'Contact Form' : 'Trực tiếp' }}</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white rounded-xl border border-gray-200 p-4 shrink-0">
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
              <i class="bi bi-file-text text-gray-500"></i> Mô Tả Vấn Đề
            </h3>
            <p class="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{{ ticket.description }}</p>
            <div v-if="ticket.attachments?.length" class="mt-4 pt-4 border-t border-gray-100">
              <h4 class="text-xs font-medium text-gray-500 mb-2">
                <i class="bi bi-paperclip mr-1"></i>Đính kèm ({{ ticket.attachments.length }})
              </h4>
              <div class="flex gap-2 flex-wrap">
                <a v-for="(att, idx) in ticket.attachments" :key="idx" :href="att.url" target="_blank" class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-emerald-300 transition-colors">
                  <img :src="att.url" class="w-full h-full object-cover" />
                </a>
              </div>
            </div>
          </div>

          <!-- Resolution Panel — chỉ canManage -->
          <div v-if="canManage" class="bg-white rounded-xl border border-gray-200 p-4 shrink-0">
            <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
              <i class="bi bi-check2-square text-green-600"></i> Ghi chú giải pháp
            </h3>
            <div v-if="ticket.resolution && !editingResolution" class="mb-3">
              <p class="text-sm text-gray-700 whitespace-pre-wrap bg-green-50 rounded-lg p-3 border border-green-100">{{ ticket.resolution }}</p>
              <button @click="editingResolution = true; resolutionText = ticket.resolution" class="mt-2 text-xs text-emerald-600 hover:underline">
                <i class="bi bi-pencil mr-1"></i>Chỉnh sửa
              </button>
            </div>
            <div v-if="!ticket.resolution || editingResolution">
              <textarea
                v-model="resolutionText"
                rows="3"
                placeholder="Ghi chú cách giải quyết vấn đề..."
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              ></textarea>
              <div class="flex gap-2 mt-2">
                <button @click="saveResolution" :disabled="!resolutionText.trim() || savingResolution" class="flex-1 py-2 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 text-white text-xs font-medium rounded-lg disabled:opacity-50 transition-colors">
                  <span v-if="savingResolution" class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                  {{ savingResolution ? 'Đang lưu...' : 'Lưu giải pháp' }}
                </button>
                <button v-if="editingResolution" @click="editingResolution = false" class="px-3 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Quick Buttons -->
        <div class="lg:hidden flex gap-2 order-2">
          <button @click="showInfoModal = true" class="flex-1 bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-2 mb-1">
              <i class="bi bi-info-circle text-gray-500 text-xs"></i>
              <span class="text-xs font-medium text-gray-700">Thông tin</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(ticket.status)">{{ getStatusLabel(ticket.status) }}</span>
          </button>
          <button @click="showDescModal = true" class="flex-1 bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-2 mb-1">
              <i class="bi bi-file-text text-gray-500 text-xs"></i>
              <span class="text-xs font-medium text-gray-700">Mô tả</span>
            </div>
            <p class="text-xs text-gray-500 line-clamp-1">{{ ticket.description }}</p>
          </button>
        </div>

        <!-- Right: Conversation -->
        <div class="flex bg-white rounded-xl border border-gray-200 flex-col overflow-hidden order-1 lg:order-0 flex-1">
          <!-- Chat Header -->
          <div class="px-4 py-3 border-b border-gray-100 shrink-0 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 flex items-center gap-2 text-sm">
              <i class="bi bi-chat-dots text-gray-500"></i>
              Trao Đổi ({{ ticket.comments?.length || 0 }})
            </h3>
            <!-- SSE live indicator -->
            <span v-if="sseConnected" class="flex items-center gap-1 text-xs text-green-600">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-auto p-4 space-y-3">
            <template v-if="ticket.comments?.length">
              <div
                v-for="(comment, idx) in ticket.comments"
                :key="comment.id || idx"
                class="flex gap-2 group"
                :class="isSelfComment(comment) ? 'flex-row-reverse' : 'flex-row'"
              >
                <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium"
                  :class="comment.isSuperAdmin ? 'bg-purple-100 text-purple-700' : comment.isAdmin ? 'bg-lime-100 text-lime-700' : 'bg-emerald-100 text-emerald-700'">
                  <i :class="comment.isSuperAdmin ? 'bi bi-shield-fill-check' : comment.isAdmin ? 'bi bi-shield-check' : 'bi bi-person'"></i>
                </div>
                <div class="flex-1 max-w-[75%] p-3 rounded-xl relative"
                  :class="isSelfComment(comment) ? 'bg-lime-50 rounded-tr-none' : 'bg-emerald-50 rounded-tl-none'">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-xs font-medium" :class="comment.isSuperAdmin ? 'text-purple-700' : comment.isAdmin ? 'text-lime-700' : 'text-emerald-700'">
                      {{ comment.userName || (comment.isAdmin ? 'Admin' : 'User') }}
                    </span>
                    <span v-if="comment.isSuperAdmin" class="text-xs px-1 py-0.5 bg-purple-100 text-purple-600 rounded">SuperAdmin</span>
                    <span v-else-if="comment.isAdmin" class="text-xs px-1 py-0.5 bg-lime-100 text-lime-600 rounded">Admin</span>
                    <span class="text-gray-400" style="font-size:10px">{{ formatTime(comment.createdAt) }}</span>
                    <button v-if="canDeleteComment(comment)" @click="deleteComment(comment.id)"
                      class="ml-auto opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-all">
                      <i class="bi bi-trash text-xs"></i>
                    </button>
                  </div>
                  <p class="text-gray-700 text-sm whitespace-pre-wrap">{{ comment.message }}</p>
                  <div v-if="comment.attachments?.length" class="mt-2 flex gap-1 flex-wrap">
                    <a v-for="(att, i) in comment.attachments" :key="i" :href="att.url" target="_blank" class="w-12 h-12 rounded overflow-hidden border border-gray-200">
                      <img :src="att.url" class="w-full h-full object-cover" />
                    </a>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="text-center py-8 text-gray-400">
              <i class="bi bi-chat text-2xl mb-2 block"></i>
              <p class="text-sm">Chưa có trao đổi nào</p>
            </div>
          </div>

          <!-- Reply Form — mọi role đã đăng nhập khi ticket chưa đóng -->
          <div v-if="ticket.status !== 'closed'" class="border-t border-gray-100 p-3 shrink-0">
            <div v-if="commentAttachments.length" class="flex gap-2 mb-3 flex-wrap">
              <div v-for="(att, idx) in commentAttachments" :key="idx" class="relative group">
                <img :src="att.preview" class="w-14 h-14 object-cover rounded-lg border-2 transition-all"
                  :class="att.uploading ? 'border-emerald-400 opacity-60' : att.error ? 'border-red-400' : 'border-gray-200'" />
                <div v-if="att.uploading" class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <button v-if="!att.uploading" @click="removeCommentAttachment(idx)"
                  class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
            <div class="flex gap-2 items-end">
              <input ref="commentFileInput" type="file" accept="image/png,image/jpeg" multiple class="hidden" @change="handleCommentFiles" />
              <button type="button" @click="$refs.commentFileInput.click()" :disabled="commentAttachments.length >= 3 || submittingComment"
                class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors shrink-0 disabled:opacity-50">
                <i class="bi bi-image text-lg"></i>
              </button>
              <textarea
                v-model="newComment"
                rows="1"
                :disabled="submittingComment"
                class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none disabled:bg-gray-50"
                :placeholder="isAdminOrAbove ? 'Nhập phản hồi (Ctrl+Enter để gửi)...' : 'Nhập tin nhắn (Ctrl+Enter để gửi)...'"
                @keydown.ctrl.enter="addComment"
              ></textarea>
              <button @click="addComment" :disabled="(!newComment.trim() && !commentAttachments.length) || submittingComment"
                class="px-4 py-2 bg-linear-to-r from-emerald-500 via-teal-500 to-lime-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center gap-2 transition-all">
                <div v-if="submittingComment" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <i v-else class="bi bi-send"></i>
                <span class="hidden sm:inline">{{ submittingComment ? 'Đang gửi...' : 'Gửi' }}</span>
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1.5">Ctrl+Enter để gửi · PNG, JPG · Tối đa 3 ảnh · 20MB/ảnh</p>
          </div>

          <div v-else class="border-t border-gray-100 p-4 text-center text-sm text-gray-400 shrink-0">
            <i class="bi bi-lock mr-1"></i> Ticket đã đóng, không thể thêm phản hồi
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: Info Modal -->
    <div v-if="showInfoModal && ticket" class="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl w-11/12 max-w-md max-h-[90vh] overflow-auto">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-semibold text-gray-900">Thông Tin Ticket</h3>
          <button @click="showInfoModal = false" class="p-1 hover:bg-gray-100 rounded-lg"><i class="bi bi-x text-gray-500"></i></button>
        </div>
        <div class="p-4 space-y-4">
          <!-- Assigned/Locked in modal -->
          <div v-if="ticket.isLocked" class="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
            <i class="bi bi-shield-lock mr-1"></i>Ticket đã bị khóa — chỉ SuperAdmin can thiệp
          </div>
          <div v-else-if="ticket.assignedTo" class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
            <i class="bi bi-person-check mr-1"></i>Đang xử lý bởi: <strong>{{ ticket.assignedToName || ticket.assignedTo }}</strong>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="text-xs text-gray-500 block mb-1">Trạng thái</label><span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(ticket.status)">{{ getStatusLabel(ticket.status) }}</span></div>
            <div><label class="text-xs text-gray-500 block mb-1">Ưu tiên</label><span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="getPriorityClass(ticket.priority)">{{ getPriorityLabel(ticket.priority) }}</span></div>
            <div><label class="text-xs text-gray-500 block mb-1">Danh mục</label><span class="text-sm text-gray-700">{{ getCategoryLabel(ticket.category) }}</span></div>
            <div><label class="text-xs text-gray-500 block mb-1">Ngày tạo</label><span class="text-sm text-gray-700">{{ formatFullDate(ticket.createdAt) }}</span></div>
          </div>
          <div v-if="canManage && ticket.status !== 'closed'" class="pt-4 border-t border-gray-100 space-y-2">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</p>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="s in statusOptions" :key="s.value" @click="changeStatus(s.value); showInfoModal = false" :disabled="ticket.status === s.value"
                class="py-2 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center gap-1">
                <span :class="['w-2 h-2 rounded-full', s.dot]"></span>{{ s.label }}
              </button>
            </div>
            <button @click="openCloseConfirm(); showInfoModal = false" class="w-full py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors">
              <i class="bi bi-x-circle mr-1"></i>Đóng ticket
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: Description Modal -->
    <div v-if="showDescModal && ticket" class="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl w-11/12 max-w-md max-h-[90vh] overflow-auto">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-semibold text-gray-900">Mô Tả Vấn Đề</h3>
          <button @click="showDescModal = false" class="p-1 hover:bg-gray-100 rounded-lg"><i class="bi bi-x text-gray-500"></i></button>
        </div>
        <div class="p-4">
          <p class="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{{ ticket.description }}</p>
          <div v-if="ticket.resolution" class="mt-4 pt-4 border-t border-gray-100">
            <h4 class="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2"><i class="bi bi-check-circle text-green-600"></i>Giải Pháp</h4>
            <p class="text-green-700 text-sm whitespace-pre-wrap">{{ ticket.resolution }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'permission'] })

const route        = useRoute()
const ticketApi    = useTicketApi()
const { success, error: showError } = useToast()
const authStore    = useAuthStore()

const ticket             = ref(null)
const loading            = ref(true)
const newComment         = ref('')
const commentAttachments = ref([])
const submittingComment  = ref(false)
const messagesContainer  = ref(null)
const resolutionText     = ref('')
const editingResolution  = ref(false)
const savingResolution   = ref(false)
const claiming           = ref(false)
const locking            = ref(false)
const sseConnected       = ref(false)

const showStatusDropdown   = ref(false)
const showPriorityDropdown = ref(false)
const showInfoModal        = ref(false)
const showDescModal        = ref(false)
const showConfirm          = ref(false)
const confirmData          = ref({ title: '', message: '', type: 'warning', confirmText: 'Xác nhận', onConfirm: () => {} })

let sseSource = null

// ── Role helpers ──────────────────────────────────────────────────────────────
const isSuperAdmin    = computed(() => authStore.isSuperAdmin)
const isAdminOrAbove  = computed(() => authStore.isSuperAdmin || authStore.isAdmin)
// portal_user_id là field dùng trong assigned_to trên backend
const currentUserId   = computed(() =>
  authStore.user?.portal_user_id ||
  authStore.user?._id ||
  authStore.user?.id ||
  authStore.user?.user_id
)

// canClaim: admin/superAdmin, ticket not locked, not already assigned (or superAdmin overrides)
const canClaim = computed(() => {
  if (!ticket.value || ticket.value.status === 'closed') return false
  if (ticket.value.isLocked && !isSuperAdmin.value) return false
  if (!isAdminOrAbove.value) return false
  if (!ticket.value.assignedTo) return true
  // SuperAdmin can always reclaim
  return isSuperAdmin.value
})

// canManage: superAdmin luôn manage được.
// Admin: manage nếu là người đang được assigned, HOẶC ticket chưa có ai nhận (unassigned).
// Locked ticket: chỉ superAdmin.
const canManage = computed(() => {
  if (!ticket.value || ticket.value.status === 'closed') return false
  if (ticket.value.isLocked) return isSuperAdmin.value
  if (isSuperAdmin.value) return true
  if (!isAdminOrAbove.value) return false
  // Admin: assigned to me OR unassigned
  return !ticket.value.assignedTo || ticket.value.assignedTo === currentUserId.value
})

// ── Status / Priority options ─────────────────────────────────────────────────
const statusOptions = [
  { value: 'open',        label: 'Mở',            dot: 'bg-teal-500'   },
  { value: 'in_progress', label: 'Đang xử lý',    dot: 'bg-amber-500'  },
  { value: 'waiting',     label: 'Chờ phản hồi',  dot: 'bg-lime-500'   },
  { value: 'resolved',    label: 'Đã giải quyết', dot: 'bg-green-500'  },
]
const priorityOptions = [
  { value: 'low',    label: 'Thấp',       color: 'text-gray-500',  icon: '↓'  },
  { value: 'medium', label: 'Trung bình', color: 'text-teal-500',  icon: '→'  },
  { value: 'high',   label: 'Cao',        color: 'text-orange-500', icon: '↑' },
  { value: 'urgent', label: 'Khẩn cấp',  color: 'text-red-500',   icon: '⚡' },
]

// ── Scroll ────────────────────────────────────────────────────────────────────
const scrollToBottom = (smooth = false) => {
  nextTick(() => setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({ top: messagesContainer.value.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
    }
  }, 100))
}

// ── Fetch ─────────────────────────────────────────────────────────────────────
const fetchTicket = async () => {
  loading.value = true
  try {
    const res = await ticketApi.getTicket(route.params.id)
    if (res.success) {
      ticket.value = res.data
      resolutionText.value = res.data.resolution || ''
    } else {
      ticket.value = null
    }
  } catch {
    showError('Không thể tải thông tin ticket')
    ticket.value = null
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

// ── Claim ─────────────────────────────────────────────────────────────────────
const claimTicket = async () => {
  if (claiming.value || !ticket.value) return
  claiming.value = true
  try {
    const res = await ticketApi.claimTicket(ticket.value.id)
    if (res.success) {
      ticket.value.assignedTo     = currentUserId.value
      ticket.value.assignedToName = authStore.user?.name || authStore.user?.full_name || 'Bạn'
      ticket.value.assignedAt     = new Date().toISOString()
      if (ticket.value.status === 'open') ticket.value.status = 'in_progress'
      success('Đã nhận xử lý ticket')
    } else {
      if (res.status === 409) showError('Ticket đã được nhận bởi người khác')
      else if (res.status === 423) showError('Ticket đã bị khóa')
      else showError(res.message || 'Không thể nhận ticket')
    }
  } catch { showError('Không thể nhận ticket') }
  finally { claiming.value = false }
}

// ── Lock / Unlock (superAdmin) ────────────────────────────────────────────────
const lockTicket = async () => {
  if (locking.value || !ticket.value) return
  locking.value = true
  try {
    const res = await ticketApi.lockTicket(ticket.value.id)
    if (res.success) {
      ticket.value.isLocked = true
      success('Ticket đã bị khóa')
    } else showError(res.message || 'Không thể khóa ticket')
  } catch { showError('Không thể khóa ticket') }
  finally { locking.value = false }
}

const unlockTicket = async () => {
  if (locking.value || !ticket.value) return
  locking.value = true
  try {
    const res = await ticketApi.unlockTicket(ticket.value.id, true)
    if (res.success) {
      ticket.value.isLocked    = false
      ticket.value.assignedTo  = null
      ticket.value.assignedToName = null
      success('Đã mở khóa và giải phóng ticket')
    } else showError(res.message || 'Không thể mở khóa')
  } catch { showError('Không thể mở khóa ticket') }
  finally { locking.value = false }
}

// ── Status / Priority / Close ─────────────────────────────────────────────────
const changeStatus = async (status) => {
  showStatusDropdown.value = false
  if (!ticket.value || ticket.value.status === status) return
  try {
    const res = await ticketApi.updateStatus(ticket.value.id, status)
    if (res.success) {
      ticket.value.status = status
      success(`Đã chuyển sang: ${getStatusLabel(status)}`)
    } else showError(res.message || 'Không thể đổi trạng thái')
  } catch { showError('Không thể đổi trạng thái') }
}

const changePriority = async (priority) => {
  showPriorityDropdown.value = false
  if (!ticket.value || ticket.value.priority === priority) return
  try {
    const res = await ticketApi.updatePriority(ticket.value.id, priority)
    if (res.success) {
      ticket.value.priority = priority
      success(`Ưu tiên: ${getPriorityLabel(priority)}`)
    } else showError(res.message || 'Không thể đổi ưu tiên')
  } catch { showError('Không thể đổi ưu tiên') }
}

const openResolveConfirm = () => {
  confirmData.value = {
    title: 'Hoàn Thành Ticket',
    message: 'Đánh dấu ticket này là đã giải quyết? Bạn vẫn có thể tiếp tục trao đổi sau khi hoàn thành.',
    type: 'success',
    confirmText: 'Hoàn thành',
    onConfirm: resolveTicketAction,
  }
  showConfirm.value = true
}

const resolveTicketAction = async () => {
  showConfirm.value = false
  try {
    const res = await ticketApi.updateStatus(ticket.value.id, 'resolved', resolutionText.value || undefined)
    if (res.success) {
      ticket.value.status = 'resolved'
      success('Ticket đã được đánh dấu hoàn thành')
    } else showError(res.message || 'Không thể hoàn thành ticket')
  } catch { showError('Không thể hoàn thành ticket') }
}

const openCloseConfirm = () => {
  confirmData.value = {
    title: 'Đóng Ticket',
    message: 'Bạn có chắc muốn đóng ticket này? Sau khi đóng sẽ không thể thêm phản hồi.',
    type: 'warning',
    confirmText: 'Đóng ticket',
    onConfirm: closeTicket,
  }
  showConfirm.value = true
}

const closeTicket = async () => {
  showConfirm.value = false
  try {
    const res = await ticketApi.closeTicket(ticket.value.id)
    if (res.success) {
      ticket.value.status = 'closed'
      success('Ticket đã được đóng')
    } else showError(res.message || 'Không thể đóng ticket')
  } catch { showError('Không thể đóng ticket') }
}

const saveResolution = async () => {
  if (!resolutionText.value.trim()) return
  savingResolution.value = true
  try {
    const res = await ticketApi.saveResolution(ticket.value.id, resolutionText.value)
    if (res.success) {
      ticket.value.resolution = resolutionText.value
      editingResolution.value = false
      success('Đã lưu ghi chú giải pháp')
    } else showError(res.message || 'Không thể lưu')
  } catch { showError('Không thể lưu giải pháp') }
  finally { savingResolution.value = false }
}

// ── Comments ──────────────────────────────────────────────────────────────────
const handleCommentFiles = (event) => {
  const files = Array.from(event.target.files)
  for (const file of files.slice(0, 3 - commentAttachments.value.length)) {
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) { showError(`${file.name}: Chỉ hỗ trợ PNG, JPG`); continue }
    if (file.size > 20 * 1024 * 1024) { showError(`${file.name}: Tối đa 20MB`); continue }
    commentAttachments.value.push({ file, preview: URL.createObjectURL(file), uploading: false, uploaded: false, url: null, filename: file.name, error: null })
  }
  event.target.value = ''
}

const removeCommentAttachment = (idx) => {
  URL.revokeObjectURL(commentAttachments.value[idx].preview)
  commentAttachments.value.splice(idx, 1)
}

const uploadCommentAttachments = async () => {
  const toUpload = commentAttachments.value.filter((a) => !a.uploaded && a.file)
  await Promise.all(toUpload.map(async (att) => {
    att.uploading = true
    att.error = null
    try {
      const res = await ticketApi.uploadImage(att.file)
      if (res.success && res.data?.url) {
        att.url = res.data.url; att.filename = res.data.filename; att.uploaded = true
      } else { att.error = res.message || 'Upload failed'; showError(`${att.filename}: Không thể tải lên`) }
    } catch { att.error = 'Lỗi kết nối'; showError(`${att.filename}: Lỗi kết nối`) }
    finally { att.uploading = false }
  }))
  return commentAttachments.value.every((a) => a.uploaded || a.url)
}

const addComment = async () => {
  if (submittingComment.value) return
  if (!newComment.value.trim() && !commentAttachments.value.length) return
  submittingComment.value = true
  try {
    if (commentAttachments.value.length) {
      const ok = await uploadCommentAttachments()
      if (!ok) return
    }
    const res = await ticketApi.addComment(ticket.value.id, {
      message: newComment.value,
      attachments: commentAttachments.value.filter((a) => a.url).map((a) => ({ url: a.url, filename: a.filename })),
    })
    if (res.success) {
      // SSE will push the new comment; but add locally if SSE not connected
      if (!sseConnected.value) {
        ticket.value.comments = ticket.value.comments || []
        ticket.value.comments.push(res.data)
        scrollToBottom(true)
      }
      newComment.value = ''
      commentAttachments.value = []
      success('Đã gửi')
    } else showError(res.message || 'Không thể gửi phản hồi')
  } catch { showError('Không thể gửi phản hồi') }
  finally { submittingComment.value = false }
}

const deleteComment = async (commentId) => {
  if (!commentId) return
  try {
    const res = await ticketApi.deleteComment(ticket.value.id, commentId)
    if (res.success) {
      const idx = ticket.value.comments.findIndex((c) => c.id === commentId)
      if (idx > -1) ticket.value.comments.splice(idx, 1)
      success('Đã xoá tin nhắn')
    } else showError(res.message || 'Không thể xoá')
  } catch { showError('Không thể xoá tin nhắn') }
}

// ── Comment helpers ───────────────────────────────────────────────────────────
const isSelfComment = (comment) => {
  const uid = currentUserId.value
  return comment.userId === uid || comment.user_id === uid
}
const canDeleteComment = (comment) => {
  const uid = currentUserId.value
  return comment.userId === uid || comment.user_id === uid || isSuperAdmin.value
}

// ── SSE real-time comments ────────────────────────────────────────────────────
const startSSE = () => {
  if (!ticket.value) return
  sseSource = ticketApi.streamComments(
    ticket.value.id,
    (newMsg) => {
      ticket.value.comments = ticket.value.comments || []
      // Avoid duplicate if we already added it locally
      const exists = ticket.value.comments.some((c) => c.id === newMsg.id)
      if (!exists) {
        ticket.value.comments.push(newMsg)
        scrollToBottom(true)
      }
    },
    () => { sseConnected.value = false },
  )
  sseSource.onopen = () => { sseConnected.value = true }
}

// ── Label / class helpers ─────────────────────────────────────────────────────
const getStatusClass = (s) => ({
  open:        'bg-teal-100 text-teal-700 ring-teal-200',
  in_progress: 'bg-amber-100 text-amber-700 ring-amber-200',
  waiting:     'bg-lime-100 text-lime-700 ring-lime-200',
  resolved:    'bg-green-100 text-green-700 ring-green-200',
  closed:      'bg-gray-100 text-gray-600 ring-gray-200',
})[s] || 'bg-gray-100 text-gray-600 ring-gray-200'

const getStatusLabel   = (s) => ({ open: 'Mở', in_progress: 'Đang xử lý', waiting: 'Chờ phản hồi', resolved: 'Đã giải quyết', closed: 'Đã đóng' })[s] || s
const getPriorityClass = (p) => ({ low: 'bg-gray-100 text-gray-600 ring-gray-200', medium: 'bg-teal-100 text-teal-700 ring-teal-200', high: 'bg-orange-100 text-orange-700 ring-orange-200', urgent: 'bg-red-100 text-red-700 ring-red-200' })[p] || 'bg-gray-100 text-gray-600 ring-gray-200'
const getPriorityLabel = (p) => ({ low: 'Thấp', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp' })[p] || p
const getCategoryLabel = (c) => ({ question: 'Câu hỏi', bug: 'Báo lỗi', feature: 'Yêu cầu tính năng', billing: 'Thanh toán', other: 'Khác' })[c] || c
const formatFullDate   = (d) => new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const formatTime       = (d) => new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

const statusDropdownRef   = ref(null)
const priorityDropdownRef = ref(null)

const handleOutsideClick = (e) => {
  if (showStatusDropdown.value && statusDropdownRef.value && !statusDropdownRef.value.contains(e.target)) {
    showStatusDropdown.value = false
  }
  if (showPriorityDropdown.value && priorityDropdownRef.value && !priorityDropdownRef.value.contains(e.target)) {
    showPriorityDropdown.value = false
  }
}

onMounted(async () => {
  await fetchTicket()
  startSSE()
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  sseSource?.close()
  document.removeEventListener('click', handleOutsideClick)
})
</script>
