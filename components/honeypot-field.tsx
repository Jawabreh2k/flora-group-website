import { HONEYPOT_FIELD } from "@/lib/honeypot"

/**
 * Renders an input that's invisible and unreachable for real users (off-screen,
 * out of tab order, hidden from assistive tech) but still present in the DOM
 * for bots that fill every field indiscriminately. Controlled, since the forms
 * that use it build their submit payloads manually rather than serializing the
 * native <form>. Pair with `isHoneypotTriggered` on the server — see lib/honeypot.ts.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: 0,
        height: 0,
        overflow: "hidden",
      }}
    >
      <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
