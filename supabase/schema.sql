-- Sahyog PostgreSQL + PostGIS Database Schema
-- Cooperative Digital Service Marketplace Platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Profiles (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('CUSTOMER', 'WORKER', 'SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN')),
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    location GEOMETRY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Federations
CREATE TABLE IF NOT EXISTS federations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    registration_no TEXT UNIQUE NOT NULL,
    state TEXT NOT NULL,
    contact_email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Cooperatives
CREATE TABLE IF NOT EXISTS cooperatives (
    id TEXT PRIMARY KEY,
    federation_id TEXT REFERENCES federations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    registration_no TEXT UNIQUE NOT NULL,
    district TEXT NOT NULL,
    address TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_hi TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    description_hi TEXT,
    icon_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Services
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES service_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_hi TEXT,
    description TEXT,
    description_hi TEXT,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_duration_mins INT DEFAULT 60,
    is_emergency_eligible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Skills
CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Workers
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    cooperative_id TEXT REFERENCES cooperatives(id) ON DELETE SET NULL,
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED'
        CHECK (verification_status IN ('UNVERIFIED', 'DOCUMENT_PENDING', 'COOPERATIVE_VERIFIED', 'SKILL_VERIFIED', 'BACKGROUND_CHECKED', 'APPROVED', 'SUSPENDED')),
    experience_years INT DEFAULT 0,
    service_radius_km NUMERIC(5, 2) DEFAULT 10.0,
    is_available BOOLEAN DEFAULT TRUE,
    current_location GEOMETRY(Point, 4326),
    rating_avg NUMERIC(3, 2) DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    completed_services_count INT DEFAULT 0,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Worker Skills
CREATE TABLE IF NOT EXISTS worker_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    skill_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    UNIQUE(worker_id, skill_id)
);

-- 9. Certifications
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    issuing_body TEXT NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    document_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Worker Availability
CREATE TABLE IF NOT EXISTS worker_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 11. Worker Welfare Schemes
CREATE TABLE IF NOT EXISTS worker_welfare (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    scheme_name TEXT NOT NULL,
    policy_no TEXT,
    provider TEXT,
    coverage_amount NUMERIC(12, 2) DEFAULT 0,
    valid_until DATE,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING_RENEWAL', 'EXPIRED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
    worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'REQUESTED'
        CHECK (status IN (
            'REQUESTED', 'MATCHING', 'ASSIGNED', 'ACCEPTED', 'SCHEDULED',
            'WORKER_EN_ROUTE', 'SERVICE_STARTED', 'SERVICE_COMPLETED',
            'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'PAYOUT_PENDING',
            'PAYOUT_COMPLETED', 'CANCELLED', 'EXPIRED', 'DISPUTED',
            'REFUNDED', 'PAYMENT_FAILED', 'NO_SHOW'
        )),
    urgency TEXT NOT NULL DEFAULT 'NORMAL' CHECK (urgency IN ('NORMAL', 'EMERGENCY')),
    scheduled_date DATE NOT NULL,
    scheduled_time TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_location GEOMETRY(Point, 4326),
    description TEXT NOT NULL,
    notes TEXT,
    customer_notes TEXT,
    worker_completion_notes TEXT,
    worker_completion_photo_url TEXT,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    platform_fee NUMERIC(10, 2) DEFAULT 0,
    cooperative_fee NUMERIC(10, 2) DEFAULT 0,
    worker_payout_amount NUMERIC(10, 2) DEFAULT 0,
    payment_status TEXT DEFAULT 'PAYMENT_PENDING',
    payout_status TEXT DEFAULT 'PAYOUT_PENDING',
    payment_method TEXT,
    transaction_ref TEXT,
    invoice_number TEXT,
    cancellation_actor TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Booking Assignments
CREATE TABLE IF NOT EXISTS booking_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    assigned_by TEXT NOT NULL DEFAULT 'SYSTEM',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    response_notes TEXT,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ
);

-- 14. Booking Status History
CREATE TABLE IF NOT EXISTS booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) DEFAULT 0,
    cooperative_fee NUMERIC(10, 2) DEFAULT 0,
    worker_share NUMERIC(10, 2) DEFAULT 0,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PAYMENT_PENDING' CHECK (status IN ('PAYMENT_PENDING', 'PAYMENT_PROCESSING', 'PAYMENT_COMPLETED', 'PAYMENT_FAILED', 'REFUND_PENDING', 'REFUNDED')),
    transaction_ref TEXT UNIQUE NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Payouts
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    cooperative_id TEXT REFERENCES cooperatives(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PAYOUT_PENDING' CHECK (status IN ('PAYOUT_PENDING', 'PAYOUT_COMPLETED')),
    transaction_ref TEXT UNIQUE NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Ratings & Reviews
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    skill_rating INT CHECK (skill_rating BETWEEN 1 AND 5),
    punctuality_rating INT CHECK (punctuality_rating BETWEEN 1 AND 5),
    politeness_rating INT CHECK (politeness_rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Disputes
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    raised_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status TEXT NOT NULL DEFAULT 'DISPUTE_OPENED' CHECK (status IN ('DISPUTE_OPENED', 'UNDER_REVIEW', 'RESOLVED')),
    resolution_action TEXT CHECK (resolution_action IN ('REFUND_FULL', 'REFUND_PARTIAL', 'RE_SERVICE', 'REJECTED')),
    admin_notes TEXT,
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'URGENT')),
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Privacy Consents
CREATE TABLE IF NOT EXISTS privacy_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL,
    consent_version TEXT NOT NULL,
    consent_status TEXT NOT NULL DEFAULT 'GRANTED' CHECK (consent_status IN ('GRANTED', 'REVOKED')),
    ip_address TEXT,
    consented_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name TEXT,
    actor_role TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast PostGIS Spatial Querying & Lookup
CREATE INDEX IF NOT EXISTS idx_workers_location ON workers USING GIST (current_location);
CREATE INDEX IF NOT EXISTS idx_bookings_location ON bookings USING GIST (customer_location);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON bookings (worker_id);