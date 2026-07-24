import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import RemoteImage from '../common/RemoteImage';
import { Lesson } from '../../types/lesson';
import { formatScore, capitalize } from '../../utils/formatting';

export default function LessonCard({ lesson, onPress }: { lesson: Lesson; onPress: () => void }) {
  const { theme } = useTheme();
  const percent = lesson.completion_percent ?? 0;
  const status = lesson.status ?? 'not_started';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.imageWrap}>
        <RemoteImage uri={lesson.image_url} style={styles.image} borderRadius={16} />
        {status === 'completed' && (
          <View style={styles.completedBadge}>
            <FontAwesome name="check" size={11} color="#ffffff" />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{lesson.title}</Text>

        {status === 'in_progress' && (
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: theme.primary }]} />
          </View>
        )}

        <View style={styles.footer}>
          <View style={[styles.tag, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.tagText, { color: theme.primary }]}>{capitalize(lesson.level)}</Text>
          </View>
          <View style={styles.scoreRow}>
            <FontAwesome name="star" size={12} color="#F59E0B" />
            <Text style={[styles.scoreText, { color: theme.textSecondary }]}>{formatScore(lesson.average_score)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, marginBottom: 16, overflow: 'hidden', borderWidth: 1 },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 130 },
  completedBadge: {
    position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 14 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  progressTrack: { height: 4, borderRadius: 2, marginBottom: 10, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: '600' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  scoreText: { fontSize: 13, fontWeight: '700' },
});