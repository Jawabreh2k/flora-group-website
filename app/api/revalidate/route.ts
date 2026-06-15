import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { env } from "@/lib/env"

/**
 * On-demand cache invalidation webhook. The CMS / Admin Portal calls this right
 * after a successful theme save so the public site reflects the change within a
 * second — instead of waiting out the ISR revalidate window — and still with no
 * rebuild.
 *
 * Auth: a shared secret in the `x-revalidate-secret` header (or `?secret=`),
 * matched against FLORA_REVALIDATE_SECRET. If the env var is unset the endpoint
 * is disabled (returns 503) to avoid an unauthenticated cache-buster in prod.
 */
export async function POST(request: Request) {
  const expected = env.revalidateSecret
  if (!expected) {
    return NextResponse.json(
      { revalidated: false, error: "Revalidation is not configured." },
      { status: 503 },
    )
  }

  const url = new URL(request.url)
  const provided =
    request.headers.get("x-revalidate-secret") ?? url.searchParams.get("secret")

  if (provided !== expected) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid secret." },
      { status: 401 },
    )
  }

  revalidateTag("ui-config", "default")
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
