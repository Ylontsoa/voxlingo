import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { formatScore } from '../../utils/formatting';

export default function StatsCard({ averageScore }: { averageScore: number | null }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <FontAwesome name="trophy" size={20} color="#6366F1" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Score moyen</Text>
        <Text style={styles.value}>{formatScore(averageScore)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6',
  },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF0FF',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  textContainer: { flex: 1 },
  label: { fontSize: 13, color: '#6B7280' },
  value: { fontSize: 22, fontWeight: '800', color: '#111827', marginTop: 2 },
});