# Sahyog Database Architecture (Supabase PostgreSQL + PostGIS)

## Overview
The Sahyog database is built on PostgreSQL with the PostGIS extension for spatial queries (worker location and customer coordinates).

## Key Entities & Tables

1. **`profiles`**: User identities linked to Supabase Auth (`id`, `email`, `full_name`, `phone`, `role`, `address`, `city`, `location GEOMETRY(Point, 4326)`).
2. **`federations`**: Apex cooperative federations overseeing regional societies.
3. **`cooperatives`**: Primary Labour Cooperative Societies registering workers.
4. **`workers`**: Worker profile details, verification status (`UNVERIFIED`, `DOCUMENT_PENDING`, `COOPERATIVE_VERIFIED`, `SKILL_VERIFIED`, `APPROVED`, `SUSPENDED`), rating stats, service radius.
5. **`service_categories`**: 10 trade categories (Electrical, Plumbing, Carpentry, Painting, Cleaning, Domestic Help, Caregiving, Gardening, Driving, Technical).
6. **`services`**: Specific services with base pricing and emergency flags.
7. **`worker_skills`**: Many-to-many relationship mapping workers to verified trade skills.
8. **`certifications`**: NSDC, ITI, or trade certificates held by workers.
9. **`worker_welfare`**: Social security and accident insurance policies (PM Suraksha Bima, etc.).
10. **`bookings`**: End-to-end service requests tracking 12 distinct lifecycle states.
11. **`booking_status_history`**: Audit trail of every booking transition.
12. **`payments`**: Digital payment records with split calculations (88% worker, 7% coop welfare, 5% platform).
13. **`payouts`**: Direct remuneration transfers to cooperative workers.
14. **`ratings`**: Star ratings and structured skill reviews.
15. **`disputes`**: Grievance records, supervisor notes, and resolution actions.
16. **`audit_logs`**: Tamper-evident log of all sensitive administrative actions.

## Spatial PostGIS Query Example
```sql
-- Identify approved plumbers within 10km of customer coordinates
SELECT w.id, p.full_name, ST_Distance(w.current_location, ST_SetSRID(ST_MakePoint(77.3649, 28.628), 4326)) AS distance_meters
FROM workers w
JOIN profiles p ON w.id = p.id
JOIN worker_skills ws ON w.id = ws.worker_id
WHERE ws.service_id = 'srv_plumb_emergency'
  AND w.is_available = true
  AND w.verification_status IN ('APPROVED', 'COOPERATIVE_VERIFIED')
  AND ST_DWithin(w.current_location, ST_SetSRID(ST_MakePoint(77.3649, 28.628), 4326), 10000)
ORDER BY distance_meters ASC;
```