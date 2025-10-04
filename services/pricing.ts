// 計費系統服務
import { supabase } from './supabase';

export interface PricingConfig {
  id: string;
  name: string;
  base_fare: number;
  per_km_rate: number;
  per_minute_rate: number;
  minimum_fare: number;
  maximum_fare?: number;
  currency: string;
  is_active: boolean;
}

export interface VehicleType {
  id: string;
  name: string;
  description?: string;
  multiplier: number;
  base_capacity: number;
  max_capacity: number;
  icon_url?: string;
  is_active: boolean;
}

export interface SurgePricing {
  id: string;
  name: string;
  multiplier: number;
  start_time: string;
  end_time: string;
  days_of_week: number[];
  is_active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
}

export interface FareCalculation {
  base_fare: number;
  distance_fare: number;
  time_fare: number;
  vehicle_multiplier: number;
  surge_multiplier: number;
  subtotal: number;
  discount_amount: number;
  total_fare: number;
  breakdown: {
    base: number;
    distance: number;
    time: number;
    vehicle_adjustment: number;
    surge_adjustment: number;
    discount: number;
  };
}

class PricingService {
  // 獲取當前計費配置
  async getCurrentPricingConfig(): Promise<PricingConfig | null> {
    // 演示模式 - 返回預設計費配置
    const isDemoMode = process.env.EXPO_PUBLIC_SUPABASE_URL?.includes('demo-project') || 
                       process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.includes('demo-key');
    
    if (isDemoMode) {
      console.log('💰 演示模式計費配置');
      return {
        base_fare: 85,
        per_km_rate: 12,
        per_minute_rate: 2.5,
        minimum_fare: 85,
        maximum_fare: 2000,
        peak_multiplier: 1.5,
        peak_hours: [
          { start: '07:00', end: '09:00' },
          { start: '17:00', end: '19:00' }
        ],
        vehicle_multipliers: {
          standard: 1.0,
          premium: 1.3,
          luxury: 1.8
        }
      };
    }

    try {
      const { data, error } = await supabase
        .from('pricing_config')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('獲取計費配置錯誤:', error);
      return null;
    }
  }

  // 獲取車型列表
  async getVehicleTypes(): Promise<VehicleType[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('獲取車型列表錯誤:', error);
      return [];
    }
  }

  // 獲取當前尖峰加成
  async getCurrentSurgeMultiplier(): Promise<number> {
    try {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM
      const currentDay = now.getDay() || 7; // 1-7, 週日為7

      const { data, error } = await supabase
        .from('surge_pricing')
        .select('*')
        .eq('is_active', true)
        .lte('start_time', currentTime)
        .gte('end_time', currentTime)
        .contains('days_of_week', [currentDay]);

      if (error) throw error;

      // 如果有多個符合條件的加成，取最高的
      const maxSurge = data?.reduce((max, current) => 
        current.multiplier > max ? current.multiplier : max, 1.0
      ) || 1.0;

      return maxSurge;
    } catch (error) {
      console.error('獲取尖峰加成錯誤:', error);
      return 1.0; // 預設無加成
    }
  }

  // 驗證優惠券
  async validateCoupon(code: string, userId: string, orderAmount: number): Promise<Coupon | null> {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .lte('valid_from', new Date().toISOString())
        .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
        .single();

      if (error) throw error;

      // 檢查使用限制
      if (data.usage_limit && data.used_count >= data.usage_limit) {
        return null;
      }

      // 檢查最低消費
      if (orderAmount < data.minimum_order_amount) {
        return null;
      }

      // 檢查用戶是否已使用過
      const { data: usageData } = await supabase
        .from('coupon_usage')
        .select('id')
        .eq('coupon_id', data.id)
        .eq('user_id', userId)
        .limit(1);

      if (usageData && usageData.length > 0) {
        return null; // 已使用過
      }

      return data;
    } catch (error) {
      console.error('驗證優惠券錯誤:', error);
      return null;
    }
  }

  // 計算車費
  async calculateFare(
    distance: number, // 公里
    duration: number, // 分鐘
    vehicleTypeId?: string,
    couponCode?: string,
    userId?: string
  ): Promise<FareCalculation | null> {
    try {
      // 獲取計費配置
      const pricingConfig = await this.getCurrentPricingConfig();
      if (!pricingConfig) {
        throw new Error('無法獲取計費配置');
      }

      // 基本費用計算
      const baseFare = pricingConfig.base_fare;
      const distanceFare = distance * pricingConfig.per_km_rate;
      const timeFare = duration * pricingConfig.per_minute_rate;

      // 車型倍率
      let vehicleMultiplier = 1.0;
      if (vehicleTypeId) {
        const { data: vehicleType } = await supabase
          .from('vehicle_types')
          .select('multiplier')
          .eq('id', vehicleTypeId)
          .eq('is_active', true)
          .single();
        
        if (vehicleType) {
          vehicleMultiplier = vehicleType.multiplier;
        }
      }

      // 尖峰加成
      const surgeMultiplier = await this.getCurrentSurgeMultiplier();

      // 小計計算
      const subtotal = (baseFare + distanceFare + timeFare) * vehicleMultiplier * surgeMultiplier;

      // 應用最低和最高收費限制
      let adjustedSubtotal = Math.max(subtotal, pricingConfig.minimum_fare);
      if (pricingConfig.maximum_fare) {
        adjustedSubtotal = Math.min(adjustedSubtotal, pricingConfig.maximum_fare);
      }

      // 優惠券折扣
      let discountAmount = 0;
      if (couponCode && userId) {
        const coupon = await this.validateCoupon(couponCode, userId, adjustedSubtotal);
        if (coupon) {
          if (coupon.discount_type === 'percentage') {
            discountAmount = adjustedSubtotal * (coupon.discount_value / 100);
          } else {
            discountAmount = coupon.discount_value;
          }

          // 應用最大折扣限制
          if (coupon.maximum_discount_amount) {
            discountAmount = Math.min(discountAmount, coupon.maximum_discount_amount);
          }
        }
      }

      const totalFare = Math.max(adjustedSubtotal - discountAmount, 0);

      return {
        base_fare: baseFare,
        distance_fare: distanceFare,
        time_fare: timeFare,
        vehicle_multiplier: vehicleMultiplier,
        surge_multiplier: surgeMultiplier,
        subtotal: adjustedSubtotal,
        discount_amount: discountAmount,
        total_fare: totalFare,
        breakdown: {
          base: baseFare,
          distance: distanceFare,
          time: timeFare,
          vehicle_adjustment: (baseFare + distanceFare + timeFare) * (vehicleMultiplier - 1),
          surge_adjustment: (baseFare + distanceFare + timeFare) * vehicleMultiplier * (surgeMultiplier - 1),
          discount: -discountAmount
        }
      };
    } catch (error) {
      console.error('計算車費錯誤:', error);
      return null;
    }
  }

  // 使用優惠券
  async useCoupon(couponId: string, userId: string, orderId: string, discountAmount: number): Promise<boolean> {
    try {
      // 記錄使用
      const { error: usageError } = await supabase
        .from('coupon_usage')
        .insert([{
          coupon_id: couponId,
          user_id: userId,
          order_id: orderId,
          discount_amount: discountAmount
        }]);

      if (usageError) throw usageError;

      // 更新使用次數
      const { error: updateError } = await supabase
        .from('coupons')
        .update({ used_count: supabase.sql`used_count + 1` })
        .eq('id', couponId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('使用優惠券錯誤:', error);
      return false;
    }
  }

  // 訂閱計費配置更新
  subscribeToConfigUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('pricing-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pricing_config'
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vehicle_types'
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'surge_pricing'
      }, callback)
      .subscribe();
  }
}

export const pricingService = new PricingService();
export default pricingService;