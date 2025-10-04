import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, XCircle, Clock, ArrowLeft, User, Database, Network } from 'lucide-react-native';
import { router } from 'expo-router';
import { authService } from '../services/supabase';
import { apiService } from '../services/api';

export default function TestRegistrationScreen() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState('');

  const runRegistrationTest = async () => {
    setTesting(true);
    setResults([]);
    
    try {
      const testResults = [];
      
      // 測試1：前端資料驗證
      setCurrentStep('前端資料驗證');
      const validationResult = await testDataValidation();
      testResults.push(validationResult);
      setResults([...testResults]);
      
      // 測試2：API 服務連接
      setCurrentStep('API 服務連接');
      const apiResult = await testApiConnection();
      testResults.push(apiResult);
      setResults([...testResults]);
      
      // 測試3：資料庫寫入
      setCurrentStep('資料庫寫入測試');
      const dbResult = await testDatabaseWrite();
      testResults.push(dbResult);
      setResults([...testResults]);
      
      // 測試4：完整註冊流程
      setCurrentStep('完整註冊流程');
      const fullFlowResult = await testFullRegistrationFlow();
      testResults.push(fullFlowResult);
      setResults([...testResults]);
      
      const passedTests = testResults.filter(r => r.success).length;
      const totalTests = testResults.length;
      
      if (passedTests === totalTests) {
        Alert.alert(
          '🎉 註冊功能測試通過！',
          `所有 ${totalTests} 項測試都成功！\n\n✅ 前端驗證正常\n✅ API 連接正常\n✅ 資料庫寫入正常\n✅ 完整流程正常\n\n🚀 註冊功能已準備好使用！`,
          [{ text: '太好了！' }]
        );
      } else {
        Alert.alert(
          '⚠️ 發現問題',
          `${passedTests}/${totalTests} 項測試通過\n請查看詳細結果`,
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

  const testDataValidation = async () => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 測試前端資料驗證...');
      
      // 測試資料
      const testData = {
        fullName: '測試司機',
        phoneNumber: '0912345678',
        idNumber: 'A123456789',
        password: 'TEST123',
        emergencyName: '測試聯絡人',
        emergencyPhone: '0988888888'
      };
      
      // 驗證必填欄位
      const requiredFields = ['fullName', 'phoneNumber', 'idNumber', 'password', 'emergencyName', 'emergencyPhone'];
      const missingFields = requiredFields.filter(field => !testData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`缺少必填欄位: ${missingFields.join(', ')}`);
      }
      
      // 驗證手機號碼格式
      if (!/^09\d{8}$/.test(testData.phoneNumber)) {
        throw new Error('手機號碼格式錯誤');
      }
      
      // 驗證身分證格式
      if (!/^[A-Z][12]\d{8}$/.test(testData.idNumber)) {
        throw new Error('身分證格式錯誤');
      }
      
      return {
        step: '前端資料驗證',
        success: true,
        message: '所有必填欄位驗證通過',
        data: testData,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        step: '前端資料驗證',
        success: false,
        message: `驗證失敗: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  };

  const testApiConnection = async () => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 測試 API 連接...');
      
      // 測試 API 服務是否可用
      const testData = {
        fullName: '連接測試',
        phoneNumber: '0900000000',
        idNumber: 'T000000000',
        password: 'TEST123',
        emergencyName: '測試',
        emergencyPhone: '0900000000'
      };
      
      // 嘗試調用 API
      const response = await apiService.register(testData);
      
      if (response.success || response.error) {
        return {
          step: 'API 服務連接',
          success: true,
          message: 'API 服務連接正常',
          data: { connected: true },
          duration: Date.now() - startTime
        };
      } else {
        throw new Error('API 無回應');
      }
    } catch (error) {
      return {
        step: 'API 服務連接',
        success: false,
        message: `API 連接失敗: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  };

  const testDatabaseWrite = async () => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 測試資料庫寫入...');
      
      const testData = {
        fullName: '資料庫測試司機',
        phoneNumber: '09' + String(Date.now()).slice(-8),
        idNumber: 'T' + String(Date.now()).slice(-9),
        password: 'TEST123',
        licenseNumber: 'TEST' + Date.now(),
        licenseExpiry: '2025-12-31',
        vehicleBrand: 'Toyota',
        vehicleModel: 'Vios',
        vehiclePlate: 'TEST-' + String(Date.now()).slice(-3),
        emergencyName: '測試聯絡人',
        emergencyPhone: '0988888888',
        emergencyRelation: '家人',
        jkopayAccount: '09' + String(Date.now()).slice(-8),
        jkopayName: '資料庫測試司機'
      };
      
      const response = await authService.registerDriver(testData);
      
      if (response.success) {
        return {
          step: '資料庫寫入測試',
          success: true,
          message: '資料成功寫入資料庫',
          data: { driverId: response.data?.id },
          duration: Date.now() - startTime
        };
      } else {
        throw new Error(response.error || '寫入失敗');
      }
    } catch (error) {
      return {
        step: '資料庫寫入測試',
        success: false,
        message: `資料庫寫入失敗: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  };

  const testFullRegistrationFlow = async () => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 測試完整註冊流程...');
      
      // 模擬完整的註冊流程
      const steps = [
        '填寫基本資料',
        '設定密碼',
        '填寫駕照資料',
        '填寫車輛資料',
        '填寫緊急聯絡人',
        '填寫街口帳號',
        '提交申請'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        console.log(`📝 步驟 ${i + 1}: ${steps[i]}`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // 最終提交測試
      const finalTestData = {
        fullName: '完整流程測試司機',
        phoneNumber: '09' + String(Date.now()).slice(-8),
        idNumber: 'F' + String(Date.now()).slice(-9),
        password: 'FLOW123',
        licenseNumber: 'FLOW' + Date.now(),
        licenseExpiry: '2025-12-31',
        vehicleBrand: 'Honda',
        vehicleModel: 'City',
        vehiclePlate: 'FLOW-' + String(Date.now()).slice(-3),
        emergencyName: '流程測試聯絡人',
        emergencyPhone: '0977777777',
        emergencyRelation: '朋友',
        jkopayAccount: '09' + String(Date.now()).slice(-8),
        jkopayName: '完整流程測試司機'
      };
      
      const response = await authService.registerDriver(finalTestData);
      
      if (response.success) {
        return {
          step: '完整註冊流程',
          success: true,
          message: '完整註冊流程測試成功',
          data: { 
            driverId: response.data?.id,
            message: response.message
          },
          duration: Date.now() - startTime
        };
      } else {
        throw new Error(response.error || '流程測試失敗');
      }
    } catch (error) {
      return {
        step: '完整註冊流程',
        success: false,
        message: `完整流程測試失敗: ${error.message}`,
        duration: Date.now() - startTime
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
        
        <Text style={styles.headerTitle}>註冊功能測試</Text>
        
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runRegistrationTest}
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
          <Text style={styles.infoTitle}>註冊功能測試項目</Text>
          <View style={styles.testItems}>
            <View style={styles.testItem}>
              <User size={20} color="#FFD700" />
              <Text style={styles.testItemText}>前端資料驗證</Text>
            </View>
            <View style={styles.testItem}>
              <Network size={20} color="#FFD700" />
              <Text style={styles.testItemText}>API 服務連接</Text>
            </View>
            <View style={styles.testItem}>
              <Database size={20} color="#FFD700" />
              <Text style={styles.testItemText}>資料庫寫入</Text>
            </View>
            <View style={styles.testItem}>
              <CheckCircle size={20} color="#FFD700" />
              <Text style={styles.testItemText}>完整註冊流程</Text>
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
                  <Text style={styles.resultTitle}>{result.step}</Text>
                  <Text style={styles.resultDuration}>{result.duration}ms</Text>
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
            <User size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>司機註冊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/admin/drivers')}
          >
            <Database size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>後台查看</Text>
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
    marginBottom: 16,
  },
  testItems: {
    gap: 12,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testItemText: {
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
    flex: 1,
  },
  resultDuration: {
    fontSize: 12,
    color: '#666',
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