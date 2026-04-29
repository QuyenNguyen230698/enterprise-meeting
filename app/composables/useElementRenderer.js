// Unified Element Renderer - Used by both Canvas and Preview
export const useElementRenderer = () => {
  // Render custom elements (transaction-card, job-listing, etc.)
  const renderCustomElement = (element, isCanvas = false) => {
    const props = element.props || {}
    const style = element.style || {}
    const styleStr = Object.entries(style).map(([key, value]) => 
      `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`
    ).join('; ')
    
    // Banking: Transaction Card
    if (element.type === 'transaction-card') {
      const statusColors = {
        success: { bg: '#dcfce7', text: '#166534', label: 'Thành công' },
        pending: { bg: '#fef3c7', text: '#92400e', label: 'Đang xử lý' },
        failed: { bg: '#fee2e2', text: '#991b1b', label: 'Thất bại' }
      }
      const status = statusColors[props.status || 'success']
      
      if (isCanvas) {
        // Return Vue component data for canvas
        return {
          type: 'transaction-card',
          props: {
            bgColor: props.bgColor || '#f0fdf4',
            borderColor: props.borderColor || '#22c55e',
            iconBgColor: props.iconBgColor || '#dcfce7',
            iconColor: props.iconColor || '#22c55e',
            titleColor: props.titleColor || '#15803d',
            amountColor: props.amountColor || '#16a34a',
            status: props.status || 'success',
            children: props.children || 'Giao dịch thành công',
            date: props.date || '31/12/2025 14:30',
            amount: props.amount || '5,000,000đ',
            transactionId: props.transactionId || 'TXN123456789',
            fromAccount: props.fromAccount || '**** 1234',
            toAccount: props.toAccount || '**** 5678',
            timestamp: props.timestamp || '15/01/2025 14:30'
          }
        }
      } else {
        // Return HTML for preview/email
        return `
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="background: ${props.bgColor || '#f0fdf4'}; border-radius: 12px; ${styleStr}">
            <tr><td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="font-weight: 600; font-size: 16px; color: ${props.titleColor || '#166534'}; margin: 0 0 4px 0;">${props.children || 'Giao dịch thành công'}</p>
                    <p style="font-size: 12px; color: #6b7280; margin: 0;">Mã GD: ${props.transactionId || 'TXN123456789'}</p>
                  </td>
                  <td align="right">
                    <span style="background: ${status.bg}; color: ${status.text}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${status.label}</span>
                  </td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 4px 0;"><span style="color: #6b7280; font-size: 14px;">Số tiền:</span></td>
                  <td style="padding: 4px 0;" align="right"><span style="font-weight: 700; font-size: 18px; color: ${props.amountColor || '#166534'};">${props.amount || '5,000,000đ'}</span></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><span style="color: #6b7280; font-size: 14px;">Từ:</span></td>
                  <td style="padding: 4px 0;" align="right"><span style="color: #374151;">${props.fromAccount || '****1234'}</span></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><span style="color: #6b7280; font-size: 14px;">Đến:</span></td>
                  <td style="padding: 4px 0;" align="right"><span style="color: #374151;">${props.toAccount || '****5678'}</span></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><span style="color: #6b7280; font-size: 14px;">Thời gian:</span></td>
                  <td style="padding: 4px 0;" align="right"><span style="color: #374151;">${props.timestamp || '15/01/2025 14:30'}</span></td>
                </tr>
              </table>
            </td></tr>
          </table>
        `
      }
    }
    

    return null
  }
  
  // Render basic elements (heading, text, button, etc.)
  const renderBasicElement = (element, isCanvas = false) => {
    const props = element.props || {}
    const style = element.style || {}
    
    switch (element.type) {
      case 'heading1':
      case 'heading2':
      case 'heading3':
        const tag = element.type.replace('heading', 'h')
        if (isCanvas) {
          return {
            type: 'heading',
            tag,
            props: {
              children: props.children || 'Heading',
              fontSize: style.fontSize || '32px',
              color: style.color || '#000',
              fontWeight: style.fontWeight || 'bold',
              textAlign: style.textAlign || 'left'
            }
          }
        } else {
          return `<${tag} style="margin: 0; font-size: ${style.fontSize || '32px'}; color: ${style.color || '#000'}; font-weight: ${style.fontWeight || 'bold'}; line-height: 1.2; text-align: ${style.textAlign || 'left'}; padding: 10px;">${props.children || ''}</${tag}>`
        }
      
      case 'text':
        if (isCanvas) {
          return {
            type: 'text',
            props: {
              children: props.children || 'Text content',
              fontSize: style.fontSize || '16px',
              color: style.color || '#374151',
              lineHeight: style.lineHeight || '1.6',
              textAlign: style.textAlign || 'left'
            }
          }
        } else {
          return `<div style="font-size: ${style.fontSize || '16px'}; color: ${style.color || '#374151'}; line-height: ${style.lineHeight || '1.6'}; text-align: ${style.textAlign || 'left'}; padding: 10px;">${props.children || ''}</div>`
        }
      
      case 'button':
        if (isCanvas) {
          return {
            type: 'button',
            props: {
              children: props.children || 'Button',
              href: props.href || '#',
              backgroundColor: style.backgroundColor || '#3b82f6',
              color: style.color || '#ffffff',
              borderRadius: style.borderRadius || '6px',
              padding: style.padding || '12px 24px',
              fontSize: style.fontSize || '16px'
            }
          }
        } else {
          return `<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;" align="center">
        <a href="${props.href || '#'}" target="_blank" style="box-sizing: border-box;display: inline-block;text-decoration: none;text-align: center;color: ${style.color || '#ffffff'}; background-color: ${style.backgroundColor || '#3b82f6'}; border-radius: ${style.borderRadius || '6px'}; padding: ${style.padding || '12px 24px'}; font-size: ${style.fontSize || '16px'}; font-weight: bold;">
          ${props.children || 'Button'}
        </a>
      </td>
    </tr>
  </tbody>
</table>`
        }
      
      default:
        return null
    }
  }
  
  // Main render function
  const renderElement = (element, isCanvas = false) => {
    // Try custom elements first
    const customResult = renderCustomElement(element, isCanvas)
    if (customResult) return customResult
    
    // Try basic elements
    const basicResult = renderBasicElement(element, isCanvas)
    if (basicResult) return basicResult
    
    // Fallback
    if (isCanvas) {
      return {
        type: 'fallback',
        props: {
          children: props.children || '',
          style: styleStr
        }
      }
    } else {
      const styleStr = Object.entries(style).map(([key, value]) => 
        `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`
      ).join('; ')
      return `<div style="padding: 10px; ${styleStr}">${props.children || ''}</div>`
    }
  }
  
  return {
    renderElement,
    renderCustomElement,
    renderBasicElement
  }
}
