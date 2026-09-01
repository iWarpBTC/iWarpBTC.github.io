#!/usr/bin/env node
// One-shot migration: index.html -> content/cs/<id>.md
//
// Kept in the repo because the same script is what bootstraps content/en/ when an
// English edition is written. Run: node tools/extract-terms.mjs [--dry]
//
// Bodies are sliced verbatim out of the source (see tools/lib/html.mjs) so the
// typographic entities the site relies on — &nbsp; &bdquo; &hyphen; &ndash; — and
// Prettier's formatting survive the move byte for byte.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { dump } from 'js-yaml';
import {
  parseDoc, elements, attr, classes, hasClass, childElements,
  outerSource, innerSource,
} from './lib/html.mjs';
import { TERM_TOPIC } from './lib/topics.mjs';

const SITE = 'https://btc-slovnik.cz';
const SRC = 'index.html';
const OUT_DIR = 'content/cs';
const dry = process.argv.includes('--dry');

/**
 * Absolute self-links become relative:
 *   https://btc-slovnik.cz/#hash -> #hash   (bare fragment: resolves inside
 *     whatever page it renders on, so /en/ never bounces readers back to Czech)
 *   https://btc-slovnik.cz/x     -> /x      (assets, anatomy pages)
 * External URLs are left untouched.
 */
function relativize(html) {
  return html.split(`${SITE}/#`).join('#').split(`${SITE}/`).join('/');
}

/**
 * Remove the indentation the entry carried inside index.html. The first line is
 * excluded from the measurement: the slice begins at the node's start offset, so
 * it has already lost its own leading whitespace and would peg the minimum at 0.
 */
function dedent(text) {
  const lines = text.split('\n');
  const indents = lines
    .slice(1)
    .filter((l) => l.trim())
    .map((l) => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return [lines[0], ...lines.slice(1).map((l) => l.slice(min))].join('\n').trim();
}

const src = readFileSync(SRC, 'utf8');
const doc = parseDoc(src);

const entries = elements(doc).filter(
  (n) => n.tagName === 'div' && (hasClass(n, 'entry') || hasClass(n, 'entryln')),
);

if (entries.length !== 49) {
  throw new Error(`expected 49 entries, found ${entries.length}`);
}

const written = [];

entries.forEach((entry, i) => {
  const kids = childElements(entry);

  const termHeading = kids.find((k) => k.tagName === 'h2' && attr(k, 'id'));
  if (!termHeading) throw new Error(`entry ${i} has no h2 with an id`);
  const id = attr(termHeading, 'id');

  const shortHeading = kids.find((k) => k.tagName === 'h2' && hasClass(k, 'short'));
  const anaLinks = kids.filter((k) => hasClass(k, 'ana-link'));

  // Everything that is not the term heading, the copy button, the alias line or
  // an ana-link footer is body content.
  const skip = new Set([termHeading, shortHeading, ...anaLinks].filter(Boolean));
  skip.add(kids.find((k) => k.tagName === 'button' && hasClass(k, 'copylink')));
  const bodyNodes = kids.filter((k) => !skip.has(k));
  if (!bodyNodes.length) throw new Error(`entry #${id} has no body`);

  // Slice one continuous span from the first to the last body node so the
  // whitespace and formatting between siblings is preserved, then cut out any
  // ana-link that sits inside that span (only #nakamoto does).
  const start = bodyNodes[0].sourceCodeLocation.startOffset;
  const end = bodyNodes[bodyNodes.length - 1].sourceCodeLocation.endOffset;
  let body = '';
  let cursor = start;
  for (const link of anaLinks) {
    const loc = link.sourceCodeLocation;
    if (loc.startOffset > start && loc.endOffset < end) {
      body += src.slice(cursor, loc.startOffset);
      cursor = loc.endOffset;
    }
  }
  body += src.slice(cursor, end);

  const links = anaLinks.flatMap((wrapper) =>
    elements(wrapper)
      .filter((n) => n.tagName === 'a')
      .map((a) => ({
        text: innerSource(src, a).replace(/\s+/g, ' ').trim(),
        href: relativize(attr(a, 'href')),
      })),
  );

  const topic = TERM_TOPIC[id];
  if (!topic) throw new Error(`no topic assigned for #${id}`);

  const entryClass = hasClass(entry, 'entryln') ? 'entryln' : 'entry';
  const wrapperId = attr(entry, 'id') || null;

  const data = {
    id,
    term: innerSource(src, termHeading).trim(),
    short: shortHeading ? innerSource(src, shortHeading).trim() : null,
    order: i + 1,
    topic,
    entryClass,
    ...(wrapperId ? { injectId: wrapperId } : {}),
    ...(links.length ? { links } : {}),
  };

  const frontmatter = dump(data, { lineWidth: 100, noRefs: true }).trimEnd();
  const file = join(OUT_DIR, `${id}.md`);
  const contents = `---\n${frontmatter}\n---\n\n${dedent(relativize(body))}\n`;

  if (!dry) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, contents, 'utf8');
  }
  written.push({ id, file, order: i + 1, topic, entryClass, links: links.length });
});

console.log(`${dry ? 'would write' : 'wrote'} ${written.length} terms to ${OUT_DIR}/`);
console.log(`  entryln: ${written.filter((w) => w.entryClass === 'entryln').map((w) => w.id).join(', ')}`);
console.log(`  ana-links: ${written.reduce((n, w) => n + w.links, 0)}`);
