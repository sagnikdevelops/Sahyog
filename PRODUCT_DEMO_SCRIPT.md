# Sahyog — 5-Minute Product Demo Video Script
**Target Duration:** ~5 Minutes (300 Seconds)  
**Live Application URL:** [https://sahyogapp.vercel.app/](https://sahyogapp.vercel.app/)  
**Target Audience:** Smart India Hackathon (SIH) Evaluators, Jury Panels, and Technical Judges  
**Narrative Focus:** Problem & Market Gap → Deterministic Cooperative Model → End-to-End Multi-Stakeholder Journey (Customer, Worker, Society Admin, Federation Admin) → Social Impact & Scalability.

---

## 🎬 Quick Recording Cheat-Sheet for Presenter

1. **Resolution & Display:** Record in 1080p (1920x1080) or 4K at 100% or 110% browser zoom for maximum text legibility.
2. **Demo Role Switcher:** Always use the built-in **"Demo Mode"** pill in the top-right navbar to switch personas instantly without tedious logouts.
3. **Pacing:** Speak with confident, upbeat energy. Pause for 0.5s whenever switching pages so video transitions look crisp.
4. **Mouse Movement:** Smooth, deliberate cursor movements. Avoid erratic circling. Use clicks that align with verbal cues.

---

## ⏱️ Video Timeline Overview

| Timestamp | Scene | Section / Focus | Route / Page |
| :--- | :---: | :--- | :--- |
| **0:00 – 0:45** | 1 | **Hook, Problem Statement & Market Gap** | `/` (Landing Page) |
| **0:45 – 1:10** | 2 | **Ecosystem Architecture & Demo Switcher** | Navbar / Demo Switcher |
| **1:10 – 2:10** | 3 | **Customer Persona & Booking Engine** | `/customer` & `/customer/book` |
| **2:10 – 3:05** | 4 | **Worker Persona: Dignity, Jobs & Welfare** | `/worker`, `/worker/earnings` |
| **3:05 – 3:35** | 5 | **Customer Completion, Payment & Invoice** | `/customer/bookings/[id]` |
| **3:35 – 4:20** | 6 | **Society Admin: Dispatch, Verification & GIS** | `/admin`, `/admin/workers`, `/admin/map` |
| **4:20 – 4:45** | 7 | **Federation Admin: Macro KPIs & Welfare Pool** | `/admin/analytics` |
| **4:45 – 5:00** | 8 | **Tech Stack, Vision & Hackathon Closing** | `/` (Footer / Mission) |

---

## 📜 Scene-by-Scene Production Script

---

### SCENE 1: The Problem, Market Gap & The Sahyog Vision
- **Time:** `0:00 – 0:45` (45 seconds)
- **Primary Page:** Landing Page (`/`)
- **Key Message:** Traditional gig aggregators exploit gig workers with 25–35% cuts and zero safety net. Meanwhile, millions in registered labour cooperatives lack digital access. Sahyog bridges this gap.

#### 🎥 Visual & Screen Actions:
1. Start on the homepage at [https://sahyogapp.vercel.app/](https://sahyogapp.vercel.app/).
2. Slowly scroll through the Hero Section showing the banner *"Work that Works for Everyone: Skill. Trust. Together."*
3. Hover briefly over the metric cards: **1,500+ Verified Tradespeople**, **48+ Registered Labour Societies**, and the **88% Direct Worker Share**.
4. Scroll down slightly to show the **Emergency Booking Radar banner** and the cooperative value breakdown.

#### 🎙️ Voiceover (Narration):
> *"Across India, millions of skilled tradespeople—plumbers, electricians, carpenters, and technicians—are organized under registered labour cooperative societies. Yet, in our digital economy, they remain invisible.*
>
> *Commercial gig aggregators charge extortionate 25 to 35 percent commissions, hide behind opaque algorithms, and offer zero social security. On the other hand, everyday citizens struggle with unreliable, unverified local contractors.*
>
> *This is the market gap we are solving with **Sahyog**—India’s first cooperative-first digital service platform. Built for the Smart India Hackathon, Sahyog replaces exploitative middleman commissions with a transparent, worker-owned ecosystem: **88% of every rupee goes straight to the worker**, **7% funds group welfare and accident insurance**, and **5% sustains the cooperative platform**."*

---

### SCENE 2: The Multi-Stakeholder Architecture & Live Demo Engine
- **Time:** `0:45 – 1:10` (25 seconds)
- **Primary Element:** Top Navigation Bar & Demo Role Switcher
- **Key Message:** Sahyog is an interconnected 4-tier operational engine with zero mock friction for evaluators.

#### 🎥 Visual & Screen Actions:
1. Move the cursor to the top-right navbar.
2. Click the **"Demo Mode"** dropdown.
3. Show the 4 pre-configured personas:
   - **Customer:** Aarav Sharma
   - **Cooperative Worker:** Ramesh Verma
   - **Society Admin:** Sunita Deshmukh
   - **Federation Admin:** Dr. Rajeshwar Patil
4. Click on the language switcher to show Hindi (`हिंदी`) localization support, then switch back to English.

#### 🎙️ Voiceover (Narration):
> *"Sahyog isn't just a simple directory listing. It is a full-lifecycle operational system built around four key stakeholders: the Customer, the Cooperative Worker, the Society Administrator, and the Apex Federation.*
>
> *To evaluate our live deployment seamlessly, we’ve integrated an instant Role Switcher. In this demo, we’ll trace an end-to-end service workflow across all four personas in real time."*

---

### SCENE 3: Persona 1 — Customer Booking & The Deterministic Matching Engine
- **Time:** `1:10 – 2:10` (60 seconds)
- **Primary Pages:** `/customer` → `/customer/book`
- **Key Message:** Fast discovery, emergency prioritization, and an explainable 100-point matching formula (no black-box AI bias).

#### 🎥 Visual & Screen Actions:
1. Select **Customer (Aarav Sharma)** from the switcher or navigate to `/customer`.
2. Point out the active service trackers and the red **Emergency Breakdown** banner.
3. Click **"+ Book New Service"** to enter `/customer/book`.
4. **Step 1:** Select **Plumbing**, then choose **"Pipe Leakage Repair"**.
5. Set urgency to **Emergency** (point out the 30-minute priority badge).
6. **Step 2:** Show the interactive Leaflet/OpenStreetMap Location Picker; select or confirm the address pin.
7. **Step 3:** Show the **Deterministic Match Ranking**:
   - Highlight the top-ranked worker: *Ramesh Verma*.
   - Point out the match score breakdown card: **40% Skill Match + 30% Proximity + 20% Availability + 10% Workload**.
   - Show the transparent price calculation (Base fare + transparent breakdown).
8. Click **"Confirm & Dispatch Service Request"**.

#### 🎙️ Voiceover (Narration):
> *"Let’s start from the customer side. Aarav’s kitchen pipe has burst. On his dashboard, he has instant access to emergency repairs.*
>
> *In our 3-step Booking Wizard, he selects Pipe Leakage Repair. He marks it as an Emergency. The integrated OpenStreetMap and PostGIS engine detects his location.*
>
> *Now look at how Sahyog matches workers. Unlike commercial apps that use black-box algorithms to favor ad-spenders, Sahyog uses an **Explainable Deterministic Matching Formula**: 40 points for verified trade skill, 30 for spatial proximity, 20 for real-time availability, and 10 for workload balancing—plus an emergency boost.*
>
> *Ramesh Verma, a certified plumber from the local cooperative just 1.8 kilometers away, is ranked number one. Aarav confirms the booking, instantly pushing the job into the cooperative dispatch queue."*

---

### SCENE 4: Persona 2 — The Cooperative Worker: Real-Time Lifecycle & Fair Pay
- **Time:** `2:10 – 3:05` (55 seconds)
- **Primary Pages:** `/worker` → `/worker/earnings` → `/worker/welfare`
- **Key Message:** Complete worker autonomy, step-by-step dispatch milestones, proof-of-work photo upload, and transparent 88% direct payout ledger.

#### 🎥 Visual & Screen Actions:
1. Open the Demo Switcher and click **"Cooperative Worker (Ramesh Verma)"**.
2. Point out the **Online/Offline Availability Switch** and his Cooperative Verification badge (*Shramik Seva Sahakari Mandali*).
3. Under **Incoming Job Alerts**, highlight the newly created emergency plumbing request.
4. Click **"Accept Job"**.
5. Move through the live progress triggers:
   - Click **"Mark En Route"** (`WORKER_EN_ROUTE`).
   - Click **"Start Service"** (`SERVICE_STARTED`).
   - Click **"Complete Service"** (`SERVICE_COMPLETED`), adding completion notes and closing the prompt.
6. Click **"Earnings"** in the top action bar to go to `/worker/earnings`.
   - Highlight: **88% Direct Payout Rate**, with zero deductions from middleman commissions.
7. Quick 3-second glimpse into `/worker/welfare` showing group insurance and accidental cover fund balance.

#### 🎙️ Voiceover (Narration):
> *"Now let's switch to the worker view. Ramesh Verma receives an audio-visual job alert on his mobile-friendly dashboard.*
>
> *He can toggle his availability at will. He inspects the customer's problem description and taps 'Accept Job'.*
>
> *As Ramesh travels and executes the repair, he updates the service milestones: 'En Route', 'Work Started', and upon finishing, 'Service Completed' with photographic verification.*
>
> *Crucially, look at his Earnings Ledger. Under Sahyog's cooperative charter, Ramesh receives an unconditional 88% direct bank credit. Furthermore, 7% of the service fee is deposited into his society's collective welfare and medical fund. For the first time, an informal plumber gets institutional dignity and social security."*

---

### SCENE 5: Persona 1 (Revisited) — Customer Verification, Mock UPI & Digital Invoice
- **Time:** `3:05 – 3:35` (30 seconds)
- **Primary Pages:** `/customer/bookings/[id]`
- **Key Message:** Safe milestone confirmation, mock digital payments (UPI/Card), confetti celebration, generated invoice, and multi-criteria ratings.

#### 🎥 Visual & Screen Actions:
1. Switch back to **Customer (Aarav Sharma)**.
2. The Live Tracker now shows the service as **Completed**.
3. Click **"Proceed to Secure Payment"**.
4. Select **Mock UPI** (or Mock Card), click **"Authorize & Pay ₹450"**.
5. Watch the canvas confetti celebration trigger!
6. Click **"View Digital Invoice"** to open the modal:
   - Show the generated GST invoice, booking ID, cooperative registration number, and 88/7/5 fee breakup.
7. Submit a 5-star rating with skill, punctuality, and politeness sliders.

#### 🎙️ Voiceover (Narration):
> *"Back on the customer side, Aarav's live tracker immediately reflects completion.*
>
> *He inspects the work, approves the charge, and pays through our simulated UPI gateway. The transaction automatically settles.*
>
> *Aarav instantly receives a tamper-proof Digital Tax Invoice detailing the cooperative registration and transparent fee breakdown. Finally, he submits a comprehensive rating, reinforcing Ramesh's verified reputation within the cooperative network."*

---

### SCENE 6: Persona 3 — Society Admin Dashboard: Operations, Verification & GIS
- **Time:** `3:35 – 4:20` (45 seconds)
- **Primary Pages:** `/admin` → `/admin/workers` → `/admin/map` → `/admin/disputes`
- **Key Message:** Local cooperative society supervision: KYC document verification, live GIS workforce radar, dispute settlement.

#### 🎥 Visual & Screen Actions:
1. Use the Switcher to toggle to **Society Admin (Sunita Deshmukh)** at `/admin`.
2. Point out the top KPIs: **Total Cooperative Workers**, **Active Dispatch Requests**, and **Emergency Radar**.
3. Click **"Worker Verification"** (`/admin/workers`):
   - Show the filter tabs: *All, Approved, Docs Pending, Suspended*.
   - Click on a worker profile to demonstrate document verification and trade certificate approval modal.
4. Click **"GIS Map"** (`/admin/map`):
   - Show the live spatial map displaying active technicians, service clusters, and coverage radiuses.
5. Quickly show `/admin/disputes`:
   - Demonstrate the supervisor audit panel where society managers can arbitrate customer grievances fairly.

#### 🎙️ Voiceover (Narration):
> *"Now let’s look at the supervisor view: the Society Admin Dashboard, used by grassroots cooperative managers like Sunita.*
>
> *Under 'Worker Verification', society admins maintain strict trade standards. They inspect government IDs, trade diplomas, and police clearances before granting the verified green seal.*
>
> *On the GIS Operations Radar, admins can see live spatial clusters of their active workforce across municipal sectors, ensuring emergency requests are fulfilled in under thirty minutes.*
>
> *And if any dispute arises, the society supervisor arbitrates directly with full audit logs and refund controls—eliminating the callous automated chatbots of big-tech apps."*

---

### SCENE 7: Persona 4 — Federation Admin: Macro Analytics & Welfare Fund
- **Time:** `4:20 – 4:45` (25 seconds)
- **Primary Page:** `/admin/analytics`
- **Key Message:** Apex federation oversight, Gross Merchandise Value (GMV), 7% Welfare Pool compounding, trade-wise demand analytics.

#### 🎥 Visual & Screen Actions:
1. Switch to **Federation Admin (Dr. Rajeshwar Patil)** at `/admin/analytics`.
2. Highlight the 3 top macro cards:
   - **Total Service GMV**
   - **Cooperative Welfare Fund (7% allocated to member safety)**
   - **Completed Job Ratio (90%+)**
3. Scroll through the Recharts interactive visualizations:
   - Monthly Service Volume trend graph
   - Category Demand distribution (Plumbing, Electrical, Carpentry, Caregiving)
   - Worker Utilization and Welfare Pool growth chart.

#### 🎙️ Voiceover (Narration):
> *"At the state and national tier, the Federation Admin Dashboard provides macro-level governance for bodies like the National Labour Cooperative Federation.*
>
> *Federation directors can monitor total ecosystem GMV, trade demand shifts across districts, and crucially, the compounding growth of the 7% Collective Welfare Pool—providing verifiable data for government subsidies, micro-credit lines, and group health policies."*

---

### SCENE 8: Architecture, Vision & Hackathon Conclusion
- **Time:** `4:45 – 5:00` (15 seconds)
- **Primary Page:** Landing page footer or high-level architecture view
- **Key Message:** Next.js 16 + Supabase/PostGIS + OpenStreetMap. Aligned with the Ministry of Cooperation's *"Sahakar Se Samriddhi"* vision.

#### 🎥 Visual & Screen Actions:
1. Navigate back to the homepage `/` or show the repository / architectural highlights.
2. Display the concluding on-screen title card with team details and live URL.

#### 🎙️ Voiceover (Narration):
> *"Built on Next.js 16, React 19, PostGIS, and open-source geospatial tools, Sahyog delivers a scalable, production-ready blueprint directly aligned with the Ministry of Cooperation's vision of 'Sahakar Se Samriddhi'.*
>
> *Sahyog is not just an application—it is a sustainable, dignifying digital revolution for India’s cooperative workforce. Thank you!"*

---

## 🎯 On-Screen Text Callout Overlays (Graphics / Subtitles)

Add these text banners or lower-thirds during post-editing to reinforce your pitch to the judges:

1. **[0:15] Lower Third:** *"The Problem: 25–35% Big-Tech Commissions vs. Zero Social Security"*
2. **[0:38] Highlight Card:** *"The Sahyog Formula: 88% Worker • 7% Welfare Fund • 5% Platform Ops"*
3. **[1:40] Lower Third:** *"Deterministic Matching: 40% Skill + 30% Proximity + 20% Availability + 10% Workload"*
4. **[2:45] Stat Banner:** *"Automated Micro-Welfare: Accidental & Medical Safety for Every Job"*
5. **[3:20] Lower Third:** *"Instant Digital Invoicing & Multi-Metric Accountability"*
6. **[3:55] Map Overlay:** *"PostGIS Geolocation & Real-Time OpenStreetMap Operations"*
7. **[4:30] Metric Card:** *"Federation Oversight: Scalable Public Digital Infrastructure for Cooperatives"*

---

## 💡 Top 5 Demo Tips to Score High with Hackathon Judges

1. **Keep the Live URL pinned in your video description:** Evaluators love testing the demo right after watching.
2. **Show the Reset Button:** If you make test bookings before recording, use the **Refresh / Reset Demo Data** button in the Demo Switcher dropdown to start with a clean slate!
3. **Emphasize 'Cooperative First':** Repeatedly contrast Sahyog with commercial apps (Urban Company, TaskRabbit). Judges love seeing real socio-economic empowerment.
4. **Highlight the Deterministic Algorithm:** Make sure to call out that the matching engine is explainable and bias-free—a major plus in hackathon technical scoring.
5. **Smooth Mouse Movement:** Use slow, deliberate cursor movements. Let the interface shine!
