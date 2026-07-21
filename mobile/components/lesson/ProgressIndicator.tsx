import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressIndicator({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Phrase {current} sur {total}</Text>
        <Text style={styles.percent}>{Math.round(percentage)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  percent: { fontSize: 13, color: '#6366F1', fontWeight: '700' },
  track: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 999 },
});