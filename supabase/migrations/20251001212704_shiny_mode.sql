-- 🔑 BOSS666 最終修復腳本
-- 解決所有約束和外鍵問題

-- 步驟 1：修復所有約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_verification_status_check;
ALTER TABLE users ADD CONSTRAINT users_verification_status_check 
CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'approved'::text, 'rejected'::text]));

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role = ANY (ARRAY['admin'::text, 'user'::text, 'driver'::text, 'passenger'::text]));

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'pending'::text]));

-- 步驟 2：補齊所有缺失欄位
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_rides INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 5.0;

ALTER TABLE drivers ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS id_number TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS work_status TEXT DEFAULT 'offline';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS total_earnings NUMERIC(12,2) DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS jkopay_account JSONB;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS vehicle_model TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS vehicle_plate TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS vehicle_year TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS vehicle_color TEXT;

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE rides ADD COLUMN IF NOT EXISTS pickup_address TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS dropoff_address TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS total_fare NUMERIC(10,2);
ALTER TABLE rides ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE rides ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS calculated_fare NUMERIC(10,2);

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role_id UUID;

-- 步驟 3：修正所有外鍵約束
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_driver_id_fkey;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE rides DROP CONSTRAINT IF EXISTS rides_driver_id_fkey;
ALTER TABLE rides ADD CONSTRAINT rides_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE rides DROP CONSTRAINT IF EXISTS rides_passenger_id_fkey;
ALTER TABLE rides ADD CONSTRAINT rides_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
ALTER TABLE payments ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 步驟 4：修復 RLS 政策
DROP POLICY IF EXISTS "Allow anonymous user registration" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow anonymous registration" ON users;

CREATE POLICY "Allow all operations for authenticated users" ON users
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous registration" ON users
FOR INSERT TO anon WITH CHECK (true);

-- 步驟 5：建立完整測試帳號
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
  role = EXCLUDED.role,
  status = EXCLUDED.status;

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
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- 建立司機詳細資料
INSERT INTO drivers (
  id, user_id, name, phone, email, license_number, 
  id_number, verification_status, work_status, total_earnings,
  emergency_contact_name, emergency_contact_phone,
  jkopay_account, vehicle_model, vehicle_plate, vehicle_year, vehicle_color
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
  '{"account": "0982214855", "name": "測試司機"}',
  'Toyota Prius',
  'ABC-1234',
  '2020',
  '白色'
) ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  verification_status = EXCLUDED.verification_status,
  work_status = EXCLUDED.work_status;

-- 建立車輛資料
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
) ON CONFLICT (id) DO UPDATE SET
  driver_id = EXCLUDED.driver_id,
  user_id = EXCLUDED.user_id;

-- 確保 admin 角色存在
INSERT INTO roles (role_name, permissions, description)
VALUES ('admin', '["manage_users", "manage_orders", "view_reports"]'::jsonb, 'System Administrator Role')
ON CONFLICT (role_name) DO NOTHING;

-- 建立管理員帳號
INSERT INTO admin_users (
  id, username, password_hash, full_name, name, email, 
  role_id, status
) VALUES (
  '00000000-0000-0000-0000-000000000099',
  'admin',
  'QURNSU4xMjM=',
  '系統管理員',
  '系統管理員',
  'admin@blackfeather.com',
  (SELECT id FROM roles WHERE role_name = 'admin'),
  'active'
) ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  status = EXCLUDED.status;

-- 建立測試訂單
INSERT INTO rides (
  id, passenger_id, driver_id, vehicle_id, status,
  pickup_address, pickup_lat, pickup_lng,
  destination_address, destination_lat, destination_lng,
  dropoff_address, distance_km, duration_minutes,
  base_fare, distance_fare, time_fare, total_fare,
  customer_name, customer_phone, calculated_fare,
  requested_at, accepted_at, completed_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
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
  total_fare = EXCLUDED.total_fare;

-- 建立收入記錄（只使用 payments 表實際存在的欄位）
INSERT INTO payments (
  id, ride_id, user_id, amount, payment_method, status, processed_at
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  297.50,
  'credit_card',
  'completed',
  now() - interval '1 hour'
) ON CONFLICT (id) DO UPDATE SET
  amount = EXCLUDED.amount,
  status = EXCLUDED.status;

-- 建立通知記錄
INSERT INTO notifications (
  id, user_id, title, message, type, is_read, created_at
) VALUES (
  'c0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '歡迎加入 Black feather',
  '恭喜您成為 Black feather 的司機！開始您的第一趟行程吧。',
  'system',
  false,
  now()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message;

-- 最終檢查
SELECT '🎉 BOSS666 修復完成！' as result;
SELECT '📱 乘客測試帳號：0912345678 / test123' as passenger_account;
SELECT '🚗 司機測試帳號：0982214855 / BOSS08017' as driver_account;
SELECT '⚙️ 管理員測試帳號：admin / ADMIN123' as admin_account;

-- 檢查資料表狀態
SELECT 'users 表記錄數:' as info, COUNT(*) as count FROM users;
SELECT 'drivers 表記錄數:' as info, COUNT(*) as count FROM drivers;
SELECT 'vehicles 表記錄數:' as info, COUNT(*) as count FROM vehicles;
SELECT 'rides 表記錄數:' as info, COUNT(*) as count FROM rides;
SELECT 'admin_users 表記錄數:' as info, COUNT(*) as count FROM admin_users;