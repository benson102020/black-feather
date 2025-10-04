import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, User, Lock, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  });

  // 清除錯誤訊息
  const clearErrors = () => {
    setErrors({
      username: '',
      password: '',
      general: ''
    });
  };

  // 驗證用戶名
  const validateUsername = (user: string) => {
    if (!user) return '請輸入管理員帳號';
    if (user.length < 3) return '帳號至少需要3個字元';
    return '';
  };

  // 驗證密碼
  const validatePassword = (pwd: string) => {
    if (!pwd) return '請輸入密碼';
    if (pwd.length < 6) return '密碼至少需要6個字元';
    return '';
  };

  // 即時驗證
  const handleUsernameChange = (value: string) => {
    setUsername(value);
    const error = validateUsername(value);
    setErrors(prev => ({ ...prev, username: error, general: '' }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, password: error, general: '' }));
  };

  const handleLogin = async () => {
    clearErrors();
    
    // 驗證表單
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    
    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
        general: ''
      });
      
      Alert.alert('❌ 輸入錯誤', usernameError || passwordError);
      return;
    }

    setLoading(true);

    try {
      // 測試帳號檢查
      if (username === 'admin' && password === 'ADMIN123') {
        clearErrors();
        Alert.alert('登入成功', '歡迎使用後台管理系統');
        router.replace('/admin');
        return;
      }

      // 模擬登入API
      await new Promise(resolve => setTimeout(resolve, 1500));
      clearErrors();
      Alert.alert('登入成功', '歡迎使用後台管理系統');
      router.replace('/admin');
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        password: '帳號或密碼錯誤',
        general: '登入失敗，請檢查帳號和密碼' 
      }));
      Alert.alert(
        '❌ 登入失敗', 
        '請檢查您的帳號和密碼\n\n💡 測試帳號：admin / ADMIN123'
      );
    } finally {
      setLoading(false);
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Black feather</Text>
            <View style={styles.featherIcon}>
              <Text style={styles.featherText}>🪶</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>後台管理系統</Text>
          <Text style={styles.welcome}>管理員登入</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="管理員帳號"
              placeholderTextColor="#999"
              value={username}
              onChangeText={handleUsernameChange}
            />
          </View>
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="密碼"
              placeholderTextColor="#999"
              value={password}
              onChangeText={handlePasswordChange}
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
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {errors.general ? (
            <View style={styles.generalError}>
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

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

          <View style={styles.testAccount}>
            <Text style={styles.testTitle}>測試帳號</Text>
            <Text style={styles.testInfo}>帳號：admin</Text>
            <Text style={styles.testInfo}>密碼：ADMIN123</Text>
          </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  backText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 60,
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
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#666',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  testAccount: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  testTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  testInfo: {
    color: '#FFD700',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
    marginBottom: 8,
  },
  generalError: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  generalErrorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});