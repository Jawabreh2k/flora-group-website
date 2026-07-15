import { describe, expect, it } from 'vitest'
import { getJobDetailFromSeed, loadJobsSeed, paginateSeed } from './seed'

describe('loadJobsSeed', () => {
  it('loads and validates the real seed file', () => {
    const seed = loadJobsSeed()

    expect(seed.items.length).toBeGreaterThan(0)
    expect(seed.totalCount).toBe(seed.items.length)
    for (const job of seed.items) {
      expect(typeof job.id).toBe('string')
      expect(typeof job.title).toBe('string')
      expect(['REMOTE', 'HYBRID', 'ONSITE']).toContain(job.locationType)
      expect(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']).toContain(job.jobType)
      expect(typeof job.company.id).toBe('string')
      expect(typeof job.company.name).toBe('string')
    }
  })

  it('caches the parsed result across calls', () => {
    const first = loadJobsSeed()
    const second = loadJobsSeed()
    expect(first).toBe(second)
  })
})

describe('paginateSeed', () => {
  it('returns the requested page size and page number', () => {
    const total = loadJobsSeed().items.length
    const pageSize = Math.max(1, Math.ceil(total / 2))
    const page1 = paginateSeed(1, pageSize)

    expect(page1.page).toBe(1)
    expect(page1.pageSize).toBe(pageSize)
    expect(page1.items.length).toBe(Math.min(pageSize, total))
    expect(page1.totalCount).toBe(total)
  })

  it('sets hasNextPage correctly across page boundaries', () => {
    const total = loadJobsSeed().items.length
    if (total < 2) return // seed too small to exercise pagination boundary

    const firstPage = paginateSeed(1, 1)
    expect(firstPage.hasNextPage).toBe(total > 1)

    const lastPage = paginateSeed(total, 1)
    expect(lastPage.hasNextPage).toBe(false)
    expect(lastPage.items.length).toBe(1)
  })

  it('returns an empty page past the end of the data', () => {
    const total = loadJobsSeed().items.length
    const page = paginateSeed(total + 10, 12)

    expect(page.items).toEqual([])
    expect(page.hasNextPage).toBe(false)
  })
})

describe('getJobDetailFromSeed', () => {
  it('returns a full JobDetail for a known seed id', () => {
    const [firstItem] = loadJobsSeed().items
    const detail = getJobDetailFromSeed(firstItem.id)

    expect(detail).not.toBeNull()
    expect(detail?.id).toBe(firstItem.id)
    expect(detail?.title).toBe(firstItem.title)
    expect(Array.isArray(detail?.requirements)).toBe(true)
    expect(Array.isArray(detail?.responsibilities)).toBe(true)
    expect(detail?.company.id).toBe(firstItem.company.id)
  })

  it('returns null for an id not present in the seed', () => {
    // Seed ids are fixed slugs; a GUID never collides with one (see seed.ts doc comment).
    expect(getJobDetailFromSeed('11111111-1111-1111-1111-111111111111')).toBeNull()
  })
})
