type Frequency = "monthly" | "weekly" | "yearly" | "one-time"

export type User = {
  id: string
  email: string
  passwordHash: string // demo only - don't store plaintext
  name?: string
  createdAt: string
}

export type UserProfile = {
  userId: string
  fullName: string
  age?: number
  location?: string
  dependents?: number
  filingStatus?: "single" | "married" | "huf" | "other"
}

export type IncomeEntry = {
  id: string
  userId: string
  source: string
  amount: number
  frequency: Frequency
}

export type ExpenseEntry = {
  id: string
  userId: string
  category: string
  amount: number
  date: string // ISO
  description?: string
  level?: "expensive" | "moderate" | "basic"
}

export type BudgetAllocation = {
  id: string
  userId: string
  category: string
  monthlyAmount: number
}

export type Goal = {
  id: string
  userId: string
  name: string
  targetAmount: number
  targetDate: string // ISO
}

export interface CARepository {
  // auth
  getUserByEmail(email: string): Promise<User | null>
  createUser(user: User): Promise<void>

  // profile & financials
  upsertProfile(profile: UserProfile): Promise<void>
  getProfile(userId: string): Promise<UserProfile | null>

  addIncome(entry: IncomeEntry): Promise<void>
  listIncome(userId: string): Promise<IncomeEntry[]>

  addExpense(entry: ExpenseEntry): Promise<void>
  listExpenses(userId: string, monthISO?: string): Promise<ExpenseEntry[]>

  setBudget(userId: string, allocations: BudgetAllocation[]): Promise<void>
  getBudget(userId: string): Promise<BudgetAllocation[]>

  setGoals(userId: string, goals: Goal[]): Promise<void>
  getGoals(userId: string): Promise<Goal[]>
}

import { getFileStorage } from './file-storage'

// File-based storage for persistence (replacement for in-memory)
class FileBasedRepo implements CARepository {
  private storage = getFileStorage()

  async getUserByEmail(email: string): Promise<User | null> {
    return this.storage.getUserByEmail(email)
  }
  
  async createUser(user: User): Promise<void> {
    this.storage.setUser(user)
  }

  async upsertProfile(profile: UserProfile): Promise<void> {
    this.storage.setProfile(profile)
  }
  
  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.storage.getProfile(userId) || null
  }

  async addIncome(entry: IncomeEntry): Promise<void> {
    this.storage.addIncome(entry)
  }
  
  async listIncome(userId: string): Promise<IncomeEntry[]> {
    return this.storage.getIncome(userId)
  }

  async addExpense(entry: ExpenseEntry): Promise<void> {
    this.storage.addExpense(entry)
  }
  
  async listExpenses(userId: string, monthISO?: string): Promise<ExpenseEntry[]> {
    const expenses = this.storage.getExpenses(userId)
    if (!monthISO) return expenses
    const [y, m] = monthISO.split("-").map((s) => Number.parseInt(s))
    return expenses.filter((e) => {
      const d = new Date(e.date)
      return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m
    })
  }

  async setBudget(userId: string, allocations: BudgetAllocation[]): Promise<void> {
    this.storage.setBudget(userId, allocations)
  }
  
  async getBudget(userId: string): Promise<BudgetAllocation[]> {
    return this.storage.getBudget(userId)
  }

  async setGoals(userId: string, goals: Goal[]): Promise<void> {
    this.storage.setGoals(userId, goals)
  }
  
  async getGoals(userId: string): Promise<Goal[]> {
    return this.storage.getGoals(userId)
  }
}

// In-memory singleton (demo)
const mem = {
  users: new Map<string, User>(),
  usersByEmail: new Map<string, string>(),
  profiles: new Map<string, UserProfile>(),
  income: new Map<string, IncomeEntry[]>(),
  expenses: new Map<string, ExpenseEntry[]>(),
  budgets: new Map<string, BudgetAllocation[]>(),
  goals: new Map<string, Goal[]>(),
}

class InMemoryRepo implements CARepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const id = mem.usersByEmail.get(email)
    if (!id) return null
    return mem.users.get(id) || null
  }
  async createUser(user: User): Promise<void> {
    mem.users.set(user.id, user)
    mem.usersByEmail.set(user.email, user.id)
  }

  async upsertProfile(profile: UserProfile): Promise<void> {
    mem.profiles.set(profile.userId, profile)
  }
  async getProfile(userId: string): Promise<UserProfile | null> {
    return mem.profiles.get(userId) || null
  }

  async addIncome(entry: IncomeEntry): Promise<void> {
    const arr = mem.income.get(entry.userId) || []
    arr.push(entry)
    mem.income.set(entry.userId, arr)
  }
  async listIncome(userId: string): Promise<IncomeEntry[]> {
    return mem.income.get(userId) || []
  }

  async addExpense(entry: ExpenseEntry): Promise<void> {
    const arr = mem.expenses.get(entry.userId) || []
    arr.push(entry)
    mem.expenses.set(entry.userId, arr)
  }
  async listExpenses(userId: string, monthISO?: string): Promise<ExpenseEntry[]> {
    const arr = mem.expenses.get(userId) || []
    if (!monthISO) return arr
    const [y, m] = monthISO.split("-").map((s) => Number.parseInt(s))
    return arr.filter((e) => {
      const d = new Date(e.date)
      return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m
    })
  }

  async setBudget(userId: string, allocations: BudgetAllocation[]): Promise<void> {
    mem.budgets.set(userId, allocations)
  }
  async getBudget(userId: string): Promise<BudgetAllocation[]> {
    return mem.budgets.get(userId) || []
  }

  async setGoals(userId: string, goals: Goal[]): Promise<void> {
    mem.goals.set(userId, goals)
  }
  async getGoals(userId: string): Promise<Goal[]> {
    return mem.goals.get(userId) || []
  }
}

// Oracle ORDS placeholder adapter
class OracleORDSRepo implements CARepository {
  private base = process.env.ORACLE_ORDS_BASE_URL
  private schema = process.env.ORACLE_ORDS_SCHEMA
  private auth = process.env.ORACLE_ORDS_AUTH // e.g., "Basic abc..." or "Bearer xyz"

  private get headers() {
    return {
      "Content-Type": "application/json",
      ...(this.auth ? { Authorization: this.auth } : {}),
    }
  }

  private ensureConfigured() {
    if (!this.base || !this.schema) {
      throw new Error("Oracle ORDS not configured. Set ORACLE_ORDS_BASE_URL and ORACLE_ORDS_SCHEMA.")
    }
  }

  // NOTE: You must expose REST endpoints via ORDS mapped to tables. The paths used below are examples.
  async getUserByEmail(email: string): Promise<User | null> {
    this.ensureConfigured()
    const res = await fetch(`${this.base}/${this.schema}/users?email=${encodeURIComponent(email)}`, {
      headers: this.headers,
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0] || null
  }

  async createUser(user: User): Promise<void> {
    this.ensureConfigured()
    await fetch(`${this.base}/${this.schema}/users`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(user),
    })
  }

  async upsertProfile(profile: UserProfile): Promise<void> {
    this.ensureConfigured()
    await fetch(`${this.base}/${this.schema}/profiles`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(profile),
    })
  }
  async getProfile(userId: string): Promise<UserProfile | null> {
    this.ensureConfigured()
    const res = await fetch(`${this.base}/${this.schema}/profiles/${encodeURIComponent(userId)}`, {
      headers: this.headers,
    })
    if (!res.ok) return null
    return await res.json()
  }

  async addIncome(entry: IncomeEntry): Promise<void> {
    this.ensureConfigured()
    await fetch(`${this.base}/${this.schema}/income`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(entry),
    })
  }
  async listIncome(userId: string): Promise<IncomeEntry[]> {
    this.ensureConfigured()
    const res = await fetch(`${this.base}/${this.schema}/income?userId=${encodeURIComponent(userId)}`, {
      headers: this.headers,
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  }

  async addExpense(entry: ExpenseEntry): Promise<void> {
    this.ensureConfigured()
    await fetch(`${this.base}/${this.schema}/expenses`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(entry),
    })
  }
  async listExpenses(userId: string, monthISO?: string): Promise<ExpenseEntry[]> {
    this.ensureConfigured()
    const params = new URLSearchParams({ userId })
    if (monthISO) params.set("month", monthISO)
    const res = await fetch(`${this.base}/${this.schema}/expenses?${params.toString()}`, { headers: this.headers })
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  }

  async setBudget(userId: string, allocations: BudgetAllocation[]): Promise<void> {
    this.ensureConfigured()
    await fetch(`${this.base}/${this.schema}/budgets/${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify({ userId, allocations }),
    })
  }
  async getBudget(userId: string): Promise<BudgetAllocation[]> {
    this.ensureConfigured()
    const res = await fetch(`${this.base}/${this.schema}/budgets/${encodeURIComponent(userId)}`, {
      headers: this.headers,
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.allocations || []
  }

  async setGoals(userId: string, goals: Goal[]): Promise<void> {
    this.ensureConfigured()
    await fetch(`${this.base}/${this.schema}/goals/${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify({ userId, goals }),
    })
  }
  async getGoals(userId: string): Promise<Goal[]> {
    this.ensureConfigured()
    const res = await fetch(`${this.base}/${this.schema}/goals/${encodeURIComponent(userId)}`, {
      headers: this.headers,
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.goals || []
  }
}

let _repo: CARepository | null = null
export function getRepo(): CARepository {
  if (_repo) return _repo
  if (process.env.ORACLE_ORDS_BASE_URL && process.env.ORACLE_ORDS_SCHEMA) {
    console.log("🔗 Using Oracle ORDS Repository")
    _repo = new OracleORDSRepo()
  } else {
    console.log("� Using File-Based Repository (Persistent)")
    _repo = new FileBasedRepo()
  }
  return _repo
}
