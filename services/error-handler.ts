// 錯誤處理服務
export const errorHandler = {
  // 處理網路錯誤
  handleNetworkError(error: any) {
    console.warn('網路錯誤:', error);
    
    if (error.name === 'TypeError' && error.message?.includes('fetch')) {
      return {
        type: 'network',
        message: '網路連接問題，請檢查網路後重試',
        suggestion: '使用測試帳號或離線模式'
      };
    }
    
    return {
      type: 'unknown',
      message: '未知錯誤',
      suggestion: '請稍後重試'
    };
  },

  // 處理 RLS 錯誤
  handleRLSError(error: any) {
    if (error.code === '42501' || error.message?.includes('row-level security')) {
      return {
        type: 'rls',
        message: '資料庫權限問題',
        suggestion: '需要執行修復腳本',
        fixAction: 'database-fix-helper'
      };
    }
    
    return null;
  },

  // 處理認證錯誤
  handleAuthError(error: any) {
    if (error.status === 401 || error.code === '401') {
      return {
        type: 'auth',
        message: '認證失敗',
        suggestion: '請檢查帳號密碼'
      };
    }
    
    return null;
  },

  // 統一錯誤處理
  processError(error: any) {
    // 檢查各種錯誤類型
    const rlsError = this.handleRLSError(error);
    if (rlsError) return rlsError;
    
    const authError = this.handleAuthError(error);
    if (authError) return authError;
    
    const networkError = this.handleNetworkError(error);
    return networkError;
  }
};

export default errorHandler;