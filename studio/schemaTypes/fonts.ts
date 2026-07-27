/**
 * The curated font menu (Design Decision 3, July 26 notes). Keep in
 * sync with FONTS in ../../src/lib/fonts.ts (site side renders and
 * loads these). The full menu exists only in the Studio; the live
 * site loads only fonts actually used in published content.
 */
export const FONT_OPTIONS = [
  {title: 'Site theme font (your current website-wide font)', value: 'theme'},
  {title: 'EB Garamond (elegant serif — site default)', value: 'eb-garamond'},
  {title: 'League Spartan (clean sans — site UI font)', value: 'league-spartan'},
  {title: 'Playfair Display (dramatic serif)', value: 'playfair-display'},
  {title: 'Cormorant Garamond (fine serif)', value: 'cormorant-garamond'},
  {title: 'Lora (soft serif)', value: 'lora'},
  {title: 'Montserrat (modern sans)', value: 'montserrat'},
  {title: 'Caveat (handwritten accent)', value: 'caveat'},
  {title: 'Noto Serif SC (中文 简体)', value: 'noto-serif-sc'},
  {title: 'Noto Serif TC (中文 繁體)', value: 'noto-serif-tc'},
  {title: 'Noto Serif JP (日本語)', value: 'noto-serif-jp'},
  {title: 'Noto Sans KR (한국어)', value: 'noto-sans-kr'},
]

// Options for the site-wide theme picker (no "theme" self-reference).
export const THEME_FONT_OPTIONS = FONT_OPTIONS.filter((f) => f.value !== 'theme')

export const COLOR_OPTIONS = [
  {title: 'Black (site default)', value: 'base'},
  {title: 'Soft grey', value: 'muted'},
  {title: 'Accent blue', value: 'primary'},
]
