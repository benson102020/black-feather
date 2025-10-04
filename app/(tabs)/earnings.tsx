import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CreditCard,
  Download,
  Eye,
  ArrowLeft
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { driverService, earningsService } from '../../services/supabase';
import { router } from 'expo-router';
import { mockDataService } from '../../services/mock-data';

export default function EarningsScreen() {
  const { state, actions } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [earningsData, setEarningsData] = useState({
    today: { total: 0, orders: 0, hours: 0, average: 0 },
    week: { total: 0, orders: 0, hours: 0, average: 0 },
    month: { total: 0, orders: 0, hours: 0, average: 0 },
  });
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  const periods = [
    { key: 'today', label: '今日' },
    { key: 'week', label: '本週' },
    { key: 'month', label: '本月' },
  ];

  // 載入收入資料
  useEffect(() => {
    // 使用模擬數據
    const mockData = mockDataService.getDriverMockData();
    setEarningsData(mockData.earningsData);
    setRecentEarnings(mockData.recentEarnings);
  }, []);

  const loadEarningsData = async () => {
    setLoading(true);
    try {
      const driverId = state.user.driverInfo?.id;
      if (!driverId) {
        setEarningsData({
          today: { total: 0, orders: 0, hours: 0, average: 0 },
          week: { total: 0, orders: 0, hours: 0, average: 0 },
          month: { total: 0, orders: 0, hours: 0, average: 0 },
        });
        setRecentEarnings([]);
        return;
      }
      
      // 載入各期間收入統計
      const [todayData, weekData, monthData] = await Promise.all([
        driverService.getEarningsStats(driverId, 'today'),
        driverService.getEarningsStats(driverId, 'week'),
        driverService.getEarningsStats(driverId, 'month')
      ]);

      setEarningsData({
        today: todayData.success ? todayData.data : { total: 0, orders: 0, hours: 0, average: 0 },
        week: weekData.success ? weekData.data : { total: 0, orders: 0, hours: 0, average: 0 },
        month: monthData.success ? monthData.data : { total: 0, orders: 0, hours: 0, average: 0 },
      });

      // 設置最近收入記錄
      if (todayData.success && todayData.data?.records) {
        const formattedRecords = todayData.data.records.slice(0, 4).map(record => ({
          id: record.ride_id || record.id,
          date: new Date(record.processed_at || record.created_at).toLocaleString('zh-TW', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          customer: '客戶',
          amount: record.driver_earnings || record.amount,
          status: record.status
        }));
        setRecentEarnings(formattedRecords);
      } else {
        setRecentEarnings([]);
      }
    } catch (error) {
      console.error('載入收入資料錯誤:', error);
      setEarningsData({
        today: { total: 0, orders: 0, hours: 0, average: 0 },
        week: { total: 0, orders: 0, hours: 0, average: 0 },
        month: { total: 0, orders: 0, hours: 0, average: 0 },
      });
      setRecentEarnings([]);
    } finally {
      setLoading(false);
    }
  };

  const currentData = earningsData[selectedPeriod as keyof typeof earningsData];

  // 申請提現
  const handleWithdrawal = () => {
    const availableAmount = currentData?.net_amount || currentData?.total || 0;
    if (availableAmount < 500) {
      Alert.alert('提現失敗', '最低提現金額為 NT$500');
      return;
    }
    
    Alert.alert(
      '申請提現',
      `可提現金額: NT$${availableAmount.toLocaleString()}\n手續費: NT$15\n實際到帳: NT$${(availableAmount - 15).toLocaleString()}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '確認提現', 
          onPress: async () => {
            try {
              const driverId = state.user.driverInfo?.id;
              if (!driverId) {
                Alert.alert('錯誤', '用戶資訊不完整');
                return;
              }
              
              const jkopayAccount = state.user.driverInfo?.jkopay_account || '0982214855';
              const jkopayName = state.user.driverInfo?.jkopay_name || state.user.driverInfo?.full_name || '司機';
              
              const result = await earningsService.requestWithdrawal(driverId, availableAmount, jkopayAccount, jkopayName);
              
              if (result.success) {
                Alert.alert(
                  '提現申請已提交',
                  `✅ 申請金額：NT$${availableAmount.toLocaleString()}\n💰 手續費：NT$15\n📅 預計到帳：1-3個工作天\n🏦 轉帳帳號：${jkopayAccount}\n\n您可以在「個人中心」查看提現進度`,
                  [{ text: '確定' }]
                );
                await loadEarningsData();
              } else {
                Alert.alert('提現失敗', result.error || '請稍後再試');
              }
            } catch (error) {
              Alert.alert('提現失敗', '請稍後再試');
            }
          }
        }
      ]
    );
  };

  // 下載帳單
  const handleDownloadBill = () => {
    const periodLabel = periods.find(p => p.key === selectedPeriod)?.label;
    const amount = currentData?.total || 0;
    
    // 模擬下載帳單
    Alert.alert('下載帳單', '正在生成帳單...', [{ text: '確定' }]);
    
    setTimeout(() => {
      Alert.alert(
        '下載完成',
        `✅ ${periodLabel} 收入明細已保存\n\n檔案內容：\n• 總收入：NT$${amount.toLocaleString()}\n• 訂單數：${currentData?.orders || 0}\n• 工作時數：${(currentData?.hours || 0).toFixed(1)}小時\n• 平均單價：NT$${Math.round(currentData?.average || 0)}\n\n檔案已保存到下載資料夾`,
        [{ text: '確定' }]
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>收入總覽</Text>
        
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
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.mainStat}>
          <DollarSign size={32} color="#FFD700" />
          <Text style={styles.mainAmount}>NT${(currentData?.total || 0).toLocaleString()}</Text>
          <Text style={styles.mainLabel}>{periods.find(p => p.key === selectedPeriod)?.label}總收入</Text>
        </View>

        <View style={styles.subStats}>
          <View style={styles.subStat}>
            <Text style={styles.subStatNumber}>{currentData?.orders || 0}</Text>
            <Text style={styles.subStatLabel}>完成訂單</Text>
          </View>
          
          <View style={styles.subStat}>
            <Text style={styles.subStatNumber}>{(currentData?.hours || 0).toFixed(1)}h</Text>
            <Text style={styles.subStatLabel}>工作時數</Text>
          </View>
          
          <View style={styles.subStat}>
            <Text style={styles.subStatNumber}>NT${Math.round(currentData?.average || 0)}</Text>
            <Text style={styles.subStatLabel}>平均單價</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={handleWithdrawal}>
          <CreditCard size={24} color="#FFD700" />
          <Text style={styles.actionTitle}>申請轉帳</Text>
          <Text style={styles.actionSubtitle}>可轉帳金額 NT${(currentData?.total || 0).toLocaleString()}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard} onPress={handleDownloadBill}>
          <Download size={24} color="#FFD700" />
          <Text style={styles.actionTitle}>下載帳單</Text>
          <Text style={styles.actionSubtitle}>匯出收入明細</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.earningsHistory}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>收入明細</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={() => Alert.alert('查看全部', '功能開發中')}>
            <Eye size={16} color="#666" />
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>載入中...</Text>
        ) : recentEarnings.length > 0 ? (
          recentEarnings.map(earning => (
          <View key={earning.id} style={styles.earningItem}>
            <View style={styles.earningInfo}>
              <Text style={styles.earningId}>#{earning.id}</Text>
              <Text style={styles.earningCustomer}>{earning.customer}</Text>
              <Text style={styles.earningDate}>{earning.date}</Text>
            </View>
            
            <View style={styles.earningAmount}>
              <Text style={[
                styles.amountText,
                earning.status === 'pending' && styles.pendingAmount
              ]}>
                NT${Math.round(earning.amount)}
              </Text>
              <View style={[
                styles.statusDot,
                earning.status === 'completed' ? styles.paidDot : styles.pendingDot
              ]} />
            </View>
          </View>
          ))
        ) : (
          <Text style={styles.noDataText}>暫無收入記錄</Text>
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#333',
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
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#000',
  },
  statsContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainStat: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subStatLabel: {
    color: '#666',
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    margin: 12,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  actionTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  actionSubtitle: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  earningsHistory: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 3,
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  earningInfo: {
    flex: 1,
  },
  earningId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  earningCustomer: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  earningDate: {
    fontSize: 11,
    color: '#999',
  },
  earningAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759',
    marginRight: 6,
  },
  pendingAmount: {
    color: '#FF9500',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  paidDot: {
    backgroundColor: '#34C759',
  },
  pendingDot: {
    backgroundColor: '#FF9500',
  },
  bottomSpacing: {
    height: 80,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
    fontSize: 14,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
    fontSize: 14,
  },
});