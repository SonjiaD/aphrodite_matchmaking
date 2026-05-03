import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
import { OnboardingData, Role, useAuth } from '../context/auth';
import { colors, font, radius, shadow, spacing } from '../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const INTEREST_OPTIONS: { label: string; icon: IoniconName; color: string }[] = [
  { label: 'Hiking',   icon: 'leaf-outline',           color: '#22C55E' },
  { label: 'Coffee',   icon: 'cafe-outline',            color: '#F59E0B' },
  { label: 'Cooking',  icon: 'restaurant-outline',      color: '#F97316' },
  { label: 'Music',    icon: 'musical-notes-outline',   color: '#EC4899' },
  { label: 'Art',      icon: 'color-palette-outline',   color: '#8B5CF6' },
  { label: 'Yoga',     icon: 'fitness-outline',         color: '#14B8A6' },
  { label: 'Travel',   icon: 'airplane-outline',        color: '#3B82F6' },
  { label: 'Reading',  icon: 'book-outline',            color: '#EAB308' },
  { label: 'Gaming',   icon: 'game-controller-outline', color: '#6366F1' },
  { label: 'Tennis',   icon: 'tennisball-outline',      color: '#84CC16' },
  { label: 'Movies',   icon: 'film-outline',            color: '#F43F5E' },
  { label: 'Dancing',  icon: 'musical-note-outline',    color: '#A855F7' },
  { label: 'Fitness',  icon: 'barbell-outline',         color: '#06B6D4' },
  { label: 'Nature',   icon: 'sunny-outline',           color: '#10B981' },
  { label: 'Food',     icon: 'pizza-outline',           color: '#EF4444' },
];

const PROMPT_QUESTIONS = [
  'My ideal Sunday looks like...',
  'The way to my heart is...',
  'I get irrationally excited about...',
  'A fun fact about me is...',
  'I like people who...',
  'Right now I am focused on...',
];

const LOOKING_FOR_OPTIONS = [
  'Something serious',
  'Something casual',
  'Not sure yet',
  'Just exploring',
];

const ROLE_OPTIONS: {
  role: Role; title: string; desc: string; icon: IoniconName; color: string; bg: string;
}[] = [
  {
    role: 'cupid', title: 'Be a Cupid',
    desc: 'Help friends find love and earn points',
    icon: 'heart-circle-outline', color: colors.violetBright, bg: colors.violetSoft,
  },
  {
    role: 'match', title: 'Find a Match',
    desc: 'Get matched by people who know you',
    icon: 'rose-outline', color: colors.rose, bg: colors.roseSoft,
  },
  {
    role: 'both', title: 'Do Both',
    desc: 'Match and play Cupid at the same time',
    icon: 'flash-outline', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',
  },
];

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

// Steps: 0=Welcome 1=Name/Age 2=Role 3=Interests 4=Prompts 5=LookingFor 6=Done
export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);

  const [name, setName]   = useState('');
  const [age, setAge]     = useState('');
  const [role, setRole]   = useState<Role | null>(null);
  const [selectedInterests, setSelectedInterests]       = useState<string[]>([]);
  const [selectedPromptIndices, setSelectedPromptIndices] = useState<number[]>([]);
  const [promptAnswers, setPromptAnswers]               = useState<Record<number, string>>({});
  const [lookingFor, setLookingFor]                     = useState('');

  const stepFade  = useRef(new Animated.Value(1)).current;
  const stepSlide = useRef(new Animated.Value(0)).current;

  const doneScale     = useRef(new Animated.Value(0)).current;
  const doneFade      = useRef(new Animated.Value(0)).current;
  const doneParticles = useRef(PARTICLE_ANGLES.map(() => new Animated.Value(0))).current;

  const isCupidOnly = role === 'cupid';
  const totalSteps  = isCupidOnly ? 3 : 5;

  function goTo(nextStep: number, direction: 1 | -1 = 1) {
    Animated.parallel([
      Animated.timing(stepFade,  { toValue: 0, duration: 140, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(stepSlide, { toValue: -28 * direction, duration: 140, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      stepSlide.setValue(28 * direction);
      Animated.parallel([
        Animated.timing(stepFade,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(stepSlide, { toValue: 0, bounciness: 5, speed: 14, useNativeDriver: true }),
      ]).start();
    });
  }

  function handleNext() {
    if (step === 0) { goTo(1); return; }
    if (step === 1) { goTo(2); return; }
    if (step === 2) { goTo(3); return; }
    if (step === 3) { goTo(isCupidOnly ? 6 : 4); return; }
    if (step === 4) { goTo(5); return; }
    if (step === 5) { goTo(6); return; }
  }

  function handleBack() {
    if (step === 1) { goTo(0, -1); return; }
    if (step === 2) { goTo(1, -1); return; }
    if (step === 3) { goTo(2, -1); return; }
    if (step === 4) { goTo(3, -1); return; }
    if (step === 5) { goTo(4, -1); return; }
  }

  useEffect(() => {
    if (step !== 6) return;
    doneScale.setValue(0);
    doneFade.setValue(0);
    doneParticles.forEach(p => p.setValue(0));
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(doneScale, { toValue: 1, bounciness: 16, speed: 10, useNativeDriver: true }),
        Animated.timing(doneFade,  { toValue: 1, duration: 400, useNativeDriver: true }),
        ...doneParticles.map((p, i) =>
          Animated.sequence([
            Animated.delay(i * 60),
            Animated.timing(p, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ])
        ),
      ]),
    ]).start();
  }, [step]);

  function handleEnter() {
    const prompts = selectedPromptIndices.map(i => ({
      question: PROMPT_QUESTIONS[i],
      answer: promptAnswers[i] ?? '',
    }));
    const data: OnboardingData = {
      name: name.trim(),
      age:  age.trim(),
      role: role!,
      interests: selectedInterests,
      lookingFor,
      prompts,
    };
    completeOnboarding(data);
  }

  function toggleInterest(label: string) {
    setSelectedInterests(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  }

  function togglePrompt(index: number) {
    setSelectedPromptIndices(prev => {
      if (prev.includes(index)) {
        setPromptAnswers(a => { const c = { ...a }; delete c[index]; return c; });
        return prev.filter(i => i !== index);
      }
      if (prev.length >= 2) return prev;
      return [...prev, index];
    });
  }

  function canNext(): boolean {
    if (step === 0) return true;
    if (step === 1) return name.trim().length > 0 && age.trim().length > 0 && !isNaN(Number(age)) && Number(age) >= 18;
    if (step === 2) return role !== null;
    if (step === 3) return selectedInterests.length >= 3;
    if (step === 4) return selectedPromptIndices.length === 2 && selectedPromptIndices.every(i => (promptAnswers[i] ?? '').trim().length > 0);
    if (step === 5) return lookingFor !== '';
    return false;
  }

  function renderWelcome() {
    return (
      <View style={styles.welcomeContainer}>
        <View style={styles.logoWrap}>
          <Ionicons name="heart-circle" size={80} color={colors.rose} />
        </View>
        <Text style={styles.welcomeTitle}>Aphrodite</Text>
        <Text style={styles.welcomeTagline}>Love, engineered.</Text>
        <Text style={styles.welcomeSub}>Your community plays Cupid.</Text>
      </View>
    );
  }

  function renderNameAge() {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>What's your name?</Text>
        <Text style={styles.stepSub}>This is how you'll appear to others.</Text>
        <TextInput
          style={styles.textInput}
          placeholder="First name"
          placeholderTextColor={colors.mutedLight}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Age"
          placeholderTextColor={colors.mutedLight}
          value={age}
          onChangeText={text => setAge(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={3}
        />
        {age.length > 0 && Number(age) < 18 && (
          <Text style={styles.errorText}>You must be 18 or older.</Text>
        )}
      </View>
    );
  }

  function renderRole() {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>How do you want to play?</Text>
        <Text style={styles.stepSub}>You can change this later in your profile.</Text>
        <View style={styles.roleOptions}>
          {ROLE_OPTIONS.map(opt => {
            const selected = role === opt.role;
            return (
              <TouchableOpacity
                key={opt.role}
                style={[styles.roleCard, selected && { borderColor: opt.color, backgroundColor: opt.bg }]}
                onPress={() => setRole(opt.role)}
                activeOpacity={0.8}
              >
                <View style={[styles.roleIconWrap, { backgroundColor: selected ? opt.color + '22' : colors.surfaceEl }]}>
                  <Ionicons name={opt.icon} size={28} color={selected ? opt.color : colors.mutedLight} />
                </View>
                <View style={styles.roleTextWrap}>
                  <Text style={[styles.roleTitle, selected && { color: opt.color }]}>{opt.title}</Text>
                  <Text style={styles.roleDesc}>{opt.desc}</Text>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={22} color={opt.color} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  function renderInterests() {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>What are you into?</Text>
        <Text style={styles.stepSub}>Pick at least 3 to continue.</Text>
        <View style={styles.interestGrid}>
          {INTEREST_OPTIONS.map(opt => {
            const selected = selectedInterests.includes(opt.label);
            return (
              <TouchableOpacity
                key={opt.label}
                style={[styles.interestCard, selected && { backgroundColor: opt.color + '22', borderColor: opt.color + '80' }]}
                onPress={() => toggleInterest(opt.label)}
                activeOpacity={0.75}
              >
                <Ionicons name={opt.icon} size={26} color={selected ? opt.color : colors.mutedLight} />
                <Text style={[styles.interestLabel, selected && { color: opt.color }]}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.selectionHint}>
          {selectedInterests.length >= 3
            ? `${selectedInterests.length} selected`
            : `${3 - selectedInterests.length} more to go`}
        </Text>
      </View>
    );
  }

  function renderPrompts() {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Show your personality</Text>
        <Text style={styles.stepSub}>Pick 2 prompts and answer them.</Text>
        <View style={styles.promptList}>
          {PROMPT_QUESTIONS.map((q, i) => {
            const isSelected = selectedPromptIndices.includes(i);
            const isDisabled = !isSelected && selectedPromptIndices.length >= 2;
            return (
              <View key={i}>
                <TouchableOpacity
                  style={[
                    styles.promptCard,
                    isSelected && styles.promptCardSelected,
                    isDisabled && styles.promptCardDisabled,
                  ]}
                  onPress={() => { if (!isDisabled) togglePrompt(i); }}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.violetBright} style={{ marginRight: 6 }} />
                  )}
                  <Text style={[styles.promptQ, isSelected && { color: colors.violetBright }]}>{q}</Text>
                </TouchableOpacity>
                {isSelected && (
                  <TextInput
                    style={styles.promptInput}
                    placeholder="Your answer..."
                    placeholderTextColor={colors.mutedLight}
                    value={promptAnswers[i] ?? ''}
                    onChangeText={text => setPromptAnswers(prev => ({ ...prev, [i]: text }))}
                    multiline
                    maxLength={200}
                    textAlignVertical="top"
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  function renderLookingFor() {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>What are you looking for?</Text>
        <Text style={styles.stepSub}>Being honest helps Cupids match you better.</Text>
        <View style={styles.lookingForOptions}>
          {LOOKING_FOR_OPTIONS.map(opt => {
            const selected = lookingFor === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.lfCard, selected && styles.lfCardSelected]}
                onPress={() => setLookingFor(opt)}
                activeOpacity={0.8}
              >
                <Text style={[styles.lfLabel, selected && styles.lfLabelSelected]}>{opt}</Text>
                {selected && <Ionicons name="checkmark-circle" size={20} color={colors.rose} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  function renderDone() {
    const roleMessage =
      role === 'cupid' ? 'Start playing Cupid and earn points for great matches.' :
      role === 'match' ? 'Sit back and let the community match you.' :
      'Play Cupid and get matched at the same time.';
    return (
      <View style={styles.doneContainer}>
        {doneParticles.map((p, i) => {
          const angle = (PARTICLE_ANGLES[i] * Math.PI) / 180;
          const dist  = 90 + (i % 3) * 32;
          return (
            <Animated.View key={i} style={[styles.doneParticle, {
              transform: [
                { translateX: p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * dist] }) },
                { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * dist] }) },
                { scale: p.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1.4, 0.4] }) },
              ],
              opacity: p.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 0.8, 0] }),
            }]}>
              <Ionicons
                name={i % 2 === 0 ? 'heart' : 'star'}
                size={i % 3 === 0 ? 20 : 12}
                color={i % 2 === 0 ? colors.rose : '#F59E0B'}
              />
            </Animated.View>
          );
        })}
        <Animated.View style={{ transform: [{ scale: doneScale }], opacity: doneFade }}>
          <Ionicons name="heart-circle" size={100} color={colors.rose} />
        </Animated.View>
        <Animated.View style={[styles.doneTextWrap, { opacity: doneFade }]}>
          <Text style={styles.doneTitle}>You're all set, {name}!</Text>
          <Text style={styles.doneSub}>{roleMessage}</Text>
        </Animated.View>
      </View>
    );
  }

  function renderStepContent() {
    switch (step) {
      case 0: return renderWelcome();
      case 1: return renderNameAge();
      case 2: return renderRole();
      case 3: return renderInterests();
      case 4: return renderPrompts();
      case 5: return renderLookingFor();
      case 6: return renderDone();
      default: return null;
    }
  }

  const progress  = (step > 0 && step < 6) ? step / totalSteps : null;
  const showBack  = step > 0 && step < 6;
  const isDone    = step === 6;
  const nextLabel = step === 0 ? 'Get Started' : 'Continue';

  return (
    <SafeAreaView style={styles.container}>
      {progress !== null && (
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(Math.round(progress * 100), 100)}%` as any }]} />
          </View>
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, step === 0 && styles.welcomeScroll, step === 6 && styles.welcomeScroll]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: stepFade, transform: [{ translateX: stepSlide }] }}>
            {renderStepContent()}
          </Animated.View>
        </ScrollView>

        <View style={styles.bottomBar}>
          {showBack && (
            <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.75}>
              <Ionicons name="arrow-back" size={18} color={colors.muted} />
            </TouchableOpacity>
          )}
          {!isDone && (
            <TouchableOpacity
              style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled, showBack && styles.nextBtnFlex]}
              onPress={handleNext}
              disabled={!canNext()}
              activeOpacity={0.85}
            >
              <Text style={[styles.nextBtnText, !canNext() && styles.nextBtnTextDisabled]}>{nextLabel}</Text>
              {step > 0 && (
                <Ionicons name="arrow-forward" size={16} color={canNext() ? '#fff' : colors.mutedLight} />
              )}
            </TouchableOpacity>
          )}
          {isDone && (
            <TouchableOpacity style={styles.enterBtn} onPress={handleEnter} activeOpacity={0.85}>
              <Ionicons name="heart" size={16} color="#fff" />
              <Text style={styles.enterBtnText}>Enter Aphrodite</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  progressWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.rose,
    borderRadius: radius.full,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  welcomeScroll: {
    justifyContent: 'center',
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  logoWrap: { marginBottom: spacing.md },
  welcomeTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -1,
  },
  welcomeTagline: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.rose,
    fontFamily: font ?? undefined,
    letterSpacing: -0.3,
  },
  welcomeSub: {
    fontSize: 15,
    color: colors.muted,
    fontFamily: font ?? undefined,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  stepContent: {
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.5,
  },
  stepSub: {
    fontSize: 14,
    color: colors.muted,
    fontFamily: font ?? undefined,
    marginTop: -spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surfaceEl,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  errorText: {
    fontSize: 12,
    color: colors.rose,
    fontFamily: font ?? undefined,
    marginTop: -spacing.sm,
  },
  roleOptions: { gap: spacing.sm },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
  },
  roleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextWrap: { flex: 1 },
  roleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.dark,
    fontFamily: font ?? undefined,
  },
  roleDesc: {
    fontSize: 13,
    color: colors.muted,
    fontFamily: font ?? undefined,
    marginTop: 2,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  interestLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
    fontFamily: font ?? undefined,
    textAlign: 'center',
  },
  selectionHint: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    fontFamily: font ?? undefined,
  },
  promptList: { gap: spacing.sm },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  promptCardSelected: {
    borderColor: colors.violetBright + '60',
    backgroundColor: colors.violetSoft,
  },
  promptCardDisabled: { opacity: 0.4 },
  promptQ: {
    fontSize: 14,
    color: colors.text,
    fontFamily: font ?? undefined,
    flex: 1,
  },
  promptInput: {
    backgroundColor: colors.surfaceEl,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderMid,
    padding: spacing.md,
    fontSize: 14,
    color: colors.dark,
    fontFamily: font ?? undefined,
    minHeight: 80,
    marginTop: spacing.xs,
  },
  lookingForOptions: { gap: spacing.sm },
  lfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    paddingHorizontal: 18,
  },
  lfCardSelected: {
    borderColor: colors.rose + '60',
    backgroundColor: colors.roseSoft,
  },
  lfLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: font ?? undefined,
  },
  lfLabelSelected: {
    color: colors.rose,
    fontWeight: '700',
  },
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.lg,
  },
  doneParticle: { position: 'absolute' },
  doneTextWrap: { alignItems: 'center', gap: spacing.sm },
  doneTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    fontFamily: font ?? undefined,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  doneSub: {
    fontSize: 15,
    color: colors.muted,
    fontFamily: font ?? undefined,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  backBtn: {
    width: 50,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceEl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.rose,
    borderRadius: radius.full,
    paddingVertical: 15,
    ...shadow.button,
  },
  nextBtnFlex: { flex: 1 },
  nextBtnDisabled: {
    backgroundColor: colors.surfaceEl,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
  nextBtnTextDisabled: { color: colors.mutedLight },
  enterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.rose,
    borderRadius: radius.full,
    paddingVertical: 15,
    ...shadow.button,
  },
  enterBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    fontFamily: font ?? undefined,
  },
});
