import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params

  try {
    const res = await fetch(`${env.apiUrl}/api/jobs/${id}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30, tags: [`job-${id}`] },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Job not found' }, { status: res.status })
    }

    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: 'Failed to reach careers API' }, { status: 502 })
  }
}
