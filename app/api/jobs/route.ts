import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { loadJobsSeed, paginateSeed, getLastSeedError } from '@/lib/jobs/seed'

function parseQueryParams(query: URLSearchParams) {
  return {
    page: Math.max(1, parseInt(query.get('page') ?? '1', 10)),
    pageSize: Math.min(100, Math.max(1, parseInt(query.get('pageSize') ?? '12', 10))),
  }
}

async function tryFetchFromCms(url: string, query: URLSearchParams) {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30, tags: ['jobs'] },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      console.warn(`[jobs-api] CMS responded ${res.status}`)
      return null
    }

    return await res.json()
  } catch (err) {
    console.warn('[jobs-api] CMS request failed:', err instanceof Error ? err.message : String(err))
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = parseQueryParams(searchParams)
  const url = `${env.apiUrl}/api/jobs${searchParams.toString() ? `?${searchParams}` : ''}`

  const cmsData = await tryFetchFromCms(url, searchParams)

  if (cmsData) {
    return NextResponse.json(cmsData)
  }

  console.info('[jobs-api] Falling back to seed data')
  const seedData = paginateSeed(query.page, query.pageSize)

  if (seedData.items.length === 0) {
    const seedError = getLastSeedError()
    console.error('[jobs-api] Seed data unavailable:', seedError?.message ?? 'unknown error')
    return NextResponse.json(
      { error: 'Jobs service unavailable. Please try again later.' },
      { status: 503 },
    )
  }

  return NextResponse.json(seedData, {
    headers: {
      'X-Fallback-Source': 'seed-data',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
