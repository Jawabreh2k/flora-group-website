import {
  Package,
  Cpu,
  ShieldCheck,
  Flower2,
  Building2,
  Sprout,
  type LucideIcon,
} from 'lucide-react'

export const SUBSIDIARY_ICON_MAP: Record<string, LucideIcon> = {
  Package,
  Cpu,
  ShieldCheck,
  Flower2,
  Building2,
  Sprout,
}

export function resolveSubsidiaryIcon(name: string): LucideIcon {
  return SUBSIDIARY_ICON_MAP[name] ?? Package
}
