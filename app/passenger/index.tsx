import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Navigation, Clock, DollarSign, User, Phone, ArrowLeft, Map, Car, Star, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { passengerService } from '../../services/passenger';

export default function PassengerHomeScreen() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);

  // 模擬地址建議
  const addressSuggestions = [
    '台北車站',
    '松山機場',
    '桃園機場',
    '信義區市政府',
    '內湖科技園區',
    '台北101',
    '西門町',
    '士林夜市'
  ];

  // 計算預估費用
  useEffect(() => {
    if (pickupAddress && dropoffAddress) {
      // 模擬距離計算
      const distance = Math.random() * 15 + 5; // 5-20km
      const baseFare = 85;
      const distanceFare = distance * 12;
      const timeFare = (distance * 2.5) * 2.5;
      setEstimatedFare(Math.round(baseFare + distanceFare + timeFare));
    }
  }, [pickupAddress, dropoffAddress]);

  const handleBookRide = async () => {
    if (!pickupAddress || !dropoffAddress) {
      Alert.alert('錯誤', '請填寫上車和下車地點');
      return;
    }

    setLoading(true);
    
    try {
      // 計算距離和費用
      const distance = Math.random() * 15 + 5; // 5-20km
      const duration = Math.ceil(distance * 2.5); // 每公里2.5分鐘
      const baseFare = 85;
      const distanceFare = distance * 12;
      const timeFare = duration * 2.5;
      const totalFare = baseFare + distanceFare + timeFare;

      const rideData = {
        passenger_id: 'test-passenger-001', // 使用測試乘客 ID
        pickup_address: pickupAddress,
        pickup_latitude: 25.0478, // 實際應用中需要地址轉座標
        pickup_longitude: 121.5170,
        dropoff_address: dropoffAddress,
        dropoff_latitude: 25.0697,
        dropoff_longitude: 121.5522,
        distance_km: distance,
        duration_minutes: duration,
        base_fare: baseFare,
        distance_fare: distanceFare,
        time_fare: timeFare,
        total_fare: totalFare
      };

      const result = await passengerService.createRide(rideData);
      
      if (result.success) {
        Alert.alert(
          '叫車成功！',
          `訂單編號：${result.data.id}\n預估費用：NT${Math.round(totalFare)}\n\n正在為您尋找司機...`,
          [
            { text: '追蹤司機', onPress: () => router.push('/passenger/tracking') },
            { text: '確定' }
          ]
        );
        
        // 清空地址
        setPickupAddress('');
        setDropoffAddress('');
        setEstimatedFare(0);
      } else {
        if (result.error?.includes('schema cache') || result.error?.includes('column')) {
          Alert.alert(
            '資料庫設置問題',
            '請先執行資料庫遷移：\n\n1. 點擊角色選擇頁面的「📋 資料庫設置」\n2. 複製 SQL 內容\n3. 在 Supabase SQL Editor 中執行\n4. 重新整理應用程式',
            [
              { text: '前往設置', onPress: () => router.push('/database-migration') },
              { text: '確定' }
            ]
          );
        } else {
          Alert.alert('叫車失敗', result.error || '請稍後再試');
        }
      }
    } catch (error) {
      console.error('叫車錯誤:', error);
      Alert.alert(
        '叫車失敗', 
        '請檢查網路連接或稍後再試\n\n如果問題持續，請執行資料庫遷移'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddress = (address: string) => {
    if (!pickupAddress) {
      setPickupAddress(address);
    } else if (!dropoffAddress) {
      setDropoffAddress(address);
    } else {
      Alert.alert(
        '選擇地點',
        `要將 "${address}" 設為：`,
        [
          { text: '取消', style: 'cancel' },
          { text: '上車地點', onPress: () => setPickupAddress(address) },
          { text: '下車地點', onPress: () => setDropoffAddress(address) }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Black feather</Text>
          <Text style={styles.headerSubtitle}>您的專屬叫車服務</Text>
        </View>
      </LinearGradient>

      <View style={styles.bookingCard}>
        <Text style={styles.cardTitle}>立即叫車</Text>
        
        <View style={styles.addressContainer}>
          <View style={styles.addressInput}>
            <MapPin size={20} color="#FFD700" />
            <TextInput
              style={styles.input}
              placeholder="上車地點"
              value={pickupAddress}
              onChangeText={setPickupAddress}
            />
            {pickupAddress ? (
              <TouchableOpacity onPress={() => setPickupAddress('')}>
                <Text style={styles.clearButton}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          
          <View style={styles.addressInput}>
            <Navigation size={20} color="#FF4444" />
            <TextInput
              style={styles.input}
              placeholder="下車地點"
              value={dropoffAddress}
              onChangeText={setDropoffAddress}
            />
            {dropoffAddress ? (
              <TouchableOpacity onPress={() => setDropoffAddress('')}>
                <Text style={styles.clearButton}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {estimatedFare > 0 && (
          <View style={styles.fareEstimate}>
            <DollarSign size={20} color="#34C759" />
            <Text style={styles.fareText}>預估費用：NT${estimatedFare}</Text>
            <Text style={styles.fareNote}>實際費用以行程結束為準</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBookRide}
          disabled={loading || !pickupAddress || !dropoffAddress}
        >
          <Car size={20} color="#000" />
          <Text style={styles.bookButtonText}>
            {loading ? '安排司機中...' : '立即叫車'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickAddresses}>
        <Text style={styles.quickTitle}>常用地點</Text>
        <View style={styles.addressGrid}>
          {addressSuggestions.map((address, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAddress}
              onPress={() => handleQuickAddress(address)}
            >
              <Text style={styles.quickAddressText}>{address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => router.push('/passenger/orders')}
        >
          <Clock size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>我的訂單</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => router.push('/passenger/support')}
        >
          <Phone size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>客服中心</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => router.push('/passenger/map')}
        >
          <Map size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>附近司機</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceInfo}>
        <Text style={styles.serviceTitle}>服務特色</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Zap size={16} color="#FFD700" />
            <Text style={styles.featureText}>24小時服務</Text>
          </View>
          <View style={styles.featureItem}>
            <Star size={16} color="#FFD700" />
            <Text style={styles.featureText}>專業司機</Text>
          </View>
          <View style={styles.featureItem}>
            <DollarSign size={16} color="#FFD700" />
            <Text style={styles.featureText}>透明計費</Text>
          </View>
          <View style={styles.featureItem}>
            <Phone size={16} color="#FFD700" />
            <Text style={styles.featureText}>即時客服</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
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
    textAlign: 'center',
  },
  bookingCard: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 6,
    fontSize: 14,
  },
  clearButton: {
    color: '#999',
    fontSize: 16,
    paddingHorizontal: 6,
  },
  fareEstimate: {
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  fareText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 6,
    marginBottom: 4,
  },
  fareNote: {
    fontSize: 11,
    color: '#666',
    marginLeft: 24,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  quickAddresses: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  addressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickAddress: {
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickAddressText: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    margin: 12,
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
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  serviceInfo: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 3,
  },
  bottomSpacing: {
    height: 80,
  },
});