"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function OnboardingPage() {
  const router = useRouter()
  const { data: me } = useSWR("/api/me", fetcher)
  const [step, setStep] = useState(1)

  // Profile
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState<number | undefined>()
  const [location, setLocation] = useState("")
  const [dependents, setDependents] = useState<number | undefined>()
  const [filingStatus, setFilingStatus] = useState<"single" | "married" | "huf" | "other">("single")

  // Income
  const [incomes, setIncomes] = useState<
    { source: string; amount: number; frequency: "monthly" | "weekly" | "yearly" }[]
  >([{ source: "Salary", amount: 0, frequency: "monthly" }])

  // Budget
  const [budget, setBudget] = useState<{ category: string; monthlyAmount: number }[]>([
    { category: "housing", monthlyAmount: 0 },
    { category: "food", monthlyAmount: 0 },
    { category: "transport", monthlyAmount: 0 },
    { category: "entertainment", monthlyAmount: 0 },
    { category: "investments", monthlyAmount: 0 },
  ])

  // Goals
  const [goals, setGoals] = useState<{ name: string; targetAmount: number; targetDate: string }[]>([
    {
      name: "Buy a car",
      targetAmount: 1500000,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  ])

  useEffect(() => {
    if (me?.user?.name) setFullName(me.user.name)
  }, [me])

  async function saveProfile() {
    await fetch("/api/data/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, age, location, dependents, filingStatus }),
    })
    setStep(2)
  }

  async function saveIncome() {
    await fetch("/api/data/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incomes),
    })
    setStep(3)
  }

  async function saveBudget() {
    await fetch("/api/data/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(budget),
    })
    setStep(4)
  }

  async function saveGoals() {
    await fetch("/api/data/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goals),
    })
    router.push("/dashboard")
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-balance">Set up your CA Advisor</CardTitle>
          <CardDescription>Step {step} of 4</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {step === 1 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Full name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={age ?? ""}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Dependents</Label>
                  <Input
                    type="number"
                    value={dependents ?? ""}
                    onChange={(e) => setDependents(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Filing Status</Label>
                <select
                  className="border rounded h-10 px-3"
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as any)}
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="huf">HUF</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button onClick={saveProfile}>Continue</Button>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              {incomes.map((inc, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-4 items-end">
                  <div className="grid gap-2">
                    <Label>Source</Label>
                    <Input
                      value={inc.source}
                      onChange={(e) => {
                        const c = [...incomes]
                        c[idx].source = e.target.value
                        setIncomes(c)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={inc.amount}
                      onChange={(e) => {
                        const c = [...incomes]
                        c[idx].amount = Number(e.target.value)
                        setIncomes(c)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Frequency</Label>
                    <select
                      className="border rounded h-10 px-3"
                      value={inc.frequency}
                      onChange={(e) => {
                        const c = [...incomes]
                        c[idx].frequency = e.target.value as any
                        setIncomes(c)
                      }}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIncomes([...incomes, { source: "", amount: 0, frequency: "monthly" }])}
                >
                  Add income
                </Button>
                <Button onClick={saveIncome}>Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              {budget.map((b, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Input
                      value={b.category}
                      onChange={(e) => {
                        const c = [...budget]
                        c[idx].category = e.target.value
                        setBudget(c)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Monthly Amount</Label>
                    <Input
                      type="number"
                      value={b.monthlyAmount}
                      onChange={(e) => {
                        const c = [...budget]
                        c[idx].monthlyAmount = Number(e.target.value)
                        setBudget(c)
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setBudget([...budget, { category: "", monthlyAmount: 0 }])}>
                  Add category
                </Button>
                <Button onClick={saveBudget}>Continue</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4">
              {goals.map((g, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Goal</Label>
                    <Input
                      value={g.name}
                      onChange={(e) => {
                        const c = [...goals]
                        c[idx].name = e.target.value
                        setGoals(c)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Target Amount (₹)</Label>
                    <Input
                      type="number"
                      value={g.targetAmount}
                      onChange={(e) => {
                        const c = [...goals]
                        c[idx].targetAmount = Number(e.target.value)
                        setGoals(c)
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Target Date</Label>
                    <Input
                      type="date"
                      value={g.targetDate}
                      onChange={(e) => {
                        const c = [...goals]
                        c[idx].targetDate = e.target.value
                        setGoals(c)
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setGoals([
                      ...goals,
                      { name: "", targetAmount: 0, targetDate: new Date().toISOString().slice(0, 10) },
                    ])
                  }
                >
                  Add goal
                </Button>
                <Button onClick={saveGoals}>Finish</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
