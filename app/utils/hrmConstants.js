// Dùng chung cho DocumentBuilder — SignerConfig, WorkflowBuilder, BlockSignature

export const DEPT_LABELS = {
  null: 'Tự động (người tạo)',
  '': 'Tự động (người tạo)',
  EMPLOYEE: 'Nhân viên',
  MANAGER: 'Trưởng phòng',
  DIRECTOR: 'Giám đốc bộ phận',
  HR_STAFF: 'Nhân sự xử lý',
  HR_MANAGER: 'Nhân sự phê duyệt',
  HR_DIRECTOR: 'Giám đốc NS',
  GM: 'Ban Giám đốc',
  GM_DIRECTOR: 'Tổng Giám đốc',
}

export const deptLabel = (code) => DEPT_LABELS[code] ?? code ?? 'Tự động'

export const ACTION_META = {
  submit: { label: 'Nộp đơn', icon: 'bi bi-send', cls: 'bg-gray-100 text-gray-600', color: 'bg-gray-500' },
  approve: { label: 'Phê duyệt', icon: 'bi bi-check-circle', cls: 'bg-green-100 text-green-700', color: 'bg-green-600' },
  process: { label: 'Xử lý', icon: 'bi bi-gear', cls: 'bg-blue-100 text-blue-700', color: 'bg-blue-600' },
  authorize: { label: 'Ủy quyền duyệt', icon: 'bi bi-shield-check', cls: 'bg-purple-100 text-purple-700', color: 'bg-purple-600' },
  review: { label: 'Xem xét', icon: 'bi bi-search', cls: 'bg-amber-100 text-amber-700', color: 'bg-amber-500' },
  sign: { label: 'Ký duyệt', icon: 'bi bi-pen', cls: 'bg-rose-100 text-rose-700', color: 'bg-rose-600' },
}

export const actionLabel = (t) => ACTION_META[t]?.label || t
export const actionIcon = (t) => ACTION_META[t]?.icon || 'bi bi-circle'
export const actionBadgeClass = (t) => ACTION_META[t]?.cls || 'bg-gray-100 text-gray-600'
export const stepColorClass = (t) => ACTION_META[t]?.color || 'bg-gray-500'

// Helper kiểm tra API response có thành công không
// Backend trả về {data: ...} khi thành công, {error: "..."} khi thất bại
export const isApiSuccess = (res) => {
  if (!res) return false
  if (res?.error) return false
  return true
}

export const unwrapApiData = (res) => {
  if (!res) return null
  // {data: [...]} hoặc {success: true, data: ...}
  if (res?.data !== undefined) return res.data
  // Raw array hoặc object
  return res
}
