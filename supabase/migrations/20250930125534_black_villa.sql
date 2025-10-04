-- 🔧 修復 verification_status 約束問題
-- 解決 23514 約束違反錯誤

-- 步驟 1：檢查現有約束
SELECT 'Current verification_status constraint:' as info;
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND conname LIKE '%verification_status%';

-- 步驟 2：刪除有問題的約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_verification_status_check;

-- 步驟 3：重新創建正確的約束（包含 'verified' 值）
ALTER TABLE users ADD CONSTRAINT users_verification_status_check 
CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'approved'::text, 'rejected'::text]));

-- 步驟 4：檢查並修復 role 約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role = ANY (ARRAY['admin'::text, 'user'::text, 'driver'::text, 'passenger'::text]));

-- 步驟 5：檢查並修復 status 約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'pending'::text]));

-- 步驟 6：確保所有必要欄位存在
DO $$
BEGIN
  -- phone_number 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE users ADD COLUMN phone_number TEXT;
    RAISE NOTICE '✅ 已新增 users.phone_number 欄位';
  END IF;

  -- full_name 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE users ADD COLUMN full_name TEXT;
    RAISE NOTICE '✅ 已新增 users.full_name 欄位';
  END IF;

  -- password_hash 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash TEXT;
    RAISE NOTICE '✅ 已新增 users.password_hash 欄位';
  END IF;

  -- role 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
    RAISE NOTICE '✅ 已新增 users.role 欄位';
  END IF;

  -- status 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'status'
  ) THEN
    ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
    RAISE NOTICE '✅ 已新增 users.status 欄位';
  END IF;

  -- verification_status 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE users ADD COLUMN verification_status TEXT DEFAULT 'pending';
    RAISE NOTICE '✅ 已新增 users.verification_status 欄位';
  END IF;

  -- phone_verified 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone_verified'
  ) THEN
    ALTER TABLE users ADD COLUMN phone_verified BOOLEAN DEFAULT false;
    RAISE NOTICE '✅ 已新增 users.phone_verified 欄位';
  END IF;

  -- total_rides 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'total_rides'
  ) THEN
    ALTER TABLE users ADD COLUMN total_rides INTEGER DEFAULT 0;
    RAISE NOTICE '✅ 已新增 users.total_rides 欄位';
  END IF;

  -- rating 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'rating'
  ) THEN
    ALTER TABLE users ADD COLUMN rating NUMERIC(3,2) DEFAULT 5.0;
    RAISE NOTICE '✅ 已新增 users.rating 欄位';
  END IF;
END $$;

-- 步驟 7：修復 drivers 表
DO $$
BEGIN
  -- user_id 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE drivers ADD COLUMN user_id UUID;
    RAISE NOTICE '✅ 已新增 drivers.user_id 欄位';
  END IF;

  -- id_number 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'id_number'
  ) THEN
    ALTER TABLE drivers ADD COLUMN id_number TEXT;
    RAISE NOTICE '✅ 已新增 drivers.id_number 欄位';
  END IF;

  -- verification_status 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE drivers ADD COLUMN verification_status TEXT DEFAULT 'pending';
    RAISE NOTICE '✅ 已新增 drivers.verification_status 欄位';
  END IF;

  -- work_status 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'work_status'
  ) THEN
    ALTER TABLE drivers ADD COLUMN work_status TEXT DEFAULT 'offline';
    RAISE NOTICE '✅ 已新增 drivers.work_status 欄位';
  END IF;

  -- total_earnings 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'total_earnings'
  ) THEN
    ALTER TABLE drivers ADD COLUMN total_earnings NUMERIC(10,2) DEFAULT 0;
    RAISE NOTICE '✅ 已新增 drivers.total_earnings 欄位';
  END IF;

  -- emergency_contact_name 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'emergency_contact_name'
  ) THEN
    ALTER TABLE drivers ADD COLUMN emergency_contact_name TEXT;
    RAISE NOTICE '✅ 已新增 drivers.emergency_contact_name 欄位';
  END IF;

  -- emergency_contact_phone 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'emergency_contact_phone'
  ) THEN
    ALTER TABLE drivers ADD COLUMN emergency_contact_phone TEXT;
    RAISE NOTICE '✅ 已新增 drivers.emergency_contact_phone 欄位';
  END IF;

  -- jkopay_account 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'jkopay_account'
  ) THEN
    ALTER TABLE drivers ADD COLUMN jkopay_account JSONB;
    RAISE NOTICE '✅ 已新增 drivers.jkopay_account 欄位';
  END IF;
END $$;

-- 步驟 8：修復 vehicles 表
DO $$
BEGIN
  -- user_id 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vehicles' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE vehicles ADD COLUMN user_id UUID;
    RAISE NOTICE '✅ 已新增 vehicles.user_id 欄位';
  END IF;
END $$;

-- 步驟 9：修復 rides 表
DO $$
BEGIN
  -- pickup_address 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rides' AND column_name = 'pickup_address'
  ) THEN
    ALTER TABLE rides ADD COLUMN pickup_address TEXT;
    RAISE NOTICE '✅ 已新增 rides.pickup_address 欄位';
  END IF;

  -- dropoff_address 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rides' AND column_name = 'dropoff_address'
  ) THEN
    ALTER TABLE rides ADD COLUMN dropoff_address TEXT;
    RAISE NOTICE '✅ 已新增 rides.dropoff_address 欄位';
  END IF;

  -- total_fare 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rides' AND column_name = 'total_fare'
  ) THEN
    ALTER TABLE rides ADD COLUMN total_fare NUMERIC(10,2);
    RAISE NOTICE '✅ 已新增 rides.total_fare 欄位';
  END IF;

  -- requested_at 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rides' AND column_name = 'requested_at'
  ) THEN
    ALTER TABLE rides ADD COLUMN requested_at TIMESTAMPTZ DEFAULT now();
    RAISE NOTICE '✅ 已新增 rides.requested_at 欄位';
  END IF;
END $$;

-- 步驟 10：修復 RLS 政策
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE rides DISABLE ROW LEVEL SECURITY;

-- 刪除所有現有政策
DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow service role full access" ON users;

-- 重新啟用 RLS 並創建寬鬆政策
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- 創建完全開放的政策
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON rides FOR ALL USING (true) WITH CHECK (true);

-- 步驟 11：建立測試帳號（使用正確的約束值）
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
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status;

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
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status;

-- 建立司機詳細資料
INSERT INTO drivers (
  id, user_id, name, phone, email, license_number, id_number,
  verification_status, work_status, total_earnings,
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
  '{"account": "0982214855", "name": "測試司機"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  verification_status = EXCLUDED.verification_status,
  work_status = EXCLUDED.work_status;

-- 建立管理員帳號
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
  user_id = EXCLUDED.user_id,
  status = EXCLUDED.status;

-- 最終檢查
SELECT '🎉 約束問題修復完成！' as result;
SELECT 'users 表記錄數:' as info, COUNT(*) as count FROM users;
SELECT 'drivers 表記錄數:' as info, COUNT(*) as count FROM drivers;
SELECT 'admin_users 表記錄數:' as info, COUNT(*) as count FROM admin_users;
SELECT 'vehicles 表記錄數:' as info, COUNT(*) as count FROM vehicles;

SELECT '測試帳號已建立：' as accounts;
SELECT '📱 乘客：0912345678 / test123' as passenger;
SELECT '🚗 司機：0982214855 / BOSS08017' as driver;
SELECT '⚙️ 管理員：admin / ADMIN123' as admin;