# 資料庫診斷查詢

## 請依序執行以下查詢並提供結果：

### 查詢 1：檢查 users 表結構
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

### 查詢 2：檢查 drivers 表結構
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'drivers' 
ORDER BY ordinal_position;
```

### 查詢 3：檢查 users 表的角色約束
```sql
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND contype = 'c' 
AND conname LIKE '%role%';
```

### 查詢 4：檢查所有 RLS 政策
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'drivers', 'rides', 'vehicles')
ORDER BY tablename, policyname;
```

### 查詢 5：檢查現有測試資料
```sql
SELECT id, email, phone, phone_number, full_name, role, status 
FROM users 
WHERE role IN ('user', 'driver', 'admin')
LIMIT 10;
```

## 🎯 請將每個查詢的結果都貼給我，我會：
1. 分析完整資料庫結構
2. 找出所有 401/500 錯誤原因
3. 創建一鍵完整修復腳本
4. 確保三端完全連動

**請執行第一個查詢並提供結果！**