import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Send, 
  Headphones, 
  Bell,
  ChevronRight,
  ArrowLeft
} from 'lucide-react-native';
import { useApp } from '../../contexts/AppContext';
import { messageService, notificationService } from '../../services/supabase';
import { router } from 'expo-router';
import { mockDataService } from '../../services/mock-data';

export default function MessagesScreen() {
  const { state } = useApp();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // 載入對話和通知
  useEffect(() => {
    // 使用模擬數據
    const mockData = mockDataService.getDriverMockData();
    setConversations(mockData.conversations);
    setNotifications(mockData.notifications);
  }, []);

  const loadConversations = async () => {
    try {
      const userId = state.user.driverInfo?.id;
      if (!userId) {
        setConversations([]);
        return;
      }
      
      const result = await messageService.getConversations(userId);
      
      if (result.success) {
        setConversations(result.data || []);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('載入對話錯誤:', error);
      setConversations([]);
    }
  };

  const loadNotifications = async () => {
    try {
      const userId = state.user.driverInfo?.id;
      if (!userId) {
        setNotifications([]);
        return;
      }
      
      const result = await notificationService.getNotifications(userId);
      
      if (result.success) {
        setNotifications(result.data || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('載入通知錯誤:', error);
      setNotifications([]);
    }
  };

  const chatMessages = selectedChat ? [
    { id: '1', sender: 'customer', content: '司機大哥，請問還要多久到？', time: '14:30' },
    { id: '2', sender: 'driver', content: '大概還有5分鐘，馬上到', time: '14:32' },
    { id: '3', sender: 'customer', content: '好的，我在大樓一樓等您', time: '14:35' },
  ] : [];

  const sendMessage = () => {
    if (message.trim()) {
      const userId = state.user.driverInfo?.id;
      if (!userId) {
        Alert.alert('錯誤', '用戶資訊不完整');
        return;
      }
      
      messageService.sendMessage(selectedChat, userId, message.trim());
      setMessage('');
      Alert.alert('訊息已發送', message.trim());
    }
  };

  if (selectedChat) {
    const conversation = conversations.find(c => c.id === selectedChat);
    return (
      <View style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            onPress={() => setSelectedChat(null)}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← 返回</Text>
          </TouchableOpacity>
          <View style={styles.chatInfo}>
            <Text style={styles.chatName}>{conversation?.name}</Text>
            {conversation?.orderId && (
              <Text style={styles.orderId}>訂單 #{conversation.orderId}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Phone size={20} color="#FFD700" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.messagesContainer}>
          {chatMessages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageItem,
                msg.sender === 'driver' ? styles.driverMessage : styles.customerMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                msg.sender === 'driver' ? styles.driverMessageText : styles.customerMessageText
              ]}>
                {msg.content}
              </Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="輸入訊息..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Send size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>訊息中心</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction} onPress={() => {
          Alert.alert(
            '聯絡客服',
            '24小時客服服務\n\n客服專線：0800-123-456\n客服信箱：support@blackfeather.com\n\n選擇聯絡方式：',
            [
              { text: '取消', style: 'cancel' },
              { text: '即時對話', onPress: () => router.push('/passenger/support') },
              { text: '撥打電話', onPress: () => Alert.alert('撥打客服電話', '正在撥打 0800-123-456...\n\n服務時間：24小時全年無休') }
            ]
          );
        }}>
          <Headphones size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>聯絡客服</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction} onPress={() => {
          Alert.alert(
            '調度中心',
            '24小時調度服務\n\n調度專線：0800-456-789\n緊急專線：0800-999-999\n\n選擇服務：',
            [
              { text: '取消', style: 'cancel' },
              { text: '一般調度', onPress: () => Alert.alert('調度電話', '正在撥打 0800-456-789...\n\n調度中心將協助您處理訂單相關問題') },
              { text: '緊急求助', onPress: () => Alert.alert('緊急求助', '🚨 已通知緊急調度中心\n\n請保持電話暢通，調度員將立即聯絡您\n\n如有生命危險請直接撥打 119') }
            ]
          );
        }}>
          <Phone size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>調度中心</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>對話</Text>
        {loading ? (
          <Text style={styles.loadingText}>載入中...</Text>
        ) : conversations.length > 0 ? (
          conversations.map(conv => (
          <TouchableOpacity
            key={conv.id}
            style={styles.conversationItem}
            onPress={() => setSelectedChat(conv.id)}
          >
            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>{conv.name || '未知用戶'}</Text>
                <Text style={styles.conversationTime}>
                  {new Date(conv.last_message_time).toLocaleTimeString('zh-TW', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
              <Text style={styles.conversationMessage} numberOfLines={2}>
                {conv.last_message || '暫無訊息'}
              </Text>
              {conv.ride_id && (
                <Text style={styles.conversationOrderId}>訂單 #{conv.ride_id}</Text>
              )}
            </View>
            <View style={styles.conversationMeta}>
              {conv.unread_count > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{conv.unread_count}</Text>
                </View>
              )}
              <ChevronRight size={16} color="#ccc" />
            </View>
          </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>暫無對話記錄</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>系統通知</Text>
          <Bell size={20} color="#FFD700" />
        </View>
        {notifications.map(notif => (
          <View key={notif.id} style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notif.title}</Text>
              <Text style={styles.notificationText}>{notif.message}</Text>
              <Text style={styles.notificationTime}>
                {new Date(notif.created_at).toLocaleString('zh-TW')}
              </Text>
            </View>
          </View>
        ))}
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
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    margin: 16,
    gap: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  conversationTime: {
    fontSize: 11,
    color: '#666',
  },
  conversationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  conversationOrderId: {
    fontSize: 11,
    color: '#FFD700',
  },
  conversationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 3,
  },
  notificationText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 3,
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
  },
  // Chat screen styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    color: '#FFD700',
    fontSize: 14,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderId: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 2,
  },
  callButton: {
    padding: 6,
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
  },
  messageItem: {
    marginVertical: 3,
    maxWidth: '80%',
  },
  driverMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    borderBottomRightRadius: 3,
    padding: 10,
  },
  customerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderBottomLeftRadius: 3,
    padding: 10,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  driverMessageText: {
    color: '#000',
  },
  customerMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 10,
    color: '#666',
    marginTop: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 80,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    padding: 8,
    marginLeft: 6,
  },
  bottomSpacing: {
    height: 80,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
    fontSize: 14,
  },
});