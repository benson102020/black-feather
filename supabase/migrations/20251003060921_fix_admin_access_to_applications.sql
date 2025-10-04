/*
  # 修復管理員訪問申請記錄的權限

  1. 問題
    - 當前 RLS 政策限制 driver_applications 只能查看自己的記錄
    - 管理員使用 anon 角色無法查看所有申請
    - user_applications 也有類似問題

  2. 解決方案
    - 為 anon 角色添加 SELECT 權限（用於管理員查詢）
    - 保持 authenticated 用戶只能查看自己的記錄
    - 允許 anon 角色讀取所有申請記錄（管理後台使用）

  3. 安全考量
    - 生產環境應該實作管理員專用 API
    - 當前為開發階段，允許 anon 讀取以便測試
*/

-- 為 driver_applications 添加 anon 角色的 SELECT 權限
DROP POLICY IF EXISTS "Allow anonymous read for admin" ON driver_applications;
CREATE POLICY "Allow anonymous read for admin"
  ON driver_applications
  FOR SELECT
  TO anon
  USING (true);

-- 為 user_applications 添加 anon 角色的 SELECT 權限
DROP POLICY IF EXISTS "Allow anonymous read for admin" ON user_applications;
CREATE POLICY "Allow anonymous read for admin"
  ON user_applications
  FOR SELECT
  TO anon
  USING (true);

-- 為 anon 角色添加更新權限（管理員審核時使用）
DROP POLICY IF EXISTS "Allow anonymous update for admin" ON driver_applications;
CREATE POLICY "Allow anonymous update for admin"
  ON driver_applications
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update for admin" ON user_applications;
CREATE POLICY "Allow anonymous update for admin"
  ON user_applications
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
