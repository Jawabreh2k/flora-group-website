/**
 * Mirrors the `UiConfigResponse` / `UiConfigPayload` contract served by the
 * Flora CMS API (`GET /api/ui/config`).
 * SYNC: flora-admin-portal/lib/types.ts, DefaultContent.cs, messages.ts
 * Checklist: docs/CMS_CONTRACT_SYNC.md
 */

/** Brand colour tokens — each maps onto a CSS custom property at runtime. */
export type Theme = {
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  border: string
  input: string
  ring: string
  destructive: string
  gold: string
  goldSoft: string
  goldForeground: string
  maroon: string
  maroonDeep: string
  radius: string
  fontHeading: string
  fontSans: string
}

export type Branding = {
  siteTitle: string
  metaDescription: string
  logoUrl: string
  themeColor: string
}

export type Sections = {
  showStats: boolean
  showSubsidiaries: boolean
  showSpotlight: boolean
}

/** CMS-managed image URLs that override the site's bundled assets. */
export type Images = {
  logo: string
  heroImage: string
  contactHero: string
  careersHero: string
}

import type { Locale } from "@/lib/i18n/messages"

export type Highlight = { title: string; body: string }
export type Metric = { value: string; label: string }
export type Localized<T> = Record<Locale, T>

export type SubsidiaryContact = {
  address: Localized<string>
  phone?: string
  fax?: string
  email?: string
}

export type ManagedSubsidiary = {
  slug: string
  icon: string
  name: Localized<string>
  tag: Localized<string>
  short: Localized<string>
  established: Localized<string>
  visual: { from: string; to: string; glow: string }
  image?: string
  logo?: string
  paragraphs: Localized<string[]>
  highlights: Localized<Highlight[]>
  metrics: Localized<Metric[]>
  website: string
  hasProfile: boolean
  contact: SubsidiaryContact
}

export type SocialPlatform = 'linkedin' | 'instagram' | 'facebook' | 'x' | 'youtube'

export type SocialLink = {
  platform: SocialPlatform
  url: string
}

export type Social = {
  enabled: boolean
  links: SocialLink[]
}

/**
 * A single flat CMS content group (group-key → string value).
 * Groups are stored flat in the DB and mapped to the nested i18n Messages
 * shape in the i18n-provider before deep-merging.
 */
export type CmsFlatGroup = Record<string, string>

/**
 * All editable CMS content groups, per locale. Mirrors EditableContent in the
 * admin portal (flora-admin-portal/lib/types.ts). Keep in sync.
 */
export type CmsContent = {
  hero?: CmsFlatGroup
  subsidiaries?: CmsFlatGroup
  spotlight?: CmsFlatGroup
  nav?: CmsFlatGroup
  stats?: CmsFlatGroup
  pages?: CmsFlatGroup
  footer?: CmsFlatGroup
  contact?: CmsFlatGroup
  careersHero?: CmsFlatGroup
  careersCulture?: CmsFlatGroup
  careersBenefits?: CmsFlatGroup
  careersPositions?: CmsFlatGroup
  careersCta?: CmsFlatGroup
  careersStats?: CmsFlatGroup
  careersCultureValues?: CmsFlatGroup
  careersUi?: CmsFlatGroup
}

export type ContentOverrides = Partial<Record<Locale, CmsContent>>

export type UiConfigPayload = {
  theme: Theme
  branding: Branding
  sections: Sections
  images: Images
  content?: ContentOverrides
  social?: Social
  subsidiaries?: {
    enabled: boolean
    items: ManagedSubsidiary[]
  }
}

export type UiConfig = {
  payload: UiConfigPayload
  revision: number
  updatedAtUtc: string
  updatedBy: string | null
}
