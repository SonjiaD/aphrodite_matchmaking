import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { User } from '../types';

interface Props {
  user1: User;
  user2: User;
  onDone: () => void;
}

const CONFETTI_COLORS = [colors.rose, colors.violet, colors.violetBright, colors.success, '#FF6B6B', '#A78BFA'];
const NUM_PARTICLES = 18;

export default function SparkSuccessOverlay({ user1, user2, onDone }: Props) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const arrowX    = useRef(new Animated.Value(-50)).current;
  const arrowOp   = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;
  const particles = useRef(
    Array.from({ length: NUM_PARTICLES }, () => ({
      x:  new Animated.Value(0),
      y:  new Animated.Value(0),
      op: new Animated.Value(1),
      sc: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, bounciness: 6, speed: 12, useNativeDriver: true }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(arrowOp, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(arrowX,  { toValue: 0, duration: 450, useNativeDriver: true }),
      ]).start(() => {
        const burst = particles.map((p, i) => {
          const angle = (i / NUM_PARTICLES) * Math.PI * 2;
          const dist  = 70 + Math.random() * 55;
          return Animated.parallel([
            Animated.spring(p.sc, { toValue: 1, useNativeDriver: true }),
            Animated.timing(p.x,  { toValue: Math.cos(angle) * dist, duration: 600, useNativeDriver: true }),
            Animated.timing(p.y,  { toValue: Math.sin(angle) * dist, duration: 600, useNativeDriver: true }),
            Animated.sequence([
              Animated.delay(350),
              Animated.timing(p.op, { toValue: 0, duration: 350, useNativeDriver: true }),
            ]),
          ]);
        });
        Animated.parallel(burst).start();
        Animated.spring(badgeAnim, { toValue: 1, bounciness: 14, useNativeDriver: true }).start();
      });
    });
  }, []);

  function close() {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 180, useNativeDriver: true }),
    ]).start(onDone);
  }

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />

      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Confetti */}
        <View style={styles.confettiAnchor} pointerEvents="none">
          {particles.map((p, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                { backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] },
                { opacity: p.op, transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.sc }] },
              ]}
            />
          ))}
        </View>

        {/* Flash icon header */}
        <View style={styles.flashBadge}>
          <Ionicons name="flash" size={20} color={colors.rose} />
        </View>

        <Text style={styles.title}>Spark Sent!</Text>
        <Text style={styles.subtitle}>
          {user1.name} & {user2.name} will each get a notification
        </Text>

        {/* Avatars */}
        <View style={styles.avatarRow}>
          <Image source={{ uri: user1.photos[0] }} style={styles.avatar} />
          <Animated.View style={[styles.arrowWrap, { opacity: arrowOp, transform: [{ translateX: arrowX }] }]}>
            <Ionicons name="heart" size={26} color={colors.rose} />
          </Animated.View>
          <Image source={{ uri: user2.photos[0] }} style={styles.avatar} />
        </View>

        {/* Points badge */}
        <Animated.View style={[styles.pointsBadge, { transform: [{ scale: badgeAnim }] }]}>
          <Ionicons name="flash" size={13} color={colors.violetBright} />
          <Text style={styles.pointsText}>+5 pts earned</Text>
        </Animated.View>

        <TouchableOpacity style={styles.btn} onPress={close} activeOpacity={0.85}>
          <Text style={styles.btnLabel}>Keep sparking</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  card: {
    backgroundColor: '#12102E',
    borderRadius: radius.xl,
    padding: spacing.xl,
    paddingTop: spacing.lg,
    marginHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadow.modal,
    borderWidth: 1,
    borderColor: colors.borderMid,
    width: '85%',
  },
  confettiAnchor: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 0,
    height: 0,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  flashBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.roseSoft,
    borderWidth: 1,
    borderColor: colors.rose + '35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: font ?? undefined,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.rose + '60',
  },
  arrowWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.roseSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.violetSoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.violet + '30',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: spacing.xs,
    backgroundColor: colors.rose,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    alignSelf: 'stretch',
    ...shadow.glowRose,
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
});
