// `server-only` is a Next.js build-time virtual module (not a real npm package),
// so plain Node test runners can't resolve it. Aliased here to a no-op — see
// vitest.config.ts. Tests exercise the underlying logic directly, not the
// server/client boundary that `server-only` enforces at build time.
export {}
