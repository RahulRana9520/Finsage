// Sample data for new users to demonstrate the dashboard functionality

export const SAMPLE_INCOME = [
  {
    source: "Software Engineer Salary",
    amount: 80000,
    frequency: "monthly" as const
  },
  {
    source: "Freelance Projects",
    amount: 15000,
    frequency: "monthly" as const
  }
]

export const SAMPLE_BUDGET = [
  { category: "Housing", monthlyAmount: 25000 },
  { category: "Food & Dining", monthlyAmount: 12000 },
  { category: "Transportation", monthlyAmount: 8000 },
  { category: "Utilities", monthlyAmount: 3000 },
  { category: "Entertainment", monthlyAmount: 5000 },
  { category: "Healthcare", monthlyAmount: 4000 },
  { category: "Savings", monthlyAmount: 20000 },
  { category: "Miscellaneous", monthlyAmount: 8000 }
]

export const SAMPLE_EXPENSES = [
  {
    category: "Housing",
    amount: 25000,
    date: new Date().toISOString().slice(0, 10),
    description: "Monthly rent",
    level: "basic" as const
  },
  {
    category: "Food & Dining",
    amount: 8500,
    date: new Date().toISOString().slice(0, 10),
    description: "Groceries and dining out",
    level: "moderate" as const
  },
  {
    category: "Transportation",
    amount: 6200,
    date: new Date().toISOString().slice(0, 10),
    description: "Fuel and maintenance",
    level: "basic" as const
  },
  {
    category: "Utilities",
    amount: 2800,
    date: new Date().toISOString().slice(0, 10),
    description: "Electricity, water, internet",
    level: "basic" as const
  }
]

export const SAMPLE_GOALS = [
  {
    name: "Emergency Fund",
    targetAmount: 500000,
    targetDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  },
  {
    name: "Buy a Car",
    targetAmount: 800000,
    targetDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  },
  {
    name: "Home Down Payment",
    targetAmount: 2000000,
    targetDate: new Date(Date.now() + 60 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  }
]
