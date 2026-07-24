import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function AuthButton({ label, onPress, loading, variant = 'primary' }: AuthButtonProps) {
  const bgClass = variant === 'primary' ? 'bg-primary' : 'bg-gray-100';
  const textClass = variant === 'primary' ? 'text-white' : 'text-gray-800';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`rounded-xl py-3 items-center ${bgClass} ${loading ? 'opacity-70' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#1f2937'} />
      ) : (
        <Text className={`font-semibold text-base ${textClass}`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}