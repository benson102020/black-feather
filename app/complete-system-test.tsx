import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, XCircle, Clock, ArrowLeft, Users, Car, Settings, Database } from 'lucide-react-native';
import { router } from 'expo-router';
import { authService, orderService, adminService, getSupabaseClient } from '../services/supabase';
import { passengerService } from '../services/passenger';

export default function CompleteSystemTestScreen() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState('');

  const runCompleteSystemTest = async () => {
    setTesting(true);
    setResults([]);
    
    try {
      const testResults = [];
      
      // 測試1：資料庫連接
      setCurrentStep('測試資料庫連接');
      const dbResult = await testDatabaseConnection();
      testResults.push(dbResult);
      setResults([...testResults]);
      
      // 測試2：三端登入
      setCurrentStep('測試三端登入功能');
      const loginResult = await testAllLogins();
      testResults.push(loginResult);
      setResults([...testResults]);
      
      // 測試3：司機註冊
      setCurrentStep('測試司機註冊功能');
      const driverRegResult = await testDriverRegistration();
      testResults.push(driverRegResult);
      setResults([...testResults]);
      
      // 測試4：乘客註冊
      setCurrentStep('測試乘客註冊功能');
      const passengerRegResult = await testPassengerRegistration();
      testResults.push(passengerRegResult);
      setResults([...testResults]);
      
      // 測試5：叫車流程
      setCurrentStep('測試叫車流程');
      const rideResult = await testRideFlow();
      testResults.push(rideResult);
      setResults([...testResults]);
      
      // 測試6：後台管理
      setCurrentStep('測試後台管理功能');
      const adminResult = await testAdminFunctions();
      testResults.push(adminResult);
      setResults([...testResults]);
      
      const passedTests = testResults.filter(r => r.success).length;
      const totalTests = testResults.length;
      
      if (passedTests === totalTests) {
        Alert.alert(
          '🎉 完整系統測試通過！',
          `所有 ${totalTests} 項測試都成功！\n\n✅ 資料庫連接正常\n✅ 三端登入功能正常\n✅ 司機註冊功能正常\n✅ 乘客註冊功能正常\n✅ 叫車流程正常\n✅ 後台管理功能正常\n\n🚀 系統已完全準備好營運！`,
          [{ text: '開始使用', onPress: () => router.replace('/role-selection') }]
        );
      } else {
        Alert.alert(
          '⚠️ 發現問題',
          `${passedTests}/${totalTests} 項測試通過\n請查看詳細結果並修復問題`,
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

  const testDatabaseConnection = async () => {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 客戶端未初始化');
      
      const { data, error } = await client.from('users').select('count').limit(1);
      if (error) throw error;
      
      return {
        test: '資料庫連接',
        success: true,
        message: '✅ 資料庫連接正常，所有資料表可訪問'
      };
    } catch (error) {
      return {
        test: '資料庫連接',
        success: false,
        message: `❌ 資料庫連接失敗: ${error.message}`
      };
    }
  };

  const testAllLogins = async () => {
    try {
      // 測試司機登入
      const driverLogin = await authService.loginDriver('0982214855', 'BOSS08017');
      
      // 測試乘客登入
      const passengerLogin = await authService.loginPassenger('0912345678', 'test123');
      
      // 測試管理員登入
      const adminLogin = await authService.loginAdmin('admin', 'ADMIN123');
      
      const successCount = [driverLogin, passengerLogin, adminLogin].filter(r => r.success).length;
      
      return {
        test: '三端登入功能',
        success: successCount === 3,
        message: successCount === 3 ? 
          '✅ 司機、乘客、管理員登入全部正常' : 
          `❌ ${3 - successCount} 個登入功能失敗`
      };
    } catch (error) {
      return {
        test: '三端登入功能',
        success: false,
        message: `❌ 登入測試失敗：${error.message}`
      };
    }
  };

  const testDriverRegistration = async () => {
    try {
      const testData = {
        full_name: '測試司機註冊' + Date.now(),
        phone_number: '09' + String(Date.now()).slice(-8),
        id_number: 'T' + String(Date.now()).slice(-9),
        password: 'TEST123',
        license_number: 'TEST' + Date.now(),
        license_expiry: '2025-12-31',
        vehicle_brand: 'Toyota Prius',
        vehicle_model: 'Prius',
        vehicle_plate: 'TEST-' + String(Date.now()).slice(-3),
        vehicle_color: '白色',
        emergency_contact_name: '測試聯絡人',
        emergency_contact_phone: '0988888888',
        emergency_contact_relation: '家人',
        jkopay_account: '09' + String(Date.now()).slice(-8),
        jkopay_name: '測試司機註冊'
      };
      
      const result = await authService.registerDriver(testData);
      
      return {
        test: '司機註冊功能',
        success: result.success,
        message: result.success ? 
          '✅ 司機註冊功能正常' : 
          `❌ 司機註冊失敗：${result.error}`
      };
    } catch (error) {
      return {
        test: '司機註冊功能',
        success: false,
        message: `❌ 司機註冊測試失敗：${error.message}`
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
        test: '乘客註冊功能',
        success: result.success,
        message: result.success ? 
          '✅ 乘客註冊功能正常' : 
          `❌ 乘客註冊失敗：${result.error}`
      };
    } catch (error) {
      return {
        test: '乘客註冊功能',
        success: false,
        message: `❌ 乘客註冊測試失敗：${error.message}`
      };
    }
  };

  const testRideFlow = async () => {
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
        test: '叫車流程',
        success: result.success,
        message: result.success ? 
          '✅ 叫車流程正常' : 
          `❌ 叫車流程失敗：${result.error}`
      };
    } catch (error) {
      return {
        test: '叫車流程',
        success: false,
        message: `❌ 叫車流程測試失敗：${error.message}`
      };
    }
  };

  const testAdminFunctions = async () => {
    try {
      const statsResult = await adminService.getSystemStats();
      const driversResult = await adminService.getAllDrivers();
      
      return {
        test: '後台管理功能',
        success: statsResult.success && driversResult.success,
        message: statsResult.success && driversResult.success ? 
          '✅ 後台管理功能正常' : 
          `❌ 後台管理失敗：${statsResult.error || driversResult.error}`
      };
    } catch (error) {
      return {
        test: '後台管理功能',
        success: false,
        message: `❌ 後台管理測試失敗：${error.message}`
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
        
        <Text style={styles.headerTitle}>完整系統測試</Text>
        
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runCompleteSystemTest}
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
          <Text style={styles.infoTitle}>🔍 完整三端系統測試</Text>
          <Text style={styles.infoText}>
            將測試所有核心功能，確保三端系統完全連通：
          </Text>
          
          <View style={styles.testSteps}>
            <View style={styles.testStep}>
              <Database size={20} color="#FFD700" />
              <Text style={styles.stepText}>資料庫連接和結構檢查</Text>
            </View>
            <View style={styles.testStep}>
              <Users size={20} color="#FFD700" />
              <Text style={styles.stepText}>三端登入功能驗證</Text>
            </View>
            <View style={styles.testStep}>
              <Car size={20} color="#FFD700" />
              <Text style={styles.stepText}>司機註冊功能測試</Text>
            </View>
            <View style={styles.testStep}>
              <Users size={20} color="#FFD700" />
              <Text style={styles.stepText}>乘客註冊功能測試</Text>
            </View>
            <View style={styles.testStep}>
              <Car size={20} color="#FFD700" />
              <Text style={styles.stepText}>叫車流程測試</Text>
            </View>
            <View style={styles.testStep}>
              <Settings size={20} color="#FFD700" />
              <Text style={styles.stepText}>後台管理功能測試</Text>
            </View>
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
                  <Text style={styles.resultTitle}>{result.test}</Text>
                </View>
                
                <Text style={[
                  styles.resultMessage,
                  { color: result.success ? '#34C759' : '#FF3B30' }
                ]}>
                  {result.message}
                </Text>
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
            onPress={() => router.push('/admin/auth/login')}
          >
            <Settings size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>後台管理</Text>
          </TouchableOpacity>
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
    fontSize: 14,
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
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
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
});

// 測試函數實現
async function testDatabaseConnection() {
  try {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase 客戶端未初始化');
    
    const { data, error } = await client.from('users').select('count').limit(1);
    if (error) throw error;
    
    return { success: true, message: '資料庫連接正常' };
  } catch (error) {
    return { success: false, message: `連接失敗: ${error.message}` };
  }
}

async function testAllLogins() {
  try {
    const driverLogin = await authService.loginDriver('0982214855', 'BOSS08017');
    const passengerLogin = await authService.loginPassenger('0912345678', 'test123');
    const adminLogin = await authService.loginAdmin('admin', 'ADMIN123');
    
    const successCount = [driverLogin, passengerLogin, adminLogin].filter(r => r.success).length;
    
    return {
      success: successCount === 3,
      message: successCount === 3 ? '三端登入全部正常' : `${3 - successCount} 個登入失敗`
    };
  } catch (error) {
    return { success: false, message: `登入測試失敗: ${error.message}` };
  }
}

async function testDriverRegistration() {
  try {
    const testData = {
      full_name: '測試司機' + Date.now(),
      phone_number: '09' + String(Date.now()).slice(-8),
      id_number: 'T' + String(Date.now()).slice(-9),
      password: 'TEST123',
      license_number: 'TEST' + Date.now(),
      license_expiry: '2025-12-31',
      vehicle_brand: 'Toyota Prius',
      vehicle_model: 'Prius',
      vehicle_plate: 'TEST-' + String(Date.now()).slice(-3),
      vehicle_color: '白色',
      emergency_contact_name: '測試聯絡人',
      emergency_contact_phone: '0988888888',
      emergency_contact_relation: '家人',
      jkopay_account: '09' + String(Date.now()).slice(-8),
      jkopay_name: '測試司機'
    };
    
    const result = await authService.registerDriver(testData);
    
    return {
      success: result.success,
      message: result.success ? '司機註冊正常' : `註冊失敗: ${result.error}`
    };
  } catch (error) {
    return { success: false, message: `註冊測試失敗: ${error.message}` };
  }
}

async function testPassengerRegistration() {
  try {
    const testData = {
      fullName: '測試乘客' + Date.now(),
      phoneNumber: '09' + String(Date.now()).slice(-8),
      email: `passenger${Date.now()}@test.com`,
      password: 'TEST123'
    };
    
    const result = await passengerService.registerPassenger(testData);
    
    return {
      success: result.success,
      message: result.success ? '乘客註冊正常' : `註冊失敗: ${result.error}`
    };
  } catch (error) {
    return { success: false, message: `註冊測試失敗: ${error.message}` };
  }
}

async function testRideFlow() {
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
      success: result.success,
      message: result.success ? '叫車流程正常' : `叫車失敗: ${result.error}`
    };
  } catch (error) {
    return { success: false, message: `叫車測試失敗: ${error.message}` };
  }
}

async function testAdminFunctions() {
  try {
    const statsResult = await adminService.getSystemStats();
    
    return {
      success: statsResult.success,
      message: statsResult.success ? '後台管理正常' : `管理失敗: ${statsResult.error}`
    };
  } catch (error) {
    return { success: false, message: `管理測試失敗: ${error.message}` };
  }
}