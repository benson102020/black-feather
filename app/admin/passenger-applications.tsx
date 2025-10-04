import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { Search, Filter, User, CheckCircle, XCircle, Clock, ArrowLeft, Eye } from 'lucide-react-native';
import { router } from 'expo-router';
import { passengerApplicationService } from '../../services/passenger-application';

export default function AdminPassengerApplicationsScreen() {
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
    { key: 'approved', label: '已通過' },
    { key: 'rejected', label: '已拒絕' }
  ];

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const result = await passengerApplicationService.getAllApplications();
      if (result.success) {
        setApplications(result.data);
      } else {
        console.error('載入申請失敗:', result.error);
        setApplications([]);
      }
    } catch (error) {
      console.error('載入申請錯誤:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = (applicationId: string, applicantName: string) => {
    Alert.alert(
      '審核乘客申請',
      `確定要通過 ${applicantName} 的申請嗎？\n\n審核通過後：\n• 申請者可以登入使用叫車服務\n• 系統會發送通知\n• 狀態更新為「已通過」`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '通過',
          onPress: async () => {
            try {
              const result = await passengerApplicationService.approveApplication(
                applicationId,
                '00000000-0000-0000-0000-000000000099',
                '申請資料完整，符合乘客註冊要求'
              );

              if (result.success) {
                Alert.alert(
                  '✅ 審核通過',
                  `${applicantName} 的申請已通過審核！\n\n✅ 乘客帳號已啟用\n✅ 可以登入使用叫車服務\n✅ 通知已發送給申請者`,
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
      const result = await passengerApplicationService.rejectApplication(
        currentApplication.id,
        '00000000-0000-0000-0000-000000000099',
        rejectReason.trim(),
        '經審核後不符合註冊要求'
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
      `申請詳情 - ${application.name}`,
      `📱 手機號碼：${application.phone}\n📧 電子郵件：${application.email}\n\n📅 申請時間：${new Date(application.created_at).toLocaleString('zh-TW')}\n${application.reviewed_at ? `🔍 審核時間：${new Date(application.reviewed_at).toLocaleString('zh-TW')}` : ''}\n${application.notes ? `📝 備註：${application.notes}` : ''}`,
      [{ text: '確定' }]
    );
  };

  const statusMap = {
    pending: { text: '待審核', color: '#FF9500', icon: Clock },
    approved: { text: '已通過', color: '#34C759', icon: CheckCircle },
    rejected: { text: '已拒絕', color: '#FF3B30', icon: XCircle }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = selectedFilter === 'all' || app.status === selectedFilter;
    const matchesSearch = searchText === '' ||
      app.name.includes(searchText) ||
      app.phone.includes(searchText);

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
        <Text style={styles.headerTitle}>乘客申請審核</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋申請者姓名或電話"
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        ) : filteredApplications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <User size={48} color="#666" />
            <Text style={styles.emptyText}>目前沒有申請記錄</Text>
          </View>
        ) : (
          filteredApplications.map((application) => {
            const StatusIcon = statusMap[application.status]?.icon || Clock;

            return (
              <View key={application.id} style={styles.applicationCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <User size={20} color="#FFD700" />
                    <Text style={styles.applicantName}>{application.name}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: statusMap[application.status]?.color || '#999' }
                  ]}>
                    <StatusIcon size={14} color="#fff" />
                    <Text style={styles.statusText}>
                      {statusMap[application.status]?.text || '未知'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>手機號碼：</Text>
                    <Text style={styles.infoValue}>{application.phone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>電子郵件：</Text>
                    <Text style={styles.infoValue}>{application.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>申請時間：</Text>
                    <Text style={styles.infoValue}>
                      {new Date(application.created_at).toLocaleString('zh-TW')}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewApplicationDetails(application)}
                  >
                    <Eye size={18} color="#007AFF" />
                    <Text style={styles.viewButtonText}>查看詳情</Text>
                  </TouchableOpacity>

                  {application.status === 'pending' && (
                    <>
                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() => handleApproveApplication(application.id, application.name)}
                      >
                        <CheckCircle size={18} color="#fff" />
                        <Text style={styles.approveButtonText}>通過</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleRejectApplication(application.id, application.name)}
                      >
                        <XCircle size={18} color="#fff" />
                        <Text style={styles.rejectButtonText}>拒絕</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })
        )}
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
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
  },
  filterText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    color: '#999',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 15,
  },
  applicationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#999',
    fontSize: 14,
    width: 100,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 5,
  },
  viewButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#34C759',
    gap: 5,
    flex: 1,
    justifyContent: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    gap: 5,
    flex: 1,
    justifyContent: 'center',
  },
  rejectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
