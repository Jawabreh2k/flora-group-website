import 'server-only'

/**
 * Centralised, validated environment variables for the public site.
 * Logs a warning in production when optional-but-important vars are absent,
 * so misconfigured deployments are caught at startup rather than silently
 * falling back to localhost defaults.
 */
function warnIfMissing(name: string, fallback: string): string {
  const value = process.env[name]
  if (!value && process.env.NODE_ENV === 'production') {
    console.warn(
      `[env] ${name} is not set — falling back to "${fallback}". ` +
        `Set this env var in production to point at the live API.`,
    )
  }
  return value ?? fallback
}

export const env = {
  /** Base URL of the Flora CMS API. Never exposed to the browser (no NEXT_PUBLIC_ prefix). */
  apiUrl: warnIfMissing('FLORA_API_URL', 'http://localhost:5253'),

  /**
   * Canonical public origin of this site, used for SEO: sitemap URLs, robots,
   * canonical links and absolute Open Graph image URLs. Must be set in production.
   */
  siteUrl: warnIfMissing('FLORA_SITE_URL', 'http://localhost:3000').replace(/\/+$/, ''),

  /** Seconds Next.js ISR holds the fetched config before revalidating. */
  configRevalidate: Number(process.env.FLORA_CONFIG_REVALIDATE ?? 60),

  /**
   * Shared secret for the on-demand revalidation webhook.
   * If unset, the /api/revalidate endpoint is disabled (returns 503).
   */
  revalidateSecret: process.env.FLORA_REVALIDATE_SECRET ?? '',
}
