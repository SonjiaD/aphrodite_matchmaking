import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/auth';
import { colors, font, radius, shadow, spacing } from '../constants/theme';
import { ChatMessage, MOCK_MESSAGES } from '../data/messages';
import { IncomingSpark } from '../types';

interface Props {
  spark: IncomingSpark;
  onClose: () => void;
}

type MeetStep = null | 'rating' | 'done';

export default function ChatScreen({ spark, onClose }: Props) {
  const { addCupidCredit } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES[spark.id] ?? []);
  const [inputText, setInputText]   = useState('');
  const [showMeetBanner, setShowMeetBanner] = useState(false);
  const [meetStep, setMeetStep]     = useState<MeetStep>(null);
  const [toastText, setToastText]   = useState('');

  const slideAnim  = useRef(new Animated.Value(900)).current;
  const toastAnim  = useRef(new Animated.Value(-80)).current;
  const meetAnim   = useRef(new Animated.Value(0)).current;
  const scrollRef  = useRef<ScrollView>(null);

  // Slide screen up on mount
  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 0, bounciness: 3, speed: 14, useNativeDriver: true }).start();
  }, []);

  // Show meet banner after 3.5s
  useEffect(() => {
    const t = setTimeout(() => {
      setShowMeetBanner(true);
      Animated.spring(meetAnim, { toValue: 1, bounciness: 4, speed: 12, useNativeDriver: true }).start();
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  function close() {
    Animated.timing(slideAnim, { toValue: 900, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(onClose);
  }

  function sendMessage() {
    const text = inputText.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text, fromMe: true, time: 'Just now' }]);
    setInputText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }

  function dismissMeet() {
    Animated.timing(meetAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setShowMeetBanner(false));
  }

  function handleRating(rating: 'great' | 'okay' | 'nope') {
    setMeetStep('done');
    dismissMeet();
    if (rating === 'great') {
      addCupidCredit(spark.cupidName, spark.suggestedUser.name, 15);
      showToast(`${spark.cupidName} earned +15 pts for this match`);
    }
  }

  function showToast(text: string) {
    setToastText(text);
    toastAnim.setValue(-80);
    Animated.sequence([
      Animated.spring(toastAnim, { toValue: 0, bounciness: 6, speed: 14, useNativeDriver: true }),
      Animated.delay(3000),
      Animated.timing(toastAnim, { toValue: -80, duration: 280, useNativeDriver: true }),
    ]).start(() => setToastText(''));
  }

  const user = spark.suggestedUser;

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, styles.root, { transform: [{ translateY: slideAnim }] }]}>
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={close}>
            <Ionicons name="chevron-back" size={22} color={colors.dark} />
          </TouchableOpacity>
          <Image source={{ uri: user.photos[0] }} style={styles.headerPhoto} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{user.name}, {user.age}</Text>
            <View style={styles.cupidLine}>
              <Ionicons name="heart-circle" size={11} color={colors.muted} />
              <Text style={styles.cupidText}>Sparked by {spark.cupidName}</Text>
            </View>
          </View>
        </View>

        {/* Toast */}
        {toastText !== '' && (
          <Animated.View style={[styles.toast, { transform: [{ translateY: toastAnim }] }]}>
            <Ionicons name="flash" size={13} color={colors.violetBright} />
            <Text style={styles.toastText}>{toastText}</Text>
          </Animated.View>
        )}

        {/* Meet banner */}
        {showMeetBanner && meetStep === null && (
          <Animated.View style={[styles.meetBanner, {
            opacity: meetAnim,
            transform: [{ translateY: meetAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          }]}>
            <Text style={styles.meetQ}>Have you two met in person yet?</Text>
            <View style={styles.meetBtns}>
              <TouchableOpacity style={styles.meetNoBtn} onPress={dismissMeet}>
                <Text style={styles.meetNoText}>Not yet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.meetYesBtn} onPress={() => setMeetStep('rating')}>
                <Text style={styles.meetYesText}>Yes!</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Rating banner */}
        {meetStep === 'rating' && (
          <View style={styles.ratingBanner}>
            <Text style={styles.ratingQ}>How was the vibe?</Text>
            <View style={styles.ratingBtns}>
              <TouchableOpacity style={[styles.ratingBtn, styles.ratingGreat]} onPress={() => handleRating('great')}>
                <Ionicons name="heart" size={14} color={colors.rose} />
                <Text style={styles.ratingGreatText}>Great connection</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ratingBtn} onPress={() => handleRating('okay')}>
                <Text style={styles.ratingText}>Still getting to know each other</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ratingBtn} onPress={() => handleRating('nope')}>
                <Text style={styles.ratingText}>Not a match</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.bubble, msg.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.bubbleText, msg.fromMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                {msg.text}
              </Text>
              <Text style={[styles.bubbleTime, msg.fromMe ? styles.bubbleTimeMe : styles.bubbleTimeThem]}>
                {msg.time}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor={colors.mutedLight}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={300}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons name="arrow-up" size={18} color={inputText.trim() ? '#fff' : colors.mutedLight} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.bg,
    zIndex: 200,
  },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surfaceEl,
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerInfo: { flex: 1, gap: 2 },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  cupidLine: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cupidText: { fontSize: 11, color: colors.muted, fontFamily: font ?? undefined },
  toast: {
    position: 'absolute',
    top: 100,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.violetSoft,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.violet + '30',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 50,
    ...shadow.card,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.violetBright,
    fontFamily: font ?? undefined,
    flex: 1,
  },
  meetBanner: {
    margin: spacing.md,
    marginBottom: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.card,
  },
  meetQ: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
    textAlign: 'center',
  },
  meetBtns: { flexDirection: 'row', gap: spacing.sm },
  meetNoBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.glass,
  },
  meetNoText: { fontSize: 13, fontWeight: '600', color: colors.muted, fontFamily: font ?? undefined },
  meetYesBtn: {
    flex: 1,
    backgroundColor: colors.rose,
    borderRadius: radius.full,
    paddingVertical: 10,
    alignItems: 'center',
    ...shadow.button,
  },
  meetYesText: { fontSize: 13, fontWeight: '700', color: '#fff', fontFamily: font ?? undefined },
  ratingBanner: {
    margin: spacing.md,
    marginBottom: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.card,
  },
  ratingQ: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
    textAlign: 'center',
  },
  ratingBtns: { gap: spacing.xs },
  ratingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: 10,
    backgroundColor: colors.glass,
  },
  ratingGreat: {
    backgroundColor: colors.roseSoft,
    borderColor: colors.rose + '40',
  },
  ratingGreatText: { fontSize: 13, fontWeight: '700', color: colors.rose, fontFamily: font ?? undefined },
  ratingText: { fontSize: 13, fontWeight: '600', color: colors.muted, fontFamily: font ?? undefined },
  messageList: { flex: 1 },
  messageContent: { padding: spacing.md, gap: spacing.sm },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 3,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: colors.rose,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: { fontSize: 14, lineHeight: 20, fontFamily: font ?? undefined },
  bubbleTextMe:   { color: '#fff' },
  bubbleTextThem: { color: colors.dark },
  bubbleTime: { fontSize: 10, fontFamily: font ?? undefined },
  bubbleTimeMe:   { color: 'rgba(255,255,255,0.65)', alignSelf: 'flex-end' },
  bubbleTimeThem: { color: colors.mutedLight },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceEl,
  },
  input: {
    flex: 1,
    backgroundColor: colors.glass,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.dark,
    fontFamily: font ?? undefined,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.button,
  },
  sendBtnDisabled: {
    backgroundColor: colors.glass,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
