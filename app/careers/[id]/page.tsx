import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Briefcase, Building2, MapPin } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Container } from "@/components/ui/container"
import { JobPostingJsonLd } from "@/components/seo/job-posting-json-ld"
import { JobApplyButton } from "@/components/careers/job-apply-button"
import { getSubsidiariesData } from "@/lib/subsidiaries-config"
import { getJobDetailForPage } from "@/lib/jobs/server"
import { formatEnumLabel, isJobClosed } from "@/lib/jobs/types"
import { MESSAGES, DEFAULT_LOCALE } from "@/lib/i18n/messages"

type Params = { id: string }

// Live CMS-backed content — a stale build-time snapshot of "open roles" would
// mislead applicants, so this route always renders per-request.
export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { id } = await params
  const job = await getJobDetailForPage(id)
  const canonical = `/careers/${id}`

  if (!job) {
    return { title: "Position not found — Flora Group Careers", alternates: { canonical } }
  }

  const title = `${job.title} — ${job.company.name} | Flora Group Careers`
  const description = job.description.length > 200 ? `${job.description.slice(0, 197)}...` : job.description

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  }
}

export default async function JobDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const [job, subsidiaries] = await Promise.all([
    getJobDetailForPage(id),
    getSubsidiariesData(),
  ])

  if (!job) notFound()

  // Server component (needed for SEO — crawlers must see this rendered), so it
  // can't use the client-side useI18n() language toggle. Uses bundled English
  // strings directly; moot in practice since job content itself (title,
  // description, requirements) is only ever stored in English by the CMS.
  const t = MESSAGES[DEFAULT_LOCALE].careers
  const descriptionParagraphs = job.description.split("\n").filter((line) => line.trim().length > 0)
  // GetPublishedJobQuery deliberately still returns closed jobs (unlike the board
  // list) so an already-shared or indexed link doesn't just 404 — but the apply
  // flow would fail server-side anyway, so swap it for a clear closed notice.
  const isClosed = isJobClosed(job.closingDate)

  return (
    <main className="min-h-screen bg-background">
      <JobPostingJsonLd job={job} />
      <SiteNav variant="solid" />

      <section className="relative isolate overflow-hidden bg-primary text-white">
        <div className="bg-radial-fade absolute inset-x-0 top-0 -z-10 h-[420px] opacity-40" aria-hidden />
        <Container className="py-24 lg:py-32">
          <Link
            href="/careers#positions"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" />
            {t.detail.back}
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
            {job.title}
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
                {t.detail.closedNotice}{" "}
                <Link href="/careers#positions" className="font-medium text-gold hover:underline">
                  {t.detail.viewOpenPositions}
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
            <h2 className="font-serif text-xl font-semibold text-foreground">{t.detail.aboutRole}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {job.requirements.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {t.detail.requirements}
                </h2>
                <ul className="mt-4 space-y-2">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex gap-3 text-muted-foreground">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.responsibilities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {t.detail.responsibilities}
                </h2>
                <ul className="mt-4 space-y-2">
                  {job.responsibilities.map((item, index) => (
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
                    {t.detail.closedNotice}{" "}
                    <Link href="/careers#positions" className="font-medium text-primary hover:text-gold">
                      {t.detail.viewOpenPositions}
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

      <SiteFooter subsidiaries={subsidiaries} />
    </main>
  )
}
