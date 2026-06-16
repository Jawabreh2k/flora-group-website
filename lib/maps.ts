/**
 * Turns an admin-supplied "map location" into an embeddable Google Maps iframe `src`,
 * so non-technical staff never have to craft an `&output=embed` URL by hand.
 *
 * Accepts, in order of detection:
 *   1. An already-embeddable URL (`…/maps/embed…` or any URL with `output=embed`) → used as-is.
 *   2. Bare coordinates `"lat, lng"` (e.g. `"25.2854, 51.5310"`).
 *   3. A Google Maps link — if it contains `@lat,lng` or a `q=`/`query=` param, those are extracted.
 *   4. Any other text — treated as a place / address query.
 *
 * Returns `null` for empty input so callers can hide the map cleanly.
 *
 * NOTE: kept in sync with flora-admin-portal/lib/maps.ts (used for the editor preview).
 */
export function buildMapEmbedSrc(raw?: string | null): string | null {
  const value = raw?.trim()
  if (!value) return null

  // 1. Already an embeddable URL.
  if (/\/maps\/embed/i.test(value) || /[?&]output=embed/i.test(value)) return value

  const embedForQuery = (q: string) =>
    `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
  const embedForCoords = (lat: string, lng: string) =>
    `https://www.google.com/maps?q=${lat},${lng}&output=embed`

  // 2. Bare coordinates "lat, lng".
  const coords = value.match(/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/)
  if (coords) return embedForCoords(coords[1], coords[2])

  // 3. A Maps URL — pull coordinates or a query out of it.
  if (/^https?:\/\//i.test(value)) {
    const at = value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (at) return embedForCoords(at[1], at[2])
    try {
      const url = new URL(value)
      const q = url.searchParams.get('q') ?? url.searchParams.get('query')
      if (q) return embedForQuery(q)
    } catch {
      /* fall through to best-effort */
    }
    // Unparseable share link (e.g. maps.app.goo.gl): best-effort query by the URL.
    return embedForQuery(value)
  }

  // 4. Plain address / place name.
  return embedForQuery(value)
}
