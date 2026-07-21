import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../../services/badges';

interface BadgeListProps {
  badges: Badge[];
}

export default function BadgeList({ badges }: BadgeListProps) {
  const { theme } = useTheme();
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        🏆 Badges ({earnedCount}/{badges.length})
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {badges.map((badge) => (
          <View key={badge.id} style={[styles.badge, { opacity: badge.earned ? 1 : 0.35 }]}>
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
            <Text style={[styles.badgeName, { color: theme.text }]} numberOfLines={1}>
              {badge.name}
            </Text>
            <Text style={[styles.badgeDesc, { color: theme.textSecondary }]} numberOfLines={1}>
              {badge.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  title: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  scroll: { flexDirection: 'row' },
  badge: { alignItems: 'center', marginRight: 16, width: 80 },
  badgeIcon: { fontSize: 32, marginBottom: 4 },
  badgeName: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  badgeDesc: { fontSize: 8, textAlign: 'center', marginTop: 2 },
});