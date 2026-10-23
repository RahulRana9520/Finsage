import { NextResponse } from "next/server"
import { getRepo } from "@/lib/repository"
import { getSessionUserId } from "@/lib/auth"

export async function POST(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const repo = getRepo()
  await repo.upsertProfile({ userId, ...body })
  return NextResponse.json({ ok: true })
}
