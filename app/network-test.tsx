import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, XCircle, Wifi, Database, Globe, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { networkTestService } from '../services/network-test';

export default function NetworkTestScreen() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);

  const runNetworkTests = async () => {
    setTesting(true);
    setResults([]);
    
    try {
      const testResults = [];
      
      // 測試1：基本網路連接
      const networkResult = await networkTestService.testNetworkConnection();
      testResults.push({
        test: '基本網路連接',
        icon: Globe,
        ...networkResult
      });
      setResults([...testResults]);
      
      // 測試2：Supabase 連接
      const supabaseResult = await networkTestService.testSupabaseConnection();
      testResults.push({
        test: 'Supabase 連接',
        icon: Database,
        ...supabaseResult
      });
      setResults([...testResults]);
      
      // 測試3：API 端點
      const apiResult = await networkTestService.testApiEndpoints();
      testResults.push({
        test: 'API 端點',
        icon: Wifi,
        ...apiResult
      });
      setResults([...testResults]);
      
      const passedTests = testResults.filter(r => r.success).length;
      const totalTests = testResults.length;
      
      if (passedTests === totalTests) {
        Alert.alert(
          '🎉 網路測試通過',
          `所有 ${totalTests} 項網路測試都成功！\n系統可以正常連接外部服務。`,
          [{ text: '太好了！' }]
        );
      } else {
        Alert.alert(
          '⚠️ 網路問題',
          `${passedTests}/${totalTests} 項測試通過\n建議檢查網路設定或使用演示模式`,
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
        
        <Text style={styles.headerTitle}>網路連接測試</Text>
        
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runNetworkTests}
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
          <Text style={styles.infoTitle}>網路連接測試項目</Text>
          <Text style={styles.infoText}>
            1. 基本網路連接 - 測試設備是否可以連接網際網路{'\n'}
            2. Supabase 連接 - 測試是否可以連接到 Supabase 服務{'\n'}
            3. API 端點測試 - 測試各個 API 端點是否可用
          </Text>
        </View>

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>測試結果</Text>
            
            {results.map((result, index) => {
              const IconComponent = result.icon;
              return (
                <View key={index} style={styles.resultItem}>
                  <View style={styles.resultHeader}>
                    {result.success ? 
                      <CheckCircle size={20} color="#34C759" /> :
                      <XCircle size={20} color="#FF3B30" />
                    }
                    <IconComponent size={20} color="#FFD700" style={styles.testIcon} />
                    <Text style={styles.resultTitle}>{result.test}</Text>
                  </View>
                  
                  <Text style={[
                    styles.resultMessage,
                    { color: result.success ? '#34C759' : '#FF3B30' }
                  ]}>
                    {result.message}
                  </Text>
                  
                  {result.details && (
                    <View style={styles.resultDetails}>
                      <Text style={styles.detailsTitle}>詳細資訊:</Text>
                      <Text style={styles.detailsContent}>
                        {JSON.stringify(result.details, null, 2)}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
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
  testIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultDetails: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  detailsContent: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
  },
});