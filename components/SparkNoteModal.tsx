import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { User } from '../types';
import VibeSelector from './VibeSelector';

type Vibe = 'casual' | 'strong' | 'soulmates';

interface Props {
  user1: User;
  user2: User;
  onClose: () => void;
  onSubmit: (note: string, vibe: Vibe) => void;
  sharedInterests?: string[];
}

const MAX = 150;

function buildSuggestions(u1: User, u2: User, shared: string[]): string[] {
  const base = shared.length > 0
    ? `They both love ${shared.slice(0, 2).join(' and ').toLowerCase()}`
    : `${u1.name} and ${u2.name} have the same laid-back energy`;
  return [
    `${base}, feels like a natural fit.`,
    `${u1.name}'s answer is exactly what ${u2.name} said they're looking for.`,
    `Same vibe, different energy. They'd balance each other really well.`,
  ];
}

export default function SparkNoteModal({ user1, user2, onClose, onSubmit, sharedInterests = [] }: Props) {
  const [note, setNote] = useState('');
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const suggestions = buildSuggestions(user1, user2, sharedInterests);
  const canSubmit = note.trim().length > 0 && vibe !== null;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 3, speed: 14 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  function close() {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 600, duration: 220, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(onClose);
  }

  function submit() {
    if (!canSubmit) return;
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 600, duration: 180, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => onSubmit(note, vibe!));
  }

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.title}>Why would they click?</Text>
              <Text style={styles.subtitle}>{user1.name} & {user2.name}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={close}>
              <Ionicons name="close" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Avatars */}
          <View style={styles.avatarRow}>
            <Image source={{ uri: user1.photos[0] }} style={styles.avatar} />
            <View style={styles.connector}>
              <View style={styles.line} />
              <View style={styles.connectorDot}>
                <Ionicons name="flash" size={11} color={colors.rose} />
              </View>
              <View style={styles.line} />
            </View>
            <Image source={{ uri: user2.photos[0] }} style={styles.avatar} />
          </View>

          {/* AI Suggestions */}
          <View style={styles.suggestionsHeader}>
            <Text style={styles.aiStar}>✦</Text>
            <Text style={styles.suggestionsLabel}>Suggested by Aphrodite AI, tap to use</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsList}>
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.suggestionChip}
                onPress={() => setNote(s)}
                activeOpacity={0.75}
              >
                <Text style={styles.suggestionText} numberOfLines={2}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Note input */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Or write your own note..."
              placeholderTextColor={colors.mutedLight}
              multiline
              maxLength={MAX}
              value={note}
              onChangeText={setNote}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, note.length > MAX - 20 && styles.charWarn]}>
              {note.length}/{MAX}
            </Text>
          </View>

          <VibeSelector selected={vibe} onSelect={setVibe} />

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitDisabled]}
            onPress={submit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Ionicons name="flash" size={16} color={canSubmit ? '#fff' : colors.mutedLight} />
            <Text style={[styles.submitLabel, !canSubmit && styles.submitLabelDisabled]}>
              Send Spark
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  kav: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#12102E',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    ...shadow.modal,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.borderMid,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMid,
    alignSelf: 'center',
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: font ?? undefined,
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.borderHi,
  },
  connector: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  connectorDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.roseSoft,
    borderWidth: 1,
    borderColor: colors.rose + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: -spacing.xs,
  },
  aiStar: { fontSize: 11, color: colors.violetBright },
  suggestionsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionsList: {
    gap: spacing.xs,
    paddingRight: spacing.xs,
  },
  suggestionChip: {
    backgroundColor: colors.violetSoft,
    borderRadius: radius.md,
    padding: spacing.sm,
    maxWidth: 200,
    borderWidth: 1,
    borderColor: colors.violet + '50',
  },
  suggestionText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: font ?? undefined,
    lineHeight: 17,
  },
  inputBox: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMid,
    padding: spacing.md,
    minHeight: 80,
  },
  input: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 21,
    minHeight: 52,
    fontFamily: font ?? undefined,
  },
  charCount: {
    fontSize: 10,
    color: colors.mutedLight,
    textAlign: 'right',
    marginTop: 4,
    fontFamily: font ?? undefined,
  },
  charWarn: { color: colors.rose },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.rose,
    borderRadius: radius.full,
    paddingVertical: 15,
    ...shadow.glowRose,
  },
  submitDisabled: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
  submitLabelDisabled: { color: colors.mutedLight },
});
