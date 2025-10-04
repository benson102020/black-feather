#!/bin/bash

# Black Feather 部署腳本
# 自動化 Git 推送流程

echo "🚀 Black Feather 部署助手"
echo "=========================="
echo ""

# 檢查 Git 狀態
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 錯誤: 這不是一個 Git 儲存庫"
    exit 1
fi

# 檢查是否已設定 remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  尚未設定 GitHub 遠端儲存庫"
    echo ""
    echo "請輸入您的 GitHub 用戶名:"
    read -r username

    echo ""
    echo "請確認儲存庫名稱 (預設: black-feather):"
    read -r repo_name
    repo_name=${repo_name:-black-feather}

    echo ""
    echo "選擇連接方式:"
    echo "1) HTTPS (推薦)"
    echo "2) SSH"
    read -r choice

    if [ "$choice" = "2" ]; then
        remote_url="git@github.com:$username/$repo_name.git"
    else
        remote_url="https://github.com/$username/$repo_name.git"
    fi

    echo ""
    echo "設定遠端儲存庫: $remote_url"
    git remote add origin "$remote_url"

    if [ $? -ne 0 ]; then
        echo "❌ 設定遠端儲存庫失敗"
        exit 1
    fi

    echo "✅ 遠端儲存庫設定完成"
fi

echo ""
echo "📦 準備推送到 GitHub..."
echo ""

# 顯示遠端 URL
origin_url=$(git remote get-url origin)
echo "目標儲存庫: $origin_url"
echo ""

# 推送到 GitHub
echo "🔄 推送中..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 下一步: 部署到 Vercel"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. 前往: https://vercel.com/new"
    echo "2. 用 GitHub 登入"
    echo "3. 選擇儲存庫: $(basename "$origin_url" .git)"
    echo "4. 添加環境變數:"
    echo ""
    echo "   變數 1:"
    echo "   Name:  EXPO_PUBLIC_SUPABASE_URL"
    echo "   Value: https://0ec90b57d6e95fcbda19832f.supabase.co"
    echo ""
    echo "   變數 2:"
    echo "   Name:  EXPO_PUBLIC_SUPABASE_ANON_KEY"
    echo "   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    echo "   (完整值請查看 .env.example 檔案)"
    echo ""
    echo "5. 點擊 Deploy 按鈕"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo ""
    echo "❌ 推送失敗"
    echo ""
    echo "可能原因:"
    echo "1. GitHub 儲存庫尚未建立"
    echo "   解決: 前往 https://github.com/new 建立儲存庫"
    echo ""
    echo "2. 需要驗證"
    echo "   如果使用 HTTPS，需要 Personal Access Token"
    echo "   前往: https://github.com/settings/tokens"
    echo ""
    echo "3. 權限不足"
    echo "   確認您有推送權限"
    echo ""
    exit 1
fi
