import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function CupidScreen() {
  const [pairIndex, setPairIndex] = useState(0);
  const [points, setPoints] = useState(120);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const overlay  = useOverlay();

  const currentPair = pairs[pairIndex % pairs.length];
  const [user1, user2] = currentPair;
  const shared  = useMemo(() => getSharedInterests(user1, user2), [user1, user2]);
  const aiScore = useMemo(() => computeAiScore(shared, pairIndex), [shared, pairIndex]);

  function advancePair() {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 240, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setPairIndex((i) => i + 1), 160);
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
      {/* Header */}
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

      {/* Profile pair */}
      <Animated.View style={[styles.pairRow, { opacity: fadeAnim }]}>
        <View style={styles.cardWrapper}>
          <ProfileCard user={user1} compact sharedInterests={shared} />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.flashCircle}>
            <Ionicons name="flash" size={11} color={colors.rose} />
          </View>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.cardWrapper}>
          <ProfileCard user={user2} compact sharedInterests={shared} />
        </View>
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

      {/* Action buttons */}
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
  pairRow: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  cardWrapper: {
    flex: 1,
    zIndex: 0,
  },
  divider: {
    width: 24,
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
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
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
