import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users,
  Car,
  Clock,
  MapPin,
  Star,
  Activity
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminAnalyticsScreen() {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: {
      totalUsers: 1250,
      newUsersThisMonth: 156,
      growthRate: 14.2
    },
    driverPerformance: {
      totalDrivers: 85,
      activeDrivers: 67,
      averageRating: 4.7,
      topPerformers: [
        { name: '張司機', rating: 4.9, orders: 245 },
        { name: '李司機', rating: 4.8, orders: 198 },
        { name: '王司機', rating: 4.8, orders: 187 }
      ]
    },
    orderAnalytics: {
      totalOrders: 3420,
      completionRate: 94.2,
      averageDistance: 12.5,
      peakHours: ['08:00', '18:00'],
      popularRoutes: [
        { from: '台北車站', to: '松山機場', count: 156 },
        { from: '信義區', to: '內湖科技園區', count: 134 },
        { from: '西門町', to: '台北101', count: 98 }
      ]
    },
    revenueBreakdown: {
      totalRevenue: 856000,
      platformRevenue: 128400,
      driverRevenue: 727600,
      averageOrderValue: 250
    }
  });

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
        
        <Text style={styles.headerTitle}>數據分析</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* 用戶成長分析 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>用戶成長</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analyticsData.userGrowth.totalUsers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>總用戶數</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>+{analyticsData.userGrowth.newUsersThisMonth}</Text>
              <Text style={styles.statLabel}>本月新增</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analyticsData.userGrowth.growthRate}%</Text>
              <Text style={styles.statLabel}>成長率</Text>
            </View>
          </View>
          
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={32} color="#007AFF" />
            <Text style={styles.chartText}>用戶成長趨勢圖</Text>
          </View>
        </View>

        {/* 司機績效分析 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Car size={24} color="#FFD700" />
            <Text style={styles.sectionTitle}>司機績效</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analyticsData.driverPerformance.totalDrivers}</Text>
              <Text style={styles.statLabel}>總司機數</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analyticsData.driverPerformance.activeDrivers}</Text>
              <Text style={styles.statLabel}>活躍司機</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>⭐ {analyticsData.driverPerformance.averageRating}</Text>
              <Text style={styles.statLabel}>平均評分</Text>
            </View>
          </View>
          
          <View style={styles.topPerformers}>
            <Text style={styles.subSectionTitle}>本月優秀司機</Text>
            {analyticsData.driverPerformance.topPerformers.map((driver, index) => (
              <View key={index} style={styles.performerItem}>
                <View style={styles.performerRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.performerInfo}>
                  <Text style={styles.performerName}>{driver.name}</Text>
                  <Text style={styles.performerStats}>
                    ⭐ {driver.rating} · {driver.orders} 單
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 訂單分析 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={24} color="#34C759" />
            <Text style={styles.sectionTitle}>訂單分析</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analyticsData.orderAnalytics.totalOrders.toLocaleString()}</Text>
              <Text style={styles.statLabel}>總訂單數</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analyticsData.orderAnalytics.completionRate}%</Text>
              <Text style={styles.statLabel}>完成率</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{analyticsData.orderAnalytics.averageDistance}km</Text>
              <Text style={styles.statLabel}>平均距離</Text>
            </View>
          </View>
          
          <View style={styles.popularRoutes}>
            <Text style={styles.subSectionTitle}>熱門路線</Text>
            {analyticsData.orderAnalytics.popularRoutes.map((route, index) => (
              <View key={index} style={styles.routeItem}>
                <MapPin size={16} color="#FFD700" />
                <Text style={styles.routeText}>
                  {route.from} → {route.to}
                </Text>
                <Text style={styles.routeCount}>{route.count} 次</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 收入分析 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={24} color="#FF9500" />
            <Text style={styles.sectionTitle}>收入分析</Text>
          </View>
          
          <View style={styles.revenueChart}>
            <PieChart size={48} color="#FF9500" />
            <Text style={styles.chartText}>收入分配圖</Text>
            <Text style={styles.chartSubtext}>
              平台 15% · 司機 85%
            </Text>
          </View>
          
          <View style={styles.revenueBreakdown}>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>平均訂單價值</Text>
              <Text style={styles.revenueValue}>
                NT${analyticsData.revenueBreakdown.averageOrderValue}
              </Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>司機總收入</Text>
              <Text style={styles.revenueValue}>
                NT${analyticsData.revenueBreakdown.driverRevenue.toLocaleString()}
              </Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>平台總收入</Text>
              <Text style={styles.revenueValue}>
                NT${analyticsData.revenueBreakdown.platformRevenue.toLocaleString()}
              </Text>
            </View>
          </View>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  chartText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  topPerformers: {
    marginTop: 16,
  },
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  performerRank: {
    width: 24,
    height: 24,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  performerStats: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  popularRoutes: {
    marginTop: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  routeCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  revenueChart: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 16,
  },
  revenueBreakdown: {
    gap: 8,
  },
  revenueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  revenueLabel: {
    fontSize: 14,
    color: '#666',
  },
  revenueValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});