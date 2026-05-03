import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useRef, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CompatibilityScore from '../components/CompatibilityScore';
import ProfileCard from '../components/ProfileCard';
import SparkNoteModal from '../components/SparkNoteModal';
import SparkSuccessOverlay from '../components/SparkSuccessOverlay';
import { useOverlay } from '../context/overlay';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { getProfilePairs } from '../data/profiles';
import { User } from '../types';

const pairs = getProfilePairs();

function getSharedInterests(a: User, b: User): string[] {
  return a.interests.filter((i) => b.interests.includes(i));
}

function computeAiScore(shared: string[], pairIndex: number): number {
  const base = 50 + shared.length * 8;
  const jitter = (pairIndex * 7 + shared.length * 3 + 11) % 15;
  return Math.min(base + jitter, 98);
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
  const [points, setPoints] = useState(120);
  const fadeAnim   = useRef(new Animated.Value(1)).current;
  const leftAnim   = useRef(new Animated.Value(0)).current;
  const rightAnim  = useRef(new Animated.Value(0)).current;
  const overlay    = useOverlay();

  const currentPair = pairs[pairIndex % pairs.length];
  const [user1, user2] = currentPair;
  const shared  = useMemo(() => getSharedInterests(user1, user2), [user1, user2]);
  const aiScore = useMemo(() => computeAiScore(shared, pairIndex), [shared, pairIndex]);

  function advancePair() {
    // fade out + slide out
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
                setPoints((p) => p + 5);
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
      {/* Fixed header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cupid Mode</Text>
          <Text style={styles.headerSub}>Do they vibe?</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Ionicons name="flash" size={13} color={colors.violet} />
          <Text style={styles.pointsText}>{points} pts</Text>
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
        <TouchableOpacity style={styles.passBtn} onPress={advancePair} activeOpacity={0.75}>
          <Ionicons name="close" size={18} color={colors.muted} />
          <Text style={styles.passBtnText}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={advancePair} activeOpacity={0.75}>
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

  // About section
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
    borderColor: colors.border,
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

  // Action bar
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
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
    ...shadow.button,
  },
  sparkBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
});
