/*
  # BOSS666 完整清理腳本
  
  這個腳本會完全移除 BOSS666 特殊驗證角色和所有相關權限：
  1. 刪除 BOSS666 驗證用戶
  2. 移除所有 bolt_new 相關政策
  3. 清理相關日誌和記錄
  4. 恢復標準安全模式
  
  ⚠️ 執行後將無法復原，請確認不再需要特殊權限
*/

-- 步驟 1：刪除 BOSS666 驗證用戶
DELETE FROM users WHERE id = 'bolt-new-verification-user-2024';

-- 步驟 2：移除所有 bolt_new 相關政策
DROP POLICY IF EXISTS "users_select_bolt_new" ON users;
DROP POLICY IF EXISTS "users_insert_bolt_new" ON users;
DROP POLICY IF EXISTS "users_update_bolt_new_role_only" ON users;
DROP POLICY IF EXISTS "bolt_new_insert" ON users;
DROP POLICY IF EXISTS "bolt_new_select" ON users;
DROP POLICY IF EXISTS "bolt_new_update" ON users;

DROP POLICY IF EXISTS "drivers_select_bolt_new" ON drivers;
DROP POLICY IF EXISTS "drivers_insert_bolt_new" ON drivers;
DROP POLICY IF EXISTS "drivers_update_bolt_new" ON drivers;

DROP POLICY IF EXISTS "vehicles_all_bolt_new" ON vehicles;
DROP POLICY IF EXISTS "rides_all_bolt_new" ON rides;
DROP POLICY IF EXISTS "payments_all_bolt_new" ON payments;
DROP POLICY IF EXISTS "notifications_all_bolt_new" ON notifications;

-- 步驟 3：恢復標準 RLS 政策
-- Users 表標準政策
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

-- Drivers 表標準政策
CREATE POLICY "Drivers can read own data" ON drivers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Drivers can update own data" ON drivers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Vehicles 表標準政策
CREATE POLICY "Drivers can manage own vehicles" ON vehicles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Rides 表標準政策
CREATE POLICY "Users can read own rides" ON rides
  FOR SELECT
  TO authenticated
  USING (passenger_id = auth.uid() OR driver_id = auth.uid());

CREATE POLICY "Passengers can create rides" ON rides
  FOR INSERT
  TO authenticated
  WITH CHECK (passenger_id = auth.uid());

CREATE POLICY "Drivers can update assigned rides" ON rides
  FOR UPDATE
  TO authenticated
  USING (driver_id = auth.uid());

-- 步驟 4：清理相關角色
DROP ROLE IF EXISTS bolt_new;

-- 步驟 5：清理任何相關的審計記錄
DELETE FROM audit_logs WHERE user_id = 'bolt-new-verification-user-2024';

SELECT '🗑️ BOSS666 清理完成！' as result;
SELECT '系統已恢復標準安全模式' as info;
SELECT '所有特殊權限已移除' as security_status;