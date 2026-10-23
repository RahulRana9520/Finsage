import { NextResponse } from "next/server"
import { getRepo, type ExpenseEntry } from "@/lib/repository"
import { getSessionUserId, newId } from "@/lib/auth"

export async function POST(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body: {
    category: string
    amount: number
    date?: string
    description?: string
    level?: "expensive" | "moderate" | "basic"
  } = await req.json()
  const repo = getRepo()
  const entry: ExpenseEntry = {
    id: newId(),
    userId,
    category: body.category,
    amount: body.amount,
    date: body.date || new Date().toISOString(),
    description: body.description,
    level: body.level,
  }
  await repo.addExpense(entry)
  return NextResponse.json({ ok: true })
}

export async function GET(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const url = new URL(req.url)
  const month = url.searchParams.get("month") || undefined
  const repo = getRepo()
  const items = await repo.listExpenses(userId, month)
  return NextResponse.json({ items })
}
