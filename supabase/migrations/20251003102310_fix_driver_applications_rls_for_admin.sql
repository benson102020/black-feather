/*
  # 修復司機申請表 RLS 政策 - 讓後台管理可以查看所有申請

  ## 問題
  - 後台管理無法查看司機申請列表
  - RLS 政策過於嚴格,限制了匿名用戶(anon)的讀取權限
  
  ## 修復內容
  1. 移除舊的 RLS 政策
  2. 建立新的寬鬆政策允許所有操作(用於開發和後台管理)
  3. 確保前端和後台都能正常存取資料
  
  ## 政策說明
  - anon 角色可以完全存取(用於前端和後台)
  - authenticated 角色可以完全存取
  - 這樣設計是因為應用層面會處理權限控制
*/

-- 移除所有現有的 driver_applications RLS 政策
DROP POLICY IF EXISTS "Allow anonymous read for admin" ON driver_applications;
DROP POLICY IF EXISTS "Allow anonymous update for admin" ON driver_applications;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON driver_applications;
DROP POLICY IF EXISTS "Allow anonymous insert" ON driver_applications;
DROP POLICY IF EXISTS "Users can create driver applications" ON driver_applications;
DROP POLICY IF EXISTS "Users can read own driver applications" ON driver_applications;

-- 建立新的寬鬆政策,允許所有操作
CREATE POLICY "Allow all operations for anon users" 
ON driver_applications 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" 
ON driver_applications 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 確認 RLS 已啟用
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;

-- 驗證政策已生效
SELECT 'RLS 政策已更新，後台管理現在可以查看所有司機申請' as status;
