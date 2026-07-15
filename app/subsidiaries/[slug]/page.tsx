import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { SubsidiaryDetail } from "@/components/subsidiary-detail"
import { SUBSIDIARIES, getSubsidiary, type Subsidiary } from "@/lib/subsidiaries"
import { getManagedSubsidiaries, getSubsidiariesData } from "@/lib/subsidiaries-config"
import type { ManagedSubsidiary } from "@/lib/ui-config/types"

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  // Only pre-render slugs that are actually visible — a disabled one still
  // resolves on demand (see resolveSubsidiary below), it just isn't built ahead of time.
  const managed = await getSubsidiariesData()
  const slugs = managed.length > 0 ? managed.map((s) => s.slug) : SUBSIDIARIES.map((s) => s.slug)
  return slugs.map((slug) => ({ slug }))
}

/**
 * If the CMS explicitly manages this slug, its `enabled` flag wins outright —
 * a disabled subsidiary never falls back to the bundled static entry, even
 * when one exists for the same slug. The bundled data is a resilience
 * fallback for slugs the CMS doesn't know about, not a way around an admin's
 * decision to hide one.
 */
async function resolveSubsidiary(
  slug: string,
): Promise<{ managed: ManagedSubsidiary | null; bundled: Subsidiary | null }> {
  const managedList = await getManagedSubsidiaries()
  const cmsEntry = managedList.find((s) => s.slug === slug)

  if (cmsEntry) {
    return { managed: cmsEntry.enabled !== false ? cmsEntry : null, bundled: null }
  }

  return { managed: null, bundled: getSubsidiary(slug) ?? null }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const { managed, bundled } = await resolveSubsidiary(slug)

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
  const [{ managed, bundled }, subsidiaries] = await Promise.all([
    resolveSubsidiary(slug),
    getSubsidiariesData(),
  ])

  if (!managed && !bundled) notFound()

  return (
    <main className="min-h-screen bg-background">
      <SiteNav variant="solid" />
      <SubsidiaryDetail slug={slug} managed={managed} />
      <SiteFooter subsidiaries={subsidiaries} />
    </main>
  )
}
