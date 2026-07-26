# <p align="center"><img src="public/images/artharalogo.png" alt="Arthara Logo" width="320" /></p>

<p align="center">
  <strong>⚡ Arthara - Premium Behavioral Finance & Decision Support System</strong>
</p>

<p align="center">
  Arthara is a premium <strong>Decision Support System</strong> and behavioral finance platform designed to help users track emotional spending triggers, prevent impulse purchases, scan for money leaks, and build sustainable financial wellbeing.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-v16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-v7.8-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MariaDB-v3.5-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB" />
</p>

---

## ✨ Key Features

* **🎯 AI Pre-Spending Check Simulator:** An interactive decision evaluation engine that prompts users with psychological cooloff advice before impulse purchases occur.
* **🧠 Behavioral Insights Engine:** Deep emotional trigger classification (stress, boredom, social proof) analyzing transaction patterns to provide actionable behavioral guidance.
* **🔍 Money Leak Scanner:** Automated detection system that spots forgotten subscription plans, duplicate debits, and passive stealth expenses.
* **📈 Financial Health Score & Allocation:** Real-time 0–100 financial health metrics paired with smart dynamic budget allocations tailored to personal life goals.
* **🛡️ Strict Mode Guardrails:** Customizable spending limits and strict alert barriers to protect emergency funds and prevent budget overruns.

---

## 📸 Screenshots

<details>
  <summary><b>Lihat Antarmuka Arthara (Klik untuk membuka)</b></summary>
  
  <br>
  
  **1. Single-Page SPA Landing & AI Pre-Spending Simulator**
  <img src="public/images/antarmukaArthara/landing.png" alt="Arthara Landing Page" width="100%">
  <img src="public/images/antarmukaArthara/simulator.png" alt="Arthara AI Simulator" width="100%">

  **2. Smart Dashboard & Financial Health Score**
  <img src="public/images/antarmukaArthara/dashboard.png" alt="Arthara Dashboard" width="100%">
  <img src="public/images/antarmukaArthara/healthscore.png" alt="Arthara Health Score" width="100%">

  **3. Money Leak Scanner & Behavioral Insights**
  <img src="public/images/antarmukaArthara/moneyleak.png" alt="Arthara Money Leak Scanner" width="100%">
  
  **4. Smart Budgeting & Savings Goals**
  <img src="public/images/antarmukaArthara/budgets.png" alt="Arthara Budgets & Goals" width="100%">
  
</details>

---

## 🏗️ Tech Stack

### Client & App Framework (Full-Stack Next.js)
* **Framework:** Next.js 16 (App Router)
* **Library:** React 19 (SPA & SSR)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Icons:** FontAwesome 6 & Lucide React
* **Charts & Analytics:** Recharts
* **Validation:** Zod & React Hook Form

### API & Database (Backend)
* **API Architecture:** Next.js Route Handlers (`/api/*`)
* **ORM:** Prisma ORM v7.8
* **Database Driver:** MariaDB / MySQL (`@prisma/adapter-mariadb`)
* **Authentication:** Token & Cookie-based Authentication

---

## 📂 Project Structure

```text
Arthara - Think Before You Spend/
├── public/                 # Static assets (logos, icons, screenshots)
│   └── images/             # Brand assets (artharalogo.png)
│
├── src/                    # Application Source Code
│   ├── app/                # Next.js App Router Pages and APIs
│   │   ├── (app)/          # Protected App Shell Layout & Sub-pages
│   │   │   ├── budgets/    # Budgeting & category allocation
│   │   │   ├── dashboard/  # Main analytics & financial health score overview
│   │   │   ├── goals/      # Savings goals & priority tracker
│   │   │   ├── money-leak/ # Money Leak Scanner & active subscriptions
│   │   │   ├── reports/    # Financial reports & analytics charts
│   │   │   ├── settings/   # User settings & profile preferences
│   │   │   └── transactions/# Transaction logger with emotion & trigger tags
│   │   │
│   │   ├── (auth)/         # Authentication Routes (Login & Register)
│   │   ├── api/            # Backend REST API Route Handlers
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── budgets/    # Budget management API
│   │   │   ├── dashboard/  # Dashboard metrics aggregation API
│   │   │   ├── goals/      # Goals management API
│   │   │   ├── money-leaks/# Money leak detection API
│   │   │   ├── reports/    # Financial reports API
│   │   │   ├── seed/       # Database seeder endpoint
│   │   │   └── transactions/# Transaction CRUD API
│   │   │
│   │   ├── features/       # Features SPA redirect route
│   │   ├── methodology/    # Methodology SPA redirect route
│   │   ├── onboarding/     # Progressive onboarding wizard
│   │   ├── pricing/        # Pricing SPA redirect route
│   │   ├── globals.css     # Design system tokens & global CSS
│   │   ├── layout.tsx      # Root HTML layout wrapper
│   │   └── page.tsx        # Single-Page SPA Landing Page
│   │
│   ├── components/         # Reusable UI & Feature Components
│   │   ├── budgets/        # Budget modals & progress cards
│   │   ├── dashboard/      # Financial score & overview widgets
│   │   ├── insights/       # Behavioral insights & trigger charts
│   │   ├── layout/         # Centered Navbar & Layout components
│   │   ├── simulator/      # Pre-Spending Check simulator widget
│   │   └── ui/             # Reusable UI primitives
│   │
│   └── lib/                # Utility helpers & Prisma client setup
│
├── prisma/                 # Database Schema & Configuration
│   ├── schema.prisma       # Prisma Database Models
│   └── config.ts           # Prisma adapter configuration
│
├── package.json            # Dependencies and scripts
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Quick Start Guide

### 1. Clone & Setup Workspace

```bash
git clone https://github.com/bahrulwd/Arthara---Think-Before-You-Spend.git
cd "Arthara - Think Before You Spend"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://root:@localhost:3306/arthara"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup Database

Push the Prisma schema to your MariaDB/MySQL database:

```bash
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be accessible locally via Next.js dev server at `http://localhost:3000`.
