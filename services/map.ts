// 地圖服務
export interface DriverLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  distance: number;
  eta: number;
  vehicle: {
    make: string;
    model: string;
    plate: string;
    color: string;
  };
  status: 'online' | 'busy' | 'offline';
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
  accuracy?: number;
}

export const mapService = {
  // 獲取用戶當前位置
  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      // 模擬獲取位置
      return {
        latitude: 25.0330,
        longitude: 121.5654,
        address: '台北市中正區',
        accuracy: 10
      };
    } catch (error) {
      console.error('獲取位置失敗:', error);
      return null;
    }
  },

  // 獲取附近司機
  async getNearbyDrivers(userLocation: UserLocation, radius: number = 5000): Promise<DriverLocation[]> {
    try {
      // 模擬附近司機資料
      const mockDrivers: DriverLocation[] = [
        {
          id: 'driver-001',
          name: '張司機',
          latitude: userLocation.latitude + 0.001,
          longitude: userLocation.longitude + 0.001,
          rating: 4.8,
          distance: 1.2,
          eta: 5,
          vehicle: {
            make: 'Toyota',
            model: 'Vios',
            plate: 'ABC-1234',
            color: '白色'
          },
          status: 'online'
        },
        {
          id: 'driver-002',
          name: '李司機',
          latitude: userLocation.latitude - 0.002,
          longitude: userLocation.longitude + 0.002,
          rating: 4.6,
          distance: 2.1,
          eta: 8,
          vehicle: {
            make: 'Honda',
            model: 'City',
            plate: 'DEF-5678',
            color: '銀色'
          },
          status: 'online'
        },
        {
          id: 'driver-003',
          name: '王司機',
          latitude: userLocation.latitude + 0.002,
          longitude: userLocation.longitude - 0.001,
          rating: 4.9,
          distance: 0.8,
          eta: 3,
          vehicle: {
            make: 'Nissan',
            model: 'Sentra',
            plate: 'GHI-9012',
            color: '黑色'
          },
          status: 'online'
        }
      ];

      return mockDrivers;
    } catch (error) {
      console.error('獲取附近司機失敗:', error);
      return [];
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
  },

  // 地址搜索
  async searchAddress(query: string): Promise<any[]> {
    try {
      // 模擬地址搜索結果
      const commonAddresses = [
        { name: '台北車站', latitude: 25.0478, longitude: 121.5170 },
        { name: '松山機場', latitude: 25.0697, longitude: 121.5522 },
        { name: '桃園機場', latitude: 25.0797, longitude: 121.2342 },
        { name: '信義區市政府', latitude: 25.0408, longitude: 121.5598 },
        { name: '內湖科技園區', latitude: 25.0816, longitude: 121.5732 },
        { name: '台北101', latitude: 25.0340, longitude: 121.5645 },
        { name: '西門町', latitude: 25.0420, longitude: 121.5071 },
        { name: '士林夜市', latitude: 25.0881, longitude: 121.5240 }
      ];

      return commonAddresses.filter(addr => 
        addr.name.includes(query) || query.includes(addr.name)
      );
    } catch (error) {
      console.error('地址搜索失敗:', error);
      return [];
    }
  }
};

export default mapService;