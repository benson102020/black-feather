import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';

export default function Index() {
  const { state } = useApp();

  useEffect(() => {
    // 延遲導航確保路由器已準備就緒
    const timer = setTimeout(() => {
      // 檢查是否已登入
      const isLoggedIn = state.user.isAuthenticated;
      
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/role-selection');
      }
    }, 2000); // 增加顯示時間到2秒

    return () => clearTimeout(timer);
  }, [state.user.isAuthenticated]);

  // 顯示啟動畫面
  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#333333']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.featherIcon}>🪶</Text>
        </View>
        <Text style={styles.logoText}>Black feather</Text>
        <Text style={styles.subtitle}>正在啟動...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: '#FFD700',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 24,
  },
  featherIcon: {
    fontSize: 48,
    color: '#000000',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
  },
});