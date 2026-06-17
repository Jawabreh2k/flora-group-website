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

  const canonical = `/subsidiaries/${slug}`

  if (managed) {
    const title = `${managed.name.en} — Flora Group W.L.L.`
    return {
      title,
      description: managed.short.en,
      alternates: { canonical },
      openGraph: { title, description: managed.short.en, url: canonical },
    }
  }

  if (!bundled) return { title: "Subsidiary — Flora Group W.L.L.", alternates: { canonical } }

  const title = `${bundled.name.en} — Flora Group W.L.L.`
  return {
    title,
    description: bundled.short.en,
    alternates: { canonical },
    openGraph: { title, description: bundled.short.en, url: canonical },
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
