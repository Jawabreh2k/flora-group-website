"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, FileText, ShieldCheck, Globe2, Layers } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export function Hero() {
  const { t, locale } = useI18n()
  const trust = [
    { icon: Layers, label: t.hero.trustVerticals },
    { icon: ShieldCheck, label: t.hero.trustCertified },
    { icon: Globe2, label: t.hero.trustCountries },
  ]
  const six = locale === "ar" ? "٦" : "6"
  const thirty = locale === "ar" ? "+٣٠" : "30+"

  return (
    <section id="home" className="relative overflow-hidden pt-16 lg:pt-20">
      {/* Ambient background */}
      <div className="bg-radial-fade absolute inset-x-0 top-0 -z-10 h-[640px]" />
      <div className="bg-dots absolute inset-x-0 top-0 -z-10 h-[640px] text-primary/[0.04]" />

      <Container className="grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-28 lg:pt-20">
        {/* Copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
            </span>
            {t.hero.badge}
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 text-balance font-serif text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3.75rem]"
          >
            {t.hero.titleA}{" "}
            <span className="text-gradient-gold">{t.hero.titleHighlight}</span>{" "}
            {t.hero.titleB}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#subsidiaries"
              className={cn(buttonVariants({ size: "lg" }), "group h-12 gap-2 px-6")}
            >
              {t.hero.ctaExplore}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "group h-12 gap-2 px-6 text-primary",
              )}
            >
              <FileText className="size-4 transition-transform duration-300 group-hover:scale-110" />
              {t.hero.ctaProfile}
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.ul
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-sm text-muted-foreground"
          >
            {trust.map((tr) => (
              <li key={tr.label} className="flex items-center gap-2">
                <tr.icon className="size-4 text-gold" strokeWidth={1.8} />
                <span className="font-medium text-foreground/80">{tr.label}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Doha skyline — clean photo with light brand tint */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="group/visual relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-primary/15 shadow-luxe transition-shadow duration-500 group-hover/visual:shadow-[0_30px_60px_-24px_rgba(74,14,23,0.45)] sm:aspect-[5/5] lg:aspect-[4/4.4]">
            <Image
              src="/images/hero-doha.jpg"
              alt={t.hero.caption}
              fill
              priority
              className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/visual:scale-[1.04]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Subtle maroon tint so the photo matches brand colours */}
            <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/15 to-transparent" />
            {/* Gold glow at the horizon for golden-hour warmth */}
            <div className="absolute inset-x-0 top-1/4 h-1/2 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(197,168,128,0.18),transparent_70%)] mix-blend-screen" />

            {/* Official logo watermark */}
            <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-3 px-6">
              <Image
                src="/images/flora-group-logo.png"
                alt=""
                width={180}
                height={100}
                className="h-auto w-[min(72%,11rem)] object-contain opacity-95"
                aria-hidden
              />
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/55">
                {t.hero.caption}
              </span>
            </div>
          </div>

          {/* Floating stat cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
            className="animate-float absolute -left-4 top-8 hidden rounded-2xl border border-gold/30 bg-background/95 px-5 py-4 text-start shadow-luxe backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_12px_32px_-12px_rgba(74,14,23,0.25)] sm:block"
          >
            <p className="font-serif text-2xl font-semibold text-primary">{six}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t.hero.cardVerticals}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
            className="absolute -right-4 bottom-16 hidden rounded-2xl border border-gold/30 bg-background/95 px-5 py-4 text-start shadow-luxe backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_12px_32px_-12px_rgba(74,14,23,0.25)] sm:block"
            style={{ animation: "float 7s ease-in-out 1.5s infinite" }}
          >
            <p className="font-serif text-2xl font-semibold text-primary">{thirty}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t.hero.cardYears}
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
