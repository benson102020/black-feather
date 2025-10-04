-- 🔧 安全的 RLS 政策修復腳本
-- 先檢查再創建，避免重複錯誤

-- 步驟 1：安全刪除現有政策（如果存在）
DO $$
BEGIN
    -- 刪除 users 表的現有政策
    DROP POLICY IF EXISTS "Allow authenticated users full access" ON users;
    DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
    DROP POLICY IF EXISTS "Users can read own data" ON users;
    DROP POLICY IF EXISTS "Users can update own data" ON users;
    DROP POLICY IF EXISTS "Enable all access for service role" ON users;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
    DROP POLICY IF EXISTS "Enable select for users on own data" ON users;
    DROP POLICY IF EXISTS "Enable update for users on own data" ON users;
    
    RAISE NOTICE '✅ 已清除 users 表的所有現有政策';
END $$;

-- 步驟 2：安全刪除其他表的政策
DO $$
BEGIN
    -- 刪除 drivers 表的現有政策
    DROP POLICY IF EXISTS "Allow authenticated users to manage drivers" ON drivers;
    DROP POLICY IF EXISTS "Allow service role full access" ON drivers;
    DROP POLICY IF EXISTS "Drivers can read own data" ON drivers;
    DROP POLICY IF EXISTS "Drivers can update own data" ON drivers;
    
    -- 刪除 driver_applications 表的現有政策
    DROP POLICY IF EXISTS "Allow anonymous application creation" ON driver_applications;
    DROP POLICY IF EXISTS "Allow authenticated users to manage applications" ON driver_applications;
    DROP POLICY IF EXISTS "Allow service role full access" ON driver_applications;
    
    -- 刪除 admin_users 表的現有政策
    DROP POLICY IF EXISTS "Allow authenticated users to manage admin data" ON admin_users;
    DROP POLICY IF EXISTS "Allow service role full access" ON admin_users;
    
    RAISE NOTICE '✅ 已清除所有表的現有政策';
END $$;

-- 步驟 3：創建新的寬鬆政策
CREATE POLICY "Allow all operations for authenticated users" ON users
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous user registration" ON users
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow all operations for service role" ON users
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 為 drivers 表創建政策
CREATE POLICY "Allow all operations for authenticated users" ON drivers
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for service role" ON drivers
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 為 driver_applications 表創建政策
CREATE POLICY "Allow anonymous application creation" ON driver_applications
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON driver_applications
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for service role" ON driver_applications
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 為 admin_users 表創建政策
CREATE POLICY "Allow all operations for authenticated users" ON admin_users
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for service role" ON admin_users
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 步驟 4：確保所有表都啟用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 步驟 5：補齊 admin_users 表缺失欄位
DO $$
BEGIN
    -- username 欄位
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admin_users' AND column_name = 'username'
    ) THEN
        ALTER TABLE admin_users ADD COLUMN username TEXT UNIQUE;
        RAISE NOTICE '✅ 已新增 admin_users.username 欄位';
    END IF;

    -- full_name 欄位
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'admin_users' AND column_name = 'full_name'
    ) THEN
        ALTER TABLE admin_users ADD COLUMN full_name TEXT;
        RAISE NOTICE '✅ 已新增 admin_users.full_name 欄位';
    END IF;
END $$;

-- 步驟 6：建立完整測試資料
DO $$
BEGIN
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
        'approved',
        true,
        15,
        4.9
    ) ON CONFLICT (id) DO UPDATE SET
        phone_number = EXCLUDED.phone_number,
        phone = EXCLUDED.phone,
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
        'approved',
        true,
        156,
        4.8
    ) ON CONFLICT (id) DO UPDATE SET
        phone_number = EXCLUDED.phone_number,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        status = EXCLUDED.status;

    -- 測試管理員
    INSERT INTO admin_users (
        id, username, password_hash, full_name, name, email, status
    ) VALUES (
        '00000000-0000-0000-0000-000000000099',
        'admin',
        'QURNSU4xMjM=',
        '系統管理員',
        '系統管理員',
        'admin@blackfeather.com',
        'active'
    ) ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        status = EXCLUDED.status;

    RAISE NOTICE '✅ 測試帳號建立完成';
END $$;

-- 步驟 7：建立司機詳細資料
DO $$
BEGIN
    INSERT INTO drivers (
        id, user_id, name, phone, email, license_number, 
        id_number, verification_status, work_status, total_earnings,
        emergency_contact_name, emergency_contact_phone,
        jkopay_account, vehicle_model, vehicle_plate
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
        'ABC-1234'
    ) ON CONFLICT (id) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        verification_status = EXCLUDED.verification_status,
        work_status = EXCLUDED.work_status;

    RAISE NOTICE '✅ 司機詳細資料建立完成';
END $$;

-- 步驟 8：建立車輛資料
DO $$
BEGIN
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

    RAISE NOTICE '✅ 車輛資料建立完成';
END $$;

-- 最終檢查
SELECT '🎉 完整修復完成！' as result;
SELECT 'users 表記錄數:' as info, COUNT(*) as count FROM users;
SELECT 'drivers 表記錄數:' as info, COUNT(*) as count FROM drivers;
SELECT 'admin_users 表記錄數:' as info, COUNT(*) as count FROM admin_users;

SELECT '🧪 測試帳號：' as test_accounts;
SELECT '📱 乘客：0912345678 / test123' as passenger_account;
SELECT '🚗 司機：0982214855 / BOSS08017' as driver_account;
SELECT '⚙️ 管理員：admin / ADMIN123' as admin_account;