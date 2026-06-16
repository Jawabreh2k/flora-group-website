import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { SubsidiaryDetail } from "@/components/subsidiary-detail"
import { SUBSIDIARIES, getSubsidiary } from "@/lib/subsidiaries"
import { getManagedSubsidiaries } from "@/lib/subsidiaries-config"

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  const managed = await getManagedSubsidiaries()
  const slugs = managed.length > 0 ? managed.map((s) => s.slug) : SUBSIDIARIES.map((s) => s.slug)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const managedList = await getManagedSubsidiaries()
  const managed = managedList.find((s) => s.slug === slug)
  const bundled = getSubsidiary(slug)

  if (managed) {
    return {
      title: `${managed.name.en} — Flora Group W.L.L.`,
      description: managed.short.en,
    }
  }

  if (!bundled) return { title: "Subsidiary — Flora Group W.L.L." }

  return {
    title: `${bundled.name.en} — Flora Group W.L.L.`,
    description: bundled.short.en,
  }
}

export default async function SubsidiaryPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const managedList = await getManagedSubsidiaries()
  const managed = managedList.find((item) => item.slug === slug) ?? null
  const bundled = getSubsidiary(slug)

  if (!managed && !bundled) notFound()

  const subsidiaries = await getManagedSubsidiaries()

  return (
    <main className="min-h-screen bg-background">
      <SiteNav variant="solid" />
      <SubsidiaryDetail slug={slug} managed={managed} />
      <SiteFooter subsidiaries={subsidiaries} />
    </main>
  )
}
