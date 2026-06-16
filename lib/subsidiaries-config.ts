/**
 * Fetches UI config from the admin backend and extracts managed subsidiaries.
 * Falls back to hardcoded SUBSIDIARIES if config is unavailable.
 *
 * Server-only — import from Server Components or route handlers only.
 */
import 'server-only'

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
  }
}

/**
 * Gets subsidiaries from CMS config or falls back to bundled defaults.
 * Returns serializable records safe to pass into Client Components.
 */
export async function getSubsidiariesData(): Promise<ManagedSubsidiary[]> {
  const config = await fetchDynamicConfig()

  if (config?.subsidiaries?.enabled && config.subsidiaries.items.length > 0) {
    return config.subsidiaries.items
  }

  return SUBSIDIARIES.map(convertToManaged)
}

export async function getManagedSubsidiaries(): Promise<ManagedSubsidiary[]> {
  const config = await fetchDynamicConfig()

  if (config?.subsidiaries?.enabled && config.subsidiaries.items.length > 0) {
    return config.subsidiaries.items
  }

  return SUBSIDIARIES.map(convertToManaged)
}
