'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Send,
  Upload,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/i18n-provider'
import { submitApplication } from '@/lib/jobs/api'
import type { JobListItem } from '@/lib/jobs/types'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const MAX_BYTES = 5 * 1024 * 1024
const ACCEPT = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

type UploadState =
  | { status: 'idle' }
  | { status: 'selected'; fileName: string }
  | { status: 'uploading' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export function ApplicationSheet({
  open,
  job,
  onClose,
}: {
  open: boolean
  job: JobListItem | null
  onClose: () => void
}) {
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle' })
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setName('')
      setEmail('')
      setPhone('')
      setCoverLetter('')
      setResume(null)
      setUploadState({ status: 'idle' })
      setSubmitting(false)
      setSubmitted(false)
    }
  }, [open])

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (extension !== 'pdf' && extension !== 'docx') {
      return 'Only PDF and DOCX files are allowed.'
    }
    if (file.size > MAX_BYTES) {
      return 'Error: File too large (max 5 MB).'
    }
    return null
  }

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const error = validateFile(file)
    if (error) {
      setResume(null)
      setUploadState({ status: 'error', message: error })
      return
    }
    setResume(file)
    setUploadState({ status: 'selected', fileName: file.name })
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!job || !resume) return

    setSubmitting(true)
    setUploadState({ status: 'uploading' })

    try {
      await submitApplication(job.id, {
        candidateName: name,
        candidateEmail: email,
        candidatePhone: phone || undefined,
        coverLetter: coverLetter || undefined,
        resume,
      })
      setUploadState({ status: 'success' })
      setSubmitted(true)
    } catch (err) {
      setUploadState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Application failed',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && job && (
        <>
          <motion.button
            type="button"
            aria-label="Close application form"
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-sheet-title"
            className="fixed inset-y-0 end-0 z-50 flex w-full max-w-lg flex-col border-s border-border bg-card shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {t.careers.application.eyebrow}
                </p>
                <h2 id="application-sheet-title" className="mt-2 font-serif text-2xl font-semibold">
                  {job.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{job.company.name}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <CheckCircle2 className="size-12 text-gold" />
                  <p className="font-serif text-xl font-semibold">{t.careers.application.successTitle}</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    {t.careers.application.successBody}
                  </p>
                  <Button variant="outline" className="mt-2" onClick={onClose}>
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <Field
                    label={t.careers.application.fullName}
                    id="apply-name"
                    value={name}
                    onChange={setName}
                    required
                  />
                  <Field
                    label={t.careers.application.email}
                    id="apply-email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                  <Field
                    label={t.careers.application.phone}
                    id="apply-phone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                  />

                  <div className="space-y-2">
                    <label htmlFor="apply-cover" className="text-sm font-medium text-foreground">
                      {t.careers.application.coverLetter}
                    </label>
                    <textarea
                      id="apply-cover"
                      rows={4}
                      value={coverLetter}
                      onChange={(event) => setCoverLetter(event.target.value)}
                      placeholder={t.careers.application.coverPlaceholder}
                      className="w-full resize-none rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.careers.application.resume}
                    </label>
                    <div
                      onDragOver={(event) => {
                        event.preventDefault()
                        setIsDragging(true)
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(event) => {
                        event.preventDefault()
                        setIsDragging(false)
                        handleFile(event.dataTransfer.files?.[0])
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-8 text-center transition-colors',
                        isDragging
                          ? 'border-gold bg-gold/10'
                          : 'border-border bg-muted/40 hover:border-gold/50 hover:bg-muted/60',
                      )}
                    >
                      <Upload className="size-6 text-gold" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {t.careers.application.resumeHint}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF or DOCX · Max 5 MB</p>
                      </div>

                      {uploadState.status === 'selected' && (
                        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          <FileText className="size-3.5" />
                          File Selected ({uploadState.fileName})
                        </p>
                      )}
                      {uploadState.status === 'uploading' && (
                        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" />
                          Uploading...
                        </p>
                      )}
                      {uploadState.status === 'success' && (
                        <p className="inline-flex items-center gap-2 text-sm text-emerald-700">
                          <CheckCircle2 className="size-4" />
                          Upload Successful
                        </p>
                      )}
                      {uploadState.status === 'error' && (
                        <p className="inline-flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="size-4" />
                          {uploadState.message}
                        </p>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPT}
                      className="sr-only"
                      onChange={(event) => handleFile(event.target.files?.[0])}
                    />
                  </div>

                  <Button type="submit" size="lg" className="h-11 w-full gap-2" disabled={submitting || !resume}>
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4 rtl:-scale-x-100" />
                    )}
                    {t.careers.application.submit}
                  </Button>
                </form>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-11 w-full rounded-md border border-input bg-background px-3.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
      />
    </div>
  )
}
