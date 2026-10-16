/**
 * SlabVault design tokens — the single source of truth for the app's look.
 * Dark, premium, collector-grade: near-black surfaces, gold accent,
 * high-contrast gain/loss colors, and touch targets sized for thumbs.
 */

export const colors = {
  // Surfaces
  background: '#0E0F13', // near-black app background
  surface: '#171A21', // cards / panels
  surfaceElevated: '#1F232E', // pressed / raised elements
  border: '#2A2F3B', // hairlines and dividers
  overlay: 'rgba(0,0,0,0.6)',

  // Brand
  accent: '#E8B64C', // gold — primary actions, highlights
  accentDim: 'rgba(232,182,76,0.14)',
  accentText: '#141005', // text on top of gold buttons

  // Text (all pairings meet WCAG AA on the dark surfaces)
  textPrimary: '#F5F3EC',
  textSecondary: '#B9BEC9',
  textMuted: '#7E8594',

  // Gain / loss — tuned for contrast on dark backgrounds
  gain: '#4ADE80',
  gainDim: 'rgba(74,222,128,0.12)',
  loss: '#F87171',
  lossDim: 'rgba(248,113,113,0.12)',

  // Grading company chips
  psa: '#C8102E',
  bgs: '#1B4F9C',
  sgc: '#0E7C5B',
  cgc: '#6D28D9',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  // Sizes are in logical pixels; line heights keep text breathable.
  display: { fontSize: 32, fontWeight: '800' as const, lineHeight: 38 },
  title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30 },
  heading: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  subheading: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  micro: { fontSize: 11, fontWeight: '500' as const, lineHeight: 15 },
  mono: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22, fontVariant: ['tabular-nums'] as const },
} as const;

/** Minimum touch target — every tappable element must be at least this tall. */
export const minTouchTarget = 48;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
} as const;
