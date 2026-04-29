/**
 * Composable wrapper for email HTML generation
 *
 * NOTE: The actual HTML generation logic is kept in the editor component
 * due to its complexity and tight integration with element rendering.
 * This composable provides utility functions and helpers.
 */

import { getEmailIcon, getSocialIcon, SOCIAL_COLORS } from '~/utils/emailIcons.js'

// Icons8 CDN - PNG icons (email-safe, Gmail compatible)
const ICONS8_BASE = 'https://img.icons8.com/fluency/48'

// Map Bootstrap icon names to Icons8 equivalents
const iconMap = {
  'currency-dollar': 'us-dollar-circled',
  'geo-alt-fill': 'marker',
  'arrows-angle-expand': 'expand',
  'door-open': 'open-door',
  'droplet': 'water',
  'check-lg': 'checkmark',
  'cart3': 'shopping-cart',
  'cart-fill': 'shopping-cart',
  'clipboard-check': 'task-completed',
  'ticket-perforated-fill': 'ticket',
  'briefcase-fill': 'briefcase',
  'lightning-fill': 'flash-on'
}

export const useEmailHtmlGenerator = () => {
  /**
   * Get YouTube embed ID from URL
   */
  const getYouTubeEmbedId = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : null
  }

  /**
   * Render icon as inline image (email-safe)
   */
  const renderIcon = (icon, fallback, size = '16', customUrl = '', color = 'currentColor') => {
    // If customUrl is provided, use image
    if (customUrl && customUrl.trim()) {
      return `<img src="${customUrl}" alt="icon" style="width:${size}px;height:${size}px;vertical-align:middle;object-fit:contain;" />`
    }

    // Use Icons8 PNG for email compatibility (Gmail doesn't render SVG well)
    let iconId = icon || fallback
    if (!iconId || iconId === 'none') return ''

    const icons8Name = iconMap[iconId] || iconId
    const iconUrl = `${ICONS8_BASE}/${icons8Name}.png`
    return `<img src="${iconUrl}" alt="${iconId}" style="width:${size}px;height:${size}px;vertical-align:middle;" />`
  }

  /**
   * Render icon in a circle with proper centering
   */
  const renderIconInCircle = (icon, fallback, iconSize = '20', circleSize = '40', bgColor = '#fee2e2', customUrl = '', color = '#22c55e') => {
    // If customUrl is provided, use image in circle
    if (customUrl && customUrl.trim()) {
      return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td style="width:${circleSize}px;height:${circleSize}px;background:${bgColor};border-radius:50%;text-align:center;vertical-align:middle;line-height:${circleSize}px;"><img src="${customUrl}" alt="icon" style="width:${iconSize}px;height:${iconSize}px;vertical-align:middle;display:inline-block;" /></td></tr></table>`
    }

    // Use Icons8 PNG for email compatibility (Gmail doesn't render SVG well)
    let iconId = icon || fallback
    if (!iconId || iconId === 'none') {
      iconId = fallback
    }
    if (!iconId) return ''

    const icons8Name = iconMap[iconId] || iconId
    const iconUrl = `${ICONS8_BASE}/${icons8Name}.png`
    return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td style="width:${circleSize}px;height:${circleSize}px;background:${bgColor};border-radius:50%;text-align:center;vertical-align:middle;line-height:${circleSize}px;"><img src="${iconUrl}" alt="${iconId}" style="width:${iconSize}px;height:${iconSize}px;vertical-align:middle;display:inline-block;" /></td></tr></table>`
  }

  /**
   * Convert camelCase to kebab-case
   */
  const camelToKebab = (str) => {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase()
  }

  /**
   * Convert style object to CSS string
   */
  const styleObjectToString = (style) => {
    return Object.entries(style).map(([key, value]) => {
      const cssKey = camelToKebab(key)
      return `${cssKey}: ${value}`
    }).join('; ')
  }

  /**
   * Generate responsive email CSS
   */
  const generateResponsiveCSS = (contentWidth) => {
    const breakpoint = contentWidth + 20

    return `
    @media only screen and (min-width: ${breakpoint}px) {
      .u-row {
        width: ${contentWidth}px !important;
      }
      .u-row .u-col {
        vertical-align: top;
      }
      .u-row .u-col-100 {
        width: ${contentWidth}px !important;
      }
      .u-row .u-col-50 {
        width: ${contentWidth / 2}px !important;
      }
      .u-row .u-col-33 {
        width: ${Math.round(contentWidth / 3)}px !important;
      }
      .u-row .u-col-25 {
        width: ${contentWidth / 4}px !important;
      }
    }

    @media only screen and (max-width: ${breakpoint}px) {
      .u-row-container {
        max-width: 100% !important;
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
      .u-row {
        width: 100% !important;
      }
      .u-row .u-col {
        display: block !important;
        width: 100% !important;
        min-width: 100% !important;
        max-width: 100% !important;
      }
      .u-row .u-col > div {
        margin: 0 auto;
      }
      table[role="presentation"] {
        width: 100% !important;
        max-width: 100% !important;
      }
      table.header-inline-table {
        width: auto !important;
        margin: 0 auto !important;
      }
      img.header-logo {
        max-height: 32px !important;
        height: 32px !important;
        width: auto !important;
      }
      .header-nav a {
        font-size: 12px !important;
        margin: 0 6px !important;
      }
      .footer-logo {
        height: 32px !important;
        max-height: 32px !important;
      }
    }`
  }

  /**
   * Sanitize HTML content (remove dangerous scripts)
   */
  const sanitizeHtmlContent = (html) => {
    let sanitized = html.trim()

    // Remove dangerous scripts but keep all CSS
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
    sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="#"')
    sanitized = sanitized.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src=""')

    return sanitized
  }

  return {
    // Utilities
    getYouTubeEmbedId,
    renderIcon,
    renderIconInCircle,
    camelToKebab,
    styleObjectToString,
    generateResponsiveCSS,
    sanitizeHtmlContent,
    // Constants
    iconMap,
    ICONS8_BASE,
    SOCIAL_COLORS
  }
}
