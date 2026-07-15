import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import type { JobDetail, JobListItem, PaginatedResponse } from './types'

let seedData: PaginatedResponse<JobListItem> | null = null
let lastError: Error | null = null

function validateJobListItem(item: unknown): item is JobListItem {
  if (!item || typeof item !== 'object') return false
  const job = item as Record<string, unknown>

  return (
    typeof job.id === 'string' &&
    typeof job.title === 'string' &&
    typeof job.department === 'string' &&
    ['REMOTE', 'HYBRID', 'ONSITE'].includes(job.locationType as string) &&
    typeof job.locationText === 'string' &&
    ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].includes(job.jobType as string) &&
    (job.salaryRange === null || typeof job.salaryRange === 'string') &&
    (job.closingDate === null || typeof job.closingDate === 'string') &&
    typeof job.createdAt === 'string' &&
    typeof job.company === 'object' &&
    job.company !== null &&
    typeof (job.company as Record<string, unknown>).id === 'string' &&
    typeof (job.company as Record<string, unknown>).name === 'string'
  )
}

function validateSeedData(data: unknown): data is PaginatedResponse<JobListItem> {
  if (!data || typeof data !== 'object') return false
  const payload = data as Record<string, unknown>

  return (
    Array.isArray(payload.items) &&
    payload.items.every(validateJobListItem) &&
    typeof payload.totalCount === 'number' &&
    typeof payload.page === 'number' &&
    typeof payload.pageSize === 'number' &&
    typeof payload.hasNextPage === 'boolean'
  )
}

export function loadJobsSeed(): PaginatedResponse<JobListItem> {
  if (seedData) return seedData

  try {
    const seedPath = path.join(process.cwd(), 'data', 'jobs-seed.json')
    const raw = fs.readFileSync(seedPath, 'utf-8')
    const parsed = JSON.parse(raw)

    if (!validateSeedData(parsed)) {
      throw new Error('Seed data validation failed: invalid schema')
    }

    seedData = parsed
    return seedData
  } catch (err) {
    lastError = err instanceof Error ? err : new Error(String(err))
    console.error('[jobs-seed] Failed to load seed data:', lastError.message)

    return {
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 0,
      hasNextPage: false,
    }
  }
}

export function getLastSeedError(): Error | null {
  return lastError
}

export function paginateSeed(
  pageNum: number,
  pageSize: number,
): PaginatedResponse<JobListItem> {
  const seed = loadJobsSeed()

  if (seed.items.length === 0) {
    return seed
  }

  const startIdx = (pageNum - 1) * pageSize
  const endIdx = startIdx + pageSize
  const paginatedItems = seed.items.slice(startIdx, endIdx)

  return {
    items: paginatedItems,
    totalCount: seed.totalCount,
    page: pageNum,
    pageSize: pageSize,
    hasNextPage: endIdx < seed.items.length,
  }
}

/**
 * Synthesizes a JobDetail from a seed list item when the CMS is unreachable.
 * Seed IDs are fixed slugs (e.g. "senior-software-engineer"), disjoint from the
 * GUIDs the real API uses, so this never masks a genuine 404 from a live CMS.
 */
export function getJobDetailFromSeed(id: string): JobDetail | null {
  const seed = loadJobsSeed()
  const item = seed.items.find((job) => job.id === id)

  if (!item) return null

  return {
    ...item,
    description:
      'For full details about this position, please contact us or check back when the system is fully operational.',
    requirements: ['Experience in related field', 'Strong communication skills'],
    responsibilities: [
      'Contribute to Flora Group\'s mission across one of our six strategic verticals',
      'Work collaboratively with team members',
    ],
    status: 'OPEN',
    updatedAt: item.createdAt,
    company: {
      ...item.company,
      description: null,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
    },
  }
}
