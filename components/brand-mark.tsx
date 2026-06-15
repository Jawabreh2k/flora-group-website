"use client"

import Link from "next/link"
import Image from "next/image"
import { useI18n } from "@/components/i18n-provider"
import { cn } from "@/lib/utils"

export function BrandMark({
  href = "/#home",
  className,
  compact = false,
}: {
  /** Kept for API compatibility — logo works on all backgrounds */
  tone?: "dark" | "light"
  href?: string
  className?: string
  compact?: boolean
}) {
  const { images } = useI18n()

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center transition-opacity duration-300 hover:opacity-90",
        className,
      )}
      aria-label="Flora Group — home"
    >
      <Image
        src={images.logo}
        alt="Flora Group W.L.L."
        width={compact ? 160 : 200}
        height={compact ? 48 : 72}
        className={cn(
          "h-auto w-auto object-contain object-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] rtl:object-right",
          compact ? "max-h-10 sm:max-h-11" : "max-h-14 sm:max-h-16",
        )}
        priority
      />
    </Link>
  )
}
