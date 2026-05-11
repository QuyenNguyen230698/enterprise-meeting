<template>
  <div class="border-t border-gray-300 overflow-x-hidden">
    <table class="w-full border-collapse table-fixed text-xs approval-table">
      <thead class="bg-blue-800 text-white">
        <tr>
          <th class="w-24 border border-blue-600 px-2 py-2"></th>
          <th
            v-for="signer in signers"
            :key="signer.id"
            class="border border-blue-600 px-2 py-2 text-center font-semibold text-xs"
          >
            <span class="block">{{ signer.labelVn }}</span>
            <span class="block text-[10px] italic font-normal text-blue-200">{{ signer.labelEn }}</span>
            <span class="block text-[10px] font-extralight text-blue-300 mt-0.5">
              {{ deptLabel(signer.deptCodeFilter) }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="text-gray-800">
        <tr>
          <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">
            Chữ ký /<br /><span class="italic font-normal">Signature</span>
          </td>
          <td
            v-for="signer in signers"
            :key="`sig-${signer.id}`"
            class="border border-gray-300 p-5 text-center"
          >
            <div class="h-14 flex items-center justify-center">
              <span class="text-gray-300 text-xs italic">[ Chữ ký ]</span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">
            Họ và tên /<br /><span class="italic font-normal">Name</span>
          </td>
          <td
            v-for="signer in signers"
            :key="`name-${signer.id}`"
            class="border border-gray-300 px-2 py-3 text-center font-semibold text-gray-400 text-xs"
          >
            {{ signer.autoAssign ? '[Tự động]' : '—' }}
          </td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">
            Chức danh /<br /><span class="italic font-normal">Position</span>
          </td>
          <td
            v-for="signer in signers"
            :key="`pos-${signer.id}`"
            class="border border-gray-300 px-2 py-3 text-center font-medium text-gray-400 text-xs"
          >
            {{ deptLabel(signer.deptCodeFilter) || '—' }}
          </td>
        </tr>
        <tr>
          <td class="border border-gray-300 px-2 py-2 font-semibold text-gray-700">
            Ngày /<br /><span class="italic font-normal">Date</span>
          </td>
          <td
            v-for="signer in signers"
            :key="`date-${signer.id}`"
            class="border border-gray-300 px-2 py-3 text-center font-medium text-gray-400 text-xs"
          >—</td>
        </tr>
      </tbody>
    </table>

    <!-- Hint khi đang edit -->
    <div v-if="editable" class="px-3 py-1.5 bg-amber-50 border-t border-amber-100">
      <p class="text-[10px] text-amber-600 font-medium">
        <i class="bi bi-info-circle mr-1"></i>
        Ô chữ ký được tự động điền theo cấu hình người ký ở Bước 2. Chỉnh sửa số lượng/vai trò tại bước đó.
      </p>
    </div>
  </div>
</template>

<script setup>
import { deptLabel } from '~/utils/hrmConstants'

const props = defineProps({
  signers: { type: Array, default: () => [] },
  editable: { type: Boolean, default: true },
})
</script>

<style scoped>
.approval-table thead th {
  background-color: #1e40af;
  color: #fff;
  border-color: #2563eb;
}
</style>
