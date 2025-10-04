// 司機端真實數據服務
import { supabase, getSupabaseClient } from './supabase';

export const driverService = {
  // 獲取司機資料
  async getDriverProfile(driverId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { data, error } = await client
        .from('users')
        .select(`
          *,
          drivers!drivers_user_id_fkey (*),
          vehicles!vehicles_user_id_fkey (*)
        `)
        .eq('id', driverId)
        .eq('role', 'driver')
        .single();

      if (error) throw error;

      const driverData = {
        ...data,
        ...data.drivers[0],
        vehicles: data.vehicles || []
      };

      return { success: true, data: driverData };
    } catch (error) {
      console.error('獲取司機資料錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 更新工作狀態
  async updateWorkStatus(driverId: string, status: 'offline' | 'online' | 'busy') {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { data, error } = await client
        .from('drivers')
        .update({ work_status: status })
        .eq('id', driverId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('更新工作狀態錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 更新司機位置
  async updateLocation(driverId: string, latitude: number, longitude: number) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { error } = await client
        .from('users')
        .update({
          current_location: `POINT(${longitude} ${latitude})`,
          last_location_update: new Date().toISOString()
        })
        .eq('id', driverId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('更新位置錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取司機收入統計
  async getEarningsStats(driverId: string, period: 'today' | 'week' | 'month') {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      let startDate: string;
      const now = new Date();

      switch (period) {
        case 'today':
          startDate = now.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          startDate = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          break;
      }

      const { data, error } = await client
        .from('payments')
        .select('*')
        .eq('driver_id', driverId)
        .eq('status', 'completed')
        .gte('processed_at', startDate);

      if (error) throw error;

      const total = data.reduce((sum, record) => sum + record.amount, 0);
      const commission = data.reduce((sum, record) => sum + record.platform_fee, 0);
      const netAmount = data.reduce((sum, record) => sum + record.driver_earnings, 0);
      const orders = data.length;
      const average = orders > 0 ? total / orders : 0;

      return {
        success: true,
        data: {
          total,
          commission,
          net_amount: netAmount,
          orders,
          average,
          records: data
        }
      };
    } catch (error) {
      console.error('獲取收入統計錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 申請提現
  async requestWithdrawal(driverId: string, amount: number, jkopayAccount: string, jkopayName: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const fee = 15;
      const netAmount = amount - fee;

      const { data, error } = await client
        .from('withdrawals')
        .insert([{
          driver_id: driverId,
          amount,
          fee,
          net_amount: netAmount,
          jkopay_account: jkopayAccount,
          jkopay_name: jkopayName,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, message: '提現申請已提交' };
    } catch (error) {
      console.error('申請提現錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default driverService;