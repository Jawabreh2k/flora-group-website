import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.toString()
  const url = `${env.apiUrl}/api/jobs${query ? `?${query}` : ''}`

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30, tags: ['jobs'] },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to load jobs' }, { status: res.status })
    }

    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: 'Failed to reach careers API' }, { status: 502 })
  }
}
