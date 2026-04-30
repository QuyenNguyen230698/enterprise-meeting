import type { PortfolioData } from './portfolioData'

export const ducAnhEnData: PortfolioData = {
  hero: {
    name: 'Lê Đức Anh',
    initials: 'DA',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/a7caeb4f-e2d0-4360-ad2e-a7b658af8a00/2K',
    title: 'Full Stack Engineer',
    location: 'Ho Chi Minh City, Vietnam',
    tagline: 'Building enterprise solutions across Web, Mobile Apps, WebApps, CRM, HRM, Email Builders, and immersive 3D VR/AR experiences',
    highlights: [
      'Web Applications',
      'Mobile Apps',
      'WebApps',
      'CRM Systems',
      'HRM Platforms',
      'Email Builders',
      '3D VR/AR Experiences'
    ],
    stats: [
      { value: '4+', label: 'Years Exp' },
      { value: '20+', label: 'Projects' },
      { value: '10+', label: 'Technologies' }
    ],
    availability: {
      status: true,
      text: 'Available for hire'
    },
    contact: {
      email: 'anh.leduc2512@gmail.com',
      phone: '0931866698'
    }
  },

  skills: {
    categories: [
      {
        name: 'Frontend & Creative',
        icon: 'bi-code-slash',
        gradient: { from: 'emerald-500', to: 'blue-500' },
        skills: [
          { name: 'VueJS', highlight: true },
          { name: 'NuxtJS', highlight: true },
          { name: 'ThreeJS', highlight: true },
          { name: 'Store Pinia', highlight: true },
          { name: 'WebGL' },
          { name: 'JavaScript (ES6+)' },
          { name: 'HTML5 & CSS3' },
          { name: 'Tailwind CSS' },
          { name: 'Bootstrap 5' },
          { name: 'Syncfusion EJ2' },
          { name: 'MJML' },
          { name: 'ESJ' },
          { name: 'GSAP' }
        ]
      },
      {
        name: 'Backend & System',
        icon: 'bi-server',
        gradient: { from: 'purple-500', to: 'pink-500' },
        skills: [
          { name: 'Node.js', highlight: true },
          { name: 'Python' },
          { name: 'Express', highlight: true },
          { name: 'Microservices', highlight: true },
          { name: 'RESTful APIs', highlight: true },
          { name: 'GraphQL' },
          { name: 'Node-RED' },
          { name: 'WebSockets' },
          { name: 'JWT Auth' },
          { name: 'MongoDB', highlight: true },
          { name: 'SQL Server' },
          { name: 'Redis' }
        ]
      },
      {
        name: 'Platforms & Tools',
        icon: 'bi-grid-3x3-gap',
        gradient: { from: 'cyan-500', to: 'teal-500' },
        skills: [
          { name: 'Shopify (Liquid)', highlight: true },
          { name: 'Odoo ERP' },
          { name: 'WordPress' },
          { name: 'Metabase' },
          { name: 'Git & GitHub' }
        ]
      },
      {
        name: 'DevOps & Cloud',
        icon: 'bi-cloud-fill',
        gradient: { from: 'orange-500', to: 'amber-500' },
        skills: [
          { name: 'Docker' },
          { name: 'Linux Server', highlight: true },
          { name: 'Nginx' },
          { name: 'GitHub Actions' },
          { name: 'Azure' },
          { name: 'Cloudflare Pages', highlight: true },
          { name: 'Cloudflare Workers' },
          { name: 'Cloudflare R2' },
          { name: 'Cloudinary' }
        ]
      }
    ]
  },

  experience: {
    jobs: [
      {
        title: 'Full Stack Engineer',
        company: 'Tran Duc Corporation',
        type: 'Full-time',
        period: { start: 'Jun 2024', end: 'Present', duration: '1 yr 8 mos' },
        location: 'Ho Chi Minh City, Vietnam · On-site',
        current: true,
        highlights: [
          { category: 'E-Commerce & CMS Architecture', description: 'Designed scalable Shopify and WordPress solutions, developing high-performance custom themes and apps that streamlined content delivery and enhanced brand consistency globally.' },
          { category: 'Meta-Driven Component Architecture', description: 'Engineered a highly flexible UI system where components are dynamically rendered and versioned via metadata configurations (Metafields/JSON Schemas). This architecture maximized code reusability and provided a convenient, automated workflow for managing complex layout variations without manual code updates.' },
          { category: 'Immersive Tech (VR/AR)', description: 'Pioneered interactive product showcases using Three.js and WebGL, creating 3D visualizations that significantly improved user engagement and retention.' },
          { category: 'Enterprise System Development', description: 'Architected secure, API-first microservices and corporate management tools using Node.js and Vue.js with JWT authentication.' },
          { category: 'Marketing Automation', description: 'Built a full-stack platform featuring a custom Mail Marketing App and Drag-and-Drop Landing Page Builder to boost conversion rates.' },
          { category: 'Operations & Logistics (ERP/OMS/WMS)', description: 'Developed mission-critical systems including Order Management (OMS) and Warehouse Management (WMS). Tailored Odoo ERP workflows to automate multi-channel invoicing, shipping, and inventory synchronization.' },
          { category: 'Integrations & Payments', description: 'Integrated complex 3rd-party APIs for 3PL logistics and global payment gateways, ensuring real-time fulfillment and frictionless transactions.' },
          { category: 'DevOps & Infrastructure', description: 'Orchestrated CI/CD pipelines via Cloudflare and GitHub Actions on Linux servers, ensuring auto-scaling, rapid deployment, and high security.' }
        ],
        techStack: ['Vue.js', 'Nuxt.js', 'Three.js (VR/AR)', 'GSAP', 'Tailwind CSS', 'Bootstrap', 'EJ2 Syncfusion', 'Node.js', 'Python', 'Express', 'Socket.io', 'Redis', 'MongoDB', 'SQL Server', 'Shopify (Liquid/Hydrogen)', 'Odoo ERP', 'WordPress', 'Linux', 'Docker', 'Cloudflare CI/CD']
      },
      {
        title: 'Business Solution Programmer',
        company: 'TTT Corporation',
        type: 'Full-time',
        period: { start: 'May 2023', end: 'Jun 2024', duration: '1 yr 2 mos' },
        location: 'Ho Chi Minh City, Vietnam',
        current: false,
        highlights: [
          { category: 'Enterprise Application Architecture', description: 'Architected and deployed a suite of mission-critical platforms—including HRM, CRM, Construction Rating, and Recruiting systems—optimizing cross-departmental workflows and driving organizational efficiency.' },
          { category: 'Scalable Front-End Ecosystems', description: 'Designed high-performance front-end architectures leveraging Nuxt.js and Vue.js integrated with Syncfusion EJ2. Crafted responsive, accessible (A11y), and consistent user interfaces using Bootstrap 5.' },
          { category: 'Email & Communication Systems', description: 'Engineered responsive email template systems using MJML, ensuring cross-client compatibility and seamless corporate communication standards.' },
          { category: 'Business Intelligence & Analytics', description: 'Developed sophisticated reporting dashboards powered by Metabase, delivering real-time analytics and actionable insights to executive leadership for data-informed strategic planning.' },
          { category: 'Backend & Workflow Automation', description: 'Built robust back-end services using Node.js and Express. Utilized Node-RED to orchestrate complex visual workflows and automate real-time API integrations, significantly enhancing operational agility.' },
          { category: 'Database Management', description: 'Designed and managed high-availability SQL Server databases, ensuring data integrity, optimizing query performance for heavy workloads, and enforcing strict enterprise security compliance.' }
        ],
        techStack: ['Vue.js', 'Nuxt.js', 'Syncfusion EJ2', 'Bootstrap 5', 'MJML', 'Node.js', 'Express', 'Node-RED', 'SQL Server', 'Metabase']
      },
      {
        title: 'Website Developer',
        company: 'CÔNG TY TNHH DV GALAXY DR',
        type: 'Full-time',
        period: { start: 'Oct 2021', end: 'Apr 2023', duration: '1 yr 7 mos' },
        location: 'Ho Chi Minh City, Vietnam',
        current: false,
        highlights: [
          { category: 'HRM System', description: 'Architected a robust HRM system incorporating seamless onboarding, performance tracking, and payroll integrations, optimizing employee lifecycle management and minimizing manual processes for greater operational agility.' },
          { category: 'Process Management Platform', description: 'Developed a Process Management platform to automate workflows, task delegation, and approval cycles, elevating efficiency, visibility, and cross-functional alignment across teams.' },
          { category: 'Internal Social Network', description: 'Built an Internal Social Network solution with integrated messaging, forums, and file-sharing capabilities, promoting collaborative culture, knowledge dissemination, and enhanced team connectivity.' },
          { category: 'Corporate Website', description: 'Designed and maintained the corporate website featuring responsive, intuitive interfaces and embedded content management systems, ensuring superior user experiences and streamlined digital presence.' },
          { category: 'Calling Report System', description: 'Engineered a Calling Report System providing real-time insights into call metrics, including volume, duration, and results, empowering informed strategies and performance optimization.' },
          { category: 'Call Service Application', description: 'Created a Call Service application for handling inbound and outbound communications, with live logging, monitoring, and analytics to drive service excellence and operational oversight.' }
        ],
        techStack: ['HTML', 'JavaScript', 'Bootstrap', 'MongoDB', 'EJS']
      }
    ]
  },

  education: {
    schools: [
      {
        name: 'HUTECH - Ho Chi Minh City University of Technology',
        degree: "Bachelor's Degree in Information Technology",
        period: { start: '2016', end: '2020' }
      }
    ]
  },

  footer: {
    cta: {
      title: "Let's work together",
      description: "I'm currently available for freelance projects and full-time opportunities"
    },
    copyright: '© 2024 Le Duc Anh. All rights reserved.'
  }
}

export const ducAnhViData: PortfolioData = {
  hero: {
    name: 'Lê Đức Anh',
    initials: 'DA',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/a7caeb4f-e2d0-4360-ad2e-a7b658af8a00/2K',
    title: 'Full Stack Engineer',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    tagline: 'Xây dựng giải pháp doanh nghiệp trên Web, Mobile App, WebApp, CRM, HRM, Email Builder và trải nghiệm 3D VR/AR sống động.',
    highlights: [
      'Web Applications',
      'Mobile Apps',
      'WebApps',
      'Hệ Thống CRM',
      'Nền Tảng HRM',
      'Email Builders',
      'Trải Nghiệm 3D VR/AR'
    ],
    stats: [
      { value: '4+', label: 'Năm Kinh Nghiệm' },
      { value: '20+', label: 'Dự Án' },
      { value: '10+', label: 'Công Nghệ' }
    ],
    availability: {
      status: true,
      text: 'Sẵn sàng nhận việc'
    },
    contact: {
      email: 'anh.leduc2512@gmail.com',
      phone: '0931866698'
    }
  },

  skills: {
    categories: [
      {
        name: 'Frontend & Creative',
        icon: 'bi-code-slash',
        gradient: { from: 'emerald-500', to: 'blue-500' },
        skills: [
          { name: 'VueJS', highlight: true },
          { name: 'NuxtJS', highlight: true },
          { name: 'ThreeJS', highlight: true },
          { name: 'Store Pinia', highlight: true },
          { name: 'WebGL' },
          { name: 'JavaScript (ES6+)' },
          { name: 'HTML5 & CSS3' },
          { name: 'Tailwind CSS' },
          { name: 'Bootstrap 5' },
          { name: 'Syncfusion EJ2' },
          { name: 'MJML' },
          { name: 'ESJ' },
          { name: 'GSAP' }
        ]
      },
      {
        name: 'Backend & System',
        icon: 'bi-server',
        gradient: { from: 'purple-500', to: 'pink-500' },
        skills: [
          { name: 'Node.js', highlight: true },
          { name: 'Python' },
          { name: 'Express', highlight: true },
          { name: 'Microservices', highlight: true },
          { name: 'RESTful APIs', highlight: true },
          { name: 'GraphQL' },
          { name: 'Node-RED' },
          { name: 'WebSockets' },
          { name: 'JWT Auth' },
          { name: 'MongoDB', highlight: true },
          { name: 'SQL Server' },
          { name: 'Redis' }
        ]
      },
      {
        name: 'Platforms & Tools',
        icon: 'bi-grid-3x3-gap',
        gradient: { from: 'cyan-500', to: 'teal-500' },
        skills: [
          { name: 'Shopify (Liquid)', highlight: true },
          { name: 'Odoo ERP' },
          { name: 'WordPress' },
          { name: 'Metabase' },
          { name: 'Git & GitHub' }
        ]
      },
      {
        name: 'DevOps & Cloud',
        icon: 'bi-cloud-fill',
        gradient: { from: 'orange-500', to: 'amber-500' },
        skills: [
          { name: 'Docker' },
          { name: 'Linux Server', highlight: true },
          { name: 'Nginx' },
          { name: 'GitHub Actions' },
          { name: 'Azure' },
          { name: 'Cloudflare Pages', highlight: true },
          { name: 'Cloudflare Workers' },
          { name: 'Cloudflare R2' },
          { name: 'Cloudinary' }
        ]
      }
    ]
  },

  experience: {
    jobs: [
      {
        title: 'Full Stack Engineer',
        company: 'Công Ty CP Trần Đức',
        type: 'Full-time',
        period: { start: 'T6 2024', end: 'Hiện tại', duration: '1 năm 8 tháng' },
        location: 'TP. Hồ Chí Minh, Việt Nam · onsite',
        current: true,
        highlights: [
          { category: 'Kiến Trúc E-Commerce & CMS', description: 'Thiết kế các giải pháp Shopify và WordPress mở rộng, phát triển các theme và ứng dụng tùy chỉnh hiệu năng cao giúp tối ưu hóa việc phân phối nội dung và nâng cao nhận diện thương hiệu toàn cầu.' },
          { category: 'Kiến Trúc Component Meta-Driven', description: 'Xây dựng hệ thống UI linh hoạt nơi các thành phần được render động và kiểm soát phiên bản thông qua cấu hình metadata (Metafields/JSON Schemas). Kiến trúc này tối đa hóa khả năng tái sử dụng code và cung cấp quy trình tự động thuận tiện để quản lý các biến thể layout phức tạp mà không cần cập nhật code thủ công.' },
          { category: 'Công Nghệ Tương Tác (VR/AR)', description: 'Tiên phong trong việc trình diễn sản phẩm tương tác sử dụng Three.js và WebGL, tạo ra các hình ảnh 3D giúp cải thiện đáng kể sự tương tác và giữ chân người dùng.' },
          { category: 'Phát Triển Hệ Thống Doanh Nghiệp', description: 'Kiến trúc các microservices API-first bảo mật và các công cụ quản lý doanh nghiệp sử dụng Node.js và Vue.js với xác thực JWT.' },
          { category: 'Tự Động Hóa Tiếp Thị', description: 'Xây dựng nền tảng full-stack với ứng dụng Mail Marketing tùy chỉnh và trình tạo Landing Page kéo thả để tăng tỷ lệ chuyển đổi.' },
          { category: 'Vận Hành & Logistics (ERP/OMS/WMS)', description: 'Phát triển các hệ thống quan trọng bao gồm Quản Lý Đơn Hàng (OMS) và Quản Lý Kho (WMS). Tùy chỉnh quy trình Odoo ERP để tự động hóa việc xuất hóa đơn đa kênh, vận chuyển và đồng bộ hóa tồn kho.' },
          { category: 'Tích Hợp & Thanh Toán', description: 'Tích hợp các API bên thứ 3 phức tạp cho logistics 3PL và cổng thanh toán toàn cầu, đảm bảo hoàn tất đơn hàng theo thời gian thực và giao dịch liền mạch.' },
          { category: 'DevOps & Hạ Tầng', description: 'Vận hành các pipeline CI/CD qua Cloudflare và GitHub Actions trên máy chủ Linux, đảm bảo khả năng tự động mở rộng, triển khai nhanh và bảo mật cao.' }
        ],
        techStack: ['Vue.js', 'Nuxt.js', 'Three.js (VR/AR)', 'GSAP', 'Tailwind CSS', 'Bootstrap', 'EJ2 Syncfusion', 'Node.js', 'Python', 'Express', 'Socket.io', 'Redis', 'MongoDB', 'SQL Server', 'Shopify (Liquid/Hydrogen)', 'Odoo ERP', 'WordPress', 'Linux', 'Docker', 'Cloudflare CI/CD']
      },
      {
        title: 'Lập Trình Viên Giải Pháp Kinh Doanh',
        company: 'Công Ty CP TTT',
        type: 'Toàn thời gian',
        period: { start: 'T5 2023', end: 'T6 2024', duration: '1 năm 2 tháng' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: false,
        highlights: [
          { category: 'Kiến Trúc Ứng Dụng Doanh Nghiệp', description: 'Kiến trúc và triển khai bộ nền tảng quan trọng—bao gồm hệ thống HRM, CRM, Đánh Giá Thi Công và Tuyển Dụng—tối ưu hóa quy trình làm việc liên phòng ban và thúc đẩy hiệu quả tổ chức.' },
          { category: 'Hệ Sinh Thái Front-End Mở Rộng', description: 'Thiết kế kiến trúc front-end hiệu năng cao tận dụng Nuxt.js và Vue.js tích hợp với Syncfusion EJ2. Tạo ra giao diện người dùng thống nhất, dễ tiếp cận (A11y) và phản hồi nhanh sử dụng Bootstrap 5.' },
          { category: 'Hệ Thống Email & Truyền Thông', description: 'Xây dựng hệ thống template email phản hồi nhanh sử dụng MJML, đảm bảo tương thích trên các ứng dụng email và tiêu chuẩn truyền thông doanh nghiệp liền mạch.' },
          { category: 'Trí Tuệ Doanh Nghiệp & Phân Tích', description: 'Phát triển các dashboard báo cáo tinh vi hỗ trợ bởi Metabase, cung cấp phân tích thời gian thực và thông tin chi tiết cho ban lãnh đạo để lập kế hoạch chiến lược dựa trên dữ liệu.' },
          { category: 'Backend & Tự Động Hóa Quy Trình', description: 'Xây dựng các dịch vụ back-end mạnh mẽ sử dụng Node.js và Express. Sử dụng Node-RED để điều phối các quy trình trực quan phức tạp và tự động hóa tích hợp API thời gian thực, nâng cao đáng kể sự linh hoạt trong vận hành.' },
          { category: 'Quản Lý Cơ Sở Dữ Liệu', description: 'Thiết kế và quản lý cơ sở dữ liệu SQL Server tính sẵn sàng cao, đảm bảo toàn vẹn dữ liệu, tối ưu hóa hiệu suất truy vấn cho khối lượng công việc lớn và tuân thủ bảo mật doanh nghiệp nghiêm ngặt.' }
        ],
        techStack: ['Vue.js', 'Nuxt.js', 'Syncfusion EJ2', 'Bootstrap 5', 'MJML', 'Node.js', 'Express', 'Node-RED', 'SQL Server', 'Metabase']
      },
      {
        title: 'Lập Trình Viên Website',
        company: 'CÔNG TY TNHH DV GALAXY DR',
        type: 'Toàn thời gian',
        period: { start: 'T10 2021', end: 'T4 2023', duration: '1 năm 7 tháng' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: false,
        highlights: [
          { category: 'Hệ Thống HRM', description: 'Kiến trúc một hệ thống HRM mạnh mẽ kết hợp quy trình giới thiệu nhân viên, theo dõi hiệu suất và tích hợp bảng lương liền mạch, tối ưu hóa việc quản lý vòng đời nhân viên và giảm thiểu các quy trình thủ công.' },
          { category: 'Nền Tảng Quản Lý Quy Trình', description: 'Phát triển nền tảng Quản Lý Quy Trình để tự động hóa quy trình làm việc, giao việc và chu kỳ phê duyệt, nâng cao hiệu quả, khả năng hiển thị và sự liên kết giữa các nhóm.' },
          { category: 'Mạng Xã Hội Nội Bộ', description: 'Xây dựng giải pháp Mạng Xã Hội Nội Bộ tích hợp nhắn tin, diễn đàn và chia sẻ tệp, thúc đẩy văn hóa hợp tác, lan tỏa kiến thức và kết nối nhóm tốt hơn.' },
          { category: 'Website Doanh Nghiệp', description: 'Thiết kế và duy trì website doanh nghiệp với giao diện trực quan, phản hồi nhanh và hệ thống quản lý nội dung nhúng, đảm bảo trải nghiệm người dùng vượt trội và sự hiện diện số được tối ưu hóa.' },
          { category: 'Hệ Thống Báo Cáo Cuộc Gọi', description: 'Xây dựng Hệ Thống Báo Cáo Cuộc Gọi cung cấp thông tin chi tiết thời gian thực về các chỉ số cuộc gọi, bao gồm khối lượng, thời lượng và kết quả, hỗ trợ chiến lược thông tin và tối ưu hóa hiệu suất.' },
          { category: 'Ứng Dụng Dịch Vụ Cuộc Gọi', description: 'Tạo ứng dụng Dịch Vụ Cuộc Gọi để xử lý giao tiếp đến và đi, với ghi nhật ký trực tiếp, giám sát và phân tích để thúc đẩy sự xuất sắc của dịch vụ và giám sát hoạt động.' }
        ],
        techStack: ['HTML', 'JavaScript', 'Bootstrap', 'MongoDB', 'EJS']
      }
    ]
  },

  education: {
    schools: [
      {
        name: 'HUTECH - Đại học Công nghệ TP.HCM',
        degree: 'Bằng Cử Nhân Công Nghệ Thông Tin',
        period: { start: '2016', end: '2020' }
      }
    ]
  },

  footer: {
    cta: {
      title: 'Hãy cùng hợp tác',
      description: 'Tôi hiện đang sẵn sàng cho các dự án freelance và cơ hội toàn thời gian'
    },
    copyright: '© 2024 Lê Đức Anh. All rights reserved.'
  }
}
