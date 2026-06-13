"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { type Subsidiary, localizeSubsidiary } from "@/lib/subsidiaries"
import { BrandVisual } from "@/components/brand-visual"
import { useI18n } from "@/components/i18n-provider"

export function SubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
  const { locale, t } = useI18n()
  const s = localizeSubsidiary(subsidiary, locale)

  return (
    <Link
      href={`/subsidiaries/${s.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-start shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={s.name}
    >
      <div className="relative h-52 w-full overflow-hidden sm:h-56">
        <BrandVisual subsidiary={s} className="h-full w-full" />
        {/* Light sweep on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
          {s.tag}
        </p>
        <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {s.name}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {s.short}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {t.subsidiaries.explore}
          <span className="grid size-6 place-items-center rounded-full bg-primary/8 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground rtl:-scale-x-100">
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px" />
          </span>
        </span>
      </div>
    </Link>
  )
}
