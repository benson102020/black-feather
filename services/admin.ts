// 後台管理服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export const adminService = {
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
          onlineDrivers: 23
        }
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 使用簡化查詢避免權限問題
      const { data: usersData, error: usersError } = await client
        .from('users')
        .select('role')
        .eq('role', 'user');

      const { data: driversData, error: driversError } = await client
        .from('users')
        .select('role')
        .eq('role', 'driver');

      const { data: ridesData, error: ridesError } = await client
        .from('rides')
        .select('id');

      return {
        success: true,
        data: {
          totalUsers: usersData?.length || 0,
          totalDrivers: driversData?.length || 0,
          totalOrders: ridesData?.length || 0,
          totalRevenue: 0,
          activeOrders: 0,
          onlineDrivers: 0
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
            verification_status: 'approved',
            work_status: 'offline',
            rating: 4.8,
            total_orders: 156,
            total_earnings: 125000
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 修正查詢語法
      const { data: usersData, error: usersError } = await client
        .from('users')
        .select(`
          id, phone_number, email, full_name, name, role, status, 
          phone_verified, total_rides, rating, created_at
        `)
        .eq('role', 'driver')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // 獲取司機詳細資料
      const { data: driversData, error: driversError } = await client
        .from('drivers')
        .select('*');

      if (driversError) console.warn('司機詳細資料查詢警告:', driversError);

      // 合併資料
      const formattedData = usersData.map(user => {
        const driverDetail = driversData?.find(d => d.user_id === user.id) || {};
        return {
          ...user,
          ...driverDetail,
          vehicle_brand: driverDetail.vehicle_model || 'Toyota Prius',
          vehicle_model: driverDetail.vehicle_model || 'Prius',
          vehicle_plate: driverDetail.vehicle_plate || 'ABC-1234',
          total_earnings: driverDetail.total_earnings || 0,
          total_orders: user.total_rides || 0,
          rating: user.rating || 5.0,
          verification_status: driverDetail.verification_status || user.status || 'pending',
          work_status: driverDetail.work_status || 'offline',
          emergency_contact_name: driverDetail.emergency_contact_name || '未設定',
          emergency_contact_phone: driverDetail.emergency_contact_phone || '未設定',
          id_number: driverDetail.id_number || '未提供',
          license_number: driverDetail.license_number || '未提供',
          license_expiry: driverDetail.license_expiry || '未提供'
        };
      });

      return { success: true, data: formattedData };
    } catch (error) {
      console.error('獲取司機列表錯誤:', error);
      return { success: false, error: error.message };
    }
  },

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
            status: 'active',
            rating: 4.9,
            total_rides: 85,
            total_spent: 12500
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
          id, phone_number, email, full_name, name, role, status, 
          phone_verified, total_rides, rating, created_at
        `)
        .eq('role', 'user')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 計算總消費（模擬）
      const formattedData = data.map(user => ({
        ...user,
        total_spent: (user.total_rides || 0) * 250 // 假設平均每次 250 元
      }));

      return { success: true, data: formattedData };
    } catch (error) {
      console.error('獲取乘客列表錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 審核司機
  async approveDriver(driverId: string) {
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
          updated_at: new Date().toISOString()
        })
        .eq('id', driverId);

      if (error) throw error;
      return { success: true, message: '司機審核已通過' };
    } catch (error) {
      console.error('審核司機錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 拒絕司機申請
  async rejectDriver(driverId: string, reason: string) {
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
          updated_at: new Date().toISOString()
        })
        .eq('id', driverId);

      if (error) throw error;
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
            passenger: { full_name: '王先生', phone_number: '0987654321' },
            driver: { full_name: '張司機', phone_number: '0912345678' },
            pickup_address: '台北車站',
            dropoff_address: '松山機場',
            total_fare: 350,
            distance_km: 12.5,
            requested_at: new Date().toISOString()
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
          id, status, pickup_address, destination_address, 
          total_fare, distance_km, requested_at, passenger_id, driver_id
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取訂單列表錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 審核乘客
  async approvePassenger(passengerId: string) {
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
      return { success: true, message: '乘客審核已通過' };
    } catch (error) {
      console.error('審核乘客錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 停用乘客帳號
  async suspendPassenger(passengerId: string, reason: string) {
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
      return { success: true, message: '乘客帳號已停用' };
    } catch (error) {
      console.error('停用乘客帳號錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default adminService;