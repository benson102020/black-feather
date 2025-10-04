import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Phone, ArrowLeft, Navigation, Star, Car } from 'lucide-react-native';
import { router } from 'expo-router';
import { passengerService } from '../../services/passenger';

export default function PassengerOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const passengerId = 'current-passenger-id'; // 需要從登入狀態獲取
      const result = await passengerService.getPassengerOrders(passengerId);
      
      if (result.success) {
        // 格式化訂單數據
        const formattedOrders = result.data.map(order => ({
          id: order.id,
          status: order.status,
          pickup: order.pickup_address,
          dropoff: order.dropoff_address,
          fare: order.total_fare,
          distance: order.distance_km,
          duration: order.duration_minutes,
          driver: order.driver ? {
            name: order.driver.full_name,
            phone: order.driver.phone_number,
            rating: order.driver.rating || 5.0,
            vehicle: order.vehicles?.[0] ? 
              `${order.vehicles[0].make} ${order.vehicles[0].model} (${order.vehicles[0].license_plate})` :
              '車輛資訊未提供'
          } : null,
          createdAt: order.requested_at,
          completedAt: order.completed_at,
          cancelledAt: order.cancelled_at,
          cancellationReason: order.cancellation_reason
        }));
        setOrders(formattedOrders);
      } else {
        console.error('載入訂單失敗:', result.error);
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
    pending: { text: '尋找司機', color: '#FF9500', icon: Clock },
    accepted: { text: '司機已接單', color: '#007AFF', icon: Car },
    driver_arriving: { text: '司機前往中', color: '#007AFF', icon: Navigation },
    driver_arrived: { text: '司機已到達', color: '#FF9500', icon: MapPin },
    in_progress: { text: '行程進行中', color: '#34C759', icon: Car },
    completed: { text: '已完成', color: '#666666', icon: Clock },
    cancelled: { text: '已取消', color: '#FF3B30', icon: Clock }
  };

  const handleCallDriver = (driver: any) => {
    Alert.alert(
      '聯絡司機',
      `司機：${driver.name}\n車輛：${driver.vehicle}\n評分：⭐ ${driver.rating}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '撥打電話', 
          onPress: () => Alert.alert('撥打電話', `正在撥打 ${driver.phone}...`)
        }
      ]
    );
  };

  const handleTrackOrder = (order: any) => {
    if (order.status === 'in_progress') {
      Alert.alert(
        '追蹤訂單',
        `訂單 #${order.id}\n\n司機：${order.driver?.name || '張司機'}\n車輛：${order.driver?.vehicle || 'Toyota Vios (ABC-1234)'}\n狀態：${statusMap[order.status].text}\n\n您可以即時追蹤司機位置`,
        [
          { text: '確定' },
          { text: '開始追蹤', onPress: () => router.push('/passenger/tracking') },
          { text: '聯絡司機', onPress: () => Alert.alert('聯絡司機', '正在撥打司機電話...') }
        ]
      );
    } else {
      Alert.alert(
        '訂單詳情',
        `訂單 #${order.id}\n司機：${order.driver?.name || '張司機'}\n狀態：${statusMap[order.status].text}\n費用：NT$${Math.round(order.total_fare || order.fare || 0)}\n\n上車：${order.pickup || '台北車站'}\n下車：${order.dropoff || '松山機場'}\n\n完成時間：${order.completedAt ? new Date(order.completedAt).toLocaleString('zh-TW') : '進行中'}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/passenger')}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的訂單</Text>
      </View>

      <ScrollView style={styles.ordersList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入訂單中...</Text>
          </View>
        ) : (
          orders.map(order => {
            const StatusIcon = statusMap[order.status]?.icon || Clock;
            
            return (
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
                    <StatusIcon size={12} color="#fff" />
                    <Text style={styles.statusText}>
                      {statusMap[order.status].text}
                    </Text>
                  </View>
                </View>

                <View style={styles.routeInfo}>
                  <View style={styles.routeRow}>
                    <MapPin size={16} color="#FFD700" />
                    <Text style={styles.routeText}>{order.pickup}</Text>
                  </View>
                  <View style={styles.routeRow}>
                    <Navigation size={16} color="#FF4444" />
                    <Text style={styles.routeText}>{order.dropoff}</Text>
                  </View>
                </View>

                {order.driver && (
                  <View style={styles.driverInfo}>
                    <View style={styles.driverHeader}>
                      <Text style={styles.driverName}>司機：{order.driver.name}</Text>
                      <View style={styles.ratingContainer}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.driverRating}>{order.driver.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.driverVehicle}>{order.driver.vehicle}</Text>
                    <View style={styles.driverActions}>
                      {order.status === 'in_progress' && (
                        <>
                          <TouchableOpacity 
                            style={styles.callButton}
                            onPress={() => handleCallDriver(order.driver)}
                          >
                            <Phone size={16} color="#FFD700" />
                            <Text style={styles.callText}>聯絡司機</Text>
                          </TouchableOpacity>
                          <Text style={styles.estimatedArrival}>
                            預計到達：{order.estimatedArrival}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.orderFooter}>
                  <View style={styles.fareContainer}>
                    <DollarSign size={16} color="#34C759" />
                    <Text style={styles.fareText}>NT${order.fare}</Text>
                  </View>
                  <Text style={styles.distanceText}>
                    {order.distance}km · {order.duration}分鐘
                  </Text>
                  <Text style={styles.timeText}>
                    {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                  </Text>
                </View>

                {order.status === 'cancelled' && order.cancellationReason && (
                  <View style={styles.cancellationInfo}>
                    <Text style={styles.cancellationText}>
                      取消原因：{order.cancellationReason}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}

        {!loading && orders.length === 0 && (
          <View style={styles.emptyState}>
            <Car size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>暫無訂單記錄</Text>
            <Text style={styles.emptyText}>開始您的第一次叫車體驗吧！</Text>
            <TouchableOpacity 
              style={styles.bookNowButton}
              onPress={() => router.push('/passenger')}
            >
              <Text style={styles.bookNowText}>立即叫車</Text>
            </TouchableOpacity>
          </View>
        )}
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
  ordersList: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  routeInfo: {
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  driverInfo: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  driverRating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  driverVehicle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  callText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  estimatedArrival: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
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
    fontSize: 12,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
  cancellationInfo: {
    backgroundColor: '#fff0f0',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  cancellationText: {
    fontSize: 12,
    color: '#FF3B30',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  bookNowButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  bookNowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});