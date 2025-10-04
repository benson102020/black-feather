// 乘客管理服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export interface PassengerData {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  rating: number;
  total_rides: number;
  total_spent: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  last_ride_at?: string;
}

export const passengerManagementService = {
  // 獲取所有乘客
  async getAllPassengers() {
    if (isDemoMode) {
      console.log('👥 演示模式 - 獲取所有乘客');
      return {
        success: true,
        data: [
          {
            id: 'test-passenger-001',
            full_name: '測試乘客',
            phone_number: '0987654321',
            email: 'test@passenger.com',
            status: 'active',
            rating: 4.9,
            total_rides: 85,
            total_spent: 12500,
            verification_status: 'verified',
            created_at: new Date().toISOString(),
            last_ride_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('role', 'passenger')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取乘客列表錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 審核乘客
  async approvePassenger(passengerId: string, adminId: string) {
    if (isDemoMode) {
      console.log('✅ 演示模式 - 審核通過乘客:', passengerId);
      return {
        success: true,
        message: '乘客審核已通過'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { error } = await client
        .from('users')
        .update({
          status: 'active',
          phone_verified: true
        })
        .eq('id', passengerId);

      if (error) throw error;

      // 發送通知給乘客
      await client
        .from('notifications')
        .insert([{
          user_id: passengerId,
          title: '帳號審核通過',
          message: '恭喜！您的帳號已通過審核，現在可以開始使用叫車服務了。',
          type: 'system'
        }]);

      return { success: true, message: '乘客審核已通過' };
    } catch (error) {
      console.error('審核乘客錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 停用乘客帳號
  async suspendPassenger(passengerId: string, reason: string, adminId: string) {
    if (isDemoMode) {
      console.log('❌ 演示模式 - 停用乘客帳號:', passengerId);
      return {
        success: true,
        message: '乘客帳號已停用'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { error } = await client
        .from('users')
        .update({
          status: 'suspended'
        })
        .eq('id', passengerId);

      if (error) throw error;

      // 發送通知給乘客
      await client
        .from('notifications')
        .insert([{
          user_id: passengerId,
          title: '帳號已停用',
          message: `您的帳號已被停用。原因：${reason}。如有疑問請聯絡客服。`,
          type: 'system'
        }]);

      return { success: true, message: '乘客帳號已停用' };
    } catch (error) {
      console.error('停用乘客帳號錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取乘客詳細資料
  async getPassengerDetails(passengerId: string) {
    if (isDemoMode) {
      console.log('📄 演示模式 - 獲取乘客詳情:', passengerId);
      return {
        success: true,
        data: {
          id: passengerId,
          full_name: '測試乘客',
          phone_number: '0987654321',
          email: 'test@passenger.com',
          status: 'active',
          rating: 4.9,
          total_rides: 85,
          total_spent: 12500,
          recent_rides: [
            {
              id: 'ride-001',
              pickup: '台北車站',
              dropoff: '松山機場',
              fare: 350,
              completed_at: new Date().toISOString()
            }
          ]
        }
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('users')
        .select(`
          *,
          rides!rides_passenger_id_fkey (
            id,
            pickup_address,
            dropoff_address,
            total_fare,
            completed_at,
            status
          )
        `)
        .eq('id', passengerId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取乘客詳情錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default passengerManagementService;