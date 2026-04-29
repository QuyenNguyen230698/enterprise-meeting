export const useCardUtils = () => {
  const getCardLogo = (cardType) => {
    const type = cardType?.toUpperCase()
    
    // International Cards
    if (type === 'VC' || type === 'VISA') return 'https://mondialbrand.com/wp-content/uploads/2024/02/visa-logo-preview-1200x1200.png'
    if (type === 'MC' || type === 'MASTERCARD') return 'https://logowik.com/content/uploads/images/787_mastercard.jpg'
    if (type === 'JCB') return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/2560px-JCB_logo.svg.png'
    if (type === 'AMEX') return 'https://cdn-icons-png.freepik.com/256/11378/11378183.png?semt=ais_white_label'
    
    // Vietnamese Banks - Using BIN codes from OnePay
    if (type === '970407' || type === '9704071') return 'https://api.vietqr.io/img/TCB.png'
    if (type === '970423') return 'https://api.vietqr.io/img/TPB.png'
    if (type === '970415') return 'https://api.vietqr.io/img/CTG.png'
    if (type === '970441') return 'https://api.vietqr.io/img/VIB.png'
    if (type === '970427') return 'https://api.vietqr.io/img/VAB.png'
    if (type === '970426') return 'https://api.vietqr.io/img/MSB.png'
    if (type === '970431') return 'https://api.vietqr.io/img/EIB.png'
    if (type === '970443') return 'https://api.vietqr.io/img/SHB.png'
    if (type === '970437') return 'https://api.vietqr.io/img/HDB.png'
    if (type === '970436') return 'https://api.vietqr.io/img/VCB.png'
    if (type === '970406') return 'https://api.vietqr.io/img/DOB.png'
    if (type === '970422') return 'https://api.vietqr.io/img/MB.png'
    if (type === '970428') return 'https://api.vietqr.io/img/NAB.png'
    if (type === '970440') return 'https://api.vietqr.io/img/SEAB.png'
    if (type === '970414') return 'https://api.vietqr.io/img/OCB.png'
    if (type === '970418') return 'https://api.vietqr.io/img/BIDV.png'
    if (type === '970409') return 'https://api.vietqr.io/img/BAB.png'
    if (type === '970432') return 'https://api.vietqr.io/img/VPB.png'
    if (type === '970419') return 'https://api.vietqr.io/img/NCB.png'
    if (type === '970405') return 'https://api.vietqr.io/img/ABB.png'
    if (type === '970429') return 'https://api.vietqr.io/img/SCB.png'
    if (type === '970403') return 'https://api.vietqr.io/img/STB.png'
    if (type === '970425') return 'https://api.vietqr.io/img/ABB.png'
    if (type === '970412') return 'https://api.vietqr.io/img/PVCB.png'
    if (type === '9704161') return 'https://api.vietqr.io/img/ACB.png'
    if (type === '9704081') return 'https://api.vietqr.io/img/GPB.png'
    if (type === '9704481') return 'https://api.vietqr.io/img/OCB.png'
    if (type === '9704491') return 'https://api.vietqr.io/img/LPB.png'
    if (type === '9704521') return 'https://api.vietqr.io/img/KLB.png'
    if (type === '9704241') return 'https://api.vietqr.io/img/SHBVN.png'
    
    return '💳'
  }

  const getCardName = (cardType) => {
    const type = cardType?.toUpperCase()
    
    // International Cards
    if (type === 'VC') return 'Visa'
    if (type === 'MC') return 'Mastercard'
    if (type === 'JCB') return 'JCB'
    if (type === 'AMEX') return 'American Express'
    
    // Vietnamese Banks - Based on OnePay BIN codes
    if (type === '970407' || type === '9704071') return 'Techcombank'
    if (type === '970423') return 'TPBank'
    if (type === '970415') return 'Vietinbank'
    if (type === '970441') return 'VIB'
    if (type === '970427') return 'VietABank'
    if (type === '970426') return 'MSB'
    if (type === '970431') return 'Eximbank'
    if (type === '970443') return 'SHB'
    if (type === '970437') return 'HDBank'
    if (type === '970436') return 'Vietcombank'
    if (type === '970406') return 'DongABank'
    if (type === '970422') return 'MBBank'
    if (type === '970428') return 'Nam A Bank'
    if (type === '970440') return 'SeABank'
    if (type === '970414') return 'OceanBank'
    if (type === '970418') return 'BIDV'
    if (type === '970409') return 'Bac A Bank'
    if (type === '970432') return 'VPBank'
    if (type === '970419') return 'NCB'
    if (type === '970405') return 'Agribank'
    if (type === '970429') return 'Saigonbank'
    if (type === '970403') return 'Sacombank'
    if (type === '970425') return 'ABBank'
    if (type === '970412') return 'PVcomBank'
    if (type === '970454') return 'VCCB'
    if (type === '9704161') return 'ACB'
    if (type === '9704081') return 'GPBank'
    if (type === '9704481') return 'OCB'
    if (type === '9704491') return 'LienVietPostBank'
    if (type === '9704381') return 'BaoViet Bank'
    if (type === '9704521') return 'KienLongBank'
    if (type === '9704211') return 'VRB'
    if (type === '9704391') return 'Public Bank'
    if (type === '9704001') return 'Saigonbank'
    if (type === '9704301') return 'PG Bank'
    if (type === '9704341') return 'IVB'
    if (type === '9704571') return 'Woori Bank'
    if (type === '9704581') return 'UOB'
    if (type === '9704241') return 'Shinhan Bank'
    if (type === '9704601') return 'VietCredit'
    if (type === '9704331') return 'VietBank'
    
    return cardType || 'Card'
  }

  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate || expiryDate === 'N/A') return 'N/A'
    // Format MMYY to MM/YY (e.g., "0528" -> "05/28")
    if (expiryDate.length === 4) {
      const mm = expiryDate.substring(0, 2)
      const yy = expiryDate.substring(2, 4)
      return `${mm}/${yy}`
    }
    return expiryDate
  }

  return {
    getCardLogo,
    getCardName,
    formatExpiryDate
  }
}
