import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { ContactContent } from "@/components/contact-content"
import { SiteFooter } from "@/components/site-footer"
import { getUiConfig } from "@/lib/ui-config"
import { getSubsidiariesData } from "@/lib/subsidiaries-config"

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getUiConfig()
  const pages = content?.en?.pages
  return {
    title: pages?.contactMetaTitle ?? "Contact Us — Flora Group W.L.L.",
    description:
      pages?.contactMetaDescription ??
      "Get in touch with Flora Group W.L.L. in Doha, Qatar. Reach our head office, Flora Flowers, Sibonne, and subsidiary teams.",
  }
}

export default async function ContactPage() {
  const subsidiaries = await getSubsidiariesData()

  return (
    <main className="min-h-screen bg-background">
      <SiteNav variant="solid" />
      <ContactContent />
      <SiteFooter subsidiaries={subsidiaries} />
    </main>
  )
}
