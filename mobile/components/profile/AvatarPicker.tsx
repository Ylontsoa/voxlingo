import React from 'react';
import { View, TouchableOpacity, Image, Modal, Text, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AVATARS } from '../../constants/avatars';

interface AvatarPickerProps {
  visible: boolean;
  currentAvatar: string | null | undefined;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function AvatarPicker({ visible, currentAvatar, onSelect, onClose }: AvatarPickerProps) {

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusee', 'Active l\'acces a la galerie dans les parametres.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      onSelect(result.assets[0].uri);
      onClose();
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusee', 'Active l\'acces a la camera dans les parametres.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].uri) {
      onSelect(result.assets[0].uri);
      onClose();
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choisis ton avatar</Text>

          <View style={styles.photoButtons}>
            <TouchableOpacity onPress={takePhoto} style={styles.photoButton}>
              <FontAwesome name="camera" size={20} color="#6366F1" />
              <Text style={styles.photoButtonText}>Appareil photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickFromGallery} style={styles.photoButton}>
              <FontAwesome name="image" size={20} color="#6366F1" />
              <Text style={styles.photoButtonText}>Galerie</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>ou choisis un avatar</Text>

          <View style={styles.grid}>
            {AVATARS.map((url) => {
              const isSelected = currentAvatar === url;
              return (
                <TouchableOpacity
                  key={url}
                  onPress={() => { onSelect(url); onClose(); }}
                  style={[styles.avatarWrapper, isSelected && styles.avatarWrapperSelected]}
                >
                  <Image source={{ uri: url }} style={styles.avatar} />
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <FontAwesome name="check" size={10} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  handle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 20 },
  photoButtons: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  photoButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#EEF0FF', borderRadius: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: '#C7D2FE',
  },
  photoButtonText: { color: '#6366F1', fontSize: 14, fontWeight: '600' },
  orText: { textAlign: 'center', color: '#9CA3AF', fontSize: 13, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14 },
  avatarWrapper: {
    borderRadius: 40, borderWidth: 2.5, borderColor: 'transparent', padding: 2, position: 'relative',
  },
  avatarWrapperSelected: { borderColor: '#6366F1' },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#F3F4F6' },
  checkBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff',
  },
  closeButton: { marginTop: 24, alignItems: 'center', paddingVertical: 10 },
  closeText: { color: '#6B7280', fontSize: 15, fontWeight: '500' },
});