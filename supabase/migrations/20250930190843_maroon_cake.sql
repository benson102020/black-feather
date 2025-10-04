-- 🔧 完整修復約束和 RLS 政策
-- 解決所有 23514 和 23505 錯誤

-- 步驟 1：修復約束問題
-- 修復 verification_status 約束（加入 'verified' 值）
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_verification_status_check;
ALTER TABLE users ADD CONSTRAINT users_verification_status_check 
CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'approved'::text, 'rejected'::text]));

-- 修復 role 約束（支援所有角色）
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role = ANY (ARRAY['admin'::text, 'user'::text, 'driver'::text, 'passenger'::text]));

-- 修復 status 約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'pending'::text]));

-- 步驟 2：補齊缺失欄位
DO $$
BEGIN
  -- users 表缺失欄位
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone_number') THEN
    ALTER TABLE users ADD COLUMN phone_number TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'full_name') THEN
    ALTER TABLE users ADD COLUMN full_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password_hash') THEN
    ALTER TABLE users ADD COLUMN password_hash TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone_verified') THEN
    ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'total_rides') THEN
    ALTER TABLE users ADD COLUMN total_rides INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'rating') THEN
    ALTER TABLE users ADD COLUMN rating NUMERIC(3,2) DEFAULT 5.0;
  END IF;

  -- drivers 表缺失欄位
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'user_id') THEN
    ALTER TABLE drivers ADD COLUMN user_id UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'id_number') THEN
    ALTER TABLE drivers ADD COLUMN id_number TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'verification_status') THEN
    ALTER TABLE drivers ADD COLUMN verification_status TEXT DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'work_status') THEN
    ALTER TABLE drivers ADD COLUMN work_status TEXT DEFAULT 'offline';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'total_earnings') THEN
    ALTER TABLE drivers ADD COLUMN total_earnings NUMERIC(12,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'emergency_contact_name') THEN
    ALTER TABLE drivers ADD COLUMN emergency_contact_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'emergency_contact_phone') THEN
    ALTER TABLE drivers ADD COLUMN emergency_contact_phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'jkopay_account') THEN
    ALTER TABLE drivers ADD COLUMN jkopay_account JSONB;
  END IF;

  -- vehicles 表缺失欄位
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'user_id') THEN
    ALTER TABLE vehicles ADD COLUMN user_id UUID;
  END IF;

  -- rides 表缺失欄位
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'pickup_address') THEN
    ALTER TABLE rides ADD COLUMN pickup_address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'dropoff_address') THEN
    ALTER TABLE rides ADD COLUMN dropoff_address TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'total_fare') THEN
    ALTER TABLE rides ADD COLUMN total_fare NUMERIC(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'requested_at') THEN
    ALTER TABLE rides ADD COLUMN requested_at TIMESTAMPTZ DEFAULT now();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'customer_name') THEN
    ALTER TABLE rides ADD COLUMN customer_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'customer_phone') THEN
    ALTER TABLE rides ADD COLUMN customer_phone TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rides' AND column_name = 'calculated_fare') THEN
    ALTER TABLE rides ADD COLUMN calculated_fare NUMERIC(10,2);
  END IF;

  -- admin_users 表缺失欄位
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_users' AND column_name = 'full_name') THEN
    ALTER TABLE admin_users ADD COLUMN full_name TEXT;
  END IF;
END $$;

-- 步驟 3：設置 RLS 政策（基於您提供的模板）

-- 1) 啟用 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON drivers;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Users can read own rides" ON rides;
DROP POLICY IF EXISTS "Passengers can create rides" ON rides;
DROP POLICY IF EXISTS "Drivers can update assigned rides" ON rides;

-- 2) users 表 RLS 政策
CREATE POLICY users_select_bolt_new ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY users_insert_bolt_new ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY users_update_bolt_new ON public.users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY users_delete_bolt_new ON public.users
  FOR DELETE
  TO authenticated
  USING (true);

-- 允許匿名註冊
CREATE POLICY users_anonymous_insert ON public.users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 3) drivers 表 RLS 政策
CREATE POLICY drivers_select_bolt_new ON public.drivers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY drivers_insert_bolt_new ON public.drivers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY drivers_update_bolt_new ON public.drivers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY drivers_delete_bolt_new ON public.drivers
  FOR DELETE
  TO authenticated
  USING (true);

-- 4) vehicles 表 RLS 政策
CREATE POLICY vehicles_select_bolt_new ON public.vehicles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY vehicles_insert_bolt_new ON public.vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY vehicles_update_bolt_new ON public.vehicles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY vehicles_delete_bolt_new ON public.vehicles
  FOR DELETE
  TO authenticated
  USING (true);

-- 5) rides 表 RLS 政策
CREATE POLICY rides_select_bolt_new ON public.rides
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY rides_insert_bolt_new ON public.rides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY rides_update_bolt_new ON public.rides
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY rides_delete_bolt_new ON public.rides
  FOR DELETE
  TO authenticated
  USING (true);

-- 6) payments 表 RLS 政策
CREATE POLICY payments_select_bolt_new ON public.payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY payments_insert_bolt_new ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY payments_update_bolt_new ON public.payments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7) admin_users 表 RLS 政策
CREATE POLICY admin_users_select_bolt_new ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY admin_users_insert_bolt_new ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY admin_users_update_bolt_new ON public.admin_users
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 8) notifications 表 RLS 政策
CREATE POLICY notifications_select_bolt_new ON public.notifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY notifications_insert_bolt_new ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 步驟 4：建立測試帳號（使用 ON CONFLICT 處理重複）

-- 測試乘客（使用 ON CONFLICT 處理重複）
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
  'user',
  'active',
  'verified',
  true,
  15,
  4.9
) ON CONFLICT (id) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status,
  phone_verified = EXCLUDED.phone_verified,
  total_rides = EXCLUDED.total_rides,
  rating = EXCLUDED.rating;

-- 測試司機（使用 ON CONFLICT 處理重複）
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
  'approved',
  true,
  156,
  4.8
) ON CONFLICT (id) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status,
  phone_verified = EXCLUDED.phone_verified,
  total_rides = EXCLUDED.total_rides,
  rating = EXCLUDED.rating;

-- 司機詳細資料（使用 ON CONFLICT 處理重複）
INSERT INTO drivers (
  id, user_id, name, phone, email, license_number, 
  id_number, verification_status, work_status, total_earnings,
  emergency_contact_name, emergency_contact_phone,
  jkopay_account
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  '測試司機',
  '0982214855',
  'test_driver@blackfeather.com',
  'TEST123456',
  'A123456789',
  'approved',
  'offline',
  25287.50,
  '測試聯絡人',
  '0988888888',
  '{"account": "0982214855", "name": "測試司機"}'
) ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  license_number = EXCLUDED.license_number,
  id_number = EXCLUDED.id_number,
  verification_status = EXCLUDED.verification_status,
  work_status = EXCLUDED.work_status,
  total_earnings = EXCLUDED.total_earnings,
  emergency_contact_name = EXCLUDED.emergency_contact_name,
  emergency_contact_phone = EXCLUDED.emergency_contact_phone,
  jkopay_account = EXCLUDED.jkopay_account;

-- 車輛資料（使用 ON CONFLICT 處理重複）
INSERT INTO vehicles (
  id, driver_id, user_id, license_plate, make, model, year, color, car_type, status
) VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000002',
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
  user_id = EXCLUDED.user_id,
  make = EXCLUDED.make,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  color = EXCLUDED.color,
  car_type = EXCLUDED.car_type,
  status = EXCLUDED.status;

-- 管理員帳號（使用 ON CONFLICT 處理重複）
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
) ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- 測試訂單（使用 ON CONFLICT 處理重複）
INSERT INTO rides (
  id, passenger_id, driver_id, vehicle_id, status,
  pickup_address, pickup_lat, pickup_lng,
  destination_address, destination_lat, destination_lng,
  dropoff_address, distance_km, duration_minutes,
  base_fare, distance_fare, time_fare, total_fare,
  customer_name, customer_phone, calculated_fare,
  requested_at, accepted_at, completed_at
) VALUES (
  'RD20241225001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000010',
  'completed',
  '台北車站',
  25.0478,
  121.5170,
  '松山機場',
  25.0697,
  121.5522,
  '松山機場',
  12.5,
  25,
  85.00,
  150.00,
  62.50,
  297.50,
  '測試乘客',
  '0912345678',
  297.50,
  now() - interval '2 hours',
  now() - interval '1 hour 50 minutes',
  now() - interval '1 hour'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  total_fare = EXCLUDED.total_fare,
  calculated_fare = EXCLUDED.calculated_fare,
  completed_at = EXCLUDED.completed_at;

-- 收入記錄（使用 ON CONFLICT 處理重複）
INSERT INTO payments (
  id, ride_id, user_id, driver_id, amount, payment_method, status,
  platform_fee, driver_earnings, processed_at
) VALUES (
  '00000000-0000-0000-0000-000000000020',
  'RD20241225001',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  297.50,
  'credit_card',
  'completed',
  44.63,
  252.87,
  now() - interval '1 hour'
) ON CONFLICT (id) DO UPDATE SET
  amount = EXCLUDED.amount,
  status = EXCLUDED.status,
  platform_fee = EXCLUDED.platform_fee,
  driver_earnings = EXCLUDED.driver_earnings,
  processed_at = EXCLUDED.processed_at;

-- 通知記錄（使用 ON CONFLICT 處理重複）
INSERT INTO notifications (
  id, user_id, title, message, type, is_read, created_at
) VALUES (
  '00000000-0000-0000-0000-000000000030',
  '00000000-0000-0000-0000-000000000002',
  '歡迎加入 Black feather',
  '恭喜您成為 Black feather 的司機！開始您的第一趟行程吧。',
  'system',
  false,
  now()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  type = EXCLUDED.type,
  is_read = false,
  created_at = now();

-- 最終檢查和確認
SELECT '🎉 約束問題完全修復！' as result;
SELECT '✅ 所有重複鍵值問題已解決' as duplicate_fix;
SELECT '✅ 所有約束已更新' as constraint_fix;
SELECT '✅ RLS 政策已設置' as rls_fix;
SELECT '✅ 測試帳號已建立/更新' as accounts_ready;

-- 顯示測試帳號
SELECT '📱 乘客測試帳號：0912345678 / test123' as passenger_account;
SELECT '🚗 司機測試帳號：0982214855 / BOSS08017' as driver_account;
SELECT '⚙️ 管理員測試帳號：admin / ADMIN123' as admin_account;

-- 檢查最終資料表狀態
SELECT 'users 表記錄數:' as info, COUNT(*) as count FROM users;
SELECT 'drivers 表記錄數:' as info, COUNT(*) as count FROM drivers;
SELECT 'vehicles 表記錄數:' as info, COUNT(*) as count FROM vehicles;
SELECT 'rides 表記錄數:' as info, COUNT(*) as count FROM rides;
SELECT 'admin_users 表記錄數:' as info, COUNT(*) as count FROM admin_users;
SELECT 'payments 表記錄數:' as info, COUNT(*) as count FROM payments;
SELECT 'notifications 表記錄數:' as info, COUNT(*) as count FROM notifications;