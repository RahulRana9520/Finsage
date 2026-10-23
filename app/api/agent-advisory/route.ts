import { NextResponse } from "next/server"
import { getRepo } from "@/lib/repository"
import { getSessionUserId } from "@/lib/auth"
import { compareTaxRegimes } from "@/lib/tax-engine"
import { searchTaxKnowledge, INDIAN_TAX_KNOWLEDGE_BASE } from "@/lib/tax-knowledge"
import { auditFinances } from "@/lib/audit-engine"

export async function GET(req: Request) {
  try {
    const userId = await getSessionUserId()
    const repo = getRepo()

    let incomes: any[] = []
    let expenses: any[] = []
    let budgets: any[] = []
    let goals: any[] = []
    let profile: any = null

    if (userId) {
      ;[incomes, expenses, budgets, goals, profile] = await Promise.all([
        repo.listIncome(userId),
        repo.listExpenses(userId),
        repo.getBudget(userId),
        repo.getGoals(userId),
        repo.getProfile(userId),
      ])
    }

    // 1. Agent 1: Cash Flow & Anomaly Detective
    const auditReport = auditFinances(incomes, expenses, budgets, goals)

    // 2. Agent 2: Deterministic Indian Tax Specialist
    const annualizedGross = auditReport.monthlyIncome * 12
    const current80CInvestments = Math.min(
      150000,
      expenses
        .filter(e => (e.category || "").toLowerCase().includes("invest") || (e.category || "").toLowerCase().includes("ppf") || (e.category || "").toLowerCase().includes("elss"))
        .reduce((sum, e) => sum + e.amount, 0)
    )

    const taxComparison = compareTaxRegimes({
      grossAnnualIncome: annualizedGross,
      age: profile?.age || 30,
      section80C: current80CInvestments,
      section80D: 25000, // standard assumption
      section80CCD1B: 0,
      section24b: 0,
    })

    // 3. Relevant CBDT & Tax Law Citations
    const relevantLaws = searchTaxKnowledge(
      taxComparison.recommendedRegime === "OLD" ? "80c deduction old regime" : "115bac new regime standard deduction 87a"
    )

    return NextResponse.json({
      success: true,
      auditReport,
      taxComparison,
      relevantLaws,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Agent Advisory GET error:", error)
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const userQuery = body.message || "Provide a comprehensive financial and tax optimization plan."

    const userId = await getSessionUserId()
    const repo = getRepo()

    let incomes: any[] = []
    let expenses: any[] = []
    let budgets: any[] = []
    let goals: any[] = []
    let profile: any = null

    if (userId) {
      ;[incomes, expenses, budgets, goals, profile] = await Promise.all([
        repo.listIncome(userId),
        repo.listExpenses(userId),
        repo.getBudget(userId),
        repo.getGoals(userId),
        repo.getProfile(userId),
      ])
    }

    // Step A: Agent 1 (Audit Detective)
    const auditReport = auditFinances(incomes, expenses, budgets, goals)

    // Step B: Agent 2 (Tax Engine - Deterministic)
    const annualizedGross = auditReport.monthlyIncome * 12
    const current80CInvestments = Math.min(
      150000,
      expenses
        .filter(e => (e.category || "").toLowerCase().includes("invest") || (e.category || "").toLowerCase().includes("ppf") || (e.category || "").toLowerCase().includes("elss"))
        .reduce((sum, e) => sum + e.amount, 0)
    )

    const taxComparison = compareTaxRegimes({
      grossAnnualIncome: annualizedGross,
      age: profile?.age || 30,
      section80C: current80CInvestments,
      section80D: 25000,
      section80CCD1B: 0,
      section24b: 0,
    })

    // Step C: RAG on Official Tax Guidelines
    const relevantLaws = searchTaxKnowledge(userQuery + " " + (taxComparison.recommendedRegime === "NEW" ? "new regime 115bac" : "80c 80d old regime"))

    // Step D: Synthesizer Agent (LLM with deterministic guardrails)
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
    const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat"

    // If LLM is available, synthesize with citations
    if (apiKey) {
      const prompt = `You are the Lead Partner at a top Indian Chartered Accountancy firm, speaking as the Chief Synthesizer of a Multi-Agent Financial System.
You have been provided with PRE-VERIFIED, DETERMINISTIC mathematical calculations and official CBDT legal guidelines.

### STRICT GUARDRAILS:
1. DO NOT recalculate or invent any tax figures. Use ONLY the exact figures provided below.
2. CITE the exact Section numbers and CBDT circulars referenced below.
3. Be concise, actionable, and structured with bold highlights and bullet points.

### VERIFIED SYSTEM DATA:
- Monthly Income: ₹${auditReport.monthlyIncome.toLocaleString("en-IN")} (Annualized Gross: ₹${annualizedGross.toLocaleString("en-IN")})
- Monthly Expenses: ₹${auditReport.monthlySpent.toLocaleString("en-IN")}
- Net Savings: ₹${auditReport.monthlySavings.toLocaleString("en-IN")} (Savings Rate: ${auditReport.savingsRate}%)
- 50/30/20 Status: ${auditReport.rule503020.status} (Needs: ${auditReport.rule503020.needsPct}%, Wants: ${auditReport.rule503020.wantsPct}%)
- Detected Anomalies: ${auditReport.anomalies.map(a => `${a.title}: ${a.description}`).join("; ") || "None"}

### VERIFIED TAX ENGINE OUTPUT:
- Old Tax Regime Liability: ₹${taxComparison.oldRegime.totalTaxLiability.toLocaleString("en-IN")} (Effective Rate: ${taxComparison.oldRegime.effectiveRate}%)
- New Tax Regime Liability: ₹${taxComparison.newRegime.totalTaxLiability.toLocaleString("en-IN")} (Effective Rate: ${taxComparison.newRegime.effectiveRate}%)
- Recommended Regime: ${taxComparison.recommendedRegime} REGIME
- Annual Savings: ₹${taxComparison.annualSavings.toLocaleString("en-IN")}
- Unutilized 80C Room: ₹${taxComparison.unutilized80CLimit.toLocaleString("en-IN")}
- Unutilized NPS 80CCD(1B) Room: ₹${taxComparison.unutilizedNPSLimit.toLocaleString("en-IN")}

### RETRIEVED CBDT LEGAL REFERENCES:
${relevantLaws.map(l => `- **${l.section}** (${l.title}) [Ref: ${l.officialReference}]: Max Limit: ${l.maxLimit}. Key Rule: ${l.keyRules[0]}`).join("\n")}

### USER QUESTION:
"${userQuery}"

Provide an executive advisory report covering:
1. ⚖️ **Tax Strategy & Regime Choice** (Explain the ₹ savings with statutory citations).
2. 🕵️ **Cash Flow & Leakage Audit** (Address the 50/30/20 balance and any detected leaks).
3. 🎯 **Immediate Action Checklist** (Ranked by priority: What to do before the quarter ends).`

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "CA Multi-Agent Advisor",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "You are an expert Indian Chartered Accountant advisor specializing in personal tax optimization, wealth preservation, and statutory compliance.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 800,
          temperature: 0.5,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const reply = data.choices?.[0]?.message?.content || "Advisory report generated."
        return NextResponse.json({
          content: reply,
          auditReport,
          taxComparison,
          relevantLaws,
        })
      }
    }

    // Fallback: Structured Multi-Agent synthesis without external LLM latency/cost
    const fallbackResponse = `### ⚖️ Multi-Agent Advisory Synthesis

**1. Tax Regime Verdict:**
Based on your annualized gross income of **₹${annualizedGross.toLocaleString("en-IN")}**, the **${taxComparison.recommendedRegime} Tax Regime** is mathematically optimal, saving you **₹${taxComparison.annualSavings.toLocaleString("en-IN")}** in statutory tax liability.
- **${taxComparison.recommendedRegime === "NEW" ? "Section 115BAC (New Regime)" : "Old Tax Regime"}**: Your total tax liability is **₹${(taxComparison.recommendedRegime === "NEW" ? taxComparison.newRegime.totalTaxLiability : taxComparison.oldRegime.totalTaxLiability).toLocaleString("en-IN")}** (effective rate: ${(taxComparison.recommendedRegime === "NEW" ? taxComparison.newRegime.effectiveRate : taxComparison.oldRegime.effectiveRate)}%).
${taxComparison.unutilized80CLimit > 0 ? `- **Section 80C Opportunity:** You have **₹${taxComparison.unutilized80CLimit.toLocaleString("en-IN")}** remaining deduction limit before reaching the ₹1,50,000 statutory cap.` : ""}
- **Section 80CCD(1B) (NPS):** You can claim an exclusive additional deduction of up to **₹50,000** for contributions to NPS Tier-1.

**2. Cash Flow & Spending Audit:**
- **50/30/20 Health Status:** ${auditReport.rule503020.status.toUpperCase()} (Needs: ${auditReport.rule503020.needsPct}%, Wants: ${auditReport.rule503020.wantsPct}%, Savings: ${auditReport.savingsRate}%).
${auditReport.anomalies.length > 0 ? `- ⚠️ **Alert:** ${auditReport.anomalies[0].title} — ${auditReport.anomalies[0].description}` : "- ✅ Cash flow is stable with no critical leakage detected."}

**3. Action Checklist:**
1. Stick with the **${taxComparison.recommendedRegime} Tax Regime** for Form 16 / salary tax declaration.
2. ${auditReport.anomalies.length > 0 ? auditReport.anomalies[0].actionableStep : "Maintain an automated emergency fund deposit for at least 3 months of basic living expenses."}
3. Review eligible investments under ${relevantLaws[0]?.section || "Section 80C / 80CCD"} before the tax filing deadline.`

    return NextResponse.json({
      content: fallbackResponse,
      auditReport,
      taxComparison,
      relevantLaws,
    })
  } catch (error: any) {
    console.error("Agent Advisory POST error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate advisory" }, { status: 500 })
  }
}
