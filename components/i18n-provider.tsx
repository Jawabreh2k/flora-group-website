"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { MESSAGES, type Locale, type Messages } from "@/lib/i18n/messages"
import type { CmsContent, ContentOverrides, Images } from "@/lib/ui-config/types"

type Direction = "ltr" | "rtl"

type I18nValue = {
  locale: Locale
  dir: Direction
  t: Messages
  /** CMS-managed images, with code defaults already applied. */
  images: Images
  setLocale: (l: Locale) => void
  toggle: () => void
}

const I18nContext = createContext<I18nValue | null>(null)
const STORAGE_KEY = "flora-locale"

const DEFAULT_IMAGES: Images = {
  logo: "/images/flora-group-logo.png",
  heroImage: "/images/hero-doha.jpg",
}

/**
 * Maps the flat CMS content groups (as stored in the DB) to the nested Messages
 * shape expected by deepMerge. Groups like careersHero / careersCulture get
 * assembled into `careers: { ...hero, culture: {...}, ... }`.
 */
function cmsToMessages(cms: CmsContent): Partial<Messages> {
  const hasCareersPart =
    cms.careersHero ||
    cms.careersCulture ||
    cms.careersBenefits ||
    cms.careersPositions ||
    cms.careersCta

  return {
    ...(cms.hero && { hero: cms.hero as unknown as Messages["hero"] }),
    ...(cms.subsidiaries && { subsidiaries: cms.subsidiaries as unknown as Messages["subsidiaries"] }),
    ...(cms.spotlight && { spotlight: cms.spotlight as unknown as Messages["spotlight"] }),
    ...(cms.footer && { footer: cms.footer as unknown as Messages["footer"] }),
    ...(cms.contact && { contact: cms.contact as unknown as Messages["contact"] }),
    ...(hasCareersPart && {
      careers: {
        ...cms.careersHero,
        ...(cms.careersCulture && { culture: cms.careersCulture }),
        ...(cms.careersBenefits && { benefits: cms.careersBenefits }),
        ...(cms.careersPositions && { positions: cms.careersPositions }),
        ...(cms.careersCta && { cta: cms.careersCta }),
      } as unknown as Messages["careers"],
    }),
  }
}

/** Recursively merges plain-object overrides onto a base; non-objects replace.
 *  Empty strings are treated as "not set" and fall back to the base value. */
function deepMerge<T>(base: T, override: unknown): T {
  if (
    override == null ||
    (typeof override === "string" && override === "") ||
    typeof override !== "object" ||
    Array.isArray(override) ||
    typeof base !== "object" ||
    base == null
  ) {
    // Empty string → keep the bundled default
    if (typeof override === "string" && override === "") return base as T
    return (override ?? base) as T
  }
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    if (value === undefined) continue
    result[key] = deepMerge((base as Record<string, unknown>)[key], value)
  }
  return result as T
}

export function I18nProvider({
  children,
  content,
  images,
}: {
  children: React.ReactNode
  /** Bilingual copy overrides fetched from the CMS (server-rendered). */
  content?: ContentOverrides
  /** CMS image URLs (server-rendered). */
  images?: Partial<Images>
}) {
  // Always start at the server-rendered default to avoid hydration mismatch;
  // the saved preference is applied in an effect after mount.
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === "en" || saved === "ar") setLocaleState(saved)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = locale === "ar" ? "rtl" : "ltr"
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === "en" ? "ar" : "en"
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  // Layer CMS copy overrides on top of the bundled dictionary for the active locale.
  const t = useMemo<Messages>(() => {
    const base = MESSAGES[locale]
    const cms = content?.[locale]
    return cms ? deepMerge(base, cmsToMessages(cms)) : base
  }, [locale, content])

  const resolvedImages = useMemo<Images>(
    () => ({ ...DEFAULT_IMAGES, ...images }),
    [images],
  )

  const value: I18nValue = {
    locale,
    dir: locale === "ar" ? "rtl" : "ltr",
    t,
    images: resolvedImages,
    setLocale,
    toggle,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>")
  return ctx
}
