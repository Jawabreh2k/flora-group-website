import type { Metadata } from "next"
import { SiteNav } from "@/components/site-nav"
import { CareersContent } from "@/components/careers-content"
import { SiteFooter } from "@/components/site-footer"
import { MESSAGES, DEFAULT_LOCALE } from "@/lib/i18n/messages"

export const metadata: Metadata = {
  title: MESSAGES[DEFAULT_LOCALE].careers.metaTitle,
  description: MESSAGES[DEFAULT_LOCALE].careers.metaDescription,
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNav variant="solid" />
      <CareersContent />
      <SiteFooter />
    </main>
  )
}
