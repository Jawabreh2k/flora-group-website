import { NextResponse } from "next/server"
import { env } from "@/lib/env"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { HONEYPOT_FIELD, isHoneypotTriggered } from "@/lib/honeypot"

const RATE_LIMIT = 3
const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { allowed, retryAfterSeconds } = checkRateLimit(`newsletter:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    )
  }

  try {
    const { [HONEYPOT_FIELD]: honeypot, ...body } = await request.json()

    // Bot trap: real users never see or fill this field (see components/honeypot-field.tsx).
    // Report success without hitting the CMS so bots get no signal their submission was dropped.
    if (isHoneypotTriggered(honeypot)) {
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    const res = await fetch(`${env.apiUrl}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    })

    const data = await res.json().catch(() => ({ error: "Subscription failed" }))

    if (!res.ok) {
      const errorBody = data as { error?: string; title?: string; errors?: Record<string, string[]> }
      return NextResponse.json(
        {
          error: errorBody.error ?? errorBody.title ?? "Subscription failed",
          errors: errorBody.errors,
        },
        { status: res.status },
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to reach subscription service" }, { status: 502 })
  }
}
