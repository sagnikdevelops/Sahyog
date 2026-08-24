-- Sahyog Row Level Security (RLS) Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policy: Users can view public profiles; edit own profile
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Workers Policy: Public can view active approved workers; worker can update own availability
CREATE POLICY "Anyone can view approved workers" ON workers FOR SELECT USING (verification_status IN ('APPROVED', 'COOPERATIVE_VERIFIED'));
CREATE POLICY "Workers can update own worker record" ON workers FOR UPDATE USING (auth.uid() = id);

-- 3. Bookings Policy: Customer can view their bookings; assigned Worker can view; Admins can view all
CREATE POLICY "Users can view relevant bookings" ON bookings FOR SELECT USING (
  customer_id = auth.uid() OR
  worker_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'))
);

CREATE POLICY "Customers can insert bookings" ON bookings FOR INSERT WITH CHECK (
  customer_id = auth.uid()
);

CREATE POLICY "Participants and admins can update bookings" ON bookings FOR UPDATE USING (
  customer_id = auth.uid() OR
  worker_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'))
);