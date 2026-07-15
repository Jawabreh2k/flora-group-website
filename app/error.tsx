"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Home } from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Container } from "@/components/ui/container"
import { buttonVariants } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useI18n()

  useEffect(() => {
    console.error("[app-error]", error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteNav variant="solid" />
      <section className="relative isolate flex flex-1 items-center overflow-hidden">
        <div className="bg-radial-fade absolute inset-x-0 top-0 -z-10 h-[520px]" />
        <div className="bg-dots absolute inset-x-0 top-0 -z-10 h-[520px] text-primary/[0.04]" />
        <Container className="py-28 text-center lg:py-36">
          <p className="font-serif text-7xl font-semibold tracking-tight text-gradient-gold sm:text-8xl">
            {t.error.code}
          </p>
          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.error.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            {t.error.body}
          </p>
          {error.digest && (
            <p className="mt-3 text-xs text-muted-foreground/70">
              {t.error.reference}: {error.digest}
            </p>
          )}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => reset()}
              className={cn(buttonVariants({ size: "lg" }), "group h-12 gap-2 px-6")}
            >
              {t.error.retry}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
            </button>
            <Link
              href="/#home"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "group h-12 gap-2 px-6 text-primary",
              )}
            >
              <Home className="size-4" />
              {t.error.home}
            </Link>
          </div>
        </Container>
      </section>
      <SiteFooter />
    </main>
  )
}
