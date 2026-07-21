import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function AboutScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>A propos</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.appName, { color: theme.text }]}>🎤 VoxLingo</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Apprends une langue en la parlant
        </Text>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Comment ca marche ?</Text>
          <Text style={[styles.para, { color: theme.textSecondary }]}>
            1. Choisis une langue{'\n'}
            2. Ecoute la phrase de reference{'\n'}
            3. Prononce-la a ton tour{'\n'}
            4. Recois un feedback immediat{'\n'}
            5. Progresse et gagne des badges !
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Fonctionnalites</Text>
          <Text style={[styles.para, { color: theme.textSecondary }]}>
            🎤 Reconnaissance vocale{'\n'}
            📊 Feedback de prononciation{'\n'}
            🔥 Systeme de streak{'\n'}
            ⭐ XP et niveaux{'\n'}
            🏆 Badges de reussite{'\n'}
            💬 Chatbot IA pour converser{'\n'}
            🌙 Mode sombre{'\n'}
            🔔 Rappels quotidiens
          </Text>
        </View>

        {/* ✅ Technologies utilisées */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Technologies</Text>
          <Text style={[styles.para, { color: theme.textSecondary }]}>
            ⚛️ React Native / Expo{'\n'}
            🟢 Node.js / Express{'\n'}
            🗄️ MySQL / Sequelize{'\n'}
            🤖 Gemini AI / Groq Whisper{'\n'}
            🎤 Reconnaissance vocale multilingue
          </Text>
        </View>

        {/* ✅ Crédits */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Credits</Text>
          <Text style={[styles.para, { color: theme.textSecondary }]}>
            Developpe avec ❤️ par VoxLingo Team{'\n'}
            Toutes les lecons sont generees par IA{'\n'}
            Les images proviennent de Unsplash
          </Text>
        </View>

        {/* ✅ Contact */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:contact@voxlingo.com')} style={styles.contactRow}>
            <FontAwesome name="envelope" size={14} color={theme.primary} />
            <Text style={[styles.contactText, { color: theme.primary }]}>contact@voxlingo.com</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.version, { color: theme.textSecondary }]}>Version 1.0.0</Text>
        <Text style={[styles.copyright, { color: theme.textSecondary }]}>© 2026 VoxLingo - Tous droits reserves</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, gap: 16 },
  appName: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  para: { fontSize: 14, lineHeight: 22 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  contactText: { fontSize: 14, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: 12, marginTop: 16 },
  copyright: { textAlign: 'center', fontSize: 11, marginTop: 4 },
});