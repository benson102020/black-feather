import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, ArrowLeft, ArrowRight, MessageSquare, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import { apiService } from '../../services/api';

export default function ForgotPasswordScreen() {
  const mounted = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [step, setStep] = useState(1); // 1: 輸入手機號碼, 2: 輸入驗證碼, 3: 設定新密碼
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 發送驗證碼
  const sendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert('錯誤', '請輸入正確的手機號碼');
      return;
    }

    setLoading(true);
    try {
      // 實際發送驗證碼 API
      const response = await apiService.forgotPassword(phoneNumber);
      
      if (response.success) {
        if (mounted.current) {
          Alert.alert('驗證碼已發送', `驗證碼已發送至 ${phoneNumber}，請查收簡訊`);
          setStep(2);
        }
      } else {
        if (mounted.current) {
          Alert.alert('發送失敗', response.message || '驗證碼發送失敗，請稍後再試');
        }
      }
      
      // 開始倒數計時
      if (mounted.current) {
        setCountdown(60);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        timerRef.current = setInterval(() => {
          if (mounted.current) {
            setCountdown(prev => {
              if (prev <= 1) {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
                return 0;
              }
              return prev - 1;
            });
          }
        }, 1000);
      }
      
    } catch (error) {
      if (mounted.current) {
        Alert.alert('發送失敗', '驗證碼發送失敗，請稍後再試');
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
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
      // 實際驗證 API
      const response = await apiService.verifyCode(phoneNumber, verificationCode);
      
      if (response.success) {
        if (mounted.current) {
          setStep(3);
        }
      } else {
        if (mounted.current) {
          Alert.alert('驗證失敗', response.message || '驗證碼錯誤，請重新輸入');
        }
      }
    } catch (error) {
      if (mounted.current) {
        Alert.alert('驗證失敗', '驗證過程發生錯誤，請稍後再試');
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
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
      // 實際重設密碼 API
      const response = await apiService.resetPassword(phoneNumber, newPassword, verificationCode);
      
      if (response.success) {
        if (mounted.current) {
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
        }
      } else {
        if (mounted.current) {
          Alert.alert('重設失敗', response.message || '密碼重設失敗，請稍後再試');
        }
      }
    } catch (error) {
      if (mounted.current) {
        Alert.alert('重設失敗', '密碼重設失敗，請稍後再試');
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
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
                router.replace('/role-selection');
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