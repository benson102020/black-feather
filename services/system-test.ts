// 完整系統測試服務
import { authService, orderService, earningsService, pricingService } from './supabase';

export interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
  duration?: number;
}

export const systemTestService = {
  // 執行完整系統測試
  async runCompleteSystemTest(): Promise<TestResult[]> {
    console.log('🧪 開始執行完整系統測試...');
    
    const results: TestResult[] = [];
    
    // 1. 測試認證系統
    results.push(await this.testAuthentication());
    
    // 2. 測試訂單系統
    results.push(await this.testOrderSystem());
    
    // 3. 測試計費系統
    results.push(await this.testPricingSystem());
    
    // 4. 測試收入系統
    results.push(await this.testEarningsSystem());
    
    // 5. 測試完整流程
    results.push(await this.testCompleteFlow());
    
    return results;
  },

  // 測試認證系統
  async testAuthentication(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // 測試司機登入
      const driverLogin = await authService.loginDriver('0982214855', 'BOSS08017');
      if (!driverLogin.success) {
        throw new Error('司機登入失敗');
      }

      // 測試乘客登入
      const passengerLogin = await authService.loginPassenger('0987654321', 'PASSENGER123');
      if (!passengerLogin.success) {
        throw new Error('乘客登入失敗');
      }

      // 測試管理員登入
      const adminLogin = await authService.loginAdmin('admin', 'ADMIN123');
      if (!adminLogin.success) {
        throw new Error('管理員登入失敗');
      }

      return {
        test: '認證系統',
        success: true,
        message: '三端認證系統正常運作',
        data: {
          driver: driverLogin.driver?.full_name,
          passenger: passengerLogin.passenger?.full_name,
          admin: adminLogin.admin?.full_name
        },
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        test: '認證系統',
        success: false,
        message: `認證測試失敗: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  },

  // 測試訂單系統
  async testOrderSystem(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // 測試創建訂單
      const rideData = {
        passenger_id: 'test-passenger-001',
        pickup_address: '台北車站',
        pickup_latitude: 25.0478,
        pickup_longitude: 121.5170,
        dropoff_address: '松山機場',
        dropoff_latitude: 25.0697,
        dropoff_longitude: 121.5522,
        distance_km: 12.5,
        duration_minutes: 25,
        base_fare: 85,
        distance_fare: 150,
        time_fare: 62.5,
        total_fare: 297.5
      };

      const createResult = await orderService.createRide(rideData);
      if (!createResult.success) {
        throw new Error('創建訂單失敗');
      }

      // 測試獲取可接訂單
      const availableResult = await orderService.getAvailableOrders('test-driver-001');
      if (!availableResult.success) {
        throw new Error('獲取可接訂單失敗');
      }

      // 測試接受訂單
      const orderId = createResult.data.id;
      const acceptResult = await orderService.acceptOrder(orderId, 'test-driver-001');
      if (!acceptResult.success) {
        throw new Error('接受訂單失敗');
      }

      // 測試更新訂單狀態
      const updateResult = await orderService.updateOrderStatus(orderId, 'in_progress', 'test-driver-001');
      if (!updateResult.success) {
        throw new Error('更新訂單狀態失敗');
      }

      // 測試完成訂單
      const completeResult = await orderService.updateOrderStatus(orderId, 'completed', 'test-driver-001');
      if (!completeResult.success) {
        throw new Error('完成訂單失敗');
      }

      return {
        test: '訂單系統',
        success: true,
        message: '訂單系統完整流程測試通過',
        data: {
          orderId: orderId,
          totalFare: rideData.total_fare,
          status: 'completed'
        },
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        test: '訂單系統',
        success: false,
        message: `訂單系統測試失敗: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  },

  // 測試計費系統
  async testPricingSystem(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // 測試費用計算
      const fareResult = await pricingService.calculateFare(10, 20);
      if (!fareResult.success) {
        throw new Error('費用計算失敗');
      }

      // 測試尖峰加成
      const surgeResult = await pricingService.getCurrentSurgeMultiplier();
      if (!surgeResult.success) {
        throw new Error('尖峰加成獲取失敗');
      }

      return {
        test: '計費系統',
        success: true,
        message: '計費系統功能正常',
        data: {
          baseFare: fareResult.data?.base_fare,
          totalFare: fareResult.data?.total_fare,
          surgeMultiplier: surgeResult.data?.multiplier
        },
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        test: '計費系統',
        success: false,
        message: `計費系統測試失敗: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  },

  // 測試收入系統
  async testEarningsSystem(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // 測試收入統計
      const earningsResult = await earningsService.getEarningsStats('test-driver-001', 'today');
      if (!earningsResult.success) {
        throw new Error('收入統計獲取失敗');
      }

      // 測試提現功能
      const withdrawalResult = await earningsService.requestWithdrawal(
        'test-driver-001', 
        1000, 
        '0982214855', 
        '測試司機'
      );
      if (!withdrawalResult.success) {
        throw new Error('提現申請失敗');
      }

      return {
        test: '收入系統',
        success: true,
        message: '收入系統功能正常',
        data: {
          todayEarnings: earningsResult.data?.total,
          withdrawalAmount: 1000,
          withdrawalFee: 15
        },
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        test: '收入系統',
        success: false,
        message: `收入系統測試失敗: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  },

  // 測試完整流程
  async testCompleteFlow(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log('🔄 測試完整叫車流程...');
      
      // 1. 乘客下單
      const rideData = {
        passenger_id: 'test-passenger-001',
        pickup_address: '測試起點',
        pickup_latitude: 25.0478,
        pickup_longitude: 121.5170,
        dropoff_address: '測試終點',
        dropoff_latitude: 25.0697,
        dropoff_longitude: 121.5522,
        distance_km: 10,
        duration_minutes: 20,
        base_fare: 85,
        distance_fare: 120,
        time_fare: 50,
        total_fare: 255
      };

      const createResult = await orderService.createRide(rideData);
      if (!createResult.success) {
        throw new Error('步驟1失敗：乘客下單');
      }

      // 2. 司機接單
      const acceptResult = await orderService.acceptOrder(createResult.data.id, 'test-driver-001');
      if (!acceptResult.success) {
        throw new Error('步驟2失敗：司機接單');
      }

      // 3. 更新訂單狀態
      const progressResult = await orderService.updateOrderStatus(createResult.data.id, 'in_progress', 'test-driver-001');
      if (!progressResult.success) {
        throw new Error('步驟3失敗：開始行程');
      }

      // 4. 完成訂單
      const completeResult = await orderService.updateOrderStatus(createResult.data.id, 'completed', 'test-driver-001');
      if (!completeResult.success) {
        throw new Error('步驟4失敗：完成訂單');
      }

      // 5. 檢查收入記錄
      const earningsResult = await earningsService.getEarningsStats('test-driver-001', 'today');
      if (!earningsResult.success) {
        throw new Error('步驟5失敗：收入記錄');
      }

      return {
        test: '完整流程',
        success: true,
        message: '完整叫車流程測試通過：下單→接單→完成→收入記錄',
        data: {
          orderId: createResult.data.id,
          totalFare: rideData.total_fare,
          driverEarnings: rideData.total_fare * 0.85,
          platformFee: rideData.total_fare * 0.15
        },
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        test: '完整流程',
        success: false,
        message: `完整流程測試失敗: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  },

  // 生成測試報告
  generateTestReport(results: TestResult[]): string {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);

    let report = `\n🧪 系統測試報告\n`;
    report += `==================\n`;
    report += `測試時間: ${new Date().toLocaleString('zh-TW')}\n`;
    report += `總測試數: ${totalTests}\n`;
    report += `通過: ${passedTests} ✅\n`;
    report += `失敗: ${failedTests} ❌\n`;
    report += `成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`;
    report += `總耗時: ${totalDuration}ms\n\n`;

    report += `詳細結果:\n`;
    report += `----------\n`;
    
    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const duration = result.duration ? ` (${result.duration}ms)` : '';
      report += `${index + 1}. ${status} ${result.test}${duration}\n`;
      report += `   ${result.message}\n`;
      
      if (result.data) {
        report += `   資料: ${JSON.stringify(result.data, null, 2)}\n`;
      }
      report += `\n`;
    });

    return report;
  }
};

export default systemTestService;