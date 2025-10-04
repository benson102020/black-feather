// 模擬數據服務
export const mockDataService = {
  // 司機端模擬數據
  getDriverMockData() {
    return {
      currentOrder: {
        id: 'RD20241225001',
        status: 'pickup_going',
        pickup_address: '台北市中正區重慶南路一段122號',
        dropoff_address: '台北市信義區市府路45號',
        customer_name: '王先生',
        customer_phone: '0987654321',
        total_fare: 350,
        distance_km: 12.5,
        duration_minutes: 25,
        calculated_fare: 350,
        users: {
          full_name: '王先生',
          phone_number: '0987654321'
        }
      },
      
      availableOrders: [
        {
          id: 'RD20241225002',
          pickup_address: '台北車站',
          dropoff_address: '松山機場',
          total_fare: 380,
          distance_km: 15.2,
          duration_minutes: 28,
          users: { full_name: '李小姐', phone_number: '0912345678' }
        },
        {
          id: 'RD20241225003',
          pickup_address: '信義區市政府',
          dropoff_address: '內湖科技園區',
          total_fare: 280,
          distance_km: 8.3,
          duration_minutes: 18,
          users: { full_name: '陳先生', phone_number: '0923456789' }
        },
        {
          id: 'RD20241225004',
          pickup_address: '西門町',
          dropoff_address: '台北101',
          total_fare: 220,
          distance_km: 6.8,
          duration_minutes: 15,
          users: { full_name: '張小姐', phone_number: '0934567890' }
        }
      ],

      earningsData: {
        today: { total: 1240, orders: 8, hours: 6.5, average: 155, net_amount: 1054 },
        week: { total: 8680, orders: 45, hours: 32, average: 193, net_amount: 7378 },
        month: { total: 35420, orders: 180, hours: 128, average: 197, net_amount: 30107 }
      },

      recentEarnings: [
        {
          id: 'RD20241225001',
          date: '12/25 14:30',
          customer: '王先生',
          amount: 350,
          status: 'completed'
        },
        {
          id: 'RD20241225002',
          date: '12/25 13:15',
          customer: '李小姐',
          amount: 280,
          status: 'completed'
        },
        {
          id: 'RD20241225003',
          date: '12/25 12:45',
          customer: '陳先生',
          amount: 220,
          status: 'completed'
        },
        {
          id: 'RD20241225004',
          date: '12/25 11:30',
          customer: '張小姐',
          amount: 390,
          status: 'pending'
        }
      ],

      conversations: [
        {
          id: 'conv-001',
          name: '王先生',
          last_message: '司機大哥，我在大樓一樓等您',
          last_message_time: new Date().toISOString(),
          unread_count: 1,
          ride_id: 'RD20241225001'
        },
        {
          id: 'conv-002',
          name: '客服中心',
          last_message: '您好，關於您的提現申請已處理完成',
          last_message_time: new Date(Date.now() - 3600000).toISOString(),
          unread_count: 0
        }
      ],

      notifications: [
        {
          id: 'notif-001',
          title: '收入結算通知',
          message: '您的本週收入已結算完成，共計 NT$8,680',
          type: 'earnings',
          created_at: new Date().toISOString(),
          is_read: false
        },
        {
          id: 'notif-002',
          title: '新訂單通知',
          message: '您有新的訂單可以接取，請查看工作台',
          type: 'order',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          is_read: true
        }
      ]
    };
  },

  // 乘客端模擬數據
  getPassengerMockData() {
    return {
      nearbyDrivers: [
        {
          id: 'driver-001',
          name: '張司機',
          rating: 4.8,
          distance: 1.2,
          eta: 5,
          vehicle: {
            make: 'Toyota',
            model: 'Vios',
            plate: 'ABC-1234',
            color: '白色'
          },
          totalTrips: 1240
        },
        {
          id: 'driver-002',
          name: '李司機',
          rating: 4.6,
          distance: 2.1,
          eta: 8,
          vehicle: {
            make: 'Honda',
            model: 'City',
            plate: 'DEF-5678',
            color: '銀色'
          },
          totalTrips: 856
        }
      ],

      recentOrders: [
        {
          id: 'RD20241225001',
          status: 'completed',
          pickup: '台北車站',
          dropoff: '松山機場',
          fare: 350,
          distance: 12.5,
          createdAt: new Date().toISOString(),
          driver: {
            name: '張司機',
            phone: '0912345678',
            rating: 4.8,
            vehicle: 'Toyota Vios (ABC-1234)'
          }
        }
      ]
    };
  },

  // 後台管理模擬數據
  getAdminMockData() {
    return {
      systemStats: {
        totalUsers: 1250,
        totalDrivers: 85,
        totalOrders: 3420,
        totalRevenue: 856000,
        activeOrders: 12,
        onlineDrivers: 23
      },

      drivers: [
        {
          id: 'test-driver-001',
          full_name: '測試司機',
          phone_number: '0982214855',
          id_number: 'A123456789',
          license_number: 'TEST123456',
          license_expiry: '2025-12-31',
          vehicle_brand: 'Toyota',
          vehicle_model: 'Prius',
          vehicle_plate: 'ABC-1234',
          emergency_contact_name: '測試聯絡人',
          emergency_contact_phone: '0988888888',
          verification_status: 'approved',
          work_status: 'offline',
          rating: 4.8,
          total_orders: 156,
          total_earnings: 125000,
          created_at: new Date().toISOString()
        }
      ],

      passengers: [
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
          created_at: new Date().toISOString()
        }
      ],

      orders: [
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
};

export default mockDataService;