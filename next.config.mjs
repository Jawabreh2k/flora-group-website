// script-src needs 'unsafe-inline': Next's App Router injects inline RSC-
// streaming scripts (self.__next_f.push(...)) that hydration depends on.
// Tried the documented per-request-nonce middleware pattern first — Turbopack
// (the compiler this app builds with) doesn't apply the nonce to those
// injected scripts, so with a bare 'self' they're silently blocked and the
// page never hydrates. Revisit if/when Turbopack supports nonce injection;
// until then this is a real, deliberate tradeoff, not an oversight.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "frame-src https://www.google.com https://maps.google.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ')

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors now fail the build — the strict tsconfig is only worth anything if
  // the build actually enforces it.
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
    ]
  },
}

export default nextConfig
