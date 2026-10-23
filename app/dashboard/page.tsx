"use client"

import { useState, useRef } from "react"
import useSWR from "swr"
import Link from "next/link"
import {
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Scale,
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  PlusCircle,
  HelpCircle,
  LogOut,
  Send,
  BookOpen,
  ArrowRight,
  Flame,
  Target
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface AgentMessage {
  role: "user" | "assistant"
  agent?: "supervisor" | "tax" | "audit" | "wealth"
  content: string
  timestamp?: string
}

export default function DashboardPage() {
  const { data: me } = useSWR("/api/me", fetcher)
  const { data: analytics, mutate: mutateAnalytics } = useSWR("/api/analytics", fetcher)
  const { data: advisoryData, mutate: mutateAdvisory, isLoading: advisoryLoading } = useSWR(
    "/api/agent-advisory",
    fetcher
  )

  // Transaction form state
  const [category, setCategory] = useState("groceries")
  const [amount, setAmount] = useState<number>(0)
  const [desc, setDesc] = useState("")
  const [level, setLevel] = useState<"basic" | "moderate" | "expensive">("moderate")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Multi-Agent Chat state
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<AgentMessage[]>([
    {
      role: "assistant",
      agent: "supervisor",
      content:
        "Welcome to your **Autonomous CA & Financial Advisory Studio**. Our specialized agents (Audit Detective, Indian Tax Specialist, and Wealth Strategist) have pre-analyzed your cash flow and tax liabilities under verified CBDT rules. Ask any question below or click a quick suggestion to begin.",
      timestamp: "Just now"
    }
  ])
  const abortRef = useRef<AbortController | null>(null)

  const tax = advisoryData?.taxComparison
  const audit = advisoryData?.auditReport
  const laws = advisoryData?.relevantLaws || []

  // Add Expense Handler
  async function addExpense() {
    if (!amount || amount <= 0) return
    setIsSubmitting(true)
    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount, description: desc, level }),
      })
      setAmount(0)
      setDesc("")
      mutateAnalytics()
      mutateAdvisory()
    } catch (err) {
      console.error("Failed to add expense:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Multi-Agent Consultation Query
  async function sendConsultation(queryText?: string) {
    const text = (queryText || chatInput).trim()
    if (!text || chatLoading) return

    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ])
    setChatInput("")
    setChatLoading(true)

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/agent-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`)
      }

      const data = await res.json()
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          agent: text.toLowerCase().includes("tax") ? "tax" : text.toLowerCase().includes("leak") ? "audit" : "supervisor",
          content: data.content || "Advisory report generated successfully.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
      // Revalidate dashboard data
      mutateAdvisory()
      mutateAnalytics()
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setChatHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            agent: "supervisor",
            content: "⚠️ The agent advisory service encountered a temporary error. Please try again or check your configuration.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }
    } finally {
      setChatLoading(false)
    }
  }

  // Load sample data helper
  async function handleLoadDemoData() {
    try {
      const res = await fetch("/api/data/sample", { method: "POST" })
      if (res.ok) {
        mutateAnalytics()
        mutateAdvisory()
      }
    } catch (error) {
      console.error("Error loading sample data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-primary to-cyan-400 p-[1px] shadow-lg shadow-primary/20">
              <div className="w-full h-full bg-background/90 rounded-[11px] flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text">
                  FinSage
                </h1>
                <Badge variant="outline" className="text-[10px] font-semibold py-0 px-1.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                  Multi-Agent v2
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Autonomous Financial & Indian Tax Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(!analytics?.summary?.monthlyIncome || analytics?.summary?.monthlyIncome === 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadDemoData}
                className="text-xs border-primary/30 hover:bg-primary/10 gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Load Demo Data
              </Button>
            )}

            <div className="hidden sm:flex items-center text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              {me?.profile?.fullName || me?.user?.email || "Guest Taxpayer"}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground gap-1"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" })
                window.location.href = "/login"
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ROW 1: KEY FINANCIAL & TAX BENCHMARKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Financial Health Score */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  Financial Health Index
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    (audit?.healthScore || 50) >= 70
                      ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                  }`}
                >
                  {(audit?.healthScore || 50) >= 70 ? "Healthy" : "Needs Review"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight">
                  {audit?.healthScore ?? "--"}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50/30/20 Rule Balance</span>
                  <span className="font-medium text-foreground">
                    Savings: {audit?.savingsRate ?? 0}%
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                  <div
                    className="bg-cyan-500 h-full"
                    style={{ width: `${Math.min(50, audit?.rule503020?.needsPct || 0)}%` }}
                    title="Needs"
                  />
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${Math.min(30, audit?.rule503020?.wantsPct || 0)}%` }}
                    title="Wants"
                  />
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${Math.min(20, audit?.savingsRate || 0)}%` }}
                    title="Savings"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                  <span className="text-cyan-400">Needs {audit?.rule503020?.needsPct || 0}%</span>
                  <span className="text-amber-400">Wants {audit?.rule503020?.wantsPct || 0}%</span>
                  <span className="text-emerald-400">Save {audit?.savingsRate || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Monthly Cash Flow Summary */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-emerald-400" />
                Monthly Cash Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/30">
                  <span className="text-[11px] text-muted-foreground block">Income</span>
                  <span className="text-lg font-bold text-emerald-400">
                    ₹{(audit?.monthlyIncome || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/30">
                  <span className="text-[11px] text-muted-foreground block">Expenditure</span>
                  <span className="text-lg font-bold text-foreground">
                    ₹{(audit?.monthlySpent || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-border/30">
                <span className="text-muted-foreground">Net Monthly Surplus:</span>
                <span className={`font-semibold ${
                  (audit?.monthlySavings || 0) >= 0 ? "text-emerald-400" : "text-destructive"
                }`}>
                  {(audit?.monthlySavings || 0) >= 0 ? "+" : ""}
                  ₹{(audit?.monthlySavings || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 3. Deterministic Indian Tax Simulator Card */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-indigo-400" />
                  Tax Regime Simulator (CBDT)
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-xs border-indigo-500/30 text-indigo-400 bg-indigo-500/10 font-bold"
                >
                  {tax?.recommendedRegime ? `${tax.recommendedRegime} REGIME WINS` : "CALCULATING"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className={`p-2 rounded-lg border ${
                  tax?.recommendedRegime === "OLD" ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/30 bg-muted/20"
                }`}>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Old Regime</span>
                  <span className="text-sm font-bold">
                    ₹{tax?.oldRegime?.totalTaxLiability?.toLocaleString("en-IN") ?? "--"}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    ({tax?.oldRegime?.effectiveRate ?? 0}%)
                  </span>
                </div>
                <div className={`p-2 rounded-lg border ${
                  tax?.recommendedRegime === "NEW" ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/30 bg-muted/20"
                }`}>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">New (Sec 115BAC)</span>
                  <span className="text-sm font-bold text-emerald-400">
                    ₹{tax?.newRegime?.totalTaxLiability?.toLocaleString("en-IN") ?? "--"}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    ({tax?.newRegime?.effectiveRate ?? 0}%)
                  </span>
                </div>
              </div>

              {tax?.annualSavings > 0 && (
                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                  <span>Annual Statutory Savings:</span>
                  <span className="font-bold">₹{tax.annualSavings.toLocaleString("en-IN")}</span>
                </div>
              )}

              {/* 80C Headroom Progress */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Sec 80C Utilization</span>
                  <span className="text-foreground font-medium">
                    ₹{(150000 - (tax?.unutilized80CLimit || 150000)).toLocaleString("en-IN")} / ₹1.5L
                  </span>
                </div>
                <Progress
                  value={((150000 - (tax?.unutilized80CLimit || 150000)) / 150000) * 100}
                  className="h-1.5"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROW 2: MULTI-AGENT ADVISORY STUDIO (CENTERPIECE) */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2.5">
                  <BrainCircuit className="h-5 w-5 text-indigo-400" />
                  Autonomous Multi-Agent Advisory Studio
                </CardTitle>
                <CardDescription className="text-xs">
                  Continuous collaboration between specialized financial agents with zero mathematical hallucinations.
                </CardDescription>
              </div>

              {/* Agent Active Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-medium whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  🕵️ Audit Detective
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-medium whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  ⚖️ Indian Tax Specialist
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  🎯 Wealth Strategist
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 1 Column: Agent Findings & Official References */}
            <div className="space-y-4">
              <Tabs defaultValue="anomalies" className="w-full">
                <TabsList className="w-full grid grid-cols-2 h-8 text-xs">
                  <TabsTrigger value="anomalies" className="text-xs">
                    Auditor Alerts ({audit?.anomalies?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="statutes" className="text-xs">
                    CBDT Citations ({laws.length})
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Detected Anomalies */}
                <TabsContent value="anomalies" className="space-y-2.5 mt-3">
                  {(audit?.anomalies || []).length === 0 ? (
                    <div className="p-4 rounded-lg bg-muted/20 border border-border/30 text-center text-xs text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1.5" />
                      No critical spending leaks or budget breaches detected.
                    </div>
                  ) : (
                    (audit?.anomalies || []).map((anomaly: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-border/40 bg-muted/30 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                            {anomaly.title}
                          </span>
                          <Badge variant="outline" className="text-[10px] py-0 px-1 border-amber-500/30 text-amber-400">
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          {anomaly.description}
                        </p>
                        <div className="text-[11px] text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                          💡 <strong>Action:</strong> {anomaly.actionableStep}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                {/* Tab 2: CBDT Citations */}
                <TabsContent value="statutes" className="space-y-2.5 mt-3">
                  {laws.map((law: any, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-border/40 bg-muted/30 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-foreground">
                        <span className="text-indigo-400">{law.section}</span>
                        <span className="text-[10px] text-muted-foreground">{law.maxLimit}</span>
                      </div>
                      <p className="text-[11px] text-foreground/80 font-medium">{law.title}</p>
                      <p className="text-[10px] text-muted-foreground italic">Ref: {law.officialReference}</p>
                      <div className="text-[10px] text-foreground/70 bg-background/50 p-1.5 rounded mt-1">
                        {law.keyRules[0]}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right 2 Columns: Multi-Agent Consultation Feed */}
            <div className="lg:col-span-2 flex flex-col h-[420px] rounded-xl border border-border/40 bg-background/50 overflow-hidden">
              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1 px-1">
                      {msg.role === "assistant" && (
                        <span className="font-semibold text-indigo-400 flex items-center gap-1">
                          <BrainCircuit className="h-3 w-3" />
                          {msg.agent === "tax" ? "Indian Tax Specialist" : msg.agent === "audit" ? "Audit Detective" : "Lead CA Partner"}
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed text-xs shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted/70 text-foreground border border-border/40 rounded-tl-none whitespace-pre-line"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted/40 animate-pulse">
                    <BrainCircuit className="h-4 w-4 animate-spin text-primary" />
                    <span>Cross-verifying tax slabs & generating synthesized advisory...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 border-t border-border/30 bg-muted/20 flex gap-1.5 overflow-x-auto text-[11px]">
                <button
                  type="button"
                  onClick={() => sendConsultation("Compare Old vs New Tax Regime for my income")}
                  className="px-2.5 py-1 rounded-full bg-background border border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                >
                  ⚖️ Old vs New Regime?
                </button>
                <button
                  type="button"
                  onClick={() => sendConsultation("Where is my money leaking this month?")}
                  className="px-2.5 py-1 rounded-full bg-background border border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                >
                  🕵️ Audit my spending leaks
                </button>
                <button
                  type="button"
                  onClick={() => sendConsultation("How can I maximize Section 80C and NPS deductions?")}
                  className="px-2.5 py-1 rounded-full bg-background border border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                >
                  📜 Maximize 80C & NPS
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendConsultation()
                }}
                className="p-3 border-t border-border/40 bg-background flex items-center gap-2"
              >
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask your Multi-Agent CA team (e.g., 'How can I save tax on ₹15L salary?')..."
                  className="h-10 text-xs border-border/50 focus-visible:ring-primary/30"
                  disabled={chatLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-10 px-4 gap-1.5 text-xs bg-primary hover:bg-primary/90"
                  disabled={chatLoading || !chatInput.trim()}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Consult</span>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* ROW 3: DETAILED BUDGET TRACKER & EXPENSE LOGGER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Category Budget vs Actual Spend */}
          <Card className="lg:col-span-2 border-border/50 bg-card/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <PieIcon className="h-4 w-4 text-primary" />
                    Budget Category Utilization
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Real-time monitoring of monthly category caps against actual outlays.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3.5">
                {(audit?.categoryBreakdown || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    No transactions recorded yet. Use the logger on the right or click "Load Demo Data".
                  </p>
                ) : (
                  (audit?.categoryBreakdown || []).map((cat: any, i: number) => {
                    const pct = cat.budget > 0 ? Math.min(100, Math.round((cat.totalSpent / cat.budget) * 100)) : 0
                    return (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{cat.category}</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] py-0 px-1.5 ${
                                cat.status === "exceeded"
                                  ? "border-destructive/40 text-destructive bg-destructive/10"
                                  : cat.status === "warning"
                                  ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                                  : "border-border text-muted-foreground"
                              }`}
                            >
                              {cat.status === "exceeded" ? "Over Budget" : cat.status === "warning" ? "Near Limit" : "Safe"}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-foreground">
                              ₹{cat.totalSpent.toLocaleString("en-IN")}
                            </span>
                            {cat.budget > 0 && (
                              <span className="text-muted-foreground text-[11px]">
                                {" "}
                                / ₹{cat.budget.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>

                        {cat.budget > 0 && (
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                cat.status === "exceeded"
                                  ? "bg-destructive"
                                  : cat.status === "warning"
                                  ? "bg-amber-400"
                                  : "bg-primary"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right 1 Column: Quick Expense Logger */}
          <Card className="border-border/50 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-emerald-400" />
                Record Transaction
              </CardTitle>
              <CardDescription className="text-xs">
                Classify expenses to keep the Audit Detective and Tax Engine updated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid gap-1.5">
                <Label className="text-xs">Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Rent, Groceries, ELSS Investment"
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs">Amount (₹)</Label>
                <Input
                  type="number"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs">Priority / Discretionary Level</Label>
                <select
                  className="border border-border/50 rounded-md h-9 px-2.5 text-xs bg-background text-foreground"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                >
                  <option value="basic">Basic (Essential / Need)</option>
                  <option value="moderate">Moderate (Standard Lifestyle)</option>
                  <option value="expensive">Luxury / Discretionary (Want)</option>
                </select>
              </div>

              <div className="grid gap-1.5">
                <Label className="text-xs">Description / Notes</Label>
                <Textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Monthly mutual fund SIP or weekend dining"
                  className="h-16 text-xs resize-none"
                />
              </div>

              <Button
                onClick={addExpense}
                disabled={isSubmitting || amount <= 0}
                className="w-full text-xs h-9 bg-primary hover:bg-primary/90 mt-2"
              >
                {isSubmitting ? "Logging..." : "Save Transaction"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
