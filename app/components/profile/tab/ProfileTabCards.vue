<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-xl font-bold text-slate-900">Thẻ đã lưu</h3>
        <p class="text-sm text-slate-500">Quản lý phương thức thanh toán của bạn</p>
      </div>
      <button
        @click="$emit('add-card')"
        class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all active:scale-95"
      >
        <i class="bi bi-plus-lg"></i> Thêm thẻ mới
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="savedCards.length === 0"
      class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200"
    >
      <div
        class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <i class="bi bi-credit-card-2-front text-3xl"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-2">Chưa có thẻ nào</h3>
      <p class="text-slate-500 max-w-xs mx-auto text-sm">
        Thẻ thanh toán của bạn sẽ xuất hiện ở đây sau khi bạn thực hiện giao
        dịch và chọn lưu thẻ.
      </p>
    </div>

    <!-- Cards Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="card in savedCards"
        :key="card._id"
        class="group relative aspect-[1.586] rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl shadow-lg"
        :class="card.isDefault ? 'ring-2 ring-offset-2 ring-emerald-500' : ''"
      >
        <!-- Card Background -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-900 z-0"
        >
          <!-- Abstract Pattern -->
          <div
            class="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"
          ></div>
          <div
            class="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl"
          ></div>
        </div>

        <!-- Content -->
        <div
          class="relative z-10 p-6 flex flex-col justify-between h-full text-white"
        >
          <div class="flex justify-between items-start">
            <div
              class="w-12 h-8 bg-white/10 backdrop-blur rounded flex items-center justify-center"
            >
              <img
                v-if="getCardLogo(card.cardType).startsWith('http')"
                :src="getCardLogo(card.cardType)"
                class="h-5 w-auto object-contain brightness-0 invert"
              />
              <i v-else class="bi bi-credit-card text-xl"></i>
            </div>

            <div class="flex gap-2">
              <button
                v-if="!card.isDefault"
                @click="$emit('set-default', card._id)"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center transition-colors"
                title="Đặt làm mặc định"
              >
                <i class="bi bi-star text-xs"></i>
              </button>
              <button
                @click="$emit('delete-card', card._id)"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/80 backdrop-blur flex items-center justify-center transition-colors text-white/50 hover:text-white"
                title="Xóa thẻ"
              >
                <i class="bi bi-trash text-xs"></i>
              </button>
            </div>
          </div>

          <div class="font-mono text-lg tracking-widest min-h-[1.75rem]">
            •••• •••• •••• {{ card.cardNumber?.slice(-4) || "****" }}
          </div>

          <div
            class="flex justify-between items-end text-xs text-white/60 font-medium tracking-wider"
          >
            <div>
              <div class="text-xs uppercase mb-0.5">Card Holder</div>
              <div class="text-white">{{ card.cardHolder || 'USER NAME' }}</div>
            </div>
            <div>
              <div class="text-xs uppercase mb-0.5 text-right">Expires</div>
              <div class="text-white">
                {{ formatExpiryDate(card.vpc_TokenExp) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Default Badge -->
        <div
          v-if="card.isDefault"
          class="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-xs px-2 py-0.5 rounded text-white font-bold tracking-wider backdrop-blur-sm z-20"
        >
          DEFAULT
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  savedCards: { type: Array, default: () => [] },
});

defineEmits(["set-default", "delete-card"]);

// Mock Utils if not available via auto-import, but assuming useCardUtils is available or inline logic needed.
// Since original code used useCardUtils(), I'll assume it's auto-imported composable.
const { getCardLogo, formatExpiryDate } = useCardUtils();
</script>
