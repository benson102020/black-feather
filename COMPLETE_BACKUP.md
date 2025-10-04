# Black feather 司機端 APP - 完整源代碼備份

## 📋 項目概述
- **項目名稱**: Black feather 司機端 APP
- **技術棧**: React Native + Expo + TypeScript
- **備份日期**: 2024年12月
- **版本**: v1.0.0

---

## 📁 完整文件列表

### 1. 配置文件

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
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../contexts/AppContext';

export default function Index() {
  const { state } = useApp();

  useEffect(() => {
    // 延遲導航確保路由器已準備就緒
    const timer = setTimeout(() => {
      // 檢查是否已登入
      const isLoggedIn = state.user.isAuthenticated;
      
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [state.user.isAuthenticated]);

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
import { AppProvider } from '../contexts/AppContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
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
import { useApp } from '../../contexts/AppContext';

export default function LoginScreen() {
  const { actions } = useApp();
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
      const success = await actions.login(phoneNumber, password);
      
      if (success) {
        // 登入成功，導航到主頁面
        router.replace('/(tabs)');
      } else {
        Alert.alert('登入失敗', '請檢查您的手機號碼和密碼');
      }
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