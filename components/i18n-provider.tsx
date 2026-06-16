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
import type { CmsContent, ContentOverrides, Images, Social } from "@/lib/ui-config/types"

type Direction = "ltr" | "rtl"

type I18nValue = {
  locale: Locale
  dir: Direction
  t: Messages
  images: Images
  social?: Social
  setLocale: (l: Locale) => void
  toggle: () => void
}

const I18nContext = createContext<I18nValue | null>(null)
const STORAGE_KEY = "flora-locale"

const DEFAULT_IMAGES: Images = {
  logo: "/images/flora-group-logo.png",
  heroImage: "/images/hero-doha.jpg",
  contactHero: "/images/contact-doha.jpg",
  careersHero: "/images/careers-hero.jpg",
}

function cultureValuesFromCms(cms: CmsContent) {
  const v = cms.careersCultureValues
  if (!v) return undefined
  const items = [
    { title: v.value1Title, body: v.value1Body },
    { title: v.value2Title, body: v.value2Body },
    { title: v.value3Title, body: v.value3Body },
    { title: v.value4Title, body: v.value4Body },
  ].filter((item) => item.title || item.body)
  return items.length > 0 ? items : undefined
}

/**
 * Maps the flat CMS content groups (as stored in the DB) to the nested Messages
 * shape expected by deepMerge.
 */
function cmsToMessages(cms: CmsContent): Partial<Messages> {
  const hasCareersPart =
    cms.careersHero ||
    cms.careersCulture ||
    cms.careersBenefits ||
    cms.careersPositions ||
    cms.careersCta ||
    cms.careersStats ||
    cms.careersCultureValues ||
    cms.careersUi

  const cultureValues = cultureValuesFromCms(cms)

  return {
    ...(cms.hero && { hero: cms.hero as unknown as Messages["hero"] }),
    ...(cms.nav && { nav: cms.nav as unknown as Messages["nav"] }),
    ...(cms.stats && { stats: cms.stats as unknown as Messages["stats"] }),
    ...(cms.subsidiaries && { subsidiaries: cms.subsidiaries as unknown as Messages["subsidiaries"] }),
    ...(cms.spotlight && { spotlight: cms.spotlight as unknown as Messages["spotlight"] }),
    ...(cms.footer && { footer: cms.footer as unknown as Messages["footer"] }),
    ...(cms.contact && { contact: cms.contact as unknown as Messages["contact"] }),
    ...(hasCareersPart && {
      careers: {
        ...(cms.pages?.careersMetaTitle && { metaTitle: cms.pages.careersMetaTitle }),
        ...(cms.pages?.careersMetaDescription && { metaDescription: cms.pages.careersMetaDescription }),
        ...cms.careersHero,
        ...(cms.careersCulture && {
          culture: {
            ...cms.careersCulture,
            ...(cultureValues && { values: cultureValues }),
          },
        }),
        ...(cms.careersBenefits && { benefits: cms.careersBenefits }),
        ...(cms.careersPositions && { positions: cms.careersPositions }),
        ...(cms.careersCta && { cta: cms.careersCta }),
        ...(cms.careersStats && { stats: cms.careersStats as unknown as Messages["careers"]["stats"] }),
        ...(cms.careersUi && { ui: cms.careersUi as unknown as Messages["careers"]["ui"] }),
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
  social,
}: {
  children: React.ReactNode
  content?: ContentOverrides
  images?: Partial<Images>
  social?: Social
}) {
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
    social,
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
