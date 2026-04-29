/**
 * Default props and styles for email builder elements
 */

// Elements that cannot be placed inside Row/Column containers
export const restrictedContainerElements = [
  // E-commerce
  'product-grid', 'coupon-code', 'cart-reminder', 'order-summary',
  // Real Estate
  'property-card', 'property-features', 'location-map',
  // Recruitment
  'job-listing', 'benefits-list',
  // Banking
  'transaction-card',  'credit-card-info',
  // Gaming/Course
  'course-card', 'game-item-card', 'achievement-badge',
  // F&B/Hotel
  'menu-item', 'room-card', 'booking-summary', 'rating-review'
]

/**
 * Get default props for an element type
 */
export const getDefaultProps = (type) => {
  const defaults = {
    heading1: { as: 'h1', children: 'Your Heading 1' },
    heading2: { as: 'h2', children: 'Your Heading 2' },
    heading3: { as: 'h3', children: 'Your Heading 3' },
    text: { children: 'Your text content goes here...' },
    button: { href: 'javascript:void(0)', children: 'Click Me' },
    image: {
      src: 'https://placehold.co/300x200/e2e8f0/64748b?text=Image',
      alt: 'Image',
      width: '100%',
      height: 'auto',
      title: '',
      caption: '',
      href: '',
      align: 'center',
      borderRadius: '0',
      borderWidth: '0',
      borderColor: '#e5e7eb',
      borderStyle: 'solid'
    },
    video: {
      src: '',
      poster: 'https://placehold.co/400x225/e2e8f0/64748b?text=Video',
      width: '100%',
      height: 'auto',
      autoplay: false,
      controls: true,
      videoType: 'youtube',
      youtubeUrl: '',
      align: 'center',
      borderRadius: '8px',
      caption: ''
    },
    divider: {},
    spacer: { height: '20px' },
    html: { children: '<p>Your HTML code here</p>' },
    section: { children: '' },
    row: { children: '' },
    container: { children: '' },
    columns2: { children: [], gap: '16px', backgroundColor: 'transparent', borderRadius: '0', padding: '0' },
    columns3: { children: [], gap: '16px', backgroundColor: 'transparent', borderRadius: '0', padding: '0' },
    columns4: { children: [], gap: '12px', backgroundColor: 'transparent', borderRadius: '0', padding: '0' },
    row2: { children: [], gap: '16px', backgroundColor: 'transparent', borderRadius: '0', padding: '0' },
    row3: { children: [], gap: '16px', backgroundColor: 'transparent', borderRadius: '0', padding: '0' },
    row4: { children: [], gap: '12px', backgroundColor: 'transparent', borderRadius: '0', padding: '0' },
    quote: { children: 'This is a quote or testimonial text that stands out from regular content.' },
    link: { href: '#', children: 'Link Text' },
    'social-facebook': { href: 'https://facebook.com', children: 'Facebook' },
    'social-twitter': { href: 'https://twitter.com', children: 'Twitter' },
    'social-instagram': { href: 'https://instagram.com', children: 'Instagram' },
    'social-linkedin': { href: 'https://linkedin.com', children: 'LinkedIn' },
    'social-youtube': { href: 'https://youtube.com', children: 'YouTube' },
    'social-tiktok': { href: 'https://tiktok.com', children: 'TikTok' },
    'cta-block': { children: 'Call to Action', buttonText: 'Get Started', href: '#' },
    testimonial: { children: 'Great product! Highly recommended.', author: 'Customer Name', rating: 5 },
    'product-card': { children: 'Product Name', price: '$99', image: 'https://placehold.co/300x200/e2e8f0/64748b?text=Product' },
    footer: {
      children: '© 2025 Your Company. All rights reserved.',
      companyName: 'Your Company',
      address: '123 Business St, City, State 12345',
      phone: '+1 (555) 123-4567',
      email: 'contact@yourcompany.com',
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      unsubscribeText: 'Unsubscribe from this list',
      unsubscribeLink: '#unsubscribe',
      privacyLink: '#privacy',
      termsLink: '#terms'
    },
    header: {
      children: 'Welcome to Our Newsletter',
      logo: '',
      companyName: 'Your Company',
      tagline: 'Your tagline here',
      headerLayout: 'inline',
      showNav: true,
      navLinks: [
        { text: 'Home', url: '#' },
        { text: 'Products', url: '#' },
        { text: 'Contact', url: '#' }
      ],
      navAlign: 'center',
      logoPosition: 'center',
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
      linkColor: '#60a5fa',
      padding: '1 1 1 1'
    },
    'hero-banner': { children: 'Welcome to Our Service', subtitle: 'Get started today' },

    // E-commerce Elements
    'product-grid': {
      children: 'Sản phẩm nổi bật',
      padding: '1',
      columns: 3,
      icon: 'cart3',
      iconUrl: '',
      products: [
        { name: 'Sản phẩm 1', price: '199.000đ', oldPrice: '299.000đ', image: 'https://placehold.co/200x150/e2e8f0/64748b?text=SP1', url: '#' },
        { name: 'Sản phẩm 2', price: '299.000đ', oldPrice: '', image: 'https://placehold.co/200x150/e2e8f0/64748b?text=SP2', url: '#' },
        { name: 'Sản phẩm 3', price: '399.000đ', oldPrice: '499.000đ', image: 'https://placehold.co/200x150/e2e8f0/64748b?text=SP3', url: '#' }
      ],
      cardPadding: '12px',
      titleColor: '#1f2937',
      priceColor: '#2563eb',
      bgColor: '#f9fafb'
    },
    'coupon-code': {
      children: 'SAVE20',
      discount: 'Giảm 20%',
      description: 'Áp dụng cho đơn hàng từ 500.000đ',
      expiryDate: '31/12/2025',
      icon: 'ticket-perforated-fill',
      iconUrl: '',
      bgColor: '#fffbeb',
      borderColor: '#f59e0b',
      codeColor: '#d97706',
      fontSize: '24px'
    },
    'cart-reminder': {
      children: 'Bạn còn sản phẩm trong giỏ hàng!',
      subtitle: 'Hoàn tất đơn hàng ngay',
      buttonText: 'Xem giỏ hàng',
      href: '#',
      icon: 'cart3',
      iconUrl: '',
      bgColor: '#fff7ed',
      borderColor: '#f97316',
      titleColor: '#1f2937',
      buttonBgColor: '#f97316',
      buttonTextColor: '#ffffff',
      buttonRadius: '8px'
    },
    'order-summary': {
      children: 'Đơn hàng #12345',
      icon: 'clipboard-check',
      iconUrl: '',
      items: [
        { name: 'Sản phẩm A', quantity: 2, price: '398.000đ' },
        { name: 'Sản phẩm B', quantity: 1, price: '199.000đ' }
      ],
      subtotal: '597.000đ',
      shipping: '30.000đ',
      total: '627.000đ',
      bgColor: '#f9fafb',
      titleColor: '#1f2937',
      totalColor: '#2563eb',
      borderColor: '#e5e7eb'
    },

    // Real Estate Elements
    'property-card': {
      children: 'Căn hộ cao cấp Quận 1',
      price: '5.2 tỷ',
      location: 'Quận 1, TP.HCM',
      url: '#',
      area: '85m²',
      bedrooms: 2,
      bathrooms: 2,
      badge: 'Mới',
      icon: 'house-fill',
      iconUrl: '',
      image: 'https://placehold.co/400x250/e2e8f0/64748b?text=Property',
      bgColor: '#ffffff',
      titleColor: '#1f2937',
      priceColor: '#2563eb',
      borderRadius: '16px'
    },
    'property-features': {
      children: 'Tiện ích',
      features: ['Hồ bơi', 'Gym', 'Bãi đỗ xe', 'Bảo vệ 24/7', 'Công viên', 'Sân chơi trẻ em'],
      layout: 'grid',
      columns: 2,
      icon: 'check-circle-fill',
      iconUrl: '',
      titleColor: '#1f2937',
      textColor: '#374151',
      iconColor: '#22c55e',
      bgColor: 'transparent'
    },
    'location-map': {
      children: 'Vị trí',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      mapImage: 'https://placehold.co/600x300/e2e8f0/64748b?text=Map',
      mapType: 'image',
      embedCode: '',
      icon: 'geo-alt-fill',
      iconUrl: '',
      bgColor: '#ffffff',
      titleColor: '#1f2937',
      borderRadius: '12px'
    },

    // Recruitment Elements
    'job-listing': {
      children: 'Senior Developer',
      company: 'Tech Company',
      location: 'TP.HCM',
      type: 'Full-time',
      salary: '25-40 triệu',
      deadline: '31/12/2025',
      href: '#',
      bgColor: '#ffffff',
      titleColor: '#1f2937',
      companyColor: '#2563eb',
      buttonBgColor: '#2563eb',
      buttonTextColor: '#ffffff',
      borderRadius: '16px'
    },
    'benefits-list': {
      children: 'Phúc lợi',
      benefits: ['Lương tháng 13', 'Bảo hiểm sức khỏe', 'Du lịch hàng năm', 'Đào tạo chuyên môn', 'Môi trường năng động'],
      layout: 'list',
      columns: 1,
      icon: 'check-lg',
      iconUrl: '',
      titleColor: '#1f2937',
      textColor: '#374151',
      iconColor: '#22c55e',
      bgColor: 'transparent'
    },

    // Utility Elements
    unsubscribe: {
      children: 'Hủy đăng ký',
      href: '{{UNSUBSCRIBE_URL}}',
      description: 'Nếu bạn không muốn nhận email từ chúng tôi, bạn có thể hủy đăng ký bất cứ lúc nào.',
      textColor: '#6b7280',
      linkColor: '#2563eb',
      fontSize: '12px'
    },

    // ==================== BANKING ELEMENTS ====================
    'transaction-card': {
      children: 'Giao dịch thành công',
      transactionId: 'TXN123456789',
      transactionType: 'transfer', // transfer, payment, deposit, withdrawal
      amount: '5,000,000đ',
      fromAccount: '**** 1234',
      toAccount: '**** 5678',
      toName: 'Nguyễn Văn A',
      date: '31/12/2025 14:30',
      status: 'success', // success, pending, failed
      description: 'Chuyển tiền nhanh 24/7',
      icon: 'arrow-left-right',
      iconUrl: '',
      bgColor: '#f0fdf4',
      borderColor: '#22c55e',
      titleColor: '#15803d',
      amountColor: '#16a34a',
      textColor: '#374151'
    },
 
    'credit-card-info': {
      children: 'Thẻ tín dụng',
      cardType: 'visa', // visa, mastercard, jcb, amex
      cardNumber: '**** **** **** 9876',
      cardHolder: 'NGUYEN VAN A',
      expiryDate: '12/28',
      creditLimit: '100,000,000đ',
      usedAmount: '35,000,000đ',
      availableCredit: '65,000,000đ',
      minPayment: '3,500,000đ',
      dueDate: '15/01/2026',
      icon: 'credit-card-2-front',
      iconUrl: '',
      bgColor: '#1e3a8a',
      textColor: '#ffffff',
      showUsage: true
    },

    // ==================== GAMING / COURSE ELEMENTS ====================
    'course-card': {
      children: 'Khóa học Lập trình Python',
      instructor: 'Nguyễn Văn B',
      instructorAvatar: 'https://placehold.co/40x40/e2e8f0/64748b?text=NB',
      thumbnail: 'https://placehold.co/400x200/e2e8f0/64748b?text=Course',
      duration: '20 giờ',
      lessons: 45,
      level: 'Cơ bản',
      rating: 4.8,
      price: '799,000đ',
      originalPrice: '1,500,000đ',
      href: '#',
      icon: 'mortarboard',
      iconUrl: '',
      durationIconUrl: 'https://img.icons8.com/ios/100/alarm-clock--v1.png',
      lessonsIconUrl: 'https://img.icons8.com/carbon-copy/100/book.png',
      starIconUrl: 'https://img.icons8.com/emoji/48/star-emoji.png',
      bgColor: '#ffffff',
      titleColor: '#1f2937',
      priceColor: '#dc2626',
      borderRadius: '12px',
      showRating: true,
      // Typography props
      titleAlign: 'left',
      titleFontSize: '18px',
      titleFontWeight: 'bold',
      titleFontStyle: 'normal',
      titleFontFamily: 'Arial, sans-serif',
      detailsAlign: 'left',
      detailsFontSize: '14px',
      detailsFontWeight: 'normal',
      detailsFontStyle: 'normal',
      detailsFontFamily: 'Arial, sans-serif',
      priceAlign: 'left',
      priceFontSize: '20px',
      priceFontWeight: 'bold',
      priceFontStyle: 'normal',
      priceFontFamily: 'Arial, sans-serif'
    },
    'achievement-badge': {
      children: 'Master Developer',
      description: 'Hoàn thành 100 bài tập lập trình',
      earnedDate: '31/12/2025',
      points: 500,
      level: 'gold', // bronze, silver, gold, platinum, diamond
      category: 'Học tập',
      icon: 'trophy',
      iconUrl: '',
      image: 'https://placehold.co/80x80/fbbf24/78350f?text=Badge',
      bgColor: '#fffbeb',
      borderColor: '#f59e0b',
      titleColor: '#78350f',
      textColor: '#92400e',
      showPoints: true
    },
    'progress-bar': {
      children: 'Tiến độ hoàn thành',
      currentValue: 75,
      maxValue: 100,
      unit: '%',
      label: 'Hoàn thành khóa học',
      sublabel: 'tiến trình',
      color: '#3b82f6',
      bgColor: '#e5e7eb',
      showPercentage: true,
      showLabel: true,
      height: '12px',
      borderRadius: '6px',
      animated: true,
      icon: 'graph-up',
      iconUrl: ''
    },

    // ==================== F&B / HOTEL ELEMENTS ====================
    'menu-item': {
      children: 'Phở Bò Đặc Biệt',
      description: 'Phở bò truyền thống với thịt bò tái, chín, nạm, gầu. Nước dùng ninh xương 12 tiếng.',
      price: '85,000đ',
      originalPrice: '',
      image: 'https://placehold.co/200x150/e2e8f0/64748b?text=Pho',
      category: 'Món chính',
      tags: ['Bestseller', 'Đặc sản'],
      calories: '520 kcal',
      prepTime: '10 phút',
      isVegetarian: false,
      isSpicy: false,
      spicyLevel: 0,
      href: '#',
      icon: 'cup-hot',
      iconUrl: '',
      bgColor: '#ffffff',
      titleColor: '#1f2937',
      priceColor: '#dc2626',
      borderRadius: '12px',
      showTags: true
    },
    'room-card': {
      children: 'Phòng Deluxe Ocean View',
      description: 'Phòng rộng rãi với view biển tuyệt đẹp, ban công riêng',
      pricePerNight: '2,500,000đ',
      originalPrice: '3,200,000đ',
      image: 'https://placehold.co/400x250/e2e8f0/64748b?text=Room',
      roomType: 'deluxe', // standard, superior, deluxe, suite, villa
      bedType: '1 King bed hoặc 2 Queen beds',
      maxGuests: 2,
      roomSize: '45m²',
      amenities: ['Wifi miễn phí', 'Minibar', 'Bồn tắm', 'Ban công'],
      rating: 4.9,
      reviews: 234,
      href: '#',
      icon: 'building',
      iconUrl: '',
      bgColor: '#ffffff',
      titleColor: '#1f2937',
      priceColor: '#059669',
      borderRadius: '16px',
      showRating: true
    },
    'booking-summary': {
      children: 'Chi tiết đặt phòng',
      confirmationCode: 'BK123456',
      propertyName: 'Sunset Beach Resort',
      propertyImage: 'https://placehold.co/300x150/e2e8f0/64748b?text=Hotel',
      roomType: 'Phòng Deluxe Ocean View',
      checkIn: '01/01/2026',
      checkInTime: '14:00',
      checkOut: '03/01/2026',
      checkOutTime: '12:00',
      nights: 2,
      guests: '2 người lớn, 1 trẻ em',
      roomPrice: '5,000,000đ',
      taxes: '500,000đ',
      serviceFee: '250,000đ',
      discount: '500,000đ',
      total: '5,250,000đ',
      paymentStatus: 'paid', // paid, pending, partial
      specialRequests: 'Phòng không hút thuốc, tầng cao',
      icon: 'calendar-check',
      iconUrl: '',
      bgColor: '#ffffff',
      titleColor: '#1f2937',
      totalColor: '#059669',
      borderColor: '#e5e7eb',
      borderRadius: '12px'
    },
    'rating-review': {
      children: 'Đánh giá từ khách hàng',
      reviewerName: 'Nguyễn Văn C',
      reviewerAvatar: 'https://placehold.co/48x48/e2e8f0/64748b?text=NC',
      rating: 5,
      reviewDate: '28/12/2025',
      title: 'Trải nghiệm tuyệt vời!',
      content: 'Phòng sạch sẽ, view đẹp, nhân viên thân thiện. Bữa sáng đa dạng và ngon miệng. Chắc chắn sẽ quay lại!',
      photos: [],
      helpful: 24,
      response: '',
      responseDate: '',
      verified: true,
      stayType: 'Gia đình',
      icon: 'star-fill',
      iconUrl: '',
      bgColor: '#ffffff',
      titleColor: '#1f2937',
      starColor: '#fbbf24',
      borderColor: '#e5e7eb',
      borderRadius: '12px',
      showVerified: true
    }
  }
  return defaults[type] || { children: '' }
}

/**
 * Get default styles for an element type
 */
export const getDefaultStyle = (type) => {
  const defaults = {
    heading1: {
      fontSize: '2rem',
      color: '#1f2937',
      textAlign: 'left',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      margin: '0',
      padding: '0'
    },
    heading2: {
      fontSize: '1.5rem',
      color: '#1f2937',
      textAlign: 'left',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      margin: '0',
      padding: '0'
    },
    heading3: {
      fontSize: '1.25rem',
      color: '#1f2937',
      textAlign: 'left',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      margin: '0',
      padding: '0'
    },
    text: {
      fontSize: '1rem',
      color: '#374151',
      lineHeight: '1.6',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left',
      margin: '0',
      padding: '0'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      padding: '1.5',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      margin: '0'
    },
    image: { borderRadius: '0', margin: '0', padding: '0' },
    video: { borderRadius: '0', margin: '0', padding: '0', width: '100%', height: 'auto' },
    divider: { borderColor: '#e5e7eb', margin: '0', padding: '0' },
    html: { margin: '0', padding: '0', fontFamily: 'Arial, sans-serif' },
    link: {
      color: '#3b82f6',
      fontSize: '1rem',
      fontFamily: 'Arial, sans-serif',
      textDecoration: 'underline'
    },
    'social-facebook': { color: '#1877f2', fontSize: '1.25rem', margin: '0' },
    'social-twitter': { color: '#1da1f2', fontSize: '1.25rem', margin: '0' },
    'social-instagram': { color: '#e4405f', fontSize: '1.25rem', margin: '0' },
    'social-linkedin': { color: '#0077b5', fontSize: '1.25rem', margin: '0' },
    'social-youtube': { color: '#ff0000', fontSize: '1.25rem', margin: '0' },
    'social-tiktok': { color: '#000000', fontSize: '1.25rem', margin: '0' },
    columns2: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    columns3: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    columns4: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    row2: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    row3: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    row4: { backgroundColor: 'transparent', padding: '0', margin: '0' },
    quote: {
      fontSize: '1.125rem',
      color: '#4b5563',
      fontStyle: 'italic',
      borderLeft: '0.25rem solid #3b82f6',
      paddingLeft: '1rem',
      margin: '0',
      padding: '0.75rem 1rem',
      backgroundColor: '#f3f4f6'
    },
    'cta-block': { backgroundColor: '#f9fafb', padding: '1.5', margin: '0', borderRadius: '0.5rem' },
    testimonial: { backgroundColor: '#f9fafb', padding: '1rem', margin: '0', borderRadius: '0.5rem' },
    'product-card': { backgroundColor: '#ffffff', padding: '0', margin: '0', borderRadius: '0.5rem', border: '1px solid #e5e7eb' },
    header: { backgroundColor: '#1f2937', color: '#ffffff', padding: '1rem', margin: '0' },
    footer: {
      backgroundColor: '#1f2937',
      color: '#9ca3af',
      padding: '2rem 1rem',
      margin: '0',
      textAlign: 'center',
      fontSize: '0.875rem',
      fontFamily: 'Arial, sans-serif'
    },
    'hero-banner': {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      padding: '3rem',
      margin: '0',
      textAlign: 'center',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    },
    // E-commerce Elements
    'product-grid': { padding: '1', margin: '0', backgroundColor: '#f9fafb', cardPadding: '12px' },
    'coupon-code': { padding: '1.5', margin: '0', borderRadius: '0.75rem' },
    'cart-reminder': { padding: '1.5', margin: '0', borderRadius: '0.5rem' },
    'order-summary': { padding: '', margin: '0', borderRadius: '0.75rem', backgroundColor: '#f9fafb' },
    // Real Estate Elements
    'property-card': { padding: '0', margin: '0', borderRadius: '1rem', backgroundColor: '#ffffff' },
    'property-features': { padding: '', margin: '0' },
    'location-map': { padding: '', margin: '0', borderRadius: '0.75rem', backgroundColor: '#ffffff' },
    // Recruitment Elements
    'job-listing': { padding: '1.5', margin: '0', borderRadius: '1rem', backgroundColor: '#ffffff' },
    'benefits-list': { padding: '', margin: '0' },

    // Banking Elements
    'transaction-card': { padding: '1.5', margin: '0', borderRadius: '12px', backgroundColor: '#f0fdf4', border: '1px solid #22c55e' },
    'credit-card-info': { padding: '1.5', margin: '0', borderRadius: '16px', backgroundColor: '#1e3a8a' },

    // Gaming/Course Elements
    'course-card': { padding: '0', margin: '0', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', overflow: 'hidden' },
    'game-item-card': { padding: '1', margin: '0', borderRadius: '12px', border: '2px solid #f59e0b' },
    'achievement-badge': { padding: '1.25rem', margin: '0', borderRadius: '12px', backgroundColor: '#fffbeb', border: '2px solid #f59e0b' },
    'progress-bar': { padding: '1', margin: '0' },

    // F&B/Hotel Elements
    'menu-item': { padding: '0', margin: '0', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', overflow: 'hidden' },
    'room-card': { padding: '0', margin: '0', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', overflow: 'hidden' },
    'booking-summary': { padding: '1.5', margin: '0', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb' },
    'rating-review': { padding: '1.25', margin: '0', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }
  }
  return defaults[type] || {}
}
