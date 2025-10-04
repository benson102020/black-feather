import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, driverService, orderService, earningsService, getSupabaseClient } from '../services/supabase';
import { offlineModeService } from '../services/offline-mode';
import { router } from 'expo-router';
import { mockDataService } from '../services/mock-data';

// 應用狀態類型定義
interface AppState {
  // 用戶狀態
  user: {
    isAuthenticated: boolean;
    driverInfo: any | null;
    token: string | null;
  };
  
  // 司機狀態
  driver: {
    status: 'offline' | 'online' | 'busy';
    location: {
      latitude: number;
      longitude: number;
    } | null;
    currentOrder: any | null;
  };
  
  // 訂單狀態
  orders: {
    available: any[];
    history: any[];
    loading: boolean;
  };
  
  // 訊息狀態
  messages: {
    conversations: any[];
    unreadCount: number;
  };
  
  // 收入狀態
  earnings: {
    today: any | null;
    week: any | null;
    month: any | null;
  };
  
  // UI 狀態
  ui: {
    loading: boolean;
    error: string | null;
  };
}

// 初始狀態
const initialState: AppState = {
  user: {
    isAuthenticated: false,
    driverInfo: null,
    token: null,
  },
  driver: {
    status: 'offline',
    location: null,
    currentOrder: null,
  },
  orders: {
    available: [],
    history: [],
    loading: false,
  },
  messages: {
    conversations: [],
    unreadCount: 0,
  },
  earnings: {
    today: null,
    week: null,
    month: null,
  },
  ui: {
    loading: false,
    error: null,
  },
};

// Action 類型
type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: any; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_DRIVER_STATUS'; payload: 'offline' | 'online' | 'busy' }
  | { type: 'UPDATE_LOCATION'; payload: { latitude: number; longitude: number } }
  | { type: 'SET_CURRENT_ORDER'; payload: any }
  | { type: 'SET_AVAILABLE_ORDERS'; payload: any[] }
  | { type: 'SET_ORDER_HISTORY'; payload: any[] }
  | { type: 'SET_CONVERSATIONS'; payload: any[] }
  | { type: 'UPDATE_UNREAD_COUNT'; payload: number }
  | { type: 'SET_EARNINGS'; payload: { period: 'today' | 'week' | 'month'; data: any } };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload }
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload }
      };
      
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: {
          isAuthenticated: true,
          driverInfo: action.payload.user,
          token: action.payload.token,
        }
      };
      
    case 'LOGOUT':
      return {
        ...initialState
      };
      
    case 'UPDATE_DRIVER_STATUS':
      return {
        ...state,
        driver: { ...state.driver, status: action.payload }
      };
      
    case 'UPDATE_LOCATION':
      return {
        ...state,
        driver: { ...state.driver, location: action.payload }
      };
      
    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        driver: { ...state.driver, currentOrder: action.payload }
      };
      
    case 'SET_AVAILABLE_ORDERS':
      return {
        ...state,
        orders: { ...state.orders, available: action.payload }
      };
      
    case 'SET_ORDER_HISTORY':
      return {
        ...state,
        orders: { ...state.orders, history: action.payload }
      };
      
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        messages: { ...state.messages, conversations: action.payload }
      };
      
    case 'UPDATE_UNREAD_COUNT':
      return {
        ...state,
        messages: { ...state.messages, unreadCount: action.payload }
      };
      
    case 'SET_EARNINGS':
      return {
        ...state,
        earnings: { ...state.earnings, [action.payload.period]: action.payload.data }
      };
      
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    login: (phoneNumber: string, password: string) => Promise<boolean>;
    logout: () => void;
    setCurrentOrder: (order: any) => void;
    updateDriverStatus: (status: 'offline' | 'online' | 'busy') => Promise<void>;
    updateLocation: (latitude: number, longitude: number) => Promise<void>;
    acceptOrder: (orderId: string) => Promise<void>;
    updateOrderStatus: (orderId: string, status: string) => Promise<void>;
    loadEarnings: (period: 'today' | 'week' | 'month') => Promise<void>;
    sendMessage: (conversationId: string, content: string) => Promise<void>;
  };
} | null>(null);

// Provider 組件
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 登入
  const login = async (phoneNumber: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      console.log('🔐 登入嘗試:', phoneNumber);
      
      // 先嘗試正常登入
      let response;
      try {
        response = await authService.loginDriver(phoneNumber, password);
      } catch (error) {
        console.log('🎭 網路問題，使用離線模式');
        response = await offlineModeService.login(phoneNumber, password, 'driver');
      }
      
      if (response.success) {
        console.log('✅ 登入成功');
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.driver || response.user,
            token: response.token
          }
        });
        
        // 載入模擬數據
        const mockData = mockDataService.getDriverMockData();
        dispatch({ type: 'SET_AVAILABLE_ORDERS', payload: mockData.availableOrders });
        dispatch({ type: 'SET_CONVERSATIONS', payload: mockData.conversations });
        dispatch({ type: 'SET_EARNINGS', payload: { period: 'today', data: mockData.earningsData.today } });
        dispatch({ type: 'SET_EARNINGS', payload: { period: 'week', data: mockData.earningsData.week } });
        dispatch({ type: 'SET_EARNINGS', payload: { period: 'month', data: mockData.earningsData.month } });
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('🎭 使用離線模式');
      const offlineResponse = await offlineModeService.login(phoneNumber, password, 'driver');
      if (offlineResponse.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: offlineResponse.user,
            token: offlineResponse.token
          }
        });
        return true;
      }
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 登出
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    router.replace('/auth/login');
  };

  // 設置當前訂單
  const setCurrentOrder = (order: any) => {
    dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
  };

  // 更新司機狀態
  const updateDriverStatus = async (status: 'offline' | 'online' | 'busy') => {
    try {
      const driverId = state.user.driverInfo?.id || 'test-driver-001';
      await driverService.updateWorkStatus(driverId, status);
      dispatch({ type: 'UPDATE_DRIVER_STATUS', payload: status });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '狀態更新失敗' });
    }
  };

  // 更新位置
  const updateLocation = async (latitude: number, longitude: number) => {
    try {
      const driverId = state.user.driverInfo?.id || 'test-driver-001';
      await driverService.updateLocation(driverId, latitude, longitude);
      dispatch({ type: 'UPDATE_LOCATION', payload: { latitude, longitude } });
    } catch (error) {
      console.error('位置更新失敗:', error);
    }
  };

  // 接受訂單
  const acceptOrder = async (orderId: string) => {
    try {
      const driverId = state.user.driverInfo?.id || 'test-driver-001';
      const response = await orderService.acceptOrder(orderId, driverId);
      if (response.success) {
        dispatch({ type: 'SET_CURRENT_ORDER', payload: response.data });
        dispatch({ type: 'UPDATE_DRIVER_STATUS', payload: 'busy' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '接受訂單失敗' });
    }
  };

  // 更新訂單狀態
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const driverId = state.user.driverInfo?.id || 'test-driver-001';
      const response = await orderService.updateOrderStatus(orderId, status, driverId);
      
      // 更新當前訂單狀態
      if (response.success && state.driver.currentOrder?.id === orderId) {
        dispatch({
          type: 'SET_CURRENT_ORDER',
          payload: response.data
        });
        
        // 如果訂單完成，清除當前訂單並設為在線
        if (status === 'completed') {
          setTimeout(() => {
            dispatch({ type: 'SET_CURRENT_ORDER', payload: null });
            dispatch({ type: 'UPDATE_DRIVER_STATUS', payload: 'online' });
          }, 2000);
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '狀態更新失敗' });
    }
  };

  // 載入收入資料
  const loadEarnings = async (period: 'today' | 'week' | 'month') => {
    try {
      const driverId = state.user.driverInfo?.id;
      if (!driverId) {
        dispatch({ type: 'SET_ERROR', payload: '用戶資訊不完整' });
        return;
      }
      
      const result = await driverService.getEarningsStats(driverId, period);
      if (result.success) {
        dispatch({ type: 'SET_EARNINGS', payload: { period, data: result.data } });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || '收入資料載入失敗' });
      }
    } catch (error) {
      console.error('載入收入資料錯誤:', error);
      dispatch({ type: 'SET_ERROR', payload: '收入資料載入失敗' });
    }
  };

  // 發送訊息
  const sendMessage = async (conversationId: string, content: string) => {
    try {
      // 實際發送訊息邏輯
      console.log('發送訊息:', conversationId, content);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '訊息發送失敗' });
    }
  };

  const actions = {
    login,
    logout,
    setCurrentOrder,
    updateDriverStatus,
    updateLocation,
    acceptOrder,
    updateOrderStatus,
    loadEarnings,
    sendMessage,
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}