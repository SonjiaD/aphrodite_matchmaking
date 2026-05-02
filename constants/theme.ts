import { Platform } from 'react-native';

export const colors = {
  // Backgrounds
  bg:          '#0D0D1A',
  surface:     '#161628',
  surfaceEl:   '#1E1E38',
  glass:       'rgba(255,255,255,0.07)',
  glassHi:     'rgba(255,255,255,0.13)',

  // Violet — AI features only
  violet:      '#8B5CF6',
  violetBright:'#A78BFA',
  violetGlow:  'rgba(139,92,246,0.22)',
  violetSoft:  'rgba(139,92,246,0.10)',
  violetLight: 'rgba(139,92,246,0.18)',
  violetDark:  '#6D28D9',
  violetMid:   '#A78BFA',

  // Rose — primary CTA (Hinge-inspired)
  rose:        '#FF2D55',
  roseBright:  '#FF4D6A',
  roseGlow:    'rgba(255,45,85,0.25)',
  roseSoft:    'rgba(255,45,85,0.12)',

  // Text
  dark:        '#FFFFFF',
  text:        'rgba(255,255,255,0.88)',
  muted:       'rgba(255,255,255,0.52)',
  mutedLight:  'rgba(255,255,255,0.24)',

  // Borders
  border:      'rgba(255,255,255,0.10)',
  borderMid:   'rgba(255,255,255,0.18)',
  borderHi:    'rgba(255,255,255,0.30)',

  // States
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 6,
  },
  button: {
    shadowColor: '#FF2D55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const font = Platform.select({
  web:     'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: undefined,
});
