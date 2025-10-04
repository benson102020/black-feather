import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { X, ZoomIn } from 'lucide-react-native';

interface PhotoPreviewProps {
  visible: boolean;
  photoUrl: string;
  title: string;
  onClose: () => void;
}

export default function PhotoPreview({ visible, photoUrl, title, onClose }: PhotoPreviewProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.imageContainer}>
            <Image source={{ uri: photoUrl }} style={styles.image} resizeMode="contain" />
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.zoomButton}>
              <ZoomIn size={20} color="#FFD700" />
              <Text style={styles.zoomText}>點擊圖片可放大查看</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  imageContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  zoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomText: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 8,
  },
});