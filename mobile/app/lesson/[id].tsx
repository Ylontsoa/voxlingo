import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getLessonByIdRequest } from '../../services/api/lessons';
import { Lesson } from '../../types/lesson';
import { Phrase } from '../../types/phrase';
import { useTheme } from '../../hooks/useTheme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RemoteImage from '../../components/common/RemoteImage';
import { capitalize } from '../../utils/formatting';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const [lesson, setLesson] = useState<(Lesson & { phrases: Phrase[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { const res = await getLessonByIdRequest(Number(id)); setLesson(res.lesson); setLoading(false); })();
  }, [id]);

  if (loading) return <LoadingSpinner label="Chargement de la leçon..." />;
  if (!lesson) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <RemoteImage uri={lesson.image_url} style={styles.image} borderRadius={0} />
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.surface }]}>
            <FontAwesome name="arrow-left" size={16} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={[styles.tag, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.tagText, { color: theme.primary }]}>{capitalize(lesson.level)} • {capitalize(lesson.theme)}</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{lesson.title}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <FontAwesome name="list-ul" size={14} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{lesson.phrases.length} phrases</Text>
            </View>
            {lesson.average_score !== null && (
              <View style={styles.infoItem}>
                <FontAwesome name="star" size={14} color={theme.warning} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>{Math.round(lesson.average_score)}% de moyenne</Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={() => router.push(`/practice/${lesson.id}/0`)} style={[styles.button, { backgroundColor: theme.primary }]} activeOpacity={0.85}>
            <FontAwesome name="play" size={14} color="#ffffff" />
            <Text style={styles.buttonText}>Commencer la pratique</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  imageWrapper: { height: 220, position: 'relative' },
  image: { width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  content: { padding: 20 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
  tagText: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 16, letterSpacing: -0.5 },
  infoRow: { flexDirection: 'row', gap: 20, marginBottom: 28 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, fontWeight: '500' },
  button: { flexDirection: 'row', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 5 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});