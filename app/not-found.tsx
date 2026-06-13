"use client"

import Link from "next/link"
import { ArrowRight, Home } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Container } from "@/components/ui/container"
import { buttonVariants } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

export default function NotFound() {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteNav variant="solid" />
      <section className="relative isolate flex flex-1 items-center overflow-hidden">
        <div className="bg-radial-fade absolute inset-x-0 top-0 -z-10 h-[520px]" />
        <div className="bg-dots absolute inset-x-0 top-0 -z-10 h-[520px] text-primary/[0.04]" />
        <Container className="py-28 text-center lg:py-36">
          <p className="font-serif text-7xl font-semibold tracking-tight text-gradient-gold sm:text-8xl">
            {t.notFound.code}
          </p>
          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.notFound.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            {t.notFound.body}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/#home"
              className={cn(buttonVariants({ size: "lg" }), "group h-12 gap-2 px-6")}
            >
              <Home className="size-4" />
              {t.notFound.home}
            </Link>
            <Link
              href="/#subsidiaries"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "group h-12 gap-2 px-6 text-primary",
              )}
            >
              {t.notFound.subsidiaries}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
            </Link>
          </div>
        </Container>
      </section>
      <SiteFooter />
    </main>
  )
}
