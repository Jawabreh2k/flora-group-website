import { ImageResponse } from 'next/og'
import { env } from '@/lib/env'
import { getUiConfig } from '@/lib/ui-config'

export const alt = 'Flora Group W.L.L. — A legacy of excellence across Qatar'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Branded Open Graph card used for link previews across every page. Colours track the
 * live CMS theme so it stays on-brand if the palette changes. Uses only inline styles
 * (Satori has no Tailwind) and flex layouts (required for multi-child nodes).
 */
export default async function OpengraphImage() {
  const { theme } = await getUiConfig()
  const maroon = theme.maroon || '#4a0e17'
  const maroonDeep = theme.maroonDeep || '#350a11'
  const gold = theme.gold || '#c5a880'
  const host = env.siteUrl.replace(/^https?:\/\//, '')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: `linear-gradient(135deg, ${maroon} 0%, ${maroonDeep} 100%)`,
          color: '#fbf6ef',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '9999px', background: gold }} />
          <div style={{ fontSize: '30px', fontWeight: 600, letterSpacing: '0.18em' }}>FLORA GROUP</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '26px', letterSpacing: '0.22em', color: gold, marginBottom: '20px' }}>
            SINCE 1993 · QATARI CONGLOMERATE
          </div>
          <div style={{ fontSize: '78px', fontWeight: 700, lineHeight: 1.1, maxWidth: '960px' }}>
            A legacy of excellence across Qatar.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '2px', width: '120px', background: gold, marginBottom: '20px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '26px' }}>
            <div style={{ display: 'flex' }}>Flora Group W.L.L.</div>
            <div style={{ display: 'flex', color: gold }}>{host}</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
