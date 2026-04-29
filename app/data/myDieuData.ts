import type { PortfolioData } from './portfolioData'

export const myDieuViData: PortfolioData = {
  hero: {
    name: 'Lê Thị Mỹ Diệu',
    initials: 'MD',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/5d4f8c68-d06f-45a1-6bd8-e67477847200/2K',
    title: 'Nhân viên Sale Admin Nội Thất',
    location: 'Phú Nhuận TP.HCM',
    tagline: 'Mục tiêu ngắn hạn (2 tháng): Tìm được môi trường làm việc thích hợp, được học tập và làm việc với đội nhóm năng động, tiếp thu nhiều kiến thức sâu rộng về ngành nghề liên quan. Mục tiêu dài hạn (trên 6 tháng): Hoàn thiện kỹ năng giao tiếp và kinh nghiệm đúc kết từng ngày để cống hiến cho công ty đồng thời cố gắng vươn cao lên vị trí quản lý để phát triển, khẳng định bản thân.',
    highlights: [
      'Hỗ trợ hoạt động bán hàng',
      'Quản lý hồ sơ & chứng từ',
      'Theo dõi tiến độ đơn hàng',
      'Báo cáo & phân tích doanh số',
      'Chăm sóc khách hàng',
      'Quản lý công nợ'
    ],
    stats: [
      { value: '9', label: 'Năm Kinh Nghiệm' },
      { value: '100+', label: 'Dự Án' },
      { value: '5', label: 'Công Ty' }
    ],
    availability: {
      status: true,
      text: 'Nhân viên chính thức'
    },
    contact: {
      email: 'dieule2605@gmail.com',
      phone: '0774014888'
    }
  },
  
  personalInfo: {
    gender: 'Nữ',
    birthDate: '17/04/1993',
    maritalStatus: 'Đã kết hôn',
    nationality: 'Người Việt Nam',
    country: 'Việt Nam',
    desiredSalary: '13,000,000 - 15,000,000 VND',
    employmentType: 'Nhân viên chính thức',
    industries: [
      'Mỹ thuật / Nghệ thuật / Thiết kế',
      'Dịch vụ khách hàng',
      'Bán hàng / Kinh doanh'
    ],
    preferredLocations: [
      'Hồ Chí Minh - Quận Phú Nhuận',
      'Hồ Chí Minh - Quận 1',
      'Hồ Chí Minh - Quận 3'
    ]
  },

  skills: {
    categories: [
      {
        name: 'Kỹ Năng Chuyên Môn',
        icon: 'bi-briefcase',
        gradient: { from: 'indigo-500', to: 'blue-500' },
        skills: [
          { name: 'Kỹ năng làm việc độc lập', highlight: true },
          { name: 'Kỹ năng làm việc nhóm', highlight: true },
          { name: 'Kỹ năng thuyết phục', highlight: true },
          { name: 'Kỹ năng giải quyết vấn đề', highlight: true },
          { name: 'Kỹ năng giao tiếp', highlight: true }
        ]
      },
      {
        name: 'Phần Mềm Chuyên Môn',
        icon: 'bi-laptop',
        gradient: { from: 'purple-500', to: 'pink-500' },
        skills: [
          { name: 'Phần mềm AutoCAD', highlight: true },
          { name: 'Phần mềm Photoshop', highlight: true },
          { name: 'Phần mềm SketchUp', highlight: true },
          { name: 'MS Office (Word, Excel, PowerPoint)' },
          { name: 'Odoo ERP' }
        ]
      },
      {
        name: 'Ngôn Ngữ',
        icon: 'bi-translate',
        gradient: { from: 'cyan-500', to: 'teal-500' },
        skills: [
          { name: 'Tiếng Anh - Trung cấp - TOEIC', highlight: true }
        ]
      }
    ]
  },

  experience: {
    totalYears: 9,
    currentLevel: 'Nhân viên',
    jobs: [
      {
        title: 'Sales Admin',
        company: 'TRAN DUC CORPORATION - CÔNG TY CỔ PHẦN TRẦN ĐỨC',
        type: 'Nhân viên chính thức',
        period: { start: '03/2025', end: 'Hiện tại', duration: '10 tháng' },
        location: 'TP. Hồ Chí Minh',
        current: true,
        highlights: [
          { category: '1. Hỗ trợ hoạt động bán hàng', description: 'Tiếp nhận yêu cầu từ đội ngũ Sales và hỗ trợ soạn báo giá, hợp đồng, phiếu đặt hàng trên hệ thống Odoo. Kiểm tra tồn kho sản phẩm, xác nhận tình trạng hàng hóa trước khi báo giá hoặc đặt hàng. Theo dõi chính sách giá, chiết khấu, khuyến mãi theo từng thương hiệu, từng chương trình. Phối hợp với Sales Consultant và Store Manager để đảm bảo thông tin báo giá chính xác.' },
          { category: '2. Quản lý hồ sơ và chứng từ bán hàng', description: 'Lưu trữ, quản lý và cập nhật các hồ sơ: hợp đồng, phiếu đặt hàng, hóa đơn, biên bản bàn giao. Đảm bảo chứng từ đầy đủ trước khi bàn giao cho bộ phận kế toán hoặc giao hàng. Kiểm tra và xử lý các vấn đề liên quan đến hoàn trả hoặc đổi hàng.' },
          { category: '3. Theo dõi tiến độ đơn hàng', description: 'Theo dõi từ khi báo giá, đặt cọc, sản xuất/nhập khẩu cho đến khi giao hàng & lắp đặt. Phối hợp với bộ phận kho, kỹ thuật, logistics để đảm bảo đúng tiến độ. Cập nhật tình trạng đơn hàng và thông báo kịp thời cho khách hàng hoặc Sales phụ trách.' },
          { category: '4. Hỗ trợ báo cáo & phân tích', description: 'Tổng hợp và cập nhật doanh số bán hàng theo từng thương hiệu, sản phẩm, showroom. Lập báo cáo theo ngày, tuần, tháng để gửi cho quản lý. Chuẩn bị dữ liệu để hỗ trợ phòng kế toán, marketing và vận hành.' }
        ],
        techStack: ['Odoo ERP', 'MS Office', 'CRM', 'Quản lý kho', 'Báo cáo doanh số']
      },
      {
        title: 'Trợ lý dự án',
        company: 'Công ty Thiết Kế Nội Thất Artius',
        type: 'Nhân viên chính thức',
        period: { start: '03/2024', end: '03/2025', duration: '1 năm' },
        location: 'TP. Hồ Chí Minh',
        current: false,
        highlights: [
          { category: 'Tư vấn và chăm sóc khách hàng', description: 'Tư vấn và chăm sóc khách hàng từ khi tiếp nhận thông tin, ký kết hợp đồng đến khi thu hồi hết công nợ.' },
          { category: 'Phối hợp thiết kế & thi công', description: 'Tìm hiểu nhu cầu và phối hợp với các bộ phận để tư vấn thiết kế, báo giá, ký kết hợp đồng từ thiết kế đến thi công.' },
          { category: 'Xử lý phản hồi khách hàng', description: 'Tiếp nhận và phối hợp với các bộ phận xử lý các thông tin phản hồi từ khách hàng.' },
          { category: 'Báo cáo công việc', description: 'Báo cáo công việc và kế hoạch làm việc theo tuần. Thực hiện các công việc khác theo chỉ đạo từ TPKD.' }
        ],
        techStack: ['AutoCAD', 'SketchUp', 'Photoshop', 'Quản lý dự án', 'Tư vấn thiết kế']
      },
      {
        title: 'Nhân viên Sale Admin',
        company: 'Công ty Gỗ Phương Đông',
        type: 'Nhân viên chính thức',
        period: { start: '05/2023', end: '12/2023', duration: '8 tháng' },
        location: 'TP. Hồ Chí Minh',
        current: false,
        highlights: [
          { category: 'Hỗ trợ hoạt động phòng kinh doanh', description: 'Chăm sóc & quản trị quan hệ khách hàng.' },
          { category: 'Quản lý hệ thống thông tin', description: 'Quản lý, lưu trữ hệ thống thông tin, soạn thảo các văn bản, giấy tờ nội bộ liên quan đến hoạt động của Phòng kinh doanh.' },
          { category: 'Lập báo giá và hợp đồng', description: 'Lập báo giá theo yêu cầu cấp trên, soạn hợp đồng, biên bản, thông báo...' },
          { category: 'Điều phối đơn hàng', description: 'Phối hợp NVKD theo dõi, điều phối đơn hàng, giao hàng. Theo dõi tình trạng đơn hàng.' },
          { category: 'Theo dõi doanh số', description: 'Theo dõi doanh số của từng nhân viên để thúc đẩy nhân viên theo sát tiến độ bán hàng.' },
          { category: 'Quản lý công nợ', description: 'Theo dõi công nợ từng nhân viên kinh doanh, đôn đốc thu hồi đúng hạn mức thời gian yêu cầu.' },
          { category: 'Phối hợp Marketing', description: 'Phối hợp với bộ phận marketing lên kế hoạch và triển khai các chương trình ưu đãi vào các dịp lễ, tết; tri ân khách hàng; giới thiệu sản phẩm dịch vụ mới để tiếp cận, thu hút các đối tượng khách hàng.' }
        ],
        techStack: ['MS Office', 'CRM', 'Quản lý đơn hàng', 'Báo cáo doanh số']
      },
      {
        title: 'Nhân viên Hỗ trợ Kinh doanh',
        company: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN ĐẦU TƯ ĐỊA ỐC NOVA',
        type: 'Nhân viên chính thức',
        period: { start: '05/2022', end: '12/2022', duration: '8 tháng' },
        location: 'TP. Hồ Chí Minh',
        current: false,
        highlights: [
          { category: 'Quản lý sản phẩm', description: 'Cập nhật tình trạng sản phẩm, cập nhật giỏ hàng, book giỏ hàng, giải quyết những vấn đề liên quan đến sản phẩm.' },
          { category: 'Thủ tục đặt cọc', description: 'Làm thủ tục đặt cọc, chuyển cọc, hỗ trợ nhân viên kinh doanh rà soát giỏ hàng và theo dõi tình trạng thanh toán đặt cọc, ký hợp đồng của khách hàng.' },
          { category: 'Tham gia sự kiện', description: 'Tham gia các event của các dự án khi cần.' },
          { category: 'Soạn thảo văn bản', description: 'Soạn thảo hợp đồng, chính sách, các văn bản của bộ phận kinh doanh theo yêu cầu của trưởng bộ phận.' },
          { category: 'Thiết kế form mẫu', description: 'Hỗ trợ thiết kế các form mẫu, bảng biểu.' },
          { category: 'Lưu trữ hồ sơ', description: 'Lưu trữ, sắp xếp thông tin, giấy tờ, hợp đồng, tài liệu liên quan đến hoạt động bán hàng.' },
          { category: 'Hỗ trợ chương trình KH', description: 'Phối hợp đội bán hàng hỗ trợ các chương trình, hoạt động dành cho khách hàng.' }
        ],
        techStack: ['MS Office', 'Quản lý hồ sơ', 'Thiết kế form']
      },
      {
        title: 'Nhân viên Kinh doanh',
        company: 'Công ty Cổ phần Thương mại Dịch vụ Đất Mới (ALC)',
        type: 'Nhân viên chính thức',
        period: { start: '03/2015', end: '03/2022', duration: '7 năm' },
        location: 'TP. Hồ Chí Minh',
        current: false,
        highlights: [
          { category: 'Báo giá', description: 'Làm báo giá gửi cho khách hàng.' },
          { category: 'Lập đơn hàng', description: 'Tiếp nhận và lập đơn hàng.' },
          { category: 'Làm hợp đồng', description: 'Làm hợp đồng, chuyển sản xuất và hỗ trợ nhân viên kinh doanh chuẩn bị các hồ sơ cần thiết, giải đáp những thắc mắc của khách hàng qua email, điện thoại.' },
          { category: 'Phối hợp sản xuất', description: 'Làm việc với xưởng sản xuất, bộ phận mua hàng về thời gian giao hàng, tiến độ hàng hoá.' },
          { category: 'Theo dõi đơn hàng', description: 'Theo dõi, giám sát đơn hàng để đảm bảo tiến độ giao hàng từ khi báo giá đến khi giao tới khách hàng.' },
          { category: 'Giám sát thi công', description: 'Làm việc với giám sát trong quá trình thi công lắp đặt để nắm thông tin và giải quyết phát sinh, khiếu nại của khách hàng.' },
          { category: 'Quyết toán', description: 'Làm quyết toán và hồ sơ thanh toán, đối chiếu, theo dõi công nợ khách hàng. Tiếp nhận hồ sơ KH từ nhân viên sale.' },
          { category: 'Thu công nợ', description: 'Thu công nợ và đóng hồ sơ.' },
          { category: 'Quản lý sản phẩm trưng bày', description: 'Quản lý hồ sơ, kiểm tra và bảo quản các sản phẩm trưng bày.' },
          { category: 'Báo cáo doanh số', description: 'Báo cáo doanh số hàng tháng.' }
        ],
        techStack: ['MS Office', 'AutoCAD', 'Quản lý đơn hàng', 'Giám sát thi công', 'Thu hồi công nợ']
      }
    ]
  },

  education: {
    highestDegree: 'Cao đẳng',
    graduationDate: '08/2014',
    schools: [
      {
        name: 'Cao Đẳng Bách Việt',
        degree: 'Cao đẳng',
        period: { start: '2011', end: '08/2014' }
      }
    ]
  },

  certificates: {
    items: [
      {
        name: 'Cử nhân - Chuyên ngành Thiết kế Nội thất',
        institution: 'Cao Đẳng Bách Việt',
        date: '05/09/2014',
        expiry: 'Không giới hạn'
      },
      {
        name: 'Dự toán Xây dựng',
        institution: 'Trường Đại Học Xây Dựng',
        date: '21/06/2023',
        expiry: 'Không giới hạn'
      }
    ]
  },

  activities: {
    items: [
      {
        title: 'Thành viên hỗ trợ',
        organization: 'Từ thiện do ALC thành lập',
        period: { start: '03/2017', end: '03/2022' },
        description: 'Tham gia hoạt động tình nguyện, gây quỹ từ công ty cho trẻ em khó khăn ở vùng sâu vùng xa tại các Trường học vào dịp định kỳ do công ty tổ chức.'
      }
    ]
  },

  achievements: {
    items: [
      'Đạt chỉ tiêu công ty đề ra, hoàn thành tốt các nhiệm vụ được giao.'
    ]
  },

  references: {
    items: [
      {
        name: 'Bùi Thị Hải Hoa',
        title: 'Quản lý Showroom',
        company: 'Công ty Cổ phần Thương mại Dịch vụ Đất Mới',
        phone: '0903990036',
        email: 'hoabth@alcvietnam.com'
      }
    ]
  },

  footer: {
    cta: {
      title: 'Sẵn sàng đóng góp và phát triển',
      description: 'Mong muốn làm việc tại môi trường chuyên nghiệp, năng động để phát triển kỹ năng và cống hiến cho công ty'
    },
    copyright: '© 2025 Lê Thị Mỹ Diệu. All rights reserved.'
  }
}

export const myDieuEnData: PortfolioData = {
  hero: {
    name: 'Le Thi My Dieu',
    initials: 'MD',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/5d4f8c68-d06f-45a1-6bd8-e67477847200/2K',
    title: 'Interior Sales Admin',
    location: 'Phu Nhuan District, Ho Chi Minh City, Vietnam',
    tagline: 'Short-term goal (2 months): Find a suitable working environment, learn and work with a dynamic team, gain in-depth knowledge about related industries. Long-term goal (over 6 months): Perfect communication skills and accumulate experience daily to contribute to the company while striving to advance to management positions for development and self-affirmation.',
    highlights: [
      'Sales Support Activities',
      'Document & Records Management',
      'Order Progress Tracking',
      'Reporting & Sales Analysis',
      'Customer Care',
      'Debt Management'
    ],
    stats: [
      { value: '9', label: 'Years Exp' },
      { value: '100+', label: 'Projects' },
      { value: '5', label: 'Companies' }
    ],
    availability: {
      status: true,
      text: 'Full-time Employee'
    },
    contact: {
      email: 'dieule2605@gmail.com',
      phone: '0774014888'
    }
  },

  personalInfo: {
    gender: 'Female',
    birthDate: '17/04/1993',
    maritalStatus: 'Married',
    nationality: 'Vietnamese',
    country: 'Vietnam',
    desiredSalary: '13,000,000 - 15,000,000 VND',
    employmentType: 'Full-time Employee',
    industries: [
      'Art / Arts / Design',
      'Customer Service',
      'Sales / Business'
    ],
    preferredLocations: [
      'Ho Chi Minh City - Phu Nhuan District',
      'Ho Chi Minh City - District 1',
      'Ho Chi Minh City - District 3'
    ]
  },

  skills: {
    categories: [
      {
        name: 'Professional Skills',
        icon: 'bi-briefcase',
        gradient: { from: 'indigo-500', to: 'blue-500' },
        skills: [
          { name: 'Independent Working Skills', highlight: true },
          { name: 'Teamwork Skills', highlight: true },
          { name: 'Persuasion Skills', highlight: true },
          { name: 'Problem Solving Skills', highlight: true },
          { name: 'Communication Skills', highlight: true }
        ]
      },
      {
        name: 'Professional Software',
        icon: 'bi-laptop',
        gradient: { from: 'purple-500', to: 'pink-500' },
        skills: [
          { name: 'AutoCAD', highlight: true },
          { name: 'Photoshop', highlight: true },
          { name: 'SketchUp', highlight: true },
          { name: 'MS Office (Word, Excel, PowerPoint)' },
          { name: 'Odoo ERP' }
        ]
      },
      {
        name: 'Languages',
        icon: 'bi-translate',
        gradient: { from: 'cyan-500', to: 'teal-500' },
        skills: [
          { name: 'English - Intermediate - TOEIC', highlight: true }
        ]
      }
    ]
  },

  experience: {
    totalYears: 9,
    currentLevel: 'Staff',
    jobs: [
      {
        title: 'Sales Admin',
        company: 'TRAN DUC CORPORATION',
        type: 'Full-time Employee',
        period: { start: '03/2025', end: 'Present', duration: '10 months' },
        location: 'Ho Chi Minh City',
        current: true,
        highlights: [
          { category: '1. Sales Support Activities', description: 'Receive requests from Sales team and support preparing quotations, contracts, order forms on Odoo system. Check product inventory, confirm product status before quoting or ordering. Track pricing policies, discounts, promotions by brand and program. Coordinate with Sales Consultant and Store Manager to ensure accurate quotation information.' },
          { category: '2. Sales Document Management', description: 'Store, manage and update records: contracts, order forms, invoices, handover minutes. Ensure complete documents before handing over to accounting or delivery department. Check and handle issues related to returns or exchanges.' },
          { category: '3. Order Progress Tracking', description: 'Track from quotation, deposit, production/import to delivery & installation. Coordinate with warehouse, technical, logistics departments to ensure on-time progress. Update order status and promptly notify customers or responsible Sales.' },
          { category: '4. Reporting & Analysis Support', description: 'Compile and update sales by brand, product, showroom. Prepare daily, weekly, monthly reports for management. Prepare data to support accounting, marketing and operations departments.' }
        ],
        techStack: ['Odoo ERP', 'MS Office', 'CRM', 'Inventory Management', 'Sales Reporting']
      },
      {
        title: 'Project Assistant',
        company: 'Artius Interior Design Company',
        type: 'Full-time Employee',
        period: { start: '03/2024', end: '03/2025', duration: '1 year' },
        location: 'Ho Chi Minh City',
        current: false,
        highlights: [
          { category: 'Customer Consulting & Care', description: 'Consult and care for customers from receiving information, signing contracts to full debt recovery.' },
          { category: 'Design & Construction Coordination', description: 'Understand needs and coordinate with departments for design consultation, quotation, contract signing from design to construction.' },
          { category: 'Customer Feedback Handling', description: 'Receive and coordinate with departments to process customer feedback.' },
          { category: 'Work Reporting', description: 'Report work and weekly work plans. Perform other tasks as directed by Sales Manager.' }
        ],
        techStack: ['AutoCAD', 'SketchUp', 'Photoshop', 'Project Management', 'Design Consultation']
      },
      {
        title: 'Sales Admin Staff',
        company: 'Phuong Dong Wood Company',
        type: 'Full-time Employee',
        period: { start: '05/2023', end: '12/2023', duration: '8 months' },
        location: 'Ho Chi Minh City',
        current: false,
        highlights: [
          { category: 'Business Department Support', description: 'Customer care & relationship management.' },
          { category: 'Information System Management', description: 'Manage, store information system, draft internal documents related to Business Department activities.' },
          { category: 'Quotation & Contract Preparation', description: 'Prepare quotations as required by superiors, draft contracts, minutes, notices...' },
          { category: 'Order Coordination', description: 'Coordinate with Sales staff to track, coordinate orders, deliveries. Track order status.' },
          { category: 'Sales Tracking', description: 'Track sales of each employee to push employees to follow sales progress closely.' },
          { category: 'Debt Management', description: 'Track debts of each sales employee, urge collection within required time limits.' },
          { category: 'Marketing Coordination', description: 'Coordinate with marketing department to plan and implement promotional programs during holidays, Tet; customer appreciation; introduce new products and services to reach and attract target customers.' }
        ],
        techStack: ['MS Office', 'CRM', 'Order Management', 'Sales Reporting']
      },
      {
        title: 'Business Support Staff',
        company: 'NOVALAND GROUP - NOVA REAL ESTATE INVESTMENT CORPORATION',
        type: 'Full-time Employee',
        period: { start: '05/2022', end: '12/2022', duration: '8 months' },
        location: 'Ho Chi Minh City',
        current: false,
        highlights: [
          { category: 'Product Management', description: 'Update product status, update cart, book cart, resolve product-related issues.' },
          { category: 'Deposit Procedures', description: 'Process deposits, transfer deposits, support sales staff to review cart and track deposit payment status, customer contract signing.' },
          { category: 'Event Participation', description: 'Participate in project events when needed.' },
          { category: 'Document Drafting', description: 'Draft contracts, policies, business department documents as required by department head.' },
          { category: 'Form Design', description: 'Support designing templates, forms.' },
          { category: 'Records Storage', description: 'Store, arrange information, documents, contracts, materials related to sales activities.' },
          { category: 'Customer Program Support', description: 'Coordinate with sales team to support customer programs and activities.' }
        ],
        techStack: ['MS Office', 'Records Management', 'Form Design']
      },
      {
        title: 'Sales Staff',
        company: 'Dat Moi Trading Service Joint Stock Company (ALC)',
        type: 'Full-time Employee',
        period: { start: '03/2015', end: '03/2022', duration: '7 years' },
        location: 'Ho Chi Minh City',
        current: false,
        highlights: [
          { category: 'Quotation', description: 'Prepare quotations for customers.' },
          { category: 'Order Processing', description: 'Receive and create orders.' },
          { category: 'Contract Management', description: 'Prepare contracts, transfer to production and support sales staff in preparing necessary documents, answering customer inquiries via email, phone.' },
          { category: 'Production Coordination', description: 'Work with production workshop, purchasing department on delivery time, goods progress.' },
          { category: 'Order Tracking', description: 'Track, monitor orders to ensure delivery progress from quotation to customer delivery.' },
          { category: 'Installation Supervision', description: 'Work with supervisors during installation to grasp information and resolve arising issues, customer complaints.' },
          { category: 'Settlement', description: 'Prepare settlement and payment documents, reconcile, track customer debts. Receive customer files from sales staff.' },
          { category: 'Debt Collection', description: 'Collect debts and close files.' },
          { category: 'Display Product Management', description: 'Manage files, check and maintain display products.' },
          { category: 'Sales Reporting', description: 'Monthly sales reporting.' }
        ],
        techStack: ['MS Office', 'AutoCAD', 'Order Management', 'Installation Supervision', 'Debt Collection']
      }
    ]
  },

  education: {
    highestDegree: 'College',
    graduationDate: '08/2014',
    schools: [
      {
        name: 'Bach Viet College',
        degree: 'College Diploma',
        period: { start: '2011', end: '08/2014' }
      }
    ]
  },

  certificates: {
    items: [
      {
        name: 'Bachelor - Interior Design Major',
        institution: 'Bach Viet College',
        date: '05/09/2014',
        expiry: 'No expiry'
      },
      {
        name: 'Construction Cost Estimation',
        institution: 'University of Civil Engineering',
        date: '21/06/2023',
        expiry: 'No expiry'
      }
    ]
  },

  activities: {
    items: [
      {
        title: 'Support Member',
        organization: 'Charity established by ALC',
        period: { start: '03/2017', end: '03/2022' },
        description: 'Participated in volunteer activities, fundraising from the company for disadvantaged children in remote areas at schools during periodic events organized by the company.'
      }
    ]
  },

  achievements: {
    items: [
      'Achieved company targets, completed assigned tasks well.'
    ]
  },

  references: {
    items: [
      {
        name: 'Bui Thi Hai Hoa',
        title: 'Showroom Manager',
        company: 'Dat Moi Trading Service Joint Stock Company',
        phone: '0903990036',
        email: 'hoabth@alcvietnam.com'
      }
    ]
  },

  footer: {
    cta: {
      title: 'Ready to contribute and develop',
      description: 'Looking forward to working in a professional, dynamic environment to develop skills and contribute to the company'
    },
    copyright: '© 2025 Le Thi My Dieu. All rights reserved.'
  }
}
