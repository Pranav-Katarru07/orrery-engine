// Global chrome stays grayscale; selecting a body re-skins the accent
// variables to its signature color. `glow` is the literal hue (scene ring,
// gradients); `ui` is the contrast-boosted variant used for text/controls.

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function setAccent(accent) {
  const root = document.documentElement.style;
  if (!accent) {
    root.setProperty('--accent', '#ffffff');
    root.setProperty('--accent-glow', '#ffffff');
    root.setProperty('--accent-soft', 'rgba(255,255,255,0.1)');
    root.setProperty('--accent-line', 'rgba(255,255,255,0.35)');
    return;
  }
  const [r, g, b] = hexToRgb(accent.ui);
  const [gr, gg, gb] = hexToRgb(accent.glow);
  root.setProperty('--accent', accent.ui);
  root.setProperty('--accent-glow', accent.glow);
  root.setProperty('--accent-soft', `rgba(${r},${g},${b},0.13)`);
  root.setProperty('--accent-line', `rgba(${gr},${gg},${gb},0.5)`);
}
