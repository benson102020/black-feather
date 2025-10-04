// 統一認證服務
import { supabase, getSupabaseClient } from './supabase';

export interface LoginRequest {
  phoneNumber?: string;
  username?: string;
  password: string;
  userType: 'driver' | 'passenger' | 'admin';
}

export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  userType: 'driver' | 'passenger';
  // 司機專用欄位
  idNumber?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleColor?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  jkopayAccount?: string;
  jkopayName?: string;
}

export const authService = {
  // 統一登入方法
  async login(request: LoginRequest) {
    console.log(`🔐 ${request.userType} 登入:`, request.phoneNumber || request.username);
    
    try {
      const client = getSupabaseClient();
      if (!client) {
        return this.handleOfflineLogin(request);
      }

      switch (request.userType) {
        case 'driver':
          return await this.loginDriver(request.phoneNumber!, request.password);
        case 'passenger':
          return await this.loginPassenger(request.phoneNumber!, request.password);
        case 'admin':
          return await this.loginAdmin(request.username!, request.password);
        default:
          throw new Error('無效的用戶類型');
      }
    } catch (error) {
      console.error('登入錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 離線模式登入
  handleOfflineLogin(request: LoginRequest) {
    console.log('🎭 離線模式登入');
    
    const testAccounts = {
      driver: { phone: '0982214855', password: 'BOSS08017' },
      passenger: { phone: '0912345678', password: 'test123' },
      admin: { username: 'admin', password: 'ADMIN123' }
    };

    const testAccount = testAccounts[request.userType];
    const identifier = request.phoneNumber || request.username;
    const expectedIdentifier = testAccount.phone || testAccount.username;
    
    if (identifier === expectedIdentifier && request.password === testAccount.password) {
      return {
        success: true,
        user: {
          id: `test-${request.userType}-001`,
          full_name: `測試${request.userType === 'driver' ? '司機' : request.userType === 'passenger' ? '乘客' : '管理員'}`,
          phone_number: request.phoneNumber,
          username: request.username,
          role: request.userType,
          status: 'active'
        },
        token: `offline-token-${Date.now()}`
      };
    }
    
    return { success: false, error: '帳號或密碼錯誤' };
  },

  // 司機登入
  async loginDriver(phoneNumber: string, password: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('users')
        .select(`
          id, phone_number, phone, email, full_name, name, 
          password_hash, role, status, verification_status,
          phone_verified, total_rides, rating, created_at
        `)
        .or(`phone_number.eq.${phoneNumber},phone.eq.${phoneNumber}`)
        .eq('role', 'driver')
        .maybeSingle();

      if (error) throw error;
      if (!data) return { success: false, error: '手機號碼不存在，請先註冊' };

      // 密碼驗證
      const storedPassword = this.decodePassword(data.password_hash);
      if (storedPassword !== password) {
        return { success: false, error: '手機號碼或密碼錯誤' };
      }

      if (data.status !== 'active') {
        return { success: false, error: '帳號未啟用或已被停用' };
      }

      return { success: true, driver: data, token: `driver_${data.id}` };
    } catch (error) {
      console.error('司機登入錯誤:', error);
      return { success: false, error: '登入失敗，請稍後重試' };
    }
  },

  // 乘客登入
  async loginPassenger(phoneNumber: string, password: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('users')
        .select(`
          id, phone_number, phone, email, full_name, name, 
          password_hash, role, status, verification_status,
          phone_verified, total_rides, rating, created_at
        `)
        .or(`phone_number.eq.${phoneNumber},phone.eq.${phoneNumber}`)
        .eq('role', 'user')
        .maybeSingle();

      if (error) throw error;
      if (!data) return { success: false, error: '手機號碼不存在，請先註冊' };

      // 密碼驗證
      const storedPassword = this.decodePassword(data.password_hash);
      if (storedPassword !== password) {
        return { success: false, error: '手機號碼或密碼錯誤' };
      }

      if (data.status !== 'active') {
        return { success: false, error: '帳號未啟用或已被停用' };
      }

      return { success: true, passenger: data, token: `passenger_${data.id}` };
    } catch (error) {
      console.error('乘客登入錯誤:', error);
      return { success: false, error: '登入失敗，請稍後重試' };
    }
  },

  // 管理員登入
  async loginAdmin(username: string, password: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;
      if (!data) return { success: false, error: '管理員帳號不存在' };

      // 密碼驗證
      const storedPassword = this.decodePassword(data.password_hash);
      if (storedPassword !== password) {
        return { success: false, error: '帳號或密碼錯誤' };
      }

      if (data.status !== 'active') {
        return { success: false, error: '管理員帳號已被停用' };
      }

      return { success: true, admin: data, token: `admin_${data.id}` };
    } catch (error) {
      console.error('管理員登入錯誤:', error);
      return { success: false, error: '登入失敗，請稍後重試' };
    }
  },

  // 統一註冊方法
  async register(request: RegisterRequest) {
    console.log(`📝 ${request.userType} 註冊:`, request.fullName);
    
    try {
      const client = getSupabaseClient();
      if (!client) {
        return this.handleOfflineRegister(request);
      }

      switch (request.userType) {
        case 'driver':
          return await this.registerDriver(request);
        case 'passenger':
          return await this.registerPassenger(request);
        default:
          throw new Error('無效的用戶類型');
      }
    } catch (error) {
      console.error('註冊錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 離線模式註冊
  handleOfflineRegister(request: RegisterRequest) {
    console.log('🎭 離線模式註冊');
    return {
      success: true,
      data: {
        id: `offline-${request.userType}-${Date.now()}`,
        ...request,
        status: 'active',
        created_at: new Date().toISOString()
      },
      message: '離線模式註冊成功（演示用）'
    };
  },

  // 司機註冊
  async registerDriver(request: RegisterRequest) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 檢查手機號碼是否已存在
      const { data: existing } = await client
        .from('users')
        .select('id')
        .or(`phone_number.eq.${request.phoneNumber},phone.eq.${request.phoneNumber}`)
        .maybeSingle();

      if (existing) {
        return { success: false, error: '此手機號碼已被註冊' };
      }

      // 創建用戶
      const userId = crypto.randomUUID();
      const { data: userData, error: userError } = await client
        .from('users')
        .insert([{
          id: userId,
          phone_number: request.phoneNumber,
          phone: request.phoneNumber,
          email: request.email || `driver_${request.phoneNumber}@blackfeather.com`,
          full_name: request.fullName,
          name: request.fullName,
          password_hash: btoa(request.password),
          role: 'driver',
          status: 'active',
          verification_status: 'approved',
          phone_verified: true,
          total_rides: 0,
          rating: 5.0
        }])
        .select()
        .single();

      if (userError) throw userError;

      // 創建司機詳細資料
      const { error: driverError } = await client
        .from('drivers')
        .insert([{
          id: userId,
          user_id: userId,
          name: request.fullName,
          phone: request.phoneNumber,
          email: request.email,
          license_number: request.licenseNumber || 'PENDING',
          verification_status: 'approved',
          work_status: 'offline',
          total_earnings: 0,
          emergency_contact_name: request.emergencyName || '未設定',
          emergency_contact_phone: request.emergencyPhone || '未設定',
          jkopay_account: request.jkopayAccount ? {
            account: request.jkopayAccount,
            name: request.jkopayName || request.fullName
          } : null
        }]);

      if (driverError) console.warn('司機詳細資料創建警告:', driverError);

      // 創建車輛資料
      if (request.vehicleBrand && request.vehiclePlate) {
        await client
          .from('vehicles')
          .insert([{
            driver_id: userId,
            license_plate: request.vehiclePlate,
            make: request.vehicleBrand.split(' ')[0] || 'Unknown',
            model: request.vehicleModel || request.vehicleBrand,
            year: parseInt(request.vehicleYear || '2020'),
            color: request.vehicleColor || '白色',
            car_type: 'economy',
            status: 'active'
          }]);
      }

      return {
        success: true,
        data: userData,
        message: '司機註冊成功！您現在可以開始接單了。'
      };
    } catch (error) {
      console.error('司機註冊錯誤:', error);
      return { success: false, error: '註冊失敗：' + error.message };
    }
  },

  // 乘客註冊
  async registerPassenger(request: RegisterRequest) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 檢查手機號碼是否已存在
      const { data: existing } = await client
        .from('users')
        .select('id')
        .or(`phone_number.eq.${request.phoneNumber},phone.eq.${request.phoneNumber}`)
        .maybeSingle();

      if (existing) {
        return { success: false, error: '此手機號碼已被註冊' };
      }

      // 創建用戶
      const { data: userData, error: userError } = await client
        .from('users')
        .insert([{
          phone_number: request.phoneNumber,
          phone: request.phoneNumber,
          email: request.email,
          full_name: request.fullName,
          name: request.fullName,
          password_hash: btoa(request.password),
          role: 'user',
          status: 'active',
          verification_status: 'verified',
          phone_verified: true,
          total_rides: 0,
          rating: 5.0
        }])
        .select()
        .single();

      if (userError) throw userError;

      return {
        success: true,
        data: userData,
        message: '乘客註冊成功！歡迎使用 Black feather 叫車服務。'
      };
    } catch (error) {
      console.error('乘客註冊錯誤:', error);
      return { success: false, error: '註冊失敗：' + error.message };
    }
  },

  // 密碼解碼
  decodePassword(encodedPassword: string): string {
    try {
      // 處理特殊測試帳號
      if (encodedPassword === 'Qk9TUzA4MDE3') return 'BOSS08017';
      if (encodedPassword === 'dGVzdDEyMw==') return 'test123';
      if (encodedPassword === 'QURNSU4xMjM=') return 'ADMIN123';
      
      return atob(encodedPassword);
    } catch (error) {
      console.error('密碼解碼失敗:', error);
      return '';
    }
  },

  // 檢查系統狀態
  async checkSystemStatus() {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          success: true,
          mode: 'offline',
          message: '離線模式運行'
        };
      }

      // 測試基本連接
      const { data, error } = await client
        .from('users')
        .select('count')
        .limit(1);

      if (error) throw error;

      return {
        success: true,
        mode: 'online',
        message: '系統連接正常'
      };
    } catch (error) {
      return {
        success: false,
        mode: 'error',
        error: error.message
      };
    }
  }
};

export default authService;