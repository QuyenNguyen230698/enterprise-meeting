<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <div class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h3 class="font-bold text-gray-900">Thông Tin Pháp Lý</h3>
        <p class="text-sm text-gray-500 mt-0.5">Dùng để xuất hóa đơn cho khách hàng</p>
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
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Object
})
</script>
