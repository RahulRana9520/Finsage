import { NextResponse } from "next/server"
import { getRepo, type Goal } from "@/lib/repository"
import { getSessionUserId, newId } from "@/lib/auth"

export async function POST(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const items: { name: string; targetAmount: number; targetDate: string }[] = await req.json()
  const repo = getRepo()
  const goals: Goal[] = items.map((g) => ({ id: newId(), userId, ...g }))
  await repo.setGoals(userId, goals)
  return NextResponse.json({ ok: true })
}
