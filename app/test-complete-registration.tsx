import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, XCircle, Clock, ArrowLeft, Users, Car, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { authService } from '../services/supabase';
import { passengerService } from '../services/passenger';
import { adminService } from '../services/admin';

export default function TestCompleteRegistrationScreen() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);

  const runCompleteTest = async () => {
    setTesting(true);
    setResults([]);
    
    try {
      const testResults = [];
      
      // 測試1：司機註冊
      console.log('🧪 測試司機註冊...');
      const driverResult = await testDriverRegistration();
      testResults.push(driverResult);
      setResults([...testResults]);
      
      // 測試2：乘客註冊
      console.log('🧪 測試乘客註冊...');
      const passengerResult = await testPassengerRegistration();
      testResults.push(passengerResult);
      setResults([...testResults]);
      
      // 測試3：後台查看
      console.log('🧪 測試後台查看...');
      const adminViewResult = await testAdminView();
      testResults.push(adminViewResult);
      setResults([...testResults]);
      
      // 測試4：審核功能
      console.log('🧪 測試審核功能...');
      const approvalResult = await testApprovalProcess();
      testResults.push(approvalResult);
      setResults([...testResults]);
      
      // 測試5：登入功能
      console.log('🧪 測試登入功能...');
      const loginResult = await testLoginFunctions();
      testResults.push(loginResult);
      setResults([...testResults]);
      
      const passedTests = testResults.filter(r => r.success).length;
      const totalTests = testResults.length;
      
      // 生成測試報告
      const report = generateTestReport(testResults);
      
      if (passedTests === totalTests) {
        Alert.alert(
          '🎉 完整註冊系統測試通過！',
          `所有 ${totalTests} 項測試都成功！\n\n✅ 司機註冊功能正常\n✅ 乘客註冊功能正常\n✅ 後台查看功能正常\n✅ 審核流程正常\n✅ 登入功能正常\n\n🚀 系統已準備好正式營運！\n\n${report}`,
          [{ text: '開始使用', onPress: () => router.replace('/role-selection') }]
        );
      } else {
        Alert.alert(
          '⚠️ 發現問題',
          `${passedTests}/${totalTests} 項測試通過\n\n${report}\n\n請查看詳細結果並修復問題`,
          [{ text: '查看詳情' }]
        );
      }
    } catch (error) {
      Alert.alert('測試錯誤', error.message);
    } finally {
      setTesting(false);
    }
  };

  const testDriverRegistration = async () => {
    try {
      const testData = {
        fullName: '測試司機註冊' + Date.now(),
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
        accountHolder: '測試司機註冊' + Date.now(),
        jkopayAccount: '09' + String(Date.now()).slice(-8)
      };
      
      const result = await authService.registerDriver(testData);
      
      return {
        test: '司機註冊',
        success: result.success,
        message: result.success ? 
          `✅ 司機註冊成功 - ${result.message}` : 
          `❌ 司機註冊失敗 - ${result.error}`,
        data: result.success ? { 
          driverId: result.data?.id,
          name: testData.fullName,
          phone: testData.phoneNumber
        } : null
      };
    } catch (error) {
      return {
        test: '司機註冊',
        success: false,
        message: `❌ 司機註冊測試失敗: ${error.message}`
      };
    }
  };

  const testPassengerRegistration = async () => {
    try {
      const testData = {
        fullName: '測試乘客註冊' + Date.now(),
        phoneNumber: '09' + String(Date.now()).slice(-8),
        email: `passenger${Date.now()}@test.com`,
        password: 'TEST123'
      };
      
      const result = await passengerService.registerPassenger(testData);
      
      return {
        test: '乘客註冊',
        success: result.success,
        message: result.success ? 
          `✅ 乘客註冊成功 - ${result.message}` : 
          `❌ 乘客註冊失敗 - ${result.error}`,
        data: result.success ? { 
          passengerId: result.data?.id,
          name: testData.fullName,
          phone: testData.phoneNumber
        } : null
      };
    } catch (error) {
      return {
        test: '乘客註冊',
        success: false,
        message: `❌ 乘客註冊測試失敗: ${error.message}`
      };
    }
  };

  const testAdminView = async () => {
    try {
      // 測試後台查看司機
      const driversResult = await adminService.getAllDrivers();
      const passengersResult = await adminService.getAllPassengers();
      
      const driversCount = driversResult.success ? driversResult.data.length : 0;
      const passengersCount = passengersResult.success ? passengersResult.data.length : 0;
      
      return {
        test: '後台查看',
        success: driversResult.success && passengersResult.success,
        message: driversResult.success && passengersResult.success ? 
          `✅ 後台可正常查看 - 司機 ${driversCount} 位，乘客 ${passengersCount} 位` : 
          `❌ 後台查看失敗 - ${driversResult.error || passengersResult.error}`,
        data: { driversCount, passengersCount }
      };
    } catch (error) {
      return {
        test: '後台查看',
        success: false,
        message: `❌ 後台查看測試失敗: ${error.message}`
      };
    }
  };

  const testApprovalProcess = async () => {
    try {
      // 模擬審核流程
      const testDriverId = '00000000-0000-0000-0000-000000000001';
      const approveResult = await adminService.approveDriver(testDriverId);
      
      return {
        test: '審核流程',
        success: approveResult.success,
        message: approveResult.success ? 
          `✅ 審核功能正常 - ${approveResult.message}` : 
          `❌ 審核功能失敗 - ${approveResult.error}`,
        data: { driverId: testDriverId }
      };
    } catch (error) {
      return {
        test: '審核流程',
        success: false,
        message: `❌ 審核流程測試失敗: ${error.message}`
      };
    }
  };

  const testLoginFunctions = async () => {
    try {
      // 測試司機登入
      const driverLogin = await authService.loginDriver('0982214855', 'BOSS08017');
      
      // 測試乘客登入
      const passengerLogin = await authService.loginPassenger('0987654321', 'test123');
      
      // 測試管理員登入
      const adminLogin = await authService.loginAdmin('admin', 'ADMIN123');
      
      const successCount = [driverLogin, passengerLogin, adminLogin].filter(r => r.success).length;
      
      return {
        test: '登入功能',
        success: successCount === 3,
        message: successCount === 3 ? 
          '✅ 三端登入功能全部正常' : 
          `❌ ${3 - successCount} 個登入功能失敗`,
        data: {
          driver: driverLogin.success,
          passenger: passengerLogin.success,
          admin: adminLogin.success
        }
      };
    } catch (error) {
      return {
        test: '登入功能',
        success: false,
        message: `❌ 登入功能測試失敗: ${error.message}`
      };
    }
  };

  const generateTestReport = (results) => {
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    let report = `\n📊 測試報告：\n`;
    report += `成功率：${((successCount / totalCount) * 100).toFixed(1)}%\n`;
    report += `通過：${successCount}/${totalCount}\n\n`;
    
    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      report += `${index + 1}. ${status} ${result.test}\n`;
    });
    
    return report;
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
        
        <Text style={styles.headerTitle}>完整註冊系統測試</Text>
        
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runCompleteTest}
          disabled={testing}
        >
          <Play size={20} color="#000" />
          <Text style={styles.testButtonText}>
            {testing ? '測試中...' : '開始測試'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.testInfo}>
          <Text style={styles.infoTitle}>完整註冊系統測試</Text>
          <Text style={styles.infoText}>
            將測試完整的註冊和審核流程：
          </Text>
          
          <View style={styles.testSteps}>
            <View style={styles.testStep}>
              <Car size={20} color="#FFD700" />
              <Text style={styles.stepText}>司機註冊（6步驟完整流程）</Text>
            </View>
            <View style={styles.testStep}>
              <Users size={20} color="#FFD700" />
              <Text style={styles.stepText}>乘客註冊（手機+email驗證）</Text>
            </View>
            <View style={styles.testStep}>
              <Settings size={20} color="#FFD700" />
              <Text style={styles.stepText}>後台查看和審核功能</Text>
            </View>
          </View>
        </View>

        {testing && (
          <View style={styles.testingIndicator}>
            <Clock size={24} color="#FFD700" />
            <Text style={styles.testingText}>正在執行完整註冊系統測試...</Text>
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
                  <Text style={styles.resultTitle}>{result.test}</Text>
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

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/auth/register')}
          >
            <Car size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>司機註冊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/passenger/auth/register')}
          >
            <Users size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>乘客註冊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/admin/drivers')}
          >
            <Settings size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>後台審核</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📋 使用說明</Text>
          <Text style={styles.instructionsText}>
            1. 先執行資料庫修復腳本：supabase/migrations/final_registration_fix.sql{'\n'}
            2. 點擊「開始測試」執行完整測試{'\n'}
            3. 查看測試結果和建議{'\n'}
            4. 手動測試各端註冊功能
          </Text>
        </View>
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
  testInfo: {
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
  testSteps: {
    gap: 12,
  },
  testStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
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
    marginBottom: 16,
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
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});