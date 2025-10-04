import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { ArrowLeft, Settings, DollarSign, Clock, MapPin, Bell, Shield, Database, Wifi, Save } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminSettingsScreen() {
  const [settings, setSettings] = useState({
    // 計費設定
    baseFare: '85',
    perKmRate: '12',
    perMinuteRate: '2.5',
    minimumFare: '85',
    maximumFare: '2000',
    commissionRate: '15',
    
    // 尖峰時段設定
    morningPeakStart: '07:00',
    morningPeakEnd: '09:00',
    eveningPeakStart: '17:00',
    eveningPeakEnd: '19:00',
    peakMultiplier: '1.5',
    
    // 系統設定
    autoDispatch: true,
    dispatchRadius: '5000',
    maxWaitingTime: '300',
    cancellationTimeLimit: '300',
    
    // 通知設定
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // 安全設定
    requirePhoneVerification: true,
    requireEmailVerification: false,
    enableTwoFactor: false,
    
    // 應用設定
    appName: 'Black feather',
    supportPhone: '0800-123-456',
    supportEmail: 'support@blackfeather.com',
    maintenanceMode: false
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // 模擬保存設定
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '設定已保存',
        '所有系統設定已成功更新並生效',
        [{ text: '確定' }]
      );
      setHasChanges(false);
    } catch (error) {
      Alert.alert('保存失敗', '請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefault = () => {
    Alert.alert(
      '重設為預設值',
      '確定要將所有設定重設為預設值嗎？此操作無法復原。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '重設', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              baseFare: '85',
              perKmRate: '12',
              perMinuteRate: '2.5',
              minimumFare: '85',
              maximumFare: '2000',
              commissionRate: '15',
              morningPeakStart: '07:00',
              morningPeakEnd: '09:00',
              eveningPeakStart: '17:00',
              eveningPeakEnd: '19:00',
              peakMultiplier: '1.5',
              autoDispatch: true,
              dispatchRadius: '5000',
              maxWaitingTime: '300',
              cancellationTimeLimit: '300',
              pushNotifications: true,
              emailNotifications: true,
              smsNotifications: false,
              requirePhoneVerification: true,
              requireEmailVerification: false,
              enableTwoFactor: false,
              appName: 'Black feather',
              supportPhone: '0800-123-456',
              supportEmail: 'support@blackfeather.com',
              maintenanceMode: false
            });
            setHasChanges(true);
            Alert.alert('重設完成', '所有設定已重設為預設值');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/admin')}
        >
          <ArrowLeft size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>系統設定</Text>
        
        {hasChanges && (
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSaveSettings}
            disabled={loading}
          >
            <Save size={20} color="#000" />
            <Text style={styles.saveButtonText}>
              {loading ? '保存中...' : '保存'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* 計費設定 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={24} color="#FFD700" />
            <Text style={styles.sectionTitle}>計費設定</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>基本費用 (NT$)</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.baseFare}
              onChangeText={(value) => updateSetting('baseFare', value)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>每公里費率 (NT$)</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.perKmRate}
              onChangeText={(value) => updateSetting('perKmRate', value)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>每分鐘費率 (NT$)</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.perMinuteRate}
              onChangeText={(value) => updateSetting('perMinuteRate', value)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>最低收費 (NT$)</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.minimumFare}
              onChangeText={(value) => updateSetting('minimumFare', value)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>平台抽成 (%)</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.commissionRate}
              onChangeText={(value) => updateSetting('commissionRate', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* 尖峰時段設定 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={24} color="#FF9500" />
            <Text style={styles.sectionTitle}>尖峰時段設定</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>早高峰開始時間</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.morningPeakStart}
              onChangeText={(value) => updateSetting('morningPeakStart', value)}
              placeholder="HH:MM"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>早高峰結束時間</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.morningPeakEnd}
              onChangeText={(value) => updateSetting('morningPeakEnd', value)}
              placeholder="HH:MM"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>晚高峰開始時間</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.eveningPeakStart}
              onChangeText={(value) => updateSetting('eveningPeakStart', value)}
              placeholder="HH:MM"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>晚高峰結束時間</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.eveningPeakEnd}
              onChangeText={(value) => updateSetting('eveningPeakEnd', value)}
              placeholder="HH:MM"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>尖峰加成倍率</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.peakMultiplier}
              onChangeText={(value) => updateSetting('peakMultiplier', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* 派單設定 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color="#34C759" />
            <Text style={styles.sectionTitle}>派單設定</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>自動派單</Text>
            <Switch
              value={settings.autoDispatch}
              onValueChange={(value) => updateSetting('autoDispatch', value)}
              trackColor={{ false: '#ccc', true: '#FFD700' }}
              thumbColor={settings.autoDispatch ? '#000' : '#fff'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>派單半徑 (公尺)</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.dispatchRadius}
              onChangeText={(value) => updateSetting('dispatchRadius', value)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>最大等待時間 (秒)</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.maxWaitingTime}
              onChangeText={(value) => updateSetting('maxWaitingTime', value)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>免費取消時限 (秒)</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.cancellationTimeLimit}
              onChangeText={(value) => updateSetting('cancellationTimeLimit', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* 通知設定 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>通知設定</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>推播通知</Text>
            <Switch
              value={settings.pushNotifications}
              onValueChange={(value) => updateSetting('pushNotifications', value)}
              trackColor={{ false: '#ccc', true: '#FFD700' }}
              thumbColor={settings.pushNotifications ? '#000' : '#fff'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>電子郵件通知</Text>
            <Switch
              value={settings.emailNotifications}
              onValueChange={(value) => updateSetting('emailNotifications', value)}
              trackColor={{ false: '#ccc', true: '#FFD700' }}
              thumbColor={settings.emailNotifications ? '#000' : '#fff'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>簡訊通知</Text>
            <Switch
              value={settings.smsNotifications}
              onValueChange={(value) => updateSetting('smsNotifications', value)}
              trackColor={{ false: '#ccc', true: '#FFD700' }}
              thumbColor={settings.smsNotifications ? '#000' : '#fff'}
            />
          </View>
        </View>

        {/* 安全設定 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color="#FF3B30" />
            <Text style={styles.sectionTitle}>安全設定</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>手機號碼驗證</Text>
            <Switch
              value={settings.requirePhoneVerification}
              onValueChange={(value) => updateSetting('requirePhoneVerification', value)}
              trackColor={{ false: '#ccc', true: '#FFD700' }}
              thumbColor={settings.requirePhoneVerification ? '#000' : '#fff'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>電子郵件驗證</Text>
            <Switch
              value={settings.requireEmailVerification}
              onValueChange={(value) => updateSetting('requireEmailVerification', value)}
              trackColor={{ false: '#ccc', true: '#FFD700' }}
              thumbColor={settings.requireEmailVerification ? '#000' : '#fff'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>雙重驗證</Text>
            <Switch
              value={settings.enableTwoFactor}
              onValueChange={(value) => updateSetting('enableTwoFactor', value)}
              trackColor={{ false: '#ccc', true: '#FFD700' }}
              thumbColor={settings.enableTwoFactor ? '#000' : '#fff'}
            />
          </View>
        </View>

        {/* 應用設定 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={24} color="#8E44AD" />
            <Text style={styles.sectionTitle}>應用設定</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>應用名稱</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.appName}
              onChangeText={(value) => updateSetting('appName', value)}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>客服電話</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.supportPhone}
              onChangeText={(value) => updateSetting('supportPhone', value)}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>客服信箱</Text>
            <TextInput
              style={styles.settingInput}
              value={settings.supportEmail}
              onChangeText={(value) => updateSetting('supportEmail', value)}
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>維護模式</Text>
            <Switch
              value={settings.maintenanceMode}
              onValueChange={(value) => updateSetting('maintenanceMode', value)}
              trackColor={{ false: '#ccc', true: '#FF3B30' }}
              thumbColor={settings.maintenanceMode ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* 操作按鈕 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetToDefault}
          >
            <Text style={styles.resetButtonText}>重設為預設值</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => {
              Alert.alert(
                '測試系統設定',
                `基本費用：NT$${settings.baseFare}\n每公里：NT$${settings.perKmRate}\n尖峰加成：${settings.peakMultiplier}倍\n自動派單：${settings.autoDispatch ? '開啟' : '關閉'}\n派單半徑：${settings.dispatchRadius}公尺`,
                [{ text: '確定' }]
              );
            }}
          >
            <Wifi size={20} color="#007AFF" />
            <Text style={styles.testButtonText}>測試設定</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  settingInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    minWidth: 100,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});