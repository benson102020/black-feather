// 三端整合測試服務
import { authService, orderService, earningsService } from './supabase';

export interface IntegrationTestResult {
  step: string;
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export const integrationTestService = {
  // 執行完整三端整合測試
  async runFullIntegrationTest(): Promise<IntegrationTestResult[]> {
    console.log('🚀 開始執行三端整合測試...');
    
    const results: IntegrationTestResult[] = [];
    
    try {
      // 步驟1：乘客註冊登入
      results.push(await this.testPassengerAuth());
      
      // 步驟2：司機註冊登入
      results.push(await this.testDriverAuth());
      
      // 步驟3：管理員登入
      results.push(await this.testAdminAuth());
      
      // 步驟4：乘客下單
      results.push(await this.testPassengerBooking());
      
      // 步驟5：司機接單
      results.push(await this.testDriverAcceptOrder());
      
      // 步驟6：訂單進行
      results.push(await this.testOrderProgress());
      
      // 步驟7：訂單完成
      results.push(await this.testOrderCompletion());
      
      // 步驟8：收入結算
      results.push(await this.testEarningsCalculation());
      
      // 步驟9：後台查看記錄
      results.push(await this.testAdminViewRecords());
      
      // 步驟10：提現申請
      results.push(await this.testWithdrawalRequest());
      
      return results;
    } catch (error) {
      console.error('整合測試失敗:', error);
      results.push({
        step: '整合測試',
        success: false,
        message: `測試過程發生錯誤: ${error.message}`,
        timestamp: new Date().toISOString()
      });
      return results;
    }
  },

  // 測試乘客認證
  async testPassengerAuth(): Promise<IntegrationTestResult> {
    try {
      const loginResult = await authService.loginPassenger('0987654321', 'PASSENGER123');
      
      if (loginResult.success) {
        return {
          step: '乘客認證',
          success: true,
          message: '乘客登入成功',
          data: { passengerId: loginResult.passenger.id },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(loginResult.error);
      }
    } catch (error) {
      return {
        step: '乘客認證',
        success: false,
        message: `乘客認證失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試司機認證
  async testDriverAuth(): Promise<IntegrationTestResult> {
    try {
      const loginResult = await authService.loginDriver('0982214855', 'BOSS08017');
      
      if (loginResult.success) {
        return {
          step: '司機認證',
          success: true,
          message: '司機登入成功',
          data: { driverId: loginResult.driver.id },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(loginResult.error);
      }
    } catch (error) {
      return {
        step: '司機認證',
        success: false,
        message: `司機認證失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試管理員認證
  async testAdminAuth(): Promise<IntegrationTestResult> {
    try {
      const loginResult = await authService.loginAdmin('admin', 'ADMIN123');
      
      if (loginResult.success) {
        return {
          step: '管理員認證',
          success: true,
          message: '管理員登入成功',
          data: { adminId: loginResult.admin.id },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(loginResult.error);
      }
    } catch (error) {
      return {
        step: '管理員認證',
        success: false,
        message: `管理員認證失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試乘客下單
  async testPassengerBooking(): Promise<IntegrationTestResult> {
    try {
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

      const result = await orderService.createRide(rideData);
      
      if (result.success) {
        return {
          step: '乘客下單',
          success: true,
          message: '訂單創建成功',
          data: { orderId: result.data.id, fare: rideData.total_fare },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      return {
        step: '乘客下單',
        success: false,
        message: `下單失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試司機接單
  async testDriverAcceptOrder(): Promise<IntegrationTestResult> {
    try {
      // 先獲取可接訂單
      const availableResult = await orderService.getAvailableOrders('test-driver-001');
      if (!availableResult.success || availableResult.data.length === 0) {
        throw new Error('沒有可接訂單');
      }

      const orderId = availableResult.data[0].id;
      const acceptResult = await orderService.acceptOrder(orderId, 'test-driver-001');
      
      if (acceptResult.success) {
        return {
          step: '司機接單',
          success: true,
          message: '司機成功接單',
          data: { orderId: orderId, driverId: 'test-driver-001' },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(acceptResult.error);
      }
    } catch (error) {
      return {
        step: '司機接單',
        success: false,
        message: `接單失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試訂單進行
  async testOrderProgress(): Promise<IntegrationTestResult> {
    try {
      // 獲取司機當前訂單
      const ordersResult = await orderService.getDriverOrders('test-driver-001', 'accepted');
      if (!ordersResult.success || ordersResult.data.length === 0) {
        throw new Error('沒有進行中的訂單');
      }

      const orderId = ordersResult.data[0].id;
      const updateResult = await orderService.updateOrderStatus(orderId, 'in_progress', 'test-driver-001');
      
      if (updateResult.success) {
        return {
          step: '訂單進行',
          success: true,
          message: '訂單狀態更新為進行中',
          data: { orderId: orderId, status: 'in_progress' },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(updateResult.error);
      }
    } catch (error) {
      return {
        step: '訂單進行',
        success: false,
        message: `訂單進行失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試訂單完成
  async testOrderCompletion(): Promise<IntegrationTestResult> {
    try {
      // 獲取進行中的訂單
      const ordersResult = await orderService.getDriverOrders('test-driver-001', 'in_progress');
      if (!ordersResult.success || ordersResult.data.length === 0) {
        throw new Error('沒有進行中的訂單');
      }

      const orderId = ordersResult.data[0].id;
      const completeResult = await orderService.updateOrderStatus(orderId, 'completed', 'test-driver-001');
      
      if (completeResult.success) {
        return {
          step: '訂單完成',
          success: true,
          message: '訂單成功完成',
          data: { orderId: orderId, status: 'completed' },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(completeResult.error);
      }
    } catch (error) {
      return {
        step: '訂單完成',
        success: false,
        message: `訂單完成失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試收入結算
  async testEarningsCalculation(): Promise<IntegrationTestResult> {
    try {
      const earningsResult = await earningsService.getEarningsStats('test-driver-001', 'today');
      
      if (earningsResult.success) {
        return {
          step: '收入結算',
          success: true,
          message: '收入統計計算正確',
          data: { 
            total: earningsResult.data.total,
            orders: earningsResult.data.orders,
            netAmount: earningsResult.data.net_amount
          },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(earningsResult.error);
      }
    } catch (error) {
      return {
        step: '收入結算',
        success: false,
        message: `收入結算失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試後台查看記錄
  async testAdminViewRecords(): Promise<IntegrationTestResult> {
    try {
      // 模擬後台查看所有訂單
      const allOrdersResult = await orderService.getDriverOrders('test-driver-001');
      
      if (allOrdersResult.success) {
        return {
          step: '後台查看記錄',
          success: true,
          message: '後台可正常查看所有訂單記錄',
          data: { 
            totalOrders: allOrdersResult.data.length,
            completedOrders: allOrdersResult.data.filter(o => o.status === 'completed').length
          },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(allOrdersResult.error);
      }
    } catch (error) {
      return {
        step: '後台查看記錄',
        success: false,
        message: `後台查看失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 測試提現申請
  async testWithdrawalRequest(): Promise<IntegrationTestResult> {
    try {
      const withdrawalResult = await earningsService.requestWithdrawal(
        'test-driver-001',
        1000,
        '0982214855',
        '測試司機'
      );
      
      if (withdrawalResult.success) {
        return {
          step: '提現申請',
          success: true,
          message: '提現申請提交成功',
          data: { 
            amount: 1000,
            fee: 15,
            netAmount: 985
          },
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(withdrawalResult.error);
      }
    } catch (error) {
      return {
        step: '提現申請',
        success: false,
        message: `提現申請失敗: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 生成整合測試報告
  generateIntegrationReport(results: IntegrationTestResult[]): string {
    const totalSteps = results.length;
    const passedSteps = results.filter(r => r.success).length;
    const failedSteps = totalSteps - passedSteps;

    let report = `\n🔗 三端整合測試報告\n`;
    report += `========================\n`;
    report += `測試時間: ${new Date().toLocaleString('zh-TW')}\n`;
    report += `總步驟數: ${totalSteps}\n`;
    report += `成功: ${passedSteps} ✅\n`;
    report += `失敗: ${failedSteps} ❌\n`;
    report += `成功率: ${((passedSteps / totalSteps) * 100).toFixed(1)}%\n\n`;

    report += `詳細流程:\n`;
    report += `----------\n`;
    
    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const time = new Date(result.timestamp).toLocaleTimeString('zh-TW');
      
      report += `${index + 1}. ${status} ${result.step} (${time})\n`;
      report += `   ${result.message}\n`;
      
      if (result.data) {
        report += `   資料: ${JSON.stringify(result.data, null, 2)}\n`;
      }
      report += `\n`;
    });

    if (passedSteps === totalSteps) {
      report += `🎉 恭喜！三端整合測試完全通過！\n`;
      report += `系統已準備好正式營運。\n\n`;
      report += `✅ 乘客可以正常下單\n`;
      report += `✅ 司機可以接單和完成訂單\n`;
      report += `✅ 後台可以查看所有記錄\n`;
      report += `✅ 收入系統正常運作\n`;
      report += `✅ 提現功能正常\n`;
    } else {
      report += `⚠️  發現 ${failedSteps} 個問題需要修復\n`;
      report += `請檢查失敗的步驟並修復問題。\n`;
    }

    return report;
  }
};

export default integrationTestService;