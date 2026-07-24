import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { useTheme } from '../../hooks/useTheme';
import { useCalendar } from '../../hooks/useCalendar';
import AvatarPicker from '../../components/profile/AvatarPicker';
import StreakCalendar from '../../components/profile/StreakCalendar';
import XpBar from '../../components/profile/XpBar';
import ThemeSelector from '../../components/profile/ThemeSelector';
import ReminderToggle from '../../components/profile/ReminderToggle';
import BadgeList from '../../components/profile/BadgeList';
import { getAllBadges } from '../../services/badges';
import { updateAvatarRequest, uploadAvatarRequest } from '../../services/api/auth';
import { AVATARS } from '../../constants/avatars';

const RING_SIZE = 108;
const RING_STROKE = 4;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const { stats, fetchStats } = useProgress();
  const { theme } = useTheme();
  const { days, fetchCalendar } = useCalendar();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now()); // ✅ Pour forcer le rafraîchissement

  // ✅ Rafraîchir quand l'écran devient visible
  useFocusEffect(
    useCallback(() => {
      fetchStats();
      fetchCalendar();
      refreshUser();
    }, [])
  );

  async function handleAvatarSelect(url: string) {
    if (url.startsWith('file://') || url.startsWith('content://')) {
      await uploadAvatarRequest(url);
    } else {
      await updateAvatarRequest(url);
    }
    await refreshUser();
    setAvatarTimestamp(Date.now()); // ✅ Force le rafraîchissement de l'image
  }

  async function handleLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  const level = stats?.level ?? 1;
  const xpInLevel = stats?.xp_in_level ?? 0;
  const xpPerLevel = stats?.xp_per_level ?? 100;
  const levelProgress = xpPerLevel > 0 ? Math.min(xpInLevel / xpPerLevel, 1) : 0;
  const ringOffset = RING_CIRCUMFERENCE * (1 - levelProgress);
  const streak = stats?.current_streak ?? user?.current_streak ?? 0;
  const displayName = user?.username || user?.email?.split('@')[0] || 'Utilisateur';
  const avatarUri = user?.profile_image_url 
    ? `${user.profile_image_url}?t=${avatarTimestamp}` 
    : AVATARS[0];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <LinearGradient colors={['#6366F1', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <TouchableOpacity onPress={() => setPickerVisible(true)} activeOpacity={0.85} style={styles.avatarWrap}>
            <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ringSvg}>
              <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} stroke="rgba(255,255,255,0.25)" strokeWidth={RING_STROKE} fill="none" />
              <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} stroke="#ffffff" strokeWidth={RING_STROKE} fill="none" strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={ringOffset} strokeLinecap="round" rotation="-90" origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`} />
            </Svg>
            {/* ✅ Avatar avec cache-busting */}
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.editBadge}>
              <FontAwesome name="pencil" size={11} color="#6366F1" />
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Niv. {level}</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <FontAwesome name="fire" size={13} color="#FBBF24" />
              <Text style={styles.pillText}>{streak} jours</Text>
            </View>
            {stats?.average_score != null && (
              <View style={styles.pill}>
                <FontAwesome name="check-circle" size={13} color="#34D399" />
                <Text style={styles.pillText}>{Math.round(stats.average_score)}% précision</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* ===== Infos personnelles ===== */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>INFORMATIONS PERSONNELLES</Text>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: theme.primaryLight }]}>
              <FontAwesome name="user" size={14} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Nom</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{displayName}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/edit-profile')} style={styles.editBtn}>
              <FontAwesome name="pencil" size={13} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: theme.primaryLight }]}>
              <FontAwesome name="envelope" size={14} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* ===== Progression XP ===== */}
        {stats && (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>TON PARCOURS</Text>
            <XpBar level={stats.level} xpInLevel={stats.xp_in_level} xpPerLevel={stats.xp_per_level} />
          </View>
        )}

        {/* ===== Badges ===== */}
        {stats && (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>BADGES</Text>
            <BadgeList badges={getAllBadges(stats)} />
          </View>
        )}

        {/* ===== Calendrier ===== */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ASSIDUITÉ</Text>
          <StreakCalendar practicedDays={days} />
        </View>

        {/* ===== Reglages ===== */}
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>RÉGLAGES</Text>
          <View style={styles.settingsRow}><ReminderToggle /></View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.settingsRow}><ThemeSelector /></View>
        </View>

        {/* ===== A propos + Deconnexion ===== */}
        <View style={[styles.card, { backgroundColor: theme.surface, paddingVertical: 4 }]}>
          <TouchableOpacity onPress={() => router.push('/about')} style={styles.listRow} activeOpacity={0.7}>
            <View style={[styles.listIconWrap, { backgroundColor: theme.primaryLight }]}>
              <FontAwesome name="info-circle" size={15} color={theme.primary} />
            </View>
            <Text style={[styles.listText, { color: theme.text }]}>À propos de VoxLingo</Text>
            <FontAwesome name="chevron-right" size={13} color={theme.textSecondary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <TouchableOpacity onPress={handleLogout} style={styles.listRow} activeOpacity={0.7}>
            <View style={[styles.listIconWrap, { backgroundColor: '#FEF2F2' }]}>
              <FontAwesome name="sign-out" size={15} color="#DC2626" />
            </View>
            <Text style={[styles.listText, { color: '#DC2626', fontWeight: '700' }]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <AvatarPicker visible={pickerVisible} currentAvatar={user?.profile_image_url} onSelect={handleAvatarSelect} onClose={() => setPickerVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 24, paddingBottom: 28, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 20 },
  avatarWrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  ringSvg: { position: 'absolute' },
  avatar: { width: RING_SIZE - 16, height: RING_SIZE - 16, borderRadius: (RING_SIZE - 16) / 2, backgroundColor: '#EEF0FF' },
  editBadge: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  levelBadge: { position: 'absolute', top: -6, alignSelf: 'center', backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  levelBadgeText: { fontSize: 11, fontWeight: '800', color: '#6366F1', letterSpacing: 0.3 },
  displayName: { fontSize: 18, fontWeight: '800', color: '#ffffff', marginTop: 12 },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontWeight: '500' },
  pillRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  pillText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  card: { marginHorizontal: 20, marginBottom: 14, borderRadius: 20, padding: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: '600', marginBottom: 1 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  editBtn: { padding: 8 },
  settingsRow: { paddingVertical: 2 },
  divider: { height: 1, marginVertical: 10 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  listIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  listText: { flex: 1, fontSize: 14, fontWeight: '600' },
});