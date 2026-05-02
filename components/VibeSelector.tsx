import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';

const VIBES = [
  { key: 'casual', label: 'Casual vibe', emoji: '😊' },
  { key: 'strong', label: 'Strong connection', emoji: '💛' },
  { key: 'soulmates', label: 'Soulmates', emoji: '🔥' },
] as const;

type Vibe = 'casual' | 'strong' | 'soulmates';

interface Props {
  selected: Vibe | null;
  onSelect: (vibe: Vibe) => void;
}

export default function VibeSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How strong is this connection?</Text>
      <View style={styles.row}>
        {VIBES.map((vibe) => {
          const active = selected === vibe.key;
          return (
            <TouchableOpacity
              key={vibe.key}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => onSelect(vibe.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{vibe.emoji}</Text>
              <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                {vibe.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontFamily: font ?? undefined,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pillActive: {
    borderColor: colors.coral,
    backgroundColor: colors.coralSoft,
  },
  emoji: {
    fontSize: 13,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  pillLabelActive: {
    color: colors.coral,
    fontWeight: '600',
  },
});
