"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  MapPin,
  Phone,
  Printer,
  Mail,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"

export function ContactContent() {
  const { t, locale } = useI18n()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })

  const offices = [
    {
      name: t.contact.headOfficeName,
      address:
        locale === "ar"
          ? "مبنى فلورا، شارع روضة الخيل، الهلال، مبنى رقم ١٢٧، شارع ٣٣٠، المنطقة ٤١، النعيجة (الهلال الغربي)، الدوحة، قطر. ص.ب: ١٦١١٨."
          : "Flora Building, Rawdat Al Khail St, Al Helal, Bldg No 127, Street no. 330, Zone no. 41, Nuaija (Al Hilal West), Doha, Qatar. P.O. Box: 16118.",
      phone: "(+974) 44810674",
      fax: "(+974) 44314133",
      email: "info@floragroup.net",
    },
    {
      name: t.contact.flowersOfficeName,
      address:
        locale === "ar"
          ? "المطار القديم، قرب لولو هايبرماركت، شارع أحمد بن حنبل، مبنى رقم ٤٧، الدوحة، قطر. ص.ب: ١٦١١٨."
          : "Old Airport, Near Lulu Hypermarket, Ahmad Bin Hanbal St, Building No. 47, Doha, Qatar. P.O. Box: 16118.",
      phone: "(+974) 44607703",
      fax: "(+974) 44504480",
      email: "flora@qatar.net.qa",
    },
  ]

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <>
      {/* Hero band */}
      <section className="relative isolate overflow-hidden text-white">
        <Image
          src="/images/contact-doha.jpg"
          alt={t.contact.mapTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Scrim behind text only — image stays clear on the right */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-28 lg:px-8 lg:pb-20 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl rounded-2xl border border-white/15 bg-black/35 p-6 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-8"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-6 bg-gold" aria-hidden />
              {t.contact.eyebrow}
            </span>
            <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t.contact.title}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/95 sm:text-lg">
              {t.contact.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1.1fr] lg:px-8 lg:py-24">
          {/* Office details */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              {t.contact.ourOffices}
            </h2>
            <div className="mt-6 space-y-6">
              {offices.map((o) => (
                <div
                  key={o.name}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {o.name}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>{o.address}</span>
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>
                        {t.contact.phone}: <span dir="ltr">{o.phone}</span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Printer className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>
                        {t.contact.fax}: <span dir="ltr">{o.fax}</span>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                      <a
                        href={`mailto:${o.email}`}
                        dir="ltr"
                        className="transition-colors hover:text-primary"
                      >
                        {o.email}
                      </a>
                    </li>
                  </ul>
                </div>
              ))}

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/60 p-6 text-sm text-muted-foreground">
                <Clock className="size-5 shrink-0 text-gold" />
                <span>
                  <span className="font-medium text-foreground">
                    {t.contact.hoursDays}
                  </span>{" "}
                  · {t.contact.hoursTime}
                </span>
              </div>
            </div>

            {/* Map */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              <iframe
                title={t.contact.mapTitle}
                src="https://www.google.com/maps?q=Flora+Group+Co+Rawdat+Al+Khail+Doha+Qatar&output=embed"
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border border-border bg-card p-7 lg:p-9">
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                {t.contact.sendTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.contact.sendHelp}
              </p>

              {sent ? (
                <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 p-8 text-center">
                  <CheckCircle2 className="size-10 text-gold" />
                  <p className="font-serif text-lg font-semibold text-foreground">
                    {t.contact.successTitle}
                    {form.name ? `, ${form.name}` : ""}!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t.contact.successBody}
                  </p>
                  <Button
                    onClick={() => {
                      setSent(false)
                      setForm({
                        name: "",
                        email: "",
                        company: "",
                        subject: "",
                        message: "",
                      })
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    {t.contact.sendAnother}
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                  className="mt-7 flex flex-col gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={t.contact.fullName}
                      id="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={update("name")}
                      required
                    />
                    <Field
                      label={t.contact.email}
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={update("email")}
                      required
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={t.contact.company}
                      id="company"
                      autoComplete="organization"
                      value={form.company}
                      onChange={update("company")}
                    />
                    <Field
                      label={t.contact.subject}
                      id="subject"
                      value={form.subject}
                      onChange={update("subject")}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground"
                    >
                      {t.contact.message}
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={update("message")}
                      className="resize-none rounded-md border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      placeholder={t.contact.messagePlaceholder}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="size-4 rtl:-scale-x-100" />
                    {t.contact.send}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="h-11 rounded-md border border-input bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
      />
    </div>
  )
}
