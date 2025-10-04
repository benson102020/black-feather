# 司機端 APP 文件結構地圖

## 📁 完整文件結構

```
black-feather-driver-app/
├── 📄 配置文件
│   ├── package.json              # 項目依賴和腳本
│   ├── tsconfig.json             # TypeScript 配置
│   ├── app.json                  # Expo 應用配置
│   ├── .prettierrc               # 代碼格式化配置
│   └── .npmrc                    # npm 配置
│
├── 📱 應用程式 (app/)
│   ├── 🏠 主入口
│   │   ├── index.tsx             # 啟動頁面 (羽毛圖標)
│   │   ├── _layout.tsx           # 根佈局配置
│   │   └── +not-found.tsx        # 404 錯誤頁面
│   │
│   ├── 🔐 身份驗證 (auth/)
│   │   ├── login.tsx             # 登入頁面
│   │   ├── register.tsx          # 註冊頁面 (6步驟)
│   │   └── forgot-password.tsx   # 忘記密碼 (手機驗證)
│   │
│   └── 📋 主要功能 ((tabs)/)
│       ├── _layout.tsx           # Tab 導航配置
│       ├── index.tsx             # 工作台 (上線/下線)
│       ├── orders.tsx            # 訂單管理
│       ├── earnings.tsx          # 收入統計
│       ├── messages.tsx          # 訊息中心
│       └── profile.tsx           # 個人中心
│
├── 🔧 工具函數 (hooks/)
│   └── useFrameworkReady.ts      # 框架就緒檢測
│
├── 🌐 服務層 (services/)
│   └── api.ts                    # API 服務和 WebSocket
│
├── 🔄 狀態管理 (contexts/)
│   └── AppContext.tsx            # 全域狀態管理
│
├── 📝 類型定義 (types/)
│   └── api.ts                    # TypeScript 類型定義
│
├── 🖼️ 靜態資源 (assets/)
│   └── images/
│       ├── icon.png              # 應用圖標
│       └── favicon.png           # 網頁圖標
│
└── 📚 文檔備份
    ├── COMPLETE_BACKUP.md        # 完整源代碼備份
    ├── DRIVER_DATA_BACKUP.md     # 資料結構備份
    ├── BACKUP_INSTRUCTIONS.md   # 備份恢復指南
    ├── MODIFICATION_GUIDE.md     # 修改指南
    └── FILE_STRUCTURE_MAP.md     # 本文件結構地圖
```

## 🎯 各文件功能說明

### 📄 配置文件詳解

#### `package.json` - 項目核心配置
```json
{
  "name": "bolt-expo-starter",
  "scripts": {
    "dev": "EXPO_NO_TELEMETRY=1 expo start",
    "build:web": "expo export --platform web"
  },
  "dependencies": {
    "expo": "^53.0.0",
    "react-native": "0.79.1",
    "lucide-react-native": "^0.475.0"
  }
}
```

#### `app.json` - Expo 應用設定
```json
{
  "expo": {
    "name": "bolt-expo-nativewind",
    "version": "1.0.0",
    "plugins": ["expo-router", "expo-font"]
  }
}
```

### 🏠 應用入口文件

#### `app/index.tsx` - 啟動頁面
- **功能**: 顯示 Black feather 品牌 Logo
- **特色**: 黑金配色羽毛圖標
- **邏輯**: 自動導航到登入或主頁面

#### `app/_layout.tsx` - 根佈局
- **功能**: 配置整個應用的路由結構
- **包含**: Stack 導航配置
- **管理**: 所有頁面的導航關係

### 🔐 身份驗證模組

#### `app/auth/login.tsx` - 登入頁面
- **輸入**: 手機號碼 + 密碼
- **功能**: 密碼顯示/隱藏切換
- **驗證**: 手機號碼格式檢查
- **導航**: 登入成功後跳轉主頁面

#### `app/auth/register.tsx` - 註冊頁面
- **步驟1**: 基本資料 (姓名、手機、身分證)
- **步驟2**: 設定密碼
- **步驟3**: 駕照資料
- **步驟4**: 車輛資料
- **步驟5**: 緊急聯絡人
- **步驟6**: 銀行資料 (選填)

#### `app/auth/forgot-password.tsx` - 忘記密碼
- **步驟1**: 輸入手機號碼
- **步驟2**: 輸入驗證碼 (60秒倒數)
- **步驟3**: 設定新密碼

### 📋 主要功能模組

#### `app/(tabs)/_layout.tsx` - Tab 導航
- **配置**: 5個主要 Tab
- **樣式**: 黑金配色主題
- **圖標**: Lucide React Native 圖標

#### `app/(tabs)/index.tsx` - 工作台
- **狀態**: 上線/下線切換
- **訂單**: 當前訂單顯示
- **操作**: 導航、聯絡、拍照按鈕
- **快捷**: 客服、異常回報、收入查看

#### `app/(tabs)/orders.tsx` - 訂單管理
- **搜索**: 訂單編號/客戶姓名
- **篩選**: 全部/待確認/行程中/已完成
- **顯示**: 訂單詳細資訊
- **狀態**: 彩色狀態標籤

#### `app/(tabs)/earnings.tsx` - 收入統計
- **期間**: 今日/本週/本月切換
- **統計**: 總收入、訂單數、工作時數
- **明細**: 收入記錄列表
- **操作**: 申請提現、下載帳單

#### `app/(tabs)/messages.tsx` - 訊息中心
- **對話**: 客戶、客服、系統訊息
- **功能**: 即時聊天介面
- **通知**: 系統通知管理
- **快捷**: 聯絡客服、調度中心

#### `app/(tabs)/profile.tsx` - 個人中心
- **資料**: 司機基本資訊顯示
- **統計**: 評分、完成訂單數
- **設定**: 個人資料、車輛、通知等
- **操作**: 安全登出

## 🎨 樣式系統

### 配色方案
```typescript
const colors = {
  primary: '#000000',    // 黑色主色
  accent: '#FFD700',     // 金色強調
  background: '#f5f5f5', // 淺灰背景
  text: '#333333',       // 深灰文字
  success: '#34C759',    // 成功綠色
  warning: '#FF9500',    // 警告橙色
  error: '#FF3B30',      // 錯誤紅色
};
```

### 字體規範
```typescript
const typography = {
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' },
  small: { fontSize: 12, fontWeight: 'normal' },
};
```

## 🔧 工具和配置

### `hooks/useFrameworkReady.ts`
- **功能**: 確保框架準備就緒
- **用途**: 在根佈局中調用
- **重要**: 必須保留，不可刪除

### `services/api.ts`
- **功能**: API 服務和 WebSocket 管理
- **包含**: 認證、訂單、收入、訊息 API
- **特色**: 自動重連、錯誤處理

### `contexts/AppContext.tsx`
- **功能**: 全域狀態管理
- **管理**: 用戶狀態、訂單狀態、司機狀態
- **特色**: React Context + useReducer

### `types/api.ts`
- **功能**: TypeScript 類型定義
- **包含**: 所有 API 相關類型
- **用途**: 確保類型安全

### 圖標系統
- **庫**: lucide-react-native
- **使用**: 統一的圖標風格
- **配色**: 主要使用金色 (#FFD700)

## 📱 導航結構

```
Root Stack Navigator
├── index (啟動頁面)
├── auth/login (登入)
├── auth/register (註冊)
├── auth/forgot-password (忘記密碼)
└── (tabs) Tab Navigator
    ├── index (工作台)
    ├── orders (訂單)
    ├── earnings (收入)
    ├── messages (訊息)
    └── profile (個人)
```

## 🔄 狀態管理

### 使用 React Context
- **AppContext**: 全域應用狀態
- **useState**: 組件內部狀態
- **useEffect**: 生命週期管理

### 表單狀態
- **登入**: 手機號碼、密碼
- **註冊**: 多步驟表單狀態
- **訂單**: 篩選、搜索狀態
- **訊息**: 對話、輸入狀態

## 📋 修改指南快速索引

### 🎨 樣式修改
- **顏色**: 搜索 `#000000` 或 `#FFD700`
- **字體**: 搜索 `fontSize` 或 `fontWeight`
- **間距**: 搜索 `padding` 或 `margin`

### 🔧 功能修改
- **登入邏輯**: `app/auth/login.tsx` → `handleLogin`
- **註冊步驟**: `app/auth/register.tsx` → `renderStep`
- **訂單狀態**: `app/(tabs)/orders.tsx` → `statusMap`
- **收入計算**: `app/(tabs)/earnings.tsx` → `earningsData`

### 📱 導航修改
- **新增頁面**: 在 `app/` 下創建文件
- **新增 Tab**: 修改 `app/(tabs)/_layout.tsx`
- **路由配置**: 修改 `app/_layout.tsx`

### 🎯 圖標修改
- **更換圖標**: 從 `lucide-react-native` 導入
- **圖標顏色**: 修改 `color` 屬性
- **圖標大小**: 修改 `size` 屬性

---

**使用此文件結構地圖，您可以快速找到任何需要修改的文件！**