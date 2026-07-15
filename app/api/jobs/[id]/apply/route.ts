import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getResumeFromFormData, validateResumeFile } from '@/lib/jobs/validate-resume'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { HONEYPOT_FIELD, isHoneypotTriggered } from '@/lib/honeypot'

type Params = { params: Promise<{ id: string }> }

// Tighter than the contact form: applications carry a file upload, so each
// allowed request is more expensive to proxy and to store on the CMS side.
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function POST(request: Request, { params }: Params) {
  const { id } = await params

  const ip = getClientIp(request)
  const { allowed, retryAfterSeconds } = checkRateLimit(`apply:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many applications submitted. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  try {
    const formData = await request.formData()

    // Bot trap: real users never see or fill this field (see components/honeypot-field.tsx).
    // Report success without touching the CMS or forwarding the upload.
    if (isHoneypotTriggered(formData.get(HONEYPOT_FIELD))) {
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    const candidateName = String(formData.get('candidateName') ?? '').trim()
    const candidateEmail = String(formData.get('candidateEmail') ?? '').trim()
    if (!candidateName) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    }
    if (!candidateEmail) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const resume = getResumeFromFormData(formData)
    const resumeError = validateResumeFile(resume)
    if (resumeError) {
      return NextResponse.json({ error: resumeError }, { status: 400 })
    }

    // The CMS's DTO has no concept of the honeypot field — never forward it.
    formData.delete(HONEYPOT_FIELD)

    const res = await fetch(`${env.apiUrl}/api/jobs/${id}/apply`, {
      method: 'POST',
      body: formData,
    })

    const body = await res.json().catch(() => ({ error: 'Application failed' }))

    if (!res.ok) {
      const errorBody = body as { title?: string; error?: string; errors?: Record<string, string[]> }
      return NextResponse.json(
        {
          error: errorBody.title ?? errorBody.error ?? 'Application failed',
          errors: errorBody.errors,
        },
        { status: res.status },
      )
    }

    return NextResponse.json(body, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to reach careers API' }, { status: 502 })
  }
}
