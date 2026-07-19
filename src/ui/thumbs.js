import { galleryFor } from '../data/gallery.js';

// Single source of truth for a body's thumbnail, shared by the gallery grid,
// the Overview strip, and any tile UI. Fallback chain:
//   1. first curated NASA photo, if the body has gallery imagery
//   2. the equirectangular texture map we already ship
//   3. null → caller renders an accent-coloured sphere placeholder
export function thumbSrc(def) {
  const imgs = galleryFor(def.id);
  if (imgs.length) return imgs[0].file;
  if (def.texture) return `/textures/${def.texture}`;
  return null;
}

// A ready-to-insert tile inner-HTML: <img> when we have a source, otherwise a
// glowing accent orb. `def.accent.glow` drives the placeholder colour.
export function thumbHTML(def, { lazy = true } = {}) {
  const src = thumbSrc(def);
  if (src) {
    return `<img class="thumb-img" src="${src}" alt="${def.name}"${lazy ? ' loading="lazy"' : ''} />`;
  }
  return `<span class="thumb-orb" style="--orb:${def.accent.glow}"></span>`;
}
