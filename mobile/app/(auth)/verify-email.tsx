import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import client from '../../services/api/client';

export default function VerifyEmailScreen() {
  const { theme } = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // ✅ Vérification automatique quand les 6 chiffres sont remplis
  useEffect(() => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      handleVerify(fullCode);
    }
  }, [code]);

  async function handleVerify(verificationCode: string) {
    setLoading(true);
    try {
      await client.post('/auth/verify-code', { email, code: verificationCode });
      router.replace('/(auth)/language-select');
    } catch (err: any) {
      Alert.alert('Erreur', err?.response?.data?.message || 'Code incorrect');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    try {
      await client.post('/auth/send-code', { email });
      Alert.alert('Succes', 'Code renvoye !');
    } catch {
      Alert.alert('Erreur', 'Impossible de renvoyer le code');
    }
  }

  function handleChange(text: string, index: number) {
    const newCode = [...code];
    newCode[index] = text.slice(-1); // Prendre seulement le dernier caractère
    setCode(newCode);

    // Passer au champ suivant automatiquement
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
              style={[styles.codeInput, { 
                backgroundColor: theme.surface, 
                borderColor: digit ? theme.primary : theme.border,
                color: theme.text 
              }]}
            />
          ))}
        </View>

        {loading && <Text style={[styles.loading, { color: theme.textSecondary }]}>Verification en cours...</Text>}

        <TouchableOpacity onPress={resendCode} style={styles.resendButton}>
          <Text style={[styles.resendText, { color: theme.primary }]}>Renvoyer le code</Text>
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