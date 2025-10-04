# 🚀 快速命令參考

## 立即部署（最簡單）

```bash
cd /tmp/cc-agent/57296661/project
./deploy.sh
```

---

## 手動部署步驟

### 1. 設定 GitHub 遠端（只需執行一次）

```bash
# 替換 YOUR_USERNAME 為您的 GitHub 用戶名
git remote add origin https://github.com/YOUR_USERNAME/black-feather.git
```

### 2. 推送到 GitHub

```bash
git push -u origin main
```

### 3. 之後每次更新

```bash
git add .
git commit -m "更新說明"
git push
```

---

## Vercel 部署

### 首次部署
1. 前往: https://vercel.com/new
2. 選擇 black-feather 儲存庫
3. 添加環境變數（見下方）
4. 點擊 Deploy

### 環境變數

```bash
EXPO_PUBLIC_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co

EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

---

## 本地開發

### 啟動開發伺服器
```bash
npm run dev
```

### 建置靜態網站
```bash
npm run build:web
```

### 檢查建置結果
```bash
ls -lh dist/
```

---

## Git 常用命令

### 查看狀態
```bash
git status
```

### 查看提交歷史
```bash
git log --oneline
```

### 查看遠端設定
```bash
git remote -v
```

### 重設遠端 URL
```bash
git remote set-url origin NEW_URL
```

---

## 故障排除

### 清理並重裝依賴
```bash
rm -rf node_modules package-lock.json
npm install
```

### 重新建置
```bash
rm -rf dist
npm run build:web
```

### 檢查 Git 狀態
```bash
git status
git branch
git remote -v
```

---

## 快速連結

- **GitHub 新儲存庫**: https://github.com/new
- **Vercel 部署**: https://vercel.com/new
- **GitHub Token**: https://github.com/settings/tokens
- **專案目錄**: /tmp/cc-agent/57296661/project

---

## 一鍵複製命令

### 完整部署流程（替換 YOUR_USERNAME）

```bash
# 進入專案目錄
cd /tmp/cc-agent/57296661/project

# 設定 GitHub 遠端
git remote add origin https://github.com/YOUR_USERNAME/black-feather.git

# 推送代碼
git push -u origin main
```

### 完成後前往 Vercel
```
https://vercel.com/new
```

---

需要更詳細的說明？查看:
- `START_HERE.md` - 完整指南
- `DEPLOYMENT_COMPLETE.md` - 部署清單
- `deploy.sh` - 自動化腳本
