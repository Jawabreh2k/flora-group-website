import { NextResponse } from "next/server"
import { env } from "@/lib/env"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const res = await fetch(`${env.apiUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({ error: "Contact submission failed" }))

    if (!res.ok) {
      return NextResponse.json(
        { error: (data as { error?: string; title?: string }).error ?? (data as { title?: string }).title ?? "Contact submission failed" },
        { status: res.status },
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to reach contact API" }, { status: 502 })
  }
}
