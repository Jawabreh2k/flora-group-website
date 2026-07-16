import type { CSSProperties } from "react"
import type { Theme } from "./types"

/**
 * Theme token keys that are colours/shape and map 1:1 onto the CSS custom
 * properties declared in app/globals.css `:root`. Font tokens are intentionally
 * excluded — fonts are loaded via next/font and can't be swapped by a bare CSS
 * variable.
 *
 * Mapping rule: camelCase token → `--kebab-case` variable
 *   primary        -> --primary
 *   primaryForeground -> --primary-foreground
 *   goldSoft       -> --gold-soft
 *   radius         -> --radius
 */
const VAR_KEYS: (keyof Theme)[] = [
  "background",
  "foreground",
  "card",
  "cardForeground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "accent",
  "accentForeground",
  "border",
  "input",
  "ring",
  "destructive",
  "gold",
  "goldSoft",
  "goldForeground",
  "maroon",
  "maroonDeep",
  "radius",
]

const toCssVar = (key: string) =>
  `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`

/**
 * Builds the inline `style` object injected onto `<html>`. Because Tailwind v4's
 * `@theme inline` resolves `--color-primary: var(--primary)` (etc.), overriding the
 * raw `--primary` variable here re-themes every `bg-primary` / `text-gold` utility
 * instantly — no rebuild, no flash (it's rendered server-side into the HTML).
 */
export function themeToCssVars(theme: Theme): CSSProperties {
  const style: Record<string, string> = {}
  for (const key of VAR_KEYS) {
    const value = theme[key]
    if (typeof value === "string" && value.length > 0) {
      style[toCssVar(key)] = value
    }
  }
  return style as CSSProperties
}

/**
 * Renders the dark-mode palette as a `.dark body { ... }` CSS rule (a string,
 * not an inline style) so it can be server-rendered into a <style> tag.
 *
 * It has to be a real stylesheet rule rather than an inline style like the
 * light theme: the light theme's inline `style` attribute lives on <html>,
 * and inline styles beat any CSS selector targeting that same element — a
 * `.dark` override on <html> could never win. Scoping to `body` (a
 * descendant, with no competing inline style of its own) sidesteps that
 * entirely via normal cascade/inheritance.
 *
 * Deliberately excludes `radius`/`fontHeading`/`fontSans` — shape and
 * typography don't change between light and dark, so the dark palette only
 * ever carries colour tokens.
 */
export function themeDarkToCssRule(themeDark: Theme): string {
  const declarations = VAR_KEYS.filter((key) => key !== "radius")
    .map((key) => {
      const value = themeDark[key]
      return typeof value === "string" && value.length > 0 ? `  ${toCssVar(key)}: ${value};` : null
    })
    .filter((line): line is string => line !== null)
    .join("\n")

  return `.dark body {\n${declarations}\n}`
}
