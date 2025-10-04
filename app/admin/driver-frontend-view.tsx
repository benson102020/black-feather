import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Monitor, Smartphone } from 'lucide-react-native';
import { router } from 'expo-router';
import { adminService } from '../../services/admin';

export default function DriverFrontendViewScreen() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllDrivers();
      if (result.success) {
        // 只顯示已通過審核的司機
        setDrivers(result.data.filter(d => d.verification_status === 'approved' || d.status === 'active'));
      }
    } catch (error) {
      console.error('載入司機失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDriverFrontend = (driver: any) => {
    Alert.alert(
      '模擬司機視角',
      `即將以 ${driver.full_name} 的身份查看司機端界面。\n\n您可以：\n• 查看司機主頁\n• 查看訂單列表\n• 查看收入統計\n• 查看個人資料\n\n注意：這是模擬視角，不會影響實際數據。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '進入司機端',
          onPress: () => {
            // 保存當前司機信息到臨時狀態
            // 然後導航到司機端主頁
            router.push({
              pathname: '/(tabs)',
              params: {
                adminMode: 'true',
                driverId: driver.id,
                driverName: driver.full_name
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
        <Text style={styles.headerTitle}>司機前台視角</Text>
      </View>

      <View style={styles.infoBox}>
        <Monitor size={24} color="#FFD700" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>前台視角模式</Text>
          <Text style={styles.infoText}>
            選擇一位司機,以他們的身份查看司機端界面。
            這可以幫助您了解司機的使用體驗和測試功能。
          </Text>
        </View>
      </View>

      <ScrollView style={styles.driversList}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        )}

        {drivers.map((driver) => (
          <View key={driver.id} style={styles.driverCard}>
            <View style={styles.driverInfo}>
              <View>
                <Text style={styles.driverName}>{driver.full_name}</Text>
                <Text style={styles.driverPhone}>{driver.phone_number}</Text>
                <Text style={styles.driverVehicle}>
                  🚗 {driver.vehicle_brand} {driver.vehicle_model} ({driver.vehicle_plate})
                </Text>
              </View>

              <View style={styles.statsContainer}>
                <Text style={styles.statText}>⭐ {driver.rating || 5.0}</Text>
                <Text style={styles.statText}>📦 {driver.total_orders || 0}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => handleViewDriverFrontend(driver)}
            >
              <Smartphone size={16} color="#fff" />
              <Text style={styles.viewButtonText}>進入司機端視角</Text>
            </TouchableOpacity>
          </View>
        ))}

        {drivers.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暫無可用的司機</Text>
            <Text style={styles.emptyHint}>請先審核通過一些司機申請</Text>
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
    borderLeftColor: '#FFD700',
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
  driversList: {
    flex: 1,
    padding: 16,
  },
  driverCard: {
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
  driverInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  driverPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  driverVehicle: {
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
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  viewButtonText: {
    color: '#000',
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
