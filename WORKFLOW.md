# Sahyog Service Lifecycle & Matching Workflows

## 1. Complete Booking Lifecycle

```text
REQUESTED
    │ (PostGIS Geo-Matching)
    ▼
MATCHING / ASSIGNED
    │ (Worker receives push/in-app alert)
    ├───────────────► REJECTED / EXPIRED ──► Re-matching or Admin Dispatch
    ▼
ACCEPTED / SCHEDULED
    │ (Worker leaves for site)
    ▼
WORKER_EN_ROUTE
    │ (Worker arrives at site)
    ▼
SERVICE_STARTED
    │ (Worker executes trade repair)
    ▼
SERVICE_COMPLETED (Notes & photo upload)
    │ (Customer inspects & confirms)
    ▼
PAYMENT_PENDING
    │ (Mock UPI / Card / NetBanking)
    ▼
PAYMENT_COMPLETED (Digital Invoice generated)
    │ (88% direct worker share credited)
    ▼
PAYOUT_COMPLETED ──► RATING_SUBMITTED
```

## 2. Deterministic Matching Formula

$$\text{Total Match Score (100 pts)} = 40\% \times \text{Skill} + 30\% \times \text{Proximity} + 20\% \times \text{Availability} + 10\% \times \text{Workload}$$

- **Skill (40 pts)**: Exact certified skill = 40; related category skill = 25; general = 10.
- **Proximity (30 pts)**: $\le 2\text{km} = 30$, $\le 5\text{km} = 25$, $\le 10\text{km} = 18$, $\le 15\text{km} = 10$.
- **Availability (20 pts)**: Worker Online + Verified = 20 pts.
- **Workload (10 pts)**: 0 active jobs today = 10 pts; 1 active job = 7 pts; 2 jobs = 4 pts.
- **Emergency Priority**: Automatic +15 score boost for available verified workers within 5 km.