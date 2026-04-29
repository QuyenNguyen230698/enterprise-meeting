/**
 * Composable for managing editor panel states
 * Handles responsive behavior for left/right panels
 */
export const useEditorPanels = () => {
  // Window width for responsive behavior
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)

  // Computed responsive breakpoints
  const isMobile = computed(() => windowWidth.value < 768)
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)
  const isDesktop = computed(() => windowWidth.value >= 1024)

  // Panel states
  const leftPanelCollapsed = ref(false)
  const rightPanelCollapsed = ref(false)
  const showLeftPanel = ref(false) // For mobile drawer - start closed
  const showRightPanel = ref(false) // For mobile drawer

  /**
   * Handle window resize
   */
  const handleResize = () => {
    windowWidth.value = window.innerWidth

    // Auto-open panels on desktop
    if (isDesktop.value) {
      showLeftPanel.value = true
      showRightPanel.value = false
    }

    // Auto-close mobile drawers on resize to desktop
    if (!isMobile.value) {
      showLeftPanel.value = true
      showRightPanel.value = false
    }
  }

  /**
   * Toggle left panel (collapse on desktop, drawer on mobile)
   */
  const toggleLeftPanel = () => {
    if (isMobile.value) {
      showLeftPanel.value = !showLeftPanel.value
      if (showLeftPanel.value) {
        showRightPanel.value = false
      }
    } else {
      leftPanelCollapsed.value = !leftPanelCollapsed.value
    }
  }

  /**
   * Toggle right panel (collapse on desktop, drawer on mobile)
   */
  const toggleRightPanel = () => {
    if (isMobile.value) {
      showRightPanel.value = !showRightPanel.value
      if (showRightPanel.value) {
        showLeftPanel.value = false
      }
    } else {
      rightPanelCollapsed.value = !rightPanelCollapsed.value
    }
  }

  /**
   * Close all panels (for mobile)
   */
  const closeAllPanels = () => {
    showLeftPanel.value = false
    showRightPanel.value = false
  }

  /**
   * Open right panel and optionally close left (for element selection on mobile)
   */
  const openRightPanelForSelection = () => {
    if (isMobile.value && !showRightPanel.value) {
      showRightPanel.value = true
      if (showLeftPanel.value) {
        showLeftPanel.value = false
      }
    }
  }

  // Setup resize listener
  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      handleResize() // Initial call
    }
  })

  // Cleanup
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
  })

  return {
    // State
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    leftPanelCollapsed,
    rightPanelCollapsed,
    showLeftPanel,
    showRightPanel,
    // Methods
    handleResize,
    toggleLeftPanel,
    toggleRightPanel,
    closeAllPanels,
    openRightPanelForSelection
  }
}
