import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <FontAwesome name="inbox" size={28} color="#9CA3AF" />
      </View>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  text: { color: '#6B7280', textAlign: 'center', fontSize: 14 },
});