import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, Users, Settings, Database, TestTube, Zap, FileText } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function RoleSelectionScreen() {
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const handleRoleSelect = (role: 'driver' | 'passenger' | 'admin') => {
    console.log('Role selected:', role);
    try {
      switch (role) {
        case 'driver':
          router.push('/auth/login');
          break;
        case 'passenger':
          router.push('/passenger/auth/login');
          break;
        case 'admin':
          router.push('/admin/auth/login');
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('錯誤', '無法導航到選定頁面');
    }
  };

  const handleDatabaseSetup = () => {
    Alert.alert(
      '📋 資料庫設置',
      '選擇設置方式：',
      [
        { text: '取消', style: 'cancel' },
        { text: '一鍵修復', onPress: () => router.push('/database-migration') },
        { text: '系統檢查', onPress: () => router.push('/system-check') },
        { text: '完整測試', onPress: () => router.push('/test-all-features') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#333333']}
        style={styles.gradient}
      >
        <TouchableOpacity
          style={styles.debugButton}
          onPress={() => {
            console.log('Debug button pressed');
            router.push('/database-constraints-fix');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.systemStatusText}>🔧 修復約束問題</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.featherIcon}>🪶</Text>
          </View>
          <Text style={styles.logoText}>Black feather</Text>
          <Text style={styles.subtitle}>專業叫車服務平台</Text>
        </View>

        <View style={styles.rolesContainer}>
          <Text style={styles.selectTitle}>請選擇您的身份</Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.roleCard,
              pressed && styles.roleCardPressed
            ]}
            onPress={() => {
              console.log('Driver button pressed');
              handleRoleSelect('driver');
            }}
          >
            <View style={styles.roleIcon}>
              <Car size={32} color="#FFD700" />
            </View>
            <Text style={styles.roleTitle}>司機端</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.roleCard,
              pressed && styles.roleCardPressed
            ]}
            onPress={() => {
              console.log('Passenger button pressed');
              handleRoleSelect('passenger');
            }}
          >
            <View style={styles.roleIcon}>
              <Users size={32} color="#FFD700" />
            </View>
            <Text style={styles.roleTitle}>乘客端</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.roleCard,
              pressed && styles.roleCardPressed
            ]}
            onPress={() => {
              console.log('Admin button pressed');
              handleRoleSelect('admin');
            }}
          >
            <View style={styles.roleIcon}>
              <Settings size={32} color="#FFD700" />
            </View>
            <Text style={styles.roleTitle}>後台管理</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Black feather v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Black feather Technology</Text>
          
          <View style={styles.systemActions}>
            <TouchableOpacity
              style={styles.systemButton}
              onPress={() => {
                console.log('Database auto-fix pressed');
                router.push('/database-auto-fix');
              }}
              activeOpacity={0.7}
            >
              <Database size={16} color="#FFD700" />
              <Text style={styles.systemButtonText}>一鍵修復</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.systemButton}
              onPress={() => {
                console.log('System test pressed');
                router.push('/complete-system-test');
              }}
              activeOpacity={0.7}
            >
              <TestTube size={16} color="#FFD700" />
              <Text style={styles.systemButtonText}>系統測試</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.systemButton}
              onPress={() => {
                console.log('BOSS666 pressed');
                router.push('/BOSS666-control');
              }}
              activeOpacity={0.7}
            >
              <FileText size={16} color="#FFD700" />
              <Text style={styles.systemButtonText}>BOSS666</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.systemButton}
              onPress={() => {
                console.log('File navigator pressed');
                router.push('/file-navigator');
              }}
              activeOpacity={0.7}
            >
              <Database size={16} color="#FFD700" />
              <Text style={styles.systemButtonText}>找文件</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.systemButton}
              onPress={() => {
                console.log('Icon test pressed');
                router.push('/icon-test');
              }}
              activeOpacity={0.7}
            >
              <Zap size={16} color="#FFD700" />
              <Text style={styles.systemButtonText}>圖標測試</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.systemStatusButton}
            onPress={() => {
              console.log('Alternative setup pressed');
              router.push('/alternative-setup');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.systemStatusText}>🛠️ 替代方案</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  debugButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    zIndex: 1000,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  featherIcon: {
    fontSize: 40,
    color: '#000000',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  rolesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  selectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  roleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignItems: 'center',
    width: '100%',
  },
  roleCardPressed: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    transform: [{ scale: 0.98 }],
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  roleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 0,
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
  },
  versionText: {
    color: '#555',
    fontSize: 14,
    marginBottom: 8,
  },
  copyrightText: {
    color: '#444',
    fontSize: 12,
  },
  systemStatusButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  systemStatusText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
  },
  systemActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  systemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    gap: 4,
  },
  systemButtonText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
  },
});