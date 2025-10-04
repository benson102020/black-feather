import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Copy, Database, CheckCircle, Play } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SQLExecutionGuideScreen() {
  const handleCopySQL = () => {
    Alert.alert(
      '📋 SQL 編碼已準備好！',
      '我已經為您準備好完整的 SQL 編碼！\n\n📁 文件位置：\nSQL_FOR_AI_EXECUTION.sql\n\n📋 請按照以下步驟：\n\n1. 複製 SQL_FOR_AI_EXECUTION.sql 的完整內容\n2. 提供給您的 SQL AI\n3. 讓 AI 執行這些 SQL 語句\n4. 回到 APP 測試功能',
      [{ text: '我知道了' }]
    );
  };

  const handleTestAfterExecution = () => {
    Alert.alert(
      '🧪 執行後測試',
      'SQL 執行完成後，您可以使用以下測試帳號：\n\n🚗 司機測試帳號\n手機：0982214855\n密碼：BOSS08017\n\n📱 乘客測試帳號\n手機：0912345678\n密碼：test123\n\n⚙️ 管理員測試帳號\n帳號：admin\n密碼：ADMIN123',
      [
        { text: '確定' },
        { text: '測試司機登入', onPress: () => router.push('/auth/login') },
        { text: '測試乘客登入', onPress: () => router.push('/passenger/auth/login') }
      ]
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
        
        <Text style={styles.headerTitle}>SQL 執行指南</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>✅ SQL 編碼已準備完成！</Text>
          <Text style={styles.successText}>
            我已經為您創建了完整的 SQL 編碼文件：
            {'\n'}
            {'\n'}📁 SQL_FOR_AI_EXECUTION.sql
            {'\n'}
            {'\n'}這個文件包含了修復所有約束問題和建立完整三端系統的 SQL 語句。
          </Text>
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>📋 執行步驟</Text>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>複製 SQL_FOR_AI_EXECUTION.sql 的完整內容</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>將 SQL 內容提供給您的 SQL AI</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>讓 AI 在您的 Supabase 中執行這些 SQL</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>回到 APP 測試三端功能</Text>
          </View>
        </View>

        <View style={styles.sqlInfoCard}>
          <Text style={styles.sqlInfoTitle}>🔧 SQL 編碼內容</Text>
          <Text style={styles.sqlInfoText}>
            這個 SQL 編碼會完成以下工作：
            {'\n'}
            {'\n'}✅ 修復 verification_status 約束
            {'\n'}✅ 修復 role 約束
            {'\n'}✅ 修復 status 約束
            {'\n'}✅ 補齊所有缺失欄位
            {'\n'}✅ 修復 RLS 政策
            {'\n'}✅ 建立完整測試帳號
            {'\n'}✅ 建立司機詳細資料
            {'\n'}✅ 建立管理員帳號
          </Text>
        </View>

        <View style={styles.testAccountsCard}>
          <Text style={styles.testTitle}>🧪 執行後可用的測試帳號</Text>
          
          <View style={styles.accountItem}>
            <Text style={styles.accountType}>🚗 司機測試帳號</Text>
            <Text style={styles.accountDetails}>手機：0982214855</Text>
            <Text style={styles.accountDetails}>密碼：BOSS08017</Text>
            <Text style={styles.accountStats}>156次行程，評分4.8，收入NT$25,287</Text>
          </View>
          
          <View style={styles.accountItem}>
            <Text style={styles.accountType}>📱 乘客測試帳號</Text>
            <Text style={styles.accountDetails}>手機：0912345678</Text>
            <Text style={styles.accountDetails}>密碼：test123</Text>
            <Text style={styles.accountStats}>15次行程，評分4.9</Text>
          </View>
          
          <View style={styles.accountItem}>
            <Text style={styles.accountType}>⚙️ 管理員測試帳號</Text>
            <Text style={styles.accountDetails}>帳號：admin</Text>
            <Text style={styles.accountDetails}>密碼：ADMIN123</Text>
            <Text style={styles.accountStats}>完整後台管理權限</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={handleCopySQL}
          >
            <Copy size={20} color="#FFD700" />
            <Text style={styles.copyButtonText}>查看 SQL 文件位置</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={handleTestAfterExecution}
          >
            <Play size={20} color="#000" />
            <Text style={styles.testButtonText}>查看測試帳號</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>💡 需要幫助？</Text>
          <Text style={styles.helpText}>
            如果您的 SQL AI 執行過程中遇到問題：
            {'\n'}
            {'\n'}1. 確認 AI 有足夠的權限執行 SQL
            {'\n'}2. 可以分段執行 SQL 語句
            {'\n'}3. 如果某些語句失敗，可以跳過繼續執行
            {'\n'}4. 執行完成後回到 APP 測試功能
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
  content: {
    flex: 1,
    padding: 16,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  stepsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
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
  stepText: {
    fontSize: 16,
    color: '#333',
  },
  sqlInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sqlInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sqlInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  testAccountsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  accountItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  accountType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  accountDetails: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  accountStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  copyButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  helpCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});