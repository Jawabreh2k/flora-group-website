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

export const metadata: Metadata = {
  title: 'Flora Group W.L.L. — A Legacy of Excellence Across Qatar',
  description:
    'Since 1993, Flora Group has been a trusted Qatari conglomerate spanning technology, infrastructure, security, commodities, and premium trade.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/images/flora-group-logo.png',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/images/flora-group-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#4A0E17',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable} ${arabicSans.variable} ${arabicSerif.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <I18nProvider>{children}</I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
