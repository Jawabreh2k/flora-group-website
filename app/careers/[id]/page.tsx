import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { JobPostingJsonLd } from "@/components/seo/job-posting-json-ld"
import { JobDetailView } from "@/components/careers/job-detail-view"
import { getSubsidiariesData } from "@/lib/subsidiaries-config"
import { getJobDetailForPage } from "@/lib/jobs/server"
import { isJobClosed } from "@/lib/jobs/types"

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

  // Metadata/OG tags stay in English regardless of a job's Arabic translation —
  // crawlers expect one canonical language per URL, same reasoning as the
  // JobPosting JSON-LD (see components/seo/job-posting-json-ld.tsx).
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

  // GetPublishedJobQuery deliberately still returns closed jobs (unlike the board
  // list) so an already-shared or indexed link doesn't just 404 — but the apply
  // flow would fail server-side anyway, so swap it for a clear closed notice.
  const isClosed = isJobClosed(job.closingDate)

  return (
    <main className="min-h-screen bg-background">
      <JobPostingJsonLd job={job} />
      <SiteNav variant="solid" />
      <JobDetailView job={job} isClosed={isClosed} />
      <SiteFooter subsidiaries={subsidiaries} />
    </main>
  )
}
