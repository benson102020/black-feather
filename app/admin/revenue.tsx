import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  BarChart3,
  PieChart,
  Users,
  Car
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminRevenueScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [revenueData, setRevenueData] = useState({
    today: { total: 38500, orders: 156, commission: 5775, drivers: 23 },
    week: { total: 245000, orders: 892, commission: 36750, drivers: 45 },
    month: { total: 856000, orders: 3420, commission: 128400, drivers: 85 },
    year: { total: 8560000, orders: 35200, commission: 1284000, drivers: 156 }
  });

  const periods = [
    { key: 'today', label: '今日' },
    { key: 'week', label: '本週' },
    { key: 'month', label: '本月' },
    { key: 'year', label: '本年' }
  ];

  const currentData = revenueData[selectedPeriod];

  const handleDownloadReport = () => {
    const periodLabel = periods.find(p => p.key === selectedPeriod)?.label;
    Alert.alert(
      '下載報表',
      `準備下載 ${periodLabel} 收入報表\n總收入：NT$${currentData.total.toLocaleString()}\n平台收入：NT$${currentData.commission.toLocaleString()}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '下載', 
          onPress: () => Alert.alert('下載完成', `${periodLabel} 收入報表已保存`)
        }
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
        
        <Text style={styles.headerTitle}>收入報表</Text>
        
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadReport}
        >
          <Download size={20} color="#000" />
          <Text style={styles.downloadButtonText}>下載</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.periodSelector}>
        {periods.map(period => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period.key && styles.periodTextActive
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.mainStats}>
          <View style={styles.mainStatCard}>
            <DollarSign size={32} color="#FFD700" />
            <Text style={styles.mainAmount}>NT${currentData.total.toLocaleString()}</Text>
            <Text style={styles.mainLabel}>總收入</Text>
          </View>
          
          <View style={styles.subStats}>
            <View style={styles.subStat}>
              <Text style={styles.subStatNumber}>NT${currentData.commission.toLocaleString()}</Text>
              <Text style={styles.subStatLabel}>平台收入</Text>
            </View>
            <View style={styles.subStat}>
              <Text style={styles.subStatNumber}>{currentData.orders.toLocaleString()}</Text>
              <Text style={styles.subStatLabel}>總訂單數</Text>
            </View>
            <View style={styles.subStat}>
              <Text style={styles.subStatNumber}>{currentData.drivers}</Text>
              <Text style={styles.subStatLabel}>活躍司機</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>收入趨勢</Text>
          <View style={styles.chartPlaceholder}>
            <BarChart3 size={48} color="#FFD700" />
            <Text style={styles.chartText}>收入趨勢圖表</Text>
            <Text style={styles.chartSubtext}>顯示 {periods.find(p => p.key === selectedPeriod)?.label} 收入變化</Text>
          </View>
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>收入分析</Text>
          
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <PieChart size={20} color="#34C759" />
              <Text style={styles.breakdownTitle}>收入分配</Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>司機收入 (85%)</Text>
              <Text style={styles.breakdownValue}>
                NT${(currentData.total * 0.85).toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>平台收入 (15%)</Text>
              <Text style={styles.breakdownValue}>
                NT${currentData.commission.toLocaleString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <Users size={20} color="#007AFF" />
              <Text style={styles.breakdownTitle}>平均數據</Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>平均訂單金額</Text>
              <Text style={styles.breakdownValue}>
                NT${Math.round(currentData.total / currentData.orders)}
              </Text>
            </View>
            
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>每司機平均收入</Text>
              <Text style={styles.breakdownValue}>
                NT${Math.round(currentData.total * 0.85 / currentData.drivers).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('詳細報表', '功能開發中')}
          >
            <BarChart3 size={24} color="#FFD700" />
            <Text style={styles.actionTitle}>詳細報表</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('數據匯出', '功能開發中')}
          >
            <Download size={24} color="#FFD700" />
            <Text style={styles.actionTitle}>數據匯出</Text>
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
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#FFD700',
  },
  periodText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mainStats: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainStatCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 8,
  },
  mainLabel: {
    color: '#666',
    fontSize: 14,
  },
  subStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  subStat: {
    alignItems: 'center',
  },
  subStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subStatLabel: {
    color: '#666',
    fontSize: 12,
  },
  chartSection: {
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
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
  },
  chartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  breakdownSection: {
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionTitle: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
});