import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';

const VIBES = [
  { key: 'casual',    label: 'Casual',    icon: 'happy-outline'  as const },
  { key: 'strong',    label: 'Strong',    icon: 'heart-outline'  as const },
  { key: 'soulmates', label: 'Soulmates', icon: 'flame-outline'  as const },
] as const;

type Vibe = 'casual' | 'strong' | 'soulmates';

interface Props {
  selected: Vibe | null;
  onSelect: (v: Vibe) => void;
}

export default function VibeSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How strong is this connection?</Text>
      <View style={styles.row}>
        {VIBES.map((v) => {
          const active = selected === v.key;
          return (
            <TouchableOpacity
              key={v.key}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => onSelect(v.key)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={v.icon}
                size={14}
                color={active ? colors.rose : colors.muted}
              />
              <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                {v.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  pillActive: {
    borderColor: colors.rose + '60',
    backgroundColor: colors.roseSoft,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
  pillLabelActive: {
    color: colors.rose,
  },
});
