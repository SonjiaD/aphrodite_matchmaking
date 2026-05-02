import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';

interface Props {
  score: number;
  reasons: string[];
}

export default function CompatibilityScore({ score, reasons }: Props) {
  const countAnim = useRef(new Animated.Value(0)).current;
  const barAnim   = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(countAnim, { toValue: score, duration: 900, useNativeDriver: false }),
        Animated.timing(barAnim,   { toValue: score / 100, duration: 900, useNativeDriver: false }),
      ]),
    ]).start();
  }, [score]);

  const displayScore = countAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0', '100'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.aiBadge}>
          <Text style={styles.aiStar}>✦</Text>
          <Text style={styles.aiLabel}>AI Match Score</Text>
        </View>
        <View style={styles.scoreRow}>
          <Animated.Text style={styles.scoreNum}>{displayScore}</Animated.Text>
          <Text style={styles.scorePct}>% compatible</Text>
        </View>
      </View>

      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: barAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {reasons.length > 0 && (
        <Text style={styles.reason} numberOfLines={1}>
          Based on {reasons.join(', ')}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.violetSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.violet + '25',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiStar: { fontSize: 11, color: colors.violetBright },
  aiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.violetBright,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontFamily: font ?? undefined,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  scoreNum: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
  },
  scorePct: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: font ?? undefined,
    fontWeight: '500',
  },
  barTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginTop: 2,
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.violet,
    borderRadius: radius.full,
  },
  reason: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: font ?? undefined,
    marginTop: 1,
  },
});
