// API 回應類型定義
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 司機資料類型
export interface DriverProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  email?: string;
  rating: number;
  totalOrders: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  vehicle?: VehicleInfo;
  license?: LicenseInfo;
  bankAccount?: BankAccountInfo;
  emergencyContact?: EmergencyContactInfo;
}

// 車輛資訊
export interface VehicleInfo {
  id: string;
  brand: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  capacity: number;
  status: 'active' | 'maintenance' | 'retired';
}

// 駕照資訊
export interface LicenseInfo {
  licenseNumber: string;
  licenseExpiry: string;
  licenseClass: 'A1' | 'A2' | 'B' | 'C' | 'D';
  issueDate: string;
  isValid: boolean;
}

// 銀行帳戶資訊
export interface BankAccountInfo {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  isVerified: boolean;
}

// 緊急聯絡人資訊
export interface EmergencyContactInfo {
  name: string;
  phone: string;
  relation: string;
  address?: string;
}

// 訂單類型
export interface Order {
  id: string;
  driverId?: string;
  customerId: string;
  status: OrderStatus;
  pickup: LocationInfo;
  dropoff: LocationInfo;
  customer: CustomerInfo;
  fee: number;
  distance: number;
  estimatedTime: number;
  actualTime?: number;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'pending'           // 待確認
  | 'accepted'          // 已接受
  | 'pickup_going'      // 前往提貨
  | 'pickup_arrived'    // 到達提貨
  | 'pickup_completed'  // 提貨完成
  | 'delivery_going'    // 前往卸貨
  | 'delivery_arrived'  // 到達卸貨
  | 'delivery_completed'// 卸貨完成
  | 'completed'         // 已完成
  | 'cancelled';        // 已取消

// 位置資訊
export interface LocationInfo {
  address: string;
  latitude: number;
  longitude: number;
  contactPerson?: string;
  contactPhone?: string;
  notes?: string;
}

// 客戶資訊
export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  company?: string;
  rating?: number;
}

// 收入資料
export interface EarningsData {
  period: 'today' | 'week' | 'month' | 'year';
  total: number;
  orders: number;
  hours: number;
  average: number;
  startDate: string;
  endDate: string;
  records?: EarningRecord[];
}

// 收入記錄
export interface EarningRecord {
  id: string;
  orderId: string;
  driverId: string;
  amount: number;
  date: string;
  customer: string;
  status: 'paid' | 'pending' | 'processing';
  paymentMethod: 'cash' | 'transfer' | 'app';
  commission: number;
  netAmount: number;
}

// 對話資訊
export interface Conversation {
  id: string;
  type: 'customer' | 'support' | 'system';
  participants: string[];
  name: string;
  orderId?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked';
}

// 訊息資訊
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'driver' | 'customer' | 'support' | 'system';
  content: string;
  type: 'text' | 'image' | 'file' | 'location';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  metadata?: any;
}

// WebSocket 訊息類型
export interface WebSocketMessage {
  type: 'new_order' | 'order_cancelled' | 'order_updated' | 'message' | 'location_update';
  data: any;
  timestamp: string;
}

// 登入請求
export interface LoginRequest {
  phoneNumber: string;
  password: string;
  userType: 'driver' | 'passenger';
}

// 登入回應
export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  driver?: DriverProfile;
  expiresIn?: number;
}

// 註冊請求
export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  password: string;
  userType: 'driver';
  licenseNumber: string;
  licenseExpiry: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePlate: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  jkopayAccount?: string;
  jkopayName?: string;
}

// 忘記密碼請求
export interface ForgotPasswordRequest {
  phoneNumber: string;
  userType: 'driver' | 'passenger';
}

// 驗證碼驗證請求
export interface VerifyCodeRequest {
  phoneNumber: string;
  code: string;
  userType: 'driver' | 'passenger';
}

// 重設密碼請求
export interface ResetPasswordRequest {
  phoneNumber: string;
  newPassword: string;
  code: string;
  userType: 'driver' | 'passenger';
}