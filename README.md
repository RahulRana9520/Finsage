# FinSage — Autonomous Multi-Agent Financial & Tax Management System

A production-grade personal finance, cash flow audit, and Indian tax optimization platform built with **Next.js 15, React 19, TypeScript**, and an autonomous **Multi-Agent Architecture** grounded in official Central Board of Direct Taxes (CBDT) circulars and statutory tax laws.

---

## 🌟 Key Innovations & Architecture

### 1. Zero-Hallucination Hybrid Tax Architecture
Unlike naive AI apps that prompt LLMs to calculate tax math (which frequently produces arithmetic errors and outdated fiscal year rules), this system decouples computation from explanation:
- **Tier 1 (Deterministic Indian Tax Engine - `lib/tax-engine.ts`):** High-precision TypeScript engine computing Old vs. New Tax Regime (Section 115BAC), Section 87A rebates, standard deductions (₹75k New / ₹50k Old), Section 80C (₹1.5L cap), 80CCD(1B) NPS (₹50k), Section 80D, and 4% Health & Education Cess.
- **Tier 2 (Official CBDT Knowledge Retrieval - `lib/tax-knowledge.ts`):** Curated statutory rules and circular citations (Finance Act 2024, CBDT Explanatory Notes) retrieved based on the taxpayer profile.
- **Tier 3 (Synthesizer Agent - `app/api/agent-advisory/route.ts`):** Synthesizes verified math and legal citations into plain-language actionable advice.

### 2. Specialized Multi-Agent Team
1. **🕵️ Audit Detective Agent (`lib/audit-engine.ts`):** Evaluates spending against the 50/30/20 benchmark (Needs, Wants, Savings), detects negative cash flow, and flags discretionary expenditure leaks.
2. **⚖️ Indian Tax Specialist Agent:** Runs side-by-side tax simulations and identifies unutilized Section 80C and Section 80CCD(1B) headroom before the financial year ends.
3. **🎯 Wealth & Goal Strategist Agent:** Audits emergency fund adequacy and forecasts goal milestone feasibility.
4. **🧠 Lead Synthesizer Partner:** Resolves conflicting priorities and delivers a prioritized action checklist with official statutory citations.

### 3. Vercel Serverless Ready
- **Sub-Second Latency:** Deterministic tax calculations and anomaly detection execute in `< 5ms`, avoiding Vercel 10s serverless timeout bottlenecks.
- **Filesystem Safety:** Storage layer uses serverless-compatible `/tmp` and in-memory fallbacks, eliminating `EROFS` read-only errors on Vercel deployments.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19, TypeScript, Tailwind CSS, Radix UI Primitives
- **Data Fetching:** SWR (Stale-While-Revalidate with optimistic revalidation)
- **Visuals & Charts:** Recharts
- **AI & LLM:** OpenRouter / OpenAI API integration with deterministic guardrails
- **Database Layer:** Oracle ORDS support with automatic persistent fallback

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment (`.env.local`)
```env
# Optional: OpenRouter / OpenAI API Key for synthesized conversational responses
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=deepseek/deepseek-chat

# Optional: Oracle ORDS Database (falls back to local persistent store automatically)
# ORACLE_ORDS_BASE_URL=https://your-oracle-instance.com
# ORACLE_ORDS_SCHEMA=your_schema_name
```

*(Note: If no API key is provided, the Multi-Agent Studio automatically falls back to instant deterministic evaluation mode with zero errors).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production / Vercel
```bash
npm run build
npm start
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Under **Environment Variables**, optionally add:
   - `OPENROUTER_API_KEY` (or `OPENAI_API_KEY`)
   - `OPENROUTER_MODEL`
4. Deploy! The project builds cleanly with zero configuration needed.

---

## 📜 License
MIT
