import type { Locale } from "@/lib/i18n/messages"

export type JobListing = {
  id: string
  department: Record<Locale, string>
  title: Record<Locale, string>
  subsidiary: Record<Locale, string>
  location: Record<Locale, string>
  type: Record<Locale, string>
  summary: Record<Locale, string>
  tags: Record<Locale, string[]>
}

export const JOB_LISTINGS: JobListing[] = [
  {
    id: "senior-software-engineer",
    department: { en: "Technology", ar: "التقنية" },
    title: {
      en: "Senior Software Engineer",
      ar: "مهندس برمجيات أول",
    },
    subsidiary: { en: "Flora Technology", ar: "فلورا للتكنولوجيا" },
    location: { en: "Doha, Qatar", ar: "الدوحة، قطر" },
    type: { en: "Full-time", ar: "دوام كامل" },
    summary: {
      en: "Design and deliver enterprise-grade solutions for government and private-sector clients across Qatar.",
      ar: "تصميم وتقديم حلول مؤسسية لعملاء القطاعين الحكومي والخاص في قطر.",
    },
    tags: {
      en: ["React", "Node.js", "Cloud"],
      ar: ["React", "Node.js", "سحابة"],
    },
  },
  {
    id: "security-systems-engineer",
    department: { en: "Security", ar: "الأمن" },
    title: {
      en: "Security Systems Engineer",
      ar: "مهندس أنظمة أمنية",
    },
    subsidiary: { en: "Flora Security Systems", ar: "فلورا للأنظمة الأمنية" },
    location: { en: "Doha, Qatar", ar: "الدوحة، قطر" },
    type: { en: "Full-time", ar: "دوام كامل" },
    summary: {
      en: "Deploy MOI-certified access control, CCTV and integrated security platforms for critical infrastructure.",
      ar: "نشر أنظمة التحكم بالوصول والمراقبة المركّبة المعتمدة من الداخلية للبنية التحتية الحيوية.",
    },
    tags: {
      en: ["CCTV", "Access Control", "MOI"],
      ar: ["مراقبة", "تحكم بالوصول", "الداخلية"],
    },
  },
  {
    id: "sales-executive-trading",
    department: { en: "Trading", ar: "التجارة" },
    title: {
      en: "Sales Executive — FMCG",
      ar: "مسؤول مبيعات — سلع استهلاكية",
    },
    subsidiary: { en: "Flora Trading Center", ar: "مركز فلورا التجاري" },
    location: { en: "Doha, Qatar", ar: "الدوحة، قطر" },
    type: { en: "Full-time", ar: "دوام كامل" },
    summary: {
      en: "Expand distribution of the AMEERA brand and Flora's commodities portfolio across the Gulf region.",
      ar: "توسيع توزيع علامة أميرة ومحفظة سلع فلورا في منطقة الخليج.",
    },
    tags: {
      en: ["FMCG", "B2B", "Distribution"],
      ar: ["سلع استهلاكية", "أعمال", "توزيع"],
    },
  },
  {
    id: "floral-operations-coordinator",
    department: { en: "Floral", ar: "الزهور" },
    title: {
      en: "Floral Operations Coordinator",
      ar: "منسّق عمليات الزهور",
    },
    subsidiary: { en: "Sibonne", ar: "سيبون" },
    location: { en: "Doha, Qatar", ar: "الدوحة، قطر" },
    type: { en: "Full-time", ar: "دوام كامل" },
    summary: {
      en: "Coordinate international floral supply chains spanning 26+ partner countries.",
      ar: "تنسيق سلاسل توريد الزهور الدولية عبر أكثر من ٢٦ دولة شريكة.",
    },
    tags: {
      en: ["Logistics", "Imports", "Quality"],
      ar: ["لوجستيات", "استيراد", "جودة"],
    },
  },
  {
    id: "project-engineer-construction",
    department: { en: "Construction", ar: "المقاولات" },
    title: {
      en: "Project Engineer",
      ar: "مهندس مشاريع",
    },
    subsidiary: {
      en: "Royal Stone Trading & Contracting",
      ar: "رويال ستون للتجارة والمقاولات",
    },
    location: { en: "Doha, Qatar", ar: "الدوحة، قطر" },
    type: { en: "Full-time", ar: "دوام كامل" },
    summary: {
      en: "Oversee civil contracting projects and material supply for Qatar's growing infrastructure landscape.",
      ar: "الإشراف على مشاريع المقاولات المدنية وتوريد المواد لقطاع البنية التحتية المتنامي في قطر.",
    },
    tags: {
      en: ["Civil", "QS", "Site"],
      ar: ["مدني", "كميات", "موقع"],
    },
  },
  {
    id: "hr-talent-specialist",
    department: { en: "Corporate", ar: "الشركة الأم" },
    title: {
      en: "HR & Talent Specialist",
      ar: "أخصائي موارد بشرية ومواهب",
    },
    subsidiary: { en: "Flora Group W.L.L.", ar: "مجموعة فلورا ذ.م.م." },
    location: { en: "Doha, Qatar", ar: "الدوحة، قطر" },
    type: { en: "Full-time", ar: "دوام كامل" },
    summary: {
      en: "Support recruitment, onboarding and employee experience across the Group's six strategic verticals.",
      ar: "دعم التوظيف والتأهيل وتجربة الموظفين عبر القطاعات الستة الاستراتيجية للمجموعة.",
    },
    tags: {
      en: ["HR", "Recruitment", "Qatar"],
      ar: ["موارد بشرية", "توظيف", "قطر"],
    },
  },
]

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

export function localizeJob(job: JobListing, locale: Locale) {
  return {
    id: job.id,
    department: job.department[locale],
    title: job.title[locale],
    subsidiary: job.subsidiary[locale],
    location: job.location[locale],
    type: job.type[locale],
    summary: job.summary[locale],
    tags: job.tags[locale],
  }
}

export function getDepartmentLabel(
  dept: DepartmentFilter,
  locale: Locale,
): string {
  const labels: Record<DepartmentFilter, Record<Locale, string>> = {
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
