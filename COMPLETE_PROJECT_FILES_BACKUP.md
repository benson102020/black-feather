# Black feather 司機端 APP - 完整檔案備份

## 📋 項目概述
- **項目名稱**: Black feather 司機端 APP
- **技術棧**: React Native + Expo + TypeScript
- **版本**: v1.0.0
- **備份日期**: 2024年12月

---

## 📁 完整檔案列表

### 1. 配置檔案

#### package.json
```json
{
  "name": "bolt-expo-starter",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "EXPO_NO_TELEMETRY=1 expo start",
    "build:web": "expo export --platform web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@lucide/lab": "^0.1.2",
    "@react-navigation/bottom-tabs": "^7.2.0",
    "@react-navigation/native": "^7.0.14",
    "expo": "^53.0.0",
    "expo-blur": "~14.1.3",
    "expo-camera": "~16.1.5",
    "expo-constants": "~17.1.3",
    "expo-font": "~13.2.2",
    "expo-haptics": "~14.1.3",
    "expo-linear-gradient": "^15.0.7",
    "expo-linking": "~7.1.3",
    "expo-router": "~5.0.2",
    "expo-splash-screen": "~0.30.6",
    "expo-status-bar": "~2.2.2",
    "expo-symbols": "~0.4.3",
    "expo-system-ui": "~5.0.5",
    "expo-web-browser": "~14.1.5",
    "lucide-react-native": "^0.475.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-native": "0.79.1",
    "react-native-gesture-handler": "~2.24.0",
    "react-native-reanimated": "~3.17.4",
    "react-native-safe-area-context": "5.3.0",
    "react-native-screens": "~4.10.0",
    "react-native-svg": "15.11.2",
    "react-native-url-polyfill": "^2.0.0",
    "react-native-web": "^0.20.0",
    "react-native-webview": "13.13.5"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.0.10",
    "typescript": "~5.8.3"
  }
}
```

#### tsconfig.json
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "nativewind-env.d.ts"
  ]
}
```

#### app.json
```json
{
  "expo": {
    "name": "bolt-expo-nativewind",
    "slug": "bolt-expo-nativewind",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "web": {
      "bundler": "metro",
      "output": "single",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": ["expo-router", "expo-font", "expo-web-browser"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

#### .prettierrc
```json
{
  "useTabs": false,
  "bracketSpacing": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

#### .npmrc
```
legacy-peer-deps=true
```

---

### 2. Hooks

#### hooks/useFrameworkReady.ts
```typescript
import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.();
  });
}
```

---

### 3. 應用程式入口和佈局

#### app/index.tsx
```typescript
import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  useEffect(() => {
    // 延遲導航確保路由器已準備就緒
    const timer = setTimeout(() => {
      // 檢查是否已登入（這裡模擬檢查邏輯）
      const isLoggedIn = false;
      
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 顯示啟動畫面
  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#333333']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.featherIcon}>🪶</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: '#FFD700',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  featherIcon: {
    fontSize: 48,
    color: '#000000',
  },
});
```

#### app/_layout.tsx
```typescript
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
```

#### app/+not-found.tsx
```typescript
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
```

---

### 4. 身份驗證模組

#### app/auth/login.tsx
```typescript
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Phone, Lock, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('錯誤', '請輸入手機號碼和密碼');
      return;
    }

    if (phoneNumber.length !== 10) {
      Alert.alert('錯誤', '請輸入正確的手機號碼格式');
      return;
    }

    setLoading(true);

    try {
      // 模擬登入 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 登入成功，導航到主頁面
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('登入失敗', '請檢查您的手機號碼和密碼');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#333333']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Black feather</Text>
            <View style={styles.featherIcon}>
              <Text style={styles.featherText}>🪶</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>司機端</Text>
          <Text style={styles.welcome}>歡迎回來，開始今日的工作</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Phone size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="請輸入手機號碼"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="請輸入密碼"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 
                <Eye size={20} color="#999" /> : 
                <EyeOff size={20} color="#999" />
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>忘記密碼？</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? '登入中...' : '登入'}
            </Text>
            {!loading && <ArrowRight size={20} color="#000" />}
          </TouchableOpacity>
        </View>

        <View style={styles.registerSection}>
          <Text style={styles.registerPrompt}>還沒有帳號？</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.registerButtonText}>立即註冊</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.securityNote}>
            <Lock size={16} color="#666" />
            <Text style={styles.securityText}>
              您的帳號受到安全保護，支援單點登入檢測
            </Text>
          </View>
          
          <Text style={styles.versionText}>
            Black feather Driver v1.0.0
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
  },
  featherIcon: {
    marginLeft: 10,
    transform: [{ rotate: '15deg' }],
  },
  featherText: {
    fontSize: 30,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 30,
    letterSpacing: 1,
  },
  welcome: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#FFD700',
    fontSize: 14,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#666',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    alignItems: 'center',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  securityText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  versionText: {
    color: '#555',
    fontSize: 12,
  },
  registerSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  registerPrompt: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  registerButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### app/auth/register.tsx
```typescript
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Phone, Lock, User, Car, FileText, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // 基本資料
    fullName: '',
    phoneNumber: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
    
    // 駕照資料
    licenseNumber: '',
    licenseExpiry: '',
    licenseClass: 'B', // A1, A2, B, C, D
    
    // 車輛資料
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    vehicleColor: '',
    
    // 緊急聯絡人
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    
    // 銀行資料
    bankName: '',
    bankAccount: '',
    accountHolder: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.phoneNumber || !formData.idNumber) {
          Alert.alert('錯誤', '請填寫所有必填欄位');
          return false;
        }
        if (formData.phoneNumber.length !== 10) {
          Alert.alert('錯誤', '請輸入正確的手機號碼格式');
          return false;
        }
        if (formData.idNumber.length !== 10) {
          Alert.alert('錯誤', '請輸入正確的身分證字號');
          return false;
        }
        break;
      case 2:
        if (!formData.password || !formData.confirmPassword) {
          Alert.alert('錯誤', '請設定密碼');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert('錯誤', '密碼確認不一致');
          return false;
        }
        if (formData.password.length < 6) {
          Alert.alert('錯誤', '密碼至少需要6個字元');
          return false;
        }
        break;
      case 3:
        if (!formData.licenseNumber || !formData.licenseExpiry) {
          Alert.alert('錯誤', '請填寫駕照資料');
          return false;
        }
        break;
      case 4:
        if (!formData.vehicleBrand || !formData.vehicleModel || !formData.vehiclePlate) {
          Alert.alert('錯誤', '請填寫車輛基本資料');
          return false;
        }
        break;
      case 5:
        if (!formData.emergencyName || !formData.emergencyPhone) {
          Alert.alert('錯誤', '請填寫緊急聯絡人資料');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 6) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 模擬註冊 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        '註冊成功',
        '您的申請已提交，我們將在1-3個工作天內審核您的資料，審核通過後將以簡訊通知您。',
        [
          { 
            text: '確定', 
            onPress: () => router.replace('/auth/login')
          }
        ]
      );
    } catch (error) {
      Alert.alert('註冊失敗', '請稍後再試或聯絡客服');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>基本資料</Text>
            <Text style={styles.stepSubtitle}>請填寫您的個人基本資料</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="真實姓名 *"
                placeholderTextColor="#999"
                value={formData.fullName}
                onChangeText={(value) => updateFormData('fullName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Phone size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="手機號碼 *"
                placeholderTextColor="#999"
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormData('phoneNumber', value)}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <FileText size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="身分證字號 *"
                placeholderTextColor="#999"
                value={formData.idNumber}
                onChangeText={(value) => updateFormData('idNumber', value.toUpperCase())}
                maxLength={10}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>設定密碼</Text>
            <Text style={styles.stepSubtitle}>請設定您的登入密碼</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="設定密碼 (至少6個字元) *"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <Eye size={20} color="#999" /> : 
                  <EyeOff size={20} color="#999" />
                }
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="確認密碼 *"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 
                  <Eye size={20} color="#999" /> : 
                  <EyeOff size={20} color="#999" />
                }
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>駕照資料</Text>
            <Text style={styles.stepSubtitle}>請提供您的駕照相關資訊</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <FileText size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="駕照號碼 *"
                placeholderTextColor="#999"
                value={formData.licenseNumber}
                onChangeText={(value) => updateFormData('licenseNumber', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Text style={styles.dateIcon}>📅</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="駕照到期日 (YYYY/MM/DD) *"
                placeholderTextColor="#999"
                value={formData.licenseExpiry}
                onChangeText={(value) => updateFormData('licenseExpiry', value)}
              />
            </View>

            <Text style={styles.noteText}>
              * 我們將在審核時驗證您的駕照資料
            </Text>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>車輛資料</Text>
            <Text style={styles.stepSubtitle}>請填寫您的車輛資訊</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Car size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="車輛品牌 *"
                placeholderTextColor="#999"
                value={formData.vehicleBrand}
                onChangeText={(value) => updateFormData('vehicleBrand', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Car size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="車輛型號 *"
                placeholderTextColor="#999"
                value={formData.vehicleModel}
                onChangeText={(value) => updateFormData('vehicleModel', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Text style={styles.yearIcon}>📅</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="出廠年份"
                placeholderTextColor="#999"
                value={formData.vehicleYear}
                onChangeText={(value) => updateFormData('vehicleYear', value)}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Text style={styles.plateIcon}>🚗</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="車牌號碼 *"
                placeholderTextColor="#999"
                value={formData.vehiclePlate}
                onChangeText={(value) => updateFormData('vehiclePlate', value.toUpperCase())}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Text style={styles.colorIcon}>🎨</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="車輛顏色"
                placeholderTextColor="#999"
                value={formData.vehicleColor}
                onChangeText={(value) => updateFormData('vehicleColor', value)}
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>緊急聯絡人</Text>
            <Text style={styles.stepSubtitle}>請提供緊急聯絡人資訊</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="聯絡人姓名 *"
                placeholderTextColor="#999"
                value={formData.emergencyName}
                onChangeText={(value) => updateFormData('emergencyName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Phone size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="聯絡人電話 *"
                placeholderTextColor="#999"
                value={formData.emergencyPhone}
                onChangeText={(value) => updateFormData('emergencyPhone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Text style={styles.relationIcon}>👥</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="關係 (如：配偶、父母、子女)"
                placeholderTextColor="#999"
                value={formData.emergencyRelation}
                onChangeText={(value) => updateFormData('emergencyRelation', value)}
              />
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>銀行資料</Text>
            <Text style={styles.stepSubtitle}>用於收入提現 (選填)</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Text style={styles.bankIcon}>🏦</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="銀行名稱"
                placeholderTextColor="#999"
                value={formData.bankName}
                onChangeText={(value) => updateFormData('bankName', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Text style={styles.accountIcon}>💳</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="銀行帳號"
                placeholderTextColor="#999"
                value={formData.bankAccount}
                onChangeText={(value) => updateFormData('bankAccount', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="戶名"
                placeholderTextColor="#999"
                value={formData.accountHolder}
                onChangeText={(value) => updateFormData('accountHolder', value)}
              />
            </View>

            <Text style={styles.noteText}>
              * 銀行資料可於註冊後在個人中心補填
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#333333']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                if (step > 1) {
                  setStep(step - 1);
                } else {
                  router.back();
                }
              }}
            >
              <ArrowLeft size={24} color="#FFD700" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>司機註冊</Text>
              <Text style={styles.stepIndicator}>步驟 {step} / 6</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(step / 6) * 100}%` }]} />
            </View>
          </View>

          {renderStep()}

          <TouchableOpacity
            style={[styles.nextButton, loading && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={loading}
          >
            <Text style={styles.nextButtonText}>
              {loading ? '處理中...' : step === 6 ? '提交申請' : '下一步'}
            </Text>
            {!loading && <ArrowRight size={20} color="#000" />}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.agreementText}>
              點擊「提交申請」即表示您同意我們的
              <Text style={styles.linkText}> 服務條款 </Text>
              和
              <Text style={styles.linkText}> 隱私政策</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  stepContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  dateIcon: {
    fontSize: 20,
  },
  yearIcon: {
    fontSize: 20,
  },
  plateIcon: {
    fontSize: 20,
  },
  colorIcon: {
    fontSize: 20,
  },
  relationIcon: {
    fontSize: 20,
  },
  bankIcon: {
    fontSize: 20,
  },
  accountIcon: {
    fontSize: 20,
  },
  noteText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#666',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  agreementText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
});
```

#### app/auth/forgot-password.tsx
```typescript
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, ArrowLeft, ArrowRight, MessageSquare, Lock } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState(1); // 1: 輸入手機號碼, 2: 輸入驗證碼, 3: 設定新密碼
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 發送驗證碼
  const sendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert('錯誤', '請輸入正確的手機號碼');
      return;
    }

    setLoading(true);
    try {
      // 模擬發送驗證碼 API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('驗證碼已發送', `驗證碼已發送至 ${phoneNumber}，請查收簡訊`);
      setStep(2);
      
      // 開始倒數計時
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      Alert.alert('發送失敗', '驗證碼發送失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 驗證驗證碼
  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('錯誤', '請輸入6位數驗證碼');
      return;
    }

    setLoading(true);
    try {
      // 模擬驗證 API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 這裡可以加入實際的驗證邏輯
      if (verificationCode === '123456') { // 模擬驗證成功
        setStep(3);
      } else {
        Alert.alert('驗證失敗', '驗證碼錯誤，請重新輸入');
      }
    } catch (error) {
      Alert.alert('驗證失敗', '驗證過程發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 重設密碼
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('錯誤', '請輸入新密碼');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('錯誤', '密碼至少需要6個字元');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('錯誤', '密碼確認不一致');
      return;
    }

    setLoading(true);
    try {
      // 模擬重設密碼 API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '密碼重設成功',
        '您的密碼已成功重設，請使用新密碼登入',
        [
          {
            text: '確定',
            onPress: () => router.replace('/auth/login')
          }
        ]
      );
    } catch (error) {
      Alert.alert('重設失敗', '密碼重設失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>忘記密碼</Text>
            <Text style={styles.stepSubtitle}>請輸入您的手機號碼，我們將發送驗證碼給您</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Phone size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="請輸入手機號碼"
                placeholderTextColor="#999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              style={[styles.actionButton, loading && styles.actionButtonDisabled]}
              onPress={sendVerificationCode}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>
                {loading ? '發送中...' : '發送驗證碼'}
              </Text>
              {!loading && <ArrowRight size={20} color="#000" />}
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>輸入驗證碼</Text>
            <Text style={styles.stepSubtitle}>
              驗證碼已發送至 {phoneNumber}，請輸入6位數驗證碼
            </Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <MessageSquare size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="請輸入6位數驗證碼"
                placeholderTextColor="#999"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>沒收到驗證碼？</Text>
              <TouchableOpacity
                onPress={countdown === 0 ? sendVerificationCode : undefined}
                disabled={countdown > 0}
              >
                <Text style={[
                  styles.resendButton,
                  countdown > 0 && styles.resendButtonDisabled
                ]}>
                  {countdown > 0 ? `重新發送 (${countdown}s)` : '重新發送'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, loading && styles.actionButtonDisabled]}
              onPress={verifyCode}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>
                {loading ? '驗證中...' : '驗證'}
              </Text>
              {!loading && <ArrowRight size={20} color="#000" />}
            </TouchableOpacity>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>設定新密碼</Text>
            <Text style={styles.stepSubtitle}>請設定您的新密碼</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="請輸入新密碼 (至少6個字元)"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="請確認新密碼"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.actionButton, loading && styles.actionButtonDisabled]}
              onPress={resetPassword}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>
                {loading ? '重設中...' : '重設密碼'}
              </Text>
              {!loading && <ArrowRight size={20} color="#000" />}
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#333333']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                router.back();
              }
            }}
          >
            <ArrowLeft size={24} color="#FFD700" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>重設密碼</Text>
            <Text style={styles.stepIndicator}>步驟 {step} / 3</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>
        </View>

        {renderStep()}

        <View style={styles.footer}>
          <Text style={styles.securityNote}>
            為了您的帳號安全，請妥善保管您的新密碼
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    color: '#ccc',
    fontSize: 14,
    marginRight: 8,
  },
  resendButton: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  actionButtonDisabled: {
    backgroundColor: '#666',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  securityNote: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
```

---

### 5. 主要功能頁面

#### app/(tabs)/_layout.tsx
```typescript
import { Tabs } from 'expo-router';
import { Chrome as Home, Package, DollarSign, User, MessageSquare } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopColor: '#FFD700',
            borderTopWidth: 1,
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#666666',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '工作台',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: '訂單',
            tabBarIcon: ({ size, color }) => (
              <Package size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            title: '收入',
            tabBarIcon: ({ size, color }) => (
              <DollarSign size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: '訊息',
            tabBarIcon: ({ size, color }) => (
              <MessageSquare size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '個人',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" backgroundColor="#000000" />
    </>
  );
}
```

#### app/(tabs)/index.tsx - 工作台
```typescript
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Power, Navigation, MapPin, Clock, Phone, TriangleAlert as AlertTriangle, Camera } from 'lucide-react-native';

export default function WorkspaceScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    id: 'BF202412251001',
    status: 'pickup_going',
    pickup: '台北市中正區重慶南路一段122號',
    dropoff: '台北市信義區市府路45號',
    customer: '王先生',
    estimatedTime: '15分鐘',
    fee: 'NT$280'
  });

  const statusMap = {
    pickup_going: '前往提貨',
    pickup_arrived: '到達提貨',
    pickup_completed: '提貨完成',
    delivery_going: '前往卸貨',
    delivery_arrived: '到達卸貨',
    delivery_completed: '卸貨完成'
  };

  const handleStatusChange = () => {
    const statuses = Object.keys(statusMap);
    const currentIndex = statuses.indexOf(currentOrder.status);
    const nextStatus = statuses[currentIndex + 1];
    
    if (nextStatus) {
      setCurrentOrder(prev => ({ ...prev, status: nextStatus }));
      Alert.alert('狀態更新', `已更新為：${statusMap[nextStatus as keyof typeof statusMap]}`);
    } else {
      Alert.alert('訂單完成', '恭喜完成本次訂單！');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Black feather</Text>
            <Text style={styles.logoSubtext}>司機工作台</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.onlineToggle, isOnline && styles.onlineActive]}
            onPress={() => setIsOnline(!isOnline)}
          >
            <Power size={20} color={isOnline ? '#000' : '#FFD700'} />
            <Text style={[styles.toggleText, isOnline && styles.toggleTextActive]}>
              {isOnline ? '在線中' : '離線中'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {isOnline && currentOrder && (
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>訂單 #{currentOrder.id}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {statusMap[currentOrder.status as keyof typeof statusMap]}
              </Text>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <MapPin size={16} color="#FFD700" />
              <Text style={styles.locationText}>提貨: {currentOrder.pickup}</Text>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={16} color="#FF4444" />
              <Text style={styles.locationText}>卸貨: {currentOrder.dropoff}</Text>
            </View>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>客戶</Text>
              <Text style={styles.detailValue}>{currentOrder.customer}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>預計時間</Text>
              <Text style={styles.detailValue}>{currentOrder.estimatedTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>費用</Text>
              <Text style={styles.detailValue}>{currentOrder.fee}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('導航', '正在打開導航應用...')}>
              <Navigation size={18} color="#000" />
              <Text style={styles.actionButtonText}>導航</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('聯絡客戶', '正在撥打電話...')}>
              <Phone size={18} color="#000" />
              <Text style={styles.actionButtonText}>聯絡</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('拍照', '正在打開相機...')}>
              <Camera size={18} color="#000" />
              <Text style={styles.actionButtonText}>拍照</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.statusButton} onPress={handleStatusChange}>
            <Text style={styles.statusButtonText}>更新狀態</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isOnline && (
        <View style={styles.offlineCard}>
          <Power size={48} color="#666" />
          <Text style={styles.offlineTitle}>目前離線中</Text>
          <Text style={styles.offlineText}>點擊上方開關開始接單</Text>
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('客服', '正在連接客服中心...')}>
          <Phone size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>客服中心</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('回報異常', '請選擇異常類型')}>
          <AlertTriangle size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>回報異常</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction} onPress={() => Alert.alert('今日收入', 'NT$1,240')}>
          <Clock size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>今日收入</Text>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flex: 1,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  logoSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  onlineActive: {
    backgroundColor: '#FFD700',
  },
  toggleText: {
    color: '#FFD700',
    marginLeft: 8,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#000',
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 12,
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    flex: 1,
    color: '#333',
    lineHeight: 20,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
  },
  detailValue: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#000',
    marginLeft: 4,
    fontWeight: '600',
  },
  statusButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offlineCard: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  offlineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  offlineText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 16,
    marginBottom: 100, // 增加底部間距避免被導航欄遮住
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionText: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
});
```

#### app/(tabs)/orders.tsx - 訂單管理
```typescript
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign } from 'lucide-react-native';

interface Order {
  id: string;
  status: 'pending' | 'pickup' | 'delivery' | 'completed';
  pickup: string;
  dropoff: string;
  customer: string;
  time: string;
  fee: string;
  distance: string;
}

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  const orders: Order[] = [
    {
      id: 'BF202412251001',
      status: 'pickup',
      pickup: '台北市中正區重慶南路一段122號',
      dropoff: '台北市信義區市府路45號',
      customer: '王先生',
      time: '14:30',
      fee: 'NT$280',
      distance: '12.5km'
    },
    {
      id: 'BF202412251002',
      status: 'completed',
      pickup: '台北市大安區忠孝東路四段216號',
      dropoff: '台北市松山區南京東路五段188號',
      customer: '李小姐',
      time: '13:15',
      fee: 'NT$350',
      distance: '15.2km'
    },
    {
      id: 'BF202412251003',
      status: 'pending',
      pickup: '台北市中山區長安東路二段178號',
      dropoff: '台北市內湖區瑞光路76號',
      customer: '陳先生',
      time: '15:45',
      fee: 'NT$420',
      distance: '18.7km'
    },
  ];

  const statusMap = {
    pending: { text: '待確認', color: '#FF9500' },
    pickup: { text: '行程中', color: '#007AFF' },
    delivery: { text: '配送中', color: '#34C759' },
    completed: { text: '已完成', color: '#666666' }
  };

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待確認' },
    { key: 'pickup', label: '行程中' },
    { key: 'completed', label: '已完成' }
  ];

  const filteredOrders = orders.filter(order => 
    (selectedFilter === 'all' || order.status === selectedFilter) &&
    (searchText === '' || order.id.toLowerCase().includes(searchText.toLowerCase()) ||
     order.customer.includes(searchText))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>訂單管理</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋訂單編號或客戶姓名"
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

      <ScrollView style={styles.ordersList}>
        {filteredOrders.map(order => (
          <TouchableOpacity key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{order.id}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: statusMap[order.status].color }
              ]}>
                <Text style={styles.statusText}>
                  {statusMap[order.status].text}
                </Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.customer}</Text>
              <View style={styles.timeContainer}>
                <Clock size={14} color="#666" />
                <Text style={styles.timeText}>{order.time}</Text>
              </View>
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <MapPin size={16} color="#FFD700" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {order.pickup}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.locationRow}>
                <MapPin size={16} color="#FF4444" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {order.dropoff}
                </Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.feeContainer}>
                <DollarSign size={16} color="#34C759" />
                <Text style={styles.feeText}>{order.fee}</Text>
              </View>
              <Text style={styles.distanceText}>{order.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暫無符合條件的訂單</Text>
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
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
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
  ordersList: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  locationInfo: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 8,
    marginVertical: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  distanceText: {
    color: '#666',
    fontSize: 14,
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
});
```

#### app/(tabs)/earnings.tsx - 收入統計
```typescript
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CreditCard,
  Download,
  Eye
} from 'lucide-react-native';

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { key: 'today', label: '今日' },
    { key: 'week', label: '本週' },
    { key: 'month', label: '本月' },
  ];

  const earningsData = {
    today: {
      total: 1240,
      orders: 8,
      hours: 6.5,
      average: 155,
    },
    week: {
      total: 8680,
      orders: 45,
      hours: 32,
      average: 193,
    },
    month: {
      total: 35420,
      orders: 180,
      hours: 128,
      average: 197,
    },
  };

  const recentEarnings = [
    {
      id: 'BF202412251001',
      date: '12/25 14:30',
      customer: '王先生',
      amount: 280,
      status: 'paid',
    },
    {
      id: 'BF202412251002',
      date: '12/25 13:15',
      customer: '李小姐',
      amount: 350,
      status: 'paid',
    },
    {
      id: 'BF202412251003',
      date: '12/25 12:00',
      customer: '陳先生',
      amount: 420,
      status: 'pending',
    },
    {
      id: 'BF202412241015',
      date: '12/24 18:45',
      customer: '黃小姐',
      amount: 190,
      status: 'paid',
    },
  ];

  const currentData = earningsData[selectedPeriod as keyof typeof earningsData];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>收入總覽</Text>
        
        <View style={styles.periodSelector}>
          {periods.map(period => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.key && styles.periodTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.mainStat}>
          <DollarSign size={32} color="#FFD700" />
          <Text style={styles.mainAmount}>NT${currentData.total.toLocaleString()}</Text>
          <Text style={styles.mainLabel}>{periods.find(p => p.key === selectedPeriod)?.label}總收入</Text>
        </View>

        <View style={styles.subStats}>
          <View style={styles.subStat}>
            <Text style={styles.subStatNumber}>{currentData.orders}</Text>
            <Text style={styles.subStatLabel}>完成訂單</Text>
          </View>
          
          <View style={styles.subStat}>
            <Text style={styles.subStatNumber}>{currentData.hours}h</Text>
            <Text style={styles.subStatLabel}>工作時數</Text>
          </View>
          
          <View style={styles.subStat}>
            <Text style={styles.subStatNumber}>NT${currentData.average}</Text>
            <Text style={styles.subStatLabel}>平均單價</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <CreditCard size={24} color="#FFD700" />
          <Text style={styles.actionTitle}>申請提現</Text>
          <Text style={styles.actionSubtitle}>可提現金額 NT$8,240</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <Download size={24} color="#FFD700" />
          <Text style={styles.actionTitle}>下載帳單</Text>
          <Text style={styles.actionSubtitle}>匯出收入明細</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.earningsHistory}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>收入明細</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Eye size={16} color="#666" />
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        </View>

        {recentEarnings.map(earning => (
          <View key={earning.id} style={styles.earningItem}>
            <View style={styles.earningInfo}>
              <Text style={styles.earningId}>#{earning.id}</Text>
              <Text style={styles.earningCustomer}>{earning.customer}</Text>
              <Text style={styles.earningDate}>{earning.date}</Text>
            </View>
            
            <View style={styles.earningAmount}>
              <Text style={[
                styles.amountText,
                earning.status === 'pending' && styles.pendingAmount
              ]}>
                NT${earning.amount}
              </Text>
              <View style={[
                styles.statusDot,
                earning.status === 'paid' ? styles.paidDot : styles.pendingDot
              ]} />
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#FFD700',
  },
  periodText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#000',
  },
  statsContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 8,
  },
  mainLabel: {
    color: '#666',
    fontSize: 14,
  },
  subStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  subStat: {
    alignItems: 'center',
  },
  subStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subStatLabel: {
    color: '#666',
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  actionSubtitle: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  earningsHistory: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 4,
  },
  earningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  earningInfo: {
    flex: 1,
  },
  earningId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  earningCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  earningDate: {
    fontSize: 12,
    color: '#999',
  },
  earningAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
    marginRight: 8,
  },
  pendingAmount: {
    color: '#FF9500',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paidDot: {
    backgroundColor: '#34C759',
  },
  pendingDot: {
    backgroundColor: '#FF9500',
  },
  bottomSpacing: {
    height: 20,
  },
});
```

#### app/(tabs)/messages.tsx - 訊息中心
```typescript
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Send, 
  Headphones, 
  Bell,
  ChevronRight
} from 'lucide-react-native';

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: '1',
      type: 'customer',
      name: '王先生',
      orderId: 'BF202412251001',
      lastMessage: '司機大哥，我在大樓一樓等您',
      time: '14:35',
      unread: 1,
      status: 'active',
    },
    {
      id: '2',
      type: 'support',
      name: '客服中心',
      lastMessage: '您好，關於您的提現申請已處理完成',
      time: '12:20',
      unread: 0,
      status: 'normal',
    },
    {
      id: '3',
      type: 'system',
      name: '系統通知',
      lastMessage: '新的訂單推播設定已更新',
      time: '10:15',
      unread: 2,
      status: 'normal',
    },
  ];

  const notifications = [
    {
      id: '1',
      title: '收入結算通知',
      content: '您的本週收入已結算完成，共計 NT$8,680',
      time: '2小時前',
      type: 'earnings',
    },
    {
      id: '2',
      title: '系統維護通知',
      content: '系統將於今晚 23:00-01:00 進行維護升級',
      time: '5小時前',
      type: 'system',
    },
  ];

  const chatMessages = selectedChat ? [
    { id: '1', sender: 'customer', content: '司機大哥，請問還要多久到？', time: '14:30' },
    { id: '2', sender: 'driver', content: '大概還有5分鐘，馬上到', time: '14:32' },
    { id: '3', sender: 'customer', content: '好的，我在大樓一樓等您', time: '14:35' },
  ] : [];

  const sendMessage = () => {
    if (message.trim()) {
      // 這裡實際會發送消息到後端
      console.log('發送消息:', message);
      setMessage('');
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
        <TouchableOpacity style={styles.quickAction}>
          <Headphones size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>聯絡客服</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAction}>
          <Phone size={24} color="#FFD700" />
          <Text style={styles.quickActionText}>調度中心</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>對話</Text>
        {conversations.map(conv => (
          <TouchableOpacity
            key={conv.id}
            style={styles.conversationItem}
            onPress={() => setSelectedChat(conv.id)}
          >
            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>{conv.name}</Text>
                <Text style={styles.conversationTime}>{conv.time}</Text>
              </View>
              <Text style={styles.conversationMessage} numberOfLines={1}>
                {conv.lastMessage}
              </Text>
              {conv.orderId && (
                <Text style={styles.conversationOrderId}>訂單 #{conv.orderId}</Text>
              )}
            </View>
            <View style={styles.conversationMeta}>
              {conv.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{conv.unread}</Text>
                </View>
              )}
              <ChevronRight size={16} color="#ccc" />
            </View>
          </TouchableOpacity>
        ))}
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
              <Text style={styles.notificationText}>{notif.content}</Text>
              <Text style={styles.notificationTime}>{notif.time}</Text>
            </View>
          </View>
        ))}
      </View>
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
  },
  quickActions: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
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
    marginBottom: 16,
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
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  conversationTime: {
    fontSize: 12,
    color: '#666',
  },
  conversationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  conversationOrderId: {
    fontSize: 12,
    color: '#FFD700',
  },
  conversationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  // Chat screen styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    color: '#FFD700',
    fontSize: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderId: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 2,
  },
  callButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageItem: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  driverMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  customerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  driverMessageText: {
    color: '#000',
  },
  customerMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
  },
});
```

#### app/(tabs)/profile.tsx - 個人中心
```typescript
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Car, Settings, CircleHelp as HelpCircle, Shield, LogOut, CreditCard as Edit, Bell, CreditCard, Star, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  const driverInfo = {
    name: '張司機',
    phone: '0912-345-678',
    rating: 4.8,
    totalOrders: 1240,
    joinDate: '2023年3月',
    vehicle: {
      brand: 'Toyota',
      model: 'Vios',
      plate: 'ABC-1234',
      year: '2020',
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
            // 這裡實際會處理登出邏輯
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
      onPress: () => Alert.alert('編輯資料', '打開編輯頁面'),
    },
    {
      icon: Car,
      title: '車輛資訊',
      subtitle: '查看分配車輛詳情',
      onPress: () => Alert.alert('車輛資訊', '顯示車輛詳細資料'),
    },
    {
      icon: CreditCard,
      title: '提現記錄',
      subtitle: '查看提現歷史與狀態',
      onPress: () => Alert.alert('提現記錄', '顯示提現歷史'),
    },
    {
      icon: Bell,
      title: '通知設定',
      subtitle: '管理推播通知偏好',
      onPress: () => Alert.alert('通知設定', '打開通知設定頁面'),
    },
    {
      icon: Shield,
      title: '修改密碼',
      subtitle: '更改登入密碼',
      onPress: () => Alert.alert('修改密碼', '打開密碼修改頁面'),
    },
    {
      icon: HelpCircle,
      title: '幫助中心',
      subtitle: '常見問題與客服支援',
      onPress: () => Alert.alert('幫助中心', '打開幫助頁面'),
    },
    {
      icon: Settings,
      title: '應用設定',
      subtitle: '語言、主題等設定',
      onPress: () => Alert.alert('應用設定', '打開設定頁面'),
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
            <Text style={styles.driverName}>{driverInfo.name}</Text>
            <Text style={styles.driverPhone}>{driverInfo.phone}</Text>
            <Text style={styles.joinDate}>加入時間：{driverInfo.joinDate}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{driverInfo.rating}</Text>
            </View>
            <Text style={styles.statLabel}>評分</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{driverInfo.totalOrders.toLocaleString()}</Text>
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
              {driverInfo.vehicle.brand} {driverInfo.vehicle.model} ({driverInfo.vehicle.year})
            </Text>
          </View>
          
          <View style={styles.vehicleRow}>
            <Text style={styles.vehicleLabel}>車牌號碼</Text>
            <Text style={styles.vehicleValue}>{driverInfo.vehicle.plate}</Text>
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

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Black feather 司機端 v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2024 Black feather Technology</Text>
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
    marginBottom: 4,
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
    marginHorizontal: 16,
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
    marginBottom: 16,
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
    paddingTop: 16,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleLabel: {
    fontSize: 14,
    color: '#666',
  },
  vehicleValue: {
    fontSize: 14,
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
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
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
  versionInfo: {
    alignItems: 'center',
    marginVertical: 16,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
  },
  bottomSpacing: {
    height: 20,
  },
});
```

---

## 🔄 恢復指南

### 1. 環境準備
```bash
# 安裝 Node.js 18+ 和 npm
# 全域安裝 Expo CLI
npm install -g @expo/cli
```

### 2. 項目設置
```bash
# 創建項目目錄
mkdir black-feather-driver
cd black-feather-driver

# 複製所有文件
# 安裝依賴
npm install

# 啟動開發
npm run dev
```

### 3. 開發工具
- VS Code 或 Cursor
- React Native Tools 擴展
- TypeScript 支援
- Prettier 格式化

---

**備份完成日期**: 2024年12月25日  
**項目版本**: v1.0.0  
**技術棧**: React Native + Expo + TypeScript  
**總文件數**: 15+ 個核心文件

此備份包含完整的司機端 APP 源代碼，可直接用於開發和部署。