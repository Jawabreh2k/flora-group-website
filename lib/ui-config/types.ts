/**
 * Mirrors the `UiConfigResponse` / `UiConfigPayload` contract served by the
 * Flora CMS API (`GET /api/ui/config`). Kept in sync with the C# DTOs in
 * `Flora.Cms.Api/Dtos/UiConfigPayload.cs`.
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
}

import type { Locale } from "@/lib/i18n/messages"

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
  footer?: CmsFlatGroup
  contact?: CmsFlatGroup
  careersHero?: CmsFlatGroup
  careersCulture?: CmsFlatGroup
  careersBenefits?: CmsFlatGroup
  careersPositions?: CmsFlatGroup
  careersCta?: CmsFlatGroup
}

export type ContentOverrides = Partial<Record<Locale, CmsContent>>

export type UiConfigPayload = {
  theme: Theme
  branding: Branding
  sections: Sections
  images: Images
  content?: ContentOverrides
}

export type UiConfig = {
  payload: UiConfigPayload
  revision: number
  updatedAtUtc: string
  updatedBy: string | null
}
