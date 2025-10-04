-- 🔧 清理並重建 RLS 政策
-- 解決政策衝突問題

-- 步驟 1：完全清理 users 表的所有 RLS 政策
DROP POLICY IF EXISTS "Allow all operations for everyone" ON users;
DROP POLICY IF EXISTS "users_update_bolt_new_role_only" ON users;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON users;
DROP POLICY IF EXISTS "Allow service role full access" ON users;
DROP POLICY IF EXISTS "bolt_new_select" ON users;
DROP POLICY IF EXISTS "bolt_new_insert" ON users;
DROP POLICY IF EXISTS "bolt_new_update" ON users;
DROP POLICY IF EXISTS "users_select_bolt_new" ON users;
DROP POLICY IF EXISTS "users_insert_bolt_new" ON users;
DROP POLICY IF EXISTS "Allow anonymous user registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON users;

-- 步驟 2：清理其他表的政策
DROP POLICY IF EXISTS "Allow all operations for everyone" ON drivers;
DROP POLICY IF EXISTS "Allow authenticated users to manage drivers" ON drivers;
DROP POLICY IF EXISTS "Allow service role full access" ON drivers;

DROP POLICY IF EXISTS "Allow all operations for everyone" ON vehicles;
DROP POLICY IF EXISTS "Allow authenticated users to manage vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow service role full access" ON vehicles;

DROP POLICY IF EXISTS "Allow all operations for everyone" ON rides;
DROP POLICY IF EXISTS "Users can read own rides" ON rides;
DROP POLICY IF EXISTS "Passengers can create rides" ON rides;
DROP POLICY IF EXISTS "Drivers can update assigned rides" ON rides;

DROP POLICY IF EXISTS "Allow all operations for everyone" ON payments;
DROP POLICY IF EXISTS "Users can read own payments" ON payments;
DROP POLICY IF EXISTS "Users can create payments" ON payments;

-- 步驟 3：重新建立簡潔的政策

-- Users 表政策
CREATE POLICY "users_full_access" ON users
FOR ALL TO public USING (true) WITH CHECK (true);

-- Drivers 表政策  
CREATE POLICY "drivers_full_access" ON drivers
FOR ALL TO public USING (true) WITH CHECK (true);

-- Vehicles 表政策
CREATE POLICY "vehicles_full_access" ON vehicles
FOR ALL TO public USING (true) WITH CHECK (true);

-- Rides 表政策
CREATE POLICY "rides_full_access" ON rides
FOR ALL TO public USING (true) WITH CHECK (true);

-- Payments 表政策
CREATE POLICY "payments_full_access" ON payments
FOR ALL TO public USING (true) WITH CHECK (true);

-- Notifications 表政策
CREATE POLICY "notifications_full_access" ON notifications
FOR ALL TO public USING (true) WITH CHECK (true);

-- Admin_users 表政策
CREATE POLICY "admin_users_full_access" ON admin_users
FOR ALL TO public USING (true) WITH CHECK (true);

-- 步驟 4：確保所有約束正確

-- 修復 verification_status 約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_verification_status_check;
ALTER TABLE users ADD CONSTRAINT users_verification_status_check 
CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'approved'::text, 'rejected'::text]));

-- 修復 role 約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role = ANY (ARRAY['admin'::text, 'user'::text, 'driver'::text, 'passenger'::text]));

-- 修復 status 約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'pending'::text]));

-- 步驟 5：補齊缺失欄位
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
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

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE rides ADD COLUMN IF NOT EXISTS pickup_address TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS dropoff_address TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS total_fare NUMERIC(10,2);
ALTER TABLE rides ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE rides ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE rides ADD COLUMN IF NOT EXISTS calculated_fare NUMERIC(10,2);

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 步驟 6：建立/更新測試帳號

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

-- 司機詳細資料
INSERT INTO drivers (
  id, user_id, name, phone, email, license_number, 
  id_number, verification_status, work_status, total_earnings,
  emergency_contact_name, emergency_contact_phone, jkopay_account
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

-- 確保 roles 表有 admin 角色
INSERT INTO roles (role_name, permissions, description)
VALUES ('admin', '["manage_users", "manage_orders", "view_reports"]'::jsonb, 'System Administrator Role')
ON CONFLICT (role_name) DO UPDATE SET
  permissions = EXCLUDED.permissions,
  description = EXCLUDED.description;

-- 管理員帳號
INSERT INTO admin_users (
  id, username, password_hash, full_name, name, email, role_id, status
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
  full_name = EXCLUDED.full_name,
  name = EXCLUDED.name,
  role_id = EXCLUDED.role_id,
  status = EXCLUDED.status;

-- 最終確認
SELECT '🎉 RLS 政策已完全重建！' as result;
SELECT '✅ 所有約束問題已修復' as constraint_fix;
SELECT '✅ 測試帳號已建立/更新' as accounts_ready;

-- 顯示測試帳號
SELECT '📱 乘客測試帳號：0912345678 / test123' as passenger_account;
SELECT '🚗 司機測試帳號：0982214855 / BOSS08017' as driver_account;
SELECT '⚙️ 管理員測試帳號：admin / ADMIN123' as admin_account;

-- 檢查政策狀態
SELECT 'users 表政策數量:' as info, COUNT(*) as count FROM pg_policies WHERE tablename = 'users';
SELECT 'users 表記錄數:' as info, COUNT(*) as count FROM users;
SELECT 'drivers 表記錄數:' as info, COUNT(*) as count FROM drivers;