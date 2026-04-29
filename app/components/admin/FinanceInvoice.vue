<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <!-- Company/Legal Info Section -->
    <div class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="font-bold text-gray-900">Thông Tin Doanh Nghiệp</h3>
        <p class="text-sm text-gray-500 mt-0.5">Thông tin pháp lý dùng để xuất hóa đơn</p>
      </div>
      <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div class="col-span-2">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tên Công Ty <span class="text-red-500">*</span></label>
          <input v-model="modelValue.companyName" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all placeholder:text-gray-300 font-bold text-gray-900" placeholder="NHẬP TÊN CÔNG TY">
        </div>
        
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Mã Số Thuế <span class="text-red-500">*</span></label>
          <input v-model="modelValue.taxCode" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all placeholder:text-gray-300 font-mono tracking-wide" placeholder="0101234567">
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Người Đại Diện</label>
          <input v-model="modelValue.signingPerson" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all placeholder:text-gray-300 font-medium" placeholder="Nguyễn Văn A">
        </div>
        
        <div class="col-span-2">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Địa Chỉ Đăng Ký</label>
          <input v-model="modelValue.address" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all placeholder:text-gray-300" placeholder="Số nhà, Đường, Quận/Huyện, Tỉnh/Thành phố">
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Số Điện Thoại</label>
          <input v-model="modelValue.phone" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all placeholder:text-gray-300" placeholder="1900 1234">
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Liên Hệ</label>
          <input v-model="modelValue.email" type="text" class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all placeholder:text-gray-300" placeholder="contact@company.com">
        </div>
      </div>
    </div>

    <!-- Invoice Config Section -->
    <div class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="font-bold text-gray-900">Cấu Hình Hóa Đơn</h3>
        <p class="text-sm text-gray-500 mt-0.5">Ký hiệu, mẫu số và thuế suất mặc định</p>
      </div>
      <div class="p-6 md:p-8 space-y-8">
        <div class="flex items-start gap-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-900 text-sm">
          <i class="bi bi-info-circle-fill text-blue-500 shrink-0 text-lg"></i>
          <p class="leading-relaxed">Thay đổi tại đây sẽ áp dụng cho tất cả hóa đơn <strong>mới được tạo</strong>. Các hóa đơn cũ không bị ảnh hưởng.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Mức Thuế GTGT (VAT %)</label>
          <div class="relative max-w-xs">
            <input v-model="modelValue.vatRate" type="number" min="0" max="100" class="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all font-mono text-xl font-bold text-gray-900">
            <span class="absolute right-4 top-3.5 text-gray-400 font-bold text-xs bg-gray-100 px-2 py-0.5 rounded">PERCENT</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-3">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Mẫu Số Hóa Đơn</label>
            <div class="relative">
              <input v-model="modelValue.templateCode" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all placeholder:text-gray-300 font-mono font-medium" placeholder="1/001">
              <i class="bi bi-hash absolute right-3 top-3.5 text-gray-400"></i>
            </div>
            <p class="text-xs text-gray-400">Mã mẫu hóa đơn đăng ký với cơ quan thuế</p>
          </div>
          <div class="space-y-3">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide">Ký Hiệu Hóa Đơn</label>
            <div class="relative">
              <input v-model="modelValue.invoiceSeries" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 outline-none transition-all placeholder:text-gray-300 font-mono uppercase font-medium" placeholder="C24TAA">
              <i class="bi bi-code-square absolute right-3 top-3.5 text-gray-400"></i>
            </div>
            <p class="text-xs text-gray-400">Ký hiệu hóa đơn bao gồm năm</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Object,
  loading: Boolean
})

const emit = defineEmits(['save'])
</script>
