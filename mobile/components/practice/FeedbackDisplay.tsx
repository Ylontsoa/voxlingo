import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WordComparison } from '../../utils/comparison';

export default function FeedbackDisplay({ words }: { words: WordComparison[] }) {
  return (
    <View style={styles.container}>
      {words.map((w, index) => (
        <Text
          key={index}
          style={[styles.word, w.correct ? styles.wordCorrect : styles.wordIncorrect]}
        >
          {w.word}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 16, marginVertical: 16, gap: 6 },
  word: { fontSize: 18, fontWeight: '700' },
  wordCorrect: { color: '#22C55E' },
  wordIncorrect: { color: '#EF4444' },
});