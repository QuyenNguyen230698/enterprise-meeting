<template>
  <div class="h-full overflow-y-auto px-4 sm:px-6 py-6">
    <div class="max-w-3xl mx-auto space-y-6">

      <!-- Title -->
      <div>
        <h2 class="text-base font-black text-gray-900">Bước 2 — Người ký & Phê duyệt</h2>
        <p class="text-xs text-gray-500 mt-0.5">
          Cấu hình tối đa 4 vị trí ký trong văn bản. Thứ tự từ trái sang phải trên tờ in.
        </p>
      </div>

      <!-- Signer cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="(signer, idx) in store.template.signers"
          :key="signer.id"
          class="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all p-4 space-y-3"
          :class="{ 'border-blue-400 shadow-md': idx === 0 }"
        >
          <!-- Card header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                :class="signerColorClass(idx)">
                {{ idx + 1 }}
              </div>
              <span class="text-sm font-bold text-gray-700">Vị trí {{ idx + 1 }}</span>
              <span v-if="signer.required" class="text-[10px] text-red-500 font-bold">Bắt buộc</span>
            </div>
            <button
              v-if="store.canRemoveSigner && idx > 0"
              @click="store.removeSigner(signer.id)"
              class="text-gray-400 hover:text-red-500 transition-colors p-1"
            ><i class="bi bi-x-circle text-sm"></i></button>
          </div>

          <!-- Nhãn tiếng Việt -->
          <div>
            <label class="text-xs text-gray-500 font-medium">Nhãn (Tiếng Việt)</label>
            <input
              :value="signer.labelVn"
              @input="store.updateSigner(signer.id, { labelVn: $event.target.value })"
              class="w-full mt-0.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
              placeholder="VD: Người lập, Xác nhận bởi..."
            />
          </div>

          <!-- Nhãn tiếng Anh -->
          <div>
            <label class="text-xs text-gray-500 font-medium">Nhãn (English)</label>
            <input
              :value="signer.labelEn"
              @input="store.updateSigner(signer.id, { labelEn: $event.target.value })"
              class="w-full mt-0.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
              placeholder="VD: Prepared by, Verified by..."
            />
          </div>

          <!-- Phòng ban / Role -->
          <div>
            <label class="text-xs text-gray-500 font-medium">Vai trò / Phòng ban</label>
            <select
              :value="signer.deptCodeFilter"
              @change="store.updateSigner(signer.id, { deptCodeFilter: $event.target.value || null, autoAssign: !$event.target.value })"
              class="w-full mt-0.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white"
            >
              <option value="">Tự động (người tạo)</option>
              <option value="EMPLOYEE">Nhân viên (Employee)</option>
              <option value="MANAGER">Trưởng phòng (Manager)</option>
              <option value="DIRECTOR">Giám đốc bộ phận (Director)</option>
              <option value="HR_STAFF">Nhân sự xử lý (HR Staff)</option>
              <option value="HR_MANAGER">Nhân sự duyệt (HR Manager)</option>
              <option value="HR_DIRECTOR">Giám đốc NS (HR Director)</option>
              <option value="GM">Ban Giám đốc (GM)</option>
              <option value="GM_DIRECTOR">Tổng Giám đốc (CEO)</option>
            </select>
          </div>

          <!-- Chức vụ cụ thể (optional filter) -->
          <div>
            <label class="text-xs text-gray-500 font-medium">Lọc theo chức vụ (tuỳ chọn)</label>
            <input
              :value="signer.titleFilter"
              @input="store.updateSigner(signer.id, { titleFilter: $event.target.value || null })"
              class="w-full mt-0.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
              placeholder="VD: Kế toán trưởng, Trưởng phòng HR..."
            />
          </div>

          <!-- Options -->
          <div class="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="signer.required"
                @change="store.updateSigner(signer.id, { required: $event.target.checked })"
                class="w-4 h-4 accent-blue-600"
              />
              <span class="text-xs text-gray-700">Bắt buộc có chữ ký</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="signer.autoAssign"
                @change="store.updateSigner(signer.id, { autoAssign: $event.target.checked })"
                class="w-4 h-4 accent-blue-600"
              />
              <span class="text-xs text-gray-700">Tự động gán người tạo văn bản</span>
            </label>
          </div>

          <!-- Preview label -->
          <div class="bg-blue-50 rounded-xl px-3 py-2 text-xs">
            <p class="text-blue-500 font-medium">Preview cột chữ ký:</p>
            <p class="text-blue-800 font-bold mt-0.5">{{ signer.labelVn || '—' }}</p>
            <p class="text-blue-600 italic">{{ signer.labelEn || '—' }}</p>
            <p class="text-blue-500 text-[10px] mt-0.5">{{ deptLabel(signer.deptCodeFilter) }}</p>
          </div>
        </div>

        <!-- Add signer -->
        <button
          v-if="store.canAddSigner"
          @click="store.addSigner()"
          class="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all p-4 flex flex-col items-center justify-center gap-2 min-h-[200px]"
        >
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <i class="bi bi-plus text-xl text-gray-400"></i>
          </div>
          <span class="text-sm font-semibold text-gray-400">Thêm vị trí ký</span>
          <span class="text-xs text-gray-400">Còn {{ 4 - store.template.signers.length }} vị trí</span>
        </button>
      </div>

      <!-- Preview signature matrix -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <i class="bi bi-eye text-gray-500 text-sm"></i>
          <p class="text-xs font-bold text-gray-600 uppercase tracking-wide">Preview bảng chữ ký</p>
        </div>
        <div class="overflow-x-auto p-2">
          <HrmDocumentBuilderCmsBlocksBlockSignature
            :signers="store.template.signers"
            :editable="false"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useDocumentBuilderStore } from '~/stores/hrm/documentBuilder'
import { deptLabel } from '~/utils/hrmConstants'

const store = useDocumentBuilderStore()

const SIGNER_COLORS = ['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-amber-500']
const signerColorClass = (idx) => SIGNER_COLORS[idx] || 'bg-gray-500'
</script>
