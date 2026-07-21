import React, { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import client from '../../services/api/client';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fadeAnim.setValue(0);
      client.get('/leaderboard').then((res: any) => {
        setLeaderboard(res.data.leaderboard);
        setRefreshKey(prev => prev + 1);
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }).catch(() => setLoading(false));
    }, [])
  );

  if (loading) return <LoadingSpinner />;

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Header */}
      <LinearGradient colors={['#6366F1', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
        <Text style={styles.headerTitle}>🏆 Classement</Text>
        <Text style={styles.headerSubtitle}>Top {leaderboard.length} joueurs</Text>
      </LinearGradient>

      {/* Top 3 - Podium */}
      {top3.length > 0 && (
        <View style={styles.podium}>
          {top3.map((player, i) => (
            <Animated.View key={i} style={[styles.podiumCard, i === 0 && styles.podiumFirst, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
              <View style={[styles.crownBadge, i === 0 ? styles.crownGold : i === 1 ? styles.crownSilver : styles.crownBronze]}>
                <FontAwesome name="trophy" size={14} color="#fff" />
              </View>
              <Image source={{ uri: (player.avatar || 'https://api.dicebear.com/7.x/avataaars/png?seed=' + player.name) + '?t=' + refreshKey, cache: 'reload' }} style={[styles.podiumAvatar, i === 0 && styles.podiumAvatarFirst]} />
              <Text style={styles.podiumName} numberOfLines={1}>{player.name}</Text>
              <View style={styles.podiumXpBadge}>
                <FontAwesome name="star" size={10} color="#FBBF24" />
                <Text style={styles.podiumXp}>{player.xp} XP</Text>
              </View>
              <Text style={styles.podiumRank}>#{player.rank}</Text>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Liste des autres joueurs */}
      <FlatList
        data={rest}
        keyExtractor={(item) => item.rank.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View style={[styles.row, { backgroundColor: theme.surface, opacity: fadeAnim, transform: [{ translateX: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) }] }]}>
            <View style={[styles.rankBadge, item.rank <= 5 ? { backgroundColor: theme.primary } : { backgroundColor: theme.border }]}>
              <Text style={[styles.rankText, { color: item.rank <= 5 ? '#fff' : theme.textSecondary }]}>#{item.rank}</Text>
            </View>
            <Image source={{ uri: (item.avatar || 'https://api.dicebear.com/7.x/avataaars/png?seed=' + item.name) + '?t=' + refreshKey, cache: 'reload' }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{item.name}</Text>
              <View style={styles.levelRow}>
                <FontAwesome name="signal" size={10} color={theme.textSecondary} />
                <Text style={[styles.level, { color: theme.textSecondary }]}>Niv. {item.level}</Text>
              </View>
            </View>
            <View style={[styles.xpBadge, { backgroundColor: theme.primaryLight }]}>
              <FontAwesome name="star" size={10} color={theme.primary} />
              <Text style={[styles.xp, { color: theme.primary }]}>{item.xp} XP</Text>
            </View>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  
  // Header
  headerGradient: { alignItems: 'center', paddingVertical: 28, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  // Podium top 3
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 16, marginBottom: 16, gap: 10 },
  podiumCard: { flex: 1, alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, paddingVertical: 16, paddingHorizontal: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  podiumFirst: { paddingTop: 8, marginTop: -16 },
  crownBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  crownGold: { backgroundColor: '#F59E0B' },
  crownSilver: { backgroundColor: '#9CA3AF' },
  crownBronze: { backgroundColor: '#D97706' },
  podiumAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F3F4F6', marginBottom: 8 },
  podiumAvatarFirst: { width: 64, height: 64, borderRadius: 32 },
  podiumName: { fontSize: 12, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6 },
  podiumXpBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  podiumXp: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  podiumRank: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginTop: 6 },

  // Liste
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 8, borderRadius: 16, gap: 10 },
  rankBadge: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 12, fontWeight: '800' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F3F4F6' },
  userInfo: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  level: { fontSize: 11 },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  xp: { fontSize: 12, fontWeight: '700' },
});