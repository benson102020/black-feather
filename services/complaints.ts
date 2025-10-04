// 投訴管理服務
import { supabase, getSupabaseClient, isDemoMode } from './supabase';

export interface ComplaintData {
  complainant_id: string;
  complainant_type: 'passenger' | 'driver';
  defendant_id?: string;
  defendant_type?: 'passenger' | 'driver';
  ride_id?: string;
  category: 'driver_behavior' | 'passenger_behavior' | 'vehicle_condition' | 'route_issue' | 'payment_issue' | 'safety_concern' | 'other';
  title: string;
  description: string;
  attachments?: any[];
}

export const complaintsService = {
  // 提交投訴
  async submitComplaint(complaintData: ComplaintData) {
    if (isDemoMode) {
      console.log('📝 演示模式提交投訴:', complaintData);
      return {
        success: true,
        data: {
          id: 'demo-complaint-' + Date.now(),
          ...complaintData,
          status: 'pending',
          priority: 'medium',
          created_at: new Date().toISOString()
        },
        message: '您的投訴已成功提交，我們將在24小時內處理'
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('complaints')
        .insert([{
          ...complaintData,
          status: 'pending',
          priority: 'medium'
        }])
        .select()
        .single();

      if (error) throw error;

      // 創建通知給管理員
      await client
        .from('notifications')
        .insert([{
          user_id: 'admin-user-id',
          title: '新投訴案件',
          message: `收到新的投訴案件：${complaintData.title}`,
          type: 'system'
        }]);

      return { success: true, data, message: '您的投訴已成功提交，我們將在24小時內處理' };
    } catch (error) {
      console.error('提交投訴錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取用戶投訴列表
  async getUserComplaints(userId: string) {
    if (isDemoMode) {
      console.log('📋 演示模式獲取投訴列表:', userId);
      return {
        success: true,
        data: [
          {
            id: 'demo-complaint-001',
            title: '司機繞路問題',
            category: 'route_issue',
            status: 'investigating',
            priority: 'medium',
            created_at: new Date().toISOString(),
            ride_id: 'RD20241225000001'
          }
        ]
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('complaints')
        .select('*')
        .eq('complainant_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取投訴列表錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取投訴詳情
  async getComplaintDetails(complaintId: string) {
    if (isDemoMode) {
      console.log('📄 演示模式獲取投訴詳情:', complaintId);
      return {
        success: true,
        data: {
          id: complaintId,
          title: '司機繞路問題',
          description: '司機沒有按照最短路線行駛，導致費用增加',
          category: 'route_issue',
          status: 'investigating',
          priority: 'medium',
          created_at: new Date().toISOString(),
          resolution: null,
          assigned_to: 'admin-001'
        }
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const { data, error } = await client
        .from('complaints')
        .select('*')
        .eq('id', complaintId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('獲取投訴詳情錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 更新投訴狀態（管理員用）
  async updateComplaintStatus(complaintId: string, status: string, resolution?: string) {
    if (isDemoMode) {
      console.log('🔄 演示模式更新投訴狀態:', complaintId, status);
      return {
        success: true,
        data: {
          id: complaintId,
          status: status,
          resolution: resolution,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null
        }
      };
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      const updateData: any = { status };
      if (resolution) {
        updateData.resolution = resolution;
      }
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await client
        .from('complaints')
        .update(updateData)
        .eq('id', complaintId)
        .select()
        .single();

      if (error) throw error;

      // 通知投訴者
      if (status === 'resolved') {
        await client
          .from('notifications')
          .insert([{
            user_id: data.complainant_id,
            title: '投訴處理完成',
            message: `您的投訴「${data.title}」已處理完成`,
            type: 'system'
          }]);
      }

      return { success: true, data };
    } catch (error) {
      console.error('更新投訴狀態錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default complaintsService;