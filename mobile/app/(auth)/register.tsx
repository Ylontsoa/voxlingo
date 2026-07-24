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
import { registerSchema } from '../../utils/validation';
import Logo from '../../components/ui/Logo';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme, mode, setMode } = useTheme();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const contentMaxWidth = Math.min(width - 40, 440);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleRegister() {
    setError(null);
    const result = registerSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) { setError(result.error.issues[0].message); return; }
    setLoading(true);
    try {
      await register(email, password, confirmPassword, username);
      router.replace(`/(auth)/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Cet email est déjà utilisé');
    } finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* ✅ Icône mode sombre/clair */}
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
            <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.surface }]} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <FontAwesome name="arrow-left" size={18} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Logo size={isSmallScreen ? 56 : 68} />
              <Text style={[styles.title, { color: theme.text }, isSmallScreen && styles.titleSmall]}>Créer un compte</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Commence ton apprentissage dès aujourd'hui</Text>
            </View>

            {error && (
              <View style={[styles.errorBox, { backgroundColor: theme.errorLight, borderColor: theme.error }]}>
                <FontAwesome name="exclamation-circle" size={16} color={theme.error} />
                <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Nom</Text>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}>
                <FontAwesome name="user" size={16} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput value={username} onChangeText={setUsername} autoCapitalize="words" placeholder="Ton nom" placeholderTextColor={theme.textSecondary} style={[styles.input, { color: theme.text }]} />
              </View>
            </View>

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
                <TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" placeholder="8 caractères minimum" placeholderTextColor={theme.textSecondary} style={[styles.input, { color: theme.text }]} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={17} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Confirmer le mot de passe</Text>
              <View style={[styles.inputWrapper, { borderColor: passwordsMatch ? theme.success : passwordsMismatch ? theme.error : theme.border, backgroundColor: passwordsMatch ? theme.successLight : passwordsMismatch ? theme.errorLight : theme.inputBackground }]}>
                <FontAwesome name="lock" size={18} color={passwordsMatch ? theme.success : passwordsMismatch ? theme.error : theme.textSecondary} style={styles.inputIcon} />
                <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} autoCapitalize="none" placeholder="Retape ton mot de passe" placeholderTextColor={theme.textSecondary} style={[styles.input, { color: theme.text }]} />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <FontAwesome name={showConfirmPassword ? 'eye-slash' : 'eye'} size={17} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              {passwordsMatch && <View style={styles.matchRow}><FontAwesome name="check-circle" size={13} color={theme.success} /><Text style={[styles.matchText, { color: theme.success }]}>Les mots de passe correspondent</Text></View>}
              {passwordsMismatch && <View style={styles.matchRow}><FontAwesome name="times-circle" size={13} color={theme.error} /><Text style={[styles.matchText, { color: theme.error }]}>Les mots de passe ne correspondent pas</Text></View>}
            </View>

            <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.85} style={[styles.button, { backgroundColor: theme.primary }, loading && styles.buttonDisabled]}>
              {loading ? <ActivityIndicator color="#ffffff" /> : (
                <><Text style={styles.buttonText}>S'inscrire</Text><FontAwesome name="arrow-right" size={15} color="#ffffff" style={{ marginLeft: 8 }} /></>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.linkContainer} activeOpacity={0.7}>
              <Text style={[styles.linkText, { color: theme.textSecondary }]}>Déjà un compte ? <Text style={{ color: theme.primary, fontWeight: '700' }}>Se connecter</Text></Text>
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
  backButton: { marginBottom: 12, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginTop: 14, letterSpacing: -0.5 },
  titleSmall: { fontSize: 20 },
  subtitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  errorBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16, gap: 8 },
  errorText: { flex: 1, fontSize: 13 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, height: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  matchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6, marginLeft: 4 },
  matchText: { fontSize: 12, fontWeight: '500' },
  button: { flexDirection: 'row', borderRadius: 14, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 8, elevation: 5 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  linkContainer: { alignItems: 'center', paddingVertical: 12, marginTop: 16 },
  linkText: { fontSize: 14 },
});