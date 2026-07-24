import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface PhoneticFeedbackProps {
  phoneticTips: string[];
  missingWords: string[];
  extraWords: string[];
}

export default function PhoneticFeedback({ phoneticTips, missingWords, extraWords }: PhoneticFeedbackProps) {
  const hasContent = phoneticTips.length > 0 || missingWords.length > 0 || extraWords.length > 0;
  if (!hasContent) return null;

  return (
    <View style={styles.container}>
      {missingWords.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="times-circle" size={14} color="#EF4444" />
            <Text style={[styles.sectionTitle, { color: '#DC2626' }]}>Mots oublies</Text>
          </View>
          <View style={styles.wordList}>
            {missingWords.map((word, i) => (
              <View key={i} style={[styles.wordBadge, styles.wordBadgeMissing]}>
                <Text style={styles.wordBadgeTextMissing}>{word}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {extraWords.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="plus-circle" size={14} color="#F59E0B" />
            <Text style={[styles.sectionTitle, { color: '#92400E' }]}>Mots en trop</Text>
          </View>
          <View style={styles.wordList}>
            {extraWords.map((word, i) => (
              <View key={i} style={[styles.wordBadge, styles.wordBadgeExtra]}>
                <Text style={styles.wordBadgeTextExtra}>{word}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {phoneticTips.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="lightbulb-o" size={14} color="#F59E0B" />
            <Text style={[styles.sectionTitle, { color: '#92400E' }]}>Conseils de prononciation</Text>
          </View>
          {phoneticTips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <FontAwesome name="arrow-right" size={10} color="#6366F1" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wordBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  wordBadgeMissing: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  wordBadgeTextMissing: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  wordBadgeExtra: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  wordBadgeTextExtra: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 6,
    paddingLeft: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
});