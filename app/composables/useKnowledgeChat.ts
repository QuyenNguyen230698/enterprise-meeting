import { ref } from 'vue'

export const useKnowledgeChat = () => {
  const messages = ref<{ role: 'user' | 'model', content: string, sources?: string[] }[]>([])
  const isStreaming = ref(false)
  const threadId = ref<string | null>(null)
  const error = ref<string | null>(null)

  const activeProvider = ref<string>('auto')

  const sendMessage = async (text: string, scope: 'public' | 'internal' = 'public', provider: string = 'auto') => {
    if (!text.trim()) return

    messages.value.push({ role: 'user', content: text })
    isStreaming.value = true
    error.value = null

    const aiMessageIndex = messages.value.push({ role: 'model', content: '', sources: [], provider: '' } as any) - 1

    try {
      const token = useCookie('accessToken').value
      const config = useRuntimeConfig()
      const apiBase = config.public.apiBase

      const response = await fetch(`${apiBase}/v1/knowledge/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: text,
          scope: scope,
          thread_id: threadId.value,
          stream: true,
          provider: provider === 'auto' ? null : provider,
        })
      })

      if (!response.ok) throw new Error('Failed to connect to AI')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.content === '[DONE]') continue
                if (data.error) {
                  error.value = data.error
                  break
                }
                
                if (data.thread_id && !threadId.value) {
                  threadId.value = data.thread_id
                }
                if (data.provider) {
                  activeProvider.value = data.provider
                  ;(messages.value[aiMessageIndex] as any).provider = data.provider
                }
                if (data.sources) {
                  ;(messages.value[aiMessageIndex] as any).sources = data.sources
                }
                if (data.content && data.content !== '[DONE]') {
                  messages.value[aiMessageIndex].content += data.content
                }
              } catch (e) {
                // Ignore partial JSON
              }
            }
          }
        }
      }
    } catch (err: any) {
      error.value = err.message
      messages.value.pop() // Xóa tin nhắn model trống nếu lỗi
    } finally {
      isStreaming.value = false
    }
  }

  const clearChat = () => {
    messages.value = []
    threadId.value = null
  }

  return {
    messages,
    isStreaming,
    threadId,
    error,
    activeProvider,
    sendMessage,
    clearChat
  }
}
