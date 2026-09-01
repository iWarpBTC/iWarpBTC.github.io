import { parseFragment } from 'parse5';
import { TOPICS } from './tools/lib/topics.mjs';

export default function (eleventyConfig) {
  // Only .njk and .md are templates. Every .html in the repo — the eight anatomy
  // pages — is passthrough-copied verbatim so its hand-tuned hex dumps and
  // absolute URLs stay exactly as they are.
  eleventyConfig.setTemplateFormats(['njk', 'md']);

  // Eleventy copies nothing by default. functions.js and drop.js are referenced by
  // absolute URL from every anatomy page; if they are missing from the build the
  // price badge and the dropdowns break sitewide. CNAME missing drops the domain.
  for (const path of [
    'css',
    'js',
    'img',
    'pages',
    'python',
    'stuff',
    'temp',
    'diagram',
    'functions.js',
    'drop.js',
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
