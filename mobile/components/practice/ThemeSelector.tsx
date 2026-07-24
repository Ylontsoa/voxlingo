import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const OPTIONS: { key: 'light' | 'dark' | 'system'; label: string; icon: any }[] = [
  { key: 'light', label: 'Clair', icon: 'sun-o' },
  { key: 'dark', label: 'Sombre', icon: 'moon-o' },
  { key: 'system', label: 'Auto', icon: 'mobile' },
];

export default function ThemeSelector() {
  const { theme, mode, setMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {OPTIONS.map((opt) => {
        const active = mode === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setMode(opt.key)}
            style={[styles.option, active && { backgroundColor: theme.primary }]}
          >
            <FontAwesome name={opt.icon} size={14} color={active ? '#fff' : theme.textSecondary} />
            <Text style={[styles.label, { color: active ? '#fff' : theme.textSecondary }]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 4, gap: 4 },
  option: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  label: { fontSize: 13, fontWeight: '600' },
});