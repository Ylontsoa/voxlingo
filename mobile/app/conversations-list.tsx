import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { getMyConversationsRequest } from '../services/api/conversations';
import { getFlag } from '../constants/flags';
import { AVATARS } from '../constants/avatars';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

interface ConversationItem {
  code: string;
  conversationId: number;
  otherUser: {
    id: number;
    username: string;
    avatar?: string;
    language?: string;
  };
  lastMessage: {
    text: string;
    senderId: number;
    createdAt: string;
  } | null;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

export default function ConversationsListScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      getMyConversationsRequest()
        .then((res) => {
          if (!cancelled) setConversations(res.conversations);
        })
        .catch(() => {
          if (!cancelled) setConversations([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }, [])
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.surface }]}>
          <FontAwesome name="times" size={18} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Messages</Text>
        <TouchableOpacity onPress={() => router.push('/user-search')} style={[styles.newButton, { backgroundColor: theme.primaryLight }]}>
          <FontAwesome name="plus" size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {loading && <LoadingSpinner label="Chargement des discussions..." />}

      {!loading && conversations.length === 0 && (
        <EmptyState message="Aucune discussion pour l'instant. Cherche quelqu'un pour commencer !" />
      )}

      {!loading && conversations.length > 0 && (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const flagUrl = item.otherUser.language ? getFlag(item.otherUser.language) : null;
            const isMineLast = item.lastMessage?.senderId === user?.id;
            return (
              <TouchableOpacity
                onPress={() => router.push(`/translator/${item.code}`)}
                activeOpacity={0.7}
                style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: item.otherUser.avatar || AVATARS[0] }} style={styles.avatar} />
                  {flagUrl && <Image source={{ uri: flagUrl }} style={styles.flagBadge} />}
                </View>
                <View style={styles.userInfo}>
                  <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.otherUser.username}</Text>
                  <Text style={[styles.preview, { color: theme.textSecondary }]} numberOfLines={1}>
                    {item.lastMessage ? `${isMineLast ? 'Toi : ' : ''}${item.lastMessage.text}` : 'Nouvelle conversation'}
                  </Text>
                </View>
                {item.lastMessage && (
                  <Text style={[styles.time, { color: theme.textSecondary }]}>{formatTime(item.lastMessage.createdAt)}</Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  newButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '800' },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F3F4F6' },
  flagBadge: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 13, borderRadius: 3, borderWidth: 1, borderColor: '#fff' },
  userInfo: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700' },
  preview: { fontSize: 12, marginTop: 2 },
  time: { fontSize: 11, fontWeight: '600' },
});