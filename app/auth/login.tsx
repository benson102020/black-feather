import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Phone, Lock, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useApp } from '../../contexts/AppContext';
import { driverApplicationService } from '../../services/driver-application';

export default function LoginScreen() {
  const { actions, state } = useApp();
  const mounted = useRef(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    phoneNumber: '',
    password: '',
    general: ''
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

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
    if (!phone) {
      return '請輸入手機號碼';
    }
    if (phone.length !== 10) {
      return '手機號碼必須是10位數字';
    }
    if (!phone.startsWith('09')) {
      return '手機號碼必須以09開頭';
    }
    if (!/^\d+$/.test(phone)) {
      return '手機號碼只能包含數字';
    }
    return '';
  };

  // 驗證密碼格式
  const validatePassword = (pwd: string) => {
    if (!pwd) {
      return '請輸入密碼';
    }
    if (pwd.length < 6) {
      return '密碼至少需要6個字元';
    }
    if (pwd.length > 20) {
      return '密碼不能超過20個字元';
    }
    return '';
  };

  // 即時驗證手機號碼
  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    const error = validatePhoneNumber(value);
    setErrors(prev => ({ ...prev, phoneNumber: error, general: '' }));
  };

  // 即時驗證密碼
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, password: error, general: '' }));
  };

  const handleForgotPassword = () => {
    Alert.alert('忘記密碼', '請聯繫客服協助重設密碼');
  };

  const handleLogin = async () => {
    // 清除之前的錯誤
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
      
      const errorMessage = phoneError || passwordError;
      Alert.alert('❌ 輸入錯誤', errorMessage);
      return;
    }


    setLoading(true);

    try {
      console.log('🔐 嘗試司機登入...');
      const result = await actions.login(phoneNumber, password);
      
      if (result) {
        console.log('✅ 登入成功');
        clearErrors();
        Alert.alert('🎉 登入成功！', '歡迎回來，開始今日的工作吧！', [
          { text: '開始工作', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        console.log('❌ 登入失敗');
        // 設定密碼錯誤提示
        setErrors(prev => ({ 
          ...prev, 
          password: '密碼錯誤',
          general: '手機號碼或密碼錯誤' 
        }));
        
        Alert.alert(
          '❌ 登入失敗', 
          '手機號碼或密碼錯誤\n\n💡 測試帳號：0982214855 / BOSS08017', 
          [
            { text: '重新輸入', style: 'cancel' },
            { text: '立即註冊', onPress: () => router.push('/auth/register') },
            { text: '使用測試帳號', onPress: () => {
              setPhoneNumber('0982214855');
              setPassword('BOSS08017');
            }}
          ]
        );
      }
    } catch (error) {
      console.error('登入錯誤:', error);
      
      // 設定一般錯誤提示
      setErrors(prev => ({ 
        ...prev, 
        general: '系統錯誤，請稍後重試' 
      }));
      
      Alert.alert(
        '❌ 登入失敗', 
        '系統遇到問題，建議使用測試帳號或執行資料庫修復',
        [
          { text: '重試', style: 'cancel' },
          { text: '使用測試帳號', onPress: () => {
            setPhoneNumber('0982214855');
            setPassword('BOSS08017');
          }},
          { text: '修復系統', onPress: () => router.push('/database-constraints-fix') }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.replace('/role-selection')}
        >
          <Text style={styles.homeButtonText}>← 返回選擇</Text>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Black feather</Text>
            <View style={styles.featherIcon}>
              <Text style={styles.featherText}>🪶</Text>
            </View>
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
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
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
    opacity: 0.7,
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
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  securityText: {
    color: '#666',
    fontSize: 11,
    marginLeft: 8,
    textAlign: 'center',
    lineHeight: 14,
  },
  registerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
  },
  registerPrompt: {
    color: '#999',
    fontSize: 14,
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  registerButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  homeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  homeButtonText: {
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
});