/*
  # 修復 admin_users 表結構

  1. 新增欄位
    - `username` (text, unique) - 管理員帳號
    - `full_name` (text) - 管理員姓名
  
  2. 安全性
    - 新增 email 唯一約束
    - 新增 username 唯一約束
    - 啟用 RLS 並設置政策
  
  3. 測試資料
    - 創建測試管理員帳號
*/

-- 新增缺少的欄位
DO $$
BEGIN
  -- username 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'username'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN username text;
    RAISE NOTICE '✅ 已新增 admin_users.username 欄位';
  ELSE
    RAISE NOTICE '✅ admin_users.username 欄位已存在';
  END IF;

  -- full_name 欄位
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN full_name text;
    RAISE NOTICE '✅ 已新增 admin_users.full_name 欄位';
  ELSE
    RAISE NOTICE '✅ admin_users.full_name 欄位已存在';
  END IF;
END $$;

-- 新增唯一約束
DO $$
BEGIN
  -- email 唯一約束
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'admin_users' AND constraint_name = 'admin_users_email_unique'
  ) THEN
    ALTER TABLE admin_users ADD CONSTRAINT admin_users_email_unique UNIQUE (email);
    RAISE NOTICE '✅ 已新增 email 唯一約束';
  ELSE
    RAISE NOTICE '✅ email 唯一約束已存在';
  END IF;

  -- username 唯一約束
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'admin_users' AND constraint_name = 'admin_users_username_unique'
  ) THEN
    ALTER TABLE admin_users ADD CONSTRAINT admin_users_username_unique UNIQUE (username);
    RAISE NOTICE '✅ 已新增 username 唯一約束';
  ELSE
    RAISE NOTICE '✅ username 唯一約束已存在';
  END IF;
END $$;

-- 更新現有記錄（如果有的話）
UPDATE admin_users 
SET 
  username = 'admin',
  full_name = '系統管理員'
WHERE username IS NULL AND email = 'admin@blackfeather.com';

-- 插入測試管理員帳號（使用 UPSERT）
INSERT INTO admin_users (
  id, name, email, username, full_name, password_hash, status
) VALUES (
  '00000000-0000-0000-0000-000000000099',
  '系統管理員',
  'admin@blackfeather.com',
  'admin',
  '系統管理員',
  'QURNSU4xMjM=',
  'active'
) ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  status = EXCLUDED.status;

-- 啟用 RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 政策
DROP POLICY IF EXISTS "Admins can manage all data" ON admin_users;
CREATE POLICY "Admins can manage all data" ON admin_users
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 創建 driver_applications 表（如果不存在）
CREATE TABLE IF NOT EXISTS driver_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone_number text NOT NULL,
  id_number text NOT NULL,
  email text,
  license_number text NOT NULL,
  license_expiry text NOT NULL,
  license_class text DEFAULT 'B',
  vehicle_brand text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_plate text NOT NULL,
  vehicle_year integer,
  vehicle_color text,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  emergency_contact_relation text,
  jkopay_account text,
  jkopay_name text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES admin_users(id),
  rejection_reason text,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;

-- 創建政策
CREATE POLICY "Users can read own applications" ON driver_applications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create applications" ON driver_applications
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all applications" ON driver_applications
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND status = 'active'
  )
) WITH CHECK (true);

-- 創建審核日誌表
CREATE TABLE IF NOT EXISTS approval_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES driver_applications(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES admin_users(id),
  action text NOT NULL CHECK (action IN ('submit', 'review', 'approve', 'reject', 'update')),
  old_status text,
  new_status text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE approval_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage logs" ON approval_logs
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND status = 'active'
  )
) WITH CHECK (true);

-- 創建通知表（如果不存在）
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'system' CHECK (type IN ('system', 'order', 'earnings', 'admin')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
FOR INSERT WITH CHECK (true);

-- 最終檢查
SELECT 'admin_users 表結構:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;

SELECT '🎉 修復完成！' as result;
SELECT '測試管理員帳號：admin / ADMIN123' as admin_account;