"use client"

import { useState } from "react"
import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"
import type { JobListItem } from "@/lib/jobs/types"
import { ApplicationSheet } from "./application-sheet"

/** Standalone apply CTA for the job detail page — reuses the same slide-over as the job board. */
export function JobApplyButton({ job }: { job: JobListItem }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="button" size="lg" onClick={() => setOpen(true)} className="h-12 gap-2 px-7">
        <Briefcase className="size-4" />
        {t.careers.positions.apply}
      </Button>
      <ApplicationSheet open={open} job={job} onClose={() => setOpen(false)} />
    </>
  )
}
