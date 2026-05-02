import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

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
    backgroundColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagHighlighted: {
    backgroundColor: '#FFF0EE',
    borderColor: colors.coral,
  },
  tagSmall: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
  },
  label: {
    fontSize: 13,
    color: colors.dark,
    fontWeight: '500',
  },
  labelHighlighted: {
    color: colors.coral,
  },
  labelSmall: {
    fontSize: 11,
  },
});
