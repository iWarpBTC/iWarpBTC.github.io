// Shared parse5 helpers. Everything here works off source-code locations so the
// original markup can be sliced verbatim — re-serialising a parse5 tree rewrites
// entities (&nbsp; -> U+00A0, &bdquo; -> „) and reflows attributes, which would
// silently alter every entry.
import { parse, parseFragment } from 'parse5';

export function parseDoc(src) {
  return parse(src, { sourceCodeLocationInfo: true });
}

export function parseFrag(src) {
  return parseFragment(src, { sourceCodeLocationInfo: true });
}

export function walk(node, fn) {
  if (node.tagName) fn(node);
  for (const child of node.childNodes || []) walk(child, fn);
}

export function elements(root) {
  const out = [];
  walk(root, (n) => out.push(n));
  return out;
}

export const attr = (node, name) =>
  node.attrs?.find((a) => a.name === name)?.value;

export const classes = (node) =>
  (attr(node, 'class') || '').split(/\s+/).filter(Boolean);

export const hasClass = (node, name) => classes(node).includes(name);

/** Element children only, in document order. */
export const childElements = (node) =>
  (node.childNodes || []).filter((c) => c.tagName);

/** Verbatim source of a node, including its own tags. */
export const outerSource = (src, node) =>
  src.slice(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset);

/** Verbatim source between a node's start and end tags. */
export function innerSource(src, node) {
  const loc = node.sourceCodeLocation;
  if (!loc.startTag || !loc.endTag) return outerSource(src, node);
  return src.slice(loc.startTag.endOffset, loc.endTag.startOffset);
}

/** Collapse whitespace and decode entities for text comparison. */
export function normalizedText(node) {
  let out = '';
  (function rec(n) {
    if (n.nodeName === '#text') out += n.value;
    for (const c of n.childNodes || []) rec(c);
  })(node);
  return out.replace(/\s+/g, ' ').trim();
}

export { parse, parseFragment };
