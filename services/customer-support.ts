// 客服系統服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export interface SupportTicket {
  id: string;
  user_id: string;
  user_type: 'passenger' | 'driver';
  category: 'technical' | 'billing' | 'driver_issue' | 'general';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'user' | 'support' | 'system';
  content: string;
  attachments?: any[];
  created_at: string;
}

export const customerSupportService = {
  // 創建客服工單
  async createSupportTicket(ticketData: Partial<SupportTicket>) {
    if (isDemoMode) {
      console.log('🎫 演示模式創建客服工單:', ticketData);
      return {
        success: true,
        data: {
          id: 'ticket-' + Date.now(),
          ...ticketData,
          status: 'open',
          priority: 'medium',
          created_at: new Date().toISOString()
        },
        message: '您的問題已提交，客服人員將在30分鐘內回覆'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('support_tickets')
        .insert([{
          ...ticketData,
          status: 'open',
          priority: 'medium'
        }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data, message: '您的問題已提交' };
    } catch (error) {
      console.error('創建客服工單錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取客服對話
  async getSupportConversation(userId: string) {
    if (isDemoMode) {
      console.log('💬 演示模式獲取客服對話:', userId);
      return {
        success: true,
        data: [
          {
            id: 'msg-001',
            sender_type: 'support',
            sender_name: '客服小美',
            content: '您好！我是 Black feather 客服小美，有什麼可以幫助您的嗎？',
            created_at: new Date(Date.now() - 1800000).toISOString()
          },
          {
            id: 'msg-002',
            sender_type: 'user',
            sender_name: '您',
            content: '我想詢問叫車的費用計算方式',
            created_at: new Date(Date.now() - 1680000).toISOString()
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('support_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取客服對話錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 發送客服訊息
  async sendSupportMessage(userId: string, content: string) {
    if (isDemoMode) {
      console.log('📤 演示模式發送客服訊息:', content);
      return {
        success: true,
        data: {
          id: 'msg-' + Date.now(),
          content: content,
          created_at: new Date().toISOString()
        }
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('support_messages')
        .insert([{
          user_id: userId,
          sender_type: 'user',
          content: content
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('發送客服訊息錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取常見問題
  async getFAQ() {
    return {
      success: true,
      data: [
        {
          id: 'faq-001',
          question: '如何計算車資？',
          answer: '車資包含基本費用 NT$85 + 每公里 NT$12 + 每分鐘 NT$2.5，尖峰時段有 1.5 倍加成。'
        },
        {
          id: 'faq-002',
          question: '如何取消訂單？',
          answer: '在訂單頁面點擊「取消訂單」按鈕，司機接單前可免費取消。'
        },
        {
          id: 'faq-003',
          question: '司機遲到怎麼辦？',
          answer: '您可以直接聯絡司機詢問狀況，或聯絡客服協助處理。'
        },
        {
          id: 'faq-004',
          question: '如何聯絡司機？',
          answer: '在訂單詳情頁面有「聯絡司機」按鈕，可直接撥打電話。'
        }
      ]
    };
  }
};

export default customerSupportService;