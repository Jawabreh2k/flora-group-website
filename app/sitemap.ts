import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'
import { getSubsidiariesData } from '@/lib/subsidiaries-config'
import { getAllJobsForSitemap } from '@/lib/jobs/server'

// Re-generated on the same cadence as the CMS config so new subsidiaries and jobs appear.
export const revalidate = 3600

/**
 * XML sitemap for crawlers. Covers the static marketing pages, every subsidiary
 * detail page, and every open job posting (each has its own indexable URL with
 * JobPosting structured data — see app/careers/[id]/page.tsx).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/careers`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  let subsidiaryRoutes: MetadataRoute.Sitemap = []
  try {
    const subsidiaries = await getSubsidiariesData()
    subsidiaryRoutes = subsidiaries.map((s) => ({
      url: `${base}/subsidiaries/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch {
    // Degrade to the static sitemap if the CMS is unreachable.
  }

  const jobs = await getAllJobsForSitemap()
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${base}/careers/${job.id}`,
    lastModified: new Date(job.createdAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...subsidiaryRoutes, ...jobRoutes]
}
