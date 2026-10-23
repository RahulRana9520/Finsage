import { NextResponse } from "next/server"
import { getRepo, type BudgetAllocation } from "@/lib/repository"
import { getSessionUserId, newId } from "@/lib/auth"

export async function POST(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const items: { category: string; monthlyAmount: number }[] = await req.json()
  const repo = getRepo()
  const allocations: BudgetAllocation[] = items.map((b) => ({
    id: newId(),
    userId,
    category: b.category,
    monthlyAmount: b.monthlyAmount,
  }))
  await repo.setBudget(userId, allocations)
  return NextResponse.json({ ok: true })
}
