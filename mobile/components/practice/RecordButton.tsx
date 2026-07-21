import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface RecordButtonProps {
  onPress: () => void;
  isRecording: boolean;
  volumeLevel?: number; // 0 à 1
}

export default function RecordButton({ onPress, isRecording, volumeLevel = 0 }: RecordButtonProps) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Anneaux qui pulsent en continu pendant l'enregistrement (effet "écoute active")
  useEffect(() => {
    if (isRecording) {
      const loop1 = Animated.loop(
        Animated.sequence([
          Animated.timing(ring1, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(ring1, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
      const loop2 = Animated.loop(
        Animated.sequence([
          Animated.timing(ring2, { toValue: 1, duration: 1200, delay: 600, useNativeDriver: true }),
          Animated.timing(ring2, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
      loop1.start();
      loop2.start();
      return () => {
        loop1.stop();
        loop2.stop();
        ring1.setValue(0);
        ring2.setValue(0);
      };
    }
  }, [isRecording]);

  // Le bouton grossit/rétrécit en fonction du volume réel de la voix (comme Google)
  useEffect(() => {
    Animated.spring(pulseAnim, {
      toValue: isRecording ? 1 + volumeLevel * 0.35 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [volumeLevel, isRecording]);

  const ringScale1 = ring1.interpolate({ inputRange: [0, 1], outputRange: [1, 2.1] });
  const ringOpacity1 = ring1.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.35, 0.1, 0] });

  const ringScale2 = ring2.interpolate({ inputRange: [0, 1], outputRange: [1, 2.1] });
  const ringOpacity2 = ring2.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.35, 0.1, 0] });

  return (
    <View style={styles.wrapper}>
      {isRecording && (
        <>
          <Animated.View
            style={[
              styles.ring,
              { transform: [{ scale: ringScale1 }], opacity: ringOpacity1 },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              { transform: [{ scale: ringScale2 }], opacity: ringOpacity2 },
            ]}
          />
        </>
      )}

      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <Animated.View
          style={[
            styles.button,
            isRecording && styles.buttonRecording,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <FontAwesome name="microphone" color="#ffffff" size={30} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  ring: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#6366F1',
  },
  button: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonRecording: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
});