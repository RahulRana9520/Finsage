import { NextResponse } from "next/server"
import { getRepo } from "@/lib/repository"
import { getSessionUserId, newId } from "@/lib/auth"
import { SAMPLE_INCOME, SAMPLE_BUDGET, SAMPLE_EXPENSES, SAMPLE_GOALS } from "@/lib/sample-data"

export async function POST(req: Request) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  const repo = getRepo()
  
  try {
    // Add sample income
    for (const income of SAMPLE_INCOME) {
      await repo.addIncome({ id: newId(), userId, ...income })
    }
    
    // Set sample budget
    const budgetAllocations = SAMPLE_BUDGET.map(b => ({
      id: newId(),
      userId,
      category: b.category,
      monthlyAmount: b.monthlyAmount
    }))
    await repo.setBudget(userId, budgetAllocations)
    
    // Add sample expenses
    for (const expense of SAMPLE_EXPENSES) {
      await repo.addExpense({ id: newId(), userId, ...expense })
    }
    
    // Set sample goals
    const goals = SAMPLE_GOALS.map(g => ({
      id: newId(),
      userId,
      name: g.name,
      targetAmount: g.targetAmount,
      targetDate: g.targetDate
    }))
    await repo.setGoals(userId, goals)
    
    return NextResponse.json({ ok: true, message: "Sample data added successfully" })
  } catch (error) {
    console.error("Error adding sample data:", error)
    return NextResponse.json({ error: "Failed to add sample data" }, { status: 500 })
  }
}
