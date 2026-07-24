import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function AudioPlayer({ onPress, isSpeaking }: { onPress: () => void; isSpeaking: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.8}>
      <FontAwesome name="volume-up" color="#6366F1" size={16} />
      <Text style={styles.text}>{isSpeaking ? 'Lecture en cours...' : 'Écouter'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#EEF0FF', borderRadius: 999, paddingVertical: 12, paddingHorizontal: 22,
    alignSelf: 'center', marginBottom: 20,
  },
  text: { color: '#6366F1', fontWeight: '700', fontSize: 14 },
});