import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Phone, MessageSquare, Send, Headphones, Clock, CheckCircle, User } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PassengerSupportScreen() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    // 模擬載入客服對話記錄
    setChatHistory([
      {
        id: '1',
        sender: 'support',
        senderName: '客服小美',
        content: '您好！我是 Black feather 客服小美，有什麼可以幫助您的嗎？',
        time: '14:30',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: '2',
        sender: 'user',
        senderName: '您',
        content: '我想詢問叫車的費用計算方式',
        time: '14:32',
        timestamp: new Date(Date.now() - 1680000).toISOString()
      },
      {
        id: '3',
        sender: 'support',
        senderName: '客服小美',
        content: '我們的計費方式包含：\n• 基本費用 NT$85\n• 每公里 NT$12\n• 每分鐘 NT$2.5\n• 尖峰時段會有 1.5 倍加成\n\n如有其他問題歡迎隨時詢問！',
        time: '14:33',
        timestamp: new Date(Date.now() - 1620000).toISOString()
      }
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      senderName: '您',
      content: message.trim(),
      time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');
    setLoading(true);

    // 模擬客服回應
    setTimeout(() => {
      const supportReply = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        senderName: '客服小美',
        content: '感謝您的訊息，我們已收到您的問題。客服人員將盡快為您處理。\n\n如有緊急問題，請撥打客服專線 0800-123-456。',
        time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, supportReply]);
      setLoading(false);
    }, 2000);
  };

  const handleCallSupport = () => {
    Alert.alert(
      '📞 客服專線',
      '客服電話：0800-123-456\n服務時間：24小時全年無休\n\n我們的客服團隊隨時為您服務！',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '撥打電話', 
          onPress: () => Alert.alert('撥打電話', '正在撥打客服專線 0800-123-456...')
        }
      ]
    );
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  const quickQuestions = [
    '如何計算車資？',
    '如何取消訂單？',
    '司機遲到怎麼辦？',
    '如何聯絡司機？'
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/passenger')}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>客服中心</Text>
        
        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleCallSupport}
        >
          <Phone size={20} color="#FFD700" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.supportInfo}>
        <View style={styles.supportCard}>
          <Headphones size={24} color="#FFD700" />
          <View style={styles.supportDetails}>
            <Text style={styles.supportTitle}>24小時客服專線</Text>
            <Text style={styles.supportPhone}>0800-123-456</Text>
            <Text style={styles.supportHours}>全年無休，隨時為您服務</Text>
          </View>
          <View style={styles.statusIndicator}>
            <CheckCircle size={16} color="#34C759" />
            <Text style={styles.statusText}>在線</Text>
          </View>
        </View>
      </View>

      {/* 常見問題快速選項 */}
      <View style={styles.quickQuestionsSection}>
        <Text style={styles.quickTitle}>常見問題</Text>
        <View style={styles.quickQuestions}>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestion}
              onPress={() => handleQuickQuestion(question)}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.chatContainer}>
        <Text style={styles.chatTitle}>💬 即時客服對話</Text>
        
        {chatHistory.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageItem,
              msg.sender === 'user' ? styles.userMessage : styles.supportMessage
            ]}
          >
            <View style={styles.messageHeader}>
              {msg.sender === 'support' ? (
                <Headphones size={16} color="#FFD700" />
              ) : (
                <User size={16} color="#007AFF" />
              )}
              <Text style={styles.senderName}>{msg.senderName}</Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
            <Text style={[
              styles.messageText,
              msg.sender === 'user' ? styles.userMessageText : styles.supportMessageText
            ]}>
              {msg.content}
            </Text>
          </View>
        ))}
        
        {loading && (
          <View style={styles.typingIndicator}>
            <Headphones size={16} color="#FFD700" />
            <Text style={styles.typingText}>客服正在輸入...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="輸入您的問題..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!message.trim() || loading}
        >
          <Send size={20} color={message.trim() ? "#000" : "#999"} />
        </TouchableOpacity>
      </View>
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
  callButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 8,
  },
  supportInfo: {
    margin: 16,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  supportDetails: {
    flex: 1,
    marginLeft: 12,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  supportPhone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 2,
  },
  supportHours: {
    fontSize: 12,
    color: '#666',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#34C759',
    marginLeft: 4,
    fontWeight: '600',
  },
  quickQuestionsSection: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  quickTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  quickQuestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickQuestion: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#666',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  messageItem: {
    marginVertical: 4,
    borderRadius: 12,
    padding: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    maxWidth: '80%',
  },
  supportMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    maxWidth: '80%',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
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
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#000',
  },
  supportMessageText: {
    color: '#000',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
});