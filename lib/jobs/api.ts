import { HONEYPOT_FIELD } from '@/lib/honeypot'
import type { ApplicationInput, JobDetail, JobFilters, JobListItem, PaginatedResponse } from './types'

export class ApplicationApiError extends Error {
  status: number
  /** Field-keyed validation messages, when the failure was a 400 from the CMS validator. */
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApplicationApiError'
    this.status = status
    this.errors = errors
  }
}

function buildQuery(filters: JobFilters): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.department) params.set('department', filters.department)
  if (filters.locationType) params.set('locationType', filters.locationType)
  if (filters.jobType) params.set('jobType', filters.jobType)
  params.set('page', String(filters.page ?? 1))
  params.set('pageSize', String(filters.pageSize ?? 12))
  return params.toString()
}

export async function fetchJobs(
  filters: JobFilters = {},
): Promise<PaginatedResponse<JobListItem>> {
  const res = await fetch(`/api/jobs?${buildQuery(filters)}`)
  if (!res.ok) throw new Error('Failed to load jobs')
  return res.json()
}

export async function fetchJob(id: string): Promise<JobDetail> {
  const res = await fetch(`/api/jobs/${id}`)
  if (!res.ok) throw new Error('Failed to load job')
  return res.json()
}

export async function submitApplication(jobId: string, input: ApplicationInput): Promise<void> {
  const formData = new FormData()
  formData.append('candidateName', input.candidateName)
  formData.append('candidateEmail', input.candidateEmail)
  if (input.candidatePhone) formData.append('candidatePhone', input.candidatePhone)
  if (input.coverLetter) formData.append('coverLetter', input.coverLetter)
  formData.append('resume', input.resume)
  formData.append(HONEYPOT_FIELD, input.honeypot ?? '')

  const res = await fetch(`/api/jobs/${jobId}/apply`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: string; errors?: Record<string, string[]> }
      | null
    throw new ApplicationApiError(body?.error ?? 'Application failed', res.status, body?.errors)
  }
}
