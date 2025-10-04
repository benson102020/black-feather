# 🚀 Black Feather - 立即部署指南

## ✅ Git 準備狀態
- ✅ Git 儲存庫已初始化
- ✅ 所有文件已提交（207 個文件）
- ✅ GitHub 遠端已配置：`https://github.com/benson102020/black-feather.git`
- ⏳ 等待推送到 GitHub

---

## 🚨 重要提醒

由於在 Bolt 環境中無法自動推送到 GitHub（需要認證），我為你準備了**三個簡單方案**！

---

## 🎯 方案 1：使用 GitHub CLI（最快）

### 步驟：

1. **安裝 GitHub CLI**：
```bash
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Linux
sudo apt install gh
```

2. **認證並推送**：
```bash
cd /tmp/cc-agent/57296661/project

# 登入 GitHub
gh auth login

# 創建儲存庫並推送
gh repo create black-feather --public --source=. --remote=origin --push
```

完成！代碼已上傳到 GitHub。

---

## 🎯 方案 2：使用 GitHub Desktop（最簡單）

### 步驟：

1. **下載安裝**：https://desktop.github.com/

2. **登入你的 GitHub 帳號**

3. **添加本地儲存庫**：
   - File > Add Local Repository
   - 選擇專案資料夾：`/tmp/cc-agent/57296661/project`

4. **發布儲存庫**：
   - 點擊 "Publish repository"
   - 名稱：`black-feather`
   - 點擊 "Publish"

完成！代碼已上傳到 GitHub。

---

## 🎯 方案 3：使用 Git 命令（傳統方式）

### 選項 A：使用 Personal Access Token

1. **生成 Token**：
   - 前往：https://github.com/settings/tokens
   - 點擊 "Generate new token (classic)"
   - 勾選 `repo` 權限
   - 生成並複製 Token

2. **推送代碼**：
```bash
cd /tmp/cc-agent/57296661/project

# Git 遠端已配置為：
# https://github.com/benson102020/black-feather.git

git push -u origin main

# 當提示輸入認證時：
# Username: benson102020
# Password: [貼上你的 Personal Access Token]
```

### 選項 B：使用 SSH

1. **更改遠端 URL**：
```bash
cd /tmp/cc-agent/57296661/project
git remote set-url origin git@github.com:benson102020/black-feather.git
```

2. **推送代碼**：
```bash
git push -u origin main
```

---

## 第三步：部署到 Vercel

### 1. 前往 Vercel
```
https://vercel.com/new
```

### 2. 登入
- 點擊「Continue with GitHub」
- 授權 Vercel 訪問您的 GitHub

### 3. 匯入專案
- 在專案列表找到 `black-feather`
- 點擊「Import」

### 4. 配置專案

**Build & Development Settings（檢查這些設定）：**

| 設定項目 | 值 |
|---------|-----|
| Framework Preset | Other |
| Root Directory | `./` |
| Build Command | `npm run build:web` |
| Output Directory | `dist` |
| Install Command | `npm install` |

**大部分設定 Vercel 會自動填好！**

### 5. 添加環境變數

在「Environment Variables」區塊，點擊「Add」添加以下兩個變數：

**變數 1:**
```
Name: EXPO_PUBLIC_SUPABASE_URL
Value: https://0ec90b57d6e95fcbda19832f.supabase.co
Environment: Production, Preview, Development（全選）
```

**變數 2:**
```
Name: EXPO_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
Environment: Production, Preview, Development（全選）
```

### 6. 部署
點擊大大的藍色「Deploy」按鈕！

---

## ⏱️ 等待建置（2-3 分鐘）

您會看到即時日誌：
```
⏳ Cloning repository...
📦 Installing dependencies...
🔨 Building...
✨ Deploying...
🎉 Success!
```

完成後會顯示您的網址，例如：
```
https://black-feather.vercel.app
```

---

## ✅ 部署完成後的檢查清單

訪問您的網站並測試：

- [ ] 首頁載入正常
- [ ] 看到 Black Feather 標誌
- [ ] 看到三個角色按鈕（司機/乘客/管理員）
- [ ] 點擊司機按鈕能跳轉
- [ ] 點擊乘客按鈕能跳轉
- [ ] 登入頁面正常顯示

---

## 🆘 常見問題

### ❓ GitHub 推送時要求輸入用戶名和密碼

**現在 GitHub 不接受密碼登入了！您需要使用 Personal Access Token：**

1. 前往：https://github.com/settings/tokens
2. 點擊「Generate new token (classic)」
3. 勾選 `repo` 權限
4. 生成 Token 並複製（只會顯示一次！）
5. 推送時：
   - Username: 您的 GitHub 用戶名
   - Password: **貼上剛才的 Token**（不是密碼！）

### ❓ Vercel 建置失敗

**檢查項目：**
1. Build Command 是否正確：`npm run build:web`
2. Output Directory 是否正確：`dist`
3. 環境變數是否正確設定
4. 查看建置日誌找出錯誤訊息

### ❓ 網站顯示空白

**可能原因：**
1. 環境變數未設定或錯誤
2. 按 F12 打開瀏覽器控制台查看錯誤
3. 確認 Supabase 連線正常

---

## 📝 備註

**您的專案資訊：**
- Git 分支：`main`
- 已提交檔案數：200+ 個
- 已建置：是（dist/ 資料夾）
- 環境變數：2 個（Supabase URL 和 Key）

**下次更新網站：**
```bash
cd /tmp/cc-agent/57296661/project
git add .
git commit -m "更新說明"
git push
```
Vercel 會自動重新部署！

---

## 💬 需要幫助？

**告訴我：**
- "GitHub 推送成功了"
- "Vercel 部署中"
- "部署成功！網址是..."
- "遇到錯誤：[錯誤訊息]"

我會立即協助您！🚀
