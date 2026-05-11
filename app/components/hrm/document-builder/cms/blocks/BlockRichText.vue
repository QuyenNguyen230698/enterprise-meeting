<template>
  <div class="border-b border-gray-300" :style="blockStyle">
    <!-- Toolbar -->
    <div v-if="editable" class="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">
      <button @click="exec('bold')" class="toolbar-btn" title="In đậm"><strong>B</strong></button>
      <button @click="exec('italic')" class="toolbar-btn" title="In nghiêng"><em>I</em></button>
      <button @click="exec('underline')" class="toolbar-btn" title="Gạch chân"><u>U</u></button>
      <div class="w-px h-4 bg-gray-300 mx-1"></div>
      <button @click="exec('insertUnorderedList')" class="toolbar-btn" title="Danh sách"><i class="bi bi-list-ul text-xs"></i></button>
      <button @click="exec('insertOrderedList')" class="toolbar-btn" title="Danh sách có số"><i class="bi bi-list-ol text-xs"></i></button>
      <div class="w-px h-4 bg-gray-300 mx-1"></div>
      <button @click="exec('justifyLeft')" class="toolbar-btn"><i class="bi bi-text-left text-xs"></i></button>
      <button @click="exec('justifyCenter')" class="toolbar-btn"><i class="bi bi-text-center text-xs"></i></button>
      <button @click="exec('justifyRight')" class="toolbar-btn"><i class="bi bi-text-right text-xs"></i></button>
      <div class="w-px h-4 bg-gray-300 mx-1"></div>
      <select @change="execFontSize($event.target.value)" class="text-xs border border-gray-200 rounded px-1 py-0.5 focus:outline-none bg-white">
        <option value="2">XS</option>
        <option value="3" selected>S</option>
        <option value="4">M</option>
        <option value="5">L</option>
        <option value="6">XL</option>
      </select>
      <!-- Insert variable -->
      <div class="relative ml-auto">
        <button @click="showVars = !showVars" class="toolbar-btn text-blue-600" title="Chèn biến dữ liệu">
          <i class="bi bi-braces text-xs"></i>
        </button>
        <div v-if="showVars" class="absolute top-7 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-48 p-2">
          <p class="text-[10px] text-gray-400 font-bold uppercase px-1 mb-1">Biến tự động</p>
          <button
            v-for="v in variables"
            :key="v.key"
            @click="insertVar(v.key)"
            class="w-full text-left px-2 py-1 text-xs hover:bg-blue-50 rounded-lg flex items-center justify-between"
          >
            <span class="text-gray-700">{{ v.label }}</span>
            <span class="text-blue-500 font-mono text-[10px]">&#123;&#123;{{ v.key }}&#125;&#125;</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Rendered segments: text + inline inputs cho các chỗ .... -->
    <div
      class="px-3 py-2.5 text-gray-800 leading-relaxed"
      :style="{
        fontSize: (blockStyle.fontSize || '13') + 'px',
        fontWeight: blockStyle.fontWeight || 'normal',
        fontStyle: blockStyle.fontStyle || 'normal',
        textAlign: blockStyle.textAlign || 'left',
        color: blockStyle.color || '#111827',
      }"
    >
      <!-- Editable mode: contenteditable cho phần HTML gốc -->
      <div
        v-if="editable"
        ref="editorRef"
        contenteditable="true"
        @input="handleInput"
        @blur="showVars = false"
        class="min-h-[60px] focus:outline-none"
        v-html="renderedHtml"
      ></div>
      <!-- Preview / print mode -->
      <div v-else v-html="renderedHtml" class="min-h-[40px]"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: { type: Object, default: () => ({ html: '', fields: {} }) },
  editable: { type: Boolean, default: true },
  blockStyle: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['update:content'])

const editorRef = ref(null)
const showVars = ref(false)

// Convert ....+ thành <input> inline khi editable, hoặc <span class="field-value"> khi preview
const renderedHtml = computed(() => {
  const fields = props.content.fields || {}
  let html = props.content.html || ''
  // Replace chuỗi ....+ (3+ dấu chấm) thành input inline
  html = html.replace(/\.{3,}/g, (match, offset) => {
    const key = `f${offset}`
    const val = fields[key] || ''
    if (props.editable) {
      return `<input
        data-field="${key}"
        value="${val.replace(/"/g, '&quot;')}"
        placeholder="${match}"
        class="inline-field-input"
        style="min-width:${Math.max(60, match.length * 7)}px"
      />`
    }
    return val
      ? `<span class="field-value">${val}</span>`
      : `<span class="field-blank">${match}</span>`
  })
  return html
})

// Lắng nghe input từ các inline input fields
onMounted(() => { attachFieldListeners() })
watch(renderedHtml, async () => {
  await nextTick()
  attachFieldListeners()
})

function attachFieldListeners() {
  if (!editorRef.value) return
  editorRef.value.querySelectorAll('input[data-field]').forEach(el => {
    el.oninput = (e) => {
      const key = el.dataset.field
      const fields = { ...(props.content.fields || {}), [key]: e.target.value }
      emit('update:content', { ...props.content, fields })
    }
    // Ngăn contenteditable xử lý event từ input
    el.onkeydown = (e) => e.stopPropagation()
    el.onclick = (e) => e.stopPropagation()
  })
}

const variables = [
  { key: 'employee_name', label: 'Họ tên nhân viên' },
  { key: 'employee_code', label: 'Mã nhân viên' },
  { key: 'department', label: 'Phòng ban' },
  { key: 'job_title', label: 'Chức danh' },
  { key: 'dept_code', label: 'Mã phòng ban' },
  { key: 'today', label: 'Ngày hôm nay' },
  { key: 'company_name', label: 'Tên công ty' },
]

const exec = (cmd) => {
  editorRef.value?.focus()
  document.execCommand(cmd, false, null)
  handleInput()
}

const execFontSize = (size) => {
  editorRef.value?.focus()
  document.execCommand('fontSize', false, size)
  handleInput()
}

const insertVar = (key) => {
  editorRef.value?.focus()
  document.execCommand('insertText', false, `{{${key}}}`)
  handleInput()
  showVars.value = false
}

const handleInput = () => {
  if (!editorRef.value) return
  // Lấy innerHTML nhưng bỏ input value (đã lưu trong fields)
  const clone = editorRef.value.cloneNode(true)
  clone.querySelectorAll('input[data-field]').forEach(el => {
    // Giữ placeholder dạng ..... trong HTML gốc
    el.replaceWith(document.createTextNode(el.placeholder || '...'))
  })
  emit('update:content', { ...props.content, html: clone.innerHTML })
}

watch(() => props.content.html, async (val) => {
  if (editorRef.value && editorRef.value !== document.activeElement) {
    await nextTick()
    attachFieldListeners()
  }
})
</script>

<style scoped>
.toolbar-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #4b5563;
  cursor: pointer;
  transition: background-color 0.15s;
}
.toolbar-btn:hover { background-color: #e5e7eb; }
</style>
