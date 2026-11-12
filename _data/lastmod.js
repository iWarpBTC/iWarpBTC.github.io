// Per-file last-modified dates for sitemap.xml, read from git history.
//
// CI must check out with fetch-depth: 0. In the default depth-1 clone
// `git log -1 -- <path>` returns nothing for every file, and every lastmod would
// silently collapse to the build date. We fall back to filesystem mtime and warn
// loudly rather than emitting a sitemap full of today's date.
import { execFileSync } from 'node:child_process';
import { statSync, existsSync } from 'node:fs';

function gitLog(args) {
  try {
    return execFileSync('git', ['log', ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function gitDate(path) {
  // --follow traces the .html -> .njk rename of the anatomy pages, so their dates
  // are not truncated to the conversion commit. Its pathspec rules are stricter
  // than plain log's, so fall back rather than losing the date.
  return (
    gitLog(['--follow', '-1', '--format=%cI', '--', path]) ||
    gitLog(['-1', '--format=%cI', '--', path]) ||
    null
  );
}

function isShallow() {
  try {
    return (
      execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim() === 'true'
    );
  } catch {
    return false;
  }
}

function dateFor(paths) {
  const dates = paths
    .filter((p) => existsSync(p))
    .map((p) => gitDate(p) || new Date(statSync(p).mtime).toISOString());
  if (!dates.length) return new Date().toISOString();
  return dates.sort().at(-1);
}

export default function () {
  if (isShallow()) {
    console.warn(
      '[lastmod] shallow clone detected — sitemap dates fall back to file mtime. ' +
        'Use actions/checkout with fetch-depth: 0.',
    );
  }

  const termFiles = ['content/cs'];
  return {
    '/': dateFor([...termFiles, 'index.njk', '_includes/layouts/base.njk']),
    '/pages/transaction.html': dateFor(['pages/transaction.njk']),
    '/pages/block.html': dateFor(['pages/block.njk']),
    '/pages/wallet.html': dateFor(['pages/wallet.njk']),
    '/pages/crypto.html': dateFor(['pages/crypto.njk']),
    '/pages/math.html': dateFor(['pages/math.njk']),
    '/pages/taproot.html': dateFor(['pages/taproot.njk']),
    '/pages/lightning.html': dateFor(['pages/lightning.njk']),
    '/pages/literature.html': dateFor(['pages/literature.njk']),
  };
}
