import { NextResponse } from "next/server"
import { getRepo, type IncomeEntry } from "@/lib/repository"
import { getSessionUserId, newId } from "@/lib/auth"

export async function POST(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const items: Omit<IncomeEntry, "id" | "userId">[] = await req.json()
  const repo = getRepo()
  for (const it of items) {
    await repo.addIncome({ id: newId(), userId, ...it })
  }
  return NextResponse.json({ ok: true })
}
