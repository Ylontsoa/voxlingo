import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { formatStreak } from '../../utils/formatting';

export default function StreakDisplay({ streak }: { streak: number }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <FontAwesome name="fire" size={22} color="#F97316" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.streakNumber}>{streak}</Text>
        <Text style={styles.label}>{formatStreak(streak)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED',
    borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#FED7AA',
  },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFEDD5',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  textContainer: { flex: 1 },
  streakNumber: { fontSize: 20, fontWeight: '800', color: '#111827' },
  label: { fontSize: 13, color: '#92400E', marginTop: 2 },
});