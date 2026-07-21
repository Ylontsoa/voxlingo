import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import client from '../services/api/client';

export default function EditProfileScreen() {
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!username.trim()) {
      Alert.alert('Erreur', 'Le nom ne peut pas etre vide');
      return;
    }
    setLoading(true);
    try {
      await client.patch('/auth/update-profile', { username: username.trim() });
      await refreshUser();
      Alert.alert('Succes', 'Profil mis a jour !', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch {
      Alert.alert('Erreur', 'Impossible de mettre a jour le profil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.surface }]}>
          <FontAwesome name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Modifier le profil</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Nom d'utilisateur</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={[styles.input, { 
              backgroundColor: theme.inputBackground, 
              borderColor: theme.border, 
              color: theme.text 
            }]}
            placeholder="Ton nom"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="words"
            maxLength={30}
          />
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            Ce nom sera affiche dans l'application
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleSave} 
          disabled={loading || !username.trim()}
          activeOpacity={0.85}
          style={[
            styles.button, 
            { backgroundColor: loading || !username.trim() ? theme.border : theme.primary }
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, gap: 16 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  hint: { fontSize: 12, marginTop: 8 },
  button: {
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});