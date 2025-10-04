#!/usr/bin/env node

/**
 * 一鍵設置 Supabase 叫車系統
 * 使用方式: node scripts/setup-supabase.js <SUPABASE_URL> <ANON_KEY>
 */

const fs = require('fs');
const path = require('path');

// 獲取命令行參數
const args = process.argv.slice(2);
const [supabaseUrl, anonKey] = args;

if (!supabaseUrl || !anonKey) {
  console.log('❌ 請提供 Supabase URL 和 Anon Key');
  console.log('使用方式: node scripts/setup-supabase.js <SUPABASE_URL> <ANON_KEY>');
  console.log('');
  console.log('範例:');
  console.log('node scripts/setup-supabase.js https://abc123.supabase.co eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  process.exit(1);
}

// 驗證 URL 格式
if (!supabaseUrl.includes('supabase.co')) {
  console.log('❌ 無效的 Supabase URL 格式');
  console.log('正確格式: https://your-project.supabase.co');
  process.exit(1);
}

// 更新 .env 文件
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// 更新或添加配置
const updateEnvVar = (content, key, value) => {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;
  
  if (regex.test(content)) {
    return content.replace(regex, line);
  } else {
    return content + (content.endsWith('\n') ? '' : '\n') + line + '\n';
  }
};

envContent = updateEnvVar(envContent, 'EXPO_PUBLIC_SUPABASE_URL', supabaseUrl);
envContent = updateEnvVar(envContent, 'EXPO_PUBLIC_SUPABASE_ANON_KEY', anonKey);

// 寫入 .env 文件
fs.writeFileSync(envPath, envContent);

console.log('✅ Supabase 配置已更新');
console.log('📝 .env 文件已更新');
console.log('');
console.log('🚀 接下來的步驟:');
console.log('1. 在 Supabase Dashboard 中執行遷移文件:');
console.log('   supabase/migrations/20241225120000_complete_ride_hailing_system.sql');
console.log('');
console.log('2. 重新啟動應用:');
console.log('   npm run dev');
console.log('');
console.log('3. 檢查系統完整性:');
console.log('   應用啟動後會自動檢查資料表和配置');
console.log('');
console.log('🎉 設置完成！您的叫車系統現在已連接到 Supabase');

// 創建檢查腳本
const checkScript = `
// 系統完整性檢查
import { autoFixMissingFeatures } from '../services/supabase-config';

async function checkSystem() {
  console.log('🔍 開始檢查系統完整性...');
  const result = await autoFixMissingFeatures();
  
  if (result.success) {
    console.log('✅ 系統檢查通過');
  } else {
    console.log('❌ 發現問題:', result.issues);
    console.log('🔧 建議修復:', result.fixes);
  }
}

checkSystem();
`;

const checkScriptPath = path.join(__dirname, 'check-system.js');
fs.writeFileSync(checkScriptPath, checkScript);

console.log('📋 已創建系統檢查腳本: scripts/check-system.js');
console.log('   執行: node scripts/check-system.js');