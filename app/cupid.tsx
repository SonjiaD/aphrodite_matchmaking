import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import SparkNoteModal from '../components/SparkNoteModal';
import SparkSuccessOverlay from '../components/SparkSuccessOverlay';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { getProfilePairs } from '../data/profiles';
import { User } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 3 - 20) / 2;

const pairs = getProfilePairs();

function getSharedInterests(a: User, b: User): string[] {
  return a.interests.filter((i) => b.interests.includes(i));
}

export default function CupidScreen() {
  const [pairIndex, setPairIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [points, setPoints] = useState(120);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentPair = pairs[pairIndex % pairs.length];
  const [user1, user2] = currentPair;
  const shared = getSharedInterests(user1, user2);

  function advancePair() {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 240, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setPairIndex((i) => i + 1), 160);
  }

  function handleSpark() {
    setShowModal(false);
    setShowSuccess(true);
  }

  function handleSuccessDone() {
    setShowSuccess(false);
    setPoints((p) => p + 5);
    advancePair();
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
          <Ionicons name="flash" size={13} color={colors.dark} />
          <Text style={styles.pointsText}>{points} pts</Text>
        </View>
      </View>

      {/* Profile pair */}
      <Animated.View style={[styles.pairRow, { opacity: fadeAnim }]}>
        <View style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
          <ProfileCard user={user1} compact sharedInterests={shared} />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLineTop} />
          <View style={styles.fireCircle}>
            <Text style={styles.fireEmoji}>🔥</Text>
          </View>
          <View style={styles.dividerLineBottom} />
        </View>

        <View style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
          <ProfileCard user={user2} compact sharedInterests={shared} />
        </View>
      </Animated.View>

      {/* Shared interests */}
      {shared.length > 0 && (
        <View style={styles.sharedRow}>
          <Ionicons name="link" size={12} color={colors.coral} />
          <Text style={styles.sharedLabel}>Both into: </Text>
          <Text style={styles.sharedInterests}>{shared.map(s => s.split(' ')[1] ?? s).join(', ')}</Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.passBtn} onPress={advancePair} activeOpacity={0.8}>
          <Ionicons name="close" size={18} color={colors.muted} />
          <Text style={styles.passBtnText}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={advancePair} activeOpacity={0.8}>
          <Ionicons name="arrow-forward" size={16} color={colors.plumMid} />
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sparkBtn} onPress={() => setShowModal(true)} activeOpacity={0.8}>
          <Ionicons name="flash" size={18} color={colors.surface} />
          <Text style={styles.sparkBtnText}>Spark</Text>
        </TouchableOpacity>
      </View>

      <SparkNoteModal
        visible={showModal}
        user1={user1}
        user2={user2}
        onClose={() => setShowModal(false)}
        onSubmit={handleSpark}
      />

      <SparkSuccessOverlay
        visible={showSuccess}
        user1={user1}
        user2={user2}
        onDone={handleSuccessDone}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: colors.plum,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.surface,
    fontFamily: font ?? undefined,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: font ?? undefined,
    fontWeight: '400',
    marginTop: 1,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.dark,
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
    ...shadow.card,
  },
  divider: {
    width: 20,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dividerLineTop: {
    flex: 1,
    width: 1,
    backgroundColor: colors.borderDark,
  },
  fireCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    ...shadow.card,
  },
  fireEmoji: {
    fontSize: 14,
  },
  dividerLineBottom: {
    flex: 1,
    width: 1,
    backgroundColor: colors.borderDark,
  },
  sharedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    gap: 4,
    backgroundColor: colors.coralSoft,
    borderTopWidth: 1,
    borderColor: colors.coral + '30',
  },
  sharedLabel: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: font ?? undefined,
    fontWeight: '500',
  },
  sharedInterests: {
    fontSize: 12,
    color: colors.coral,
    fontWeight: '600',
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
    backgroundColor: colors.surface,
    ...shadow.card,
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
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.plumMid,
    fontFamily: font ?? undefined,
  },
  sparkBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.coral,
    borderRadius: radius.full,
    paddingVertical: 13,
    ...shadow.strong,
  },
  sparkBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.surface,
    fontFamily: font ?? undefined,
  },
});
