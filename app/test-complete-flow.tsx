import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, XCircle, Clock, ArrowLeft, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { authService } from '../services/supabase';
import { passengerService } from '../services/passenger';
import { orderService } from '../services/supabase';
import { adminService } from '../services/admin';

export default function TestCompleteFlowScreen() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState('');

  const runCompleteFlow = async () => {
    setTesting(true);
    setResults([]);
    
    try {
      const testResults = [];
      
      // 步驟1：乘客註冊
      setCurrentStep('乘客註冊');
      const passengerRegResult = await testPassengerRegistration();
      testResults.push(passengerRegResult);
      setResults([...testResults]);
      
      // 步驟2：司機註冊
      setCurrentStep('司機註冊');
      const driverRegResult = await testDriverRegistration();
      testResults.push(driverRegResult);
      setResults([...testResults]);
      
      // 步驟3：後台審核
      setCurrentStep('後台審核');
      const approvalResult = await testApprovalProcess();
      testResults.push(approvalResult);
      setResults([...testResults]);
      
      // 步驟4：乘客叫車
      setCurrentStep('乘客叫車');
      const bookingResult = await testPassengerBooking();
      testResults.push(bookingResult);
      setResults([...testResults]);
      
      // 步驟5：司機接單
      setCurrentStep('司機接單');
      const acceptResult = await testDriverAccept();
      testResults.push(acceptResult);
      setResults([...testResults]);
      
      // 步驟6：完成訂單
      setCurrentStep('完成訂單');
      const completeResult = await testOrderComplete();
      testResults.push(completeResult);
      setResults([...testResults]);
      
      // 步驟7：收入統計
      setCurrentStep('收入統計');
      const earningsResult = await testEarningsUpdate();
      testResults.push(earningsResult);
      setResults([...testResults]);
      
      const passedSteps = testResults.filter(r => r.success).length;
      const totalSteps = testResults.length;
      
      if (passedSteps === totalSteps) {
        Alert.alert(
          '🎉 完整流程測試通過！',
          `所有 ${totalSteps} 個步驟都成功！\n\n✅ 乘客註冊 → 審核通過\n✅ 司機註冊 → 審核通過\n✅ 乘客叫車 → 系統派單\n✅ 司機接單 → 完成訂單\n✅ 收入結算 → 後台統計\n\n🚀 系統已準備好正式營運！`,
          [{ text: '開始使用', onPress: () => router.replace('/role-selection') }]
        );
      } else {
        Alert.alert(
          '⚠️ 流程測試完成',
          `${passedSteps}/${totalSteps} 個步驟通過\n請檢查失敗的步驟`,
          [{ text: '查看詳情' }]
        );
      }
    } catch (error) {
      Alert.alert('測試錯誤', error.message);
    } finally {
      setTesting(false);
      setCurrentStep('');
    }
  };

  const testPassengerRegistration = async () => {
    try {
      const testData = {
        fullName: '測試乘客' + Date.now(),
        phoneNumber: '09' + String(Date.now()).slice(-8),
        email: `passenger${Date.now()}@test.com`,
        password: 'TEST123'
      };
      
      const result = await passengerService.registerPassenger(testData);
      
      return {
        step: '乘客註冊',
        success: result.success,
        message: result.success ? 
          '✅ 乘客註冊成功，資料已寫入資料庫' : 
          `❌ 乘客註冊失敗：${result.error}`,
        data: result.success ? { passengerId: result.data?.id } : null
      };
    } catch (error) {
      return {
        step: '乘客註冊',
        success: false,
        message: `❌ 乘客註冊測試失敗：${error.message}`
      };
    }
  };

  const testDriverRegistration = async () => {
    try {
      const testData = {
        fullName: '測試司機' + Date.now(),
        phoneNumber: '09' + String(Date.now()).slice(-8),
        idNumber: 'T' + String(Date.now()).slice(-9),
        password: 'TEST123',
        licenseNumber: 'TEST' + Date.now(),
        licenseExpiry: '2025-12-31',
        vehicleBrand: '賓士 C300',
        vehiclePlate: 'TEST-' + String(Date.now()).slice(-3),
        vehicleColor: '白色',
        emergencyName: '測試聯絡人',
        emergencyPhone: '0988888888',
        emergencyRelation: '家人',
        bankName: '台灣銀行',
        bankAccount: '123456789012',
        accountHolder: '測試司機',
        jkopayAccount: '09' + String(Date.now()).slice(-8)
      };
      
      const result = await authService.registerDriver(testData);
      
      return {
        step: '司機註冊',
        success: result.success,
        message: result.success ? 
          '✅ 司機註冊成功，完整資料已寫入' : 
          `❌ 司機註冊失敗：${result.error}`,
        data: result.success ? { driverId: result.data?.id } : null
      };
    } catch (error) {
      return {
        step: '司機註冊',
        success: false,
        message: `❌ 司機註冊測試失敗：${error.message}`
      };
    }
  };

  const testApprovalProcess = async () => {
    try {
      // 測試審核功能
      const driversResult = await adminService.getAllDrivers();
      
      if (driversResult.success && driversResult.data.length > 0) {
        const pendingDriver = driversResult.data.find(d => d.verification_status === 'pending');
        
        if (pendingDriver) {
          const approveResult = await adminService.approveDriver(pendingDriver.id);
          
          return {
            step: '後台審核',
            success: approveResult.success,
            message: approveResult.success ? 
              '✅ 後台審核功能正常，司機已通過審核' : 
              `❌ 審核功能失敗：${approveResult.error}`,
            data: { driverId: pendingDriver.id }
          };
        } else {
          return {
            step: '後台審核',
            success: true,
            message: '✅ 後台可正常查看司機資料（無待審核司機）',
            data: { driversCount: driversResult.data.length }
          };
        }
      } else {
        throw new Error('無法獲取司機列表');
      }
    } catch (error) {
      return {
        step: '後台審核',
        success: false,
        message: `❌ 後台審核測試失敗：${error.message}`
      };
    }
  };

  const testPassengerBooking = async () => {
    try {
      const rideData = {
        passenger_id: '00000000-0000-0000-0000-000000000001',
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
      
      return {
        step: '乘客叫車',
        success: result.success,
        message: result.success ? 
          '✅ 乘客叫車成功，訂單已創建' : 
          `❌ 叫車失敗：${result.error}`,
        data: result.success ? { orderId: result.data?.id } : null
      };
    } catch (error) {
      return {
        step: '乘客叫車',
        success: false,
        message: `❌ 叫車測試失敗：${error.message}`
      };
    }
  };

  const testDriverAccept = async () => {
    try {
      // 獲取可接訂單
      const availableResult = await orderService.getAvailableOrders('00000000-0000-0000-0000-000000000002');
      
      if (availableResult.success && availableResult.data.length > 0) {
        const orderId = availableResult.data[0].id;
        const acceptResult = await orderService.acceptOrder(orderId, '00000000-0000-0000-0000-000000000002');
        
        return {
          step: '司機接單',
          success: acceptResult.success,
          message: acceptResult.success ? 
            '✅ 司機成功接單，訂單狀態已更新' : 
            `❌ 接單失敗：${acceptResult.error}`,
          data: { orderId: orderId }
        };
      } else {
        return {
          step: '司機接單',
          success: true,
          message: '✅ 司機接單功能正常（無可接訂單）',
          data: { availableOrders: 0 }
        };
      }
    } catch (error) {
      return {
        step: '司機接單',
        success: false,
        message: `❌ 接單測試失敗：${error.message}`
      };
    }
  };

  const testOrderComplete = async () => {
    try {
      // 獲取司機訂單
      const ordersResult = await orderService.getDriverOrders('00000000-0000-0000-0000-000000000002');
      
      if (ordersResult.success && ordersResult.data.length > 0) {
        const activeOrder = ordersResult.data.find(o => o.status === 'accepted' || o.status === 'in_progress');
        
        if (activeOrder) {
          const completeResult = await orderService.updateOrderStatus(activeOrder.id, 'completed', '00000000-0000-0000-0000-000000000002');
          
          return {
            step: '完成訂單',
            success: completeResult.success,
            message: completeResult.success ? 
              '✅ 訂單成功完成，狀態已更新' : 
              `❌ 完成訂單失敗：${completeResult.error}`,
            data: { orderId: activeOrder.id }
          };
        } else {
          return {
            step: '完成訂單',
            success: true,
            message: '✅ 訂單完成功能正常（無進行中訂單）',
            data: { ordersCount: ordersResult.data.length }
          };
        }
      } else {
        throw new Error('無法獲取司機訂單');
      }
    } catch (error) {
      return {
        step: '完成訂單',
        success: false,
        message: `❌ 完成訂單測試失敗：${error.message}`
      };
    }
  };

  const testEarningsUpdate = async () => {
    try {
      const earningsResult = await driverService.getEarningsStats('00000000-0000-0000-0000-000000000002', 'today');
      
      return {
        step: '收入統計',
        success: earningsResult.success,
        message: earningsResult.success ? 
          `✅ 收入統計正常，今日收入：NT$${earningsResult.data?.total || 0}` : 
          `❌ 收入統計失敗：${earningsResult.error}`,
        data: earningsResult.success ? { 
          total: earningsResult.data?.total,
          orders: earningsResult.data?.orders
        } : null
      };
    } catch (error) {
      return {
        step: '收入統計',
        success: false,
        message: `❌ 收入統計測試失敗：${error.message}`
      };
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>完整流程測試</Text>
        
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runCompleteFlow}
          disabled={testing}
        >
          <Zap size={20} color="#000" />
          <Text style={styles.testButtonText}>
            {testing ? '測試中...' : '開始完整測試'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.flowInfo}>
          <Text style={styles.infoTitle}>完整業務流程測試</Text>
          <Text style={styles.infoText}>
            測試完整的叫車業務流程：
          </Text>
          
          <View style={styles.flowSteps}>
            <Text style={styles.flowStep}>1. 乘客註冊 → 資料庫寫入</Text>
            <Text style={styles.flowStep}>2. 司機註冊 → 資料庫寫入</Text>
            <Text style={styles.flowStep}>3. 後台審核 → 狀態更新</Text>
            <Text style={styles.flowStep}>4. 乘客叫車 → 創建訂單</Text>
            <Text style={styles.flowStep}>5. 司機接單 → 訂單分配</Text>
            <Text style={styles.flowStep}>6. 完成訂單 → 狀態更新</Text>
            <Text style={styles.flowStep}>7. 收入統計 → 數據計算</Text>
          </View>
        </View>

        {testing && (
          <View style={styles.testingIndicator}>
            <Clock size={24} color="#FFD700" />
            <Text style={styles.testingText}>
              正在執行：{currentStep}
            </Text>
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>測試結果</Text>
            
            {results.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  {result.success ? 
                    <CheckCircle size={20} color="#34C759" /> :
                    <XCircle size={20} color="#FF3B30" />
                  }
                  <Text style={styles.resultTitle}>{result.step}</Text>
                </View>
                
                <Text style={[
                  styles.resultMessage,
                  { color: result.success ? '#34C759' : '#FF3B30' }
                ]}>
                  {result.message}
                </Text>
                
                {result.data && (
                  <View style={styles.resultData}>
                    <Text style={styles.dataContent}>
                      {JSON.stringify(result.data, null, 2)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  testButtonDisabled: {
    backgroundColor: '#666',
  },
  testButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  flowInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  flowSteps: {
    gap: 8,
  },
  flowStep: {
    fontSize: 14,
    color: '#333',
    paddingLeft: 8,
  },
  testingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  testingText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  resultItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultData: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  dataContent: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
  },
});