/**
 * SkeletonLoader — shimmering placeholder shown while data loads,
 * so screens never flash empty or jump around.
 */
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii } from '../theme/tokens';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ width = '100%', height = 16, borderRadius = radii.sm, style }: Props) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.box, { width, height, borderRadius, opacity }, style]}
    />
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.surfaceElevated },
});
