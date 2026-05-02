import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import InterestTag from '../components/InterestTag';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { profiles } from '../data/profiles';

const ME = profiles[4]; // Sofia — our "logged in" user

const BADGES = [
  { emoji: '🏹', label: 'First Spark', desc: 'Made your first match' },
  { emoji: '🔥', label: 'Hot Streak', desc: '3 weeks in a row' },
  { emoji: '💛', label: 'Soulmaker', desc: '5 successful sparks' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile 👤</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: ME.photos[0] }} style={styles.photo} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{ME.name}, {ME.age}</Text>
            <Text style={styles.distance}>{ME.distance}</Text>
            <View style={styles.interestsRow}>
              {ME.interests.slice(0, 4).map((i) => (
                <InterestTag key={i} label={i} small />
              ))}
            </View>
          </View>
        </View>

        {/* Prompt */}
        <View style={styles.promptBubble}>
          <Text style={styles.promptQ}>{ME.prompts[0].question}</Text>
          <Text style={styles.promptA}>{ME.prompts[0].answer}</Text>
        </View>

        {/* Cupid Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏹 Cupid Stats</Text>
          <View style={styles.statsGrid}>
            <StatBox label="Total Sparks" value="12" />
            <StatBox label="Success Rate" value="67%" accent />
            <StatBox label="Current Rank" value="#4" />
            <StatBox label="Week Streak" value="3 🔥" />
          </View>
        </View>

        {/* Points */}
        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>Spark Points</Text>
            <Text style={styles.pointsValue}>⚡ 480 pts</Text>
          </View>
          <Text style={styles.pointsHint}>20 pts until your next reward</Text>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges earned</Text>
          {BADGES.map((b) => (
            <View key={b.label} style={styles.badgeRow}>
              <View style={styles.badgeEmoji}>
                <Text style={styles.badgeEmojiText}>{b.emoji}</Text>
              </View>
              <View>
                <Text style={styles.badgeLabel}>{b.label}</Text>
                <Text style={styles.badgeDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={[styles.statBox, accent && styles.statBoxAccent]}>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
      <Text style={[styles.statLabel, accent && styles.statLabelAccent]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    backgroundColor: colors.plum,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.cardWhite },
  scroll: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  profileCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.md,
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
    ...shadow.card,
  },
  photo: { width: 80, height: 100, borderRadius: radius.sm },
  profileInfo: { flex: 1, gap: spacing.xs },
  name: { fontSize: 20, fontWeight: '700', color: colors.dark },
  distance: { fontSize: 13, color: colors.muted },
  interestsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  promptBubble: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.plum,
    ...shadow.card,
  },
  promptQ: {
    fontSize: 11, fontWeight: '700', color: colors.plum,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
  },
  promptA: { fontSize: 14, color: colors.dark, lineHeight: 21, fontStyle: 'italic' },
  section: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    ...shadow.card,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.dark },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  statBoxAccent: { backgroundColor: '#FFF0EE' },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.plum },
  statValueAccent: { color: colors.coral },
  statLabel: { fontSize: 11, color: colors.muted, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  statLabelAccent: { color: colors.coral },
  pointsCard: {
    backgroundColor: colors.plum,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  pointsValue: { fontSize: 22, fontWeight: '800', color: colors.gold, marginTop: 2 },
  pointsHint: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'right', maxWidth: 120 },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeEmoji: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmojiText: { fontSize: 22 },
  badgeLabel: { fontSize: 15, fontWeight: '700', color: colors.dark },
  badgeDesc: { fontSize: 12, color: colors.muted, marginTop: 1 },
});
