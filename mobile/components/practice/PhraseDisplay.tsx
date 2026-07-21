import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface PhraseDisplayProps {
  target: string;
  translation: string;
}

export default function PhraseDisplay({ target, translation }: PhraseDisplayProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.target, { color: theme.text }]}>{target}</Text>
      <Text style={[styles.translation, { color: theme.textSecondary }]}>{translation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingHorizontal: 16, marginVertical: 24, paddingVertical: 20, borderRadius: 16, borderWidth: 1 },
  target: { fontSize: 24, fontWeight: '800', textAlign: 'center', letterSpacing: -0.3 },
  translation: { fontSize: 15, marginTop: 8, textAlign: 'center' },
});