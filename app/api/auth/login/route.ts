import { NextResponse } from "next/server"
import { getRepo } from "@/lib/repository"
import { setSessionUserId } from "@/lib/auth"
import { createHash } from "crypto"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  }
  const repo = getRepo()
  const user = await repo.getUserByEmail(email)
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  const passwordHash = createHash("sha256").update(password).digest("hex")
  if (passwordHash !== user.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  await setSessionUserId(user.id)
  return NextResponse.json({ ok: true })
}
