// 錯誤恢復和自動修復服務
export const errorRecoveryService = {
  // 檢測約束錯誤
  detectConstraintError(error: any) {
    if (error.code === '23514' || error.message?.includes('check constraint')) {
      const constraintMatch = error.message?.match(/constraint "([^"]+)"/);
      const constraintName = constraintMatch ? constraintMatch[1] : 'unknown';
      
      return {
        type: 'constraint_violation',
        constraint: constraintName,
        table: this.extractTableName(error.message),
        suggestedFix: this.getSuggestedFix(constraintName)
      };
    }
    return null;
  },

  // 提取資料表名稱
  extractTableName(errorMessage: string) {
    const tableMatch = errorMessage?.match(/relation "([^"]+)"/);
    return tableMatch ? tableMatch[1] : 'unknown';
  },

  // 獲取建議修復方案
  getSuggestedFix(constraintName: string) {
    const fixes = {
      'users_verification_status_check': {
        description: '修復 verification_status 約束',
        sql: `ALTER TABLE users DROP CONSTRAINT IF EXISTS users_verification_status_check;
ALTER TABLE users ADD CONSTRAINT users_verification_status_check 
CHECK (verification_status = ANY (ARRAY['pending', 'verified', 'approved', 'rejected']));`
      },
      'users_role_check': {
        description: '修復 role 約束',
        sql: `ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role = ANY (ARRAY['admin', 'user', 'driver', 'passenger']));`
      },
      'users_status_check': {
        description: '修復 status 約束',
        sql: `ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE users ADD CONSTRAINT users_status_check 
CHECK (status = ANY (ARRAY['active', 'inactive', 'suspended', 'pending']));`
      }
    };

    return fixes[constraintName] || {
      description: '通用約束修復',
      sql: '-- 請查看具體錯誤訊息以確定修復方案'
    };
  },

  // 自動恢復策略
  async attemptAutoRecovery(error: any) {
    const constraintError = this.detectConstraintError(error);
    
    if (constraintError) {
      return {
        canRecover: true,
        strategy: 'constraint_fix',
        message: `檢測到 ${constraintError.constraint} 約束問題`,
        fixAction: 'database-constraints-fix',
        alternativeAction: 'offline-mode-setup'
      };
    }

    if (error.message?.includes('RLS') || error.code === '42501') {
      return {
        canRecover: true,
        strategy: 'rls_fix',
        message: '檢測到 RLS 政策問題',
        fixAction: 'database-rls-fix',
        alternativeAction: 'offline-mode-setup'
      };
    }

    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return {
        canRecover: true,
        strategy: 'network_fallback',
        message: '檢測到網路連接問題',
        fixAction: 'network-error-handler',
        alternativeAction: 'offline-mode-setup'
      };
    }

    return {
      canRecover: false,
      strategy: 'manual_intervention',
      message: '需要手動處理的錯誤',
      fixAction: 'alternative-setup'
    };
  }
};

export default errorRecoveryService;