import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Phone, Mail, Clock, CheckCircle, XCircle, User, Headphones, Send } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminSupportScreen() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSupportTickets();
  }, []);

  const loadSupportTickets = async () => {
    setLoading(true);
    try {
      // 模擬載入客服工單
      setTickets([
        {
          id: 'ticket-001',
          user_id: 'test-passenger-001',
          user_name: '測試乘客',
          user_type: 'passenger',
          category: 'billing',
          title: '費用計算問題',
          description: '我想詢問叫車的費用是如何計算的？',
          status: 'open',
          priority: 'medium',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          messages: [
            {
              id: 'msg-001',
              sender_type: 'user',
              content: '我想詢問叫車的費用是如何計算的？',
              created_at: new Date(Date.now() - 1800000).toISOString()
            }
          ]
        },
        {
          id: 'ticket-002',
          user_id: 'test-driver-001',
          user_name: '測試司機',
          user_type: 'driver',
          category: 'technical',
          title: '無法接收新訂單',
          description: '我已經上線但是收不到新的訂單通知',
          status: 'in_progress',
          priority: 'high',
          assigned_to: 'support-001',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          messages: [
            {
              id: 'msg-002',
              sender_type: 'user',
              content: '我已經上線但是收不到新的訂單通知',
              created_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 'msg-003',
              sender_type: 'support',
              content: '您好，我們正在檢查您的帳號設定，請稍等。',
              created_at: new Date(Date.now() - 3300000).toISOString()
            }
          ]
        },
        {
          id: 'ticket-003',
          user_id: 'passenger-003',
          user_name: '李先生',
          user_type: 'passenger',
          category: 'driver_issue',
          title: '司機服務態度問題',
          description: '司機態度不佳，希望能夠改善',
          status: 'resolved',
          priority: 'medium',
          resolved_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 172800000).toISOString(),
          messages: [
            {
              id: 'msg-004',
              sender_type: 'user',
              content: '司機態度不佳，希望能夠改善',
              created_at: new Date(Date.now() - 172800000).toISOString()
            },
            {
              id: 'msg-005',
              sender_type: 'support',
              content: '感謝您的反饋，我們已經聯絡該司機並進行教育訓練。',
              created_at: new Date(Date.now() - 86400000).toISOString()
            }
          ]
        }
      ]);
    } catch (error) {
      console.error('載入客服工單錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyTicket = async (ticketId: string) => {
    if (!replyMessage.trim()) {
      Alert.alert('錯誤', '請輸入回覆內容');
      return;
    }

    try {
      // 模擬發送回覆
      const newMessage = {
        id: 'msg-' + Date.now(),
        sender_type: 'support',
        content: replyMessage.trim(),
        created_at: new Date().toISOString()
      };

      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              messages: [...ticket.messages, newMessage],
              status: 'in_progress'
            }
          : ticket
      ));

      setReplyMessage('');
      Alert.alert('回覆成功', '您的回覆已發送給用戶');
    } catch (error) {
      Alert.alert('發送失敗', '請稍後再試');
    }
  };

  const handleResolveTicket = (ticketId: string) => {
    Alert.alert(
      '結案工單',
      '確定要將此工單標記為已解決嗎？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '確定結案', 
          onPress: () => {
            setTickets(prev => prev.map(ticket => 
              ticket.id === ticketId 
                ? { 
                    ...ticket, 
                    status: 'resolved',
                    resolved_at: new Date().toISOString()
                  }
                : ticket
            ));
            Alert.alert('結案成功', '工單已標記為已解決');
          }
        }
      ]
    );
  };

  const statusMap = {
    open: { text: '待處理', color: '#FF9500', icon: Clock },
    in_progress: { text: '處理中', color: '#007AFF', icon: MessageSquare },
    resolved: { text: '已解決', color: '#34C759', icon: CheckCircle },
    closed: { text: '已關閉', color: '#666', icon: XCircle }
  };

  const priorityMap = {
    low: { text: '低', color: '#666' },
    medium: { text: '中', color: '#FF9500' },
    high: { text: '高', color: '#FF3B30' },
    urgent: { text: '緊急', color: '#8B0000' }
  };

  const categoryMap = {
    technical: '技術問題',
    billing: '計費問題',
    driver_issue: '司機問題',
    general: '一般問題'
  };

  if (selectedTicket) {
    const ticket = tickets.find(t => t.id === selectedTicket);
    if (!ticket) return null;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedTicket(null)}
          >
            <ArrowLeft size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>工單詳情</Text>
          
          {ticket.status !== 'resolved' && (
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={() => handleResolveTicket(ticket.id)}
            >
              <CheckCircle size={20} color="#34C759" />
              <Text style={styles.resolveButtonText}>結案</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.ticketInfo}>
          <Text style={styles.ticketTitle}>{ticket.title}</Text>
          <View style={styles.ticketMeta}>
            <Text style={styles.ticketUser}>
              {ticket.user_type === 'driver' ? '司機' : '乘客'}：{ticket.user_name}
            </Text>
            <Text style={styles.ticketCategory}>
              分類：{categoryMap[ticket.category]}
            </Text>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: priorityMap[ticket.priority].color }
            ]}>
              <Text style={styles.priorityText}>
                {priorityMap[ticket.priority].text}優先級
              </Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.messagesContainer}>
          {ticket.messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.messageItem,
                message.sender_type === 'support' ? styles.supportMessage : styles.userMessage
              ]}
            >
              <View style={styles.messageHeader}>
                {message.sender_type === 'support' ? (
                  <Headphones size={16} color="#FFD700" />
                ) : (
                  <User size={16} color="#007AFF" />
                )}
                <Text style={styles.messageSender}>
                  {message.sender_type === 'support' ? '客服' : ticket.user_name}
                </Text>
                <Text style={styles.messageTime}>
                  {new Date(message.created_at).toLocaleString('zh-TW')}
                </Text>
              </View>
              <Text style={styles.messageContent}>{message.content}</Text>
            </View>
          ))}
        </ScrollView>

        {ticket.status !== 'resolved' && (
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="輸入回覆內容..."
              value={replyMessage}
              onChangeText={setReplyMessage}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity 
              style={[styles.replyButton, !replyMessage.trim() && styles.replyButtonDisabled]}
              onPress={() => handleReplyTicket(ticket.id)}
              disabled={!replyMessage.trim()}
            >
              <Send size={20} color={replyMessage.trim() ? "#000" : "#999"} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>客服管理</Text>
      </View>

      <ScrollView style={styles.ticketsList}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>載入中...</Text>
          </View>
        )}
        
        {tickets.map(ticket => {
          const StatusIcon = statusMap[ticket.status]?.icon || Clock;
          
          return (
            <TouchableOpacity 
              key={ticket.id} 
              style={styles.ticketCard}
              onPress={() => setSelectedTicket(ticket.id)}
            >
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketId}>#{ticket.id}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: statusMap[ticket.status].color }
                ]}>
                  <StatusIcon size={12} color="#fff" />
                  <Text style={styles.statusText}>
                    {statusMap[ticket.status].text}
                  </Text>
                </View>
              </View>

              <Text style={styles.ticketTitle}>{ticket.title}</Text>
              
              <View style={styles.ticketMeta}>
                <Text style={styles.ticketUser}>
                  {ticket.user_type === 'driver' ? '司機' : '乘客'}：{ticket.user_name}
                </Text>
                <Text style={styles.ticketCategory}>
                  {categoryMap[ticket.category]}
                </Text>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: priorityMap[ticket.priority].color }
                ]}>
                  <Text style={styles.priorityText}>
                    {priorityMap[ticket.priority].text}
                  </Text>
                </View>
              </View>

              <Text style={styles.ticketDescription} numberOfLines={2}>
                {ticket.description}
              </Text>

              <View style={styles.ticketFooter}>
                <Text style={styles.ticketTime}>
                  {new Date(ticket.created_at).toLocaleString('zh-TW')}
                </Text>
                <Text style={styles.messageCount}>
                  {ticket.messages.length} 則訊息
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {tickets.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Headphones size={48} color="#ccc" />
            <Text style={styles.emptyTitle}>暫無客服工單</Text>
            <Text style={styles.emptyText}>所有問題都已處理完成</Text>
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
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  resolveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  ticketsList: {
    flex: 1,
    padding: 16,
  },
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  ticketUser: {
    fontSize: 14,
    color: '#666',
  },
  ticketCategory: {
    fontSize: 12,
    color: '#999',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTime: {
    fontSize: 12,
    color: '#999',
  },
  messageCount: {
    fontSize: 12,
    color: '#666',
  },
  // 工單詳情樣式
  ticketInfo: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  messageItem: {
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
  },
  supportMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    maxWidth: '80%',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
  },
  messageContent: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  replyButton: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
  replyButtonDisabled: {
    backgroundColor: '#f0f0f0',
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});