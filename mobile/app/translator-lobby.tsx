import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { createConversationRequest, joinConversationRequest } from '../services/api/conversations';
import { LANGUAGES } from '../constants/languages';

export default function TranslatorLobbyScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [myLanguage, setMyLanguage] = useState(user?.target_language || 'francais');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    try {
      console.log('[LOBBY] Tentative de creation - langue:', myLanguage); // ✅ log
      const res = await createConversationRequest(myLanguage);
      console.log('[LOBBY] Conversation creee avec succes - code:', res.code); // ✅ log
      setCreatedCode(res.code);
    } catch (err: any) {
      console.error('[LOBBY] Echec de creation:', err?.response?.data || err.message); // ✅ log
      Alert.alert('Erreur', err?.response?.data?.message || 'Impossible de creer la conversation');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (joinCode.trim().length !== 6) {
      console.warn('[LOBBY] Code incomplet, longueur:', joinCode.trim().length); // ✅ log
      return;
    }
    setLoading(true);
    try {
      const normalizedCode = joinCode.trim().toUpperCase();
      console.log('[LOBBY] Tentative de jointure - code saisi:', joinCode, '- code normalise:', normalizedCode); // ✅ log
      const res = await joinConversationRequest(normalizedCode, myLanguage);
      console.log('[LOBBY] Jointure reussie - code:', res.code, '- otherLanguage:', res.otherLanguage); // ✅ log
      router.push(`/translator/${res.code}`);
    } catch (err: any) {
      // ✅ log complet de l'erreur reelle (statut HTTP + message serveur)
      console.error('[LOBBY] Echec de jointure - statut:', err?.response?.status, '- message serveur:', err?.response?.data?.message, '- erreur brute:', err.message);
      Alert.alert('Erreur', err?.response?.data?.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  }

  function handleEnterCreatedRoom() {
    if (createdCode) router.push(`/translator/${createdCode}`);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: theme.surface }]}>
          <FontAwesome name="times" size={18} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Traducteur en direct</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Ma langue parlee</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map(l => (
            <TouchableOpacity key={l.code} onPress={() => setMyLanguage(l.code)}
              style={[styles.langChip, { backgroundColor: myLanguage === l.code ? theme.primary : theme.surface, borderColor: theme.border }]}>
              <Text style={{ fontSize: 18 }}>{l.flag}</Text>
              <Text style={{ color: myLanguage === l.code ? '#fff' : theme.text, fontSize: 12, fontWeight: '600' }}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!createdCode ? (
          <>
            <TouchableOpacity onPress={handleCreate} disabled={loading} style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Creer une conversation</Text>}
            </TouchableOpacity>

            <Text style={[styles.orText, { color: theme.textSecondary }]}>— ou —</Text>

            <TextInput
              value={joinCode}
              onChangeText={t => setJoinCode(t.toUpperCase())}
              placeholder="Code a 6 caracteres"
              placeholderTextColor={theme.textSecondary}
              maxLength={6}
              autoCapitalize="characters"
              style={[styles.codeInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
            />
            <TouchableOpacity onPress={handleJoin} disabled={loading || joinCode.length !== 6}
              style={[styles.secondaryBtn, { borderColor: theme.primary, opacity: joinCode.length === 6 ? 1 : 0.5 }]}>
              <Text style={{ color: theme.primary, fontWeight: '700' }}>Rejoindre</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={[styles.codeCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.codeLabel, { color: theme.textSecondary }]}>Partage ce code :</Text>
            <Text style={[styles.codeValue, { color: theme.primary }]}>{createdCode}</Text>
            <TouchableOpacity onPress={handleEnterCreatedRoom} style={[styles.primaryBtn, { backgroundColor: theme.primary, marginTop: 16 }]}>
              <Text style={styles.primaryBtnText}>Entrer dans la conversation</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  closeButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '800' },
  content: { flex: 1, padding: 20 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 10 },
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  primaryBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  orText: { textAlign: 'center', marginVertical: 16, fontSize: 13 },
  codeInput: { height: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, fontSize: 20, fontWeight: '800', textAlign: 'center', letterSpacing: 4, marginBottom: 12 },
  secondaryBtn: { height: 52, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  codeCard: { padding: 24, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  codeLabel: { fontSize: 13, marginBottom: 8 },
  codeValue: { fontSize: 36, fontWeight: '900', letterSpacing: 6 },
});