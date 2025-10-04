# Black feather 司機端 APP

這是一個基於 React Native Expo 開發的司機端應用程式，提供完整的司機工作管理功能。

## 🚀 快速設置 Supabase

### 🧪 測試帳號

為了方便測試，我們提供了一組測試帳號：

**司機端測試帳號**
- 手機號碼: `0982214855`
- 密碼: `BOSS08017`
- 狀態: 已審核通過，可直接登入使用

**測試功能包含:**
- ✅ 完整的司機資料和車輛資訊
- ✅ 歷史訂單和收入記錄
- ✅ 對話訊息和系統通知
- ✅ 可接訂單和狀態更新
- ✅ 提現申請和投訴功能

> **注意**: 這是臨時測試帳號，測試完成後將會刪除

### 1. 創建 Supabase 專案
1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 創建新專案
3. 等待專案初始化完成

### 2. 執行資料庫遷移
1. 在 Supabase Dashboard 中，前往 SQL Editor
2. 執行 `supabase/migrations/20241225120000_complete_ride_hailing_system.sql` 文件
3. 確認所有資料表創建成功

### 3. 配置應用連接
```bash
# 方法一：使用自動設置腳本
node scripts/setup-supabase.js <YOUR_SUPABASE_URL> <YOUR_ANON_KEY>

# 方法二：手動更新 .env 文件
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 啟動應用
```bash
npm install
npm run dev
```

## 🔗 系統整合

本司機端 APP 已與乘車系統端完成整合，支援：
- 即時訂單接收和處理
- 雙向通信和狀態同步
- 統一的用戶認證系統
- WebSocket 即時通信

## 項目特色

- 🎨 **品牌設計**: 黑色主調配金色裝飾的專業配色
- 📱 **完整功能**: 登入、註冊、訂單管理、收入統計、訊息中心
- 🚀 **用戶體驗**: 直觀的導航和操作流程
- 🔧 **技術架構**: React Native + Expo Router + TypeScript
- 🌐 **系統整合**: 與乘車系統端完整整合

## 功能模組

### 1. 身份驗證
- 手機號碼密碼登入
- 忘記密碼功能
- 6步驟司機註冊流程
- 安全登出

### 2. 工作台
- 上線/下線狀態切換
- 實時訂單顯示
- 訂單狀態管理
- 快速操作按鈕

### 3. 訂單管理
- 多狀態篩選（待確認、行程中、已完成）
- 訂單搜索功能
- 詳細訂單資訊
- 客戶聯絡功能

### 4. 收入系統
- 多時段收入統計（今日、本週、本月）
- 收入明細列表
- 提現功能
- 帳單下載

### 5. 訊息中心
- 客服對話
- 系統通知
- 客戶溝通
- 訊息狀態管理

### 6. 個人中心
- 司機資料管理
- 車輛資訊顯示
- 設定選項
- 版本資訊

## 技術規格

- **框架**: React Native 0.79.1
- **路由**: Expo Router 5.0.2
- **開發工具**: Expo SDK 53.0.0
- **語言**: TypeScript
- **圖標**: Lucide React Native
- **樣式**: StyleSheet (原生樣式)
- **狀態管理**: React Context + useReducer
- **API 通信**: Fetch API + WebSocket
- **即時通信**: WebSocket 連接

## 安裝與運行

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建 Web 版本
npm run build:web
```

## 項目結構

```
app/
├── (tabs)/                 # 主要頁面
│   ├── index.tsx          # 工作台
│   ├── orders.tsx         # 訂單管理
│   ├── earnings.tsx       # 收入統計
│   ├── messages.tsx       # 訊息中心
│   ├── profile.tsx        # 個人中心
│   └── _layout.tsx        # Tab 導航配置
├── auth/                  # 身份驗證
│   ├── login.tsx          # 登入頁面
│   ├── register.tsx       # 註冊頁面
│   └── forgot-password.tsx # 忘記密碼
├── _layout.tsx            # 根佈局
├── index.tsx              # 啟動頁面
└── +not-found.tsx         # 404 頁面

contexts/
└── AppContext.tsx         # 全域狀態管理

services/
└── api.ts                 # API 服務和 WebSocket

types/
└── api.ts                 # TypeScript 類型定義

hooks/
└── useFrameworkReady.ts   # 框架就緒檢測

assets/
├── images/
│   ├── icon.png           # 應用圖標
│   └── favicon.png        # 網頁圖標
```

## 設計系統

### 配色方案
- **主色**: #000000 (黑色)
- **品牌色**: #FFD700 (金色)
- **背景色**: #f5f5f5 (淺灰)
- **文字色**: #333333 (深灰)

### 字體規範
- **標題**: 18-24px, 粗體
- **正文**: 14-16px, 常規
- **小字**: 12px, 常規

## 開發注意事項

1. **路由導航**: 使用 Expo Router 進行頁面導航
2. **狀態管理**: 使用 React Hooks 管理組件狀態
3. **樣式規範**: 使用 StyleSheet.create 創建樣式
4. **圖標使用**: 統一使用 Lucide React Native 圖標庫
5. **響應式設計**: 適配不同屏幕尺寸

## 後續開發計劃

- [x] API 接口整合
- [x] WebSocket 即時通信
- [ ] 推播通知功能
- [ ] 地圖導航整合
- [ ] 照片上傳功能
- [ ] 離線模式支援
- [ ] 性能優化

## 版本資訊

- **當前版本**: v1.0.0
- **最後更新**: 2024年12月
- **開發狀態**: 開發中

## 聯絡資訊

如有問題或建議，請聯絡開發團隊。

---

© 2024 Black feather Technology. All rights reserved.