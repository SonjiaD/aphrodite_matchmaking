import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { profiles } from '../data/profiles';

export default function DiscoverScreen() {
  const [cardIndex, setCardIndex] = useState(0);
  const [heartVisible, setHeartVisible] = useState(false);
  const heartAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(1)).current;

  const profile = profiles[cardIndex % profiles.length];

  function showHeart() {
    setHeartVisible(true);
    heartAnim.setValue(0);
    Animated.sequence([
      Animated.spring(heartAnim, { toValue: 1, useNativeDriver: true, bounciness: 14 }),
      Animated.delay(700),
      Animated.timing(heartAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setHeartVisible(false));
  }

  function advance() {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setCardIndex((i) => i + 1), 150);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Aphrodite</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Card */}
      <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
        <ProfileCard user={profile} />
        {heartVisible && (
          <Animated.View
            style={[styles.heartFloat, { transform: [{ scale: heartAnim }], opacity: heartAnim }]}
          >
            <Ionicons name="heart" size={88} color={colors.rose} />
          </Animated.View>
        )}
      </Animated.View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={advance} activeOpacity={0.8}>
          <Ionicons name="close" size={26} color={colors.muted} />
          <Text style={styles.actionLabel}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.roseBtn]} activeOpacity={0.8}>
          <Ionicons name="rose" size={22} color={colors.violetBright} />
          <Text style={[styles.actionLabel, { color: colors.violetBright }]}>Rose</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.likeBtn]}
          onPress={() => { showHeart(); setTimeout(advance, 900); }}
          activeOpacity={0.8}
        >
          <Ionicons name="heart" size={26} color="#fff" />
          <Text style={[styles.actionLabel, { color: '#fff' }]}>Like</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    margin: 10,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  heartFloat: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
    ...shadow.card,
  },
  roseBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.violetSoft,
    borderColor: colors.violet + '30',
  },
  likeBtn: {
    backgroundColor: colors.rose,
    borderColor: colors.rose,
    ...shadow.button,
  },
  actionLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.muted,
    fontFamily: font ?? undefined,
  },
});
