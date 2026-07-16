"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, ArrowRight, ExternalLink, Loader2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { BrandMark } from "@/components/brand-mark"
import { Container } from "@/components/ui/container"
import { HoneypotField } from "@/components/honeypot-field"
import { SocialLinks } from "@/components/social-links"
import { useI18n } from "@/components/i18n-provider"
import { HONEYPOT_FIELD } from "@/lib/honeypot"
import type { ManagedSubsidiary } from "@/lib/ui-config/types"
import { cn } from "@/lib/utils"

export function SiteFooter({ subsidiaries = [] }: { subsidiaries?: ManagedSubsidiary[] }) {
  const { t, locale, social } = useI18n()
  const [email, setEmail] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === "submitting") return

    setStatus("submitting")
    setErrorMessage(null)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, [HONEYPOT_FIELD]: honeypot }),
      })

      if (!res.ok) {
        setStatus("error")
        setErrorMessage(
          res.status === 429 ? t.footer.subscribeRateLimited : t.footer.subscribeError,
        )
        return
      }

      setStatus("sent")
      setEmail("")
    } catch {
      setStatus("error")
      setErrorMessage(t.footer.subscribeError)
    }
  }

  const telHref = t.footer.phone ? `tel:${t.footer.phone.replace(/\s/g, "")}` : undefined
  const profileSubs = subsidiaries.filter((s) => s.hasProfile !== false)

  return (
    <footer id="contact" className="relative bg-maroon-deep text-white">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div id="careers" className="border-b border-gold/15">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {t.footer.careersTitle}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
              {t.footer.careersBody}
            </p>
          </div>
          <Link
            href="/careers"
            className={cn(
              buttonVariants({ size: "lg", variant: "gold" }),
              "group h-12 shrink-0 gap-2 px-6",
            )}
          >
            {t.footer.exploreCareers}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100" />
          </Link>
        </Container>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <BrandMark tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
            {t.footer.about}
          </p>
          <SocialLinks social={social} className="mt-6" />
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {t.footer.subsidiaries}
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm text-white/65">
            {profileSubs.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/subsidiaries/${s.slug}`}
                  className="transition-colors hover:text-white"
                >
                  {s.name[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {t.footer.headOffice}
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{t.footer.address}</span>
            </li>
            {t.footer.phoneDisplay && telHref && (
              <li>
                <a
                  href={telHref}
                  dir="ltr"
                  className="flex items-center gap-3 transition-colors hover:text-white rtl:flex-row-reverse rtl:justify-end"
                >
                  <Phone className="size-4 text-gold" />
                  {t.footer.phoneDisplay}
                </a>
              </li>
            )}
            {t.footer.email && (
              <li>
                <a
                  href={`mailto:${t.footer.email}`}
                  dir="ltr"
                  className="flex items-center gap-3 transition-colors hover:text-white rtl:flex-row-reverse rtl:justify-end"
                >
                  <Mail className="size-4 text-gold" />
                  {t.footer.email}
                </a>
              </li>
            )}
            {t.footer.mapsUrl && (
              <li>
                <a
                  href={t.footer.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <ExternalLink className="size-4 text-gold" />
                  {t.footer.openInMaps}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {t.footer.globalInquiries}
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            {t.footer.newsletter}
          </p>
          <form onSubmit={handleSubscribe} className="mt-5 flex gap-2">
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === "error") setStatus("idle")
              }}
              placeholder={t.footer.emailPlaceholder}
              aria-label={t.contact.email}
              className="h-11 w-full rounded-lg border border-white/20 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <Button
              type="submit"
              aria-label={t.footer.globalInquiries}
              variant="gold"
              disabled={status === "submitting"}
              className="h-11 shrink-0"
            >
              {status === "submitting" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 rtl:-scale-x-100" />
              )}
            </Button>
          </form>
          {status === "sent" && (
            <p className="mt-3 text-sm text-gold" role="status">{t.footer.subscribed}</p>
          )}
          {status === "error" && errorMessage && (
            <p className="mt-3 text-sm text-red-300" role="alert">{errorMessage}</p>
          )}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {t.footer.companyName ?? "Flora Group W.L.L."}{" "}
            {t.footer.rightsText ?? t.footer.rights}
          </p>
          <p>{t.footer.tagline}</p>
        </Container>
      </div>
    </footer>
  )
}
