import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { incomingSparks } from '../data/sparks';
import { IncomingSpark } from '../types';

const VIBE_CONFIG = {
  casual:   { label: 'Casual vibe',        icon: '😊' as const },
  strong:   { label: 'Strong connection',  icon: '💛' as const },
  soulmates:{ label: 'Soulmates',          icon: '🔥' as const },
};

export default function SparksScreen() {
  const [accepted, setAccepted] = useState<Set<string>>(new Set());

  function renderSpark({ item }: { item: IncomingSpark }) {
    const isAccepted = accepted.has(item.id);
    const vibe = VIBE_CONFIG[item.vibe];

    return (
      <View style={styles.card}>
        {isAccepted && (
          <View style={styles.matchedBanner}>
            <Ionicons name="heart" size={14} color={colors.surface} />
            <Text style={styles.matchedText}>It's a match — say hello</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Image source={{ uri: item.suggestedUser.photos[0] }} style={styles.photo} />
          <View style={styles.info}>
            <Text style={styles.name}>
              {item.suggestedUser.name}, {item.suggestedUser.age}
            </Text>
            <Text style={styles.cupidLine}>
              <Ionicons name="heart-circle" size={11} color={colors.muted} /> Sparked by {item.cupidName}
            </Text>
            <View style={styles.vibePill}>
              <Text style={styles.vibeText}>{vibe.icon} {vibe.label}</Text>
            </View>
          </View>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Why they think you'd click</Text>
          <Text style={styles.noteText}>"{item.note}"</Text>
        </View>

        {!isAccepted && (
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.passBtn} activeOpacity={0.8}>
              <Text style={styles.passBtnText}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              activeOpacity={0.8}
              onPress={() => setAccepted((s) => new Set([...s, item.id]))}
            >
              <Ionicons name="checkmark" size={16} color={colors.surface} />
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Sparks</Text>
        <Text style={styles.headerSub}>People the community thinks you'd vibe with</Text>
      </View>
      <FlatList
        data={incomingSparks}
        keyExtractor={(item) => item.id}
        renderItem={renderSpark}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    backgroundColor: colors.plum,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.surface,
    fontFamily: font ?? undefined,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: font ?? undefined,
    marginTop: 2,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  matchedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.coral,
    paddingVertical: 10,
  },
  matchedText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.surface,
    fontFamily: font ?? undefined,
  },
  cardBody: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  photo: {
    width: 72,
    height: 90,
    borderRadius: radius.sm,
  },
  info: {
    flex: 1,
    gap: 5,
    paddingTop: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  cupidLine: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  vibePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 2,
  },
  vibeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.plumMid,
    fontFamily: font ?? undefined,
  },
  noteBox: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.plumLight,
    gap: 4,
  },
  noteLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.plumMid,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontFamily: font ?? undefined,
  },
  noteText: {
    fontSize: 13,
    color: colors.dark,
    lineHeight: 20,
    fontFamily: font ?? undefined,
    fontStyle: 'italic',
  },
  btnRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  passBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: 11,
    alignItems: 'center',
  },
  passBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.coral,
    borderRadius: radius.full,
    paddingVertical: 11,
    ...shadow.card,
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.surface,
    fontFamily: font ?? undefined,
  },
});
