import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

// On Vercel serverless, process.cwd() is read-only. We use /tmp or memory safely.
const DATA_FILE = process.env.VERCEL
  ? join(tmpdir(), 'ca_data.json')
  : join(process.cwd(), 'data.json')

interface StorageData {
  users: Record<string, any>
  usersByEmail: Record<string, string>
  profiles: Record<string, any>
  income: Record<string, any[]>
  expenses: Record<string, any[]>
  budgets: Record<string, any[]>
  goals: Record<string, any[]>
}

let memData: StorageData = {
  users: {},
  usersByEmail: {},
  profiles: {},
  income: {},
  expenses: {},
  budgets: {},
  goals: {},
}

// Load data from file on startup (with seed fallback from process.cwd() if on Vercel)
function loadData(): StorageData {
  try {
    if (existsSync(DATA_FILE)) {
      const fileData = readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(fileData)
    } else if (process.env.VERCEL && existsSync(join(process.cwd(), 'data.json'))) {
      const seedData = readFileSync(join(process.cwd(), 'data.json'), 'utf8')
      return JSON.parse(seedData)
    }
  } catch (error) {
    console.error('Error loading data file:', error)
  }
  return memData
}

// Save data safely without crashing if filesystem is restricted
function saveData(data: StorageData) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.warn('Filesystem write notice (using in-memory persistence):', error)
  }
}

// Initialize data
memData = loadData()

export function getFileStorage() {
  return {
    get: () => memData,
    save: () => saveData(memData),
    
    // User operations
    getUser: (id: string) => memData.users[id],
    getUserByEmail: (email: string) => {
      const userId = memData.usersByEmail[email]
      return userId ? memData.users[userId] : null
    },
    setUser: (user: any) => {
      memData.users[user.id] = user
      memData.usersByEmail[user.email] = user.id
      saveData(memData)
    },
    
    // Profile operations
    getProfile: (userId: string) => memData.profiles[userId],
    setProfile: (profile: any) => {
      memData.profiles[profile.userId] = profile
      saveData(memData)
    },
    
    // Income operations
    getIncome: (userId: string) => memData.income[userId] || [],
    addIncome: (entry: any) => {
      if (!memData.income[entry.userId]) memData.income[entry.userId] = []
      memData.income[entry.userId].push(entry)
      saveData(memData)
    },
    
    // Expense operations
    getExpenses: (userId: string) => memData.expenses[userId] || [],
    addExpense: (entry: any) => {
      if (!memData.expenses[entry.userId]) memData.expenses[entry.userId] = []
      memData.expenses[entry.userId].push(entry)
      saveData(memData)
    },
    
    // Budget operations
    getBudget: (userId: string) => memData.budgets[userId] || [],
    setBudget: (userId: string, allocations: any[]) => {
      memData.budgets[userId] = allocations
      saveData(memData)
    },
    
    // Goals operations
    getGoals: (userId: string) => memData.goals[userId] || [],
    setGoals: (userId: string, goals: any[]) => {
      memData.goals[userId] = goals
      saveData(memData)
    },
  }
}
