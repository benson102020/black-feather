import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Power, Navigation, MapPin, Clock, Phone, AlertTriangle, Camera, RefreshCw, ArrowLeft } from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { orderService, getSupabaseClient, driverService } from '../../services/supabase';
import { router } from 'expo-router';
import { mockDataService } from '../../services/mock-data';

export default function WorkspaceScreen() {
  const { state, actions } = useApp();
  const { driver } = state;
  const isOnline = driver.status === 'online' || driver.status === 'busy';
  const currentOrder = driver.currentOrder;
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // 模擬數據
  useEffect(() => {
    // 設置模擬可接訂單
    if (isOnline && !currentOrder) {
      setAvailableOrders([
        {
          id: 'RD20241225001',
          pickup_address: '台北車站',
          dropoff_address: '松山機場',
          total_fare: 350,
          distance_km: 12.5,
          duration_minutes: 25,
          users: { full_name: '王先生', phone_number: '0987654321' }
        },
        {
          id: 'RD20241225002',
          pickup_address: '信義區市政府',
          dropoff_address: '內湖科技園區',
          total_fare: 280,
          distance_km: 8.3,
          duration_minutes: 18,
          users: { full_name: '李小姐', phone_number: '0912345678' }
        }
      ]);
    }
    
    // 設置模擬公告
    setAnnouncements([
      {
        id: 'ann-001',
        title: '系統維護通知',
        content: '今晚 23:00-01:00 系統維護，請提前完成訂單',
        type: 'warning'
      }
    ]);
  }, [isOnline, currentOrder]);

  // 載入可接訂單
  useEffect(() => {
    if (isOnline && !currentOrder) {
      loadAvailableOrders();
    }
  }, [isOnline, currentOrder]);

  // 載入公告
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        setAnnouncements([]);
        return;
      }

      const { data, error } = await client
        .from('system_announcements')
        .select('*')
        .eq('is_active', true)
        .eq('target_audience', 'drivers')
        .or('target_audience.eq.all')
        .order('priority', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('載入公告錯誤:', error);
      setAnnouncements([]);
    }
  };

  const loadAvailableOrders = async () => {
    try {
      setLoading(true);
      const driverId = state.user.driverInfo?.id;
      if (!driverId) {
        setAvailableOrders([]);
        return;
      }
      
      const result = await orderService.getAvailableOrders(driverId);
      
      if (result.success) {
        setAvailableOrders(result.data || []);
      } else {
        setAvailableOrders([]);
      }
    } catch (error) {
      console.error('載入可接訂單錯誤:', error);
      setAvailableOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAvailableOrders();
    await loadAnnouncements();
    setRefreshing(false);
  };

  const statusMap = {
    pickup_going: '前往提貨',
    pickup_arrived: '到達提貨',
    pickup_completed: '提貨完成',
    delivery_going: '前往卸貨',
    delivery_arrived: '到達卸貨',
    delivery_completed: '卸貨完成'
  };

  const handleStatusChange = () => {
    if (currentOrder) {
      const statuses = Object.keys(statusMap);
      const currentIndex = statuses.indexOf(currentOrder.status);
      const nextStatus = statuses[currentIndex + 1];
      
      if (nextStatus) {
        actions.updateOrderStatus(currentOrder.id, nextStatus);
        Alert.alert('狀態更新', `已更新為：${statusMap[nextStatus as keyof typeof statusMap]}`);
      } else {
        actions.updateOrderStatus(currentOrder.id, 'completed');
        Alert.alert('訂單完成', '恭喜完成本次訂單！');
      }
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setLoading(true);
      const driverId = state.user.driverInfo?.id;
      if (!driverId) {
        Alert.alert('錯誤', '用戶資訊不完整');
        return;
      }
      
      const result = await orderService.acceptOrder(orderId, driverId);
      
      if (result.success) {
        actions.setCurrentOrder(result.data);
        await actions.updateDriverStatus('busy');
        Alert.alert('接單成功', '已成功接受訂單');
        await loadAvailableOrders();
      } else {
        Alert.alert('接單失敗', result.error || '請稍後再試');
      }
    } catch (error) {
      console.error('接單錯誤:', error);
      Alert.alert('接單失敗', '請稍後再試');
    } finally {
      setLoading(false);
    }
  };
  const handleToggleOnline = async () => {
    const newStatus = isOnline ? 'offline' : 'online';
    try {
      await actions.updateDriverStatus(newStatus);
      if (newStatus === 'online') {
        await loadAvailableOrders();
      }
    } catch (error) {
      Alert.alert('狀態更新失敗', '請稍後再試');
    }
  };

  const handleNavigation = () => {
    if (currentOrder) {
      Alert.alert(
        '導航',
        `選擇導航方式：\n\n目的地：${currentOrder.pickup_address}\n距離：約 ${currentOrder.distance_km || 0}km`,
        [
          { text: '取消', style: 'cancel' },
          { text: 'Google Maps', onPress: () => Alert.alert('Google Maps', '正在打開 Google Maps 導航...') },
          { text: 'Apple Maps', onPress: () => Alert.alert('Apple Maps', '正在打開 Apple Maps 導航...') },
          { text: '內建導航', onPress: () => Alert.alert('內建導航', '正在啟動內建導航系統...') }
        ]
      );
    }
  };

  const handleContactCustomer = () => {
    if (currentOrder) {
      const customerName = currentOrder.users?.full_name || currentOrder.customer_name || '客戶';
      const customerPhone = currentOrder.users?.phone_number || currentOrder.customer_phone || '未提供';
      
      Alert.alert(
        '聯絡客戶',
        `客戶：${customerName}\n電話：${customerPhone}`,
        [
          { text: '取消', style: 'cancel' },
          { text: '撥打電話', onPress: () => Alert.alert('撥打電話', `正在撥打 ${customerPhone}...`) },
          { text: '發送訊息', onPress: () => router.push('/(tabs)/messages') }
        ]
      );
    }
  };

  const handleTakePhoto = () => {
    if (currentOrder) {
      const photoTypes = {
        pickup_going: '出發照片',
        pickup_arrived: '到達提貨點照片',
        pickup_completed: '提貨完成照片',
        delivery_going: '運送中照片',
        delivery_arrived: '到達目的地照片',
        delivery_completed: '送達完成照片'
      };
      
      const photoType = photoTypes[currentOrder.status] || '記錄照片';
      
      Alert.alert(
        '拍照記錄',
        `拍攝 ${photoType}`,
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '拍照', 
            onPress: () => {
              Alert.alert('拍照成功', `${photoType} 已保存\n\n照片將作為訂單完成的證明，並自動上傳到系統。`);
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Black feather</Text>
            <Text style={styles.logoSubtext}>歡迎回來，開始今日工作</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.onlineToggle, isOnline && styles.onlineActive]}
            onPress={handleToggleOnline}
            disabled={loading}
          >
            <Power size={20} color={isOnline ? '#000' : '#FFD700'} />
            <Text style={[styles.toggleText, isOnline && styles.toggleTextActive]}>
              {isOnline ? '在線中' : '離線中'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={20} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {isOnline && currentOrder && (
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>訂單 #{currentOrder.id}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {statusMap[currentOrder.status as keyof typeof statusMap]}
              </Text>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <MapPin size={16} color="#FFD700" />
              <Text style={styles.locationText}>提貨: {currentOrder.pickup_address}</Text>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={16} color="#FF4444" />
              <Text style={styles.locationText}>卸貨: {currentOrder.dropoff_address}</Text>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>客戶</Text>
              <Text style={styles.detailValue}>{currentOrder.customer_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>預計時間</Text>
              <Text style={styles.detailValue}>{currentOrder.duration_minutes || '未設定'}分鐘</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>費用</Text>
              <Text style={styles.detailValue}>NT${currentOrder.calculated_fare || currentOrder.total_fare}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleNavigation}>
              <Navigation size={18} color="#000" />
              <Text style={styles.actionButtonText}>導航</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleContactCustomer}>
              <Phone size={18} color="#000" />
              <Text style={styles.actionButtonText}>聯絡</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
              <Camera size={18} color="#000" />
              <Text style={styles.actionButtonText}>拍照</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.statusButton} onPress={handleStatusChange}>
            <Text style={styles.statusButtonText}>更新狀態</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 系統公告 */}
      {announcements.length > 0 && (
        <View style={styles.announcementsSection}>
          <Text style={styles.sectionTitle}>系統公告</Text>
          {announcements.map((announcement) => (
            <View key={announcement.id} style={[
              styles.announcementCard,
              { borderLeftColor: getAnnouncementColor(announcement.type) }
            ]}>
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementContent}>{announcement.content}</Text>
            </View>
          ))}
        </View>
      )}

      {isOnline && !currentOrder && (
        <View style={styles.availableOrdersSection}>
          <Text style={styles.sectionTitle}>可接訂單</Text>
          {loading ? (
            <Text style={styles.loadingText}>載入中...</Text>
          ) : availableOrders.length > 0 ? (
            availableOrders.slice(0, 3).map((order: any) => (
              <View key={order.id} style={styles.availableOrderCard}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderCustomer}>{order.users?.full_name}</Text>
                  <Text style={styles.orderRoute}>
                    {order.pickup_address} → {order.dropoff_address}
                  </Text>
                  <Text style={styles.orderFee}>NT${Math.round(order.total_fare)}</Text>
                  <Text style={styles.orderDistance}>{order.distance_km?.toFixed(1)}km · {order.duration_minutes}分鐘</Text>
                </View>
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleAcceptOrder(order.id)}
                  disabled={loading}
                >
                  <Text style={styles.acceptButtonText}>接單</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noOrdersText}>暫無可接訂單</Text>
          )}
        </View>
      )}
      {!isOnline && (
        <View style={styles.offlineCard}>
          <Power size={48} color="#666" />
          <Text style={styles.offlineTitle}>目前離線中</Text>
          <Text style={styles.offlineText}>點擊上方開關開始接單</Text>
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/passenger/support')}>
          <Phone size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>客服中心</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('回報異常', '功能開發中，請聯絡客服')}>
          <AlertTriangle size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>回報異常</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction} onPress={() => {
          const todayEarnings = state.earnings?.today?.total || 0;
          Alert.alert('今日收入', `NT$${todayEarnings.toLocaleString()}`);
        }}>
          <Clock size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>今日收入</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 獲取公告顏色
  function getAnnouncementColor(type: string) {
    switch (type) {
      case 'warning': return '#FF9500';
      case 'error': return '#FF3B30';
      case 'success': return '#34C759';
      default: return '#FFD700';
    }
  }
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flex: 1,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  logoSubtext: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 2,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  onlineActive: {
    backgroundColor: '#FFD700',
  },
  toggleText: {
    color: '#FFD700',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 13,
  },
  toggleTextActive: {
    color: '#000',
  },
  refreshButton: {
    marginLeft: 6,
    padding: 4,
  },
  orderCard: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 11,
  },
  locationInfo: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  locationText: {
    marginLeft: 4,
    flex: 1,
    color: '#333',
    fontSize: 12,
    lineHeight: 16,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    color: '#666',
    fontSize: 12,
  },
  detailValue: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#000',
    marginLeft: 2,
    fontWeight: '600',
    fontSize: 11,
  },
  statusButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
  },
  availableOrdersSection: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 12,
    fontSize: 13,
  },
  noOrdersText: {
    textAlign: 'center',
    color: '#666',
    padding: 12,
    fontSize: 13,
  },
  availableOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  orderInfo: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  orderRoute: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  orderFee: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#34C759',
  },
  acceptButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  acceptButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 11,
  },
  orderDistance: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  offlineCard: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  offlineTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  offlineText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 12,
    marginBottom: 90,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 2,
  },
  quickActionText: {
    color: '#FFD700',
    fontSize: 9,
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  announcementsSection: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  announcementCard: {
    borderLeftWidth: 4,
    paddingLeft: 6,
    paddingVertical: 4,
    marginBottom: 4,
  },
  announcementTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  announcementContent: {
    fontSize: 10,
    color: '#666',
    lineHeight: 12,
  },
});