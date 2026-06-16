"use client"

import { useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Cpu, ShieldCheck, Check } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Container } from "@/components/ui/container"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

export function Spotlight() {
  const { t } = useI18n()

  const TAB_CONFIG = [
    {
      id: "technology" as const,
      icon: Cpu,
      image: (t.spotlight as { technologyImage?: string }).technologyImage ?? "/images/flora-technology-cover.jpg",
      logo: (t.spotlight as { technologyLogo?: string }).technologyLogo ?? "/images/flora-technology-logo.png",
    },
    {
      id: "security" as const,
      icon: ShieldCheck,
      image: (t.spotlight as { securityImage?: string }).securityImage ?? "/images/flora-security-cover.jpg",
      logo: (t.spotlight as { securityLogo?: string }).securityLogo ?? "/images/flora-security-logo.png",
    },
  ]

  const tabs = TAB_CONFIG.map((c) => ({ ...c, ...t.spotlight[c.id] }))
  const [active, setActive] = useState<string>(TAB_CONFIG[0].id)
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0]

  return (
    <section id="spotlight" className="border-t border-border bg-muted/40">
      <Container className="py-20 lg:py-28">
        <SectionHeading
          eyebrow={t.spotlight.eyebrow}
          title={t.spotlight.title}
          description={t.spotlight.description}
        />

        {/* Tab triggers */}
        <div
          role="tablist"
          aria-label={t.spotlight.title}
          className="mt-10 inline-flex flex-col gap-2 rounded-2xl border border-border bg-card p-1.5 sm:flex-row"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors",
                active === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground",
              )}
            >
              <tab.icon className="size-4" strokeWidth={1.75} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            role="tabpanel"
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mt-10 grid gap-8 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:p-12"
          >
            {/* Visual + heading */}
            <div className="flex flex-col">
              <div className="relative isolate aspect-[5/3] overflow-hidden rounded-2xl">
                <Image
                  src={current.image}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute bottom-4 start-4 max-w-[min(85%,12rem)] rounded-lg bg-white/95 p-2 shadow-sm">
                  <Image
                    src={current.logo}
                    alt={current.heading}
                    width={200}
                    height={56}
                    className="h-auto w-full object-contain object-left rtl:object-right"
                  />
                </div>
              </div>
              <h3 className="mt-6 font-serif text-2xl font-semibold tracking-tight text-foreground">
                {current.heading}
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {current.subtitle}
              </p>
            </div>

            {/* Points */}
            <div className="grid gap-5 sm:grid-cols-2">
              {current.points.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.07 }}
                  className="rounded-2xl border border-border bg-background p-5 transition-colors hover:border-gold/40"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-6 place-items-center rounded-full bg-gold/15">
                      <Check className="size-3.5 text-primary" strokeWidth={3} />
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">
                      {p.title}
                    </h4>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  )
}
