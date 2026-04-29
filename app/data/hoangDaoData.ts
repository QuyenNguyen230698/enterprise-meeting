// Portfolio data for Hoang Dao - Social Media Specialist

export const hoangDaoViData = {
  hero: {
    name: 'Đào Duy Hoàng',
    initials: 'HD',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/a8b7b43e-99c7-4946-e48e-41240ffdc000/2K', // Replace with actual avatar
    title: 'Social Media Specialist',
    location: 'Bình Thạnh, TP. Hồ Chí Minh',
    tagline: 'Là một người trẻ đam mê sáng tạo và tâm huyết với lĩnh vực Marketing. Với 2 năm kinh nghiệm trong ngành, em đã có nền tảng về lên chiến lược, kế hoạch nội dung, phân tích insight và triển khai Ads trên Social Media. Bên cạnh đó, em cũng chủ động học hỏi và rèn luyện các kỹ năng quay dựng, chỉnh sửa video và chụp ảnh nhằm tạo ra nội dung thu hút. Định hướng trở thành Social Media Leader trong 3 năm tới.',
    highlights: [
      'Chiến lược nội dung Social Media',
      'Facebook Ads & Google Ads',
      'SEO & Website Development',
      'Sản xuất nội dung hình ảnh & video'
    ],
    stats: [
      { value: '2+', label: 'Năm KN' },
      { value: '2', label: 'Thương hiệu' },
      { value: '300+', label: 'Followers/Brand' }
    ],
    availability: { status: true, text: 'Sẵn sàng nhận việc' },
    contact: {
      email: 'contact.hoangdao@gmail.com',
      phone: '0387264017',
      linkedin: 'https://linkedin.com/in/hoangdao',
      github: '',
      portfolio: 'https://daoduyhoang.com'
    }
  },
  skills: {
    title: 'Kỹ Năng',
    categories: [
      {
        name: 'Content Marketing',
        icon: 'bi-pencil-square',
        gradient: { from: 'purple-600', to: 'pink-500' },
        skills: [
          { name: 'Content Strategy', highlight: true },
          { name: 'Social Media Planning', highlight: true },
          { name: 'Brand Voice', highlight: false },
          { name: 'Copywriting', highlight: false }
        ]
      },
      {
        name: 'Thiết Kế & Video',
        icon: 'bi-camera-video',
        gradient: { from: 'blue-600', to: 'cyan-500' },
        skills: [
          { name: 'Photoshop', highlight: true },
          { name: 'Canva', highlight: true },
          { name: 'Premiere', highlight: true },
          { name: 'Capcut', highlight: false }
        ]
      },
      {
        name: 'SEO & Analytics',
        icon: 'bi-graph-up-arrow',
        gradient: { from: 'green-600', to: 'teal-500' },
        skills: [
          { name: 'SEO Onpage/Offpage', highlight: true },
          { name: 'Google Analytics', highlight: true },
          { name: 'Semrush', highlight: false },
          { name: 'Google Search Console', highlight: false },
          { name: 'Fanpage Karma', highlight: false }
        ]
      },
      {
        name: 'Digital Advertising',
        icon: 'bi-bullseye',
        gradient: { from: 'orange-500', to: 'red-500' },
        skills: [
          { name: 'Facebook Ads', highlight: true },
          { name: 'Google Ads', highlight: true },
          { name: 'Campaign Optimization', highlight: false },
          { name: 'Landing Page', highlight: false }
        ]
      }
    ]
  },
  experience: {
    title: 'Kinh Nghiệm Làm Việc',
    jobs: [
      {
        title: 'Nhân viên Social Media',
        company: 'CÔNG TY CỔ PHẦN TRẦN ĐỨC',
        type: 'Toàn thời gian',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        period: { start: '06/2025', end: '02/2026', duration: '9 tháng' },
        current: true,
        highlights: [
          { category: 'Social Media', description: 'Triển khai Social Media cho hai thương hiệu TD CASA & VERITA. Vận hành và phát triển fanpage Facebook cùng các kênh social khác. Tăng trưởng 300+ followers/brand trong 3 tháng từ con số 0.' },
          { category: 'Content Strategy', description: 'Xây dựng & triển khai chiến lược nội dung thương hiệu, đảm bảo brand voice và hình ảnh truyền thông nhất quán trên toàn bộ kênh digital.' },
          { category: 'Digital Ads', description: 'Lập kế hoạch, phân bổ ngân sách và trực tiếp triển khai Facebook Ads & Google Ads theo từng giai đoạn phễu; theo dõi, phân tích và tối ưu các chỉ số.' },
          { category: 'SEO Website', description: 'Xây dựng và triển khai nội dung website chuẩn SEO nhằm hỗ trợ quảng cáo và gia tăng hiệu quả tiếp cận tự nhiên.' },
          { category: 'Content Production', description: 'Thiết kế hình ảnh và biên tập video theo kế hoạch nội dung đã đề ra, đảm bảo phù hợp với định vị và mục tiêu truyền thông của từng thương hiệu.' }
        ],
        techStack: ['Facebook Ads', 'Google Ads', 'Photoshop', 'Premiere', 'Canva', 'WordPress']
      },
      {
        title: 'Nhân viên Marketing',
        company: 'CÔNG TY CỔ PHẦN ĐẦU TƯ BIỂU TƯỢNG VÀNG',
        type: 'Toàn thời gian',
        location: 'TP. Hồ Chí Minh, Việt Nam',
        period: { start: '03/2024', end: '05/2025', duration: '1 năm 2 tháng' },
        current: false,
        highlights: [
          { category: 'Fanpage Management', description: 'Phát triển kế hoạch nội dung, quản lý đăng bài, tương tác khách hàng. Đạt reach tự nhiên 600-1200/bài, tăng 500 follow/tháng qua phối hợp chạy ads.' },
          { category: 'Content Production', description: 'Chụp ảnh sản phẩm, biên tập video quảng cáo. Cải thiện chất lượng bài đăng, hỗ trợ tăng tương tác khách hàng.' },
          { category: 'Ads Optimization', description: 'Lên chiến lược và kế hoạch quảng cáo Google Ads. Phân tích, đánh giá chỉ số của các chiến dịch quảng cáo và đưa ra đề xuất giải pháp.' },
          { category: 'SEO Website', description: 'Triển khai SEO website Thinkbag.vn. Tăng trưởng 2500 lượt truy cập/tháng từ mức 0 sau 7 tháng. Đạt top 1 từ khóa "vải xước là gì", Top 2 từ khóa "túi vải đay".' },
          { category: 'Landing Page', description: 'Thiết kế layout website, cải thiện UI/UX bằng WordPress. Xây dựng landing page tối ưu hóa chuyển đổi hỗ trợ chiến dịch quảng cáo.' }
        ],
        techStack: ['Google Ads', 'Facebook Ads', 'WordPress', 'SEO', 'Google Analytics', 'Semrush']
      }
    ]
  },
  education: {
    title: 'Học Vấn',
    schools: [
      {
        name: 'Cao đẳng FPT Polytechnic',
        degree: 'Chuyên ngành Marketing - Tốt nghiệp loại Giỏi',
        period: { start: '2021', end: '2024' },
        achievements: ['Tốt nghiệp loại Giỏi']
      }
    ]
  },
  certificates: {
    title: 'Chứng Chỉ',
    items: [
      {
        name: 'Facebook Ads & Facebook Marketing MASTERY 2024',
        institution: 'Online Course',
        date: '2024'
      }
    ]
  },
  achievements: {
    title: 'Hoạt Động',
    items: [
      'Dự án thiện nguyện "Món quà nhỏ Hạnh phúc to" - Quyên góp cho mái ấm "Thiện Duyên" qua hình thức bán hàng (08/2023)',
      'Lọt vào vòng bán kết cuộc thi Startup Kite năm 2023 cấp cơ sở tại trường FPT Polytechnic (07/2023)'
    ]
  },
  footer: {
    cta: {
      title: 'Hãy Kết Nối!',
      description: 'Sẵn sàng đóng góp vào sự phát triển của doanh nghiệp bạn với đam mê sáng tạo và kỹ năng Social Media'
    },
    copyright: '© 2026 Đào Duy Hoàng. All rights reserved.'
  }
}

export const hoangDaoEnData = {
  hero: {
    name: 'Dao Duy Hoang',
    initials: 'HD',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/a8b7b43e-99c7-4946-e48e-41240ffdc000/2K', // Replace with actual avatar
    title: 'Social Media Specialist',
    location: 'Binh Thanh District, Ho Chi Minh City, Vietnam',
    tagline: 'A creative young professional passionate about Marketing. With 2 years of experience in the industry, I have built a solid foundation in strategy development, content planning, insight analysis, and Social Media Ads deployment. Additionally, I proactively learn and practice skills in video shooting, editing, and photography to create engaging content. Aiming to become a Social Media Leader in the next 3 years.',
    highlights: [
      'Social Media Content Strategy',
      'Facebook Ads & Google Ads',
      'SEO & Website Development',
      'Image & Video Content Production'
    ],
    stats: [
      { value: '2+', label: 'Years Exp' },
      { value: '2', label: 'Brands' },
      { value: '300+', label: 'Followers/Brand' }
    ],
    availability: { status: true, text: 'Available for work' },
    contact: {
      email: 'contact.hoangdao@gmail.com',
      phone: '0387264017',
      linkedin: 'https://linkedin.com/in/hoangdao',
      github: '',
      portfolio: 'https://daoduyhoang.com'
    }
  },
  skills: {
    title: 'Skills',
    categories: [
      {
        name: 'Content Marketing',
        icon: 'bi-pencil-square',
        gradient: { from: 'purple-600', to: 'pink-500' },
        skills: [
          { name: 'Content Strategy', highlight: true },
          { name: 'Social Media Planning', highlight: true },
          { name: 'Brand Voice', highlight: false },
          { name: 'Copywriting', highlight: false }
        ]
      },
      {
        name: 'Design & Video',
        icon: 'bi-camera-video',
        gradient: { from: 'blue-600', to: 'cyan-500' },
        skills: [
          { name: 'Photoshop', highlight: true },
          { name: 'Canva', highlight: true },
          { name: 'Premiere', highlight: true },
          { name: 'Capcut', highlight: false }
        ]
      },
      {
        name: 'SEO & Analytics',
        icon: 'bi-graph-up-arrow',
        gradient: { from: 'green-600', to: 'teal-500' },
        skills: [
          { name: 'SEO Onpage/Offpage', highlight: true },
          { name: 'Google Analytics', highlight: true },
          { name: 'Semrush', highlight: false },
          { name: 'Google Search Console', highlight: false },
          { name: 'Fanpage Karma', highlight: false }
        ]
      },
      {
        name: 'Digital Advertising',
        icon: 'bi-bullseye',
        gradient: { from: 'orange-500', to: 'red-500' },
        skills: [
          { name: 'Facebook Ads', highlight: true },
          { name: 'Google Ads', highlight: true },
          { name: 'Campaign Optimization', highlight: false },
          { name: 'Landing Page', highlight: false }
        ]
      }
    ]
  },
  experience: {
    title: 'Work Experience',
    jobs: [
      {
        title: 'Social Media Specialist',
        company: 'TRAN DUC JOINT STOCK COMPANY',
        type: 'Full-time',
        location: 'Ho Chi Minh City, Vietnam',
        period: { start: '06/2025', end: '02/2026', duration: '9 months' },
        current: true,
        highlights: [
          { category: 'Social Media', description: 'Deployed Social Media for two brands TD CASA & VERITA. Operated and developed Facebook fanpage and other social channels. Achieved 300+ followers/brand growth in 3 months from zero.' },
          { category: 'Content Strategy', description: 'Built & implemented brand content strategy, ensuring consistent brand voice and communication image across all digital channels.' },
          { category: 'Digital Ads', description: 'Planned, allocated budget and directly deployed Facebook Ads & Google Ads according to funnel stages; monitored, analyzed and optimized metrics.' },
          { category: 'SEO Website', description: 'Built and deployed SEO-optimized website content to support advertising and increase organic reach.' },
          { category: 'Content Production', description: 'Designed images and edited videos according to content plan, ensuring alignment with positioning and communication goals of each brand.' }
        ],
        techStack: ['Facebook Ads', 'Google Ads', 'Photoshop', 'Premiere', 'Canva', 'WordPress']
      },
      {
        title: 'Marketing Staff',
        company: 'GOLD SYMBOL INVESTMENT JSC',
        type: 'Full-time',
        location: 'Ho Chi Minh City, Vietnam',
        period: { start: '03/2024', end: '05/2025', duration: '1 year 2 months' },
        current: false,
        highlights: [
          { category: 'Fanpage Management', description: 'Developed content plan, managed posting, customer interaction. Achieved organic reach of 600-1200/post, increased 500 followers/month through ads coordination.' },
          { category: 'Content Production', description: 'Product photography, advertising video editing. Improved post quality, supported customer engagement increase.' },
          { category: 'Ads Optimization', description: 'Developed Google Ads strategy and plan. Analyzed and evaluated campaign metrics and proposed solutions.' },
          { category: 'SEO Website', description: 'Implemented SEO for Thinkbag.vn website. Grew traffic from 0 to 2,500 visits/month after 7 months. Achieved #1 ranking for "vải xước là gì", #2 for "túi vải đay".' },
          { category: 'Landing Page', description: 'Designed website layout, improved UI/UX using WordPress. Built conversion-optimized landing pages to support advertising campaigns.' }
        ],
        techStack: ['Google Ads', 'Facebook Ads', 'WordPress', 'SEO', 'Google Analytics', 'Semrush']
      }
    ]
  },
  education: {
    title: 'Education',
    schools: [
      {
        name: 'FPT Polytechnic College',
        degree: 'Marketing Major - Graduated with Distinction',
        period: { start: '2021', end: '2024' },
        achievements: ['Graduated with Distinction']
      }
    ]
  },
  certificates: {
    title: 'Certificates',
    items: [
      {
        name: 'Facebook Ads & Facebook Marketing MASTERY 2024',
        institution: 'Online Course',
        date: '2024'
      }
    ]
  },
  achievements: {
    title: 'Activities',
    items: [
      'Volunteer project "Small Gift, Big Happiness" - Donated to "Thien Duyen" shelter through sales activities (08/2023)',
      'Reached semi-finals in Startup Kite 2023 competition at FPT Polytechnic (07/2023)'
    ]
  },
  footer: {
    cta: {
      title: "Let's Connect!",
      description: 'Ready to contribute to your business growth with creative passion and Social Media expertise'
    },
    copyright: '© 2026 Dao Duy Hoang. All rights reserved.'
  }
}
