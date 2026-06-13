"use client"

import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Heart,
  MapPin,
  Send,
  Sparkles,
  Target,
  Upload,
  Users,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/section-heading"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { useI18n } from "@/components/i18n-provider"
import {
  DEPARTMENTS,
  JOB_LISTINGS,
  getDepartmentLabel,
  localizeJob,
  type DepartmentFilter,
} from "@/lib/careers"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

const VALUE_ICONS = [GraduationCap, Target, Globe2, Heart] as const

export function CareersContent() {
  const { t, locale } = useI18n()
  const [filter, setFilter] = useState<DepartmentFilter>("all")
  const [sent, setSent] = useState(false)
  const [selectedJob, setSelectedJob] = useState("")
  const formRef = useRef<HTMLElement>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    cover: "",
  })

  const jobs = useMemo(() => {
    return JOB_LISTINGS.filter((job) => {
      if (filter === "all") return true
      return job.department.en === filter
    }).map((job) => localizeJob(job, locale))
  }, [filter, locale])

  const scrollToApply = (jobId?: string) => {
    if (jobId) setSelectedJob(jobId)
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const stats = [
    { value: locale === "ar" ? "+٣٠" : "30+", label: t.careers.stats.years },
    { value: locale === "ar" ? "٦" : "6", label: t.careers.stats.verticals },
    { value: locale === "ar" ? "+٥٠" : "50+", label: t.careers.stats.partners },
    { value: locale === "ar" ? "+٧٠" : "70+", label: t.careers.stats.team },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden text-white">
        <Image
          src="/images/careers-hero.jpg"
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
                onClick={() => scrollToApply()}
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
                onClick={() => scrollToApply()}
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

      {/* Open positions */}
      <section id="positions" className="bg-background scroll-mt-28">
        <Container className="py-20 lg:py-28">
          <SectionHeading
            eyebrow={t.careers.positions.eyebrow}
            title={t.careers.positions.title}
            description={t.careers.positions.description}
          />

          <Reveal className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t.careers.positions.filterLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setFilter(dept)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    filter === dept
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-foreground/70 hover:border-gold/40 hover:text-foreground",
                  )}
                >
                  {getDepartmentLabel(dept, locale)}
                </button>
              ))}
            </div>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-4">
            {jobs.length === 0 ? (
              <RevealItem>
                <p className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
                  {t.careers.positions.noResults}
                </p>
              </RevealItem>
            ) : (
              jobs.map((job) => (
                <RevealItem key={job.id}>
                  <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-luxe">
                    <div className="absolute inset-y-0 start-0 w-1 bg-gold/0 transition-colors group-hover:bg-gold" />
                    <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-7">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gold/12 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                            {job.department}
                          </span>
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="mt-3 font-serif text-xl font-semibold text-foreground">
                          {job.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {job.summary}
                        </p>
                        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="size-3.5 text-gold" />
                            <dt className="sr-only">{t.careers.positions.subsidiary}</dt>
                            <dd>{job.subsidiary}</dd>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-gold" />
                            <dt className="sr-only">{t.careers.positions.location}</dt>
                            <dd>{job.location}</dd>
                          </div>
                        </dl>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => scrollToApply(job.id)}
                        className="h-11 shrink-0 gap-2 rounded-full px-6"
                      >
                        <Briefcase className="size-4" />
                        {t.careers.positions.apply}
                      </Button>
                    </div>
                  </article>
                </RevealItem>
              ))
            )}
          </RevealGroup>
        </Container>
      </section>

      {/* Application form */}
      <section
        id="apply"
        ref={formRef}
        className="border-t border-border bg-muted/30 scroll-mt-28"
      >
        <Container className="py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <SectionHeading
              eyebrow={t.careers.application.eyebrow}
              title={t.careers.application.title}
              description={t.careers.application.description}
            />

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-7 shadow-sm lg:p-9">
                {sent ? (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <CheckCircle2 className="size-12 text-gold" />
                    <p className="font-serif text-xl font-semibold text-foreground">
                      {t.careers.application.successTitle}
                    </p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {t.careers.application.successBody}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setSent(false)
                        setSelectedJob("")
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          linkedin: "",
                          cover: "",
                        })
                      }}
                    >
                      {t.careers.application.submitAnother}
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSent(true)
                    }}
                    className="flex flex-col gap-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label={t.careers.application.fullName}
                        id="career-name"
                        value={form.name}
                        onChange={update("name")}
                        required
                      />
                      <Field
                        label={t.careers.application.email}
                        id="career-email"
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        required
                      />
                    </div>
                    <Field
                      label={t.careers.application.phone}
                      id="career-phone"
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      required
                    />
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="career-position"
                        className="text-sm font-medium text-foreground"
                      >
                        {t.careers.application.position}
                      </label>
                      <select
                        id="career-position"
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="h-11 rounded-md border border-input bg-background px-3.5 text-sm text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      >
                        <option value="">{t.careers.application.generalOption}</option>
                        {JOB_LISTINGS.map((job) => {
                          const j = localizeJob(job, locale)
                          return (
                            <option key={job.id} value={job.id}>
                              {j.title} — {j.subsidiary}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <Field
                      label={t.careers.application.linkedin}
                      id="career-linkedin"
                      type="url"
                      value={form.linkedin}
                      onChange={update("linkedin")}
                      placeholder={t.careers.application.linkedinPlaceholder}
                    />
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="career-resume"
                        className="text-sm font-medium text-foreground"
                      >
                        {t.careers.application.resume}
                      </label>
                      <label
                        htmlFor="career-resume"
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center transition-colors hover:border-gold/50 hover:bg-muted/60"
                      >
                        <Upload className="size-6 text-gold" />
                        <span className="text-sm text-muted-foreground">
                          {t.careers.application.resumeHint}
                        </span>
                        <input
                          id="career-resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="sr-only"
                          disabled
                        />
                      </label>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="career-cover"
                        className="text-sm font-medium text-foreground"
                      >
                        {t.careers.application.coverLetter}
                      </label>
                      <textarea
                        id="career-cover"
                        rows={4}
                        value={form.cover}
                        onChange={update("cover")}
                        placeholder={t.careers.application.coverPlaceholder}
                        className="resize-none rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <Button type="submit" size="lg" className="h-11 gap-2">
                      <Send className="size-4 rtl:-scale-x-100" />
                      {t.careers.application.submit}
                    </Button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
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
            <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
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

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="h-11 rounded-md border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
      />
    </div>
  )
}
