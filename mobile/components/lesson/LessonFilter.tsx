import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface LessonFilterProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

export default function LessonFilter({ options, selected, onSelect }: LessonFilterProps) {
  const { theme } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <TouchableOpacity
        onPress={() => onSelect(null)}
        style={[styles.chip, { backgroundColor: !selected ? theme.primary : theme.surface }]}
      >
        <Text style={[styles.chipText, { color: !selected ? '#fff' : theme.text }]}>Tous</Text>
      </TouchableOpacity>
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.chip, { backgroundColor: isActive ? theme.primary : theme.surface }]}
          >
            <Text style={[styles.chipText, { color: isActive ? '#fff' : theme.text }]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 4, paddingBottom: 12, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, marginRight: 8 },
  chipText: { fontSize: 13, fontWeight: '600' },
});