import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, ArrowLeft } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { orderService, getSupabaseClient } from '../../services/supabase';
import { router } from 'expo-router';
import { mockDataService } from '../../services/mock-data';

export default function OrdersScreen() {
  const { state } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 載入訂單
  useEffect(() => {
    // 使用模擬數據
    const mockData = mockDataService.getDriverMockData();
    const allOrders = [
      ...mockData.availableOrders.map(order => ({ ...order, status: 'pending' })),
      {
        id: 'RD20241225005',
        status: 'completed',
        pickup_address: '台北101',
        dropoff_address: '松山機場',
        total_fare: 420,
        distance_km: 18.5,
        duration_minutes: 35,
        requested_at: new Date(Date.now() - 3600000).toISOString(),
        users: { full_name: '劉先生', phone_number: '0945678901' }
      }
    ];
    setOrders(allOrders);
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const driverId = state.user.driverInfo?.id;
      if (!driverId) {
        setOrders([]);
        return;
      }
      
      const result = await orderService.getDriverOrders(driverId);
      
      if (result.success) {
        setOrders(result.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('載入訂單錯誤:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    pending: { text: '待確認', color: '#FF9500' },
    accepted: { text: '已接受', color: '#007AFF' },
    driver_arriving: { text: '前往中', color: '#007AFF' },
    driver_arrived: { text: '已到達', color: '#FF9500' },
    in_progress: { text: '行程中', color: '#34C759' },
    completed: { text: '已完成', color: '#34C759' },
    cancelled: { text: '已取消', color: '#FF3B30' }
  };

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'accepted', label: '已接受' },
    { key: 'in_progress', label: '進行中' },
    { key: 'completed', label: '已完成' }
  ];

  const handleTrackOrder = (order: any) => {
    if (order.status === 'accepted' || order.status === 'in_progress') {
      Alert.alert(
        '追蹤訂單',
        `訂單 #${order.id}\n\n客戶：${order.users?.full_name || '未知客戶'}\n狀態：${statusMap[order.status].text}\n\n您可以查看訂單詳情`,
        [
          { text: '確定' },
          { text: '查看詳情', onPress: () => Alert.alert('訂單詳情', `客戶：${order.users?.full_name}\n路線：${order.pickup_address} → ${order.dropoff_address}\n費用：NT$${Math.round(order.total_fare || 0)}`) }
        ]
      );
    } else {
      Alert.alert(
        '訂單詳情',
        `訂單 #${order.id}\n客戶：${order.users?.full_name || '未知客戶'}\n狀態：${statusMap[order.status].text}\n費用：NT$${Math.round(order.total_fare || 0)}\n路線：${order.pickup_address} → ${order.dropoff_address}`
      );
    }
  };

  const filteredOrders = orders.filter(order => 
    (selectedFilter === 'all' || order.status === selectedFilter) &&
    (searchText === '' || 
     order.id.toLowerCase().includes(searchText.toLowerCase()) ||
     order.users?.full_name?.includes(searchText))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>訂單管理</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋訂單編號或客戶姓名"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.ordersList}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        )}
        
        {filteredOrders.map(order => (
          <TouchableOpacity 
            key={order.id} 
            style={styles.orderCard}
            onPress={() => handleTrackOrder(order)}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{order.id}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: statusMap[order.status].color }
              ]}>
                <Text style={styles.statusText}>
                  {statusMap[order.status].text}
                </Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.users?.full_name || '未知客戶'}</Text>
              <View style={styles.timeContainer}>
                <Clock size={14} color="#666" />
                <Text style={styles.timeText}>
                  {new Date(order.requested_at || order.created_at).toLocaleTimeString('zh-TW', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <MapPin size={16} color="#FFD700" />
                <Text style={styles.locationText} numberOfLines={2}>
                  {order.pickup_address}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={16} color="#FF4444" />
                <Text style={styles.locationText} numberOfLines={2}>
                  {order.dropoff_address}
                </Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.feeContainer}>
                <DollarSign size={16} color="#34C759" />
                <Text style={styles.feeText}>NT${Math.round(order.total_fare || 0)}</Text>
              </View>
              {(order.status === 'accepted' || order.status === 'in_progress') && (
                <TouchableOpacity 
                  style={styles.trackButton}
                  onPress={() => router.push('/passenger/tracking')}
                >
                  <MapPin size={14} color="#007AFF" />
                  <Text style={styles.trackButtonText}>追蹤</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.distanceText}>
                {order.distance_km?.toFixed(1) || '0'}km · {order.duration_minutes || 0}分鐘
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暫無符合條件的訂單</Text>
          </View>
        )}
        
        <View style={styles.bottomSpacing} />
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
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 6,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
  },
  filterText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
  },
  ordersList: {
    flex: 1,
    padding: 12,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 3,
  },
  locationInfo: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    flex: 1,
    marginLeft: 6,
    color: '#666',
    fontSize: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  distanceText: {
    color: '#666',
    fontSize: 12,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  trackButtonText: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 80,
  },
});