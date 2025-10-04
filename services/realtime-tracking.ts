// 實時追蹤服務
import { supabase, getSupabaseClient } from './supabase';

export interface TrackingData {
  rideId: string;
  driverId: string;
  passengerId: string;
  driverLocation: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    timestamp: string;
  };
  passengerLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: number; // 分鐘
  distance: number; // 公里
  status: string;
}

export const realtimeTrackingService = {
  // 開始追蹤訂單
  async startTracking(rideId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      // 獲取訂單詳情
      const { data: ride, error } = await client
        .from('rides')
        .select(`
          *,
          passenger:users!rides_passenger_id_fkey (*),
          driver:users!rides_driver_id_fkey (*),
          vehicle:vehicles!rides_vehicle_id_fkey (*)
        `)
        .eq('id', rideId)
        .single();

      if (error) throw error;

      return { success: true, data: ride };
    } catch (error) {
      console.error('開始追蹤錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 更新司機位置
  async updateDriverLocation(driverId: string, latitude: number, longitude: number, heading?: number, speed?: number) {
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

      // 同時更新車輛位置
      await client
        .from('vehicles')
        .update({
          current_location: `POINT(${longitude} ${latitude})`,
          last_location_update: new Date().toISOString()
        })
        .eq('driver_id', driverId);

      return { success: true };
    } catch (error) {
      console.error('更新司機位置錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 訂閱司機位置更新
  subscribeToDriverLocation(driverId: string, callback: (location: any) => void) {
    const client = getSupabaseClient();
    if (!client) {
      console.warn('Supabase 未配置，無法訂閱位置更新');
      return null;
    }

    return client
      .channel(`driver-location-${driverId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${driverId}`
      }, (payload) => {
        if (payload.new.current_location) {
          callback({
            driverId,
            location: payload.new.current_location,
            timestamp: payload.new.last_location_update
          });
        }
      })
      .subscribe();
  },

  // 訂閱訂單狀態更新
  subscribeToRideUpdates(rideId: string, callback: (ride: any) => void) {
    const client = getSupabaseClient();
    if (!client) {
      console.warn('Supabase 未配置，無法訂閱訂單更新');
      return null;
    }

    return client
      .channel(`ride-updates-${rideId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rides',
        filter: `id=eq.${rideId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();
  },

  // 計算預計到達時間
  calculateETA(driverLat: number, driverLng: number, destLat: number, destLng: number, speed: number = 30): number {
    const distance = this.calculateDistance(driverLat, driverLng, destLat, destLng);
    const timeInHours = distance / speed;
    return Math.ceil(timeInHours * 60); // 轉換為分鐘
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

  // 取消訂閱
  unsubscribe(subscription: any) {
    const client = getSupabaseClient();
    if (!client || !subscription) return;
    
    return client.removeChannel(subscription);
  }
};

export default realtimeTrackingService;