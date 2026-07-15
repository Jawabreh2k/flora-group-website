import type { JobDetail } from "@/lib/jobs/types"
import { JsonLd } from "./json-ld"

/**
 * schema.org JobPosting structured data, enabling Google Jobs indexing for this
 * listing. baseSalary is intentionally omitted — salaryRange is a free-text
 * string, and emitting a guessed QuantitativeValue from unstructured text risks
 * Google flagging the markup as invalid rather than helping discoverability.
 */
const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACTOR",
  INTERN: "INTERN",
}

// locationText is free text (e.g. "Amman, Jordan", "Doha, Qatar") with no
// structured country field — Flora Group operates across these markets, so the
// country can't be assumed to be Qatar. Resolved by name match; if a job's
// location doesn't match a known market (e.g. a region like "MENA"),
// addressCountry/applicantLocationRequirements are omitted rather than guessed.
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  qatar: "QA",
  jordan: "JO",
  "united arab emirates": "AE",
  uae: "AE",
  "saudi arabia": "SA",
  bahrain: "BH",
  kuwait: "KW",
  oman: "OM",
  egypt: "EG",
  lebanon: "LB",
}

function resolveCountryCode(locationText: string): string | null {
  const segments = locationText.split(",").map((part) => part.trim().toLowerCase())
  for (const segment of [...segments].reverse()) {
    const code = COUNTRY_NAME_TO_CODE[segment]
    if (code) return code
  }
  return null
}

export function JobPostingJsonLd({ job }: { job: JobDetail }) {
  const [locality] = job.locationText.split(",").map((part) => part.trim())
  const countryCode = resolveCountryCode(job.locationText)

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company.name,
      value: job.id,
    },
    datePosted: job.createdAt,
    ...(job.closingDate ? { validThrough: job.closingDate } : {}),
    employmentType: EMPLOYMENT_TYPE_MAP[job.jobType] ?? job.jobType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      ...(job.company.website ? { sameAs: job.company.website } : {}),
      ...(job.company.logoUrl ? { logo: job.company.logoUrl } : {}),
    },
    ...(job.locationType === "REMOTE"
      ? {
          jobLocationType: "TELECOMMUTE",
          ...(countryCode
            ? {
                applicantLocationRequirements: {
                  "@type": "Country",
                  name: countryCode,
                },
              }
            : {}),
        }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: locality || job.locationText,
              ...(countryCode ? { addressCountry: countryCode } : {}),
            },
          },
        }),
  }

  return <JsonLd data={data} />
}
