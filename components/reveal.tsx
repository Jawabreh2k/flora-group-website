"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

const EASE = [0.16, 1, 0.3, 1] as const

type Direction = "up" | "down" | "left" | "right" | "none"

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
}

/**
 * Scroll-triggered reveal wrapper. Animates once when it enters the viewport.
 * Honours prefers-reduced-motion via the global CSS override.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction = "up",
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: Direction
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/** Container that staggers the reveal of its <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  once = true,
}: {
  children: ReactNode
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      variants={STAGGER}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-70px" }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={STAGGER_ITEM}>
      {children}
    </motion.div>
  )
}
