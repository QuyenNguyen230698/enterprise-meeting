
export interface PortfolioData {
  hero: HeroBlock
  personalInfo?: PersonalInfoBlock
  skills: SkillsBlock
  experience: ExperienceBlock
  education: EducationBlock
  certificates?: CertificateBlock
  activities?: ActivityBlock
  achievements?: AchievementBlock
  references?: ReferenceBlock
  footer: FooterBlock
}

export interface HeroBlock {
  name: string
  initials: string
  avatar: string
  title: string
  location: string
  tagline: string
  highlights: string[]
  stats: Array<{ value: string; label: string }>
  availability: { status: boolean; text: string }
  contact: {
    email: string
    phone: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
}

export interface PersonalInfoBlock {
  gender?: string
  birthDate?: string
  maritalStatus?: string
  nationality?: string
  country?: string
  desiredSalary?: string
  employmentType?: string
  industries?: string[]
  preferredLocations?: string[]
}

export interface SkillsBlock {
  categories: Array<{
    name: string
    icon: string
    gradient: { from: string; to: string }
    skills: Array<{ name: string; highlight?: boolean }>
  }>
}

export interface ExperienceBlock {
  totalYears?: number
  currentLevel?: string
  jobs: Array<{
    title: string
    company: string
    type: string
    period: { start: string; end: string; duration: string }
    location: string
    current: boolean
    highlights: Array<{ category: string; description: string }>
    techStack: string[]
  }>
}

export interface EducationBlock {
  highestDegree?: string
  graduationDate?: string
  schools: Array<{
    name: string
    degree: string
    period: { start: string; end: string }
  }>
}

export interface CertificateBlock {
  items: Array<{
    name: string
    institution: string
    date: string
    expiry?: string
  }>
}

export interface ActivityBlock {
  items: Array<{
    title: string
    organization: string
    period: { start: string; end: string }
    description: string
  }>
}

export interface AchievementBlock {
  items: string[]
}

export interface ReferenceBlock {
  items: Array<{
    name: string
    title: string
    company: string
    phone: string
    email: string
  }>
}

export interface FooterBlock {
  cta: { title: string; description: string }
  copyright: string
}

// Portfolio Registry Interface
export interface PortfolioEntry {
  slug: string
  enabled: boolean
  data: {
    en: PortfolioData
    vi: PortfolioData
  }
}

// Import data from separate files
import { ducAnhEnData, ducAnhViData } from './ducAnhData'
import { phucBuiEnData, phucBuiViData } from './phucBuiData'
import { myDieuEnData, myDieuViData } from './myDieuData'
import { hoangDaoEnData, hoangDaoViData } from './hoangDaoData'
import { thuHaEnData, thuHaViData } from './thuHaData'
import { huyenTrangEnData, huyenTrangViData } from './huyenTrangData'

// Portfolio Registry
export const portfolioRegistry: Record<string, PortfolioEntry> = {
  'duc-anh': {
    slug: 'duc-anh',
    enabled: true,
    data: {
      en: ducAnhEnData,
      vi: ducAnhViData
    }
  },
  'phuc-bui': {
    slug: 'phuc-bui',
    enabled: true,
    data: {
      en: phucBuiEnData,
      vi: phucBuiViData
    }
  },
  'my-dieu': {
    slug: 'my-dieu',
    enabled: true,
    data: {
      en: myDieuEnData,
      vi: myDieuViData
    }
  },
  'hoang-dao': {
    slug: 'hoang-dao',
    enabled: true,
    data: {
      en: hoangDaoEnData,
      vi: hoangDaoViData
    }
  },
  'thu-ha': {
    slug: 'thu-ha',
    enabled: true,
    data: {
      en: thuHaEnData,
      vi: thuHaViData
    }
  },
  'huyen-trang': {
    slug: 'huyen-trang',
    enabled: true,
    data: {
      en: huyenTrangEnData,
      vi: huyenTrangViData
    }
  }
}

// Helper functions
export const getPortfolioBySlug = (slug: string): PortfolioEntry | null => {
  return portfolioRegistry[slug] || null
}

export const getAllPortfolioSlugs = (): string[] => {
  return Object.keys(portfolioRegistry)
}

export const getAllPortfolios = (): PortfolioEntry[] => {
  return Object.values(portfolioRegistry)
}
