// 通知系統真實數據服務
import { supabase, getSupabaseClient } from './supabase';

export const notificationService = {
  // 獲取用戶通知
  async getNotifications(userId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { data, error } = await client
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('獲取通知錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 標記通知為已讀
  async markAsRead(notificationId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { error } = await client
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('標記已讀錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 創建通知
  async createNotification(userId: string, title: string, message: string, type: string = 'system') {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { data, error } = await client
        .from('notifications')
        .insert([{
          user_id: userId,
          title,
          message,
          type
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('創建通知錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取未讀通知數量
  async getUnreadCount(userId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { count, error } = await client
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('獲取未讀數量錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default notificationService;