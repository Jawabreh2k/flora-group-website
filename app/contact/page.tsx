import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { ContactContent } from "@/components/contact-content"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Contact Us — Flora Group W.L.L.",
  description:
    "Get in touch with Flora Group W.L.L. in Doha, Qatar. Reach our head office, Flora Flowers, Sibonne, and subsidiary teams.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNav variant="solid" />
      <ContactContent />
      <SiteFooter />
    </main>
  )
}
