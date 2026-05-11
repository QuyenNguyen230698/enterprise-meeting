import { defineStore } from 'pinia'

const uuidv4 = () => crypto.randomUUID()

// ─── Preset nội dung đầy đủ theo pháp luật ───────────────────────────────────
const LEGAL_PRESET = `Căn cứ:\n1. Bộ Luật Lao động số 45/2019/QH14 ngày 20/11/2019 và các văn bản hướng dẫn thi hành;\n2. Luật Giao dịch điện tử số 20/2023/QH15 ngày 22/06/2023;\n3. Nghị định số 13/2023/NĐ-CP ngày 17/04/2023 về bảo vệ dữ liệu cá nhân;\n4. Quy chế Nội bộ Công ty Enterprise Meeting và các quy định hiện hành;\n5. Thỏa thuận giữa các bên liên quan.`

const DOC_PRESETS = {
  MEETING_MINUTES: {
    name: 'Biên bản họp thường kỳ',
    code: 'QF-HRM-01',
    titleVn: 'BIÊN BẢN HỌP',
    titleEn: 'MEETING MINUTES',
    blocks: [
      { type: 'header' },
      { type: 'party', content: { showPartyB: false } },
      { type: 'legal', content: { text: LEGAL_PRESET } },
      {
        type: 'richtext',
        content: {
          html: '<p><strong>I. Thời gian và địa điểm</strong></p><p>- Thời gian: ....giờ....phút, ngày.... tháng.... năm ....</p><p>- Địa điểm: ............................................................................</p><p><strong>II. Thành phần tham dự</strong></p><p>1. Chủ trì: ............................................................................</p><p>2. Thư ký: ............................................................................</p><p>3. Thành viên tham dự: ........................................................</p><p><strong>III. Nội dung cuộc họp</strong></p><p>............................................................................</p><p><strong>IV. Kết luận và kiến nghị</strong></p><p>............................................................................</p><p><strong>V. Cam kết thực hiện</strong></p><p>Biên bản được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>',
        },
      },
      { type: 'signature' },
    ],
  },
  HANDOVER: {
    name: 'Biên bản bàn giao',
    code: 'QF-HRM-02',
    titleVn: 'BIÊN BẢN BÀN GIAO',
    titleEn: 'HANDOVER MINUTES',
    blocks: [
      { type: 'header' },
      { type: 'party', content: { showPartyB: true, partyBLabel: 'Bên nhận', partyBLabelEn: 'Recipient' } },
      { type: 'legal', content: { text: LEGAL_PRESET } },
      {
        type: 'richtext',
        content: {
          html: '<p><strong>I. Lý do bàn giao</strong></p><p>☐ Nghỉ việc &nbsp;&nbsp; ☐ Chuyển công tác / Điều động &nbsp;&nbsp; ☐ Lý do khác: ............</p><p><strong>II. Danh mục bàn giao</strong></p><p>(Xem bảng đính kèm bên dưới)</p><p><strong>III. Cam kết</strong></p><p>Hai bên cam kết đã thực hiện đầy đủ việc bàn giao và nhận bàn giao theo danh mục nêu trên. Bên giao chịu trách nhiệm về tính đầy đủ, chính xác của các thông tin bàn giao.</p><p>Biên bản được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>',
        },
      },
      {
        type: 'table',
        content: {
          headers: [
            { key: 'stt', label: 'STT', labelEn: '', width: '40px', style: {} },
            { key: 'name', label: 'Nội dung bàn giao', labelEn: 'Item', width: 'auto', style: {} },
            { key: 'qty', label: 'Số lượng', labelEn: 'Qty', width: '80px', style: {} },
            { key: 'status', label: 'Tình trạng', labelEn: 'Condition', width: '100px', style: {} },
            { key: 'confirm', label: 'Xác nhận', labelEn: 'Confirmed', width: '80px', style: {} },
          ],
          rows: Array.from({ length: 8 }, (_, i) => ({
            id: uuidv4(),
            stt: String(i + 1),
            name: '',
            qty: '',
            status: '',
            confirm: false,
          })),
        },
      },
      { type: 'signature' },
    ],
  },
  INTERNAL_DECISION: {
    name: 'Quyết định nội bộ',
    code: 'QF-HRM-03',
    titleVn: 'QUYẾT ĐỊNH',
    titleEn: 'INTERNAL DECISION',
    blocks: [
      { type: 'header' },
      { type: 'legal', content: { text: LEGAL_PRESET } },
      {
        type: 'richtext',
        content: {
          html: '<p><strong>QUYẾT ĐỊNH:</strong></p><p><strong>Điều 1.</strong> ............................................................................</p><p><strong>Điều 2.</strong> Quyết định này có hiệu lực kể từ ngày ký.</p><p><strong>Điều 3.</strong> Các bộ phận/cá nhân liên quan chịu trách nhiệm thi hành quyết định này.</p>',
        },
      },
      { type: 'signature' },
    ],
  },
  NDA: {
    name: 'Thỏa thuận bảo mật (NDA)',
    code: 'QF-HRM-04',
    titleVn: 'THỎA THUẬN BẢO MẬT THÔNG TIN',
    titleEn: 'NON-DISCLOSURE AGREEMENT (NDA)',
    blocks: [
      { type: 'header' },
      { type: 'party', content: { showPartyB: true, partyBLabel: 'Bên B (Nhân viên)', partyBLabelEn: 'Party B (Employee)' } },
      { type: 'legal', content: { text: LEGAL_PRESET } },
      {
        type: 'richtext',
        content: {
          html: '<p><strong>Điều 1. Định nghĩa thông tin bảo mật</strong></p><p>"Thông tin bảo mật" bao gồm nhưng không giới hạn: thông tin kinh doanh, kỹ thuật, tài chính, khách hàng, nhà cung cấp, chiến lược phát triển và mọi thông tin nội bộ của Công ty.</p><p><strong>Điều 2. Phạm vi áp dụng</strong></p><p>Thỏa thuận này áp dụng trong toàn bộ thời gian làm việc tại Công ty và trong vòng 02 (hai) năm sau khi chấm dứt hợp đồng lao động.</p><p><strong>Điều 3. Nghĩa vụ bảo mật</strong></p><p>Bên B cam kết: (i) không tiết lộ thông tin bảo mật cho bên thứ ba; (ii) chỉ sử dụng thông tin bảo mật phục vụ công việc được giao; (iii) thông báo ngay cho Công ty khi phát hiện rò rỉ thông tin.</p><p><strong>Điều 4. Vi phạm và hình thức xử lý</strong></p><p>Vi phạm thỏa thuận này, Bên B phải bồi thường thiệt hại thực tế và chịu các hình thức xử lý theo quy định pháp luật hiện hành.</p><p><strong>Điều 5. Điều khoản chung</strong></p><p>Thỏa thuận này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</p>',
        },
      },
      { type: 'signature' },
    ],
  },
  DISCIPLINE: {
    name: 'Biên bản xử lý kỷ luật',
    code: 'QF-HRM-05',
    titleVn: 'BIÊN BẢN XỬ LÝ VI PHẠM KỶ LUẬT LAO ĐỘNG',
    titleEn: 'LABOR DISCIPLINE MINUTES',
    blocks: [
      { type: 'header' },
      { type: 'party', content: { showPartyB: false } },
      { type: 'legal', content: { text: `Căn cứ:\n1. Bộ Luật Lao động số 45/2019/QH14 (Điều 122–129 về kỷ luật lao động);\n2. Nội quy Lao động Công ty Enterprise Meeting ban hành và được Sở LĐTBXH chấp thuận;\n3. Biên bản vi phạm số .............. ngày ............` } },
      {
        type: 'richtext',
        content: {
          html: '<p><strong>I. Nội dung vi phạm</strong></p><p>Hành vi vi phạm: ............................................................................</p><p>Thời gian xảy ra: ............................................................................</p><p>Địa điểm: ............................................................................</p><p><strong>II. Hình thức kỷ luật</strong></p><p>☐ Khiển trách &nbsp;&nbsp; ☐ Kéo dài thời hạn nâng lương &nbsp;&nbsp; ☐ Cách chức &nbsp;&nbsp; ☐ Sa thải</p><p><strong>III. Quyền khiếu nại</strong></p><p>Người lao động có quyền khiếu nại quyết định kỷ luật theo quy định tại Điều 188 Bộ Luật Lao động 2019 trong vòng 180 ngày kể từ ngày nhận được quyết định.</p><p><strong>IV. Cam kết</strong></p><p>Biên bản được đọc lại cho các bên nghe, xác nhận đúng sự thật và ký tên dưới đây.</p>',
        },
      },
      { type: 'signature' },
    ],
  },
  CUSTOM: {
    name: 'Văn bản tùy chỉnh',
    code: 'QF-HRM-XX',
    titleVn: 'TÊN VĂN BẢN',
    titleEn: 'DOCUMENT TITLE',
    blocks: [
      { type: 'header' },
      { type: 'richtext', content: { html: '<p>Nhập nội dung văn bản...</p>' } },
      { type: 'signature' },
    ],
  },
}

// ─── Default signers ──────────────────────────────────────────────────────────
const DEFAULT_SIGNERS = [
  {
    id: uuidv4(),
    position: 1,
    roleKey: 'prepared_by',
    labelVn: 'Người lập',
    labelEn: 'Prepared by',
    deptCodeFilter: null,
    titleFilter: null,
    autoAssign: true,
    required: true,
  },
  {
    id: uuidv4(),
    position: 2,
    roleKey: 'verified_by',
    labelVn: 'Xác nhận bởi',
    labelEn: 'Verified by',
    deptCodeFilter: 'MANAGER',
    titleFilter: null,
    autoAssign: false,
    required: true,
  },
  {
    id: uuidv4(),
    position: 3,
    roleKey: 'checked_by',
    labelVn: 'Kiểm tra',
    labelEn: 'Checked by',
    deptCodeFilter: 'HR',
    titleFilter: null,
    autoAssign: false,
    required: false,
  },
  {
    id: uuidv4(),
    position: 4,
    roleKey: 'approved_by',
    labelVn: 'Phê duyệt',
    labelEn: 'Approved by',
    deptCodeFilter: 'GM',
    titleFilter: null,
    autoAssign: false,
    required: false,
  },
]

// ─── Default workflow steps ───────────────────────────────────────────────────
const DEFAULT_WORKFLOW = [
  {
    id: uuidv4(),
    stepNumber: 1,
    name: 'Tạo và nộp văn bản',
    deptCode: 'EMPLOYEE',
    actionType: 'submit',
    canReject: false,
    signatureRequired: false,
    deadlineDays: null,
    notifyEmail: true,
    notifyInapp: true,
    statusPending: 'DRAFT',
    statusDone: 'PENDING_STEP_2',
  },
  {
    id: uuidv4(),
    stepNumber: 2,
    name: 'Trưởng phòng phê duyệt',
    deptCode: 'MANAGER',
    actionType: 'approve',
    canReject: true,
    signatureRequired: true,
    deadlineDays: 3,
    notifyEmail: true,
    notifyInapp: true,
    statusPending: 'PENDING_STEP_2',
    statusDone: 'PENDING_STEP_3',
  },
  {
    id: uuidv4(),
    stepNumber: 3,
    name: 'Nhân sự xử lý',
    deptCode: 'HR_STAFF',
    actionType: 'process',
    canReject: true,
    signatureRequired: false,
    deadlineDays: 2,
    notifyEmail: true,
    notifyInapp: true,
    statusPending: 'PENDING_STEP_3',
    statusDone: 'PENDING_STEP_4',
  },
  {
    id: uuidv4(),
    stepNumber: 4,
    name: 'Nhân sự phê duyệt',
    deptCode: 'HR_MANAGER',
    actionType: 'authorize',
    canReject: true,
    signatureRequired: true,
    deadlineDays: 2,
    notifyEmail: true,
    notifyInapp: true,
    statusPending: 'PENDING_STEP_4',
    statusDone: 'PENDING_STEP_5',
  },
  {
    id: uuidv4(),
    stepNumber: 5,
    name: 'Ban Giám đốc phê duyệt',
    deptCode: 'GM',
    actionType: 'approve',
    canReject: true,
    signatureRequired: true,
    deadlineDays: 3,
    notifyEmail: true,
    notifyInapp: true,
    statusPending: 'PENDING_STEP_5',
    statusDone: 'COMPLETED',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeBlock(type, extraContent = {}) {
  return {
    id: uuidv4(),
    type,
    order: 0,
    style: { fontSize: '13', fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left', color: '#111827' },
    content: extraContent,
  }
}

function buildBlocksFromPreset(preset) {
  return preset.blocks.map((b, i) => ({
    ...makeBlock(b.type, b.content || {}),
    order: i,
  }))
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useDocumentBuilderStore = defineStore('documentBuilder', {
  state: () => ({
    // List
    templates: [],
    listLoading: false,
    listError: null,

    // Editor
    currentStep: 1, // 1 | 2 | 3
    selectedBlockId: null,
    saving: false,

    // Template data
    template: {
      id: null,
      name: '',
      code: 'QF-HRM-XX',
      docType: 'CUSTOM',
      titleVn: '',
      titleEn: '',
      status: 'DRAFT', // DRAFT | PUBLISHED | ARCHIVED
      contentBlocks: [],
      signers: DEFAULT_SIGNERS.map(s => ({ ...s, id: uuidv4() })),
      workflowSteps: DEFAULT_WORKFLOW.map(s => ({ ...s, id: uuidv4() })),
    },
  }),

  getters: {
    selectedBlock: (state) =>
      state.template.contentBlocks.find(b => b.id === state.selectedBlockId) || null,

    sortedBlocks: (state) =>
      [...state.template.contentBlocks].sort((a, b) => a.order - b.order),

    signerCount: (state) => state.template.signers.length,

    canAddSigner: (state) => state.template.signers.length < 4,
    canRemoveSigner: (state) => state.template.signers.length > 1,

    canAddStep: (state) => state.template.workflowSteps.length < 7,
    canRemoveStep: (state) => state.template.workflowSteps.length > 1,

    publishedTemplates: (state) => state.templates.filter(t => t.status === 'PUBLISHED'),
    draftTemplates: (state) => state.templates.filter(t => t.status === 'DRAFT'),
  },

  actions: {
    // ── Init ──────────────────────────────────────────────────────────────────
    initNew(docType = 'CUSTOM') {
      const preset = DOC_PRESETS[docType] || DOC_PRESETS.CUSTOM
      this.template = {
        id: null,
        name: preset.name,
        code: preset.code,
        docType,
        titleVn: preset.titleVn,
        titleEn: preset.titleEn,
        status: 'DRAFT',
        contentBlocks: buildBlocksFromPreset(preset),
        signers: DEFAULT_SIGNERS.map(s => ({ ...s, id: uuidv4() })),
        workflowSteps: DEFAULT_WORKFLOW.map(s => ({ ...s, id: uuidv4() })),
      }
      this.currentStep = 1
      this.selectedBlockId = null
    },

    loadTemplate(data) {
      this.template = {
        ...data,
        contentBlocks: data.contentBlocks || [],
        signers: data.signers || DEFAULT_SIGNERS.map(s => ({ ...s, id: uuidv4() })),
        workflowSteps: data.workflowSteps || DEFAULT_WORKFLOW.map(s => ({ ...s, id: uuidv4() })),
      }
      this.currentStep = 1
      this.selectedBlockId = null
    },

    // ── Step navigation ───────────────────────────────────────────────────────
    goToStep(n) {
      if (n >= 1 && n <= 3) this.currentStep = n
    },

    // ── Block CRUD ────────────────────────────────────────────────────────────
    addBlock(type) {
      const maxOrder = this.template.contentBlocks.reduce((m, b) => Math.max(m, b.order), -1)
      const block = makeBlock(type)
      block.order = maxOrder + 1

      // Pre-fill defaults per type
      if (type === 'legal') block.content = { text: LEGAL_PRESET }
      if (type === 'table') {
        block.content = {
          headers: [
            { key: 'stt', label: 'STT', labelEn: '', width: '40px', style: {} },
            { key: 'content', label: 'Nội dung', labelEn: 'Content', width: 'auto', style: {} },
            { key: 'note', label: 'Ghi chú', labelEn: 'Note', width: '120px', style: {} },
          ],
          rows: Array.from({ length: 5 }, (_, i) => ({ id: uuidv4(), stt: String(i + 1), content: '', note: '' })),
        }
      }
      if (type === 'checklist') {
        block.content = {
          items: [
            { id: uuidv4(), text: 'Mục 1', checked: false, style: {} },
            { id: uuidv4(), text: 'Mục 2', checked: false, style: {} },
          ],
        }
      }
      if (type === 'richtext') {
        block.content = { html: '<p>Nhập nội dung...</p>' }
      }
      if (type === 'party') {
        block.content = { showPartyB: false, partyBLabel: 'Bên B', partyBLabelEn: 'Party B' }
      }
      if (type === 'divider') {
        block.content = { label: '' }
      }

      this.template.contentBlocks.push(block)
      this.selectedBlockId = block.id
    },

    removeBlock(id) {
      const idx = this.template.contentBlocks.findIndex(b => b.id === id)
      if (idx !== -1) {
        this.template.contentBlocks.splice(idx, 1)
        if (this.selectedBlockId === id) this.selectedBlockId = null
      }
    },

    selectBlock(id) {
      this.selectedBlockId = id
    },

    clearSelection() {
      this.selectedBlockId = null
    },

    updateBlockContent(id, content) {
      const b = this.template.contentBlocks.find(b => b.id === id)
      if (b) b.content = { ...b.content, ...content }
    },

    updateBlockStyle(id, style) {
      const b = this.template.contentBlocks.find(b => b.id === id)
      if (b) b.style = { ...b.style, ...style }
    },

    moveBlockUp(id) {
      const sorted = this.sortedBlocks
      const idx = sorted.findIndex(b => b.id === id)
      if (idx <= 0) return
      const prev = sorted[idx - 1]
      const cur = sorted[idx]
      const tmp = prev.order
      prev.order = cur.order
      cur.order = tmp
    },

    moveBlockDown(id) {
      const sorted = this.sortedBlocks
      const idx = sorted.findIndex(b => b.id === id)
      if (idx >= sorted.length - 1) return
      const next = sorted[idx + 1]
      const cur = sorted[idx]
      const tmp = next.order
      next.order = cur.order
      cur.order = tmp
    },

    reorderBlocks(fromId, toId) {
      const sorted = this.sortedBlocks
      const fromIdx = sorted.findIndex(b => b.id === fromId)
      const toIdx = sorted.findIndex(b => b.id === toId)
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return
      const moved = sorted.splice(fromIdx, 1)[0]
      sorted.splice(toIdx, 0, moved)
      sorted.forEach((b, i) => {
        const block = this.template.contentBlocks.find(x => x.id === b.id)
        if (block) block.order = i
      })
    },

    // ── Table block helpers ───────────────────────────────────────────────────
    addTableRow(blockId) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b || b.type !== 'table') return
      const newRow = { id: uuidv4() }
      b.content.headers.forEach(h => { newRow[h.key] = h.key === 'stt' ? String(b.content.rows.length + 1) : '' })
      b.content.rows.push(newRow)
    },

    removeTableRow(blockId, rowId) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b) return
      b.content.rows = b.content.rows.filter(r => r.id !== rowId)
      b.content.rows.forEach((r, i) => { if (b.content.headers[0]?.key === 'stt') r.stt = String(i + 1) })
    },

    addTableColumn(blockId) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b) return
      const key = `col_${uuidv4().slice(0, 6)}`
      b.content.headers.push({ key, label: 'Cột mới', labelEn: 'New col', width: 'auto', style: {} })
      b.content.rows.forEach(r => { r[key] = '' })
    },

    removeTableColumn(blockId, colKey) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b || b.content.headers.length <= 1) return
      b.content.headers = b.content.headers.filter(h => h.key !== colKey)
      b.content.rows.forEach(r => { delete r[colKey] })
    },

    updateTableCell(blockId, rowId, colKey, value) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b) return
      const row = b.content.rows.find(r => r.id === rowId)
      if (row) row[colKey] = value
    },

    updateTableHeaderLabel(blockId, colKey, label) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b) return
      const h = b.content.headers.find(h => h.key === colKey)
      if (h) h.label = label
    },

    // ── Checklist helpers ─────────────────────────────────────────────────────
    addChecklistItem(blockId) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b) return
      b.content.items.push({ id: uuidv4(), text: 'Mục mới', checked: false, style: {} })
    },

    removeChecklistItem(blockId, itemId) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b) return
      b.content.items = b.content.items.filter(i => i.id !== itemId)
    },

    updateChecklistItemStyle(blockId, itemId, style) {
      const b = this.template.contentBlocks.find(b => b.id === blockId)
      if (!b) return
      const item = b.content.items.find(i => i.id === itemId)
      if (item) item.style = { ...item.style, ...style }
    },

    // ── Signers ───────────────────────────────────────────────────────────────
    addSigner() {
      if (!this.canAddSigner) return
      const pos = this.template.signers.length + 1
      this.template.signers.push({
        id: uuidv4(),
        position: pos,
        roleKey: `signer_${pos}`,
        labelVn: `Người ký ${pos}`,
        labelEn: `Signer ${pos}`,
        deptCodeFilter: null,
        titleFilter: null,
        autoAssign: false,
        required: false,
      })
    },

    removeSigner(id) {
      if (!this.canRemoveSigner) return
      this.template.signers = this.template.signers
        .filter(s => s.id !== id)
        .map((s, i) => ({ ...s, position: i + 1 }))
    },

    updateSigner(id, data) {
      const s = this.template.signers.find(s => s.id === id)
      if (s) Object.assign(s, data)
    },

    // ── Workflow ──────────────────────────────────────────────────────────────
    addWorkflowStep() {
      if (!this.canAddStep) return
      const last = this.template.workflowSteps[this.template.workflowSteps.length - 1]
      const stepNum = (last?.stepNumber || 0) + 1
      this.template.workflowSteps.push({
        id: uuidv4(),
        stepNumber: stepNum,
        name: `Bước ${stepNum}`,
        deptCode: '',
        actionType: 'approve',
        canReject: true,
        signatureRequired: true,
        deadlineDays: 3,
        notifyEmail: true,
        notifyInapp: true,
        statusPending: `PENDING_STEP_${stepNum}`,
        statusDone: stepNum === 7 ? 'COMPLETED' : `PENDING_STEP_${stepNum + 1}`,
      })
      this.renumberSteps()
    },

    removeWorkflowStep(id) {
      if (!this.canRemoveStep) return
      this.template.workflowSteps = this.template.workflowSteps.filter(s => s.id !== id)
      this.renumberSteps()
    },

    updateWorkflowStep(id, data) {
      const s = this.template.workflowSteps.find(s => s.id === id)
      if (s) Object.assign(s, data)
    },

    moveStepUp(id) {
      const idx = this.template.workflowSteps.findIndex(s => s.id === id)
      if (idx <= 0) return
      const arr = this.template.workflowSteps
      ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
      this.renumberSteps()
    },

    moveStepDown(id) {
      const idx = this.template.workflowSteps.findIndex(s => s.id === id)
      if (idx >= this.template.workflowSteps.length - 1) return
      const arr = this.template.workflowSteps
      ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
      this.renumberSteps()
    },

    renumberSteps() {
      this.template.workflowSteps.forEach((s, i) => {
        s.stepNumber = i + 1
        s.statusPending = i === 0 ? 'DRAFT' : `PENDING_STEP_${i + 1}`
        s.statusDone = i === this.template.workflowSteps.length - 1 ? 'COMPLETED' : `PENDING_STEP_${i + 2}`
      })
    },

    // ── API (mocked — kết nối backend sau) ────────────────────────────────────
    async fetchTemplates() {
      this.listLoading = true
      try {
        const res = await useFetchAuth('/v1/hrm/document-templates')
        this.templates = res?.data || res || []
      } catch {
        this.templates = []
      } finally {
        this.listLoading = false
      }
    },

    async saveTemplate() {
      this.saving = true
      try {
        const payload = { ...this.template }
        if (this.template.id) {
          const res = await useFetchAuth(`/v1/hrm/document-templates/${this.template.id}`, { method: 'PUT', body: payload })
          return res
        } else {
          const res = await useFetchAuth('/v1/hrm/document-templates', { method: 'POST', body: payload })
          if (res?.data?.id || res?.id) this.template.id = res?.data?.id || res?.id
          return res
        }
      } finally {
        this.saving = false
      }
    },

    async publishTemplate() {
      if (!this.template.id) await this.saveTemplate()
      return useFetchAuth(`/v1/hrm/document-templates/${this.template.id}/publish`, { method: 'POST' })
    },
  },
})

export { DOC_PRESETS }
