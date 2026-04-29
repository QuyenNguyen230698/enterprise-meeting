/**
 * Sanitize HTML to remove dangerous scripts and attributes
 * Safe for email templates
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return ''
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers (onclick, onload, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: protocol in links
  sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"')
  sanitized = sanitized.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""')
  
  // Remove data: protocol (can contain base64 encoded scripts)
  sanitized = sanitized.replace(/href\s*=\s*["']?\s*data:/gi, 'href="#"')
  
  // Remove <iframe>, <embed>, <object> tags (potential XSS vectors)
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
  
  // Remove <form> tags (not needed in emails)
  sanitized = sanitized.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
  
  // Remove <meta> refresh redirects
  sanitized = sanitized.replace(/<meta\b[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, '')
  
  // Remove <base> tags (can change all relative URLs)
  sanitized = sanitized.replace(/<base\b[^>]*>/gi, '')
  
  // Remove <link> tags with javascript
  sanitized = sanitized.replace(/<link\b[^>]*javascript[^>]*>/gi, '')
  
  // Remove style attributes with javascript
  sanitized = sanitized.replace(/style\s*=\s*["'][^"']*javascript[^"']*["']/gi, '')
  
  // Remove expression() in CSS (IE specific XSS)
  sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, '')
  
  return sanitized.trim()
}

/**
 * Escape HTML to prevent XSS when displaying user content
 */
export function escapeHtml(text) {
  if (!text || typeof text !== 'string') return ''
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, m => map[m])
}

/**
 * Validate HTML structure (basic check)
 */
export function isValidHtml(html) {
  if (!html || typeof html !== 'string') return false
  
  try {
    // Very lenient validation - mostly for security, not structure
    const trimmed = html.trim()
    
    // Empty or whitespace-only is valid
    if (!trimmed) return true
    
    // Check if it looks like HTML (has tags)
    const hasTags = /<[^>]+>/.test(trimmed)
    if (!hasTags) return true // Plain text is valid
    
    // Very relaxed tag balance check - only catch major issues
    const openTags = (trimmed.match(/<[^/][^>]*>/g) || []).length
    const closeTags = (trimmed.match(/<\/[^>]+>/g) || []).length
    const selfClosing = (trimmed.match(/<[^>]+\/>/g) || []).length
    
    // Allow significant flexibility for complex email HTML
    const difference = Math.abs((openTags - selfClosing) - closeTags)
    return difference <= 10 // Much more lenient tolerance
    
  } catch (error) {
    return false
  }
}

/**
 * Get safe HTML for email templates
 * Combines sanitization with validation
 */
export function getSafeHtml(html, options = {}) {
  const {
    allowedTags = ['p', 'div', 'span', 'a', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 'br', 'hr'],
    maxLength = 50000 // Limit HTML size
  } = options
  
  if (!html) return ''
  
  // Limit length
  if (html.length > maxLength) {
    html = html.substring(0, maxLength)
  }
  
  // Sanitize
  let safe = sanitizeHtml(html)
  
  // Additional validation
  if (!isValidHtml(safe)) {
    console.warn('HTML structure may be invalid')
  }
  
  return safe
}
