# Sahyog (सहयोग)

> Connecting Cooperative Skills with Everyday Needs

Sahyog is a cooperative-owned digital service marketplace that connects verified skilled workers from Labour Cooperative Societies and Federations with households, businesses, institutions, and communities. The platform makes skilled local work discoverable, trusted, and transparent while prioritizing worker welfare, fair wages, and governance through cooperatives.

## Hackathon context

- Hackathon: Smart India Hackathon 2026 (SIH 2026)
- Project theme: Digital transformation for cooperative labour ecosystems and community service delivery
- Repository: https://github.com/sagnikdevelops/Sahyog
- Live app: https://sahyogapp.vercel.app/

## Project overview

Sahyog addresses a major gap in the Indian service ecosystem: thousands of skilled workers are already part of labour cooperative networks, but they remain fragmented, underutilized, and disconnected from digital booking platforms. At the same time, customers struggle to find reliable, local, verified professionals for essential services such as plumbing, electrical work, carpentry, household care, gardening, repair, and community support.

Our solution is a digital marketplace designed around cooperative principles:

- verified worker profiles and certifications
- transparent pricing and payout structure
- location-aware matching of workers to customer requests
- emergency and scheduled service booking flows
- cooperative admin dashboards for monitoring demand, labor allocation, and welfare contributions
- worker-first economics with minimal intermediary extraction

## Problem statement

The organisation-provided problem statement describes the challenge as follows:

> Labour Cooperative Federations and Labour Cooperative Societies have a large pool of skilled workers, including electricians, plumbers, carpenters, painters, domestic helpers, caregivers, drivers, gardeners, cleaners, and technicians. Despite having these skilled workers and a strong local presence, there is no centralized digital platform that efficiently connects them with households, businesses, and institutions needing their services.
>
> Currently, private service platforms dominate the market, while many cooperative workers remain underutilized and lack direct access to customers.
>
> The project aims to develop a cooperative-owned digital service marketplace that connects verified skilled workers with customers who need household and community services. The platform focuses on fair and transparent wages, worker welfare, skill verification, customer safety and trust, efficient service discovery, and better utilization of the cooperative workforce.

## Why this problem matters

- Many workers have skills but no digital access to demand markets.
- Customers often rely on informal or unreliable service channels.
- Cooperative societies lack tools to organize their workforce at scale.
- The service ecosystem needs a trustworthy, community-governed alternative to private commission-heavy platforms.
- Better digital coordination can improve income opportunities, service quality, and social security for workers.

## Solution in brief

Sahyog provides a role-based platform for:

- customers to discover, compare, book, pay, and rate service providers
- workers to receive verified job opportunities and manage availability
- society admins to onboard, verify, and monitor workers
- federation admins to track analytics, demand, welfare, and operational health
- super admins to govern the overall platform and compliance flow

The system includes a deterministic worker matching algorithm that prioritizes verified skill match, proximity, availability, and workload, making the booking process transparent and explainable.

## Key value proposition

- 88% of booking value goes directly to the worker
- 7% is allocated to the cooperative welfare and accident fund
- 5% supports platform maintenance and digital infrastructure
- all workers are organized under cooperative and community governance
- customers get verified, local, and trusted service providers

## Features

### For customers

- service discovery by category and urgency
- emergency dispatch flow
- worker ranking and booking recommendation
- location-based matching using map interaction
- live booking status tracking
- digital invoice generation and mock payment flow
- ratings and review history

### For workers

- worker profile and skill verification
- availability management
- incoming job alerts
- accept/reject booking workflow
- service execution and completion tracking
- earnings and welfare visibility
- proof-of-service recording for trust and compliance

### For cooperative society admins

- worker verification and onboarding
- member management
- booking oversight
- service quality and dispute monitoring
- welfare and cooperative analytics

### For federation admins

- region-wide demand insights
- cooperative performance dashboards
- worker utilization tracking
- revenue and payout overview
- compliance and dispute analysis

### For super admins

- platform governance
- role-based operations visibility
- system-wide audits and policy monitoring
- operational oversight across all societies and federations

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Leaflet + OpenStreetMap for mapping and geo-location
- Recharts for analytics dashboards
- Supabase for data and backend integration
- PostGIS-oriented architecture for spatial logic and matching

## Matching and business logic

Sahyog uses a deterministic worker scoring model based on the weighted formula:

Total Score = 40% Skill + 30% Proximity + 20% Availability + 10% Workload

This makes matching simple, explainable, and suitable for demo and evaluation scenarios without relying on opaque ML black-boxes. The project also includes a cooperative revenue split model:

- Worker: 88%
- Cooperative Welfare / Accident Fund: 7%
- Platform and Digital Infrastructure: 5%

## Product workflow

1. Customer searches for a service or emergency request.
2. Customer selects service, urgency level, and location.
3. System ranks nearby verified workers using the matching engine.
4. Customer confirms booking and creates a job request.
5. Worker receives a job alert and accepts or rejects.
6. Booking moves through the service lifecycle: assigned → accepted → en route → started → completed.
7. Customer confirms completion and pays via mock UPI / digital payment workflow.
8. Worker payout and cooperative welfare distribution are generated.
9. Ratings, reviews, and analytics are updated for future matching.

## Demo mode and user roles

The app includes an in-product Demo Mode switcher so judges can experience the platform across multiple roles without manual login setup.

| Role | Demo user | Example specialization | Access route |
| --- | --- | --- | --- |
| Customer | Aarav Sharma | Household resident | `/customer` |
| Worker | Ramesh Kumar Verma | Master plumber | `/worker` |
| Society Admin | Sunita Deshmukh | Labour society administrator | `/admin` |
| Federation Admin | Dr. Rajeshwar Patil | Federation analytics and oversight | `/admin/analytics` |
| Super Admin | System Administrator | Platform governance | `/admin` |

## Demo flow

A typical 16-step hackathon flow is:

1. Open the home page or customer dashboard.
2. Search for a service category such as plumbing or repair.
3. Select an urgent service and add emergency dispatch.
4. Pin the exact customer location on the map.
5. Review ranked worker options.
6. Create the booking request.
7. Switch into the worker role and receive the incoming job alert.
8. Accept the job.
9. Track status changes as the worker is assigned and begins work.
10. Start travel and then service execution.
11. Complete the task and add service notes.
12. Customer verifies completion and pays.
13. Payment is marked complete and invoice is generated.
14. Customer provides a rating and feedback.
15. Society and federation dashboards show analytics and contribution tracking.
16. Judges observe the full cooperative service lifecycle end to end.

## Project structure

```text
Sahyog/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── customer/
│   │   ├── worker/
│   │   ├── auth/
│   │   ├── about/
│   │   ├── cooperatives/
│   │   ├── services/
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── customer/
│   │   ├── worker/
│   │   ├── maps/
│   │   ├── shared/
│   │   └── ui/
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
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── .env.example
├── AGENTS.md
├── CONTRIBUTING.md
├── DATABASE.md
├── WORKFLOW.md
└── README.md
```

## Local setup

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
git clone https://github.com/sagnikdevelops/Sahyog.git
cd Sahyog
npm install
npm run test
npm run typecheck
npm run dev
```

Open http://localhost:3000

### Environment variables

Copy the sample environment file:

```bash
cp .env.example .env.local
```

Then add your project keys if you want to connect to Supabase or payment infrastructure. The app is also designed to work in a demo mode with internal fallback state logic for hackathon presentation without requiring full backend activation.

## Team members

| Name | Role | GitHub | LinkedIn |
| --- | --- | --- | --- |
| Sagnik Dutta | Team leader | https://github.com/sagnikdevelops | https://www.linkedin.com/in/sagnikduttahere/ |
| Pratik Saha | Member 1 | https://github.com/Pratik-saha-2007 | https://www.linkedin.com/in/pratiksaha-codes/ |
| Satwika Majumdar | Member 2 | https://github.com/satwika-coder | https://www.linkedin.com/in/satwika-majumdar-a282053a0/ |
| Samragnyi Bhowmick | Member 3 | https://github.com/samragnyibhowmick | https://www.linkedin.com/in/samragnyi-bhowmick-4a56b542a/ |
| Pritam Karmakar | Member 4 | TBD | TBD |

## Links

- GitHub repository: https://github.com/sagnikdevelops/Sahyog
- Deployed app: https://sahyogapp.vercel.app/
- Problem statement and organisation brief: https://docs.google.com/spreadsheets/d/1HUkEtA30LG4mnDJddnXDZLl1cbO2AV0m_LNY4amSbPE/edit?usp=sharing

## Project impact

Sahyog is built to strengthen the cooperative economy by making worker services more discoverable, fairer, and digitally enabled. It creates a public-interest digital infrastructure that can bring dignity, safety, and opportunity to workers while providing households and institutions with a reliable and transparent platform for essential services.

## License

This project is currently developed for hackathon presentation and internal evaluation. Please contact the team before using the repository for commercial deployment or redistribution.

---

Sahyog is a practical, cooperative-first digital solution aimed at empowering workers, strengthening local labor ecosystems, and turning essential services into a transparent and community-driven marketplace.
