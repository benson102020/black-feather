import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Phone, Lock, ArrowRight, ArrowLeft, User, Car, CreditCard, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { driverApplicationService } from '../../services/driver-application';

export default function RegisterScreen() {
  const mounted = useRef(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehiclePlate: '',
    vehicleYear: '',
    vehicleColor: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    bankName: '',
    bankAccount: '',
    accountHolder: '',
    jkopayAccount: '',
    jkopayName: ''
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

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
        if (formData.phoneNumber.length !== 10 || !formData.phoneNumber.startsWith('09')) {
          Alert.alert('錯誤', '請輸入正確的手機號碼格式（10位數，09開頭）');
          return false;
        }
        if (!/^[A-Z][12]\d{8}$/.test(formData.idNumber)) {
          Alert.alert('錯誤', '請輸入正確的身分證字號格式');
          return false;
        }
        break;
      case 2:
        if (!formData.password || !formData.confirmPassword) {
          Alert.alert('❌ 密碼未設定', '請輸入密碼和確認密碼');
          return false;
        }
        if (formData.password.length < 6) {
          Alert.alert('❌ 密碼格式錯誤', '密碼至少需要6個字元\n\n建議使用包含英文和數字的組合');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert('❌ 密碼不符合', '兩次輸入的密碼不一致\n\n請重新確認密碼');
          return false;
        }
        break;
      case 3:
        if (!formData.licenseNumber) {
          Alert.alert('錯誤', '請輸入駕照號碼');
          return false;
        }
        break;
      case 4:
        if (!formData.vehicleBrand || !formData.vehiclePlate) {
          Alert.alert('錯誤', '請填寫車輛品牌和車牌號碼');
          return false;
        }
        break;
      case 5:
        if (!formData.emergencyName || !formData.emergencyPhone) {
          Alert.alert('錯誤', '請填寫緊急聯絡人資訊');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    console.log(`👉 點擊下一步/提交按鈕 - 當前步驟: ${step}`);

    if (validateStep(step)) {
      if (step < 6) {
        console.log(`✅ 驗證通過，進入步驟 ${step + 1}`);
        setStep(step + 1);
      } else {
        console.log('🚀 步驟 6 完成，開始提交申請...');
        handleSubmit();
      }
    } else {
      console.log('❌ 驗證失敗，無法繼續');
    }
  };

  const handleSubmit = async () => {
    console.log('🔴 handleSubmit 被呼叫！');
    console.log('📋 表單資料:', {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      idNumber: formData.idNumber,
      hasPassword: !!formData.password,
      hasLicense: !!formData.licenseNumber,
      hasVehicle: !!formData.vehicleBrand && !!formData.vehiclePlate
    });

    setLoading(true);
    console.log('⏳ Loading 狀態設定為 true');

    try {
      console.log('🚀 開始提交司機註冊申請...');
      
      const registrationData = {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        id_number: formData.idNumber,
        password: formData.password,
        license_number: formData.licenseNumber,
        license_expiry: formData.licenseExpiry,
        vehicle_brand: formData.vehicleBrand,
        vehicle_model: formData.vehicleBrand, // 使用 brand 作為 model
        vehicle_plate: formData.vehiclePlate,
        vehicle_year: formData.vehicleYear,
        vehicle_color: formData.vehicleColor,
        emergency_contact_name: formData.emergencyName,
        emergency_contact_phone: formData.emergencyPhone,
        emergency_contact_relation: formData.emergencyRelation,
        jkopay_account: formData.jkopayAccount,
        jkopay_name: formData.jkopayName
      };
      
      console.log('📤 準備傳送到 driverApplicationService...');
      const result = await driverApplicationService.submitDriverApplication(registrationData);
      console.log('📥 收到服務回應:', result);
      
      if (result.success) {
        console.log('✅ 註冊成功！申請 ID:', result.data?.id);
        console.log('🎉 顯示審核中畫面...');

        // 確保組件還在掛載狀態
        if (!mounted.current) {
          console.warn('⚠️ 組件已卸載，取消顯示成功畫面');
          return;
        }

        // 保存申請編號
        const appId = result.data?.id?.toString() || '';
        const shortId = appId.slice(-6) || 'PENDING';
        setApplicationId(shortId);
        console.log('📋 申請編號:', shortId);

        // 關閉提交中的 loading
        setLoading(false);
        console.log('⏳ Loading 狀態設為 false');

        // 顯示審核中畫面
        setShowSuccess(true);
        console.log('🎊 顯示成功畫面');

        // 3秒後返回首頁
        const redirectTimer = setTimeout(() => {
          if (mounted.current) {
            console.log('⏰ 3秒後返回角色選擇頁面');
            router.replace('/role-selection');
          }
        }, 3000);

        // 清理計時器
        return () => clearTimeout(redirectTimer);
      } else {
        console.error('❌ 註冊失敗！');
        console.error('❌ 錯誤詳情:', result.error);
        console.error('❌ 完整回應:', JSON.stringify(result, null, 2));
        // 特別處理各種錯誤
        if (result.error?.includes('約束') || result.error?.includes('constraint')) {
          Alert.alert(
            '🔧 需要修復資料庫約束',
            '檢測到資料庫約束問題，需要執行修復腳本。\n\n請在 Supabase SQL Editor 中執行：\nsupabase/migrations/complete_rls_and_constraints_fix.sql',
            [
              { text: '我知道了' },
              { text: '查看修復指南', onPress: () => router.push('/database-constraints-fix') }
            ]
          );
        } else if (result.error?.includes('重複') || result.error?.includes('duplicate')) {
          Alert.alert(
            '⚠️ 資料重複',
            '手機號碼、身分證或車牌已被使用。\n\n您可以：\n• 使用其他號碼註冊\n• 直接使用測試帳號登入',
            [
              { text: '使用測試帳號', onPress: () => router.replace('/auth/login') },
              { text: '我知道了' }
            ]
          );
        } else {
          Alert.alert('❌ 註冊失敗', result.error || '系統遇到問題，請稍後再試');
        }
      }
    } catch (error) {
      console.error('❌ 捕獲到異常錯誤！');
      console.error('❌ 錯誤類型:', error?.constructor?.name);
      console.error('❌ 錯誤訊息:', error?.message);
      console.error('❌ 完整錯誤:', error);
      
      Alert.alert(
        '❌ 註冊失敗', 
        '系統遇到問題，建議使用測試帳號或執行資料庫修復',
        [
          { text: '使用測試帳號', onPress: () => router.replace('/auth/login') },
          { text: '修復指南', onPress: () => router.push('/database-constraints-fix') },
          { text: '重試', style: 'cancel' }
        ]
      );
    } finally {
      console.log('✅ 提交流程完成，設定 loading = false');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>基本資料</Text>
            <Text style={styles.stepSubtitle}>請填寫您的基本資訊</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="真實姓名"
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
                placeholder="手機號碼"
                placeholderTextColor="#999"
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormData('phoneNumber', value)}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <CreditCard size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="身分證字號"
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
                placeholder="設定密碼（至少6個字元）"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="確認密碼"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>駕照資料</Text>
            <Text style={styles.stepSubtitle}>請提供您的駕照資訊</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <CreditCard size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="駕照號碼"
                placeholderTextColor="#999"
                value={formData.licenseNumber}
                onChangeText={(value) => updateFormData('licenseNumber', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <CreditCard size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="駕照到期日 (YYYY-MM-DD)"
                placeholderTextColor="#999"
                value={formData.licenseExpiry}
                onChangeText={(value) => updateFormData('licenseExpiry', value)}
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>車輛資料</Text>
            <Text style={styles.stepSubtitle}>請提供您的車輛資訊</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Car size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="車輛品牌型號（如：Toyota Vios）"
                placeholderTextColor="#999"
                value={formData.vehicleBrand}
                onChangeText={(value) => updateFormData('vehicleBrand', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <CreditCard size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="車牌號碼（如：ABC-1234）"
                placeholderTextColor="#999"
                value={formData.vehiclePlate}
                onChangeText={(value) => updateFormData('vehiclePlate', value.toUpperCase())}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Car size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="車輛顏色（選填）"
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
                <Users size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="聯絡人姓名"
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
                placeholder="聯絡人電話"
                placeholderTextColor="#999"
                value={formData.emergencyPhone}
                onChangeText={(value) => updateFormData('emergencyPhone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Users size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="關係（如：配偶、父母）"
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
            <Text style={styles.stepTitle}>街口帳號</Text>
            <Text style={styles.stepSubtitle}>用於顯示給乘客（選填）</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Phone size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="街口帳號（僅供顯示）"
                placeholderTextColor="#999"
                value={formData.jkopayAccount}
                onChangeText={(value) => updateFormData('jkopayAccount', value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color="#FFD700" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="顯示姓名（乘客可見）"
                placeholderTextColor="#999"
                value={formData.jkopayName}
                onChangeText={(value) => updateFormData('jkopayName', value)}
              />
            </View>
            
            <View style={styles.infoNote}>
              <Text style={styles.infoText}>
                💡 此資訊僅用於向乘客顯示付款方式，不會用於實際轉帳
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  // 如果顯示審核中畫面
  if (showSuccess) {
    console.log('🖼️ 渲染成功畫面，申請編號:', applicationId);
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
            <Text style={styles.successTitle}>申請提交成功！</Text>
            <Text style={styles.successSubtitle}>等待管理員審核</Text>
            <Text style={styles.applicationId}>申請編號: {applicationId}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>審核流程說明：</Text>
              <Text style={styles.infoItem}>1️⃣ 管理員會在 1-3 個工作天內審核您的申請</Text>
              <Text style={styles.infoItem}>2️⃣ 審核通過後，您會收到系統通知</Text>
              <Text style={styles.infoItem}>3️⃣ 通過審核後即可登入並開始接單</Text>
              <Text style={styles.infoNote}>💡 您可以使用申請時填寫的手機號碼和密碼嘗試登入，審核通過前無法登入</Text>
            </View>

            <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
            <Text style={styles.redirectText}>3秒後自動返回首頁</Text>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                console.log('🔄 用戶點擊立即返回');
                router.replace('/role-selection');
              }}
            >
              <Text style={styles.skipButtonText}>立即返回</Text>
            </TouchableOpacity>
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
            <Text style={styles.headerTitle}>司機註冊</Text>
            <Text style={styles.stepIndicator}>步驟 {step} / 6</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 6) * 100}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, loading && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#000" />
                <Text style={styles.nextButtonText}>處理中...</Text>
              </>
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {step === 6 ? '提交申請' : '下一步'}
                </Text>
                <ArrowRight size={20} color="#000" />
              </>
            )}
          </TouchableOpacity>

          {step === 6 && (
            <Text style={styles.finalStepHint}>
              提交後請等待管理員審核(1-3個工作天)
            </Text>
          )}
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
  content: {
    flex: 1,
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
  buttonContainer: {
    paddingTop: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
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
  infoNote: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  infoText: {
    color: '#FFD700',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  backText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  finalStepHint: {
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
  infoBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    width: '100%',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 18,
  },
  infoNote: {
    fontSize: 12,
    color: '#FFD700',
    marginTop: 8,
    lineHeight: 16,
    opacity: 0.9,
  },
  loader: {
    marginVertical: 20,
  },
  redirectText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  skipButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
});