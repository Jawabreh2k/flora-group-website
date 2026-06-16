"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  MapPin,
  Phone,
  Printer,
  Mail,
  Check,
  ArrowRight,
  CalendarDays,
  Layers,
  Building2,
} from "lucide-react"
import {
  getSubsidiary,
  getRelatedSubsidiaries,
  localizeSubsidiary,
  convertManagedToSubsidiary,
} from "@/lib/subsidiaries"
import type { ManagedSubsidiary } from "@/lib/ui-config/types"
import { SUBSIDIARY_ICON_MAP } from "@/lib/subsidiary-icons"
import { SubsidiaryCard } from "@/components/subsidiary-card"
import { BrandVisual } from "@/components/brand-visual"
import { SectionHeading } from "@/components/section-heading"
import { Container } from "@/components/ui/container"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import { buttonVariants } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

export function SubsidiaryDetail({
  slug,
  managed,
}: {
  slug: string
  managed?: ManagedSubsidiary | null
}) {
  const { locale, t } = useI18n()
  const subsidiary = useMemo(() => {
    if (managed) return convertManagedToSubsidiary(managed, SUBSIDIARY_ICON_MAP)
    return getSubsidiary(slug) ?? null
  }, [slug, managed])

  if (!subsidiary) return <div className="min-h-screen" />

  const s = localizeSubsidiary(subsidiary, locale)
  const { icon: Icon, contact } = s
  const related = getRelatedSubsidiaries(s.slug, 3)

  return (
    <article>
      {/* ---------------------------------------------------------------- Hero */}
      <header className="relative isolate overflow-hidden">
        <div className="relative min-h-[min(56vh,32rem)] lg:min-h-[min(62vh,36rem)]">
          <BrandVisual
            subsidiary={s}
            variant="hero"
            bare
            className="absolute inset-0 h-full w-full"
          />

          <Container className="relative z-10 flex min-h-[inherit] flex-col justify-end pb-12 pt-28 lg:pb-16 lg:pt-36">
            {/* Breadcrumb */}
            <Reveal className="flex items-center gap-1.5 text-xs font-medium text-white/75">
              <Link href="/#home" className="transition-colors hover:text-white">
                {t.detail.breadcrumbHome}
              </Link>
              <ChevronRight className="size-3.5 rtl:-scale-x-100" />
              <Link
                href="/#subsidiaries"
                className="transition-colors hover:text-white"
              >
                {t.detail.breadcrumbSubs}
              </Link>
              <ChevronRight className="size-3.5 rtl:-scale-x-100" />
              <span className="text-white">{s.name}</span>
            </Reveal>

            <Reveal delay={0.05} className="mt-8 flex flex-wrap items-center gap-4">
              {s.logo ? (
                <span className="flex items-center rounded-xl bg-white/95 px-3.5 py-2.5 shadow-sm ring-1 ring-black/5">
                  <Image
                    src={s.logo}
                    alt={s.name}
                    width={200}
                    height={56}
                    className="h-9 w-auto object-contain"
                  />
                </span>
              ) : (
                <span className="grid size-14 place-items-center rounded-2xl border border-white/25 bg-black/30 text-white backdrop-blur-md">
                  <Icon className="size-7" strokeWidth={1.6} />
                </span>
              )}
              <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                {s.tag}
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="mt-6 max-w-3xl text-balance font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {s.name}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/85 lg:text-lg">
                {s.short}
              </p>
            </Reveal>

            <Reveal delay={0.25} className="mt-9">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg", variant: "gold" }),
                  "group h-11 gap-2 px-6",
                )}
              >
                {t.detail.contactUs}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
              </Link>
            </Reveal>
          </Container>
        </div>
      </header>

      {/* ------------------------------------------------------------ Metrics */}
      <section className="border-b border-border bg-card">
        <Container>
          <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
            {s.metrics.map((m) => (
              <div key={m.label} className="px-2 py-8 text-center sm:px-6">
                <dt className="font-serif text-3xl font-semibold tracking-tight text-primary lg:text-4xl">
                  {m.value}
                </dt>
                <dd className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {m.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ----------------------------------------------------------- Overview */}
      <section className="bg-background">
        <Container className="grid gap-12 py-20 lg:grid-cols-[1.6fr_1fr] lg:gap-16 lg:py-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-6 bg-gold/60" aria-hidden />
              {t.detail.overviewEyebrow}
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-foreground">
              {t.detail.overviewTitle} {s.name}.
            </h2>
            <div className="mt-6 space-y-5">
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-pretty leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          {/* At-a-glance card */}
          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <div className="relative h-40 overflow-hidden">
                  <BrandVisual subsidiary={s} bare className="h-full w-full" />
                </div>
                <div className="border-b border-border bg-muted/50 px-6 py-5">
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {t.detail.atAGlance}
                  </h3>
                </div>
                <dl className="divide-y divide-border">
                  <Fact icon={Layers} label={t.detail.sector} value={s.tag} />
                  <Fact
                    icon={CalendarDays}
                    label={t.detail.established}
                    value={s.established}
                  />
                  <Fact
                    icon={Building2}
                    label={t.detail.partOf}
                    value={t.detail.partOfValue}
                  />
                </dl>
                <div className="border-t border-border p-6">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    {t.detail.getInTouch}
                  </h4>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>{contact.address}</span>
                    </li>
                    {contact.phone && (
                      <li className="flex gap-3">
                        <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
                        <span dir="ltr">{contact.phone}</span>
                      </li>
                    )}
                    {contact.fax && (
                      <li className="flex gap-3">
                        <Printer className="mt-0.5 size-4 shrink-0 text-gold" />
                        <span dir="ltr">{contact.fax}</span>
                      </li>
                    )}
                    {contact.email && (
                      <li className="flex gap-3">
                        <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                        <a
                          href={`mailto:${contact.email}`}
                          dir="ltr"
                          className="break-all transition-colors hover:text-primary"
                        >
                          {contact.email}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* -------------------------------------------------------- Highlights */}
      <section className="border-y border-border bg-muted/40">
        <Container className="py-20 lg:py-28">
          <SectionHeading
            eyebrow={t.detail.capabilitiesEyebrow}
            title={t.detail.capabilitiesTitle}
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {s.highlights.map((h) => (
              <RevealItem key={h.title}>
                <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-gold/40">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-gold/15">
                    <Check className="size-4 text-primary" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{h.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {h.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* ----------------------------------------------------------- Related */}
      <section className="bg-background">
        <Container className="py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t.detail.relatedEyebrow}
              title={t.detail.relatedTitle}
              className="max-w-xl"
            />
            <Link
              href="/#subsidiaries"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              {t.detail.viewAll}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </Link>
          </div>
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rel) => (
              <RevealItem key={rel.slug} className="h-full">
                <SubsidiaryCard subsidiary={rel} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </article>
  )
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Layers
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 px-6 py-4">
      <Icon className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.8} />
      <div>
        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}
