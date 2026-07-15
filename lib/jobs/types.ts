export type LocationType = 'REMOTE' | 'HYBRID' | 'ONSITE'
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'

export interface CompanySummary {
  id: string
  name: string
  logoUrl: string | null
  website: string | null
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  hasNextPage: boolean
}

export interface JobListItem {
  id: string
  title: string
  /** Arabic translation of title, when an editor has provided one. */
  titleAr: string | null
  department: string
  locationType: LocationType
  locationText: string
  jobType: JobType
  salaryRange: string | null
  closingDate: string | null
  createdAt: string
  company: CompanySummary
}

export interface JobDetail extends JobListItem {
  description: string
  descriptionAr: string | null
  requirements: string[]
  requirementsAr: string[]
  responsibilities: string[]
  responsibilitiesAr: string[]
  status: string
  updatedAt: string
  company: CompanySummary & {
    description: string | null
    createdAt: string
    updatedAt: string
  }
}

export interface JobFilters {
  search?: string
  department?: string
  locationType?: LocationType
  jobType?: JobType
  page?: number
  pageSize?: number
}

export interface ApplicationInput {
  candidateName: string
  candidateEmail: string
  candidatePhone?: string
  coverLetter?: string
  resume: File
  /** Honeypot value — always empty for real users. See lib/honeypot.ts. */
  honeypot?: string
}

export const LOCATION_TYPES: LocationType[] = ['REMOTE', 'HYBRID', 'ONSITE']
export const JOB_TYPES: JobType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']

export function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function isJobClosed(closingDate: string | null): boolean {
  return closingDate ? new Date(closingDate).getTime() < Date.now() : false
}
