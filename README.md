# Sahyog

Sahyog is a cooperative-first digital service marketplace that connects verified skilled workers from labour cooperative societies and federations with households, businesses, institutions, and communities. It transforms informal service access into a trusted, transparent, and worker-centric system designed around dignity, fair wages, and local economic empowerment.

> Built for the Smart India Hackathon 2026: a digital transformation for cooperative labour ecosystems and community service delivery.

## Why Sahyog?

Across India, skilled workers such as electricians, plumbers, carpenters, caregivers, drivers, cleaners, and repair technicians are often part of cooperative networks but remain disconnected from digital demand. Many households and institutions still depend on fragmented, unreliable, or commission-heavy informal channels.

Sahyog solves this by creating a single, cooperative-owned platform where:

- verified workers can showcase their expertise and availability
- customers can discover local, trusted service providers quickly
- societies and federations can coordinate labour allocation and welfare
- supervisors can track demand, quality, and operational performance
- workers retain a larger share of the value they generate

## Product vision

Sahyog is designed to make essential services more discoverable, safer, and more accountable while strengthening the cooperative movement in India. The platform is built on four principles:

1. Trust: verified workers, transparent service history, and cooperative governance
2. Fairness: direct worker value capture with cooperative welfare contributions
3. Local relevance: location-aware matching and community-level service coordination
4. Scalability: role-based dashboards, analytics, and API-ready architecture for future integration

## Key capabilities

### For customers

- search and browse services by category and urgency
- request emergency or scheduled jobs from verified local workers
- compare workers through a transparent deterministic matching system
- track live booking progress from assignment to completion
- pay through a mock digital payment flow and receive generated invoices
- leave feedback, review worker ratings, and build trust over time

### For workers

- maintain a profile with skills, experience, and service radius
- receive booking alerts and accept or reject opportunities
- manage availability and active job responsibilities
- view earnings, welfare contributions, and payout visibility
- complete service tasks with status tracking and professional accountability

### For cooperative society admins

- verify worker profiles and onboarding records
- manage cooperative membership and service demand
- monitor assignments, quality, and disputes
- analyze productivity and welfare benefits across members
- oversee governance and operational compliance locally

### For federation admins

- monitor demand trends across regions and societies
- analyse worker utilization, service performance, and payout health
- review operational bottlenecks and cooperative-level insights
- support strategic planning for labour welfare and digitization

### For super admins

- govern the platform at the ecosystem level
- review role-based operations and system-wide performance
- monitor compliance, dispute handling, and institutional oversight

## Why the app stands out

Sahyog is not just a listing app. It is a cooperative marketplace built around actual service operations:

- deterministic worker ranking based on skill, proximity, availability, and workload
- emergency prioritization for urgent service requests
- map-based booking experiences using geolocation
- role-aware dashboards for customer, worker, and admin journeys
- end-to-end lifecycle tracking from booking request to payout and review
- demo-mode switching for showcasing multiple stakeholders without manual account setup

## Matching logic

The platform uses an explainable matching engine rather than an opaque black-box recommendation system.

The worker score is calculated as:

- 40% skill match
- 30% proximity to the customer
- 20% availability
- 10% workload

This makes the ranking transparent and easy to understand for judges, administrators, and users.

A cooperative value model is also built into the product:

- worker share: 88%
- cooperative welfare / accident fund: 7%
- platform infrastructure and maintenance: 5%

## Demo workflow

A complete user journey in the app looks like this:

1. A customer browses or searches for a service such as plumbing, electrical, or caregiving.
2. The customer selects urgency and location and creates a booking request.
3. Sahyog ranks the closest verified workers using the deterministic matching algorithm.
4. A worker receives a job alert and accepts or rejects it.
5. The booking moves through live statuses such as assigned, accepted, en route, started, and completed.
6. The customer confirms service completion and pays via the mock payment flow.
7. Worker payouts and cooperative welfare calculations are generated.
8. Ratings and analytics update the next service cycle.

## Role-based demo experience

The app includes a built-in demo-role switcher so the platform can be demonstrated across different stakeholder views without manual login setup.

| Role | Demo user | Example use case | Access route |
| --- | --- | --- | --- |
| Customer | Aarav Sharma | Household service booking | `/customer` |
| Worker | Ramesh Kumar Verma | Job alerts and task completion | `/worker` |
| Society Admin | Sunita Deshmukh | Worker verification and operations | `/admin` |
| Federation Admin | Dr. Rajeshwar Patil | Analytics and oversight | `/admin/analytics` |
| Super Admin | System Administrator | Platform governance | `/admin` |

## Tech stack

The webapp is built on a modern JavaScript/TypeScript stack for rapid product development and hackathon demos:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Leaflet + OpenStreetMap for map-based service discovery and geolocation
- Recharts for analytics dashboards
- Supabase-ready architecture for data and backend integration
- Local demo-state logic for presentation-ready flows without requiring live infrastructure

## Project structure

```text
Sahyog/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── worker/
│   │   ├── about/
│   │   ├── cooperatives/
│   │   ├── services/
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── customer/
│   │   ├── maps/
│   │   ├── shared/
│   │   ├── ui/
│   │   └── worker/
│   ├── constants/
│   ├── lib/
│   │   ├── auth/
│   │   ├── i18n/
│   │   ├── matching/
│   │   ├── payments/
│   │   ├── store/
│   │   └── supabase/
│   ├── schemas/
│   ├── types/
│   └── app/globals.css
├── supabase/
├── scripts/
├── public/
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── AGENTS.md
├── CONTRIBUTING.md
├── DATABASE.md
├── WORKFLOW.md
├── README.md
└── LICENSE (if present in the repo)
```

## Installation and local setup

### Prerequisites

- Node.js 20 or later
- npm

### Clone and install

```bash
git clone https://github.com/sagnikdevelops/Sahyog.git
cd Sahyog
npm install
```

### Run the app

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Validate the project

```bash
npm run typecheck
npm run test
```

### Environment variables

Copy the sample environment file:

```bash
cp .env.example .env.local
```

If you want to connect the app to Supabase or external service infrastructure, add the relevant keys and configuration in the local environment file. The app is also designed to run in demo mode with seeded state and in-app mock flows for evaluation and presentation.

## Team

| Name | Role | GitHub | LinkedIn |
| --- | --- | --- | --- |
| Sagnik Dutta | Team Lead | https://github.com/sagnikdevelops | https://www.linkedin.com/in/sagnikduttahere/ |
| Pratik Saha | Team Member | https://github.com/Pratik-saha-2007 | https://www.linkedin.com/in/pratiksaha-codes/ |
| Satwika Majumdar | Team Member | https://github.com/satwika-coder | https://www.linkedin.com/in/satwika-majumdar-a282053a0/ |
| Samragnyi Bhowmick | Team Member | https://github.com/samragnyibhowmick | https://www.linkedin.com/in/samragnyi-bhowmick-4a56b542a/ |
| Pritam Karmakar | Team Member | TBD | TBD |
| Manoswita Datta | Team Member | TBD | TBD |

## Links

- GitHub repository: https://github.com/sagnikdevelops/Sahyog
- Live demo: https://sahyogapp.vercel.app/
- Problem statement: Smart India Hackathon 2026 cooperative services theme

## Impact

Sahyog is built to empower cooperative workers, reduce information asymmetry, and create a safer, fairer, and more transparent marketplace for essential services. It brings together local labour economies, digital access, and worker welfare in one practical platform designed for real community impact.

## License

This project was developed for hackathon demonstration and evaluation. Please contact the team before using the repository for commercial deployment or broader redistribution.

---

Sahyog is a cooperative-first digital platform that turns everyday service needs into trusted, local, and dignified work opportunities for communities and workers alike.
