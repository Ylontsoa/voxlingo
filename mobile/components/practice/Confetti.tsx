import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#818CF8', '#FBBF24'];
const PIECE_COUNT = 24;

export default function Confetti({ trigger }: { trigger: boolean }) {
  const pieces = useRef(
    Array.from({ length: PIECE_COUNT }).map(() => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-20),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    if (!trigger) return;

    pieces.forEach((piece, i) => {
      piece.y.setValue(-20 - Math.random() * 100);
      piece.x.setValue(Math.random() * width);
      piece.opacity.setValue(1);
      piece.rotate.setValue(0);

      Animated.parallel([
        Animated.timing(piece.y, {
          toValue: 700 + Math.random() * 200,
          duration: 1800 + Math.random() * 800,
          delay: i * 15,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotate, {
          toValue: 4 + Math.random() * 4,
          duration: 2000,
          delay: i * 15,
          useNativeDriver: true,
        }),
        Animated.timing(piece.opacity, {
          toValue: 0,
          duration: 600,
          delay: i * 15 + 1400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [trigger]);

  if (!trigger) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, i) => {
        const rotateInterpolate = piece.rotate.interpolate({
          inputRange: [0, 8],
          outputRange: ['0deg', '2880deg'],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                backgroundColor: COLORS[i % COLORS.length],
                transform: [
                  { translateX: piece.x },
                  { translateY: piece.y },
                  { rotate: rotateInterpolate },
                ],
                opacity: piece.opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', width: 8, height: 14, borderRadius: 2, top: 0, left: 0 },
});