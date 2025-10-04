import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Wifi, Play, CheckCircle, Users, Car, Settings } from 'lucide-react-native';
import { router } from 'expo-router';

export default function OfflineModeSetupScreen() {
  const enableOfflineMode = () => {
    Alert.alert(
      '✅ 離線模式已啟用',
      '系統現在運行在離線模式：\n\n✅ 所有功能都可以測試\n✅ 使用本地模擬資料\n✅ 不需要網路連接\n✅ 完整的三端功能\n\n🧪 測試帳號：\n🚗 司機：0982214855 / BOSS08017\n📱 乘客：0912345678 / test123\n⚙️ 管理員：admin / ADMIN123',
      [
        { text: '開始使用', onPress: () => router.replace('/role-selection') }
      ]
    );
  };

  const testOfflineFeatures = () => {
    Alert.alert(
      '🧪 離線模式功能',
      '離線模式包含以下功能：\n\n📱 三端登入系統\n• 司機登入和註冊\n• 乘客登入和註冊\n• 管理員登入\n\n🚗 司機端功能\n• 工作台和狀態切換\n• 訂單管理和接單\n• 收入統計和提現\n• 訊息中心\n\n👥 乘客端功能\n• 立即叫車\n• 司機追蹤\n• 訂單管理\n• 客服中心\n\n⚙️ 後台管理\n• 司機審核\n• 訂單管理\n• 收入報表\n• 系統設定',
      [{ text: '確定' }]
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
        
        <Text style={styles.headerTitle}>離線模式設置</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🎭 離線模式說明</Text>
          <Text style={styles.infoText}>
            離線模式讓您可以在沒有資料庫連接的情況下測試所有功能：
            {'\n'}
            {'\n'}✅ 完整的三端系統
            {'\n'}✅ 所有 UI 和功能
            {'\n'}✅ 模擬真實資料
            {'\n'}✅ 不需要網路連接
            {'\n'}✅ 適合演示和開發
          </Text>
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>🚀 離線模式功能</Text>
          
          <View style={styles.featureCategory}>
            <View style={styles.featureHeader}>
              <Car size={20} color="#FFD700" />
              <Text style={styles.featureCategoryTitle}>司機端</Text>
            </View>
            <Text style={styles.featureList}>
              • 登入註冊系統{'\n'}
              • 工作台和狀態管理{'\n'}
              • 訂單接收和管理{'\n'}
              • 收入統計和提現{'\n'}
              • 訊息中心和通知
            </Text>
          </View>

          <View style={styles.featureCategory}>
            <View style={styles.featureHeader}>
              <Users size={20} color="#FFD700" />
              <Text style={styles.featureCategoryTitle}>乘客端</Text>
            </View>
            <Text style={styles.featureList}>
              • 登入註冊系統{'\n'}
              • 立即叫車功能{'\n'}
              • 司機追蹤{'\n'}
              • 訂單管理{'\n'}
              • 客服中心
            </Text>
          </View>

          <View style={styles.featureCategory}>
            <View style={styles.featureHeader}>
              <Settings size={20} color="#FFD700" />
              <Text style={styles.featureCategoryTitle}>後台管理</Text>
            </View>
            <Text style={styles.featureList}>
              • 管理員登入{'\n'}
              • 司機審核管理{'\n'}
              • 訂單管理{'\n'}
              • 收入報表{'\n'}
              • 系統設定
            </Text>
          </View>
        </View>

        <View style={styles.testAccountsCard}>
          <Text style={styles.testAccountsTitle}>🧪 離線模式測試帳號</Text>
          
          <View style={styles.accountItem}>
            <Text style={styles.accountType}>🚗 司機測試帳號</Text>
            <Text style={styles.accountDetail}>手機：0982214855</Text>
            <Text style={styles.accountDetail}>密碼：BOSS08017</Text>
            <Text style={styles.accountFeature}>✅ 完整司機功能</Text>
          </View>
          
          <View style={styles.accountItem}>
            <Text style={styles.accountType}>📱 乘客測試帳號</Text>
            <Text style={styles.accountDetail}>手機：0912345678</Text>
            <Text style={styles.accountDetail}>密碼：test123</Text>
            <Text style={styles.accountFeature}>✅ 完整乘客功能</Text>
          </View>

          <View style={styles.accountItem}>
            <Text style={styles.accountType}>⚙️ 管理員測試帳號</Text>
            <Text style={styles.accountDetail}>帳號：admin</Text>
            <Text style={styles.accountDetail}>密碼：ADMIN123</Text>
            <Text style={styles.accountFeature}>✅ 完整後台功能</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.enableButton}
            onPress={enableOfflineMode}
          >
            <CheckCircle size={20} color="#fff" />
            <Text style={styles.enableButtonText}>啟用離線模式</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testOfflineFeatures}
          >
            <Play size={20} color="#FFD700" />
            <Text style={styles.testButtonText}>查看功能列表</Text>
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  featuresCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  featureCategory: {
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  featureList: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 28,
  },
  testAccountsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  testAccountsTitle: {
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  enableButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  testButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});