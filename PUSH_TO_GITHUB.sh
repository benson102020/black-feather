#!/bin/bash

# Black Feather - GitHub 推送腳本
# 此腳本需要在本地環境執行（非 Bolt 環境）

echo "🚀 準備推送 Black Feather 專案到 GitHub..."
echo ""

# 檢查是否有 Git
if ! command -v git &> /dev/null; then
    echo "❌ 錯誤：未找到 Git，請先安裝 Git"
    exit 1
fi

# 顯示當前 Git 狀態
echo "📊 當前 Git 狀態："
git status

echo ""
echo "🔗 遠端儲存庫："
git remote -v

echo ""
echo "📤 準備推送到 GitHub..."
echo ""

# 推送到 GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    echo "🌐 你的儲存庫："
    echo "   https://github.com/benson102020/black-feather"
    echo ""
    echo "📋 下一步："
    echo "   1. 前往 https://vercel.com/new"
    echo "   2. 選擇 benson102020/black-feather 儲存庫"
    echo "   3. 按照 DEPLOYMENT_GUIDE.md 中的步驟配置並部署"
    echo ""
else
    echo ""
    echo "❌ 推送失敗！"
    echo ""
    echo "可能的原因："
    echo "   1. 需要 GitHub 認證（請設置 SSH 金鑰或使用 HTTPS token）"
    echo "   2. 網路連接問題"
    echo "   3. 權限問題"
    echo ""
    echo "解決方法："
    echo "   - 使用 'git push -u origin main' 手動推送"
    echo "   - 或參考 GitHub 文檔設置認證：https://docs.github.com/zh/authentication"
    exit 1
fi
