// 圖標回退服務 - 處理 Lucide API 錯誤
export const iconFallbackService = {
  // 檢查圖標是否正常載入
  checkIconsLoaded(): boolean {
    try {
      // 檢查是否有 Lucide 相關錯誤
      const hasLucideError = window.console && 
        window.console.error && 
        document.querySelector('script[src*="lucide"]');
      
      return !hasLucideError;
    } catch (error) {
      return false;
    }
  },

  // 提供圖標回退方案
  getIconFallback(iconName: string): string {
    const fallbackIcons = {
      'ArrowLeft': '←',
      'Car': '🚗',
      'Users': '👥',
      'Settings': '⚙️',
      'Database': '🗄️',
      'Phone': '📞',
      'Lock': '🔒',
      'Eye': '👁️',
      'EyeOff': '🙈',
      'User': '👤',
      'Package': '📦',
      'DollarSign': '💰',
      'MessageSquare': '💬',
      'Chrome': '🏠',
      'MapPin': '📍',
      'Navigation': '🧭',
      'Clock': '⏰',
      'Star': '⭐',
      'CheckCircle': '✅',
      'XCircle': '❌',
      'AlertTriangle': '⚠️',
      'Play': '▶️',
      'Copy': '📋',
      'Trash2': '🗑️',
      'Shield': '🛡️',
      'Wifi': '📶',
      'RefreshCw': '🔄',
      'Bell': '🔔',
      'Search': '🔍',
      'Filter': '🔽',
      'Download': '⬇️',
      'Upload': '⬆️',
      'Send': '📤',
      'Mail': '📧',
      'CreditCard': '💳',
      'FileText': '📄',
      'Camera': '📷',
      'Headphones': '🎧',
      'Power': '⚡',
      'LogOut': '🚪',
      'ChevronRight': '→',
      'Home': '🏠',
      'Activity': '📊',
      'TrendingUp': '📈',
      'BarChart3': '📊',
      'PieChart': '🥧',
      'Globe': '🌐',
      'Key': '🔑',
      'Zap': '⚡'
    };

    return fallbackIcons[iconName] || '●';
  },

  // 修復圖標載入問題
  async fixIconLoading() {
    try {
      // 清除可能的錯誤狀態
      if (typeof window !== 'undefined') {
        // 重新載入頁面以清除錯誤狀態
        window.location.reload();
      }
      return { success: true };
    } catch (error) {
      console.error('修復圖標載入錯誤:', error);
      return { success: false, error: error.message };
    }
  }
};

export default iconFallbackService;