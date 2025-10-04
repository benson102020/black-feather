import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Phone, Lock, ArrowRight, ArrowLeft, User, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import { passengerService } from '../../../services/passenger';

export default function PassengerRegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const handleRegister = async () => {
    console.log('👉 點擊註冊按鈕');
    console.log('📋 表單資料:', { fullName, phoneNumber, hasPassword: !!password, hasConfirmPassword: !!confirmPassword });

    if (!fullName || !phoneNumber || !password || !confirmPassword) {
      console.log('❌ 資料未完整');
      Alert.alert('❌ 資料未完整', '請填寫所有必填欄位\n\n必填項目：\n• 真實姓名\n• 手機號碼\n• 密碼\n• 確認密碼');
      return;
    }

    if (phoneNumber.length !== 10 || !phoneNumber.startsWith('09')) {
      Alert.alert('❌ 手機號碼格式錯誤', '請輸入正確的台灣手機號碼\n\n格式：10位數，以09開頭\n範例：0912345678');
      return;
    }

    if (password.length < 6) {
      Alert.alert('❌ 密碼格式錯誤', '密碼至少需要6個字元\n\n建議使用包含英文和數字的組合');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('❌ 密碼不符合', '兩次輸入的密碼不一致\n\n請重新確認密碼');
      return;
    }

    setLoading(true);
    console.log('⏳ Loading 狀態設定為 true');

    try {
      console.log('🚀 開始乘客註冊...');
      const passengerData = {
        fullName,
        phoneNumber,
        email,
        password
      };

      console.log('📤 傳送資料到 passengerService...');
      const result = await passengerService.registerPassenger(passengerData);
      console.log('📥 收到回應:', result);

      if (result.success) {
        console.log('✅ 乘客註冊成功！申請 ID:', result.data?.id);
        console.log('🎉 顯示審核中畫面...');

        // 關閉提交中的 loading
        setLoading(false);

        // 保存申請編號
        setApplicationId(result.data?.id?.slice(-6) || 'PENDING');

        // 顯示審核中畫面
        setShowSuccess(true);

        // 2秒後返回首頁
        setTimeout(() => {
          console.log('⏰ 2秒後返回首頁');
          router.replace('/role-selection');
        }, 2000);

        // 提前返回,不執行 finally 的 setLoading(false)
        return;
      } else {
        console.error('❌ 乘客註冊失敗！');
        console.error('❌ 錯誤詳情:', result.error);
        console.error('❌ 完整回應:', JSON.stringify(result, null, 2));
        if (result.error?.includes('約束') || result.error?.includes('constraint')) {
          Alert.alert(
            '🔧 需要修復資料庫約束',
            '檢測到資料庫約束問題，需要執行修復腳本。',
            [
              { text: '我知道了' },
              { text: '查看修復指南', onPress: () => router.push('/database-constraints-fix') }
            ]
          );
        } else {
          Alert.alert('❌ 註冊失敗', result.error || '請稍後再試');
        }
      }
    } catch (error) {
      console.error('❌ 捕獲到異常錯誤！');
      console.error('❌ 錯誤類型:', error?.constructor?.name);
      console.error('❌ 錯誤訊息:', error?.message);
      console.error('❌ 完整錯誤:', error);
      Alert.alert('❌ 註冊失敗', '請稍後再試');
    } finally {
      console.log('✅ 提交流程完成，設定 loading = false');
      setLoading(false);
    }
  };

  // 如果顯示審核中畫面
  if (showSuccess) {
    return (
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#333333']}
        style={styles.container}
      >
        <View style={styles.successContainer}>
          <View style={styles.successContent}>
            <View style={styles.checkmarkContainer}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
            <Text style={styles.successTitle}>註冊成功！</Text>
            <Text style={styles.successSubtitle}>審核中...</Text>
            <Text style={styles.applicationId}>申請編號: {applicationId}</Text>
            <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
            <Text style={styles.processingText}>正在處理您的申請</Text>
            <Text style={styles.redirectText}>2秒後自動返回首頁</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

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
          <Text style={styles.subtitle}>乘客註冊</Text>
          <Text style={styles.welcome}>加入我們，享受專業叫車服務</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="真實姓名"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Phone size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="手機號碼"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Mail size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="電子郵件（選填）"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="設定密碼（至少6個字元）"
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

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color="#FFD700" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="確認密碼"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#000" />
                <Text style={styles.registerButtonText}>處理中...</Text>
              </>
            ) : (
              <>
                <Text style={styles.registerButtonText}>註冊</Text>
                <ArrowRight size={20} color="#000" />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.registerHint}>
            提交後請等待管理員審核(1-3個工作天)
          </Text>
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.loginPrompt}>已經有帳號？</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/passenger/auth/login')}
          >
            <Text style={styles.loginButtonText}>立即登入</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
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
    marginBottom: 20,
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
    marginBottom: 30,
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
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginTop: 20,
  },
  registerButtonDisabled: {
    backgroundColor: '#666',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  loginSection: {
    alignItems: 'center',
  },
  loginPrompt: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  registerHint: {
    color: '#FFD700',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    minWidth: 320,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 48,
    color: '#000',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  applicationId: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 24,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  processingText: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 16,
    textAlign: 'center',
  },
  redirectText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});