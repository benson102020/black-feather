# 🔍 如何在 Supabase 中執行 SQL 查詢

## 📋 **步驟 1：開啟 Supabase Dashboard**

1. **前往 Supabase**：
   - 在瀏覽器中打開：https://supabase.com/dashboard
   - 登入您的帳號

2. **選擇專案**：
   - 找到您的專案：`aotykuukxmofwqrdjrke`
   - 點擊進入專案

## 📋 **步驟 2：進入 SQL Editor**

1. **找到 SQL Editor**：
   - 在左側選單中找到 "SQL Editor"
   - 點擊進入

2. **創建新查詢**：
   - 點擊 "New query" 或 "+" 按鈕
   - 會開啟一個空白的 SQL 編輯器

## 📋 **步驟 3：執行查詢**

### **查詢 1：檢查 users 表結構**
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

1. **複製上面的 SQL**
2. **貼到 SQL Editor 中**
3. **點擊 "Run" 按鈕**（通常是綠色的執行按鈕）
4. **複製結果**並貼給我

## 🖼️ **視覺指南**：

```
Supabase Dashboard
├── 左側選單
│   ├── Table Editor
│   ├── SQL Editor  ← 點這裡
│   ├── Database
│   └── ...
│
└── SQL Editor 頁面
    ├── [New query] 按鈕  ← 點這裡
    ├── SQL 輸入框      ← 貼上查詢
    └── [Run] 按鈕      ← 執行查詢
```

## 🎯 **完成後**：
把查詢結果（JSON 格式）複製貼給我，我會立即分析並創建完整修復方案！

## ❓ **如果找不到**：
- 確認您在正確的 Supabase 專案中
- SQL Editor 通常在左側選單的第二或第三個位置
- 如果看不到，可能需要重新整理頁面