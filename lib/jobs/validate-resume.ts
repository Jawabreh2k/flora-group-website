export const RESUME_MAX_BYTES = 5 * 1024 * 1024
export const RESUME_ACCEPT =
  '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const ALLOWED_EXTENSIONS = new Set(['pdf', 'docx'])

export function validateResumeFile(file: File | null | undefined): string | null {
  if (!file || file.size === 0) {
    return 'Resume file is required.'
  }

  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return 'Only PDF and DOCX files are allowed.'
  }

  if (file.size > RESUME_MAX_BYTES) {
    return 'Resume file must be 5 MB or smaller.'
  }

  return null
}

export function getResumeFromFormData(formData: FormData): File | null {
  const value = formData.get('resume')
  return value instanceof File && value.size > 0 ? value : null
}
