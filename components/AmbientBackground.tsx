import { Platform, StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

// Decorative ambient glow orbs — sit behind all screen content.
// On web these use CSS blur for a true glassmorphism look.
export default function AmbientBackground() {
  const webBlur = Platform.OS === 'web'
    ? ({ filter: 'blur(72px)' } as any)
    : {};

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={[styles.violet, webBlur]} />
      <View style={[styles.rose,   webBlur]} />
    </View>
  );
}

const styles = StyleSheet.create({
  violet: {
    position: 'absolute',
    top:   -60,
    left:  -60,
    width:  280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.ambientViolet,
  },
  rose: {
    position: 'absolute',
    bottom: -60,
    right:  -60,
    width:  260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.ambientRose,
  },
});
