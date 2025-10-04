import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Monitor, Smartphone } from 'lucide-react-native';
import { router } from 'expo-router';
import { adminService } from '../../services/admin';

export default function PassengerFrontendViewScreen() {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPassengers();
  }, []);

  const loadPassengers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllPassengers();
      if (result.success) {
        // 只顯示已通過審核的乘客
        setPassengers(result.data.filter(p => p.status === 'active'));
      }
    } catch (error) {
      console.error('載入乘客失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPassengerFrontend = (passenger: any) => {
    Alert.alert(
      '模擬乘客視角',
      `即將以 ${passenger.full_name} 的身份查看乘客端界面。\n\n您可以：\n• 查看叫車地圖\n• 查看訂單歷史\n• 查看個人資料\n• 體驗叫車流程\n\n注意：這是模擬視角，不會影響實際數據。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '進入乘客端',
          onPress: () => {
            // 導航到乘客端主頁
            router.push({
              pathname: '/passenger',
              params: {
                adminMode: 'true',
                passengerId: passenger.id,
                passengerName: passenger.full_name
              }
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>乘客前台視角</Text>
      </View>

      <View style={styles.infoBox}>
        <Monitor size={24} color="#34C759" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>前台視角模式</Text>
          <Text style={styles.infoText}>
            選擇一位乘客,以他們的身份查看乘客端界面。
            這可以幫助您了解乘客的使用體驗和測試功能。
          </Text>
        </View>
      </View>

      <ScrollView style={styles.passengersList}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        )}

        {passengers.map((passenger) => (
          <View key={passenger.id} style={styles.passengerCard}>
            <View style={styles.passengerInfo}>
              <View>
                <Text style={styles.passengerName}>{passenger.full_name}</Text>
                <Text style={styles.passengerPhone}>{passenger.phone_number}</Text>
                {passenger.email && (
                  <Text style={styles.passengerEmail}>📧 {passenger.email}</Text>
                )}
              </View>

              <View style={styles.statsContainer}>
                <Text style={styles.statText}>⭐ {passenger.rating || 5.0}</Text>
                <Text style={styles.statText}>🚖 {passenger.total_rides || 0} 次</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewPassengerFrontend(passenger)}
            >
              <Smartphone size={16} color="#fff" />
              <Text style={styles.viewButtonText}>進入乘客端視角</Text>
            </TouchableOpacity>
          </View>
        ))}

        {passengers.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暫無可用的乘客</Text>
            <Text style={styles.emptyHint}>請先審核通過一些乘客申請</Text>
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  passengersList: {
    flex: 1,
    padding: 16,
  },
  passengerCard: {
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
  passengerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  passengerPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  passengerEmail: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyHint: {
    color: '#999',
    fontSize: 14,
  },
});
