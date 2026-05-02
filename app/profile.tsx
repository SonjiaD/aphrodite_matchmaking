import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import InterestTag from '../components/InterestTag';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { profiles } from '../data/profiles';

const ME = profiles[4];

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const BADGES: { icon: IoniconName; label: string; desc: string }[] = [
  { icon: 'flash',   label: 'First Spark', desc: 'Made your first match' },
  { icon: 'flame',   label: 'Hot Streak',  desc: '3 weeks in a row' },
  { icon: 'heart',   label: 'Soulmaker',   desc: '5 successful sparks' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
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

        {/* Cupid Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash" size={16} color={colors.violet} />
            <Text style={styles.sectionTitle}>Cupid Stats</Text>
          </View>
          <View style={styles.statsGrid}>
            <StatBox label="Total Sparks" value="12" />
            <StatBox label="Success Rate" value="67%" accent />
            <StatBox label="Current Rank" value="#4" />
            <StatBox label="Week Streak" value="3 wks" />
          </View>
        </View>

        {/* Points */}
        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>Spark Points</Text>
            <View style={styles.pointsRow}>
              <Ionicons name="flash" size={16} color={colors.violet} />
              <Text style={styles.pointsValue}>480 pts</Text>
            </View>
          </View>
          <Text style={styles.pointsHint}>20 pts until your next reward</Text>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges earned</Text>
          {BADGES.map((b) => (
            <View key={b.label} style={styles.badgeRow}>
              <View style={styles.badgeIcon}>
                <Ionicons name={b.icon} size={20} color={colors.violetBright} />
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
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
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
  scroll: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xxl },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  photo: {
    width: 80,
    height: 100,
    borderRadius: radius.sm,
  },
  profileInfo: { flex: 1, gap: spacing.xs },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  distance: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  interestsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.glass,
    borderRadius: radius.sm,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBoxAccent: { backgroundColor: colors.roseSoft, borderColor: colors.rose + '30' },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.violet,
    fontFamily: font ?? undefined,
  },
  statValueAccent: { color: colors.rose },
  statLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
    fontFamily: font ?? undefined,
  },
  statLabelAccent: { color: colors.rose },
  pointsCard: {
    backgroundColor: colors.violetSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.violet + '25',
  },
  pointsLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
    fontFamily: font ?? undefined,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
  },
  pointsHint: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'right',
    maxWidth: 120,
    fontFamily: font ?? undefined,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.violetSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.violet + '25',
  },
  badgeLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  badgeDesc: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 1,
    fontFamily: font ?? undefined,
  },
});
