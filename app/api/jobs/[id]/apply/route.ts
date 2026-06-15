import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params

  try {
    const formData = await request.formData()
    const res = await fetch(`${env.apiUrl}/api/jobs/${id}/apply`, {
      method: 'POST',
      body: formData,
    })

    const body = await res.json().catch(() => ({ error: 'Application failed' }))

    if (!res.ok) {
      return NextResponse.json(
        { error: (body as { title?: string; error?: string }).title ?? (body as { error?: string }).error ?? 'Application failed' },
        { status: res.status },
      )
    }

    return NextResponse.json(body, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to reach careers API' }, { status: 502 })
  }
}
