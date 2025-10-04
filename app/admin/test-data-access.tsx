import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { getSupabaseClient } from '../../services/supabase';
import { driverApplicationService } from '../../services/driver-application';

export default function TestDataAccessScreen() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (name: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      name,
      status,
      message,
      data,
      time: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    console.log('='.repeat(60));
    console.log('開始測試管理員數據訪問');
    console.log('='.repeat(60));

    // 測試 1: 檢查 Supabase 連接
    addResult('Supabase 連接', 'info', '檢查中...');
    try {
      const client = getSupabaseClient();
      if (client) {
        addResult('Supabase 連接', 'success', '已連接');
        console.log('✅ Supabase 客戶端已連接');
      } else {
        addResult('Supabase 連接', 'error', '未連接');
        console.log('❌ Supabase 客戶端未連接');
        setTesting(false);
        return;
      }
    } catch (error) {
      addResult('Supabase 連接', 'error', error.message);
      console.error('❌ Supabase 連接錯誤:', error);
      setTesting(false);
      return;
    }

    // 測試 2: 直接查詢 driver_applications 表
    addResult('直接查詢申請表', 'info', '查詢中...');
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('driver_applications')
        .select('id, full_name, phone_number, status, submitted_at')
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (error) {
        addResult('直接查詢申請表', 'error', `查詢失敗: ${error.message}`, { error });
        console.error('❌ 查詢錯誤:', error);
      } else {
        addResult('直接查詢申請表', 'success', `找到 ${data?.length || 0} 筆記錄`, { data });
        console.log(`✅ 成功查詢到 ${data?.length || 0} 筆記錄:`, data);
      }
    } catch (error) {
      addResult('直接查詢申請表', 'error', error.message);
      console.error('❌ 查詢錯誤:', error);
    }

    // 測試 3: 使用服務函數獲取申請
    addResult('服務函數獲取', 'info', '調用中...');
    try {
      const result = await driverApplicationService.getPendingApplications();

      if (result.success) {
        addResult('服務函數獲取', 'success', `找到 ${result.data?.length || 0} 筆申請`, { data: result.data });
        console.log(`✅ 服務函數成功返回 ${result.data?.length || 0} 筆申請:`, result.data);
      } else {
        addResult('服務函數獲取', 'error', result.error || '未知錯誤', { error: result.error });
        console.error('❌ 服務函數失敗:', result.error);
      }
    } catch (error) {
      addResult('服務函數獲取', 'error', error.message);
      console.error('❌ 服務函數異常:', error);
    }

    // 測試 4: 檢查 RLS 政策
    addResult('RLS 政策檢查', 'info', '查詢中...');
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('driver_applications')
        .select('count');

      if (error) {
        addResult('RLS 政策檢查', 'error', `權限問題: ${error.message}`);
        console.error('❌ RLS 政策錯誤:', error);
      } else {
        addResult('RLS 政策檢查', 'success', 'RLS 政策允許訪問');
        console.log('✅ RLS 政策檢查通過');
      }
    } catch (error) {
      addResult('RLS 政策檢查', 'error', error.message);
      console.error('❌ RLS 檢查異常:', error);
    }

    // 測試 5: 檢查 users 表
    addResult('Users 表查詢', 'info', '查詢中...');
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('users')
        .select('id, full_name, phone_number, role, status')
        .eq('role', 'driver')
        .limit(5);

      if (error) {
        addResult('Users 表查詢', 'error', `查詢失敗: ${error.message}`);
        console.error('❌ Users 表查詢錯誤:', error);
      } else {
        addResult('Users 表查詢', 'success', `找到 ${data?.length || 0} 位司機`, { data });
        console.log(`✅ 找到 ${data?.length || 0} 位司機:`, data);
      }
    } catch (error) {
      addResult('Users 表查詢', 'error', error.message);
      console.error('❌ Users 表查詢異常:', error);
    }

    setTesting(false);
    console.log('='.repeat(60));
    console.log('測試完成');
    console.log('='.repeat(60));

    // 顯示總結
    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;

    Alert.alert(
      '測試完成',
      `✅ 成功: ${successCount}\n❌ 失敗: ${errorCount}\n\n請查看控制台獲取詳細日誌`,
      [{ text: '確定' }]
    );
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.title}>數據訪問測試</Text>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>測試說明</Text>
          <Text style={styles.infoText}>
            此測試將檢查管理員是否能正常訪問司機申請數據。
          </Text>
          <Text style={styles.infoText}>
            測試項目包括:{'\n'}
            • Supabase 連接狀態{'\n'}
            • 直接查詢 driver_applications 表{'\n'}
            • 服務函數調用{'\n'}
            • RLS 政策權限{'\n'}
            • Users 表訪問權限
          </Text>
        </View>

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
            {result.data && (
              <TouchableOpacity
                style={styles.viewDataButton}
                onPress={() => {
                  Alert.alert(
                    '數據詳情',
                    JSON.stringify(result.data, null, 2),
                    [{ text: '關閉' }]
                  );
                }}
              >
                <Text style={styles.viewDataText}>查看數據</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {testResults.length === 0 && !testing && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>點擊下方按鈕開始測試</Text>
          </View>
        )}
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
      </View>
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
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
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
    marginBottom: 4,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
    flex: 1,
  },
  resultTime: {
    fontSize: 12,
    color: '#999',
  },
  resultMessage: {
    fontSize: 14,
    color: '#666',
    marginLeft: 28,
    marginBottom: 8,
  },
  successText: {
    color: '#4ade80',
  },
  errorText: {
    color: '#f87171',
  },
  viewDataButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 28,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  viewDataText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  testButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  testButtonDisabled: {
    backgroundColor: '#999',
  },
  testButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
