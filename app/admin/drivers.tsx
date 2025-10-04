import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Search, Filter, User, Car, CheckCircle, XCircle, Clock, ArrowLeft, Eye } from 'lucide-react-native';
import { router } from 'expo-router';
import { adminService } from '../../services/admin';

export default function AdminDriversScreen() {
  const [drivers, setDrivers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待審核' },
    { key: 'approved', label: '已通過' },
    { key: 'rejected', label: '已拒絕' },
    { key: 'active', label: '在線中' }
  ];

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllDrivers();
      if (result.success) {
        setDrivers(result.data);
      } else {
        console.error('載入司機資料失敗:', result.error);
        setDrivers([]);
      }
    } catch (error) {
      console.error('載入司機資料錯誤:', error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDriver = (driverId: string, driverName: string) => {
    Alert.alert(
      '審核司機',
      `確定要通過 ${driverName} 的申請嗎？\n\n審核通過後：\n• 司機可以開始接單\n• 系統會發送通知\n• 狀態更新為「已通過」`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '通過', 
          onPress: async () => {
            try {
              const result = await adminService.approveDriver(driverId);
              if (result.success) {
                Alert.alert(
                  '✅ 審核完成', 
                  `${driverName} 的申請已通過！\n\n✅ 司機現在可以開始接單\n✅ 系統已發送通知\n✅ 狀態已更新為「已通過」`,
                  [{ text: '確定' }]
                );
                loadDrivers(); // 重新載入數據
              } else {
                Alert.alert('❌ 審核失敗', result.error);
              }
            } catch (error) {
              Alert.alert('❌ 審核失敗', '請稍後再試');
            }
          }
        }
      ]
    );
  };

  const handleRejectDriver = (driverId: string, driverName: string) => {
    Alert.alert(
      '拒絕申請',
      `確定要拒絕 ${driverName} 的申請嗎？\n\n拒絕後：\n• 司機無法登入系統\n• 系統會發送通知\n• 狀態更新為「已拒絕」`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '拒絕', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await adminService.rejectDriver(driverId, '資料不符合要求或審核未通過');
              if (result.success) {
                Alert.alert(
                  '❌ 審核完成', 
                  `${driverName} 的申請已拒絕\n\n❌ 司機無法登入系統\n📧 系統已發送通知`,
                  [{ text: '確定' }]
                );
                loadDrivers(); // 重新載入數據
              } else {
                Alert.alert('操作失敗', result.error);
              }
            } catch (error) {
              Alert.alert('操作失敗', '請稍後再試');
            }
          }
        }
      ]
    );
  };

  const handleViewDriverDetails = (driver: any) => {
    const totalEarnings = driver.total_earnings || 0;
    const rating = driver.rating || 5.0;
    const totalOrders = driver.total_orders || 0;

    Alert.alert(
      `司機詳情 - ${driver.full_name}`,
      `手機號碼：${driver.phone_number || '未提供'}\n身分證：${driver.id_number || '未提供'}\n駕照號碼：${driver.license_number || '未提供'}\n駕照到期：${driver.license_expiry || '未提供'}\n\n車輛資訊：\n${driver.vehicle_brand || '未提供'} ${driver.vehicle_model || ''}\n車牌：${driver.vehicle_plate || '未提供'}\n\n緊急聯絡人：\n${driver.emergency_contact_name || '未提供'}\n${driver.emergency_contact_phone || '未提供'}\n\n統計資料：\n評分：${rating.toFixed(1)}\n完成訂單：${totalOrders}\n總收入：NT$${totalEarnings.toLocaleString()}`,
      [{ text: '確定' }]
    );
  };

  const statusMap = {
    pending: { text: '待審核', color: '#FF9500', icon: Clock },
    approved: { text: '已通過', color: '#34C759', icon: CheckCircle },
    rejected: { text: '已拒絕', color: '#FF3B30', icon: XCircle },
    active: { text: '在線中', color: '#007AFF', icon: CheckCircle }
  };

  const workStatusMap = {
    offline: { text: '離線', color: '#666' },
    online: { text: '在線', color: '#34C759' },
    busy: { text: '忙碌', color: '#FF9500' }
  };
  
  const getVerificationStatusText = (status: string) => {
    const statusMap = {
      pending: '待審核',
      approved: '已通過',
      rejected: '已拒絕'
    };
    return statusMap[status] || status;
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'active' ? driver.work_status === 'online' : driver.verification_status === selectedFilter);
    
    const matchesSearch = searchText === '' || 
      driver.full_name.includes(searchText) ||
      driver.phone_number.includes(searchText) ||
      driver.vehicle_plate.includes(searchText);
    
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/admin')}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>司機管理</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋司機姓名、電話或車牌"
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

      <ScrollView style={styles.driversList}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        )}
        
        {filteredDrivers.map(driver => {
          const StatusIcon = statusMap[driver.verification_status]?.icon || Clock;
          
          return (
            <View key={driver.id} style={styles.driverCard}>
              <View style={styles.driverHeader}>
                <View style={styles.driverBasicInfo}>
                  <Text style={styles.driverName}>{driver.full_name}</Text>
                  <Text style={styles.driverPhone}>{driver.phone_number}</Text>
                </View>
                
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.verificationBadge,
                    { backgroundColor: statusMap[driver.verification_status]?.color }
                  ]}>
                    <StatusIcon size={12} color="#fff" />
                    <Text style={styles.verificationText}>
                      {statusMap[driver.verification_status]?.text}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.workStatusBadge,
                    { backgroundColor: workStatusMap[driver.work_status]?.color }
                  ]}>
                    <Text style={styles.workStatusText}>
                      {workStatusMap[driver.work_status]?.text}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.driverDetails}>
                <View style={styles.detailRow}>
                  <Car size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {driver.vehicle_brand} {driver.vehicle_model} ({driver.vehicle_plate})
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <User size={16} color="#666" />
                  <Text style={styles.detailText}>
                    緊急聯絡人：{driver.emergency_contact_name} ({driver.emergency_contact_phone})
                  </Text>
                </View>
              </View>

              <View style={styles.driverStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>⭐ {(driver.rating || 5.0).toFixed(1)}</Text>
                  <Text style={styles.statLabel}>評分</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{driver.total_orders || 0}</Text>
                  <Text style={styles.statLabel}>完成訂單</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>NT${((driver.total_earnings || 0) / 1000).toFixed(0)}K</Text>
                  <Text style={styles.statLabel}>總收入</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => handleViewDriverDetails(driver)}
                >
                  <Eye size={16} color="#007AFF" />
                  <Text style={styles.viewButtonText}>查看詳情</Text>
                </TouchableOpacity>
                
                {driver.verification_status === 'pending' && (
                  <>
                    <TouchableOpacity 
                      style={styles.approveButton}
                      onPress={() => handleApproveDriver(driver.id, driver.full_name)}
                    >
                      <CheckCircle size={16} color="#fff" />
                      <Text style={styles.approveButtonText}>通過</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.rejectButton}
                      onPress={() => handleRejectDriver(driver.id, driver.full_name)}
                    >
                      <XCircle size={16} color="#fff" />
                      <Text style={styles.rejectButtonText}>拒絕</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          );
        })}

        {filteredDrivers.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暫無符合條件的司機</Text>
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
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  driverBasicInfo: {
    flex: 1,
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
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  verificationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  workStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  workStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  driverDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  driverStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});