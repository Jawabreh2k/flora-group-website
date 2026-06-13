"use client"

import { Languages } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

export function LanguageToggle({ className }: { className?: string }) {
  const { t, toggle } = useI18n()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.switchTo}
      title={t.nav.switchTo}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground/80 transition-colors hover:border-gold/45 hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      <Languages className="size-4" strokeWidth={1.8} />
      <span className="font-semibold">{t.nav.languageName}</span>
    </button>
  )
}
