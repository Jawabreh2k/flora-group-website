"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { MESSAGES, type Locale, type Messages } from "@/lib/i18n/messages"

type Direction = "ltr" | "rtl"

type I18nValue = {
  locale: Locale
  dir: Direction
  t: Messages
  setLocale: (l: Locale) => void
  toggle: () => void
}

const I18nContext = createContext<I18nValue | null>(null)
const STORAGE_KEY = "flora-locale"

export function I18nProvider({ children }: { children: React.ReactNode }) {
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

  const value: I18nValue = {
    locale,
    dir: locale === "ar" ? "rtl" : "ltr",
    t: MESSAGES[locale],
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
