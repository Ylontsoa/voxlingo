import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SIMILARITY_THRESHOLD } from '../../constants/config';

export default function ScoreDisplay({ score }: { score: number }) {
  const isSuccess = score >= SIMILARITY_THRESHOLD;

  return (
    <View style={styles.container}>
      <View style={[styles.circle, isSuccess ? styles.circleSuccess : styles.circleError]}>
        <Text style={[styles.scoreText, isSuccess ? styles.textSuccess : styles.textError]}>
          {score}%
        </Text>
      </View>
      <View style={styles.badge}>
        <FontAwesome
          name={isSuccess ? 'check-circle' : 'refresh'}
          size={14}
          color={isSuccess ? '#22C55E' : '#EF4444'}
        />
        <Text style={[styles.badgeText, isSuccess ? styles.textSuccess : styles.textError]}>
          {isSuccess ? 'Bien joué !' : 'À améliorer'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 8 },
  circle: {
    width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 4,
  },
  circleSuccess: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  circleError: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  scoreText: { fontSize: 24, fontWeight: '800' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  badgeText: { fontSize: 14, fontWeight: '700' },
  textSuccess: { color: '#22C55E' },
  textError: { color: '#EF4444' },
});