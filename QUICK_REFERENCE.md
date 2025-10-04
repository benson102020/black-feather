# 司機端 APP 快速參考手冊

## 🚀 快速開始

### 立即運行項目
```bash
npm install
npm run dev
```

### 快速修改常見內容
```bash
# 修改應用名稱
編輯 app.json → "name": "您的應用名稱"

# 修改主色調
搜索並替換 #FFD700 → 您的顏色

# 修改應用圖標
替換 assets/images/icon.png
```

## 📱 頁面快速定位

| 功能 | 文件位置 | 主要修改點 |
|------|----------|------------|
| 🏠 啟動頁面 | `app/index.tsx` | 羽毛圖標、品牌顯示 |
| 🔐 登入頁面 | `app/auth/login.tsx` | 登入邏輯、表單驗證 |
| 📝 註冊頁面 | `app/auth/register.tsx` | 註冊步驟、表單欄位 |
| 🔑 忘記密碼 | `app/auth/forgot-password.tsx` | 驗證流程、簡訊發送 |
| 💼 工作台 | `app/(tabs)/index.tsx` | 上線狀態、訂單顯示 |
| 📦 訂單管理 | `app/(tabs)/orders.tsx` | 訂單列表、篩選功能 |
| 💰 收入統計 | `app/(tabs)/earnings.tsx` | 收入計算、統計圖表 |
| 💬 訊息中心 | `app/(tabs)/messages.tsx` | 聊天介面、通知管理 |
| 👤 個人中心 | `app/(tabs)/profile.tsx` | 個人資料、設定選項 |

## 🎨 樣式快速修改

### 顏色修改
```typescript
// 主要顏色
'#000000' → 您的主色
'#FFD700' → 您的強調色
'#f5f5f5' → 您的背景色

// 狀態顏色
'#34C759' → 成功色
'#FF9500' → 警告色
'#FF3B30' → 錯誤色
```

### 字體大小修改
```typescript
fontSize: 24 → 標題大小
fontSize: 18 → 副標題大小
fontSize: 16 → 內文大小
fontSize: 14 → 說明文字大小
fontSize: 12 → 小字大小
```

### 間距修改
```typescript
padding: 20 → 內邊距
margin: 16 → 外邊距
borderRadius: 12 → 圓角大小
```

## 🔧 功能快速修改

### 登入邏輯修改
```typescript
// 位置: app/auth/login.tsx
const handleLogin = async () => {
  // 修改 API 端點
  const response = await fetch('您的API端點', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, password })
  });
};
```

### 註冊步驟修改
```typescript
// 位置: app/auth/register.tsx
// 修改總步驟數
if (step < 7) { // 改成您要的步驟數
  setStep(step + 1);
}

// 添加新步驟
case 7:
  return (
    <View>
      {/* 您的新步驟內容 */}
    </View>
  );
```

### 訂單狀態修改
```typescript
// 位置: app/(tabs)/orders.tsx
const statusMap = {
  pending: { text: '待確認', color: '#FF9500' },
  // 添加新狀態
  urgent: { text: '緊急', color: '#FF3B30' },
};
```

### 收入統計修改
```typescript
// 位置: app/(tabs)/earnings.tsx
const periods = [
  { key: 'today', label: '今日' },
  // 添加新期間
  { key: 'quarter', label: '本季' },
];
```

## 📋 Tab 導航修改

### 添加新 Tab
```typescript
// 位置: app/(tabs)/_layout.tsx
<Tabs.Screen
  name="new-tab"
  options={{
    title: '新功能',
    tabBarIcon: ({ size, color }) => (
      <NewIcon size={size} color={color} />
    ),
  }}
/>
```

### 修改 Tab 圖標
```typescript
// 導入新圖標
import { NewIcon } from 'lucide-react-native';

// 使用新圖標
tabBarIcon: ({ size, color }) => (
  <NewIcon size={size} color={color} />
)
```

## 🎯 圖標快速替換

### 常用圖標對照表
| 功能 | 當前圖標 | 替換建議 |
|------|----------|----------|
| 工作台 | `Chrome` | `Home`, `Briefcase`, `Activity` |
| 訂單 | `Package` | `ClipboardList`, `Truck`, `Box` |
| 收入 | `DollarSign` | `Wallet`, `CreditCard`, `TrendingUp` |
| 訊息 | `MessageSquare` | `Mail`, `MessageCircle`, `Bell` |
| 個人 | `User` | `UserCircle`, `Settings`, `Profile` |

### 圖標使用方式
```typescript
import { NewIcon } from 'lucide-react-native';

<NewIcon 
  size={24}           // 大小
  color="#FFD700"     // 顏色
  strokeWidth={2}     // 線條粗細
/>
```

## 🔄 狀態管理快速設置

### 簡單狀態
```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);
const [error, setError] = useState(null);
```

### 表單狀態
```typescript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
});

const updateField = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

## 📱 響應式設計快速調整

### 屏幕尺寸適配
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width > 768 ? '50%' : '100%', // 平板適配
  },
});
```

### 平台特定樣式
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      ios: { fontFamily: 'Helvetica' },
      android: { fontFamily: 'Roboto' },
      web: { fontFamily: 'Arial' },
    }),
  },
});
```

## 🚨 常見問題快速解決

### Metro 緩存問題
```bash
npx expo start --clear
```

### 依賴安裝問題
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript 錯誤
```bash
npx expo install --fix
```

### 圖標不顯示
```typescript
// 確保正確導入
import { IconName } from 'lucide-react-native';

// 檢查圖標名稱是否正確
<IconName size={24} color="#FFD700" />
```

## 📋 測試檢查清單

### 功能測試
- [ ] 所有頁面可以正常導航
- [ ] 表單輸入和驗證正常
- [ ] 按鈕點擊有正確反應
- [ ] 圖標正常顯示
- [ ] 樣式在不同屏幕尺寸下正常

### 性能測試
- [ ] 頁面載入速度正常
- [ ] 滑動操作流暢
- [ ] 記憶體使用合理
- [ ] 無明顯卡頓

### 兼容性測試
- [ ] iOS 設備正常運行
- [ ] Android 設備正常運行
- [ ] Web 瀏覽器正常顯示

## 🔗 有用的連結

- [Expo 官方文檔](https://docs.expo.dev/)
- [React Native 官方文檔](https://reactnative.dev/)
- [Lucide 圖標庫](https://lucide.dev/)
- [TypeScript 官方文檔](https://www.typescriptlang.org/)

---

**使用此快速參考手冊，您可以快速完成大部分常見的修改任務！**