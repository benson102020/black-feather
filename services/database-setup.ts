// 資料庫設置和初始化服務
import { supabase, getSupabaseClient } from './supabase';

export const databaseSetupService = {
  // 檢查資料庫連接
  async checkConnection() {
    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase 客戶端未初始化');
      }

      // 測試基本連接
      const { data, error } = await client
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        throw new Error(`資料庫連接失敗: ${error.message}`);
      }

      console.log('✅ 資料庫連接成功');
      return { success: true, message: '資料庫連接正常' };
    } catch (error) {
      console.error('❌ 資料庫連接失敗:', error);
      return { success: false, error: error.message };
    }
  },

  // 檢查必要資料表
  async checkRequiredTables() {
    console.log('🔍 檢查系統完整性...');
    
    const supabase = createSupabaseClient();
    if (!supabase) {
      console.log('📱 運行在演示模式，跳過資料庫檢查');
      return { success: true, message: '演示模式運行正常' };
    }
    
    const issues = [];
    const fixes = [];
    
    try {
      // 檢查基本資料表和欄位
      const requiredSchema = {
        users: ['id', 'email', 'password_hash', 'full_name', 'phone_number', 'role', 'status', 'phone_verified', 'created_at'],
        drivers: ['id', 'user_id', 'id_number', 'license_number', 'vehicle_info', 'emergency_contact', 'bank_account', 'verification_status', 'work_status', 'rating', 'total_trips', 'created_at'],
        orders: ['id', 'passenger_id', 'driver_id', 'start_location', 'end_location', 'status', 'fare', 'distance', 'estimated_duration', 'payment_method', 'notes', 'created_at', 'updated_at', 'completed_at'],
        vehicles: ['id', 'driver_id', 'license_plate', 'make', 'model', 'year', 'color', 'car_type', 'status', 'created_at', 'updated_at']
      };

      for (const [tableName, columns] of Object.entries(requiredSchema)) {
        try {
          // 檢查資料表是否存在
          const { error: tableError } = await supabase.from(tableName).select('*').limit(1);
          if (tableError) {
            issues.push(`資料表 ${tableName} 不存在或無法訪問`);
            fixes.push(`需要創建 ${tableName} 資料表`);
            continue;
          }
          
          // 檢查欄位是否存在
          for (const column of columns) {
            try {
              const { error: columnError } = await supabase.from(tableName).select(column).limit(1);
              if (columnError && columnError.message.includes('column')) {
                issues.push(`資料表 ${tableName} 缺少欄位 ${column}`);
                fixes.push(`需要在 ${tableName} 表中添加 ${column} 欄位`);
              }
            } catch (err) {
              console.warn(`檢查欄位 ${tableName}.${column} 時發生錯誤:`, err);
            }
          }
        } catch (err) {
          issues.push(`資料表 ${tableName} 檢查失敗: ${err.message}`);
          fixes.push(`需要重新創建 ${tableName} 資料表`);
        }
      }
      
      console.log(`🔍 檢查完成: 發現 ${issues.length} 個問題`);
      
      if (issues.length > 0) {
        console.log('❌ 發現的問題:', issues);
        console.log('🔧 建議的修復:', fixes);
        return {
          success: false,
          issues,
          fixes,
          error: `發現 ${issues.length} 個資料表結構問題，請執行 SQL 遷移修復`
        };
      } else {
        console.log('✅ 資料表結構檢查通過');
        return { success: true, message: '所有資料表和欄位都正確存在' };
      }
      
    } catch (error) {
      console.error('❌ 資料表檢查失敗:', error);
      return { success: false, error: error.message };
    }
  },

  // 新增：驗證資料表結構
  async validateSchema() {
    try {
      const supabase = createSupabaseClient();
      if (!supabase) throw new Error('Supabase 客戶端未初始化');

      console.log('🔍 驗證資料表結構...');
      
      // 測試關鍵功能
      const tests = [
        {
          name: 'users 表基本功能',
          test: () => supabase.from('users').select('id, email, full_name, role').limit(1)
        },
        {
          name: 'drivers 表基本功能', 
          test: () => supabase.from('drivers').select('id, user_id, verification_status').limit(1)
        },
        {
          name: 'orders 表基本功能',
          test: () => supabase.from('orders').select('id, passenger_id, status').limit(1)
        },
        {
          name: 'vehicles 表基本功能',
          test: () => supabase.from('vehicles').select('id, driver_id, license_plate').limit(1)
        }
      ];

      const results = [];
      for (const test of tests) {
        try {
          await test.test();
          results.push({ test: test.name, success: true });
        } catch (error) {
          results.push({ test: test.name, success: false, error: error.message });
        }
      }
      
      const failedTests = results.filter(r => !r.success);
      
      if (failedTests.length > 0) {
        return {
          success: false,
          error: `${failedTests.length} 個資料表結構測試失敗`,
          details: failedTests
        };
      }
      
      return { success: true, message: '所有資料表結構驗證通過' };
      
    } catch (error) {
      console.error('❌ 資料表結構驗證失敗:', error);
      return { success: false, error: error.message };
    }
  },

  // 初始化基本資料
  async initializeBasicData() {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 客戶端未初始化');

      // 檢查並插入預設計費配置
      const { data: pricingConfig } = await client
        .from('pricing_config')
        .select('*')
        .eq('is_active', true)
        .limit(1);

      if (!pricingConfig || pricingConfig.length === 0) {
        await client
          .from('pricing_config')
          .insert([{
            name: '標準計費',
            base_fare: 85.00,
            per_km_rate: 12.00,
            per_minute_rate: 2.50,
            minimum_fare: 85.00,
            maximum_fare: 2000.00,
            is_active: true
          }]);
        console.log('✅ 已插入預設計費配置');
      }

      // 檢查並插入車型資料
      const { data: vehicleTypes } = await client
        .from('vehicle_types')
        .select('*')
        .eq('is_active', true);

      if (!vehicleTypes || vehicleTypes.length === 0) {
        await client
          .from('vehicle_types')
          .insert([
            { name: '經濟型', description: '標準四人座轎車', base_multiplier: 1.0, capacity: 4, is_active: true },
            { name: '舒適型', description: '舒適型轎車', base_multiplier: 1.2, capacity: 4, is_active: true },
            { name: '豪華型', description: '豪華轎車', base_multiplier: 1.5, capacity: 4, is_active: true }
          ]);
        console.log('✅ 已插入預設車型資料');
      }

      // 檢查並插入尖峰時段
      const { data: surgeData } = await client
        .from('surge_pricing')
        .select('*')
        .eq('is_active', true);

      if (!surgeData || surgeData.length === 0) {
        await client
          .from('surge_pricing')
          .insert([
            { name: '早高峰', multiplier: 1.5, start_time: '07:00', end_time: '09:00', days_of_week: [1,2,3,4,5], is_active: true },
            { name: '晚高峰', multiplier: 1.5, start_time: '17:00', end_time: '19:00', days_of_week: [1,2,3,4,5], is_active: true }
          ]);
        console.log('✅ 已插入預設尖峰時段');
      }

      return { success: true, message: '基本資料初始化完成' };
    } catch (error) {
      console.error('❌ 基本資料初始化失敗:', error);
      return { success: false, error: error.message };
    }
  },

  // 完整系統檢查
  async runSystemCheck() {
    console.log('🔍 開始系統完整性檢查...');
    
    const results = [];

    // 1. 檢查連接
    const connectionResult = await this.checkConnection();
    results.push({ test: '資料庫連接', ...connectionResult });

    if (!connectionResult.success) {
      return { success: false, results, error: '資料庫連接失敗，請檢查 Supabase 配置' };
    }

    // 2. 檢查資料表
    const tablesResult = await this.checkRequiredTables();
    results.push({ test: '資料表檢查', ...tablesResult });

    if (!tablesResult.success) {
      return { 
        success: false, 
        results, 
        error: '缺少必要資料表，請在 Supabase SQL Editor 中執行遷移文件',
        missingTables: tablesResult.missingTables
      };
    }

    // 3. 檢查測試帳號
    const testAccountsResult = await this.checkTestAccounts();
    results.push({ test: '測試帳號檢查', ...testAccountsResult });
    
    // 4. 初始化基本資料
    const dataResult = await this.initializeBasicData();
    results.push({ test: '基本資料初始化', ...dataResult });

    const allPassed = results.every(r => r.success);

    return {
      success: allPassed,
      results,
      message: allPassed ? '系統檢查完全通過，可以開始使用' : '發現問題，請查看詳細結果'
    };
  },

  // 檢查測試帳號
  async checkTestAccounts() {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 客戶端未初始化');

      console.log('🔍 檢查測試帳號...');
      
      // 檢查乘客測試帳號
      const { data: passenger } = await client
        .from('users')
        .select('*')
        .eq('email', 'test_passenger@example.com')
        .maybeSingle();

      // 檢查司機測試帳號
      const { data: driver } = await client
        .from('users')
        .select('*')
        .eq('email', 'test_driver@example.com')
        .maybeSingle();

      // 檢查管理員測試帳號
      const { data: admin } = await client
        .from('admin_users')
        .select('*')
        .eq('username', 'admin')
        .maybeSingle();

      const accountsStatus = {
        passenger: !!passenger,
        driver: !!driver,
        admin: !!admin
      };

      const missingAccounts = Object.entries(accountsStatus)
        .filter(([_, exists]) => !exists)
        .map(([type, _]) => type);

      if (missingAccounts.length > 0) {
        return {
          success: false,
          message: `缺少測試帳號: ${missingAccounts.join(', ')}`,
          data: accountsStatus
        };
      }

      return {
        success: true,
        message: '所有測試帳號都存在',
        data: accountsStatus
      };
    } catch (error) {
      console.error('❌ 檢查測試帳號失敗:', error);
      return { success: false, error: error.message };
    }
  }
};

export default databaseSetupService;