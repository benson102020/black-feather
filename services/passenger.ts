// 乘客端服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';
import { passengerApplicationService } from './passenger-application';

export const passengerService = {
  // 乘客註冊（改用申請審核流程）
  async registerPassenger(passengerData: any) {
    console.log('🚀 開始乘客註冊流程（需要審核）...');
    return passengerApplicationService.submitPassengerApplication(passengerData);
  },

  // 創建訂單
  async createRide(rideData: any) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        console.log('🎭 演示模式創建訂單');
        return {
          success: true,
          data: {
            id: 'RD' + Date.now(),
            ...rideData,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        };
      }
      
      const { data, error } = await client
        .from('rides')
        .insert([{
          passenger_id: rideData.passenger_id,
          pickup_address: rideData.pickup_address,
          pickup_lat: rideData.pickup_latitude,
          pickup_lng: rideData.pickup_longitude,
          destination_address: rideData.dropoff_address,
          dropoff_address: rideData.dropoff_address,
          destination_lat: rideData.dropoff_latitude,
          destination_lng: rideData.dropoff_longitude,
          distance_km: rideData.distance_km,
          duration_minutes: rideData.duration_minutes,
          base_fare: rideData.base_fare,
          distance_fare: rideData.distance_fare,
          time_fare: rideData.time_fare,
          total_fare: rideData.total_fare,
          status: 'pending',
          requested_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('創建訂單錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取乘客訂單
  async getPassengerOrders(passengerId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) {
        console.log('🎭 演示模式獲取乘客訂單');
        return {
          success: true,
          data: [
            {
              id: 'RD20241225001',
              status: 'completed',
              pickup_address: '台北車站',
              destination_address: '松山機場',
              total_fare: 350,
              distance_km: 12.5,
              requested_at: new Date().toISOString(),
              driver: {
                full_name: '張司機',
                phone_number: '0912345678',
                rating: 4.8
              }
            }
          ]
        };
      }
      
      const { data, error } = await client
        .from('rides')
        .select(`
          id, status, pickup_address, destination_address, 
          total_fare, distance_km, duration_minutes, requested_at, completed_at,
          driver_id
        `)
        .eq('passenger_id', passengerId)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('獲取乘客訂單錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default passengerService;