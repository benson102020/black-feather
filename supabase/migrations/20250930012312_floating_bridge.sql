/*
  # 創建 users 表 RLS 政策

  1. 安全政策
    - 允許匿名用戶註冊（INSERT）
    - 允許已認證用戶查詢自己的資料（SELECT）
    - 允許已認證用戶更新自己的資料（UPDATE）
    - 禁止刪除操作以保護資料安全

  2. 政策說明
    - `allow_anonymous_registration` - 匿名註冊政策
    - `users_select_own_data` - 用戶查詢自己資料
    - `users_update_own_data` - 用戶更新自己資料
*/

-- 啟用 users 表的 Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策（如果存在）
DROP POLICY IF EXISTS "allow_anonymous_registration" ON users;
DROP POLICY IF EXISTS "users_select_own_data" ON users;
DROP POLICY IF EXISTS "users_update_own_data" ON users;
DROP POLICY IF EXISTS "users_delete_own_data" ON users;

-- 1. 允許匿名用戶註冊（INSERT）
CREATE POLICY "allow_anonymous_registration" 
ON users 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 2. 允許已認證用戶查詢自己的資料（SELECT）
CREATE POLICY "users_select_own_data" 
ON users 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 3. 允許已認證用戶更新自己的資料（UPDATE）
CREATE POLICY "users_update_own_data" 
ON users 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 4. 禁止刪除操作（安全考量）
-- 不創建 DELETE 政策，確保用戶資料不會被意外刪除

-- 驗證政策是否正確創建
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'users' 
ORDER BY policyname;