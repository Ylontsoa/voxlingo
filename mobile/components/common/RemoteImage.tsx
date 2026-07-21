import React, { useState } from 'react';
import { Image, View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface RemoteImageProps {
  uri: string | null | undefined;
  fallbackUri?: string;
  style?: ViewStyle;
  borderRadius?: number;
}

export default function RemoteImage({ uri, fallbackUri, style, borderRadius = 16 }: RemoteImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const source = error || !uri
    ? { uri: fallbackUri || 'https://ui-avatars.com/api/?name=Vox&background=6366F1&color=fff&size=200' }
    : { uri };

  return (
    <View style={[styles.wrapper, style]}>
      {loading && (
        <View style={[styles.loader, { borderRadius }]}>
          <ActivityIndicator size="small" color="#6366F1" />
        </View>
      )}
      <Image
        source={source}
        style={[styles.image, { borderRadius }]}
        resizeMode="cover"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
});