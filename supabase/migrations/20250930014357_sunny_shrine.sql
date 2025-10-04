/*
  # 修復 admin_users 表結構

  1. 問題分析
    - admin_users 表缺少 username 欄位
    - 查詢語法嘗試選擇不存在的欄位

  2. 修復方案
    - 檢查並新增 username 欄位
    - 更新現有記錄的 username
    - 確保資料完整性

  3. 安全措施
    - 使用 IF NOT EXISTS 避免重複新增
    - 保持現有資料不變
    - 設置適當的預設值
*/

-- 檢查並新增 admin_users 表的 username 欄位
DO $$
BEGIN
  -- 新增 username 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'username'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN username TEXT;
    RAISE NOTICE '✅ 已新增 admin_users.username 欄位';
  ELSE
    RAISE NOTICE '✅ admin_users.username 欄位已存在';
  END IF;

  -- 新增 full_name 欄位（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN full_name TEXT;
    RAISE NOTICE '✅ 已新增 admin_users.full_name 欄位';
  ELSE
    RAISE NOTICE '✅ admin_users.full_name 欄位已存在';
  END IF;

  -- 新增 role 欄位（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'role'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN role TEXT DEFAULT 'admin';
    RAISE NOTICE '✅ 已新增 admin_users.role 欄位';
  ELSE
    RAISE NOTICE '✅ admin_users.role 欄位已存在';
  END IF;

  -- 新增 status 欄位（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'status'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN status TEXT DEFAULT 'active';
    RAISE NOTICE '✅ 已新增 admin_users.status 欄位';
  ELSE
    RAISE NOTICE '✅ admin_users.status 欄位已存在';
  END IF;
END $$;

-- 更新現有記錄，確保有 username
UPDATE admin_users 
SET username = COALESCE(username, email, 'admin_' || id::text)
WHERE username IS NULL OR username = '';

UPDATE admin_users 
SET full_name = COALESCE(full_name, name, username, 'Admin User')
WHERE full_name IS NULL OR full_name = '';

UPDATE admin_users 
SET role = COALESCE(role, 'admin')
WHERE role IS NULL OR role = '';

UPDATE admin_users 
SET status = COALESCE(status, 'active')
WHERE status IS NULL OR status = '';

-- 建立測試管理員帳號（如果不存在）
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
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- 檢查結果
SELECT 'admin_users 表修復完成' as result;
SELECT id, username, full_name, role, status FROM admin_users LIMIT 5;