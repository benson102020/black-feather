import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wifi, RefreshCw, ArrowLeft, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function NetworkErrorHandlerScreen() {
  const handleRetry = () => {
    // 重新載入頁面
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleOfflineMode = () => {
    Alert.alert(
      '離線模式',
      '您可以使用以下功能：\n\n✅ 查看已載入的資料\n✅ 使用測試帳號登入\n✅ 瀏覽介面功能\n\n❌ 無法註冊新帳號\n❌ 無法同步最新資料',
      [
        { text: '確定' },
        { text: '使用測試帳號', onPress: () => router.push('/auth/login') }
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
        
        <Text style={styles.headerTitle}>網路連接問題</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.errorCard}>
          <AlertTriangle size={48} color="#FF9500" />
          <Text style={styles.errorTitle}>網路連接異常</Text>
          <Text style={styles.errorText}>
            檢測到網路連接問題，這可能影響部分功能的使用。
          </Text>
        </View>

        <View style={styles.solutionsCard}>
          <Text style={styles.solutionsTitle}>解決方案</Text>
          
          <TouchableOpacity style={styles.solutionButton} onPress={handleRetry}>
            <RefreshCw size={20} color="#FFD700" />
            <Text style={styles.solutionText}>重新連接</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.solutionButton} onPress={handleOfflineMode}>
            <Wifi size={20} color="#FFD700" />
            <Text style={styles.solutionText}>離線模式</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.solutionButton} 
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.solutionText}>使用測試帳號</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testAccountsCard}>
          <Text style={styles.testTitle}>🧪 離線測試帳號</Text>
          <Text style={styles.testAccount}>🚗 司機：0982214855 / BOSS08017</Text>
          <Text style={styles.testAccount}>📱 乘客：0912345678 / test123</Text>
          <Text style={styles.testAccount}>⚙️ 管理員：admin / ADMIN123</Text>
        </View>
      </View>
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
    justifyContent: 'center',
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9500',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  solutionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  solutionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  solutionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  solutionText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  testAccountsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 12,
  },
  testAccount: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});