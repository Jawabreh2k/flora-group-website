import { describe, expect, it } from 'vitest'
import {
  RESUME_MAX_BYTES,
  getResumeFromFormData,
  validateResumeFile,
} from './validate-resume'

function makeFile(name: string, sizeBytes: number, type = 'application/pdf'): File {
  return new File([new Uint8Array(sizeBytes)], name, { type })
}

describe('validateResumeFile', () => {
  it('rejects a missing file', () => {
    expect(validateResumeFile(null)).toBe('Resume file is required.')
    expect(validateResumeFile(undefined)).toBe('Resume file is required.')
  })

  it('rejects an empty file', () => {
    expect(validateResumeFile(makeFile('resume.pdf', 0))).toBe('Resume file is required.')
  })

  it('rejects disallowed extensions', () => {
    expect(validateResumeFile(makeFile('resume.exe', 1024))).toBe(
      'Only PDF and DOCX files are allowed.',
    )
    expect(validateResumeFile(makeFile('resume', 1024))).toBe(
      'Only PDF and DOCX files are allowed.',
    )
  })

  it('accepts pdf and docx case-insensitively', () => {
    expect(validateResumeFile(makeFile('resume.PDF', 1024))).toBeNull()
    expect(validateResumeFile(makeFile('resume.DocX', 1024))).toBeNull()
  })

  it('rejects a file over the size limit', () => {
    const oversized = makeFile('resume.pdf', RESUME_MAX_BYTES + 1)
    expect(validateResumeFile(oversized)).toBe('Resume file must be 5 MB or smaller.')
  })

  it('accepts a file exactly at the size limit', () => {
    const exact = makeFile('resume.pdf', RESUME_MAX_BYTES)
    expect(validateResumeFile(exact)).toBeNull()
  })
})

describe('getResumeFromFormData', () => {
  it('returns the file when present under the "resume" key', () => {
    const formData = new FormData()
    const file = makeFile('resume.pdf', 1024)
    formData.append('resume', file)

    expect(getResumeFromFormData(formData)).toBe(file)
  })

  it('returns null when no resume field is present', () => {
    expect(getResumeFromFormData(new FormData())).toBeNull()
  })

  it('returns null for a zero-byte file', () => {
    const formData = new FormData()
    formData.append('resume', makeFile('resume.pdf', 0))

    expect(getResumeFromFormData(formData)).toBeNull()
  })

  it('returns null when the field is not a File', () => {
    const formData = new FormData()
    formData.append('resume', 'not-a-file')

    expect(getResumeFromFormData(formData)).toBeNull()
  })
})
