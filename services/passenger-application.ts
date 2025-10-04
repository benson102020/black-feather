// 乘客申請審核服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export interface PassengerApplicationData {
  fullName: string;
  phoneNumber: string;
  email?: string;
  password: string;
}

export interface PassengerApplication {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  created_at: string;
}

export const passengerApplicationService = {
  // 提交乘客註冊申請
  async submitPassengerApplication(applicationData: PassengerApplicationData) {
    console.log('📝 開始處理乘客註冊申請:', applicationData.fullName);

    if (isDemoMode) {
      console.log('🎭 演示模式 - 乘客申請');
      return {
        success: true,
        data: {
          id: 'demo-app-' + Date.now(),
          status: 'pending',
          submitted_at: new Date().toISOString()
        },
        message: '✅ 申請已成功提交！\n\n等待管理員審核...'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          success: false,
          error: 'Supabase 未配置'
        };
      }

      // 檢查手機號碼是否已存在
      console.log('🔍 檢查手機號碼是否已存在...');
      const { data: existingUser } = await client
        .from('users')
        .select('id, phone_number, phone')
        .or(`phone_number.eq.${applicationData.phoneNumber},phone.eq.${applicationData.phoneNumber}`)
        .maybeSingle();

      if (existingUser) {
        console.log('❌ 手機號碼已存在');
        return {
          success: false,
          error: '此手機號碼已被註冊，請使用其他號碼或直接登入'
        };
      }

      const userId = crypto.randomUUID();
      const applicationId = crypto.randomUUID();

      // 1. 創建用戶記錄（狀態為 pending）
      console.log('👤 創建用戶記錄...');
      const { data: userData, error: userError } = await client
        .from('users')
        .insert([{
          id: userId,
          phone_number: applicationData.phoneNumber,
          phone: applicationData.phoneNumber,
          full_name: applicationData.fullName,
          name: applicationData.fullName,
          email: applicationData.email || `passenger_${applicationData.phoneNumber}@blackfeather.com`,
          password_hash: btoa(applicationData.password),
          role: 'passenger',
          status: 'pending',
          verification_status: 'pending',
          phone_verified: false,
          total_rides: 0,
          rating: 5.0
        }])
        .select()
        .single();

      if (userError) {
        console.error('❌ 創建用戶失敗:', userError.message);
        if (userError.code === '42501') {
          return {
            success: false,
            error: '🔒 資料庫權限問題！請聯絡系統管理員'
          };
        }
        throw userError;
      }
      console.log('✅ 用戶創建成功');

      // 2. 創建申請記錄
      console.log('📝 創建申請記錄...');
      const { data: applicationRecord, error: appError } = await client
        .from('user_applications')
        .insert([{
          id: applicationId,
          user_id: userId,
          name: applicationData.fullName,
          phone: applicationData.phoneNumber,
          email: applicationData.email || `passenger_${applicationData.phoneNumber}@blackfeather.com`,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (appError) {
        console.warn('⚠️ 創建申請記錄警告:', appError.message);
      } else {
        console.log('✅ 申請記錄創建成功');
      }

      return {
        success: true,
        data: {
          id: applicationId,
          user_id: userId,
          status: 'pending',
          submitted_at: new Date().toISOString()
        },
        message: '✅ 申請已提交！\n\n請等待管理員審核，審核通過後即可登入使用。'
      };
    } catch (error) {
      console.error('❌ 提交申請錯誤:', error);
      return {
        success: false,
        error: '申請提交失敗：' + (error.message || '請稍後再試')
      };
    }
  },

  // 獲取所有申請（管理員用）
  async getAllApplications() {
    if (isDemoMode) {
      console.log('📋 演示模式 - 獲取乘客申請列表');
      return {
        success: true,
        data: [
          {
            id: 'demo-app-001',
            name: '張乘客',
            phone: '0923456789',
            email: 'passenger@example.com',
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('user_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('獲取申請列表錯誤:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  // 審核通過申請
  async approveApplication(applicationId: string, adminId: string, notes?: string) {
    if (isDemoMode) {
      console.log('✅ 演示模式 - 審核通過申請:', applicationId);
      return {
        success: true,
        message: '申請已審核通過'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 1. 獲取申請詳情
      const { data: application, error: getError } = await client
        .from('user_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (getError) throw getError;

      // 2. 更新申請狀態
      const { error: updateError } = await client
        .from('user_applications')
        .update({
          status: 'approved',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          notes: notes
        })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // 3. 更新用戶狀態為 active
      const { error: userUpdateError } = await client
        .from('users')
        .update({
          status: 'active',
          verification_status: 'approved',
          phone_verified: true
        })
        .eq('id', application.user_id);

      if (userUpdateError) throw userUpdateError;

      // 4. 發送通知
      await client
        .from('notifications')
        .insert([{
          user_id: application.user_id,
          title: '🎉 註冊審核通過！',
          message: '恭喜！您的乘客註冊已通過審核，現在可以開始使用叫車服務了。歡迎加入 Black feather！',
          type: 'system'
        }]);

      return {
        success: true,
        message: '申請已審核通過，乘客帳號已啟用'
      };
    } catch (error) {
      console.error('審核通過錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 拒絕申請
  async rejectApplication(applicationId: string, adminId: string, reason: string, notes?: string) {
    if (isDemoMode) {
      console.log('❌ 演示模式 - 拒絕申請:', applicationId);
      return {
        success: true,
        message: '申請已拒絕'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 1. 獲取申請詳情
      const { data: application, error: getError } = await client
        .from('user_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (getError) throw getError;

      // 2. 更新申請狀態
      const { error: updateError } = await client
        .from('user_applications')
        .update({
          status: 'rejected',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          notes: `${reason}\n${notes || ''}`
        })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // 3. 更新用戶狀態
      const { error: userUpdateError } = await client
        .from('users')
        .update({
          status: 'rejected',
          verification_status: 'rejected'
        })
        .eq('id', application.user_id);

      if (userUpdateError) throw userUpdateError;

      // 4. 發送通知
      await client
        .from('notifications')
        .insert([{
          user_id: application.user_id,
          title: '註冊審核結果',
          message: `很抱歉，您的註冊申請未通過審核。\n\n拒絕原因：${reason}\n\n如有疑問，請聯絡客服：0800-123-456`,
          type: 'system'
        }]);

      return {
        success: true,
        message: '申請已拒絕，通知已發送'
      };
    } catch (error) {
      console.error('拒絕申請錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default passengerApplicationService;
