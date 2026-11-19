#!/usr/bin/env node
// Structural comparison of the pre-migration hand-written HTML against the build.
//
// A text diff is not enough: 49 glossary entries and 8 anatomy pages went through
// a parser, a YAML round-trip, a template, and a transform that replaces diagram
// <img> tags with inline <svg>. This asserts anchors, ids, classes, DOM shape,
// links, assets, entity preservation and text — anything that changed silently
// shows up here.
//
//   node tools/verify-migration.mjs [--ref html]

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import matter from 'gray-matter';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import {
  parseDoc, elements, attr, classes, hasClass, childElements,
} from './lib/html.mjs';

const SITE = 'https://btc-slovnik.cz';
const OUT = '_site';
const refArg = process.argv.indexOf('--ref');
// Immutable pre-migration baseline: remains valid after merging into html.
const REF = refArg !== -1 ? process.argv[refArg + 1] : 'e1274345c1f4bf3ac30c1374c65780530de44281';
const DIAGRAM_ATTR = 'data-diagram-src';

const failures = [];
const notes = [];
const fail = (msg) => failures.push(msg);

function baseline(path) {
  return execFileSync('git', ['show', `${REF}:${path}`], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 32,
  });
}

/** An inlined draw.io diagram stands in for the <img> it replaced. */
const isDiagram = (node) => node.tagName === 'svg' && attr(node, DIAGRAM_ATTR);

/**
 * Links deliberately changed since the baseline. Kept explicit rather than
 * loosening the comparison, so an accidental link change still fails.
 */
const INTENTIONAL_LINK_FIXES = new Map([
  // pages/transaction.html linked pages/crypto#ecdsa — no .html, a live 404.
  ['/pages/crypto#ecdsa', '/pages/crypto.html#ecdsa'],
]);

/** Normalise a baseline href/src to the relative form the migration produces. */
const relativize = (value) => {
  const rel = (value || '').split(`${SITE}/#`).join('#').split(`${SITE}/`).join('/');
  return INTENTIONAL_LINK_FIXES.get(rel) ?? rel;
};

/**
 * Walk content, treating an inlined diagram as an opaque leaf. Everything inside
 * one — its namespaced ids, its drawio help link, its label text — belongs to the
 * image, not to the page, and comparing it against a bare <img> would be noise.
 */
function walkContent(roots, visit) {
  for (const root of roots) {
    (function rec(node, depth) {
      if (isDiagram(node)) {
        visit({ tag: 'img', node, diagram: true }, depth);
        return;
      }
      visit({ tag: node.tagName, node, diagram: false }, depth);
      for (const child of childElements(node)) rec(child, depth + 1);
    })(root, 0);
  }
}

function shapeOf(roots) {
  const seq = [];
  const counts = {};
  walkContent(roots, (item, depth) => {
    const cls = item.diagram ? [] : classes(item.node);
    seq.push(`${'  '.repeat(depth)}${item.tag}${cls.length ? '.' + cls.join('.') : ''}`);
    counts[item.tag] = (counts[item.tag] || 0) + 1;
  });
  return { seq, counts };
}

function idsOf(roots) {
  const out = [];
  walkContent(roots, (item) => {
    if (item.diagram) return;
    const id = attr(item.node, 'id');
    if (id) out.push(id);
  });
  return out.sort();
}

function hrefsOf(roots) {
  const out = [];
  walkContent(roots, (item) => {
    if (item.diagram || item.tag !== 'a') return;
    const href = attr(item.node, 'href');
    if (href) out.push(relativize(href));
  });
  return out.sort();
}

/** Image sources, with an inlined diagram reported under the src it replaced. */
function imagesOf(roots) {
  const out = [];
  walkContent(roots, (item) => {
    if (item.diagram) {
      out.push({
        src: attr(item.node, DIAGRAM_ATTR),
        alt: attr(item.node, 'aria-label') || '',
      });
    } else if (item.tag === 'img') {
      out.push({ src: relativize(attr(item.node, 'src')), alt: attr(item.node, 'alt') || '' });
    }
  });
  return out.sort((a, b) => (a.src < b.src ? -1 : a.src > b.src ? 1 : 0));
}

function textOf(roots) {
  let out = '';
  walkContent(roots, (item) => {
    if (item.diagram) return;
    for (const child of item.node.childNodes || []) {
      if (child.nodeName === '#text') out += child.value + ' ';
    }
  });
  return out.replace(/\s+/g, ' ').trim();
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Source span of a set of nodes, for entity counting. */
const sourceOf = (src, nodes) =>
  nodes
    .map((n) => src.slice(n.sourceCodeLocation.startOffset, n.sourceCodeLocation.endOffset))
    .join('\n');

const ENTITIES = ['&nbsp;', '&equals;', '&bdquo;', '&ldquo;', '&hyphen;', '&ndash;', '&hellip;', '&semi;'];

function compareEntities(label, baseSrc, builtSrc) {
  for (const entity of ENTITIES) {
    const pattern = new RegExp(entity, 'g');
    const a = (baseSrc.match(pattern) || []).length;
    const b = (builtSrc.match(pattern) || []).length;
    if (a !== b) fail(`${label}: entity ${entity} ${a} -> ${b}`);
  }
}

/**
 * Compare two content regions in full: shape, counts, ids, links, images, text.
 * Used for both a glossary entry and an anatomy page body.
 */
function compareRegion(label, aRoots, bRoots) {
  const shapeA = shapeOf(aRoots);
  const shapeB = shapeOf(bRoots);
  if (!same(shapeA.seq, shapeB.seq)) {
    fail(`${label}: DOM shape changed`);
    const i = shapeA.seq.findIndex((line, n) => shapeB.seq[n] !== line);
    notes.push(`  ${label} first diff: "${shapeA.seq[i]}" vs "${shapeB.seq[i] ?? '(missing)'}"`);
  }
  for (const tag of ['table', 'tr', 'td', 'th', 'figure', 'figcaption', 'img', 'a', 'p', 'h2', 'h3', 'span', 'div']) {
    if ((shapeA.counts[tag] || 0) !== (shapeB.counts[tag] || 0)) {
      fail(`${label}: <${tag}> count ${shapeA.counts[tag] || 0} -> ${shapeB.counts[tag] || 0}`);
    }
  }
  if (!same(idsOf(aRoots), idsOf(bRoots))) {
    fail(`${label}: ids changed\n      ${idsOf(aRoots).join(',')}\n      ${idsOf(bRoots).join(',')}`);
  }
  if (!same(hrefsOf(aRoots), hrefsOf(bRoots))) {
    fail(`${label}: links changed`);
    notes.push(`  ${label} baseline: ${hrefsOf(aRoots).join(' ')}`);
    notes.push(`  ${label} built:    ${hrefsOf(bRoots).join(' ')}`);
  }
  const imgA = imagesOf(aRoots);
  const imgB = imagesOf(bRoots);
  if (!same(imgA.map((i) => i.src), imgB.map((i) => i.src))) {
    fail(`${label}: image sources changed\n      ${imgA.map((i) => i.src).join(',')}\n      ${imgB.map((i) => i.src).join(',')}`);
  } else {
    // An inlined diagram must carry the original alt across as aria-label, or the
    // accessible name is lost with no visible symptom.
    imgA.forEach((a, i) => {
      const b = imgB[i];
      if ((a.alt || '') !== (b.alt || '')) {
        fail(`${label}: alt text for ${a.src} "${a.alt}" -> "${b.alt}"`);
      }
    });
  }
  const textA = textOf(aRoots);
  const textB = textOf(bRoots);
  if (textA !== textB) {
    fail(`${label}: text changed`);
    let i = 0;
    while (i < textA.length && textA[i] === textB[i]) i++;
    notes.push(
      `  ${label} diverges at char ${i}:\n      baseline …${textA.slice(Math.max(0, i - 50), i + 50)}…\n      built    …${textB.slice(Math.max(0, i - 50), i + 50)}…`,
    );
  }
}

// ============================================================ glossary =====

function entriesOf(src) {
  const doc = parseDoc(src);
  return elements(doc).filter(
    (n) =>
      (n.tagName === 'div' || n.tagName === 'article') &&
      (hasClass(n, 'entry') || hasClass(n, 'entryln')),
  );
}

function entryParts(entry) {
  const kids = childElements(entry);
  const heading = kids.find((k) => k.tagName === 'h2' && attr(k, 'id'));
  const alias = kids.find((k) => hasClass(k, 'short'));
  const anaLinks = kids.filter((k) => hasClass(k, 'ana-link'));
  const copy = kids.find((k) => hasClass(k, 'copylink'));
  const wrapper = kids.find((k) => hasClass(k, 'entry__body'));
  const bodyRoots = wrapper
    ? childElements(wrapper)
    : kids.filter((k) => ![heading, alias, copy, ...anaLinks].includes(k));
  return { heading, alias, anaLinks, copy, bodyRoots };
}

function verifyGlossary() {
  const baseSrc = baseline('index.html');
  const builtPath = join(OUT, 'index.html');
  if (!existsSync(builtPath)) {
    fail('missing _site/index.html — run "npm run build" first');
    return;
  }
  const builtSrc = readFileSync(builtPath, 'utf8');

  const base = entriesOf(baseSrc).filter(e => attr(entryParts(e).heading, 'id') !== 'capital-bitcoin');
  // Approved editorial and fact-check revisions; keep all other baseline checks.
  const revised = new Set([
    'bitcoin',
    'utxo',
    'nakamoto',
    'fee',
    'asym-crypto',
    'privkey',
    'pubkey',
    'passphrase',
    'blockchain',
    'reorg',
    'rbf',
    'segwit',
    'coinbase',
    'seed-words',
    'seed',
    'hd-wallet',
    'htlc',
    'vsize',
    'mining',
    'target',
    'block-header',
    'sfork',
    'mempool',
    'cpfp',
    'transaction',
    'wallet',
    'node',
    'pow',
    'block',
    'ln',
    'invoice',
    'taproot',
    'moscowtime',
    'address',
    'hash',
    'script',
    'utxo_join',
    'wu',
    'difficulty',
    'hfork',
    'lnurl',
    'lnaddress',
  ]);
  const built = entriesOf(builtSrc);
  if (base.length !== built.length) {
    fail(`entry count: baseline ${base.length}, built ${built.length}`);
  }

  const byId = (list) =>
    new Map(list.map((e) => [attr(entryParts(e).heading, 'id'), e]));
  const baseById = byId(base);
  const builtById = byId(built);

  const baseOrder = [...baseById.keys()];
  const builtOrder = [...builtById.keys()];
  for (const id of baseOrder) if (!builtById.has(id)) fail(`anchor #${id} missing from the build`);
  for (const id of builtOrder) if (!baseById.has(id)) fail(`anchor #${id} appeared out of nowhere`);
  if (!same(baseOrder, builtOrder)) fail('entry order changed');

  for (const id of baseOrder) {
    if (!builtById.has(id)) continue;
    const a = entryParts(baseById.get(id));
    const b = entryParts(builtById.get(id));
    const label = `#${id}`;

    const aCls = hasClass(baseById.get(id), 'entryln') ? 'entryln' : 'entry';
    const bCls = hasClass(builtById.get(id), 'entryln') ? 'entryln' : 'entry';
    if (aCls !== bCls) fail(`${label}: entry class ${aCls} -> ${bCls}`);
    if (id !== 'bitcoin' && attr(baseById.get(id), 'id') !== attr(builtById.get(id), 'id')) {
      fail(`${label}: wrapper id changed`);
    }
    if (textOf([a.heading]) !== textOf([b.heading])) fail(`${label}: term text changed`);
    const aliasA = a.alias ? textOf([a.alias]) : null;
    const aliasB = b.alias ? textOf([b.alias]) : null;
    if (aliasA !== aliasB) fail(`${label}: alias "${aliasA}" -> "${aliasB}"`);
    if (!b.copy) fail(`${label}: copylink button missing`);

    if (revised.has(id)) {
      // These editorial changes are intentional; verify their current HTML
      // sources survive rendering, while all other entries retain the git baseline.
      const source = readFileSync(`content/cs/${id}.md`, 'utf8').split(/^---\s*$/m).slice(2).join('---');
      const doc = parseDoc(`<html><body>${source}</body></html>`);
      const body = elements(doc).find(n => n.tagName === 'body');
      compareRegion(label, childElements(body), b.bodyRoots);
    } else compareRegion(label, a.bodyRoots, b.bodyRoots);
    if (!same(hrefsOf(a.anaLinks), hrefsOf(b.anaLinks))) {
      fail(`${label}: ana-link footer changed`);
    }
  }

  const unchanged = list => list.filter(e => !revised.has(attr(entryParts(e).heading, 'id')));
  compareEntities('unchanged glossary entries', sourceOf(baseSrc, unchanged(base)), sourceOf(builtSrc, unchanged(built)));
  if (!elements(parseDoc(builtSrc)).some(n => attr(n, 'id') === 'capital-bitcoin')) fail('legacy #capital-bitcoin anchor missing');
  return { baseCount: base.length, builtCount: built.length };
}

// ============================================================= anatomy =====

/** The layout adds furniture around the preserved body; exclude it. */
const isFurniture = (node) =>
  hasClass(node, 'crumbs') ||
  hasClass(node, 'reading-header') ||
  hasClass(node, 'pagefoot') ||
  (node.tagName === 'h1' && hasClass(node, 'visually-hidden'));

function containerOf(src) {
  const doc = parseDoc(src);
  return elements(doc).find((n) => hasClass(n, 'container2'));
}

// Anatomy pages with approved editorial and fact-check revisions.
const revisedPages = new Set([
  'block',
  'crypto',
  'lightning',
  'math',
  'taproot',
  'transaction',
  'wallet',
]);

function verifyAnatomy() {
  const slugs = readdirSync('pages')
    .filter((f) => f.endsWith('.njk'))
    .map((f) => f.replace(/\.njk$/, ''))
    .sort();

  for (const slug of slugs) {
    const label = `pages/${slug}.html`;
    let baseSrc;
    try {
      baseSrc = baseline(`pages/${slug}.html`);
    } catch {
      fail(`${label}: no baseline in git ${REF}`);
      continue;
    }
    const builtPath = join(OUT, 'pages', `${slug}.html`);
    if (!existsSync(builtPath)) {
      fail(`${label}: not produced by the build — the permalink must stay /pages/${slug}.html`);
      continue;
    }
    const builtSrc = readFileSync(builtPath, 'utf8');

    const baseContainer = containerOf(baseSrc);
    const builtContainer = containerOf(builtSrc);
    if (!baseContainer || !builtContainer) {
      fail(`${label}: could not locate div.container2 in ${!baseContainer ? 'baseline' : 'build'}`);
      continue;
    }

    const aRoots = childElements(baseContainer);
    const bRoots = childElements(builtContainer).filter((n) => !isFurniture(n));
    if (revisedPages.has(slug)) {
      // Approved fact-check revisions: verify the current template body survives
      // rendering unchanged instead of comparing against the git baseline.
      const source = readFileSync(`pages/${slug}.njk`, 'utf8').split(/^---\s*$/m).slice(2).join('---');
      const doc = parseDoc(`<html><body>${source}</body></html>`);
      const body = elements(doc).find((n) => n.tagName === 'body');
      compareRegion(label, childElements(body), bRoots);
      compareEntities(label, source, sourceOf(builtSrc, bRoots));
    } else {
      compareRegion(label, aRoots, bRoots);
      compareEntities(label, sourceOf(baseSrc, aRoots), sourceOf(builtSrc, bRoots));
    }

    // Head metadata must survive the move into frontmatter.
    for (const name of ['description', 'keywords']) {
      const read = (src) => {
        const el = elements(parseDoc(src)).find(
          (n) => n.tagName === 'meta' && (attr(n, 'name') === name || attr(n, 'property') === name),
        );
        return el ? attr(el, 'content').replace(/\s+/g, ' ').trim() : null;
      };
      // Revised pages are checked against their own frontmatter instead of the baseline.
      const fromFrontmatter = () => {
        const value = matter(readFileSync(`pages/${slug}.njk`, 'utf8')).data[name];
        return value == null ? null : String(value).replace(/\s+/g, ' ').trim();
      };
      const expected = revisedPages.has(slug) ? fromFrontmatter() : read(baseSrc);
      if (expected !== read(builtSrc)) {
        fail(`${label}: <meta ${name}> changed\n      ${expected}\n      ${read(builtSrc)}`);
      }
    }
    const titleOf = (src) => {
      const el = elements(parseDoc(src)).find((n) => n.tagName === 'title');
      return el ? textOf([el]) : null;
    };
    if (titleOf(baseSrc) !== titleOf(builtSrc)) {
      fail(`${label}: <title> "${titleOf(baseSrc)}" -> "${titleOf(builtSrc)}"`);
    }
  }
  return slugs.length;
}

// ============================================================== global =====

function verifyBuildOutput() {
  const builtDoc = parseDoc(readFileSync(join(OUT, 'index.html'), 'utf8'));
  const allIds = new Set(elements(builtDoc).map((n) => attr(n, 'id')).filter(Boolean));
  for (const el of elements(builtDoc)) {
    const href = attr(el, 'href');
    if (el.tagName === 'a' && href?.startsWith('#') && href.length > 1) {
      if (!allIds.has(decodeURIComponent(href.slice(1)))) fail(`dangling internal link ${href}`);
    }
  }

  // Every referenced local asset exists, across every built page.
  const pages = [join(OUT, 'index.html'), ...readdirSync(join(OUT, 'pages'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(OUT, 'pages', f))];
  for (const page of pages) {
    const doc = parseDoc(readFileSync(page, 'utf8'));
    for (const el of elements(doc)) {
      if (isDiagram(el)) continue;
      for (const name of ['src', 'href']) {
        const value = attr(el, name);
        if (!value?.startsWith('/') || value.startsWith('//')) continue;
        const target = join(OUT, decodeURIComponent(value.split('#')[0].split('?')[0]));
        if (!existsSync(target)) fail(`${page}: missing asset ${value}`);
      }
    }
  }

  for (const required of [
    'CNAME', 'functions.js', 'js/glossary.js', 'js/theme.js', 'js/diagram.js',
    'pages/javascript.js', 'pages/stuff/publickey.txt',
    'css/styles.css', 'css/tooltip.css', 'sitemap.xml', 'robots.txt',
  ]) {
    if (!existsSync(join(OUT, required))) fail(`build is missing ${required}`);
  }
  if (existsSync(join(OUT, 'content'))) fail('build emitted _site/content — permalink:false is not applied');
  const strayNjk = readdirSync(join(OUT, 'pages')).filter((f) => f.endsWith('.njk'));
  if (strayNjk.length) fail(`build leaked template sources: ${strayNjk.join(', ')}`);
}

// ---------------------------------------------------------------------------

const glossary = verifyGlossary();
const anatomyCount = verifyAnatomy();
verifyBuildOutput();

console.log(`baseline: git ${REF} (index.html + ${anatomyCount} anatomy pages)`);
if (glossary) console.log(`glossary: ${glossary.builtCount} entries compared`);

if (failures.length === 0) {
  console.log('\n✓ verified — anchors, structure, links, images, assets and text all match');
  process.exit(0);
}
console.log(`\n✗ ${failures.length} problem(s):\n`);
for (const f of failures) console.log(`  - ${f}`);
if (notes.length) {
  console.log('\ndetail:');
  for (const n of notes) console.log(n);
}
process.exit(1);
