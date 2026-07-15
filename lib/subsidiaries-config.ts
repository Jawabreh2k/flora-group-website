/**
 * Fetches UI config from the admin backend and extracts managed subsidiaries.
 * Falls back to hardcoded SUBSIDIARIES if config is unavailable.
 *
 * Server-only — import from Server Components or route handlers only.
 */
import 'server-only'

import { cache } from 'react'
import type { ManagedSubsidiary } from '@/lib/ui-config/types'
import { SUBSIDIARIES, type Subsidiary } from './subsidiaries'
import { env } from '@/lib/env'

async function fetchDynamicConfig() {
  try {
    const res = await fetch(`${env.apiUrl}/api/ui/config`, {
      next: { revalidate: env.configRevalidate, tags: ["ui-config"] },
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.payload as { subsidiaries?: { enabled: boolean; items: ManagedSubsidiary[] } } | undefined
  } catch {
    return null
  }
}

function convertToManaged(subsidiary: Subsidiary): ManagedSubsidiary {
  return {
    slug: subsidiary.slug,
    icon: subsidiary.icon.name || "Package",
    name: subsidiary.name,
    tag: subsidiary.tag,
    short: subsidiary.short,
    established: subsidiary.established,
    visual: subsidiary.visual,
    image: subsidiary.image,
    logo: subsidiary.logo,
    paragraphs: subsidiary.paragraphs,
    highlights: subsidiary.highlights,
    metrics: subsidiary.metrics,
    website: subsidiary.website,
    hasProfile: subsidiary.hasProfile,
    contact: subsidiary.contact,
    // The bundled fallback list isn't admin-managed, so it's always visible.
    enabled: true,
  }
}

/**
 * Every CMS-managed subsidiary, including ones an admin has disabled. Wrapped
 * in cache() so multiple calls within one request render (e.g. a page's own
 * lookup plus generateMetadata) share a single fetch.
 */
const getAllManagedSubsidiaries = cache(async (): Promise<ManagedSubsidiary[]> => {
  const config = await fetchDynamicConfig()

  if (config?.subsidiaries?.enabled && config.subsidiaries.items.length > 0) {
    return config.subsidiaries.items
  }

  return SUBSIDIARIES.map(convertToManaged)
})

/**
 * Subsidiaries for public listings (homepage grid, footer, sitemap) — excludes
 * any an admin has disabled. This is what nearly every caller wants.
 */
export async function getSubsidiariesData(): Promise<ManagedSubsidiary[]> {
  const all = await getAllManagedSubsidiaries()
  return all.filter((item) => item.enabled !== false)
}

/**
 * Every CMS-managed subsidiary, disabled ones included. Only use this where
 * the caller needs to distinguish "explicitly disabled" from "not managed by
 * the CMS at all" — e.g. the subsidiary detail page deciding whether to 404 a
 * disabled slug outright vs. falling back to bundled data for an unmanaged
 * one. Everywhere else, prefer getSubsidiariesData().
 */
export async function getManagedSubsidiaries(): Promise<ManagedSubsidiary[]> {
  return getAllManagedSubsidiaries()
}
