"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useInView } from "framer-motion"

/**
 * Counts up to a numeric target when scrolled into view, formatting digits for
 * the active locale (Arabic-Indic under "ar-*"). Optional prefix/suffix and
 * thousands grouping are preserved.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1600,
  group = true,
  localeTag = "en-US",
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  /** Thousands grouping — disable for years like 1993 */
  group?: boolean
  /** BCP-47 tag used to format digits, e.g. "ar-EG" for Arabic-Indic */
  localeTag?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [display, setDisplay] = useState(0)

  const formatter = useMemo(
    () => new Intl.NumberFormat(localeTag, { useGrouping: group }),
    [localeTag, group],
  )

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setDisplay(Math.round(eased * value))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatter.format(display)}
      {suffix}
    </span>
  )
}
