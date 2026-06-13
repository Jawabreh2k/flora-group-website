"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { BrandMark } from "@/components/brand-mark"
import { Container } from "@/components/ui/container"
import { LanguageToggle } from "@/components/language-toggle"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

export function SiteNav({
  variant = "transparent",
}: {
  /** "solid" forces an opaque bar (use on dark-hero / inner pages) */
  variant?: "transparent" | "solid"
}) {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // "Contact" intentionally omitted from the link list — the prominent
  // "Get in Touch" CTA is the single contact affordance (avoids duplicate
  // links to /contact).
  const links = [
    { label: t.nav.home, href: "/#home" },
    { label: t.nav.legacy, href: "/#legacy" },
    { label: t.nav.subsidiaries, href: "/#subsidiaries" },
    { label: t.nav.spotlight, href: "/#spotlight" },
    { label: t.nav.careers, href: "/careers" },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const solid = variant === "solid" || scrolled
  const isActive = (href: string) => href === "/contact" && pathname === "/contact"

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-border/60 bg-background/85 shadow-[0_1px_24px_-14px_rgba(74,14,23,0.4)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between lg:h-20">
        <BrandMark tone="dark" />

        {/* Center links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "group relative rounded-sm text-sm font-medium transition-colors focus-visible:text-foreground focus-visible:outline-none",
                  isActive(l.href)
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 start-0 h-px bg-gold transition-all duration-300",
                    isActive(l.href)
                      ? "w-full"
                      : "w-0 group-hover:w-full group-focus-visible:w-full",
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <Link
            href="/contact"
            className={cn(
              buttonVariants(),
              "group hidden h-10 gap-1.5 bg-primary px-5 text-primary-foreground hover:bg-primary/90 sm:inline-flex",
            )}
          >
            {t.nav.getInTouch}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center gap-2">
                <LanguageToggle className="flex-1 justify-center" />
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants(),
                    "h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {t.nav.getInTouch}
                </Link>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
