// The curated font catalog (Design Decision 3, July 26 notes). Keep
// in sync with studio/schemaTypes/fonts.ts. The site loads ONLY
// fonts actually used in published content (plus the base three in
// vars.css); Google Fonts serves script-subsetted slices, so even
// CJK families cost visitors a few dozen KB per page at most.

export interface FontDef {
  /** CSS font-family stack for inline styles. */
  stack: string;
  /** Google Fonts css2 family parameter (name:weights). */
  google: string;
}

export const FONTS: Record<string, FontDef> = {
  'eb-garamond': {
    stack: "'EB Garamond', 'Noto Serif SC', Georgia, serif",
    google: 'EB+Garamond:ital,wght@0,400..800;1,400..800',
  },
  'league-spartan': {
    stack: "'League Spartan', 'Trebuchet MS', Arial, sans-serif",
    google: 'League+Spartan:wght@300..700',
  },
  'playfair-display': {
    stack: "'Playfair Display', 'Noto Serif SC', Georgia, serif",
    google: 'Playfair+Display:ital,wght@0,400..800;1,400..800',
  },
  'cormorant-garamond': {
    stack: "'Cormorant Garamond', 'Noto Serif SC', Georgia, serif",
    google: 'Cormorant+Garamond:ital,wght@0,400..700;1,400..700',
  },
  lora: {
    stack: "'Lora', 'Noto Serif SC', Georgia, serif",
    google: 'Lora:ital,wght@0,400..700;1,400..700',
  },
  montserrat: {
    stack: "'Montserrat', 'Noto Sans SC', Arial, sans-serif",
    google: 'Montserrat:ital,wght@0,300..700;1,300..700',
  },
  caveat: {
    stack: "'Caveat', cursive",
    google: 'Caveat:wght@400..700',
  },
  'noto-serif-sc': {
    stack: "'Noto Serif SC', serif",
    google: 'Noto+Serif+SC:wght@400..700',
  },
  'noto-serif-tc': {
    stack: "'Noto Serif TC', serif",
    google: 'Noto+Serif+TC:wght@400..700',
  },
  'noto-serif-jp': {
    stack: "'Noto Serif JP', serif",
    google: 'Noto+Serif+JP:wght@400..700',
  },
  'noto-sans-kr': {
    stack: "'Noto Sans KR', sans-serif",
    google: 'Noto+Sans+KR:wght@400..700',
  },
};

// Always shipped on every page (loaded async from Layout.astro) —
// never needs the dynamic loader. Weights trimmed to what the CSS
// actually uses; italics beyond 400 dropped (one italic usage
// site-wide, and browsers synthesize a fallback if ever needed).
export const BASE_FONTS = new Set(['eb-garamond', 'league-spartan', 'noto-serif-sc']);

// Formerly a render-blocking @import at the top of vars.css — that
// pattern serializes CSS -> fonts-CSS -> font files and cost ~1.85s
// of first paint on mobile (Aug 5 Lighthouse round). Loaded async
// with preconnect hints in Layout.astro instead.
export const BASE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=League+Spartan:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;700&display=swap';

export const TEXT_COLORS: Record<string, string> = {
  base: 'var(--color-base)',
  muted: 'color-mix(in srgb, var(--color-base), transparent 45%)',
  primary: 'var(--color-primary)',
};

/** Google Fonts css2 URL for a set of font keys (empty → null). */
export function googleFontsUrl(keys: string[]): string | null {
  const families = keys
    .filter((key) => FONTS[key] && !BASE_FONTS.has(key))
    .map((key) => `family=${FONTS[key].google}`);
  if (families.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}
