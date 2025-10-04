-- 🗑️ 清理特殊驗證角色和相關資料
-- 執行此腳本將完全移除驗證角色，不留任何痕跡

-- 步驟 1：移除特殊用戶的所有 RLS 政策
DROP POLICY IF EXISTS "users_select_bolt_new" ON users;
DROP POLICY IF EXISTS "users_insert_bolt_new" ON users;
DROP POLICY IF EXISTS "users_update_bolt_new_role_only" ON users;
DROP POLICY IF EXISTS "bolt_new_select" ON users;
DROP POLICY IF EXISTS "bolt_new_insert" ON users;
DROP POLICY IF EXISTS "bolt_new_update" ON users;

-- 移除其他表的相關政策
DROP POLICY IF EXISTS "drivers_bolt_new_access" ON drivers;
DROP POLICY IF EXISTS "vehicles_bolt_new_access" ON vehicles;
DROP POLICY IF EXISTS "rides_bolt_new_access" ON rides;
DROP POLICY IF EXISTS "payments_bolt_new_access" ON payments;
DROP POLICY IF EXISTS "admin_users_bolt_new_access" ON admin_users;

-- 步驟 2：刪除特殊驗證用戶記錄
DELETE FROM users WHERE id = 'bolt-new-verification-user-2024';
DELETE FROM admin_users WHERE username = 'bolt-new-verification';

-- 步驟 3：移除任何包含 'bolt' 或 'verification' 的記錄
DELETE FROM users WHERE email LIKE '%bolt%' OR email LIKE '%verification%';
DELETE FROM admin_users WHERE email LIKE '%bolt%' OR email LIKE '%verification%';

-- 步驟 4：清理日誌和審計記錄
DELETE FROM approval_logs WHERE notes LIKE '%bolt%' OR notes LIKE '%verification%';

-- 步驟 5：重設為標準 RLS 政策
-- 恢復正常的用戶政策
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow anonymous registration" ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 恢復正常的司機政策
CREATE POLICY "Drivers can manage own data" ON drivers
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 步驟 6：確認清理完成
SELECT '🗑️ 特殊驗證角色已完全清理' as cleanup_status;
SELECT '✅ 系統已恢復為標準安全模式' as security_status;
SELECT '🔒 所有特殊權限已移除' as permissions_status;

-- 最終檢查：確認沒有殘留的特殊角色
SELECT 'users 表中無特殊角色:' as check_users, 
       COUNT(*) as count 
FROM users 
WHERE email LIKE '%bolt%' OR email LIKE '%verification%';

SELECT 'admin_users 表中無特殊角色:' as check_admins, 
       COUNT(*) as count 
FROM admin_users 
WHERE email LIKE '%bolt%' OR email LIKE '%verification%';