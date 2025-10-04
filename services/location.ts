// 位置追蹤服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

export const locationService = {
  // 更新司機位置
  async updateDriverLocation(driverId: string, location: LocationData) {
    if (isDemoMode) {
      console.log('📍 演示模式更新司機位置:', driverId, location);
      return {
        success: true,
        data: {
          driver_id: driverId,
          location: location,
          updated_at: new Date().toISOString()
        }
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 更新用戶位置
      const { error: userError } = await client
        .from('users')
        .update({
          current_location: `POINT(${location.longitude} ${location.latitude})`,
          last_location_update: new Date().toISOString()
        })
        .eq('id', driverId);

      if (userError) throw userError;

      // 更新車輛位置
      const { error: vehicleError } = await client
        .from('vehicles')
        .update({
          current_location: `POINT(${location.longitude} ${location.latitude})`,
          last_location_update: new Date().toISOString()
        })
        .eq('driver_id', driverId);

      if (vehicleError) console.warn('車輛位置更新警告:', vehicleError);

      return { success: true, data: { driver_id: driverId, location, updated_at: new Date().toISOString() } };
    } catch (error) {
      console.error('更新司機位置錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取附近司機
  async getNearbyDrivers(latitude: number, longitude: number, radius: number = 5000) {
    if (isDemoMode) {
      console.log('🔍 演示模式獲取附近司機:', latitude, longitude, radius);
      return {
        success: true,
        data: [
          {
            id: 'demo-driver-001',
            full_name: '張司機',
            rating: 4.8,
            distance: 1200,
            eta: 5,
            vehicle: {
              make: 'Toyota',
              model: 'Vios',
              license_plate: 'ABC-1234'
            }
          },
          {
            id: 'demo-driver-002',
            full_name: '李司機',
            rating: 4.6,
            distance: 2100,
            eta: 8,
            vehicle: {
              make: 'Honda',
              model: 'City',
              license_plate: 'DEF-5678'
            }
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 使用 PostGIS 查詢附近司機
      const { data, error } = await client
        .rpc('get_nearby_drivers', {
          user_lat: latitude,
          user_lng: longitude,
          radius_meters: radius
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取附近司機錯誤:', error);
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

  // 度轉弧度
  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  },

  // 估算到達時間
  estimateArrivalTime(distance: number, trafficFactor: number = 1.2): number {
    // 假設平均速度 30 km/h，考慮交通因素
    const averageSpeed = 30 / trafficFactor;
    return Math.ceil((distance / averageSpeed) * 60); // 分鐘
  }
};

export default locationService;