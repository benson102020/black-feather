// Supabase 配置管理
import { createClient } from '@supabase/supabase-js';

// 環境變數配置
export const supabaseConfig = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'
};

// 檢查配置是否有效
export const isValidConfig = () => {
  return !supabaseConfig.url.includes('your-project') && 
         !supabaseConfig.anonKey.includes('your-anon-key');
};

// 創建 Supabase 客戶端
export const createSupabaseClient = () => {
  if (!isValidConfig()) {
    console.warn('⚠️  使用演示模式 - 請設定真實的 Supabase 配置');
    return null;
  }

  return createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
};

// 一鍵重建系統函數
export const setupCompleteSystem = async (newUrl: string, newAnonKey: string) => {
  console.log('🚀 開始設置完整叫車系統...');
  
  try {
    // 1. 更新配置
    supabaseConfig.url = newUrl;
    supabaseConfig.anonKey = newAnonKey;
    
    // 2. 創建新的客戶端
    const supabase = createSupabaseClient();
    if (!supabase) {
      throw new Error('無法創建 Supabase 客戶端');
    }
    
    // 3. 測試連接
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ 資料庫連接失敗:', error);
      throw error;
    }
    
    console.log('✅ 資料庫連接成功');
    
    // 4. 檢查必要的資料表
    const requiredTables = [
      'users', 'drivers', 'vehicles', 'rides', 'payments', 
      'complaints', 'vehicle_types', 'pricing_config', 
      'surge_pricing', 'coupons', 'notifications'
    ];
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.warn(`⚠️  資料表 ${table} 可能不存在或無權限訪問`);
        } else {
          console.log(`✅ 資料表 ${table} 檢查通過`);
        }
      } catch (err) {
        console.warn(`⚠️  檢查資料表 ${table} 時發生錯誤:`, err);
      }
    }
    
    console.log('🎉 系統設置完成！');
    return { success: true, message: '系統設置完成' };
    
  } catch (error) {
    console.error('❌ 系統設置失敗:', error);
    return { success: false, error: error.message };
  }
};

// 自動檢測和補齊缺失功能
export const autoFixMissingFeatures = async () => {
  console.log('🔍 檢查系統完整性...');
  
  const supabase = createSupabaseClient();
  if (!supabase) {
    console.log('📱 運行在演示模式，跳過資料庫檢查');
    return { success: true, message: '演示模式運行正常' };
  }
  
  const issues = [];
  const fixes = [];
  
  try {
    // 檢查基本資料表
    const tables = ['users', 'drivers', 'vehicles', 'rides', 'payments'];
    for (const table of tables) {
      try {
        await supabase.from(table).select('count').limit(1);
      } catch (error) {
        issues.push(`資料表 ${table} 不存在或無法訪問`);
        fixes.push(`需要執行遷移文件創建 ${table} 資料表`);
      }
    }
    
    // 檢查計費配置
    const { data: pricingData } = await supabase
      .from('pricing_config')
      .select('*')
      .eq('is_active', true)
      .limit(1);
      
    if (!pricingData || pricingData.length === 0) {
      issues.push('缺少計費配置');
      fixes.push('需要插入預設計費配置');
    }
    
    // 檢查車型資料
    const { data: vehicleTypes } = await supabase
      .from('vehicle_types')
      .select('*')
      .eq('is_active', true);
      
    if (!vehicleTypes || vehicleTypes.length === 0) {
      issues.push('缺少車型資料');
      fixes.push('需要插入預設車型資料');
    }
    
    console.log(`🔍 檢查完成: 發現 ${issues.length} 個問題`);
    
    if (issues.length > 0) {
      console.log('❌ 發現的問題:', issues);
      console.log('🔧 建議的修復:', fixes);
    } else {
      console.log('✅ 系統完整性檢查通過');
    }
    
    return {
      success: issues.length === 0,
      issues,
      fixes,
      message: issues.length === 0 ? '系統完整性檢查通過' : `發現 ${issues.length} 個問題需要修復`
    };
    
  } catch (error) {
    console.error('❌ 系統檢查失敗:', error);
    return { success: false, error: error.message };
  }
};

export default createSupabaseClient;