import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  error?: string;
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  error,
}: AuthInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-1 font-medium text-gray-700">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        className={`border rounded-xl px-4 py-3 text-base ${
          error ? 'border-error' : 'border-gray-300'
        }`}
      />
      {error && <Text className="mt-1 text-sm text-error">{error}</Text>}
    </View>
  );
}