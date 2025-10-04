// 離線模式服務 - 完全不依賴資料庫
export const offlineModeService = {
  // 離線模式登入
  async login(phoneNumber: string, password: string, userType: 'driver' | 'passenger' | 'admin') {
    console.log(`🎭 離線模式登入: ${userType}`);
    
    const testAccounts = {
      driver: { phone: '0982214855', password: 'BOSS08017' },
      passenger: { phone: '0912345678', password: 'test123' },
      admin: { username: 'admin', password: 'ADMIN123' }
    };

    const account = testAccounts[userType];
    const identifier = userType === 'admin' ? phoneNumber : phoneNumber;
    const expectedIdentifier = userType === 'admin' ? 'admin' : account.phone;
    
    if (identifier === expectedIdentifier && password === account.password) {
      return {
        success: true,
        user: {
          id: `offline-${userType}-001`,
          full_name: `測試${userType === 'driver' ? '司機' : userType === 'passenger' ? '乘客' : '管理員'}`,
          phone_number: phoneNumber,
          role: userType,
          status: 'active',
          rating: userType === 'driver' ? 4.8 : 4.9,
          total_rides: userType === 'driver' ? 156 : 15
        },
        token: `offline-token-${Date.now()}`
      };
    }
    
    return { success: false, error: '帳號或密碼錯誤' };
  },

  // 離線模式註冊
  async register(userData: any, userType: 'driver' | 'passenger') {
    console.log(`🎭 離線模式註冊: ${userType}`);
    
    return {
      success: true,
      data: {
        id: `offline-${userType}-${Date.now()}`,
        ...userData,
        status: 'active',
        verification_status: 'approved',
        created_at: new Date().toISOString()
      },
      message: `✅ 離線模式註冊成功！\n\n您現在可以使用所有功能進行測試。\n\n注意：這是演示模式，資料不會永久保存。`
    };
  },

  // 獲取模擬資料
  getMockData(type: string) {
    const mockData = {
      availableOrders: [
        {
          id: 'RD20241225001',
          pickup_address: '台北車站',
          dropoff_address: '松山機場',
          total_fare: 350,
          distance_km: 12.5,
          duration_minutes: 25,
          users: { full_name: '王先生', phone_number: '0987654321' }
        },
        {
          id: 'RD20241225002',
          pickup_address: '信義區市政府',
          dropoff_address: '內湖科技園區',
          total_fare: 280,
          distance_km: 8.3,
          duration_minutes: 18,
          users: { full_name: '李小姐', phone_number: '0912345678' }
        }
      ],
      
      earnings: {
        today: { total: 1240, orders: 8, hours: 6.5, average: 155 },
        week: { total: 8680, orders: 45, hours: 32, average: 193 },
        month: { total: 35420, orders: 180, hours: 128, average: 197 }
      },
      
      conversations: [
        {
          id: 'conv-001',
          name: '王先生',
          last_message: '司機大哥，我在大樓一樓等您',
          last_message_time: new Date().toISOString(),
          unread_count: 1
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
        }
      ]
    };
    
    return mockData[type] || [];
  }
};

export default offlineModeService;