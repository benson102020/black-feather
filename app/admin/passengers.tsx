import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Search, Filter, User, Phone, Mail, ArrowLeft, Eye, CheckCircle, XCircle, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { adminService } from '../../services/admin';

export default function AdminPassengersScreen() {
  const [passengers, setPassengers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待審核' },
    { key: 'active', label: '已通過' },
    { key: 'suspended', label: '已停用' },
    { key: 'high_activity', label: '高活躍' }
  ];

  useEffect(() => {
    loadPassengers();
  }, []);

  const loadPassengers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllPassengers();
      if (result.success) {
        setPassengers(result.data);
      } else {
        console.error('載入乘客資料失敗:', result.error);
        setPassengers([]);
      }
    } catch (error) {
      console.error('載入乘客資料錯誤:', error);
      setPassengers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePassenger = (passengerId: string, passengerName: string) => {
    Alert.alert(
      '審核乘客',
      `確定要通過 ${passengerName} 的申請嗎？`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '通過', 
          onPress: async () => {
            try {
              const result = await adminService.approvePassenger(passengerId);
              if (result.success) {
                Alert.alert('審核完成', `${passengerName} 的申請已通過`);
                loadPassengers(); // 重新載入數據
              } else {
                Alert.alert('審核失敗', result.error);
              }
            } catch (error) {
              Alert.alert('審核失敗', '請稍後再試');
            }
          }
        }
      ]
    );
  };

  const handleSuspendPassenger = (passengerId: string, passengerName: string) => {
    Alert.alert(
      '停用帳號',
      `確定要停用 ${passengerName} 的帳號嗎？`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '停用', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await adminService.suspendPassenger(passengerId, '違反使用條款');
              if (result.success) {
                Alert.alert('操作完成', `${passengerName} 的帳號已停用`);
                loadPassengers(); // 重新載入數據
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

  const handleViewPassengerDetails = (passenger: any) => {
    Alert.alert(
      `乘客詳情 - ${passenger.full_name}`,
      `手機號碼：${passenger.phone_number}\n電子郵件：${passenger.email || '未設定'}\n\n統計資料：\n評分：⭐ ${passenger.rating}\n總行程：${passenger.total_rides} 次\n總消費：NT$${passenger.total_spent.toLocaleString()}\n\n帳號狀態：${getStatusText(passenger.status)}\n驗證狀態：${getVerificationText(passenger.verification_status)}\n\n註冊時間：${new Date(passenger.created_at).toLocaleDateString('zh-TW')}\n最後使用：${passenger.last_ride_at ? new Date(passenger.last_ride_at).toLocaleDateString('zh-TW') : '從未使用'}`,
      [{ text: '確定' }]
    );
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      active: '正常使用',
      pending: '待審核',
      suspended: '已停用',
      inactive: '非活躍'
    };
    return statusMap[status] || status;
  };

  const getVerificationText = (status: string) => {
    const verificationMap = {
      verified: '已驗證',
      pending: '待驗證',
      rejected: '驗證失敗'
    };
    return verificationMap[status] || status;
  };

  const statusMap = {
    pending: { text: '待審核', color: '#FF9500', icon: Clock },
    active: { text: '正常', color: '#34C759', icon: CheckCircle },
    suspended: { text: '已停用', color: '#FF3B30', icon: XCircle },
    inactive: { text: '非活躍', color: '#666', icon: Clock }
  };

  const filteredPassengers = passengers.filter(passenger => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'high_activity' ? passenger.total_rides > 50 : passenger.status === selectedFilter);
    
    const matchesSearch = searchText === '' || 
      passenger.full_name.includes(searchText) ||
      passenger.phone_number.includes(searchText) ||
      (passenger.email && passenger.email.includes(searchText));
    
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>乘客管理</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋乘客姓名、電話或信箱"
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

      <ScrollView style={styles.passengersList}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        )}
        
        {filteredPassengers.map(passenger => {
          const StatusIcon = statusMap[passenger.status]?.icon || Clock;
          
          return (
            <View key={passenger.id} style={styles.passengerCard}>
              <View style={styles.passengerHeader}>
                <View style={styles.passengerBasicInfo}>
                  <Text style={styles.passengerName}>{passenger.full_name}</Text>
                  <Text style={styles.passengerPhone}>{passenger.phone_number}</Text>
                  {passenger.email && (
                    <Text style={styles.passengerEmail}>{passenger.email}</Text>
                  )}
                </View>
                
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: statusMap[passenger.status]?.color }
                  ]}>
                    <StatusIcon size={12} color="#fff" />
                    <Text style={styles.statusText}>
                      {statusMap[passenger.status]?.text}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.passengerStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>⭐ {passenger.rating}</Text>
                  <Text style={styles.statLabel}>評分</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{passenger.total_rides}</Text>
                  <Text style={styles.statLabel}>總行程</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>NT${(passenger.total_spent / 1000).toFixed(0)}K</Text>
                  <Text style={styles.statLabel}>總消費</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => handleViewPassengerDetails(passenger)}
                >
                  <Eye size={16} color="#007AFF" />
                  <Text style={styles.viewButtonText}>查看詳情</Text>
                </TouchableOpacity>
                
                {passenger.status === 'pending' && (
                  <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => handleApprovePassenger(passenger.id, passenger.full_name)}
                  >
                    <CheckCircle size={16} color="#fff" />
                    <Text style={styles.approveButtonText}>通過</Text>
                  </TouchableOpacity>
                )}
                
                {passenger.status === 'active' && (
                  <TouchableOpacity 
                    style={styles.suspendButton}
                    onPress={() => handleSuspendPassenger(passenger.id, passenger.full_name)}
                  >
                    <XCircle size={16} color="#fff" />
                    <Text style={styles.suspendButtonText}>停用</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {filteredPassengers.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暫無符合條件的乘客</Text>
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
  passengerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  passengerBasicInfo: {
    flex: 1,
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
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  passengerStats: {
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
    fontSize: 14,
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
  suspendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  suspendButtonText: {
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