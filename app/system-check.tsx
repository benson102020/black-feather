import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, CheckCircle, XCircle, Clock, ArrowLeft, Database, Wifi, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { databaseSetupService } from '../services/database-setup';

export default function SystemCheckScreen() {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState([]);
  const [systemReady, setSystemReady] = useState(false);

  const runSystemCheck = async () => {
    setChecking(true);
    setResults([]);
    setSystemReady(false);
    
    try {
      console.log('🔍 開始系統檢查...');
      const checkResult = await databaseSetupService.runSystemCheck();
      
      setResults(checkResult.results || []);
      setSystemReady(checkResult.success);
      
      if (checkResult.success) {
        Alert.alert(
          '🎉 系統檢查通過！',
          '所有檢查都通過了！\n\n✅ 資料庫連接正常\n✅ 所有資料表存在\n✅ 基本資料已初始化\n\n🚀 系統已準備好使用！',
          [
            { text: '開始使用', onPress: () => router.replace('/role-selection') }
          ]
        );
      } else {
        if (checkResult.missingTables) {
          Alert.alert(
            '⚠️ 需要執行資料庫遷移',
            `缺少以下資料表：\n${checkResult.missingTables.join(', ')}\n\n請在 Supabase Dashboard 的 SQL Editor 中執行遷移文件：\nsupabase/migrations/20250928053401_old_oasis.sql`,
            [
              { text: '我知道了' },
              { text: '查看遷移文件', onPress: () => Alert.alert('遷移文件位置', 'supabase/migrations/20250928053401_old_oasis.sql\n\n請複製此文件的內容到 Supabase SQL Editor 中執行') }
            ]
          );
        } else {
          Alert.alert('❌ 系統檢查失敗', checkResult.error || '請查看詳細結果');
        }
      }
    } catch (error) {
      Alert.alert('檢查錯誤', error.message);
    } finally {
      setChecking(false);
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
        
        <Text style={styles.headerTitle}>系統檢查</Text>
        
        <TouchableOpacity
          style={[styles.checkButton, checking && styles.checkButtonDisabled]}
          onPress={runSystemCheck}
          disabled={checking}
        >
          <Play size={20} color="#000" />
          <Text style={styles.checkButtonText}>
            {checking ? '檢查中...' : '開始檢查'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.configInfo}>
          <Text style={styles.infoTitle}>✅ Supabase 配置狀態</Text>
          <View style={styles.configItem}>
            <Database size={20} color="#34C759" />
            <Text style={styles.configText}>URL: https://aotykuukxmofwqrdjrke.supabase.co</Text>
          </View>
          <View style={styles.configItem}>
            <Wifi size={20} color="#34C759" />
            <Text style={styles.configText}>API Key: 已配置</Text>
          </View>
        </View>

        {checking && (
          <View style={styles.checkingIndicator}>
            <Clock size={24} color="#FFD700" />
            <Text style={styles.checkingText}>正在檢查系統完整性...</Text>
          </View>
        )}

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>檢查結果</Text>
            
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

        {systemReady && (
          <View style={styles.readyCard}>
            <CheckCircle size={48} color="#34C759" />
            <Text style={styles.readyTitle}>🎉 系統準備就緒！</Text>
            <Text style={styles.readyText}>
              所有檢查都通過了，您現在可以開始使用完整功能：
            </Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>✅ 真實用戶註冊和登入</Text>
              <Text style={styles.featureItem}>✅ 真實訂單創建和管理</Text>
              <Text style={styles.featureItem}>✅ 真實收入統計和提現</Text>
              <Text style={styles.featureItem}>✅ 真實訊息和通知系統</Text>
              <Text style={styles.featureItem}>✅ 真實後台管理功能</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => router.replace('/role-selection')}
            >
              <Text style={styles.startButtonText}>開始使用</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.nextSteps}>
          <Text style={styles.stepsTitle}>📋 接下來的步驟</Text>
          <Text style={styles.stepText}>
            1. 點擊「開始檢查」驗證系統狀態{'\n'}
            2. 如果提示缺少資料表，請執行資料庫遷移{'\n'}
            3. 檢查通過後即可開始使用所有功能{'\n'}
            4. 註冊司機和乘客帳號進行測試
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
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  checkButtonDisabled: {
    backgroundColor: '#666',
  },
  checkButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  configInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 12,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  configText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  checkingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  checkingText: {
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
  readyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#34C759',
  },
  readyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 12,
    marginBottom: 8,
  },
  readyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  nextSteps: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});