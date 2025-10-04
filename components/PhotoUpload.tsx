import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera, Upload, X } from 'lucide-react-native';
import { uploadService } from '../services/upload';

interface PhotoUploadProps {
  title: string;
  description?: string;
  onPhotoSelected: (photoUrl: string) => void;
  currentPhoto?: string;
  required?: boolean;
}

export default function PhotoUpload({ 
  title, 
  description, 
  onPhotoSelected, 
  currentPhoto,
  required = false 
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(currentPhoto || null);

  const handlePhotoSelection = () => {
    const options = uploadService.showPhotoOptions(
      handleTakePhoto,
      handlePickFromLibrary,
      () => {}
    );

    Alert.alert(options.title, options.message, options.options);
  };

  const handleTakePhoto = async () => {
    setUploading(true);
    try {
      const result = await uploadService.takePhoto();
      if (result.success && result.localPath) {
        setLocalPhoto(result.localPath);
        onPhotoSelected(result.localPath);
      } else {
        Alert.alert('拍照失敗', result.error || '請重試');
      }
    } catch (error) {
      Alert.alert('拍照失敗', '請重試');
    } finally {
      setUploading(false);
    }
  };

  const handlePickFromLibrary = async () => {
    setUploading(true);
    try {
      const result = await uploadService.pickFromLibrary();
      if (result.success && result.localPath) {
        setLocalPhoto(result.localPath);
        onPhotoSelected(result.localPath);
      } else {
        Alert.alert('選擇失敗', result.error || '請重試');
      }
    } catch (error) {
      Alert.alert('選擇失敗', '請重試');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      '移除照片',
      '確定要移除這張照片嗎？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '移除', 
          style: 'destructive',
          onPress: () => {
            setLocalPhoto(null);
            onPhotoSelected('');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {title}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>

      {localPhoto ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: localPhoto }} style={styles.photo} />
          <View style={styles.photoOverlay}>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={handleRemovePhoto}
            >
              <X size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={handlePhotoSelection}
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handlePhotoSelection}
          disabled={uploading}
        >
          {uploading ? (
            <Text style={styles.uploadingText}>上傳中...</Text>
          ) : (
            <>
              <Camera size={32} color="#FFD700" />
              <Text style={styles.uploadText}>點擊拍照或選擇照片</Text>
              <Text style={styles.uploadHint}>支援 JPG、PNG 格式</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  required: {
    color: '#FF3B30',
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  uploadText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadHint: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  uploadingText: {
    color: '#FFD700',
    fontSize: 16,
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  retakeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
});