export const DEPARTMENTS = [
  "all",
  "Technology",
  "Security",
  "Trading",
  "Floral",
  "Construction",
  "Corporate",
] as const

export type DepartmentFilter = (typeof DEPARTMENTS)[number]

export function getDepartmentLabel(
  dept: DepartmentFilter,
  locale: string,
): string {
  const labels: Record<DepartmentFilter, Record<string, string>> = {
    all: { en: "All departments", ar: "جميع الأقسام" },
    Technology: { en: "Technology", ar: "التقنية" },
    Security: { en: "Security", ar: "الأمن" },
    Trading: { en: "Trading", ar: "التجارة" },
    Floral: { en: "Floral", ar: "الزهور" },
    Construction: { en: "Construction", ar: "المقاولات" },
    Corporate: { en: "Corporate", ar: "الشركة الأم" },
  }
  return labels[dept][locale]
}
