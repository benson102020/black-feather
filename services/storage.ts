// Supabase Storage 管理服務
import { supabase, getSupabaseClient } from './supabase';

export const storageService = {
  // 創建 Storage Buckets
  async createBuckets() {
    const client = getSupabaseClient();
    if (!client) {
      console.log('🎭 演示模式 - 跳過 Storage 設置');
      return { success: true, message: '演示模式運行' };
    }

    try {
      // 創建必要的 buckets
      const buckets = [
        { name: 'licenses', public: false },
        { name: 'vehicles', public: false },
        { name: 'documents', public: false },
        { name: 'avatars', public: true }
      ];

      for (const bucket of buckets) {
        const { error } = await client.storage.createBucket(bucket.name, {
          public: bucket.public,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });

        if (error && !error.message.includes('already exists')) {
          console.warn(`創建 bucket ${bucket.name} 警告:`, error);
        } else {
          console.log(`✅ Bucket ${bucket.name} 已準備就緒`);
        }
      }

      return { success: true, message: 'Storage buckets 已設置完成' };
    } catch (error) {
      console.error('創建 Storage buckets 錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 設置 Storage 政策
  async setupStoragePolicies() {
    const client = getSupabaseClient();
    if (!client) {
      console.log('🎭 演示模式 - 跳過政策設置');
      return { success: true, message: '演示模式運行' };
    }

    try {
      // 這些政策通常在 Supabase Dashboard 中設置
      // 或通過 SQL 命令設置
      console.log('📋 Storage 政策需要在 Supabase Dashboard 中手動設置');
      
      return { 
        success: true, 
        message: '請在 Supabase Dashboard 的 Storage 設置中配置適當的 RLS 政策' 
      };
    } catch (error) {
      console.error('設置 Storage 政策錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 獲取檔案公開 URL
  async getPublicUrl(bucket: string, path: string): Promise<string | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data } = client.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('獲取公開 URL 錯誤:', error);
      return null;
    }
  },

  // 刪除檔案
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return true; // 演示模式

    try {
      const { error } = await client.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('刪除檔案錯誤:', error);
      return false;
    }
  },

  // 列出檔案
  async listFiles(bucket: string, folder?: string): Promise<any[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      const { data, error } = await client.storage
        .from(bucket)
        .list(folder);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('列出檔案錯誤:', error);
      return [];
    }
  }
};

export default storageService;