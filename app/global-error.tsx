"use client"

import { useEffect } from "react"

// Root-layout-level fallback. Next.js renders this when the error occurs above
// app/error.tsx (i.e. in RootLayout itself), so it cannot depend on I18nProvider,
// the CMS theme, or any custom fonts — it must supply its own <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[global-error]", error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#fcfbf9",
          color: "#3a2329",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "28rem" }}>
          <p
            style={{
              fontSize: "4rem",
              fontWeight: 700,
              margin: 0,
              color: "#4a0e17",
            }}
          >
            500
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: "1rem" }}>
            Something went wrong.
          </h1>
          <p style={{ marginTop: "0.75rem", lineHeight: 1.6, color: "#6f6760" }}>
            The site failed to load. Please try again — if this keeps
            happening, contact support.
          </p>
          {error.digest && (
            <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#a39a90" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.625rem",
              border: "none",
              background: "#4a0e17",
              color: "#fbf6ef",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
