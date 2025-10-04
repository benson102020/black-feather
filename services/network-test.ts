// 網路連接測試服務
export const networkTestService = {
  // 測試網路連接
  async testNetworkConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🌐 測試網路連接...');
      
      // 測試基本網路連接
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: '網路連接正常',
          details: {
            status: response.status,
            origin: data.origin,
            userAgent: data.headers['User-Agent']
          }
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('網路連接測試失敗:', error);
      return {
        success: false,
        message: `網路連接失敗: ${error.message}`,
        details: {
          errorType: error.name,
          errorMessage: error.message
        }
      };
    }
  },

  // 測試 Supabase 連接
  async testSupabaseConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('demo') || supabaseKey.includes('demo')) {
      return {
        success: false,
        message: 'Supabase 配置未設定或為演示模式',
        details: {
          url: supabaseUrl || '未設定',
          keyLength: supabaseKey ? supabaseKey.length : 0
        }
      };
    }

    try {
      console.log('🔗 測試 Supabase 連接...');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return {
          success: true,
          message: 'Supabase 連接正常',
          details: {
            status: response.status,
            url: supabaseUrl
          }
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Supabase 連接測試失敗:', error);
      return {
        success: false,
        message: `Supabase 連接失敗: ${error.message}`,
        details: {
          errorType: error.name,
          errorMessage: error.message,
          url: supabaseUrl
        }
      };
    }
  },

  // 測試 API 端點
  async testApiEndpoints(): Promise<{ success: boolean; message: string; details?: any }> {
    const results = [];
    
    try {
      // 測試健康檢查端點
      const healthCheck = await this.testEndpoint('/health', 'GET');
      results.push({ endpoint: '/health', ...healthCheck });
      
      // 測試認證端點
      const authCheck = await this.testEndpoint('/api/auth/login', 'POST', {
        phoneNumber: 'test',
        password: 'test'
      });
      results.push({ endpoint: '/api/auth/login', ...authCheck });
      
      const successCount = results.filter(r => r.success).length;
      
      return {
        success: successCount > 0,
        message: `${successCount}/${results.length} 個端點可用`,
        details: results
      };
    } catch (error) {
      return {
        success: false,
        message: `API 端點測試失敗: ${error.message}`,
        details: results
      };
    }
  },

  // 測試單個端點
  async testEndpoint(path: string, method: string = 'GET', body?: any): Promise<{ success: boolean; message: string }> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(path, options);
      
      return {
        success: response.status < 500,
        message: `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
};

export default networkTestService;