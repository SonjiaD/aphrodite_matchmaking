import { useEffect, useRef } from 'react';
import { Animated, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import { User } from '../types';

interface Props {
  visible: boolean;
  user1: User;
  user2: User;
  onDone: () => void;
}

const CONFETTI_COLORS = [colors.coral, colors.gold, '#C084FC', '#60D6A7', '#FFF6EE', '#FF8F82'];
const NUM_PARTICLES = 16;

export default function SparkSuccessOverlay({ visible, user1, user2, onDone }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const arrowScale = useRef(new Animated.Value(0)).current;
  const arrowX = useRef(new Animated.Value(-60)).current;
  const pointsBadge = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    Array.from({ length: NUM_PARTICLES }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      arrowScale.setValue(0);
      arrowX.setValue(-60);
      pointsBadge.setValue(0);
      particles.forEach((p) => {
        p.x.setValue(0);
        p.y.setValue(0);
        p.opacity.setValue(1);
        p.scale.setValue(0);
      });
      return;
    }

    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
      // Arrow shoots across
      Animated.parallel([
        Animated.spring(arrowScale, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
        Animated.timing(arrowX, { toValue: 60, duration: 600, useNativeDriver: true }),
      ]).start(() => {
        // Confetti burst
        const confettiAnims = particles.map((p, i) => {
          const angle = (i / NUM_PARTICLES) * Math.PI * 2;
          const dist = 80 + Math.random() * 60;
          return Animated.parallel([
            Animated.spring(p.scale, { toValue: 1, useNativeDriver: true }),
            Animated.timing(p.x, { toValue: Math.cos(angle) * dist, duration: 700, useNativeDriver: true }),
            Animated.timing(p.y, { toValue: Math.sin(angle) * dist, duration: 700, useNativeDriver: true }),
            Animated.sequence([
              Animated.delay(400),
              Animated.timing(p.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
          ]);
        });
        Animated.parallel(confettiAnims).start();

        // Points badge pops in
        Animated.spring(pointsBadge, { toValue: 1, useNativeDriver: true, bounciness: 14 }).start();
      });
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Confetti particles */}
        <View style={styles.confettiCenter} pointerEvents="none">
          {particles.map((p, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                { backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] },
                {
                  opacity: p.opacity,
                  transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.scale }],
                },
              ]}
            />
          ))}
        </View>

        {/* Avatar + arrow */}
        <View style={styles.avatarRow}>
          <Image source={{ uri: user1.photos[0] }} style={styles.avatar} />
          <Animated.Text
            style={[
              styles.arrow,
              { transform: [{ translateX: arrowX }, { scale: arrowScale }] },
            ]}
          >
            💘
          </Animated.Text>
          <Image source={{ uri: user2.photos[0] }} style={styles.avatar} />
        </View>

        {/* Text */}
        <Text style={styles.title}>Spark Sent! 🔥</Text>
        <Text style={styles.subtitle}>
          {user1.name} & {user2.name} will each get a notification
        </Text>

        {/* Points badge */}
        <Animated.View
          style={[styles.pointsBadge, { transform: [{ scale: pointsBadge }] }]}
        >
          <Text style={styles.pointsText}>+5 pts ⚡</Text>
        </Animated.View>

        <TouchableOpacity style={styles.btn} onPress={onDone} activeOpacity={0.8}>
          <Text style={styles.btnLabel}>Keep sparking →</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  confettiCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: '45%',
    left: '50%',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.coral,
  },
  arrow: {
    fontSize: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.cardWhite,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 24,
  },
  pointsBadge: {
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
  },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.coral,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.cardWhite,
  },
});
