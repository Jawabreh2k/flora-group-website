import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { Subsidiaries } from "@/components/subsidiaries"
import { Spotlight } from "@/components/spotlight"
import { SiteFooter } from "@/components/site-footer"
import { getUiConfig } from "@/lib/ui-config"
import { getSubsidiariesData } from "@/lib/subsidiaries-config"

export default async function Page() {
  const [{ sections }, subsidiaries] = await Promise.all([getUiConfig(), getSubsidiariesData()])

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <Hero />
      {sections.showStats && <Stats />}
      {sections.showSubsidiaries && <Subsidiaries items={subsidiaries} />}
      {sections.showSpotlight && <Spotlight />}
      <SiteFooter subsidiaries={subsidiaries} />
    </main>
  )
}
