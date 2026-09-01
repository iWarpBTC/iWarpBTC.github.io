#!/usr/bin/env node
// Structural comparison of the pre-migration index.html against the built page.
//
// A text diff is not enough: the migration moved 49 entries through a parser, a
// YAML round-trip and a template. This asserts anchors, ids, classes, DOM shape,
// links, assets, entity preservation and text — anything that changed silently
// shows up here.
//
//   node tools/verify-migration.mjs [--ref html]

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import {
  parseDoc, elements, attr, classes, hasClass, childElements, normalizedText,
} from './lib/html.mjs';

const SITE = 'https://btc-slovnik.cz';
const OUT = '_site';
const refArg = process.argv.indexOf('--ref');
const REF = refArg !== -1 ? process.argv[refArg + 1] : 'html';

const failures = [];
const notes = [];
const fail = (msg) => failures.push(msg);

function loadBaseline() {
  return execFileSync('git', ['show', `${REF}:index.html`], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 32,
  });
}

function entriesOf(src) {
  const doc = parseDoc(src);
  const all = elements(doc).filter(
    (n) => n.tagName === 'div' || n.tagName === 'article',
  );
  return all.filter((n) => hasClass(n, 'entry') || hasClass(n, 'entryln'));
}

/** Concatenated verbatim source of every entry — the region the entity check covers. */
function entriesSource(src, entries) {
  return entries
    .map((e) => src.slice(e.sourceCodeLocation.startOffset, e.sourceCodeLocation.endOffset))
    .join('\n');
}

function metaContent(src, name) {
  const doc = parseDoc(src);
  const el = elements(doc).find(
    (n) =>
      n.tagName === 'meta' &&
      (attr(n, 'name') === name || attr(n, 'property') === name),
  );
  // parse5 decodes attribute entities, so this compares rendered text.
  return el ? attr(el, 'content').replace(/\s+/g, ' ').trim() : null;
}

function partsOf(entry) {
  const kids = childElements(entry);
  const heading = kids.find((k) => k.tagName === 'h2' && attr(k, 'id'));
  const alias = kids.find((k) => hasClass(k, 'short'));
  const anaLinks = kids.filter((k) => hasClass(k, 'ana-link'));
  const copy = kids.find((k) => hasClass(k, 'copylink'));
  // The built page wraps the body in .entry__body; the baseline has it inline.
  const bodyWrapper = kids.find((k) => hasClass(k, 'entry__body'));
  const bodyRoots = bodyWrapper
    ? [bodyWrapper]
    : kids.filter((k) => ![heading, alias, copy, ...anaLinks].includes(k));
  return { heading, alias, anaLinks, copy, bodyRoots, bodyWrapper };
}

/** Tag sequence of the body, wrapper excluded, so the two shapes are comparable. */
function bodyShape(parts) {
  const roots = parts.bodyWrapper ? childElements(parts.bodyWrapper) : parts.bodyRoots;
  const seq = [];
  const counts = {};
  for (const root of roots) {
    (function rec(node, depth) {
      const cls = classes(node);
      seq.push(`${'  '.repeat(depth)}${node.tagName}${cls.length ? '.' + cls.join('.') : ''}`);
      counts[node.tagName] = (counts[node.tagName] || 0) + 1;
      for (const child of childElements(node)) rec(child, depth + 1);
    })(root, 0);
  }
  return { seq, counts };
}

function idsIn(parts) {
  const roots = parts.bodyWrapper ? [parts.bodyWrapper] : parts.bodyRoots;
  const out = [];
  for (const root of roots) {
    for (const el of elements(root)) {
      const id = attr(el, 'id');
      if (id) out.push(id);
    }
  }
  return out.sort();
}

/** Normalise a baseline href to the relative form the migration produces. */
const relativize = (href) =>
  (href || '').split(`${SITE}/#`).join('#').split(`${SITE}/`).join('/');

function hrefsIn(parts, includeAna) {
  const roots = parts.bodyWrapper ? [parts.bodyWrapper] : parts.bodyRoots;
  const scope = includeAna ? [...roots, ...parts.anaLinks] : roots;
  const out = [];
  for (const root of scope) {
    for (const el of elements(root)) {
      if (el.tagName === 'a' && attr(el, 'href')) out.push(relativize(attr(el, 'href')));
    }
  }
  return out.sort();
}

function srcsIn(parts) {
  const roots = parts.bodyWrapper ? [parts.bodyWrapper] : parts.bodyRoots;
  const out = [];
  for (const root of roots) {
    for (const el of elements(root)) {
      if (el.tagName === 'img' && attr(el, 'src')) out.push(relativize(attr(el, 'src')));
    }
  }
  return out.sort();
}

function bodyText(parts) {
  const roots = parts.bodyWrapper ? [parts.bodyWrapper] : parts.bodyRoots;
  return roots.map(normalizedText).join(' ').replace(/\s+/g, ' ').trim();
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------------------------------------------------------------------------

const baselineSrc = loadBaseline();
if (!existsSync(join(OUT, 'index.html'))) {
  console.error(`missing ${OUT}/index.html — run "npm run build" first`);
  process.exit(1);
}
const builtSrc = readFileSync(join(OUT, 'index.html'), 'utf8');

const base = entriesOf(baselineSrc);
const built = entriesOf(builtSrc);

if (base.length !== built.length) {
  fail(`entry count: baseline ${base.length}, built ${built.length}`);
}

const baseById = new Map();
for (const entry of base) {
  const id = attr(partsOf(entry).heading, 'id');
  baseById.set(id, entry);
}
const builtById = new Map();
for (const entry of built) {
  const id = attr(partsOf(entry).heading, 'id');
  builtById.set(id, entry);
}

// 1. Anchors: present, unrenamed, same order.
const baseOrder = [...baseById.keys()];
const builtOrder = [...builtById.keys()];
for (const id of baseOrder) {
  if (!builtById.has(id)) fail(`anchor #${id} is missing from the built page`);
}
for (const id of builtOrder) {
  if (!baseById.has(id)) fail(`anchor #${id} appeared out of nowhere`);
}
if (!same(baseOrder, builtOrder)) {
  fail('entry order changed');
  const first = baseOrder.findIndex((id, i) => builtOrder[i] !== id);
  notes.push(`  first divergence at position ${first + 1}: ${baseOrder[first]} vs ${builtOrder[first]}`);
}

// 2. Per-entry structure.
for (const id of baseOrder) {
  if (!builtById.has(id)) continue;
  const a = partsOf(baseById.get(id));
  const b = partsOf(builtById.get(id));
  const where = `#${id}`;

  const aClass = hasClass(baseById.get(id), 'entryln') ? 'entryln' : 'entry';
  const bClass = hasClass(builtById.get(id), 'entryln') ? 'entryln' : 'entry';
  if (aClass !== bClass) fail(`${where}: entry class ${aClass} -> ${bClass}`);

  if (attr(baseById.get(id), 'id') !== attr(builtById.get(id), 'id')) {
    fail(`${where}: wrapper id ${attr(baseById.get(id), 'id')} -> ${attr(builtById.get(id), 'id')}`);
  }

  if (normalizedText(a.heading) !== normalizedText(b.heading)) {
    fail(`${where}: term text "${normalizedText(a.heading)}" -> "${normalizedText(b.heading)}"`);
  }

  const aliasA = a.alias ? normalizedText(a.alias) : null;
  const aliasB = b.alias ? normalizedText(b.alias) : null;
  if (aliasA !== aliasB) fail(`${where}: alias "${aliasA}" -> "${aliasB}"`);

  if (!b.copy) fail(`${where}: copylink button missing`);

  const shapeA = bodyShape(a);
  const shapeB = bodyShape(b);
  if (!same(shapeA.seq, shapeB.seq)) {
    fail(`${where}: body DOM shape changed`);
    const i = shapeA.seq.findIndex((s, n) => shapeB.seq[n] !== s);
    notes.push(`  ${where} first diff: "${shapeA.seq[i]}" vs "${shapeB.seq[i] ?? '(missing)'}"`);
  }
  for (const tag of ['table', 'tr', 'td', 'th', 'figure', 'figcaption', 'img', 'svg', 'a', 'p', 'h3']) {
    if ((shapeA.counts[tag] || 0) !== (shapeB.counts[tag] || 0)) {
      fail(`${where}: <${tag}> count ${shapeA.counts[tag] || 0} -> ${shapeB.counts[tag] || 0}`);
    }
  }

  if (!same(idsIn(a), idsIn(b))) {
    fail(`${where}: in-body ids changed: ${idsIn(a).join(',')} -> ${idsIn(b).join(',')}`);
  }

  if (!same(hrefsIn(a, false), hrefsIn(b, false))) {
    fail(`${where}: body links changed`);
    notes.push(`  ${where} baseline: ${hrefsIn(a, false).join(' ')}`);
    notes.push(`  ${where} built:    ${hrefsIn(b, false).join(' ')}`);
  }

  if (!same(hrefsIn(a, true), hrefsIn(b, true))) {
    fail(`${where}: link set including ana-link footer changed`);
  }

  if (!same(srcsIn(a), srcsIn(b))) {
    fail(`${where}: image sources changed: ${srcsIn(a).join(',')} -> ${srcsIn(b).join(',')}`);
  }

  if (bodyText(a) !== bodyText(b)) {
    fail(`${where}: body text changed`);
    const ta = bodyText(a);
    const tb = bodyText(b);
    let i = 0;
    while (i < ta.length && ta[i] === tb[i]) i++;
    notes.push(`  ${where} diverges at char ${i}: "…${ta.slice(Math.max(0, i - 40), i + 40)}" vs "…${tb.slice(Math.max(0, i - 40), i + 40)}"`);
  }
}

// 3. Entity preservation inside the entries. The text comparison above cannot see
//    these — &nbsp; and U+00A0 decode identically — and the head is excluded on
//    purpose: meta descriptions now carry literal typographic characters, which
//    render the same but are not entities.
const baseEntries = entriesSource(baselineSrc, base);
const builtEntries = entriesSource(builtSrc, built);
const entityChecks = ['&nbsp;', '&equals;', '&bdquo;', '&ldquo;', '&hyphen;', '&ndash;', '&hellip;', '&semi;', '&amp;'];
for (const entity of entityChecks) {
  const pattern = new RegExp(entity.replace('&', '&'), 'g');
  const inBase = (baseEntries.match(pattern) || []).length;
  const inBuilt = (builtEntries.match(pattern) || []).length;
  if (inBase !== inBuilt) {
    fail(`entity ${entity} in entries: ${inBase} in baseline, ${inBuilt} in build`);
  }
}

// 3b. Head metadata still says the same thing once entities are decoded.
for (const name of ['description', 'keywords']) {
  const a = metaContent(baselineSrc, name);
  const b = metaContent(builtSrc, name);
  if (a !== b) {
    fail(`<meta ${name}> text changed:\n      baseline: ${a}\n      built:    ${b}`);
  }
}

// 4. Every internal fragment resolves to an anchor that exists.
const builtDoc = parseDoc(builtSrc);
const allIds = new Set(elements(builtDoc).map((n) => attr(n, 'id')).filter(Boolean));
for (const el of elements(builtDoc)) {
  const href = attr(el, 'href');
  if (el.tagName === 'a' && href && href.startsWith('#') && href.length > 1) {
    if (!allIds.has(decodeURIComponent(href.slice(1)))) fail(`dangling internal link ${href}`);
  }
}

// 5. Every referenced local asset exists in the build.
for (const el of elements(builtDoc)) {
  for (const name of ['src', 'href']) {
    const value = attr(el, name);
    if (!value || !value.startsWith('/') || value.startsWith('//')) continue;
    const path = join(OUT, decodeURIComponent(value.split('#')[0].split('?')[0]));
    if (!existsSync(path)) fail(`missing asset in build: ${value}`);
  }
}

// 6. No stray per-term pages, and the scripts the anatomy pages need are present.
for (const required of [
  'CNAME', 'functions.js', 'drop.js', 'js/glossary.js', 'js/theme.js',
  'pages/javascript.js', 'css/styles.css', 'css/tooltip.css', 'sitemap.xml', 'robots.txt',
]) {
  if (!existsSync(join(OUT, required))) fail(`build is missing ${required}`);
}
if (existsSync(join(OUT, 'content'))) fail('build emitted _site/content — permalink:false is not applied');

// ---------------------------------------------------------------------------

console.log(`baseline: git ${REF}:index.html (${base.length} entries)`);
console.log(`built:    ${OUT}/index.html (${built.length} entries)`);
if (failures.length === 0) {
  console.log('\n✓ migration verified — anchors, structure, links, assets and text all match');
  process.exit(0);
}
console.log(`\n✗ ${failures.length} problem(s):\n`);
for (const f of failures) console.log(`  - ${f}`);
if (notes.length) {
  console.log('\ndetail:');
  for (const n of notes) console.log(n);
}
process.exit(1);
