// 後台管理 API 服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export const adminApiService = {
  // 獲取系統統計
  async getSystemStats() {
    if (isDemoMode) {
      console.log('📊 演示模式 - 系統統計');
      return {
        success: true,
        data: {
          totalUsers: 1250,
          totalDrivers: 85,
          totalOrders: 3420,
          totalRevenue: 856000,
          activeOrders: 12,
          onlineDrivers: 23,
          todayOrders: 156,
          todayRevenue: 38500
        }
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 並行查詢各項統計
      const [usersResult, driversResult, ridesResult, paymentsResult] = await Promise.all([
        client.from('users').select('count').eq('role', 'passenger'),
        client.from('users').select('count').eq('role', 'driver'),
        client.from('rides').select('count'),
        client.from('payments').select('sum(amount)').eq('status', 'completed')
      ]);

      return {
        success: true,
        data: {
          totalUsers: usersResult.data?.[0]?.count || 0,
          totalDrivers: driversResult.data?.[0]?.count || 0,
          totalOrders: ridesResult.data?.[0]?.count || 0,
          totalRevenue: paymentsResult.data?.[0]?.sum || 0,
          activeOrders: 0, // 需要額外查詢
          onlineDrivers: 0 // 需要額外查詢
        }
      };
    } catch (error) {
      console.error('獲取系統統計錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取所有司機
  async getAllDrivers() {
    if (isDemoMode) {
      console.log('👥 演示模式 - 獲取所有司機');
      return {
        success: true,
        data: [
          {
            id: 'test-driver-001',
            full_name: '測試司機',
            phone_number: '0982214855',
            id_number: 'A123456789',
            license_number: 'TEST123456',
            license_expiry: '2025-12-31',
            vehicle_brand: 'Toyota',
            vehicle_model: 'Vios',
            vehicle_plate: 'TEST-001',
            emergency_contact_name: '測試聯絡人',
            emergency_contact_phone: '0988888888',
            verification_status: 'approved',
            work_status: 'offline',
            rating: 4.8,
            total_orders: 156,
            total_earnings: 125000,
            created_at: new Date().toISOString()
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('users')
        .select(`
          *,
          drivers (*),
          vehicles (*)
        `)
        .eq('role', 'driver')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(user => ({
        ...user,
        ...user.drivers[0],
        vehicles: user.vehicles
      }));

      return { success: true, data: formattedData };
    } catch (error) {
      console.error('獲取司機列表錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 審核司機
  async approveDriver(driverId: string, adminId: string) {
    if (isDemoMode) {
      console.log('✅ 演示模式 - 審核通過司機:', driverId);
      return {
        success: true,
        message: '司機審核已通過'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { error } = await client
        .from('drivers')
        .update({
          verification_status: 'approved',
          verified_at: new Date().toISOString(),
          verified_by: adminId
        })
        .eq('id', driverId);

      if (error) throw error;

      // 發送通知給司機
      await client
        .from('notifications')
        .insert([{
          user_id: driverId,
          title: '審核通過',
          message: '恭喜！您的司機申請已通過審核，現在可以開始接單了。',
          type: 'system'
        }]);

      return { success: true, message: '司機審核已通過' };
    } catch (error) {
      console.error('審核司機錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 拒絕司機申請
  async rejectDriver(driverId: string, reason: string, adminId: string) {
    if (isDemoMode) {
      console.log('❌ 演示模式 - 拒絕司機申請:', driverId);
      return {
        success: true,
        message: '司機申請已拒絕'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { error } = await client
        .from('drivers')
        .update({
          verification_status: 'rejected',
          verification_notes: reason,
          verified_at: new Date().toISOString(),
          verified_by: adminId
        })
        .eq('id', driverId);

      if (error) throw error;

      // 發送通知給司機
      await client
        .from('notifications')
        .insert([{
          user_id: driverId,
          title: '審核未通過',
          message: `很抱歉，您的司機申請未通過審核。原因：${reason}`,
          type: 'system'
        }]);

      return { success: true, message: '司機申請已拒絕' };
    } catch (error) {
      console.error('拒絕司機申請錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取所有訂單
  async getAllOrders() {
    if (isDemoMode) {
      console.log('📋 演示模式 - 獲取所有訂單');
      return {
        success: true,
        data: [
          {
            id: 'RD20241225001',
            status: 'in_progress',
            passenger: { name: '王先生', phone: '0987654321' },
            driver: { name: '張司機', phone: '0912345678' },
            pickup: '台北車站',
            dropoff: '松山機場',
            fare: 350,
            distance: 12.5,
            createdAt: new Date().toISOString()
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('rides')
        .select(`
          *,
          passenger:users!rides_passenger_id_fkey (full_name, phone_number),
          driver:users!rides_driver_id_fkey (full_name, phone_number)
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取訂單列表錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 發送系統通知
  async sendSystemNotification(title: string, message: string, targetAudience: 'all' | 'drivers' | 'passengers') {
    if (isDemoMode) {
      console.log('📢 演示模式 - 發送系統通知:', title);
      return {
        success: true,
        message: '系統通知已發送'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 獲取目標用戶
      let targetUsers = [];
      if (targetAudience === 'all') {
        const { data } = await client.from('users').select('id');
        targetUsers = data || [];
      } else {
        const role = targetAudience === 'drivers' ? 'driver' : 'passenger';
        const { data } = await client.from('users').select('id').eq('role', role);
        targetUsers = data || [];
      }

      // 批量插入通知
      const notifications = targetUsers.map(user => ({
        user_id: user.id,
        title,
        message,
        type: 'system'
      }));

      const { error } = await client
        .from('notifications')
        .insert(notifications);

      if (error) throw error;

      return { success: true, message: `已向 ${targetUsers.length} 位用戶發送通知` };
    } catch (error) {
      console.error('發送系統通知錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default adminApiService;