/**
 * Shapes returned by our Next.js API routes when they proxy a failed request to
 * the CMS backend. `errors` mirrors the backend's RFC-7807 ValidationProblemDetails
 * map — keyed by the FluentValidation PropertyName (PascalCase, dotted for nested
 * members e.g. "Resume.Length") — see flora-backend ExceptionHandlingMiddleware.
 */
export type ApiErrorBody = {
  error?: string
  errors?: Record<string, string[]>
}

export type FieldErrorMap = Record<string, string>

/**
 * Maps a backend field-error map onto this form's local field keys via `keyMap`
 * (backend PropertyName -> local field name). Backend keys with no local mapping
 * are returned in `unmapped` so their message still reaches the user, via the
 * generic error banner, instead of being silently dropped.
 */
export function mapFieldErrors(
  errors: Record<string, string[]> | undefined,
  keyMap: Record<string, string>,
): { fieldErrors: FieldErrorMap; unmapped: string[] } {
  const fieldErrors: FieldErrorMap = {}
  const unmapped: string[] = []

  for (const [backendKey, messages] of Object.entries(errors ?? {})) {
    const message = messages[0]
    if (!message) continue

    const localKey = keyMap[backendKey]
    if (localKey) {
      fieldErrors[localKey] = message
    } else {
      unmapped.push(message)
    }
  }

  return { fieldErrors, unmapped }
}

export function extractErrorMessage(body: ApiErrorBody | null | undefined, fallback: string): string {
  return body?.error ?? fallback
}
