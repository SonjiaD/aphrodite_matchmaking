import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { incomingSparks } from '../data/sparks';
import { IncomingSpark } from '../types';

type VibeIconName = React.ComponentProps<typeof Ionicons>['name'];

const VIBE_CONFIG: Record<string, { label: string; icon: VibeIconName }> = {
  casual:    { label: 'Casual vibe',       icon: 'happy-outline'  },
  strong:    { label: 'Strong connection', icon: 'heart-outline'  },
  soulmates: { label: 'Soulmates',         icon: 'flame-outline'  },
};

function FadeSlide({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 420,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
    }}>
      {children}
    </Animated.View>
  );
}

export default function SparksScreen() {
  const [accepted, setAccepted] = useState<Set<string>>(new Set());

  function renderSpark({ item, index }: { item: IncomingSpark; index: number }) {
    const isAccepted = accepted.has(item.id);
    const vibe = VIBE_CONFIG[item.vibe];

    return (
      <FadeSlide delay={index * 80}>
        <View style={styles.card}>
          {isAccepted && (
            <View style={styles.matchedBanner}>
              <Ionicons name="heart" size={14} color="#fff" />
              <Text style={styles.matchedText}>It's a match, say hello</Text>
            </View>
          )}

          <View style={styles.cardBody}>
            <Image source={{ uri: item.suggestedUser.photos[0] }} style={styles.photo} />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {item.suggestedUser.name}, {item.suggestedUser.age}
                </Text>
                {item.aiVerified && (
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiStar}>✦</Text>
                    <Text style={styles.aiLabel}>AI</Text>
                  </View>
                )}
              </View>
              <View style={styles.cupidLine}>
                <Ionicons name="heart-circle" size={11} color={colors.muted} />
                <Text style={styles.cupidText}>Sparked by {item.cupidName}</Text>
              </View>
              <View style={styles.vibePill}>
                <Ionicons name={vibe.icon} size={11} color={colors.violetBright} />
                <Text style={styles.vibeText}>{vibe.label}</Text>
              </View>
            </View>
          </View>

          <View style={styles.noteBox}>
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
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.acceptBtnText}>Accept</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </FadeSlide>
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
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 12,
    color: colors.muted,
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
    backgroundColor: colors.rose,
    paddingVertical: 10,
  },
  matchedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
  cardBody: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  photo: {
    width: 68,
    height: 84,
    borderRadius: radius.sm,
  },
  info: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.violetSoft,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.violet + '30',
  },
  aiStar: { fontSize: 8, color: colors.violetBright },
  aiLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
    letterSpacing: 0.5,
  },
  cupidLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cupidText: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  vibePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.glass,
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vibeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
  },
  noteBox: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.glass,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteText: {
    fontSize: 13,
    color: colors.text,
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
    backgroundColor: colors.glass,
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
    backgroundColor: colors.rose,
    borderRadius: radius.full,
    paddingVertical: 11,
    ...shadow.button,
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
});
