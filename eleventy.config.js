import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse, parseFragment } from 'parse5';
import { inlineSvg } from './tools/lib/inline-svg.mjs';
import { TOPICS } from './tools/lib/topics.mjs';

export default function (eleventyConfig) {
  // Glossary and anatomy sources are templates; anatomy permalinks retain .html URLs.
  eleventyConfig.setTemplateFormats(['njk', 'md']);

  // Eleventy copies nothing by default. functions.js is referenced by absolute URL
  // from every anatomy page; if it is missing from the build the price badge breaks
  // sitewide. CNAME missing drops the domain.
  for (const path of [
    'css',
    'js',
    'img',
    // NOT 'pages': its .njk files are templates. These two must still be
    // copied by hand — pages/javascript.js drives the hex-dump highlighting on
    // block and transaction, and would 404 silently if it were dropped.
    'pages/javascript.js',
    'pages/stuff',
    'python',
    'stuff',
    'temp',
    'diagram',
    'functions.js',
    'favicon.png',
    'CNAME',
    'LICENSE.txt',
    'robots.txt',
  ]) {
    eleventyConfig.addPassthroughCopy(path);
  }

  eleventyConfig.addCollection('terms', (api) =>
    api.getFilteredByTag('terms').sort((a, b) => a.data.order - b.data.order),
  );

  // Terms grouped by topic, in TOPICS order, for the "Podle témat" index.
  eleventyConfig.addCollection('termsByTopic', (api) => {
    const terms = api.getFilteredByTag('terms');
    return TOPICS.map((topic) => ({
      ...topic,
      terms: terms
        .filter((t) => t.data.topic === topic.id)
        .sort((a, b) => a.data.order - b.data.order),
    })).filter((group) => group.terms.length);
  });

  // Terms A-Z with Czech collation, so ch/č/ř/š/ž land where a Czech reader looks.
  eleventyConfig.addCollection('termsAlphabetical', (api) =>
    api
      .getFilteredByTag('terms')
      .slice()
      .sort((a, b) => a.data.term.localeCompare(b.data.term, 'cs')),
  );

  // A-Z buckets for the alphabetical index. Bucketing keeps Czech letters distinct
  // (Č, Ř, Š, Ž are their own letters) and localeCompare('cs') orders the buckets.
  eleventyConfig.addCollection('termsAlphabeticalGrouped', (api) => {
    const sorted = api
      .getFilteredByTag('terms')
      .slice()
      .sort((a, b) => a.data.term.localeCompare(b.data.term, 'cs'));
    const buckets = [];
    for (const term of sorted) {
      const letter = term.data.term.charAt(0).toLocaleUpperCase('cs');
      const last = buckets.at(-1);
      if (last && last.letter === letter) last.terms.push(term);
      else buckets.push({ letter, terms: [term] });
    }
    return buckets;
  });

  /**
   * Reverse of the 31 `ana-link`s: for each anatomy page, the glossary terms that
   * point at it. This is the navigation direction the site never had, and it needs
   * no new hand-maintained data. Sources are the frontmatter `links` plus any
   * /pages/*.html link written inline in a term body.
   */
  eleventyConfig.addCollection('anatomyBacklinks', (api) => {
    const map = {};
    // Keyed on the page, not the link: a third of the ana-links carry a fragment
    // (/pages/block.html#mining), and keying on the raw href would split each page
    // into two buckets and silently drop half its backlinks.
    const add = (href, term) => {
      const page = href.split('#')[0];
      const list = (map[page] ||= []);
      if (!list.some((t) => t.id === term.data.id)) {
        list.push({ id: term.data.id, term: term.data.term, order: term.data.order });
      }
    };
    for (const term of api.getFilteredByTag('terms')) {
      for (const link of term.data.links || []) {
        if (link.href?.startsWith('/pages/')) add(link.href, term);
      }
      const raw = typeof term.rawInput === 'string' ? term.rawInput : '';
      for (const match of raw.matchAll(/href="(\/pages\/[a-z]+\.html)(?:#[^"]*)?"/g)) {
        add(match[1], term);
      }
    }
    for (const href of Object.keys(map)) map[href].sort((a, b) => a.order - b.order);
    return map;
  });

  eleventyConfig.addGlobalData('topics', TOPICS);

  /**
   * Prefix a site-root path with the active language. Czech is served at the root
   * and is the fallback for anything not yet translated, so a future /en/ page can
   * link to a Czech-only anatomy page without producing a broken URL.
   * Args are explicit rather than pulled off the template context, so the filter
   * behaves identically in every template engine.
   */
  eleventyConfig.addFilter('localeUrl', (path, site, lang) => {
    if (!path || !path.startsWith('/')) return path;
    const entry = site?.languages?.find((l) => l.code === (lang || site?.lang));
    return `${entry?.prefix || ''}${path}`;
  });

  eleventyConfig.addFilter('absoluteUrl', (path, site) => {
    if (!path) return path;
    return path.startsWith('http') ? path : `${site?.url || ''}${path}`;
  });

  eleventyConfig.addFilter('czechPlural', (n, one, few, many) =>
    n === 1 ? one : n >= 2 && n <= 4 ? few : many,
  );

  /**
   * Decode an HTML fragment to plain text. Term names carry markup entities
   * (`soft&hyphen;fork`); dropping them into an attribute unescaped would have a
   * screen reader announce the entity source instead of the word.
   */
  eleventyConfig.addFilter('plain', (html) => {
    if (!html) return '';
    let out = '';
    (function rec(node) {
      if (node.nodeName === '#text') out += node.value;
      for (const child of node.childNodes || []) rec(child);
    })(parseFragment(String(html)));
    return out.replace(/\s+/g, ' ').trim();
  });

  eleventyConfig.addFilter('jsonify', (value) => JSON.stringify(value));

  /**
   * Inline every draw.io diagram into the page.
   *
   * A transform rather than a shortcode: it covers the glossary and the converted
   * anatomy pages with one implementation and needs no edits to the content files.
   * Runs on rendered HTML, so the <img> has already been produced by whichever
   * template wrote it.
   *
   * twitter.svg is excluded — it is a monochrome UI icon already handled by the
   * --icon-invert token, not a diagram.
   */
  const ICON_SVGS = new Set(['/img/twitter.svg']);
  // The maths glyph is set inline in a sentence, not presented as a figure, so it
  // gets the same colour mapping but inline-text sizing.
  const GLYPH_SVGS = new Set(['/img/zet.svg']);

  eleventyConfig.addTransform('inline-diagrams', function (content) {
    if (!(this.page?.outputPath || '').endsWith('.html')) return content;
    if (!content.includes('.svg')) return content;

    const doc = parse(content, { sourceCodeLocationInfo: true });
    const images = [];
    (function walk(node) {
      if (node.tagName === 'img') images.push(node);
      for (const child of node.childNodes || []) walk(child);
    })(doc);

    const attrOf = (node, name) => node.attrs?.find((a) => a.name === name)?.value;
    const replacements = [];

    for (const img of images) {
      const src = attrOf(img, 'src');
      if (!src?.startsWith('/img/') || !src.endsWith('.svg')) continue;
      if (ICON_SVGS.has(src)) continue;

      const file = join('img', src.slice('/img/'.length));
      if (!existsSync(file)) continue;

      replacements.push({
        start: img.sourceCodeLocation.startOffset,
        end: img.sourceCodeLocation.endOffset,
        html: inlineSvg(file, {
          src,
          alt: attrOf(img, 'alt') || '',
          className: GLYPH_SVGS.has(src) ? 'glyph' : 'diagram',
        }),
      });
    }

    if (!replacements.length) return content;

    // Splice back to front so earlier offsets stay valid.
    let out = content;
    for (const item of replacements.sort((a, b) => b.start - a.start)) {
      out = out.slice(0, item.start) + item.html + out.slice(item.end);
    }
    return out;
  });

  return {
    dir: {
      input: '.',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
}
