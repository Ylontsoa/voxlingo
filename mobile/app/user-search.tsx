import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { searchUsersRequest } from '../services/api/users';
import { startConversationRequest } from '../services/api/conversations';
import { getFlag } from '../constants/flags';
import { AVATARS } from '../constants/avatars';

interface SearchUser {
  id: number;
  username?: string;
  email: string;
  profile_image_url?: string;
  target_language?: string;
}

export default function UserSearchScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [startingId, setStartingId] = useState<number | null>(null);

  const runSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await searchUsersRequest(text.trim());
      setResults(res.users);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  async function handleSelectUser(target: SearchUser) {
    if (startingId) return; // ✅ evite le double clic pendant une requete en cours
    setStartingId(target.id);
    try {
      const myLanguage = user?.target_language || 'francais';
      const res = await startConversationRequest(target.id, myLanguage);
      router.replace(`/translator/${res.code}`);
    } catch (err: any) {
      console.error('[USER_SEARCH] Echec demarrage:', err?.response?.data || err.message);
    } finally {
      setStartingId(null);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.surface }]}>
          <FontAwesome name="times" size={18} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Rechercher quelqu'un</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <FontAwesome name="search" size={14} color={theme.textSecondary} />
        <TextInput
          value={query}
          onChangeText={runSearch}
          placeholder="Nom ou email..."
          placeholderTextColor={theme.textSecondary}
          style={[styles.searchInput, { color: theme.text }]}
          autoFocus
        />
        {searching && <ActivityIndicator size="small" color={theme.primary} />}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const flagUrl = item.target_language ? getFlag(item.target_language) : null;
          const isStarting = startingId === item.id;
          return (
            <TouchableOpacity
              onPress={() => handleSelectUser(item)}
              disabled={isStarting}
              activeOpacity={0.7}
              style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <Image source={{ uri: item.profile_image_url || AVATARS[0] }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                  {item.username || item.email.split('@')[0]}
                </Text>
                {item.target_language && (
                  <View style={styles.langRow}>
                    {flagUrl && <Image source={{ uri: flagUrl }} style={styles.flag} />}
                    <Text style={[styles.langText, { color: theme.textSecondary }]}>{item.target_language}</Text>
                  </View>
                )}
              </View>
              {isStarting ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <FontAwesome name="chevron-right" size={13} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          query.trim().length >= 2 && !searching ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Aucun utilisateur trouve</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '800' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F3F4F6' },
  userInfo: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700' },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  flag: { width: 16, height: 12, borderRadius: 2 },
  langText: { fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 13 },
});