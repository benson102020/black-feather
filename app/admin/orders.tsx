import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, ArrowLeft, User, Car } from 'lucide-react-native';
import { router } from 'expo-router';
import { adminService } from '../../services/admin';

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待接單' },
    { key: 'in_progress', label: '進行中' },
    { key: 'completed', label: '已完成' },
    { key: 'cancelled', label: '已取消' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const result = await adminService.getAllOrders();
      if (result.success) {
        // 格式化訂單數據
        const formattedOrders = result.data.map(order => ({
          id: order.id,
          status: order.status,
          passenger: { 
            name: order.passenger?.full_name || '未知乘客', 
            phone: order.passenger?.phone_number || '未提供' 
          },
          driver: order.driver ? { 
            name: order.driver.full_name, 
            phone: order.driver.phone_number 
          } : null,
          pickup: order.pickup_address,
          dropoff: order.dropoff_address,
          fare: order.total_fare,
          distance: order.distance_km,
          createdAt: order.requested_at
        }));
        setOrders(formattedOrders);
      } else {
        console.error('載入訂單失敗:', result.error);
        setOrders([]);
      }
    } catch (error) {
      console.error('載入訂單錯誤:', error);
      setOrders([]);
    }
  };

  const statusMap = {
    pending: { text: '待接單', color: '#FF9500' },
    accepted: { text: '已接單', color: '#007AFF' },
    in_progress: { text: '進行中', color: '#34C759' },
    completed: { text: '已完成', color: '#666666' },
    cancelled: { text: '已取消', color: '#FF3B30' }
  };

  const filteredOrders = orders.filter(order => 
    (selectedFilter === 'all' || order.status === selectedFilter) &&
    (searchText === '' || 
     order.id.toLowerCase().includes(searchText.toLowerCase()) ||
     order.passenger.name.includes(searchText))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/admin')}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>訂單管理</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋訂單編號或乘客姓名"
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
        {filteredOrders.map(order => (
          <View key={order.id} style={styles.orderCard}>
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

            <View style={styles.participantsInfo}>
              <View style={styles.participantRow}>
                <User size={16} color="#007AFF" />
                <Text style={styles.participantText}>
                  乘客：{order.passenger.name} ({order.passenger.phone})
                </Text>
              </View>
              {order.driver && (
                <View style={styles.participantRow}>
                  <Car size={16} color="#FFD700" />
                  <Text style={styles.participantText}>
                    司機：{order.driver.name} ({order.driver.phone})
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routeRow}>
                <MapPin size={16} color="#FFD700" />
                <Text style={styles.routeText}>{order.pickup}</Text>
              </View>
              <View style={styles.routeRow}>
                <MapPin size={16} color="#FF4444" />
                <Text style={styles.routeText}>{order.dropoff}</Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.fareContainer}>
                <DollarSign size={16} color="#34C759" />
                <Text style={styles.fareText}>NT${order.fare}</Text>
              </View>
              <Text style={styles.distanceText}>{order.distance}km</Text>
              <Text style={styles.timeText}>
                {new Date(order.createdAt).toLocaleTimeString('zh-TW')}
              </Text>
            </View>
          </View>
        ))}
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
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  controls: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
  },
  ordersList: {
    flex: 1,
    padding: 16,
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
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  participantsInfo: {
    marginBottom: 12,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  participantText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  distanceText: {
    color: '#666',
    fontSize: 14,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
});