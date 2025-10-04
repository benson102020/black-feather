import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Users,
  Car,
  Package,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  BarChart3,
  ArrowLeft,
  UserCheck,
  Monitor,
  Smartphone
} from 'lucide-react-native';
import { router } from 'expo-router';
import { adminService } from '../../services/admin';
import { driverApplicationService } from '../../services/driver-application';

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
    onlineDrivers: 0,
  });
  const [pendingApplications, setPendingApplications] = useState(0);

  useEffect(() => {
    loadDashboardStats();
    loadPendingApplications();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const result = await adminService.getSystemStats();
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('載入統計失敗:', result.error);
        setStats({
          totalUsers: 0,
          totalDrivers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          activeOrders: 0,
          onlineDrivers: 0,
        });
      }
    } catch (error) {
      console.error('載入統計錯誤:', error);
      setStats({
        totalUsers: 0,
        totalDrivers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activeOrders: 0,
        onlineDrivers: 0,
      });
    }
  };

  const loadPendingApplications = async () => {
    try {
      const result = await driverApplicationService.getPendingApplications();
      if (result.success && result.data) {
        const pendingCount = result.data.filter(app => app.status === 'pending').length;
        setPendingApplications(pendingCount);
      }
    } catch (error) {
      console.error('載入待審核申請錯誤:', error);
    }
  };

  const menuItems = [
    {
      icon: Monitor,
      title: '司機前台視角',
      subtitle: '模擬司機端界面',
      color: '#FFD700',
      onPress: () => router.push('/admin/driver-frontend-view'),
    },
    {
      icon: Smartphone,
      title: '乘客前台視角',
      subtitle: '模擬乘客端界面',
      color: '#34C759',
      onPress: () => router.push('/admin/passenger-frontend-view'),
    },
    {
      icon: Users,
      title: '用戶管理',
      subtitle: `${stats.totalUsers} 位用戶`,
      color: '#007AFF',
      onPress: () => router.push('/admin/users'),
    },
    {
      icon: UserCheck,
      title: '司機申請審核',
      subtitle: pendingApplications > 0 ? `${pendingApplications} 筆待審核` : '暫無待審核',
      color: '#FF9500',
      onPress: () => router.push('/admin/driver-applications'),
      badge: pendingApplications,
    },
    {
      icon: UserCheck,
      title: '乘客申請審核',
      subtitle: '審核乘客註冊',
      color: '#5856D6',
      onPress: () => router.push('/admin/passenger-applications'),
    },
    {
      icon: Car,
      title: '司機管理',
      subtitle: `${stats.totalDrivers} 位司機`,
      color: '#007AFF',
      onPress: () => router.push('/admin/drivers'),
    },
    {
      icon: Users,
      title: '乘客管理',
      subtitle: '管理乘客帳號',
      color: '#5856D6',
      onPress: () => router.push('/admin/passengers'),
    },
    {
      icon: Package,
      title: '訂單管理',
      subtitle: `${stats.totalOrders} 筆訂單`,
      color: '#34C759',
      onPress: () => router.push('/admin/orders'),
    },
    {
      icon: DollarSign,
      title: '收入報表',
      subtitle: `NT$${stats.totalRevenue.toLocaleString()}`,
      color: '#FF9500',
      onPress: () => router.push('/admin/revenue'),
    },
    {
      icon: BarChart3,
      title: '數據分析',
      subtitle: '營運數據統計',
      color: '#8E44AD',
      onPress: () => router.push('/admin/analytics'),
    },
    {
      icon: Settings,
      title: '系統設定',
      subtitle: '計費、車型等設定',
      color: '#666',
      onPress: () => router.push('/admin/settings'),
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Black feather</Text>
        <Text style={styles.headerSubtitle}>後台管理系統</Text>
        
        <View style={styles.liveStats}>
          <View style={styles.liveStat}>
            <Text style={styles.liveNumber}>{stats.activeOrders}</Text>
            <Text style={styles.liveLabel}>進行中訂單</Text>
          </View>
          <View style={styles.liveStat}>
            <Text style={styles.liveNumber}>{stats.onlineDrivers}</Text>
            <Text style={styles.liveLabel}>在線司機</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={item.onPress}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <item.icon size={24} color="#fff" />
                {item.badge && item.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => Alert.alert('系統通知', '發送系統通知功能')}
          >
            <Bell size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>發送通知</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => Alert.alert('數據匯出', '匯出營運數據功能')}
          >
            <TrendingUp size={20} color="#FFD700" />
            <Text style={styles.quickActionText}>數據匯出</Text>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
  },
  liveStats: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 12,
    gap: 24,
  },
  liveStat: {
    alignItems: 'center',
  },
  liveNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  liveLabel: {
    fontSize: 11,
    color: '#ccc',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 3,
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
});