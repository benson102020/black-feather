/*
  # 修復重複管理員帳號問題

  1. 檢查現有管理員帳號
  2. 更新現有記錄而非插入新記錄
  3. 確保所有必要欄位都有值
  4. 建立司機申請審核相關表
*/

-- 檢查現有 admin_users 表結構
DO $$
BEGIN
  -- 新增 username 欄位（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'username'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN username TEXT UNIQUE;
    RAISE NOTICE '✅ 已新增 admin_users.username 欄位';
  END IF;

  -- 新增 full_name 欄位（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN full_name TEXT;
    RAISE NOTICE '✅ 已新增 admin_users.full_name 欄位';
  END IF;

  -- 新增 role 欄位（如果不存在）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'role'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN role TEXT DEFAULT 'admin';
    RAISE NOTICE '✅ 已新增 admin_users.role 欄位';
  END IF;
END $$;

-- 更新現有管理員記錄（而非插入新記錄）
UPDATE admin_users 
SET 
  username = 'admin',
  full_name = '系統管理員',
  role = 'admin',
  status = 'active',
  password_hash = 'QURNSU4xMjM='
WHERE email = 'admin@blackfeather.com';

-- 如果沒有現有記錄，則插入新記錄
INSERT INTO admin_users (username, email, password_hash, full_name, role, status)
SELECT 'admin', 'admin@blackfeather.com', 'QURNSU4xMjM=', '系統管理員', 'admin', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM admin_users WHERE email = 'admin@blackfeather.com'
);

-- 建立司機申請審核表
CREATE TABLE IF NOT EXISTS driver_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  
  -- 基本資料
  full_name text NOT NULL,
  phone_number text NOT NULL,
  id_number text NOT NULL,
  email text,
  
  -- 駕照資料
  license_number text NOT NULL,
  license_expiry text NOT NULL,
  license_class text DEFAULT 'B',
  
  -- 車輛資料
  vehicle_brand text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_plate text NOT NULL,
  vehicle_year integer,
  vehicle_color text,
  
  -- 緊急聯絡人
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  emergency_contact_relation text,
  
  -- 街口帳號
  jkopay_account text,
  jkopay_name text,
  
  -- 審核狀態
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- 審核資訊
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES admin_users(id),
  rejection_reason text,
  admin_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 建立審核日誌表
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

-- 建立通知表（如果不存在）
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'system' CHECK (type IN ('system', 'order', 'earnings', 'admin')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 建立 RLS 政策
-- driver_applications 政策
CREATE POLICY "Users can create applications" ON driver_applications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own applications" ON driver_applications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all applications" ON driver_applications
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND status = 'active'
    )
  );

-- notifications 政策
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- approval_logs 政策
CREATE POLICY "Admins can read approval logs" ON approval_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND status = 'active'
    )
  );

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_driver_applications_status ON driver_applications(status);
CREATE INDEX IF NOT EXISTS idx_driver_applications_submitted_at ON driver_applications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 插入測試申請資料
INSERT INTO driver_applications (
  user_id, full_name, phone_number, id_number, email,
  license_number, license_expiry, license_class,
  vehicle_brand, vehicle_model, vehicle_plate, vehicle_year, vehicle_color,
  emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
  jkopay_account, jkopay_name,
  status, priority
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '測試司機申請',
  '0911111111',
  'T123456789',
  'test_application@blackfeather.com',
  'TEST999999',
  '2025-12-31',
  'B',
  'Toyota',
  'Prius',
  'TEST-999',
  2020,
  '白色',
  '測試聯絡人',
  '0922222222',
  '家人',
  '0911111111',
  '測試司機申請',
  'pending',
  'normal'
) ON CONFLICT (user_id) DO NOTHING;

SELECT '🎉 司機申請審核系統建立完成！' as result;
SELECT '👨‍💼 管理員帳號：admin / ADMIN123' as admin_account;
SELECT '📋 已建立測試申請資料' as test_data;