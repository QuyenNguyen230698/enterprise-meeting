<template>
  <div 
    
    :style="{
      // Background-image has priority over background-color
      backgroundColor: globalSettings?.backgroundImage ? 'transparent' : (globalSettings?.backgroundColor || '#ffffff'),
      backgroundImage: globalSettings?.backgroundImage ? `url(${globalSettings.backgroundImage})` : 'none',
      backgroundSize: globalSettings?.backgroundSize || 'cover',
      backgroundPosition: globalSettings?.backgroundPosition || 'center',
      backgroundRepeat: globalSettings?.backgroundRepeat || 'no-repeat',
      padding: '0',
      fontFamily: globalSettings?.fontFamily || 'Arial, sans-serif',
      fontSize: globalSettings?.fontSize || '16px',
      lineHeight: globalSettings?.lineHeight || '1.5',
      color: globalSettings?.textColor || '#000000'
    }"
  >
    <div 
       class="flex justify-center"
      :style="{
        maxWidth: '100%',
        width: '100%',
        margin: globalSettings?.textAlign === 'center' ? '0 auto' : 
                globalSettings?.textAlign === 'right' ? '0 0 0 auto' : '0',
        padding: globalSettings?.padding || '0',
        textAlign: globalSettings?.textAlign || 'left'
      }"
    >
      <EContainer>
        <EColumn>
          <template v-for="element in elements" :key="element.id">
            <!-- Column Layout (columns2, columns3, columns4) -->
            <div v-if="isColumnElement(element.type)" :style="element.style" class="column-layout">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <tr>
                    <td v-for="(col, colIndex) in element.children" :key="colIndex" :style="{ verticalAlign: 'top', width: getColumnWidth(element.type) }">
                    <template v-if="col && col.length > 0">
                      <template v-for="child in col" :key="child.id">
                        <!-- Nested Row in Column -->
                        <div v-if="isRowElement(child.type)" :style="child.style" class="nested-row-layout">
                          <template v-if="child.children && child.children.length > 0">
                            <div v-for="(row, rowIdx) in child.children" :key="rowIdx" :style="{ marginBottom: rowIdx < child.children.length - 1 ? '0px' : '0' }">
                              <template v-if="row && row.length > 0">
                                <template v-for="item in row" :key="item.id">
                                  <!-- HTML Element -->
                                  <div
                                    v-if="item.type === 'html'"
                                    :style="item.style"
                                    v-html="getSafeHtmlContent(item.props?.children)"
                                  ></div>
                                  <!-- Other Elements -->
                                  <component
                                    v-else
                                    :is="getElementComponent(item.type)"
                                    v-bind="getElementProps(item)"
                                    :style="item.style"
                                  >
                                    {{ item.props?.children }}
                                  </component>
                                </template>
                              </template>
                            </div>
                          </template>
                        </div>
                        <!-- HTML Element in Column -->
                        <div
                          v-else-if="child.type === 'html'"
                          :style="child.style"
                          v-html="getSafeHtmlContent(child.props?.children)"
                        ></div>
                        <!-- Regular element in Column -->
                        <component
                          v-else
                          :is="getElementComponent(child.type)"
                          v-bind="getElementProps(child)"
                          :style="child.style"
                        >
                          {{ child.props?.children }}
                        </component>
                      </template>
                    </template>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Row Layout (row2, row3, row4) -->
            <div v-else-if="isRowElement(element.type)" :style="element.style" class="row-layout">
              <template v-if="element.children && element.children.length > 0">
                <div v-for="(row, rowIndex) in element.children" :key="rowIndex" :style="{ marginBottom: rowIndex < element.children.length - 1 ? '0px' : '0' }">
                  <template v-if="row && row.length > 0">
                    <template v-for="child in row" :key="child.id">
                      <!-- Nested Column in Row -->
                      <div v-if="isColumnElement(child.type)" :style="child.style" class="nested-column-layout">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody>
                            <tr>
                              <td v-for="(col, colIdx) in child.children" :key="colIdx" :style="{ verticalAlign: 'top', width: getColumnWidth(child.type) }">
                              <template v-if="col && col.length > 0">
                                <template v-for="item in col" :key="item.id">
                                  <!-- HTML Element -->
                                  <div
                                    v-if="item.type === 'html'"
                                    :style="item.style"
                                    v-html="getSafeHtmlContent(item.props?.children)"
                                  ></div>
                                  <!-- Other Elements -->
                                  <component
                                    v-else
                                    :is="getElementComponent(item.type)"
                                    v-bind="getElementProps(item)"
                                    :style="item.style"
                                  >
                                    {{ item.props?.children }}
                                  </component>
                                </template>
                              </template>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <!-- HTML Element in Row -->
                      <div
                        v-else-if="child.type === 'html'"
                        :style="child.style"
                        v-html="getSafeHtmlContent(child.props?.children)"
                      ></div>
                      <!-- Regular element in Row -->
                      <component
                        v-else
                        :is="getElementComponent(child.type)"
                        v-bind="getElementProps(child)"
                        :style="child.style"
                      >
                        {{ child.props?.children }}
                      </component>
                    </template>
                  </template>
                </div>
              </template>
            </div>
            
            <!-- HTML Element with v-html -->
            <div
              v-else-if="element.type === 'html'"
              :style="element.style"
              v-html="getSafeHtmlContent(element.props?.children)"
            ></div>
            
            <!-- Custom Elements - render with full HTML -->
            <div
              v-else-if="isCustomElement(element.type)"
              :style="element.style"
              v-html="renderCustomElement(element)"
            ></div>
            
            <!-- Regular elements -->
            <component
              v-else
              :is="getElementComponent(element.type)"
              v-bind="getElementProps(element)"
              :style="element.style"
            >
              {{ element.props?.children }}
            </component>
          </template>
        </EColumn>
      </EContainer>
    </div>
  </div>
</template>

<script setup>
import { EContainer, EColumn, EHeading, EText, EButton, EImg, EHr } from 'vue-email'

defineProps({
  elements: {
    type: Array,
    required: true
  },
  globalSettings: {
    type: Object,
    default: () => ({})
  }
})

// Check if element is a column layout
const isColumnElement = (type) => {
  return ['columns2', 'columns3', 'columns4'].includes(type)
}

// Check if element is a row layout
const isRowElement = (type) => {
  return ['row2', 'row3', 'row4'].includes(type)
}

// Get column width percentage
const getColumnWidth = (type) => {
  const widths = {
    columns2: '50%',
    columns3: '33.33%',
    columns4: '25%'
  }
  return widths[type] || '100%'
}

// Get Vue Email component
const getElementComponent = (type) => {
  const components = {
    heading1: EHeading,
    heading2: EHeading,
    heading3: EHeading,
    text: EText,
    button: EButton,
    image: EImg,
    divider: EHr,
    container: EContainer,
    column: EColumn,
    spacer: 'div',
    link: 'a',
    video: 'video'
  }
  return components[type] || EText
}

// Get element props
const getElementProps = (element) => {
  const props = { ...element.props }
  
  // Handle headings
  if (element.type.startsWith('heading')) {
    props.as = element.type.replace('heading', 'h')
  }
  
  // Handle buttons
  if (element.type === 'button') {
    props.href = props.href || '#'
  }
  
  // Handle images - use backgroundImage if available
  if (element.type === 'image') {
    if (element.style?.backgroundImage) {
      props.src = element.style.backgroundImage
    }
  }
  
  return props
}

// Sanitize HTML content
const sanitizeHtml = (html) => {
  if (!html) return ''
  let safe = html.trim()
  safe = safe.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  safe = safe.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  safe = safe.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
  safe = safe.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"')
  safe = safe.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""')
  return safe
}

// Get safe HTML with CSS support
const getSafeHtmlContent = (html) => {
  if (!html) return ''
  
  const safeHtml = sanitizeHtml(html)
  
  // Check if has style tags already
  if (/<style/i.test(safeHtml)) {
    return safeHtml
  }
  
  // Check if has @media queries (needs wrapping)
  if (/@media/.test(safeHtml)) {
    const htmlTagsRegex = /<[a-z][^>]*>[\s\S]*?<\/[a-z][^>]*>/gi
    const htmlTags = safeHtml.match(htmlTagsRegex) || []
    
    if (htmlTags.length > 0) {
      let htmlContent = htmlTags.join('\n')
      let cssContent = safeHtml
      htmlTags.forEach(tag => {
        cssContent = cssContent.replace(tag, '')
      })
      cssContent = cssContent.trim()
      if (cssContent) {
        return `<style>\n${cssContent}\n</style>\n${htmlContent}`
      }
    } else {
      return `<style>\n${safeHtml}\n</style>`
    }
  }
  
  return safeHtml
}

// Check if element is custom element
const isCustomElement = (type) => {
  return [
    'footer', 'cta-block', 'testimonial', 'product-card', 'job-listing', 'benefits-list',
    // Banking elements
    'transaction-card', 'credit-card-info',
    // Gaming/Course elements
    'course-card', 'game-item-card', 'achievement-badge', 'progress-bar',
    // F&B/Hotel elements
    'menu-item', 'room-card', 'booking-summary', 'rating-review'
  ].includes(type)
}

// Helper function to determine if a color is light
function isLightColor(color) {
  // Default to dark if color is not provided
  if (!color) return false
  
  // Convert hex to RGB
  let r, g, b
  if (color.startsWith('#')) {
    const hex = color.substring(1)
    const bigint = parseInt(hex.length === 3 ? 
      hex.split('').map(c => c + c).join('') : hex, 16)
    r = (bigint >> 16) & 255
    g = (bigint >> 8) & 255
    b = bigint & 255
  } else if (color.startsWith('rgb')) {
    const rgb = color.match(/\d+/g)
    if (rgb && rgb.length >= 3) {
      r = parseInt(rgb[0])
      g = parseInt(rgb[1])
      b = parseInt(rgb[2])
    }
  } else {
    // For named colors or invalid formats, default to dark
    return false
  }
  
  // Calculate perceived brightness (0-1)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  // Consider colors with brightness > 180 as light
  return brightness > 180
}

// Render custom element as HTML
const renderCustomElement = (element) => {
  const props = element.props || {}
  const style = element.style || {}
  
  // Convert style object to string
  const styleStr = Object.entries(style).map(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    return `${cssKey}: ${value}`
  }).join('; ')
  
  // Generate unique ID for responsive styling
  const elementId = `custom-${element.id || Math.random().toString(36).substr(2, 9)}`
  
  switch (element.type) {
    case 'job-listing':
      // Provide default values for job listing
      const jobTitle = props.children || 'Job Position'
      const company = props.company || 'Company Name'
      const location = props.location || 'Location'
      const jobType = props.type || 'Full-time'
      const salary = props.salary || 'Negotiable'
      const deadline = props.deadline || 'Open until filled'
      const buttonText = props.buttonText || 'Apply Now'
      const buttonHref = props.href || '#'
      
      // Colors with fallbacks - ensure all colors have proper fallbacks
      const bgColor = props.bgColor || '#ffffff'
      const titleColor = props.titleColor || '#1f2937'
      const companyColor = props.companyColor || '#2563eb'
      const buttonBgColor = props.buttonBgColor || '#2563eb'
      // Ensure button text color is properly set, fallback to white or black based on button background
      const buttonTextColor = props.buttonTextColor || 
        (isLightColor(props.buttonBgColor) ? '#000000' : '#ffffff')
      
      // Typography props
      const fontFamily = props.fontFamily || 'Arial, sans-serif'
      const titleFontSize = props.titleFontSize || '18px'
      const titleFontWeight = props.titleFontWeight || 'bold'
      const titleFontStyle = props.titleFontStyle || 'normal'
      
      return `
        <div style="background-color: ${bgColor}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; font-family: ${fontFamily}; ${styleStr}">
          <div style="padding: 20px;">
            <h3 style="color: ${titleColor}; font-size: ${titleFontSize}; font-weight: ${titleFontWeight}; font-style: ${titleFontStyle}; margin: 0 0 4px 0; font-family: ${fontFamily};">${jobTitle}</h3>
            <p style="color: ${companyColor}; font-size: 16px; font-weight: 500; margin: 0 0 8px 0; font-family: ${fontFamily};">${company}</p>
            
            <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; font-size: 13px; color: #4b5563;">
              <span style="display: flex; align-items: center; gap: 4px;">
                <i class="bi bi-geo-alt" style="color: #6b7280;"></i>
                ${location}
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <i class="bi bi-briefcase" style="color: #6b7280;"></i>
                ${jobType}
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <i class="bi bi-cash" style="color: #6b7280;"></i>
                ${salary}
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <i class="bi bi-clock" style="color: #6b7280;"></i>
                ${deadline}
              </span>
            </div>
            
            <a href="${buttonHref}" 
               target="_blank"
               style="display: inline-block; 
                      background-color: ${buttonBgColor} !important; 
                      color: ${buttonTextColor} !important; 
                      text-decoration: none !important; 
                      font-weight: 500; 
                      padding: 8px 16px; 
                      border-radius: 4px; 
                      font-size: 14px; 
                      border: none !important;">
              ${buttonText}
            </a>
          </div>
        </div>
      `

    case 'footer':
      // Use default props if not provided
      const socials = props.socials || []
      const iconStyle = props.socialIconStyle || 'circle'
      const iconSize = props.socialIconSize || 'medium'
      const iconSizes = { small: '16px', medium: '20px', large: '24px' }
      const iconPadding = { small: '6px', medium: '8px', large: '10px' }
      const iconRadius = { square: '4px', rounded: '8px', circle: '50%' }
      
      // Provide default values for all footer props
      const footerLogo = props.logo || ''
      const footerCompanyName = props.companyName || ''
      const footerAddress = props.address || ''
      const footerPhone = props.phone || ''
      const footerEmail = props.email || ''
      const footerCopyright = props.children || '© 2024 Your Company. All rights reserved.'
      
      return `
        <style>
          .${elementId}-social {
            display: inline-block;
            margin: 0 4px;
            transition: opacity 0.2s;
          }
          .${elementId}-social:hover {
            opacity: 0.8;
          }
          .${elementId}-social-img {
            height: ${iconSizes[iconSize]};
            width: ${iconSizes[iconSize]};
            object-fit: contain;
            display: block;
          }
          @media only screen and (max-width: 600px) {
            .${elementId}-logo {
              height: 32px !important;
            }
            .${elementId}-social-img {
              height: 16px !important;
              width: 16px !important;
            }
          }
        </style>
        <div style="padding: 24px; background-color: #1f2937; color: #9ca3af; font-size: 14px; text-align: center; ${styleStr}">
          <div style="max-width: 1024px; margin: 0 auto;">
            ${footerLogo ? `<div style="margin-bottom: 16px;"><img class="${elementId}-logo" src="${footerLogo}" alt="Logo" style="height: 40px; object-fit: contain;" /></div>` : ''}
            ${footerCompanyName ? `<p style="color: white; font-weight: 600; margin: 0 0 8px 0; font-size: 14px;">${footerCompanyName}</p>` : ''}
            ${footerAddress ? `<p style="font-size: 12px; margin: 0 0 8px 0;">${footerAddress}</p>` : ''}
            ${footerPhone || footerEmail ? `<div style="margin: 0 0 16px 0; font-size: 12px;">
              ${footerPhone ? `<p style="margin: 0;">${footerPhone}</p>` : ''}
              ${footerEmail ? `<p style="margin: 0;">${footerEmail}</p>` : ''}
            </div>` : ''}
            ${socials.length > 0 ? `
              <div style="margin: 16px 0;">
                ${socials.filter(s => s.enabled !== false).map(social => `
                  <a href="${social.url}" target="_blank" class="${elementId}-social" style="text-decoration: none; background: ${social.logo ? 'white' : getSocialColor(social.platform)}; padding: ${iconPadding[iconSize]}; border-radius: ${iconRadius[iconStyle]};">
                    ${social.logo ? 
                      `<img src="${social.logo}" alt="${social.platform}" class="${elementId}-social-img" />` : 
                      `<span style="display: block; height: ${iconSizes[iconSize]}; width: ${iconSizes[iconSize]}; line-height: ${iconSizes[iconSize]}; color: white; font-size: 10px; font-weight: bold; text-transform: uppercase;">${social.platform.substring(0, 2)}</span>`
                    }
                  </a>
                `).join('')}
              </div>
            ` : ''}
            <p style="font-size: 12px; margin: 0;">${footerCopyright}</p>
          </div>
        </div>
      `
    
    case 'cta-block':
      return `
        <div style="padding: 24px; background: linear-gradient(to right, #eff6ff, #eef2ff); border: 1px solid #bfdbfe; border-radius: 8px; text-align: center; ${styleStr}">
          <h4 style="font-weight: bold; margin-bottom: 12px; color: #1f2937;">${props.children || 'Call to Action'}</h4>
          <a target="_blank" href="${props.href || '#'}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
            ${props.buttonText || 'Get Started'}
          </a>
        </div>
      `
    
    case 'testimonial':
      return `
        <div style="padding: 16px; background-color: #f9fafb; border-radius: 4px; ${styleStr}">
          <p style="color: #4b5563; font-style: italic; margin-bottom: 8px;">${props.children || 'Great product!'}</p>
          <p style="font-size: 14px; font-weight: 600; color: #1f2937;">— ${props.author || 'Customer Name'}</p>
          <div style="margin-top: 4px;">
            ${'★'.repeat(props.rating || 5).split('').map(() => '<span style="color: #fbbf24; font-size: 12px;">★</span>').join('')}
          </div>
        </div>
      `
    
    case 'product-card':
      return `
        <style>
          @media only screen and (max-width: 600px) {
            .${elementId}-card {
              max-width: 100% !important;
              margin: 0 auto !important;
            }
            .${elementId}-img {
              height: 150px !important;
            }
            .${elementId}-price {
              font-size: 20px !important;
            }
          }
        </style>
        <div class="${elementId}-card" style="background: white; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; ${styleStr}">
          <img class="${elementId}-img" src="${props.image || 'https://placehold.co/400x300/f8fafc/64748b?text=Product'}" alt="Product" style="width: 100%; height: 200px; object-fit: cover; display: block;" />
          <div style="padding: 0px;">
            <h4 style="font-weight: bold; font-size: 18px; margin: 0 0 12px 0;">${props.children || 'Product Name'}</h4>
            <div style="margin-bottom: 16px;">
              <span class="${elementId}-price" style="font-size: 24px; font-weight: bold; color: #3b82f6;">${props.price || '$99.99'}</span>
              ${props.oldPrice ? `<span style="font-size: 16px; color: #9ca3af; text-decoration: line-through; margin-left: 8px;">${props.oldPrice}</span>` : ''}
            </div>
            <a href="#" target="_blank" style="display: block; width: 100%; padding: 12px; background: linear-gradient(to right, #3b82f6, #2563eb); color: white; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 600;">
              Add to Cart
            </a>
          </div>
        </div>
      `

    // Banking: Transaction Card
    case 'transaction-card': {
      const statusColors = {
        success: { bg: '#dcfce7', text: '#166534', label: 'Thành công' },
        pending: { bg: '#fef3c7', text: '#92400e', label: 'Đang xử lý' },
        failed: { bg: '#fee2e2', text: '#991b1b', label: 'Thất bại' }
      }
      const status = statusColors[props.status || 'success']
      return `
        <div style="background: ${props.bgColor || '#f0fdf4'}; border-radius: 12px; padding: 20px; ${styleStr}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <p style="font-weight: 600; font-size: 16px; color: ${props.titleColor || '#166534'}; margin: 0 0 4px 0;">${props.children || 'Giao dịch thành công'}</p>
              <p style="font-size: 12px; color: #6b7280; margin: 0;">Mã GD: ${props.transactionId || 'TXN123456789'}</p>
            </div>
            <span style="background: ${status.bg}; color: ${status.text}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${status.label}</span>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 16px 0;" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
            <span style="color: #6b7280;">Số tiền:</span>
            <span style="text-align: right; font-weight: 700; font-size: 18px; color: ${props.amountColor || '#166534'};">${props.amount || '5,000,000đ'}</span>
            <span style="color: #6b7280;">Từ:</span>
            <span style="text-align: right; color: #374151;">${props.fromAccount || '****1234'}</span>
            <span style="color: #6b7280;">Đến:</span>
            <span style="text-align: right; color: #374151;">${props.toAccount || '****5678'}</span>
            <span style="color: #6b7280;">Thời gian:</span>
            <span style="text-align: right; color: #374151;">${props.timestamp || '15/01/2025 14:30'}</span>
          </div>
        </div>
      `
    }

   

    // Banking: Credit Card Info
    case 'credit-card-info': {
      const cardTypeIcons = { visa: '💳 VISA', mastercard: '💳 Mastercard', jcb: '💳 JCB' }
      return `
        <div style="background: linear-gradient(135deg, ${props.bgColor || '#374151'} 0%, ${props.bgColorEnd || '#1f2937'} 100%); border-radius: 16px; padding: 24px; ${styleStr}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0;">${props.children || 'Thẻ tín dụng'}</p>
            <span style="color: #ffffff; font-weight: 600;">${cardTypeIcons[props.cardType] || '💳 VISA'}</span>
          </div>
          <p style="font-family: monospace; font-size: 20px; letter-spacing: 2px; color: #ffffff; margin: 0 0 20px 0;">${props.cardNumber || '**** **** **** 1234'}</p>
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <div>
              <p style="color: rgba(255,255,255,0.6); font-size: 10px; margin: 0;">CHỦ THẺ</p>
              <p style="color: #ffffff; font-size: 14px; margin: 4px 0 0 0;">${props.cardHolder || 'NGUYEN VAN A'}</p>
            </div>
            <div style="text-align: right;">
              <p style="color: rgba(255,255,255,0.6); font-size: 10px; margin: 0;">HẠN MỨC</p>
              <p style="color: #ffffff; font-size: 14px; margin: 4px 0 0 0;">${props.creditLimit || '100,000,000đ'}</p>
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.2); margin: 0 0 16px 0;" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 13px;">
            <span style="color: rgba(255,255,255,0.7);">Đã sử dụng:</span>
            <span style="text-align: right; color: #fbbf24; font-weight: 600;">${props.usedAmount || '35,000,000đ'}</span>
            <span style="color: rgba(255,255,255,0.7);">Còn lại:</span>
            <span style="text-align: right; color: #34d399; font-weight: 600;">${props.availableAmount || '65,000,000đ'}</span>
          </div>
        </div>
      `
    }

    // Gaming/Course: Course Card
    case 'course-card': {
      return `
        <div style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; ${styleStr}">
          ${props.image ? `<img src="${props.image}" alt="Course" style="width: 100%; height: 160px; object-fit: cover;" />` : ''}
          <div style="padding: 20px;">
            <span style="background: ${props.categoryBgColor || '#dbeafe'}; color: ${props.categoryTextColor || '#1d4ed8'}; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${props.category || 'Lập trình'}</span>
            <h3 style="font-weight: 600; font-size: 18px; color: ${props.titleColor || '#1f2937'}; margin: 12px 0 8px 0;">${props.children || 'Khóa học Lập trình Python'}</h3>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">Giảng viên: ${props.instructor || 'Nguyễn Văn B'}</p>
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 16px;">
              <span><span style="color: #f59e0b;">★</span> <strong>${props.rating || '4.8'}</strong> <span style="color: #6b7280;">(${props.reviewCount || '1,234'})</span></span>
              <span style="color: #6b7280;">${props.duration || '20 giờ'} • ${props.lessons || '45'} bài</span>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 16px 0;" />
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                ${props.originalPrice ? `<span style="color: #9ca3af; text-decoration: line-through; font-size: 14px;">${props.originalPrice}</span>` : ''}
                <span style="font-weight: 700; font-size: 20px; color: ${props.priceColor || '#dc2626'}; margin-left: 8px;">${props.price || '599,000đ'}</span>
              </div>
              <a href="${props.buttonLink || '#'}" style="display: inline-block; background: ${props.buttonBgColor || '#2563eb'}; color: ${props.buttonTextColor || '#ffffff'}; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500;">Đăng ký ngay</a>
            </div>
          </div>
        </div>
      `
    }

    // Gaming/Course: Game Item Card
    case 'game-item-card': {
      const rarityColors = { common: '#9ca3af', rare: '#3b82f6', epic: '#8b5cf6', legendary: '#f59e0b' }
      const rarityLabels = { common: 'Thường', rare: 'Hiếm', epic: 'Sử Thi', legendary: 'Huyền Thoại' }
      const rarity = props.rarity || 'rare'
      return `
        <div style="background: linear-gradient(135deg, ${props.bgColor || '#1e1b4b'} 0%, ${props.bgColorEnd || '#312e81'} 100%); border-radius: 16px; border: 2px solid ${rarityColors[rarity]}; padding: 20px; text-align: center; ${styleStr}">
          ${props.image ? `<img src="${props.image}" alt="Item" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 16px;" />` : `<div style="width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;"><span style="font-size: 48px;">💎</span></div>`}
          <span style="background: ${rarityColors[rarity]}20; color: ${rarityColors[rarity]}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${rarityLabels[rarity]}</span>
          <h3 style="font-weight: 700; font-size: 18px; color: #ffffff; margin: 12px 0 8px 0;">${props.children || 'Kiếm Rồng Lửa'}</h3>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0 0 16px 0;">${props.description || '+50 Sát thương, +20% Chí mạng'}</p>
          <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; display: flex; justify-content: space-around;">
            <div><span style="color: rgba(255,255,255,0.6); font-size: 12px; display: block;">Sức mạnh</span><span style="color: #ffffff; font-weight: 600;">${props.power || '+150'}</span></div>
            <div><span style="color: rgba(255,255,255,0.6); font-size: 12px; display: block;">Cấp độ</span><span style="color: #ffffff; font-weight: 600;">${props.level || 'Lv.50'}</span></div>
            <div><span style="color: rgba(255,255,255,0.6); font-size: 12px; display: block;">Giá</span><span style="color: #fbbf24; font-weight: 600;">${props.price || '500 💎'}</span></div>
          </div>
        </div>
      `
    }

    // Gaming/Course: Achievement Badge
    case 'achievement-badge': {
      const tierColors = { bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', platinum: '#e5e4e2', diamond: '#b9f2ff' }
      const tier = props.tier || 'gold'
      return `
        <div style="background: ${props.bgColor || '#fffbeb'}; border-radius: 12px; border: 2px solid ${tierColors[tier]}; padding: 20px; text-align: center; ${styleStr}">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${tierColors[tier]} 0%, ${tierColors[tier]}aa 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">${props.icon || '🏆'}</span>
          </div>
          <h3 style="font-weight: 700; font-size: 18px; color: ${props.titleColor || '#1f2937'}; margin: 0 0 8px 0;">${props.children || 'Chiến Binh Huyền Thoại'}</h3>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">${props.description || 'Hoàn thành 100 nhiệm vụ'}</p>
          <span style="color: ${tierColors[tier]}; font-weight: 600; font-size: 14px;">+${props.xpReward || '500'} XP</span>
          ${props.unlockedDate ? `<p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">Mở khóa: ${props.unlockedDate}</p>` : ''}
        </div>
      `
    }

    // Gaming/Course: Progress Bar
    case 'progress-bar': {
      const percent = props.progress || 75
      return `
        <div style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; ${styleStr}">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-weight: 600; color: ${props.titleColor || '#1f2937'};">${props.children || 'Tiến độ khóa học'}</span>
            <span style="font-weight: 700; color: ${props.progressColor || '#2563eb'};">${percent}%</span>
          </div>
          <div style="background: #e5e7eb; border-radius: 10px; height: 12px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, ${props.progressColor || '#2563eb'} 0%, ${props.progressColorEnd || '#3b82f6'} 100%); width: ${percent}%; height: 100%; border-radius: 10px;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 14px; color: #6b7280;">
            <span>${props.completedLabel || 'Hoàn thành'}: ${props.completed || '15'}/${props.total || '20'} ${props.unit || 'bài học'}</span>
            <span>${props.remainingLabel || 'Còn lại'}: ${props.remaining || '5'}</span>
          </div>
        </div>
      `
    }

    // F&B/Hotel: Menu Item
    case 'menu-item': {
      return `
        <div style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid ${props.borderColor || '#e5e7eb'}; display: flex; overflow: hidden; ${styleStr}">
          ${props.image ? `<img src="${props.image}" alt="Food" style="width: 120px; height: 120px; object-fit: cover;" />` : ''}
          <div style="padding: 16px; flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h3 style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '16px'}; font-style: ${props.titleFontStyle || 'normal'}; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; color: ${props.titleColor || '#1f2937'}; margin: 0 0 4px 0; text-align: ${props.titleAlign || 'left'};">${props.children || 'Phở Bò Tái Chín'}</h3>
                ${props.isSpicy ? '<span style="color: #ef4444; font-size: 12px; margin-left: 8px;"><img src="https://img.icons8.com/emoji/48/hot-chili-pepper.png" style="width: 12px; height: 12px; vertical-align: middle;" /> Cay</span>' : ''}
                ${props.isVegetarian ? '<span style="color: #22c55e; font-size: 12px; margin-left: 8px;"><img src="https://img.icons8.com/emoji/48/leaf-vegetable.png" style="width: 12px; height: 12px; vertical-align: middle;" /> Chay</span>' : ''}
              </div>
              <span style="font-weight: ${props.priceFontWeight || '700'}; font-size: ${props.priceFontSize || '18px'}; font-style: ${props.priceFontStyle || 'normal'}; font-family: ${props.priceFontFamily || 'Arial, sans-serif'}; color: ${props.priceColor || '#dc2626'}; text-align: ${props.priceAlign || 'right'};">${props.price || '75,000đ'}</span>
            </div>
            <p style="color: ${props.descriptionColor || '#6b7280'}; font-size: ${props.descriptionFontSize || '14px'}; font-weight: ${props.descriptionFontWeight || 'normal'}; font-style: ${props.descriptionFontStyle || 'normal'}; font-family: ${props.descriptionFontFamily || 'Arial, sans-serif'}; margin: 8px 0 0 0; line-height: 1.4; text-align: ${props.descriptionAlign || 'left'};">${props.description || 'Phở bò truyền thống với nước dùng đậm đà'}</p>
            ${props.calories ? `<p style="color: #9ca3af; font-size: ${props.detailsFontSize || '12px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; margin: 8px 0 0 0; text-align: ${props.detailsAlign || 'left'}">${props.calories} kcal • ${props.prepTime || '15 phút'}</p>` : ''}
          </div>
        </div>
      `
    }

    // F&B/Hotel: Room Card
    case 'room-card': {
      return `
        <div style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid ${props.borderColor || '#e5e7eb'}; overflow: hidden; ${styleStr}">
          ${props.image ? `<img src="${props.image}" alt="Room" style="width: 100%; height: 200px; object-fit: cover;" />` : ''}
          <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '18px'}; font-style: ${props.titleFontStyle || 'normal'}; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; color: ${props.titleColor || '#1f2937'}; margin: 0; text-align: ${props.titleAlign || 'left'};">${props.children || 'Phòng Deluxe Ocean View'}</h3>
              <span style="background: ${props.available ? '#dcfce7' : '#fee2e2'}; color: ${props.available ? '#166534' : '#991b1b'}; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${props.available ? 'Còn phòng' : 'Hết phòng'}</span>
            </div>
            <div style="display: flex; gap: 16px; margin-bottom: 16px; font-size: ${props.detailsFontSize || '14px'}; color: ${props.detailsColor || '#6b7280'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'};">
              <span><img src="${props.capacityIconUrl || 'https://img.icons8.com/ios/100/users.png'}" style="width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;" /> ${props.capacity || '2'} người</span>
              <span><img src="${props.sizeIconUrl || 'https://img.icons8.com/ios/100/resize.png'}" style="width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;" /> ${props.size || '45'}m²</span>
              <span><img src="${props.bedIconUrl || 'https://img.icons8.com/ios/100/bed.png'}" style="width: 14px; height: 14px; margin-right: 4px; vertical-align: middle;" /> ${props.bedType || 'King bed'}</span>
            </div>
            <p style="color: ${props.amenitiesColor || '#6b7280'}; font-size: ${props.amenitiesFontSize || '14px'}; font-weight: ${props.amenitiesFontWeight || 'normal'}; font-style: ${props.amenitiesFontStyle || 'normal'}; font-family: ${props.amenitiesFontFamily || 'Arial, sans-serif'}; margin: 0 0 16px 0; text-align: ${props.amenitiesAlign || 'left'};">✓ ${props.amenities || 'WiFi, Minibar, Bồn tắm, Ban công'}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 16px 0;" />
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                ${props.originalPrice ? `<span style="color: #9ca3af; text-decoration: line-through;">${props.originalPrice}</span>` : ''}
                <span style="font-weight: ${props.priceFontWeight || '700'}; font-size: ${props.priceFontSize || '24px'}; font-style: ${props.priceFontStyle || 'normal'}; font-family: ${props.priceFontFamily || 'Arial, sans-serif'}; color: ${props.priceColor || '#2563eb'}; text-align: ${props.priceAlign || 'left'};">${props.price || '2,500,000đ'}</span>
                <span style="color: ${props.priceUnitColor || '#6b7280'}; font-size: ${props.priceUnitFontSize || '14px'};">/${props.priceUnit || 'đêm'}</span>
              </div>
              <a href="${props.buttonLink || '#'}" style="display: inline-block; background: ${props.buttonBgColor || '#2563eb'}; color: ${props.buttonTextColor || '#ffffff'}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Đặt ngay</a>
            </div>
          </div>
        </div>
      `
    }

    // F&B/Hotel: Booking Summary
    case 'booking-summary': {
      return `
        <div style="background: ${props.bgColor || '#f0f9ff'}; border-radius: 12px; border: 1px solid ${props.borderColor || '#bae6fd'}; padding: 24px; ${styleStr}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '18px'}; font-style: ${props.titleFontStyle || 'normal'}; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; color: ${props.titleColor || '#0369a1'}; margin: 0; text-align: ${props.titleAlign || 'left'};">${props.children || 'Xác nhận đặt phòng'}</h3>
            <span style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${props.status || 'Đã xác nhận'}</span>
          </div>
          <p style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; margin: 0 0 20px 0; text-align: ${props.detailsAlign || 'left'};">Mã đặt phòng: <strong>${props.confirmationCode || 'BK2025011234'}</strong></p>
          <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
              <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'};">Khách sạn:</span><br/>
              <span style="font-weight: 600; color: ${props.detailsColor || '#1f2937'}; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'};">${props.propertyName || 'Grand Hotel Saigon'}</span>
            </div>
            <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
              <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'};">Loại phòng:</span><br/>
              <span style="font-weight: 600; color: ${props.detailsColor || '#1f2937'}; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'};">${props.roomType || 'Deluxe Ocean View'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
              <div><span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'};">Nhận phòng:</span><br/><span style="font-weight: 600; color: ${props.detailsColor || '#1f2937'}; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'};">${props.checkIn || '15/01/2025'}</span></div>
              <span style="align-self: center;">→</span>
              <div style="text-align: right;"><span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'right'};">Trả phòng:</span><br/><span style="font-weight: 600; color: ${props.detailsColor || '#1f2937'}; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'};">${props.checkOut || '17/01/2025'}</span></div>
            </div>
            <div>
              <span style="color: ${props.detailsColor || '#6b7280'}; font-size: ${props.detailsFontSize || '14px'}; font-weight: ${props.detailsFontWeight || 'normal'}; font-style: ${props.detailsFontStyle || 'normal'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'}; text-align: ${props.detailsAlign || 'left'};">Số khách:</span><br/>
              <span style="font-weight: 600; color: ${props.detailsColor || '#1f2937'}; font-size: ${props.detailsFontSize || '14px'}; font-family: ${props.detailsFontFamily || 'Arial, sans-serif'};">${props.guests || '2 người lớn'}</span>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: ${props.priceFontSize || '16px'}; color: ${props.priceColor || '#374151'}; font-weight: ${props.priceFontWeight || 'normal'}; font-style: ${props.priceFontStyle || 'normal'}; font-family: ${props.priceFontFamily || 'Arial, sans-serif'}; text-align: ${props.priceAlign || 'left'};">Tổng thanh toán:</span>
            <span style="font-weight: ${props.priceFontWeight || '700'}; font-size: ${props.priceFontSize || '24px'}; font-style: ${props.priceFontStyle || 'normal'}; font-family: ${props.priceFontFamily || 'Arial, sans-serif'}; color: ${props.totalColor || '#0369a1'}; text-align: ${props.priceAlign || 'right'};">${props.total || '5,000,000đ'}</span>
          </div>
        </div>
      `
    }

    // F&B/Hotel: Rating Review
    case 'rating-review': {
      const rating = props.rating || 5
      return `
        <div style="background: ${props.bgColor || '#ffffff'}; border-radius: 12px; border: 1px solid ${props.borderColor || '#e5e7eb'}; padding: 20px; ${styleStr}">
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            ${props.reviewerAvatar ? `<img src="${props.reviewerAvatar}" alt="Avatar" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" />` : `<div style="width: 48px; height: 48px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">👤</div>`}
            <div>
              <p style="font-weight: ${props.titleFontWeight || '600'}; font-size: ${props.titleFontSize || '14px'}; font-style: ${props.titleFontStyle || 'normal'}; font-family: ${props.titleFontFamily || 'Arial, sans-serif'}; color: ${props.titleColor || '#1f2937'}; margin: 0; text-align: ${props.titleAlign || 'left'};">${props.reviewerName || 'Nguyễn Văn A'}</p>
              <p style="color: ${props.starColor || '#f59e0b'}; font-size: 14px; margin: 4px 0;">
                ${Array.from({length: 5}, (_, i) => 
                  `<img src="${props.starIconUrl || 'https://img.icons8.com/emoji/48/star-emoji.png'}" style="width: 14px; height: 14px; vertical-align: middle; filter: ${i < Math.floor(rating) ? 'none' : 'grayscale(100%)'}; opacity: ${i < Math.floor(rating) ? '1' : '0.3'};" />`
                ).join('')}
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">${props.reviewDate || '15/01/2025'}</p>
            </div>
          </div>
          <h4 style="font-weight: ${props.reviewTitleFontWeight || '600'}; font-size: ${props.reviewTitleFontSize || '16px'}; font-style: ${props.reviewTitleFontStyle || 'normal'}; font-family: ${props.reviewTitleFontFamily || 'Arial, sans-serif'}; color: ${props.reviewTitleColor || '#1f2937'}; margin: 0 0 8px 0; text-align: ${props.reviewTitleAlign || 'left'};">${props.title || 'Trải nghiệm tuyệt vời!'}</h4>
          <p style="color: ${props.contentColor || '#374151'}; font-size: ${props.contentFontSize || '14px'}; font-weight: ${props.contentFontWeight || 'normal'}; font-style: ${props.contentFontStyle || 'normal'}; font-family: ${props.contentFontFamily || 'Arial, sans-serif'}; margin: 0; line-height: 1.5; text-align: ${props.contentAlign || 'left'};">${props.content || 'Phòng sạch sẽ, view đẹp, nhân viên thân thiện. Chắc chắn sẽ quay trở lại.'}</p>
          ${props.helpful ? `<p style="color: #9ca3af; font-size: 12px; margin: 12px 0 0 0;"><img src="https://img.icons8.com/ios/50/thumb-up.png" style="width: 12px; height: 12px; margin-right: 4px; vertical-align: middle;" />${props.helpful} người thấy hữu ích</p>` : ''}
        </div>
      `
    }

    default:
      return `<div>${props.children || ''}</div>`
  }
}
</script>
