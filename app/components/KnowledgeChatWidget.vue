<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

    <!-- Chat popup -->
    <Transition name="widget-pop">
      <div
        v-if="isOpen"
        class="w-[360px] h-[520px] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-white/[0.07] shrink-0">
          <div class="flex items-center gap-2">
            <div class="h-6 w-6 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <i class="bi bi-stars text-emerald-400 text-[10px]"></i>
            </div>
            <span class="text-sm font-semibold text-white">AI Trợ lý</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Beta</span>
          </div>
          <div class="flex items-center gap-1">
            <button @click="clearChat" title="Cuộc hội thoại mới" class="h-6 w-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 transition">
              <i class="bi bi-pencil-square text-[10px]"></i>
            </button>
            <button @click="isOpen = false" class="h-6 w-6 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 transition">
              <i class="bi bi-x text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">

          <!-- Empty state -->
          <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center gap-3 pb-4">
            <div class="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <i class="bi bi-stars text-xl text-emerald-400"></i>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-300">Xin chào!</p>
              <p class="text-xs text-gray-600 mt-1 leading-relaxed">Tôi có thể giúp bạn tìm hiểu<br>về sản phẩm và dịch vụ.</p>
            </div>
            <div class="w-full space-y-1.5 mt-2">
              <button
                v-for="q in quickQuestions"
                :key="q"
                @click="sendQuick(q)"
                class="w-full text-left px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10 transition text-xs text-gray-400"
              >{{ q }}</button>
            </div>
          </div>

          <!-- Message list -->
          <template v-else>
            <div v-for="(msg, i) in messages" :key="i">
              <!-- User -->
              <div v-if="msg.role === 'user'" class="flex justify-end">
                <div class="max-w-[80%] px-3 py-2 rounded-2xl rounded-br-sm bg-emerald-600 text-white text-xs leading-relaxed">
                  {{ msg.content }}
                </div>
              </div>
              <!-- AI -->
              <div v-else v-show="msg.content || !(isStreaming && i === messages.length - 1)" class="flex gap-2">
                <div class="h-6 w-6 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <i class="bi bi-stars text-emerald-400 text-[9px]"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">{{ msg.content }}</div>
                </div>
              </div>
            </div>

            <!-- Typing dots -->
            <div v-if="isStreaming" class="flex gap-2">
              <div class="h-6 w-6 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <i class="bi bi-stars text-emerald-400 text-[9px]"></i>
              </div>
              <div class="flex items-center gap-1 pt-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-bounce"></span>
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-bounce [animation-delay:0.15s]"></span>
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="px-3 pb-3 pt-2 shrink-0 border-t border-white/[0.06]">
          <div :class="['flex items-end gap-2 px-3 py-2 rounded-xl border transition', isStreaming ? 'bg-[#1e1e1e] border-white/[0.05]' : 'bg-[#252525] border-white/[0.07] focus-within:border-white/15']">
            <textarea
              v-model="input"
              rows="1"
              @keydown.enter.exact.prevent="handleSend"
              placeholder="Nhập câu hỏi..."
              class="flex-1 bg-transparent text-xs text-gray-100 placeholder:text-gray-500 focus:outline-none resize-none leading-relaxed py-0.5 disabled:opacity-100 disabled:cursor-not-allowed"
              style="max-height: 80px; -webkit-text-fill-color: rgb(243 244 246);"
              :disabled="isStreaming"
            ></textarea>
            <button
              @click="handleSend"
              :disabled="!input.trim() || isStreaming"
              :class="['h-6 w-6 rounded-lg flex items-center justify-center transition shrink-0', input.trim() && !isStreaming ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'text-gray-700 cursor-not-allowed']"
            >
              <i class="bi bi-arrow-up text-xs font-black"></i>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toggle button -->
    <button
      @click="isOpen = !isOpen"
      :class="['h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95', isOpen ? 'bg-[#252525] border border-white/10 text-gray-400 hover:text-gray-200' : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-lime-400 text-white hover:from-emerald-500 hover:via-teal-500 hover:to-lime-500']"
    >
      <i :class="isOpen ? 'bi bi-x text-xl' : 'bi bi-stars text-lg'"></i>
      <!-- Unread dot -->
      <span v-if="!isOpen && unread" class="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-[#141414]"></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useKnowledgeChat } from '~/composables/useKnowledgeChat'

const isOpen = ref(false)
const input = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const unread = ref(false)

const { messages, isStreaming, sendMessage, clearChat } = useKnowledgeChat()

const quickQuestions = [
  'EMTOOLS có những tính năng gì?',
  'Làm sao để đặt phòng họp?',
  'Liên hệ hỗ trợ ở đâu?',
]

const handleSend = async () => {
  const text = input.value.trim()
  if (!text || isStreaming.value) return
  input.value = ''
  await sendMessage(text, 'public')
}

const sendQuick = async (q: string) => {
  await sendMessage(q, 'public')
}

// Auto-scroll to bottom on new messages
watch(messages, async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
  // Show unread dot when widget is closed
  if (!isOpen.value && messages.value.length > 0) {
    unread.value = true
  }
}, { deep: true })

// Clear unread when opened
watch(isOpen, (val) => {
  if (val) unread.value = false
})
</script>

<style scoped>
.widget-pop-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.widget-pop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.widget-pop-enter-from { opacity: 0; transform: scale(0.95) translateY(8px); transform-origin: bottom right; }
.widget-pop-leave-to  { opacity: 0; transform: scale(0.95) translateY(8px); transform-origin: bottom right; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
</style>
