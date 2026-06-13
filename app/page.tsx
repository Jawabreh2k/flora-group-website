import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { Subsidiaries } from "@/components/subsidiaries"
import { Spotlight } from "@/components/spotlight"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <Hero />
      <Stats />
      <Subsidiaries />
      <Spotlight />
      <SiteFooter />
    </main>
  )
}
