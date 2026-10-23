import type { BudgetAllocation, ExpenseEntry, Goal, IncomeEntry } from "./repository"

export function monthISO(date = new Date()): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

export function sumMonthlyIncome(income: IncomeEntry[]): number {
  return income.reduce((acc, i) => {
    const factor =
      i.frequency === "monthly" ? 1 : i.frequency === "weekly" ? 4.33 : i.frequency === "yearly" ? 1 / 12 : 0 // one-time ignored for monthly flow
    return acc + i.amount * factor
  }, 0)
}

export function sumMonthlyBudget(budget: BudgetAllocation[]): number {
  return budget.reduce((acc, b) => acc + b.monthlyAmount, 0)
}

export function sumMonthlyExpenses(expenses: ExpenseEntry[], onMonthISO: string): number {
  const [yy, mm] = onMonthISO.split("-").map((s) => Number.parseInt(s))
  return expenses.reduce((acc, e) => {
    const d = new Date(e.date)
    if (d.getUTCFullYear() === yy && d.getUTCMonth() + 1 === mm) {
      return acc + e.amount
    }
    return acc
  }, 0)
}

export function categorySpending(expenses: ExpenseEntry[], onMonthISO: string): Record<string, number> {
  const [yy, mm] = onMonthISO.split("-").map((s) => Number.parseInt(s))
  const map: Record<string, number> = {}
  for (const e of expenses) {
    const d = new Date(e.date)
    if (d.getUTCFullYear() === yy && d.getUTCMonth() + 1 === mm) {
      map[e.category] = (map[e.category] || 0) + e.amount
    }
  }
  return map
}

export function carPurchasePlanAdvice(
  targetAmount: number,
  months: number,
  currentSavings: number,
  monthlySavingsCapacity: number,
) {
  const needed = Math.max(0, targetAmount - currentSavings)
  const perMonthRequired = months > 0 ? needed / months : needed
  const feasible = monthlySavingsCapacity >= perMonthRequired
  return { needed, perMonthRequired, feasible }
}

export function generateNotifications(args: {
  month: string
  income: IncomeEntry[]
  expenses: ExpenseEntry[]
  budget: BudgetAllocation[]
  goals: Goal[]
}): string[] {
  const notes: string[] = []
  const monthlyIncome = sumMonthlyIncome(args.income)
  const monthlyBudget = sumMonthlyBudget(args.budget)
  const monthlySpent = sumMonthlyExpenses(args.expenses, args.month)

  if (monthlySpent > monthlyBudget && monthlyBudget > 0) {
    notes.push(
      `Spending exceeded your planned budget by ₹${Math.round(monthlySpent - monthlyBudget)} in ${args.month}.`,
    )
  }
  if (monthlySpent > monthlyIncome && monthlyIncome > 0) {
    notes.push(
      `Your expenses exceeded income by ₹${Math.round(monthlySpent - monthlyIncome)} this month. Consider cutting discretionary categories.`,
    )
  }

  const catSpend = categorySpending(args.expenses, args.month)
  for (const [cat, amt] of Object.entries(catSpend)) {
    const budgetForCat = args.budget.find((b) => b.category.toLowerCase() === cat.toLowerCase())
    if (budgetForCat && amt > budgetForCat.monthlyAmount) {
      notes.push(`Overspent in ${cat}: ₹${Math.round(amt)} vs budget ₹${Math.round(budgetForCat.monthlyAmount)}.`)
    }
  }

  // Goal-based example: car purchase in 12 months
  const carGoal = args.goals.find((g) => /car/i.test(g.name))
  if (carGoal) {
    const monthsLeft = Math.max(
      1,
      Math.ceil((new Date(carGoal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)),
    )
    const currentSavings = 0 // placeholder; extend as needed
    const monthlySavingsCapacity = Math.max(0, monthlyIncome - monthlySpent)
    const { perMonthRequired, feasible } = carPurchasePlanAdvice(
      carGoal.targetAmount,
      monthsLeft,
      currentSavings,
      monthlySavingsCapacity,
    )
    notes.push(
      feasible
        ? `Car goal looks feasible. Save about ₹${Math.round(perMonthRequired)} per month for ${monthsLeft} months.`
        : `Car goal is tight. You need ~₹${Math.round(perMonthRequired)} per month for ${monthsLeft} months; currently you can save ~₹${Math.round(monthlySavingsCapacity)}.`,
    )
  }

  // Example tax advice trigger
  if (catSpend["entertainment"] && catSpend["entertainment"] > 0.2 * monthlyIncome) {
    notes.push(
      "High discretionary spending detected (Entertainment). Consider reallocating to 80C investments to optimize taxes.",
    )
  }

  return notes
}
