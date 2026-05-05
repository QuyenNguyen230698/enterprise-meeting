<template>
  <div class="flex flex-col w-full h-full overflow-hidden bg-slate-50">
    <ToastContainer />

    <!-- ConfirmModal -->
    <ConfirmModal
      :is-visible="confirm.visible && !confirm.extraAction"
      :title="confirm.title"
      :message="confirm.message"
      :type="confirm.type"
      :loading="confirm.loading"
      @confirm="confirm.onConfirm"
      @cancel="confirm.visible = false"
    />

    <!-- Delete Email Modal (có checkbox xóa Gmail) -->
    <div v-if="confirm.visible && confirm.extraAction" class="fixed inset-0 z-9999999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <i class="bi bi-x-circle-fill text-red-600 text-lg"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ confirm.title }}</h3>
          </div>
        </div>
        <div class="px-6 py-4">
          <p class="text-gray-700">{{ confirm.message }}</p>
          <label class="flex items-center gap-2 mt-4 cursor-pointer select-none">
            <input type="checkbox" v-model="confirm.extraAction.value" class="rounded border-gray-300 text-red-500 focus:ring-red-400" />
            <span class="text-sm text-gray-700 font-medium">{{ confirm.extraAction.label }}</span>
          </label>
        </div>
        <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
          <button @click="confirm.visible = false; confirm.extraAction = null" :disabled="confirm.loading" class="px-6 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Hủy
          </button>
          <button @click="confirm.onConfirm" :disabled="confirm.loading" class="px-6 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
            <div v-if="confirm.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ confirm.loading ? 'Đang xóa...' : 'Xóa' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Header ─────────────────────────────────────────────────── -->
    <div class="flex-none bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <i class="bi bi-envelope-open-heart text-rose-500"></i>
            Email Recruitment
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">Quản lý inbox ứng viên, phản hồi hàng loạt và auto-reply</p>
        </div>

        <!-- Stats bar + Refresh -->
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-1.5 text-sm">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span class="text-gray-600">Tổng: <strong>{{ stats.total ?? '—' }}</strong></span>
          </div>
          <div class="flex items-center gap-1.5 text-sm">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span class="text-gray-600">Chưa đọc: <strong class="text-amber-600">{{ stats.unread ?? '—' }}</strong></span>
          </div>
          <div class="flex items-center gap-1.5 text-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-gray-600">Job đang mở: <strong>{{ stats.openJobs ?? '—' }}</strong></span>
          </div>
          <div class="flex items-center gap-1.5 text-sm">
            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
            <span class="text-gray-600">Tỷ lệ reply: <strong>{{ stats.replyRate ?? '—' }}%</strong></span>
          </div>
          <!-- Refresh button -->
          <button
            @click="refreshAll"
            :disabled="refreshing"
            class="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title="Refresh dữ liệu"
          >
            <i class="bi bi-arrow-clockwise text-sm" :class="{ 'animate-spin': refreshing }"></i>
            <span class="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mt-4 border-b border-gray-100 -mb-4">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          :class="activeTab === tab.key
            ? 'border-rose-500 text-rose-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <i :class="tab.icon" class="mr-1.5"></i>{{ tab.label }}
          <span v-if="tab.badge" class="ml-1.5 bg-rose-100 text-rose-600 text-xs font-semibold px-1.5 py-0.5 rounded-full">{{ tab.badge }}</span>
        </button>
      </div>
    </div>

    <!-- ── Tab Content ────────────────────────────────────────────── -->
    <div class="flex-1 overflow-hidden">

      <!-- ═══ TAB: INBOX ═══════════════════════════════════════════ -->
      <div v-show="activeTab === 'inbox'" class="flex h-full overflow-hidden">

        <!-- Sidebar: list emails -->
        <div class="w-80 flex-none border-r border-gray-200 bg-white flex flex-col overflow-hidden">
          <!-- Inbox toolbar -->
          <div class="p-3 border-b border-gray-100 space-y-2">
            <div class="flex gap-2">
              <input
                v-model="inbox.search"
                @input="debouncedFetchInbox"
                type="text"
                placeholder="Tìm ứng viên, tiêu đề..."
                class="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button
                @click="openPullModal"
                class="text-sm bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <i class="bi bi-cloud-download text-xs"></i> Pull
              </button>
            </div>
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="s in inboxStatuses"
                :key="s.value"
                @click="inbox.statusFilter = inbox.statusFilter === s.value ? '' : s.value; fetchInbox()"
                class="text-xs px-2 py-1 rounded-full border transition-colors"
                :class="inbox.statusFilter === s.value ? s.activeClass : 'border-gray-200 text-gray-500 hover:border-gray-300'"
              >{{ s.label }}</button>
            </div>
            <!-- Job filter -->
            <select
              v-model="inbox.jobFilter"
              @change="fetchInbox()"
              class="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="">Tất cả vị trí</option>
              <option v-for="j in jobs.list" :key="j.id" :value="j.id">{{ j.title }}</option>
            </select>
          </div>

          <!-- Email list -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="inbox.loading" class="flex justify-center py-8">
              <div class="animate-spin w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full"></div>
            </div>
            <div v-else-if="!inbox.list.length" class="text-center py-12 text-gray-400 text-sm">
              <i class="bi bi-inbox text-2xl block mb-2"></i>
              Không có email nào
            </div>
            <div v-else>
              <div
                v-for="email in inbox.list"
                :key="email.id"
                @click="openEmailDetail(email)"
                class="px-3 py-3 border-b border-gray-50 cursor-pointer hover:bg-rose-50 transition-colors relative"
                :class="{ 'bg-blue-50': !email.isRead, 'bg-white': email.isRead, 'ring-2 ring-inset ring-rose-400': inbox.selected?.id === email.id }"
              >
                <div class="flex items-start gap-2">
                  <!-- Bulk select checkbox -->
                  <input
                    type="checkbox"
                    :checked="inbox.bulkSelected.includes(email.id)"
                    @click.stop="toggleBulkSelect(email.id)"
                    class="mt-1 rounded border-gray-300 text-rose-500 focus:ring-rose-400 cursor-pointer"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-sm font-medium text-gray-900 truncate" :class="{ 'font-semibold': !email.isRead }">
                        {{ email.fromName || email.fromEmail }}
                      </span>
                      <span class="text-xs text-gray-400 flex-none">{{ formatDate(email.receivedAt) }}</span>
                    </div>
                    <p class="text-xs text-gray-500 truncate mt-0.5">{{ email.subject }}</p>
                    <div class="flex items-center gap-1.5 mt-1">
                      <span class="text-xs px-1.5 py-0.5 rounded-full font-medium" :class="statusClass(email.status)">
                        {{ statusLabel(email.status) }}
                      </span>
                      <span v-if="!email.isRead" class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bulk action bar -->
          <div v-if="inbox.bulkSelected.length" class="border-t border-rose-100 bg-rose-50 p-2 flex items-center gap-1.5">
            <span class="text-xs text-rose-700 font-medium flex-1">{{ inbox.bulkSelected.length }} đã chọn</span>
            <button @click="openBulkReply" class="text-xs bg-rose-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1">
              <i class="bi bi-reply-all"></i><span class="hidden sm:inline">Gửi hàng loạt</span>
            </button>
            <button @click="confirmBulkDelete" class="text-xs bg-red-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1">
              <i class="bi bi-trash"></i><span class="hidden sm:inline">Xóa tất cả</span>
            </button>
            <button @click="inbox.bulkSelected = []" class="text-xs text-gray-500 hover:text-gray-700 px-1">
              <i class="bi bi-x text-base"></i>
            </button>
          </div>

          <!-- Pagination -->
          <div class="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
            <span class="text-xs text-gray-400">{{ inbox.total }} email</span>
            <div class="flex gap-1">
              <button :disabled="inbox.page <= 1" @click="inbox.page--; fetchInbox()" class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
              <span class="text-xs px-2 py-1 text-gray-500">{{ inbox.page }}</span>
              <button :disabled="inbox.page * inbox.limit >= inbox.total" @click="inbox.page++; fetchInbox()" class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
            </div>
          </div>
        </div>

        <!-- Email detail panel -->
        <div class="flex-1 overflow-y-auto bg-white">
          <div v-if="!inbox.selected" class="flex flex-col items-center justify-center h-full text-gray-300">
            <i class="bi bi-envelope-open text-5xl mb-3"></i>
            <p class="text-sm">Chọn email để xem nội dung</p>
          </div>
          <div v-else class="max-w-3xl mx-auto p-6">
            <!-- Email header -->
            <div class="flex flex-col gap-3 mb-6">
              <!-- Row 1: Subject + info -->
              <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ inbox.selected.subject }}</h2>
                <div class="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                  <span>Từ: <strong>{{ inbox.selected.fromName || inbox.selected.fromEmail }}</strong> &lt;{{ inbox.selected.fromEmail }}&gt;</span>
                  <span class="text-gray-300">·</span>
                  <span class="text-xs text-gray-400">{{ formatDateFull(inbox.selected.receivedAt) }}</span>
                </div>
              </div>
              <!-- Row 2: Actions -->
              <div class="flex items-center gap-2 flex-wrap">
                <select
                  :value="inbox.selected.status"
                  @change="patchEmailStatus(inbox.selected.id, $event.target.value)"
                  class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-rose-300"
                >
                  <option v-for="s in inboxStatuses" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
                <select
                  :value="inbox.selected.jobId ?? ''"
                  @change="patchEmailJob(inbox.selected.id, $event.target.value)"
                  class="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-rose-300"
                >
                  <option value="">Chưa gắn job</option>
                  <option v-for="j in jobs.list" :key="j.id" :value="j.id">{{ j.title }}</option>
                </select>
                <div class="flex items-center gap-2 ml-auto">
                  <button
                    @click="openBulkReplyFor([inbox.selected.id], 'reply')"
                    class="text-xs bg-rose-500 text-white px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    <i class="bi bi-reply mr-1"></i>Reply
                  </button>
                  <button
                    @click="openBulkReplyFor([inbox.selected.id], 'forward')"
                    class="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <i class="bi bi-forward mr-1"></i>Forward
                  </button>
                  <button @click="confirmDeleteEmail(inbox.selected.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <i class="bi bi-trash text-sm"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <iframe
                v-if="inbox.selected.bodyHtml"
                :srcdoc="inbox.selected.bodyHtml"
                class="w-full"
                style="min-height:400px; border:none;"
                sandbox="allow-scripts"
                @load="autoResizeIframe"
                ref="emailIframe"
              ></iframe>
              <pre v-else class="text-sm text-gray-700 p-4 whitespace-pre-wrap">{{ inbox.selected.bodyText || '(Không có nội dung)' }}</pre>
            </div>

            <!-- Attachments -->
            <div class="mt-4">
              <div v-if="inbox.selected.attachments && inbox.selected.attachments.length" class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                  <i class="bi bi-paperclip text-gray-500 text-sm"></i>
                  <span class="text-xs font-medium text-gray-600">{{ inbox.selected.attachments.length }} tệp đính kèm</span>
                </div>
                <div class="divide-y divide-gray-100">
                  <div
                    v-for="att in inbox.selected.attachments"
                    :key="att.attachmentIndex ?? att.filename"
                    class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <i class="bi text-lg flex-none" :class="attachmentIcon(att.mimeType)"></i>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-gray-800 truncate font-medium">{{ att.filename }}</p>
                      <p class="text-xs text-gray-400">{{ formatFileSize(att.size) }}</p>
                    </div>
                    <button
                      v-if="att.attachmentIndex != null"
                      @click="downloadAttachmentFile(inbox.selected.id, att.attachmentIndex, att.filename)"
                      class="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 flex-none disabled:opacity-50"
                      :disabled="downloadingAttachment === `${inbox.selected.id}-${att.attachmentIndex}`"
                    >
                      <i class="bi" :class="downloadingAttachment === `${inbox.selected.id}-${att.attachmentIndex}` ? 'bi-hourglass-split animate-spin' : 'bi-download'"></i>
                      {{ downloadingAttachment === `${inbox.selected.id}-${att.attachmentIndex}` ? 'Đang tải...' : 'Tải về' }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="border border-dashed border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 text-gray-400">
                <i class="bi bi-paperclip text-sm"></i>
                <span class="text-xs">Không có tệp đính kèm</span>
              </div>
            </div>

            <!-- Thread -->
            <div v-if="inbox.thread.length" class="mt-6">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Lịch sử thread ({{ inbox.thread.length }} email)</h3>
              <div v-for="t in inbox.thread" :key="t.id" class="border border-gray-200 rounded-lg p-3 mb-2 text-sm">
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{{ t.fromEmail }}</span>
                  <span>{{ formatDate(t.receivedAt) }}</span>
                </div>
                <p class="text-gray-700 font-medium">{{ t.subject }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ TAB: JOBS ════════════════════════════════════════════ -->
      <div v-show="activeTab === 'jobs'" class="h-full overflow-y-auto p-4 sm:p-6">
        <div class="max-w-5xl mx-auto">
          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-semibold text-gray-900">Vị trí tuyển dụng</h2>
            <button @click="openJobForm()" class="bg-rose-500 hover:bg-rose-600 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
              <i class="bi bi-plus-lg"></i> Thêm vị trí
            </button>
          </div>

          <!-- Job cards -->
          <div v-if="jobs.loading" class="flex justify-center py-12">
            <div class="animate-spin w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full"></div>
          </div>
          <div v-else-if="!jobs.list.length" class="text-center py-16 text-gray-400">
            <i class="bi bi-briefcase text-4xl block mb-3"></i>
            <p>Chưa có vị trí tuyển dụng nào</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="j in jobs.list"
              :key="j.id"
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 truncate">{{ j.title }}</h3>
                  <p class="text-xs text-gray-500 mt-0.5">{{ j.department || 'Chưa phân phòng' }}</p>
                </div>
                <span class="ml-2 text-xs px-2 py-0.5 rounded-full font-medium flex-none" :class="j.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'">
                  {{ j.status === 'open' ? 'Đang mở' : 'Đã đóng' }}
                </span>
              </div>
              <p v-if="j.email_alias" class="text-xs text-blue-600 mt-2 truncate">
                <i class="bi bi-at mr-1"></i>{{ j.email_alias }}
              </p>
              <p v-if="j.description" class="text-xs text-gray-500 mt-2 line-clamp-2">{{ j.description }}</p>

              <!-- Stats -->
              <div class="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                <div class="text-center">
                  <p class="text-lg font-bold text-gray-900">{{ j.candidateCount ?? 0 }}</p>
                  <p class="text-xs text-gray-400">Ứng viên</p>
                </div>
                <div class="text-center">
                  <p class="text-lg font-bold text-amber-600">{{ j.unreadCount ?? 0 }}</p>
                  <p class="text-xs text-gray-400">Chưa đọc</p>
                </div>
              </div>

              <div class="flex gap-2 mt-3">
                <button @click="openJobForm(j)" class="flex-1 text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <i class="bi bi-pencil mr-1"></i>Sửa
                </button>
                <button @click="quickFilterJobInbox(j.id)" class="flex-1 text-xs bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors">
                  <i class="bi bi-inbox mr-1"></i>Xem inbox
                </button>
                <button @click="confirmDeleteJob(j.id)" class="text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 rounded-lg transition-colors">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ TAB: AUTO-RULES ══════════════════════════════════════ -->
      <div v-show="activeTab === 'rules'" class="h-full overflow-y-auto p-4 sm:p-6">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-semibold text-gray-900">Auto-Reply Rules</h2>
              <p class="text-xs text-gray-500 mt-0.5">Tự động phản hồi khi nhận email ứng viên mới</p>
            </div>
            <button @click="openRuleForm()" class="bg-rose-500 hover:bg-rose-600 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
              <i class="bi bi-plus-lg"></i> Thêm rule
            </button>
          </div>

          <div v-if="rules.loading" class="flex justify-center py-12">
            <div class="animate-spin w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full"></div>
          </div>
          <div v-else-if="!rules.list.length" class="text-center py-16 text-gray-400">
            <i class="bi bi-robot text-4xl block mb-3"></i>
            <p>Chưa có rule nào. Tạo rule đầu tiên để tự động phản hồi ứng viên.</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="r in rules.list"
              :key="r.id"
              class="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"
              :class="{ 'opacity-60': !r.isActive }"
            >
              <!-- Toggle -->
              <button
                @click="handleToggleRule(r)"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="r.isActive ? 'bg-emerald-500' : 'bg-gray-200'"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="r.isActive ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900 text-sm">{{ r.name }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{{ r.trigger }}</span>
                </div>
                <div class="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                  <span v-if="r.jobId">
                    <i class="bi bi-briefcase mr-0.5"></i>
                    {{ jobs.list.find(j => j.id === r.jobId)?.title || 'Job #' + r.jobId }}
                  </span>
                  <span v-else><i class="bi bi-globe mr-0.5"></i>Tất cả job</span>
                  <span v-if="r.delayMinutes > 0"><i class="bi bi-clock mr-0.5"></i>Delay {{ r.delayMinutes }} phút</span>
                  <span v-else><i class="bi bi-lightning mr-0.5"></i>Gửi ngay</span>
                  <span v-if="r.templateId"><i class="bi bi-file-earmark-text mr-0.5"></i>Dùng template</span>
                </div>
              </div>

              <div class="flex gap-2 flex-none">
                <button @click="openRuleForm(r)" class="text-xs text-gray-500 hover:text-gray-800 px-2 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="confirmDeleteRule(r.id)" class="text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ TAB: REPLIES ═════════════════════════════════════════ -->
      <div v-show="activeTab === 'replies'" class="h-full overflow-y-auto p-4 sm:p-6">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Lịch sử phản hồi</h2>
          <div v-if="repliesTab.loading" class="flex justify-center py-12">
            <div class="animate-spin w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full"></div>
          </div>
          <div v-else-if="!repliesTab.list.length" class="text-center py-16 text-gray-400">
            <i class="bi bi-send-check text-4xl block mb-3"></i>
            <p>Chưa có lịch sử phản hồi</p>
          </div>
          <!-- Group replies by bulkId -->
          <div v-else class="space-y-3">
            <div
              v-for="group in repliesTab.grouped"
              :key="group.bulkId"
              class="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <!-- Group header -->
              <div class="flex items-center gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                <div class="w-8 h-8 rounded-full flex items-center justify-center flex-none"
                  :class="group.isAuto ? 'bg-purple-100' : 'bg-rose-100'">
                  <i class="bi text-sm" :class="group.isAuto ? 'bi-robot text-purple-600' : 'bi-reply-all text-rose-600'"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ group.subject }}</p>
                  <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span v-if="group.isAuto" class="text-xs text-purple-600 font-medium">
                      <i class="bi bi-robot mr-0.5"></i>Auto-reply
                    </span>
                    <span v-else class="text-xs text-rose-600 font-medium">
                      <i class="bi bi-reply-all mr-0.5"></i>Bulk manual
                    </span>
                    <span class="text-xs text-gray-400">{{ formatDateFull(group.createdAt) }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-3 flex-none">
                  <div class="text-right text-xs">
                    <span class="text-emerald-600 font-semibold">{{ group.sent }} gửi</span>
                    <span v-if="group.failed > 0" class="text-red-500 font-semibold ml-2">{{ group.failed }} lỗi</span>
                    <span class="text-gray-400 ml-1">/ {{ group.total }}</span>
                  </div>
                  <!-- Sent/failed mini bar -->
                  <div class="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full transition-all"
                      :style="{ width: group.total > 0 ? (group.sent / group.total * 100) + '%' : '0%' }"></div>
                  </div>
                  <button
                    @click="openBulkDetail(group.bulkId)"
                    class="text-xs text-rose-600 hover:text-rose-800 border border-rose-200 hover:border-rose-400 px-2.5 py-1.5 rounded-lg transition-colors bg-rose-50 hover:bg-rose-100 whitespace-nowrap"
                  >
                    <i class="bi bi-list-ul mr-1"></i>Chi tiết
                  </button>
                </div>
              </div>

              <!-- Top 3 recipients preview -->
              <div class="divide-y divide-gray-50">
                <div
                  v-for="r in group.recipients.slice(0, 3)"
                  :key="r.id"
                  class="flex items-center gap-3 px-4 py-2"
                >
                  <div class="w-5 h-5 rounded-full flex items-center justify-center flex-none"
                    :class="r.status === 'sent' ? 'bg-emerald-100' : r.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'">
                    <i class="bi text-xs" :class="r.status === 'sent' ? 'bi-check text-emerald-600' : r.status === 'failed' ? 'bi-x text-red-500' : 'bi-hourglass text-gray-400'"></i>
                  </div>
                  <span class="text-xs text-gray-600 truncate flex-1">{{ r.toEmail }}</span>
                  <span class="text-xs text-gray-400 flex-none">{{ formatDate(r.sentAt || r.createdAt) }}</span>
                </div>
                <div v-if="group.total > 3" class="px-4 py-1.5 text-xs text-gray-400 italic">
                  + {{ group.total - 3 }} người khác...
                </div>
              </div>
            </div>
          </div>
          <!-- Pagination replies -->
          <div class="flex justify-center gap-2 mt-4">
            <button :disabled="repliesTab.page <= 1" @click="repliesTab.page--; fetchReplies()" class="text-xs px-3 py-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹ Trước</button>
            <span class="text-xs px-3 py-1.5 text-gray-500">Trang {{ repliesTab.page }}</span>
            <button :disabled="repliesTab.page * 20 >= repliesTab.total" @click="repliesTab.page++; fetchReplies()" class="text-xs px-3 py-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Sau ›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Bulk Detail Drawer ───────────────────────────────────────── -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div v-if="bulkDetail.show" class="fixed inset-0 z-[60] flex justify-end">
        <!-- Overlay -->
        <div class="absolute inset-0 backdrop-blur-sm" @click="bulkDetail.show = false"></div>

        <!-- Drawer panel -->
        <div class="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white shrink-0">
            <div>
              <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
                <i class="bi bi-list-columns-reverse text-rose-500"></i>
                Chi tiết batch gửi
              </h3>
              <p v-if="bulkDetail.data" class="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                {{ bulkDetail.data.subject }}
              </p>
            </div>
            <button @click="bulkDetail.show = false" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>

          <!-- Summary bar -->
          <div v-if="bulkDetail.data" class="px-5 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
            <div class="flex items-center gap-6 flex-wrap">
              <div class="text-center">
                <p class="text-xl font-bold text-gray-900">{{ bulkDetail.data.total }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Tổng</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-emerald-600">{{ bulkDetail.data.sent }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Thành công</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-red-500">{{ bulkDetail.data.failed }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Thất bại</p>
              </div>
              <div class="flex-1">
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Tỷ lệ thành công</span>
                  <span class="font-semibold text-emerald-600">{{ bulkDetail.data.total > 0 ? Math.round(bulkDetail.data.sent / bulkDetail.data.total * 100) : 0 }}%</span>
                </div>
                <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    :style="{ width: bulkDetail.data.total > 0 ? (bulkDetail.data.sent / bulkDetail.data.total * 100) + '%' : '0%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Job info nếu có -->
            <div v-if="bulkDetail.jobInfo" class="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-white rounded-lg px-3 py-2 border border-gray-200">
              <i class="bi bi-briefcase text-rose-400"></i>
              <span class="font-medium text-gray-700">{{ bulkDetail.jobInfo.title }}</span>
              <span class="text-gray-400">—</span>
              <span>{{ bulkDetail.jobInfo.department || 'Chưa phân phòng' }}</span>
              <span class="ml-auto px-2 py-0.5 rounded-full text-xs font-medium" :class="bulkDetail.jobInfo.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'">
                {{ bulkDetail.jobInfo.status === 'open' ? 'Đang mở' : 'Đã đóng' }}
              </span>
            </div>

            <!-- Filter bar -->
            <div class="flex gap-1.5 mt-3 flex-wrap">
              <button
                v-for="f in [{ v: '', l: 'Tất cả' }, { v: 'sent', l: 'Thành công' }, { v: 'failed', l: 'Thất bại' }, { v: 'pending', l: 'Chờ' }]"
                :key="f.v"
                @click="bulkDetail.filter = f.v"
                class="text-xs px-2.5 py-1 rounded-full border transition-colors"
                :class="bulkDetail.filter === f.v
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-600'"
              >{{ f.l }}</button>
              <span class="ml-auto text-xs text-gray-400 py-1">{{ bulkDetailFiltered.length }} kết quả</span>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="bulkDetail.loading" class="flex-1 flex items-center justify-center">
            <div class="flex flex-col items-center gap-3 text-gray-400">
              <div class="animate-spin w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full"></div>
              <span class="text-sm">Đang tải...</span>
            </div>
          </div>

          <!-- Recipients list -->
          <div v-else class="flex-1 overflow-y-auto">
            <div v-if="!bulkDetailFiltered.length" class="flex flex-col items-center justify-center h-40 text-gray-400">
              <i class="bi bi-inbox text-2xl mb-2"></i>
              <p class="text-sm">Không có kết quả</p>
            </div>
            <div v-else class="divide-y divide-gray-50">
              <div
                v-for="r in bulkDetailFiltered"
                :key="r.id"
                class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <!-- Status icon -->
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  :class="r.status === 'sent' ? 'bg-emerald-100' : r.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'"
                >
                  <i class="bi text-sm"
                    :class="r.status === 'sent' ? 'bi-check-lg text-emerald-600' : r.status === 'failed' ? 'bi-x-lg text-red-500' : 'bi-hourglass text-gray-400'"
                  ></i>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ r.toName || r.toEmail }}</p>
                    <span v-if="r.toName" class="text-xs text-gray-400 truncate hidden sm:block">{{ r.toEmail }}</span>
                  </div>
                  <p v-if="r.errorMessage" class="text-xs text-red-500 mt-0.5 truncate">
                    <i class="bi bi-exclamation-circle mr-0.5"></i>{{ r.errorMessage }}
                  </p>
                  <p v-else class="text-xs text-gray-400 mt-0.5">
                    {{ r.status === 'sent' ? 'Gửi lúc ' + formatDate(r.sentAt) : r.status === 'pending' ? 'Đang chờ xử lý' : '' }}
                  </p>
                </div>

                <!-- Status badge -->
                <span
                  class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                  :class="r.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : r.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'"
                >
                  {{ r.status === 'sent' ? 'Đã gửi' : r.status === 'failed' ? 'Thất bại' : 'Chờ' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 px-5 py-3 shrink-0 bg-white">
            <p class="text-xs text-gray-400 text-center">
              Bulk ID: <code class="font-mono bg-gray-100 px-1 rounded">{{ bulkDetail.bulkId }}</code>
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Pull Modal ─────────────────────────────────────────────── -->
    <div v-if="pull.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="pull.show = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="bi bi-cloud-download text-rose-500"></i> Kéo email từ hộp thư
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Thư mục hộp thư</label>
            <select v-model="pull.folder" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300">
              <option value="INBOX">Hộp thư chính (INBOX)</option>
            </select>
            <p class="text-xs text-gray-400 mt-0.5">
              <i class="bi bi-google mr-0.5"></i>Gmail: chỉ lấy tab <strong>Primary</strong> — bỏ qua Promotions, Social, Spam
            </p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Gắn vào Job (tùy chọn)</label>
            <select v-model="pull.jobId" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300">
              <option :value="null">Không gắn job</option>
              <option v-for="j in jobs.list" :key="j.id" :value="j.id">{{ j.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Số email tối đa</label>
            <input v-model.number="pull.maxFetch" type="number" min="1" max="200" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
        </div>
        <!-- Info khi dang keo -->
        <div v-if="pull.pulling" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
          <i class="bi bi-arrow-repeat animate-spin text-blue-500"></i>
          <span class="text-sm text-blue-700">Đang kéo email trong nền... Refresh để cập nhật.</span>
        </div>
        <div class="flex gap-2 mt-5">
          <button @click="pull.show = false" class="flex-1 text-sm border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50">Đóng</button>
          <button @click="doPull" :disabled="pull.loading" class="flex-1 text-sm bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 disabled:opacity-60 transition-colors">
            <i v-if="pull.loading" class="bi bi-arrow-repeat animate-spin mr-1"></i>
            {{ pull.loading ? 'Đang gửi lệnh...' : 'Kéo email' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Job Form Modal ─────────────────────────────────────────── -->
    <div v-if="jobForm.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="jobForm.show = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <h3 class="text-base font-semibold text-gray-900 mb-5">
          {{ jobForm.isEdit ? 'Sửa vị trí' : 'Thêm vị trí tuyển dụng' }}
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tiêu đề <span class="text-red-500">*</span></label>
            <input v-model="jobForm.data.title" type="text" placeholder="Ví dụ: Frontend Developer" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Phòng ban</label>
            <input v-model="jobForm.data.department" type="text" placeholder="Ví dụ: Engineering" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Email alias</label>
            <input v-model="jobForm.data.email_alias" type="email" placeholder="tuyendung@company.com" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Trạng thái</label>
            <select v-model="jobForm.data.status" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300">
              <option value="open">Đang mở</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea v-model="jobForm.data.description" rows="3" placeholder="Mô tả vị trí tuyển dụng..." class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300 resize-none"></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-5">
          <button @click="jobForm.show = false" class="flex-1 text-sm border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50">Hủy</button>
          <button @click="saveJob" :disabled="jobForm.loading" class="flex-1 text-sm bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 disabled:opacity-60 transition-colors">
            {{ jobForm.loading ? 'Đang lưu...' : (jobForm.isEdit ? 'Cập nhật' : 'Tạo mới') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Rule Form Modal ────────────────────────────────────────── -->
    <div v-if="ruleForm.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="ruleForm.show = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        <h3 class="text-base font-semibold text-gray-900 mb-5">
          {{ ruleForm.isEdit ? 'Sửa Auto-Reply Rule' : 'Tạo Auto-Reply Rule' }}
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tên rule <span class="text-red-500">*</span></label>
            <input v-model="ruleForm.data.name" type="text" placeholder="Ví dụ: Xác nhận nhận CV" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Áp dụng cho job</label>
            <select v-model="ruleForm.data.job_id" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300">
              <option :value="null">Tất cả job</option>
              <option v-for="j in jobs.list" :key="j.id" :value="j.id">{{ j.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Delay (phút)</label>
            <input v-model.number="ruleForm.data.delay_minutes" type="number" min="0" max="1440" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
            <p class="text-xs text-gray-400 mt-0.5">0 = gửi ngay khi nhận email</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kiểu phản hồi</label>
            <div class="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                @click="ruleForm.data.reply_type = 'reply'"
                class="flex-1 text-xs py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1"
                :class="ruleForm.data.reply_type !== 'forward' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              >
                <i class="bi bi-reply"></i> Reply (Re:)
              </button>
              <button
                type="button"
                @click="ruleForm.data.reply_type = 'forward'"
                class="flex-1 text-xs py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1"
                :class="ruleForm.data.reply_type === 'forward' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
              >
                <i class="bi bi-forward"></i> Forward (Fwd:)
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1">
              <span v-if="ruleForm.data.reply_type !== 'forward'">Reply: gửi lại cho người gửi, nội dung gốc được trích dẫn bên dưới</span>
              <span v-else>Forward: chuyển tiếp email gốc kèm nội dung mới bên trên</span>
            </p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Tiêu đề email
              <span class="text-gray-400 font-normal">(để trống = tự động {{ ruleForm.data.reply_type === 'forward' ? '"Fwd: ..."' : '"Re: ..."' }})</span>
            </label>
            <input v-model="ruleForm.data.reply_subject" type="text" :placeholder="ruleForm.data.reply_type === 'forward' ? 'Fwd: Cảm ơn bạn đã ứng tuyển tại Enterprise Meeting' : 'Re: Cảm ơn bạn đã ứng tuyển tại Enterprise Meeting'" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tên người gửi</label>
            <input v-model="ruleForm.data.from_name" type="text" placeholder="HR Enterprise Meeting" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
          <!-- Email content source selector -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Nội dung email <span class="text-red-500">*</span></label>

            <!-- No content chosen yet -->
            <div v-if="!ruleForm.data.body_html" class="flex gap-2">
              <button
                type="button"
                @click="templatePicker.show = true; loadTemplatePicker()"
                class="flex-1 flex flex-col items-center gap-1.5 border-2 border-dashed border-gray-200 rounded-xl py-4 px-3 hover:border-rose-300 hover:bg-rose-50 transition-colors group"
              >
                <i class="bi bi-file-earmark-richtext text-2xl text-gray-400 group-hover:text-rose-400"></i>
                <span class="text-xs font-medium text-gray-600 group-hover:text-rose-600">Chọn từ Templates</span>
                <span class="text-xs text-gray-400">Dùng template đã có</span>
              </button>
              <button
                type="button"
                @click="ruleForm.editorOpen = true"
                class="flex-1 flex flex-col items-center gap-1.5 border-2 border-dashed border-gray-200 rounded-xl py-4 px-3 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <i class="bi bi-pencil-square text-2xl text-gray-400 group-hover:text-blue-400"></i>
                <span class="text-xs font-medium text-gray-600 group-hover:text-blue-600">Tự thiết kế</span>
                <span class="text-xs text-gray-400">Mở Email Builder</span>
              </button>
            </div>

            <!-- Content chosen: preview + actions -->
            <div v-else class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <i class="bi bi-check-circle-fill text-green-500"></i>
                  <span class="font-medium">{{ ruleForm.bodySourceLabel || 'Đã có nội dung' }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="ruleForm.previewOpen = true"
                    class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                  >
                    <i class="bi bi-eye mr-1"></i>Xem trước
                  </button>
                  <button
                    type="button"
                    @click="ruleForm.data.body_html = ''; ruleForm.bodySourceLabel = ''"
                    class="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
                  >
                    <i class="bi bi-x mr-1"></i>Đổi
                  </button>
                </div>
              </div>
              <iframe
                :srcdoc="ruleForm.data.body_html"
                class="w-full"
                style="height:160px; border:none; pointer-events:none;"
                sandbox="allow-same-origin"
              ></iframe>
            </div>

            <p class="text-xs text-gray-400 mt-1.5">
              <i class="bi bi-info-circle mr-0.5"></i>
              Nội dung gốc của ứng viên sẽ được tự động trích dẫn theo chuẩn {{ ruleForm.data.reply_type === 'forward' ? 'forward' : 'reply' }} của Gmail
            </p>
          </div>
          <div class="flex items-center gap-2">
            <input id="ruleActive" type="checkbox" v-model="ruleForm.data.is_active" class="rounded border-gray-300 text-rose-500 focus:ring-rose-400" />
            <label for="ruleActive" class="text-sm text-gray-700">Kích hoạt ngay</label>
          </div>
        </div>
        <div class="flex gap-2 mt-5">
          <button @click="ruleForm.show = false" class="flex-1 text-sm border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50">Hủy</button>
          <button @click="saveRule" :disabled="ruleForm.loading" class="flex-1 text-sm bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 disabled:opacity-60 transition-colors">
            {{ ruleForm.loading ? 'Đang lưu...' : (ruleForm.isEdit ? 'Cập nhật' : 'Tạo rule') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Template Picker Modal ─────────────────────────────────── -->
    <div v-if="templatePicker.show" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="templatePicker.show = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 flex flex-col max-h-[85vh]">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 class="text-sm font-semibold text-gray-900">Chọn Template</h3>
            <p class="text-xs text-gray-400 mt-0.5">Chọn một template để dùng làm nội dung email tự động</p>
          </div>
          <button @click="templatePicker.show = false" class="text-gray-400 hover:text-gray-600">
            <i class="bi bi-x-lg text-base"></i>
          </button>
        </div>

        <!-- Search -->
        <div class="px-5 py-3 border-b border-gray-100">
          <div class="relative">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              v-model="templatePicker.search"
              @input="loadTemplatePicker(true)"
              type="text"
              placeholder="Tìm template..."
              class="w-full text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="templatePicker.loading" class="flex justify-center py-10">
            <i class="bi bi-arrow-repeat animate-spin text-rose-400 text-2xl"></i>
          </div>
          <div v-else-if="!templatePicker.list.length" class="text-center py-10 text-gray-400">
            <i class="bi bi-file-earmark-x text-3xl mb-2 block"></i>
            <p class="text-sm">Không có template nào</p>
          </div>
          <div v-else class="grid grid-cols-2 gap-3">
            <button
              v-for="t in templatePicker.list"
              :key="t._id"
              type="button"
              @click="applyTemplate(t)"
              class="text-left border border-gray-200 rounded-xl overflow-hidden hover:border-rose-300 hover:shadow-md transition-all group"
            >
              <!-- Mini preview -->
              <div class="h-28 bg-gray-50 overflow-hidden relative">
                <iframe
                  v-if="t.htmlSnapshot"
                  :srcdoc="t.htmlSnapshot"
                  class="w-full h-full"
                  style="transform:scale(0.4); transform-origin:top left; width:250%; height:250%; pointer-events:none;"
                  sandbox="allow-same-origin"
                ></iframe>
                <div v-else class="flex items-center justify-center h-full text-gray-300">
                  <i class="bi bi-file-earmark-richtext text-3xl"></i>
                </div>
                <div class="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span class="bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow">Chọn template này</span>
                </div>
              </div>
              <!-- Info -->
              <div class="px-3 py-2 border-t border-gray-100">
                <p class="text-xs font-medium text-gray-800 truncate">{{ t.name }}</p>
                <p class="text-xs text-gray-400 truncate mt-0.5">{{ t.category }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="templatePicker.total > templatePicker.limit" class="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span class="text-xs text-gray-400">{{ templatePicker.total }} templates</span>
          <div class="flex gap-1">
            <button :disabled="templatePicker.page <= 1" @click="templatePicker.page--; loadTemplatePicker()" class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
            <span class="text-xs px-2 py-1 text-gray-500">{{ templatePicker.page }}</span>
            <button :disabled="templatePicker.page * templatePicker.limit >= templatePicker.total" @click="templatePicker.page++; loadTemplatePicker()" class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Editor Iframe Overlay ──────────────────────────────────── -->
    <div v-if="ruleForm.editorOpen" class="fixed inset-0 z-[70] flex flex-col bg-black/60">
      <div class="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        <div class="flex items-center gap-2">
          <i class="bi bi-pencil-square text-rose-500"></i>
          <span class="text-sm font-semibold text-gray-800">Thiết kế nội dung email</span>
          <span class="text-xs text-gray-400">— nhấn "Dùng template này" trong editor để xác nhận</span>
        </div>
        <button @click="ruleForm.editorOpen = false" class="text-gray-400 hover:text-gray-700 flex items-center gap-1.5 text-sm">
          <i class="bi bi-x-lg"></i> Đóng
        </button>
      </div>
      <iframe
        src="/editor?mode=embedded"
        class="flex-1 w-full border-none bg-white"
        ref="editorIframe"
      ></iframe>
    </div>

    <!-- ── Preview HTML Modal ────────────────────────────────────── -->
    <div v-if="ruleForm.previewOpen" class="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60" @click="ruleForm.previewOpen = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] z-10">
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Xem trước nội dung email</h3>
          <button @click="ruleForm.previewOpen = false" class="text-gray-400 hover:text-gray-600">
            <i class="bi bi-x-lg text-base"></i>
          </button>
        </div>
        <div class="flex-1 overflow-hidden p-1">
          <iframe
            :srcdoc="ruleForm.data.body_html"
            class="w-full h-full rounded-xl"
            style="min-height:500px; border:none;"
            sandbox="allow-same-origin"
          ></iframe>
        </div>
      </div>
    </div>

    <!-- ── Bulk Reply Modal ───────────────────────────────────────── -->
    <div v-if="bulkReply.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="bulkReply.show = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        <h3 class="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <i class="bi text-rose-500" :class="bulkReply.mode === 'forward' ? 'bi-forward' : 'bi-reply-all'"></i>
          {{ bulkReply.mode === 'forward' ? 'Chuyển tiếp hàng loạt' : 'Gửi hàng loạt' }}
        </h3>
        <p class="text-xs text-gray-500 mb-4">Sẽ gửi tới <strong>{{ bulkReply.candidateIds.length }}</strong> ứng viên</p>

        <!-- Mode tabs -->
        <div class="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
          <button
            @click="switchBulkMode('reply')"
            class="flex-1 text-xs py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1"
            :class="bulkReply.mode === 'reply' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            <i class="bi bi-reply"></i> Reply (Re:)
          </button>
          <button
            @click="switchBulkMode('forward')"
            class="flex-1 text-xs py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1"
            :class="bulkReply.mode === 'forward' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            <i class="bi bi-forward"></i> Forward (Fwd:)
          </button>
          <button
            @click="switchBulkMode('new')"
            class="flex-1 text-xs py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1"
            :class="bulkReply.mode === 'new' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            <i class="bi bi-envelope"></i> Email mới
          </button>
        </div>

        <!-- Forward to field -->
        <div v-if="bulkReply.mode === 'forward'" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <label class="block text-xs font-medium text-blue-700 mb-1">Chuyển tiếp đến <span class="text-red-500">*</span></label>
          <input v-model="bulkReply.forwardTo" type="email" placeholder="nguoinhan@example.com" class="w-full text-sm border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 bg-white" />
          <p class="text-xs text-blue-600 mt-1"><i class="bi bi-info-circle mr-0.5"></i>Nội dung email gốc sẽ được đính kèm bên dưới</p>
        </div>

        <!-- Reply context info -->
        <div v-if="bulkReply.mode === 'reply' && bulkReply.originalSubject" class="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-lg">
          <p class="text-xs text-rose-700"><i class="bi bi-reply mr-1"></i>Đang reply email: <strong>{{ bulkReply.originalSubject }}</strong></p>
          <p class="text-xs text-rose-600 mt-0.5">Nội dung email gốc sẽ được trích dẫn bên dưới</p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tiêu đề email <span class="text-red-500">*</span></label>
            <input v-model="bulkReply.subject" type="text" :placeholder="bulkReply.mode === 'reply' ? 'Re: Cảm ơn bạn đã ứng tuyển...' : bulkReply.mode === 'forward' ? 'Fwd: CV ứng viên...' : 'Cảm ơn bạn đã ứng tuyển tại...'" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tên người gửi</label>
            <input v-model="bulkReply.fromName" type="text" placeholder="HR Enterprise Meeting" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300" />
          </div>
          <!-- Email content source selector -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-2">Nội dung email <span class="text-red-500">*</span></label>

            <!-- No content chosen yet -->
            <div v-if="!bulkReply.bodyHtml" class="flex gap-2">
              <button
                type="button"
                @click="bulkTemplatePicker.show = true; loadBulkTemplatePicker()"
                class="flex-1 flex flex-col items-center gap-1.5 border-2 border-dashed border-gray-200 rounded-xl py-4 px-3 hover:border-rose-300 hover:bg-rose-50 transition-colors group"
              >
                <i class="bi bi-file-earmark-richtext text-2xl text-gray-400 group-hover:text-rose-400"></i>
                <span class="text-xs font-medium text-gray-600 group-hover:text-rose-600">Chọn từ Templates</span>
                <span class="text-xs text-gray-400">Dùng template đã có</span>
              </button>
              <button
                type="button"
                @click="bulkReply.editorOpen = true"
                class="flex-1 flex flex-col items-center gap-1.5 border-2 border-dashed border-gray-200 rounded-xl py-4 px-3 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <i class="bi bi-pencil-square text-2xl text-gray-400 group-hover:text-blue-400"></i>
                <span class="text-xs font-medium text-gray-600 group-hover:text-blue-600">Tự thiết kế</span>
                <span class="text-xs text-gray-400">Mở Email Builder</span>
              </button>
            </div>

            <!-- Content chosen -->
            <div v-else class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <i class="bi bi-check-circle-fill text-green-500"></i>
                  <span class="font-medium">{{ bulkReply.bodySourceLabel || 'Đã có nội dung' }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <button type="button" @click="bulkReply.previewOpen = true" class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100">
                    <i class="bi bi-eye mr-1"></i>Xem trước
                  </button>
                  <button type="button" @click="bulkReply.bodyHtml = ''; bulkReply.bodySourceLabel = ''" class="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">
                    <i class="bi bi-x mr-1"></i>Đổi
                  </button>
                </div>
              </div>
              <iframe
                :srcdoc="bulkReply.bodyHtml"
                class="w-full"
                style="height:160px; border:none; pointer-events:none;"
                sandbox="allow-same-origin"
              ></iframe>
            </div>
          </div>

          <!-- Original email preview (read-only) -->
          <div v-if="bulkReply.mode !== 'new' && bulkReply.originalQuote" class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span class="text-xs text-gray-500 font-medium"><i class="bi bi-quote mr-1"></i>Nội dung email gốc (đính kèm tự động)</span>
              <button @click="bulkReply.showOriginal = !bulkReply.showOriginal" class="text-xs text-gray-400 hover:text-gray-600">
                {{ bulkReply.showOriginal ? 'Ẩn' : 'Xem' }}
              </button>
            </div>
            <div v-if="bulkReply.showOriginal" class="max-h-40 overflow-y-auto p-3 bg-gray-50 text-xs text-gray-600 border-l-4 border-gray-300">
              <div v-html="bulkReply.originalQuote"></div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Cập nhật trạng thái ứng viên sau khi gửi</label>
            <select v-model="bulkReply.updateStatus" class="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-300">
              <option value="">Không thay đổi</option>
              <option v-for="s in inboxStatuses" :key="s.value" :value="s.value">→ {{ s.label }}</option>
            </select>
          </div>
        </div>

        <!-- Result -->
        <div v-if="bulkReply.result" class="mt-4 p-3 rounded-xl" :class="bulkReply.result.failed > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-emerald-50 border border-emerald-200'">
          <p class="text-sm font-medium" :class="bulkReply.result.failed > 0 ? 'text-amber-800' : 'text-emerald-800'">
            Kết quả: <strong>{{ bulkReply.result.sent }}</strong> thành công, <strong>{{ bulkReply.result.failed }}</strong> thất bại / {{ bulkReply.result.total }} tổng
          </p>
        </div>

        <div class="flex gap-2 mt-5">
          <button @click="bulkReply.show = false; bulkReply.result = null" class="flex-1 text-sm border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50">
            {{ bulkReply.result ? 'Đóng' : 'Hủy' }}
          </button>
          <button
            v-if="!bulkReply.result"
            @click="doBulkReply"
            :disabled="bulkReply.loading"
            class="flex-1 text-sm text-white py-2 rounded-lg disabled:opacity-60 transition-colors"
            :class="bulkReply.mode === 'forward' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-rose-500 hover:bg-rose-600'"
          >
            <i v-if="bulkReply.loading" class="bi bi-arrow-repeat animate-spin mr-1"></i>
            {{ bulkReply.loading ? 'Đang gửi...' : (bulkReply.mode === 'forward' ? 'Chuyển tiếp ngay' : 'Gửi ngay') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── BulkReply: Template Picker Modal ──────────────────────── -->
    <div v-if="bulkTemplatePicker.show" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="bulkTemplatePicker.show = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 flex flex-col max-h-[85vh]">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 class="text-sm font-semibold text-gray-900">Chọn Template</h3>
            <p class="text-xs text-gray-400 mt-0.5">Chọn một template để dùng làm nội dung email</p>
          </div>
          <button @click="bulkTemplatePicker.show = false" class="text-gray-400 hover:text-gray-600">
            <i class="bi bi-x-lg text-base"></i>
          </button>
        </div>
        <div class="px-5 py-3 border-b border-gray-100">
          <div class="relative">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              v-model="bulkTemplatePicker.search"
              @input="loadBulkTemplatePicker(true)"
              type="text"
              placeholder="Tìm template..."
              class="w-full text-sm border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="bulkTemplatePicker.loading" class="flex justify-center py-10">
            <i class="bi bi-arrow-repeat animate-spin text-rose-400 text-2xl"></i>
          </div>
          <div v-else-if="!bulkTemplatePicker.list.length" class="text-center py-10 text-gray-400">
            <i class="bi bi-file-earmark-x text-3xl mb-2 block"></i>
            <p class="text-sm">Không có template nào</p>
          </div>
          <div v-else class="grid grid-cols-2 gap-3">
            <button
              v-for="t in bulkTemplatePicker.list"
              :key="t._id"
              type="button"
              @click="applyBulkTemplate(t)"
              class="text-left border border-gray-200 rounded-xl overflow-hidden hover:border-rose-300 hover:shadow-md transition-all group"
            >
              <div class="h-28 bg-gray-50 overflow-hidden relative">
                <iframe
                  v-if="t.htmlSnapshot"
                  :srcdoc="t.htmlSnapshot"
                  class="w-full h-full"
                  style="transform:scale(0.4); transform-origin:top left; width:250%; height:250%; pointer-events:none;"
                  sandbox="allow-same-origin"
                ></iframe>
                <div v-else class="flex items-center justify-center h-full text-gray-300">
                  <i class="bi bi-file-earmark-richtext text-3xl"></i>
                </div>
                <div class="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span class="bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow">Chọn template này</span>
                </div>
              </div>
              <div class="px-3 py-2 border-t border-gray-100">
                <p class="text-xs font-medium text-gray-800 truncate">{{ t.name }}</p>
                <p class="text-xs text-gray-400 truncate mt-0.5">{{ t.category }}</p>
              </div>
            </button>
          </div>
        </div>
        <div v-if="bulkTemplatePicker.total > bulkTemplatePicker.limit" class="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span class="text-xs text-gray-400">{{ bulkTemplatePicker.total }} templates</span>
          <div class="flex gap-1">
            <button :disabled="bulkTemplatePicker.page <= 1" @click="bulkTemplatePicker.page--; loadBulkTemplatePicker()" class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
            <span class="text-xs px-2 py-1 text-gray-500">{{ bulkTemplatePicker.page }}</span>
            <button :disabled="bulkTemplatePicker.page * bulkTemplatePicker.limit >= bulkTemplatePicker.total" @click="bulkTemplatePicker.page++; loadBulkTemplatePicker()" class="text-xs px-2 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── BulkReply: Editor Iframe Overlay ───────────────────────── -->
    <div v-if="bulkReply.editorOpen" class="fixed inset-0 z-[70] flex flex-col bg-black/60">
      <div class="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        <div class="flex items-center gap-2">
          <i class="bi bi-pencil-square text-rose-500"></i>
          <span class="text-sm font-semibold text-gray-800">Thiết kế nội dung email</span>
          <span class="text-xs text-gray-400">— nhấn "Dùng template này" trong editor để xác nhận</span>
        </div>
        <button @click="bulkReply.editorOpen = false" class="text-gray-400 hover:text-gray-700 flex items-center gap-1.5 text-sm">
          <i class="bi bi-x-lg"></i> Đóng
        </button>
      </div>
      <iframe
        src="/editor?mode=embedded"
        class="flex-1 w-full border-none bg-white"
        ref="bulkEditorIframe"
      ></iframe>
    </div>

    <!-- ── BulkReply: Preview Modal ───────────────────────────────── -->
    <div v-if="bulkReply.previewOpen" class="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60" @click="bulkReply.previewOpen = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] z-10">
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Xem trước nội dung email</h3>
          <button @click="bulkReply.previewOpen = false" class="text-gray-400 hover:text-gray-600">
            <i class="bi bi-x-lg text-base"></i>
          </button>
        </div>
        <div class="flex-1 overflow-hidden p-1">
          <iframe
            :srcdoc="bulkReply.bodyHtml"
            class="w-full h-full rounded-xl"
            style="min-height:500px; border:none;"
            sandbox="allow-same-origin"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })

const { success: toastOk, error: toastErr, warning: toastWarn } = useToast()
const showToast = (msg, type = 'success') => {
  if (type === 'success') toastOk(msg)
  else if (type === 'error') toastErr(msg)
  else toastWarn(msg)
}
const api = useRecruitmentApi()

// ── Tabs ──────────────────────────────────────────────────────────
const activeTab = ref('inbox')
const tabs = computed(() => [
  { key: 'inbox',   label: 'Inbox',        icon: 'bi bi-inbox',         badge: stats.value.unread > 0 ? stats.value.unread : null },
  { key: 'jobs',    label: 'Vị trí',       icon: 'bi bi-briefcase' },
  { key: 'rules',   label: 'Auto-Reply',   icon: 'bi bi-robot' },
  { key: 'replies', label: 'Lịch sử gửi',  icon: 'bi bi-send-check' },
])

// ── Stats ─────────────────────────────────────────────────────────
const stats = ref({ total: 0, unread: 0, openJobs: 0, replyRate: 0, activeAutoRules: 0 })

const loadStats = async () => {
  try {
    const res = await api.fetchStats()
    if (res.success) Object.assign(stats.value, res.data)
  } catch {}
}

// ── Inbox ─────────────────────────────────────────────────────────
const inboxStatuses = [
  { value: 'new',        label: 'Mới',          activeClass: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'reviewing',  label: 'Đang xem',     activeClass: 'border-amber-400 bg-amber-50 text-amber-700' },
  { value: 'shortlisted',label: 'Tiềm năng',    activeClass: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
  { value: 'rejected',   label: 'Từ chối',      activeClass: 'border-red-400 bg-red-50 text-red-700' },
  { value: 'replied',    label: 'Đã reply',     activeClass: 'border-purple-400 bg-purple-50 text-purple-700' },
]

const statusClass = (s) => ({
  new:         'bg-blue-100 text-blue-700',
  reviewing:   'bg-amber-100 text-amber-700',
  shortlisted: 'bg-emerald-100 text-emerald-700',
  rejected:    'bg-red-100 text-red-700',
  replied:     'bg-purple-100 text-purple-700',
}[s] || 'bg-gray-100 text-gray-500')

const statusLabel = (s) => inboxStatuses.find(x => x.value === s)?.label || s

const inbox = reactive({
  list: [],
  selected: null,
  thread: [],
  loading: false,
  total: 0,
  page: 1,
  limit: 20,
  search: '',
  statusFilter: '',
  jobFilter: '',
  bulkSelected: [],
})

const fetchInbox = async () => {
  inbox.loading = true
  try {
    const params = { page: inbox.page, limit: inbox.limit }
    if (inbox.search) params.search = inbox.search
    if (inbox.statusFilter) params.status = inbox.statusFilter
    if (inbox.jobFilter) params.job_id = inbox.jobFilter
    const res = await api.fetchInbox(params)
    if (res.success) {
      inbox.list = res.data
      inbox.total = res.pagination.total
    } else {
      showToast(res.message || 'Lỗi tải inbox', 'error')
    }
  } catch (e) {
    showToast('Lỗi tải inbox: ' + e.message, 'error')
  } finally {
    inbox.loading = false
  }
}

let debounceTimer = null
const debouncedFetchInbox = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { inbox.page = 1; fetchInbox() }, 400)
}

const openEmailDetail = async (email) => {
  inbox.selected = email
  inbox.thread = []
  try {
    const res = await api.fetchEmail(email.id)
    if (res.success) {
      inbox.selected = res.data
      inbox.thread = res.thread || []
      // Update isRead in list
      const idx = inbox.list.findIndex(e => e.id === email.id)
      if (idx !== -1) inbox.list[idx].isRead = true
      loadStats()
    }
  } catch {}
}

const emailIframe = ref(null)
const downloadingAttachment = ref(null)

const downloadAttachmentFile = async (emailId, attachmentIndex, filename) => {
  const key = `${emailId}-${attachmentIndex}`
  downloadingAttachment.value = key
  try {
    await api.downloadAttachment(emailId, attachmentIndex, filename)
  } catch (e) {
    showToast('Lỗi tải file: ' + e.message, 'error')
  } finally {
    downloadingAttachment.value = null
  }
}
const autoResizeIframe = () => {
  const iframe = emailIframe.value
  if (!iframe) return
  try {
    const h = iframe.contentDocument?.body?.scrollHeight
    if (h) iframe.style.height = h + 40 + 'px'
  } catch {}
}

const patchEmailStatus = async (id, status) => {
  try {
    const res = await api.patchEmail(id, { status })
    if (res.success) {
      inbox.selected = res.data
      const idx = inbox.list.findIndex(e => e.id === id)
      if (idx !== -1) inbox.list[idx].status = status
      showToast('Đã cập nhật trạng thái', 'success')
      loadStats()
    } else {
      showToast(res.message || 'Cập nhật trạng thái thất bại', 'error')
    }
  } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
}

const patchEmailJob = async (id, jobId) => {
  try {
    const res = await api.patchEmail(id, { job_id: jobId ? Number(jobId) : null })
    if (res.success) { inbox.selected = res.data; showToast('Đã gắn job', 'success') }
    else { showToast(res.message || 'Gắn job thất bại', 'error') }
  } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
}

const confirmDeleteEmail = (id) => {
  confirm.title = 'Xóa email'
  confirm.message = 'Bạn có chắc muốn xóa email này? Chọn "Xóa cả trên Gmail" để xóa luôn khỏi hộp thư gốc.'
  confirm.type = 'danger'
  confirm.loading = false
  confirm.visible = true
  confirm.extraAction = { label: 'Xóa cả trên Gmail', value: false }
  confirm.onConfirm = async () => {
    confirm.loading = true
    const deleteFromMail = confirm.extraAction?.value ?? false
    try {
      const res = await api.deleteEmail(id, deleteFromMail)
      inbox.list = inbox.list.filter(e => e.id !== id)
      if (inbox.selected?.id === id) inbox.selected = null
      if (deleteFromMail) {
        showToast(res.imapDeleted ? 'Đã xóa khỏi inbox và Gmail' : 'Đã xóa khỏi inbox (không tìm thấy trên Gmail)', 'success')
      } else {
        showToast('Đã xóa khỏi inbox', 'success')
      }
      loadStats()
    } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
    confirm.visible = false
    confirm.extraAction = null
  }
}

const toggleBulkSelect = (id) => {
  const i = inbox.bulkSelected.indexOf(id)
  if (i === -1) inbox.bulkSelected.push(id)
  else inbox.bulkSelected.splice(i, 1)
}

const confirmBulkDelete = () => {
  const count = inbox.bulkSelected.length
  confirm.title = `Xóa ${count} email`
  confirm.message = `Bạn có chắc muốn xóa ${count} email đã chọn? Hành động này không thể hoàn tác.`
  confirm.type = 'danger'
  confirm.loading = false
  confirm.visible = true
  confirm.extraAction = { label: 'Xóa cả trên Gmail (chạy nền)', value: false }
  confirm.onConfirm = async () => {
    confirm.loading = true
    const ids = [...inbox.bulkSelected]
    const deleteFromMail = confirm.extraAction?.value ?? false
    try {
      const res = await api.bulkDeleteEmails(ids, deleteFromMail)
      if (res.success) {
        inbox.list = inbox.list.filter(e => !ids.includes(e.id))
        if (inbox.selected && ids.includes(inbox.selected.id)) inbox.selected = null
        inbox.bulkSelected = []
        const suffix = deleteFromMail ? ' (đang xóa trên Gmail trong nền)' : ''
        showToast(`Đã xóa ${res.deleted} email${suffix}`, 'success')
        loadStats()
      } else {
        showToast(res.message || 'Xóa thất bại', 'error')
      }
    } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
    confirm.loading = false
    confirm.visible = false
    confirm.extraAction = null
  }
}

// ── Refresh all ───────────────────────────────────────────────────
const refreshing = ref(false)
const refreshAll = async () => {
  refreshing.value = true
  try {
    await Promise.all([loadStats(), fetchInbox(), fetchJobs(), fetchRules(), fetchReplies()])
    showToast('Đã cập nhật dữ liệu', 'success')
  } finally {
    refreshing.value = false
  }
}

// ── Pull ──────────────────────────────────────────────────────────
const pull = reactive({ show: false, loading: false, pulling: false, jobId: null, maxFetch: 50, folder: 'INBOX' })

const openPullModal = () => { pull.pulling = false; pull.show = true }

const doPull = async () => {
  pull.loading = true
  try {
    const res = await api.pullInbox({ job_id: pull.jobId, max_fetch: pull.maxFetch, folder: pull.folder })
    if (res.success) {
      pull.pulling = true
      showToast('Đang kéo email trong nền. Nhấn Refresh sau vài giây để xem.', 'warning')
      pull.loading = false
      // Auto-refresh sau 8s và 20s để lấy dữ liệu về
      setTimeout(() => { fetchInbox(); loadStats() }, 8000)
      setTimeout(() => { fetchInbox(); loadStats() }, 20000)
    } else {
      showToast(res.message || 'Kéo email thất bại', 'error')
      pull.loading = false
    }
  } catch (e) {
    showToast('Lỗi pull: ' + e.message, 'error')
    pull.loading = false
  }
}

// ── Jobs ──────────────────────────────────────────────────────────
const jobs = reactive({ list: [], loading: false })

const fetchJobs = async () => {
  jobs.loading = true
  try {
    const res = await api.fetchJobs()
    if (res.success) jobs.list = res.data
  } catch {} finally { jobs.loading = false }
}

const jobForm = reactive({
  show: false, isEdit: false, loading: false,
  data: { title: '', department: '', email_alias: '', description: '', status: 'open' },
  editId: null,
})

const openJobForm = (job = null) => {
  jobForm.isEdit = !!job
  jobForm.editId = job?.id || null
  jobForm.data = job
    ? { title: job.title, department: job.department || '', email_alias: job.email_alias || '', description: job.description || '', status: job.status }
    : { title: '', department: '', email_alias: '', description: '', status: 'open' }
  jobForm.show = true
}

const saveJob = async () => {
  if (!jobForm.data.title?.trim()) { showToast('Tiêu đề là bắt buộc', 'error'); return }
  jobForm.loading = true
  try {
    const res = jobForm.isEdit
      ? await api.updateJob(jobForm.editId, jobForm.data)
      : await api.createJob(jobForm.data)
    if (res.success) {
      showToast(jobForm.isEdit ? 'Đã cập nhật' : 'Đã tạo mới', 'success')
      jobForm.show = false
      fetchJobs()
    } else {
      showToast(res.message || 'Lưu vị trí thất bại', 'error')
    }
  } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
  finally { jobForm.loading = false }
}

const confirmDeleteJob = (id) => {
  confirm.title = 'Xóa vị trí'
  confirm.message = 'Bạn có chắc muốn xóa vị trí tuyển dụng này?'
  confirm.type = 'danger'
  confirm.loading = false
  confirm.visible = true
  confirm.onConfirm = async () => {
    confirm.loading = true
    try {
      await api.deleteJob(id)
      jobs.list = jobs.list.filter(j => j.id !== id)
      showToast('Đã xóa', 'success')
    } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
    confirm.visible = false
  }
}

const quickFilterJobInbox = (jobId) => {
  activeTab.value = 'inbox'
  inbox.jobFilter = jobId
  inbox.page = 1
  fetchInbox()
}

// ── Auto Rules ────────────────────────────────────────────────────
const rules = reactive({ list: [], loading: false })

const fetchRules = async () => {
  rules.loading = true
  try {
    const res = await api.fetchRules()
    if (res.success) rules.list = res.data
  } catch {} finally { rules.loading = false }
}

const ruleForm = reactive({
  show: false, isEdit: false, loading: false, editId: null,
  editorOpen: false, previewOpen: false, bodySourceLabel: '',
  data: { name: '', job_id: null, delay_minutes: 0, reply_subject: '', from_name: '', body_html: '', template_id: null, is_active: true, reply_type: 'reply' },
})

const templatePicker = reactive({ show: false, loading: false, search: '', list: [], total: 0, page: 1, limit: 12 })
const { getUserTemplates, getTemplate } = useTemplateAPI()
const editorIframe = ref(null)

const loadTemplatePicker = async (resetPage = false) => {
  if (resetPage) templatePicker.page = 1
  templatePicker.loading = true
  try {
    const { templates, pagination } = await getUserTemplates({ search: templatePicker.search || undefined, page: templatePicker.page, limit: templatePicker.limit })
    templatePicker.list = templates || []
    templatePicker.total = pagination?.total || 0
  } catch (e) { showToast('Không thể tải danh sách template', 'error') }
  finally { templatePicker.loading = false }
}

const applyTemplate = async (t) => {
  let html = t.htmlSnapshot
  if (!html) {
    try {
      const full = await getTemplate(t._id)
      html = full.htmlSnapshot || ''
    } catch { showToast('Không thể tải nội dung template', 'error'); return }
  }
  ruleForm.data.body_html = html
  ruleForm.data.template_id = t._id
  ruleForm.bodySourceLabel = `Template: ${t.name}`
  templatePicker.show = false
}

const onEditorMessage = (e) => {
  if (e.data?.type !== 'RECRUITMENT_RULE_HTML') return
  if (bulkReply.editorOpen) {
    bulkReply.bodyHtml = e.data.html
    bulkReply.bodySourceLabel = 'Đã thiết kế tùy chỉnh'
    bulkReply.editorOpen = false
  } else if (ruleForm.editorOpen) {
    ruleForm.data.body_html = e.data.html
    ruleForm.data.template_id = null
    ruleForm.bodySourceLabel = 'Đã thiết kế tùy chỉnh'
    ruleForm.editorOpen = false
  }
}


const openRuleForm = (rule = null) => {
  ruleForm.isEdit = !!rule
  ruleForm.editId = rule?.id || null
  ruleForm.editorOpen = false
  ruleForm.previewOpen = false
  if (rule) {
    ruleForm.bodySourceLabel = rule.templateId ? `Template đã lưu (#${rule.templateId})` : (rule.bodyHtml ? 'Nội dung đã thiết kế' : '')
    ruleForm.data = {
      name: rule.name,
      job_id: rule.jobId,
      delay_minutes: rule.delayMinutes,
      reply_subject: rule.replySubject || '',
      from_name: rule.fromName || '',
      body_html: rule.bodyHtml || '',
      template_id: rule.templateId || null,
      is_active: rule.isActive,
      reply_type: rule.replyType || 'reply',
    }
  } else {
    ruleForm.bodySourceLabel = ''
    ruleForm.data = { name: '', job_id: null, delay_minutes: 0, reply_subject: '', from_name: '', body_html: '', template_id: null, is_active: true, reply_type: 'reply' }
  }
  ruleForm.show = true
}

const saveRule = async () => {
  if (!ruleForm.data.name?.trim()) { showToast('Tên rule là bắt buộc', 'error'); return }
  if (!ruleForm.data.body_html?.trim() && !ruleForm.data.template_id) {
    showToast('Vui lòng chọn template hoặc thiết kế nội dung email', 'error'); return
  }
  ruleForm.loading = true
  try {
    const payload = { ...ruleForm.data }
    if (payload.template_id) payload.body_html = payload.body_html || undefined
    const res = ruleForm.isEdit
      ? await api.updateRule(ruleForm.editId, payload)
      : await api.createRule(payload)
    if (res.success) {
      showToast(ruleForm.isEdit ? 'Đã cập nhật rule' : 'Đã tạo rule', 'success')
      ruleForm.show = false
      fetchRules()
      loadStats()
    } else {
      showToast(res.message || 'Lưu rule thất bại', 'error')
    }
  } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
  finally { ruleForm.loading = false }
}

const handleToggleRule = async (rule) => {
  try {
    const res = await api.toggleRule(rule.id)
    if (res.success) {
      rule.isActive = res.data.isActive
      showToast(rule.isActive ? 'Đã bật rule' : 'Đã tắt rule', 'success')
      loadStats()
    } else {
      showToast(res.message || 'Thao tác thất bại', 'error')
    }
  } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
}

const confirmDeleteRule = (id) => {
  confirm.title = 'Xóa rule'
  confirm.message = 'Bạn có chắc muốn xóa auto-reply rule này?'
  confirm.type = 'danger'
  confirm.loading = false
  confirm.visible = true
  confirm.onConfirm = async () => {
    confirm.loading = true
    try {
      await api.deleteRule(id)
      rules.list = rules.list.filter(r => r.id !== id)
      showToast('Đã xóa rule', 'success')
    } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
    confirm.visible = false
  }
}

// ── Replies tab ───────────────────────────────────────────────────
const repliesTab = reactive({ list: [], loading: false, total: 0, page: 1 })

const fetchReplies = async () => {
  repliesTab.loading = true
  try {
    const res = await api.fetchReplies({ page: repliesTab.page, limit: 50 })
    if (res.success) { repliesTab.list = res.data; repliesTab.total = res.pagination.total }
  } catch {} finally { repliesTab.loading = false }
}

// Group flat reply list → by bulkId for display
const repliesTab_grouped = computed(() => {
  const map = new Map()
  for (const r of repliesTab.list) {
    const key = r.bulkId || `single-${r.id}`
    if (!map.has(key)) {
      map.set(key, {
        bulkId: key,
        subject: r.subject,
        createdAt: r.createdAt,
        isAuto: key.startsWith('auto:'),
        sent: 0, failed: 0, total: 0,
        recipients: [],
      })
    }
    const g = map.get(key)
    g.total++
    if (r.status === 'sent') g.sent++
    else if (r.status === 'failed') g.failed++
    g.recipients.push(r)
  }
  // Sort by createdAt desc
  return [...map.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Expose as repliesTab.grouped for template
watch(repliesTab_grouped, (v) => { repliesTab.grouped = v }, { immediate: true })
repliesTab.grouped = []

// ── Bulk Detail Drawer ────────────────────────────────────────────
const bulkDetail = reactive({
  show: false,
  loading: false,
  bulkId: null,
  data: null,       // { total, sent, failed, subject, createdAt, recipients[] }
  jobInfo: null,    // from getJob
  filter: '',       // '' | 'sent' | 'failed' | 'pending'
})

const bulkDetailFiltered = computed(() => {
  if (!bulkDetail.data?.recipients) return []
  if (!bulkDetail.filter) return bulkDetail.data.recipients
  return bulkDetail.data.recipients.filter(r => r.status === bulkDetail.filter)
})

const openBulkDetail = async (bulkId) => {
  bulkDetail.bulkId = bulkId
  bulkDetail.data = null
  bulkDetail.jobInfo = null
  bulkDetail.filter = ''
  bulkDetail.loading = true
  bulkDetail.show = true

  try {
    const res = await api.fetchBulkDetail(bulkId)
    if (res.success) {
      bulkDetail.data = res.data

      // Nếu có jobId trong bất kỳ recipient nào → gọi getJob
      const firstWithJob = res.data.recipients?.find(r => r.candidateEmailId)
      if (firstWithJob) {
        // Tìm job từ cache local trước
        const email = inbox.list.find(e => e.id === firstWithJob.candidateEmailId)
        if (email?.jobId) {
          const cachedJob = jobs.list.find(j => j.id === email.jobId)
          if (cachedJob) {
            bulkDetail.jobInfo = cachedJob
          } else {
            try {
              const jobRes = await api.getJob(email.jobId)
              if (jobRes.success) bulkDetail.jobInfo = jobRes.data
            } catch {}
          }
        }
      }
    }
  } catch (e) {
    showToast('Lỗi tải chi tiết: ' + e.message, 'error')
    bulkDetail.show = false
  } finally {
    bulkDetail.loading = false
  }
}

// ── Bulk Reply ────────────────────────────────────────────────────
const bulkReply = reactive({
  show: false, loading: false, result: null,
  mode: 'reply',   // 'reply' | 'forward' | 'new'
  candidateIds: [],
  subject: '',
  fromName: '',
  bodyHtml: '',
  bodySourceLabel: '',
  editorOpen: false,
  previewOpen: false,
  updateStatus: '',
  forwardTo: '',
  originalSubject: '',
  originalQuote: '',
  showOriginal: false,
})

const bulkTemplatePicker = reactive({ show: false, loading: false, search: '', list: [], total: 0, page: 1, limit: 12 })
const bulkEditorIframe = ref(null)

const loadBulkTemplatePicker = async (resetPage = false) => {
  if (resetPage) bulkTemplatePicker.page = 1
  bulkTemplatePicker.loading = true
  try {
    const { templates, pagination } = await getUserTemplates({ search: bulkTemplatePicker.search || undefined, page: bulkTemplatePicker.page, limit: bulkTemplatePicker.limit })
    bulkTemplatePicker.list = templates || []
    bulkTemplatePicker.total = pagination?.total || 0
  } catch (e) { showToast('Không thể tải danh sách template', 'error') }
  finally { bulkTemplatePicker.loading = false }
}

const applyBulkTemplate = async (t) => {
  if (!t.htmlSnapshot) {
    try {
      const full = await getTemplate(t._id)
      bulkReply.bodyHtml = full.htmlSnapshot || ''
    } catch { showToast('Không thể tải nội dung template', 'error'); return }
  } else {
    bulkReply.bodyHtml = t.htmlSnapshot
  }
  bulkReply.bodySourceLabel = `Template: ${t.name}`
  bulkTemplatePicker.show = false
}

const buildOriginalQuote = (email) => {
  if (!email) return ''
  const from = email.fromName ? `${email.fromName} &lt;${email.fromEmail}&gt;` : email.fromEmail
  const date = email.receivedAt ? new Date(email.receivedAt).toLocaleString('vi-VN') : ''
  const body = email.bodyHtml || `<pre style="font-family:inherit">${email.bodyText || ''}</pre>`
  return `<div style="border-left:3px solid #ccc;padding-left:12px;margin-top:16px;color:#555;font-size:13px">
    <p style="margin:0 0 8px"><strong>Từ:</strong> ${from}<br><strong>Ngày:</strong> ${date}<br><strong>Tiêu đề:</strong> ${email.subject || ''}</p>
    ${body}
  </div>`
}

const openBulkReply = (mode = 'reply') => {
  bulkReply.candidateIds = [...inbox.bulkSelected]
  bulkReply.mode = mode
  bulkReply.fromName = ''
  bulkReply.bodyHtml = ''
  bulkReply.bodySourceLabel = ''
  bulkReply.editorOpen = false
  bulkReply.previewOpen = false
  bulkReply.updateStatus = ''
  bulkReply.forwardTo = ''
  bulkReply.result = null
  bulkReply.showOriginal = false

  // Nếu đang xem 1 email cụ thể → lấy nội dung gốc để quote
  const sel = inbox.selected
  if (sel && bulkReply.candidateIds.length === 1 && bulkReply.candidateIds[0] === sel.id) {
    bulkReply.originalSubject = sel.subject || ''
    bulkReply.originalQuote = buildOriginalQuote(sel)
    if (mode === 'reply') {
      const base = sel.subject || ''
      bulkReply.subject = base.startsWith('Re:') ? base : `Re: ${base}`
    } else if (mode === 'forward') {
      const base = sel.subject || ''
      bulkReply.subject = base.startsWith('Fwd:') ? base : `Fwd: ${base}`
    } else {
      bulkReply.subject = ''
      bulkReply.originalQuote = ''
    }
  } else {
    bulkReply.originalSubject = ''
    bulkReply.originalQuote = ''
    bulkReply.subject = ''
  }

  bulkReply.show = true
}

const switchBulkMode = (mode) => {
  bulkReply.mode = mode
  // Điều chỉnh prefix subject khi đổi mode
  if (bulkReply.originalSubject) {
    const base = bulkReply.originalSubject
    if (mode === 'reply') {
      bulkReply.subject = base.startsWith('Re:') ? base : `Re: ${base}`
    } else if (mode === 'forward') {
      bulkReply.subject = base.startsWith('Fwd:') ? base : `Fwd: ${base}`
    } else {
      bulkReply.subject = ''
    }
  }
  if (mode === 'new') {
    bulkReply.originalQuote = ''
  } else if (!bulkReply.originalQuote && inbox.selected) {
    bulkReply.originalQuote = buildOriginalQuote(inbox.selected)
  }
}

const openBulkReplyFor = (ids, mode = 'reply') => {
  inbox.bulkSelected = ids
  openBulkReply(mode)
}

const doBulkReply = async () => {
  if (!bulkReply.subject?.trim()) { showToast('Tiêu đề là bắt buộc', 'error'); return }
  if (!bulkReply.bodyHtml?.trim()) { showToast('Vui lòng chọn template hoặc thiết kế nội dung email', 'error'); return }
  if (bulkReply.mode === 'forward' && !bulkReply.forwardTo?.trim()) {
    showToast('Vui lòng nhập email người nhận để chuyển tiếp', 'error'); return
  }
  bulkReply.loading = true
  try {
    // Ghép nội dung gốc vào body nếu là reply/forward
    let finalBodyHtml = bulkReply.bodyHtml
    if (bulkReply.mode !== 'new' && bulkReply.originalQuote) {
      finalBodyHtml = bulkReply.bodyHtml + bulkReply.originalQuote
    }

    const payload = {
      candidate_ids: bulkReply.candidateIds,
      subject: bulkReply.subject,
      body_html: finalBodyHtml,
      from_name: bulkReply.fromName || undefined,
      update_candidate_status: bulkReply.updateStatus || undefined,
      reply_mode: bulkReply.mode,
      forward_to: bulkReply.mode === 'forward' ? bulkReply.forwardTo : undefined,
    }
    const res = await api.bulkReply(payload)
    if (res.success) {
      showToast('Đang gửi trong nền. Kiểm tra "Lịch sử gửi" sau vài giây.', 'warning')
      bulkReply.show = false
      bulkReply.result = null
      inbox.bulkSelected = []
      setTimeout(() => { fetchReplies(); fetchInbox(); loadStats() }, 5000)
      setTimeout(() => fetchReplies(), 15000)
    } else {
      showToast(res.message || 'Gửi hàng loạt thất bại', 'error')
    }
  } catch (e) { showToast('Lỗi: ' + e.message, 'error') }
  finally { bulkReply.loading = false }
}

// ── Confirm modal ─────────────────────────────────────────────────
const confirm = reactive({
  visible: false, loading: false, title: '', message: '', type: 'danger',
  onConfirm: () => {},
  extraAction: null,  // { label, value } — optional checkbox
})

// ── Utils ─────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  const now = new Date()
  const diffMs = now - dt
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return diffDays + ' ngày trước'
  return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const formatDateFull = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
}

const attachmentIcon = (mimeType = '') => {
  if (mimeType.startsWith('image/')) return 'bi-file-image text-purple-400'
  if (mimeType === 'application/pdf') return 'bi-file-pdf text-red-400'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'bi-file-word text-blue-500'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'bi-file-excel text-green-500'
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'bi-file-zip text-yellow-500'
  return 'bi-file-earmark text-gray-400'
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

// ── Init ──────────────────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener('message', onEditorMessage)
  await Promise.all([loadStats(), fetchInbox(), fetchJobs(), fetchRules(), fetchReplies()])
})

onUnmounted(() => {
  window.removeEventListener('message', onEditorMessage)
})

watch(activeTab, (tab) => {
  if (tab === 'replies') fetchReplies()
})
</script>
