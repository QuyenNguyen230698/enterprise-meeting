export const useAssetHandoverRole = () => {
  const auth = useAuthStore()
  const { profileDeptCode, profileDepartment, profileTitle, fetchProfile } = useUserProfile()

  const deptRoot = (code) => String(code || '').toUpperCase().split('_')[0] || ''

  const inferDeptRootFromTitle = (title) => {
    const t = String(title || '').toUpperCase()
    if (!t) return ''
    if (t.includes('NHÂN SỰ') || t.includes('HR')) return 'HR'
    if (t.includes('TỔNG GIÁM ĐỐC') || t.includes('GM')) return 'GM'
    if (t.includes(' IT') || t.startsWith('IT') || t.includes('CÔNG NGHỆ THÔNG TIN')) return 'IT'
    return ''
  }

  const actorDeptRoot = computed(() =>
    deptRoot(profileDeptCode.value) ||
    deptRoot(profileDepartment.value) ||
    inferDeptRootFromTitle(profileTitle.value)
  )

  // Chỉ HR (staff hoặc manager/director) mới được tạo và xử lý đơn
  const isHRStaff = computed(() => {
    const code = profileDeptCode.value
    return actorDeptRoot.value === 'HR' && (
      code.includes('HR_STAFF') ||
      profileTitle.value.includes('CHUYÊN VIÊN NHÂN SỰ')
    )
  })

  const isHRManagerOrDirector = computed(() => {
    const code = profileDeptCode.value
    const isTitleHRLead =
      profileTitle.value.includes('TRƯỞNG PHÒNG NHÂN SỰ') ||
      profileTitle.value.includes('GIÁM ĐỐC NHÂN SỰ')
    return actorDeptRoot.value === 'HR' && (
      code.includes('HR_MANAGER') ||
      code.includes('HR_DIRECTOR') ||
      isTitleHRLead
    )
  })

  const isHR = computed(() => isHRStaff.value || isHRManagerOrDirector.value)

  const currentUserId = computed(() =>
    String(auth.user?.portal_user_id ?? auth.user?.id ?? '').trim()
  )

  // Nhân viên chỉ ký nhận đơn của chính mình
  const canEmployeeSign = (handover) => {
    if (!handover || handover.status !== 'PENDING_EMPLOYEE_SIGN') return false
    return String(handover.employee_id ?? '').trim() === currentUserId.value
  }

  // HR tạo đơn
  const canCreate = computed(() => isHR.value)

  // HR gửi đơn cho nhân viên ký (DRAFT → PENDING_EMPLOYEE_SIGN)
  const canSendToEmployee = (handover) => {
    return isHR.value && handover?.status === 'DRAFT'
  }

  // HR confirm đã nhận lại tài sản (PENDING_HR_CONFIRM → COMPLETED)
  const canHRConfirm = (handover) => {
    return isHR.value && handover?.status === 'PENDING_HR_CONFIRM'
  }

  // HR reject ở bất kỳ bước nào
  const canHRReject = (handover) => {
    return isHR.value && !['COMPLETED', 'REJECTED'].includes(handover?.status)
  }

  // Xem tất cả đơn
  const canViewAll = computed(() => isHR.value)

  return {
    isHR,
    isHRStaff,
    isHRManagerOrDirector,
    currentUserId,
    canCreate,
    canSendToEmployee,
    canEmployeeSign,
    canHRConfirm,
    canHRReject,
    canViewAll,
    fetchProfile,
  }
}
