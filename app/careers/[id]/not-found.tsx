"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Container } from "@/components/ui/container"
import { buttonVariants } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

export default function JobNotFound() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteNav variant="solid" />
      <section className="relative isolate flex flex-1 items-center overflow-hidden">
        <div className="bg-radial-fade absolute inset-x-0 top-0 -z-10 h-[520px]" />
        <Container className="py-28 text-center lg:py-36">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.careers.detail.notFoundTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            {t.careers.detail.notFoundBody}
          </p>
          <div className="mt-9">
            <Link
              href="/careers#positions"
              className={cn(buttonVariants({ size: "lg" }), "group h-12 gap-2 px-6")}
            >
              {t.careers.detail.notFoundCta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
            </Link>
          </div>
        </Container>
      </section>
      <SiteFooter />
    </main>
  )
}
