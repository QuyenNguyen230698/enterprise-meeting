// Permission map: offboarding role → allowed action codes
const ROLE_PERMISSIONS = {
  GM: [
    'view_own', 'view_dept', 'view_all', 'view_reports', 'view_internal_notes', 'view_raw_db',
    'action_step5_approve',
    'action_step6_ho1', 'action_step6_ho2', 'action_step6_ho3',
    'action_step7_complete',
    'action_step7_block',
    'override_return_step6',
    'override_early_exit',
  ],
  ADMIN: [
    'view_own', 'view_dept', 'view_all', 'view_reports', 'view_internal_notes', 'view_raw_db',
    'action_step2_approve',
    'action_step3_process',
    'action_step4_approve',
    'action_step6_ho1', 'action_step6_ho2', 'action_step6_ho3',
    'override_early_exit',
  ],
  EMPLOYEE: [
    'view_own',
    'action_step1_submit',
    'action_step6_employee',
  ],
  UNKNOWN: [],
}

const ROLE_LABEL = {
  GM:           'Tổng Giám Đốc',
  ADMIN:        'Quản Trị Viên',
  EMPLOYEE:     'Nhân Viên',
  UNKNOWN:      'Không xác định',
}

export const useOffboardingRole = () => {
  const auth = useAuthStore()

  const resolveRole = () => {
    const user = auth.user
    if (!user) return 'UNKNOWN'
    const roleId = String(user?.role_id ?? '')

    if (auth.isSuperAdmin || roleId === '2000000001') return 'GM'
    if (auth.isMember || roleId === '2000000003') return 'EMPLOYEE'

    if (auth.isAdmin || roleId === '2000000002') return 'ADMIN'

    return 'UNKNOWN'
  }

  const offboardingRole = computed(resolveRole)

  const can = (action) => {
    return ROLE_PERMISSIONS[offboardingRole.value]?.includes(action) ?? false
  }

  const canAccessEmployeeProcess = (employeeDept) => {
    const role = offboardingRole.value
    const user = auth.user
    if (!user) return false
    if (['GM', 'ADMIN'].includes(role)) return true
    return false
  }

  const roleLabel = computed(() => ROLE_LABEL[offboardingRole.value] ?? 'Không xác định')

  return { offboardingRole, roleLabel, can, canAccessEmployeeProcess }
}
