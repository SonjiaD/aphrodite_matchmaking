import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { User } from '../types';

interface Props {
  user: User;
  compact?: boolean;
  sharedInterests?: string[];
}

export default function ProfileCard({ user, compact = false, sharedInterests = [] }: Props) {
  return (
    <ScrollView
      style={styles.card}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {/* Primary photo */}
      <Image
        source={{ uri: user.photos[0] }}
        style={[styles.primaryPhoto, compact && styles.primaryPhotoCompact]}
        resizeMode="cover"
      />

      {/* Identity */}
      <View style={styles.identity}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, compact && styles.nameCompact]}>{user.name}</Text>
          <Text style={[styles.age, compact && styles.ageCompact]}>{user.age}</Text>
        </View>
        {!compact && <Text style={styles.distance}>{user.distance}</Text>}
      </View>

      {/* First prompt */}
      <Prompt
        question={user.prompts[0]?.question}
        answer={user.prompts[0]?.answer}
        compact={compact}
      />

      {/* Second photo */}
      {user.photos[1] && (
        <Image
          source={{ uri: user.photos[1] }}
          style={[styles.secondaryPhoto, compact && styles.secondaryPhotoCompact]}
          resizeMode="cover"
        />
      )}

      {/* Interests */}
      <View style={styles.interestsRow}>
        {user.interests.slice(0, compact ? 3 : 5).map((interest) => {
          const highlighted = sharedInterests.includes(interest);
          return (
            <View key={interest} style={[styles.tag, highlighted && styles.tagHighlighted]}>
              <Text style={[styles.tagText, highlighted && styles.tagTextHighlighted, compact && styles.tagTextSmall]}>
                {interest}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Second prompt (full card only) */}
      {!compact && user.prompts[1] && (
        <Prompt question={user.prompts[1]?.question} answer={user.prompts[1]?.answer} />
      )}

      {/* Looking for */}
      <View style={styles.lookingForRow}>
        <Text style={styles.lookingForLabel}>Looking for  </Text>
        <Text style={styles.lookingForValue}>{user.lookingFor}</Text>
      </View>
    </ScrollView>
  );
}

function Prompt({ question, answer, compact }: { question?: string; answer?: string; compact?: boolean }) {
  if (!question || !answer) return null;
  return (
    <View style={[styles.prompt, compact && styles.promptCompact]}>
      <Text style={[styles.promptQ, compact && styles.promptQCompact]}>{question}</Text>
      <Text style={[styles.promptA, compact && styles.promptACompact]}>{answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  content: {
    paddingBottom: spacing.lg,
  },

  // Photos
  primaryPhoto: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  primaryPhotoCompact: {
    height: 190,
  },
  secondaryPhoto: {
    width: '100%',
    height: 180,
  },
  secondaryPhotoCompact: {
    height: 110,
  },

  // Identity
  identity: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  nameCompact: {
    fontSize: 17,
  },
  age: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  ageCompact: {
    fontSize: 15,
  },
  distance: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: font ?? undefined,
    fontWeight: '500',
  },

  // Prompt
  prompt: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 5,
  },
  promptCompact: {
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  promptQ: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.plumMid,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: font ?? undefined,
  },
  promptQCompact: {
    fontSize: 9,
  },
  promptA: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 21,
    fontFamily: font ?? undefined,
    fontWeight: '400',
  },
  promptACompact: {
    fontSize: 11,
    lineHeight: 16,
  },

  // Interests
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tagHighlighted: {
    borderColor: colors.coral,
    backgroundColor: colors.coralSoft,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  tagTextHighlighted: {
    color: colors.coral,
  },
  tagTextSmall: {
    fontSize: 10,
  },

  // Looking for
  lookingForRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  lookingForLabel: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: font ?? undefined,
    fontWeight: '400',
  },
  lookingForValue: {
    fontSize: 12,
    color: colors.plumMid,
    fontWeight: '600',
    fontFamily: font ?? undefined,
  },
});
