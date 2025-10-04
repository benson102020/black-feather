import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { Search, Filter, User, Car, CheckCircle, XCircle, Clock, ArrowLeft, Eye, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { driverApplicationService } from '../../services/driver-application';

export default function AdminDriverApplicationsScreen() {
  const [applications, setApplications] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [currentApplication, setCurrentApplication] = useState<{id: string, name: string} | null>(null);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待審核' },
    { key: 'under_review', label: '審核中' },
    { key: 'approved', label: '已通過' },
    { key: 'rejected', label: '已拒絕' }
  ];

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    console.log('🔄 開始載入司機申請列表...');
    setLoading(true);
    try {
      console.log('📞 調用 getPendingApplications...');
      const result = await driverApplicationService.getPendingApplications();
      console.log('📥 收到回應:', result);

      if (result.success) {
        console.log(`✅ 載入成功！共 ${result.data?.length || 0} 筆申請`);
        setApplications(result.data);

        if (result.data && result.data.length > 0) {
          console.log('📋 申請列表:', result.data.map(app => ({
            id: app.id,
            name: app.full_name,
            phone: app.phone_number,
            status: app.status
          })));
        } else {
          console.warn('⚠️ 申請列表為空');
        }
      } else {
        console.error('❌ 載入申請失敗:', result.error);
        Alert.alert('載入失敗', result.error || '無法載入申請列表');
        setApplications([]);
      }
    } catch (error) {
      console.error('❌ 載入申請錯誤:', error);
      console.error('完整錯誤:', JSON.stringify(error, null, 2));
      Alert.alert('載入錯誤', '系統發生錯誤，請稍後再試');
      setApplications([]);
    } finally {
      setLoading(false);
      console.log('✅ 載入流程完成');
    }
  };

  const handleApproveApplication = (applicationId: string, applicantName: string) => {
    Alert.alert(
      '審核司機申請',
      `確定要通過 ${applicantName} 的申請嗎？\n\n審核通過後：\n• 申請者可以開始接單\n• 系統會發送通知\n• 狀態更新為「已通過」\n• 創建正式司機帳號`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '通過', 
          onPress: async () => {
            try {
              const result = await driverApplicationService.approveApplication(
                applicationId, 
                '00000000-0000-0000-0000-000000000099', // 管理員 ID
                '申請資料完整，符合司機資格要求'
              );
              
              if (result.success) {
                Alert.alert(
                  '✅ 審核通過',
                  `${applicantName} 的申請已通過審核！\n\n✅ 司機帳號已啟用\n✅ 可以登入並開始接單\n✅ 通知已發送給申請者\n✅ 車輛資料已建立`,
                  [{
                    text: '確定',
                    onPress: () => loadApplications()
                  }]
                );
              } else {
                Alert.alert('❌ 審核失敗', result.error || '操作失敗，請稍後再試');
              }
            } catch (error) {
              Alert.alert('❌ 審核失敗', '請稍後再試');
            }
          }
        }
      ]
    );
  };

  const handleRejectApplication = (applicationId: string, applicantName: string) => {
    setCurrentApplication({ id: applicationId, name: applicantName });
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const confirmRejectApplication = async () => {
    if (!currentApplication) return;

    if (!rejectReason || rejectReason.trim().length < 5) {
      Alert.alert('錯誤', '請輸入拒絕原因（至少5個字元）');
      return;
    }

    try {
      const result = await driverApplicationService.rejectApplication(
        currentApplication.id,
        '00000000-0000-0000-0000-000000000099',
        rejectReason.trim(),
        '經審核後不符合司機資格要求'
      );

      if (result.success) {
        setRejectModalVisible(false);
        Alert.alert(
          '❌ 審核拒絕',
          `${currentApplication.name} 的申請已被拒絕\n\n❌ 申請者無法登入系統\n📧 拒絕通知已發送\n📝 拒絕原因：${rejectReason.trim()}`,
          [{
            text: '確定',
            onPress: () => loadApplications()
          }]
        );
      } else {
        Alert.alert('❌ 操作失敗', result.error || '拒絕申請失敗，請稍後再試');
      }
    } catch (error) {
      Alert.alert('❌ 操作失敗', '系統錯誤，請稍後再試');
    }
  };

  const handleViewApplicationDetails = (application: any) => {
    Alert.alert(
      `申請詳情 - ${application.full_name}`,
      `📱 手機號碼：${application.phone_number}\n🆔 身分證：${application.id_number}\n🚗 駕照號碼：${application.license_number}\n📅 駕照到期：${application.license_expiry}\n\n🚙 車輛資訊：\n${application.vehicle_brand} ${application.vehicle_model}\n🏷️ 車牌：${application.vehicle_plate}\n🎨 顏色：${application.vehicle_color || '未指定'}\n\n👥 緊急聯絡人：\n${application.emergency_contact_name}\n📞 ${application.emergency_contact_phone}\n👨‍👩‍👧‍👦 關係：${application.emergency_contact_relation || '未指定'}\n\n💳 街口帳號：\n${application.jkopay_account || '未設定'}\n👤 顯示姓名：${application.jkopay_name || '未設定'}\n\n📅 申請時間：${new Date(application.submitted_at).toLocaleString('zh-TW')}`,
      [{ text: '確定' }]
    );
  };

  const statusMap = {
    pending: { text: '待審核', color: '#FF9500', icon: Clock },
    under_review: { text: '審核中', color: '#007AFF', icon: Eye },
    approved: { text: '已通過', color: '#34C759', icon: CheckCircle },
    rejected: { text: '已拒絕', color: '#FF3B30', icon: XCircle }
  };

  const priorityMap = {
    low: { text: '低', color: '#666' },
    normal: { text: '一般', color: '#999' },
    high: { text: '高', color: '#FF9500' },
    urgent: { text: '緊急', color: '#FF3B30' }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = selectedFilter === 'all' || app.status === selectedFilter;
    const matchesSearch = searchText === '' || 
      app.full_name.includes(searchText) ||
      app.phone_number.includes(searchText) ||
      app.vehicle_plate.includes(searchText);
    
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
        <Text style={styles.headerTitle}>司機申請審核</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋申請者姓名、電話或車牌"
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

      <ScrollView style={styles.applicationsList}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        )}
        
        {filteredApplications.map(application => {
          const StatusIcon = statusMap[application.status]?.icon || Clock;
          
          return (
            <View key={application.id} style={styles.applicationCard}>
              <View style={styles.applicationHeader}>
                <View style={styles.applicantInfo}>
                  <Text style={styles.applicantName}>{application.full_name}</Text>
                  <Text style={styles.applicantPhone}>{application.phone_number}</Text>
                  <Text style={styles.applicantId}>身分證：{application.id_number}</Text>
                </View>
                
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: statusMap[application.status]?.color }
                  ]}>
                    <StatusIcon size={12} color="#fff" />
                    <Text style={styles.statusText}>
                      {statusMap[application.status]?.text}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: priorityMap[application.priority]?.color }
                  ]}>
                    <Text style={styles.priorityText}>
                      {priorityMap[application.priority]?.text}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.applicationDetails}>
                <View style={styles.detailRow}>
                  <Car size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {application.vehicle_brand} {application.vehicle_model} ({application.vehicle_plate})
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <User size={16} color="#666" />
                  <Text style={styles.detailText}>
                    駕照：{application.license_number} (到期：{application.license_expiry})
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.detailText}>
                    申請時間：{new Date(application.submitted_at).toLocaleString('zh-TW')}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => handleViewApplicationDetails(application)}
                >
                  <Eye size={16} color="#007AFF" />
                  <Text style={styles.viewButtonText}>查看詳情</Text>
                </TouchableOpacity>
                
                {application.status === 'pending' && (
                  <>
                    <TouchableOpacity 
                      style={styles.approveButton}
                      onPress={() => handleApproveApplication(application.id, application.full_name)}
                    >
                      <CheckCircle size={16} color="#fff" />
                      <Text style={styles.approveButtonText}>通過</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.rejectButton}
                      onPress={() => handleRejectApplication(application.id, application.full_name)}
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

        {filteredApplications.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暫無符合條件的申請</Text>
          </View>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 拒絕原因輸入 Modal */}
      <Modal
        visible={rejectModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>拒絕申請</Text>
            <Text style={styles.modalSubtitle}>
              請輸入拒絕 {currentApplication?.name} 申請的原因：
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="請輸入拒絕原因（至少5個字元）"
              placeholderTextColor="#666"
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={confirmRejectApplication}
              >
                <Text style={styles.modalConfirmButtonText}>確定拒絕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  applicationsList: {
    flex: 1,
    padding: 16,
  },
  applicationCard: {
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
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  applicantPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  applicantId: {
    fontSize: 12,
    color: '#999',
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
    marginBottom: 4,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  applicationDetails: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000',
    minHeight: 100,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    backgroundColor: '#FF3B30',
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});