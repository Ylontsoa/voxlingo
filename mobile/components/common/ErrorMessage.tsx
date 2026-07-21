import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <View style={styles.box}>
      <FontAwesome name="exclamation-circle" color="#DC2626" size={16} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    gap: 8,
  },
  text: { color: '#DC2626', flex: 1, fontSize: 13 },
});