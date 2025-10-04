import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Database, Settings, CheckCircle, ExternalLink, Copy, Play } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SetupGuideScreen() {
  const handleCopyText = (text: string, label: string) => {
    Alert.alert('複製內容', `${label}:\n\n${text}\n\n請手動複製此內容`);
  };

  const handleOpenSupabase = () => {
    Alert.alert(
      '開啟 Supabase Dashboard',
      '請按照以下步驟設置：\n\n1. 前往 https://supabase.com/dashboard\n2. 點擊 "New project"\n3. 選擇組織和設定專案名稱\n4. 等待專案建立完成\n5. 複製 Project URL 和 API Key',
      [{ text: '我知道了' }]
    );
  };

  const handleSetupDatabase = () => {
    Alert.alert(
      '設置資料庫',
      '請在 Supabase Dashboard 中：\n\n1. 前往 SQL Editor\n2. 執行遷移文件中的 SQL\n3. 確認所有資料表創建成功\n4. 檢查 RLS 政策是否啟用',
      [{ text: '我知道了' }]
    );
  };

  const handleTestConnection = () => {
    Alert.alert(
      '測試連接',
      '請確保已完成以下步驟：\n\n✅ 創建 Supabase 專案\n✅ 執行資料庫遷移\n✅ 更新環境變數\n✅ 重新啟動應用\n\n然後嘗試註冊或登入功能',
      [{ text: '開始測試', onPress: () => router.push('/test-all-features') }]
    );
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
        
        <Text style={styles.headerTitle}>Supabase 設置指南</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>✅ Supabase 已配置</Text>
          <Text style={styles.warningText}>
            您的 Supabase 已配置完成！現在需要執行資料庫遷移來創建必要的資料表。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 快速設置步驟</Text>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>✅ Supabase 專案已連接</Text>
              <Text style={styles.stepDescription}>
                URL: https://aotykuukxmofwqrdjrke.supabase.co
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>執行資料庫遷移</Text>
              <Text style={styles.stepDescription}>
                在 Supabase SQL Editor 中執行遷移文件
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleSetupDatabase}
              >
                <Database size={16} color="#FFD700" />
                <Text style={styles.actionText}>查看設置說明</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>✅ 環境變數已配置</Text>
              <Text style={styles.stepDescription}>
                環境變數已自動配置完成
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>測試功能</Text>
              <Text style={styles.stepDescription}>
                設置完成後測試所有功能是否正常
              </Text>
              <TouchableOpacity 
                style={styles.testButton}
                onPress={handleTestConnection}
              >
                <Play size={16} color="#000" />
                <Text style={styles.testButtonText}>開始功能測試</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.migrationSection}>
          <Text style={styles.sectionTitle}>📋 資料庫遷移文件</Text>
          <Text style={styles.sectionDescription}>
            請在 Supabase SQL Editor 中執行以下遷移文件：
          </Text>
          
          <View style={styles.migrationFile}>
            <Text style={styles.fileName}>20250928053401_old_oasis.sql</Text>
            <Text style={styles.fileDescription}>完整的叫車系統資料庫架構</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => handleCopyText('supabase/migrations/20250928053401_old_oasis.sql', '遷移文件路徑')}
          >
            <Copy size={16} color="#FFD700" />
            <Text style={styles.copyText}>複製文件路徑</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>🎯 完整功能列表</Text>
          <Text style={styles.sectionDescription}>
            設置完成後，您將擁有以下完整功能：
          </Text>
          
          <View style={styles.featureCategory}>
            <Text style={styles.categoryTitle}>👥 用戶管理</Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• 司機註冊和審核</Text>
              <Text style={styles.featureItem}>• 乘客註冊和管理</Text>
              <Text style={styles.featureItem}>• 管理員權限控制</Text>
              <Text style={styles.featureItem}>• 身份驗證和安全</Text>
            </View>
          </View>

          <View style={styles.featureCategory}>
            <Text style={styles.categoryTitle}>🚗 叫車服務</Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• 即時叫車和派單</Text>
              <Text style={styles.featureItem}>• 司機實時追蹤</Text>
              <Text style={styles.featureItem}>• 訂單狀態管理</Text>
              <Text style={styles.featureItem}>• 智能計費系統</Text>
            </View>
          </View>

          <View style={styles.featureCategory}>
            <Text style={styles.categoryTitle}>💰 收入管理</Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• 收入統計和分析</Text>
              <Text style={styles.featureItem}>• 提現申請處理</Text>
              <Text style={styles.featureItem}>• 帳單生成下載</Text>
              <Text style={styles.featureItem}>• 平台抽成管理</Text>
            </View>
          </View>

          <View style={styles.featureCategory}>
            <Text style={styles.categoryTitle}>💬 通訊系統</Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>• 即時訊息對話</Text>
              <Text style={styles.featureItem}>• 客服工單系統</Text>
              <Text style={styles.featureItem}>• 系統通知推送</Text>
              <Text style={styles.featureItem}>• 緊急聯絡功能</Text>
            </View>
          </View>
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>💬 需要協助？</Text>
          <Text style={styles.supportText}>
            如果您在設置過程中遇到任何問題，請參考以下資源：
          </Text>
          
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => Alert.alert(
              'Supabase 官方文檔',
              '建議查看以下文檔：\n\n• Supabase 快速開始指南\n• React Native 整合教學\n• RLS 安全政策設定\n• Realtime 即時功能\n\n官方網站：https://supabase.com/docs'
            )}
          >
            <Text style={styles.supportButtonText}>查看 Supabase 文檔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
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
  warningCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
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
  step: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#FFD700',
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 4,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  testButtonText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 4,
    fontWeight: '600',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  copyText: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 4,
  },
  envExample: {
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  envText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  migrationSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  migrationFile: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  fileDescription: {
    fontSize: 12,
    color: '#666',
  },
  featuresSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featureCategory: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  featuresList: {
    paddingLeft: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  supportSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacing: {
    height: 100,
  },
});