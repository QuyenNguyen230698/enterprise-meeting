// Cache profile toàn cục — chỉ fetch 1 lần per session
const _profileData = ref(null)
const _profileLoading = ref(false)
const _profileFetched = ref(false)

export const useUserProfile = () => {
  const auth = useAuthStore()

  const fetchProfile = async () => {
    if (_profileFetched.value || _profileLoading.value) return
    _profileLoading.value = true
    try {
      const res = await useFetchAuth('/v1/profile')
      _profileData.value = res?.data ?? res ?? null
    } catch (_) {
      _profileData.value = null
    } finally {
      _profileLoading.value = false
      _profileFetched.value = true
    }
  }

  // dept_code: ưu tiên profile API, fallback auth.user
  const profileDeptCode = computed(() =>
    String(
      _profileData.value?.dept_code ??
      _profileData.value?.deptCode ??
      auth.user?.dept_code ??
      auth.user?.deptCode ??
      ''
    ).toUpperCase()
  )

  const profileDepartment = computed(() =>
    String(
      _profileData.value?.department ??
      _profileData.value?.dept ??
      auth.user?.department ??
      auth.user?.dept ??
      ''
    ).toUpperCase()
  )

  const profileTitle = computed(() =>
    String(
      _profileData.value?.title ??
      auth.user?.title ??
      ''
    ).toUpperCase()
  )

  return {
    profileData: _profileData,
    profileLoading: _profileLoading,
    fetchProfile,
    profileDeptCode,
    profileDepartment,
    profileTitle,
  }
}
