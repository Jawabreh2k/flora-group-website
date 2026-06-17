import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { CareersContent } from "@/components/careers-content"
import { SiteFooter } from "@/components/site-footer"
import { getUiConfig } from "@/lib/ui-config"
import { getSubsidiariesData } from "@/lib/subsidiaries-config"

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getUiConfig()
  const pages = content?.en?.pages
  const title = pages?.careersMetaTitle ?? "Careers — Flora Group W.L.L."
  const description =
    pages?.careersMetaDescription ??
    "Join Flora Group W.L.L. in Doha, Qatar. Explore open roles across technology, security, trading, floral supply, and construction."
  return {
    title,
    description,
    alternates: { canonical: "/careers" },
    openGraph: { title, description, url: "/careers" },
  }
}

export default async function CareersPage() {
  const subsidiaries = await getSubsidiariesData()

  return (
    <main className="min-h-screen bg-background">
      <SiteNav variant="solid" />
      <CareersContent />
      <SiteFooter subsidiaries={subsidiaries} />
    </main>
  )
}
