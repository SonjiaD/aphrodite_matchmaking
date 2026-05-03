import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';

interface Props {
  score: number;
  reasons: string[];
}

export default function CompatibilityScore({ score, reasons }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const barAnim  = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    countAnim.setValue(0);
    barAnim.setValue(0);
    setDisplayScore(0);

    const listenerId = countAnim.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });

    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(countAnim, {
          toValue: score,
          duration: 1100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(barAnim, {
          toValue: score / 100,
          duration: 1100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    return () => countAnim.removeListener(listenerId);
  }, [score]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.aiBadge}>
          <Text style={styles.aiStar}>✦</Text>
          <Text style={styles.aiLabel}>AI Match Score</Text>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreNum}>{displayScore}</Text>
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
    marginBottom: spacing.sm,
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
    fontSize: 26,
    fontWeight: '900',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
    letterSpacing: -0.5,
  },
  scorePct: {
    fontSize: 12,
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
