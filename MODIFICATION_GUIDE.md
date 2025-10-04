# 司機端 APP 修改指南

## 📝 如何修改各個功能模組

### 🔐 身份驗證模組修改

#### 修改登入頁面 (`app/auth/login.tsx`)
```typescript
// 修改登入邏輯
const handleLogin = async () => {
  // 在這裡修改登入 API 呼叫
  // 例如：改變 API 端點或添加額外驗證
};

// 修改樣式
const styles = StyleSheet.create({
  // 修改登入按鈕顏色
  loginButton: {
    backgroundColor: '#YOUR_COLOR', // 改成您想要的顏色
  },
});
```

#### 修改註冊流程 (`app/auth/register.tsx`)
```typescript
// 添加新的註冊步驟
const renderStep = () => {
  switch (step) {
    case 7: // 新增第7步
      return (
        <View style={styles.stepContainer}>
          {/* 您的新步驟內容 */}
        </View>
      );
  }
};

// 修改表單驗證
const validateStep = (currentStep: number) => {
  switch (currentStep) {
    case 1:
      // 修改驗證規則
      if (!formData.customField) {
        Alert.alert('錯誤', '請填寫自定義欄位');
        return false;
      }
      break;
  }
};
```

### 🏠 工作台修改 (`app/(tabs)/index.tsx`)

#### 修改司機狀態
```typescript
// 添加新的工作狀態
const [driverStatus, setDriverStatus] = useState('offline'); // offline, online, busy, break

// 修改狀態切換邏輯
const handleStatusChange = (newStatus) => {
  setDriverStatus(newStatus);
  // 發送狀態更新到後端
};
```

#### 修改訂單卡片顯示
```typescript
// 修改訂單資訊顯示
const currentOrder = {
  // 添加新欄位
  priority: 'high', // high, medium, low
  estimatedEarnings: 'NT$350',
  // 修改現有欄位
  customer: '王先生 (VIP客戶)',
};
```

### 📦 訂單管理修改 (`app/(tabs)/orders.tsx`)

#### 添加新的篩選條件
```typescript
const filters = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待確認' },
  { key: 'pickup', label: '行程中' },
  { key: 'completed', label: '已完成' },
  // 添加新的篩選選項
  { key: 'urgent', label: '緊急訂單' },
  { key: 'vip', label: 'VIP客戶' },
];
```

#### 修改訂單狀態
```typescript
const statusMap = {
  pending: { text: '待確認', color: '#FF9500' },
  pickup: { text: '行程中', color: '#007AFF' },
  delivery: { text: '配送中', color: '#34C759' },
  completed: { text: '已完成', color: '#666666' },
  // 添加新狀態
  urgent: { text: '緊急', color: '#FF3B30' },
  delayed: { text: '延遲', color: '#FF9500' },
};
```

### 💰 收入統計修改 (`app/(tabs)/earnings.tsx`)

#### 添加新的統計期間
```typescript
const periods = [
  { key: 'today', label: '今日' },
  { key: 'week', label: '本週' },
  { key: 'month', label: '本月' },
  // 添加新期間
  { key: 'quarter', label: '本季' },
  { key: 'year', label: '本年' },
];
```

#### 修改收入計算
```typescript
const earningsData = {
  today: {
    total: 1240,
    orders: 8,
    hours: 6.5,
    average: 155,
    // 添加新統計
    bonus: 120, // 獎金
    tips: 80,   // 小費
  },
};
```

### 💬 訊息中心修改 (`app/(tabs)/messages.tsx`)

#### 添加新的對話類型
```typescript
const conversations = [
  {
    type: 'customer', // 客戶
    type: 'support',  // 客服
    type: 'system',   // 系統
    // 添加新類型
    type: 'dispatcher', // 調度員
    type: 'emergency', // 緊急聯絡
  }
];
```

#### 修改訊息顯示
```typescript
// 添加訊息類型圖標
const getMessageIcon = (type) => {
  switch (type) {
    case 'customer': return <User size={20} color="#FFD700" />;
    case 'support': return <Headphones size={20} color="#FFD700" />;
    case 'system': return <Bell size={20} color="#FFD700" />;
    // 添加新圖標
    case 'dispatcher': return <Radio size={20} color="#FFD700" />;
    case 'emergency': return <AlertTriangle size={20} color="#FF3B30" />;
  }
};
```

### 👤 個人中心修改 (`app/(tabs)/profile.tsx`)

#### 添加新的設定選項
```typescript
const menuItems = [
  // 現有選項...
  // 添加新選項
  {
    icon: Globe,
    title: '語言設定',
    subtitle: '選擇應用語言',
    onPress: () => Alert.alert('語言設定', '打開語言選擇頁面'),
  },
  {
    icon: Palette,
    title: '主題設定',
    subtitle: '選擇應用主題',
    onPress: () => Alert.alert('主題設定', '打開主題選擇頁面'),
  },
];
```

## 🎨 樣式修改指南

### 修改配色方案
```typescript
// 在任何 StyleSheet 中修改顏色
const styles = StyleSheet.create({
  // 主色調修改
  primaryColor: '#000000', // 改成您想要的主色
  accentColor: '#FFD700',  // 改成您想要的強調色
  
  // 背景色修改
  container: {
    backgroundColor: '#f5f5f5', // 改成您想要的背景色
  },
  
  // 文字顏色修改
  text: {
    color: '#333333', // 改成您想要的文字色
  },
});
```

### 修改字體大小
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 24, // 修改標題大小
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18, // 修改副標題大小
  },
  body: {
    fontSize: 16, // 修改內文大小
  },
});
```

### 修改間距和佈局
```typescript
const styles = StyleSheet.create({
  container: {
    padding: 20,        // 修改內邊距
    margin: 16,         // 修改外邊距
    borderRadius: 12,   // 修改圓角
  },
  
  // 修改 Flexbox 佈局
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 修改對齊方式
    alignItems: 'center',
  },
});
```

## 🔧 功能擴展指南

### 添加新頁面
1. 在 `app/` 目錄下創建新文件
2. 使用相同的樣式結構
3. 在 `_layout.tsx` 中添加路由配置

### 添加新的 Tab
1. 修改 `app/(tabs)/_layout.tsx`
2. 添加新的 Tab.Screen
3. 創建對應的頁面文件

### 集成 API
```typescript
// 創建 API 服務
const apiService = {
  login: async (phoneNumber, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, password }),
    });
    return response.json();
  },
};

// 在組件中使用
const handleLogin = async () => {
  try {
    const result = await apiService.login(phoneNumber, password);
    // 處理登入結果
  } catch (error) {
    // 處理錯誤
  }
};
```

## 📱 圖標修改

### 更換圖標
```typescript
// 從 lucide-react-native 導入新圖標
import { NewIcon } from 'lucide-react-native';

// 在組件中使用
<NewIcon size={24} color="#FFD700" />
```

### 自定義圖標大小和顏色
```typescript
// 統一圖標樣式
const iconProps = {
  size: 20,
  color: '#FFD700',
};

<Home {...iconProps} />
<User {...iconProps} />
```

## 🔄 狀態管理修改

### 使用 Context 進行全局狀態管理
```typescript
// 創建 Context
const AppContext = createContext();

// 提供者組件
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  
  return (
    <AppContext.Provider value={{ user, setUser, orders, setOrders }}>
      {children}
    </AppContext.Provider>
  );
};

// 在組件中使用
const { user, setUser } = useContext(AppContext);
```

## 📋 修改檢查清單

修改任何功能後，請確認：

- [ ] 代碼語法正確，無 TypeScript 錯誤
- [ ] 樣式顯示正常
- [ ] 功能邏輯正確
- [ ] 導航正常工作
- [ ] 在不同屏幕尺寸下測試
- [ ] 測試所有用戶交互
- [ ] 檢查控制台是否有警告或錯誤

---

**使用此指南，您可以輕鬆修改司機端 APP 的任何部分！**