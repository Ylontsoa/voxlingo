import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import client from '../../services/api/client';

const RESEND_COOLDOWN = 30; // secondes

export default function VerifyEmailScreen() {
  const { theme } = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  // Garde-fou : écran ouvert sans email (ex: lien direct) -> on revient en arrière
  useEffect(() => {
    if (!email) {
      Alert.alert('Erreur', 'Aucun email fourni.');
      router.back();
    }
  }, [email]);

  // Compte à rebours du bouton "Renvoyer le code"
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Vérification automatique quand les 6 chiffres sont remplis
  useEffect(() => {
    const fullCode = code.join('');
    if (fullCode.length === 6 && !loading) {
      handleVerify(fullCode);
    }
  }, [code]);

  async function handleVerify(verificationCode: string) {
    setLoading(true);
    try {
      await client.post('/auth/verify-code', { email, code: verificationCode });
      router.replace('/(auth)/language-select');
    } catch (err: any) {
      const isNetworkError = !err?.response;
      Alert.alert(
        'Erreur',
        isNetworkError
          ? 'Connexion au serveur impossible. Le serveur peut mettre quelques secondes à démarrer, réessaie.'
          : err?.response?.data?.message || 'Code incorrect'
      );
      if (isMounted.current) {
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }

  async function resendCode() {
    if (resendCooldown > 0) return;
    try {
      await client.post('/auth/send-code', { email });
      Alert.alert('Succes', 'Code renvoye !');
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err: any) {
      Alert.alert('Erreur', err?.response?.data?.message || 'Impossible de renvoyer le code');
    }
  }

  function handleChange(text: string, index: number) {
    const newCode = [...code];
    newCode[index] = text.slice(-1);
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(e: any, index: number) {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Verification</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Un code a 6 chiffres a ete envoye a {email}
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!loading}
              autoFocus={index === 0}
              style={[styles.codeInput, {
                backgroundColor: theme.surface,
                borderColor: digit ? theme.primary : theme.border,
                color: theme.text,
                opacity: loading ? 0.5 : 1,
              }]}
            />
          ))}
        </View>

        {loading && <Text style={[styles.loading, { color: theme.textSecondary }]}>Verification en cours...</Text>}

        <TouchableOpacity onPress={resendCode} disabled={resendCooldown > 0} style={styles.resendButton}>
          <Text style={[styles.resendText, { color: resendCooldown > 0 ? theme.textSecondary : theme.primary }]}>
            {resendCooldown > 0 ? `Renvoyer le code (${resendCooldown}s)` : 'Renvoyer le code'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 30 },
  codeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  codeInput: {
    width: 48, height: 56, borderRadius: 12, borderWidth: 2,
    textAlign: 'center', fontSize: 24, fontWeight: '700',
  },
  loading: { fontSize: 13, marginBottom: 16 },
  resendButton: { paddingVertical: 10 },
  resendText: { fontSize: 14, fontWeight: '600' },
});