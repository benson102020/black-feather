import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Database, Save, TestTube, CheckCircle, XCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SupabaseSetupScreen() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSaveConfig = () => {
    if (!supabaseUrl || !supabaseKey) {
      Alert.alert('錯誤', '請填寫 Supabase URL 和 API Key');
      return;
    }

    if (!supabaseUrl.includes('supabase.co')) {
      Alert.alert('錯誤', '請輸入正確的 Supabase URL 格式\n例如：https://your-project.supabase.co');
      return;
    }

    Alert.alert(
      '保存配置',
      `Supabase URL: ${supabaseUrl}\n\n請手動更新 .env 文件：\n\nEXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}\nEXPO_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}\n\n然後重新啟動應用`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '我已更新', 
          onPress: () => {
            Alert.alert('配置完成', '請重新啟動應用以使配置生效');
          }
        }
      ]
    );
  };

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      Alert.alert('錯誤', '請先填寫 Supabase 配置');
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // 測試連接
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTestResult({ success: true, message: 'Supabase 連接成功！' });
        Alert.alert(
          '✅ 連接成功',
          'Supabase 連接測試成功！\n\n接下來請：\n1. 執行資料庫遷移\n2. 更新 .env 文件\n3. 重新啟動應用',
          [{ text: '確定' }]
        );
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setTestResult({ success: false, message: `連接失敗: ${error.message}` });
      Alert.alert('❌ 連接失敗', `無法連接到 Supabase\n\n錯誤：${error.message}\n\n請檢查：\n• URL 格式是否正確\n• API Key 是否有效\n• 網路連接是否正常`);
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
        
        <Text style={styles.headerTitle}>Supabase 配置</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>🔧 Supabase 配置</Text>
          <Text style={styles.sectionDescription}>
            請輸入您的 Supabase 專案資訊
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Supabase URL *</Text>
            <TextInput
              style={styles.input}
              placeholder="https://your-project.supabase.co"
              value={supabaseUrl}
              onChangeText={setSupabaseUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Supabase Anon Key *</Text>
            <TextInput
              style={[styles.input, styles.keyInput]}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseKey}
              onChangeText={setSupabaseKey}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.testButton}
              onPress={handleTestConnection}
              disabled={testing}
            >
              <TestTube size={16} color="#000" />
              <Text style={styles.testButtonText}>
                {testing ? '測試中...' : '測試連接'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveConfig}
            >
              <Save size={16} color="#fff" />
              <Text style={styles.saveButtonText}>保存配置</Text>
            </TouchableOpacity>
          </View>

          {testResult && (
            <View style={[
              styles.testResult,
              { backgroundColor: testResult.success ? '#f0f8f0' : '#fff0f0' }
            ]}>
              {testResult.success ? (
                <CheckCircle size={20} color="#34C759" />
              ) : (
                <XCircle size={20} color="#FF3B30" />
              )}
              <Text style={[
                styles.testResultText,
                { color: testResult.success ? '#34C759' : '#FF3B30' }
              ]}>
                {testResult.message}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>📋 設置說明</Text>
          
          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>
              前往 Supabase Dashboard 創建新專案
            </Text>
          </View>

          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              在專案設定中複製 Project URL 和 API Key
            </Text>
          </View>

          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              在 SQL Editor 中執行遷移文件
            </Text>
          </View>

          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>
              填寫上方配置並測試連接
            </Text>
          </View>

          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>5</Text>
            <Text style={styles.instructionText}>
              更新 .env 文件並重新啟動應用
            </Text>
          </View>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>❓ 常見問題</Text>
          
          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => Alert.alert(
              '如何獲取 Supabase URL？',
              '1. 登入 Supabase Dashboard\n2. 選擇您的專案\n3. 前往 Settings → API\n4. 複製 Project URL'
            )}
          >
            <Text style={styles.helpQuestion}>如何獲取 Supabase URL？</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => Alert.alert(
              '如何獲取 API Key？',
              '1. 在 Supabase Dashboard 中\n2. 前往 Settings → API\n3. 複製 "anon public" key\n4. 注意不要複製 service_role key'
            )}
          >
            <Text style={styles.helpQuestion}>如何獲取 API Key？</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.helpItem}
            onPress={() => Alert.alert(
              '連接失敗怎麼辦？',
              '請檢查：\n• URL 格式是否正確\n• API Key 是否完整\n• 網路連接是否正常\n• Supabase 專案是否啟用\n\n如果問題持續，請聯絡技術支援'
            )}
          >
            <Text style={styles.helpQuestion}>連接失敗怎麼辦？</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  configSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  keyInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  testResult: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  testResultText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  instructionsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  helpSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  helpItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  helpQuestion: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});