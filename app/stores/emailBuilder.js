/**
 * Pinia Store for Email Builder
 * Centralized state management for email editor
 */
import { defineStore } from 'pinia'
import { getDefaultProps, getDefaultStyle, restrictedContainerElements } from '~/utils/emailElementDefaults.js'

export const useEmailBuilderStore = defineStore('emailBuilder', () => {
  // ==================== STATE ====================
  const elements = ref([])
  const selectedElement = ref(null)
  const selectedElementId = ref(null)
  const undoStack = ref([])
  const redoStack = ref([])
  const maxHistorySize = 50

  const globalSettings = ref({
    backgroundColor: '#f3f4f6',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    linkColor: '#3b82f6',
    headingColor: '#1f2937',
    textColor: '#374151'
  })

  // Current template info
  const currentTemplateId = ref(null)
  const currentTemplateName = ref('')
  const isDirty = ref(false)

  // ==================== GETTERS ====================
  const hasElements = computed(() => elements.value.length > 0)
  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)
  const elementCount = computed(() => elements.value.length)

  const getElementById = computed(() => (id) => {
    return findElementRecursive(elements.value, id)
  })

  // ==================== HELPER FUNCTIONS ====================
  function findElementRecursive(elementList, id) {
    for (const el of elementList) {
      if (el.id === id) return el
      // Check nested elements in columns/rows
      if (el.props?.children && Array.isArray(el.props.children)) {
        for (const child of el.props.children) {
          if (Array.isArray(child)) {
            const found = findElementRecursive(child, id)
            if (found) return found
          }
        }
      }
    }
    return null
  }

  function generateId() {
    return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function saveToHistory() {
    // Save current state to undo stack
    const currentState = JSON.parse(JSON.stringify(elements.value))
    undoStack.value.push(currentState)

    // Limit history size
    if (undoStack.value.length > maxHistorySize) {
      undoStack.value.shift()
    }

    // Clear redo stack on new action
    redoStack.value = []
    isDirty.value = true
  }

  // ==================== ACTIONS ====================

  /**
   * Add a new element to the canvas
   */
  function addElement(type, customProps = {}, customStyle = {}) {
    saveToHistory()

    const defaultProps = getDefaultProps(type)
    const defaultStyle = getDefaultStyle(type)

    const newElement = {
      id: generateId(),
      type,
      props: { ...defaultProps, ...customProps },
      style: { ...defaultStyle, ...customStyle }
    }

    // Initialize children array for layout elements
    if (['columns2', 'columns3', 'columns4'].includes(type)) {
      const columnCount = parseInt(type.replace('columns', ''))
      newElement.props.children = Array(columnCount).fill(null).map(() => [])
    } else if (['row2', 'row3', 'row4'].includes(type)) {
      const rowCount = parseInt(type.replace('row', ''))
      newElement.props.children = Array(rowCount).fill(null).map(() => [])
    }

    elements.value.push(newElement)
    selectElement(newElement)

    return newElement
  }

  /**
   * Add element to a nested container (column/row)
   */
  function addElementToNested(parentId, containerIndex, elementType) {
    // Check if element is restricted
    if (restrictedContainerElements.includes(elementType)) {
      return { success: false, message: 'Element này không thể đặt trong Row/Column' }
    }

    saveToHistory()

    const parent = getElementById.value(parentId)
    if (!parent) return { success: false, message: 'Parent không tồn tại' }

    const defaultProps = getDefaultProps(elementType)
    const defaultStyle = getDefaultStyle(elementType)

    const newElement = {
      id: generateId(),
      type: elementType,
      props: { ...defaultProps },
      style: { ...defaultStyle }
    }

    // Ensure children array exists
    if (!parent.props.children) {
      parent.props.children = []
    }
    if (!parent.props.children[containerIndex]) {
      parent.props.children[containerIndex] = []
    }

    parent.props.children[containerIndex].push(newElement)
    selectElement(newElement)

    return { success: true, element: newElement }
  }

  /**
   * Update an element's properties or styles
   */
  function updateElement(id, updates) {
    saveToHistory()

    const element = getElementById.value(id)
    if (!element) return false

    if (updates.props) {
      element.props = { ...element.props, ...updates.props }
    }
    if (updates.style) {
      element.style = { ...element.style, ...updates.style }
    }

    // Update selected element reference if it's the same
    if (selectedElement.value?.id === id) {
      selectedElement.value = element
    }

    return true
  }

  /**
   * Delete an element by ID
   */
  function deleteElement(id) {
    saveToHistory()

    // Try to delete from root level
    const rootIndex = elements.value.findIndex(el => el.id === id)
    if (rootIndex !== -1) {
      elements.value.splice(rootIndex, 1)
      if (selectedElement.value?.id === id) {
        clearSelection()
      }
      return true
    }

    // Try to delete from nested containers
    return deleteElementRecursive(elements.value, id)
  }

  function deleteElementRecursive(elementList, id) {
    for (const el of elementList) {
      if (el.props?.children && Array.isArray(el.props.children)) {
        for (let i = 0; i < el.props.children.length; i++) {
          if (Array.isArray(el.props.children[i])) {
            const childIndex = el.props.children[i].findIndex(child => child.id === id)
            if (childIndex !== -1) {
              el.props.children[i].splice(childIndex, 1)
              if (selectedElement.value?.id === id) {
                clearSelection()
              }
              return true
            }
            // Recursively check nested elements
            if (deleteElementRecursive(el.props.children[i], id)) {
              return true
            }
          }
        }
      }
    }
    return false
  }

  /**
   * Move element up in the list
   */
  function moveElementUp(index) {
    if (index <= 0 || index >= elements.value.length) return false
    saveToHistory()

    const temp = elements.value[index]
    elements.value[index] = elements.value[index - 1]
    elements.value[index - 1] = temp
    return true
  }

  /**
   * Move element down in the list
   */
  function moveElementDown(index) {
    if (index < 0 || index >= elements.value.length - 1) return false
    saveToHistory()

    const temp = elements.value[index]
    elements.value[index] = elements.value[index + 1]
    elements.value[index + 1] = temp
    return true
  }

  /**
   * Select an element
   */
  function selectElement(element) {
    selectedElement.value = element
    selectedElementId.value = element?.id || null
  }

  /**
   * Clear selection
   */
  function clearSelection() {
    selectedElement.value = null
    selectedElementId.value = null
  }

  /**
   * Undo last action
   */
  function undo() {
    if (undoStack.value.length === 0) return false

    // Save current state to redo stack
    const currentState = JSON.parse(JSON.stringify(elements.value))
    redoStack.value.push(currentState)

    // Restore previous state
    const previousState = undoStack.value.pop()
    elements.value = previousState

    // Update selection if element no longer exists
    if (selectedElement.value && !getElementById.value(selectedElement.value.id)) {
      clearSelection()
    }

    return true
  }

  /**
   * Redo last undone action
   */
  function redo() {
    if (redoStack.value.length === 0) return false

    // Save current state to undo stack
    const currentState = JSON.parse(JSON.stringify(elements.value))
    undoStack.value.push(currentState)

    // Restore next state
    const nextState = redoStack.value.pop()
    elements.value = nextState

    return true
  }

  /**
   * Clear all elements
   */
  function clearElements() {
    saveToHistory()
    elements.value = []
    clearSelection()
  }

  /**
   * Load template data
   */
  function loadTemplate(templateData) {
    saveToHistory()

    if (templateData.elements) {
      elements.value = JSON.parse(JSON.stringify(templateData.elements))
    }
    if (templateData.globalSettings) {
      globalSettings.value = { ...globalSettings.value, ...templateData.globalSettings }
    }
    if (templateData.id) {
      currentTemplateId.value = templateData.id
    }
    if (templateData.name) {
      currentTemplateName.value = templateData.name
    }

    isDirty.value = false
    clearSelection()
  }

  /**
   * Get template data for saving
   */
  function getTemplateData() {
    return {
      elements: JSON.parse(JSON.stringify(elements.value)),
      globalSettings: { ...globalSettings.value }
    }
  }

  /**
   * Update global settings
   */
  function updateGlobalSettings(updates) {
    globalSettings.value = { ...globalSettings.value, ...updates }
    isDirty.value = true
  }

  /**
   * Reset store to initial state
   */
  function $reset() {
    elements.value = []
    selectedElement.value = null
    selectedElementId.value = null
    undoStack.value = []
    redoStack.value = []
    currentTemplateId.value = null
    currentTemplateName.value = ''
    isDirty.value = false
    globalSettings.value = {
      backgroundColor: '#f3f4f6',
      contentWidth: 600,
      fontFamily: 'Arial, sans-serif',
      linkColor: '#3b82f6',
      headingColor: '#1f2937',
      textColor: '#374151'
    }
  }

  /**
   * Duplicate an element
   */
  function duplicateElement(id) {
    saveToHistory()

    const element = getElementById.value(id)
    if (!element) return null

    const duplicated = JSON.parse(JSON.stringify(element))
    duplicated.id = generateId()

    // Recursively update IDs for nested children
    updateNestedIds(duplicated)

    // Find position and insert after original
    const index = elements.value.findIndex(el => el.id === id)
    if (index !== -1) {
      elements.value.splice(index + 1, 0, duplicated)
    } else {
      elements.value.push(duplicated)
    }

    selectElement(duplicated)
    return duplicated
  }

  function updateNestedIds(element) {
    if (element.props?.children && Array.isArray(element.props.children)) {
      for (const container of element.props.children) {
        if (Array.isArray(container)) {
          for (const child of container) {
            child.id = generateId()
            updateNestedIds(child)
          }
        }
      }
    }
  }

  return {
    // State
    elements,
    selectedElement,
    selectedElementId,
    globalSettings,
    currentTemplateId,
    currentTemplateName,
    isDirty,
    undoStack,
    redoStack,

    // Getters
    hasElements,
    canUndo,
    canRedo,
    elementCount,
    getElementById,

    // Actions
    addElement,
    addElementToNested,
    updateElement,
    deleteElement,
    moveElementUp,
    moveElementDown,
    selectElement,
    clearSelection,
    undo,
    redo,
    clearElements,
    loadTemplate,
    getTemplateData,
    updateGlobalSettings,
    duplicateElement,
    $reset
  }
})
