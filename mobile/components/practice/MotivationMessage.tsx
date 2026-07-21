import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface MotivationMessageProps {
  score: number;
  message: string;
}

export default function MotivationMessage({ score, message }: MotivationMessageProps) {
  const isExcellent = score >= 90;
  const isGood = score >= 70 && score < 90;

  const bgColor = isExcellent ? '#F0FDF4' : isGood ? '#EFF6FF' : score >= 50 ? '#FFFBEB' : '#FEF2F2';
  const textColor = isExcellent ? '#166534' : isGood ? '#1E40AF' : score >= 50 ? '#92400E' : '#991B1B';
  const icon = isExcellent ? 'trophy' : isGood ? 'thumbs-up' : score >= 50 ? 'smile-o' : 'heart';
  const iconColor = isExcellent ? '#22C55E' : isGood ? '#6366F1' : score >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <FontAwesome name={icon} size={20} color={iconColor} />
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});