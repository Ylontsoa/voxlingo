import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface StreakCalendarProps {
  practicedDays: string[]; // format 'YYYY-MM-DD'
}

export default function StreakCalendar({ practicedDays }: StreakCalendarProps) {
  const { theme } = useTheme();
  const practicedSet = useMemo(() => new Set(practicedDays), [practicedDays]);

  const weeks = useMemo(() => {
    const today = new Date();
    const cells: { date: string; practiced: boolean }[] = [];

    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      cells.push({ date: iso, practiced: practicedSet.has(iso) });
    }

    const weeksArr: { date: string; practiced: boolean }[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeksArr.push(cells.slice(i, i + 7));
    }
    return weeksArr;
  }, [practicedSet]);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.text }]}>Activité (12 dernières semaines)</Text>
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.column}>
            {week.map((cell) => (
              <View
                key={cell.date}
                style={[
                  styles.cell,
                  { backgroundColor: cell.practiced ? theme.primary : theme.border },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  title: { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  grid: { flexDirection: 'row', gap: 3 },
  column: { gap: 3 },
  cell: { width: 10, height: 10, borderRadius: 2 },
});