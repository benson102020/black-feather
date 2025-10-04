// 實時追蹤服務
export interface DriverPosition {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp: string;
}

export interface TrackingData {
  driverId: string;
  orderId: string;
  currentPosition: DriverPosition;
  estimatedArrival: number; // 分鐘
  distance: number; // 公里
  status: string;
  route?: any[];
}

export const trackingService = {
  // 開始追蹤司機
  async startTracking(orderId: string, driverId: string): Promise<{ success: boolean; data?: TrackingData; error?: string }> {
    try {
      console.log('🎯 開始追蹤司機:', driverId, '訂單:', orderId);
      
      // 模擬初始追蹤資料
      const trackingData: TrackingData = {
        driverId,
        orderId,
        currentPosition: {
          latitude: 25.0340,
          longitude: 121.5665,
          heading: 45,
          speed: 30,
          accuracy: 5,
          timestamp: new Date().toISOString()
        },
        estimatedArrival: 8,
        distance: 2.5,
        status: 'driver_arriving'
      };
      
      return { success: true, data: trackingData };
    } catch (error) {
      console.error('開始追蹤錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取司機實時位置
  async getDriverLocation(driverId: string): Promise<{ success: boolean; data?: DriverPosition; error?: string }> {
    try {
      // 模擬司機位置更新
      const position: DriverPosition = {
        latitude: 25.0340 + (Math.random() - 0.5) * 0.001,
        longitude: 121.5665 + (Math.random() - 0.5) * 0.001,
        heading: Math.random() * 360,
        speed: 25 + Math.random() * 20,
        accuracy: 3 + Math.random() * 5,
        timestamp: new Date().toISOString()
      };
      
      return { success: true, data: position };
    } catch (error) {
      console.error('獲取司機位置錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 計算預計到達時間
  async calculateETA(driverPosition: DriverPosition, destinationLat: number, destinationLng: number): Promise<number> {
    try {
      // 計算距離
      const distance = this.calculateDistance(
        driverPosition.latitude,
        driverPosition.longitude,
        destinationLat,
        destinationLng
      );
      
      // 考慮交通狀況和司機速度
      const averageSpeed = (driverPosition.speed || 30) * 0.8; // 考慮交通因素
      const eta = Math.ceil((distance / averageSpeed) * 60); // 轉換為分鐘
      
      return Math.max(eta, 1); // 最少1分鐘
    } catch (error) {
      console.error('計算ETA錯誤:', error);
      return 5; // 預設5分鐘
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

  // 訂閱司機位置更新
  subscribeToDriverLocation(driverId: string, callback: (position: DriverPosition) => void) {
    console.log('📡 訂閱司機位置更新:', driverId);
    
    // 模擬實時位置更新
    const interval = setInterval(async () => {
      const result = await this.getDriverLocation(driverId);
      if (result.success && result.data) {
        callback(result.data);
      }
    }, 3000); // 每3秒更新一次
    
    return () => clearInterval(interval);
  },

  // 停止追蹤
  async stopTracking(orderId: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('⏹️ 停止追蹤訂單:', orderId);
      return { success: true, message: '已停止追蹤' };
    } catch (error) {
      console.error('停止追蹤錯誤:', error);
      return { success: false };
    }
  },

  // 獲取路線規劃
  async getRoute(startLat: number, startLng: number, endLat: number, endLng: number) {
    try {
      // 模擬路線規劃
      const route = [
        { latitude: startLat, longitude: startLng },
        { latitude: (startLat + endLat) / 2, longitude: (startLng + endLng) / 2 },
        { latitude: endLat, longitude: endLng }
      ];
      
      return { success: true, data: route };
    } catch (error) {
      console.error('獲取路線錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 模擬司機狀態更新
  async updateDriverStatus(orderId: string, status: string) {
    try {
      console.log('🔄 更新司機狀態:', orderId, status);
      
      const statusMessages = {
        'driver_arriving': '司機正在前往您的位置',
        'driver_arrived': '司機已到達，請準備上車',
        'in_progress': '行程已開始，請繫好安全帶',
        'completed': '行程已完成，感謝您的使用'
      };
      
      return {
        success: true,
        message: statusMessages[status] || '狀態已更新',
        data: { orderId, status, timestamp: new Date().toISOString() }
      };
    } catch (error) {
      console.error('更新狀態錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default trackingService;