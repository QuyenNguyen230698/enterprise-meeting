// Portfolio data for Thu Ha - Graphic Designer & Illustrator

export const thuHaViData = {
  hero: {
    name: 'Thư Hạ',
    initials: 'TH',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/7b40a5c1-29ea-4830-5a47-fbb92fe50900/2K', // Replace with actual avatar
    title: 'Graphic Designer & Illustrator',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    tagline: 'Graphic Designer & Illustrator với hơn 4 năm kinh nghiệm trong thiết kế branding và marketing. Chuyên tạo ra các nhận diện thương hiệu mạnh mẽ, key visuals và bao bì hỗ trợ định vị thương hiệu và chiến dịch marketing, đặc biệt cho các thương hiệu F&B và lifestyle. Có kinh nghiệm làm việc tại agency, in-house và freelance, mang đến các sản phẩm thiết kế chất lượng cao và nhất quán trên cả nền tảng in ấn và digital.',
    highlights: [
      'Branding – Packaging – Illustration',
      'Key Visual & POSM Design',
      'UI/UX Design',
      'Print & Digital Assets'
    ],
    stats: [
      { value: '4+', label: 'Năm KN' },
      { value: '5+', label: 'Công ty' },
      { value: '100+', label: 'Dự án' }
    ],
    availability: { status: true, text: 'Sẵn sàng nhận việc' },
    contact: {
      email: 'thuha.des@gmail.com',
      phone: '0916475052',
      linkedin: 'https://linkedin.com/in/thuha',
      github: '',
      portfolio: 'https://drive.google.com/file/d/1ojS5yiAPAQItY6uFSTHnDJ-eqWkjXeZA/view?usp=sharing'
    }
  },
  skills: {
    title: 'Kỹ Năng',
    categories: [
      {
        name: 'Thiết Kế Đồ Họa',
        icon: 'bi-palette',
        gradient: { from: 'purple-600', to: 'pink-500' },
        skills: [
          { name: 'Branding & Visual Identity', highlight: true },
          { name: 'Packaging Design', highlight: true },
          { name: 'Layout & Typography', highlight: false },
          { name: 'Concept Development', highlight: false }
        ]
      },
      {
        name: 'Illustration',
        icon: 'bi-brush',
        gradient: { from: 'orange-500', to: 'red-500' },
        skills: [
          { name: 'Digital Illustration', highlight: true },
          { name: 'Hand-drawing', highlight: true },
          { name: 'Character Design', highlight: false },
          { name: 'Vector Art', highlight: false }
        ]
      },
      {
        name: 'Phần Mềm Chính',
        icon: 'bi-laptop',
        gradient: { from: 'blue-600', to: 'cyan-500' },
        skills: [
          { name: 'Adobe Illustrator', highlight: true },
          { name: 'Adobe Photoshop', highlight: true },
          { name: 'Adobe InDesign', highlight: true },
          { name: 'Figma', highlight: false }
        ]
      },
      {
        name: 'Kỹ Năng Mềm',
        icon: 'bi-people',
        gradient: { from: 'green-600', to: 'teal-500' },
        skills: [
          { name: 'Time Management', highlight: true },
          { name: 'Teamwork', highlight: false },
          { name: 'Communication', highlight: false },
          { name: 'Problem-solving', highlight: false }
        ]
      }
    ]
  },
  experience: {
    title: 'Kinh Nghiệm Làm Việc',
    jobs: [
      {
        title: 'Graphic Designer | UI/UX Designer',
        company: 'TRAN DUC CORPORATION',
        type: 'Toàn thời gian',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        period: { start: '08/2024', end: 'Hiện tại', duration: '6 tháng' },
        current: true,
        highlights: [
          { category: 'Brand System', description: 'Phát triển và duy trì hệ thống thương hiệu của công ty, bao gồm bộ nhận diện và tiêu chuẩn hình ảnh.' },
          { category: 'Marketing Materials', description: 'Thiết kế ấn phẩm showroom và marketing in ấn, cũng như tài sản digital cho các kênh online.' },
          { category: 'Events & Exhibitions', description: 'Sản xuất tài liệu hình ảnh cho các sự kiện, triển lãm và hoạt động kích hoạt thương hiệu.' },
          { category: 'UI/UX Design', description: 'Thiết kế UI website với trọng tâm vào tính nhất quán thương hiệu và khả năng sử dụng.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Adobe InDesign']
      },
      {
        title: 'Creative Designer',
        company: 'ANNAM GOURMET',
        type: 'Toàn thời gian',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        period: { start: '01/2024', end: '06/2024', duration: '6 tháng' },
        current: false,
        highlights: [
          { category: 'Key Visual', description: 'Thiết kế key visuals, POSM và tài liệu marketing cho các chiến dịch retail cao cấp.' },
          { category: 'Visual Concepts', description: 'Phát triển các concept hình ảnh phù hợp với brand guidelines và chủ đề theo mùa.' },
          { category: 'Collaboration', description: 'Phối hợp chặt chẽ với các team marketing và nội bộ để đảm bảo tính nhất quán thiết kế.' },
          { category: 'Delivery', description: 'Cung cấp các tài sản in ấn và digital trong deadline chặt chẽ.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign']
      },
      {
        title: 'Graphic Designer',
        company: 'GOLF GROUP',
        type: 'Toàn thời gian',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        period: { start: '01/2023', end: '12/2023', duration: '1 năm' },
        current: false,
        highlights: [
          { category: 'E-commerce Design', description: 'Tạo các tài sản thiết kế e-commerce như hình ảnh sản phẩm, banner quảng cáo và bố cục chiến dịch để hỗ trợ bán hàng online.' },
          { category: 'Team Collaboration', description: 'Làm việc chặt chẽ với các team marketing và e-commerce để đồng bộ nội dung hình ảnh với mục tiêu chiến dịch và hành trình khách hàng.' },
          { category: 'Brand Consistency', description: 'Duy trì tính nhất quán thương hiệu trên các điểm chạm digital, bao gồm website và các marketplace online.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma']
      },
      {
        title: 'Graphic Designer | Illustrator',
        company: 'MINUDIA CREATIVE AGENCY',
        type: 'Toàn thời gian',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        period: { start: '04/2022', end: '03/2023', duration: '1 năm' },
        current: false,
        highlights: [
          { category: 'Illustration & Design', description: 'Thiết kế illustrations, packaging, POSM và hình ảnh sự kiện cho các dự án branding và marketing.' },
          { category: 'Concept Development', description: 'Hỗ trợ phát triển concept và thực hiện các tài sản hình ảnh cho các deliverables digital và in ấn.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Procreate']
      },
      {
        title: 'Packaging Designer | Illustrator',
        company: 'FRIENDSHIP BAKERY & DESSERTS',
        type: 'Freelance',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        period: { start: '08/2022', end: 'Hiện tại', duration: '3+ năm' },
        current: true,
        highlights: [
          { category: 'Packaging Design', description: 'Chịu trách nhiệm toàn bộ quy trình thiết kế bao bì, bao gồm phát triển layout, tạo concept illustration, thực hiện illustration và chuẩn bị file kỹ thuật cho in ấn.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Procreate']
      }
    ]
  },
  education: {
    title: 'Học Vấn',
    schools: [
      {
        name: 'Đại học Tôn Đức Thắng',
        degree: 'Cử nhân Thiết kế Đồ họa',
        period: { start: '2017', end: '2023' },
        achievements: []
      }
    ]
  },
  certificates: {
    title: 'Chứng Chỉ',
    items: []
  },
  achievements: {
    title: 'Ngôn Ngữ',
    items: [
      'Tiếng Việt - Bản ngữ',
      'Tiếng Anh - Trung cấp'
    ]
  },
  footer: {
    cta: {
      title: 'Hãy Kết Nối!',
      description: 'Sẵn sàng mang đến các thiết kế sáng tạo và chất lượng cao cho thương hiệu của bạn'
    },
    copyright: '© 2026 Thư Hạ. All rights reserved.'
  }
}

export const thuHaEnData = {
  hero: {
    name: 'Thu Ha',
    initials: 'TH',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/7b40a5c1-29ea-4830-5a47-fbb92fe50900/2K', // Replace with actual avatar
    title: 'Graphic Designer & Illustrator',
    location: 'Ho Chi Minh City, Vietnam',
    tagline: 'Graphic Designer & Illustrator with 4+ years of experience in branding and marketing-focused design. Specialized in creating strong visual identities, key visuals, and packaging that support brand positioning and marketing campaigns, particularly for F&B and lifestyle brands. Experienced in agency, in-house, and freelance environments, delivering consistent, high-quality visual assets across print and digital platforms.',
    highlights: [
      'Branding – Packaging – Illustration',
      'Key Visual & POSM Design',
      'UI/UX Design',
      'Print & Digital Assets'
    ],
    stats: [
      { value: '4+', label: 'Years Exp' },
      { value: '5+', label: 'Companies' },
      { value: '100+', label: 'Projects' }
    ],
    availability: { status: true, text: 'Available for work' },
    contact: {
      email: 'thuha.des@gmail.com',
      phone: '0916475052',
      linkedin: 'https://linkedin.com/in/thuha',
      github: '',
      portfolio: 'https://drive.google.com/file/d/1ojS5yiAPAQItY6uFSTHnDJ-eqWkjXeZA/view?usp=sharing'
    }
  },
  skills: {
    title: 'Skills',
    categories: [
      {
        name: 'Graphic Design',
        icon: 'bi-palette',
        gradient: { from: 'purple-600', to: 'pink-500' },
        skills: [
          { name: 'Branding & Visual Identity', highlight: true },
          { name: 'Packaging Design', highlight: true },
          { name: 'Layout & Typography', highlight: false },
          { name: 'Concept Development', highlight: false }
        ]
      },
      {
        name: 'Illustration',
        icon: 'bi-brush',
        gradient: { from: 'orange-500', to: 'red-500' },
        skills: [
          { name: 'Digital Illustration', highlight: true },
          { name: 'Hand-drawing', highlight: true },
          { name: 'Character Design', highlight: false },
          { name: 'Vector Art', highlight: false }
        ]
      },
      {
        name: 'Primary Tools',
        icon: 'bi-laptop',
        gradient: { from: 'blue-600', to: 'cyan-500' },
        skills: [
          { name: 'Adobe Illustrator', highlight: true },
          { name: 'Adobe Photoshop', highlight: true },
          { name: 'Adobe InDesign', highlight: true },
          { name: 'Figma', highlight: false }
        ]
      },
      {
        name: 'Soft Skills',
        icon: 'bi-people',
        gradient: { from: 'green-600', to: 'teal-500' },
        skills: [
          { name: 'Time Management', highlight: true },
          { name: 'Teamwork', highlight: false },
          { name: 'Communication', highlight: false },
          { name: 'Problem-solving', highlight: false }
        ]
      }
    ]
  },
  experience: {
    title: 'Work Experience',
    jobs: [
      {
        title: 'Graphic Designer | UI/UX Designer',
        company: 'TRAN DUC CORPORATION',
        type: 'Full-time',
        location: 'Ho Chi Minh City, Vietnam',
        period: { start: '08/2024', end: 'Present', duration: '6 months' },
        current: true,
        highlights: [
          { category: 'Brand System', description: 'Developed and maintained the company\'s brand system, including brand identity and visual standards.' },
          { category: 'Marketing Materials', description: 'Designed showroom and marketing print materials, as well as digital assets for online channels.' },
          { category: 'Events & Exhibitions', description: 'Produced visual materials for events, exhibitions, and brand activations.' },
          { category: 'UI/UX Design', description: 'Designed website UI with a focus on brand consistency and usability.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Adobe InDesign']
      },
      {
        title: 'Creative Designer',
        company: 'ANNAM GOURMET',
        type: 'Full-time',
        location: 'Ho Chi Minh City, Vietnam',
        period: { start: '01/2024', end: '06/2024', duration: '6 months' },
        current: false,
        highlights: [
          { category: 'Key Visual', description: 'Designed key visuals, POSM and marketing materials for premium retail campaigns.' },
          { category: 'Visual Concepts', description: 'Developed visual concepts aligned with brand guidelines and seasonal themes.' },
          { category: 'Collaboration', description: 'Collaborated closely with marketing and internal teams to ensure design consistency.' },
          { category: 'Delivery', description: 'Delivered print-ready and digital assets under tight deadlines.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign']
      },
      {
        title: 'Graphic Designer',
        company: 'GOLF GROUP',
        type: 'Full-time',
        location: 'Ho Chi Minh City, Vietnam',
        period: { start: '01/2023', end: '12/2023', duration: '1 year' },
        current: false,
        highlights: [
          { category: 'E-commerce Design', description: 'Created e-commerce design assets such as product visuals, promotional banners, and campaign layouts to support online sales.' },
          { category: 'Team Collaboration', description: 'Worked closely with marketing and e-commerce teams to align visual content with campaign objectives and customer journey.' },
          { category: 'Brand Consistency', description: 'Maintained brand consistency across digital touchpoints, including website and online marketplaces.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma']
      },
      {
        title: 'Graphic Designer | Illustrator',
        company: 'MINUDIA CREATIVE AGENCY',
        type: 'Full-time',
        location: 'Ho Chi Minh City, Vietnam',
        period: { start: '04/2022', end: '03/2023', duration: '1 year' },
        current: false,
        highlights: [
          { category: 'Illustration & Design', description: 'Designed illustrations, packaging, POSM, and event visuals for branding and marketing projects.' },
          { category: 'Concept Development', description: 'Supported concept development and executed visual assets for digital and print deliverables.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Procreate']
      },
      {
        title: 'Packaging Designer | Illustrator',
        company: 'FRIENDSHIP BAKERY & DESSERTS',
        type: 'Freelance',
        location: 'Ho Chi Minh City, Vietnam',
        period: { start: '08/2022', end: 'Present', duration: '3+ years' },
        current: true,
        highlights: [
          { category: 'Packaging Design', description: 'Responsible for the full packaging design process, including layout development, illustration concept creation, illustration execution, and technical file preparation for printing.' }
        ],
        techStack: ['Adobe Illustrator', 'Adobe Photoshop', 'Procreate']
      }
    ]
  },
  education: {
    title: 'Education',
    schools: [
      {
        name: 'Ton Duc Thang University',
        degree: 'Bachelor of Graphic Design',
        period: { start: '2017', end: '2023' },
        achievements: []
      }
    ]
  },
  certificates: {
    title: 'Certificates',
    items: []
  },
  achievements: {
    title: 'Languages',
    items: [
      'Vietnamese - Native',
      'English - Intermediate'
    ]
  },
  footer: {
    cta: {
      title: "Let's Connect!",
      description: 'Ready to deliver creative and high-quality designs for your brand'
    },
    copyright: '© 2026 Thu Ha. All rights reserved.'
  }
}
