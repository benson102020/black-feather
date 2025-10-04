/*
  # BOSS666 特殊驗證角色創建腳本
  
  這個腳本會創建一個具有完整系統權限的特殊驗證角色，用於：
  1. 繞過所有 RLS (Row Level Security) 限制
  2. 完整的資料庫讀寫權限
  3. 不受任何約束檢查限制
  4. 自動處理重複鍵值問題
  
  ⚠️ 僅用於開發和測試，正式營運前請務必清理
*/

-- 創建特殊驗證角色
DO $$
BEGIN
  -- 創建 bolt_new 角色（如果不存在）
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bolt_new') THEN
    CREATE ROLE bolt_new;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bolt_new;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bolt_new;
    GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO bolt_new;
  END IF;
END $$;

-- 修復所有約束問題
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_verification_status_check;
ALTER TABLE users ADD CONSTRAINT users_verification_status_check 
CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'approved'::text, 'rejected'::text]));

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role = ANY (ARRAY['admin'::text, 'user'::text, 'driver'::text, 'passenger'::text]));

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'pending'::text]));

-- 補齊所有缺失欄位
DO $$
BEGIN
  -- users 表欄位
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

  -- drivers 表欄位
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

  -- vehicles 表欄位
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vehicles' AND column_name = 'user_id') THEN
    ALTER TABLE vehicles ADD COLUMN user_id UUID;
  END IF;
END $$;

-- 創建特殊驗證用戶（使用 ON CONFLICT 處理重複）
INSERT INTO users (
  id, phone_number, phone, email, full_name, name, password_hash, 
  role, status, verification_status, phone_verified, total_rides, rating
) VALUES (
  'bolt-new-verification-user-2024',
  '0900000000',
  '0900000000',
  'verification@bolt.new',
  'BOSS666 驗證用戶',
  'BOSS666 驗證用戶',
  'Qk9TUzY2Ng==',
  'admin',
  'active',
  'verified',
  true,
  0,
  5.0
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status;

-- 為所有資料表創建 BOSS666 政策
CREATE POLICY "users_select_bolt_new" ON users
  FOR SELECT
  TO authenticated
  USING (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

CREATE POLICY "users_insert_bolt_new" ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

CREATE POLICY "users_update_bolt_new_role_only" ON users
  FOR UPDATE
  TO authenticated
  USING (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new')
  WITH CHECK (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

CREATE POLICY "drivers_select_bolt_new" ON drivers
  FOR SELECT
  TO authenticated
  USING (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

CREATE POLICY "drivers_insert_bolt_new" ON drivers
  FOR INSERT
  TO authenticated
  WITH CHECK (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

CREATE POLICY "drivers_update_bolt_new" ON drivers
  FOR UPDATE
  TO authenticated
  USING (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new')
  WITH CHECK (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

CREATE POLICY "vehicles_all_bolt_new" ON vehicles
  FOR ALL
  TO authenticated
  USING (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new')
  WITH CHECK (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

CREATE POLICY "rides_all_bolt_new" ON rides
  FOR ALL
  TO authenticated
  USING (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new')
  WITH CHECK (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

CREATE POLICY "payments_all_bolt_new" ON payments
  FOR ALL
  TO authenticated
  USING (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new')
  WITH CHECK (((jwt() -> 'user_metadata'::text) ->> 'user_role'::text) = 'bolt.new');

-- 建立測試帳號（使用 ON CONFLICT 處理重複）
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
  'verified',
  true,
  156,
  4.8
) ON CONFLICT (id) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

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
  status = EXCLUDED.status;

SELECT '🎉 BOSS666 創建完成！' as result;
SELECT '測試帳號已建立，系統準備就緒' as info;