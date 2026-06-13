import Image from "next/image"
import { cn } from "@/lib/utils"
import type { LocalizedSubsidiary } from "@/lib/subsidiaries"

/**
 * Photography-led visual for a subsidiary using official Flora Group assets.
 * Layers a brand-tinted gradient over the photo for legibility and palette
 * cohesion. Pass `bare` to render only the photo + gradient (no logo/tag
 * chrome) — useful when the surrounding layout already owns the labelling.
 */
export function BrandVisual({
  subsidiary,
  variant = "card",
  bare = false,
  className,
}: {
  subsidiary: LocalizedSubsidiary
  variant?: "card" | "hero"
  bare?: boolean
  className?: string
}) {
  const { visual, icon: Icon, tag, image, logo } = subsidiary
  const isHero = variant === "hero"

  return (
    <div className={cn("relative isolate overflow-hidden", className)} aria-hidden>
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          className="object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          sizes={isHero ? "100vw" : "(max-width: 768px) 100vw, 420px"}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(135deg, ${visual.from}, ${visual.to})`,
          }}
        />
      )}

      {/* Readability gradient */}
      <div
        className={cn(
          "absolute inset-0",
          image
            ? "bg-gradient-to-t from-black/75 via-black/20 to-black/5"
            : "bg-gradient-to-t from-black/40 via-transparent to-black/10",
        )}
      />

      {/* Brand-coloured wash at the bottom edge keeps photos on-palette */}
      {image && (
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 opacity-55 mix-blend-multiply"
          style={{
            background: `linear-gradient(to top, ${visual.from}, transparent)`,
          }}
        />
      )}

      {/* Top scrim so any overlaid chrome stays legible */}
      {!bare && (
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
      )}

      {/* Company logo (consistent fixed height) or icon fallback */}
      {!bare &&
        (logo ? (
          <div
            className={cn(
              "absolute start-4 top-4 flex items-center rounded-xl bg-white/95 shadow-sm ring-1 ring-black/5 backdrop-blur-sm",
              isHero ? "start-6 top-6 px-3.5 py-2.5" : "px-3 py-2",
            )}
          >
            <Image
              src={logo}
              alt=""
              width={200}
              height={56}
              className={cn("w-auto object-contain", isHero ? "h-9" : "h-6")}
            />
          </div>
        ) : (
          <div
            className={cn(
              "absolute flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md",
              isHero ? "start-6 top-6 size-16" : "start-4 top-4 size-12",
            )}
          >
            <Icon className={isHero ? "size-8" : "size-6"} strokeWidth={1.6} />
          </div>
        ))}

      {!bare && isHero && (
        <span className="absolute end-6 top-7 rounded-full border border-white/25 bg-black/30 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
          {tag}
        </span>
      )}
    </div>
  )
}
