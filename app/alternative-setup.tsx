import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Database, Wifi, Settings, Play, CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AlternativeSetupScreen() {
  const handleOption1 = () => {
    Alert.alert(
      '🔧 選項 1：約束修復',
      '這個選項會修復資料庫約束問題：\n\n• 修復 verification_status 約束\n• 修復 role 約束\n• 補齊缺失欄位\n• 重建測試帳號\n\n適用於：約束錯誤 (23514)',
      [
        { text: '取消', style: 'cancel' },
        { text: '開始修復', onPress: () => router.push('/database-constraints-fix') }
      ]
    );
  };

  const handleOption2 = () => {
    Alert.alert(
      '🎭 選項 2：離線模式',
      '使用離線模式運行系統：\n\n• 不需要 Supabase 連接\n• 使用本地模擬資料\n• 所有功能都可測試\n• 適合開發和演示\n\n適用於：網路問題或資料庫問題',
      [
        { text: '取消', style: 'cancel' },
        { text: '啟用離線模式', onPress: () => router.push('/offline-mode-setup') }
      ]
    );
  };

  const handleOption3 = () => {
    Alert.alert(
      '🔄 選項 3：重新配置',
      '重新配置 Supabase 連接：\n\n• 更新 Supabase URL\n• 更新 API Key\n• 重新測試連接\n• 執行完整遷移\n\n適用於：配置錯誤',
      [
        { text: '取消', style: 'cancel' },
        { text: '重新配置', onPress: () => router.push('/supabase-setup') }
      ]
    );
  };

  const handleOption4 = () => {
    Alert.alert(
      '🧪 選項 4：完整重建',
      '完全重建整個系統：\n\n• 刪除所有現有資料\n• 重新創建所有資料表\n• 重新設置所有約束\n• 重新建立測試資料\n\n⚠️ 警告：會刪除所有現有資料',
      [
        { text: '取消', style: 'cancel' },
        { text: '我了解風險', style: 'destructive', onPress: () => router.push('/complete-system-rebuild') }
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
        
        <Text style={styles.headerTitle}>替代解決方案</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.problemCard}>
          <Text style={styles.problemTitle}>🚨 檢測到的問題</Text>
          <Text style={styles.problemText}>
            資料庫約束違反錯誤 (23514)：
            {'\n'}• verification_status 約束不匹配
            {'\n'}• 可能缺少必要的欄位
            {'\n'}• RLS 政策可能過於嚴格
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>🛠️ 解決方案選項</Text>
          
          <TouchableOpacity style={styles.optionCard} onPress={handleOption1}>
            <View style={styles.optionHeader}>
              <Database size={24} color="#34C759" />
              <Text style={styles.optionTitle}>修復約束問題</Text>
            </View>
            <Text style={styles.optionDescription}>
              修復資料庫約束和欄位問題，適合有 Supabase 權限的情況
            </Text>
            <View style={styles.optionBadge}>
              <Text style={styles.optionBadgeText}>推薦</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleOption2}>
            <View style={styles.optionHeader}>
              <Wifi size={24} color="#FFD700" />
              <Text style={styles.optionTitle}>啟用離線模式</Text>
            </View>
            <Text style={styles.optionDescription}>
              使用本地模擬資料，不需要資料庫連接，適合演示和開發
            </Text>
            <View style={[styles.optionBadge, { backgroundColor: '#FFD700' }]}>
              <Text style={[styles.optionBadgeText, { color: '#000' }]}>快速</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleOption3}>
            <View style={styles.optionHeader}>
              <Settings size={24} color="#007AFF" />
              <Text style={styles.optionTitle}>重新配置 Supabase</Text>
            </View>
            <Text style={styles.optionDescription}>
              重新設置 Supabase 連接和配置，適合配置錯誤的情況
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleOption4}>
            <View style={styles.optionHeader}>
              <Database size={24} color="#FF3B30" />
              <Text style={styles.optionTitle}>完整重建系統</Text>
            </View>
            <Text style={styles.optionDescription}>
              完全重建整個資料庫系統，適合嚴重問題的情況
            </Text>
            <View style={[styles.optionBadge, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.optionBadgeText}>謹慎</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>💡 建議</Text>
          <Text style={styles.recommendationText}>
            根據您遇到的約束錯誤，建議按以下順序嘗試：
            {'\n'}
            {'\n'}1. 先嘗試「修復約束問題」
            {'\n'}2. 如果沒有 Supabase 權限，使用「離線模式」
            {'\n'}3. 如果問題持續，考慮「重新配置」
            {'\n'}4. 最後才考慮「完整重建」
          </Text>
        </View>

        <View style={styles.quickTestCard}>
          <Text style={styles.quickTestTitle}>🧪 快速測試</Text>
          <Text style={styles.quickTestText}>
            無論選擇哪個方案，都可以使用以下測試帳號：
          </Text>
          
          <View style={styles.testAccounts}>
            <Text style={styles.testAccount}>🚗 司機：0982214855 / BOSS08017</Text>
            <Text style={styles.testAccount}>📱 乘客：0912345678 / test123</Text>
            <Text style={styles.testAccount}>⚙️ 管理員：admin / ADMIN123</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.quickTestButton}
            onPress={() => router.push('/system-diagnosis')}
          >
            <Play size={20} color="#000" />
            <Text style={styles.quickTestButtonText}>系統診斷</Text>
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
  optionsContainer: {
    marginBottom: 16,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 12,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  optionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  optionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  quickTestCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  quickTestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 8,
  },
  quickTestText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  testAccounts: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  testAccount: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  quickTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  quickTestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});