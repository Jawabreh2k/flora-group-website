import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { Subsidiaries } from "@/components/subsidiaries"
import { Spotlight } from "@/components/spotlight"
import { SiteFooter } from "@/components/site-footer"
import { getUiConfig } from "@/lib/ui-config"

export default async function Page() {
  // Section visibility is CMS-driven. The fetch is deduped with the layout's call.
  const { sections } = await getUiConfig()

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <Hero />
      {sections.showStats && <Stats />}
      {sections.showSubsidiaries && <Subsidiaries />}
      {sections.showSpotlight && <Spotlight />}
      <SiteFooter />
    </main>
  )
}
