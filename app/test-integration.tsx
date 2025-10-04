import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, XCircle, Clock, ArrowLeft, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { integrationTestService } from '../services/integration-test';

export default function TestIntegrationScreen() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);
  const [report, setReport] = useState('');

  const runIntegrationTest = async () => {
    setTesting(true);
    setResults([]);
    setReport('');
    
    try {
      const testResults = await integrationTestService.runFullIntegrationTest();
      setResults(testResults);
      
      const testReport = integrationTestService.generateIntegrationReport(testResults);
      setReport(testReport);
      
      const passedSteps = testResults.filter(r => r.success).length;
      const totalSteps = testResults.length;
      
      if (passedSteps === totalSteps) {
        Alert.alert(
          '🎉 整合測試完成',
          `所有 ${totalSteps} 個步驟都通過了！\n\n✅ 三端系統完全整合\n✅ 可以正式營運\n✅ 所有功能正常運作`,
          [{ text: '太棒了！' }]
        );
      } else {
        Alert.alert(
          '⚠️ 整合測試完成',
          `${passedSteps}/${totalSteps} 個步驟通過\n\n需要修復 ${totalSteps - passedSteps} 個問題`,
          [{ text: '查看詳情' }]
        );
      }
    } catch (error) {
      Alert.alert('測試錯誤', error.message);
    } finally {
      setTesting(false);
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
        
        <Text style={styles.headerTitle}>三端整合測試</Text>
        
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runIntegrationTest}
          disabled={testing}
        >
          <Zap size={20} color="#000" />
          <Text style={styles.testButtonText}>
            {testing ? '測試中...' : '開始整合測試'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.testInfo}>
          <Text style={styles.infoTitle}>整合測試流程</Text>
          <Text style={styles.infoText}>
            1. 乘客註冊登入 → 2. 司機註冊登入 → 3. 管理員登入{'\n'}
            4. 乘客下單 → 5. 司機接單 → 6. 訂單進行{'\n'}
            7. 訂單完成 → 8. 收入結算 → 9. 後台查看 → 10. 提現申請
          </Text>
        </View>

        {testing && (
          <View style={styles.testingIndicator}>
            <Clock size={24} color="#FFD700" />
            <Text style={styles.testingText}>正在執行三端整合測試...</Text>
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
                  <Text style={styles.resultTime}>
                    {new Date(result.timestamp).toLocaleTimeString('zh-TW')}
                  </Text>
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

        {report && (
          <View style={styles.reportContainer}>
            <Text style={styles.sectionTitle}>整合測試報告</Text>
            <View style={styles.reportContent}>
              <Text style={styles.reportText}>{report}</Text>
            </View>
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
  testInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  resultTime: {
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
  reportContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  reportContent: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  reportText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});