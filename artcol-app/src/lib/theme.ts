/**
 * ARTCOL Design System — tokens centralisés
 * Palette signature de Tarek / DJ Tarkus
 * Adapté pour React Native (pas de classes Tailwind, valeurs brutes)
 */

export const colors = {
  // Backgrounds — du plus profond au plus surélevé
  bgDeep: '#080b10',
  bgElevated: '#0f131a',
  bgSurface: '#161c26',
  bgOverlay: '#1f2733',

  // Accents signature — avec parcimonie
  neonLime: '#c8f53a',     // CTA primaire, focus, highlights
  neonViolet: '#7b61ff',   // accents secondaires, badges info
  neonCyan: '#5fd4f5',     // liens, états info

  // Texte — hiérarchie claire
  textPrimary: '#e8eef7',
  textSecondary: '#8a96ad',
  textMuted: '#4a5468',

  // Sémantique sobre
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',

  // Borders (RGBA car semi-transparents)
  borderSubtle: 'rgba(200, 245, 58, 0.08)',
  borderDefault: 'rgba(232, 238, 247, 0.10)',
  borderStrong: 'rgba(200, 245, 58, 0.25)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const radius = {
  sm: 6,
  md: 8,    // boutons
  lg: 12,   // cards
  xl: 16,   // panels héros
  '2xl': 20,
  full: 9999,
} as const;

export const fonts = {
  display: 'SpaceGrotesk_600SemiBold',
  displayBold: 'SpaceGrotesk_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

// Ombres adaptées RN (iOS = shadow*, Android = elevation)
export const shadows = {
  glowSm: {
    shadowColor: colors.neonLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  glowMd: {
    shadowColor: colors.neonLime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  panel: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 12,
  },
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  fonts,
  fontSize,
  shadows,
};

export type Theme = typeof theme;
