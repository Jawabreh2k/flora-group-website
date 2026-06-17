import { env } from '@/lib/env'
import { getUiConfig } from '@/lib/ui-config'
import { JsonLd } from './json-ld'

/**
 * Site-wide Organization + WebSite structured data for rich results. Pulls the brand
 * name, logo, description, contact details and social profiles from the live CMS config
 * so it stays in sync with what the admin manages — no hard-coded duplication.
 */
export async function OrganizationJsonLd() {
  const { branding, content, social } = await getUiConfig()
  const footer = content?.en?.footer

  const name = footer?.companyName || 'Flora Group W.L.L.'
  const logo = new URL(branding.logoUrl, env.siteUrl).toString()

  const sameAs = social?.enabled
    ? (social.links ?? []).map((l) => l.url?.trim()).filter((url): url is string => !!url)
    : []

  const contactPoint =
    footer?.phone || footer?.email
      ? [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            ...(footer?.phone ? { telephone: footer.phone } : {}),
            ...(footer?.email ? { email: footer.email } : {}),
            areaServed: 'QA',
            availableLanguage: ['en', 'ar'],
          },
        ]
      : undefined

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${env.siteUrl}/#organization`,
        name,
        url: env.siteUrl,
        logo,
        image: logo,
        description: branding.metaDescription,
        foundingDate: '1993',
        address: {
          '@type': 'PostalAddress',
          streetAddress: footer?.address || 'Flora Building, Rawdat Al Khail St, Doha',
          addressLocality: 'Doha',
          addressCountry: 'QA',
        },
        ...(contactPoint ? { contactPoint } : {}),
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${env.siteUrl}/#website`,
        url: env.siteUrl,
        name,
        description: branding.metaDescription,
        publisher: { '@id': `${env.siteUrl}/#organization` },
        inLanguage: ['en', 'ar'],
      },
    ],
  }

  return <JsonLd data={data} />
}
