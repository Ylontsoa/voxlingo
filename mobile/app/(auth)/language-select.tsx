import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LANGUAGES } from '../../constants/languages';
import { selectLanguageRequest } from '../../services/api/auth';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function LanguageSelectScreen() {
  const { refreshUser } = useAuth();
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const numColumns = width > 500 ? 3 : 2;
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (!selected) return;
    setLoading(true);
    try { await selectLanguageRequest(selected); await refreshUser(); router.replace('/(tabs)'); }
    finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
          <FontAwesome name="globe" size={22} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }, isSmallScreen && styles.titleSmall]}>Quelle langue veux-tu{'\n'}apprendre ?</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Tu pourras en ajouter d'autres plus tard</Text>
      </View>

      <FlatList
        data={LANGUAGES} key={numColumns} numColumns={numColumns}
        keyExtractor={(item) => item.code} contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        renderItem={({ item }) => {
          const isSelected = selected === item.code;
          return (
            <TouchableOpacity onPress={() => setSelected(item.code)} activeOpacity={0.8}
              style={[styles.card, { flex: 1 / numColumns, backgroundColor: isSelected ? theme.primaryLight : theme.surface, borderColor: isSelected ? theme.primary : theme.border }, isSelected && styles.cardSelected]}>
              {isSelected && <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}><FontAwesome name="check" size={11} color="#ffffff" /></View>}
              <Text style={styles.flag}>{item.flag}</Text>
              <Text style={[styles.langLabel, { color: isSelected ? theme.primary : theme.text }, isSelected && styles.langLabelSelected]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity onPress={handleStart} disabled={!selected || loading} activeOpacity={0.85}
          style={[styles.button, { backgroundColor: selected ? theme.primary : theme.border }, (!selected || loading) && styles.buttonDisabled]}>
          {loading ? <ActivityIndicator color="#ffffff" /> : (
            <><Text style={styles.buttonText}>Commencer</Text><FontAwesome name="arrow-right" size={15} color="#ffffff" style={{ marginLeft: 8 }} /></>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  iconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5, lineHeight: 30 },
  titleSmall: { fontSize: 20, lineHeight: 26 },
  subtitle: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  row: { gap: 12 },
  card: { borderWidth: 1.5, borderRadius: 18, paddingVertical: 22, alignItems: 'center', marginBottom: 12, position: 'relative' },
  cardSelected: { shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  checkBadge: { position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  flag: { fontSize: 34, marginBottom: 8 },
  langLabel: { fontSize: 14, fontWeight: '600' },
  langLabelSelected: {},
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, borderTopWidth: 1 },
  button: { flexDirection: 'row', borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  buttonDisabled: { opacity: 0.6, elevation: 0 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});