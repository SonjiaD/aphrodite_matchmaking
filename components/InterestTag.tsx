import { StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../constants/theme';

interface Props {
  label: string;
  highlighted?: boolean;
  small?: boolean;
}

export default function InterestTag({ label, highlighted = false, small = false }: Props) {
  return (
    <View style={[styles.tag, highlighted && styles.tagHighlighted, small && styles.tagSmall]}>
      <Text style={[styles.label, highlighted && styles.labelHighlighted, small && styles.labelSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: colors.glass,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagHighlighted: {
    backgroundColor: colors.roseSoft,
    borderColor: colors.rose + '50',
  },
  tagSmall: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  label: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    fontFamily: font ?? undefined,
  },
  labelHighlighted: {
    color: colors.rose,
  },
  labelSmall: {
    fontSize: 11,
  },
});
