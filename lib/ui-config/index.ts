import { cache } from "react"
import { env } from "@/lib/env"
import { DEFAULT_UI_CONFIG } from "./defaults"
import type { UiConfig, UiConfigPayload } from "./types"

export * from "./types"
export { themeToCssVars } from "./css-vars"
export { DEFAULT_UI_CONFIG } from "./defaults"

/**
 * Fetches the live UI configuration from the CMS. Always resolves — on any
 * failure (network, non-200, bad JSON) it falls back to DEFAULT_UI_CONFIG so the
 * site never breaks because of a backend outage.
 *
 * Wrapped in React `cache()` so the layout and the page share a single fetch per
 * request render.
 */
export const getUiConfig = cache(async (): Promise<UiConfigPayload> => {
  try {
    const res = await fetch(`${env.apiUrl}/api/ui/config`, {
      next: { revalidate: env.configRevalidate, tags: ["ui-config"] },
      headers: { Accept: "application/json" },
    })

    if (!res.ok) {
      console.error(`[ui-config] CMS responded ${res.status}; using defaults.`)
      return DEFAULT_UI_CONFIG
    }

    const data = (await res.json()) as UiConfig
    // Merge over defaults so a partial payload (e.g. new field missing) is safe.
    return {
      theme: { ...DEFAULT_UI_CONFIG.theme, ...data.payload?.theme },
      branding: { ...DEFAULT_UI_CONFIG.branding, ...data.payload?.branding },
      sections: { ...DEFAULT_UI_CONFIG.sections, ...data.payload?.sections },
      images: { ...DEFAULT_UI_CONFIG.images, ...data.payload?.images },
      content: data.payload?.content,
    }
  } catch (err) {
    console.error("[ui-config] Failed to reach CMS; using defaults.", err)
    return DEFAULT_UI_CONFIG
  }
})
