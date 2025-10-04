// 司機申請審核服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';
import { createClient } from '@supabase/supabase-js';

export interface DriverApplicationData {
  // 基本資料
  full_name: string;
  phone_number: string;
  id_number: string;
  email?: string;
  
  // 駕照資料
  license_number: string;
  license_expiry: string;
  license_class?: string;
  
  // 車輛資料
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_year?: string;
  vehicle_color?: string;
  
  // 緊急聯絡人
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation?: string;
  
  // 街口帳號（顯示用）
  jkopay_account?: string;
  jkopay_name?: string;
  
  // 密碼
  password: string;
}

export interface DriverApplication {
  id: string;
  user_id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
  // ... 其他欄位
}

export const driverApplicationService = {
  // 提交司機申請
  async submitDriverApplication(applicationData: DriverApplicationData) {
    console.log('📝 開始處理司機申請:', applicationData.full_name);
    
    if (isDemoMode) {
      console.log('🎭 演示模式 - 司機申請');
      return {
        success: true,
        data: {
          id: 'demo-app-' + Date.now(),
          status: 'pending',
          submitted_at: new Date().toISOString()
        },
        message: '✅ 申請已成功提交！\n\n📋 申請編號：DEMO-' + Date.now().toString().slice(-6) + '\n⏰ 審核時間：1-3個工作天\n📧 審核結果將以簡訊通知'
      };
    }

    try {
      console.log('🔗 獲取 Supabase 客戶端...');
      const client = getSupabaseClient();
      if (!client) {
        console.log('🎭 Supabase 未配置，使用演示模式');
        return {
          success: true,
          data: {
            id: 'demo-app-' + Date.now(),
            status: 'pending',
            submitted_at: new Date().toISOString()
          },
          message: '✅ 申請已成功提交！\n\n📋 申請編號：DEMO-' + Date.now().toString().slice(-6) + '\n⏰ 審核時間：1-3個工作天\n📧 審核結果將以簡訊通知'
        };
      }

      console.log('🔍 檢查手機號碼是否已存在...');
      const { data: existingUser, error: checkError } = await client
        .from('users')
        .select('id, phone_number, phone, role, status')
        .or(`phone_number.eq.${applicationData.phone_number},phone.eq.${applicationData.phone_number}`)
        .maybeSingle();

      if (checkError) {
        console.warn('⚠️ 檢查現有用戶時出現問題:', checkError.message);
        // 繼續執行，可能是權限問題
      }

      if (existingUser) {
        console.log('❌ 手機號碼已存在');
        return {
          success: false,
          error: '此手機號碼已被註冊，請使用其他號碼或直接登入'
        };
      }

      console.log('👤 開始創建用戶和申請記錄...');
      try {
        const userId = crypto.randomUUID();
        const applicationId = crypto.randomUUID();

        // 1. 先創建用戶記錄（因為 driver_applications 有外鍵約束）
        const { data: userData, error: userError } = await client
          .from('users')
          .insert([{
            id: userId,
            phone_number: applicationData.phone_number,
            phone: applicationData.phone_number,
            full_name: applicationData.full_name,
            name: applicationData.full_name,
            email: applicationData.email || `driver_${applicationData.phone_number}@blackfeather.com`,
            password_hash: btoa(applicationData.password),
            role: 'driver',
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
              error: '🔒 資料庫權限問題！\n\n請在 Supabase SQL Editor 中執行：\nsupabase/migrations/complete_system_rebuild.sql\n\n執行後重新註冊即可！'
            };
          }
          throw userError;
        }
        console.log('✅ 用戶創建成功');

        // 2. 創建申請記錄（供後台審核查看）
        console.log('📝 創建申請記錄...');
        const { data: applicationRecord, error: appError } = await client
          .from('driver_applications')
          .insert([{
            id: applicationId,
            user_id: userId,
            full_name: applicationData.full_name,
            phone_number: applicationData.phone_number,
            email: applicationData.email || `driver_${applicationData.phone_number}@blackfeather.com`,
            id_number: applicationData.id_number,
            license_number: applicationData.license_number,
            license_expiry: applicationData.license_expiry,
            license_class: applicationData.license_class,
            vehicle_brand: applicationData.vehicle_brand,
            vehicle_model: applicationData.vehicle_model,
            vehicle_plate: applicationData.vehicle_plate,
            vehicle_year: applicationData.vehicle_year,
            vehicle_color: applicationData.vehicle_color,
            emergency_contact_name: applicationData.emergency_contact_name,
            emergency_contact_phone: applicationData.emergency_contact_phone,
            emergency_contact_relation: applicationData.emergency_contact_relation,
            jkopay_account: applicationData.jkopay_account,
            jkopay_name: applicationData.jkopay_name,
            status: 'pending',
            priority: 'normal',
            submitted_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (appError) {
          console.warn('⚠️ 創建申請記錄警告:', appError.message);
        } else {
          console.log('✅ 申請記錄創建成功');
        }

        // 3. 創建司機詳細資料
        const { data: driverData, error: driverError } = await client
          .from('drivers')
          .insert([{
            id: userId,
            user_id: userId,
            application_id: applicationId,
            name: applicationData.full_name,
            phone: applicationData.phone_number,
            email: applicationData.email,
            id_number: applicationData.id_number,
            license_number: applicationData.license_number,
            license_expiry: applicationData.license_expiry,
            vehicle_brand: applicationData.vehicle_brand,
            vehicle_model: applicationData.vehicle_model,
            vehicle_plate: applicationData.vehicle_plate,
            vehicle_color: applicationData.vehicle_color,
            verification_status: 'pending',
            work_status: 'offline',
            total_earnings: 0,
            emergency_contact_name: applicationData.emergency_contact_name,
            emergency_contact_phone: applicationData.emergency_contact_phone,
            emergency_contact_relation: applicationData.emergency_contact_relation,
            jkopay_account: applicationData.jkopay_account ? {
              account: applicationData.jkopay_account,
              name: applicationData.jkopay_name || applicationData.full_name
            } : null
          }])
          .select()
          .single();

        if (driverError) {
          console.warn('⚠️ 司機詳細資料創建警告:', driverError.message);
        }

        // 4. 創建車輛資料
        if (applicationData.vehicle_brand && applicationData.vehicle_plate) {
          const { error: vehicleError } = await client
            .from('vehicles')
            .insert([{
              driver_id: userId,
              user_id: userId,
              license_plate: applicationData.vehicle_plate,
              make: applicationData.vehicle_brand.split(' ')[0] || 'Unknown',
              model: applicationData.vehicle_model || applicationData.vehicle_brand,
              year: 2020,
              color: applicationData.vehicle_color || '白色',
              car_type: 'economy',
              status: 'active'
            }]);

          if (vehicleError) {
            console.warn('⚠️ 車輛資料創建警告:', vehicleError.message);
          }
        }

        return {
          success: true,
          data: {
            id: applicationId,
            user_id: userId,
            status: 'pending',
            submitted_at: new Date().toISOString()
          },
          message: '✅ 註冊成功！\n\n您的申請已提交，請等待管理員審核。審核通過後即可開始接單。'
        };
        
      } catch (userCreationError) {
        console.error('❌ 用戶創建失敗:', userCreationError.message);
        
        // RLS 錯誤特別處理
        if (userCreationError.code === '42501') {
          return {
            success: false,
            error: '🔒 資料庫權限問題！\n\n請在 Supabase SQL Editor 中執行：\nsupabase/migrations/complete_system_rebuild.sql\n\n執行後重新註冊即可！'
          };
        }
        
        return {
          success: false,
          error: '註冊失敗：' + (userCreationError.message || '請稍後再試')
        };
      }
    } catch (error) {
      console.error('❌ 提交申請錯誤:', error.message);
      
      // 特別處理 RLS 錯誤
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        return {
          success: false,
          error: '🔒 資料庫權限問題！\n\n請在 Supabase SQL Editor 中執行：\nsupabase/migrations/complete_system_rebuild.sql\n\n執行後重新註冊即可！'
        };
      }
      
      // 處理 Auth 頻率限制錯誤
      if (error.code === 'over_email_send_rate_limit' || error.status === 429) {
        return {
          success: false,
          error: '⏰ 註冊頻率限制！\n\n請等待 60 秒後再試，或使用測試帳號：\n🚗 司機：0982214855 / BOSS08017'
        };
      }
      
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return {
          success: false,
          error: '手機號碼、身分證字號或車牌號碼已被使用，請檢查或聯絡客服'
        };
      }
      
      return {
        success: false,
        error: '申請提交失敗：' + (error.message || '請稍後再試')
      };
    }
  },

  // 獲取申請狀態
  async getApplicationStatus(userId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return { success: true, data: null };
      }

      const { data, error } = await client
        .from('driver_applications')
        .select(`
          id, status, priority, submitted_at, reviewed_at,
          rejection_reason, admin_notes,
          reviewed_by,
          admin_users!driver_applications_reviewed_by_fkey (name)
        `)
        .eq('phone_number', userId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('⚠️ 查詢申請狀態警告:', error.message);
        return { success: true, data: null };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('獲取申請狀態錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取所有申請（管理員用）
  async getPendingApplications() {
    console.log('📋 開始獲取司機申請列表...');

    if (isDemoMode) {
      console.log('🎭 演示模式 - 獲取申請列表');
      return {
        success: true,
        data: [
          {
            id: 'demo-app-001',
            full_name: '張司機',
            phone_number: '0912345678',
            id_number: 'A123456789',
            license_number: 'TEST123456',
            vehicle_brand: 'Toyota',
            vehicle_model: 'Prius',
            vehicle_plate: 'ABC-1234',
            status: 'pending',
            priority: 'normal',
            submitted_at: new Date().toISOString()
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) {
        console.error('❌ Supabase 客戶端未連接');
        throw new Error('Supabase 未配置');
      }

      console.log('🔍 查詢 driver_applications 表...');
      const { data, error } = await client
        .from('driver_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢錯誤:', error);
        console.error('錯誤代碼:', error.code);
        console.error('錯誤訊息:', error.message);
        throw error;
      }

      console.log(`✅ 成功獲取 ${data?.length || 0} 筆申請記錄`);
      if (data && data.length > 0) {
        console.log('📊 申請狀態分佈:');
        const statusCount = data.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {});
        console.log(statusCount);
        console.log('前3筆申請:', data.slice(0, 3).map(app => ({
          name: app.full_name,
          phone: app.phone_number,
          status: app.status
        })));
      } else {
        console.warn('⚠️ 沒有找到任何申請記錄');
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ 獲取申請列表錯誤:', error);
      console.error('完整錯誤:', JSON.stringify(error, null, 2));
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
        .from('driver_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (getError) throw getError;

      // 2. 更新申請狀態
      const { error: updateError } = await client
        .from('driver_applications')
        .update({
          status: 'approved',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          admin_notes: notes
        })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // 3. 更新用戶狀態為 active
      const { error: userUpdateError } = await client
        .from('users')
        .update({
          status: 'active',
          phone_verified: true,
          verification_status: 'approved'
        })
        .eq('id', application.user_id);

      if (userUpdateError) throw userUpdateError;

      // 4. 更新司機記錄為 approved（如果已存在）
      const { error: driverUpdateError } = await client
        .from('drivers')
        .update({
          verification_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: adminId
        })
        .eq('user_id', application.user_id);

      if (driverUpdateError) {
        console.warn('⚠️ 更新司機狀態警告:', driverUpdateError.message);
      }

      // 5. 如果司機記錄不存在，創建新的司機記錄
      const { error: driverError } = await client
        .from('drivers')
        .insert([{
          id: application.user_id,
          user_id: application.user_id,
          application_id: applicationId,
          name: application.full_name,
          phone: application.phone_number,
          email: application.email,
          license_number: application.license_number,
          id_number: application.id_number,
          vehicle_model: `${application.vehicle_brand} ${application.vehicle_model}`,
          vehicle_plate: application.vehicle_plate,
          vehicle_year: application.vehicle_year?.toString(),
          vehicle_color: application.vehicle_color,
          emergency_contact_name: application.emergency_contact_name,
          emergency_contact_phone: application.emergency_contact_phone,
          jkopay_account: application.jkopay_account ? {
            account: application.jkopay_account,
            name: application.jkopay_name || application.full_name
          } : null,
          verification_status: 'approved',
          approval_status: 'approved',
          work_status: 'offline',
          total_earnings: 0,
          approved_at: new Date().toISOString(),
          approved_by: adminId
        }]);

      if (driverError && driverError.code !== '23505') {
        console.warn('⚠️ 創建司機記錄警告:', driverError.message);
      }

      // 6. 創建車輛記錄
      const [brand, ...modelParts] = application.vehicle_brand.split(' ');
      const model = modelParts.join(' ') || application.vehicle_model;

      await client
        .from('vehicles')
        .insert([{
          driver_id: application.user_id,
          license_plate: application.vehicle_plate,
          make: brand,
          model: model,
          year: application.vehicle_year || 2020,
          color: application.vehicle_color || '未指定',
          car_type: 'economy',
          status: 'active'
        }])
        .select()
        .maybeSingle();

      // 7. 發送通知給申請者
      await client
        .from('notifications')
        .insert([{
          user_id: application.user_id,
          title: '🎉 申請審核通過！',
          message: '恭喜！您的司機申請已通過審核，現在可以開始接單工作了。歡迎加入 Black feather 司機團隊！',
          type: 'system'
        }]);

      return {
        success: true,
        message: '申請已審核通過，司機帳號已啟用'
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
        .from('driver_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (getError) throw getError;

      // 2. 更新申請狀態
      const { error: updateError } = await client
        .from('driver_applications')
        .update({
          status: 'rejected',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
          admin_notes: notes
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

      // 4. 發送通知給申請者
      await client
        .from('notifications')
        .insert([{
          user_id: application.user_id,
          title: '申請審核結果',
          message: `很抱歉，您的司機申請未通過審核。\n\n拒絕原因：${reason}\n\n如有疑問，請聯絡客服：0800-123-456`,
          type: 'system'
        }]);

      return {
        success: true,
        message: '申請已拒絕，通知已發送給申請者'
      };
    } catch (error) {
      console.error('拒絕申請錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取申請詳情
  async getApplicationDetails(applicationId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('driver_applications')
        .select(`
          *,
          user:users!driver_applications_user_id_fkey (name, email, created_at),
          documents:application_documents (*),
          logs:approval_logs (
            *,
            admin:admin_users!approval_logs_admin_id_fkey (name)
          )
        `)
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取申請詳情錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 更新申請優先級
  async updateApplicationPriority(applicationId: string, priority: 'low' | 'normal' | 'high' | 'urgent', adminId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { error } = await client
        .from('driver_applications')
        .update({
          priority,
          reviewed_by: adminId,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;
      return { success: true, message: '優先級已更新' };
    } catch (error) {
      console.error('更新優先級錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default driverApplicationService;