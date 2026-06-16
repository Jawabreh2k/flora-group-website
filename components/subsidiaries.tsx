'use client'

import { useMemo } from 'react'
import type { ManagedSubsidiary } from '@/lib/ui-config/types'
import { convertManagedToSubsidiary } from '@/lib/subsidiaries'
import { SUBSIDIARY_ICON_MAP } from '@/lib/subsidiary-icons'
import { SubsidiaryCard } from '@/components/subsidiary-card'
import { SectionHeading } from '@/components/section-heading'
import { Container } from '@/components/ui/container'
import { RevealGroup, RevealItem } from '@/components/reveal'
import { useI18n } from '@/components/i18n-provider'

export function Subsidiaries({ items }: { items: ManagedSubsidiary[] }) {
  const { t } = useI18n()
  const subsidiaries = useMemo(
    () => items.map((item) => convertManagedToSubsidiary(item, SUBSIDIARY_ICON_MAP)),
    [items],
  )

  return (
    <section id="subsidiaries" className="relative bg-background">
      <Container className="py-20 lg:py-28">
        <SectionHeading
          eyebrow={t.subsidiaries.eyebrow}
          title={t.subsidiaries.title}
          description={t.subsidiaries.description}
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subsidiaries.map((s) => (
            <RevealItem key={s.slug} className="h-full">
              <SubsidiaryCard subsidiary={s} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  )
}
