/**
 * Shared honeypot field for public forms. The input is rendered off-screen and
 * hidden from assistive tech, so real users never see or fill it — only bots
 * that blindly populate every field in a form trip it. Kept in one module so
 * the field name stays identical between client forms and server checks.
 */
export const HONEYPOT_FIELD = 'website_url'

export function isHoneypotTriggered(value: FormDataEntryValue | string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0
}
