<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header -->
    <div class="shrink-0 bg-white border-b border-gray-100 z-20">
      <div class="px-4 sm:px-6 py-4">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <h1 class="text-xl font-black text-gray-900 tracking-tight">Sign Hub</h1>
            <p class="text-xs text-gray-500 mt-0.5">
              All documents and processes requiring your signature
              <span v-if="pendingItems.length" class="text-gray-700 font-semibold">— {{ pendingItems.length }} pending item{{ pendingItems.length > 1 ? 's' : '' }}</span>
            </p>
          </div>
          <div class="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit md:ml-auto">
            <button
              @click="activeMainTab = 'documents'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold"
              :class="activeMainTab === 'documents' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
            >
              Documents
            </button>
            <button
              @click="activeMainTab = 'signature'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold"
              :class="activeMainTab === 'signature' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
            >
              <i class="bi bi-pen mr-1"></i>Chữ ký
            </button>
          </div>
        </div>

        <!-- Document type chips -->
        <div class="mt-3 flex items-center gap-2 flex-wrap">
          <button
            v-for="tab in sourceTabs"
            :key="tab.value"
            @click="activeSource = tab.value"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
            :class="activeSource === tab.value ? tab.activeClass : tab.class"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
          </button>
        </div>

        <!-- Top controls -->
        <div class="mt-4">
          <div v-if="activeMainTab === 'documents'" class="w-full md:flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
            <div class="relative flex-1">
              <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                v-model="search"
                type="text"
                placeholder="Search document or employee..."
                class="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div class="flex items-center gap-1.5 shrink-0 flex-wrap">
              <button
                @click="statusFilter = 'pending'"
                class="px-3.5 py-2 text-sm font-semibold rounded-xl transition-all"
                :class="statusFilter === 'pending' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'"
              >Pending</button>
              <button
                @click="statusFilter = 'all'"
                class="px-3.5 py-2 text-sm font-semibold rounded-xl transition-all"
                :class="statusFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'"
              >All</button>
              <button
                class="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showHistoryDrawer = true"
              >
                <i class="bi bi-clock-history mr-1"></i>Lịch sử ký duyệt
              </button>
              <span class="text-xs text-gray-400 sm:ml-1">{{ filteredItems.length }} result{{ filteredItems.length !== 1 ? 's' : '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="offboardingStore.loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Content -->
    <div v-else class="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
      <div class="w-full">
        <template v-if="activeMainTab === 'documents'">

        <!-- Empty -->
        <div v-if="filteredItems.length === 0" class="text-center py-16">
          <i class="bi bi-inbox text-5xl text-gray-200 mb-4 block"></i>
          <p class="text-gray-500 font-medium">
            {{ statusFilter === 'pending' ? 'Không có tài liệu nào đang chờ chữ ký' : 'Không có tài liệu nào' }}
          </p>
          <button
            class="mt-4 px-4 py-2 text-xs font-semibold rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            @click="openSignatureModal"
          >
            {{ signatureStatus?.has_signature ? 'Quản lý chữ ký cá nhân' : 'Tạo chữ ký cá nhân' }}
          </button>
        </div>

        <template v-else>
          <!-- Desktop/Tablet Table -->
          <div class="hidden md:block bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <!-- Table header -->
            <div class="grid grid-cols-12 gap-3 px-4 py-2 border-b border-zinc-200 bg-zinc-50">
              <div class="col-span-1 text-xs font-semibold text-gray-400 uppercase">#</div>
              <div class="col-span-2 text-xs font-semibold text-gray-400 uppercase">Source</div>
              <div class="col-span-3 text-xs font-semibold text-gray-400 uppercase">Processing</div>
              <div class="col-span-3 text-xs font-semibold text-gray-400 uppercase">Employee / Document</div>
              <div class="col-span-2 text-xs font-semibold text-gray-400 uppercase">Details</div>
              <div class="col-span-1 text-xs font-semibold text-gray-400 uppercase">Date</div>
            </div>

            <!-- Rows -->
            <div
              v-for="(item, index) in filteredItems"
              :key="`${item.document_type || 'DOC'}-${item.id}`"
              class="grid grid-cols-12 gap-3 px-4 py-2.5 border-b border-zinc-100 hover:bg-blue-50/30 transition-colors items-center cursor-pointer group"
              @click="openPopup(item)"
            >
            <!-- # -->
            <div class="col-span-1 flex items-center gap-2">
              <div
                v-if="rolePendingStatuses.includes(item.status)"
                class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
              ></div>
              <span class="text-sm text-gray-500">{{ index + 1 }}</span>
            </div>

            <!-- Source -->
            <div class="col-span-2">
              <p
                class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg border"
                :class="documentTypeBadgeClass(item.document_type)"
              >
                {{ item.document_type || 'DOCUMENT' }}
              </p>
            </div>

            <!-- Processing -->
            <div class="col-span-3">
              <button
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
                @click.stop="openPopup(item)"
              >
                <i class="bi bi-pen"></i> {{ signActionLabel(item.status) }}
              </button>
            </div>

            <!-- Employee -->
            <div class="col-span-3 flex items-center gap-2 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-linear-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {{ initials(item.employee_name) }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ item.employee_name }}</p>
                <p class="text-xs text-gray-400 truncate">{{ item.employee_code }}</p>
              </div>
            </div>

            <!-- Details -->
            <div class="col-span-2">
              <p class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border" :class="statusBadgeClass(item.status)">
                {{ statusText(item.status) }}
              </p>
            </div>

            <!-- date -->
            <div class="col-span-1 flex items-center justify-end">
              <p class="text-xs text-gray-400">{{ formatDate(item.resignation_date) }}</p>
              <i class="bi bi-chevron-right text-gray-300 group-hover:text-blue-400 transition-colors ml-1"></i>
            </div>
            </div>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden space-y-2">
            <div
              v-for="(item, index) in filteredItems"
              :key="`m-${item.document_type || 'DOC'}-${item.id}`"
              class="bg-white border border-zinc-200 rounded-xl p-3"
              @click="openPopup(item)"
            >
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">#{{ index + 1 }}</span>
              <span class="text-xs text-gray-400">{{ formatDate(item.resignation_date) }}</span>
            </div>
            <div class="mt-2 flex items-center justify-between gap-2">
              <p
                class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-lg border"
                :class="documentTypeBadgeClass(item.document_type)"
              >
                {{ item.document_type || 'DOCUMENT' }}
              </p>
              <p class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border" :class="statusBadgeClass(item.status)">
                {{ statusText(item.status) }}
              </p>
            </div>
            <div class="mt-2 flex items-center gap-2 min-w-0">
              <div class="w-7 h-7 rounded-lg bg-linear-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {{ initials(item.employee_name) }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ item.employee_name }}</p>
                <p class="text-xs text-gray-400 truncate">{{ item.employee_code }}</p>
              </div>
            </div>
            <div class="mt-2">
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg"
                @click.stop="openPopup(item)"
              >
                <i class="bi bi-pen"></i> {{ signActionLabel(item.status) }}
              </button>
            </div>
            </div>
          </div>
        </template>

        </template>

        <div v-else-if="activeMainTab === 'signature'" class="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p class="text-sm font-bold text-gray-800">Quản lý chữ ký</p>
              <p class="text-xs text-gray-500">Lưu và cập nhật chữ ký dùng cho các văn bản cần ký duyệt.</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="openSignatureModal"
                class="px-3 py-2 text-xs font-semibold rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <i class="bi bi-pen"></i>
                {{ signatureStatus?.has_signature ? 'Chỉnh sửa chữ ký' : 'Tạo chữ ký cá nhân' }}
              </button>
              <button
                v-if="signatureStatus?.has_signature"
                @click="deleteSignature"
                :disabled="deletingSignature"
                class="px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5 disabled:opacity-60"
              >
                <i :class="deletingSignature ? 'bi bi-arrow-repeat animate-spin' : 'bi bi-trash3'"></i>
                Xoá chữ ký
              </button>
            </div>
          </div>

          <div
            v-if="signaturePreviewUrl"
            class="inline-flex items-center gap-3 px-3 py-2 rounded-xl border border-green-200 bg-green-50"
          >
            <span class="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
              <i class="bi bi-check2-circle"></i>
              Chữ ký hiện tại
            </span>
            <img
              :src="signaturePreviewUrl"
              alt="current-signature"
              class="h-10 max-w-52 object-contain rounded bg-white px-2 py-1 border border-green-100"
            />
          </div>
          <div v-else class="text-sm text-gray-500">
            Chưa có chữ ký, vui lòng tạo chữ ký để dùng cho các bước phê duyệt.
          </div>
        </div>

      </div>
    </div>

    <!-- Sign Hub Popup -->
    <OffboardingSignHubPopup
      v-if="selectedProcess"
      :process="selectedProcess"
      :submitting="offboardingStore.submitting"
      :can-act="selectedProcessCanAct"
      :header-badge="selectedProcessMeta.badge"
      :action-buttons="selectedProcessMeta.actions"
      @close="selectedProcess = null"
      @view-detail="goToSelectedDetail"
      @action="handleGMAction"
    />

    <!-- Signature setup modal -->
    <Teleport to="body">
      <div
        v-if="showSignatureModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="showSignatureModal = false"
      >
        <div class="bg-white rounded-xl w-full max-w-xl shadow-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-gray-900">Thiết lập chữ ký SignHub</p>
              <p class="text-xs text-gray-500">Bạn cần có chữ ký trước khi phê duyệt offboarding.</p>
            </div>
            <button class="w-8 h-8 rounded-lg hover:bg-gray-100" @click="showSignatureModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="p-5 space-y-4">
            <div class="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
              <button
                @click="signatureTab = 'draw'"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg"
                :class="signatureTab === 'draw' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
              >
                Tự ký
              </button>
              <button
                @click="signatureTab = 'upload'"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg"
                :class="signatureTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
              >
                Upload ảnh
              </button>
            </div>

            <div v-if="signatureTab === 'draw'" class="space-y-2">
              <canvas
                ref="signatureCanvas"
                width="700"
                height="220"
                class="w-full h-44 border border-gray-200 rounded-xl bg-white touch-none"
                @pointerdown="startDraw"
                @pointermove="drawMove"
                @pointerup="endDraw"
                @pointerleave="endDraw"
              />
              <div class="flex justify-end">
                <button
                  @click="clearSignatureCanvas"
                  class="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Xóa nét ký
                </button>
              </div>
            </div>

            <div v-else class="space-y-2">
              <input
                ref="signatureFileInput"
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                class="hidden"
                @change="onSignatureFileChange"
              />
              <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                <div class="min-w-0">
                  <p class="text-xs font-semibold text-gray-500 mb-0.5">Tệp chữ ký (PNG/JPG/JPEG, tối đa 20MB)</p>
                  <p class="text-xs text-gray-700 truncate">{{ signatureFileName }}</p>
                </div>
                <button
                  type="button"
                  class="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  @click="openSignatureFileDialog"
                >
                  Chọn tệp
                </button>
              </div>
              <div class="flex justify-end">
                <button
                  :disabled="!signatureFile || scanningSignature"
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                  @click="scanSignaturePreview"
                >
                  <i v-if="scanningSignature" class="bi bi-arrow-repeat animate-spin mr-1"></i>
                  Quét chữ ký preview
                </button>
              </div>
              <div v-if="signatureFilePreview" class="border border-gray-200 rounded-xl p-2 bg-gray-50">
                <p class="text-xs font-semibold text-gray-500 mb-1">Ảnh gốc</p>
                <img :src="signatureFilePreview" alt="signature-preview" class="max-h-28 object-contain mx-auto" />
              </div>
              <div v-if="scannedSignaturePreview" class="border border-blue-200 rounded-xl p-2 bg-blue-50/40">
                <p class="text-xs font-semibold text-blue-700 mb-1">Ảnh chữ ký đã quét (màu xanh)</p>
                <img :src="scannedSignaturePreview" alt="signature-scanned-preview" class="max-h-28 object-contain mx-auto" />
              </div>
            </div>
          </div>

          <div class="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              class="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
              @click="showSignatureModal = false"
            >
              Hủy
            </button>
            <button
              :disabled="savingSignature"
              class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
              @click="saveSignature"
            >
              <i v-if="savingSignature" class="bi bi-arrow-repeat animate-spin mr-1"></i>
              Lưu chữ ký
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
          v-if="showHistoryDrawer"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-9998"
          @click="showHistoryDrawer = false"
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
          v-if="showHistoryDrawer"
          class="fixed right-0 top-0 h-full w-full sm:w-1/3 min-w-90 max-w-140 bg-white shadow-2xl z-9999 flex flex-col border-l border-zinc-200 overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-zinc-200 bg-linear-to-r from-blue-50 to-indigo-50 flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-base font-black text-zinc-900 tracking-tight">
                Lịch sử ký duyệt
              </h3>
              <p class="text-xs text-zinc-500 mt-0.5">Nguồn: document_approval_logs</p>
            </div>
            <button
              class="w-9 h-9 rounded-full hover:bg-white/70 flex items-center justify-center transition-all"
              @click="showHistoryDrawer = false"
            >
              <i class="bi bi-x-lg text-zinc-500"></i>
            </button>
          </div>
          <div class="p-4 border-b border-zinc-100 space-y-2.5 bg-zinc-50/50">
            <input
              v-model="historyFilters.actor"
              type="text"
              placeholder="Actor..."
              class="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
            <div class="grid grid-cols-2 gap-2">
              <input
                v-model="historyFilters.from_date"
                type="date"
                class="px-2 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
              <input
                v-model="historyFilters.to_date"
                type="date"
                class="px-2 py-2 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:border-blue-400"
              />
            </div>
            <button
              class="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              @click="fetchApprovalHistory()"
            >
              Lọc dữ liệu
            </button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <div v-if="historyLoading" class="p-4 text-sm text-zinc-500">Đang tải lịch sử...</div>
            <div v-else-if="approvalHistory.length === 0" class="p-4 text-sm text-zinc-500">Chưa có bản ghi ký duyệt.</div>
            <div v-else class="divide-y divide-zinc-100">
              <div
                v-for="log in approvalHistory"
                :key="`drawer-log-${log.id}`"
                class="px-4 py-3"
              >
                <p class="text-sm font-semibold text-zinc-800 truncate">
                  {{ log.document_type }} · {{ log.document_ref || `#${log.document_id}` }}
                </p>
                <p class="text-xs text-zinc-500 truncate mt-0.5">
                  Step {{ log.step_number || '—' }} · {{ log.action }} · by {{ log.actor_name || log.actor_id || 'Unknown' }} ({{ log.actor_title || 'Unknown' }})
                </p>
                <div class="mt-1 flex items-center justify-between">
                  <span class="text-xs font-semibold text-zinc-700">{{ log.status_after || '—' }}</span>
                  <span class="text-xs text-zinc-400">{{ formatDate(log.acted_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="showDeleteSignatureModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="showDeleteSignatureModal = false"
      >
        <div class="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <p class="text-sm font-bold text-gray-900">Xoá chữ ký cá nhân</p>
            </div>
            <button class="w-8 h-8 rounded-lg hover:bg-gray-100" @click="showDeleteSignatureModal = false">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="px-5 py-4">
            <p class="text-sm text-gray-600">
              Bạn có chắc chắn muốn xoá chữ ký hiện tại? Sau khi xoá, bạn cần tạo chữ ký mới để tiếp tục phê duyệt offboarding.
            </p>
          </div>
          <div class="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              class="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
              @click="showDeleteSignatureModal = false"
            >
              Hủy
            </button>
            <button
              :disabled="deletingSignature"
              class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-60"
              @click="confirmDeleteSignature"
            >
              <i v-if="deletingSignature" class="bi bi-arrow-repeat animate-spin mr-1"></i>
              Xoá chữ ký
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth', 'offboarding'] })

const offboardingStore = useOffboardingStore()
const toast = useToast()
const { offboardingRole } = useOffboardingRole()
const authStore = useAuthStore()
const { profileDeptCode, profileDepartment, profileTitle, fetchProfile } = useUserProfile()
const route = useRoute()

const search          = ref('')
const statusFilter    = ref('pending')
const activeSource    = ref('all')
const activeMainTab   = ref('documents')
const selectedProcess = ref(null)
const showSignatureModal = ref(false)
const showDeleteSignatureModal = ref(false)
const showHistoryDrawer = ref(false)
const signatureStatus = ref({ has_signature: false, signature_type: null, signature_image_url: null, signature_data: null })
const pendingActionPayload = ref(null)
const signatureTab = ref('draw')
const signatureCanvas = ref(null)
const signatureFileInput = ref(null)
const isDrawing = ref(false)
const hasSignatureStroke = ref(false)
const savingSignature = ref(false)
const deletingSignature = ref(false)
const scanningSignature = ref(false)
const signatureFile = ref(null)
const signatureFilePreview = ref('')
const scannedSignaturePreview = ref('')
const signatureFileName = computed(() => signatureFile.value?.name || 'Chưa chọn tệp')
const historyLoading = ref(false)
const approvalHistory = ref([])
const signHubLogs = ref([])
const historyFilters = reactive({
  document_type: 'OFFBOARDING',
  actor: '',
  from_date: '',
  to_date: '',
})

const sourceTabs = [
  { value: 'all',            label: 'Documents',         icon: 'bi bi-collection',      class: 'bg-blue-50 text-blue-700 border-blue-200',        activeClass: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'OFFBOARDING',    label: 'Offboarding',       icon: 'bi bi-box-arrow-right',  class: 'bg-orange-50 text-orange-700 border-orange-200',   activeClass: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'ASSET_HANDOVER', label: 'BB Tài Sản',        icon: 'bi bi-box-seam',         class: 'bg-teal-50 text-teal-700 border-teal-200',         activeClass: 'bg-teal-100 text-teal-700 border-teal-200' },
  { value: 'JOB_HANDOVER',   label: 'BB Công Việc',      icon: 'bi bi-clipboard-check',  class: 'bg-violet-50 text-violet-700 border-violet-200',   activeClass: 'bg-violet-100 text-violet-700 border-violet-200' },
  { value: 'EXIT_INTERVIEW', label: 'BB Phỏng Vấn',      icon: 'bi bi-chat-square-text', class: 'bg-amber-50 text-amber-700 border-amber-200',      activeClass: 'bg-amber-100 text-amber-700 border-amber-200' },
]

const assetHandoverStore = useAssetHandoverStore()
const jobHandoverStore = useJobHandoverStore()
const exitInterviewStore = useExitInterviewStore()

onMounted(async () => {
  if (route.path === '/offboarding/sign-hub') {
    await navigateTo('/sign-hub')
    return
  }
  await Promise.all([
    fetchProfile(),
    offboardingStore.fetchProcesses(),
    assetHandoverStore.fetchList(),
    jobHandoverStore.fetchList(),
    exitInterviewStore.fetchList(),
    fetchSignHubLogs(),
    fetchApprovalHistory(),
    loadSignatureStatus(),
  ])
  initCanvas()
})

const CLOSED_STATUSES = ['COMPLETED', 'COMPLETED_BLOCKED', 'REJECTED']

const currentDeptCode   = profileDeptCode
const currentDepartment = profileDepartment
const currentTitle      = profileTitle
const deptRoot = (code) => String(code || '').toUpperCase().split('_')[0] || ''
const actorDeptRoot = computed(() => deptRoot(currentDeptCode.value) || deptRoot(currentDepartment.value))
const processDeptRoot = (process) => deptRoot(process?.dept_code ?? process?.department ?? '')
const isManagerOrDirectorSameDept = (process) => {
  const actorCode = currentDeptCode.value
  const actorRoot = actorDeptRoot.value
  const employeeDeptRoot = processDeptRoot(process)
  const isManagerLevel =
    actorCode.includes('MANAGER') ||
    actorCode.includes('DIRECTOR') ||
    currentTitle.value.includes('MANAGER') ||
    currentTitle.value.includes('DIRECTOR') ||
    currentTitle.value.includes('TRƯỞNG PHÒNG') ||
    currentTitle.value.includes('GIÁM ĐỐC')
  return actorRoot && employeeDeptRoot && actorRoot === employeeDeptRoot && isManagerLevel
}
const isManagerOrDirector = computed(() =>
  currentDeptCode.value.includes('MANAGER') ||
  currentDeptCode.value.includes('DIRECTOR') ||
  currentTitle.value.includes('MANAGER') ||
  currentTitle.value.includes('DIRECTOR') ||
  currentTitle.value.includes('TRƯỞNG PHÒNG') ||
  currentTitle.value.includes('GIÁM ĐỐC')
)
const isHRStaff = computed(() => {
  const actorCode = currentDeptCode.value
  return actorDeptRoot.value === 'HR' && (actorCode.includes('HR_STAFF') || currentTitle.value.includes('CHUYÊN VIÊN NHÂN SỰ'))
})
const isHRManagerOrDirector = computed(() => {
  const actorCode = currentDeptCode.value
  const isTitleHRLead = currentTitle.value.includes('TRƯỞNG PHÒNG NHÂN SỰ') || currentTitle.value.includes('GIÁM ĐỐC NHÂN SỰ')
  return actorDeptRoot.value === 'HR' && (actorCode.includes('HR_MANAGER') || actorCode.includes('HR_DIRECTOR') || isTitleHRLead)
})
const isGMDept = computed(() => {
  const actorCode = currentDeptCode.value
  const isTitleGM = currentTitle.value.includes('TỔNG GIÁM ĐỐC')
  return actorCode === 'GM' || actorCode.includes('GM_DIRECTOR') || actorDeptRoot.value === 'GM' || isTitleGM
})

const rolePendingStatuses = computed(() => {
  if (offboardingRole.value === 'EMPLOYEE') {
    return ['PENDING_MANAGER', 'PENDING_HR_PROCESS', 'PENDING_HR_APPROVAL', 'PENDING_GM', 'PENDING_HANDOVER']
  }
  const statuses = []
  if (isManagerOrDirector.value) statuses.push('PENDING_MANAGER')
  if (isHRStaff.value) statuses.push('PENDING_HR_PROCESS')
  if (isHRManagerOrDirector.value) statuses.push('PENDING_HR_APPROVAL')
  if (isGMDept.value) statuses.push('PENDING_GM')
  return statuses
})

const currentPortalUserId = computed(() => String(
  authStore.user?.portal_user_id ??
  authStore.user?.id ??
  ''
).trim())

const isRelatedToMember = (process) => {
  if (!process || !currentPortalUserId.value) return false
  const linkedPortalIds = [
    process.portal_user_id,
    process.employee_portal_user_id,
    process.requester_portal_user_id,
    process.created_by_portal_user_id,
    process.employee_id,
  ]
    .map(v => String(v ?? '').trim())
    .filter(Boolean)
  return linkedPortalIds.includes(currentPortalUserId.value)
}

const TERMINAL_STATUSES = ['COMPLETED', 'COMPLETED_BLOCKED', 'REJECTED']

const signHubLogDocs = computed(() => {
  const grouped = new Map()
  for (const log of signHubLogs.value || []) {
    const key = `${log.document_type || 'UNKNOWN'}:${log.document_id || log.id}`
    if (!grouped.has(key)) grouped.set(key, log)
  }
  return [...grouped.values()].map((log) => ({
    id: `log-${log.id}`,
    document_type: log.document_type || 'UNKNOWN',
    status: log.status_after || 'PENDING',
    employee_name: log.actor_name || 'Unknown',
    employee_code: log.actor_id || '—',
    application_ref: log.document_ref || `#${log.document_id}`,
    resignation_date: log.acted_at,
    acted_at: log.acted_at,
    _origin: 'log',
    _raw: log,
  }))
})

const isPendingForMe = (process) => {
  if (!process) return false
  if (offboardingRole.value === 'EMPLOYEE') {
    return isRelatedToMember(process) && rolePendingStatuses.value.includes(process.status)
  }
  if (process.status === 'PENDING_MANAGER') return isManagerOrDirectorSameDept(process)
  if (process.status === 'PENDING_HR_PROCESS') return isHRStaff.value
  if (process.status === 'PENDING_HR_APPROVAL') return isHRManagerOrDirector.value
  if (process.status === 'PENDING_GM') return isGMDept.value
  return false
}

const canActOnProcess = (process) => {
  if (!process) return false
  if (CLOSED_STATUSES.includes(process.status)) return false
  if (offboardingRole.value === 'EMPLOYEE') return false
  return isPendingForMe(process)
}

const offboardingDocs = computed(() =>
  offboardingStore.processes
    .filter(p => {
      const visibleStatuses = [
        'PENDING_MANAGER',
        'PENDING_HR_PROCESS',
        'PENDING_HR_APPROVAL',
        'PENDING_GM',
        'PENDING_HANDOVER',
        'COMPLETED',
        'COMPLETED_BLOCKED',
        'REJECTED',
      ]
      if (!visibleStatuses.includes(p.status)) return false
      if (offboardingRole.value === 'EMPLOYEE') return isRelatedToMember(p)
      return true
    })
    .map((p) => ({ ...p, document_type: 'OFFBOARDING', _origin: 'offboarding' }))
)

// Asset-handover docs (HO-2) — map sang schema chung
const assetHandoverDocs = computed(() =>
  assetHandoverStore.list.map((h) => ({
    id: h.id,
    document_type: 'ASSET_HANDOVER',
    document_id: h.id,
    status: h.status,
    employee_name: h.employee_name || 'Unknown',
    employee_code: h.employee_code || '—',
    application_ref: h.ref_code || `#${h.id}`,
    resignation_date: h.created_at,
    _origin: 'asset_handover',
    _raw: h,
  }))
)

// Job-handover docs (HO-1)
const jobHandoverDocs = computed(() =>
  jobHandoverStore.list.map((h) => ({
    id: h.id,
    document_type: 'JOB_HANDOVER',
    document_id: h.id,
    status: h.status,
    employee_name: h.employee_name || 'Unknown',
    employee_code: h.employee_code || '—',
    application_ref: h.ref_code || `#${h.id}`,
    resignation_date: h.created_at,
    _origin: 'job_handover',
    _raw: h,
  }))
)

// Exit-interview docs (HO-3)
const exitInterviewDocs = computed(() =>
  exitInterviewStore.list.map((h) => ({
    id: h.id,
    document_type: 'EXIT_INTERVIEW',
    document_id: h.id,
    status: h.status,
    employee_name: h.employee_name || 'Unknown',
    employee_code: h.employee_code || '—',
    application_ref: h.ref_code || `#${h.id}`,
    resignation_date: h.created_at,
    _origin: 'exit_interview',
    _raw: h,
  }))
)

const allItems = computed(() => {
  const docs = [...offboardingDocs.value]
  const offboardingKeys = new Set(offboardingDocs.value.map((d) => `${d.document_type}:${d.id}`))
  const otherDocs = signHubLogDocs.value.filter((d) => !offboardingKeys.has(`${d.document_type}:${d._raw?.document_id || d.id}`))

  // Deduplicate handover docs vs log
  const assetKeys = new Set(assetHandoverDocs.value.map((d) => `ASSET_HANDOVER:${d.id}`))
  const jobKeys   = new Set(jobHandoverDocs.value.map((d) => `JOB_HANDOVER:${d.id}`))
  const exitKeys  = new Set(exitInterviewDocs.value.map((d) => `EXIT_INTERVIEW:${d.id}`))
  const filteredOther = otherDocs.filter((d) => {
    const k = `${d.document_type}:${d._raw?.document_id || d.id}`
    return !assetKeys.has(k) && !jobKeys.has(k) && !exitKeys.has(k)
  })

  // Filter by employee for EMPLOYEE role
  const filterByEmployee = (list) => offboardingRole.value === 'EMPLOYEE'
    ? list.filter((d) => String(d._raw?.employee_id ?? '') === currentPortalUserId.value)
    : list

  const assetDocs = filterByEmployee(assetHandoverDocs.value)
  const jobDocs   = filterByEmployee(jobHandoverDocs.value)
  const exitDocs  = filterByEmployee(exitInterviewDocs.value)

  if (offboardingRole.value === 'EMPLOYEE') {
    return [
      ...docs,
      ...filteredOther.filter((d) => String(d.employee_code || '') === currentPortalUserId.value),
      ...assetDocs, ...jobDocs, ...exitDocs,
    ]
  }
  return [...docs, ...filteredOther, ...assetDocs, ...jobDocs, ...exitDocs]
})

const isHandoverPending = (p) => {
  if (TERMINAL_STATUSES.includes(p.status)) return false
  if (isHRStaff.value || isHRManagerOrDirector.value) {
    return ['DRAFT', 'PENDING_HR_CONFIRM'].includes(p.status)
  }
  return p.status === 'PENDING_EMPLOYEE_SIGN' &&
    String(p._raw?.employee_id ?? '') === currentPortalUserId.value
}

const pendingItems = computed(() =>
  allItems.value.filter((p) => {
    if (p.document_type === 'OFFBOARDING') {
      if (offboardingRole.value === 'EMPLOYEE') {
        return isRelatedToMember(p) && rolePendingStatuses.value.includes(p.status)
      }
      return canActOnProcess(p)
    }
    if (['ASSET_HANDOVER', 'JOB_HANDOVER', 'EXIT_INTERVIEW'].includes(p.document_type)) {
      return isHandoverPending(p)
    }
    return !TERMINAL_STATUSES.includes(p.status)
  })
)

const filteredItems = computed(() => {
  let list = statusFilter.value === 'pending' ? pendingItems.value : allItems.value

  if (activeSource.value !== 'all') {
    list = list.filter((p) => p.document_type === activeSource.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.employee_name?.toLowerCase().includes(q) ||
      p.employee_code?.toLowerCase().includes(q) ||
      p.application_ref?.toLowerCase().includes(q)
    )
  }

  return list
})

const signaturePreviewUrl = computed(() =>
  signatureStatus.value?.signature_image_url || signatureStatus.value?.signature_data || ''
)

const statusText = (status) => {
  const map = {
    PENDING_MANAGER:       'Awaiting Line Manager',
    PENDING_HR_PROCESS:    'Awaiting HR Staff',
    PENDING_HR_APPROVAL:   'Awaiting HR Manager/Director',
    PENDING_GM:            'Awaiting GM',
    PENDING_HANDOVER:      'Awaiting Handover',
    COMPLETED:             'Completed',
    COMPLETED_BLOCKED:     'Blocked',
    REJECTED:              'Rejected',
    DRAFT:                 'Draft',
    PENDING_EMPLOYEE_SIGN: 'Chờ NV ký',
    PENDING_HR_CONFIRM:    'Chờ HR xác nhận',
  }
  return map[status] || status
}

const documentTypeBadgeClass = (documentType) => {
  const map = {
    OFFBOARDING:    'bg-orange-50 text-orange-700 border-orange-200',
    ASSET_HANDOVER: 'bg-teal-50 text-teal-700 border-teal-200',
    JOB_HANDOVER:   'bg-violet-50 text-violet-700 border-violet-200',
    EXIT_INTERVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
    LEAVE:          'bg-green-50 text-green-700 border-green-200',
    DEVICE:         'bg-yellow-50 text-yellow-700 border-yellow-200',
    PENALTY:        'bg-red-50 text-red-700 border-red-200',
  }
  return map[documentType] || 'bg-indigo-50 text-indigo-700 border-indigo-200'
}

const statusBadgeClass = (status) => {
  const map = {
    COMPLETED:             'bg-emerald-50 text-emerald-700 border-emerald-200',
    COMPLETED_BLOCKED:     'bg-violet-50 text-violet-700 border-violet-200',
    REJECTED:              'bg-rose-50 text-rose-700 border-rose-200',
    PENDING_MANAGER:       'bg-amber-50 text-amber-700 border-amber-200',
    PENDING_HR_PROCESS:    'bg-amber-50 text-amber-700 border-amber-200',
    PENDING_HR_APPROVAL:   'bg-amber-50 text-amber-700 border-amber-200',
    PENDING_GM:            'bg-amber-50 text-amber-700 border-amber-200',
    PENDING_HANDOVER:      'bg-sky-50 text-sky-700 border-sky-200',
    DRAFT:                 'bg-gray-50 text-gray-600 border-gray-200',
    PENDING_EMPLOYEE_SIGN: 'bg-amber-50 text-amber-700 border-amber-200',
    PENDING_HR_CONFIRM:    'bg-blue-50 text-blue-700 border-blue-200',
  }
  return map[status] || 'bg-blue-50 text-blue-700 border-blue-200'
}

const signActionLabel = (status) => {
  if (status === 'PENDING_GM') return 'Sign as GM'
  if (status === 'PENDING_MANAGER') return 'Sign as Line Manager'
  if (status === 'PENDING_HR_PROCESS') return 'Sign as HR Staff'
  if (status === 'PENDING_HR_APPROVAL') return 'Sign as HR Manager'
  if (status === 'PENDING_HANDOVER') return 'Open handover'
  if (status === 'PENDING_EMPLOYEE_SIGN') return 'Ký nhận biên bản'
  if (status === 'PENDING_HR_CONFIRM') return 'HR xác nhận'
  if (status === 'DRAFT') return 'Xem biên bản'
  return 'Open details'
}

const DOCUMENT_ROUTE_BY_TYPE = {
  OFFBOARDING:    '/offboarding/{document_id}',
  ASSET_HANDOVER: '/asset-handover/{document_id}?type=ho2',
  JOB_HANDOVER:   '/asset-handover/{document_id}?type=ho1',
  EXIT_INTERVIEW: '/asset-handover/{document_id}?type=ho3',
  LEAVE:          '/leave/{document_id}',
  DEVICE:         '/device/{document_id}',
  PENALTY:        '/penalty/{document_id}',
}

const openPopup = (process) => {
  if (process.document_type && process.document_type !== 'OFFBOARDING') {
    const rawId = process?._raw?.id || process.document_id || process.id
    const routeTemplate = DOCUMENT_ROUTE_BY_TYPE[process.document_type] || ''
    if (routeTemplate) {
      navigateTo(routeTemplate.replace('{document_id}', String(rawId)))
      return
    }
    toast.error('Chưa cấu hình route chi tiết cho loại văn bản này.')
    return
  }
  selectedProcess.value = process
}

const selectedProcessCanAct = computed(() => canActOnProcess(selectedProcess.value))

const actionMetaByStatus = {
  PENDING_MANAGER: {
    badge: 'Manager Approval',
    step: 2,
    actions: [
      { action: 'reject', label: 'Reject' },
      { action: 'approve', label: 'Approve' },
    ],
  },
  PENDING_HR_PROCESS: {
    badge: 'HR Processing',
    step: 3,
    actions: [
      { action: 'process', label: 'Complete Process' },
    ],
  },
  PENDING_HR_APPROVAL: {
    badge: 'HR Approval',
    step: 4,
    actions: [
      { action: 'reject', label: 'Reject' },
      { action: 'authorize', label: 'Authorize' },
    ],
  },
  PENDING_GM: {
    badge: 'GM Approval',
    step: 5,
    actions: [
      { action: 'reject', label: 'Reject' },
      { action: 'approve', label: 'Approve' },
    ],
  },
}

const selectedProcessMeta = computed(() => {
  const status = selectedProcess.value?.status
  return actionMetaByStatus[status] || { badge: 'View Only', step: null, actions: [] }
})

const fetchSignHubLogs = async () => {
  try {
    const res = await useFetchAuth('/v1/offboarding/sign-hub/approval-logs?page=1&page_size=200')
    signHubLogs.value = res?.data?.items || res?.items || []
  } catch (_) {
    signHubLogs.value = []
  }
}

const fetchApprovalHistory = async () => {
  historyLoading.value = true
  try {
    const qs = new URLSearchParams()
    qs.set('page', '1')
    qs.set('page_size', '30')
    if (historyFilters.document_type) qs.set('document_type', historyFilters.document_type)
    if (historyFilters.actor?.trim()) qs.set('actor', historyFilters.actor.trim())
    if (historyFilters.from_date) qs.set('from_date', historyFilters.from_date)
    if (historyFilters.to_date) qs.set('to_date', historyFilters.to_date)
    const res = await useFetchAuth(`/v1/offboarding/sign-hub/approval-logs?${qs.toString()}`)
    approvalHistory.value = res?.data?.items || res?.items || []
  } catch (_) {
    approvalHistory.value = []
  } finally {
    historyLoading.value = false
  }
}

const goToSelectedDetail = () => {
  if (!selectedProcess.value) return
  if (selectedProcess.value.document_type === 'OFFBOARDING') {
    navigateTo(`/offboarding/${selectedProcess.value.id}`)
    return
  }
  const rawId = selectedProcess.value?._raw?.document_id || selectedProcess.value.document_id || selectedProcess.value.id
  const routeDetail = (DOCUMENT_ROUTE_BY_TYPE[selectedProcess.value.document_type] || '').replace('{document_id}', String(rawId))
  if (routeDetail) navigateTo(routeDetail)
}

const handleGMAction = async (action, note) => {
  if (!selectedProcess.value) return
  if (!selectedProcessCanAct.value) {
    toast.error('Bạn không có quyền phê duyệt hồ sơ này.')
    return
  }
  const stepNumber = selectedProcessMeta.value.step
  if (!stepNumber) {
    toast.error('Không xác định bước xử lý cho hồ sơ này.')
    return
  }
  if (!signatureStatus.value?.has_signature) {
    pendingActionPayload.value = { action, note }
    showSignatureModal.value = true
    toast.error('Bạn cần thêm chữ ký SignHub trước khi phê duyệt.')
    return
  }
  const result = await offboardingStore.takeAction(
    selectedProcess.value.id,
    stepNumber,
    { action, note }
  )
  if (result?.success !== false) {
    const successMessageByAction = {
      approve: 'Đã phê duyệt hồ sơ.',
      authorize: 'Đã xác nhận phê duyệt hồ sơ.',
      process: 'Đã hoàn tất bước xử lý.',
      reject: 'Đã từ chối đơn.',
      complete: 'Đã hoàn tất hồ sơ.',
      block: 'Đã khóa thanh toán.',
      unblock: 'Đã mở khóa thanh toán.',
    }
    const msg = successMessageByAction[action] || 'Thao tác thành công.'
    toast.success(msg)
    selectedProcess.value = null
    await offboardingStore.fetchProcesses()
    await fetchSignHubLogs()
    await fetchApprovalHistory()
  } else {
    toast.error(result.message ?? 'Thao tác thất bại')
  }
}

const loadSignatureStatus = async () => {
  try {
    const res = await useFetchAuth('/v1/profile/signature')
    signatureStatus.value = res?.data || { has_signature: false }
  } catch (_) {
    signatureStatus.value = { has_signature: false }
  }
}

const initCanvas = () => {
  nextTick(() => {
    const c = signatureCanvas.value
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    // SignHub signature ink color: enterprise blue
    ctx.strokeStyle = '#193CB9'
  })
}

const pointerPos = (evt) => {
  const c = signatureCanvas.value
  const rect = c.getBoundingClientRect()
  const scaleX = c.width / rect.width
  const scaleY = c.height / rect.height
  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  }
}

const startDraw = (evt) => {
  if (signatureTab.value !== 'draw') return
  const c = signatureCanvas.value
  if (!c) return
  const ctx = c.getContext('2d')
  const p = pointerPos(evt)
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
  isDrawing.value = true
  hasSignatureStroke.value = true
}

const drawMove = (evt) => {
  if (!isDrawing.value || signatureTab.value !== 'draw') return
  const c = signatureCanvas.value
  if (!c) return
  const ctx = c.getContext('2d')
  const p = pointerPos(evt)
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
}

const endDraw = () => {
  isDrawing.value = false
}

const clearSignatureCanvas = () => {
  const c = signatureCanvas.value
  if (!c) return
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, c.width, c.height)
  hasSignatureStroke.value = false
}

const onSignatureFileChange = (evt) => {
  const file = evt.target.files?.[0]
  if (!file) {
    signatureFile.value = null
    signatureFilePreview.value = ''
    scannedSignaturePreview.value = ''
    return
  }
  const validTypes = ['image/png', 'image/jpeg']
  const validExts = ['.png', '.jpg', '.jpeg']
  const lowerName = (file.name || '').toLowerCase()
  const hasValidExt = validExts.some(ext => lowerName.endsWith(ext))
  const hasValidType = validTypes.includes(file.type)
  if (!hasValidExt || !hasValidType) {
    toast.error('Chỉ hỗ trợ 3 định dạng: PNG, JPG, JPEG.')
    signatureFile.value = null
    signatureFilePreview.value = ''
    scannedSignaturePreview.value = ''
    if (evt.target) evt.target.value = ''
    return
  }
  if (file.size > 20 * 1024 * 1024) {
    toast.error('Dung lượng ảnh không được vượt quá 20MB.')
    signatureFile.value = null
    signatureFilePreview.value = ''
    scannedSignaturePreview.value = ''
    if (evt.target) evt.target.value = ''
    return
  }
  signatureFile.value = file
  scannedSignaturePreview.value = ''
  signatureFilePreview.value = URL.createObjectURL(file)
}

const openSignatureFileDialog = () => {
  signatureFileInput.value?.click()
}

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh'))
    reader.readAsDataURL(file)
  })

const scanSignaturePreview = async () => {
  if (!signatureFile.value) {
    toast.error('Vui lòng chọn ảnh chữ ký.')
    return
  }
  scanningSignature.value = true
  try {
    const imageData = await fileToDataUrl(signatureFile.value)
    const scanRes = await useFetchAuth('/v1/profile/scan-signature', {
      method: 'POST',
      body: { image_data: imageData },
    })
    scannedSignaturePreview.value = scanRes?.data?.preview_data_url || ''
    if (!scannedSignaturePreview.value) {
      toast.error('Không thể tạo preview chữ ký.')
      return
    }
    toast.success('Đã quét ảnh chữ ký, vui lòng kiểm tra preview.')
  } catch (e) {
    toast.error(e?.data?.error || e?.data?.message || 'Quét chữ ký thất bại')
  } finally {
    scanningSignature.value = false
  }
}

const saveSignature = async () => {
  savingSignature.value = true
  try {
    if (signatureTab.value === 'draw') {
      if (!hasSignatureStroke.value) {
        toast.error('Vui lòng ký trước khi lưu.')
        return
      }
      const dataUrl = signatureCanvas.value.toDataURL('image/png')
      await useFetchAuth('/v1/profile/signature', {
        method: 'PUT',
        body: { signature_type: 'drawn', signature_data: dataUrl },
      })
    } else {
      if (!signatureFile.value) {
        toast.error('Vui lòng chọn ảnh chữ ký.')
        return
      }
      const imageData = await fileToDataUrl(signatureFile.value)
      const upload = await useFetchAuth('/v1/profile/upload-signature', {
        method: 'POST',
        body: { image_data: imageData },
      })
      scannedSignaturePreview.value = upload?.data?.preview_data_url || scannedSignaturePreview.value
      await useFetchAuth('/v1/profile/signature', {
        method: 'PUT',
        body: { signature_type: 'uploaded', signature_data: upload?.data?.url },
      })
    }

    await loadSignatureStatus()
    showSignatureModal.value = false
    activeMainTab.value = 'documents'
    toast.success('Đã lưu chữ ký SignHub.')
    if (pendingActionPayload.value && selectedProcess.value) {
      const { action, note } = pendingActionPayload.value
      pendingActionPayload.value = null
      await handleGMAction(action, note)
    }
  } catch (e) {
    toast.error(e?.data?.error || e?.data?.message || 'Không thể lưu chữ ký')
  } finally {
    savingSignature.value = false
  }
}

const deleteSignature = async () => {
  if (!signatureStatus.value?.has_signature) return
  showDeleteSignatureModal.value = true
}

const confirmDeleteSignature = async () => {
  deletingSignature.value = true
  try {
    await useFetchAuth('/v1/profile/signature', { method: 'DELETE' })
    signatureStatus.value = { has_signature: false, signature_type: null, signature_image_url: null, signature_data: null }
    signatureFile.value = null
    signatureFilePreview.value = ''
    showDeleteSignatureModal.value = false
    activeMainTab.value = 'documents'
    toast.success('Đã xoá chữ ký SignHub.')
  } catch (e) {
    toast.error(e?.data?.error || e?.data?.message || 'Không thể xoá chữ ký')
  } finally {
    deletingSignature.value = false
  }
}

const openSignatureModal = () => {
  showSignatureModal.value = true
  signatureTab.value = 'draw'
  signatureFile.value = null
  signatureFilePreview.value = signatureStatus.value?.signature_image_url || signatureStatus.value?.signature_data || ''
  scannedSignaturePreview.value = ''
  clearSignatureCanvas()
  initCanvas()
}

const initials = (name) =>
  (name ?? '?').split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
