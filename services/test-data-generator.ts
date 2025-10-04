// 測試資料生成器
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export const testDataGenerator = {
  // 生成測試訂單
  async generateTestOrders(driverId: string = 'test-driver-001', count: number = 5) {
    if (isDemoMode) {
      console.log('🎭 演示模式 - 生成測試訂單');
      return { success: true, message: `已生成 ${count} 個測試訂單` };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const testOrders = [];
      const locations = [
        { name: '台北車站', lat: 25.0478, lng: 121.5170 },
        { name: '松山機場', lat: 25.0697, lng: 121.5522 },
        { name: '信義區市政府', lat: 25.0408, lng: 121.5598 },
        { name: '內湖科技園區', lat: 25.0816, lng: 121.5732 },
        { name: '台北101', lat: 25.0340, lng: 121.5645 },
        { name: '西門町', lat: 25.0420, lng: 121.5071 },
        { name: '士林夜市', lat: 25.0881, lng: 121.5240 },
        { name: '淡水老街', lat: 25.1677, lng: 121.4362 }
      ];

      for (let i = 0; i < count; i++) {
        const pickup = locations[Math.floor(Math.random() * locations.length)];
        const dropoff = locations[Math.floor(Math.random() * locations.length)];
        
        if (pickup === dropoff) continue;

        const distance = this.calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
        const duration = Math.ceil(distance * 2.5); // 假設每公里2.5分鐘
        const baseFare = 85;
        const distanceFare = distance * 12;
        const timeFare = duration * 2.5;
        const totalFare = baseFare + distanceFare + timeFare;

        const statuses = ['pending', 'accepted', 'in_progress', 'completed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        testOrders.push({
          id: `TEST${String(Date.now() + i).slice(-6)}`,
          passenger_id: 'test-passenger-001',
          driver_id: status === 'pending' ? null : driverId,
          vehicle_id: status === 'pending' ? null : 'test-vehicle-001',
          status,
          pickup_address: pickup.name,
          pickup_latitude: pickup.lat,
          pickup_longitude: pickup.lng,
          dropoff_address: dropoff.name,
          dropoff_latitude: dropoff.lat,
          dropoff_longitude: dropoff.lng,
          distance_km: distance,
          duration_minutes: duration,
          base_fare: baseFare,
          distance_fare: distanceFare,
          time_fare: timeFare,
          total_fare: totalFare,
          requested_at: new Date(Date.now() - Math.random() * 86400000).toISOString()
        });
      }

      const { error } = await client
        .from('rides')
        .insert(testOrders);

      if (error) throw error;

      return { success: true, message: `已生成 ${testOrders.length} 個測試訂單` };
    } catch (error) {
      console.error('生成測試訂單錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 生成測試收入記錄
  async generateTestEarnings(driverId: string = 'test-driver-001') {
    if (isDemoMode) {
      console.log('🎭 演示模式 - 生成測試收入');
      return { success: true, message: '已生成測試收入記錄' };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 獲取已完成的訂單
      const { data: completedRides, error } = await client
        .from('rides')
        .select('*')
        .eq('driver_id', driverId)
        .eq('status', 'completed');

      if (error) throw error;

      const paymentRecords = completedRides.map(ride => ({
        ride_id: ride.id,
        user_id: ride.passenger_id,
        driver_id: driverId,
        amount: ride.total_fare,
        payment_method: 'credit_card',
        status: 'completed',
        platform_fee: ride.total_fare * 0.15,
        driver_earnings: ride.total_fare * 0.85,
        processed_at: ride.completed_at
      }));

      if (paymentRecords.length > 0) {
        const { error: paymentError } = await client
          .from('payments')
          .insert(paymentRecords);

        if (paymentError) throw paymentError;
      }

      return { success: true, message: `已生成 ${paymentRecords.length} 筆收入記錄` };
    } catch (error) {
      console.error('生成測試收入錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 計算兩點間距離
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // 地球半徑（公里）
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  },

  // 清除測試資料
  async cleanupTestData() {
    if (isDemoMode) {
      console.log('🎭 演示模式 - 跳過清除測試資料');
      return { success: true, message: '演示模式無需清除' };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 刪除測試相關資料
      const testIds = ['test-driver-001', 'test-passenger-001', 'test-admin-001'];
      
      // 刪除順序很重要，避免外鍵約束錯誤
      await client.from('messages').delete().in('sender_id', testIds);
      await client.from('conversations').delete().contains('participants', testIds);
      await client.from('notifications').delete().in('user_id', testIds);
      await client.from('complaints').delete().in('complainant_id', testIds);
      await client.from('payments').delete().in('user_id', testIds);
      await client.from('rides').delete().in('passenger_id', testIds);
      await client.from('vehicles').delete().eq('driver_id', 'test-driver-001');
      await client.from('drivers').delete().in('id', testIds);
      await client.from('admin_users').delete().in('id', testIds);
      await client.from('users').delete().in('id', testIds);

      return { success: true, message: '測試資料已清除' };
    } catch (error) {
      console.error('清除測試資料錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default testDataGenerator;