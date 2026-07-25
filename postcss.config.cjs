module.exports = {
  plugins: [
    require('postcss-easy-import')(),
    // postcss-custom-properties ({preserve: false}) and
    // postcss-color-function used to COMPILE the CSS variables into
    // literal colors at build time — which froze most of the site to
    // its light-mode values and broke the dark theme (dark background
    // with black text). Variables now reach the browser untouched; the
    // old color(var(--x) l(±n%)) adjustments were rewritten as native
    // color-mix(), so every color responds to [data-theme="dark"].
    require('autoprefixer')(),
  ],
}
