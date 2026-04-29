import { ref } from 'vue'

const isVisible = ref(false)
const confirmData = ref({})
const resolvePromise = ref(null)

export const useConfirm = () => {
  const show = (options = {}) => {
    return new Promise((resolve) => {
      confirmData.value = {
        title: options.title || 'Xác nhận',
        subtitle: options.subtitle || '',
        message: options.message || 'Bạn có chắc chắn muốn thực hiện hành động này?',
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy',
        type: options.type || 'warning',
        loading: false,
        loadingText: options.loadingText || 'Đang xử lý...'
      }
      
      resolvePromise.value = resolve
      isVisible.value = true
    })
  }

  const confirm = () => {
    if (resolvePromise.value) {
      resolvePromise.value(true)
      resolvePromise.value = null
    }
    isVisible.value = false
  }

  const cancel = () => {
    if (resolvePromise.value) {
      resolvePromise.value(false)
      resolvePromise.value = null
    }
    isVisible.value = false
  }

  const setLoading = (loading, loadingText) => {
    confirmData.value.loading = loading
    if (loadingText) {
      confirmData.value.loadingText = loadingText
    }
  }

  // Predefined confirm types
  const confirmDelete = (itemName = 'mục này') => {
    return show({
      title: 'Xóa ' + itemName,
      subtitle: 'Hành động này không thể hoàn tác',
      message: `Bạn có chắc chắn muốn xóa ${itemName}? Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn.`,
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      type: 'danger'
    })
  }

  const confirmSave = (itemName = 'thay đổi') => {
    return show({
      title: 'Lưu ' + itemName,
      message: `Bạn có muốn lưu ${itemName} không?`,
      confirmText: 'Lưu',
      cancelText: 'Hủy',
      type: 'success'
    })
  }

  const confirmLeave = () => {
    return show({
      title: 'Rời khỏi trang',
      subtitle: 'Các thay đổi chưa lưu sẽ bị mất',
      message: 'Bạn có những thay đổi chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang này không?',
      confirmText: 'Rời khỏi',
      cancelText: 'Ở lại',
      type: 'warning'
    })
  }

  const confirmResend = (campaignName, resendNum, totalRecipients) => {
    return show({
      title: 'Gửi lại Campaign',
      subtitle: `Lần gửi thứ ${resendNum + 1}`,
      message: `Bạn có chắc muốn gửi lại "${campaignName}" ?`,
      confirmText: 'Gửi lại',
      cancelText: 'Hủy',
      type: 'warning'
    })
  }

  const confirmAction = (title, message, options = {}) => {
    return show({
      title,
      message,
      confirmText: options.confirmText || 'Xác nhận',
      cancelText: options.cancelText || 'Hủy',
      type: options.type || 'info',
      subtitle: options.subtitle || ''
    })
  }

  return {
    // State
    isVisible,
    confirmData,
    
    // Methods
    show,
    confirm,
    cancel,
    setLoading,
    
    // Predefined
    confirmDelete,
    confirmSave,
    confirmLeave,
    confirmResend,
    confirmAction
  }
}
