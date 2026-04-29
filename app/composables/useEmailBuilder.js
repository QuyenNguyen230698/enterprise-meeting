

export const useEmailBuilder = () => {
  const elements = ref([])
  const selectedElement = ref(null)
  const history = ref([JSON.stringify([])])  // Initialize with empty state
  const historyIndex = ref(0)  // Start at 0 instead of -1

  // Add element
  const addElement = (elementType, position = -1) => {
    const newElement = {
      id: Date.now() + Math.random(),
      type: elementType,
      props: getDefaultProps(elementType),
      style: getDefaultStyle(elementType)
    }

    if (position === -1) {
      elements.value.push(newElement)
    } else {
      elements.value.splice(position, 0, newElement)
    }

    saveToHistory()
    return newElement
  }

  // Update element
  const updateElement = (elementId, updates) => {
    const index = elements.value.findIndex(el => el.id === elementId)
    if (index !== -1) {
      elements.value[index] = { ...elements.value[index], ...updates }
      saveToHistory()
    }
  }

  // Delete element
  const deleteElement = (elementId) => {
    const index = elements.value.findIndex(el => el.id === elementId)
    if (index !== -1) {
      elements.value.splice(index, 1)
      if (selectedElement.value?.id === elementId) {
        selectedElement.value = null
      }
      saveToHistory()
    }
  }

  // Move element
  const moveElement = (fromIndex, toIndex) => {
    const element = elements.value.splice(fromIndex, 1)[0]
    elements.value.splice(toIndex, 0, element)
    saveToHistory()
  }

  // Duplicate element
  const duplicateElement = (elementId) => {
    const element = elements.value.find(el => el.id === elementId)
    if (element) {
      const duplicated = {
        ...JSON.parse(JSON.stringify(element)),
        id: Date.now() + Math.random()
      }
      const index = elements.value.findIndex(el => el.id === elementId)
      elements.value.splice(index + 1, 0, duplicated)
      saveToHistory()
      return duplicated
    }
  }

  // Clear all elements
  const clearElements = () => {
    elements.value = []
    selectedElement.value = null
    saveToHistory()
  }

  // Load template
  const loadTemplate = (template) => {
    elements.value = template.elements.map(el => ({
      ...el,
      id: Date.now() + Math.random() + Math.random()
    }))
    selectedElement.value = null
    saveToHistory()
  }

  // History management
  const saveToHistory = () => {
    const state = JSON.stringify(elements.value)
    
    // Remove future history if we're not at the end
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }
    
    history.value.push(state)
    historyIndex.value = history.value.length - 1
    
    // Limit history to 50 states
    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
  }

  // Undo
  const undo = () => {
    if (canUndo.value) {
      historyIndex.value--
      elements.value = JSON.parse(history.value[historyIndex.value])
      selectedElement.value = null
    }
  }

  // Redo
  const redo = () => {
    if (canRedo.value) {
      historyIndex.value++
      elements.value = JSON.parse(history.value[historyIndex.value])
      selectedElement.value = null
    }
  }

  // Computed properties
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // Export email as HTML
  const exportAsHtml = () => {
    return generateEmailHtml(elements.value)
  }

  // Export email as JSON
  const exportAsJson = () => {
    return {
      version: '1.0',
      elements: elements.value,
      metadata: {
        createdAt: new Date().toISOString(),
        elementCount: elements.value.length
      }
    }
  }

  // Import from JSON
  const importFromJson = (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
      if (data.elements && Array.isArray(data.elements)) {
        elements.value = data.elements.map(el => ({
          ...el,
          id: Date.now() + Math.random() + Math.random()
        }))
        selectedElement.value = null
        saveToHistory()
        return true
      }
    } catch (error) {
      console.error('Import failed:', error)
    }
    return false
  }

  return {
    elements,
    selectedElement,
    addElement,
    updateElement,
    deleteElement,
    moveElement,
    duplicateElement,
    clearElements,
    loadTemplate,
    undo,
    redo,
    canUndo,
    canRedo,
    exportAsHtml,
    exportAsJson,
    importFromJson
  }
}

// Helper functions
const getDefaultProps = (type) => {
  const defaults = {
    heading1: { as: 'h1', children: 'Your Heading 1' },
    heading2: { as: 'h2', children: 'Your Heading 2' },
    heading3: { as: 'h3', children: 'Your Heading 3' },
    text: { children: 'Your text content goes here...' },
    button: { href: 'javascript:void(0)', children: 'Click Me' },
    image: { src: 'https://via.placeholder.com/300x200', alt: 'Image', width: '300px', height: '200px' },
    divider: {},
    spacer: { height: '20px' },
    container: { children: '' },
    columns2: { children: '' },
    columns3: { children: '' },
    columns4: { children: '' },
    link: { href: '#', children: 'Link Text' },
    'social-facebook': { href: 'https://facebook.com', children: 'Facebook' },
    'social-twitter': { href: 'https://twitter.com', children: 'Twitter' },
    'social-instagram': { href: 'https://instagram.com', children: 'Instagram' },
    'social-linkedin': { href: 'https://linkedin.com', children: 'LinkedIn' },
    'social-youtube': { href: 'https://youtube.com', children: 'YouTube' },
    'social-tiktok': { href: 'https://tiktok.com', children: 'TikTok' }
  }
  return defaults[type] || {}
}

const getDefaultStyle = (type) => {
  const defaults = {
    heading1: { fontSize: '32px', color: '#1f2937', textAlign: 'left', margin: '20px 0', fontWeight: 'bold' },
    heading2: { fontSize: '24px', color: '#1f2937', textAlign: 'left', margin: '16px 0', fontWeight: 'bold' },
    heading3: { fontSize: '20px', color: '#1f2937', textAlign: 'left', margin: '12px 0', fontWeight: 'bold' },
    text: { fontSize: '16px', color: '#374151', lineHeight: '1.6', margin: '12px 0' },
    button: { 
      backgroundColor: '#3b82f6', 
      color: '#ffffff', 
      padding: '12px 24px',
      borderRadius: '6px',
      textDecoration: 'none',
      display: 'inline-block',
      margin: '12px 0',
      fontSize: '16px'
    },
    image: { borderRadius: '8px', margin: '12px 0' },
    divider: { margin: '20px 0', borderColor: '#e5e7eb' },
    spacer: { height: '20px' },
    link: { color: '#3b82f6', textDecoration: 'underline', fontSize: '16px' },
    'social-facebook': { color: '#1877f2', fontSize: '16px', textDecoration: 'none', margin: '8px' },
    'social-twitter': { color: '#1da1f2', fontSize: '16px', textDecoration: 'none', margin: '8px' },
    'social-instagram': { color: '#e4405f', fontSize: '16px', textDecoration: 'none', margin: '8px' },
    'social-linkedin': { color: '#0077b5', fontSize: '16px', textDecoration: 'none', margin: '8px' },
    'social-youtube': { color: '#ff0000', fontSize: '16px', textDecoration: 'none', margin: '8px' },
    'social-tiktok': { color: '#000000', fontSize: '16px', textDecoration: 'none', margin: '8px' }
  }
  return defaults[type] || {}
}

const generateEmailHtml = (elements) => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .content { padding: 0px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
`

  elements.forEach(element => {
    html += generateElementHtml(element)
  })

  html += `
    </div>
  </div>
</body>
</html>`

  return html
}

const generateElementHtml = (element) => {
  const { type, props, style } = element
  const styleStr = Object.entries(style || {})
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ')

  switch (type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
      const tag = props.as || type.replace('heading', 'h')
      return `        <${tag} style="${styleStr}">${props.children}</${tag}>\n`
    
    case 'text':
      return `        <p style="${styleStr}">${props.children}</p>\n`
    
    case 'button':
      return `        <div style="text-align: ${style.textAlign || 'left'}; margin: ${style.margin || '12px 0'};">
          <a href="${props.href}" style="${styleStr}" onclick="return false;">${props.children}</a>
        </div>\n`
    
    case 'image':
      const width = props.width?.toString().includes('px') || props.width?.toString().includes('%') ? props.width : `${props.width}px`
      const height = props.height?.toString().includes('px') || props.height?.toString().includes('%') ? props.height : `${props.height}px`
      return `        <div style="text-align: center; margin: ${style.margin || '12px 0'};">
          <img src="${props.src}" alt="${props.alt}" style="width: ${width}; height: ${height}; ${styleStr}" />
        </div>\n`
    
    case 'divider':
      return `        <hr style="${styleStr}" />\n`
    
    case 'spacer':
      return `        <div style="height: ${style.height || '20px'};"></div>\n`
    
    case 'link':
      return `        <a target="_blank" href="${props.href}" style="${styleStr}">${props.children}</a>\n`
    
    case 'columns2':
      return `        <table style="width: 100%; ${styleStr}">
          <tr>
            <td style="width: 50%; padding: 10px; vertical-align: top;"></td>
            <td style="width: 50%; padding: 10px; vertical-align: top;"></td>
          </tr>
        </table>\n`
    
    case 'columns3':
      return `        <table style="width: 100%; ${styleStr}">
          <tr>
            <td style="width: 33.33%; padding: 10px; vertical-align: top;"></td>
            <td style="width: 33.33%; padding: 10px; vertical-align: top;"></td>
            <td style="width: 33.33%; padding: 10px; vertical-align: top;"></td>
          </tr>
        </table>\n`
    
    case 'columns4':
      return `        <table style="width: 100%; ${styleStr}">
          <tr>
            <td style="width: 25%; padding: 10px; vertical-align: top;"></td>
            <td style="width: 25%; padding: 10px; vertical-align: top;"></td>
            <td style="width: 25%; padding: 10px; vertical-align: top;"></td>
            <td style="width: 25%; padding: 10px; vertical-align: top;"></td>
          </tr>
        </table>\n`
    
    case 'social-facebook':
    case 'social-twitter':
    case 'social-instagram':
    case 'social-linkedin':
    case 'social-youtube':
    case 'social-tiktok':
      return `        <a target="_blank" href="${props.href}" style="${styleStr}" target="_blank">${props.children}</a>\n`
    
    default:
      return `        <div style="${styleStr}">${props.children || ''}</div>\n`
  }
}

const camelToKebab = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}
