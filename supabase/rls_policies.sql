-- Sahyog Row Level Security (RLS) Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Workers: public approved + own record
DROP POLICY IF EXISTS "Anyone can view approved workers" ON workers;
DROP POLICY IF EXISTS "Workers can update own worker record" ON workers;
DROP POLICY IF EXISTS "Workers can view own record" ON workers;
DROP POLICY IF EXISTS "Workers can insert own record" ON workers;

CREATE POLICY "Anyone can view approved workers" ON workers FOR SELECT USING (
  verification_status IN ('APPROVED', 'COOPERATIVE_VERIFIED', 'SKILL_VERIFIED', 'BACKGROUND_CHECKED')
  OR auth.uid() = id
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'))
);
CREATE POLICY "Workers can insert own record" ON workers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Workers can update own worker record" ON workers FOR UPDATE USING (
  auth.uid() = id
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'))
);

-- Worker skills
DROP POLICY IF EXISTS "Skills are readable" ON worker_skills;
DROP POLICY IF EXISTS "Workers manage own skills" ON worker_skills;
CREATE POLICY "Skills are readable" ON worker_skills FOR SELECT USING (true);
CREATE POLICY "Workers manage own skills" ON worker_skills FOR ALL USING (auth.uid() = worker_id) WITH CHECK (auth.uid() = worker_id);

-- Certifications: workers manage own, cannot self-approve
DROP POLICY IF EXISTS "Certifications readable" ON certifications;
DROP POLICY IF EXISTS "Workers insert own certifications" ON certifications;
DROP POLICY IF EXISTS "Workers update own pending certifications" ON certifications;
DROP POLICY IF EXISTS "Workers delete own certifications" ON certifications;
DROP POLICY IF EXISTS "Admins review certifications" ON certifications;

CREATE POLICY "Certifications readable" ON certifications FOR SELECT USING (
  auth.uid() = worker_id
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'))
  OR EXISTS (SELECT 1 FROM bookings WHERE bookings.worker_id = certifications.worker_id AND bookings.customer_id = auth.uid())
  OR certification_status = 'APPROVED'
);

CREATE POLICY "Workers insert own certifications" ON certifications
  FOR INSERT WITH CHECK (auth.uid() = worker_id AND certification_status = 'PENDING' AND COALESCE(is_verified, false) = false);

CREATE POLICY "Workers update own pending certifications" ON certifications
  FOR UPDATE USING (auth.uid() = worker_id)
  WITH CHECK (auth.uid() = worker_id AND certification_status = 'PENDING' AND COALESCE(is_verified, false) = false);

CREATE POLICY "Workers delete own certifications" ON certifications
  FOR DELETE USING (auth.uid() = worker_id AND certification_status <> 'APPROVED');

CREATE POLICY "Admins review certifications" ON certifications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'))
  );

-- Badges: readable, admin-awarded only
DROP POLICY IF EXISTS "Badges readable" ON worker_badges;
DROP POLICY IF EXISTS "Admins manage badges" ON worker_badges;
CREATE POLICY "Badges readable" ON worker_badges FOR SELECT USING (true);
CREATE POLICY "Admins manage badges" ON worker_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN'))
);

-- Bookings
DROP POLICY IF EXISTS "Users can view relevant bookings" ON bookings;
DROP POLICY IF EXISTS "Customers can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Participants and admins can update bookings" ON bookings;

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

-- Storage policies
DROP POLICY IF EXISTS "Avatar images are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Users manage own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users manage own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Participants can read certificates" ON storage.objects;

CREATE POLICY "Avatar images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users manage own avatars"
  ON storage.objects FOR ALL
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users manage own certificates"
  ON storage.objects FOR ALL
  USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Participants can read certificates"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'certificates'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role IN ('SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN')
      )
      OR EXISTS (
        SELECT 1 FROM bookings
        WHERE bookings.customer_id = auth.uid()
          AND bookings.worker_id::text = (storage.foldername(name))[1]
      )
    )
  );
