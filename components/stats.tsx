"use client"

import { CalendarDays, Layers, ShieldCheck, Globe2 } from "lucide-react"
import { motion } from "framer-motion"
import { CountUp } from "@/components/count-up"
import { Container } from "@/components/ui/container"
import { useI18n } from "@/components/i18n-provider"

const EASE = [0.16, 1, 0.3, 1] as const

export function Stats() {
  const { t, locale } = useI18n()
  const localeTag = locale === "ar" ? "ar-EG" : "en-US"

  const stats = [
    {
      icon: CalendarDays,
      label: t.stats.established,
      count: { value: 1993, group: false },
    },
    { icon: Layers, label: t.stats.verticals, count: { value: 6 } },
    {
      icon: ShieldCheck,
      label: t.stats.certified,
      static: locale === "ar" ? "الداخلية" : "MOI",
    },
    {
      icon: Globe2,
      label: t.stats.countries,
      count: { value: 26, suffix: "+" },
    },
  ]

  return (
    <section id="legacy" className="relative border-y border-border bg-card">
      <Container className="py-14 lg:py-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              className="group relative flex flex-col gap-4 bg-card p-6 transition-colors hover:bg-muted/40 lg:p-8"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-gold/12 text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                <s.icon className="size-5" strokeWidth={1.7} />
              </span>
              <p className="font-serif text-3xl font-semibold tracking-tight text-primary lg:text-4xl">
                {s.count ? (
                  <CountUp
                    value={s.count.value}
                    suffix={s.count.suffix}
                    group={s.count.group}
                    localeTag={localeTag}
                  />
                ) : (
                  s.static
                )}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
