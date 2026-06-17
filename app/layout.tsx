import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Inter,
  Playfair_Display,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
} from 'next/font/google'
import { I18nProvider } from '@/components/i18n-provider'
import { getUiConfig, themeToCssVars } from '@/lib/ui-config'
import { env } from '@/lib/env'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
// Arabic faces — applied automatically when dir="rtl" (see globals.css)
const arabicSans = IBM_Plex_Sans_Arabic({
  variable: '--font-ar-sans',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
})
const arabicSerif = Noto_Naskh_Arabic({
  variable: '--font-ar-serif',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
})

// Metadata is derived from the CMS branding so the title/description/icons can be
// managed from the Admin Portal without a rebuild.
export async function generateMetadata(): Promise<Metadata> {
  const { branding } = await getUiConfig()
  return {
    // Resolves relative URLs (incl. the generated opengraph-image) to absolute ones.
    metadataBase: new URL(env.siteUrl),
    title: branding.siteTitle,
    description: branding.metaDescription,
    applicationName: 'Flora Group',
    generator: 'v0.app',
    icons: {
      icon: [
        { url: branding.logoUrl, type: 'image/png' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: branding.logoUrl,
    },
    openGraph: {
      type: 'website',
      siteName: 'Flora Group W.L.L.',
      title: branding.siteTitle,
      description: branding.metaDescription,
      url: '/',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: branding.siteTitle,
      description: branding.metaDescription,
    },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const { branding } = await getUiConfig()
  return {
    colorScheme: 'light',
    themeColor: branding.themeColor,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch the live theme and map it onto CSS variables rendered into the HTML.
  // Overriding the raw `--primary` / `--gold` / ... tokens re-themes every Tailwind
  // utility instantly, server-side, with no rebuild and no flash of the old theme.
  const { theme, content, images, social } = await getUiConfig()

  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable} ${arabicSans.variable} ${arabicSerif.variable} bg-background`}
      style={themeToCssVars(theme)}
    >
      <body className="font-sans antialiased">
        <I18nProvider content={content} images={images} social={social}>
          {children}
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
