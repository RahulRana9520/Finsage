// Curated Indian Tax Law & CBDT Circulars Knowledge Base
// Grounded in official publications from the Central Board of Direct Taxes (CBDT) and Income Tax Act 1961

export interface TaxKnowledgeItem {
  id: string
  section: string
  title: string
  officialReference: string
  category: "deduction" | "exemption" | "regime" | "rebate" | "capital-gains"
  maxLimit: string
  eligibility: string
  keyRules: string[]
  eligibleInstruments?: string[]
}

export const INDIAN_TAX_KNOWLEDGE_BASE: TaxKnowledgeItem[] = [
  {
    id: "sec-80c",
    section: "Section 80C",
    title: "Deduction for Specified Investments and Expenses",
    officialReference: "Income Tax Act 1961, Sec 80C; CBDT Circular No. 04/2023",
    category: "deduction",
    maxLimit: "₹1,50,000 per financial year (combined with 80CCC and 80CCD(1))",
    eligibility: "Available only under the OLD Tax Regime to Individuals and HUFs.",
    keyRules: [
      "Aggregate deduction under Section 80C, 80CCC, and 80CCD(1) is strictly capped at ₹1,50,000.",
      "Lock-in periods vary: ELSS Mutual Funds (3 years - shortest), PPF (15 years), Tax Saving FD (5 years).",
      "Principal repayment of residential housing loan qualifies, provided the property is not sold within 5 years.",
      "Tuition fees for full-time education of up to 2 children qualify (excluding donations or development fees)."
    ],
    eligibleInstruments: [
      "Employee Provident Fund (EPF) / Voluntary PF",
      "Public Provident Fund (PPF)",
      "Equity Linked Savings Scheme (ELSS)",
      "Life Insurance Premium (LIC)",
      "National Savings Certificate (NSC)",
      "Sukanya Samriddhi Yojana (SSY)",
      "Home Loan Principal Repayment",
      "Tuition Fees (up to 2 children)"
    ]
  },
  {
    id: "sec-80ccd1b",
    section: "Section 80CCD(1B)",
    title: "Additional Deduction for National Pension System (NPS)",
    officialReference: "Finance Act 2015; PFRDA / CBDT Notification No. 42/2016",
    category: "deduction",
    maxLimit: "₹50,000 per financial year",
    eligibility: "Available to any individual contributing to NPS Tier-1 account (Old Regime).",
    keyRules: [
      "This is an EXCLUSIVE deduction over and above the ₹1,50,000 ceiling of Section 80C.",
      "Combining 80C (₹1.5L) + 80CCD(1B) (₹50k) allows total tax-deductible investment of ₹2,00,000.",
      "Only contributions to NPS Tier-1 qualify (Tier-2 does not qualify for general non-government subscribers).",
      "Partial withdrawals up to 25% of own contributions are tax-exempt for specific emergencies."
    ],
    eligibleInstruments: ["National Pension System (NPS) Tier-1 account", "Atal Pension Yojana (APY)"]
  },
  {
    id: "sec-80d",
    section: "Section 80D",
    title: "Deduction for Health Insurance Premiums",
    officialReference: "Income Tax Act 1961, Sec 80D; CBDT Explanatory Notes on Finance Act 2018",
    category: "deduction",
    maxLimit: "Up to ₹1,00,000 (₹25k self/family + ₹50k senior citizen parents)",
    eligibility: "Individuals and HUFs under Old Tax Regime.",
    keyRules: [
      "Self, spouse, and dependent children: Max ₹25,000 (or ₹50,000 if self/spouse is a Senior Citizen aged 60+).",
      "Parents below 60 years: Additional ₹25,000 deduction.",
      "Senior Citizen Parents (aged 60+): Additional ₹50,000 deduction.",
      "Includes Preventive Health Check-up up to ₹5,000 within the overall limits.",
      "Cash payments for insurance premium are NOT eligible; payment must be made via banking/digital modes. (Preventive check-up allowed in cash)."
    ],
    eligibleInstruments: ["Mediclaim Policies", "Critical Illness Riders", "CGHS / Central Govt Health Plans"]
  },
  {
    id: "sec-10-13a",
    section: "Section 10(13A)",
    title: "House Rent Allowance (HRA) Exemption",
    officialReference: "Income Tax Rules 1962, Rule 2A; CBDT Master Circular on Salary TDS",
    category: "exemption",
    maxLimit: "Least of 3 calculations (exempt from salary)",
    eligibility: "Salaried employees paying rent for residential accommodation who receive HRA from employer.",
    keyRules: [
      "Exemption is strictly the LEAST of:",
      "1. Actual HRA received from employer.",
      "2. Rent paid in excess of 10% of (Basic Salary + DA).",
      "3. 50% of (Basic Salary + DA) for Metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% for Non-Metro.",
      "Rent paid exceeding ₹1,00,000 annually requires landlord's PAN to be submitted to employer.",
      "Cannot be claimed if you own the accommodation and reside in it."
    ]
  },
  {
    id: "sec-24b",
    section: "Section 24(b)",
    title: "Deduction for Interest on Housing Loan",
    officialReference: "Income Tax Act 1961, Sec 24(b); CBDT Circular No. 1/2021",
    category: "deduction",
    maxLimit: "₹2,00,000 for self-occupied residential property",
    eligibility: "Individuals under Old Tax Regime possessing home loans for acquisition/construction.",
    keyRules: [
      "Interest on loan taken for acquisition/construction of self-occupied property is deductible up to ₹2,00,000.",
      "Construction must be completed within 5 years from the end of the financial year in which the loan was borrowed.",
      "Pre-construction interest can be claimed in 5 equal annual installments starting from the year construction completes.",
      "Principal portion of the loan is separately deductible under Section 80C."
    ]
  },
  {
    id: "sec-87a",
    section: "Section 87A",
    title: "Tax Rebate for Resident Individuals",
    officialReference: "Finance Act 2023 & Finance (No. 2) Act 2024",
    category: "rebate",
    maxLimit: "₹25,000 (New Regime) / ₹12,500 (Old Regime)",
    eligibility: "Resident individuals having total taxable income within the threshold.",
    keyRules: [
      "Under NEW Regime: Rebate of 100% of income tax payable or ₹25,000 (whichever is lower) if taxable income does not exceed ₹7,00,000.",
      "This effectively makes income up to ₹7.75 Lakhs (₹7L + ₹75k Standard Deduction) completely TAX-FREE under the New Regime.",
      "Under OLD Regime: Rebate of up to ₹12,500 if taxable income does not exceed ₹5,00,000 (effectively zero tax up to ₹5.5 Lakhs with standard deduction)."
    ]
  },
  {
    id: "sec-115bac",
    section: "Section 115BAC",
    title: "Default Concessional Tax Regime (New Tax Regime)",
    officialReference: "Finance Act 2023 & Finance Act 2024 amendments",
    category: "regime",
    maxLimit: "Lower slab rates across income brackets",
    eligibility: "Default regime for all individual taxpayers unless opted out by filing Form 10-IEA.",
    keyRules: [
      "Standard Deduction for salaried individuals is enhanced to ₹75,000 (from ₹50,000 previously).",
      "Family pension standard deduction is increased to ₹25,000.",
      "Slabs: 0-3L (Nil), 3L-7L (5%), 7L-10L (10%), 10L-12L (15%), 12L-15L (20%), Above 15L (30%).",
      "Deductions under 80C, 80D, 80CCD(1B), and HRA are NOT permitted under this regime.",
      "Salaried individuals can switch between Old and New regimes every financial year at the time of ITR filing."
    ]
  }
]

/**
 * Fast keyword search across curated official tax knowledge
 */
export function searchTaxKnowledge(query: string, maxResults: number = 3): TaxKnowledgeItem[] {
  const q = query.toLowerCase()
  const terms = q.split(/\s+/).filter(t => t.length > 2)

  const scored = INDIAN_TAX_KNOWLEDGE_BASE.map(item => {
    let score = 0
    const fullText = `${item.section} ${item.title} ${item.category} ${item.keyRules.join(" ")} ${item.eligibleInstruments?.join(" ") || ""}`.toLowerCase()

    if (fullText.includes(q)) score += 10
    for (const term of terms) {
      if (item.section.toLowerCase().includes(term)) score += 8
      if (item.title.toLowerCase().includes(term)) score += 5
      if (fullText.includes(term)) score += 2
    }

    return { item, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.item)
}
