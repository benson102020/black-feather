import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Copy, Database, CheckCircle, Play } from 'lucide-react-native';
import { router } from 'expo-router';

export default function DatabaseConstraintsFixScreen() {
  const handleCopySQL = () => {
    Alert.alert(
      '📋 複製約束修復 SQL',
      '我已經為您準備好修復約束問題的 SQL！\n\n請按照以下步驟：\n\n1. 手動複製下方的 SQL 內容\n2. 前往 Supabase Dashboard\n3. 進入 SQL Editor\n4. 貼上並執行\n\n這會完全解決約束違反問題！',
      [{ text: '我知道了' }]
    );
  };

  const handleTestAfterFix = () => {
    Alert.alert(
      '🧪 修復後測試',
      '修復完成後，您可以使用以下測試帳號：\n\n🚗 司機測試帳號\n手機：0982214855\n密碼：BOSS08017\n\n📱 乘客測試帳號\n手機：0912345678\n密碼：test123\n\n⚙️ 管理員測試帳號\n帳號：admin\n密碼：ADMIN123',
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
        
        <Text style={styles.headerTitle}>🔧 修復約束問題</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.problemCard}>
          <Text style={styles.problemTitle}>🚨 檢測到的問題</Text>
          <Text style={styles.problemText}>
            約束違反錯誤 (23514)：{'\n'}
            • verification_status 約束不接受 'verified' 值{'\n'}
            • 需要修復約束定義{'\n'}
            • 需要補齊缺失欄位
          </Text>
        </View>

        <View style={styles.solutionCard}>
          <Text style={styles.solutionTitle}>✅ 完整解決方案</Text>
          <Text style={styles.solutionText}>
            我已經準備了完整的修復腳本，將會：{'\n'}
            {'\n'}
            1. 刪除有問題的約束{'\n'}
            2. 重新創建正確的約束{'\n'}
            3. 補齊所有缺失欄位{'\n'}
            4. 修復 RLS 政策{'\n'}
            5. 建立完整測試帳號
          </Text>
        </View>

        <View style={styles.sqlCard}>
          <Text style={styles.sqlTitle}>🔧 約束修復 SQL</Text>
          <Text style={styles.sqlDescription}>
            這個 SQL 腳本會完全解決約束問題：
          </Text>
          
          <View style={styles.sqlPreview}>
            <Text style={styles.sqlText}>
              {`-- 修復 verification_status 約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_verification_status_check;
ALTER TABLE users ADD CONSTRAINT users_verification_status_check 
CHECK (verification_status = ANY (ARRAY['pending', 'verified', 'approved', 'rejected']));

-- 修復 role 約束
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role = ANY (ARRAY['admin', 'user', 'driver', 'passenger']));

-- 補齊缺失欄位...
-- 修復 RLS 政策...
-- 建立測試帳號...

（完整內容請查看 supabase/migrations/fix_constraints_and_rebuild.sql）`}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.copyButton} onPress={handleCopySQL}>
            <Copy size={20} color="#FFD700" />
            <Text style={styles.copyButtonText}>複製修復 SQL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testSection}>
          <Text style={styles.testTitle}>🧪 修復後測試</Text>
          
          <View style={styles.accountCard}>
            <Text style={styles.accountType}>🚗 司機測試帳號</Text>
            <Text style={styles.accountDetail}>手機：0982214855</Text>
            <Text style={styles.accountDetail}>密碼：BOSS08017</Text>
            <Text style={styles.accountFeature}>✅ 已審核通過，可直接登入</Text>
          </View>
          
          <View style={styles.accountCard}>
            <Text style={styles.accountType}>📱 乘客測試帳號</Text>
            <Text style={styles.accountDetail}>手機：0912345678</Text>
            <Text style={styles.accountDetail}>密碼：test123</Text>
            <Text style={styles.accountFeature}>✅ 已驗證帳號，可直接使用</Text>
          </View>

          <TouchableOpacity style={styles.testButton} onPress={handleTestAfterFix}>
            <Play size={20} color="#000" />
            <Text style={styles.testButtonText}>查看測試帳號</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>📋 執行步驟</Text>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>複製修復 SQL 腳本</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>在 Supabase SQL Editor 中執行</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>回到 APP 測試註冊登入</Text>
          </View>
          
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>執行完整系統測試</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/auth/register')}
          >
            <Database size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>司機註冊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/complete-system-test')}
          >
            <CheckCircle size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>系統測試</Text>
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
  problemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  problemText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  solutionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 8,
  },
  solutionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sqlCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sqlTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sqlDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  sqlPreview: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sqlText: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'monospace',
    lineHeight: 14,
  },
  copyButton: {
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
    fontSize: 16,
    fontWeight: '600',
  },
  testSection: {
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
  accountCard: {
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
  accountDetail: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  accountFeature: {
    fontSize: 12,
    color: '#34C759',
    marginTop: 4,
  },
  testButton: {
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
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 14,
    color: '#333',
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