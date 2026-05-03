import { Platform } from 'react-native';

export const colors = {
  // Base — deep violet-black
  bg:          '#07051A',
  surface:     'rgba(255,255,255,0.055)',
  surfaceEl:   'rgba(255,255,255,0.10)',

  // Glass layers
  glass:       'rgba(255,255,255,0.04)',
  glassMid:    'rgba(255,255,255,0.08)',
  glassHi:     'rgba(255,255,255,0.15)',

  // Violet — brand / AI
  violet:      '#8B5CF6',
  violetBright:'#B49BFF',
  violetGlow:  'rgba(139,92,246,0.28)',
  violetSoft:  'rgba(139,92,246,0.12)',
  violetLight: 'rgba(139,92,246,0.20)',
  violetDark:  '#6D28D9',
  violetMid:   '#A78BFA',

  // Rose — primary CTA
  rose:        '#FF2D55',
  roseBright:  '#FF4D6A',
  roseGlow:    'rgba(255,45,85,0.35)',
  roseSoft:    'rgba(255,45,85,0.12)',

  // Text
  dark:        '#FFFFFF',
  text:        'rgba(255,255,255,0.90)',
  muted:       'rgba(255,255,255,0.50)',
  mutedLight:  'rgba(255,255,255,0.22)',

  // Borders — luminous frosted
  border:      'rgba(255,255,255,0.10)',
  borderMid:   'rgba(255,255,255,0.18)',
  borderHi:    'rgba(255,255,255,0.32)',

  // Glow ambient
  ambientViolet: 'rgba(109,40,217,0.22)',
  ambientRose:   'rgba(255,45,85,0.16)',

  success:     '#34D399',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  xs:   6,
  sm:   10,
  md:   16,
  lg:   20,
  xl:   28,
  full: 999,
};

export const shadow = {
  card: {
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
  button: {
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 12,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 14,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 12,
  },
  violet: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.50,
    shadowRadius: 20,
    elevation: 10,
  },
  glow: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 28,
    elevation: 14,
  },
  glowRose: {
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.60,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const font = Platform.select({
  web:     'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: undefined,
});

// Utility: apply web-only styles (backdrop-filter etc)
export const webStyle = (style: Record<string, unknown>) =>
  Platform.OS === 'web' ? (style as any) : {};
