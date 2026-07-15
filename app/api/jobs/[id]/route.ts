import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getJobDetailFromSeed } from '@/lib/jobs/seed'

type Params = { params: Promise<{ id: string }> }

async function tryFetchFromCms(url: string) {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30, tags: [`job-${url}`] },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      console.warn(`[job-detail-api] CMS responded ${res.status}`)
      return null
    }

    return await res.json()
  } catch (err) {
    console.warn(
      '[job-detail-api] CMS request failed:',
      err instanceof Error ? err.message : String(err),
    )
    return null
  }
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const url = `${env.apiUrl}/api/jobs/${id}`

  const cmsData = await tryFetchFromCms(url)

  if (cmsData) {
    return NextResponse.json(cmsData)
  }

  console.info('[job-detail-api] Falling back to seed data for job:', id)
  const seedDetail = getJobDetailFromSeed(id)

  if (!seedDetail) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  return NextResponse.json(seedDetail, {
    headers: {
      'X-Fallback-Source': 'seed-data',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
