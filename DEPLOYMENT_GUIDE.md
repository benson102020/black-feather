# Black Feather 部署指南

## 📋 準備工作完成狀態

✅ Git 儲存庫已初始化
✅ 所有代碼已提交到本地
✅ GitHub 遠端連接已配置
✅ Vercel 配置文件已創建

---

## 🚀 第一步：推送代碼到 GitHub

**重要：** 由於這是在 Bolt 環境中，你需要手動執行推送操作。

### 方法 1：使用 Git 命令（推薦）

如果你有權限執行 git 命令，運行：

```bash
git push -u origin main
```

### 方法 2：下載並重新上傳

1. 下載整個專案資料夾
2. 在本地電腦上打開終端機
3. 進入專案目錄
4. 執行以下命令：

```bash
git push -u origin main
```

---

## 🌐 第二步：部署到 Vercel

### 1. 前往 Vercel 網站

🔗 打開瀏覽器，訪問：**https://vercel.com/new**

### 2. 登入並授權 GitHub

- 點擊「Continue with GitHub」
- 授權 Vercel 訪問你的 GitHub 帳號
- 如果已登入，會直接進入專案選擇頁面

### 3. 導入 GitHub 儲存庫

在「Import Git Repository」頁面：

1. 找到並點擊 **`benson102020/black-feather`** 儲存庫
2. 點擊「Import」按鈕

### 4. 配置專案設置

在專案配置頁面：

#### 📁 Framework Preset
- 選擇：**Other**（或保持預設）

#### 🔨 Build and Output Settings
- **Build Command**: `npm run build:web`（應該自動檢測）
- **Output Directory**: `dist`（應該自動檢測）
- **Install Command**: `npm install`（應該自動檢測）

### 5. 設置環境變數 ⚙️

**這是最重要的步驟！**

在「Environment Variables」區域，添加以下兩個變數：

#### 變數 1：Supabase URL
```
Name:  EXPO_PUBLIC_SUPABASE_URL
Value: https://0ec90b57d6e95fcbda19832f.supabase.co
```

#### 變數 2：Supabase Anon Key
```
Name:  EXPO_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

⚠️ **重要提醒**：你提供的 Supabase ANON_KEY 可能已過期。建議：
1. 前往 Supabase Dashboard：https://supabase.com/dashboard
2. 選擇你的專案
3. 進入 Settings > API
4. 複製最新的「anon」/ "public" key
5. 使用最新的 key 替換上面的值

#### 環境選項
- 確保勾選：✅ **Production**
- 建議也勾選：✅ **Preview** 和 ✅ **Development**

### 6. 開始部署 🚀

1. 檢查所有設置是否正確
2. 點擊底部的 **「Deploy」** 按鈕
3. 等待部署過程完成（通常需要 2-5 分鐘）

---

## 📊 第三步：監控部署狀態

部署開始後，你會看到：

1. **建置日誌（Build Logs）**：顯示即時的建置過程
2. **進度條**：顯示部署進度
3. 可能出現的狀態：
   - 🔄 Building...（正在建置）
   - ✅ Ready（部署成功）
   - ❌ Failed（部署失敗）

### 如果部署成功

你會看到：
- ✅ 部署成功的訊息
- 🔗 一個 Vercel 提供的 URL（例如：`black-feather.vercel.app`）
- 點擊 URL 即可訪問你的應用

### 如果部署失敗

查看錯誤日誌，常見問題：
1. **環境變數錯誤**：檢查 Supabase URL 和 Key 是否正確
2. **建置命令錯誤**：確認 `npm run build:web` 可以正常執行
3. **依賴項問題**：可能需要清除快取重新部署

---

## 🔍 第四步：測試部署

部署成功後：

1. 點擊 Vercel 提供的 URL
2. 檢查以下功能：
   - ✅ 首頁是否正常載入
   - ✅ 角色選擇功能（乘客/司機/管理員）
   - ✅ 登入/註冊功能
   - ✅ Supabase 連接是否正常

---

## 📝 注意事項

### 關於這個專案

這是一個 **Expo/React Native** 應用，使用 Expo Web 構建部署到 Vercel：

- ✅ **Web 版本**可以在 Vercel 上運行
- ❌ **手機原生功能**（如相機、地理位置）在 Web 版本中可能受限
- 📱 要完整使用所有功能，建議構建原生 iOS/Android 應用

### 後續步驟建議

1. **獲取最新的 Supabase Key**（如前面提到的）
2. **測試所有核心功能**
3. **設置自定義域名**（可選，在 Vercel 專案設置中）
4. **配置生產環境優化**
5. **設置 CI/CD**：每次推送到 GitHub 自動部署

---

## 🆘 需要幫助？

如果遇到問題：

1. 檢查 Vercel 部署日誌
2. 確認環境變數設置正確
3. 確認 Supabase 專案可以正常訪問
4. 查看瀏覽器控制台錯誤訊息

---

## 🎉 完成！

完成上述步驟後，你的 Black Feather 應用就會部署到 Vercel 上了！

**你的專案 URL 格式**：
- Vercel 自動生成：`https://black-feather.vercel.app`
- 或你的自定義域名

**GitHub 儲存庫**：
- https://github.com/benson102020/black-feather

祝部署順利！🚀
