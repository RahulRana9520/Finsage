"use client"

import { useChat } from "ai/react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  const headerPills = useMemo(
    () => [
      { label: "Token", value: "••••••", color: "text-primary" },
      { label: "Security", value: "Active", color: "text-accent" },
      { label: "Status", value: "Stable", color: "text-destructive" },
    ],
    [],
  )

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 ring-1 ring-primary/30" />
          <h1 className="text-pretty text-xl font-semibold text-foreground">CA Chat</h1>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {headerPills.map((p) => (
            <span
              key={p.label}
              className={cn("pill", "flex items-center gap-2 bg-white/5 text-foreground/90")}
              aria-label={p.label}
            >
              <span className="text-foreground/60">{p.label}:</span>
              <span className={cn(p.color, "font-medium")}>{p.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="grid gap-6 md:grid-cols-[1fr_340px]">
        {/* Chat panel */}
        <GlassPanel className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground/95">Your Chartered Accountant</h2>
            <Button
              variant="secondary"
              className="bg-primary/15 text-foreground hover:bg-primary/25"
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
              }}
            >
              Jump to latest
            </Button>
          </div>

          <div className="glass relative mb-4 max-h-[60vh] overflow-y-auto bg-white/2 p-3 md:p-4">
            <ul className="space-y-4">
              {messages.length === 0 && (
                <li className="text-sm text-foreground/70">
                  Ask me about budgeting, tax-saving options (80C, 80D, HRA/LTA), or plan a big purchase like a car.
                  I'll tailor guidance and give compliance notes.
                </li>
              )}
              {messages.map((m) => (
                <li key={m.id} className="flex gap-3">
                  <div
                    className={cn(
                      "h-6 w-6 shrink-0 rounded-md",
                      m.role === "user" ? "bg-accent/25 ring-1 ring-accent/40" : "bg-primary/25 ring-1 ring-primary/40",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wide text-foreground/60">
                      {m.role === "user" ? "You" : "CA Advisor"}
                    </div>
                    <div className="prose prose-invert mt-1 max-w-none text-pretty text-sm leading-6 text-foreground/95">
                      {m.content}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 rounded-xl border border-border/70 bg-white/5 p-2 backdrop-blur md:p-3"
          >
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="e.g., My monthly income is ₹75,000, rent ₹15,000, SIP ₹5,000. Help me plan for a ₹6L car in 12 months."
              className="min-h-12 w-full resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-foreground/40"
              rows={3}
              aria-label="Type your financial question"
            />
            <Button
              type="submit"
              disabled={isLoading || input.trim().length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Thinking…" : "Ask CA"}
            </Button>
          </form>
        </GlassPanel>

        {/* Sidebar */}
        <div className="space-y-6">
          <GlassPanel className="p-4 md:p-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground/90">Spending Signals</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-foreground/70">Entertainment cap</span>
                <span className="text-destructive font-semibold">₹2,500</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-foreground/70">Dining cap</span>
                <span className="text-destructive font-semibold">₹3,000</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-foreground/70">Savings target</span>
                <span className="text-accent font-semibold">₹15,000</span>
              </li>
            </ul>
          </GlassPanel>

          <GlassPanel className="p-4 md:p-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground/90">Quick Prompts</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Compare old vs new regime for ₹12L salary",
                "Set category caps for ₹75k income",
                "Plan: buy a ₹6L car in 12 months",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    const el = document.querySelector("textarea")
                    if (el) {
                      ;(el as HTMLTextAreaElement).value = q
                      el.dispatchEvent(new Event("input", { bubbles: true }))
                    }
                  }}
                  className="pill hover:bg-white/10"
                >
                  {q}
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </main>
  )
}
