import type { PortfolioData } from './portfolioData'

// Bùi Hữu Phúc - English Data
export const phucBuiEnData: PortfolioData = {
  hero: {
    name: 'Bùi Hữu Phúc',
    initials: 'BP',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/e81b6c3a-ef45-4c7d-8818-90ecc9659b00/2K',
    title: 'Designer – Multimedia',
    location: '41/2/10 Street 35, KP7, Hiep Binh Chanh, Thu Duc City, HCMC',
    tagline: 'Aspiring to become a professional Multimedia Designer capable of implementing synchronized graphic design – image – video for communication and marketing. In the short term, I want to work in a creative, professional environment to enhance my expertise. In the long term, aiming for Senior Multimedia Designer role, contributing sustainable value to brands and businesses.',
    highlights: [
      '3+ years experience in graphic design and multimedia',
      'Proficient in image-video content production for digital platforms',
      'Good visual thinking, modern aesthetic sense, aligned with brand direction',
      'Able to work independently and collaborate effectively',
      'Proactive, highly responsible with learning spirit'
    ],
    stats: [
      { value: '6+', label: 'Years Exp' },
      { value: '50+', label: 'Projects' },
      { value: '5', label: 'Tools' }
    ],
    availability: {
      status: true,
      text: 'Full-time'
    },
    contact: {
      email: 'buihuuphuc1990@gmail.com',
      phone: '0356 345 009',
      portfolio: 'https://www.behance.net/gallery/206621973/Portfolio-Graphics-Design-Multimedia'
    }
  },
  personalInfo: {
    gender: 'Male',
    birthDate: '1990',
    employmentType: 'Full-time'
  },
  skills: {
    categories: [
      {
        name: 'Graphic Design',
        icon: 'bi-palette',
        gradient: { from: 'indigo-500', to: 'blue-500' },
        skills: [
          { name: 'Communication materials: poster, banner, standee, brochure', highlight: true },
          { name: 'Social media graphics (Facebook, Instagram, TikTok)', highlight: true },
          { name: 'Key visual design for marketing campaigns', highlight: true },
          { name: 'Layout, color, typography understanding' },
          { name: 'Brand identity knowledge' }
        ]
      },
      {
        name: 'Multimedia & Video',
        icon: 'bi-camera-video',
        gradient: { from: 'purple-500', to: 'pink-500' },
        skills: [
          { name: 'Basic filming: lighting setup, frame composition', highlight: true },
          { name: 'Advertising & communication video editing', highlight: true },
          { name: 'Short video editing: Reels, TikTok, Shorts', highlight: true },
          { name: 'Color grading, post-production' }
        ]
      },
      {
        name: 'Photography',
        icon: 'bi-camera',
        gradient: { from: 'pink-500', to: 'rose-500' },
        skills: [
          { name: 'Portrait photography', highlight: true },
          { name: 'Product photography', highlight: true },
          { name: 'Artistic wedding photography', highlight: true }
        ]
      },
      {
        name: 'Software',
        icon: 'bi-laptop',
        gradient: { from: 'cyan-500', to: 'teal-500' },
        skills: [
          { name: 'Adobe Photoshop', highlight: true },
          { name: 'Adobe Illustrator', highlight: true },
          { name: 'Adobe Premiere Pro', highlight: true },
          { name: 'Adobe After Effects', highlight: true },
          { name: 'Adobe Lightroom', highlight: true }
        ]
      }
    ]
  },
  experience: {
    totalYears: 3,
    currentLevel: 'Designer',
    jobs: [
      {
        title: 'Designer – Multimedia',
        company: 'CÔNG TY TNHH SALTMINE VIỆT NAM',
        type: 'Full-time',
        period: { start: '2021', end: 'Present', duration: '3+ years' },
        location: 'Ho Chi Minh City, Vietnam',
        current: true,
        highlights: [
          { category: 'Marketing Design', description: 'Design communication materials for marketing and sales activities' },
          { category: 'Video Production', description: 'Shoot, edit advertising videos, product introduction videos' },
          { category: 'Short Video Content', description: 'Produce short videos for social media platforms' },
          { category: 'Brand Consistency', description: 'Edit images, videos according to brand identity guidelines' },
          { category: 'Campaign Support', description: 'Collaborate with marketing department to build visual content for communication campaigns' }
        ],
        techStack: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere Pro', 'Adobe After Effects', 'Adobe Lightroom']
      },
      {
        title: 'Designer',
        company: 'CÔNG TY TNHH GALAXY DR',
        type: 'Full-time',
        period: { start: '2018', end: '2021', duration: '3 years' },
        location: 'Ho Chi Minh City, Vietnam',
        current: false,
        highlights: [
          { category: 'Graphic Design', description: 'Design advertising graphics for company projects' },
          { category: 'Image Processing', description: 'Process images, edit layout and color according to customer requirements' },
          { category: 'Multimedia Support', description: 'Support multimedia design items' }
        ],
        techStack: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere Pro']
      }
    ]
  },
  education: {
    schools: [
      {
        name: 'Tony Academy',
        degree: 'Photography Certificate - Artistic Wedding Photography',
        period: { start: '2020', end: '2020' }
      },
      {
        name: 'HUTECH University',
        degree: 'Multimedia Certificate - Short Video Production & Editing',
        period: { start: '2019', end: '2019' }
      },
      {
        name: 'HUTECH - Ho Chi Minh City University of Technology',
        degree: "Bachelor's Degree - Interior Design",
        period: { start: '2014', end: '2018' }
      },
      {
        name: 'Hung Vuong Vocational School',
        degree: 'Vocational Diploma - Graphic Design & Advertising',
        period: { start: '2008', end: '2010' }
      }
    ]
  },
  achievements: {
    items: [
      'Enhanced brand image consistency across digital platforms',
      'Contributed to improved marketing communication effectiveness',
      'Ensured project progress and design quality',
      'Received positive feedback from superiors and customers'
    ]
  },
  footer: {
    cta: {
      title: "Let's create something beautiful together",
      description: 'Creative thinking, flexible | Pressure tolerance | Responsible and progressive | Good communication and teamwork'
    },
    copyright: '© 2026 Bùi Hữu Phúc. All rights reserved.'
  }
}

// Bùi Hữu Phúc - Vietnamese Data
export const phucBuiViData: PortfolioData = {
  hero: {
    name: 'Bùi Hữu Phúc',
    initials: 'BP',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/e81b6c3a-ef45-4c7d-8818-90ecc9659b00/2K',
    title: 'Designer – Multimedia',
    location: '41/2/10 Đường 35, KP7, Hiệp Bình Chánh, TP. Thủ Đức, TP.HCM',
    tagline: 'Trở thành Designer – Multimedia chuyên nghiệp, có khả năng triển khai đồng bộ thiết kế đồ họa – hình ảnh – video phục vụ truyền thông và marketing. Trong ngắn hạn, mong muốn làm việc tại môi trường sáng tạo, chuyên nghiệp để nâng cao kỹ năng chuyên môn. Về dài hạn, hướng đến vai trò Senior Multimedia Designer, đóng góp giá trị bền vững cho thương hiệu và doanh nghiệp.',
    highlights: [
      'Hơn 3 năm kinh nghiệm thiết kế đồ họa và multimedia',
      'Thành thạo quy trình sản xuất nội dung hình ảnh – video cho nền tảng số',
      'Tư duy hình ảnh tốt, gu thẩm mỹ hiện đại, bám sát định hướng thương hiệu',
      'Có khả năng làm việc độc lập và phối hợp nhóm hiệu quả',
      'Chủ động, có trách nhiệm cao và tinh thần học hỏi'
    ],
    stats: [
      { value: '3+', label: 'Năm Kinh Nghiệm' },
      { value: '50+', label: 'Dự Án' },
      { value: '5', label: 'Phần Mềm' }
    ],
    availability: {
      status: true,
      text: 'Toàn thời gian'
    },
    contact: {
      email: 'buihuuphuc1990@gmail.com',
      phone: '0356 345 009',
      portfolio: 'https://www.behance.net/gallery/206621973/Portfolio-Graphics-Design-Multimedia'
    }
  },
  personalInfo: {
    gender: 'Nam',
    birthDate: '1990',
    employmentType: 'Toàn thời gian'
  },
  skills: {
    categories: [
      {
        name: 'Graphic Design',
        icon: 'bi-palette',
        gradient: { from: 'indigo-500', to: 'blue-500' },
        skills: [
          { name: 'Thiết kế ấn phẩm truyền thông: poster, banner, standee, brochure', highlight: true },
          { name: 'Thiết kế hình ảnh mạng xã hội (Facebook, Instagram, TikTok)', highlight: true },
          { name: 'Thiết kế key visual cho chiến dịch marketing', highlight: true },
          { name: 'Am hiểu bố cục, màu sắc, typography' },
          { name: 'Nhận diện thương hiệu' }
        ]
      },
      {
        name: 'Multimedia & Video',
        icon: 'bi-camera-video',
        gradient: { from: 'purple-500', to: 'pink-500' },
        skills: [
          { name: 'Quay phim cơ bản: setup ánh sáng, bố cục khung hình', highlight: true },
          { name: 'Dựng và biên tập video quảng cáo, video truyền thông', highlight: true },
          { name: 'Dựng video ngắn: Reels, TikTok, Shorts theo xu hướng', highlight: true },
          { name: 'Chỉnh màu, xử lý hậu kỳ video' }
        ]
      },
      {
        name: 'Nhiếp Ảnh',
        icon: 'bi-camera',
        gradient: { from: 'pink-500', to: 'rose-500' },
        skills: [
          { name: 'Nhiếp ảnh chân dung', highlight: true },
          { name: 'Nhiếp ảnh sản phẩm', highlight: true },
          { name: 'Nhiếp ảnh cưới nghệ thuật', highlight: true }
        ]
      },
      {
        name: 'Phần Mềm Sử Dụng',
        icon: 'bi-laptop',
        gradient: { from: 'cyan-500', to: 'teal-500' },
        skills: [
          { name: 'Adobe Photoshop', highlight: true },
          { name: 'Adobe Illustrator', highlight: true },
          { name: 'Adobe Premiere Pro', highlight: true },
          { name: 'Adobe After Effects', highlight: true },
          { name: 'Adobe Lightroom', highlight: true }
        ]
      }
    ]
  },
  experience: {
    totalYears: 3,
    currentLevel: 'Designer',
    jobs: [
      {
        title: 'Designer – Multimedia',
        company: 'CÔNG TY TNHH SALTMINE VIỆT NAM',
        type: 'Toàn thời gian',
        period: { start: '2021', end: 'Hiện tại', duration: '3+ năm' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: true,
        highlights: [
          { category: 'Thiết kế truyền thông', description: 'Thiết kế các ấn phẩm truyền thông phục vụ hoạt động marketing và bán hàng' },
          { category: 'Sản xuất video', description: 'Quay, dựng và biên tập video quảng cáo, video giới thiệu sản phẩm' },
          { category: 'Video ngắn', description: 'Sản xuất video ngắn cho các nền tảng mạng xã hội' },
          { category: 'Nhận diện thương hiệu', description: 'Chỉnh sửa hình ảnh, video theo bộ nhận diện thương hiệu' },
          { category: 'Hỗ trợ chiến dịch', description: 'Phối hợp với bộ phận marketing xây dựng nội dung hình ảnh cho chiến dịch truyền thông' }
        ],
        techStack: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere Pro', 'Adobe After Effects', 'Adobe Lightroom']
      },
      {
        title: 'Designer',
        company: 'CÔNG TY TNHH GALAXY DR',
        type: 'Toàn thời gian',
        period: { start: '2018', end: '2021', duration: '3 năm' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: false,
        highlights: [
          { category: 'Thiết kế đồ họa', description: 'Thiết kế đồ họa quảng cáo cho các dự án của công ty' },
          { category: 'Xử lý hình ảnh', description: 'Xử lý hình ảnh, chỉnh sửa bố cục và màu sắc theo yêu cầu khách hàng' },
          { category: 'Hỗ trợ đa phương tiện', description: 'Hỗ trợ các hạng mục thiết kế đa phương tiện' }
        ],
        techStack: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe Premiere Pro']
      }
    ]
  },
  education: {
    schools: [
      {
        name: 'Tony Academy',
        degree: 'Chứng chỉ Nhiếp ảnh - Nhiếp ảnh cưới nghệ thuật',
        period: { start: '2020', end: '2020' }
      },
      {
        name: 'Đại học HUTECH',
        degree: 'Chứng chỉ Multimedia - Quay dựng & Biên tập Short Video',
        period: { start: '2019', end: '2019' }
      },
      {
        name: 'Đại học Công Nghệ TP.HCM (HUTECH)',
        degree: 'Cử nhân - Chuyên ngành Thiết kế Nội thất',
        period: { start: '2014', end: '2018' }
      },
      {
        name: 'Trung Cấp Hùng Vương',
        degree: 'Trung cấp - Chuyên ngành Thiết kế Đồ họa – Quảng cáo',
        period: { start: '2008', end: '2010' }
      }
    ]
  },
  achievements: {
    items: [
      'Nâng cao tính đồng bộ hình ảnh thương hiệu trên nền tảng số',
      'Góp phần cải thiện hiệu quả truyền thông và nhận diện thương hiệu',
      'Đảm bảo tiến độ và chất lượng thiết kế cho các dự án',
      'Nhận được phản hồi tích cực từ cấp trên và khách hàng'
    ]
  },
  footer: {
    cta: {
      title: 'Hãy cùng tạo nên điều tuyệt đẹp',
      description: 'Tư duy sáng tạo và linh hoạt | Chịu được áp lực công việc | Có tinh thần trách nhiệm và cầu tiến | Giao tiếp và phối hợp nhóm tốt'
    },
    copyright: '© 2026 Bùi Hữu Phúc. All rights reserved.'
  }
}
