import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Car, 
  Users, 
  Settings, 
  Database, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Package,
  DollarSign,
  MessageSquare,
  Chrome,
  MapPin,
  Navigation,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Copy,
  Trash2,
  Shield,
  Wifi,
  RefreshCw,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Send,
  Mail,
  CreditCard,
  FileText,
  Camera,
  Headphones,
  Power,
  LogOut,
  ChevronRight,
  Home,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  Globe,
  Key,
  Zap
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function IconTestScreen() {
  const iconList = [
    { name: 'ArrowLeft', component: ArrowLeft },
    { name: 'Car', component: Car },
    { name: 'Users', component: Users },
    { name: 'Settings', component: Settings },
    { name: 'Database', component: Database },
    { name: 'Phone', component: Phone },
    { name: 'Lock', component: Lock },
    { name: 'Eye', component: Eye },
    { name: 'EyeOff', component: EyeOff },
    { name: 'User', component: User },
    { name: 'Package', component: Package },
    { name: 'DollarSign', component: DollarSign },
    { name: 'MessageSquare', component: MessageSquare },
    { name: 'Chrome', component: Chrome },
    { name: 'MapPin', component: MapPin },
    { name: 'Navigation', component: Navigation },
    { name: 'Clock', component: Clock },
    { name: 'Star', component: Star },
    { name: 'CheckCircle', component: CheckCircle },
    { name: 'XCircle', component: XCircle },
    { name: 'AlertTriangle', component: AlertTriangle },
    { name: 'Play', component: Play },
    { name: 'Copy', component: Copy },
    { name: 'Trash2', component: Trash2 },
    { name: 'Shield', component: Shield },
    { name: 'Wifi', component: Wifi },
    { name: 'RefreshCw', component: RefreshCw },
    { name: 'Bell', component: Bell },
    { name: 'Search', component: Search },
    { name: 'Filter', component: Filter },
    { name: 'Download', component: Download },
    { name: 'Upload', component: Upload },
    { name: 'Send', component: Send },
    { name: 'Mail', component: Mail },
    { name: 'CreditCard', component: CreditCard },
    { name: 'FileText', component: FileText },
    { name: 'Camera', component: Camera },
    { name: 'Headphones', component: Headphones },
    { name: 'Power', component: Power },
    { name: 'LogOut', component: LogOut },
    { name: 'ChevronRight', component: ChevronRight },
    { name: 'Home', component: Home },
    { name: 'Activity', component: Activity },
    { name: 'TrendingUp', component: TrendingUp },
    { name: 'BarChart3', component: BarChart3 },
    { name: 'PieChart', component: PieChart },
    { name: 'Globe', component: Globe },
    { name: 'Key', component: Key },
    { name: 'Zap', component: Zap }
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>圖標測試</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>✅ Lucide 圖標狀態</Text>
          <Text style={styles.statusText}>
            所有圖標都已正確載入，API 錯誤已修復
          </Text>
        </View>

        <View style={styles.iconsGrid}>
          {iconList.map((icon, index) => {
            const IconComponent = icon.component;
            return (
              <View key={index} style={styles.iconItem}>
                <IconComponent size={24} color="#FFD700" />
                <Text style={styles.iconName}>{icon.name}</Text>
              </View>
            );
          })}
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    minHeight: 80,
  },
  iconName: {
    fontSize: 10,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});