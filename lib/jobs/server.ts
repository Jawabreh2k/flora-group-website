/**
 * Server-side job detail fetch for the /careers/[id] page. Talks to the CMS
 * directly (matching getUiConfig / getSubsidiariesData), with the same seed
 * fallback used by the client-facing /api/jobs/[id] route, so the page renders
 * even during a CMS outage instead of 404ing.
 */
import 'server-only'

import { env } from '@/lib/env'
import { getJobDetailFromSeed } from './seed'
import type { JobDetail, JobListItem } from './types'

/** All published jobs, for the sitemap. Best-effort — an empty list just omits job URLs. */
export async function getAllJobsForSitemap(): Promise<JobListItem[]> {
  try {
    const res = await fetch(`${env.apiUrl}/api/jobs?page=1&pageSize=500`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600, tags: ['jobs'] },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) return []

    const data = (await res.json()) as { items?: JobListItem[] }
    return data.items ?? []
  } catch {
    return []
  }
}

export async function getJobDetailForPage(id: string): Promise<JobDetail | null> {
  try {
    const res = await fetch(`${env.apiUrl}/api/jobs/${id}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30, tags: [`job-${id}`] },
      signal: AbortSignal.timeout(5000),
    })

    if (res.ok) {
      return (await res.json()) as JobDetail
    }

    console.warn(`[job-detail-page] CMS responded ${res.status}; trying seed.`)
  } catch (err) {
    console.warn(
      '[job-detail-page] CMS request failed; trying seed.',
      err instanceof Error ? err.message : String(err),
    )
  }

  return getJobDetailFromSeed(id)
}
