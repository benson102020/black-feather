# Black feather 司機端 APP - 完整資料備份

## 📋 項目概述
- **項目名稱**: Black feather 司機端 APP
- **版本**: v1.0.0
- **備份日期**: 2024年12月
- **技術棧**: React Native + Expo + TypeScript

---

## 🎨 設計系統資料

### 配色方案
```typescript
const colors = {
  primary: '#000000',      // 主色 - 黑色
  accent: '#FFD700',       // 品牌色 - 金色
  background: '#f5f5f5',   // 背景色 - 淺灰
  text: '#333333',         // 文字色 - 深灰
  white: '#ffffff',        // 白色
  gray: {
    light: '#f0f0f0',
    medium: '#999999',
    dark: '#666666'
  },
  status: {
    success: '#34C759',    // 成功 - 綠色
    warning: '#FF9500',    // 警告 - 橙色
    error: '#FF3B30',      // 錯誤 - 紅色
    info: '#007AFF'        // 資訊 - 藍色
  }
};
```

### 字體規範
```typescript
const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal'
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal'
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal'
  }
};
```

---

## 👤 司機資料結構

### 司機基本資料
```typescript
interface DriverProfile {
  id: string;
  fullName: string;           // 真實姓名
  phoneNumber: string;        // 手機號碼 (10位數)
  idNumber: string;           // 身分證字號 (10位數)
  email?: string;             // 電子郵件 (選填)
  rating: number;             // 評分 (1-5)
  totalOrders: number;        // 總完成訂單數
  joinDate: string;           // 加入日期
  status: 'active' | 'inactive' | 'suspended'; // 帳號狀態
}

// 範例資料
const driverExample: DriverProfile = {
  id: 'DRV001',
  fullName: '張司機',
  phoneNumber: '0912345678',
  idNumber: 'A123456789',
  rating: 4.8,
  totalOrders: 1240,
  joinDate: '2023-03-15',
  status: 'active'
};
```

### 駕照資料
```typescript
interface DriverLicense {
  licenseNumber: string;      // 駕照號碼
  licenseExpiry: string;      // 到期日 (YYYY-MM-DD)
  licenseClass: 'A1' | 'A2' | 'B' | 'C' | 'D'; // 駕照類別
  issueDate: string;          // 發照日期
  isValid: boolean;           // 是否有效
}

// 範例資料
const licenseExample: DriverLicense = {
  licenseNumber: 'L123456789',
  licenseExpiry: '2025-12-31',
  licenseClass: 'B',
  issueDate: '2020-01-15',
  isValid: true
};
```

### 車輛資料
```typescript
interface Vehicle {
  id: string;
  brand: string;              // 車輛品牌
  model: string;              // 車輛型號
  year: string;               // 出廠年份
  plate: string;              // 車牌號碼
  color: string;              // 車輛顏色
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'; // 燃料類型
  capacity: number;           // 載重量 (公斤)
  status: 'active' | 'maintenance' | 'retired'; // 車輛狀態
}

// 範例資料
const vehicleExample: Vehicle = {
  id: 'VEH001',
  brand: 'Toyota',
  model: 'Vios',
  year: '2020',
  plate: 'ABC-1234',
  color: '白色',
  fuelType: 'gasoline',
  capacity: 500,
  status: 'active'
};
```

### 緊急聯絡人
```typescript
interface EmergencyContact {
  name: string;               // 聯絡人姓名
  phone: string;              // 聯絡電話
  relation: string;           // 關係 (配偶、父母、子女等)
  address?: string;           // 地址 (選填)
}

// 範例資料
const emergencyExample: EmergencyContact = {
  name: '張太太',
  phone: '0987654321',
  relation: '配偶',
  address: '台北市中正區重慶南路一段122號'
};
```

### 銀行資料
```typescript
interface BankAccount {
  bankName: string;           // 銀行名稱
  bankCode: string;           // 銀行代碼
  accountNumber: string;      // 帳號
  accountHolder: string;      // 戶名
  isVerified: boolean;        // 是否已驗證
}

// 範例資料
const bankExample: BankAccount = {
  bankName: '台灣銀行',
  bankCode: '004',
  accountNumber: '123456789012',
  accountHolder: '張司機',
  isVerified: true
};
```

---

## 📦 訂單資料結構

### 訂單基本資料
```typescript
interface Order {
  id: string;                 // 訂單編號 (格式: BF + YYYYMMDD + 序號)
  driverId: string;           // 司機ID
  customerId: string;         // 客戶ID
  status: OrderStatus;        // 訂單狀態
  pickup: Location;           // 提貨地點
  dropoff: Location;          // 卸貨地點
  customer: CustomerInfo;     // 客戶資訊
  fee: number;                // 費用 (新台幣)
  distance: number;           // 距離 (公里)
  estimatedTime: number;      // 預計時間 (分鐘)
  actualTime?: number;        // 實際時間 (分鐘)
  createdAt: string;          // 建立時間
  completedAt?: string;       // 完成時間
  notes?: string;             // 備註
}

type OrderStatus = 
  | 'pending'           // 待確認
  | 'accepted'          // 已接受
  | 'pickup_going'      // 前往提貨
  | 'pickup_arrived'    // 到達提貨
  | 'pickup_completed'  // 提貨完成
  | 'delivery_going'    // 前往卸貨
  | 'delivery_arrived'  // 到達卸貨
  | 'delivery_completed'// 卸貨完成
  | 'completed'         // 已完成
  | 'cancelled';        // 已取消

interface Location {
  address: string;            // 地址
  latitude: number;           // 緯度
  longitude: number;          // 經度
  contactPerson?: string;     // 聯絡人
  contactPhone?: string;      // 聯絡電話
  notes?: string;             // 地點備註
}

interface CustomerInfo {
  name: string;               // 客戶姓名
  phone: string;              // 客戶電話
  company?: string;           // 公司名稱
}

// 範例訂單資料
const orderExample: Order = {
  id: 'BF202412251001',
  driverId: 'DRV001',
  customerId: 'CUST001',
  status: 'pickup_going',
  pickup: {
    address: '台北市中正區重慶南路一段122號',
    latitude: 25.0330,
    longitude: 121.5654,
    contactPerson: '王先生',
    contactPhone: '0912345678'
  },
  dropoff: {
    address: '台北市信義區市府路45號',
    latitude: 25.0408,
    longitude: 121.5598,
    contactPerson: '李小姐',
    contactPhone: '0987654321'
  },
  customer: {
    name: '王先生',
    phone: '0912345678',
    company: 'ABC公司'
  },
  fee: 280,
  distance: 12.5,
  estimatedTime: 15,
  createdAt: '2024-12-25T14:30:00Z',
  notes: '請小心搬運'
};
```

### 訂單狀態對應
```typescript
const statusMap = {
  pending: { text: '待確認', color: '#FF9500' },
  accepted: { text: '已接受', color: '#007AFF' },
  pickup_going: { text: '前往提貨', color: '#007AFF' },
  pickup_arrived: { text: '到達提貨', color: '#FF9500' },
  pickup_completed: { text: '提貨完成', color: '#34C759' },
  delivery_going: { text: '前往卸貨', color: '#007AFF' },
  delivery_arrived: { text: '到達卸貨', color: '#FF9500' },
  delivery_completed: { text: '卸貨完成', color: '#34C759' },
  completed: { text: '已完成', color: '#666666' },
  cancelled: { text: '已取消', color: '#FF3B30' }
};
```

---

## 💰 收入資料結構

### 收入統計
```typescript
interface EarningsData {
  period: 'today' | 'week' | 'month' | 'year';
  total: number;              // 總收入
  orders: number;             // 訂單數量
  hours: number;              // 工作時數
  average: number;            // 平均單價
  startDate: string;          // 開始日期
  endDate: string;            // 結束日期
}

// 範例收入資料
const earningsExamples = {
  today: {
    period: 'today' as const,
    total: 1240,
    orders: 8,
    hours: 6.5,
    average: 155,
    startDate: '2024-12-25',
    endDate: '2024-12-25'
  },
  week: {
    period: 'week' as const,
    total: 8680,
    orders: 45,
    hours: 32,
    average: 193,
    startDate: '2024-12-19',
    endDate: '2024-12-25'
  },
  month: {
    period: 'month' as const,
    total: 35420,
    orders: 180,
    hours: 128,
    average: 197,
    startDate: '2024-12-01',
    endDate: '2024-12-31'
  }
};
```

### 收入明細
```typescript
interface EarningRecord {
  id: string;                 // 記錄ID
  orderId: string;            // 訂單ID
  driverId: string;           // 司機ID
  amount: number;             // 金額
  date: string;               // 日期
  customer: string;           // 客戶名稱
  status: 'paid' | 'pending' | 'processing'; // 狀態
  paymentMethod: 'cash' | 'transfer' | 'app'; // 付款方式
  commission: number;         // 平台抽成
  netAmount: number;          // 實際收入
}

// 範例收入明細
const earningRecords: EarningRecord[] = [
  {
    id: 'ER001',
    orderId: 'BF202412251001',
    driverId: 'DRV001',
    amount: 280,
    date: '2024-12-25T14:30:00Z',
    customer: '王先生',
    status: 'paid',
    paymentMethod: 'app',
    commission: 28,
    netAmount: 252
  },
  {
    id: 'ER002',
    orderId: 'BF202412251002',
    driverId: 'DRV001',
    amount: 350,
    date: '2024-12-25T13:15:00Z',
    customer: '李小姐',
    status: 'paid',
    paymentMethod: 'cash',
    commission: 35,
    netAmount: 315
  }
];
```

### 提現記錄
```typescript
interface WithdrawalRecord {
  id: string;                 // 提現ID
  driverId: string;           // 司機ID
  amount: number;             // 提現金額
  fee: number;                // 手續費
  netAmount: number;          // 實際到帳金額
  bankAccount: string;        // 銀行帳號
  status: 'pending' | 'processing' | 'completed' | 'failed'; // 狀態
  requestDate: string;        // 申請日期
  processedDate?: string;     // 處理日期
  notes?: string;             // 備註
}

// 範例提現記錄
const withdrawalExample: WithdrawalRecord = {
  id: 'WD001',
  driverId: 'DRV001',
  amount: 5000,
  fee: 15,
  netAmount: 4985,
  bankAccount: '123456789012',
  status: 'completed',
  requestDate: '2024-12-20T10:00:00Z',
  processedDate: '2024-12-21T14:30:00Z',
  notes: '正常提現'
};
```

---

## 💬 訊息資料結構

### 對話記錄
```typescript
interface Conversation {
  id: string;                 // 對話ID
  type: 'customer' | 'support' | 'system'; // 對話類型
  participants: string[];     // 參與者ID列表
  name: string;               // 顯示名稱
  orderId?: string;           // 關聯訂單ID (客戶對話)
  lastMessage: string;        // 最後一則訊息
  lastMessageTime: string;    // 最後訊息時間
  unreadCount: number;        // 未讀數量
  status: 'active' | 'archived' | 'blocked'; // 狀態
}

// 範例對話
const conversationExamples: Conversation[] = [
  {
    id: 'CONV001',
    type: 'customer',
    participants: ['DRV001', 'CUST001'],
    name: '王先生',
    orderId: 'BF202412251001',
    lastMessage: '司機大哥，我在大樓一樓等您',
    lastMessageTime: '2024-12-25T14:35:00Z',
    unreadCount: 1,
    status: 'active'
  },
  {
    id: 'CONV002',
    type: 'support',
    participants: ['DRV001', 'SUPPORT001'],
    name: '客服中心',
    lastMessage: '您好，關於您的提現申請已處理完成',
    lastMessageTime: '2024-12-25T12:20:00Z',
    unreadCount: 0,
    status: 'active'
  }
];
```

### 訊息記錄
```typescript
interface Message {
  id: string;                 // 訊息ID
  conversationId: string;     // 對話ID
  senderId: string;           // 發送者ID
  senderType: 'driver' | 'customer' | 'support' | 'system'; // 發送者類型
  content: string;            // 訊息內容
  type: 'text' | 'image' | 'file' | 'location'; // 訊息類型
  timestamp: string;          // 時間戳
  status: 'sent' | 'delivered' | 'read'; // 狀態
  metadata?: any;             // 額外資料 (圖片URL、檔案資訊等)
}

// 範例訊息
const messageExamples: Message[] = [
  {
    id: 'MSG001',
    conversationId: 'CONV001',
    senderId: 'CUST001',
    senderType: 'customer',
    content: '司機大哥，請問還要多久到？',
    type: 'text',
    timestamp: '2024-12-25T14:30:00Z',
    status: 'read'
  },
  {
    id: 'MSG002',
    conversationId: 'CONV001',
    senderId: 'DRV001',
    senderType: 'driver',
    content: '大概還有5分鐘，馬上到',
    type: 'text',
    timestamp: '2024-12-25T14:32:00Z',
    status: 'delivered'
  }
];
```

### 系統通知
```typescript
interface SystemNotification {
  id: string;                 // 通知ID
  driverId: string;           // 司機ID
  title: string;              // 標題
  content: string;            // 內容
  type: 'earnings' | 'system' | 'order' | 'promotion'; // 類型
  priority: 'low' | 'medium' | 'high' | 'urgent'; // 優先級
  timestamp: string;          // 時間戳
  isRead: boolean;            // 是否已讀
  actionUrl?: string;         // 操作連結
  expiryDate?: string;        // 過期日期
}

// 範例通知
const notificationExamples: SystemNotification[] = [
  {
    id: 'NOTIF001',
    driverId: 'DRV001',
    title: '收入結算通知',
    content: '您的本週收入已結算完成，共計 NT$8,680',
    type: 'earnings',
    priority: 'medium',
    timestamp: '2024-12-25T10:00:00Z',
    isRead: false
  },
  {
    id: 'NOTIF002',
    driverId: 'DRV001',
    title: '系統維護通知',
    content: '系統將於今晚 23:00-01:00 進行維護升級',
    type: 'system',
    priority: 'high',
    timestamp: '2024-12-25T08:00:00Z',
    isRead: true
  }
];
```

---

## ⚙️ 系統設定資料

### 應用設定
```typescript
interface AppSettings {
  driverId: string;           // 司機ID
  language: 'zh-TW' | 'zh-CN' | 'en'; // 語言設定
  theme: 'light' | 'dark' | 'auto'; // 主題設定
  notifications: NotificationSettings; // 通知設定
  privacy: PrivacySettings;   // 隱私設定
  location: LocationSettings; // 位置設定
  sound: SoundSettings;       // 聲音設定
}

interface NotificationSettings {
  orderNotifications: boolean;     // 訂單通知
  messageNotifications: boolean;   // 訊息通知
  earningsNotifications: boolean;  // 收入通知
  systemNotifications: boolean;    // 系統通知
  pushNotifications: boolean;      // 推播通知
  emailNotifications: boolean;     // 電子郵件通知
  smsNotifications: boolean;       // 簡訊通知
}

interface PrivacySettings {
  shareLocation: boolean;          // 分享位置
  shareProfile: boolean;           // 分享個人資料
  allowDataCollection: boolean;    // 允許數據收集
  allowAnalytics: boolean;         // 允許分析
}

interface LocationSettings {
  autoLocation: boolean;           // 自動定位
  backgroundLocation: boolean;     // 背景定位
  locationAccuracy: 'high' | 'medium' | 'low'; // 定位精度
}

interface SoundSettings {
  orderSound: boolean;             // 訂單聲音
  messageSound: boolean;           // 訊息聲音
  navigationSound: boolean;        // 導航聲音
  volume: number;                  // 音量 (0-100)
}

// 範例設定
const settingsExample: AppSettings = {
  driverId: 'DRV001',
  language: 'zh-TW',
  theme: 'auto',
  notifications: {
    orderNotifications: true,
    messageNotifications: true,
    earningsNotifications: true,
    systemNotifications: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true
  },
  privacy: {
    shareLocation: true,
    shareProfile: false,
    allowDataCollection: true,
    allowAnalytics: true
  },
  location: {
    autoLocation: true,
    backgroundLocation: true,
    locationAccuracy: 'high'
  },
  sound: {
    orderSound: true,
    messageSound: true,
    navigationSound: true,
    volume: 80
  }
};
```

---

## 📊 統計資料結構

### 司機績效統計
```typescript
interface DriverPerformance {
  driverId: string;           // 司機ID
  period: string;             // 統計期間
  totalOrders: number;        // 總訂單數
  completedOrders: number;    // 完成訂單數
  cancelledOrders: number;    // 取消訂單數
  totalEarnings: number;      // 總收入
  totalDistance: number;      // 總里程
  totalHours: number;         // 總工作時數
  averageRating: number;      // 平均評分
  onTimeRate: number;         // 準時率 (%)
  completionRate: number;     // 完成率 (%)
  customerSatisfaction: number; // 客戶滿意度
}

// 範例績效資料
const performanceExample: DriverPerformance = {
  driverId: 'DRV001',
  period: '2024-12',
  totalOrders: 180,
  completedOrders: 175,
  cancelledOrders: 5,
  totalEarnings: 35420,
  totalDistance: 2850.5,
  totalHours: 128,
  averageRating: 4.8,
  onTimeRate: 95.2,
  completionRate: 97.2,
  customerSatisfaction: 4.7
};
```

### 工作時間記錄
```typescript
interface WorkSession {
  id: string;                 // 工作記錄ID
  driverId: string;           // 司機ID
  startTime: string;          // 開始時間
  endTime?: string;           // 結束時間
  duration?: number;          // 工作時長 (分鐘)
  status: 'online' | 'offline' | 'break'; // 狀態
  location?: {                // 位置資訊
    latitude: number;
    longitude: number;
    address: string;
  };
  ordersCompleted: number;    // 完成訂單數
  earningsGenerated: number;  // 產生收入
}

// 範例工作記錄
const workSessionExample: WorkSession = {
  id: 'WS001',
  driverId: 'DRV001',
  startTime: '2024-12-25T08:00:00Z',
  endTime: '2024-12-25T16:30:00Z',
  duration: 510,
  status: 'offline',
  location: {
    latitude: 25.0330,
    longitude: 121.5654,
    address: '台北市中正區'
  },
  ordersCompleted: 8,
  earningsGenerated: 1240
};
```

---

## 🔐 安全資料結構

### 登入記錄
```typescript
interface LoginRecord {
  id: string;                 // 記錄ID
  driverId: string;           // 司機ID
  loginTime: string;          // 登入時間
  logoutTime?: string;        // 登出時間
  ipAddress: string;          // IP地址
  deviceInfo: {               // 設備資訊
    platform: string;         // 平台 (iOS/Android/Web)
    version: string;          // 版本
    deviceId: string;         // 設備ID
  };
  location?: {                // 登入位置
    latitude: number;
    longitude: number;
    city: string;
  };
  status: 'active' | 'expired' | 'terminated'; // 狀態
}

// 範例登入記錄
const loginRecordExample: LoginRecord = {
  id: 'LOGIN001',
  driverId: 'DRV001',
  loginTime: '2024-12-25T08:00:00Z',
  logoutTime: '2024-12-25T18:00:00Z',
  ipAddress: '192.168.1.100',
  deviceInfo: {
    platform: 'iOS',
    version: '17.2',
    deviceId: 'iPhone12_ABC123'
  },
  location: {
    latitude: 25.0330,
    longitude: 121.5654,
    city: '台北市'
  },
  status: 'expired'
};
```

---

## 📱 應用版本資訊

### 版本管理
```typescript
interface AppVersion {
  version: string;            // 版本號
  buildNumber: number;        // 建置號
  releaseDate: string;        // 發布日期
  features: string[];         // 新功能
  bugFixes: string[];         // 錯誤修復
  isRequired: boolean;        // 是否強制更新
  downloadUrl?: string;       // 下載連結
  changelog: string;          // 更新日誌
}

// 當前版本資訊
const currentVersion: AppVersion = {
  version: '1.0.0',
  buildNumber: 1,
  releaseDate: '2024-12-25',
  features: [
    '完整的司機工作台',
    '訂單管理系統',
    '收入統計功能',
    '訊息中心',
    '個人資料管理'
  ],
  bugFixes: [
    '修復登入問題',
    '優化介面顯示',
    '提升系統穩定性'
  ],
  isRequired: false,
  changelog: '首次發布版本，包含完整的司機端功能'
};
```

---

## 🔄 API 端點資料

### API 路由配置
```typescript
const API_ENDPOINTS = {
  // 身份驗證
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password'
  },
  
  // 司機管理
  driver: {
    profile: '/api/driver/profile',
    updateProfile: '/api/driver/profile',
    vehicle: '/api/driver/vehicle',
    license: '/api/driver/license',
    bankAccount: '/api/driver/bank-account',
    workStatus: '/api/driver/work-status'
  },
  
  // 訂單管理
  orders: {
    list: '/api/orders',
    detail: '/api/orders/:id',
    accept: '/api/orders/:id/accept',
    updateStatus: '/api/orders/:id/status',
    complete: '/api/orders/:id/complete',
    cancel: '/api/orders/:id/cancel'
  },
  
  // 收入管理
  earnings: {
    summary: '/api/earnings/summary',
    records: '/api/earnings/records',
    withdraw: '/api/earnings/withdraw',
    withdrawHistory: '/api/earnings/withdraw-history'
  },
  
  // 訊息管理
  messages: {
    conversations: '/api/messages/conversations',
    messages: '/api/messages/:conversationId',
    send: '/api/messages/send',
    markRead: '/api/messages/:messageId/read'
  },
  
  // 通知管理
  notifications: {
    list: '/api/notifications',
    markRead: '/api/notifications/:id/read',
    settings: '/api/notifications/settings'
  },
  
  // 系統管理
  system: {
    version: '/api/system/version',
    settings: '/api/system/settings',
    support: '/api/system/support'
  }
};
```

---

## 📝 表單驗證規則

### 驗證規則配置
```typescript
const validationRules = {
  // 基本資料驗證
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 20,
    pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
    message: '請輸入正確的姓名格式'
  },
  
  phoneNumber: {
    required: true,
    length: 10,
    pattern: /^09\d{8}$/,
    message: '請輸入正確的手機號碼格式'
  },
  
  idNumber: {
    required: true,
    length: 10,
    pattern: /^[A-Z][12]\d{8}$/,
    message: '請輸入正確的身分證字號格式'
  },
  
  password: {
    required: true,
    minLength: 6,
    maxLength: 20,
    pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
    message: '密碼至少需要6個字元，包含英文和數字'
  },
  
  // 車輛資料驗證
  vehiclePlate: {
    required: true,
    pattern: /^[A-Z0-9]{3}-[A-Z0-9]{4}$/,
    message: '請輸入正確的車牌號碼格式 (例: ABC-1234)'
  },
  
  licenseNumber: {
    required: true,
    pattern: /^[A-Z0-9]{8,12}$/,
    message: '請輸入正確的駕照號碼格式'
  },
  
  // 銀行資料驗證
  bankAccount: {
    required: false,
    minLength: 10,
    maxLength: 16,
    pattern: /^\d+$/,
    message: '請輸入正確的銀行帳號格式'
  }
};
```

---

## 🎯 總結

這個完整的資料備份包含了 Black feather 司機端 APP 的所有資料結構、配置和規範，包括：

### ✅ 完整資料結構
- 司機個人資料、駕照、車輛資訊
- 訂單管理、狀態追蹤
- 收入統計、提現記錄
- 訊息對話、系統通知
- 應用設定、安全記錄

### ✅ 設計規範
- 完整的配色系統
- 字體規範定義
- UI/UX 設計標準

### ✅ 技術規範
- TypeScript 類型定義
- API 端點配置
- 表單驗證規則
- 版本管理資訊

### ✅ 範例資料
- 每個資料結構都包含完整的範例
- 實際的測試資料
- 常見的使用情境

這份備份可以作為：
- **開發參考** - 所有資料結構和類型定義
- **API 設計** - 後端開發的資料模型參考
- **測試資料** - 前端開發的模擬資料
- **文檔說明** - 完整的系統資料說明

您可以隨時參考這份備份來進行開發、修改或擴展功能！