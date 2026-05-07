// Single source of truth for the brand palette, typography, and
// rhythm. Keep all values as plain hex/strings so they can be inlined
// directly into JSX style attributes — html2canvas does not consume
// CSS custom properties (var()) reliably from cloned documents,
// which is why pdf-print.css already hard-codes everything.
//
// When the user wants to retune the look, edit this file once and
// the change propagates to every page renderer that imports a token.

export const PALETTE = {
  navy: '#0D1526',
  orange: '#F25D2A',
  cream: '#FAFAF8',
  footerLight: '#F0EEE9',
  midGrey: '#8A8F9A',
  text: '#1A2035',
  white: '#FFFFFF',
  black: '#000000',
  // Faint helpers that frequently appear in inline styles as rgba
  navyAlpha10: 'rgba(13,21,38,0.1)',
  navyAlpha15: 'rgba(13,21,38,0.15)',
  navyAlpha20: 'rgba(13,21,38,0.2)',
  whiteAlpha07: 'rgba(255,255,255,0.07)',
  whiteAlpha10: 'rgba(255,255,255,0.1)',
  whiteAlpha25: 'rgba(255,255,255,0.25)',
  whiteAlpha85: 'rgba(255,255,255,0.85)',
  orangeAlpha15: 'rgba(242,93,42,0.15)',
  orangeAlpha40: 'rgba(242,93,42,0.4)',
} as const;

export const TYPE = {
  family: '"Montserrat", sans-serif',
  // Display sizes used on cover/warranty heroes.
  heroPt: 20,
  // Header bar font size (PdfPageShell).
  sectionBarPt: 7.5,
  // Body copy default — most paragraph text.
  bodyPt: 9,
  // Tight metadata captions, footers, eyebrow tags.
  captionPt: 7,
  // Letter spacing helpers.
  uppercaseTrack: '0.18em',
  bodyTrack: '0.02em',
  tightTrack: '-0.01em',
} as const;

export const RHYTHM = {
  // Page side gutters in mm.
  pageGutterMm: 14,
  // Section bar bottom margin.
  sectionBarSpacingMm: 4,
  // Default vertical step between block elements.
  blockGapMm: 4,
} as const;

export type PaletteKey = keyof typeof PALETTE;
