import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, KeyboardAvoidingView, Platform,
  ScrollView, TextInput, StyleSheet, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { loginSchema } from '../../utils/validation';
import Logo from '../../components/ui/Logo';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme, mode, setMode } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const contentMaxWidth = Math.min(width - 40, 440);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) { setError(result.error.issues[0].message); return; }
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* ✅ Icône mode sombre/clair - positionnée plus bas */}
      <TouchableOpacity
        onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        style={[styles.themeToggle, { backgroundColor: theme.surface }]}
      >
        <FontAwesome
          name={mode === 'dark' ? 'sun-o' : 'moon-o'}
          size={18}
          color={mode === 'dark' ? '#FBBF24' : theme.text}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, { maxWidth: contentMaxWidth, width: '100%' }]}>
            <View style={styles.logoContainer}>
              <Logo size={isSmallScreen ? 64 : 76} />
              <Text style={[styles.title, { color: theme.text }, isSmallScreen && styles.titleSmall]}>VoxLingo</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Apprends une langue en la parlant</Text>
            </View>

            {error && (
              <View style={[styles.errorBox, { backgroundColor: theme.errorLight, borderColor: theme.error }]}>
                <FontAwesome name="exclamation-circle" size={16} color={theme.error} />
                <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}>
                <FontAwesome name="envelope-o" size={16} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder="ton@email.com" placeholderTextColor={theme.textSecondary} style={[styles.input, { color: theme.text }]} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Mot de passe</Text>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}>
                <FontAwesome name="lock" size={18} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" placeholder="••••••••" placeholderTextColor={theme.textSecondary} style={[styles.input, { color: theme.text }]} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={17} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85} style={[styles.button, { backgroundColor: theme.primary }, loading && styles.buttonDisabled]}>
              {loading ? <ActivityIndicator color="#ffffff" /> : (
                <><Text style={styles.buttonText}>Se connecter</Text><FontAwesome name="arrow-right" size={15} color="#ffffff" style={{ marginLeft: 8 }} /></>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>ou</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.linkContainer} activeOpacity={0.7}>
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>
                Pas encore de compte ? <Text style={{ color: theme.primary, fontWeight: '700' }}>S'inscrire</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  themeToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 32 },
  card: { alignSelf: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 26, fontWeight: '800', marginTop: 14, letterSpacing: -0.5 },
  titleSmall: { fontSize: 22 },
  subtitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  errorBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16, gap: 8 },
  errorText: { flex: 1, fontSize: 13 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, height: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  button: { flexDirection: 'row', borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 8 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, marginHorizontal: 12 },
  linkContainer: { alignItems: 'center', paddingVertical: 8 },
  linkText: { fontSize: 14 },
});