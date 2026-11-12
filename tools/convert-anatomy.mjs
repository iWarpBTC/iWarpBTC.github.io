#!/usr/bin/env node
// One-shot migration: pages/<name>.html -> pages/<name>.njk
//
// The eight "anatomy" pages were hand-written HTML served verbatim. This lifts
// their head metadata into frontmatter and moves the body onto the shared layout,
// so they gain navigation, the theme toggle and the diagram transform.
//
// The body is SLICED from the source, never re-serialised: the pages are dense
// with typographic entities and colour-coded hex dumps that a parse5 round-trip
// would quietly rewrite. Run: node tools/convert-anatomy.mjs [--dry]

import { readFileSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { dump } from 'js-yaml';
import { parseDoc, elements, attr, hasClass, innerSource } from './lib/html.mjs';

const SITE = 'https://btc-slovnik.cz';
const DIR = 'pages';
const dry = process.argv.includes('--dry');

/** Same rewrite the term extraction uses: absolute self-links become relative. */
const relativize = (html) =>
  html.split(`${SITE}/#`).join('#').split(`${SITE}/`).join('/');

/** Strip the indentation the body carried inside the original document. */
function dedent(text) {
  const lines = text.split('\n');
  const indents = lines
    .slice(1)
    .filter((l) => l.trim())
    .map((l) => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return [lines[0], ...lines.slice(1).map((l) => l.slice(min))].join('\n').trim();
}

const metaOf = (els, name) => {
  const el = els.find(
    (n) => n.tagName === 'meta' && (attr(n, 'name') === name || attr(n, 'property') === name),
  );
  return el ? attr(el, 'content') : null;
};

const files = readdirSync(DIR).filter((f) => f.endsWith('.html')).sort();
const written = [];

for (const file of files) {
  const path = join(DIR, file);
  const src = readFileSync(path, 'utf8');
  const doc = parseDoc(src);
  const els = elements(doc);

  const titleEl = els.find((n) => n.tagName === 'title');
  const title = titleEl ? innerSource(src, titleEl).trim() : null;
  if (!title) throw new Error(`${path}: no <title>`);

  const container = els.find((n) => hasClass(n, 'container2'));
  if (!container) throw new Error(`${path}: no div.container2`);

  // The page's own "back to the glossary" target — the author's choice of which
  // term this page belongs to. Kept so the breadcrumb can name it.
  const h1Link = els.find(
    (n) => n.tagName === 'a' && (attr(n, 'href') || '').includes(`${SITE}/#`),
  );
  const parentTerm = h1Link ? attr(h1Link, 'href').split('#')[1] : null;

  const usesTooltips = els.some(
    (n) => n.tagName === 'link' && (attr(n, 'href') || '').includes('tooltip.css'),
  );
  const usesHexDump = els.some(
    (n) => n.tagName === 'script' && (attr(n, 'src') || '').includes('pages/javascript.js'),
  );

  const slug = basename(file, '.html');
  const data = {
    layout: 'layouts/anatomy.njk',
    // Exact, non-negotiable: 31 ana-links and the sitemap point here.
    permalink: `/pages/${file}`,
    title,
    description: metaOf(els, 'description'),
    keywords: metaOf(els, 'keywords'),
    lang: 'cs',
    slug,
    ...(parentTerm ? { parentTerm } : {}),
    ...(usesTooltips ? { pageStyles: ['/css/tooltip.css'] } : {}),
    ...(usesHexDump ? { pageScripts: ['/pages/javascript.js'] } : {}),
  };

  const body = dedent(relativize(innerSource(src, container)));
  const out = `---\n${dump(data, { lineWidth: 120, noRefs: true }).trimEnd()}\n---\n\n${body}\n`;

  if (!dry) {
    writeFileSync(join(DIR, `${slug}.njk`), out, 'utf8');
    unlinkSync(path);
  }
  written.push({ slug, title, parentTerm, usesTooltips, usesHexDump, bytes: body.length });
}

console.log(`${dry ? 'would convert' : 'converted'} ${written.length} pages`);
for (const w of written) {
  console.log(
    `  ${w.slug.padEnd(12)} ${String(w.bytes).padStart(6)}B  parent=${w.parentTerm || '-'}` +
      `${w.usesTooltips ? '  +tooltip.css' : ''}${w.usesHexDump ? '  +javascript.js' : ''}`,
  );
}
