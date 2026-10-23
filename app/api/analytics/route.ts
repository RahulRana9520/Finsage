import { NextResponse } from "next/server"
import { getRepo } from "@/lib/repository"
import { getSessionUserId } from "@/lib/auth"
import {
  generateNotifications,
  monthISO,
  sumMonthlyExpenses,
  sumMonthlyIncome,
  sumMonthlyBudget,
} from "@/lib/analytics"

export async function GET(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const repo = getRepo()
  const month = new URL(req.url).searchParams.get("month") || monthISO()
  const [income, expenses, budget, goals] = await Promise.all([
    repo.listIncome(userId),
    repo.listExpenses(userId, month),
    repo.getBudget(userId),
    repo.getGoals(userId),
  ])
  const summary = {
    month,
    monthlyIncome: Math.round(sumMonthlyIncome(income)),
    monthlyBudget: Math.round(sumMonthlyBudget(budget)),
    monthlySpent: Math.round(sumMonthlyExpenses(expenses, month)),
  }
  const notifications = generateNotifications({ month, income, expenses, budget, goals })
  return NextResponse.json({ summary, notifications })
}
