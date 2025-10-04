import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Phone, Lock, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { authService } from '../../../services/supabase';

export default function PassengerLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    phoneNumber: '',
    password: '',
    general: ''
  });

  // 清除錯誤訊息
  const clearErrors = () => {
    setErrors({
      phoneNumber: '',
      password: '',
      general: ''
    });
  };

  // 驗證手機號碼格式
  const validatePhoneNumber = (phone: string) => {
    if (!phone) return '請輸入手機號碼';
    if (phone.length !== 10) return '手機號碼必須是10位數字';
    if (!phone.startsWith('09')) return '手機號碼必須以09開頭';
    if (!/^\d+$/.test(phone)) return '手機號碼只能包含數字';
    return '';
  };

  // 驗證密碼格式
  const validatePassword = (pwd: string) => {
    if (!pwd) return '請輸入密碼';
    if (pwd.length < 6) return '密碼至少需要6個字元';
    return '';
  };

  // 即時驗證
  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    const error = validatePhoneNumber(value);
    setErrors(prev => ({ ...prev, phoneNumber: error, general: '' }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, password: error, general: '' }));
  };

  const handleLogin = async () => {
    clearErrors();
    
    // 驗證表單
    const phoneError = validatePhoneNumber(phoneNumber);
    const passwordError = validatePassword(password);
    
    if (phoneError || passwordError) {
      setErrors({
        phoneNumber: phoneError,
        password: passwordError,
        general: ''
      });
      
      Alert.alert('❌ 輸入錯誤', phoneError || passwordError);
      return;
    }


    setLoading(true);

    try {
      console.log('🔐 嘗試乘客登入...');
      const response = await authService.loginPassenger(phoneNumber, password);

      if (response.success) {
        console.log('✅ 乘客登入成功');
        clearErrors();
        Alert.alert('登入成功', '歡迎使用 Black feather 叫車服務');
        router.replace('/passenger');
      } else {
        console.log('❌ 乘客登入失敗:', response.error);
        // 設定具體錯誤提示
        if (response.error?.includes('密碼') || response.error?.includes('password')) {
          setErrors(prev => ({ 
            ...prev, 
            password: '密碼錯誤',
            general: '手機號碼或密碼錯誤' 
          }));
        } else if (response.error?.includes('手機') || response.error?.includes('phone')) {
          setErrors(prev => ({ 
            ...prev, 
            phoneNumber: '手機號碼不存在',
            general: '此手機號碼尚未註冊' 
          }));
        } else {
          setErrors(prev => ({ 
            ...prev, 
            general: response.error || '登入失敗，請稍後重試' 
          }));
        }
        
        Alert.alert(
          '❌ 登入失敗', 
          response.error || '請檢查您的手機號碼和密碼\n\n💡 測試帳號：0912345678 / test123',
          [
            { text: '重新輸入', style: 'cancel' },
            { text: '立即註冊', onPress: () => router.push('/passenger/auth/register') },
            { text: '使用測試帳號', onPress: () => {
              setPhoneNumber('0912345678');
              setPassword('test123');
            }}
          ]
        );
      }
    } catch (error) {
      console.error('乘客登入錯誤:', error);
      setErrors(prev => ({ 
        ...prev, 
        general: '網路連接錯誤，請稍後重試' 
      }));
      Alert.alert(
        '❌ 登入失敗', 
        '網路連接錯誤，建議使用測試帳號',
        [
          { text: '重試', style: 'cancel' },
          { text: '使用測試帳號', onPress: () => {
            setPhoneNumber('0912345678');
            setPassword('test123');
          }}
        ]
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
          <Text style={styles.subtitle}>乘客端</Text>
          <Text style={styles.welcome}>歡迎使用專業叫車服務</Text>
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
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {errors.phoneNumber ? (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="請輸入密碼"
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
            <Text style={styles.testInfo}>手機號碼：0912345678</Text>
            <Text style={styles.testInfo}>密碼：test123</Text>
            <TouchableOpacity
              style={styles.fillTestButton}
              onPress={() => {
                setPhoneNumber('0912345678');
                setPassword('test123');
              }}
            >
              <Text style={styles.fillTestText}>一鍵填入測試帳號</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.registerSection}>
          <Text style={styles.registerPrompt}>還沒有帳號？</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/passenger/auth/register')}
          >
            <Text style={styles.registerButtonText}>立即註冊</Text>
          </TouchableOpacity>
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
    marginBottom: 40,
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
  fillTestButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: 'center',
  },
  fillTestText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
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
  testNote: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  registerSection: {
    alignItems: 'center',
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