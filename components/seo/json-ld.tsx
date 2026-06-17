/**
 * Renders a JSON-LD <script> for structured data. The `<` escaping prevents any
 * string value from prematurely closing the script tag (a classic XSS vector).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
