// 訊息系統真實數據服務
import { supabase, getSupabaseClient } from './supabase';

export const messageService = {
  // 獲取對話列表
  async getConversations(userId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { data, error } = await client
        .from('conversations')
        .select('*')
        .contains('participants', [userId])
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('獲取對話列表錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取對話訊息
  async getMessages(conversationId: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { data, error } = await client
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey (full_name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('獲取訊息錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 發送訊息
  async sendMessage(conversationId: string, senderId: string, content: string) {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { data, error } = await client
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          message_type: 'text',
          status: 'sent'
        }])
        .select()
        .single();

      if (error) throw error;

      // 更新對話的最後訊息
      await client
        .from('conversations')
        .update({
          last_message_id: data.id,
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      return { success: true, data };
    } catch (error) {
      console.error('發送訊息錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 創建對話
  async createConversation(participants: string[], rideId?: string, type: 'ride' | 'support' = 'ride') {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('請先配置 Supabase');

      const { data, error } = await client
        .from('conversations')
        .insert([{
          participants,
          ride_id: rideId,
          type,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('創建對話錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 訂閱新訊息
  subscribeToMessages(conversationId: string, callback: (message: any) => void) {
    const client = getSupabaseClient();
    if (!client) {
      console.warn('Supabase 未配置，無法訂閱訊息');
      return null;
    }

    return client
      .channel(`messages-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        callback(payload.new);
      })
      .subscribe();
  }
};

export default messageService;