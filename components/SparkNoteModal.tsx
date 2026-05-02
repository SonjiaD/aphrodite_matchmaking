import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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
  visible: boolean;
  user1: User;
  user2: User;
  onClose: () => void;
  onSubmit: (note: string, vibe: Vibe) => void;
}

const MAX_CHARS = 150;
const HINTS = [
  'They both love hiking and seem really laid back...',
  'Her prompt answer is exactly what he said he\'s looking for...',
  'Same music taste, same low-key energy — just a feeling...',
];

export default function SparkNoteModal({ visible, user1, user2, onClose, onSubmit }: Props) {
  const [note, setNote] = useState('');
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [hint] = useState(() => HINTS[Math.floor(Math.random() * HINTS.length)]);
  const slideAnim = useRef(new Animated.Value(700)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 3, speed: 14 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 700, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
      setNote('');
      setVibe(null);
    }
  }, [visible]);

  const canSubmit = note.trim().length > 0 && vibe !== null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        pointerEvents="box-none"
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header row */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Why would they click?</Text>
              <Text style={styles.sheetSub}>{user1.name} & {user2.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Avatars */}
          <View style={styles.avatarRow}>
            <Image source={{ uri: user1.photos[0] }} style={styles.avatar} />
            <View style={styles.connector}>
              <View style={styles.connectorLine} />
              <View style={styles.connectorDot}>
                <Ionicons name="flash" size={12} color={colors.coral} />
              </View>
              <View style={styles.connectorLine} />
            </View>
            <Image source={{ uri: user2.photos[0] }} style={styles.avatar} />
          </View>

          {/* Note input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={hint}
              placeholderTextColor={colors.mutedLight}
              multiline
              maxLength={MAX_CHARS}
              value={note}
              onChangeText={setNote}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, note.length > MAX_CHARS - 20 && styles.charCountWarn]}>
              {note.length}/{MAX_CHARS}
            </Text>
          </View>

          {/* Vibe selector */}
          <VibeSelector selected={vibe} onSelect={setVibe} />

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={() => canSubmit && onSubmit(note, vibe!)}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Ionicons name="flash" size={16} color={canSubmit ? colors.surface : colors.mutedLight} />
            <Text style={[styles.submitLabel, !canSubmit && styles.submitLabelDisabled]}>
              Send Spark
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,7,23,0.6)',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 8,
    gap: spacing.md,
    ...shadow.modal,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  sheetSub: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: font ?? undefined,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.border,
  },
  connector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  connectorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.coralSoft,
    borderWidth: 1,
    borderColor: colors.coral + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 96,
  },
  input: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 22,
    minHeight: 64,
    fontFamily: font ?? undefined,
  },
  charCount: {
    fontSize: 11,
    color: colors.mutedLight,
    textAlign: 'right',
    marginTop: spacing.xs,
    fontFamily: font ?? undefined,
  },
  charCountWarn: {
    color: colors.coral,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.coral,
    borderRadius: radius.full,
    paddingVertical: 15,
    marginTop: spacing.xs,
    ...shadow.strong,
  },
  submitBtnDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
    fontFamily: font ?? undefined,
  },
  submitLabelDisabled: {
    color: colors.mutedLight,
  },
});
