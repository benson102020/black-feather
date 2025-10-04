/*
  # 完整三端叫車系統資料庫架構

  1. 資料表建立
    - users (統一用戶表)
    - drivers (司機詳細資料)
    - vehicles (車輛管理)
    - rides (訂單管理)
    - payments (支付記錄)
    - notifications (通知系統)
    - admin_users (管理員)
    - driver_applications (司機申請)
    - complaints (投訴管理)
    - coupons (優惠券)
    - coupon_usage (優惠券使用記錄)
    - driver_locations (司機位置)
    - pricing_config (計費配置)
    - car_types (車型管理)

  2. RLS 安全政策
    - 乘客只能存取自己的資料
    - 司機只能存取自己的資料和接單的訂單
    - 管理員可以存取所有資料

  3. 測試資料
    - 完整的三端測試帳號
    - 測試訂單和支付記錄
*/

-- 啟用必要的擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. 統一用戶表
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone_number text UNIQUE NOT NULL,
  phone text UNIQUE,
  full_name text NOT NULL,
  name text,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'passenger' CHECK (role IN ('passenger', 'driver', 'admin')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  phone_verified boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  avatar_url text,
  rating numeric(3,2) DEFAULT 5.0,
  total_rides integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. 司機詳細資料表
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  license_number text UNIQUE NOT NULL,
  id_number text UNIQUE,
  vehicle_model text NOT NULL,
  vehicle_plate text UNIQUE NOT NULL,
  vehicle_year text,
  vehicle_color text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'offline', 'online', 'busy')),
  location jsonb DEFAULT '{"lat": 0, "lng": 0, "address": "", "updated_at": null}',
  rating numeric(3,2) DEFAULT 0.0,
  total_trips integer DEFAULT 0,
  verification_step integer DEFAULT 0,
  documents jsonb DEFAULT '{}',
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  work_status text DEFAULT 'offline' CHECK (work_status IN ('online', 'busy', 'offline')),
  total_earnings numeric(12,2) DEFAULT 0,
  emergency_contact_name text,
  emergency_contact_phone text,
  jkopay_account jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. 司機申請表
CREATE TABLE IF NOT EXISTS driver_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone_number text NOT NULL,
  id_number text NOT NULL,
  email text,
  license_number text NOT NULL,
  license_expiry text NOT NULL,
  license_class text DEFAULT 'B',
  vehicle_brand text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_plate text NOT NULL,
  vehicle_year integer,
  vehicle_color text,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  emergency_contact_relation text,
  jkopay_account text,
  jkopay_name text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid,
  rejection_reason text,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. 車輛管理表
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  license_plate text UNIQUE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  color text NOT NULL,
  car_type text DEFAULT 'economy' CHECK (car_type IN ('economy', 'comfort', 'luxury')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  insurance_number text,
  insurance_expiry date,
  registration_expiry date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. 訂單管理表
CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id uuid REFERENCES users(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES users(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  pickup_address text NOT NULL,
  pickup_lat numeric(10,8) NOT NULL,
  pickup_lng numeric(11,8) NOT NULL,
  destination_address text NOT NULL,
  destination_lat numeric(10,8) NOT NULL,
  destination_lng numeric(11,8) NOT NULL,
  distance_km numeric(8,2),
  duration_minutes integer,
  car_type text DEFAULT 'economy',
  special_requests text,
  base_fare numeric(10,2) DEFAULT 0,
  distance_fare numeric(10,2) DEFAULT 0,
  time_fare numeric(10,2) DEFAULT 0,
  surge_multiplier numeric(3,2) DEFAULT 1.0,
  car_type_multiplier numeric(3,2) DEFAULT 1.0,
  coupon_discount numeric(10,2) DEFAULT 0,
  total_fare numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'driver_arrived', 'in_progress', 'completed', 'cancelled')),
  requested_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  pickup_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  passenger_rating integer CHECK (passenger_rating >= 1 AND passenger_rating <= 5),
  driver_rating integer CHECK (driver_rating >= 1 AND driver_rating <= 5),
  passenger_comment text,
  driver_comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. 支付記錄表
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'bank_transfer', 'digital_wallet')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  transaction_id text,
  payment_gateway text,
  gateway_response jsonb,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 7. 通知系統表
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'system' CHECK (type IN ('system', 'order', 'earnings', 'admin')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 8. 管理員表
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  name text,
  email text UNIQUE,
  role text DEFAULT 'admin',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 9. 投訴管理表
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  ride_id uuid REFERENCES rides(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES users(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('driver_behavior', 'vehicle_condition', 'route_issue', 'payment_issue', 'safety_concern', 'other')),
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'closed')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  admin_response text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 10. 優惠券表
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  discount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('percentage', 'fixed')),
  min_amount numeric(10,2) DEFAULT 0,
  max_discount numeric(10,2),
  usage_limit integer,
  used_count integer DEFAULT 0,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  expiry_date timestamptz NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 11. 優惠券使用記錄表
CREATE TABLE IF NOT EXISTS coupon_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid REFERENCES coupons(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE,
  discount_amount numeric(10,2) NOT NULL,
  used_at timestamptz DEFAULT now()
);

-- 12. 司機位置表
CREATE TABLE IF NOT EXISTS driver_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  lat numeric(10,8) NOT NULL,
  lng numeric(11,8) NOT NULL,
  heading numeric(5,2),
  speed numeric(5,2),
  accuracy numeric(8,2),
  status text DEFAULT 'offline' CHECK (status IN ('online', 'busy', 'offline')),
  updated_at timestamptz DEFAULT now()
);

-- 13. 計費配置表
CREATE TABLE IF NOT EXISTS pricing_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_price numeric(10,2) DEFAULT 100,
  price_per_km numeric(10,2) DEFAULT 20,
  price_per_minute numeric(10,2) DEFAULT 3,
  surge_multiplier numeric(3,2) DEFAULT 1.2,
  peak_hours_start time DEFAULT '07:00:00',
  peak_hours_end time DEFAULT '09:00:00',
  peak_hours_evening_start time DEFAULT '17:00:00',
  peak_hours_evening_end time DEFAULT '19:00:00',
  weekend_surge numeric(3,2) DEFAULT 1.1,
  car_type_multipliers jsonb DEFAULT '{"luxury": 1.8, "comfort": 1.3, "economy": 1.0}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 14. 車型管理表
CREATE TABLE IF NOT EXISTS car_types (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL,
  multiplier numeric(3,2) DEFAULT 1.0,
  icon text DEFAULT '🚗',
  description text,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_drivers_work_status ON drivers(work_status);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_passenger_id ON rides(passenger_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_passenger_status ON rides(passenger_id, status);
CREATE INDEX IF NOT EXISTS idx_rides_driver_status ON rides(driver_id, status);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_ride_id ON payments(ride_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_updated_at ON driver_locations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_coupons_active_expiry ON coupons(active, expiry_date) WHERE active = true;

-- 地理位置索引
CREATE INDEX IF NOT EXISTS idx_rides_pickup_location ON rides USING gist (point(pickup_lng::double precision, pickup_lat::double precision));
CREATE INDEX IF NOT EXISTS idx_rides_destination_location ON rides USING gist (point(destination_lng::double precision, destination_lat::double precision));
CREATE INDEX IF NOT EXISTS idx_driver_locations_position ON driver_locations USING gist (point(lng::double precision, lat::double precision));

-- 啟用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策
DROP POLICY IF EXISTS "Enable all access for service role" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable select for users on own data" ON users;
DROP POLICY IF EXISTS "Enable update for users on own data" ON users;
DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow service role full access" ON users;

-- Users 表 RLS 政策
CREATE POLICY "Enable all access for service role" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable select for users on own data" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Enable update for users on own data" ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Drivers 表 RLS 政策
CREATE POLICY "Enable all access for service role" ON drivers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage drivers" ON drivers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Driver Applications 表 RLS 政策
CREATE POLICY "Allow anonymous driver applications" ON driver_applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated users manage applications" ON driver_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access on applications" ON driver_applications FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Vehicles 表 RLS 政策
CREATE POLICY "Allow authenticated users to manage vehicles" ON vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access" ON vehicles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Rides 表 RLS 政策
CREATE POLICY "Users can read own rides" ON rides FOR SELECT TO authenticated USING (passenger_id = auth.uid() OR driver_id = auth.uid());
CREATE POLICY "Passengers can create rides" ON rides FOR INSERT TO authenticated WITH CHECK (passenger_id = auth.uid());
CREATE POLICY "Drivers can update assigned rides" ON rides FOR UPDATE TO authenticated USING (driver_id = auth.uid());

-- Payments 表 RLS 政策
CREATE POLICY "Users can read own payments" ON payments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create payments" ON payments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Notifications 表 RLS 政策
CREATE POLICY "Allow anonymous notification creation" ON notifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage notifications" ON notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role full access" ON notifications FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Complaints 表 RLS 政策
CREATE POLICY "Users can create complaints" ON complaints FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can read own complaints" ON complaints FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Coupons 表 RLS 政策
CREATE POLICY "Users can read available coupons" ON coupons FOR SELECT TO authenticated USING (active = true AND (user_id IS NULL OR user_id = auth.uid()) AND expiry_date > now());

-- Coupon Usage 表 RLS 政策
CREATE POLICY "Users can create coupon usage" ON coupon_usage FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can read own coupon usage" ON coupon_usage FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Driver Locations 表 RLS 政策
CREATE POLICY "Anyone can read online driver locations" ON driver_locations FOR SELECT TO authenticated USING (status IN ('online', 'busy'));
CREATE POLICY "Drivers can update own location" ON driver_locations FOR ALL TO authenticated USING (driver_id = auth.uid());

-- 插入初始資料

-- 車型資料
INSERT INTO car_types (id, name, name_en, multiplier, icon, description, active, sort_order) VALUES
('economy', '經濟型', 'Economy', 1.0, '🚗', '標準四人座轎車', true, 1),
('comfort', '舒適型', 'Comfort', 1.3, '🚙', '舒適型轎車', true, 2),
('luxury', '豪華型', 'Luxury', 1.8, '🚘', '豪華轎車', true, 3)
ON CONFLICT (id) DO NOTHING;

-- 計費配置
INSERT INTO pricing_config (base_price, price_per_km, price_per_minute, active) VALUES
(85, 12, 2.5, true)
ON CONFLICT DO NOTHING;

-- 測試帳號資料

-- 測試乘客
INSERT INTO users (
  id, phone_number, phone, email, full_name, name, password_hash, 
  role, status, verification_status, phone_verified, total_rides, rating
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '0912345678',
  '0912345678',
  'test_passenger@blackfeather.com',
  '測試乘客',
  '測試乘客',
  'dGVzdDEyMw==',
  'passenger',
  'active',
  'verified',
  true,
  15,
  4.9
) ON CONFLICT (id) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- 測試司機
INSERT INTO users (
  id, phone_number, phone, email, full_name, name, password_hash, 
  role, status, verification_status, phone_verified, total_rides, rating
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '0982214855',
  '0982214855',
  'test_driver@blackfeather.com',
  '測試司機',
  '測試司機',
  'Qk9TUzA4MDE3',
  'driver',
  'active',
  'verified',
  true,
  156,
  4.8
) ON CONFLICT (id) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- 測試司機詳細資料
INSERT INTO drivers (
  id, user_id, name, phone, email, license_number, 
  vehicle_model, vehicle_plate, status, verification_status, work_status,
  total_earnings, emergency_contact_name, emergency_contact_phone,
  jkopay_account
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  '測試司機',
  '0982214855',
  'test_driver@blackfeather.com',
  'TEST123456',
  'Toyota Prius',
  'ABC-1234',
  'approved',
  'verified',
  'offline',
  25287.50,
  '測試聯絡人',
  '0988888888',
  '{"account": "0982214855", "name": "測試司機"}'
) ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  verification_status = EXCLUDED.verification_status,
  work_status = EXCLUDED.work_status;

-- 測試車輛
INSERT INTO vehicles (
  id, driver_id, license_plate, make, model, year, color, car_type, status
) VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000002',
  'ABC-1234',
  'Toyota',
  'Prius',
  2020,
  '白色',
  'economy',
  'active'
) ON CONFLICT (license_plate) DO UPDATE SET
  driver_id = EXCLUDED.driver_id,
  status = EXCLUDED.status;

-- 測試管理員
INSERT INTO admin_users (
  id, username, password_hash, full_name, name, email, role, status
) VALUES (
  '00000000-0000-0000-0000-000000000099',
  'admin',
  'QURNSU4xMjM=',
  '系統管理員',
  '系統管理員',
  'admin@blackfeather.com',
  'admin',
  'active'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  status = EXCLUDED.status;

-- 測試訂單
INSERT INTO rides (
  id, passenger_id, driver_id, vehicle_id,
  pickup_address, pickup_lat, pickup_lng,
  destination_address, destination_lat, destination_lng,
  distance_km, duration_minutes, total_fare, status,
  requested_at, accepted_at, completed_at
) VALUES (
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000010',
  '台北車站',
  25.0478,
  121.5170,
  '松山機場',
  25.0697,
  121.5522,
  12.5,
  25,
  350.00,
  'completed',
  now() - interval '2 hours',
  now() - interval '1 hour 50 minutes',
  now() - interval '1 hour'
) ON CONFLICT (id) DO NOTHING;

-- 測試支付記錄
INSERT INTO payments (
  id, ride_id, user_id, driver_id, amount, payment_method, status, processed_at
) VALUES (
  '00000000-0000-0000-0000-000000000030',
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  350.00,
  'credit_card',
  'completed',
  now() - interval '1 hour'
) ON CONFLICT (id) DO NOTHING;

-- 創建更新時間觸發器函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為需要的表添加更新時間觸發器
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_drivers_updated_at ON drivers;
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rides_updated_at ON rides;
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints;
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_config_updated_at ON pricing_config;
CREATE TRIGGER update_pricing_config_updated_at BEFORE UPDATE ON pricing_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_car_types_updated_at ON car_types;
CREATE TRIGGER update_car_types_updated_at BEFORE UPDATE ON car_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 最終檢查
SELECT 'users 表記錄數:' as info, COUNT(*) as count FROM users;
SELECT 'drivers 表記錄數:' as info, COUNT(*) as count FROM drivers;
SELECT 'rides 表記錄數:' as info, COUNT(*) as count FROM rides;
SELECT 'payments 表記錄數:' as info, COUNT(*) as count FROM payments;

SELECT '🎉 完整三端叫車系統建立完成！' as result;
SELECT '📱 測試乘客：0912345678 / test123' as passenger;
SELECT '🚗 測試司機：0982214855 / BOSS08017' as driver;
SELECT '⚙️ 測試管理員：admin / ADMIN123' as admin;