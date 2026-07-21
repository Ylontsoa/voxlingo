import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLessons } from '../../hooks/useLessons';
import { useContinueLesson } from '../../hooks/useContinueLesson';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import LessonCard from '../../components/lesson/LessonCard';
import LessonFilter from '../../components/lesson/LessonFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { capitalize } from '../../utils/formatting';
import { AVATARS } from '../../constants/avatars';
import { getFlag } from '../../constants/flags';
import { getMistakes } from '../../services/mistakesLexicon';

const LEVELS = ['débutant', 'intermédiaire', 'avancé'];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function LessonsScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [level, setLevel] = useState<string | null>(null);
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  const { lessons, loading, error, refetch } = useLessons({
    language: user?.target_language || undefined,
    level: level || undefined,
    theme: themeFilter || undefined,
  });
  const { continueLesson } = useContinueLesson();

  const flagUrl = user?.target_language ? getFlag(user.target_language) : null;
  const firstName = user?.username || user?.email?.split('@')[0] || 'Utilisateur'; // ✅

  // ✅ Exclut du filtre "theme" toute valeur qui duplique deja LEVELS (protection anti-doublon)
  const availableThemes = useMemo(() => {
    const set = new Set(
      lessons
        .map(l => l.theme)
        .filter((t): t is string => Boolean(t) && !LEVELS.includes(t.toLowerCase()))
    );
    return Array.from(set);
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    if (!search.trim()) return lessons;
    return lessons.filter(l => l.title.toLowerCase().includes(search.trim().toLowerCase()));
  }, [lessons, search]);

  useEffect(() => {
    if (user?.target_language) {
      getMistakes(user.target_language).then(m => setMistakesCount(m.length));
    }
  }, [user?.target_language]);

  async function handleRefresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.userRow} activeOpacity={0.8}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user?.profile_image_url || AVATARS[0] }} style={styles.avatar} />
            <View style={[styles.onlineDot, { borderColor: theme.background }]} />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>{getGreeting()}</Text>
            <Text style={[styles.username, { color: theme.text }]} numberOfLines={1}>{firstName}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={[styles.langPill, { backgroundColor: theme.primaryLight }]}>
          {flagUrl && <Image source={{ uri: flagUrl }} style={styles.flag} />}
          <Text style={[styles.langPillText, { color: theme.primary }]}>
            {user?.target_language ? capitalize(user.target_language) : 'Choisir'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <FontAwesome name="search" size={14} color={theme.textSecondary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher une leçon..."
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text }]}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <FontAwesome name="times-circle" size={14} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {continueLesson && (
        <TouchableOpacity onPress={() => router.push(`/lesson/${continueLesson.id}`)} activeOpacity={0.85} style={styles.continueWrap}>
          <View style={[styles.continueCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.continueIconWrap, { backgroundColor: theme.primaryLight }]}>
              <FontAwesome name="play" size={13} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.continueLabel, { color: theme.textSecondary }]}>Continuer</Text>
              <Text style={[styles.continueTitle, { color: theme.text }]} numberOfLines={1}>{continueLesson.title}</Text>
            </View>
            <Text style={[styles.continuePercent, { color: theme.primary }]}>{continueLesson.completion_percent}%</Text>
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push('/review')} activeOpacity={0.85} style={styles.reviewWrap}>
        <LinearGradient colors={['#F59E0B', '#F97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.reviewCard}>
          <View style={styles.reviewIconWrap}>
            <FontAwesome name="refresh" size={15} color="#F59E0B" />
          </View>
          <View style={styles.reviewTextWrap}>
            <Text style={styles.reviewTitle}>Révision du jour</Text>
            <Text style={styles.reviewSubtitle}>Repasse sur tes phrases ratées</Text>
          </View>
          <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.85)" />
        </LinearGradient>
      </TouchableOpacity>

      {mistakesCount > 0 && (
        <TouchableOpacity onPress={() => router.push('/(tabs)/chat')} activeOpacity={0.85} style={[styles.mistakesBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <FontAwesome name="pencil" size={13} color="#8B5CF6" />
          <Text style={[styles.mistakesText, { color: theme.text }]}>
            {mistakesCount} faute{mistakesCount > 1 ? 's' : ''} enregistrée{mistakesCount > 1 ? 's' : ''} · Va les travailler dans le chat
          </Text>
          <FontAwesome name="chevron-right" size={12} color={theme.textSecondary} />
        </TouchableOpacity>
      )}

      <View style={styles.filterContainer}>
        <LessonFilter options={LEVELS} selected={level} onSelect={setLevel} />
      </View>

      {availableThemes.length > 0 && (
        <View style={styles.filterContainer}>
          <LessonFilter options={availableThemes} selected={themeFilter} onSelect={setThemeFilter} />
        </View>
      )}

      {loading && <LoadingSpinner label="Chargement des leçons..." />}
      {error && !loading && <View style={styles.errorPadding}><ErrorMessage message={error} /></View>}

      {!loading && !error && filteredLessons.length === 0 && (
        <EmptyState message={search ? 'Aucune leçon ne correspond a ta recherche' : 'Aucune leçon disponible pour cette langue'} />
      )}

      {!loading && !error && filteredLessons.length > 0 && (
        <FlatList
          data={filteredLessons}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />}
          renderItem={({ item }) => (
            <LessonCard lesson={item} onPress={() => router.push(`/lesson/${item.id}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14,
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F3F4F6' },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#22C55E', borderWidth: 2,
  },
  userInfo: { justifyContent: 'center' },
  greeting: { fontSize: 12, fontWeight: '500', marginBottom: 1 },
  username: { fontSize: 17, fontWeight: '800', maxWidth: 160 },

  langPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999,
  },
  flag: { width: 18, height: 13, borderRadius: 2 },
  langPillText: { fontSize: 12, fontWeight: '700' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },

  continueWrap: { marginHorizontal: 20, marginBottom: 12 },
  continueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, padding: 12, borderWidth: 1,
  },
  continueIconWrap: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  continueLabel: { fontSize: 11, fontWeight: '700' },
  continueTitle: { fontSize: 14, fontWeight: '700', marginTop: 1 },
  continuePercent: { fontSize: 13, fontWeight: '800' },

  reviewWrap: { marginHorizontal: 20, marginBottom: 12, borderRadius: 18 },
  reviewCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, padding: 14 },
  reviewIconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  reviewTextWrap: { flex: 1 },
  reviewTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  reviewSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 1 },

  mistakesBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 20, marginBottom: 12, padding: 12, borderRadius: 14, borderWidth: 1,
  },
  mistakesText: { flex: 1, fontSize: 13, fontWeight: '600' },

  filterContainer: { paddingHorizontal: 20, marginTop: 2, marginBottom: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  errorPadding: { paddingHorizontal: 20 },
});