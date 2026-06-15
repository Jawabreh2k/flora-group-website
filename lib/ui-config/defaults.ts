import type { UiConfigPayload } from "./types"

/**
 * Resilient fallback used when the CMS API is unreachable. Values mirror the
 * backend seed defaults (and the design tokens baked into app/globals.css) so the
 * site renders correctly even with the backend down. Keeping these in sync means
 * a CMS outage degrades gracefully rather than breaking the brand.
 */
export const DEFAULT_UI_CONFIG: UiConfigPayload = {
  theme: {
    background: "#fcfbf9",
    foreground: "#3a2329",
    card: "#ffffff",
    cardForeground: "#3a2329",
    primary: "#4a0e17",
    primaryForeground: "#fbf6ef",
    secondary: "#f5f2ee",
    secondaryForeground: "#4a0e17",
    muted: "#f5f2ee",
    mutedForeground: "#6f6760",
    accent: "#c5a880",
    accentForeground: "#42121b",
    border: "#e8e3dc",
    input: "#e8e3dc",
    ring: "#c5a880",
    destructive: "#c0392b",
    gold: "#c5a880",
    goldSoft: "#ddc9a8",
    goldForeground: "#42121b",
    maroon: "#4a0e17",
    maroonDeep: "#350a11",
    radius: "0.625rem",
    fontHeading: "Playfair Display",
    fontSans: "Inter",
  },
  branding: {
    siteTitle: "Flora Group W.L.L. — A Legacy of Excellence Across Qatar",
    metaDescription:
      "Since 1993, Flora Group has been a trusted Qatari conglomerate spanning technology, infrastructure, security, commodities, and premium trade.",
    logoUrl: "/images/flora-group-logo.png",
    themeColor: "#4A0E17",
  },
  sections: {
    showStats: true,
    showSubsidiaries: true,
    showSpotlight: true,
  },
  images: {
    logo: "/images/flora-group-logo.png",
    heroImage: "/images/hero-doha.jpg",
  },
  // content is intentionally omitted — when absent the site uses its bundled i18n copy.
}
