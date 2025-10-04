import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, FileText, Database, Shield, Trash2, Eye, Copy } from 'lucide-react-native';
import { router } from 'expo-router';

export default function FileNavigatorScreen() {
  const securityFiles = [
    {
      name: '🔑 BOSS666 創建腳本',
      path: 'supabase/migrations/BOSS666_create.sql',
      description: 'BOSS666 特殊驗證角色創建腳本 - 繞過所有 RLS 限制',
      type: 'sql',
      sensitive: true
    },
    {
      name: '🗑️ BOSS666 清理腳本',
      path: 'supabase/migrations/BOSS666_cleanup.sql', 
      description: 'BOSS666 完整清理腳本 - 移除所有特殊權限並恢復標準模式',
      type: 'sql',
      sensitive: true
    },
    {
      name: '🔒 BOSS666 管理服務',
      path: 'services/BOSS666-manager.ts',
      description: 'BOSS666 管理服務',
      type: 'service',
      sensitive: true
    },
    {
      name: '📱 BOSS666 控制頁面',
      path: 'app/BOSS666-control.tsx',
      description: 'BOSS666 控制介面',
      type: 'component',
      sensitive: false
    }
  ];

  const systemFiles = [
    {
      name: '🔧 完整系統修復',
      path: 'supabase/migrations/fix_duplicate_keys_and_complete_system.sql',
      description: '修復所有約束和重複鍵值問題',
      type: 'sql',
      sensitive: false
    },
    {
      name: '🎭 離線模式服務',
      path: 'services/offline-mode.ts',
      description: '離線模式和演示數據服務',
      type: 'service',
      sensitive: false
    },
    {
      name: '🚀 Supabase 主服務',
      path: 'services/supabase.ts',
      description: '主要的 Supabase 連接和 API 服務',
      type: 'service',
      sensitive: false
    }
  ];

  const handleViewFile = (file: any) => {
    if (file.sensitive) {
      Alert.alert(
        '🔒 敏感文件',
        `文件：${file.name}\n路徑：${file.path}\n\n⚠️ 這是敏感的安全文件，包含特殊權限資訊。\n\n請謹慎處理，不要外流。`,
        [
          { text: '我知道了' },
          { text: '查看位置', onPress: () => showFileLocation(file) }
        ]
      );
    } else {
      showFileLocation(file);
    }
  };

  const showFileLocation = (file: any) => {
    Alert.alert(
      `📁 文件位置`,
      `文件名：${file.name}\n\n完整路徑：\n${file.path}\n\n描述：${file.description}`,
      [
        { text: '確定' },
        { text: '複製路徑', onPress: () => Alert.alert('路徑已複製', file.path) }
      ]
    );
  };

  const handleQuickAccess = (action: string) => {
    switch (action) {
      case 'create':
        Alert.alert(
          '🔑 BOSS666 創建',
          '文件位置：supabase/migrations/BOSS666_create.sql\n\n這個文件包含：\n• BOSS666 用戶創建\n• 完整 RLS 政策設置\n• 約束問題修復\n• 測試資料建立',
          [{ text: '確定' }]
        );
        break;
      case 'cleanup':
        Alert.alert(
          '🗑️ BOSS666 清理',
          '文件位置：supabase/migrations/BOSS666_cleanup.sql\n\n這個文件會：\n• 完全移除 BOSS666\n• 刪除所有相關政策\n• 恢復標準模式\n• 清理相關記錄',
          [{ text: '確定' }]
        );
        break;
      case 'manage':
        router.push('/BOSS666-control');
        break;
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
        
        <Text style={styles.headerTitle}>📁 文件導航器</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>🔒 安全提醒</Text>
          <Text style={styles.warningText}>
            特殊驗證角色具有完整的資料庫權限，請謹慎處理相關文件，
            不要將敏感資訊外流。正式營運前請務必清理。
          </Text>
        </View>

        {/* 快速操作 */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>🚀 快速操作</Text>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleQuickAccess('create')}
          >
            <Database size={20} color="#34C759" />
            <Text style={styles.quickActionText}>查看創建腳本位置</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleQuickAccess('cleanup')}
          >
            <Trash2 size={20} color="#FF3B30" />
            <Text style={styles.quickActionText}>查看清理腳本位置</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleQuickAccess('manage')}
          >
            <Shield size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>前往安全管理頁面</Text>
          </TouchableOpacity>
        </View>

        {/* 安全相關文件 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 安全相關文件</Text>
          
          {securityFiles.map((file, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.fileCard, file.sensitive && styles.sensitiveFile]}
              onPress={() => handleViewFile(file)}
            >
              <View style={styles.fileHeader}>
                <FileText size={20} color={file.sensitive ? "#FF9500" : "#FFD700"} />
                <Text style={styles.fileName}>{file.name}</Text>
                {file.sensitive && (
                  <View style={styles.sensitiveTag}>
                    <Text style={styles.sensitiveText}>敏感</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.filePath}>{file.path}</Text>
              <Text style={styles.fileDescription}>{file.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 系統文件 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ 系統文件</Text>
          
          {systemFiles.map((file, index) => (
            <TouchableOpacity
              key={index}
              style={styles.fileCard}
              onPress={() => handleViewFile(file)}
            >
              <View style={styles.fileHeader}>
                <FileText size={20} color="#FFD700" />
                <Text style={styles.fileName}>{file.name}</Text>
              </View>
              
              <Text style={styles.filePath}>{file.path}</Text>
              <Text style={styles.fileDescription}>{file.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 重要提醒 */}
        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>💡 重要提醒</Text>
          <Text style={styles.reminderText}>
            1. 特殊驗證角色僅用於開發和測試{'\n'}
            2. 正式營運前請務必執行清理{'\n'}
            3. 不要將特殊角色資訊外流{'\n'}
            4. 定期檢查系統安全狀態
          </Text>
        </View>

        {/* 驗證角色資訊 */}
        <View style={styles.verificationInfo}>
          <Text style={styles.verificationTitle}>🔑 驗證角色資訊</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>用戶 ID：</Text>
            <Text style={styles.infoValue}>bolt-new-verification-user-2024</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>角色：</Text>
            <Text style={styles.infoValue}>bolt_new</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>權限：</Text>
            <Text style={styles.infoValue}>繞過所有 RLS 限制</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.copyIdButton}
            onPress={() => Alert.alert('驗證 ID', 'bolt-new-verification-user-2024\n\n請妥善保管此 ID')}
          >
            <Copy size={16} color="#FFD700" />
            <Text style={styles.copyIdText}>查看驗證 ID</Text>
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
  quickActions: {
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
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fileCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sensitiveFile: {
    borderColor: '#FF9500',
    backgroundColor: '#fff8f0',
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
    flex: 1,
  },
  sensitiveTag: {
    backgroundColor: '#FF9500',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sensitiveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  filePath: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 4,
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 4,
  },
  fileDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  verificationInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'monospace',
    flex: 1,
  },
  copyIdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 8,
    marginTop: 12,
    gap: 6,
  },
  copyIdText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
});