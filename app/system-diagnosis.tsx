import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, XCircle, AlertTriangle, Database, Users, Car, Settings, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { authService } from '../services/auth-service';
import { getSupabaseClient } from '../services/supabase';

export default function SystemDiagnosisScreen() {
  const [diagnosing, setDiagnosing] = useState(false);
  const [results, setResults] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  const runSystemDiagnosis = async () => {
    setDiagnosing(true);
    setResults([]);
    setSystemStatus(null);
    
    try {
      const diagnosticResults = [];
      
      // 1. 檢查 Supabase 連接
      const connectionResult = await testSupabaseConnection();
      diagnosticResults.push(connectionResult);
      setResults([...diagnosticResults]);
      
      // 2. 檢查資料表結構
      const tablesResult = await testTableStructure();
      diagnosticResults.push(tablesResult);
      setResults([...diagnosticResults]);
      
      // 3. 檢查約束條件
      const constraintsResult = await testConstraints();
      diagnosticResults.push(constraintsResult);
      setResults([...diagnosticResults]);
      
      // 4. 檢查測試帳號
      const accountsResult = await testAccounts();
      diagnosticResults.push(accountsResult);
      setResults([...diagnosticResults]);
      
      // 5. 檢查三端登入
      const loginResult = await testAllLogins();
      diagnosticResults.push(loginResult);
      setResults([...diagnosticResults]);
      
      // 6. 檢查註冊功能
      const registerResult = await testRegistration();
      diagnosticResults.push(registerResult);
      setResults([...diagnosticResults]);
      
      const passedTests = diagnosticResults.filter(r => r.success).length;
      const totalTests = diagnosticResults.length;
      const successRate = (passedTests / totalTests) * 100;
      
      setSystemStatus({
        passed: passedTests,
        total: totalTests,
        successRate: successRate.toFixed(1),
        status: successRate >= 90 ? 'excellent' : successRate >= 70 ? 'good' : 'needs_fix'
      });
      
      if (successRate >= 90) {
        Alert.alert(
          '🎉 系統診斷完成！',
          `系統狀態：優秀 (${successRate.toFixed(1)}%)\n\n✅ 所有核心功能正常\n✅ 三端連接穩定\n✅ 可以正式使用\n\n🚀 系統已準備好營運！`,
          [{ text: '開始使用', onPress: () => router.replace('/role-selection') }]
        );
      } else if (successRate >= 70) {
        Alert.alert(
          '⚠️ 系統基本正常',
          `系統狀態：良好 (${successRate.toFixed(1)}%)\n\n大部分功能正常，但有些問題需要注意。`,
          [
            { text: '查看詳情' },
            { text: '修復問題', onPress: () => router.push('/database-migration') }
          ]
        );
      } else {
        Alert.alert(
          '❌ 發現重要問題',
          `系統狀態：需要修復 (${successRate.toFixed(1)}%)\n\n發現多個重要問題，建議先修復後再使用。`,
          [
            { text: '查看詳情' },
            { text: '一鍵修復', onPress: () => router.push('/database-migration') }
          ]
        );
      }
    } catch (error) {
      Alert.alert('診斷錯誤', error.message);
    } finally {
      setDiagnosing(false);
    }
  };

  const testSupabaseConnection = async () => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          test: 'Supabase 連接',
          success: false,
          message: '❌ Supabase 未配置，運行在離線模式',
          severity: 'warning'
        };
      }

      const { data, error } = await client.from('users').select('count').limit(1);
      if (error) throw error;

      return {
        test: 'Supabase 連接',
        success: true,
        message: '✅ Supabase 連接正常',
        severity: 'success'
      };
    } catch (error) {
      return {
        test: 'Supabase 連接',
        success: false,
        message: `❌ 連接失敗: ${error.message}`,
        severity: 'critical'
      };
    }
  };

  const testTableStructure = async () => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          test: '資料表結構',
          success: false,
          message: '❌ 無法檢查資料表（離線模式）',
          severity: 'warning'
        };
      }

      const tables = ['users', 'drivers', 'vehicles', 'rides', 'admin_users'];
      const results = [];
      
      for (const table of tables) {
        try {
          await client.from(table).select('*').limit(1);
          results.push(`${table}✅`);
        } catch (error) {
          results.push(`${table}❌`);
        }
      }

      const successCount = results.filter(r => r.includes('✅')).length;
      
      return {
        test: '資料表結構',
        success: successCount === tables.length,
        message: successCount === tables.length ? 
          '✅ 所有資料表正常' : 
          `⚠️ ${results.join(', ')}`,
        severity: successCount === tables.length ? 'success' : 'critical'
      };
    } catch (error) {
      return {
        test: '資料表結構',
        success: false,
        message: `❌ 檢查失敗: ${error.message}`,
        severity: 'critical'
      };
    }
  };

  const testConstraints = async () => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          test: '約束條件',
          success: false,
          message: '❌ 無法檢查約束（離線模式）',
          severity: 'warning'
        };
      }

      // 測試插入一個測試記錄來檢查約束
      const testUserId = 'test-constraint-' + Date.now();
      
      try {
        await client
          .from('users')
          .insert([{
            id: testUserId,
            phone_number: '0900000000',
            phone: '0900000000',
            full_name: '約束測試',
            name: '約束測試',
            password_hash: 'dGVzdA==',
            role: 'user',
            status: 'active',
            verification_status: 'verified',
            phone_verified: true
          }]);

        // 清理測試資料
        await client.from('users').delete().eq('id', testUserId);

        return {
          test: '約束條件',
          success: true,
          message: '✅ 資料庫約束正常',
          severity: 'success'
        };
      } catch (constraintError) {
        return {
          test: '約束條件',
          success: false,
          message: `❌ 約束錯誤: ${constraintError.message}`,
          severity: 'critical'
        };
      }
    } catch (error) {
      return {
        test: '約束條件',
        success: false,
        message: `❌ 檢查失敗: ${error.message}`,
        severity: 'critical'
      };
    }
  };

  const testAccounts = async () => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        return {
          test: '測試帳號',
          success: true,
          message: '✅ 離線模式測試帳號可用',
          severity: 'success'
        };
      }

      // 檢查測試帳號
      const { data: passenger } = await client
        .from('users')
        .select('*')
        .eq('phone_number', '0912345678')
        .maybeSingle();

      const { data: driver } = await client
        .from('users')
        .select('*')
        .eq('phone_number', '0982214855')
        .maybeSingle();

      const { data: admin } = await client
        .from('admin_users')
        .select('*')
        .eq('username', 'admin')
        .maybeSingle();

      const accounts = [
        passenger ? '乘客✅' : '乘客❌',
        driver ? '司機✅' : '司機❌',
        admin ? '管理員✅' : '管理員❌'
      ];

      const allExist = passenger && driver && admin;

      return {
        test: '測試帳號',
        success: allExist,
        message: allExist ? '✅ 所有測試帳號存在' : `⚠️ ${accounts.join(', ')}`,
        severity: allExist ? 'success' : 'warning'
      };
    } catch (error) {
      return {
        test: '測試帳號',
        success: false,
        message: `❌ 檢查失敗: ${error.message}`,
        severity: 'warning'
      };
    }
  };

  const testAllLogins = async () => {
    try {
      const results = [];
      
      // 測試司機登入
      const driverLogin = await authService.login({
        phoneNumber: '0982214855',
        password: 'BOSS08017',
        userType: 'driver'
      });
      results.push(driverLogin.success ? '司機✅' : '司機❌');
      
      // 測試乘客登入
      const passengerLogin = await authService.login({
        phoneNumber: '0912345678',
        password: 'test123',
        userType: 'passenger'
      });
      results.push(passengerLogin.success ? '乘客✅' : '乘客❌');
      
      // 測試管理員登入
      const adminLogin = await authService.login({
        username: 'admin',
        password: 'ADMIN123',
        userType: 'admin'
      });
      results.push(adminLogin.success ? '管理員✅' : '管理員❌');

      const successCount = results.filter(r => r.includes('✅')).length;

      return {
        test: '三端登入',
        success: successCount === 3,
        message: successCount === 3 ? '✅ 三端登入全部正常' : `⚠️ ${results.join(', ')}`,
        severity: successCount === 3 ? 'success' : 'critical'
      };
    } catch (error) {
      return {
        test: '三端登入',
        success: false,
        message: `❌ 登入測試失敗: ${error.message}`,
        severity: 'critical'
      };
    }
  };

  const testRegistration = async () => {
    try {
      // 測試司機註冊
      const driverRegResult = await authService.register({
        fullName: '診斷測試司機',
        phoneNumber: '09' + String(Date.now()).slice(-8),
        password: 'TEST123',
        userType: 'driver',
        idNumber: 'T' + String(Date.now()).slice(-9),
        licenseNumber: 'TEST' + Date.now(),
        vehicleBrand: 'Toyota Prius',
        vehiclePlate: 'TEST-001',
        emergencyName: '測試聯絡人',
        emergencyPhone: '0988888888'
      });

      // 測試乘客註冊
      const passengerRegResult = await authService.register({
        fullName: '診斷測試乘客',
        phoneNumber: '09' + String(Date.now()).slice(-8),
        email: `test${Date.now()}@passenger.com`,
        password: 'TEST123',
        userType: 'passenger'
      });

      const results = [
        driverRegResult.success ? '司機註冊✅' : '司機註冊❌',
        passengerRegResult.success ? '乘客註冊✅' : '乘客註冊❌'
      ];

      const successCount = results.filter(r => r.includes('✅')).length;

      return {
        test: '註冊功能',
        success: successCount === 2,
        message: successCount === 2 ? '✅ 註冊功能全部正常' : `⚠️ ${results.join(', ')}`,
        severity: successCount === 2 ? 'success' : 'critical'
      };
    } catch (error) {
      return {
        test: '註冊功能',
        success: false,
        message: `❌ 註冊測試失敗: ${error.message}`,
        severity: 'critical'
      };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return '#34C759';
      case 'warning': return '#FF9500';
      case 'critical': return '#FF3B30';
      default: return '#666';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return XCircle;
      default: return AlertTriangle;
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
        
        <Text style={styles.headerTitle}>系統診斷</Text>
        
        <TouchableOpacity
          style={[styles.diagnoseButton, diagnosing && styles.diagnoseButtonDisabled]}
          onPress={runSystemDiagnosis}
          disabled={diagnosing}
        >
          <Play size={20} color="#000" />
          <Text style={styles.diagnoseButtonText}>
            {diagnosing ? '診斷中...' : '開始診斷'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔍 系統完整性診斷</Text>
          <Text style={styles.infoText}>
            全面檢查系統各個組件，包括資料庫連接、資料表結構、約束條件、測試帳號和三端功能。
          </Text>
        </View>

        {systemStatus && (
          <View style={[
            styles.statusCard,
            { borderLeftColor: 
              systemStatus.status === 'excellent' ? '#34C759' :
              systemStatus.status === 'good' ? '#FF9500' : '#FF3B30'
            }
          ]}>
            <Text style={styles.statusTitle}>📊 診斷結果</Text>
            <View style={styles.statusStats}>
              <View style={styles.statusStat}>
                <Text style={styles.statusNumber}>{systemStatus.passed}</Text>
                <Text style={styles.statusLabel}>通過</Text>
              </View>
              <View style={styles.statusStat}>
                <Text style={[styles.statusNumber, { color: '#FF3B30' }]}>
                  {systemStatus.total - systemStatus.passed}
                </Text>
                <Text style={styles.statusLabel}>失敗</Text>
              </View>
              <View style={styles.statusStat}>
                <Text style={styles.statusNumber}>{systemStatus.successRate}%</Text>
                <Text style={styles.statusLabel}>成功率</Text>
              </View>
            </View>
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>詳細診斷結果</Text>
            
            {results.map((result, index) => {
              const SeverityIcon = getSeverityIcon(result.severity);
              
              return (
                <View key={index} style={styles.resultItem}>
                  <View style={styles.resultHeader}>
                    <SeverityIcon size={20} color={getSeverityColor(result.severity)} />
                    <Text style={styles.resultTitle}>{result.test}</Text>
                  </View>
                  
                  <Text style={[
                    styles.resultMessage,
                    { color: getSeverityColor(result.severity) }
                  ]}>
                    {result.message}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/database-migration')}
          >
            <Database size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>修復資料庫</Text>
          </TouchableOpacity>
          
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
  diagnoseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  diagnoseButtonDisabled: {
    backgroundColor: '#666',
  },
  diagnoseButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
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
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusStat: {
    alignItems: 'center',
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
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
    paddingBottom: 12,
    marginBottom: 12,
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