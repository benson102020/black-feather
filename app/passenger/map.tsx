import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MapPin, Navigation, Phone, Car, Clock, Star, Zap } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PassengerMapScreen() {
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [userLocation, setUserLocation] = useState({
    latitude: 25.0330,
    longitude: 121.5654,
    address: '台北市中正區'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNearbyDrivers();
  }, []);

  const loadNearbyDrivers = async () => {
    setLoading(true);
    try {
      // 模擬載入附近司機
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNearbyDrivers([
        {
          id: 'driver-001',
          name: '張司機',
          rating: 4.8,
          distance: 1.2,
          eta: 5,
          latitude: 25.0340,
          longitude: 121.5665,
          vehicle: {
            make: 'Toyota',
            model: 'Vios',
            plate: 'ABC-1234',
            color: '白色'
          },
          status: 'online',
          totalTrips: 1240
        },
        {
          id: 'driver-002',
          name: '李司機',
          rating: 4.6,
          distance: 2.1,
          eta: 8,
          latitude: 25.0310,
          longitude: 121.5640,
          vehicle: {
            make: 'Honda',
            model: 'City',
            plate: 'DEF-5678',
            color: '銀色'
          },
          status: 'online',
          totalTrips: 856
        },
        {
          id: 'driver-003',
          name: '王司機',
          rating: 4.9,
          distance: 0.8,
          eta: 3,
          latitude: 25.0350,
          longitude: 121.5680,
          vehicle: {
            make: 'Nissan',
            model: 'Sentra',
            plate: 'GHI-9012',
            color: '黑色'
          },
          status: 'online',
          totalTrips: 2156
        }
      ]);
    } catch (error) {
      console.error('載入司機資料錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallDriver = (driver: any) => {
    Alert.alert(
      '聯絡司機',
      `撥打電話給：${driver.name}\n車輛：${driver.vehicle.make} ${driver.vehicle.model}\n車牌：${driver.vehicle.plate}\n評分：⭐ ${driver.rating}`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '撥打電話', 
          onPress: () => Alert.alert('撥打電話', `正在撥打給 ${driver.name}...`)
        }
      ]
    );
  };

  const handleBookDriver = (driver: any) => {
    Alert.alert(
      '預約司機',
      `確定要預約 ${driver.name} 嗎？\n\n司機資訊：\n⭐ 評分：${driver.rating}\n📍 距離：${driver.distance}km\n⏰ 預計到達：${driver.eta}分鐘\n🚗 車輛：${driver.vehicle.make} ${driver.vehicle.model}\n🏷️ 車牌：${driver.vehicle.plate}\n📊 完成行程：${driver.totalTrips}次`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '確定預約', 
          onPress: () => {
            Alert.alert(
              '預約成功！',
              `✅ 已成功預約 ${driver.name}\n\n司機將在 ${driver.eta} 分鐘內到達您的位置\n\n您可以在「我的訂單」中查看詳情`,
              [
                { text: '查看訂單', onPress: () => router.push('/passenger/orders') },
                { text: '確定' }
              ]
            );
          }
        }
      ]
    );
  };

  const handleRefresh = () => {
    loadNearbyDrivers();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/passenger')}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>附近司機</Text>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshText}>刷新</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* 模擬地圖區域 */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color="#FFD700" />
          <Text style={styles.mapText}>即時地圖顯示</Text>
          <Text style={styles.mapSubtext}>📍 您的位置：{userLocation.address}</Text>
          <Text style={styles.mapDriverCount}>🚗 找到 {nearbyDrivers.length} 位附近司機</Text>
          
          {/* 模擬司機位置點 */}
          <View style={styles.driverDots}>
            {nearbyDrivers.slice(0, 3).map((driver, index) => (
              <View 
                key={driver.id} 
                style={[
                  styles.driverDot,
                  { 
                    left: 50 + (index * 30) + '%',
                    top: 40 + (index * 20) + '%'
                  }
                ]}
              >
                <Car size={16} color="#000" />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 司機列表 */}
      <View style={styles.driversSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>附近司機</Text>
          {loading && <Text style={styles.loadingText}>載入中...</Text>}
        </View>
        
        <ScrollView style={styles.driversList}>
          {nearbyDrivers.map(driver => (
            <View key={driver.id} style={styles.driverCard}>
              <View style={styles.driverInfo}>
                <View style={styles.driverHeader}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>{driver.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.vehicleInfo}>
                  🚗 {driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.plate})
                </Text>
                
                <Text style={styles.vehicleColor}>
                  🎨 {driver.vehicle.color}
                </Text>
                
                <View style={styles.driverMeta}>
                  <View style={styles.distanceInfo}>
                    <Navigation size={14} color="#666" />
                    <Text style={styles.distanceText}>{driver.distance}km</Text>
                  </View>
                  
                  <View style={styles.etaInfo}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.etaText}>{driver.eta}分鐘到達</Text>
                  </View>
                  
                  <View style={styles.tripsInfo}>
                    <Zap size={14} color="#666" />
                    <Text style={styles.tripsText}>{driver.totalTrips}次</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.driverActions}>
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleCallDriver(driver)}
                >
                  <Phone size={16} color="#007AFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => handleBookDriver(driver)}
                >
                  <Text style={styles.bookButtonText}>預約</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
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
  },
  refreshButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    height: 250,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
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
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  mapDriverCount: {
    fontSize: 12,
    color: '#FFD700',
    marginTop: 8,
    fontWeight: '600',
  },
  driverDots: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  driverDot: {
    position: 'absolute',
    width: 32,
    height: 32,
    backgroundColor: '#FFD700',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  driversSection: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  loadingText: {
    fontSize: 14,
    color: '#FFD700',
  },
  driversList: {
    maxHeight: 300,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  vehicleColor: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  driverMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  etaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  tripsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  driverActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  bookButton: {
    backgroundColor: '#FFD700',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
});