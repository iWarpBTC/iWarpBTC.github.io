// Turn a draw.io SVG export into an inline, theme-aware <svg>.
//
// Diagrams loaded through <img> are isolated documents that page CSS cannot reach,
// which is why they needed a light plate to stay readable on a dark page. Inlined,
// they can resolve CSS custom properties and follow the site's theme toggle.
//
// Transformations are string-level on purpose. These files are machine-generated
// with a known shape, and a parse5 round-trip risks rewriting camelCase SVG
// attributes (viewBox, requiredFeatures, xlink:href) that must survive intact.

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

/**
 * draw.io writes colour in exactly two shapes, and in two different places:
 * presentation attributes on SVG elements (fill/stroke) and inline CSS on the HTML
 * inside <foreignObject>. The <switch> blocks are not dead fallbacks — they hold
 * the real labels, with <text> siblings as the backup — so both branches must be
 * mapped or half the labels stay black.
 */
const PALETTE = [
  [/#000000\b/gi, 'var(--dg-ink, #000000)'],
  [/rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/gi, 'var(--dg-ink, #000000)'],
  [/#ffffff\b/gi, 'var(--dg-paper, #ffffff)'],
  [/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/gi, 'var(--dg-paper, #ffffff)'],
  [/#cc0000\b/gi, 'var(--dg-alert, #cc0000)'],
  [/#4d4d4d\b/gi, 'var(--dg-muted, #4d4d4d)'],
];

/** Apply the palette inside attribute values only, never to text content. */
function mapPalette(svg) {
  return svg.replace(/([A-Za-z_:][\w:.-]*)="([^"]*)"/g, (whole, name, value) => {
    if (name === 'id' || name === 'd' || name === 'points') return whole;
    let next = value;
    for (const [pattern, replacement] of PALETTE) next = next.replace(pattern, replacement);
    return next === value ? whole : `${name}="${next}"`;
  });
}

/**
 * Prefix every id with the file stem. `id="cwos"` occurs a dozen times across the
 * set and lightning.html inlines seven diagrams into one document, so raw ids
 * would collide. References are rewritten to match.
 */
function namespaceIds(svg, prefix) {
  const ids = new Set();
  for (const match of svg.matchAll(/\sid="([^"]+)"/g)) ids.add(match[1]);
  if (!ids.size) return svg;

  let out = svg;
  for (const id of ids) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const scoped = `${prefix}__${id}`;
    out = out
      .replace(new RegExp(`(\\sid=")${escaped}(")`, 'g'), `$1${scoped}$2`)
      .replace(new RegExp(`url\\(#${escaped}\\)`, 'g'), `url(#${scoped})`)
      .replace(new RegExp(`((?:xlink:)?href=")#${escaped}(")`, 'g'), `$1#${scoped}$2`);
  }
  return out;
}

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * @param {string} file  path to the .svg on disk
 * @param {object} opts  { src, alt, className }
 * @returns {string} inline <svg> markup
 */
export function inlineSvg(file, { src, alt = '', className = 'diagram' } = {}) {
  let svg = readFileSync(file, 'utf8');

  // Drop the XML prolog and any doctype — invalid inside an HTML document.
  svg = svg.replace(/^\s*<\?xml[^>]*\?>\s*/i, '').replace(/^\s*<!DOCTYPE[^>]*>\s*/i, '');

  const prefix = basename(file, '.svg').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  svg = namespaceIds(mapPalette(svg), prefix);

  const openMatch = svg.match(/<svg\b[^>]*>/i);
  if (!openMatch) throw new Error(`${file}: no <svg> root element`);
  const open = openMatch[0];

  const attrOf = (name) => {
    const m = open.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
    return m ? m[1] : null;
  };
  const viewBox = attrOf('viewBox');
  if (!viewBox) throw new Error(`${file}: no viewBox — cannot size it responsively`);

  // The fixed width/height are what made adresa.svg render at its intrinsic 761px
  // in a 728px column. Dropping them hands sizing to CSS; viewBox keeps the ratio.
  const [, , vbWidth, vbHeight] = viewBox.trim().split(/[\s,]+/).map(Number);

  const keep = ['xmlns', 'xmlns:xlink', 'viewBox', 'preserveAspectRatio'];
  const kept = keep
    .map((name) => (attrOf(name) ? ` ${name}="${attrOf(name)}"` : ''))
    .join('');

  const label = alt.trim();
  const attrs = [
    kept.trim(),
    `class="${className}"`,
    // Lets tools/verify-migration.mjs map an inlined diagram back to the <img> it
    // replaced, and keeps the origin traceable after a re-export.
    `data-diagram-src="${escapeAttr(src)}"`,
    // --dg-natural is the width the diagram was authored at: CSS uses it to avoid
    // upscaling past it, and the lightbox uses it as the zoomed-in size.
    Number.isFinite(vbWidth) && Number.isFinite(vbHeight)
      ? `style="aspect-ratio: ${vbWidth} / ${vbHeight}; --dg-natural: ${Math.round(vbWidth)}px"`
      : '',
    label ? `role="img" aria-label="${escapeAttr(label)}"` : 'role="presentation"',
  ]
    .filter(Boolean)
    .join(' ');

  return svg.replace(open, `<svg ${attrs}>`);
}

export { mapPalette, namespaceIds };
