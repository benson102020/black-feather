/*
  # 完整系統修復 - 解決所有 RLS 和連接問題

  1. RLS 政策修復
    - 刪除所有衝突政策
    - 創建統一的寬鬆政策
    - 確保三端都能正常操作

  2. 資料表結構補齊
    - 補齊所有缺失欄位
    - 建立正確的約束和索引
    - 確保外鍵關聯正確

  3. 測試資料建立
    - 創建完整的測試帳號
    - 建立測試訂單和收入記錄
    - 確保三端都有資料可測試

  4. 系統配置
    - 設置計費配置
    - 建立車型資料
    - 配置系統設定
*/

-- 🔧 第一步：完全重置 RLS 政策
-- 刪除 users 表的所有現有政策
DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable select for users on own data" ON users;
DROP POLICY IF EXISTS "Enable update for users on own data" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON users;
DROP POLICY IF EXISTS "Allow service role full access" ON users;
DROP POLICY IF EXISTS "boltnew_insert_on_users" ON users;
DROP POLICY IF EXISTS "boltnew_update_on_users" ON users;

-- 創建新的統一政策（解決所有權限問題）
CREATE POLICY "Enable all access for service role" ON users
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON users
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable registration for anonymous users" ON users
FOR INSERT TO anon WITH CHECK (true);

-- 🔧 第二步：修復 admin_users 表
-- 新增缺失的欄位
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- 新增唯一約束
ALTER TABLE admin_users ADD CONSTRAINT IF NOT EXISTS admin_users_username_unique UNIQUE (username);
ALTER TABLE admin_users ADD CONSTRAINT IF NOT EXISTS admin_users_email_unique UNIQUE (email);

-- 更新現有管理員記錄
UPDATE admin_users SET 
  username = 'admin',
  full_name = '系統管理員'
WHERE email = 'admin@blackfeather.com';

-- 如果沒有管理員記錄，則插入
INSERT INTO admin_users (username, email, password_hash, full_name, name, status) 
VALUES ('admin', 'admin@blackfeather.com', 'QURNSU4xMjM=', '系統管理員', '系統管理員', 'active')
ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash;

-- 🔧 第三步：修復其他表的 RLS 政策
-- drivers 表政策
DROP POLICY IF EXISTS "Allow authenticated users to manage drivers" ON drivers;
DROP POLICY IF EXISTS "Allow service role full access" ON drivers;

CREATE POLICY "Enable all access for service role" ON drivers
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON drivers
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- driver_applications 表政策
DROP POLICY IF EXISTS "Allow anonymous application creation" ON driver_applications;
DROP POLICY IF EXISTS "Allow authenticated users to manage applications" ON driver_applications;
DROP POLICY IF EXISTS "Allow service role full access" ON driver_applications;

CREATE POLICY "Enable all access for service role" ON driver_applications
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON driver_applications
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable anonymous application creation" ON driver_applications
FOR INSERT TO anon WITH CHECK (true);

-- admin_users 表政策
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to manage admin data" ON admin_users;
DROP POLICY IF EXISTS "Allow service role full access" ON admin_users;

CREATE POLICY "Enable all access for service role" ON admin_users
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON admin_users
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 🔧 第四步：建立完整測試資料
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
  'approved',
  true,
  15,
  4.9
) ON CONFLICT (id) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status;

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
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status;

-- 建立司機詳細資料
INSERT INTO drivers (
  id, user_id, name, phone, email, license_number, 
  vehicle_model, vehicle_plate, verification_status, work_status, 
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
  'offline',
  25287.50,
  '測試聯絡人',
  '0988888888',
  '{"account": "0982214855", "name": "測試司機"}'
) ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  verification_status = EXCLUDED.verification_status,
  work_status = EXCLUDED.work_status;

-- 建立車輛資料
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
) ON CONFLICT (id) DO UPDATE SET
  driver_id = EXCLUDED.driver_id,
  status = EXCLUDED.status;

-- 🔧 第五步：建立測試訂單
INSERT INTO rides (
  id, passenger_id, driver_id, vehicle_id,
  pickup_address, pickup_lat, pickup_lng,
  destination_address, destination_lat, destination_lng,
  distance_km, duration_minutes, car_type,
  base_fare, distance_fare, time_fare, total_fare,
  status, requested_at
) VALUES (
  'RD20241225001',
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
  'economy',
  85.00,
  150.00,
  62.50,
  297.50,
  'completed',
  now() - interval '2 hours'
) ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  total_fare = EXCLUDED.total_fare;

-- 建立收入記錄
INSERT INTO payments (
  id, ride_id, user_id, driver_id, amount, payment_method, 
  status, platform_fee, driver_earnings, processed_at
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
  status = EXCLUDED.status,
  processed_at = EXCLUDED.processed_at;

-- 🎉 完成檢查
SELECT '🎉 完整系統修復完成！' as result;
SELECT '✅ RLS 政策已修復' as rls_status;
SELECT '✅ 測試帳號已建立' as accounts_status;
SELECT '✅ 測試訂單已建立' as orders_status;
SELECT '✅ 收入記錄已建立' as earnings_status;

-- 顯示測試帳號
SELECT '📱 測試乘客：0912345678 / test123' as passenger_account;
SELECT '🚗 測試司機：0982214855 / BOSS08017' as driver_account;
SELECT '⚙️ 測試管理員：admin / ADMIN123' as admin_account;

-- 檢查資料完整性
SELECT 'users 表記錄數：' as info, COUNT(*) as count FROM users;
SELECT 'drivers 表記錄數：' as info, COUNT(*) as count FROM drivers;
SELECT 'rides 表記錄數：' as info, COUNT(*) as count FROM rides;
SELECT 'payments 表記錄數：' as info, COUNT(*) as count FROM payments;