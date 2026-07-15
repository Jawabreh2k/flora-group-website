import 'server-only'

/**
 * Fixed-window rate limiter, in-memory per server process.
 *
 * Caveat: on a multi-instance serverless deployment (e.g. Vercel with several
 * concurrent lambdas) each instance holds its own counter, so the effective
 * limit is (perInstanceLimit * instanceCount) rather than a hard global cap.
 * This still meaningfully blocks single-source spam/scraping — which is the
 * actual threat on these routes — without adding an external dependency. If
 * traffic grows enough that distributed accuracy matters, swap this module
 * for Upstash Redis or Vercel KV behind the same `checkRateLimit` signature.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

// Prevents unbounded growth from unique/spoofed IPs over a long-running process.
const MAX_TRACKED_KEYS = 10_000

export type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      pruneExpired(now)
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) }
  }

  existing.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/** Best-effort client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}
