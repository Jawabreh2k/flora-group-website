import {
  Package,
  Cpu,
  ShieldCheck,
  Flower2,
  Building2,
  Sprout,
  type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  Package,
  Cpu,
  ShieldCheck,
  Flower2,
  Building2,
  Sprout,
}

/**
 * Converts an icon name (from managed config) to a Lucide icon component.
 * Returns Package (generic) as fallback.
 */
export function getIconByName(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Package
}
