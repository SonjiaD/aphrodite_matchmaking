import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { profiles } from '../data/profiles';

const SWIPE_THRESHOLD = 100;
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function DiscoverScreen() {
  const [cardIndex, setCardIndex] = useState(0);
  const [roseBurst, setRoseBurst] = useState(false);

  const swipeX      = useRef(new Animated.Value(0)).current;
  const swipeY      = useRef(new Animated.Value(0)).current;
  const entranceY   = useRef(new Animated.Value(32)).current;
  const entranceOp  = useRef(new Animated.Value(0)).current;
  const actionsAnim = useRef(new Animated.Value(0)).current;

  // Rose burst anims
  const roseFade      = useRef(new Animated.Value(0)).current;
  const roseScale     = useRef(new Animated.Value(0)).current;
  const rosePulse     = useRef(new Animated.Value(0)).current;
  const roseParticles = useRef(PARTICLE_ANGLES.map(() => new Animated.Value(0))).current;

  const profile = profiles[cardIndex % profiles.length];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceOp,   { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(entranceY,    { toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(actionsAnim,  { toValue: 1, duration: 480, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const rotate = swipeX.interpolate({
    inputRange: [-260, 0, 260],
    outputRange: ['-20deg', '0deg', '20deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = swipeX.interpolate({ inputRange: [20, 100], outputRange: [0, 1], extrapolate: 'clamp' });
  const passOpacity = swipeX.interpolate({ inputRange: [-100, -20], outputRange: [1, 0], extrapolate: 'clamp' });

  function resetCard() {
    swipeX.setValue(0);
    swipeY.setValue(0);
    setCardIndex((i) => i + 1);
  }

  function swipeOffRight() {
    Animated.sequence([
      Animated.timing(swipeX, { toValue: 60,  duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(swipeX, { toValue: 520, duration: 440, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start(resetCard);
  }

  function swipeOffLeft() {
    Animated.sequence([
      Animated.timing(swipeX, { toValue: -60,  duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(swipeX, { toValue: -520, duration: 440, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start(resetCard);
  }

  function handlePass() { swipeOffLeft(); }
  function handleLike() { swipeOffRight(); }

  function handleRose() {
    // Reset all burst anims
    roseFade.setValue(1);
    roseScale.setValue(0);
    rosePulse.setValue(0);
    roseParticles.forEach((p) => p.setValue(0));
    setRoseBurst(true);

    Animated.parallel([
      Animated.spring(roseScale, { toValue: 1, bounciness: 22, speed: 10, useNativeDriver: true }),
      Animated.timing(rosePulse, { toValue: 1, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ...roseParticles.map((p, i) =>
        Animated.sequence([
          Animated.delay(i * 45),
          Animated.timing(p, { toValue: 1, duration: 750, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ])
      ),
    ]).start();

    // After burst peaks, fade it out then swipe card right
    setTimeout(() => {
      Animated.timing(roseFade, { toValue: 0, duration: 380, useNativeDriver: true }).start(() => {
        setRoseBurst(false);
        swipeOffRight();
      });
    }, 1250);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 6 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderMove: (_, gs) => {
        swipeX.setValue(gs.dx);
        swipeY.setValue(gs.dy * 0.25);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD)       handleLike();
        else if (gs.dx < -SWIPE_THRESHOLD) handlePass();
        else {
          Animated.parallel([
            Animated.spring(swipeX, { toValue: 0, useNativeDriver: true, bounciness: 10 }),
            Animated.spring(swipeY, { toValue: 0, useNativeDriver: true, bounciness: 10 }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Aphrodite</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.cardContainer, {
          opacity: entranceOp,
          transform: [
            { translateY: Animated.add(entranceY, swipeY) as any },
            { translateX: swipeX },
            { rotate },
          ],
        }]}
        {...panResponder.panHandlers}
      >
        <ProfileCard user={profile} />

        {/* LIKE stamp — shown while dragging right */}
        <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
          <Text style={styles.likeStampText}>LIKE</Text>
        </Animated.View>

        {/* PASS stamp — shown while dragging left */}
        <Animated.View style={[styles.stamp, styles.passStamp, { opacity: passOpacity }]}>
          <Text style={styles.passStampText}>PASS</Text>
        </Animated.View>

        {/* Rose burst overlay */}
        {roseBurst && (
          <Animated.View style={[StyleSheet.absoluteFillObject, styles.burstOverlay, { opacity: roseFade }]}>
            {/* Expanding pulse ring */}
            <Animated.View style={[styles.pulseRing, {
              transform: [{ scale: rosePulse.interpolate({ inputRange: [0, 1], outputRange: [0.1, 3.2] }) }],
              opacity:   rosePulse.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0.8, 0.4, 0] }),
            }]} />

            {/* Second delayed ring */}
            <Animated.View style={[styles.pulseRing, styles.pulseRing2, {
              transform: [{ scale: rosePulse.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.1, 0.1, 2.5] }) }],
              opacity:   rosePulse.interpolate({ inputRange: [0, 0.2, 0.6, 1], outputRange: [0, 0.6, 0.3, 0] }),
            }]} />

            {/* Particles */}
            {roseParticles.map((p, i) => {
              const angle = (PARTICLE_ANGLES[i] * Math.PI) / 180;
              const dist  = 85 + (i % 3) * 28;
              return (
                <Animated.View key={i} style={[styles.particle, {
                  transform: [
                    { translateX: p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * dist] }) },
                    { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * dist] }) },
                    { scale:     p.interpolate({ inputRange: [0, 0.3, 0.7, 1], outputRange: [0, 1.5, 1.1, 0.3] }) },
                    { rotate:    p.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${PARTICLE_ANGLES[i]}deg`] }) },
                  ],
                  opacity: p.interpolate({ inputRange: [0, 0.15, 0.65, 1], outputRange: [0, 1, 0.9, 0] }),
                }]}>
                  <Ionicons
                    name={i % 2 === 0 ? 'heart' : 'star'}
                    size={i % 3 === 0 ? 22 : 13}
                    color={i % 2 === 0 ? colors.rose : '#F59E0B'}
                  />
                </Animated.View>
              );
            })}

            {/* Center rose */}
            <Animated.View style={{
              transform: [{ scale: roseScale.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0, 1.55, 1.1] }) }],
            }}>
              <Ionicons name="rose" size={88} color={colors.rose} />
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>

      <Animated.View style={[styles.actions, { opacity: actionsAnim }]}>
        <TouchableOpacity style={styles.actionBtn} onPress={handlePass} activeOpacity={0.8}>
          <Ionicons name="close" size={26} color={colors.muted} />
          <Text style={styles.actionLabel}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.roseBtn]} onPress={handleRose} activeOpacity={0.8}>
          <Ionicons name="rose" size={22} color={colors.violetBright} />
          <Text style={[styles.actionLabel, { color: colors.violetBright }]}>Rose</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.likeBtn]} onPress={handleLike} activeOpacity={0.8}>
          <Ionicons name="heart" size={26} color="#fff" />
          <Text style={[styles.actionLabel, { color: '#fff' }]}>Like</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    margin: 10,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  stamp: {
    position: 'absolute',
    top: 52,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 3,
  },
  likeStamp: {
    left: 18,
    borderColor: '#22C55E',
    backgroundColor: 'rgba(34,197,94,0.12)',
    transform: [{ rotate: '-18deg' }],
  },
  likeStampText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#22C55E',
    letterSpacing: 3,
    fontFamily: font ?? undefined,
  },
  passStamp: {
    right: 18,
    borderColor: colors.rose,
    backgroundColor: 'rgba(255,45,85,0.12)',
    transform: [{ rotate: '18deg' }],
  },
  passStampText: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.rose,
    letterSpacing: 3,
    fontFamily: font ?? undefined,
  },
  burstOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2.5,
    borderColor: colors.rose,
  },
  pulseRing2: {
    borderColor: '#F59E0B',
    borderWidth: 1.5,
  },
  particle: {
    position: 'absolute',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
    ...shadow.card,
  },
  roseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.violetSoft,
    borderColor: colors.violet + '30',
  },
  likeBtn: {
    backgroundColor: colors.rose,
    borderColor: colors.rose,
    ...shadow.button,
  },
  actionLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
});
