import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Car, Settings, CircleHelp as HelpCircle, Shield, LogOut, CreditCard as Edit, Bell, CreditCard, Star, ChevronRight, Camera, FileText, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useApp } from '../../contexts/AppContext';

export default function ProfileScreen() {
  const { state, actions } = useApp();
  const driverInfo = state.user.driverInfo || {};
  
  // 格式化顯示資料
  const displayInfo = {
    name: driverInfo.full_name || '未設定',
    phone: driverInfo.phone_number || '未設定',
    rating: driverInfo.rating || 5.0,
    totalOrders: driverInfo.total_rides || 0,
    joinDate: driverInfo.created_at ? new Date(driverInfo.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' }) : '未知',
    vehicle: {
      brand: driverInfo.vehicles?.[0]?.make || '未設定',
      model: driverInfo.vehicles?.[0]?.model || '未設定',
      plate: driverInfo.vehicles?.[0]?.license_plate || '未設定',
      year: driverInfo.vehicles?.[0]?.year || '未設定',
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '確認登出',
      '您確定要登出嗎？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '登出', 
          style: 'destructive',
          onPress: () => {
            actions.logout();
            Alert.alert('已登出', '您已成功登出');
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      icon: Edit,
      title: '編輯個人資料',
      subtitle: '修改姓名、電話等資訊',
      onPress: () => {
        Alert.alert(
          '編輯個人資料',
          `當前資料：\n姓名：${displayInfo.name}\n電話：${displayInfo.phone}\n\n請選擇要修改的項目`,
          [
            { text: '取消', style: 'cancel' },
            { text: '修改姓名', onPress: () => Alert.alert('修改姓名', '為確保帳號安全，請聯絡客服修改：0800-123-456\n\n需要提供：\n• 身分證明文件\n• 原因說明') },
            { text: '修改電話', onPress: () => Alert.alert('修改電話', '為確保帳號安全，請聯絡客服修改：0800-123-456\n\n需要提供：\n• 新手機號碼\n• 身分證明文件') },
            { text: '修改信箱', onPress: () => Alert.alert('修改信箱', '請聯絡客服修改：0800-123-456') }
          ]
        );
      },
    },
    {
      icon: Car,
      title: '車輛資訊',
      subtitle: '查看分配車輛詳情',
      onPress: () => {
        const vehicle = displayInfo.vehicle;
        Alert.alert(
          '車輛資訊',
          `品牌型號：${vehicle.brand} ${vehicle.model}\n出廠年份：${vehicle.year}\n車牌號碼：${vehicle.plate}`,
          [{ text: '確定' }]
        );
      },
    },
    {
      icon: CreditCard,
      title: '街口帳號',
      subtitle: '管理街口轉帳帳號',
      onPress: () => {
        const jkopayAccount = driverInfo.jkopay_account || '未設定';
        const jkopayName = driverInfo.jkopay_name || '未設定';
        Alert.alert(
          '街口帳號',
          `帳號：${jkopayAccount}\n姓名：${jkopayName}`,
          [
            { text: '確定' },
            { text: '修改', onPress: () => Alert.alert('修改街口帳號', '請聯絡客服修改') }
          ]
        );
      },
    },
    {
      icon: Bell,
      title: '通知設定',
      subtitle: '管理推播通知偏好',
      onPress: () => {
        Alert.alert(
          '通知設定',
          '請選擇通知類型',
          [
            { text: '取消', style: 'cancel' },
            { text: '訂單通知：開啟', onPress: () => Alert.alert('訂單通知', '已開啟訂單相關通知') },
            { text: '收入通知：開啟', onPress: () => Alert.alert('收入通知', '已開啟收入相關通知') },
            { text: '系統通知：開啟', onPress: () => Alert.alert('系統通知', '已開啟系統相關通知') }
          ]
        );
      },
    },
    {
      icon: Shield,
      title: '修改密碼',
      subtitle: '更改登入密碼',
      onPress: () => {
        Alert.alert(
          '修改密碼',
          '為了您的帳號安全，請選擇修改方式',
          [
            { text: '取消', style: 'cancel' },
            { text: '忘記密碼', onPress: () => router.push('/auth/forgot-password') },
            { text: '聯絡客服', onPress: () => Alert.alert('客服電話', '0800-123-456') }
          ]
        );
      },
    },
    {
      icon: Camera,
      title: '證件照片',
      subtitle: '查看上傳的證件照片',
      onPress: () => {
        Alert.alert(
          '證件照片',
          '查看已上傳的證件照片',
          [
            { text: '取消', style: 'cancel' },
            { text: '駕照照片', onPress: () => Alert.alert('駕照照片', '駕照照片已上傳並通過審核') },
            { text: '身分證照片', onPress: () => Alert.alert('身分證照片', '身分證照片已上傳') },
            { text: '行照照片', onPress: () => Alert.alert('行照照片', '行照照片已上傳並通過審核') }
          ]
        );
      },
    },
    {
      icon: FileText,
      title: '審核狀態',
      subtitle: '查看帳號審核進度',
      onPress: () => {
        const status = driverInfo.verification_status || 'pending';
        const statusText = {
          pending: '審核中',
          approved: '已通過',
          rejected: '已拒絕'
        }[status] || '未知';
        Alert.alert('審核狀態', `當前狀態：${statusText}`);
      },
    },
    {
      icon: HelpCircle,
      title: '幫助中心',
      subtitle: '常見問題與客服支援',
      onPress: () => Alert.alert('幫助中心', '客服電話：0800-123-456\n客服信箱：support@blackfeather.com'),
    },
    {
      icon: Settings,
      title: '應用設定',
      subtitle: '語言、主題等設定',
      onPress: () => {
        Alert.alert(
          '應用設定',
          '請選擇設定項目',
          [
            { text: '取消', style: 'cancel' },
            { text: '語言：繁體中文', onPress: () => Alert.alert('語言設定', '當前語言：繁體中文') },
            { text: '主題：自動', onPress: () => Alert.alert('主題設定', '當前主題：跟隨系統') },
            { text: '聲音：開啟', onPress: () => Alert.alert('聲音設定', '通知聲音已開啟') }
          ]
        );
      },
    },
    {
      icon: Settings,
      title: '註冊功能測試',
      subtitle: '測試司機註冊和資料庫寫入',
      onPress: () => router.push('/test-registration'),
    },
    {
      icon: Settings,
      title: '完整流程測試',
      subtitle: '測試註冊→下單→接單→完成完整流程',
      onPress: () => router.push('/test-complete-flow'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <User size={40} color="#FFD700" />
          </View>
          
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{displayInfo.name}</Text>
            <Text style={styles.driverPhone}>{displayInfo.phone}</Text>
            <Text style={styles.joinDate}>加入時間：{displayInfo.joinDate}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{displayInfo.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.statLabel}>評分</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{displayInfo.totalOrders.toLocaleString()}</Text>
            <Text style={styles.statLabel}>完成訂單</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <Car size={24} color="#FFD700" />
          <Text style={styles.vehicleTitle}>分配車輛</Text>
        </View>
        
        <View style={styles.vehicleInfo}>
          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>車輛型號</Text>
            <Text style={styles.vehicleValue}>
              {displayInfo.vehicle.brand} {displayInfo.vehicle.model} ({displayInfo.vehicle.year})
            </Text>
          </View>
          
          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>車牌號碼</Text>
            <Text style={styles.vehicleValue}>{displayInfo.vehicle.plate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuIcon}>
              <item.icon size={20} color="#FFD700" />
            </View>
            
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            
            <ChevronRight size={16} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>安全登出</Text>
      </TouchableOpacity>

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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#333',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  driverPhone: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#ccc',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#555',
    marginHorizontal: 12,
  },
  vehicleCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  vehicleInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleLabel: {
    fontSize: 12,
    color: '#666',
  },
  vehicleValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 70,
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 30,
  },
});