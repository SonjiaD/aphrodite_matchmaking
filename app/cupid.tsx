import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AmbientBackground from '../components/AmbientBackground';
import CompatibilityScore from '../components/CompatibilityScore';
import ProfileCard from '../components/ProfileCard';
import SparkNoteModal from '../components/SparkNoteModal';
import SparkSuccessOverlay from '../components/SparkSuccessOverlay';
import { CupidCredit, useAuth } from '../context/auth';
import { useOverlay } from '../context/overlay';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { getProfilePairs } from '../data/profiles';
import { User } from '../types';

const pairs = getProfilePairs();

function getSharedInterests(a: User, b: User): string[] {
  return a.interests.filter((i) => b.interests.includes(i));
}

function computeAiScore(shared: string[], pairIndex: number): number {
  const base   = 50 + shared.length * 8;
  const jitter = (pairIndex * 7 + shared.length * 3 + 11) % 15;
  return Math.min(base + jitter, 98);
}

// Full-screen celebration shown when a cupid earns a match credit
function CelebrationOverlay({ credit, onDone }: { credit: CupidCredit; onDone: () => void }) {
  const scaleAnim   = useRef(new Animated.Value(0)).current;
  const fadeAnim    = useRef(new Animated.Value(0)).current;
  const ptsAnim     = useRef(new Animated.Value(0)).current;
  const ANGLES      = [0, 60, 120, 180, 240, 300];
  const particles   = useRef(ANGLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(180),
        Animated.spring(scaleAnim, { toValue: 1, bounciness: 14, speed: 9, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel(
          particles.map((p, i) =>
            Animated.sequence([
              Animated.delay(i * 50),
              Animated.timing(p, { toValue: 1, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ])
          )
        ),
      ]),
      Animated.sequence([
        Animated.delay(500),
        Animated.spring(ptsAnim, { toValue: 1, bounciness: 18, speed: 12, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[celStyles.overlay, { opacity: fadeAnim }]}>
      {/* Particles */}
      {particles.map((p, i) => {
        const angle = (ANGLES[i] * Math.PI) / 180;
        const dist  = 110 + (i % 2) * 36;
        return (
          <Animated.View key={i} style={[celStyles.particle, {
            transform: [
              { translateX: p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * dist] }) },
              { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * dist] }) },
              { scale: p.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1.5, 0.4] }) },
            ],
            opacity: p.interpolate({ inputRange: [0, 0.1, 0.6, 1], outputRange: [0, 1, 0.9, 0] }),
          }]}>
            <Ionicons
              name={i % 2 === 0 ? 'heart' : 'star'}
              size={i % 3 === 0 ? 20 : 13}
              color={i % 2 === 0 ? colors.rose : '#F59E0B'}
            />
          </Animated.View>
        );
      })}

      <Animated.View style={[celStyles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons name="heart-circle" size={64} color={colors.rose} />
        <Text style={celStyles.title}>Match credit earned!</Text>
        <Text style={celStyles.sub}>
          {credit.matchName} said it was a great connection.
        </Text>

        <Animated.View style={[celStyles.ptsBadge, { transform: [{ scale: ptsAnim }] }]}>
          <Ionicons name="flash" size={18} color={colors.violetBright} />
          <Text style={celStyles.ptsText}>+{credit.pts} pts added to your balance</Text>
        </Animated.View>

        <TouchableOpacity style={celStyles.claimBtn} onPress={onDone} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={celStyles.claimBtnText}>Claim Reward</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

function AboutSection({ user }: { user: User }) {
  return (
    <View style={styles.aboutCard}>
      <Text style={styles.aboutName}>{user.name}</Text>

      {user.prompts.slice(0, 2).map((p, i) => (
        <View key={i} style={styles.promptBlock}>
          <Text style={styles.promptQ}>{p.question}</Text>
          <Text style={styles.promptA}>"{p.answer}"</Text>
        </View>
      ))}

      <View style={styles.interestWrap}>
        {user.interests.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.lfRow}>
        <Text style={styles.lf}>Looking for </Text>
        <Text style={styles.lfVal}>{user.lookingFor}</Text>
      </View>
    </View>
  );
}

export default function CupidScreen() {
  const [pairIndex, setPairIndex] = useState(0);
  const [points, setPoints]       = useState(120);
  const [ptsPopLabel, setPtsPopLabel] = useState('');
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const leftAnim  = useRef(new Animated.Value(0)).current;
  const rightAnim = useRef(new Animated.Value(0)).current;
  const ptsPopAnim = useRef(new Animated.Value(0)).current;
  const overlay   = useOverlay();

  const { cupidCredits, clearCupidCredits } = useAuth();
  const prevCreditsLen = useRef(0);

  const currentPair = pairs[pairIndex % pairs.length];
  const [user1, user2] = currentPair;
  const shared  = useMemo(() => getSharedInterests(user1, user2), [user1, user2]);
  const aiScore = useMemo(() => computeAiScore(shared, pairIndex), [shared, pairIndex]);

  // Show celebration when credits are earned
  useEffect(() => {
    if (cupidCredits.length > prevCreditsLen.current && cupidCredits.length > 0) {
      prevCreditsLen.current = cupidCredits.length;
      const credit = cupidCredits[0];
      const t = setTimeout(() => {
        overlay.present(
          <CelebrationOverlay
            credit={credit}
            onDone={() => { overlay.dismiss(); clearCupidCredits(); }}
          />
        );
      }, 700);
      return () => clearTimeout(t);
    }
    prevCreditsLen.current = cupidCredits.length;
  }, [cupidCredits.length]);

  function popPts(label: string) {
    setPtsPopLabel(label);
    ptsPopAnim.setValue(0);
    Animated.sequence([
      Animated.spring(ptsPopAnim, { toValue: 1, bounciness: 10, speed: 16, useNativeDriver: true }),
      Animated.delay(700),
      Animated.timing(ptsPopAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start(() => setPtsPopLabel(''));
  }

  function handlePass() {
    setPoints(p => p + 1);
    popPts('+1');
    advancePair();
  }

  function handleSkip() {
    setPoints(p => p + 1);
    popPts('+1');
    advancePair();
  }

  function advancePair() {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(leftAnim,  { toValue: -30, duration: 160, useNativeDriver: true }),
      Animated.timing(rightAnim, { toValue: 30,  duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setPairIndex((i) => i + 1);
      leftAnim.setValue(30);
      rightAnim.setValue(-30);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.spring(leftAnim,  { toValue: 0, useNativeDriver: true, bounciness: 6 }),
        Animated.spring(rightAnim, { toValue: 0, useNativeDriver: true, bounciness: 6 }),
      ]).start();
    });
  }

  function handleSparkPress() {
    overlay.present(
      <SparkNoteModal
        user1={user1}
        user2={user2}
        sharedInterests={shared}
        onClose={overlay.dismiss}
        onSubmit={(_note, _vibe) => {
          overlay.present(
            <SparkSuccessOverlay
              user1={user1}
              user2={user2}
              onDone={() => {
                overlay.dismiss();
                setPoints((p) => p + 3);
                popPts('+3');
                advancePair();
              }}
            />
          );
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AmbientBackground />
      {/* Fixed header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cupid Mode</Text>
          <Text style={styles.headerSub}>Do they vibe?</Text>
        </View>
        <View style={styles.badgeWrap}>
          {ptsPopLabel !== '' && (
            <Animated.Text style={[styles.ptsPop, {
              opacity: ptsPopAnim.interpolate({ inputRange: [0, 0.25, 0.8, 1], outputRange: [0, 1, 1, 0] }),
              transform: [{ translateY: ptsPopAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -28] }) }],
            }]}>
              {ptsPopLabel} pts
            </Animated.Text>
          )}
          <View style={styles.pointsBadge}>
            <Ionicons name="flash" size={13} color={colors.violet} />
            <Text style={styles.pointsText}>{points} pts</Text>
          </View>
        </View>
      </View>

      {/* Scrollable body */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo pair */}
        <Animated.View style={[styles.pairRow, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.cardWrapper, { transform: [{ translateX: leftAnim }] }]}>
            <ProfileCard user={user1} compact sharedInterests={shared} />
          </Animated.View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <View style={styles.flashCircle}>
              <Ionicons name="flash" size={11} color={colors.rose} />
            </View>
            <View style={styles.dividerLine} />
          </View>

          <Animated.View style={[styles.cardWrapper, { transform: [{ translateX: rightAnim }] }]}>
            <ProfileCard user={user2} compact sharedInterests={shared} />
          </Animated.View>
        </Animated.View>

        {/* AI Compatibility Score */}
        <CompatibilityScore
          score={aiScore}
          reasons={shared.length > 0 ? ['shared interests', 'lifestyle'] : ['lifestyle', 'goals']}
        />

        {/* Shared interests strip */}
        {shared.length > 0 && (
          <View style={styles.sharedRow}>
            <Ionicons name="link" size={12} color={colors.rose} />
            <Text style={styles.sharedLabel}>Both into: </Text>
            <Text style={styles.sharedInterests}>{shared.join(', ')}</Text>
          </View>
        )}

        {/* Profile detail cards */}
        <View style={styles.aboutRow}>
          <AboutSection user={user1} />
          <AboutSection user={user2} />
        </View>
      </ScrollView>

      {/* Fixed action bar */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.passBtn} onPress={handlePass} activeOpacity={0.75}>
          <Ionicons name="close" size={18} color={colors.muted} />
          <Text style={styles.passBtnText}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.75}>
          <Ionicons name="arrow-forward" size={16} color={colors.mutedLight} />
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sparkBtn} onPress={handleSparkPress} activeOpacity={0.85}>
          <Ionicons name="flash" size={18} color="#fff" />
          <Text style={styles.sparkBtnText}>Spark</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const celStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,5,18,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: { position: 'absolute' },
  card: {
    backgroundColor: '#12102E',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderMid,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    width: 300,
    ...shadow.strong,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: colors.muted,
    fontFamily: font ?? undefined,
    textAlign: 'center',
    lineHeight: 20,
  },
  ptsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.violetSoft,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.violet + '30',
  },
  ptsText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: colors.rose,
    borderRadius: radius.full,
    paddingVertical: 13,
    paddingHorizontal: 32,
    marginTop: spacing.sm,
    ...shadow.button,
  },
  claimBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surfaceEl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: font ?? undefined,
    fontWeight: '500',
    marginTop: 1,
  },
  badgeWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  ptsPop: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.rose,
    fontFamily: font ?? undefined,
    position: 'absolute',
    right: 8,
    bottom: 28,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.violetSoft,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.violet + '30',
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  pairRow: {
    flexDirection: 'row',
    height: 340,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 0,
  },
  cardWrapper: {
    flex: 1,
    zIndex: 0,
  },
  divider: {
    width: 36,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    zIndex: 2,
  },
  dividerLine: {
    flex: 1,
    width: 1,
    backgroundColor: colors.border,
  },
  flashCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceEl,
    borderWidth: 1,
    borderColor: colors.rose + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  sharedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 5,
    backgroundColor: colors.surfaceEl,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  sharedLabel: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: font ?? undefined,
    fontWeight: '500',
  },
  sharedInterests: {
    fontSize: 12,
    color: colors.rose,
    fontWeight: '700',
    fontFamily: font ?? undefined,
  },
  aboutRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  aboutCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMid,
    padding: spacing.sm,
    gap: 8,
  },
  aboutName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.3,
  },
  promptBlock: {
    gap: 3,
  },
  promptQ: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.violetBright,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: font ?? undefined,
  },
  promptA: {
    fontSize: 11,
    color: colors.text,
    fontFamily: font ?? undefined,
    lineHeight: 15,
    fontStyle: 'italic',
  },
  interestWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.text,
    fontFamily: font ?? undefined,
  },
  lfRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 2,
  },
  lf: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  lfVal: {
    fontSize: 10,
    color: colors.violetBright,
    fontWeight: '700',
    fontFamily: font ?? undefined,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderMid,
    backgroundColor: colors.glassMid,
  },
  passBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: 13,
    backgroundColor: colors.glass,
  },
  passBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  skipBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: 13,
    backgroundColor: colors.glass,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedLight,
    fontFamily: font ?? undefined,
  },
  sparkBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.rose,
    borderRadius: radius.full,
    paddingVertical: 13,
    ...shadow.glowRose,
  },
  sparkBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
});
