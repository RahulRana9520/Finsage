import { NextResponse } from "next/server"
import { getRepo } from "@/lib/repository"
import { newId, setSessionUserId } from "@/lib/auth"
import { createHash } from "crypto"

export async function POST(req: Request) {
  const { email, password, name } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  }
  const repo = getRepo()
  const existing = await repo.getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 })
  }
  const id = newId()
  const passwordHash = createHash("sha256").update(password).digest("hex")
  await repo.createUser({ id, email, passwordHash, name, createdAt: new Date().toISOString() })
  await setSessionUserId(id)
  return NextResponse.json({ ok: true })
}
