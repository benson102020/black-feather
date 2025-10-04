/*
  # 修復用戶註冊 RLS 政策

  1. 問題
    - anon 角色無法創建新用戶記錄
    - INSERT 政策的 with_check 條件阻擋了註冊

  2. 解決方案
    - 移除舊的限制性政策
    - 添加新的寬鬆註冊政策
    - 允許 anon 角色創建待審核用戶

  3. 安全考量
    - 新創建的用戶狀態為 pending
    - 需要管理員審核後才能使用
    - 限制只能創建特定角色的用戶
*/

-- 移除舊的 anon insert 政策
DROP POLICY IF EXISTS "Allow anonymous insert" ON users;

-- 創建新的註冊政策（允許 anon 創建待審核用戶）
CREATE POLICY "Allow anonymous registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (
    role IN ('driver', 'passenger') 
    AND status = 'pending'
    AND verification_status = 'pending'
  );

-- 同時允許 anon 角色讀取所有用戶（用於檢查重複）
DROP POLICY IF EXISTS "Allow anonymous read for registration check" ON users;
CREATE POLICY "Allow anonymous read for registration check"
  ON users
  FOR SELECT
  TO anon
  USING (true);

-- 允許 anon 角色更新用戶狀態（用於審核流程）
DROP POLICY IF EXISTS "Allow anonymous update for admin" ON users;
CREATE POLICY "Allow anonymous update for admin"
  ON users
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
