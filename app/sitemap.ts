import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'
import { getManagedSubsidiaries } from '@/lib/subsidiaries-config'

// Re-generated on the same cadence as the CMS config so new subsidiaries appear.
export const revalidate = 3600

/**
 * XML sitemap for crawlers. Covers the static marketing pages plus every subsidiary
 * detail page (the only dynamically-routed public content). Individual jobs are not
 * listed because they have no standalone URLs — they live in the /careers board.
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
    const subsidiaries = await getManagedSubsidiaries()
    subsidiaryRoutes = subsidiaries.map((s) => ({
      url: `${base}/subsidiaries/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch {
    // Degrade to the static sitemap if the CMS is unreachable.
  }

  return [...staticRoutes, ...subsidiaryRoutes]
}
