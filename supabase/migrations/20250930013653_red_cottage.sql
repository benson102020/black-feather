/*
  # 司機註冊審核系統

  1. 新增資料表
    - `driver_applications` - 司機申請表
    - `application_documents` - 申請文件表
    - `approval_logs` - 審核記錄表

  2. 修改現有表
    - 更新 `drivers` 表結構
    - 新增審核相關欄位

  3. 安全設定
    - 設定 RLS 政策
    - 審核權限控制
*/

-- 創建司機申請表
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
  license_expiry date NOT NULL,
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
  
  -- 街口帳號（顯示用）
  jkopay_account text,
  jkopay_name text,
  
  -- 申請狀態
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- 審核資訊
  reviewed_by uuid REFERENCES admin_users(id),
  reviewed_at timestamptz,
  rejection_reason text,
  admin_notes text,
  
  -- 時間戳
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 創建申請文件表
CREATE TABLE IF NOT EXISTS application_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES driver_applications(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('license', 'id_card', 'vehicle_registration', 'insurance', 'photo')),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  mime_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- 創建審核記錄表
CREATE TABLE IF NOT EXISTS approval_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES driver_applications(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES admin_users(id),
  action text NOT NULL CHECK (action IN ('submit', 'review_start', 'request_documents', 'approve', 'reject')),
  old_status text,
  new_status text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 更新 drivers 表結構
DO $$
BEGIN
  -- 新增申請 ID 關聯
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'application_id'
  ) THEN
    ALTER TABLE drivers ADD COLUMN application_id uuid REFERENCES driver_applications(id);
  END IF;

  -- 新增審核狀態
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'approval_status'
  ) THEN
    ALTER TABLE drivers ADD COLUMN approval_status text DEFAULT 'pending' 
    CHECK (approval_status IN ('pending', 'approved', 'rejected', 'suspended'));
  END IF;

  -- 新增審核時間
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE drivers ADD COLUMN approved_at timestamptz;
  END IF;

  -- 新增審核員
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE drivers ADD COLUMN approved_by uuid REFERENCES admin_users(id);
  END IF;
END $$;

-- 啟用 RLS
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_logs ENABLE ROW LEVEL SECURITY;

-- 司機申請表政策
CREATE POLICY "Users can create own applications"
  ON driver_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own applications"
  ON driver_applications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all applications"
  ON driver_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Admins can update applications"
  ON driver_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND status = 'active'
    )
  );

-- 申請文件政策
CREATE POLICY "Users can manage own documents"
  ON application_documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM driver_applications 
      WHERE id = application_documents.application_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all documents"
  ON application_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND status = 'active'
    )
  );

-- 審核記錄政策
CREATE POLICY "Admins can manage approval logs"
  ON approval_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND status = 'active'
    )
  );

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_driver_applications_status ON driver_applications(status);
CREATE INDEX IF NOT EXISTS idx_driver_applications_user_id ON driver_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_driver_applications_submitted_at ON driver_applications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_application_documents_application_id ON application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_approval_logs_application_id ON approval_logs(application_id);

-- 創建觸發器函數
CREATE OR REPLACE FUNCTION update_driver_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 創建觸發器
DROP TRIGGER IF EXISTS update_driver_applications_updated_at ON driver_applications;
CREATE TRIGGER update_driver_applications_updated_at
  BEFORE UPDATE ON driver_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_applications_updated_at();

-- 創建審核狀態變更函數
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- 記錄狀態變更
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO approval_logs (
      application_id,
      admin_id,
      action,
      old_status,
      new_status,
      notes
    ) VALUES (
      NEW.id,
      NEW.reviewed_by,
      CASE 
        WHEN NEW.status = 'approved' THEN 'approve'
        WHEN NEW.status = 'rejected' THEN 'reject'
        WHEN NEW.status = 'under_review' THEN 'review_start'
        ELSE 'update'
      END,
      OLD.status,
      NEW.status,
      NEW.admin_notes
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 創建狀態變更觸發器
DROP TRIGGER IF EXISTS log_application_status_change ON driver_applications;
CREATE TRIGGER log_application_status_change
  AFTER UPDATE ON driver_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_application_status_change();

-- 插入測試管理員帳號
INSERT INTO admin_users (
  id, name, email, username, password_hash, role, status
) VALUES (
  '00000000-0000-0000-0000-000000000099',
  '系統管理員',
  'admin@blackfeather.com',
  'admin',
  'QURNSU4xMjM=',
  'admin',
  'active'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  status = EXCLUDED.status;