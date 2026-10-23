import { cookies } from "next/headers"
import { randomUUID } from "crypto"

const SESSION_COOKIE = "session_user_id"

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const c = cookieStore.get(SESSION_COOKIE)
  return c?.value || null
}

export async function setSessionUserId(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // Only secure in production
    path: "/",
    // 7 days
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function newId() {
  return randomUUID()
}
