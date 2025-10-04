# 🔍 完整資料庫診斷查詢

## 請依序執行以下 4 個查詢：

### 查詢 1：檢查 users 表完整結構
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

### 查詢 2：檢查 drivers 表完整結構
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'drivers' 
ORDER BY ordinal_position;
```

### 查詢 3：檢查所有 RLS 政策
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'drivers', 'rides', 'vehicles')
ORDER BY tablename, policyname;
```

### 查詢 4：檢查現有測試資料
```sql
SELECT id, email, phone, phone_number, full_name, name, role, status 
FROM users 
WHERE role IN ('user', 'driver', 'admin')
LIMIT 10;
```

## 🎯 執行方式：
1. 前往 Supabase Dashboard
2. 進入 SQL Editor
3. 依序執行每個查詢
4. 將結果複製貼給我

## 📊 我會根據結果：
- ✅ 分析完整資料庫結構
- ✅ 找出所有 401/500 錯誤原因
- ✅ 創建一鍵完整修復腳本
- ✅ 確保三端完全連動

**請先執行查詢 1 並提供結果！**