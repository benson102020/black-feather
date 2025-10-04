import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { driverApplicationService } from '../services/driver-application';
import { getSupabaseClient } from '../services/supabase';

export default function TestDriverRegistrationScreen() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (name: string, status: 'success' | 'error' | 'info', message: string) => {
    setTestResults(prev => [...prev, { name, status, message, time: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    console.log('='.repeat(50));
    console.log('開始測試司機註冊流程');
    console.log('='.repeat(50));

    // 測試 1: 檢查 Supabase 連接
    addResult('Supabase 連接', 'info', '檢查中...');
    try {
      const client = getSupabaseClient();
      if (client) {
        addResult('Supabase 連接', 'success', '已連接');
        console.log('✅ Supabase 客戶端已連接');
      } else {
        addResult('Supabase 連接', 'error', '未連接(將使用演示模式)');
        console.log('❌ Supabase 客戶端未連接');
      }
    } catch (error) {
      addResult('Supabase 連接', 'error', error.message);
      console.error('❌ Supabase 連接錯誤:', error);
    }

    // 測試 2: 測試資料庫查詢
    addResult('資料庫查詢', 'info', '測試中...');
    try {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('users')
          .select('count')
          .limit(1);

        if (error) {
          addResult('資料庫查詢', 'error', `查詢失敗: ${error.message}`);
          console.error('❌ 資料庫查詢錯誤:', error);
        } else {
          addResult('資料庫查詢', 'success', '查詢成功');
          console.log('✅ 資料庫查詢成功');
        }
      } else {
        addResult('資料庫查詢', 'info', '跳過(演示模式)');
      }
    } catch (error) {
      addResult('資料庫查詢', 'error', error.message);
      console.error('❌ 資料庫查詢錯誤:', error);
    }

    // 測試 3: 提交測試註冊
    addResult('提交註冊', 'info', '測試中...');
    const testData = {
      full_name: '測試司機_' + Date.now().toString().slice(-4),
      phone_number: '0900' + Date.now().toString().slice(-6),
      id_number: 'A123456789',
      password: 'test123456',
      license_number: 'TEST' + Date.now().toString().slice(-6),
      license_expiry: '2030-12-31',
      vehicle_brand: 'Toyota',
      vehicle_model: 'Prius',
      vehicle_plate: 'TEST-' + Date.now().toString().slice(-4),
      vehicle_year: '2020',
      vehicle_color: '白色',
      emergency_contact_name: '測試聯絡人',
      emergency_contact_phone: '0912345678',
      emergency_contact_relation: '家人',
      jkopay_account: '0900000000',
      jkopay_name: '測試司機'
    };

    console.log('📝 測試資料:', testData);

    try {
      const result = await driverApplicationService.submitDriverApplication(testData);

      if (result.success) {
        addResult('提交註冊', 'success', `申請已提交! ID: ${result.data?.id?.slice(-6) || 'N/A'}`);
        console.log('✅ 註冊成功:', result);

        Alert.alert(
          '✅ 測試成功!',
          `註冊申請已成功提交!\n\n申請ID: ${result.data?.id?.slice(-6) || 'N/A'}\n狀態: ${result.data?.status || 'pending'}\n\n${result.message || ''}`,
          [{ text: '確定' }]
        );
      } else {
        addResult('提交註冊', 'error', result.error || '未知錯誤');
        console.error('❌ 註冊失敗:', result);

        Alert.alert(
          '❌ 測試失敗',
          `錯誤訊息:\n${result.error}\n\n請查看控制台日誌獲取更多詳情。`,
          [{ text: '確定' }]
        );
      }
    } catch (error) {
      addResult('提交註冊', 'error', error.message);
      console.error('❌ 註冊錯誤:', error);

      Alert.alert(
        '❌ 測試異常',
        `捕獲到異常:\n${error.message}\n\n請查看控制台日誌獲取更多詳情。`,
        [{ text: '確定' }]
      );
    }

    setTesting(false);
    console.log('='.repeat(50));
    console.log('測試完成');
    console.log('='.repeat(50));
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} color="#4ade80" />;
      case 'error':
        return <XCircle size={20} color="#f87171" />;
      default:
        return <AlertCircle size={20} color="#fbbf24" />;
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#333333']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>註冊流程測試</Text>
        <Text style={styles.subtitle}>測試司機註冊功能</Text>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultHeader}>
              {getIcon(result.status)}
              <Text style={styles.resultName}>{result.name}</Text>
              <Text style={styles.resultTime}>{result.time}</Text>
            </View>
            <Text style={[
              styles.resultMessage,
              result.status === 'success' && styles.successText,
              result.status === 'error' && styles.errorText
            ]}>
              {result.message}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runTests}
          disabled={testing}
        >
          <Text style={styles.testButtonText}>
            {testing ? '測試中...' : '開始測試'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
  },
  resultsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  resultItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  resultTime: {
    fontSize: 12,
    color: '#999',
  },
  resultMessage: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 28,
  },
  successText: {
    color: '#4ade80',
  },
  errorText: {
    color: '#f87171',
  },
  buttonContainer: {
    gap: 12,
  },
  testButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  testButtonDisabled: {
    backgroundColor: '#666',
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
});
