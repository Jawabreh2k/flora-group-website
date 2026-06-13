import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { SubsidiaryDetail } from "@/components/subsidiary-detail"
import { SUBSIDIARIES, getSubsidiary } from "@/lib/subsidiaries"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return SUBSIDIARIES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const subsidiary = getSubsidiary(slug)
  if (!subsidiary) return { title: "Subsidiary — Flora Group W.L.L." }

  // Metadata is rendered at build time (locale-agnostic); use the English base.
  return {
    title: `${subsidiary.name.en} — Flora Group W.L.L.`,
    description: subsidiary.short.en,
  }
}

export default async function SubsidiaryPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const subsidiary = getSubsidiary(slug)
  if (!subsidiary) notFound()

  return (
    <main className="min-h-screen bg-background">
      <SiteNav variant="solid" />
      <SubsidiaryDetail slug={subsidiary.slug} />
      <SiteFooter />
    </main>
  )
}
