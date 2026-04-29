<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <div
      class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden"
    >
      <div
        class="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center"
      >
        <div>
          <h3 class="font-bold text-gray-900">Tài Khoản Ngân Hàng</h3>
          <p class="text-sm text-gray-500 mt-0.5">
            Quản lý các tài khoản nhận thanh toán
          </p>
        </div>
        <button
          @click="$emit('add-bank')"
          class="text-xs bg-gray-900 text-white hover:bg-gray-800 px-3 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
        >
          <i class="bi bi-plus-lg"></i> Thêm Tài Khoản
        </button>
      </div>

      <div class="p-6 md:p-8 grid gap-6">
        <div
          v-if="!bankAccounts || bankAccounts.length === 0"
          class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200"
        >
          <div class="text-4xl text-gray-300 mb-3">
            <i class="bi bi-credit-card-2-front"></i>
          </div>
          <p class="text-gray-500 font-medium">
            Chưa có tài khoản ngân hàng nào
          </p>
        </div>

        <div
          v-for="(acc, idx) in bankAccounts"
          :key="idx"
          class="relative rounded-2xl p-6 md:p-8 overflow-hidden group border transition-all hover:shadow-md"
          :class="
            acc.isDefault
              ? 'bg-white border-indigo-200 ring-1 ring-indigo-50/50'
              : 'bg-white border-gray-200'
          "
        >
          <!-- Accent bar -->
          <div
            v-if="acc.isDefault"
            class="absolute top-0 left-0 bottom-0 w-1.5 bg-indigo-500"
          ></div>

          <div
            class="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start"
          >
            <!-- Icon/Logo -->
            <div
              class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0 overflow-hidden group-hover:bg-white transition-colors"
            >
              <img
                v-if="acc.logo"
                :src="acc.logo"
                class="w-full h-full object-contain p-2"
              />
              <i v-else class="bi bi-bank2 text-2xl text-gray-400"></i>
            </div>

            <!-- Info -->
            <div class="flex-1 w-full space-y-6">
              <div class="flex justify-between items-start gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-bold text-gray-900 text-xl tracking-tight">
                      {{ acc.bankName }}
                    </h4>
                    <span
                      v-if="acc.isDefault"
                      class="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-bold uppercase rounded tracking-wider"
                      >Mặc định</span
                    >
                  </div>
                  <p class="text-sm text-gray-400 font-medium">
                    {{ acc.branch }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="$emit('edit-bank', idx)"
                    class="p-2 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <i class="bi bi-pencil-fill text-sm"></i>
                  </button>
                  <button
                    @click="$emit('delete-bank', idx)"
                    class="p-2 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <i class="bi bi-trash-fill text-sm"></i>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div>
                  <label
                    class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5"
                    >Số Tài Khoản</label
                  >
                  <div
                    class="bg-gray-50/80 px-4 py-3 rounded-xl border border-gray-100 font-mono text-xl text-gray-900 font-bold tracking-widest group-hover:bg-indigo-50/30 group-hover:border-indigo-100 transition-colors"
                  >
                    {{ acc.bankAccountNo }}
                  </div>
                </div>
                <div>
                  <label
                    class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5"
                    >Chủ Tài Khoản</label
                  >
                  <div
                    class="px-0.5 pt-2 text-xl font-bold text-gray-800 uppercase tracking-tight"
                  >
                    {{ acc.bankAccountName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bankAccounts: Array,
});
defineEmits(["add-bank", "edit-bank", "delete-bank"]);
</script>
