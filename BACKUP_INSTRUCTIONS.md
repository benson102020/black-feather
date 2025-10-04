# 項目備份與恢復指南

## 📦 備份內容

此備份包含完整的 Black feather 司機端 APP 源代碼，包括：

### 核心文件
- `app/` - 所有應用頁面和路由
- `hooks/` - 自定義 React Hooks
- `services/` - API 服務和 WebSocket
- `contexts/` - 全域狀態管理
- `types/` - TypeScript 類型定義
- `assets/` - 圖片和靜態資源
- 配置文件 (package.json, tsconfig.json, app.json 等)

### 主要功能模組
1. **身份驗證** (`app/auth/`)
   - 登入頁面 (login.tsx)
   - 註冊頁面 (register.tsx)
   - 忘記密碼 (forgot-password.tsx)

2. **主要功能** (`app/(tabs)/`)
   - 工作台 (index.tsx)
   - 訂單管理 (orders.tsx)
   - 收入統計 (earnings.tsx)
   - 訊息中心 (messages.tsx)
   - 個人中心 (profile.tsx)

3. **系統整合**
   - API 服務 (services/api.ts)
   - 全域狀態 (contexts/AppContext.tsx)
   - WebSocket 即時通信

## 🔄 在新電腦上恢復項目

### 1. 環境準備
```bash
# 安裝 Node.js (建議 18.x 或更高版本)
# 安裝 npm 或 yarn

# 全域安裝 Expo CLI
npm install -g @expo/cli
```

### 2. 項目恢復
```bash
# 1. 創建新目錄並進入
mkdir black-feather-driver-app
cd black-feather-driver-app

# 2. 複製所有備份文件到此目錄

# 3. 安裝依賴
npm install

# 4. 啟動開發服務器
npm run dev
```

### 3. 開發環境配置
```bash
# 如果遇到依賴問題，可以清除並重新安裝
rm -rf node_modules package-lock.json
npm install

# 確保 Expo CLI 是最新版本
npm install -g @expo/cli@latest
```

## 🛠️ 開發工具建議

### 推薦的 IDE 和擴展
- **VS Code** 或 **Cursor**
- **擴展**:
  - React Native Tools
  - TypeScript Importer
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

### 調試工具
- **Expo Dev Tools**: 在瀏覽器中查看日誌和調試
- **React Native Debugger**: 獨立的調試工具
- **Flipper**: Facebook 的移動應用調試平台

## 📱 測試環境

### Web 測試
```bash
npm run dev
# 在瀏覽器中打開 http://localhost:8081
```

### 移動設備測試
```bash
# 安裝 Expo Go APP 在手機上
# 掃描 QR 碼進行測試
```

## 🔧 常見問題解決

### 1. 依賴安裝問題
```bash
# 清除 npm 緩存
npm cache clean --force

# 使用 legacy-peer-deps
npm install --legacy-peer-deps
```

### 2. Metro 打包問題
```bash
# 清除 Metro 緩存
npx expo start --clear
```

### 3. TypeScript 錯誤
```bash
# 重新生成類型定義
npx expo install --fix
```

### 4. 系統整合問題
```bash
# 檢查 API 端點配置
# 確認 services/api.ts 中的 API_BASE_URL 正確
```

## 📋 開發檢查清單

在新環境中恢復項目後，請確認：

- [ ] 所有依賴正確安裝
- [ ] 開發服務器正常啟動
- [ ] 所有頁面可以正常導航
- [ ] 樣式顯示正確
- [ ] 圖標正常顯示
- [ ] 表單功能正常
- [ ] 無 TypeScript 錯誤
- [ ] API 整合正常工作
- [ ] WebSocket 連接正常

## 🚀 部署準備

### Web 部署
```bash
# 構建 Web 版本
npm run build:web

# 輸出目錄: dist/
```

### 移動應用構建
```bash
# Android APK
eas build --platform android

# iOS IPA
eas build --platform ios
```

## 🔗 系統整合確認

### API 連接測試
1. 確認 `services/api.ts` 中的 API_BASE_URL 正確
2. 測試登入功能是否正常
3. 檢查 WebSocket 連接是否建立
4. 驗證訂單同步功能

### 狀態管理測試
1. 測試全域狀態更新
2. 確認用戶認證狀態
3. 檢查訂單狀態同步
4. 驗證司機狀態管理

## 📞 技術支援

如果在恢復過程中遇到問題：

1. 檢查 Node.js 版本是否符合要求
2. 確認所有依賴正確安裝
3. 查看控制台錯誤信息
4. 參考 Expo 官方文檔
5. 檢查系統整合配置

## 📋 完整文件清單

### 配置文件
- package.json
- tsconfig.json
- app.json
- .prettierrc
- .npmrc

### 應用文件
- app/index.tsx (啟動頁面)
- app/_layout.tsx (根佈局)
- app/+not-found.tsx (404頁面)

### 身份驗證
- app/auth/login.tsx
- app/auth/register.tsx
- app/auth/forgot-password.tsx

### 主要功能
- app/(tabs)/_layout.tsx
- app/(tabs)/index.tsx (工作台)
- app/(tabs)/orders.tsx (訂單管理)
- app/(tabs)/earnings.tsx (收入統計)
- app/(tabs)/messages.tsx (訊息中心)
- app/(tabs)/profile.tsx (個人中心)

### 系統服務
- services/api.ts (API 和 WebSocket)
- contexts/AppContext.tsx (全域狀態)
- types/api.ts (類型定義)
- hooks/useFrameworkReady.ts

### 文檔
- README.md
- COMPLETE_BACKUP.md
- DRIVER_DATA_BACKUP.md
- FILE_STRUCTURE_MAP.md
- MODIFICATION_GUIDE.md
- QUICK_REFERENCE.md

---

**備份日期**: 2024年12月
**項目版本**: v1.0.0
**Expo SDK**: 53.0.0
**React Native**: 0.79.1
**系統整合**: 已完成與乘車系統端整合