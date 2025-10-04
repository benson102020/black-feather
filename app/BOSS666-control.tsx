import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Trash2, Shield, Lock, Database } from 'lucide-react-native';
import { router } from 'expo-router';
import { BOSS666Manager } from '../services/BOSS666-manager';

export default function BOSS666ControlScreen() {
  const handleCleanupBOSS666 = () => {
    Alert.alert(
      '🗑️ 清理 BOSS666',
      '這將完全移除 BOSS666 角色和權限：\n\n• 刪除 BOSS666 用戶\n• 移除所有相關政策\n• 清理日誌記錄\n• 恢復標準模式\n\n⚠️ 此操作無法復原',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '確定清理', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '📋 BOSS666 清理',
              '請在 Supabase SQL Editor 中執行：\n\nsupabase/migrations/BOSS666_cleanup.sql\n\n這會完全移除 BOSS666 並恢復標準模式',
              [{ text: '我知道了' }]
            );
          }
        }
      ]
    );
  };

  const handleCheckBOSS666 = async () => {
    try {
      const result = await BOSS666Manager.checkForBOSS666();
      
      if (result.hasBOSS666) {
        Alert.alert(
          '🔍 BOSS666 檢查結果',
          `發現 BOSS666：\n• 用戶：${result.boss666Users?.length || 0} 個\n• 管理員：${result.boss666Admins?.length || 0} 個\n\n建議定期清理`,
          [{ text: '確定' }]
        );
      } else {
        Alert.alert(
          '✅ 檢查通過',
          '系統運行在標準模式，未發現 BOSS666',
          [{ text: '確定' }]
        );
      }
    } catch (error) {
      Alert.alert('檢查失敗', '無法檢查安全狀態');
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
        
        <Text style={styles.headerTitle}>🔒 BOSS666 控制</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔒 BOSS666 控制面板</Text>
          <Text style={styles.infoText}>
            BOSS666 具有完整的系統權限：
            {'\n'}✅ 繞過所有 RLS 限制
            {'\n'}✅ 完整資料庫存取
            {'\n'}✅ 不受約束限制
            {'\n'}⚠️ 僅用於開發測試
          </Text>
        </View>

        <View style={styles.cleanupCard}>
          <Text style={styles.cleanupTitle}>🗑️ 清理特殊權限</Text>
          <Text style={styles.cleanupText}>
            當您不再需要特殊權限時，可以執行清理腳本：
          </Text>
          
          <TouchableOpacity 
            style={styles.cleanupButton}
            onPress={handleCleanupBOSS666}
          >
            <Trash2 size={20} color="#FF3B30" />
            <Text style={styles.cleanupButtonText}>清理 BOSS666</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.securityCard}>
          <Text style={styles.securityTitle}>🔍 安全檢查</Text>
          <Text style={styles.securityText}>
            檢查系統中是否存在特殊權限和角色：
          </Text>
          
          <TouchableOpacity 
            style={styles.checkButton}
            onPress={handleCheckBOSS666}
          >
            <Shield size={20} color="#007AFF" />
            <Text style={styles.checkButtonText}>檢查 BOSS666 狀態</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📋 清理說明</Text>
          <Text style={styles.instructionsText}>
            要完全移除特殊驗證角色：
            {'\n'}
            {'\n'}1. 在 Supabase SQL Editor 中執行 cleanup_verification_role.sql
            {'\n'}2. 這會刪除所有特殊用戶和政策
            {'\n'}3. 恢復標準的 RLS 安全模式
            {'\n'}4. 清理所有相關日誌記錄
          </Text>
        </View>

        <View style={styles.standardModeCard}>
          <Text style={styles.standardTitle}>🔒 標準安全模式</Text>
          <Text style={styles.standardText}>
            清理後系統將運行在標準模式：
            {'\n'}
            {'\n'}✅ 用戶只能存取自己的資料
            {'\n'}✅ 司機只能管理自己的訂單
            {'\n'}✅ 乘客只能查看自己的行程
            {'\n'}✅ 管理員有適當的管理權限
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
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cleanupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  cleanupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  cleanupText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  cleanupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  cleanupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  securityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  standardModeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  standardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 8,
  },
  standardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});