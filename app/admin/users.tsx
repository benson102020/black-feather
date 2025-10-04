import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Search, Filter, User, Phone, Mail, ArrowLeft, Eye } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'passenger', label: '乘客' },
    { key: 'driver', label: '司機' },
    { key: 'active', label: '活躍' },
    { key: 'inactive', label: '非活躍' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // 模擬載入用戶資料
    setUsers([
      {
        id: 'test-passenger-001',
        full_name: '測試乘客',
        phone_number: '0987654321',
        email: 'test@passenger.com',
        role: 'passenger',
        status: 'active',
        rating: 4.9,
        total_rides: 85,
        created_at: new Date().toISOString()
      },
      {
        id: 'test-driver-001',
        full_name: '測試司機',
        phone_number: '0982214855',
        email: 'test@driver.com',
        role: 'driver',
        status: 'active',
        rating: 4.8,
        total_rides: 156,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'active' ? user.status === 'active' : 
       selectedFilter === 'inactive' ? user.status !== 'active' : 
       user.role === selectedFilter);
    
    const matchesSearch = searchText === '' || 
      user.full_name.includes(searchText) ||
      user.phone_number.includes(searchText) ||
      (user.email && user.email.includes(searchText));
    
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
        <Text style={styles.headerTitle}>用戶管理</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋用戶姓名、電話或信箱"
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

      <ScrollView style={styles.usersList}>
        {filteredUsers.map(user => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.full_name}</Text>
                <Text style={styles.userPhone}>{user.phone_number}</Text>
                {user.email && (
                  <Text style={styles.userEmail}>{user.email}</Text>
                )}
              </View>
              
              <View style={styles.userMeta}>
                <View style={[
                  styles.roleBadge,
                  { backgroundColor: user.role === 'driver' ? '#FFD700' : '#007AFF' }
                ]}>
                  <Text style={styles.roleText}>
                    {user.role === 'driver' ? '司機' : '乘客'}
                  </Text>
                </View>
                
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: user.status === 'active' ? '#34C759' : '#666' }
                ]}>
                  <Text style={styles.statusText}>
                    {user.status === 'active' ? '活躍' : '非活躍'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>⭐ {user.rating}</Text>
                <Text style={styles.statLabel}>評分</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.total_rides}</Text>
                <Text style={styles.statLabel}>總行程</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Date(user.created_at).toLocaleDateString('zh-TW')}
                </Text>
                <Text style={styles.statLabel}>加入日期</Text>
              </View>
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
  usersList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userMeta: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
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
});