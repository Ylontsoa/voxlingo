import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface IconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 20, color = '#1f2937' }: IconProps) {
  return <FontAwesome name={name} size={size} color={color} />;
}