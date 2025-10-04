import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MapPin, Navigation, Phone, Car, Clock, User, Star, MessageSquare, DollarSign } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PassengerTrackingScreen() {
  const [driverLocation, setDriverLocation] = useState({ latitude: 25.0340, longitude: 121.5665 });
  const [eta, setEta] = useState(8);
  const [rideStatus, setRideStatus] = useState('driver_arriving');
  const [distance, setDistance] = useState(2.5);

  const currentRide = {
    id: 'RD20241225001',
    pickup: '台北車站',
    dropoff: '松山機場',
    fare: 350,
    driver: {
      name: '張司機',
      phone: '0912345678',
      rating: 4.8,
      vehicle: 'Toyota Vios',
      plate: 'ABC-1234'
    }
  };

  // 模擬司機位置實時更新
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0005,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0005
      }));
      
      setEta(prev => Math.max(prev - 0.2, 0));
      setDistance(prev => Math.max(prev - 0.1, 0));
      
      // 模擬狀態變化
      if (eta <= 1 && rideStatus === 'driver_arriving') {
        setRideStatus('driver_arrived');
        Alert.alert('司機已到達', '司機已到達您的位置，請準備上車');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [eta, rideStatus]);

  const statusMap = {
    driver_arriving: { text: '司機前往中', color: '#007AFF', icon: Car },
    driver_arrived: { text: '司機已到達', color: '#FF9500', icon: MapPin },
    in_progress: { text: '行程進行中', color: '#34C759', icon: Navigation },
    completed: { text: '行程已完成', color: '#666', icon: Clock }
  };

  const handleCallDriver = () => {
    if (currentRide && currentRide.driver) {
      Alert.alert(
        '聯絡司機',
        `司機：${currentRide.driver.name}\n車輛：${currentRide.driver.vehicle} (${currentRide.driver.plate})\n評分：⭐ ${currentRide.driver.rating}`,
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '撥打電話', 
            onPress: () => Alert.alert('撥打電話', `正在撥打 ${currentRide.driver.phone}...`)
          },
          {
            text: '發送訊息',
            onPress: () => Alert.alert('發送訊息', '已開啟與司機的對話')
          }
        ]
      );
    } else {
      Alert.alert('錯誤', '無法獲取司機資訊');
    }
  };

  const handleCancelRide = () => {
    Alert.alert(
      '取消叫車',
      '確定要取消這次叫車嗎？\n\n注意：司機已接單，取消可能產生費用',
      [
        { text: '不取消', style: 'cancel' },
        { 
          text: '確定取消', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('已取消', '您的叫車已取消，如有疑問請聯絡客服');
            router.back();
          }
        }
      ]
    );
  };

  const StatusIcon = statusMap[rideStatus]?.icon || Car;

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
        
        <Text style={styles.headerTitle}>追蹤司機</Text>
        
        <TouchableOpacity style={styles.callHeaderButton} onPress={handleCallDriver}>
          <Phone size={20} color="#FFD700" />
        </TouchableOpacity>
      </LinearGradient>

      {/* 司機資訊卡片 */}
      <View style={styles.driverCard}>
        <View style={styles.driverHeader}>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{currentRide.driver.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.driverRating}>{currentRide.driver.rating}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
            <Phone size={16} color="#000" />
            <Text style={styles.callButtonText}>聯絡</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.vehicleInfo}>
          🚗 {currentRide.driver.vehicle} ({currentRide.driver.plate})
        </Text>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusMap[rideStatus].color }]}>
            <StatusIcon size={16} color="#fff" />
            <Text style={styles.statusText}>{statusMap[rideStatus].text}</Text>
          </View>
          
          <View style={styles.etaContainer}>
            <Clock size={16} color="#34C759" />
            <Text style={styles.etaText}>
              {eta > 0 ? `預計 ${Math.ceil(eta)} 分鐘到達` : '即將到達'}
            </Text>
          </View>
        </View>
      </View>

      {/* 即時地圖追蹤 */}
      <View style={styles.trackingMap}>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color="#FFD700" />
            <Text style={styles.mapTitle}>即時追蹤</Text>
            <Text style={styles.mapSubtitle}>司機位置每3秒更新</Text>
            
            {/* 模擬司機位置點 */}
            <View style={[styles.driverDot, {
              top: `${30 + Math.sin(Date.now() / 1000) * 10}%`,
              left: `${60 + Math.cos(Date.now() / 1000) * 10}%`
            }]}>
              <Car size={20} color="#000" />
            </View>
            
            {/* 模擬用戶位置點 */}
            <View style={styles.userDot}>
              <User size={16} color="#fff" />
            </View>
            
            {/* 路線線條 */}
            <View style={styles.routeLine} />
            
            {/* 距離顯示 */}
            <View style={styles.distanceOverlay}>
              <Text style={styles.distanceText}>{distance.toFixed(1)}km</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.locationDetails}>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#FFD700" />
            <Text style={styles.locationText}>上車地點：{currentRide.pickup}</Text>
          </View>
          <View style={styles.locationRow}>
            <Navigation size={16} color="#FF4444" />
            <Text style={styles.locationText}>目的地：{currentRide.dropoff}</Text>
          </View>
          <View style={styles.locationRow}>
            <DollarSign size={16} color="#34C759" />
            <Text style={styles.locationText}>費用：NT${currentRide.fare}</Text>
          </View>
        </View>
      </View>

      {/* 操作按鈕 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.contactButton} onPress={handleCallDriver}>
          <Phone size={18} color="#000" />
          <Text style={styles.contactButtonText}>聯絡司機</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.messageButton} onPress={() => {
          Alert.alert('發送訊息', '已開啟與司機的對話');
        }}>
          <MessageSquare size={18} color="#000" />
          <Text style={styles.messageButtonText}>發訊息</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
      </View>

      {/* 司機動態更新 */}
      <View style={styles.updatesCard}>
        <Text style={styles.updatesTitle}>司機動態</Text>
        <View style={styles.updatesList}>
          <View style={styles.updateItem}>
            <View style={styles.updateDot} />
            <Text style={styles.updateText}>司機已接單，正在前往您的位置</Text>
            <Text style={styles.updateTime}>剛剛</Text>
          </View>
          <View style={styles.updateItem}>
            <View style={styles.updateDot} />
            <Text style={styles.updateText}>
              {eta > 0 ? `預計 ${Math.ceil(eta)} 分鐘後到達` : '司機即將到達'}
            </Text>
            <Text style={styles.updateTime}>即時更新</Text>
          </View>
          {eta <= 2 && (
            <View style={styles.updateItem}>
              <View style={[styles.updateDot, { backgroundColor: '#FF9500' }]} />
              <Text style={styles.updateText}>司機即將到達，請準備上車</Text>
              <Text style={styles.updateTime}>剛剛</Text>
            </View>
          )}
        </View>
      </View>
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
    textAlign: 'center',
  },
  callHeaderButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 8,
  },
  driverCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverRating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  callButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759',
    marginLeft: 4,
  },
  trackingMap: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  mapContainer: {
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    position: 'relative',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  driverDot: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  userDot: {
    position: 'absolute',
    bottom: '20%',
    left: '40%',
    width: 32,
    height: 32,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  routeLine: {
    position: 'absolute',
    top: '35%',
    left: '45%',
    width: 80,
    height: 2,
    backgroundColor: '#FFD700',
    transform: [{ rotate: '45deg' }],
  },
  distanceOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationDetails: {
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    margin: 16,
    gap: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 4,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 4,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  updatesCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  updatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  updatesList: {
    gap: 8,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  updateDot: {
    width: 8,
    height: 8,
    backgroundColor: '#34C759',
    borderRadius: 4,
    marginRight: 12,
  },
  updateText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
  },
});