import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ChatScreen from '../components/ChatScreen';
import { useOverlay } from '../context/overlay';
import { colors, font, radius, spacing } from '../constants/theme';
import { MOCK_MESSAGES } from '../data/messages';
import { incomingSparks } from '../data/sparks';
import { IncomingSpark } from '../types';

function FadeSlide({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1, duration: 380, delay,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
    }}>
      {children}
    </Animated.View>
  );
}

export default function ChatsScreen() {
  const overlay = useOverlay();

  function openChat(item: IncomingSpark) {
    overlay.present(<ChatScreen spark={item} onClose={overlay.dismiss} />);
  }

  function renderItem({ item, index }: { item: IncomingSpark; index: number }) {
    const msgs    = MOCK_MESSAGES[item.id] ?? [];
    const lastMsg = msgs[msgs.length - 1];
    const preview = lastMsg ? lastMsg.text : 'Start the conversation';
    const time    = lastMsg ? lastMsg.time : '';

    return (
      <FadeSlide delay={index * 55}>
        <TouchableOpacity style={styles.row} onPress={() => openChat(item)} activeOpacity={0.75}>
          <View style={styles.photoWrap}>
            <Image source={{ uri: item.suggestedUser.photos[0] }} style={styles.photo} />
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.info}>
            <View style={styles.topRow}>
              <Text style={styles.name}>
                {item.suggestedUser.name}, {item.suggestedUser.age}
              </Text>
              <Text style={styles.time}>{time}</Text>
            </View>
            <Text style={styles.preview} numberOfLines={1}>{preview}</Text>
            <View style={styles.cupidLine}>
              <Ionicons name="heart-circle" size={10} color={colors.mutedLight} />
              <Text style={styles.cupidText}>Sparked by {item.cupidName}</Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />
        </TouchableOpacity>
      </FadeSlide>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSub}>{incomingSparks.length} conversations</Text>
      </View>
      <FlatList
        data={incomingSparks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
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
  headerSub: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: font ?? undefined,
    marginTop: 2,
  },
  list: { paddingVertical: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  photoWrap: { position: 'relative' },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  info: { flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  time: {
    fontSize: 11,
    color: colors.mutedLight,
    fontFamily: font ?? undefined,
  },
  preview: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: font ?? undefined,
    marginBottom: 3,
  },
  cupidLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cupidText: {
    fontSize: 10,
    color: colors.mutedLight,
    fontFamily: font ?? undefined,
  },
});
