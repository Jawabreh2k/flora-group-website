"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Heart,
  Sparkles,
  Target,
  Users,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/section-heading"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { useI18n } from "@/components/i18n-provider"
import { JobBoard } from "@/components/careers/job-board"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

const VALUE_ICONS = [GraduationCap, Target, Globe2, Heart] as const

export function CareersContent() {
  const { t, images } = useI18n()
  const positionsRef = useRef<HTMLElement>(null)

  const scrollToPositions = () => {
    positionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const careerStats = t.careers.stats as typeof t.careers.stats & {
    yearsValue?: string
    verticalsValue?: string
    partnersValue?: string
    teamValue?: string
  }

  const stats = [
    { value: careerStats.yearsValue ?? "30+", label: careerStats.years },
    { value: careerStats.verticalsValue ?? "6", label: careerStats.verticals },
    { value: careerStats.partnersValue ?? "50+", label: careerStats.partners },
    { value: careerStats.teamValue ?? "70+", label: careerStats.team },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden text-white">
        <Image
          src={images.careersHero}
          alt={t.careers.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/55 to-black/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 lg:px-8 lg:pb-24 lg:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="max-w-2xl rounded-2xl border border-white/15 bg-black/40 p-6 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-8"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden />
              {t.careers.eyebrow}
            </span>
            <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {t.careers.title}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/95 sm:text-lg">
              {t.careers.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToPositions}
                className={cn(
                  buttonVariants({ size: "lg", variant: "gold" }),
                  "group h-12 gap-2 px-6",
                )}
              >
                {t.careers.viewRoles}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
              </button>
              <button
                type="button"
                onClick={scrollToPositions}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 border-white/35 bg-white/10 px-6 text-white hover:border-white/50 hover:bg-white/20 hover:text-white",
                )}
              >
                {t.careers.generalApply}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <Container className="py-12 lg:py-14">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card px-4 py-8 text-center sm:px-6"
              >
                <dt className="font-serif text-3xl font-semibold tracking-tight text-primary lg:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Culture */}
      <section className="bg-background">
        <Container className="py-20 lg:py-28">
          <SectionHeading
            eyebrow={t.careers.culture.eyebrow}
            title={t.careers.culture.title}
            description={t.careers.culture.description}
          />
          <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2">
            {t.careers.culture.values.map((v, i) => {
              const Icon = VALUE_ICONS[i] ?? Sparkles
              return (
                <RevealItem key={v.title}>
                  <div className="group flex h-full gap-5 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-luxe">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                      <Icon className="size-5" strokeWidth={1.7} />
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        {v.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {v.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </Container>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-muted/40">
        <Container className="py-20 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <SectionHeading
              eyebrow={t.careers.benefits.eyebrow}
              title={t.careers.benefits.title}
            />
            <Reveal delay={0.1}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {t.careers.benefits.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/15">
                      <CheckCircle2 className="size-3 text-primary" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section ref={positionsRef}>
        <JobBoard />
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-maroon-deep text-white">
        <div className="bg-grid absolute inset-0 text-white/[0.04]" aria-hidden />
        <div className="absolute -right-1/4 -top-1/2 aspect-square w-1/2 rounded-full bg-gold/20 blur-3xl" />
        <Container className="relative flex flex-col items-start justify-between gap-8 py-16 lg:flex-row lg:items-center lg:py-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-gold">
              <Users className="size-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Flora Group HR
              </span>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {t.careers.cta.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {t.careers.cta.body}
            </p>
          </div>
          <a
            href={`mailto:${t.careers.cta.email}`}
            className={cn(
              buttonVariants({ size: "lg", variant: "gold" }),
              "group h-12 shrink-0 gap-2 px-6",
            )}
          >
            {t.careers.cta.button}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
          </a>
        </Container>
      </section>
    </>
  )
}
