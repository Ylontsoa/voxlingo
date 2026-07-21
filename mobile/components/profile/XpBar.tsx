import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface XpBarProps {
  level: number;
  xpInLevel: number;
  xpPerLevel: number;
}

export default function XpBar({ level, xpInLevel, xpPerLevel }: XpBarProps) {
  const { theme } = useTheme();
  const percentage = (xpInLevel / xpPerLevel) * 100;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={[styles.levelBadge, { backgroundColor: theme.primary }]}>
          <FontAwesome name="star" size={12} color="#fff" />
          <Text style={styles.levelText}>Niveau {level}</Text>
        </View>
        <Text style={[styles.xpText, { color: theme.textSecondary }]}>
          {xpInLevel} / {xpPerLevel} XP
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.border }]}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: theme.primary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  levelText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  xpText: { fontSize: 12, fontWeight: '600' },
  track: { height: 8, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
});