// 即時更新服務
import { supabase } from './supabase';

export interface RealtimeEvent {
  type: 'pricing_update' | 'announcement' | 'order_status' | 'driver_location' | 'system_config';
  data: any;
  timestamp: string;
}

class RealtimeService {
  private subscriptions: Map<string, any> = new Map();

  // 訂閱系統公告
  subscribeToAnnouncements(callback: (announcement: any) => void) {
    const subscription = supabase
      .channel('system-announcements')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_announcements',
        filter: 'is_active=eq.true'
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();

    this.subscriptions.set('announcements', subscription);
    return subscription;
  }

  // 訂閱計費配置更新
  subscribeToPricingUpdates(callback: (config: any) => void) {
    const subscription = supabase
      .channel('pricing-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pricing_config'
      }, (payload) => {
        callback({
          type: 'pricing_config',
          data: payload.new,
          event: payload.eventType
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vehicle_types'
      }, (payload) => {
        callback({
          type: 'vehicle_types',
          data: payload.new,
          event: payload.eventType
        });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'surge_pricing'
      }, (payload) => {
        callback({
          type: 'surge_pricing',
          data: payload.new,
          event: payload.eventType
        });
      })
      .subscribe();

    this.subscriptions.set('pricing', subscription);
    return subscription;
  }

  // 訂閱訂單狀態更新（司機端）
  subscribeToDriverOrders(driverId: string, callback: (order: any) => void) {
    const subscription = supabase
      .channel(`driver-orders-${driverId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `driver_id=eq.${driverId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();

    this.subscriptions.set(`driver-orders-${driverId}`, subscription);
    return subscription;
  }

  // 訂閱新訂單（司機端）
  subscribeToNewOrders(callback: (order: any) => void) {
    const subscription = supabase
      .channel('new-orders')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: 'status=eq.pending'
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();

    this.subscriptions.set('new-orders', subscription);
    return subscription;
  }

  // 訂閱司機位置更新（乘客端）
  subscribeToDriverLocation(driverId: string, callback: (location: any) => void) {
    const subscription = supabase
      .channel(`driver-location-${driverId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'drivers',
        filter: `id=eq.${driverId}`
      }, (payload) => {
        if (payload.new.current_location) {
          callback({
            driverId,
            location: payload.new.current_location,
            timestamp: payload.new.last_location_update
          });
        }
      })
      .subscribe();

    this.subscriptions.set(`driver-location-${driverId}`, subscription);
    return subscription;
  }

  // 訂閱應用設定更新
  subscribeToAppSettings(callback: (settings: any) => void) {
    const subscription = supabase
      .channel('app-settings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'app_settings',
        filter: 'is_public=eq.true'
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();

    this.subscriptions.set('app-settings', subscription);
    return subscription;
  }

  // 發送即時事件
  async sendRealtimeEvent(event: RealtimeEvent) {
    try {
      const { error } = await supabase
        .from('realtime_config')
        .insert([{
          event_type: event.type,
          payload: event.data,
          target_channels: ['all'],
          is_active: true
        }]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('發送即時事件錯誤:', error);
      return { success: false, error: error.message };
    }
  }

  // 取消訂閱
  unsubscribe(key: string) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      supabase.removeChannel(subscription);
      this.subscriptions.delete(key);
    }
  }

  // 取消所有訂閱
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, key) => {
      supabase.removeChannel(subscription);
    });
    this.subscriptions.clear();
  }

  // 獲取當前活躍訂閱
  getActiveSubscriptions() {
    return Array.from(this.subscriptions.keys());
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;