import { NextResponse } from "next/server"
import { getRepo } from "@/lib/repository"
import { getSessionUserId } from "@/lib/auth"

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ user: null }, { status: 200 })
  const repo = getRepo()
  // fetch any data you want to show on client
  const profile = await repo.getProfile(userId)
  const budget = await repo.getBudget(userId)
  const goals = await repo.getGoals(userId)
  const income = await repo.listIncome(userId)
  return NextResponse.json({ user: { id: userId, name: profile?.fullName }, profile, budget, goals, income })
}
