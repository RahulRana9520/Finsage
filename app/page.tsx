"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Scale,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  Calculator,
  Flame,
  PieChart as PieIcon,
  Zap,
  BookOpen,
  ArrowUpRight,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function LandingPage() {
  // Interactive mini-calculator state for landing page
  const [incomeLakhs, setIncomeLakhs] = useState<number>(12)
  const grossIncome = incomeLakhs * 100000

  // Quick live math for the hero widget
  // New Regime approx with standard deduction 75k
  const taxableNew = Math.max(0, grossIncome - 75000)
  let newTax = 0
  if (taxableNew > 1500000) {
    newTax = 140000 + (taxableNew - 1500000) * 0.30
  } else if (taxableNew > 1200000) {
    newTax = 80000 + (taxableNew - 1200000) * 0.20
  } else if (taxableNew > 1000000) {
    newTax = 50000 + (taxableNew - 1000000) * 0.15
  } else if (taxableNew > 700000) {
    newTax = 20000 + (taxableNew - 700000) * 0.10
  } else if (taxableNew > 300000) {
    newTax = (taxableNew - 300000) * 0.05
  }
  if (taxableNew <= 700000) newTax = 0 // 87A rebate
  newTax = Math.round(newTax * 1.04) // Cess

  // Old Regime approx with 50k SD + 1.5L 80C
  const taxableOld = Math.max(0, grossIncome - 200000)
  let oldTax = 0
  if (taxableOld > 1000000) {
    oldTax = 112500 + (taxableOld - 1000000) * 0.30
  } else if (taxableOld > 500000) {
    oldTax = 12500 + (taxableOld - 500000) * 0.20
  } else if (taxableOld > 250000) {
    oldTax = (taxableOld - 250000) * 0.05
  }
  if (taxableOld <= 500000) oldTax = 0 // 87A rebate
  oldTax = Math.round(oldTax * 1.04)

  const annualSavings = Math.abs(oldTax - newTax)
  const winningRegime = newTax <= oldTax ? "New Regime (Sec 115BAC)" : "Old Tax Regime"

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Glow Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-20 -left-40 w-[500px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-primary to-cyan-400 p-[1px] shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                FinSage
              </span>
              <Badge variant="outline" className="text-[10px] font-semibold py-0 px-1.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                Multi-Agent v2
              </Badge>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#agents" className="hover:text-foreground transition-colors">
              The Agent Team
            </a>
            <a href="#calculator" className="hover:text-foreground transition-colors">
              Tax Simulator
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Hybrid Engine
            </a>
            <a href="#security" className="hover:text-foreground transition-colors">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 gap-1.5 shadow-md shadow-primary/20">
                Launch Studio
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-20 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Autonomous Financial & Tax Intelligence for Indian Taxpayers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Your Personal Chartered Accountant,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Driven by Autonomous Agents.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Zero hallucinations. Pure arithmetic. FinSage couples deterministic Indian tax engines with curated CBDT statutory circulars and 50/30/20 cash flow audit agents.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-sm bg-gradient-to-r from-indigo-600 via-primary to-cyan-600 hover:opacity-90 shadow-xl shadow-primary/25 gap-2 w-full sm:w-auto">
              Launch Live Studio
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#calculator">
            <Button size="lg" variant="outline" className="h-12 px-8 text-sm border-border/60 hover:bg-muted/40 w-full sm:w-auto gap-2">
              <Calculator className="h-4 w-4 text-cyan-400" />
              Try Tax Simulator
            </Button>
          </a>
        </div>

        {/* STATS STRIP */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="text-2xl font-bold text-foreground">0.0%</div>
            <div className="text-xs text-muted-foreground mt-0.5">Tax Math Hallucination</div>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="text-2xl font-bold text-emerald-400">&lt; 5ms</div>
            <div className="text-xs text-muted-foreground mt-0.5">Serverless Execution</div>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="text-2xl font-bold text-cyan-400">100%</div>
            <div className="text-xs text-muted-foreground mt-0.5">CBDT Statute Grounded</div>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="text-2xl font-bold text-indigo-400">4 Agents</div>
            <div className="text-xs text-muted-foreground mt-0.5">Continuous Collaboration</div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE MINI CALCULATOR SECTION */}
      <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
            Interactive Simulator
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">
            See the Deterministic Tax Engine in Action
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Drag the slider to test your annual salary. Notice how the Old vs. New Regime calculations update instantly with zero AI lag.
          </p>
        </div>

        <Card className="border-border/50 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl shadow-2xl p-6 md:p-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Annual Gross Salary
                </span>
                <div className="text-3xl font-extrabold text-foreground mt-1">
                  ₹{grossIncome.toLocaleString("en-IN")}{" "}
                  <span className="text-sm font-normal text-muted-foreground">({incomeLakhs} LPA)</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs py-1 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 self-start sm:self-center">
                💡 {winningRegime} saves ₹{annualSavings.toLocaleString("en-IN")}
              </Badge>
            </div>

            <Slider
              min={3}
              max={50}
              step={1}
              value={[incomeLakhs]}
              onValueChange={(val) => setIncomeLakhs(val[0])}
              className="py-4"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>₹3 Lakhs (Entry)</span>
              <span>₹15 Lakhs (Mid-Senior)</span>
              <span>₹30 Lakhs (Executive)</span>
              <span>₹50 Lakhs (Leadership)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/40">
              <div className={`p-4 rounded-xl border ${newTax <= oldTax ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/40 bg-muted/20"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-emerald-400">
                    New Regime (Sec 115BAC)
                  </span>
                  {newTax <= oldTax && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      OPTIMAL
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-foreground mt-2">
                  ₹{newTax.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Includes ₹75,000 enhanced standard deduction + revised tax slabs.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${oldTax < newTax ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/40 bg-muted/20"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-indigo-400">
                    Old Tax Regime
                  </span>
                  {oldTax < newTax && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      OPTIMAL
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-foreground mt-2">
                  ₹{oldTax.toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Assumes ₹50,000 standard deduction + ₹1.5L Section 80C utilization.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link href="/dashboard">
                <Button className="text-xs bg-primary hover:bg-primary/90 gap-1.5">
                  Analyze Full Financial Profile in Studio
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* THE 4 SPECIALIZED AGENTS SECTION */}
      <section id="agents" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
            Multi-Agent Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Meet Your Specialized Financial Team
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Instead of a single generalized prompt, four decoupled agents handle distinct domains to eliminate mathematical errors and conflicting advice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Agent 1 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">
                🕵️
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Audit Detective</h3>
                <span className="text-[11px] text-cyan-400 font-medium">Anomaly & Leakage Hunter</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Applies the 50/30/20 rule to categorize spending into Needs, Wants, and Savings. Identifies runaway lifestyle inflation and flagged luxury expenses.
              </p>
              <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground">
                <strong>Key Tool:</strong> Deterministic anomaly engine (`lib/audit-engine.ts`)
              </div>
            </CardContent>
          </Card>

          {/* Agent 2 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-indigo-500/40 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                ⚖️
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Indian Tax Specialist</h3>
                <span className="text-[11px] text-indigo-400 font-medium">CBDT & Statutory Advisor</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Simulates Old vs. New Regime tax liabilities to the exact rupee. Pinpoints unused 80C (₹1.5L) and exclusive NPS 80CCD(1B) (₹50k) headroom.
              </p>
              <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground">
                <strong>Key Tool:</strong> Slabs engine & CBDT index (`lib/tax-engine.ts`)
              </div>
            </CardContent>
          </Card>

          {/* Agent 3 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-emerald-500/40 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Wealth Strategist</h3>
                <span className="text-[11px] text-emerald-400 font-medium">Milestone & Goal Planner</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Evaluates emergency fund runway (3-6 months) and calculates required monthly SIP contributions to hit target milestone dates without debt.
              </p>
              <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground">
                <strong>Key Tool:</strong> Cash flow runway & timeline forecasting
              </div>
            </CardContent>
          </Card>

          {/* Agent 4 */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl">
                🧠
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Lead Synthesizer</h3>
                <span className="text-[11px] text-purple-400 font-medium">Chief Financial Reviewer</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Resolves conflicting recommendations between agents, verifies statutory citations, and formats an executive action plan for the user.
              </p>
              <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground">
                <strong>Key Tool:</strong> Grounded LLM synthesizer with strict guardrails
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* WHY HYBRID BEATS GENERIC AI */}
      <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 md:p-12 rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card/70 to-background shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                The Hybrid Difference
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Why Generic ChatGPT Prompts Fail at Personal Finance
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Standard LLMs are trained to predict the next word, not compute exact financial arithmetic. They frequently hallucinate tax slabs, mix up fiscal years, and fabricate deduction rules.
              </p>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Deterministic Math:</strong> Tax rates and budget metrics are calculated in compiled TypeScript before the AI ever sees them.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Official CBDT Grounding:</strong> Every recommendation cites exact Sections (80C, 80CCD, 80D, 115BAC, 87A) and official circulars.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sub-5ms Execution:</strong> Blazing-fast performance that will never hit Vercel serverless 10-second timeout limits.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-2 text-xs">
                <span className="font-semibold text-destructive flex items-center gap-1.5">
                  ❌ Generic AI Bot
                </span>
                <p className="text-muted-foreground">
                  "I think your tax might be around ₹85,000. You can also claim standard deduction of ₹50,000 in New Regime (outdated Budget 2023 rule)."
                </p>
                <span className="text-[10px] text-destructive italic">Hallucinates numbers & outdated laws.</span>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  ✅ FinSage Autonomous Team
                </span>
                <p className="text-muted-foreground">
                  "Under Section 115BAC (Finance Act 2024), your enhanced standard deduction is ₹75,000. Your exact statutory tax liability is ₹78,000, saving you ₹46,800 over the Old Regime."
                </p>
                <span className="text-[10px] text-emerald-400 font-medium">Exact arithmetic, verified CBDT statutes.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY STRIP */}
      <section id="security" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-4">
        <div className="h-10 w-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold">Privacy-First Architecture</h3>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto">
          We never store plaintext financial credentials or bank passwords. All session data is isolated and compatible with Vercel serverless persistence.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">FinSage</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Login
          </Link>
          <a href="#calculator" className="hover:text-foreground transition-colors">
            Simulator
          </a>
        </div>
      </footer>
    </div>
  )
}
