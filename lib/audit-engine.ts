// Cash Flow, Anomaly Detection & Financial Health Audit Engine
// Encodes standard financial planning frameworks (50/30/20 rule, emergency runway, discretionary leakage)

import { ExpenseEntry, IncomeEntry, BudgetAllocation, Goal } from "./repository"

export interface SpendingCategorySummary {
  category: string
  totalSpent: number
  budget: number
  percentageOfIncome: number
  status: "safe" | "warning" | "exceeded"
}

export interface FinancialAnomaly {
  type: "overspending" | "discretionary_spike" | "budget_breach" | "goal_lag" | "savings_alert"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  actionableStep: string
}

export interface AuditReport {
  monthlyIncome: number
  monthlySpent: number
  monthlySavings: number
  savingsRate: number // %
  healthScore: number // 0 to 100
  needsSpent: number // 50% target
  wantsSpent: number // 30% target
  savingsAllocation: number // 20% target
  rule503020: {
    needsPct: number
    wantsPct: number
    savingsPct: number
    status: "healthy" | "wants_heavy" | "needs_strained" | "deficit"
  }
  categoryBreakdown: SpendingCategorySummary[]
  anomalies: FinancialAnomaly[]
  keyRecommendation: string
}

const NEEDS_CATEGORIES = new Set([
  "rent",
  "housing",
  "groceries",
  "food",
  "utilities",
  "electricity",
  "transport",
  "commute",
  "healthcare",
  "medical",
  "insurance",
  "education",
  "bills"
])

export function auditFinances(
  incomes: IncomeEntry[],
  expenses: ExpenseEntry[],
  budgets: BudgetAllocation[],
  goals: Goal[] = []
): AuditReport {
  // 1. Calculate Monthly Income
  const monthlyIncome = incomes.reduce((sum, inc) => {
    if (inc.frequency === "monthly") return sum + inc.amount
    if (inc.frequency === "yearly") return sum + inc.amount / 12
    if (inc.frequency === "weekly") return sum + (inc.amount * 52) / 12
    return sum + inc.amount
  }, 0)

  // 2. Tally Expenses & Breakdown
  const categoryMap = new Map<string, number>()
  let totalSpent = 0
  let needsSpent = 0
  let wantsSpent = 0
  let expensiveCount = 0

  for (const exp of expenses) {
    totalSpent += exp.amount
    const cat = (exp.category || "uncategorized").toLowerCase()
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + exp.amount)

    if (NEEDS_CATEGORIES.has(cat)) {
      needsSpent += exp.amount
    } else {
      wantsSpent += exp.amount
    }

    if (exp.level === "expensive") {
      expensiveCount++
    }
  }

  const monthlySavings = Math.max(0, monthlyIncome - totalSpent)
  const savingsRate = monthlyIncome > 0 ? Number(((monthlySavings / monthlyIncome) * 100).toFixed(1)) : 0

  // 3. 50/30/20 Rule Analysis
  const needsPct = monthlyIncome > 0 ? Number(((needsSpent / monthlyIncome) * 100).toFixed(1)) : 0
  const wantsPct = monthlyIncome > 0 ? Number(((wantsSpent / monthlyIncome) * 100).toFixed(1)) : 0
  const savingsPct = savingsRate

  let ruleStatus: "healthy" | "wants_heavy" | "needs_strained" | "deficit" = "healthy"
  if (totalSpent > monthlyIncome && monthlyIncome > 0) {
    ruleStatus = "deficit"
  } else if (wantsPct > 35) {
    ruleStatus = "wants_heavy"
  } else if (needsPct > 60) {
    ruleStatus = "needs_strained"
  }

  // 4. Budget vs Actual Category Audit
  const budgetMap = new Map<string, number>()
  for (const b of budgets) {
    budgetMap.set(b.category.toLowerCase(), b.monthlyAmount)
  }

  const categoryBreakdown: SpendingCategorySummary[] = []
  const allCategories = new Set([...categoryMap.keys(), ...budgetMap.keys()])

  for (const cat of allCategories) {
    const spent = categoryMap.get(cat) || 0
    const budget = budgetMap.get(cat) || 0
    const pct = monthlyIncome > 0 ? Number(((spent / monthlyIncome) * 100).toFixed(1)) : 0

    let status: "safe" | "warning" | "exceeded" = "safe"
    if (budget > 0) {
      if (spent > budget) status = "exceeded"
      else if (spent >= budget * 0.85) status = "warning"
    }

    categoryBreakdown.push({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      totalSpent: spent,
      budget,
      percentageOfIncome: pct,
      status
    })
  }

  // 5. Detect Anomalies
  const anomalies: FinancialAnomaly[] = []

  // Deficit anomaly
  if (totalSpent > monthlyIncome && monthlyIncome > 0) {
    anomalies.push({
      type: "savings_alert",
      severity: "high",
      title: "Negative Cash Flow Alert",
      description: `Your monthly expenditures (₹${totalSpent.toLocaleString("en-IN")}) exceed your reported income (₹${monthlyIncome.toLocaleString("en-IN")}) by ₹${(totalSpent - monthlyIncome).toLocaleString("en-IN")}.`,
      actionableStep: "Halt all non-essential discretionary purchases immediately to stop draining reserves."
    })
  }

  // Discretionary spend spike
  if (wantsPct > 35) {
    anomalies.push({
      type: "discretionary_spike",
      severity: "medium",
      title: "Discretionary Spending Exceeds 30% Benchmark",
      description: `Non-essential lifestyle spending stands at ${wantsPct}% of your income (ideal target is under 30%).`,
      actionableStep: "Audit leisure, luxury subscriptions, and dining out to trim at least ₹5,000 this month."
    })
  }

  // Budget breaches
  for (const item of categoryBreakdown) {
    if (item.status === "exceeded" && item.budget > 0) {
      anomalies.push({
        type: "budget_breach",
        severity: "medium",
        title: `${item.category} Budget Breached`,
        description: `You spent ₹${item.totalSpent.toLocaleString("en-IN")} against your designated limit of ₹${item.budget.toLocaleString("en-IN")} (${Math.round((item.totalSpent / item.budget) * 100)}% utilized).`,
        actionableStep: `Freeze additional spending in ${item.category} for the remainder of this cycle.`
      })
    }
  }

  // Goal timeline lag check
  if (goals.length > 0 && monthlySavings < 5000 && monthlyIncome > 20000) {
    anomalies.push({
      type: "goal_lag",
      severity: "medium",
      title: "Financial Goal Funding at Risk",
      description: `You have ${goals.length} target goal(s), but current monthly net surplus (₹${monthlySavings.toLocaleString("en-IN")}) is insufficient to support your target timelines.`,
      actionableStep: "Automate a systematic savings transfer (SIP/RD) on salary day before making discretionary spends."
    })
  }

  // 6. Compute Comprehensive Health Score (0 - 100)
  let healthScore = 50 // Base
  if (monthlyIncome > 0) {
    // Savings rate factor (max +25)
    if (savingsRate >= 30) healthScore += 25
    else if (savingsRate >= 20) healthScore += 18
    else if (savingsRate >= 10) healthScore += 10
    else if (savingsRate <= 0) healthScore -= 20

    // Wants factor (max +15)
    if (wantsPct <= 30) healthScore += 15
    else if (wantsPct > 40) healthScore -= 10

    // Budget discipline factor (max +10)
    const breaches = categoryBreakdown.filter(c => c.status === "exceeded").length
    if (breaches === 0 && budgets.length > 0) healthScore += 10
    else healthScore -= breaches * 5

    // Goals in place factor
    if (goals.length > 0) healthScore += 5
  }
  healthScore = Math.max(10, Math.min(100, healthScore))

  // Key recommendation
  let keyRecommendation = "Maintain steady savings and automate investments toward your goals."
  if (anomalies.length > 0) {
    keyRecommendation = anomalies[0].actionableStep
  }

  return {
    monthlyIncome,
    monthlySpent: totalSpent,
    monthlySavings,
    savingsRate,
    healthScore,
    needsSpent,
    wantsSpent,
    savingsAllocation: monthlySavings,
    rule503020: {
      needsPct,
      wantsPct,
      savingsPct,
      status: ruleStatus
    },
    categoryBreakdown,
    anomalies,
    keyRecommendation
  }
}
