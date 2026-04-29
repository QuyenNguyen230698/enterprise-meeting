import type { PortfolioData } from './portfolioData'

// Nguyễn Thị Huyền Trang - Vietnamese Data
export const huyenTrangViData: PortfolioData = {
  hero: {
    name: 'Nguyễn Thị Huyền Trang',
    initials: 'HT',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/fd2618d3-4410-42ef-f252-0fb56aac1300/2K', // Replace with actual avatar
    title: 'Trưởng Phòng Tài Chính - Kế Toán',
    location: 'Phường Tân Thới Hiệp, TP. Hồ Chí Minh',
    tagline: 'Cộng tác lâu dài với doanh nghiệp. Cơ hội phát triển chuyên môn và thăng tiến trong công việc. Có trách nhiệm với công việc, tinh thần học hỏi cao, chịu được áp lực. Khả năng làm việc nhóm và hướng dẫn cho cấp dưới tốt. Giao tiếp, truyền đạt tốt. Sắp xếp thời gian và công việc hiệu quả.',
    highlights: [
      'Hơn 8 năm kinh nghiệm Tài chính - Kế toán',
      'Chuyên gia lập kế hoạch và phân tích tài chính (FP&A)',
      'Thành thạo Excel, Power BI, MISA, Fast',
      'Tiếng Anh trình độ B2',
      'Khả năng lãnh đạo và quản lý đội nhóm'
    ],
    stats: [
      { value: '8+', label: 'Năm KN' },
      { value: '5+', label: 'Công Ty' },
      { value: 'B2', label: 'Tiếng Anh' }
    ],
    availability: { status: true, text: 'Sẵn sàng nhận việc' },
    contact: {
      email: 'trang.nth.kt2020@gmail.com',
      phone: '0984.999.488'
    }
  },
  personalInfo: {
    gender: 'Nữ',
    birthDate: '19/01/1994',
    employmentType: 'Toàn thời gian'
  },
  skills: {
    categories: [
      {
        name: 'Tài Chính & Kế Toán',
        icon: 'bi-calculator',
        gradient: { from: 'blue-600', to: 'indigo-500' },
        skills: [
          { name: 'Lập kế hoạch tài chính', highlight: true },
          { name: 'Phân tích tài chính (FP&A)', highlight: true },
          { name: 'Báo cáo tài chính & Quản trị', highlight: true },
          { name: 'Kiểm soát chi phí & Ngân sách', highlight: true },
          { name: 'Quản lý dòng tiền', highlight: false },
          { name: 'Tư vấn thuế & Kế toán', highlight: false }
        ]
      },
      {
        name: 'Phần Mềm & Công Cụ',
        icon: 'bi-laptop',
        gradient: { from: 'emerald-500', to: 'teal-500' },
        skills: [
          { name: 'Microsoft Excel (Nâng cao)', highlight: true },
          { name: 'Power BI', highlight: true },
          { name: 'MISA', highlight: true },
          { name: 'Fast Accounting', highlight: false },
          { name: 'Microsoft Teams', highlight: false }
        ]
      },
      {
        name: 'Quản Lý & Lãnh Đạo',
        icon: 'bi-people',
        gradient: { from: 'purple-500', to: 'pink-500' },
        skills: [
          { name: 'Quản lý đội nhóm', highlight: true },
          { name: 'Xây dựng quy trình', highlight: true },
          { name: 'Phối hợp liên phòng ban', highlight: false },
          { name: 'Đào tạo & Hướng dẫn', highlight: false }
        ]
      },
      {
        name: 'Kỹ Năng Mềm',
        icon: 'bi-chat-dots',
        gradient: { from: 'amber-500', to: 'orange-500' },
        skills: [
          { name: 'Tiếng Anh B2 (VEPT)', highlight: true },
          { name: 'Giao tiếp & Truyền đạt', highlight: false },
          { name: 'Chịu áp lực cao', highlight: false },
          { name: 'Quản lý thời gian', highlight: false }
        ]
      }
    ]
  },
  experience: {
    totalYears: 8,
    currentLevel: 'Trưởng Phòng',
    jobs: [
      {
        title: 'Trưởng Phòng Tài Chính - Kế Toán',
        company: 'CÔNG TY CỔ PHẦN TRẦN ĐỨC',
        type: 'Toàn thời gian',
        period: { start: '01/2025', end: 'Hiện tại', duration: '1 năm' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: true,
        highlights: [
          { category: 'Kế hoạch tài chính', description: 'Lập kế hoạch tài chính của công ty.' },
          { category: 'Xây dựng quy trình', description: 'Xây dựng quy trình hoạt động của các phòng ban.' },
          { category: 'Kiểm soát chi phí', description: 'Kiểm soát chi phí và luồng xuất nhập hàng hóa trong và ngoài nước.' },
          { category: 'Báo cáo', description: 'Thực hiện và kiểm soát các báo cáo tài chính, báo cáo quản trị.' }
        ],
        techStack: ['Excel', 'Power BI', 'MISA', 'Fast']
      },
      {
        title: 'Phó Phòng Hoạch Định và Phân Tích Tài Chính (FP&A)',
        company: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN HƯNG THỊNH',
        type: 'Toàn thời gian',
        period: { start: '01/2021', end: '12/2024', duration: '4 năm' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: false,
        highlights: [
          { category: 'Kế hoạch kinh doanh', description: 'Lập kế hoạch kinh doanh toàn Tập đoàn trong ngắn hạn và dài hạn.' },
          { category: 'Báo cáo dự án', description: 'Kiểm soát và lập báo cáo hiệu quả dự án Bất động sản.' },
          { category: 'Vay vốn', description: 'Phối hợp và thực hiện các gói vay vốn Ngân hàng.' },
          { category: 'Kiểm soát ngân sách', description: 'Kiểm soát các hạn mức ngân sách Dự án và các phòng ban.' },
          { category: 'Power BI', description: 'Cập nhật số liệu quản lý và thiết kế các báo cáo lên Power BI phục vụ công tác quản trị.' },
          { category: 'Phối hợp', description: 'Phối hợp với các phòng ban khác để lên kế hoạch liên quan đến dòng tiền và chi phí.' }
        ],
        techStack: ['Excel', 'Power BI', 'SAP', 'Banking Systems']
      },
      {
        title: 'Trưởng Phòng Tài Chính - Kế Toán',
        company: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN K-GROUP',
        type: 'Toàn thời gian',
        period: { start: '01/2021', end: '12/2021', duration: '1 năm' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: false,
        highlights: [
          { category: 'Chu trình kiểm soát', description: 'Xây dựng chu trình kiểm soát: Đối chiếu công nợ, Kiểm soát tài chính, Thanh toán.' },
          { category: 'Phân tích dữ liệu', description: 'Giám sát và phân tích dữ liệu kế toán và các báo cáo tài chính.' },
          { category: 'Chính sách kế toán', description: 'Tham gia vào quá trình phát triển các chính sách, hệ thống và thủ tục kế toán.' },
          { category: 'Tư vấn', description: 'Tư vấn và đề xuất các giải pháp về thuế, kế toán, tài chính đối với các nghiệp vụ phát sinh.' },
          { category: 'Công nghệ', description: 'Thực hiện mô tả và phối hợp với mảng công nghệ để thực hiện app phục vụ nhu cầu quản lý.' }
        ],
        techStack: ['Excel', 'MISA', 'ERP Systems']
      },
      {
        title: 'Trưởng Phòng Tài Chính - Kế Toán',
        company: 'CÔNG TY CP NGƯỜI BẠN VÀNG (Thuộc nhóm PNJ)',
        type: 'Toàn thời gian',
        period: { start: '01/2019', end: '12/2021', duration: '3 năm' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: false,
        highlights: [
          { category: 'Quản lý bộ phận', description: 'Quản lý, giám sát hoạt động của bộ phận kế toán.' },
          { category: 'Phân tích báo cáo', description: 'Rà soát và phân tích dữ liệu của các báo cáo tài chính.' },
          { category: 'Kiểm toán', description: 'Tham gia điều phối và hỗ trợ các cuộc kiểm toán.' },
          { category: 'Cải tiến quy trình', description: 'Cải thiện và phát triển các chính sách và thủ tục tại các phòng ban.' },
          { category: 'Tư vấn tài chính', description: 'Tư vấn, đề xuất và thực hiện các giải pháp về thuế, kế toán, tài chính.' },
          { category: 'Power BI', description: 'Phối hợp với IT thực hiện hệ thống phần mềm và thiết kế báo cáo Power BI.' },
          { category: 'Báo cáo nhà đầu tư', description: 'Trình bày, giải trình kế hoạch và quản lý nguồn vốn của nhà đầu tư.' }
        ],
        techStack: ['Excel', 'Power BI', 'MISA', 'SAP']
      },
      {
        title: 'Trợ Lý Kiểm Toán Viên',
        company: 'CÔNG TY TNHH DV KIỂM TOÁN VÀ TƯ VẤN KẾ TOÁN BẮC ĐẨU (PACO)',
        type: 'Toàn thời gian',
        period: { start: '06/2016', end: '12/2019', duration: '3 năm 6 tháng' },
        location: 'TP. Hồ Chí Minh, Việt Nam',
        current: false,
        highlights: [
          { category: 'Thu thập thông tin', description: 'Hỗ trợ và thu thập các thông tin trong các cuộc kiểm toán.' },
          { category: 'Phân công', description: 'Phân công công việc cho các thành viên tham gia nhóm kiểm toán.' },
          { category: 'Kiểm toán BCTC', description: 'Thực hiện kiểm toán báo cáo tài chính, báo cáo kiểm kê và lập báo cáo kiểm toán toàn diện.' },
          { category: 'Kiểm tra chứng từ', description: 'Kiểm tra, đối chiếu chứng từ kế toán và sổ sách theo chuẩn mực kiểm toán.' },
          { category: 'Phân tích số liệu', description: 'Phân tích và đánh giá số liệu tài chính, phát hiện sai sót và gian lận.' },
          { category: 'Hỗ trợ tư vấn', description: 'Hỗ trợ tư vấn kế toán và thuế cho các doanh nghiệp khách hàng.' }
        ],
        techStack: ['Excel', 'Audit Software', 'MISA']
      }
    ]
  },
  education: {
    highestDegree: 'Cử nhân',
    schools: [
      {
        name: 'Trường Đại Học Kinh Tế TP.HCM',
        degree: 'Cử nhân Chuyên ngành Kế toán Doanh nghiệp',
        period: { start: '10/2012', end: '06/2016' }
      },
      {
        name: 'Trường Đại Học Kinh Tế TP.HCM',
        degree: 'Bằng Kế toán Trưởng của Bộ Tài Chính',
        period: { start: '2018', end: '2018' }
      }
    ]
  },
  certificates: {
    items: [
      {
        name: 'Chứng chỉ Kế toán Trưởng',
        institution: 'Bộ Tài Chính',
        date: '2018'
      }
    ]
  },
  achievements: {
    items: [
      'Xây dựng và triển khai thành công hệ thống báo cáo Power BI cho nhiều doanh nghiệp',
      'Tối ưu hóa quy trình tài chính và kế toán, cải thiện hiệu quả hoạt động',
      'Quản lý thành công các dự án vay vốn ngân hàng quy mô lớn',
      'Đào tạo và phát triển đội ngũ kế toán viên chuyên nghiệp'
    ]
  },
  footer: {
    cta: {
      title: 'Hãy Kết Nối!',
      description: 'Sẵn sàng đóng góp chuyên môn tài chính - kế toán để hỗ trợ sự phát triển bền vững của doanh nghiệp'
    },
    copyright: '© 2026 Nguyễn Thị Huyền Trang. All rights reserved.'
  }
}

// Nguyễn Thị Huyền Trang - English Data
export const huyenTrangEnData: PortfolioData = {
  hero: {
    name: 'Nguyen Thi Huyen Trang',
    initials: 'HT',
    avatar: 'https://imagedelivery.net/-tulz6ZB1FiuYVxo4sc-HQ/fd2618d3-4410-42ef-f252-0fb56aac1300/2K', // Replace with actual avatar
    title: 'Head of Finance & Accounting',
    location: 'Tan Thoi Hiep Ward, Ho Chi Minh City, Vietnam',
    tagline: 'Seeking long-term cooperation with businesses. Opportunities for professional development and career advancement. Responsible at work with a high learning spirit. Able to work under pressure. Strong teamwork and leadership skills. Excellent communication and time management abilities.',
    highlights: [
      '8+ years experience in Finance & Accounting',
      'Expert in Financial Planning & Analysis (FP&A)',
      'Proficient in Excel, Power BI, MISA, Fast',
      'English proficiency level B2',
      'Strong leadership and team management skills'
    ],
    stats: [
      { value: '8+', label: 'Years Exp' },
      { value: '5+', label: 'Companies' },
      { value: 'B2', label: 'English' }
    ],
    availability: { status: true, text: 'Available for work' },
    contact: {
      email: 'trang.nth.kt2020@gmail.com',
      phone: '0984.999.488'
    }
  },
  personalInfo: {
    gender: 'Female',
    birthDate: '19/01/1994',
    employmentType: 'Full-time'
  },
  skills: {
    categories: [
      {
        name: 'Finance & Accounting',
        icon: 'bi-calculator',
        gradient: { from: 'blue-600', to: 'indigo-500' },
        skills: [
          { name: 'Financial Planning', highlight: true },
          { name: 'Financial Analysis (FP&A)', highlight: true },
          { name: 'Financial & Management Reporting', highlight: true },
          { name: 'Cost Control & Budgeting', highlight: true },
          { name: 'Cash Flow Management', highlight: false },
          { name: 'Tax & Accounting Advisory', highlight: false }
        ]
      },
      {
        name: 'Software & Tools',
        icon: 'bi-laptop',
        gradient: { from: 'emerald-500', to: 'teal-500' },
        skills: [
          { name: 'Microsoft Excel (Advanced)', highlight: true },
          { name: 'Power BI', highlight: true },
          { name: 'MISA', highlight: true },
          { name: 'Fast Accounting', highlight: false },
          { name: 'Microsoft Teams', highlight: false }
        ]
      },
      {
        name: 'Management & Leadership',
        icon: 'bi-people',
        gradient: { from: 'purple-500', to: 'pink-500' },
        skills: [
          { name: 'Team Management', highlight: true },
          { name: 'Process Development', highlight: true },
          { name: 'Cross-department Coordination', highlight: false },
          { name: 'Training & Mentoring', highlight: false }
        ]
      },
      {
        name: 'Soft Skills',
        icon: 'bi-chat-dots',
        gradient: { from: 'amber-500', to: 'orange-500' },
        skills: [
          { name: 'English B2 (VEPT)', highlight: true },
          { name: 'Communication', highlight: false },
          { name: 'Work Under Pressure', highlight: false },
          { name: 'Time Management', highlight: false }
        ]
      }
    ]
  },
  experience: {
    totalYears: 8,
    currentLevel: 'Department Head',
    jobs: [
      {
        title: 'Head of Finance & Accounting',
        company: 'TRAN DUC JOINT STOCK COMPANY',
        type: 'Full-time',
        period: { start: '01/2025', end: 'Present', duration: '1 year' },
        location: 'Ho Chi Minh City, Vietnam',
        current: true,
        highlights: [
          { category: 'Financial Planning', description: 'Develop the company\'s financial plans.' },
          { category: 'Process Development', description: 'Establish operational processes for departments.' },
          { category: 'Cost Control', description: 'Control costs and manage domestic and international goods import-export flows.' },
          { category: 'Reporting', description: 'Prepare, monitor, and control financial statements and management reports.' }
        ],
        techStack: ['Excel', 'Power BI', 'MISA', 'Fast']
      },
      {
        title: 'Deputy Manager of Financial Planning & Analysis (FP&A)',
        company: 'HUNG THINH GROUP CORPORATION',
        type: 'Full-time',
        period: { start: '01/2021', end: '12/2024', duration: '4 years' },
        location: 'Ho Chi Minh City, Vietnam',
        current: false,
        highlights: [
          { category: 'Business Planning', description: 'Develop short-term and long-term business plans for the entire Group.' },
          { category: 'Project Reporting', description: 'Monitor and prepare performance reports for real estate projects.' },
          { category: 'Bank Financing', description: 'Coordinate and execute bank loan financing packages.' },
          { category: 'Budget Control', description: 'Control budget limits for projects and departments.' },
          { category: 'Power BI', description: 'Update management data and design management reports using Power BI.' },
          { category: 'Coordination', description: 'Collaborate with other departments to plan cash flow and cost management.' }
        ],
        techStack: ['Excel', 'Power BI', 'SAP', 'Banking Systems']
      },
      {
        title: 'Head of Finance & Accounting',
        company: 'K-GROUP JOINT STOCK COMPANY',
        type: 'Full-time',
        period: { start: '01/2021', end: '12/2021', duration: '1 year' },
        location: 'Ho Chi Minh City, Vietnam',
        current: false,
        highlights: [
          { category: 'Control Cycles', description: 'Establish control cycles: receivables/payables reconciliation, financial control, payments.' },
          { category: 'Data Analysis', description: 'Supervise and analyze accounting data and statutory financial reports.' },
          { category: 'Policy Development', description: 'Participate in developing accounting policies, systems, and procedures.' },
          { category: 'Advisory', description: 'Advise and propose solutions related to tax, accounting, and finance for arising transactions.' },
          { category: 'Technology', description: 'Define requirements and collaborate with the IT team to develop management-support applications.' }
        ],
        techStack: ['Excel', 'MISA', 'ERP Systems']
      },
      {
        title: 'Head of Finance & Accounting',
        company: 'GOLDEN FRIENDS JOINT STOCK COMPANY (PNJ Subsidiary)',
        type: 'Full-time',
        period: { start: '01/2019', end: '12/2021', duration: '3 years' },
        location: 'Ho Chi Minh City, Vietnam',
        current: false,
        highlights: [
          { category: 'Department Management', description: 'Manage and supervise accounting department operations.' },
          { category: 'Report Analysis', description: 'Review and analyze financial statement data.' },
          { category: 'Audit Support', description: 'Participate in coordinating and supporting audit engagements.' },
          { category: 'Process Improvement', description: 'Improve and develop policies and procedures across departments.' },
          { category: 'Financial Advisory', description: 'Advise, propose, and implement tax, accounting, and financial solutions.' },
          { category: 'Power BI', description: 'Coordinate with IT to implement software systems and design Power BI reports.' },
          { category: 'Investor Relations', description: 'Present and explain financial plans and investor capital management.' }
        ],
        techStack: ['Excel', 'Power BI', 'MISA', 'SAP']
      },
      {
        title: 'Audit Assistant',
        company: 'POLARIS AUDITING AND ACCOUNTING CONSULTANCY CO., LTD (PACO)',
        type: 'Full-time',
        period: { start: '06/2016', end: '12/2019', duration: '3.5 years' },
        location: 'Ho Chi Minh City, Vietnam',
        current: false,
        highlights: [
          { category: 'Information Collection', description: 'Assist in collecting information and documentation for audit engagements.' },
          { category: 'Task Assignment', description: 'Assign tasks to members of the audit team.' },
          { category: 'Financial Auditing', description: 'Perform audits of financial statements, inventory reports, and prepare comprehensive audit reports.' },
          { category: 'Document Verification', description: 'Verify and reconcile accounting documents and records according to auditing standards.' },
          { category: 'Data Analysis', description: 'Analyze and evaluate financial data, detect errors and fraud.' },
          { category: 'Advisory Support', description: 'Support accounting and tax advisory services for client enterprises.' }
        ],
        techStack: ['Excel', 'Audit Software', 'MISA']
      }
    ]
  },
  education: {
    highestDegree: 'Bachelor',
    schools: [
      {
        name: 'University of Economics Ho Chi Minh City',
        degree: 'Bachelor of Business Accounting',
        period: { start: '10/2012', end: '06/2016' }
      },
      {
        name: 'University of Economics Ho Chi Minh City',
        degree: 'Chief Accountant Certificate by Ministry of Finance',
        period: { start: '2018', end: '2018' }
      }
    ]
  },
  certificates: {
    items: [
      {
        name: 'Chief Accountant Certificate',
        institution: 'Ministry of Finance',
        date: '2018'
      }
    ]
  },
  achievements: {
    items: [
      'Successfully built and deployed Power BI reporting systems for multiple enterprises',
      'Optimized financial and accounting processes, improving operational efficiency',
      'Successfully managed large-scale bank loan projects',
      'Trained and developed professional accounting teams'
    ]
  },
  footer: {
    cta: {
      title: "Let's Connect!",
      description: 'Ready to contribute finance and accounting expertise to support sustainable business growth'
    },
    copyright: '© 2026 Nguyen Thi Huyen Trang. All rights reserved.'
  }
}
