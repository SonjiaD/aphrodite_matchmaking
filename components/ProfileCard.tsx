import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';
import { User } from '../types';

interface Props {
  user: User;
  compact?: boolean;
  sharedInterests?: string[];
}

export default function ProfileCard({ user, compact = false, sharedInterests = [] }: Props) {
  if (compact) {
    return (
      <View style={styles.compactCard}>
        <Image
          source={{ uri: user.photos[0] }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.82)']}
          locations={[0.42, 1]}
          style={[StyleSheet.absoluteFillObject, styles.compactGrad]}
        >
          <View style={styles.compactInfo}>
            <Text style={styles.compactName} numberOfLines={1}>
              {user.name}{' '}
              <Text style={styles.compactAge}>{user.age}</Text>
            </Text>
            <View style={styles.tagsRow}>
              {user.interests.slice(0, 2).map((tag) => {
                const hi = sharedInterests.includes(tag);
                return (
                  <View key={tag} style={[styles.tag, hi && styles.tagHi]}>
                    <Text style={[styles.tagText, hi && styles.tagTextHi]}>{tag}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.fullCard}>
      <Image
        source={{ uri: user.photos[0] }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
        locations={[0, 0.3, 0.62, 1]}
        style={[StyleSheet.absoluteFillObject, styles.fullGrad]}
      >
        <View style={styles.fullInfo}>
          <Text style={styles.fullName}>
            {user.name}{' '}
            <Text style={styles.fullAge}>{user.age}</Text>
          </Text>
          <Text style={styles.distance}>{user.distance}</Text>

          {user.prompts[0]?.answer && (
            <Text style={styles.bio} numberOfLines={2}>
              {user.prompts[0].answer}
            </Text>
          )}

          <View style={styles.tagsRow}>
            {user.interests.slice(0, 4).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.lf}>
            Looking for{' '}
            <Text style={styles.lfValue}>{user.lookingFor}</Text>
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Full card (Discover) ──────────────────────────────
  fullCard: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  fullGrad: {
    justifyContent: 'flex-end',
  },
  fullInfo: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
    gap: 7,
  },
  fullName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: font ?? undefined,
    letterSpacing: -0.5,
  },
  fullAge: {
    fontSize: 24,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.80)',
  },
  distance: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: font ?? undefined,
    fontWeight: '500',
    marginTop: -3,
  },
  bio: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    fontFamily: font ?? undefined,
    lineHeight: 19,
    fontStyle: 'italic',
  },

  // ── Compact card (Cupid) ──────────────────────────────
  compactCard: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  compactGrad: {
    justifyContent: 'flex-end',
  },
  compactInfo: {
    padding: spacing.sm,
    gap: 5,
  },
  compactName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: font ?? undefined,
    letterSpacing: -0.2,
  },
  compactAge: {
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },

  // ── Shared ────────────────────────────────────────────
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  tagHi: {
    backgroundColor: colors.roseSoft,
    borderColor: colors.rose + '55',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.90)',
    fontFamily: font ?? undefined,
  },
  tagTextHi: { color: colors.rose },

  lf: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.50)',
    fontFamily: font ?? undefined,
  },
  lfValue: {
    color: colors.violetBright,
    fontWeight: '700',
  },
});
