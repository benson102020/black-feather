// 系統設定管理服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export interface SystemSettings {
  // 計費設定
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  minimumFare: number;
  maximumFare: number;
  commissionRate: number;
  
  // 尖峰時段
  morningPeakStart: string;
  morningPeakEnd: string;
  eveningPeakStart: string;
  eveningPeakEnd: string;
  peakMultiplier: number;
  
  // 派單設定
  autoDispatch: boolean;
  dispatchRadius: number;
  maxWaitingTime: number;
  cancellationTimeLimit: number;
  
  // 通知設定
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  
  // 安全設定
  requirePhoneVerification: boolean;
  requireEmailVerification: boolean;
  enableTwoFactor: boolean;
  
  // 應用設定
  appName: string;
  supportPhone: string;
  supportEmail: string;
  maintenanceMode: boolean;
}

export const systemSettingsService = {
  // 獲取系統設定
  async getSystemSettings(): Promise<{ success: boolean; data?: SystemSettings; error?: string }> {
    if (isDemoMode) {
      console.log('⚙️ 演示模式 - 獲取系統設定');
      return {
        success: true,
        data: {
          baseFare: 85,
          perKmRate: 12,
          perMinuteRate: 2.5,
          minimumFare: 85,
          maximumFare: 2000,
          commissionRate: 15,
          morningPeakStart: '07:00',
          morningPeakEnd: '09:00',
          eveningPeakStart: '17:00',
          eveningPeakEnd: '19:00',
          peakMultiplier: 1.5,
          autoDispatch: true,
          dispatchRadius: 5000,
          maxWaitingTime: 300,
          cancellationTimeLimit: 300,
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
        }
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('system_settings')
        .select('key, value');

      if (error) throw error;

      // 轉換為設定物件
      const settingsObj: any = {};
      data.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });

      return { success: true, data: settingsObj };
    } catch (error) {
      console.error('獲取系統設定錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 更新系統設定
  async updateSystemSettings(settings: Partial<SystemSettings>, adminId: string) {
    if (isDemoMode) {
      console.log('💾 演示模式 - 更新系統設定:', settings);
      return {
        success: true,
        message: '系統設定已更新'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 將設定轉換為資料庫格式
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_by: adminId,
        updated_at: new Date().toISOString()
      }));

      const { error } = await client
        .from('system_settings')
        .upsert(settingsArray);

      if (error) throw error;

      // 發送即時更新通知
      await this.broadcastSettingsUpdate(settings);

      return { success: true, message: '系統設定已更新' };
    } catch (error) {
      console.error('更新系統設定錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 廣播設定更新
  async broadcastSettingsUpdate(settings: Partial<SystemSettings>) {
    if (isDemoMode) {
      console.log('📡 演示模式 - 廣播設定更新');
      return { success: true };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      // 發送即時更新事件
      await client
        .from('realtime_config')
        .insert([{
          event_type: 'settings_update',
          payload: settings,
          target_channels: ['all'],
          is_active: true
        }]);

      return { success: true };
    } catch (error) {
      console.error('廣播設定更新錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 重設為預設值
  async resetToDefaults(adminId: string) {
    const defaultSettings: SystemSettings = {
      baseFare: 85,
      perKmRate: 12,
      perMinuteRate: 2.5,
      minimumFare: 85,
      maximumFare: 2000,
      commissionRate: 15,
      morningPeakStart: '07:00',
      morningPeakEnd: '09:00',
      eveningPeakStart: '17:00',
      eveningPeakEnd: '19:00',
      peakMultiplier: 1.5,
      autoDispatch: true,
      dispatchRadius: 5000,
      maxWaitingTime: 300,
      cancellationTimeLimit: 300,
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
    };

    return this.updateSystemSettings(defaultSettings, adminId);
  },

  // 驗證設定值
  validateSettings(settings: Partial<SystemSettings>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 驗證計費設定
    if (settings.baseFare !== undefined && settings.baseFare < 0) {
      errors.push('基本費用不能為負數');
    }
    if (settings.perKmRate !== undefined && settings.perKmRate < 0) {
      errors.push('每公里費率不能為負數');
    }
    if (settings.minimumFare !== undefined && settings.baseFare !== undefined && settings.minimumFare < settings.baseFare) {
      errors.push('最低收費不能低於基本費用');
    }
    if (settings.commissionRate !== undefined && (settings.commissionRate < 0 || settings.commissionRate > 50)) {
      errors.push('平台抽成比例應在 0-50% 之間');
    }

    // 驗證時間格式
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (settings.morningPeakStart && !timeRegex.test(settings.morningPeakStart)) {
      errors.push('早高峰開始時間格式錯誤');
    }
    if (settings.morningPeakEnd && !timeRegex.test(settings.morningPeakEnd)) {
      errors.push('早高峰結束時間格式錯誤');
    }

    // 驗證數值範圍
    if (settings.dispatchRadius !== undefined && (settings.dispatchRadius < 1000 || settings.dispatchRadius > 50000)) {
      errors.push('派單半徑應在 1000-50000 公尺之間');
    }
    if (settings.peakMultiplier !== undefined && (settings.peakMultiplier < 1.0 || settings.peakMultiplier > 3.0)) {
      errors.push('尖峰加成倍率應在 1.0-3.0 之間');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

export default systemSettingsService;