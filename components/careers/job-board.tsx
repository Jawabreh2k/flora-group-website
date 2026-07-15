'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Building2,
  Loader2,
  MapPin,
  Search,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/section-heading'
import { Reveal, RevealGroup, RevealItem } from '@/components/reveal'
import { useI18n } from '@/components/i18n-provider'
import { fetchJobs } from '@/lib/jobs/api'
import {
  JOB_TYPES,
  LOCATION_TYPES,
  formatEnumLabel,
  type JobListItem,
  type JobType,
  type LocationType,
} from '@/lib/jobs/types'
import { cn } from '@/lib/utils'
import { ApplicationSheet } from './application-sheet'

type FilterState = {
  search: string
  departments: string[]
  locationTypes: LocationType[]
  jobTypes: JobType[]
}

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function JobBoard() {
  const { t, locale } = useI18n()
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    departments: [],
    locationTypes: [],
    jobTypes: [],
  })
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [jobs, setJobs] = useState<JobListItem[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<JobListItem | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(filters.search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [filters.search])

  const loadJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const responses = await Promise.all([
        fetchJobs({
          search: debouncedSearch || undefined,
          page,
          pageSize: 12,
        }),
        fetchJobs({ page: 1, pageSize: 100 }),
      ])

      const filtered = responses[0].items.filter((job) => {
        if (filters.departments.length && !filters.departments.includes(job.department)) {
          return false
        }
        if (filters.locationTypes.length && !filters.locationTypes.includes(job.locationType)) {
          return false
        }
        if (filters.jobTypes.length && !filters.jobTypes.includes(job.jobType)) {
          return false
        }
        return true
      })

      setJobs(filtered)
      setTotalCount(responses[0].totalCount)
      setHasNextPage(responses[0].hasNextPage)

      const uniqueDepartments = Array.from(
        new Set(responses[1].items.map((job) => job.department)),
      ).sort()
      setDepartments(uniqueDepartments)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.careers.ui.loadError)
      setJobs([])
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, filters.departments, filters.jobTypes, filters.locationTypes, page, t.careers.ui.loadError])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const openApplication = (job: JobListItem) => {
    setSelectedJob(job)
    setSheetOpen(true)
  }

  const sidebarFilters = useMemo(
    () => [
      {
        title: t.careers.positions.filterLabel,
        options: departments.map((department) => ({
          value: department,
          label: department,
          checked: filters.departments.includes(department),
          onChange: () =>
            setFilters((current) => ({
              ...current,
              departments: toggleValue(current.departments, department),
            })),
        })),
      },
      {
        title: t.careers.ui.filterLocation,
        options: LOCATION_TYPES.map((value) => ({
          value,
          label: formatEnumLabel(value),
          checked: filters.locationTypes.includes(value),
          onChange: () =>
            setFilters((current) => ({
              ...current,
              locationTypes: toggleValue(current.locationTypes, value),
            })),
        })),
      },
      {
        title: t.careers.ui.filterJobType,
        options: JOB_TYPES.map((value) => ({
          value,
          label: formatEnumLabel(value),
          checked: filters.jobTypes.includes(value),
          onChange: () =>
            setFilters((current) => ({
              ...current,
              jobTypes: toggleValue(current.jobTypes, value),
            })),
        })),
      },
    ],
    [departments, filters.departments, filters.jobTypes, filters.locationTypes, t.careers.positions.filterLabel, t.careers.ui.filterLocation, t.careers.ui.filterJobType],
  )

  return (
    <>
      <section id="positions" className="bg-background scroll-mt-28">
        <Container className="py-20 lg:py-28">
          <SectionHeading
            eyebrow={t.careers.positions.eyebrow}
            title={t.careers.positions.title}
            description={t.careers.positions.description}
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="relative">
                  <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={filters.search}
                    onChange={(event) => {
                      setPage(1)
                      setFilters((current) => ({ ...current, search: event.target.value }))
                    }}
                    placeholder={t.careers.ui.searchPlaceholder}
                    className="h-11 w-full rounded-md border border-input bg-background ps-10 pe-3 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div className="mt-6 space-y-6">
                  {sidebarFilters.map((group) => (
                    <div key={group.title}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {group.title}
                      </p>
                      <div className="space-y-2">
                        {group.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-2 text-sm text-foreground/80"
                          >
                            <input
                              type="checkbox"
                              checked={option.checked}
                              onChange={() => {
                                setPage(1)
                                option.onChange()
                              }}
                              className="size-4 rounded border-border text-primary focus:ring-gold"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div>
              {isLoading && (
                <div className="grid gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-40 animate-pulse rounded-2xl border border-border bg-muted/40"
                    />
                  ))}
                </div>
              )}

              {!isLoading && error && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center text-sm text-destructive">
                  {error}
                </div>
              )}

              {!isLoading && !error && jobs.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
                  {t.careers.positions.noResults}
                </p>
              )}

              {!isLoading && !error && jobs.length > 0 && (
                <>
                  <RevealGroup className="grid gap-4">
                    {jobs.map((job) => (
                      <RevealItem key={job.id}>
                        <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-luxe">
                          <div className="absolute inset-y-0 start-0 w-1 bg-gold/0 transition-colors group-hover:bg-gold" />
                          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-7">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-gold/12 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                                  {job.department}
                                </span>
                                <span className="text-[11px] font-medium text-muted-foreground">
                                  {formatEnumLabel(job.jobType)}
                                </span>
                              </div>
                              <h3 className="mt-3 font-serif text-xl font-semibold text-foreground">
                                <Link
                                  href={`/careers/${job.id}`}
                                  className="transition-colors hover:text-primary"
                                >
                                  {locale === 'ar' && job.titleAr ? job.titleAr : job.title}
                                </Link>
                              </h3>
                              <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="size-3.5 text-gold" />
                                  <dd>{job.company.name}</dd>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="size-3.5 text-gold" />
                                  <dd>
                                    {formatEnumLabel(job.locationType)} · {job.locationText}
                                  </dd>
                                </div>
                              </dl>
                              {job.salaryRange && (
                                <p className="mt-3 text-sm text-muted-foreground">{job.salaryRange}</p>
                              )}
                            </div>
                            <Button
                              type="button"
                              onClick={() => openApplication(job)}
                              className="h-11 shrink-0 gap-2 rounded-full px-6"
                            >
                              <Briefcase className="size-4" />
                              {t.careers.positions.apply}
                            </Button>
                          </div>
                        </article>
                      </RevealItem>
                    ))}
                  </RevealGroup>

                  <Reveal className="mt-8 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {t.careers.ui.showingRoles
                        .replace("{shown}", String(jobs.length))
                        .replace("{total}", String(totalCount))}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((current) => current - 1)}
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                          'disabled:opacity-40',
                        )}
                      >
                        {t.careers.ui.previous}
                      </button>
                      <button
                        type="button"
                        disabled={!hasNextPage}
                        onClick={() => setPage((current) => current + 1)}
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                          'disabled:opacity-40',
                        )}
                      >
                        {t.careers.ui.next}
                      </button>
                    </div>
                  </Reveal>
                </>
              )}

              {isLoading && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  {t.careers.ui.loading}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <ApplicationSheet
        open={sheetOpen}
        job={selectedJob}
        onClose={() => {
          setSheetOpen(false)
          setSelectedJob(null)
        }}
      />
    </>
  )
}
