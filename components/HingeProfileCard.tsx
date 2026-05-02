import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../constants/theme';
import { User } from '../types';
import InterestTag from './InterestTag';

interface Props {
  user: User;
  compact?: boolean;
  sharedInterests?: string[];
}

export default function HingeProfileCard({ user, compact = false, sharedInterests = [] }: Props) {
  const cardWidth = compact ? undefined : undefined;

  return (
    <ScrollView
      style={[styles.card, compact && styles.cardCompact]}
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

      {/* Name + age chip */}
      <View style={styles.nameRow}>
        <Text style={[styles.name, compact && styles.nameCompact]}>{user.name}</Text>
        <Text style={[styles.age, compact && styles.ageCompact]}>{user.age}</Text>
      </View>
      {!compact && (
        <Text style={styles.distance}>{user.distance}</Text>
      )}

      {/* First prompt */}
      <View style={styles.promptBubble}>
        <Text style={styles.promptQuestion}>{user.prompts[0]?.question}</Text>
        <Text style={[styles.promptAnswer, compact && styles.promptAnswerCompact]}>
          {user.prompts[0]?.answer}
        </Text>
      </View>

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
        {user.interests.slice(0, compact ? 3 : 5).map((interest) => (
          <InterestTag
            key={interest}
            label={interest}
            highlighted={sharedInterests.includes(interest)}
            small={compact}
          />
        ))}
      </View>

      {/* Second prompt */}
      {!compact && user.prompts[1] && (
        <View style={styles.promptBubble}>
          <Text style={styles.promptQuestion}>{user.prompts[1]?.question}</Text>
          <Text style={styles.promptAnswer}>{user.prompts[1]?.answer}</Text>
        </View>
      )}

      {/* Looking for */}
      <View style={styles.lookingForRow}>
        <Text style={styles.lookingForLabel}>Looking for </Text>
        <Text style={styles.lookingForValue}>{user.lookingFor}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.md,
    ...shadow.card,
    flex: 1,
  },
  cardCompact: {
    borderRadius: radius.md,
  },
  content: {
    paddingBottom: spacing.lg,
  },
  primaryPhoto: {
    width: '100%',
    height: 320,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  primaryPhotoCompact: {
    height: 180,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
  },
  nameCompact: {
    fontSize: 18,
  },
  age: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.dark,
  },
  ageCompact: {
    fontSize: 16,
  },
  distance: {
    fontSize: 13,
    color: colors.muted,
    paddingHorizontal: spacing.md,
    marginTop: 2,
  },
  promptBubble: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.plum,
  },
  promptQuestion: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.plum,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  promptAnswer: {
    fontSize: 15,
    color: colors.dark,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  promptAnswerCompact: {
    fontSize: 12,
    lineHeight: 17,
  },
  secondaryPhoto: {
    width: '100%',
    height: 200,
    marginTop: spacing.md,
  },
  secondaryPhotoCompact: {
    height: 120,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  lookingForRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  lookingForLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  lookingForValue: {
    fontSize: 13,
    color: colors.plum,
    fontWeight: '600',
  },
});
