import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, AlertTriangle, RefreshCw, Settings, Database } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ErrorHandlerScreen() {
  const handleRefreshApp = () => {
    // 重新載入應用
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      '清除緩存',
      '這將清除應用緩存並重新載入：\n\n• 清除圖標緩存\n• 重新載入所有資源\n• 修復載入問題',
      [
        { text: '取消', style: 'cancel' },
        { text: '清除並重載', onPress: handleRefreshApp }
      ]
    );
  };

  const handleCheckSystem = () => {
    router.push('/system-status');
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
        
        <Text style={styles.headerTitle}>錯誤處理</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.errorCard}>
          <AlertTriangle size={48} color="#FF9500" />
          <Text style={styles.errorTitle}>檢測到 API 錯誤</Text>
          <Text style={styles.errorText}>
            Lucide 圖標 API 回應異常，這可能是暫時的網路問題。
          </Text>
        </View>

        <View style={styles.solutionsCard}>
          <Text style={styles.solutionsTitle}>解決方案</Text>
          
          <TouchableOpacity style={styles.solutionButton} onPress={handleRefreshApp}>
            <RefreshCw size={20} color="#FFD700" />
            <Text style={styles.solutionText}>重新載入應用</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.solutionButton} onPress={handleClearCache}>
            <Database size={20} color="#FFD700" />
            <Text style={styles.solutionText}>清除緩存</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.solutionButton} onPress={handleCheckSystem}>
            <Settings size={20} color="#FFD700" />
            <Text style={styles.solutionText}>系統檢查</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 關於這個錯誤</Text>
          <Text style={styles.infoText}>
            這個錯誤通常是由於：
            {'\n'}• 網路連接不穩定
            {'\n'}• 圖標 API 暫時無法回應
            {'\n'}• 瀏覽器緩存問題
            {'\n'}
            {'\n'}不會影響應用的核心功能，只是圖標載入可能有延遲。
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});