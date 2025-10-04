// 檔案上傳服務
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase, getSupabaseClient } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  localPath?: string;
}

export const uploadService = {
  // 請求相機權限
  async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('請求相機權限錯誤:', error);
      return false;
    }
  },

  // 請求相簿權限
  async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('請求相簿權限錯誤:', error);
      return false;
    }
  },

  // 拍照
  async takePhoto(): Promise<UploadResult> {
    try {
      // 檢查權限
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        return { success: false, error: '需要相機權限才能拍照' };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return { success: false, error: '用戶取消拍照' };
      }

      const asset = result.assets[0];
      return { 
        success: true, 
        localPath: asset.uri,
        url: asset.uri 
      };
    } catch (error) {
      console.error('拍照錯誤:', error);
      return { success: false, error: '拍照失敗，請重試' };
    }
  },

  // 從相簿選擇
  async pickFromLibrary(): Promise<UploadResult> {
    try {
      // 檢查權限
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return { success: false, error: '需要相簿權限才能選擇照片' };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return { success: false, error: '用戶取消選擇' };
      }

      const asset = result.assets[0];
      return { 
        success: true, 
        localPath: asset.uri,
        url: asset.uri 
      };
    } catch (error) {
      console.error('選擇照片錯誤:', error);
      return { success: false, error: '選擇照片失敗，請重試' };
    }
  },

  // 上傳到 Supabase Storage
  async uploadToSupabase(
    localPath: string, 
    bucket: string, 
    fileName: string
  ): Promise<UploadResult> {
    const client = getSupabaseClient();
    
    // 演示模式 - 返回本地路徑
    if (!client) {
      console.log('📸 演示模式 - 照片已保存到本地');
      return { 
        success: true, 
        url: localPath,
        localPath: localPath 
      };
    }

    try {
      // 讀取檔案
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      if (!fileInfo.exists) {
        throw new Error('檔案不存在');
      }

      // 讀取檔案內容
      const fileData = await FileSystem.readAsStringAsync(localPath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 轉換為 Blob
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // 上傳到 Supabase Storage
      const { data, error } = await client.storage
        .from(bucket)
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // 獲取公開 URL
      const { data: urlData } = client.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return { 
        success: true, 
        url: urlData.publicUrl,
        localPath: localPath 
      };
    } catch (error) {
      console.error('上傳到 Supabase 錯誤:', error);
      return { success: false, error: error.message };
    }
  },

  // 上傳駕照照片
  async uploadLicensePhoto(driverId: string, localPath: string): Promise<UploadResult> {
    const fileName = `${driverId}/license_${Date.now()}.jpg`;
    return this.uploadToSupabase(localPath, 'licenses', fileName);
  },

  // 上傳車輛照片
  async uploadVehiclePhoto(driverId: string, localPath: string, type: 'registration' | 'insurance'): Promise<UploadResult> {
    const fileName = `${driverId}/${type}_${Date.now()}.jpg`;
    return this.uploadToSupabase(localPath, 'vehicles', fileName);
  },

  // 上傳身分證照片
  async uploadIdPhoto(driverId: string, localPath: string): Promise<UploadResult> {
    const fileName = `${driverId}/id_${Date.now()}.jpg`;
    return this.uploadToSupabase(localPath, 'documents', fileName);
  },

  // 顯示照片選擇選項
  showPhotoOptions(onTakePhoto: () => void, onPickFromLibrary: () => void, onCancel: () => void) {
    // 這個函數會在組件中使用 Alert.alert 來顯示選項
    return {
      title: '選擇照片',
      message: '請選擇照片來源',
      options: [
        { text: '拍照', onPress: onTakePhoto },
        { text: '從相簿選擇', onPress: onPickFromLibrary },
        { text: '取消', onPress: onCancel, style: 'cancel' }
      ]
    };
  }
};

export default uploadService;