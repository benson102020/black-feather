/*
  # 修復 users 表 RLS 政策

  1. 問題分析
    - 有重複的 INSERT 政策導致衝突
    - with_check 條件 `true` 對 anon 角色無效
    - auth.uid() 在註冊時為 null，導致檢查失敗

  2. 解決方案
    - 刪除所有現有政策
    - 創建新的正確政策
    - 允許 anon 註冊，authenticated 管理自己資料

  3. 安全性
    - anon 只能 INSERT，不能 SELECT/UPDATE
    - authenticated 只能存取自己的資料
    - 防止跨用戶資料洩露
*/

-- 刪除所有現有的 users 表政策
DROP POLICY IF EXISTS "Allow anonymous registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "allow_anonymous_registration" ON users;
DROP POLICY IF EXISTS "users_select_own_data" ON users;
DROP POLICY IF EXISTS "users_update_own_data" ON users;

-- 創建新的正確政策

-- 1. 允許匿名用戶註冊（INSERT）
CREATE POLICY "Enable anonymous user registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. 允許已認證用戶查詢自己的資料（SELECT）
CREATE POLICY "Enable users to read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 3. 允許已認證用戶更新自己的資料（UPDATE）
CREATE POLICY "Enable users to update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. 允許已認證用戶插入自己的資料（用於某些特殊情況）
CREATE POLICY "Enable authenticated users to insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 驗證政策創建
SELECT 'RLS 政策修復完成' as status;
SELECT policyname, roles, cmd, permissive
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users'
ORDER BY policyname;