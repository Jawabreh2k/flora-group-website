"use client"

import Link from "next/link"
import { ArrowLeft, Briefcase, Building2, MapPin } from "lucide-react"
import { Container } from "@/components/ui/container"
import { JobApplyButton } from "@/components/careers/job-apply-button"
import { useI18n } from "@/components/i18n-provider"
import type { JobDetail } from "@/lib/jobs/types"
import { formatEnumLabel } from "@/lib/jobs/types"

/**
 * The job-content body of /careers/[id] — split out from the server-rendered
 * page shell specifically so it can react to the language toggle. Arabic
 * translation is optional per job (see ManagedSubsidiary-style fallback
 * pattern): titleAr/descriptionAr/requirementsAr/responsibilitiesAr fall back
 * to their English counterparts whenever a job hasn't been translated yet, so
 * switching to Arabic never produces a blank section.
 */
export function JobDetailView({ job, isClosed }: { job: JobDetail; isClosed: boolean }) {
  const { t, locale } = useI18n()

  const title = locale === "ar" && job.titleAr ? job.titleAr : job.title
  const description = locale === "ar" && job.descriptionAr ? job.descriptionAr : job.description
  const requirements = locale === "ar" && job.requirementsAr.length > 0 ? job.requirementsAr : job.requirements
  const responsibilities =
    locale === "ar" && job.responsibilitiesAr.length > 0 ? job.responsibilitiesAr : job.responsibilities

  const descriptionParagraphs = description.split("\n").filter((line) => line.trim().length > 0)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-maroon-deep text-white">
        <div className="bg-radial-fade absolute inset-x-0 top-0 -z-10 h-[420px] opacity-40" aria-hidden />
        <Container className="py-24 lg:py-32">
          <Link
            href="/careers#positions"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" />
            {t.careers.detail.back}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
              {job.department}
            </span>
            <span className="text-[11px] font-medium text-white/70">
              {formatEnumLabel(job.jobType)}
            </span>
          </div>

          <h1 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-gold" />
              <dd>{job.company.name}</dd>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-gold" />
              <dd>
                {formatEnumLabel(job.locationType)} · {job.locationText}
              </dd>
            </div>
            {job.salaryRange && (
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-gold" />
                <dd>{job.salaryRange}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8">
            {isClosed ? (
              <p className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/85">
                {t.careers.detail.closedNotice}{" "}
                <Link href="/careers#positions" className="font-medium text-gold hover:underline">
                  {t.careers.detail.viewOpenPositions}
                </Link>
              </p>
            ) : (
              <JobApplyButton job={job} />
            )}
          </div>
        </Container>
      </section>

      <section className="bg-background">
        <Container className="grid gap-10 py-16 lg:grid-cols-[1fr_320px] lg:py-24">
          <article className="min-w-0">
            <h2 className="font-serif text-xl font-semibold text-foreground">{t.careers.detail.aboutRole}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {requirements.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {t.careers.detail.requirements}
                </h2>
                <ul className="mt-4 space-y-2">
                  {requirements.map((item, index) => (
                    <li key={index} className="flex gap-3 text-muted-foreground">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {responsibilities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {t.careers.detail.responsibilities}
                </h2>
                <ul className="mt-4 space-y-2">
                  {responsibilities.map((item, index) => (
                    <li key={index} className="flex gap-3 text-muted-foreground">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg font-semibold text-foreground">{job.company.name}</h3>
              {job.company.description && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {job.company.description}
                </p>
              )}
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-primary hover:text-gold"
                >
                  {job.company.website}
                </a>
              )}
              <div className="mt-6">
                {isClosed ? (
                  <p className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                    {t.careers.detail.closedNotice}{" "}
                    <Link href="/careers#positions" className="font-medium text-primary hover:text-gold">
                      {t.careers.detail.viewOpenPositions}
                    </Link>
                  </p>
                ) : (
                  <JobApplyButton job={job} />
                )}
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  )
}
