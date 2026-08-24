# Sahyog (सहयोग)
> **Connecting Cooperative Skills with Everyday Needs**

A cooperative-owned digital service marketplace platform designed to connect skilled workers registered with **Labour Cooperative Federations** and **Labour Cooperative Societies** (electricians, plumbers, carpenters, painters, cleaners, caregivers, drivers, gardeners, appliance technicians) with households, businesses, institutions, and communities.

---

## 🌟 Overview & Key Principles

- **Cooperative Ownership**: Built for Labour Cooperative Federations to digitally organize and mobilize skilled workers without intermediary commission extraction.
- **Fair Wage & Economic Architecture**: **88%** of booking value goes directly to the worker, **7%** into the Member Cooperative Welfare & Accident Fund, and **5%** for platform digital maintenance.
- **Monochrome-First Design System**: Black, white, and neutral greys (`#111111`, `#FFFFFF`, `#F8F8F8`, `#F3F3F3`, `#E5E5E5`) with restrained functional state colors (`#16A34A`, `#D97706`, `#DC2626`, `#2563EB`).
- **Deterministic Worker Matching**: Formula-based ranking:
  $$\text{Total Score} = 40\% \text{ Skill} + 30\% \text{ Proximity} + 20\% \text{ Availability} + 10\% \text{ Workload}$$
- **PostGIS Geographic Engine**: Spatial querying with Leaflet and OpenStreetMap for low-cost, zero-API-billing hackathon execution.
- **Multilingual (i18n)**: Out-of-the-box English and Hindi with instant navbar toggle.

---

## 🚀 Quick Start & Development

### 1. Prerequisites
- Node.js v20+ or v22+ (LTS)
- npm or yarn

### 2. Installation
```bash
# Navigate to project directory
cd Projects/Sahyog

# Install dependencies
npm install

# Run automated tests
npm run test

# Run TypeScript type check
npm run typecheck

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Accounts & Hackathon Role Switcher

Use the **floating "Demo Mode" switcher** in the top navbar to instantly test the end-to-end lifecycle across all 5 user roles without manual database logins:

| Role | Demo User | Trade / Specialization | Access Route |
|---|---|---|---|
| **CUSTOMER** | Aarav Sharma | Household Resident (Sector 62, Noida) | `/customer` |
| **WORKER** | Ramesh Kumar Verma | Master Plumber (NSDC Certified) | `/worker` |
| **SOCIETY_ADMIN** | Sunita Deshmukh | Noida Shramik Utthan Labour Society | `/admin` |
| **FEDERATION_ADMIN** | Dr. Rajeshwar Patil | NCR Labour Cooperative Federation | `/admin/analytics` |
| **SUPER_ADMIN** | System Administrator | Platform Operations & By-Laws | `/admin` |

---

## 🛠️ Complete 16-Step Hackathon Demo Flow

1. Open `/` or `/customer` as **Customer**.
2. Search or select **Plumbing Services** $\rightarrow$ choose **Emergency Leak & Pipe Burst Repair**.
3. Toggle **Emergency Dispatch** (+₹100 priority surcharge).
4. Pin address on the OpenStreetMap interactive Leaflet picker.
5. Review the **deterministic worker ranking** (Ramesh Kumar ranked #1 best match with 95% score).
6. Click **Confirm & Request Service** $\rightarrow$ booking created in `ASSIGNED` status.
7. Switch to **Worker** role via top Demo Switcher $\rightarrow$ see the red pulsing incoming Emergency Job alert card.
8. Worker clicks **Accept Job** $\rightarrow$ status moves to `ACCEPTED`.
9. Customer tracker reflects real-time acceptance.
10. Worker clicks **Start Travel** $\rightarrow$ status changes to `WORKER_EN_ROUTE`.
11. Worker arrives and clicks **Start Service** $\rightarrow$ status changes to `SERVICE_STARTED`.
12. Worker completes work with summary notes and photo proof $\rightarrow$ status changes to `SERVICE_COMPLETED`.
13. Customer inspects work and clicks **Confirm & Pay ₹550**.
14. Customer selects **Mock UPI** $\rightarrow$ status changes to `PAYMENT_COMPLETED`, digital invoice generated.
15. Customer rates worker **5 Stars** with written feedback $\rightarrow$ updates worker profile rating stats.
16. Switch to **Society Admin** / **Federation Admin** $\rightarrow$ inspect completed booking, GMV revenue chart, 88% worker payout ledger, and compliance audit trail!

---

## 🔐 Environment Variables

Create `.env.local` based on `.env.example`:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-placeholder
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-placeholder

PAYMENT_PROVIDER_KEY=test_key_sahyog_demo
PAYMENT_PROVIDER_SECRET=test_secret_sahyog_demo

MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
MAP_ATTRIBUTION=&copy; OpenStreetMap contributors
```

> **Note:** The application includes a built-in fallback state engine that works 100% offline out-of-the-box without requiring live Supabase credentials for hackathon demonstration.

---

## 📂 Project Architecture

```text
Projects/Sahyog/
├── src/
│   ├── app/                 # Next.js App Router Pages
│   │   ├── (public)/        # Landing, About, Services, Cooperatives
│   │   ├── customer/        # Customer dashboard, booking wizard, live tracker, history
│   │   ├── worker/          # Worker dashboard, job alerts, execution, profile, welfare
│   │   ├── admin/           # Admin KPI, worker verification, bookings, map, disputes, insights
│   │   └── api/             # REST Route handlers
│   ├── components/
│   │   ├── ui/              # Radix UI + shadcn styled primitives
│   │   ├── shared/          # Navbar, Footer, DemoRoleSwitcher, LanguageSwitcher, StatusBadge
│   │   ├── customer/        # ServiceCard, BookingWizard, LiveTracker, InvoiceModal
│   │   ├── worker/          # AvailabilityToggle, JobAlertCard, ActiveServiceBar
│   │   ├── admin/           # KpiCard, WorkerVerificationModal, ReassignModal, AnalyticsCharts
│   │   └── maps/            # LeafletMap, LocationPicker, AdminOperationsMap
│   ├── lib/
│   │   ├── store/           # Central reactive state provider & demo seed engine
│   │   ├── matching/        # Deterministic scoring algorithm
│   │   ├── payments/        # Mock payment and invoice engine
│   │   ├── i18n/            # Dual-language translations (EN/HI)
│   │   └── supabase/        # Supabase client & server config
│   ├── types/               # TypeScript interfaces
│   ├── constants/           # Categories, services, demo accounts, color tokens
│   └── schemas/             # Zod validation schemas
├── supabase/                # PostgreSQL + PostGIS schema, seed, and RLS policies
└── scripts/                 # Test suites and build helpers
```