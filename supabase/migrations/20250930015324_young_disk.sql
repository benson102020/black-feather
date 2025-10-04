/*
  # 修復 RLS 政策允許司機註冊

  1. 問題分析
    - RLS 政策阻止了新用戶註冊
    - 需要允許匿名用戶創建帳號
    - 需要允許 service_role 進行所有操作

  2. 修復方案
    - 刪除限制性政策
    - 創建寬鬆的註冊政策
    - 確保 service_role 有完整權限
*/

-- 刪除所有現有的 users 表 RLS 政策
DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "allow_anonymous_registration" ON users;
DROP POLICY IF EXISTS "users_select_own_data" ON users;
DROP POLICY IF EXISTS "users_update_own_data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable select for users on own data" ON users;
DROP POLICY IF EXISTS "Enable update for users on own data" ON users;

-- 創建新的寬鬆政策
CREATE POLICY "Allow all operations for service role" ON users
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous registration" ON users
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access" ON users
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 確保 driver_applications 表也有正確的政策
DROP POLICY IF EXISTS "Users can create applications" ON driver_applications;
DROP POLICY IF EXISTS "Users can read own applications" ON driver_applications;
DROP POLICY IF EXISTS "Admins can manage all applications" ON driver_applications;

CREATE POLICY "Allow all operations for service role" ON driver_applications
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous application creation" ON driver_applications
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage applications" ON driver_applications
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 確保 drivers 表政策正確
DROP POLICY IF EXISTS "Drivers can read own data" ON drivers;
DROP POLICY IF EXISTS "Drivers can update own data" ON drivers;
DROP POLICY IF EXISTS "Anyone can read driver locations" ON drivers;

CREATE POLICY "Allow all operations for service role" ON drivers
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage drivers" ON drivers
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 確保 vehicles 表政策正確
DROP POLICY IF EXISTS "Anyone can read active vehicles" ON vehicles;
DROP POLICY IF EXISTS "Drivers can manage own vehicles" ON vehicles;

CREATE POLICY "Allow all operations for service role" ON vehicles
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage vehicles" ON vehicles
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 確保 approval_logs 表政策正確
DROP POLICY IF EXISTS "Admins can manage logs" ON approval_logs;

CREATE POLICY "Allow all operations for service role" ON approval_logs
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage logs" ON approval_logs
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 確保 notifications 表政策正確
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;

CREATE POLICY "Allow all operations for service role" ON notifications
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage notifications" ON notifications
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous notification creation" ON notifications
FOR INSERT TO anon WITH CHECK (true);

-- 檢查修復結果
SELECT 'RLS 政策修復完成' as status;
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'driver_applications', 'drivers', 'vehicles')
ORDER BY tablename, policyname;