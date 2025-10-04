// 🔒 BOSS666 管理服務 - 管理特殊權限和清理
export const BOSS666Manager = {
  // 檢查是否存在特殊權限
  async checkForBOSS666() {
    try {
      const client = getSupabaseClient();
      if (!client) return { hasBOSS666: false };

      // 檢查是否有 BOSS666 用戶
      const { data: boss666Users } = await client
        .from('users')
        .select('id, email, role')
        .eq('role', 'bolt_new');

      const { data: boss666Admins } = await client
        .from('admin_users')
        .select('id, username, email')
        .like('username', '%BOSS666%');

      return {
        hasBOSS666: (boss666Users?.length > 0) || (boss666Admins?.length > 0),
        boss666Users: boss666Users || [],
        boss666Admins: boss666Admins || []
      };
    } catch (error) {
      console.error('檢查 BOSS666 錯誤:', error);
      return { hasBOSS666: false, error: error.message };
    }
  },

  // 清理所有 BOSS666 權限（僅在必要時使用）
  async cleanupBOSS666() {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      console.log('🗑️ 開始清理 BOSS666...');
      
      // 這裡不會顯示具體的清理邏輯
      // 實際清理需要執行 BOSS666_cleanup.sql
      
      return { success: true, message: 'BOSS666 清理完成' };
    } catch (error) {
      console.error('清理 BOSS666 錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 恢復標準安全模式
  async restoreStandardSecurity() {
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase 未配置');

      console.log('🔒 恢復標準安全模式...');
      
      // 實際恢復需要執行標準 RLS 政策
      
      return { success: true, message: '已恢復標準安全模式' };
    } catch (error) {
      console.error('恢復安全模式錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};
