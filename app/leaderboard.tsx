import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { leaderboardAllTime, leaderboardWeekly } from '../data/leaderboard';
import { LeaderboardEntry } from '../types';

const RANK_COLORS = [
  { text: '#FFD700', border: 'rgba(255,215,0,0.3)',  bg: 'rgba(255,215,0,0.08)'  },
  { text: '#C0C0C0', border: 'rgba(192,192,192,0.3)', bg: 'rgba(192,192,192,0.08)' },
  { text: '#CD7F32', border: 'rgba(205,127,50,0.3)',  bg: 'rgba(205,127,50,0.08)'  },
];

function FadeSlide({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
    }}>
      {children}
    </Animated.View>
  );
}

function TopCard({ entry, delay }: { entry: LeaderboardEntry; delay: number }) {
  const rc = RANK_COLORS[entry.rank - 1];
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 5, speed: 10, delay }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
      <View style={[styles.topCard, { borderColor: rc.border, backgroundColor: rc.bg }]}>
        <View style={[styles.rankBadge, { borderColor: rc.border }]}>
          <Text style={[styles.rankNum, { color: rc.text }]}>#{entry.rank}</Text>
        </View>
        <Image source={{ uri: entry.user.photos[0] }} style={styles.topAvatar} />
        <Text style={styles.topName}>{entry.user.name}</Text>
        <Text style={styles.topSparks}>{entry.stats.totalSparks} sparks</Text>
        <Text style={styles.topRate}>{entry.stats.successRate}%</Text>
        {entry.stats.streak > 0 && (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={10} color={colors.rose} />
            <Text style={styles.streakText}>{entry.stats.streak}wk</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

function LeaderRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  return (
    <FadeSlide delay={index * 60 + 300}>
      <View style={styles.row}>
        <Text style={styles.rowRank}>#{entry.rank}</Text>
        <Image source={{ uri: entry.user.photos[0] }} style={styles.rowAvatar} />
        <View style={styles.rowInfo}>
          <Text style={styles.rowName}>{entry.user.name}</Text>
          <Text style={styles.rowBadge}>{entry.stats.badges[0]}</Text>
        </View>
        <View style={styles.rowStats}>
          <Text style={styles.rowSparks}>{entry.stats.totalSparks} sparks</Text>
          <Text style={styles.rowRate}>{entry.stats.successRate}% success</Text>
        </View>
      </View>
    </FadeSlide>
  );
}

export default function LeaderboardScreen() {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly');
  const data = tab === 'weekly' ? leaderboardWeekly : leaderboardAllTime;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={styles.tabRow}>
          {(['weekly', 'alltime'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabLabel, tab === t && styles.tabLabelActive]}>
                {t === 'weekly' ? 'This Week' : 'All Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        key={tab}
        data={rest}
        keyExtractor={(item) => item.user.id}
        ListHeaderComponent={() => (
          <View style={styles.topRow}>
            {top3.map((e, i) => <TopCard key={e.user.id} entry={e} delay={i * 80} />)}
          </View>
        )}
        renderItem={({ item, index }) => (
          <LeaderRow entry={item} index={index} />
        )}
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
    paddingTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.4,
    marginBottom: spacing.md,
  },
  tabRow: { flexDirection: 'row' },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.rose },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  tabLabelActive: { color: colors.dark },
  list: { padding: spacing.md, gap: spacing.sm },
  topRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  topCard: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
    gap: 4,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  rankNum: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: font ?? undefined,
  },
  topAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 2,
  },
  topName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    fontFamily: font ?? undefined,
  },
  topSparks: {
    fontSize: 10,
    color: colors.violet,
    fontWeight: '600',
    fontFamily: font ?? undefined,
  },
  topRate: {
    fontSize: 10,
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.roseSoft,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  streakText: {
    fontSize: 10,
    color: colors.rose,
    fontWeight: '700',
    fontFamily: font ?? undefined,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  rowRank: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.mutedLight,
    width: 28,
    fontFamily: font ?? undefined,
  },
  rowAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowInfo: { flex: 1, gap: 2 },
  rowName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  rowBadge: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  rowStats: { alignItems: 'flex-end', gap: 2 },
  rowSparks: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.violet,
    fontFamily: font ?? undefined,
  },
  rowRate: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
});
