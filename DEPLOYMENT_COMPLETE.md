# ✅ 部署準備完成清單

## 🎯 當前狀態

### ✅ 已完成項目

- [x] 移除不相容的依賴套件
- [x] 更新所有圖示為 @expo/vector-icons
- [x] 建立 Vercel 配置檔案
- [x] 初始化 Git 儲存庫
- [x] 提交所有檔案
- [x] 建立部署腳本
- [x] 準備環境變數文檔

### 📋 需要您完成的步驟

## 步驟 1: 建立 GitHub 儲存庫

**前往:** https://github.com/new

**配置:**
```
Repository name: black-feather
Description: Black Feather 叫車平台
Privacy: ✓ Private (推薦)
□ Add a README file (不要勾選)
□ Add .gitignore (不要勾選)
□ Choose a license (不要勾選)
```

**點擊:** `Create repository`

---

## 步驟 2: 推送代碼到 GitHub

### 方式 A: 使用自動化腳本（推薦）

在終端機執行:
```bash
cd /tmp/cc-agent/57296661/project
./deploy.sh
```

腳本會引導您完成:
- 設定 GitHub 遠端儲存庫
- 自動推送代碼
- 顯示下一步指示

### 方式 B: 手動推送

**替換 `YOUR_USERNAME` 為您的 GitHub 用戶名:**

```bash
cd /tmp/cc-agent/57296661/project
git remote add origin https://github.com/YOUR_USERNAME/black-feather.git
git push -u origin main
```

**如果使用 HTTPS 推送，需要:**
- Username: 您的 GitHub 用戶名
- Password: Personal Access Token (不是密碼!)
  - 前往: https://github.com/settings/tokens
  - Generate new token (classic)
  - 勾選 `repo` 權限

---

## 步驟 3: 部署到 Vercel

### 3.1 登入 Vercel

**前往:** https://vercel.com/new

**操作:**
1. 點擊 `Continue with GitHub`
2. 授權 Vercel 訪問您的 GitHub
3. 如果是第一次使用，可能需要安裝 Vercel GitHub App

### 3.2 匯入專案

**操作:**
1. 在專案列表中找到 `black-feather`
2. 點擊 `Import` 按鈕

### 3.3 配置專案

**確認以下設定 (大部分會自動填好):**

| 設定項目 | 值 |
|---------|-----|
| Project Name | black-feather |
| Framework Preset | Other |
| Root Directory | ./ |
| Build Command | npm run build:web |
| Output Directory | dist |
| Install Command | npm install |

### 3.4 設定環境變數

**在 Environment Variables 區塊，添加以下變數:**

#### 變數 1: Supabase URL
```
Name: EXPO_PUBLIC_SUPABASE_URL
Value: https://0ec90b57d6e95fcbda19832f.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
```

#### 變數 2: Supabase Anon Key
```
Name: EXPO_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
Environments: ✓ Production ✓ Preview ✓ Development
```

### 3.5 開始部署

**點擊大藍色按鈕:** `Deploy`

---

## 步驟 4: 等待建置完成

**時間:** 約 2-3 分鐘

**過程:**
```
⏳ Cloning repository...
📦 Installing dependencies...
🔨 Running build command...
   > npm run build:web
   > Building for web...
✨ Deploying to edge network...
🎉 Deployment successful!
```

**完成後會顯示:**
- 🌐 Production URL: `https://black-feather.vercel.app`
- 或您的自訂網址

---

## 步驟 5: 測試部署

### 5.1 基本功能測試

訪問您的網站並檢查:

**首頁 (/):**
- [ ] 頁面載入成功
- [ ] 顯示 Black Feather 標誌
- [ ] 顯示三個角色按鈕
- [ ] 點擊按鈕能正確跳轉

**司機端 (/tabs/):**
- [ ] 登入頁面正常顯示
- [ ] Tab 導航正常（工作台/訂單/收入/訊息/個人）
- [ ] 可以註冊新帳號

**乘客端 (/passenger/):**
- [ ] 登入頁面正常顯示
- [ ] 地圖載入正常
- [ ] 訂單功能正常

**管理後台 (/admin/):**
- [ ] 登入頁面正常顯示
- [ ] 可以查看司機申請
- [ ] 數據儀表板正常

### 5.2 測試帳號

**建議建立測試帳號:**

**司機測試帳號:**
```
Email: driver-test@example.com
Password: Test123456!
```

**乘客測試帳號:**
```
Email: passenger-test@example.com
Password: Test123456!
```

**管理員測試帳號:**
```
Email: admin-test@example.com
Password: Test123456!
```

---

## 📊 部署資訊

### 專案統計
- **總檔案數:** 200+
- **頁面路由:** 70+
- **建置大小:** 約 8.2MB
- **部署平台:** Vercel
- **資料庫:** Supabase

### 技術棧
```
Frontend:
├─ Expo SDK 53.0.0
├─ React 19.0.0
├─ React Native Web 0.20.0
└─ TypeScript 5.8.3

Backend:
├─ Supabase (PostgreSQL)
├─ Row Level Security (RLS)
└─ Realtime Subscriptions

Deployment:
├─ Vercel (Hosting)
├─ GitHub (Version Control)
└─ Static Site Generation
```

---

## 🔄 後續更新流程

**修改代碼後:**

```bash
cd /tmp/cc-agent/57296661/project

# 1. 查看更改
git status

# 2. 添加更改
git add .

# 3. 提交更改
git commit -m "描述您的更改"

# 4. 推送到 GitHub
git push

# Vercel 會自動檢測並重新部署！
```

**約 1-2 分鐘後，更改會自動上線。**

---

## 🆘 常見問題

### Q1: GitHub 推送時要求用戶名密碼

**A:** GitHub 已停用密碼驗證，需要使用 Personal Access Token:

1. 前往: https://github.com/settings/tokens
2. 點擊 "Generate new token (classic)"
3. 勾選 `repo` 權限
4. 複製生成的 Token
5. 推送時輸入:
   - Username: 您的 GitHub 用戶名
   - Password: 貼上 Token (不是密碼!)

### Q2: Vercel 建置失敗

**檢查項目:**
1. Build Command 是否為 `npm run build:web`
2. Output Directory 是否為 `dist`
3. 環境變數是否正確設定
4. 查看建置日誌找出具體錯誤

**常見錯誤:**
```
Error: Command "npm run build:web" exited with 1
```
解決: 檢查 package.json 中的 scripts 區塊

### Q3: 網站顯示空白或 404

**可能原因:**
1. 環境變數未設定
2. Supabase 連線失敗
3. 路由配置錯誤

**檢查方法:**
- 按 F12 打開瀏覽器控制台
- 查看 Console 和 Network 標籤
- 確認 API 請求是否成功

### Q4: 如何綁定自訂網域

**在 Vercel Dashboard:**
1. 選擇您的專案
2. Settings → Domains
3. Add Domain
4. 輸入您的網域 (例如: www.blackfeather.com)
5. 按照指示設定 DNS 記錄:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

---

## 📞 需要協助？

### 查看文檔
- `START_HERE.md` - 新手完整指南
- `QUICK_DEPLOY_GUIDE.md` - 快速部署
- `DEPLOY_NOW.md` - 立即部署指令
- `DEPLOYMENT.md` - 技術文檔

### 使用部署腳本
```bash
./deploy.sh
```

### 聯繫支援
如果遇到問題，請提供:
- 錯誤訊息截圖
- 瀏覽器控制台日誌
- Vercel 建置日誌

---

## 🎉 完成！

**部署成功後:**
- ✅ 您的網站已上線
- ✅ 自動部署已啟用 (推送代碼即更新)
- ✅ HTTPS 自動配置
- ✅ CDN 加速已啟用

**下一步:**
1. 測試所有功能
2. 分享網址給測試用戶
3. 監控 Vercel Analytics
4. 根據反饋優化功能

---

**祝您部署順利！** 🚀

如有任何問題，隨時回來查看這份文檔。
