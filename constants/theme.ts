import { Platform } from 'react-native';

export const colors = {
  // Backgrounds
  bg:           '#FEFAF8',
  surface:      '#FFFFFF',

  // Violet — primary brand
  violet:       '#7C3AED',
  violetDark:   '#5B21B6',
  violetMid:    '#A855F7',
  violetLight:  '#F3E8FF',
  violetSoft:   '#FAF5FF',

  // Rose — CTA, actions
  rose:         '#F43F5E',
  roseDark:     '#E11D48',
  roseSoft:     '#FFF1F2',

  // Gold — points, rewards
  gold:         '#F59E0B',
  goldSoft:     '#FFFBEB',

  // Text
  dark:         '#0F0A1A',
  text:         '#1C1917',
  muted:        '#78716C',
  mutedLight:   '#D6D3D1',

  // Borders
  border:       '#EDE9FE',
  borderMid:    '#DDD6FE',

  // States
  success:      '#10B981',
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
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  button: {
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  modal: {
    shadowColor: '#0F0A1A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  strong: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const font = Platform.select({
  web:     'Nunito, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: undefined,
});
