<template>
  <div class="h-full flex flex-col overflow-hidden bg-gray-50">
    <ToastContainer />

    <!-- Header bar -->
    <div class="shrink-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3 z-20">
      <NuxtLink to="/hrm/documents" class="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
        <i class="bi bi-arrow-left"></i>
      </NuxtLink>
      <div class="flex-1 min-w-0">
        <h1 class="text-base font-black text-gray-900 truncate">
          {{ selectedTemplate ? selectedTemplate.name : 'Tạo biên bản mới' }}
        </h1>
        <p v-if="selectedTemplate" class="text-xs text-gray-400 font-mono">{{ selectedTemplate.code }}</p>
      </div>

      <!-- Step indicator -->
      <div class="hidden sm:flex items-center gap-2">
        <span
          v-for="(label, i) in ['Chọn mẫu', 'Điền nội dung', 'Giao người xử lý', 'Xác nhận']"
          :key="i"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
          :class="step === i + 1
            ? 'bg-blue-600 text-white'
            : step > i + 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'"
        >
          <i v-if="step > i + 1" class="bi bi-check text-[10px]"></i>
          <span v-else>{{ i + 1 }}</span>
          {{ label }}
        </span>
      </div>
    </div>

    <!-- ── BƯỚC 1: Chọn mẫu ───────────────────────────────────────────────────── -->
    <div v-if="step === 1" class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-4xl mx-auto">
        <div class="mb-6">
          <h2 class="text-lg font-bold text-gray-900">Chọn mẫu biên bản</h2>
          <p class="text-sm text-gray-500 mt-1">Chọn một mẫu đã được xuất bản để tạo biên bản</p>
        </div>

        <!-- Search -->
        <div class="relative mb-4">
          <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            v-model="templateSearch"
            type="text"
            placeholder="Tìm mẫu văn bản..."
            class="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
          />
        </div>

        <!-- Loading templates -->
        <div v-if="templatesLoading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>

        <!-- No published templates -->
        <div v-else-if="filteredTemplates.length === 0" class="text-center py-16 text-gray-400">
          <i class="bi bi-file-earmark-text text-4xl mb-3 block"></i>
          <p class="text-sm">Chưa có mẫu nào được xuất bản</p>
          <NuxtLink to="/hrm/document-builder" class="mt-2 text-xs text-blue-600 underline">
            Quản lý mẫu văn bản
          </NuxtLink>
        </div>

        <!-- Template grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="tpl in filteredTemplates"
            :key="tpl.id"
            @click="selectTemplate(tpl)"
            class="text-left bg-white rounded-2xl border-2 p-4 hover:shadow-md transition-all group"
            :class="selectedTemplate?.id === tpl.id
              ? 'border-blue-500 shadow-md shadow-blue-100'
              : 'border-gray-200 hover:border-blue-300'"
          >
            <div class="flex items-start justify-between mb-3">
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="docTypeClass(tpl.docType)"
              >
                <i :class="docTypeIcon(tpl.docType)"></i>
                {{ docTypeLabel(tpl.docType) }}
              </span>
              <i
                v-if="selectedTemplate?.id === tpl.id"
                class="bi bi-check-circle-fill text-blue-500 text-lg"
              ></i>
            </div>
            <h3 class="text-sm font-bold text-gray-900 leading-tight mb-1">{{ tpl.name }}</h3>
            <p class="text-[10px] font-mono text-gray-400">{{ tpl.code }}</p>
            <div class="mt-3 flex items-center gap-3 text-[11px] text-gray-400">
              <span><i class="bi bi-pen mr-1"></i>{{ tpl.signers?.length || 0 }} người ký</span>
              <span><i class="bi bi-diagram-3 mr-1"></i>{{ tpl.workflowSteps?.length || 0 }} bước</span>
            </div>
          </button>
        </div>

        <div v-if="selectedTemplate" class="mt-6 flex justify-end">
          <button
            @click="step = 2"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors"
          >
            Tiếp theo
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ── BƯỚC 2: Điền nội dung ──────────────────────────────────────────────── -->
    <div v-if="step === 2" class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-gray-900">Điền nội dung biên bản</h2>
            <p class="text-xs text-gray-500 mt-0.5">Các phần có màu nền xanh là vùng bạn cần điền</p>
          </div>
          <button @click="step = 1" class="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1">
            <i class="bi bi-arrow-left text-[10px]"></i> Chọn lại mẫu
          </button>
        </div>

        <!-- Document title input -->
        <div class="mb-4 bg-white rounded-2xl border border-gray-200 p-4">
          <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tên biên bản <span class="text-red-500">*</span></label>
          <input
            v-model="docName"
            type="text"
            :placeholder="selectedTemplate.name"
            class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <!-- Blocks render + edit -->
        <div class="space-y-4">
          <div v-for="block in sortedBlocks" :key="block.id">

            <!-- Header: readonly -->
            <div v-if="block.type === 'header'" class="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <p class="text-base font-black uppercase text-gray-900">{{ selectedTemplate.titleVn }}</p>
              <p class="text-xs italic text-gray-400 mt-0.5">{{ selectedTemplate.titleEn }}</p>
              <p class="text-xs text-gray-500 font-mono mt-1">{{ selectedTemplate.code }}</p>
            </div>

            <!-- Party: điền tên bên tham gia -->
            <div v-else-if="block.type === 'party'" class="bg-blue-50 rounded-2xl border-2 border-blue-200 p-4">
              <p class="text-xs font-bold text-blue-700 mb-3 flex items-center gap-1.5">
                <i class="bi bi-people-fill"></i> Thành phần tham gia
              </p>
              <div class="space-y-2">
                <div>
                  <label class="text-xs text-gray-600 font-semibold">Đại diện / Bên A</label>
                  <p class="text-sm text-gray-700 mt-0.5 bg-white rounded-lg px-3 py-1.5 border border-blue-100">
                    {{ currentUser?.full_name || '(tên của bạn)' }} — {{ currentUser?.title || '' }}
                  </p>
                </div>
                <div v-if="block.content?.showPartyB">
                  <label class="text-xs text-gray-600 font-semibold">{{ block.content.partyBLabel || 'Bên B' }}</label>
                  <input
                    v-model="partyBName"
                    type="text"
                    placeholder="Nhập tên bên B..."
                    class="mt-0.5 w-full text-sm bg-white border border-blue-200 rounded-xl px-3 py-1.5 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Legal: readonly -->
            <div v-else-if="block.type === 'legal'" class="bg-white rounded-2xl border border-gray-200 p-4">
              <p class="text-[11px] text-gray-500 italic whitespace-pre-line leading-relaxed">{{ block.content?.text }}</p>
            </div>

            <!-- Richtext: editable -->
            <div
              v-else-if="block.type === 'richtext'"
              class="bg-blue-50 rounded-2xl border-2 border-blue-200 overflow-hidden"
            >
              <div class="px-4 pt-3 pb-1">
                <p class="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <i class="bi bi-pencil-square"></i> Nội dung văn bản
                </p>
              </div>
              <div
                contenteditable="true"
                class="px-4 pb-4 text-sm text-gray-800 focus:outline-none min-h-[120px] prose prose-sm max-w-none"
                :ref="el => { if (el) richtextRefs[block.id] = el }"
                @blur="onRichtextBlur(block.id)"
                v-html="editableBlocks[block.id] ?? block.content?.html"
              ></div>
            </div>

            <!-- Table: editable cells -->
            <div v-else-if="block.type === 'table'" class="bg-blue-50 rounded-2xl border-2 border-blue-200 overflow-hidden">
              <div class="px-4 pt-3 pb-2">
                <p class="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <i class="bi bi-table"></i> Bảng dữ liệu
                </p>
              </div>
              <div class="overflow-x-auto px-4 pb-4">
                <table class="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th
                        v-for="h in block.content?.headers"
                        :key="h.key"
                        class="border border-blue-200 bg-blue-100 px-2 py-1.5 font-bold text-blue-800 text-left"
                        :style="{ minWidth: h.width === 'auto' ? '100px' : h.width }"
                      >{{ h.label }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in editableTableRows[block.id] || block.content?.rows" :key="row.id">
                      <td
                        v-for="h in block.content?.headers"
                        :key="h.key"
                        class="border border-blue-100 bg-white px-1"
                      >
                        <input
                          v-if="h.key !== 'stt'"
                          :value="row[h.key]"
                          @input="onTableCellInput(block.id, row.id, h.key, $event.target.value)"
                          class="w-full px-1.5 py-1 text-xs focus:outline-none focus:bg-blue-50 rounded"
                          :placeholder="h.label"
                        />
                        <span v-else class="px-2 py-1 text-center text-gray-500 block">{{ row.stt }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Checklist: checkable -->
            <div v-else-if="block.type === 'checklist'" class="bg-blue-50 rounded-2xl border-2 border-blue-200 p-4">
              <p class="text-xs font-bold text-blue-700 mb-3 flex items-center gap-1.5">
                <i class="bi bi-check2-square"></i> Danh sách kiểm tra
              </p>
              <div class="space-y-2">
                <label
                  v-for="item in editableChecklists[block.id] || block.content?.items"
                  :key="item.id"
                  class="flex items-start gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :checked="item.checked"
                    @change="onChecklistToggle(block.id, item.id, $event.target.checked)"
                    class="mt-0.5 w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900">{{ item.text }}</span>
                </label>
              </div>
            </div>

            <!-- Divider: visual only -->
            <div v-else-if="block.type === 'divider'" class="flex items-center gap-3 px-2">
              <div class="flex-1 border-t border-gray-300"></div>
              <span v-if="block.content?.label" class="text-xs text-gray-400">{{ block.content.label }}</span>
              <div class="flex-1 border-t border-gray-300"></div>
            </div>

            <!-- Signature: preview chỉ hiển thị tên các bên ký -->
            <div v-else-if="block.type === 'signature'" class="bg-white rounded-2xl border border-gray-200 p-4">
              <p class="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Chữ ký phê duyệt</p>
              <div class="grid gap-4" :class="`grid-cols-${Math.min(selectedTemplate.signers?.length || 2, 4)}`">
                <div
                  v-for="signer in selectedTemplate.signers"
                  :key="signer.id"
                  class="text-center"
                >
                  <p class="text-xs font-semibold text-gray-700">{{ signer.labelVn }}</p>
                  <p class="text-[10px] italic text-gray-400">{{ signer.labelEn }}</p>
                  <div class="mt-2 h-14 border-b-2 border-dashed border-gray-200 flex items-center justify-center">
                    <span class="text-[10px] text-gray-300">(Chờ ký số)</span>
                  </div>
                  <p class="text-[11px] text-gray-400 mt-1.5">{{ deptLabel(signer.deptCodeFilter) }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Navigation -->
        <div class="mt-6 flex items-center justify-between">
          <button
            @click="step = 1"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <i class="bi bi-arrow-left"></i> Quay lại
          </button>
          <button
            @click="step = 3"
            :disabled="!docName.trim()"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Giao người xử lý <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ── BƯỚC 3: Giao người xử lý ─────────────────────────────────────────────── -->
    <div v-if="step === 3" class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-2xl mx-auto">
        <div class="mb-5">
          <h2 class="text-base font-bold text-gray-900">Giao người xử lý từng bước</h2>
          <p class="text-xs text-gray-500 mt-1">Chỉ định người cụ thể sẽ nhận và xử lý biên bản ở mỗi bước</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="ws in workflowStepsWithAssignees"
            :key="ws.id || ws.stepNumber"
            class="bg-white rounded-2xl border border-gray-200 p-4"
          >
            <div class="flex items-center gap-3 mb-3">
              <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                {{ ws.stepNumber }}
              </span>
              <div class="flex-1">
                <p class="text-sm font-bold text-gray-900">{{ ws.name }}</p>
                <p class="text-[11px] text-gray-400">{{ deptLabel(ws.deptCode) }}<span v-if="ws.signatureRequired" class="ml-2 text-blue-500"><i class="bi bi-pen"></i> Cần ký số</span></p>
              </div>
            </div>

            <!-- Assigned users list -->
            <div v-if="stepAssignees[ws.stepNumber]?.length" class="flex flex-wrap gap-2 mb-3">
              <div
                v-for="user in stepAssignees[ws.stepNumber]"
                :key="user.userId"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full"
              >
                <i class="bi bi-person-fill text-[10px]"></i>
                {{ user.name }}
                <button @click="removeAssignee(ws.stepNumber, user.userId)" class="ml-0.5 text-blue-400 hover:text-red-500 transition-colors">
                  <i class="bi bi-x text-[10px]"></i>
                </button>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 italic mb-3">(Chưa có người được giao)</p>

            <!-- User search -->
            <div class="relative">
              <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                v-model="stepSearchQuery[ws.stepNumber]"
                type="text"
                placeholder="Tìm và thêm người..."
                class="w-full pl-8 pr-4 py-1.5 text-xs border border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
                @input="searchUsers(ws.stepNumber)"
              />
              <!-- Search results -->
              <div
                v-if="stepSearchResults[ws.stepNumber]?.length"
                class="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-10 overflow-hidden"
              >
                <button
                  v-for="user in stepSearchResults[ws.stepNumber]"
                  :key="user.id"
                  @click="addAssignee(ws.stepNumber, user)"
                  class="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-colors text-xs"
                >
                  <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span class="text-[10px] font-bold text-blue-600">{{ (user.name || user.full_name || '?')[0] }}</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ user.name || user.full_name }}</p>
                    <p class="text-gray-400">{{ user.title || user.department }}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <button
            @click="step = 2"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <i class="bi bi-arrow-left"></i> Quay lại
          </button>
          <button
            @click="step = 4"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors"
          >
            Xem lại & Xác nhận <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ── BƯỚC 4: Xác nhận & Tạo ─────────────────────────────────────────────── -->
    <div v-if="step === 4" class="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div class="max-w-xl mx-auto">
        <div class="mb-5">
          <h2 class="text-base font-bold text-gray-900">Xác nhận tạo biên bản</h2>
          <p class="text-xs text-gray-500 mt-1">Kiểm tra lại thông tin trước khi tạo và nộp biên bản</p>
        </div>

        <!-- Summary card -->
        <div class="bg-white rounded-2xl border border-gray-200 p-5 mb-4 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <i class="bi bi-file-earmark-check text-blue-600"></i>
            </div>
            <div>
              <p class="font-bold text-gray-900 text-sm">{{ docName }}</p>
              <p class="text-xs font-mono text-gray-400">{{ selectedTemplate.code }}</p>
            </div>
          </div>
          <div class="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Loại văn bản</span>
              <span class="font-semibold">{{ docTypeLabel(selectedTemplate.docType) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Người tạo</span>
              <span class="font-semibold">{{ currentUser?.full_name || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Số bước phê duyệt</span>
              <span class="font-semibold">{{ selectedTemplate.workflowSteps?.length || 0 }} bước</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Số người ký</span>
              <span class="font-semibold">{{ selectedTemplate.signers?.length || 0 }} người</span>
            </div>
          </div>
        </div>

        <!-- Workflow preview -->
        <div class="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
          <p class="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wider">Luồng phê duyệt</p>
          <div class="space-y-2">
            <div
              v-for="ws in selectedTemplate.workflowSteps"
              :key="ws.id"
              class="flex items-center gap-3 text-sm"
            >
              <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                {{ ws.stepNumber }}
              </span>
              <span class="text-gray-700 font-medium">{{ ws.name }}</span>
              <span class="text-[11px] text-gray-400 ml-auto">{{ deptLabel(ws.deptCode) }}</span>
              <i v-if="ws.signatureRequired" class="bi bi-pen text-blue-400 text-[11px]" title="Yêu cầu ký số"></i>
            </div>
            <!-- Hiển thị người được giao -->
            <div v-if="stepAssignees[ws.stepNumber]?.length" class="ml-9 flex flex-wrap gap-1.5 mt-1">
              <span
                v-for="u in stepAssignees[ws.stepNumber]"
                :key="u.userId"
                class="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium"
              >
                <i class="bi bi-person-fill"></i> {{ u.name }}
              </span>
            </div>
            <p v-else class="ml-9 text-[10px] text-amber-500 mt-0.5">
              <i class="bi bi-exclamation-triangle"></i> Chưa giao người
            </p>
          </div>
        </div>

        <!-- Note -->
        <div class="mb-5">
          <label class="block text-xs font-semibold text-gray-600 mb-1.5">Ghi chú khi tạo (không bắt buộc)</label>
          <textarea
            v-model="submitNote"
            rows="3"
            placeholder="Nhập ghi chú..."
            class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:border-blue-400 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="flex gap-2">
          <button
            @click="step = 3"
            class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <i class="bi bi-arrow-left mr-1"></i> Quay lại
          </button>
          <button
            @click="handleCreate"
            :disabled="store.submitting"
            class="flex-1 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            <i class="bi bi-send mr-1"></i>
            {{ store.submitting ? 'Đang xử lý...' : (step1RequiresSignature ? 'Tạo & Ký tên' : 'Tạo & Nộp biên bản') }}
          </button>
        </div>
      </div>
    </div>

    <!-- OTP Modal để ký số -->
    <div
      v-if="showOtpModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showOtpModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="bi bi-shield-lock-fill text-blue-600"></i>
          </div>
          <div>
            <p class="font-bold text-gray-900 text-sm">Xác thực chữ ký số</p>
            <p class="text-xs text-gray-500">Nhập mã OTP gửi đến email của bạn</p>
          </div>
        </div>

        <div class="flex gap-2 justify-center mb-4">
          <input
            v-for="(_, i) in otpDigits"
            :key="i"
            :ref="el => { if (el) otpRefs[i] = el }"
            v-model="otpDigits[i]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-10 h-12 text-center text-lg font-bold border-2 rounded-xl focus:border-blue-500 focus:outline-none transition-colors border-gray-200"
            @input="onOtpInput(i)"
            @keydown.backspace="onOtpBackspace(i)"
          />
        </div>

        <div class="flex gap-2">
          <button
            @click="showOtpModal = false"
            class="flex-1 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            @click="verifyOtpAndCreate"
            :disabled="otpDigits.join('').length < 6 || otpVerifying"
            class="flex-1 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {{ otpVerifying ? 'Đang xác nhận...' : 'Xác nhận & Tạo' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDocumentStore } from '~/stores/hrm/document'
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'

const router = useRouter()
const store   = useDocumentStore()
const builderStore = useDocumentBuilderStore()
const auth    = useAuthStore()

// ── State ──────────────────────────────────────────────────────────────────────
const step             = ref(1)
const templateSearch   = ref('')
const selectedTemplate = ref(null)
const templatesLoading = ref(false)
const docName          = ref('')
const partyBName       = ref('')
const submitNote       = ref('')

// Editable blocks state
const editableBlocks     = ref({}) // blockId → html string
const editableTableRows  = ref({}) // blockId → rows array
const editableChecklists = ref({}) // blockId → items array
const richtextRefs       = ref({})

// Step 3: assignee state
const stepAssignees      = ref({})   // stepNumber → [{userId, name, title}]
const stepSearchQuery    = ref({})   // stepNumber → search string
const stepSearchResults  = ref({})   // stepNumber → [{id, name, full_name, title, ...}]
let searchTimeouts       = {}

const workflowStepsWithAssignees = computed(() =>
  (selectedTemplate.value?.workflowSteps || []).slice().sort((a, b) => a.stepNumber - b.stepNumber)
)

const step1RequiresSignature = computed(() => {
  const step1 = workflowStepsWithAssignees.value.find(s => s.stepNumber === 1)
  return step1?.signatureRequired || false
})

const currentUser = computed(() => auth.user)

const route = useRoute()

// ── Load published templates ───────────────────────────────────────────────────
onMounted(async () => {
  templatesLoading.value = true
  await builderStore.fetchTemplates()
  templatesLoading.value = false
  // Pre-select template nếu đến từ query ?templateId=xxx
  const preId = route.query.templateId
  if (preId) {
    const found = builderStore.templates.find(t => t.id === preId)
    if (found) { selectTemplate(found); step.value = 2 }
  }
})

const publishedTemplates = computed(() =>
  builderStore.templates.filter(t => t.status === 'PUBLISHED')
)

const filteredTemplates = computed(() => {
  if (!templateSearch.value.trim()) return publishedTemplates.value
  const q = templateSearch.value.toLowerCase()
  return publishedTemplates.value.filter(t =>
    t.name?.toLowerCase().includes(q) || t.code?.toLowerCase().includes(q)
  )
})

// ── Select template ────────────────────────────────────────────────────────────
function selectTemplate(tpl) {
  selectedTemplate.value = tpl
  docName.value = tpl.name
  // Init editable state from template blocks
  editableBlocks.value = {}
  editableTableRows.value = {}
  editableChecklists.value = {}
  stepAssignees.value = {}
  stepSearchQuery.value = {}
  stepSearchResults.value = {}
  for (const block of tpl.contentBlocks || []) {
    if (block.type === 'richtext') editableBlocks.value[block.id] = block.content?.html || ''
    if (block.type === 'table')    editableTableRows.value[block.id] = JSON.parse(JSON.stringify(block.content?.rows || []))
    if (block.type === 'checklist') editableChecklists.value[block.id] = JSON.parse(JSON.stringify(block.content?.items || []))
  }
}

const sortedBlocks = computed(() => {
  if (!selectedTemplate.value) return []
  return [...(selectedTemplate.value.contentBlocks || [])].sort((a, b) => a.order - b.order)
})

// ── Edit handlers ──────────────────────────────────────────────────────────────
function onRichtextBlur(blockId) {
  const el = richtextRefs.value[blockId]
  if (el) editableBlocks.value[blockId] = el.innerHTML
}

function onTableCellInput(blockId, rowId, colKey, value) {
  const rows = editableTableRows.value[blockId]
  if (!rows) return
  const row = rows.find(r => r.id === rowId)
  if (row) row[colKey] = value
}

function onChecklistToggle(blockId, itemId, checked) {
  const items = editableChecklists.value[blockId]
  if (!items) return
  const item = items.find(i => i.id === itemId)
  if (item) item.checked = checked
}

// ── Step 3: Assignee management ──────────────────────────────────────────────────

function searchUsers(stepNumber) {
  clearTimeout(searchTimeouts[stepNumber])
  const q = (stepSearchQuery.value[stepNumber] || '').trim()
  if (!q) { stepSearchResults.value[stepNumber] = []; return }
  searchTimeouts[stepNumber] = setTimeout(async () => {
    try {
      const res = await useFetchAuth(`/v1/users?search=${encodeURIComponent(q)}&page=1&page_size=10`)
      const users = res?.data?.users || res?.users || res?.data || []
      // Lọc bỏ những người đã được giao
      const alreadyAssigned = (stepAssignees.value[stepNumber] || []).map(u => u.userId)
      stepSearchResults.value[stepNumber] = (Array.isArray(users) ? users : []).filter(
        u => !alreadyAssigned.includes(String(u.portal_user_id || u.id))
      )
    } catch {
      stepSearchResults.value[stepNumber] = []
    }
  }, 300)
}

function addAssignee(stepNumber, user) {
  if (!stepAssignees.value[stepNumber]) stepAssignees.value[stepNumber] = []
  const userId = String(user.portal_user_id || user.id)
  if (stepAssignees.value[stepNumber].find(u => u.userId === userId)) return
  stepAssignees.value[stepNumber].push({
    userId,
    name: user.name || user.full_name || '',
    title: user.title || '',
    email: user.email || '',
  })
  stepSearchQuery.value[stepNumber] = ''
  stepSearchResults.value[stepNumber] = []
}

function removeAssignee(stepNumber, userId) {
  if (!stepAssignees.value[stepNumber]) return
  stepAssignees.value[stepNumber] = stepAssignees.value[stepNumber].filter(u => u.userId !== userId)
}

// ── Step 4: OTP & Signature Logic ────────────────────────────────────────────────

const showOtpModal = ref(false)
const otpDigits = ref(['', '', '', '', '', ''])
const otpRefs = ref([])
const otpVerifying = ref(false)
const otpToken = ref('')

async function startSignature() {
  otpDigits.value = ['', '', '', '', '', '']
  otpVerifying.value = false
  try {
    const res = await useFetchAuth('/v1/profile/signature/send-otp', { method: 'POST' })
    if (res?.success) {
      showOtpModal.value = true
      nextTick(() => otpRefs.value[0]?.focus())
    } else {
      $toast.error(res?.message || 'Không thể gửi mã OTP')
    }
  } catch (e) {
    $toast.error('Lỗi khi gửi mã OTP')
  }
}

function onOtpInput(i) {
  if (otpDigits.value[i] && i < 5) otpRefs.value[i + 1]?.focus()
}
function onOtpBackspace(i) {
  if (!otpDigits.value[i] && i > 0) otpRefs.value[i - 1]?.focus()
}

async function verifyOtpAndCreate() {
  otpVerifying.value = true
  try {
    const code = otpDigits.value.join('')
    const res = await useFetchAuth('/v1/profile/signature/verify-otp', {
      method: 'POST',
      body: { code },
    })
    if (res?.success && res.data?.verify_token) {
      otpToken.value = res.data.verify_token
      showOtpModal.value = false
      await executeFullCreationFlow(otpToken.value)
    } else {
      $toast.error('Mã OTP không chính xác')
    }
  } catch (e) {
    $toast.error('Xác thực thất bại')
  } finally {
    otpVerifying.value = false
  }
}

// ── Build final content blocks ─────────────────────────────────────────────────
function buildFinalBlocks() {
  return sortedBlocks.value.map(block => {
    const b = JSON.parse(JSON.stringify(block))
    if (b.type === 'richtext' && editableBlocks.value[b.id] !== undefined) {
      b.content.html = editableBlocks.value[b.id]
    }
    if (b.type === 'table' && editableTableRows.value[b.id]) {
      b.content.rows = editableTableRows.value[b.id]
    }
    if (b.type === 'checklist' && editableChecklists.value[b.id]) {
      b.content.items = editableChecklists.value[b.id]
    }
    if (b.type === 'party' && partyBName.value) {
      b.content.partyBName = partyBName.value
    }
    return b
  })
}

// ── Create document ────────────────────────────────────────────────────────────

async function handleCreate() {
  if (!selectedTemplate.value || !docName.value.trim()) return

  // Nếu bước 1 cần ký tên -> bắt đầu luồng OTP
  if (step1RequiresSignature.value) {
    await startSignature()
  } else {
    await executeFullCreationFlow()
  }
}

async function executeFullCreationFlow(verifyToken = null) {
  try {
    // 1. Tạo bản ghi với assignedUsers
    const workflowStepsWithUsers = (selectedTemplate.value.workflowSteps || []).map(ws => ({
      ...ws,
      assignedUsers: stepAssignees.value[ws.stepNumber] || [],
    }))

    const payload = {
      templateId:    selectedTemplate.value.id,
      name:          docName.value.trim(),
      code:          selectedTemplate.value.code,
      docType:       selectedTemplate.value.docType,
      titleVn:       selectedTemplate.value.titleVn,
      titleEn:       selectedTemplate.value.titleEn,
      contentBlocks: buildFinalBlocks(),
      signers:       selectedTemplate.value.signers,
      workflowSteps: workflowStepsWithUsers,
      note:          submitNote.value.trim() || undefined,
    }

    const result = await store.createDocument(payload)
    const newId = result?.data?.id || result?.id

    if (newId) {
      // 2. Nếu có verifyToken -> Thực hiện ký Step 1 ngay lập tức
      if (verifyToken) {
        try {
          await store.takeAction(newId, 1, {
            action: 'approve',
            note: 'Đã ký khi tạo biên bản',
            verifyToken: verifyToken
          })
        } catch (signErr) {
          console.error('Initial signature failed:', signErr)
        }
      }

      // 3. Nộp (Submit) biên bản sang bước 2
      try {
        await store.submitDocument(newId, submitNote.value.trim() || 'Biên bản được nộp tự động khi tạo')
        // 4. Gửi thông báo cho người ở bước kế tiếp
        await store.notifySigners(newId)
      } catch (submitErr) {
        console.error('Auto-submit failed:', submitErr)
      }

      $toast.success('Đã tạo và gửi biên bản thành công')
      navigateTo(`/hrm/documents/${newId}`)
    }
  } catch (e) {
    $toast.error(e?.message || 'Lỗi khi tạo biên bản')
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const DOC_TYPE_MAP = {
  MEETING_MINUTES:   { label: 'Biên bản họp',  icon: 'bi bi-people',             cls: 'bg-blue-50 text-blue-700'   },
  HANDOVER:          { label: 'Bàn giao',       icon: 'bi bi-arrow-left-right',   cls: 'bg-purple-50 text-purple-700' },
  INTERNAL_DECISION: { label: 'Quyết định',     icon: 'bi bi-award',              cls: 'bg-red-50 text-red-700'     },
  NDA:               { label: 'NDA',            icon: 'bi bi-shield-lock',        cls: 'bg-amber-50 text-amber-700' },
  DISCIPLINE:        { label: 'Kỷ luật',        icon: 'bi bi-exclamation-triangle', cls: 'bg-rose-50 text-rose-700' },
  CUSTOM:            { label: 'Tùy chỉnh',      icon: 'bi bi-file-earmark-text',  cls: 'bg-gray-100 text-gray-600'  },
}
const docTypeLabel = t => DOC_TYPE_MAP[t]?.label || t
const docTypeIcon  = t => DOC_TYPE_MAP[t]?.icon  || 'bi bi-file-text'
const docTypeClass = t => DOC_TYPE_MAP[t]?.cls   || 'bg-gray-100 text-gray-500'

const DEPT_LABEL = {
  EMPLOYEE: 'Nhân viên', MANAGER: 'Trưởng phòng',
  HR_STAFF: 'Nhân sự', HR_MANAGER: 'Trưởng/Phó Nhân sự', GM: 'Ban Giám đốc',
}
const deptLabel = (code) => DEPT_LABEL[code] || code || '—'
</script>
